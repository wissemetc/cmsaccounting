// ===== CONFIGURATION ZOHO BOOKINGS - EXEMPLE =====
// Copiez ce fichier vers config.js et modifiez avec vos vraies informations
// Commande: cp js/config.example.js js/config.js

const ZOHO_CONFIG = {
    // ===== URL DE VOTRE PAGE ZOHO BOOKINGS =====
    // Remplacez par l'URL de votre page Zoho Bookings
    // Pour obtenir cette URL:
    // 1. Connectez-vous à https://www.zoho.com/bookings/
    // 2. Créez votre service
    // 3. Allez dans "Partager" pour obtenir votre URL
    // Exemple: https://calendar.zoho.com/book/cmsaccounting
    bookingsUrl: 'https://calendar.zoho.com/book/YOUR_BOOKING_PAGE',

    // ===== CONFIGURATION D'AFFICHAGE =====
    // Activer l'iframe intégré directement dans la page (true/false)
    enableIframe: true,

    // Couleurs personnalisées pour matcher votre design
    // IMPORTANT: Codes hex SANS le symbole #
    colors: {
        primary: '1e3a8a',    // Bleu marine professionnel
        accent: 'd97706',     // Or/Ambre sophistiqué
        background: 'ffffff'  // Blanc
    },

    // Langue de l'interface (fr, en, ar)
    locale: 'fr',

    // ===== INFORMATIONS DE CONTACT =====
    contact: {
        email: 'contact@cmsaccounting.tn',
        phone: '+216 53 810 911',
        address: 'Avenue Farhat Hached, Bouhajla Kairouan 3180'
    },

    // ===== CONFIGURATION API (Avancé - Nécessite Backend) =====
    // N'activez ceci QUE si vous avez un backend pour gérer OAuth
    api: {
        enabled: false,  // true pour activer l'API
        clientId: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
        redirectUri: 'https://cmsaccounting.tn/callback',
        scopes: [
            'ZohoCalendar.calendar.READ',
            'ZohoCalendar.event.CREATE',
            'ZohoBookings.availability.READ'
        ]
    }
};

// Export pour utilisation dans les autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZOHO_CONFIG;
}
