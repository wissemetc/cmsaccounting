/**
 * ===== INTÉGRATION ZOHO CALENDAR =====
 * Ce fichier gère l'intégration avec Zoho Calendar/Bookings
 * pour la prise de rendez-vous en ligne
 */

// Configuration Zoho Calendar
const ZOHO_CONFIG = {
    // À configurer avec vos informations Zoho
    organizationId: 'VOTRE_ORG_ID', // Remplacez par votre Organization ID
    serviceId: 'VOTRE_SERVICE_ID',   // Remplacez par votre Service ID
    apiEndpoint: 'https://calendar.zoho.com/api/v1',
    bookingsUrl: 'https://calendar.zoho.com/book/YOUR_BOOKING_PAGE', // URL de votre page de réservation Zoho
};

/**
 * Initialise l'intégration Zoho Calendar
 */
function initZohoIntegration() {
    console.log('Initialisation de l\'intégration Zoho Calendar...');

    // Option 1: Intégrer avec iframe (recommandé pour simplicité)
    setupZohoIframe();

    // Option 2: Intégrer avec l'API (pour une personnalisation complète)
    // setupZohoAPI();

    // Ajouter un bouton pour ouvrir Zoho Bookings
    addZohoBookingButton();
}

/**
 * Configure l'iframe Zoho Bookings
 */
function setupZohoIframe() {
    const appointmentSection = document.querySelector('#rendezvous');
    if (!appointmentSection) return;

    // Créer un conteneur pour l'iframe Zoho
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'zoho-calendar-container';
    iframeContainer.style.cssText = `
        margin-top: 30px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    // Créer l'iframe
    const iframe = document.createElement('iframe');
    iframe.src = ZOHO_CONFIG.bookingsUrl;
    iframe.style.cssText = `
        width: 100%;
        height: 600px;
        border: none;
        border-radius: 8px;
    `;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');

    iframeContainer.appendChild(iframe);

    // Insérer l'iframe après le formulaire existant
    const formContainer = appointmentSection.querySelector('.form-container');
    if (formContainer && formContainer.parentNode) {
        formContainer.parentNode.insertBefore(iframeContainer, formContainer.nextSibling);
    }
}

/**
 * Ajoute un bouton pour ouvrir Zoho Bookings dans une nouvelle fenêtre
 */
function addZohoBookingButton() {
    const appointmentSection = document.querySelector('#rendezvous');
    if (!appointmentSection) return;

    // Créer le bouton
    const bookingButton = document.createElement('button');
    bookingButton.className = 'btn btn-primary zoho-booking-btn';
    bookingButton.innerHTML = `
        <i class="fas fa-calendar-check"></i>
        Réserver un RDV avec Zoho Calendar
    `;
    bookingButton.style.cssText = `
        margin-top: 20px;
        padding: 15px 30px;
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 20px auto;
    `;

    // Ajouter l'événement click
    bookingButton.addEventListener('click', function() {
        window.open(ZOHO_CONFIG.bookingsUrl, '_blank', 'width=800,height=600');
    });

    // Effet hover
    bookingButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 10px 20px rgba(30, 58, 138, 0.3)';
    });

    bookingButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });

    // Insérer le bouton
    const sectionTitle = appointmentSection.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.appendChild(bookingButton);
    }
}

/**
 * Configuration de l'API Zoho pour synchronisation avancée
 * Cette fonction nécessite un backend pour gérer l'authentification OAuth
 */
async function setupZohoAPI() {
    console.log('Configuration API Zoho - Nécessite un backend pour OAuth');

    // Note: L'intégration complète de l'API Zoho nécessite:
    // 1. Un backend pour gérer l'authentification OAuth 2.0
    // 2. Des tokens d'accès sécurisés
    // 3. La gestion du refresh des tokens

    // Pour un site frontend-only, utilisez l'iframe ou le bouton de réservation
    console.warn('Pour un site frontend-only, utilisez l\'iframe Zoho Bookings');
}

/**
 * Fonction pour obtenir les créneaux disponibles depuis Zoho
 * (Nécessite une authentification backend)
 */
async function getAvailableSlots(date) {
    // Cette fonction nécessiterait un backend pour gérer l'authentification
    console.warn('getAvailableSlots nécessite un backend pour l\'authentification OAuth');
    return [];
}

/**
 * Fonction pour créer un rendez-vous dans Zoho Calendar
 * (Nécessite une authentification backend)
 */
async function createAppointment(appointmentData) {
    // Cette fonction nécessiterait un backend pour gérer l'authentification
    console.warn('createAppointment nécessite un backend pour l\'authentification OAuth');
    return null;
}

/**
 * Alternative: Intégration avec Zoho Forms
 * Plus simple que l'API Calendar pour un site frontend-only
 */
function setupZohoForms() {
    // Vous pouvez créer un formulaire Zoho Forms et l'intégrer ici
    // https://www.zoho.com/forms/

    const zohoFormUrl = 'VOTRE_URL_ZOHO_FORMS'; // Remplacez par votre URL Zoho Forms

    const iframe = document.createElement('iframe');
    iframe.src = zohoFormUrl;
    iframe.style.cssText = `
        width: 100%;
        height: 700px;
        border: none;
        border-radius: 8px;
    `;

    const appointmentSection = document.querySelector('#rendezvous');
    if (appointmentSection) {
        appointmentSection.appendChild(iframe);
    }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si la configuration Zoho est définie
    if (ZOHO_CONFIG.bookingsUrl && ZOHO_CONFIG.bookingsUrl !== 'https://calendar.zoho.com/book/YOUR_BOOKING_PAGE') {
        initZohoIntegration();
    } else {
        console.warn('⚠️ Configuration Zoho manquante. Veuillez configurer ZOHO_CONFIG dans zoho-integration.js');
        console.info('Pour configurer Zoho Bookings:');
        console.info('1. Créez un compte Zoho Calendar/Bookings');
        console.info('2. Configurez votre page de réservation');
        console.info('3. Récupérez l\'URL de votre page de réservation');
        console.info('4. Mettez à jour ZOHO_CONFIG.bookingsUrl dans ce fichier');
    }
});

/**
 * ===== GUIDE DE CONFIGURATION ZOHO CALENDAR =====
 *
 * Pour intégrer votre calendrier Zoho professionnel:
 *
 * OPTION 1: Zoho Bookings (Recommandé - Frontend Only)
 * ----------------------------------------------------
 * 1. Allez sur https://www.zoho.com/bookings/
 * 2. Créez un compte ou connectez-vous
 * 3. Configurez vos services et disponibilités
 * 4. Obtenez le lien de votre page de réservation
 * 5. Mettez à jour ZOHO_CONFIG.bookingsUrl avec ce lien
 *
 * OPTION 2: Zoho Calendar avec iframe
 * ------------------------------------
 * 1. Connectez-vous à Zoho Calendar
 * 2. Allez dans Paramètres > Partage
 * 3. Générez un lien d'intégration iframe
 * 4. Utilisez ce lien dans setupZohoIframe()
 *
 * OPTION 3: API Zoho Calendar (Nécessite un backend)
 * ---------------------------------------------------
 * 1. Créez une application dans Zoho Developer Console
 * 2. Configurez OAuth 2.0
 * 3. Créez un backend pour gérer l'authentification
 * 4. Utilisez les endpoints de l'API Calendar
 *
 * Pour un site frontend-only, utilisez l'OPTION 1 (Zoho Bookings)
 */
