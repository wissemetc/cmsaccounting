/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║            INTÉGRATION CAL.COM - SYSTÈME DE RÉSERVATION          ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 *
 * Ce fichier intègre Cal.com via le widget embed (pas d'API nécessaire)
 * pour la prise de rendez-vous en ligne avec synchronisation temps réel.
 *
 * Configuration requise :
 * - CALCOM_USERNAME : Votre username Cal.com
 * - CALCOM_EVENT_SLUG : Le slug de votre type d'événement
 *
 * Avantages :
 * ✅ 100% gratuit (aucune API key nécessaire)
 * ✅ Aucun risque de double réservation
 * ✅ Synchronisation temps réel automatique
 * ✅ Emails automatiques
 * ✅ Pas de problème CORS
 */

/**
 * Initialise l'intégration Cal.com via le bouton/lien
 * Cette méthode ouvre Cal.com dans une popup ou redirige vers Cal.com
 */
function initCalcomIntegration() {
    console.log('🚀 Initialisation intégration Cal.com (mode widget)...');

    // Charger le script Cal.com embed
    if (!document.querySelector('script[src*="cal.com/embed"]')) {
        const script = document.createElement('script');
        script.src = 'https://cal.com/embed/embed.js';
        script.async = true;
        document.head.appendChild(script);
        console.log('✅ Script Cal.com embed chargé');
    }
}

/**
 * Ouvre Cal.com avec les informations du formulaire pré-remplies
 * @param {Object} formData - Données du formulaire
 */
function openCalcomBooking(formData) {
    // Construire l'URL Cal.com avec paramètres pré-remplis
    const calcomUrl = `https://cal.com/${APPOINTMENT_CONFIG.CALCOM_USERNAME}/${APPOINTMENT_CONFIG.CALCOM_EVENT_SLUG}`;

    const params = new URLSearchParams({
        name: formData.name || '',
        email: formData.email || '',
        notes: `Service: ${formData.service}\nType: ${formData.meetingType}\nEntreprise: ${formData.company || 'Non spécifié'}\nMessage: ${formData.message || ''}`
    });

    const fullUrl = `${calcomUrl}?${params.toString()}`;

    console.log('📅 Ouverture Cal.com:', fullUrl);

    // Option 1 : Ouvrir dans une popup
    const popup = window.open(fullUrl, 'cal-booking', 'width=800,height=800,scrollbars=yes');

    if (!popup) {
        // Si popup bloquée, rediriger dans le même onglet
        window.location.href = fullUrl;
    }

    return true;
}

/**
 * Fonction factice pour compatibilité avec le code existant
 * Retourne un succès immédiat car Cal.com gère la réservation
 */
async function createCalcomBooking(formData) {
    console.log('📅 Ouverture de Cal.com pour réservation...');

    // Ouvrir Cal.com avec les données pré-remplies
    openCalcomBooking(formData);

    // Retourner un succès factice (la vraie réservation se fait sur Cal.com)
    return {
        success: true,
        message: 'Redirection vers Cal.com pour finaliser la réservation',
        method: 'widget'
    };
}

/**
 * Fonction factice pour compatibilité
 * Les disponibilités sont gérées directement par Cal.com
 */
async function getCalcomAvailability(dateFrom, dateTo) {
    console.log('ℹ️ Les disponibilités sont gérées par Cal.com directement');
    return null;
}

/**
 * Fonction factice pour compatibilité
 */
async function getCalcomEventTypeId() {
    return null;
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
    window.openCalcomBooking = openCalcomBooking;
}

