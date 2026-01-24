# 🚀 Google Calendar Integration via AWS Lambda

Ce guide explique comment déployer les fonctions Lambda qui remplacent Cal.com par Google Calendar API de manière **100% transparente** pour votre frontend.

## 📋 Architecture

```
┌─────────────────┐
│  GitHub Pages   │  ← Site statique (HTML/CSS/JS) - GRATUIT
└────────┬────────┘
         │
         ↓ API calls (INCHANGÉS)
┌─────────────────────────────────┐
│  API Gateway + Lambda (AWS)     │  ← 2 fonctions serverless - GRATUIT
│  - /get-availability            │    (1M requêtes/mois)
│  - /create-booking              │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────┐
│ Google Calendar API │  ← API Google - GRATUIT (1M requêtes/jour)
└─────────────────────┘
```

## 💰 Coûts

- **GitHub Pages** : 100% gratuit
- **AWS Lambda** :
  - 1 million de requêtes/mois GRATUIT (permanent)
  - 400 000 Go-secondes de calcul GRATUIT
  - Pour un site de comptabilité : **$0/mois** (largement dans les limites)
- **Google Calendar API** :
  - 1 million de requêtes/jour GRATUIT
  - Quota largement suffisant pour un site de réservation

## ✅ Avantages vs Cal.com

| Aspect | Cal.com | Google Calendar API |
|--------|---------|---------------------|
| Coût | Payant pour fonctionnalités avancées | 100% gratuit |
| Dépendance | Service tiers externe | API Google native |
| Contrôle | Limité | Total sur la logique |
| Intégration | Via leur API | Directe avec Google |
| Frontend | **INCHANGÉ** | **INCHANGÉ** |

## 📦 Prérequis

### 1. Configuration Google Cloud

**Suivez le guide complet** : [`GOOGLE_CALENDAR_SETUP.md`](../GOOGLE_CALENDAR_SETUP.md)

Ce guide vous accompagne étape par étape pour :
- Créer un projet Google Cloud
- Activer Google Calendar API
- Créer un Service Account
- Générer les credentials JSON
- Partager votre calendrier

Vous aurez besoin de :
- ✅ `GOOGLE_CALENDAR_ID` (ex: `xxxxx@group.calendar.google.com`)
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY` (fichier JSON complet)

### 2. Outils AWS

1. **Compte AWS** existant
2. **AWS CLI** installé et configuré
3. **AWS SAM CLI** installé

#### Installation AWS SAM CLI

**macOS :**
```bash
brew install aws-sam-cli
```

**Linux :**
```bash
wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
sudo ./sam-installation/install
```

**Windows :**
Téléchargez depuis : https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

#### Configuration AWS CLI

```bash
aws configure
# AWS Access Key ID: [Votre clé]
# AWS Secret Access Key: [Votre secret]
# Default region: eu-west-1 (ou votre région)
# Default output format: json
```

## 🔧 Déploiement

### Option A : Script automatique (RECOMMANDÉ)

```bash
cd aws-lambda
chmod +x deploy.sh
./deploy.sh
```

Le script vous demandera :
1. **Google Calendar ID** : Copiez depuis Google Calendar Settings
2. **Service Account JSON** : Collez le contenu complet du fichier JSON
3. **Région AWS** : Par défaut `eu-west-1` (Europe Ireland)
4. **Nom du stack** : Par défaut `google-calendar-integration`

Le script va :
- ✅ Valider le JSON du Service Account
- ✅ Installer les dépendances (`googleapis`)
- ✅ Builder les fonctions Lambda
- ✅ Déployer sur AWS
- ✅ Afficher les URLs de l'API Gateway

### Option B : Déploiement manuel

```bash
cd aws-lambda

# 1. Installer les dépendances
cd get-availability && npm install && cd ..
cd create-booking && npm install && cd ..

# 2. Build
sam build

# 3. Deploy
sam deploy \
  --stack-name google-calendar-integration \
  --region eu-west-1 \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    GoogleCalendarId="xxxxx@group.calendar.google.com" \
    GoogleServiceAccountKey='{"type":"service_account",...}' \
  --resolve-s3
```

## 📝 Récupérer les URLs de l'API

Après le déploiement :

```bash
aws cloudformation describe-stacks \
  --stack-name google-calendar-integration \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs' \
  --output table
```

Vous obtiendrez :
```
https://abc123xyz.execute-api.eu-west-1.amazonaws.com/prod/get-availability
https://abc123xyz.execute-api.eu-west-1.amazonaws.com/prod/create-booking
```

## 🔄 Configuration du frontend

**BONNE NOUVELLE : Aucun changement nécessaire dans le frontend!**

Les endpoints sont identiques :
- `/get-availability` → Récupère les créneaux disponibles
- `/create-booking` → Crée un rendez-vous

**Si vous utilisez déjà AWS Lambda**, les URLs restent les mêmes.

**Si vous migrez depuis Netlify**, éditez `js/config.js` :

```javascript
const API_CONFIG = {
  // AWS Lambda URLs (remplacez par vos URLs)
  GET_AVAILABILITY_URL: 'https://VOTRE_API_ID.execute-api.eu-west-1.amazonaws.com/prod/get-availability',
  CREATE_BOOKING_URL: 'https://VOTRE_API_ID.execute-api.eu-west-1.amazonaws.com/prod/create-booking',
};
```

## 🧪 Test

### Test via AWS Console

1. Allez dans **AWS Lambda Console**
2. Ouvrez `google-calendar-get-availability`
3. Créez un test event :
   ```json
   {
     "body": "{\"dateFrom\":\"2026-01-24\",\"dateTo\":\"2026-02-24\"}"
   }
   ```
4. Cliquez **Test**
5. Vérifiez la réponse

### Test depuis le site

1. Ouvrez votre site (GitHub Pages ou local)
2. Naviguez vers le formulaire de rendez-vous
3. Sélectionnez une date
4. Les créneaux doivent s'afficher
5. Créez un test de réservation
6. **Vérifiez dans Google Calendar** que l'événement apparaît

## 📊 Surveillance et logs

### Logs en temps réel

```bash
# Logs de get-availability
aws logs tail /aws/lambda/google-calendar-get-availability --follow --region eu-west-1

