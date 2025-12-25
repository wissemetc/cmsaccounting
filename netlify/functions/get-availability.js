/**
 * Netlify Function : Récupère les disponibilités Cal.com (API v1)
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
    const { dateFrom, dateTo } = JSON.parse(event.body || "{}");

    const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
    const EVENT_TYPE_ID = process.env.CALCOM_EVENT_TYPE_ID;

    if (!CALCOM_API_KEY || !EVENT_TYPE_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Missing CALCOM_API_KEY or CALCOM_EVENT_TYPE_ID",
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

    /* ===========================
       2️⃣ Fetch availability (API v1)
    =========================== */
    const url = `https://api.cal.com/v1/slots?apiKey=${CALCOM_API_KEY}&eventTypeId=${EVENT_TYPE_ID}&startTime=${start}&endTime=${end}`;

    const availabilityRes = await fetch(url);

    if (!availabilityRes.ok) {
      const text = await availabilityRes.text();
      throw new Error(`Availability error ${availabilityRes.status}: ${text}`);
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
        eventTypeId: EVENT_TYPE_ID,
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
