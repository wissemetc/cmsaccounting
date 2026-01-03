/**
 * AWS Lambda Function : Crée une réservation sur Cal.com (API v1)
 * Compatible avec API Gateway
 */

exports.handler = async (event, context) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
    };

    // Preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        console.log("📥 Received event:", event.body);
        let formData = {}; try { formData = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {}; } catch (e) { console.error("❌ Failed to parse body:", event.body); }

        const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
        const EVENT_TYPE_ID = process.env.CALCOM_EVENT_TYPE_ID; // ← IMPORTANT

        if (!CALCOM_API_KEY || !EVENT_TYPE_ID) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: "Missing CALCOM_API_KEY or CALCOM_EVENT_TYPE_ID"
                })
            };
        }

        // 1️⃣ Construire start & end (local time format, not UTC)
        // Cal.com API expects times in the specified timezone, not UTC
        const startLocal = new Date(`${formData.date}T${formData.time}:00`);

        // Format as local ISO string (YYYY-MM-DDTHH:mm:ss) without 'Z' suffix
        const formatLocalDateTime = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        const start = formatLocalDateTime(startLocal);

        const endLocal = new Date(startLocal.getTime() + 30 * 60000); // 30 minutes
        const end = formatLocalDateTime(endLocal);

        // 2️⃣ Construire le payload Cal.com
        const bookingData = {
            eventTypeId: Number(EVENT_TYPE_ID),
            start,
            end,
            timeZone: "Africa/Tunis",
            language: "fr",
            noEmail: true, // Disable all email notifications

            responses: {
                name: formData.name,
                email: formData.email,
                location: {
                    value: "inPerson",
                    optionValue: ""
                }
            },

            metadata: {
                phone: formData.phone,
                company: formData.company || "",
                service: formData.service,
                meetingType: formData.meetingType,
                message: formData.message || "",
                appointmentId: formData.appointmentId
            }
        };

        console.log("📤 Sending booking:", JSON.stringify(bookingData, null, 2));

        // 3️⃣ Appel API Cal.com (API key dans l’URL)
        const url = `https://api.cal.com/v1/bookings?apiKey=${CALCOM_API_KEY}`;

        const bookingResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        });

        const responseText = await bookingResponse.text();
        console.log("📥 Cal.com response:", responseText);

        if (!bookingResponse.ok) {
            return {
                statusCode: bookingResponse.status,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: "Booking creation failed",
                    details: responseText
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
                message: "Réservation créée avec succès"
            })
        };

    } catch (error) {
        console.error("❌ Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
