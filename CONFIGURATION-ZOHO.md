# 📅 Guide de Configuration Zoho Calendar

Ce guide vous explique comment intégrer votre calendrier Zoho professionnel avec le site CMS Comptable.

## 🎯 Options d'Intégration

### ✅ OPTION 1: Zoho Bookings (Recommandé pour Frontend-Only)

**Avantages:**
- ✨ Aucun backend nécessaire
- 🚀 Installation rapide (5 minutes)
- 💼 Interface professionnelle
- 📧 Notifications automatiques
- 🔄 Synchronisation automatique avec votre calendrier

**Étapes de Configuration:**

1. **Créer un compte Zoho Bookings**
   - Allez sur https://www.zoho.com/bookings/
   - Créez un compte ou connectez-vous avec votre compte Zoho existant

2. **Configurer votre service**
   - Cliquez sur "Services" dans le menu
   - Créez un nouveau service: "Consultation Comptable"
   - Durée: 30 minutes
   - Prix: Gratuit (ou selon votre tarif)
   - Description: Ajoutez une description de votre service

3. **Définir vos disponibilités**
   - Allez dans "Disponibilités"
   - Configurez vos horaires de travail:
     - Lundi à Vendredi: 8h30 - 17h30
     - Samedi: 8h30 - 12h30
     - Dimanche: Fermé
   - Ajoutez des pauses si nécessaire

4. **Personnaliser votre page de réservation**
   - Allez dans "Paramètres" > "Page de réservation"
   - Personnalisez les couleurs (utilisez #1e3a8a pour le bleu principal)
   - Ajoutez votre logo
   - Configurez les champs du formulaire

5. **Obtenir votre lien de réservation**
   - Allez dans "Partager" ou "Intégration"
   - Copiez votre URL de réservation (ex: https://calendar.zoho.com/book/votrenompersonnalise)

6. **Configurer le site web**
   - Ouvrez le fichier `js/zoho-integration.js`
   - Ligne 7, remplacez `'VOTRE_URL_ZOHO_BOOKINGS'` par votre URL
   - Exemple:
   ```javascript
   const ZOHO_CONFIG = {
       bookingsUrl: 'https://calendar.zoho.com/book/cmscomptable',
   };
   ```

7. **Synchroniser avec votre calendrier Zoho**
   - Dans Zoho Bookings, allez dans "Paramètres" > "Calendrier"
   - Activez la synchronisation avec votre Zoho Calendar professionnel
   - Les rendez-vous apparaîtront automatiquement dans votre calendrier

---

### OPTION 2: Zoho Calendar avec iframe

**Pour afficher votre calendrier directement:**

1. Connectez-vous à Zoho Calendar
2. Allez dans "Paramètres" > "Partage et Intégration"
3. Sélectionnez "Intégrer le calendrier"
4. Générez le code iframe
5. Copiez l'URL de l'iframe
6. Dans `js/zoho-integration.js`, mettez à jour la fonction `setupZohoIframe()`:
   ```javascript
   iframe.src = 'VOTRE_URL_IFRAME_ZOHO_CALENDAR';
   ```

---

### ⚙️ OPTION 3: API Zoho Calendar (Avancé - Nécessite Backend)

**⚠️ Cette option nécessite un serveur backend car elle requiert OAuth 2.0**

Si vous souhaitez utiliser l'API Zoho Calendar pour une intégration personnalisée:

1. **Créer une application Zoho**
   - Allez sur https://api-console.zoho.com/
   - Créez une nouvelle application "Server-based Application"
   - Notez votre Client ID et Client Secret

2. **Configurer OAuth 2.0**
   - Définissez les redirect URIs
   - Configurez les scopes nécessaires:
     - `ZohoCalendar.calendar.READ`
     - `ZohoCalendar.event.CREATE`
     - `ZohoCalendar.event.UPDATE`

3. **Créer un backend**
   - Node.js, Python, PHP, etc.
   - Gérer le flux OAuth 2.0
   - Stocker et rafraîchir les tokens
   - Créer des endpoints API pour votre frontend

4. **Intégrer avec le frontend**
   - Appeler votre API backend depuis `zoho-integration.js`
   - Utiliser les fonctions `getAvailableSlots()` et `createAppointment()`

---

## 🎨 Personnalisation Visuelle

Pour que Zoho Bookings corresponde au design de votre site:

**Couleurs à utiliser dans Zoho Bookings:**
- Couleur principale: `#1e3a8a` (Bleu marine professionnel)
- Couleur secondaire: `#0ea5e9` (Bleu ciel)
- Couleur accent: `#d97706` (Or/Ambre)

**Dans les paramètres Zoho Bookings:**
1. Allez dans "Personnalisation" > "Apparence"
2. Appliquez les couleurs ci-dessus
3. Téléchargez votre logo (format PNG, fond transparent recommandé)
4. Choisissez la police "Inter" si disponible (ou une police similaire)

---

## 📧 Configuration des Notifications

1. **Dans Zoho Bookings:**
   - Allez dans "Paramètres" > "Notifications"
   - Activez les notifications par email pour:
     - Nouvelle réservation
     - Annulation
     - Rappel (24h avant)

2. **Personnaliser les emails:**
   - Modifiez les templates d'email
   - Ajoutez votre logo et vos coordonnées
   - Personnalisez les messages

---

## ✅ Vérification de l'Installation

Après la configuration:

1. Ouvrez votre site web
2. Allez sur la section "Rendez-vous"
3. Vous devriez voir:
   - Le formulaire de contact existant
   - Un bouton "Réserver un RDV avec Zoho Calendar" OU
   - L'iframe Zoho Bookings intégré

4. Testez une réservation:
   - Cliquez sur le bouton ou utilisez l'iframe
   - Sélectionnez un créneau
   - Remplissez les informations
   - Vérifiez que le RDV apparaît dans votre calendrier Zoho

---

## 🔧 Dépannage

**Le bouton n'apparaît pas:**
- Vérifiez que `ZOHO_CONFIG.bookingsUrl` est bien configuré dans `js/zoho-integration.js`
- Ouvrez la console du navigateur (F12) pour voir les erreurs

**L'iframe ne se charge pas:**
- Vérifiez que l'URL est correcte
- Assurez-vous que la page Zoho Bookings est publique
- Vérifiez les paramètres CORS de Zoho

**Les rendez-vous n'apparaissent pas dans votre calendrier:**
- Vérifiez la synchronisation dans les paramètres Zoho Bookings
- Allez dans "Paramètres" > "Calendrier" et activez la synchronisation

---

## 📱 Support

Pour toute question sur:
- **Zoho Bookings/Calendar**: https://help.zoho.com/
- **Ce site web**: contact@cmscomptable.tn

---

## 🚀 Prochaines Étapes

1. Configurez Zoho Bookings selon ce guide
2. Testez l'intégration
3. Partagez le lien de votre site avec vos clients
4. Gérez vos rendez-vous depuis votre calendrier Zoho

Bonne utilisation ! 🎉
