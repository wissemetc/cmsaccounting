/**
 * Netlify Function : Récupère les disponibilités Cal.com
 * Endpoint : /.netlify/functions/get-availability
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
        const { dateFrom, dateTo, eventTypeSlug } = JSON.parse(event.body || '{}');

        // Configuration Cal.com (à récupérer depuis les variables d'environnement)
        const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
        const CALCOM_USERNAME = process.env.CALCOM_USERNAME || 'mohamedshili';
        const CALCOM_EVENT_SLUG = eventTypeSlug || process.env.CALCOM_EVENT_SLUG || 'consultation-30min';

        if (!CALCOM_API_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'API key not configured',
                    message: 'Please set CALCOM_API_KEY in Netlify environment variables'
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
                    slug: CALCOM_EVENT_SLUG
                })
            };
        }

        // 2. Récupérer les disponibilités
        const params = new URLSearchParams({
            eventTypeId: eventType.id.toString(),
            dateFrom: dateFrom || new Date().toISOString().split('T')[0],
            dateTo: dateTo || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            timeZone: 'Africa/Tunis'
        });

        const availabilityResponse = await fetch(`https://api.cal.com/v1/availability?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CALCOM_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!availabilityResponse.ok) {
            throw new Error(`Availability API error: ${availabilityResponse.status}`);
        }

        const availabilityData = await availabilityResponse.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                eventTypeId: eventType.id,
                availability: availabilityData
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
