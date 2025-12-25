/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║            INTÉGRATION CAL.COM - SYSTÈME DE RÉSERVATION          ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 *
 * Ce fichier remplace l'intégration Zoho Calendar par Cal.com
 * pour la prise de rendez-vous en ligne avec synchronisation temps réel.
 *
 * Configuration requise :
 * - CALCOM_API_KEY : Clé API Cal.com (à configurer dans js/main.js)
 * - CALCOM_USERNAME : Votre username Cal.com
 * - CALCOM_EVENT_SLUG : Le slug de votre type d'événement
 *
 * Avantages :
 * ✅ 100% gratuit (plan gratuit Cal.com)
 * ✅ Aucun risque de double réservation
 * ✅ Synchronisation temps réel
 * ✅ Emails automatiques
 * ✅ Intégration transparente avec l'UI existant
 */

// Cache pour l'ID du type d'événement
let cachedEventTypeId = null;

/**
 * Récupère l'ID du type d'événement Cal.com
 * @returns {Promise<number>} L'ID du type d'événement
 */
async function getCalcomEventTypeId() {
    if (cachedEventTypeId) {
        return cachedEventTypeId;
    }

    try {
        const response = await fetch(`${APPOINTMENT_CONFIG.CALCOM_API_URL}/event-types`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${APPOINTMENT_CONFIG.CALCOM_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur API Cal.com: ${response.status}`);
        }

        const data = await response.json();
        const eventType = data.event_types?.find(et => et.slug === APPOINTMENT_CONFIG.CALCOM_EVENT_SLUG);

        if (!eventType) {
            throw new Error(`Event type "${APPOINTMENT_CONFIG.CALCOM_EVENT_SLUG}" introuvable`);
        }

        cachedEventTypeId = eventType.id;
        console.log('✅ Event Type ID récupéré:', eventType.id);
        return eventType.id;
    } catch (error) {
        console.error('❌ Erreur récupération Event Type ID:', error);
        throw error;
    }
}

/**
 * Crée une réservation sur Cal.com
 * @param {Object} formData - Les données du formulaire
 * @returns {Promise<Object>} La réservation créée
 */
async function createCalcomBooking(formData) {
    try {
        const eventTypeId = await getCalcomEventTypeId();

        // Construire la date/heure ISO pour Cal.com
        const [year, month, day] = formData.date.split('-');
        const [hours, minutes] = formData.time.split(':');
        const startDateTime = new Date(year, month - 1, day, hours, minutes);
        const startISO = startDateTime.toISOString();

        const bookingData = {
            eventTypeId: eventTypeId,
            start: startISO,
            responses: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                notes: `Service: ${formData.service}\nType: ${formData.meetingType}\nEntreprise: ${formData.company || 'Non spécifié'}\nMessage: ${formData.message || 'Aucun message'}`
            },
            timeZone: "Africa/Tunis",
            language: "fr",
            metadata: {
                service: formData.service,
                meetingType: formData.meetingType,
                company: formData.company || '',
                appointmentId: formData.appointmentId
            }
        };

        console.log('📅 Création réservation Cal.com...', bookingData);

        const response = await fetch(`${APPOINTMENT_CONFIG.CALCOM_API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${APPOINTMENT_CONFIG.CALCOM_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur création réservation: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        console.log('✅ Réservation Cal.com créée:', result);
        return result;

    } catch (error) {
        console.error('❌ Erreur création réservation Cal.com:', error);
        throw error;
    }
}

/**
 * Récupère les disponibilités depuis Cal.com
 * @param {string} dateFrom - Date de début (ISO)
 * @param {string} dateTo - Date de fin (ISO)
 * @returns {Promise<Object>} Les disponibilités
 */
async function getCalcomAvailability(dateFrom, dateTo) {
    try {
        const eventTypeId = await getCalcomEventTypeId();

        const params = new URLSearchParams({
            eventTypeId: eventTypeId,
            dateFrom: dateFrom,
            dateTo: dateTo,
            timeZone: 'Africa/Tunis'
        });

        const response = await fetch(`${APPOINTMENT_CONFIG.CALCOM_API_URL}/availability?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${APPOINTMENT_CONFIG.CALCOM_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur récupération disponibilités: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Disponibilités Cal.com récupérées');
        return data;
    } catch (error) {
        console.error('❌ Erreur récupération disponibilités Cal.com:', error);
        return null;
    }
}

/**
 * Initialise l'intégration Cal.com
 * Appelé automatiquement au chargement de la page
 */
function initCalcomIntegration() {
    console.log('🚀 Initialisation intégration Cal.com...');

    // Vérifier la configuration
    if (!APPOINTMENT_CONFIG.CALCOM_API_KEY || APPOINTMENT_CONFIG.CALCOM_API_KEY === 'cal_live_xxxxxxxxxxxxxxx') {
        console.warn('⚠️ ATTENTION: La clé API Cal.com n\'est pas configurée !');
        console.warn('⚠️ Veuillez remplacer CALCOM_API_KEY dans js/main.js');
        return;
    }

    console.log('✅ Configuration Cal.com détectée');
    console.log(`   Username: ${APPOINTMENT_CONFIG.CALCOM_USERNAME}`);
    console.log(`   Event slug: ${APPOINTMENT_CONFIG.CALCOM_EVENT_SLUG}`);
}

// Initialiser Cal.com au chargement de la page
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCalcomIntegration);
    } else {
        initCalcomIntegration();
    }
}

// Exporter les fonctions pour utilisation dans main.js
if (typeof window !== 'undefined') {
    window.getCalcomEventTypeId = getCalcomEventTypeId;
    window.createCalcomBooking = createCalcomBooking;
    window.getCalcomAvailability = getCalcomAvailability;
}
