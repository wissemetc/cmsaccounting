/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║            INTÉGRATION CAL.COM VIA NETLIFY FUNCTIONS             ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 *
 * Ce fichier intègre Cal.com via des fonctions serverless Netlify
 * pour éviter les problèmes CORS et gérer l'API Cal.com côté serveur.
 *
 * Architecture :
 * Frontend → Netlify Functions → API Cal.com → Calendrier Zoho
 *
 * Avantages :
 * ✅ 100% gratuit (Netlify Functions inclus)
 * ✅ Pas de problème CORS
 * ✅ API Cal.com appelée côté serveur
 * ✅ Vraies disponibilités en temps réel
 * ✅ Réservation en 1 clic
 */

/**
 * Récupère les disponibilités Cal.com via Netlify Function
 * @param {string} dateFrom - Date de début (YYYY-MM-DD)
 * @param {string} dateTo - Date de fin (YYYY-MM-DD)
 * @returns {Promise<Object>} Les disponibilités
 */
async function getCalcomAvailability(dateFrom, dateTo) {
    try {
        console.log(`📅 Récupération disponibilités du ${dateFrom} au ${dateTo}...`);

        const response = await fetch(API_CONFIG.GET_AVAILABILITY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dateFrom,
                dateTo
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la récupération des disponibilités');
        }

        const data = await response.json();
        console.log('✅ Disponibilités récupérées:', data);

        return data.availability;

    } catch (error) {
        console.error('❌ Erreur récupération disponibilités:', error);
        return null;
    }
}

/**
 * Crée une réservation sur Cal.com via Netlify Function
 * @param {Object} formData - Données du formulaire
 * @returns {Promise<Object>} La réservation créée
 */
async function createCalcomBooking(formData) {
    try {
        console.log('📅 Création de la réservation Cal.com...');

        const response = await fetch(API_CONFIG.CREATE_BOOKING_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erreur lors de la création de la réservation');
        }

        console.log('✅ Réservation Cal.com créée:', data);
        return data.booking;

    } catch (error) {
        console.error('❌ Erreur création réservation:', error);
        throw error;
    }
}

/**
 * Fonction factice pour compatibilité
 */
async function getCalcomEventTypeId() {
    // Cette fonction n'est plus nécessaire car gérée côté serveur
    return null;
}

/**
 * Initialise l'intégration Cal.com
 */
function initCalcomIntegration() {
    console.log('🚀 Initialisation intégration Cal.com (via Netlify Functions)...');
    console.log('✅ Backend serverless configuré');
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


