/**
 * AWS Lambda Function : Crée une réservation sur Google Calendar
 * Compatible avec API Gateway
 * Utilise Events API pour créer des événements
 */

const { google } = require('googleapis');

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
        let formData = {};
        try {
            formData = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
        } catch (e) {
            console.error("❌ Failed to parse body:", event.body);
        }

        const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
        const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

        if (!GOOGLE_CALENDAR_ID || !GOOGLE_SERVICE_ACCOUNT_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: "Missing GOOGLE_CALENDAR_ID or GOOGLE_SERVICE_ACCOUNT_KEY"
                })
            };
        }

        /* ===========================
           1️⃣ Parse local time and convert to ISO
        =========================== */
        const localDateTime = new Date(`${formData.date}T${formData.time}:00+01:00`);

        // Format as ISO string for Google Calendar
        const start = localDateTime.toISOString();

        // Calculate end time (30 minutes later)
        const endDateTime = new Date(localDateTime.getTime() + 30 * 60000);
        const end = endDateTime.toISOString();

        /* ===========================
           2️⃣ Setup Google Calendar Auth
        =========================== */
        const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const calendar = google.calendar({ version: 'v3', auth });

        /* ===========================
           3️⃣ Build Google Calendar Event
        =========================== */
        const eventData = {
            summary: `Consultation - ${formData.name}`,
            description: buildEventDescription(formData),
            start: {
                dateTime: start,
                timeZone: 'Africa/Tunis',
            },
            end: {
                dateTime: end,
                timeZone: 'Africa/Tunis',
            },
            attendees: [
                { email: formData.email, displayName: formData.name }
            ],
            extendedProperties: {
                private: {
                    phone: formData.phone || '',
                    company: formData.company || '',
                    service: formData.service || '',
                    meetingType: formData.meetingType || '',
                    appointmentId: formData.appointmentId || '',
                }
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 1 jour avant
                    { method: 'email', minutes: 60 },       // 1 heure avant
                ],
            },
            // Notifications par email
            sendUpdates: 'all', // Envoie des emails aux participants
        };

        console.log("📤 Creating Google Calendar event:", JSON.stringify(eventData, null, 2));

        /* ===========================
           4️⃣ Create event via Google Calendar API
        =========================== */
        const response = await calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            requestBody: eventData,
            sendUpdates: 'all', // Envoie des notifications
        });

        console.log("✅ Event created:", response.data.id);

        /* ===========================
           5️⃣ Return success response (format compatible with frontend)
        =========================== */
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                booking: {
                    id: response.data.id,
                    uid: response.data.id,
                    htmlLink: response.data.htmlLink,
                    status: response.data.status,
                    created: response.data.created,
                    start: response.data.start,
                    end: response.data.end,
                },
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
                error: error.message,
                details: error.errors || []
            })
        };
    }
};

/**
 * Construit la description de l'événement avec toutes les informations
 * @param {Object} formData - Données du formulaire
 * @returns {string} Description formatée
 */
function buildEventDescription(formData) {
    const lines = [
        `📋 DÉTAILS DE LA CONSULTATION`,
        ``,
        `👤 Client: ${formData.name}`,
        `📧 Email: ${formData.email}`,
    ];

    if (formData.phone) {
        lines.push(`📞 Téléphone: ${formData.phone}`);
    }

    if (formData.company) {
        lines.push(`🏢 Entreprise: ${formData.company}`);
    }

    if (formData.service) {
        lines.push(`💼 Service: ${formData.service}`);
    }

    if (formData.meetingType) {
        lines.push(`🎯 Type de rendez-vous: ${formData.meetingType}`);
    }

    if (formData.message) {
        lines.push(``);
        lines.push(`💬 Message:`);
        lines.push(formData.message);
    }

    if (formData.appointmentId) {
        lines.push(``);
        lines.push(`🆔 ID Rendez-vous: ${formData.appointmentId}`);
    }

    lines.push(``);
    lines.push(`---`);
    lines.push(`📅 Réservation effectuée via cmsaccounting.tn`);

    return lines.join('\n');
}
