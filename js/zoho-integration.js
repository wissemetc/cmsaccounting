/**
 * ===== INTÉGRATION ZOHO BOOKINGS RÉELLE =====
 * Ce fichier gère l'intégration complète avec Zoho Bookings
 * pour la prise de rendez-vous en ligne
 */

/**
 * Initialise l'intégration Zoho Calendar au chargement de la page
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation Zoho Bookings...');

    // Vérifier si la configuration existe
    if (typeof ZOHO_CONFIG === 'undefined') {
        console.error('❌ Configuration Zoho manquante. Veuillez charger js/config.js');
        showConfigurationError();
        return;
    }

    // Vérifier si l'URL Zoho est configurée
    if (!ZOHO_CONFIG.bookingsUrl || ZOHO_CONFIG.bookingsUrl.includes('YOUR_BOOKING_PAGE')) {
        console.warn('⚠️ URL Zoho Bookings non configurée');
        showConfigurationWarning();
        return;
    }

    // Initialiser l'intégration
    if (ZOHO_CONFIG.enableIframe) {
        console.log('📅 Intégration iframe Zoho Bookings activée');
        setupZohoIframe();
    }

    // Ajouter le bouton de réservation
    addZohoBookingButton();

    console.log('✅ Zoho Bookings initialisé avec succès');
});

/**
 * Intègre l'iframe Zoho Bookings directement dans le calendrier
 */
function setupZohoIframe() {
    const calendarWidget = document.querySelector('.calendar-widget');
    if (!calendarWidget) {
        console.warn('⚠️ Widget calendrier non trouvé');
        return;
    }

    // Construire l'URL avec les paramètres de couleur
    const iframeUrl = buildZohoUrl();

    // Créer le conteneur de l'iframe
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'zoho-iframe-container';
    iframeContainer.style.cssText = `
        width: 100%;
        margin-top: 20px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    // Créer l'iframe
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.cssText = `
        width: 100%;
        height: 700px;
        border: none;
    `;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('title', 'Réservation Zoho Bookings');

    // Ajouter un écouteur pour les événements de l'iframe
    iframe.addEventListener('load', function() {
        console.log('✅ Iframe Zoho chargé');
    });

    iframe.addEventListener('error', function() {
        console.error('❌ Erreur de chargement iframe Zoho');
        showIframeError(iframeContainer);
    });

    iframeContainer.appendChild(iframe);

    // Masquer le calendrier natif et afficher l'iframe
    const calendarHeader = calendarWidget.querySelector('.calendar-header');
    const calendarGrid = calendarWidget.querySelector('.calendar-grid');
    const timeSelection = document.getElementById('timeSelection');

    if (calendarGrid) calendarGrid.style.display = 'none';
    if (timeSelection) timeSelection.style.display = 'none';

    // Insérer l'iframe après le header
    if (calendarHeader) {
        calendarHeader.insertAdjacentElement('afterend', iframeContainer);
    } else {
        calendarWidget.insertBefore(iframeContainer, calendarWidget.firstChild);
    }
}

/**
 * Construit l'URL Zoho avec les paramètres de couleur
 */
function buildZohoUrl() {
    let url = ZOHO_CONFIG.bookingsUrl;

    // Ajouter les paramètres embed et couleurs
    const params = new URLSearchParams({
        embed: 'true',
        color: ZOHO_CONFIG.colors.primary,
        locale: ZOHO_CONFIG.locale || 'fr'
    });

    return `${url}?${params.toString()}`;
}

/**
 * Ajoute un bouton pour ouvrir Zoho Bookings dans une nouvelle fenêtre
 */
function addZohoBookingButton() {
    const sectionTitle = document.querySelector('#rendezvous .section-title');
    if (!sectionTitle) return;

    // Vérifier si le bouton existe déjà
    if (document.querySelector('.zoho-booking-btn')) return;

    // Créer le bouton
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'text-align: center; margin-top: 1.5rem;';

    const bookingButton = document.createElement('button');
    bookingButton.className = 'btn btn-accent zoho-booking-btn';
    bookingButton.innerHTML = `
        <i class="fas fa-calendar-check"></i>
        Ouvrir le calendrier de réservation
    `;
    bookingButton.style.cssText = `
        padding: 15px 30px;
        font-size: 16px;
        font-weight: 600;
    `;

    // Ajouter l'événement click
    bookingButton.addEventListener('click', function() {
        openZohoBookings();
    });

    buttonContainer.appendChild(bookingButton);
    sectionTitle.appendChild(buttonContainer);
}

/**
 * Ouvre Zoho Bookings dans une nouvelle fenêtre
 */
function openZohoBookings() {
    const url = buildZohoUrl();
    const width = Math.min(900, window.innerWidth - 40);
    const height = Math.min(700, window.innerHeight - 40);
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
        url,
        'ZohoBookings',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
}

/**
 * Affiche un message d'erreur de configuration
 */
function showConfigurationError() {
    const calendarWidget = document.querySelector('.calendar-widget');
    if (!calendarWidget) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'zoho-config-error';
    errorDiv.style.cssText = `
        padding: 2rem;
        background: #fee;
        border: 2px solid #fcc;
        border-radius: 12px;
        text-align: center;
        color: #c00;
    `;
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3>Configuration manquante</h3>
        <p>Le fichier <code>js/config.js</code> n'est pas chargé.</p>
        <p>Veuillez vérifier que le fichier est bien importé dans index.html</p>
    `;

    calendarWidget.innerHTML = '';
    calendarWidget.appendChild(errorDiv);
}

