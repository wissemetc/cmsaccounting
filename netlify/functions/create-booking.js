/**
 * Netlify Function : Crée une réservation sur Cal.com
 * Endpoint : /.netlify/functions/create-booking
 */

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const formData = JSON.parse(event.body || '{}');

        // Configuration Cal.com
        const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
        const CALCOM_EVENT_SLUG = process.env.CALCOM_EVENT_SLUG || 'consultation-30min';

        if (!CALCOM_API_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'API key not configured',
                    success: false
                })
            };
        }

        // 1. Récupérer l'ID de l'event type
        const eventTypesResponse = await fetch('https://api.cal.com/v1/event-types', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CALCOM_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!eventTypesResponse.ok) {
            throw new Error(`Cal.com API error: ${eventTypesResponse.status}`);
        }

        const eventTypesData = await eventTypesResponse.json();
        const eventType = eventTypesData.event_types?.find(et => et.slug === CALCOM_EVENT_SLUG);

        if (!eventType) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Event type not found',
                    success: false
                })
            };
        }

        // 2. Construire la date/heure ISO pour Cal.com
        const [year, month, day] = formData.date.split('-');
        const [hours, minutes] = formData.time.split(':');
        const startDateTime = new Date(year, month - 1, day, hours, minutes);
        const startISO = startDateTime.toISOString();

        // 3. Créer la réservation
        const bookingData = {
            eventTypeId: eventType.id,
            start: startISO,
            responses: {
                name: formData.name,
                email: formData.email,
                location: { optionValue: '', value: formData.meetingType || 'Présentiel' }
            },
            metadata: {
                phone: formData.phone,
                company: formData.company || '',
                service: formData.service,
                meetingType: formData.meetingType,
                message: formData.message || '',
                appointmentId: formData.appointmentId
            },
            timeZone: 'Africa/Tunis',
            language: 'fr'
        };

        console.log('Creating booking with data:', JSON.stringify(bookingData, null, 2));

        const bookingResponse = await fetch('https://api.cal.com/v1/bookings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CALCOM_API_KEY}`,
                'Content-Type': 'application/json',
                'cal-api-version': '2024-08-13'
            },
            body: JSON.stringify(bookingData)
        });

        const responseText = await bookingResponse.text();
        console.log('Cal.com response:', responseText);

        if (!bookingResponse.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { message: responseText };
            }

            return {
                statusCode: bookingResponse.status,
                headers,
                body: JSON.stringify({
                    error: 'Booking creation failed',
                    details: errorData,
                    success: false
                })
            };
        }

        const bookingResult = JSON.parse(responseText);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                booking: bookingResult,
                message: 'Réservation créée avec succès'
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message,
                success: false
            })
        };
    }
};
