# 📅 Configuration Cal.com - Système de Réservation

## 🎯 Résumé

Votre site utilise maintenant **Cal.com** pour gérer les réservations en temps réel, avec synchronisation automatique vers votre calendrier Zoho.

**Avantages** :
- ✅ 100% gratuit (plan gratuit Cal.com)
- ✅ Aucun risque de double réservation
- ✅ Synchronisation temps réel avec tous les visiteurs
- ✅ Emails de confirmation automatiques
- ✅ Design de votre site conservé à 100%
- ✅ Intégration transparente

---

## 🔧 Configuration en 3 étapes

### Étape 1 : Récupérer votre clé API Cal.com

1. Connectez-vous sur [cal.com](https://cal.com)
2. Allez dans **Settings** (roue dentée) → **Developer** → **API Keys**
3. Cliquez sur **"Create New API Key"**
4. Donnez un nom (ex: "CMS Website")
5. **Copiez la clé** générée (commence par `cal_live_...`)

⚠️ **ATTENTION** : Cette clé est secrète, ne la partagez jamais publiquement !

### Étape 2 : Configurer le fichier js/main.js

Ouvrez `js/main.js` et cherchez la ligne **~199** :

```javascript
CALCOM_API_KEY: "cal_live_xxxxxxxxxxxxxxx", // ⚠️ REMPLACEZ PAR VOTRE VRAIE CLÉ API
```

**Remplacez** `cal_live_xxxxxxxxxxxxxxx` par votre vraie clé API.

### Étape 3 : Vérifier les paramètres

Vérifiez que les paramètres suivants sont corrects (lignes ~200-202) :

```javascript
CALCOM_USERNAME: "mohamedshili",          // Votre username Cal.com
CALCOM_EVENT_SLUG: "consultation-30min",  // Le slug de votre event type
CALCOM_API_URL: "https://api.cal.com/v1"  // URL de l'API (ne pas modifier)
```

**Comment vérifier** :
- Username : visible dans l'URL de votre profil Cal.com (`cal.com/VOTRE-USERNAME`)
- Event slug : visible dans l'URL de votre event type (`cal.com/username/EVENT-SLUG`)

---

## ✅ Comment ça fonctionne

### Flux de réservation :

1. **Visiteur** : Voit votre calendrier avec le design actuel
2. **Sélection** : Choisit une date et un créneau disponible
3. **Formulaire** : Remplit ses informations (nom, email, téléphone, etc.)
4. **Soumission** : Clique sur "Confirmer la demande de rendez-vous"
5. **Cal.com** : Crée automatiquement la réservation
6. **Synchronisation** : La réservation apparaît dans votre calendrier Zoho
7. **Emails** : Confirmation envoyée au client ET à vous
8. **Protection** : Le créneau devient indisponible pour les autres visiteurs

### Synchronisation temps réel :

- ✅ Client A réserve 10h → Créneau immédiatement bloqué
- ✅ Client B arrive 1 minute après → Ne peut PAS réserver 10h
- ✅ Aucun risque de double réservation
- ✅ Tous les visiteurs voient les mêmes créneaux disponibles

---

## 📁 Structure du projet

```
cmsaccounting/
├── index.html                    # Page principale (HTML pur)
├── js/
│   ├── main.js                   # Logique principale + configuration Cal.com
│   └── zoho-integration.js       # Fonctions Cal.com API
├── css/
│   └── style.css                 # Styles du site
├── assets/
│   └── images/                   # Images et logos
└── CALCOM_SETUP.md              # Ce fichier
```

**Fichiers modifiés** :
- `js/main.js` : Configuration APPOINTMENT_CONFIG avec paramètres Cal.com
- `js/zoho-integration.js` : Fonctions Cal.com (createCalcomBooking, getCalcomEventTypeId, etc.)

---

## 🔍 Vérification de l'intégration

### Test de fonctionnement :

1. Ouvrez votre site en **navigation privée**
2. Allez à la section "Prendre Rendez-vous"
3. Sélectionnez une date et un créneau
4. Remplissez le formulaire
5. Cliquez sur "Confirmer"
6. **Vérifiez** :
   - Console du navigateur (F12) : doit afficher "✅ Réservation Cal.com créée"
   - Email de confirmation reçu
   - Réservation visible sur cal.com
   - Réservation visible dans votre calendrier Zoho

### En cas d'erreur :

**Erreur "⚠️ ATTENTION: La clé API Cal.com n'est pas configurée !"**
→ Vous n'avez pas remplacé la clé API dans js/main.js

**Erreur "Erreur API Cal.com: 401"**
→ Votre clé API est incorrecte ou expirée. Régénérez-la.

**Erreur "Event type introuvable"**
→ Le slug de l'event type est incorrect. Vérifiez sur cal.com.

**Erreur "Impossible de créer la réservation"**
→ Le créneau n'est peut-être plus disponible. Actualisez la page.

---

## 📝 Personnalisation

### Modifier les horaires de travail :

Dans `js/main.js`, ligne ~186 :

```javascript
WORKING_HOURS: {
    start: 8.5,   // 8h30
    end: 15.5     // 15h30
},
```

### Modifier les créneaux toujours occupés :

Ligne ~189 :

```javascript
ALWAYS_BUSY: {
    1: [{ start: 12.5, end: 13.5 }],  // Lundi 12h30-13h30
    4: [{ start: 12.5, end: 13.5 }]   // Jeudi 12h30-13h30
},
```

**Format** : `0 = Dimanche, 1 = Lundi, ..., 6 = Samedi`

### Modifier la durée des rendez-vous :

Ligne ~184 :

```javascript
APPOINTMENT_DURATION: 30,  // 30 minutes
```

---

## 🆘 Support

### Documentation Cal.com :
- API Documentation : https://cal.com/docs/api-reference
- Event Types : https://cal.com/docs/core-features/event-types
- Integrations : https://cal.com/docs/integrations

### En cas de problème :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les messages d'erreur
3. Vérifiez que votre clé API est correcte
4. Vérifiez que votre event type existe sur cal.com
5. Vérifiez que le plan gratuit Cal.com est actif

---

## 🚀 Déploiement

Une fois la configuration terminée :

1. **Testez localement** en ouvrant index.html dans le navigateur
2. **Vérifiez** que les réservations sont créées sur cal.com
3. **Déployez** sur votre serveur de production
4. **Testez en production** avec une vraie réservation

⚠️ **IMPORTANT** : Ne commitez JAMAIS votre vraie clé API dans un dépôt public !

Si vous utilisez Git :
- Remplacez la clé par un placeholder avant de commit
- Utilisez des variables d'environnement en production
- Ou configurez la clé directement sur le serveur

---

## 🎨 UI conservée

**Aucune modification visuelle** n'a été apportée à votre site :
- ✅ Même design du calendrier
- ✅ Même formulaire de réservation
- ✅ Mêmes couleurs et styles
- ✅ Même expérience utilisateur

**Seul le backend a changé** :
- ❌ Avant : localStorage (risque de double réservation)
- ✅ Maintenant : Cal.com (synchronisation temps réel)

---

## ✨ Félicitations !

Votre système de réservation est maintenant **professionnel**, **gratuit** et **sans risque de double réservation** ! 🎉

Pour toute question, consultez la documentation Cal.com ou ouvrez une issue sur le projet.
