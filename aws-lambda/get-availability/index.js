/**
 * AWS Lambda Function : Récupère les disponibilités Google Calendar
 * Compatible avec API Gateway
 * Utilise FreeBusy API pour obtenir les créneaux disponibles
 */

const { google } = require('googleapis');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS" || event.requestContext?.http?.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const { dateFrom, dateTo } = JSON.parse(event.body || "{}");

    const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
    const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!GOOGLE_CALENDAR_ID || !GOOGLE_SERVICE_ACCOUNT_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Missing GOOGLE_CALENDAR_ID or GOOGLE_SERVICE_ACCOUNT_KEY",
        }),
      };
    }

    /* ===========================
       1️⃣ Build date range
    =========================== */
    const start = dateFrom || new Date().toISOString().split("T")[0];
    const end =
      dateTo ||
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    // Convertir en ISO datetime pour Google Calendar
    const startDateTime = new Date(start + 'T00:00:00+01:00').toISOString();
    const endDateTime = new Date(end + 'T23:59:59+01:00').toISOString();

    /* ===========================
       2️⃣ Setup Google Calendar Auth
    =========================== */
    const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    /* ===========================
       3️⃣ Fetch busy times via FreeBusy API
    =========================== */
    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDateTime,
        timeMax: endDateTime,
        timeZone: 'Africa/Tunis',
        items: [{ id: GOOGLE_CALENDAR_ID }],
      },
    });

    const busySlots = freeBusyResponse.data.calendars[GOOGLE_CALENDAR_ID]?.busy || [];

    /* ===========================
       4️⃣ Generate available slots
    =========================== */
    const availability = generateAvailableSlots(start, end, busySlots);

    /* ===========================
       ✅ Success - Format compatible with frontend
    =========================== */
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        eventTypeId: "google-calendar",
        availability: {
          slots: availability
        },
      }),
    };
  } catch (error) {
    console.error("❌ Google Calendar function error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
      }),
    };
  }
};

/**
 * Génère les créneaux disponibles en excluant les périodes occupées
 * @param {string} startDate - Date de début (YYYY-MM-DD)
 * @param {string} endDate - Date de fin (YYYY-MM-DD)
 * @param {Array} busySlots - Périodes occupées depuis FreeBusy API
 * @returns {Object} Slots disponibles par date
 */
function generateAvailableSlots(startDate, endDate, busySlots) {
  const slots = {};

  // Configuration des horaires de travail
  const WORKING_HOURS = {
    start: 8.5,  // 8:30 AM
    end: 15.5    // 3:30 PM
  };

  const APPOINTMENT_DURATION = 30; // minutes

  // Pauses déjeuner (en heures décimales)
  const LUNCH_BREAKS = {
    1: [{ start: 12.5, end: 13.5 }], // Lundi
    4: [{ start: 12.5, end: 13.5 }]  // Jeudi
  };

  // Convertir busy slots en tableau de périodes
  const busyPeriods = busySlots.map(slot => ({
    start: new Date(slot.start),
    end: new Date(slot.end)
  }));

  // Parcourir chaque jour dans la plage
  const currentDate = new Date(startDate + 'T00:00:00+01:00');
  const lastDate = new Date(endDate + 'T23:59:59+01:00');

  while (currentDate <= lastDate) {
    const dayOfWeek = currentDate.getDay(); // 0 = Dimanche, 1 = Lundi, etc.

    // Ignorer samedi (6) et dimanche (0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    const dateStr = currentDate.toISOString().split('T')[0];
    slots[dateStr] = [];

    // Générer les créneaux pour ce jour
    let currentTime = WORKING_HOURS.start;

    while (currentTime + (APPOINTMENT_DURATION / 60) <= WORKING_HOURS.end) {
      const slotStart = new Date(currentDate);
      slotStart.setHours(Math.floor(currentTime));
      slotStart.setMinutes((currentTime % 1) * 60);

      const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION * 60000);

      // Vérifier si le créneau est pendant la pause déjeuner
      const lunchBreaks = LUNCH_BREAKS[dayOfWeek] || [];
      const isDuringLunch = lunchBreaks.some(lunch => {
        return currentTime >= lunch.start && currentTime < lunch.end;
      });

      // Vérifier si le créneau est occupé
      const isBusy = busyPeriods.some(busy => {
        return slotStart < busy.end && slotEnd > busy.start;
      });

      // Ajouter le créneau s'il est disponible
      if (!isDuringLunch && !isBusy) {
        slots[dateStr].push({
          time: slotStart.toISOString()
        });
      }

      // Passer au créneau suivant
      currentTime += APPOINTMENT_DURATION / 60;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}
