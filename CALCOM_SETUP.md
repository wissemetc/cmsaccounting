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

### Étape 2 : Configurer le fichier index.html

Ouvrez `index.html` et cherchez la ligne **~4400** :

```javascript
CALCOM_API_KEY: "cal_live_xxxxxxxxxxxxxxx", // ⚠️ REMPLACEZ PAR VOTRE VRAIE CLÉ API
```

**Remplacez** `cal_live_xxxxxxxxxxxxxxx` par votre vraie clé API.

### Étape 3 : Vérifier les paramètres

Vérifiez que les paramètres suivants sont corrects (lignes ~4401-4402) :

```javascript
CALCOM_USERNAME: "mohamedshili",          // Votre username Cal.com
CALCOM_EVENT_SLUG: "consultation-30min",  // Le slug de votre event type
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

## 🔍 Vérification de l'intégration

### Test de fonctionnement :

1. Ouvrez votre site en **navigation privée**
2. Allez à la section "Prendre Rendez-vous"
3. Sélectionnez une date et un créneau
4. Remplissez le formulaire
5. Cliquez sur "Confirmer"
6. **Vérifiez** :
   - Console du navigateur : doit afficher "✅ Réservation Cal.com créée"
   - Email de confirmation reçu
   - Réservation visible sur cal.com
   - Réservation visible dans votre calendrier Zoho

### En cas d'erreur :

**Erreur "Erreur API Cal.com: 401"**
→ Votre clé API est incorrecte ou expirée. Régénérez-la.

**Erreur "Event type introuvable"**
→ Le slug de l'event type est incorrect. Vérifiez sur cal.com.

**Erreur "Erreur création réservation"**
→ Le créneau n'est peut-être plus disponible. Actualisez la page.

---

## 📝 Personnalisation

### Modifier les horaires de travail :

Dans `index.html`, ligne ~4386 :

```javascript
WORKING_HOURS: {
    start: 8.5,   // 8h30
    end: 15.5     // 15h30
},
```

### Modifier les créneaux toujours occupés :

Ligne ~4390 :

```javascript
ALWAYS_BUSY: {
    1: [{ start: 12.5, end: 13.5 }],  // Lundi 12h30-13h30
    4: [{ start: 12.5, end: 13.5 }]   // Jeudi 12h30-13h30
},
```

**Format** : `0 = Dimanche, 1 = Lundi, ..., 6 = Samedi`

---

## 🆘 Support

### Documentation Cal.com :
- API Documentation : https://cal.com/docs/api-reference
- Event Types : https://cal.com/docs/core-features/event-types
- Integrations : https://cal.com/docs/integrations

### En cas de problème :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez que votre clé API est correcte
3. Vérifiez que votre event type existe sur cal.com
4. Vérifiez que le plan gratuit Cal.com est actif

---

## 🚀 Déploiement

Une fois la configuration terminée :

1. **Testez localement** avec un fichier HTML ouvert dans le navigateur
2. **Vérifiez** que les réservations sont créées sur cal.com
3. **Déployez** sur votre serveur de production
4. **Testez en production** avec une vraie réservation

⚠️ **IMPORTANT** : Ne commitez JAMAIS votre vraie clé API dans un dépôt public !

Si vous utilisez Git :
- Remplacez la clé par un placeholder avant de commit
- Utilisez des variables d'environnement en production
- Ou configurez la clé directement sur le serveur

---

## ✨ Félicitations !

Votre système de réservation est maintenant **professionnel**, **gratuit** et **sans risque de double réservation** ! 🎉
