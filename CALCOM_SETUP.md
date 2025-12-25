# 📅 Configuration Cal.com avec Netlify Functions

## 🎯 Résumé

Votre site utilise maintenant **Cal.com** avec **Netlify Functions** (backend serverless) pour gérer les réservations en temps réel, avec synchronisation automatique vers votre calendrier Zoho.

**Architecture** :
```
Frontend → Netlify Functions → Cal.com API → Calendrier Zoho
```

**Avantages** :
- ✅ 100% gratuit (Netlify Functions inclus dans le plan gratuit)
- ✅ Pas de problème CORS (API appelée côté serveur)
- ✅ Aucun risque de double réservation
- ✅ Synchronisation temps réel avec tous les visiteurs
- ✅ Vraies disponibilités Cal.com affichées dans le calendrier
- ✅ Réservation en 1 clic (formulaire + booking Cal.com)
- ✅ Design de votre site conservé à 100%

---

## 🔧 Configuration en 4 étapes

### Étape 1 : Récupérer votre clé API Cal.com

1. Connectez-vous sur [cal.com](https://cal.com)
2. Allez dans **Settings** (roue dentée) → **Developer** → **API Keys**
3. Cliquez sur **"Create New API Key"**
4. Donnez un nom (ex: "CMS Website")
5. **Copiez la clé** générée (commence par `cal_live_...`)

⚠️ **ATTENTION** : Cette clé est secrète, ne la partagez JAMAIS publiquement !

### Étape 2 : Configurer les variables d'environnement Netlify

⚠️ **IMPORTANT** : NE mettez PAS votre clé API dans le code source !

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Sélectionnez votre site
3. Allez dans **Site settings** → **Environment variables**
4. Ajoutez les 3 variables suivantes :

| Variable | Valeur | Exemple |
|----------|--------|---------|
| `CALCOM_API_KEY` | Votre clé API Cal.com | `cal_live_92f0e4e18b01...` |
| `CALCOM_USERNAME` | Votre username Cal.com | `cmsaccounting.tn` |
| `CALCOM_EVENT_SLUG` | Le slug de votre event type | `30min` |

5. Cliquez sur **Save**
6. **Redéployez** votre site pour appliquer les variables

### Étape 3 : Vérifier la configuration locale (js/main.js)

Les variables dans `js/main.js` (lignes ~199-202) servent uniquement de référence :

```javascript
// Ces valeurs NE SONT PAS utilisées en production
// Les vraies valeurs sont dans les variables d'environnement Netlify
CALCOM_API_KEY: "cal_live_xxxxxxxxxxxxxxx",  // ⚠️ Placeholder seulement
CALCOM_USERNAME: "cmsaccounting.tn",         // ✅ Référence
CALCOM_EVENT_SLUG: "30min",                  // ✅ Référence
```

### Étape 4 : Vérifier les fichiers Netlify Functions

Assurez-vous que ces fichiers existent :

```
netlify/
├── functions/
│   ├── get-availability.js   ✅ Récupère les disponibilités Cal.com
│   └── create-booking.js      ✅ Crée les réservations Cal.com
└── netlify.toml               ✅ Configuration Netlify
```

Ces fichiers sont déjà configurés et ne nécessitent aucune modification.

---

## ✅ Comment ça fonctionne

### Architecture Netlify Functions :

**Backend serverless (gratuit avec Netlify)** :
- `get-availability.js` : Récupère les disponibilités Cal.com sans CORS
- `create-booking.js` : Crée les réservations sur Cal.com sans CORS
- Variables d'environnement sécurisées (clé API jamais exposée au client)

### Affichage dynamique des disponibilités :

Le calendrier affiche **uniquement les créneaux réellement disponibles sur Cal.com** :

1. **Chargement initial** : Netlify Function récupère vos disponibilités Cal.com pour les 3 prochains mois
2. **Pas de CORS** : L'API Cal.com est appelée côté serveur (Netlify Functions)
3. **Affichage intelligent** : Seuls les jours avec créneaux disponibles sont cliquables
4. **Créneaux en temps réel** : Les horaires affichés = vos disponibilités Cal.com exactes
5. **Fallback intelligent** : Si Cal.com indisponible, génération statique avec WORKING_HOURS

### Flux de réservation :

1. **Visiteur** : Voit votre calendrier avec uniquement VOS créneaux disponibles
2. **Jours disponibles** : Seuls les jours avec créneaux Cal.com sont en vert/cliquables
3. **Sélection horaire** : Choisit parmi les horaires que VOUS avez ouverts dans Cal.com
4. **Formulaire** : Remplit ses informations (nom, email, téléphone, etc.)
5. **Soumission** : Clique sur "Confirmer la demande de rendez-vous"
6. **Cal.com** : Crée automatiquement la réservation
7. **Synchronisation** : La réservation apparaît dans votre calendrier Zoho
8. **Emails** : Confirmation envoyée au client ET à vous
9. **Mise à jour** : Le créneau devient indisponible pour les autres visiteurs

### Synchronisation temps réel :

- ✅ **Vous ouvrez un créneau dans Cal.com** → Visible sur votre site dans la minute
- ✅ **Client A réserve 10h** → Créneau immédiatement bloqué sur Cal.com
- ✅ **Client B arrive 1 minute après** → Ne peut PAS réserver 10h (déjà pris)
- ✅ **Vous fermez un créneau dans Cal.com** → Disparaît automatiquement du site
- ✅ Tous les visiteurs voient les **mêmes créneaux disponibles en temps réel**

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

## 📝 Gestion des disponibilités

### Gérer vos horaires directement dans Cal.com :

**Tous vos horaires sont gérés dans Cal.com** - plus besoin de modifier le code !

1. **Connectez-vous sur** [cal.com](https://cal.com)
2. **Allez dans "Availability"** (Disponibilités)
3. **Configurez vos horaires** :
   - Jours de travail (ex: Lundi-Vendredi)
   - Heures de travail (ex: 8h30-17h30)
   - Pauses déjeuner (ex: 12h30-13h30)
   - Durée des consultations (ex: 30 min)
4. **Sauvegardez** → Les changements apparaissent automatiquement sur votre site !

### Exemple de configuration Cal.com :

```
Lundi    : 8h30 - 12h30, 13h30 - 17h30
Mardi    : 8h30 - 12h30, 13h30 - 17h30
Mercredi : 8h30 - 12h30, 13h30 - 17h30
Jeudi    : 8h30 - 12h00 (demi-journée)
Vendredi : 8h30 - 12h30, 13h30 - 17h30
Samedi   : Fermé
Dimanche : Fermé
```

### Bloquer des créneaux ponctuellement :

Dans Cal.com, allez dans **Calendar** → Cliquez sur un créneau → **"Block time"**

Aucun visiteur ne pourra réserver ce créneau sur votre site.

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

## 🚀 Déploiement sur Netlify

### Déploiement initial :

1. **Connectez votre dépôt Git à Netlify** :
   - Allez sur [app.netlify.com](https://app.netlify.com)
   - Cliquez sur "Add new site" → "Import an existing project"
   - Sélectionnez votre dépôt GitHub

2. **Configuration du build** :
   ```
   Build command: (laissez vide)
   Publish directory: .
   Functions directory: netlify/functions
   ```

3. **Configurez les variables d'environnement** (voir Étape 2 ci-dessus)

4. **Déployez** : Cliquez sur "Deploy site"

### Mise à jour après changement :

```bash
git add .
git commit -m "Update: Activation du calendrier dynamique Cal.com"
git push -u origin claude/free-booking-alternative-EurCo
```

Netlify redéploiera automatiquement votre site.

### Test en production :

1. **Ouvrez votre site** (https://votre-site.netlify.app)
2. **Vérifiez la console** (F12) : doit afficher "✅ Disponibilités Cal.com chargées"
3. **Sélectionnez une date** : seuls les créneaux Cal.com s'affichent
4. **Testez une réservation** : doit créer le booking sur Cal.com
5. **Vérifiez** : booking visible sur cal.com et dans Zoho Calendar

⚠️ **IMPORTANT** : Ne commitez JAMAIS votre vraie clé API dans Git !
Les variables d'environnement Netlify sont sécurisées et ne sont jamais exposées au client.

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
