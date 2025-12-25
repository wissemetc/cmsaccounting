# 🚀 Démarrage Rapide - Intégration Zoho Bookings

## ✅ Prérequis
- Compte Zoho Bookings (gratuit)
- Navigateur web moderne
- 10 minutes de votre temps

---

## 📋 Étape 1 : Créer votre compte Zoho Bookings

1. Allez sur **https://www.zoho.com/bookings/**
2. Cliquez sur **"S'inscrire gratuitement"** ou **"Sign up"**
3. Remplissez vos informations :
   - Email professionnel : `contact@cmsaccounting.tn`
   - Nom de l'entreprise : `CMS Accounting`
   - Région : Tunisie
4. Confirmez votre email

---

## 📅 Étape 2 : Configurer votre service

### 2.1 Créer un service

1. Dans le tableau de bord Zoho Bookings, cliquez sur **"Services"**
2. Cliquez sur **"+ Ajouter un service"**
3. Remplissez les informations :

```
Nom du service     : Consultation Comptable
Durée              : 30 minutes
Type               : Présentiel / Visioconférence / Téléphone
Prix               : Gratuit (ou votre tarif)
Description        : Consultation gratuite avec nos experts comptables
Couleur            : #1e3a8a (Bleu marine)
```

### 2.2 Configurer vos disponibilités

1. Allez dans **"Disponibilités"** ou **"Availability"**
2. Configurez vos horaires :

```
Lundi    : 08:30 - 17:30
Mardi    : 08:30 - 17:30
Mercredi : 08:30 - 17:30
Jeudi    : 08:30 - 17:30
Vendredi : 08:30 - 17:30
Samedi   : 08:30 - 12:30
Dimanche : Fermé
```

3. **Durée des créneaux** : 30 minutes
4. **Temps de préparation** : 15 minutes (entre chaque RDV)

---

## 🎨 Étape 3 : Personnaliser l'apparence

1. Allez dans **"Paramètres" > "Apparence"** ou **"Settings" > "Branding"**
2. Configurez les couleurs pour matcher votre site :

```css
Couleur primaire    : #1e3a8a  (Bleu marine)
Couleur secondaire  : #0ea5e9  (Bleu ciel)
Couleur accent      : #d97706  (Or/Ambre)
Police              : Inter (ou similaire)
```

3. **Téléchargez votre logo** :
   - Utilisez `assets/images/logo.svg` ou `logo-blanc.svg`
   - Format recommandé : PNG ou SVG
   - Dimensions : 200x200px minimum

---

## 🔗 Étape 4 : Obtenir votre URL de réservation

1. Dans Zoho Bookings, allez dans **"Partager"** ou **"Share"**
2. Copiez votre **URL de réservation**
   - Elle ressemble à : `https://calendar.zoho.com/book/cmsaccounting`
   - OU : `https://bookings.zoho.com/portal/cmsaccounting`

📋 **Notez cette URL**, vous en aurez besoin pour la prochaine étape !

---

## ⚙️ Étape 5 : Configurer votre site web

### 5.1 Modifier le fichier de configuration

1. Ouvrez le fichier **`js/config.js`**
2. Modifiez la ligne `bookingsUrl` :

```javascript
const ZOHO_CONFIG = {
    // REMPLACEZ ICI avec VOTRE URL Zoho Bookings
    bookingsUrl: 'https://calendar.zoho.com/book/cmsaccounting',

    // Activer l'iframe intégré
    enableIframe: true,

    // Couleurs (codes hex SANS le #)
    colors: {
        primary: '1e3a8a',    // Bleu marine
        accent: 'd97706',     // Or
        background: 'ffffff'  // Blanc
    },

    locale: 'fr',
};
```

3. **Sauvegardez** le fichier

### 5.2 Tester votre intégration