# Logs de create-booking
aws logs tail /aws/lambda/google-calendar-create-booking --follow --region eu-west-1
```

### Métriques CloudWatch

1. AWS Console → CloudWatch → Metrics
2. Namespace : `AWS/Lambda`
3. Métriques disponibles :
   - Invocations
   - Duration
   - Errors
   - Throttles

## 🔄 Mises à jour

Pour mettre à jour le code des fonctions Lambda :

```bash
cd aws-lambda

# Modifier vos fichiers index.js
# Puis redéployer

./deploy.sh
```

SAM détectera automatiquement les changements.

## 🗑️ Suppression

Pour supprimer complètement le stack :

```bash
aws cloudformation delete-stack \
  --stack-name google-calendar-integration \
  --region eu-west-1
```

Pour supprimer l'ancien stack Cal.com (si existant) :

```bash
aws cloudformation delete-stack \
  --stack-name calcom-integration \
  --region eu-west-1
```

## 🆘 Dépannage

### ❌ "The caller does not have permission"

**Cause** : Le Service Account n'a pas accès au calendrier

**Solution** :
1. Ouvrez Google Calendar
2. Settings du calendrier → "Share with specific people"
3. Ajoutez l'email du Service Account
4. Permission : **"Make changes to events"**

### ❌ "Invalid credentials"

**Cause** : Le JSON du Service Account est mal configuré

**Solution** :
1. Re-téléchargez le JSON depuis Google Cloud Console
2. Copiez le contenu COMPLET (de `{` à `}`)
3. Vérifiez qu'il n'y a pas d'espaces ou caractères ajoutés
4. Redéployez

### ❌ Les créneaux ne s'affichent pas

**Cause** : Problème de timezone ou logique d'availability

**Solution** :
1. Vérifiez les logs CloudWatch
2. Testez manuellement la fonction Lambda
3. Vérifiez que le calendrier a le bon timezone (Africa/Tunis)

### ❌ CORS errors

**Cause** : Headers CORS mal configurés

**Solution** :
- Les headers CORS sont déjà configurés dans le code
- Si problème persiste, vérifiez API Gateway CORS settings

## 📚 Fichiers du projet

| Fichier | Description |
|---------|-------------|
| `get-availability/index.js` | Lambda : Récupère les disponibilités via FreeBusy API |
| `create-booking/index.js` | Lambda : Crée les événements via Events API |
| `get-availability/package.json` | Dépendances : googleapis |
| `create-booking/package.json` | Dépendances : googleapis |
| `template.yaml` | SAM template : Infrastructure as Code |
| `deploy.sh` | Script de déploiement automatique |
| `README.md` | Ce fichier |

## 🔍 Détails techniques

### get-availability/index.js

- **API utilisée** : Google Calendar FreeBusy API
- **Endpoint** : `POST https://www.googleapis.com/calendar/v3/freeBusy`
- **Logique** :
  1. Récupère les périodes occupées (busy) du calendrier
  2. Génère les créneaux de 30 minutes (8h30-15h30)
  3. Exclut les week-ends
  4. Exclut les pauses déjeuner (Lundi et Jeudi 12h30-13h30)
  5. Exclut les périodes déjà réservées
  6. Retourne le format compatible avec le frontend

### create-booking/index.js

- **API utilisée** : Google Calendar Events API
- **Endpoint** : `POST https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events`
- **Données stockées** :
  - Summary : "Consultation - [Nom du client]"
  - Description : Détails complets (formatés)
  - Attendees : Email du client
  - Extended Properties : Phone, Company, Service, Meeting Type, Appointment ID
  - Reminders : 1 jour avant + 1 heure avant
  - Notifications : Envoyées automatiquement par Google

## 🎯 Fonctionnalités

✅ **Transparence totale** : Le frontend ne change pas
✅ **Horaires de travail** : 8h30-15h30, du lundi au vendredi
✅ **Pauses déjeuner** : Lundi et Jeudi 12h30-13h30
✅ **Créneaux 30 minutes** : Alignés avec la configuration actuelle
✅ **Timezone** : Africa/Tunis (UTC+1)
✅ **Notifications** : Emails automatiques via Google Calendar
✅ **Métadonnées** : Toutes les infos client stockées
✅ **Double booking prevention** : Via FreeBusy API

## 📚 Ressources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Google Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [googleapis Node.js Client](https://github.com/googleapis/google-api-nodejs-client)

## 🆚 Migration depuis Cal.com

| Changement | Impact |
|------------|--------|
| Frontend | ✅ **AUCUN** |
| API Gateway URLs | ✅ Identiques (`/get-availability`, `/create-booking`) |
| Lambda function names | ⚠️ Changent (mais transparent) |
| Variables d'environnement | ⚠️ Nouvelles (Google Calendar) |
| Format de réponse | ✅ Compatible |
| Logique métier | ✅ Identique (horaires, durée, etc.) |

---

**Besoin d'aide ?**
- Consultez [`GOOGLE_CALENDAR_SETUP.md`](../GOOGLE_CALENDAR_SETUP.md) pour la configuration Google
- Ouvrez une issue sur GitHub
- Consultez la documentation AWS Lambda