/**
 * Affiche un avertissement de configuration
 */
function showConfigurationWarning() {
    const calendarWidget = document.querySelector('.calendar-widget');
    if (!calendarWidget) return;

    const warningDiv = document.createElement('div');
    warningDiv.className = 'zoho-config-warning';
    warningDiv.style.cssText = `
        padding: 2rem;
        background: #fffbeb;
        border: 2px solid #fbbf24;
        border-radius: 12px;
        text-align: center;
        color: #92400e;
    `;
    warningDiv.innerHTML = `
        <i class="fas fa-info-circle" style="font-size: 3rem; margin-bottom: 1rem; color: #f59e0b;"></i>
        <h3>Configuration Zoho Bookings requise</h3>
        <p><strong>Pour activer les réservations en ligne :</strong></p>
        <ol style="text-align: left; max-width: 500px; margin: 1rem auto;">
            <li>Créez un compte sur <a href="https://www.zoho.com/bookings/" target="_blank" style="color: #1e3a8a; font-weight: 600;">Zoho Bookings</a></li>
            <li>Configurez vos services et disponibilités</li>
            <li>Obtenez votre URL de réservation</li>
            <li>Modifiez <code>js/config.js</code> et ajoutez votre URL</li>
        </ol>
        <p style="margin-top: 1rem;">
            <a href="INTEGRATION-ZOHO-REEL.md" style="color: #1e3a8a; font-weight: 600;">
                📖 Consultez le guide complet d'intégration
            </a>
        </p>
    `;

    // Insérer avant le calendrier
    const calendarHeader = calendarWidget.querySelector('.calendar-header');
    if (calendarHeader) {
        calendarHeader.insertAdjacentElement('afterend', warningDiv);
    }
}

/**
 * Affiche une erreur de chargement de l'iframe
 */
function showIframeError(container) {
    container.innerHTML = `
        <div style="padding: 2rem; text-align: center; background: #fee; border-radius: 12px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #c00;"></i>
            <h4 style="margin: 1rem 0; color: #c00;">Erreur de chargement</h4>
            <p>Impossible de charger le calendrier Zoho Bookings.</p>
            <p>Vérifiez que l'URL configurée est correcte.</p>
            <button onclick="location.reload()" class="btn btn-accent" style="margin-top: 1rem;">
                <i class="fas fa-sync"></i> Recharger la page
            </button>
        </div>
    `;
}

/**
 * ===== FONCTIONS UTILITAIRES =====
 */

/**
 * Vérifie si Zoho Bookings est correctement configuré
 */
function isZohoConfigured() {
    return (
        typeof ZOHO_CONFIG !== 'undefined' &&
        ZOHO_CONFIG.bookingsUrl &&
        !ZOHO_CONFIG.bookingsUrl.includes('YOUR_BOOKING_PAGE')
    );
}

/**
 * Récupère la configuration Zoho
 */
function getZohoConfig() {
    return typeof ZOHO_CONFIG !== 'undefined' ? ZOHO_CONFIG : null;
}

// Export pour utilisation externe
window.ZohoBookings = {
    isConfigured: isZohoConfigured,
    getConfig: getZohoConfig,
    open: openZohoBookings
};

console.log('📅 Module Zoho Bookings chargé');
