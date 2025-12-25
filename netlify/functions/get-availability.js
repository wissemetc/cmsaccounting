/**
 * Netlify Function : Récupère les disponibilités Cal.com (API v2)
 * Endpoint : /.netlify/functions/get-availability
 */

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const { dateFrom, dateTo, eventTypeSlug } = JSON.parse(event.body || "{}");

    const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
    const CALCOM_EVENT_SLUG =
      eventTypeSlug || process.env.CALCOM_EVENT_SLUG || "consultation-30min";

    if (!CALCOM_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "CALCOM_API_KEY not configured",
        }),
      };
    }

    const calHeaders = {
      Authorization: `Bearer ${CALCOM_API_KEY}`,
      "Content-Type": "application/json",
    };

    /* ===========================
       1️⃣ Fetch event types (v2)
    =========================== */
    const eventTypesRes = await fetch(
      "https://api.cal.com/v2/event-types",
      { headers: calHeaders }
    );

    if (!eventTypesRes.ok) {
      const text = await eventTypesRes.text();
      throw new Error(
        `Event types error ${eventTypesRes.status}: ${text}`
      );
    }

    const eventTypesJson = await eventTypesRes.json();

    // v2 returns { eventTypes: [...] }
    const eventTypes = eventTypesJson.eventTypes || [];
    const eventType = eventTypes.find(
      (et) => et.slug === CALCOM_EVENT_SLUG
    );

    if (!eventType) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Event type not found",
          requestedSlug: CALCOM_EVENT_SLUG,
          availableSlugs: eventTypes.map((e) => e.slug),
        }),
      };
    }

    /* ===========================
       2️⃣ Fetch availability (v2)
    =========================== */
    const params = new URLSearchParams({
      eventTypeId: eventType.id.toString(),
      startTime:
        dateFrom ||
        new Date().toISOString(),
      endTime:
        dateTo ||
        new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ).toISOString(),
      timeZone: "Africa/Tunis",
    });

    const availabilityRes = await fetch(
      `https://api.cal.com/v2/availability?${params}`,
      { headers: calHeaders }
    );

    if (!availabilityRes.ok) {
      const text = await availabilityRes.text();
      throw new Error(
        `Availability error ${availabilityRes.status}: ${text}`
      );
    }

    const availabilityData = await availabilityRes.json();

    /* ===========================
       ✅ Success
    =========================== */
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        eventType: {
          id: eventType.id,
          slug: eventType.slug,
          title: eventType.title,
          length: eventType.length,
        },
        availability: availabilityData,
      }),
    };
  } catch (error) {
    console.error("❌ Cal.com function error:", error);

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