1. Ouvrez **`index.html`** dans votre navigateur
2. Allez sur la section **"Rendez-vous"**
3. Vous devriez voir :
   - ✅ Un bouton **"Ouvrir le calendrier de réservation"**
   - ✅ Un iframe avec le calendrier Zoho (si `enableIframe: true`)
   - ✅ Vos disponibilités affichées

---

## 🧪 Étape 6 : Tester une réservation

1. Sur votre site, section **"Rendez-vous"**
2. Cliquez sur un créneau disponible dans le calendrier
3. Remplissez vos informations
4. Confirmez la réservation
5. Vérifiez que vous recevez :
   - ✅ Email de confirmation
   - ✅ Le RDV apparaît dans votre calendrier Zoho

---

## 📧 Étape 7 : Configurer les notifications

1. Dans Zoho Bookings, **"Paramètres" > "Notifications"**
2. Activez les notifications pour :
   - ✅ Nouvelle réservation
   - ✅ Annulation
   - ✅ Rappel 24h avant
   - ✅ Rappel 1h avant

3. Personnalisez les templates d'email avec votre logo et signature

---

## 🔄 Étape 8 : Synchroniser avec votre calendrier

### Option 1 : Zoho Calendar (Recommandé)
1. Dans Zoho Bookings, **"Paramètres" > "Calendrier"**
2. Activez la synchronisation avec **Zoho Calendar**
3. Les RDV apparaîtront automatiquement

### Option 2 : Google Calendar
1. **"Paramètres" > "Intégrations" > "Google Calendar"**
2. Connectez votre compte Google
3. Synchronisation bidirectionnelle activée

### Option 3 : Outlook/Microsoft 365
1. **"Paramètres" > "Intégrations" > "Outlook"**
2. Connectez votre compte Microsoft
3. Synchronisation bidirectionnelle activée

---

## ✅ Checklist Finale

- [ ] Compte Zoho Bookings créé
- [ ] Service "Consultation Comptable" configuré (30 min)
- [ ] Disponibilités définies (Lun-Ven 8h30-17h30)
- [ ] Couleurs personnalisées (#1e3a8a, #d97706)
- [ ] Logo téléchargé
- [ ] URL de réservation obtenue
- [ ] `js/config.js` modifié avec votre URL
- [ ] Test de réservation effectué
- [ ] Notifications email activées
- [ ] Synchronisation calendrier activée
- [ ] Site déployé en production

---

## 🆘 Dépannage

### Le calendrier ne s'affiche pas ?

1. **Vérifiez la console du navigateur** (F12)
2. Cherchez les erreurs JavaScript
3. Vérifiez que `js/config.js` est bien chargé
4. Vérifiez que l'URL Zoho est correcte

### L'iframe est bloqué ?

1. Vérifiez les **paramètres de sécurité** de Zoho Bookings
2. Dans Zoho : **"Paramètres" > "Embed Settings"**
3. Activez **"Allow embedding"**

### Les couleurs ne correspondent pas ?

1. Vérifiez les codes couleur dans `js/config.js`
2. Les codes doivent être **SANS le #**
3. Exemple : `1e3a8a` et non `#1e3a8a`

---

## 📚 Ressources

- **Documentation Zoho Bookings** : https://help.zoho.com/bookings/
- **Guide complet d'intégration** : `INTEGRATION-ZOHO-REEL.md`
- **Support Zoho** : support@zoho.com
- **Votre support** : contact@cmsaccounting.tn

---

## 🎉 Félicitations !

Votre système de réservation en ligne est maintenant opérationnel !

Les clients peuvent désormais :
- ✅ Voir vos disponibilités en temps réel
- ✅ Réserver un RDV en quelques clics
- ✅ Recevoir une confirmation automatique
- ✅ Modifier ou annuler leur RDV

**Vous bénéficiez de :**
- ✅ Gestion automatique des RDV
- ✅ Synchronisation avec votre calendrier
- ✅ Notifications automatiques
- ✅ Réduction du temps administratif

---

**Besoin d'aide ?** Consultez `INTEGRATION-ZOHO-REEL.md` pour plus de détails ! 🚀
