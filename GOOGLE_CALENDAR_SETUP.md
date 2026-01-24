# Guide de Configuration Google Calendar API avec Service Account

Ce guide vous accompagne dans la configuration complète de Google Calendar API pour remplacer Cal.com de manière transparente.

---

## Table des matières
1. [Prérequis](#prérequis)
2. [Étape 1: Créer un projet Google Cloud](#étape-1-créer-un-projet-google-cloud)
3. [Étape 2: Activer Google Calendar API](#étape-2-activer-google-calendar-api)
4. [Étape 3: Créer un Service Account](#étape-3-créer-un-service-account)
5. [Étape 4: Générer la clé JSON](#étape-4-générer-la-clé-json)
6. [Étape 5: Partager votre Google Calendar](#étape-5-partager-votre-google-calendar)
7. [Étape 6: Configurer AWS Lambda](#étape-6-configurer-aws-lambda)
8. [Étape 7: Tester l'intégration](#étape-7-tester-lintégration)
9. [Résolution des problèmes](#résolution-des-problèmes)

---

## Prérequis

- ✅ Compte Google (Gmail ou Google Workspace)
- ✅ Accès à [Google Cloud Console](https://console.cloud.google.com)
- ✅ AWS Account avec accès aux Lambda Functions
- ✅ Google Calendar où les rendez-vous seront créés

---

## Étape 1: Créer un projet Google Cloud

### 1.1 Accéder à Google Cloud Console

1. Allez sur: [https://console.cloud.google.com](https://console.cloud.google.com)
2. Connectez-vous avec votre compte Google

### 1.2 Créer un nouveau projet

1. Cliquez sur le **sélecteur de projet** en haut à gauche (à côté de "Google Cloud")
2. Dans la fenêtre qui s'ouvre, cliquez sur **"NEW PROJECT"** (Nouveau projet)
3. Remplissez les informations:
   - **Project name**: `cmsaccounting-calendar` (ou votre choix)
   - **Organization**: Laissez par défaut (No organization)
   - **Location**: Laissez par défaut
4. Cliquez sur **"CREATE"** (Créer)
5. **Attendez** quelques secondes que le projet soit créé
6. **Sélectionnez** le projet nouvellement créé dans le sélecteur

✅ **Vérification**: Le nom de votre projet doit apparaître en haut de la console

---

## Étape 2: Activer Google Calendar API

### 2.1 Accéder à la bibliothèque d'API

1. Dans le menu latéral gauche (☰), allez à:
   ```
   APIs & Services > Library
   ```
   Ou utilisez ce lien direct: [API Library](https://console.cloud.google.com/apis/library)

### 2.2 Rechercher et activer Calendar API

1. Dans la barre de recherche, tapez: **`Google Calendar API`**
2. Cliquez sur **"Google Calendar API"** dans les résultats
3. Cliquez sur le bouton **"ENABLE"** (Activer)
4. **Attendez** quelques secondes pendant l'activation

✅ **Vérification**: Vous devriez voir "API enabled" avec des graphiques de métriques

---

## Étape 3: Créer un Service Account

### 3.1 Accéder aux Service Accounts

1. Dans le menu latéral gauche (☰), allez à:
   ```
   APIs & Services > Credentials
   ```
   Ou utilisez ce lien: [Credentials](https://console.cloud.google.com/apis/credentials)

### 3.2 Créer le Service Account

1. Cliquez sur **"+ CREATE CREDENTIALS"** en haut de la page
2. Sélectionnez **"Service account"**

### 3.3 Configurer les détails du Service Account

**Étape 1/3 - Service account details:**

- **Service account name**: `calendar-booking-service`
- **Service account ID**: (sera auto-généré comme `calendar-booking-service`)
- **Description**: `Service account pour gérer les réservations Google Calendar via AWS Lambda`
- Cliquez sur **"CREATE AND CONTINUE"**

**Étape 2/3 - Grant this service account access to project:**

- **Select a role**: Cliquez sur le menu déroulant
  - Tapez "Service Account" dans la recherche
  - Sélectionnez: **"Service Account User"**
- Cliquez sur **"CONTINUE"**

**Étape 3/3 - Grant users access to this service account:**

- Laissez vide (optionnel)
- Cliquez sur **"DONE"**

✅ **Vérification**: Votre Service Account apparaît dans la liste des comptes avec un email du type:
```
calendar-booking-service@cmsaccounting-calendar.iam.gserviceaccount.com
```

**⚠️ IMPORTANT: Copiez cet email quelque part, vous en aurez besoin à l'Étape 5!**

---

## Étape 4: Générer la clé JSON

### 4.1 Accéder aux clés du Service Account

1. Dans la liste des Service Accounts, cliquez sur **`calendar-booking-service`**
2. Allez à l'onglet **"KEYS"** en haut

### 4.2 Créer une nouvelle clé

1. Cliquez sur **"ADD KEY"** → **"Create new key"**
2. Sélectionnez **"JSON"** comme type de clé
3. Cliquez sur **"CREATE"**

### 4.3 Télécharger et sécuriser la clé

- Un fichier JSON sera **automatiquement téléchargé** sur votre ordinateur
- Le nom du fichier ressemble à: `cmsaccounting-calendar-xxxxxxxxxxxxx.json`

**🔒 SÉCURITÉ CRITIQUE:**
```
⛔ NE JAMAIS committer ce fichier dans Git
⛔ NE JAMAIS partager ce fichier publiquement
⛔ NE JAMAIS l'inclure dans le code frontend
✅ Le stocker uniquement dans AWS Lambda (variable d'environnement)
✅ Ajouter *.json au .gitignore
```

### 4.4 Examiner le contenu de la clé

Ouvrez le fichier JSON téléchargé. Il doit contenir:

```json
{
  "type": "service_account",
  "project_id": "cmsaccounting-calendar",
  "private_key_id": "xxxxxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "calendar-booking-service@cmsaccounting-calendar.iam.gserviceaccount.com",
  "client_id": "xxxxxxxxxxxxxxxxxxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/calendar-booking-service%40cmsaccounting-calendar.iam.gserviceaccount.com"
}
```

✅ **Vérification**: Le fichier contient bien tous ces champs, notamment `private_key` et `client_email`

---

## Étape 5: Partager votre Google Calendar

**C'EST L'ÉTAPE LA PLUS IMPORTANTE!** Sans cela, votre Service Account ne pourra PAS accéder au calendrier.

### 5.1 Ouvrir Google Calendar

1. Allez sur [Google Calendar](https://calendar.google.com)
2. Connectez-vous avec le compte Google qui possède le calendrier de rendez-vous

### 5.2 Identifier le calendrier à utiliser

**Option A: Créer un nouveau calendrier dédié (RECOMMANDÉ)**

1. Dans la barre latérale gauche, à côté de "Other calendars", cliquez sur **"+"**
2. Sélectionnez **"Create new calendar"**
3. Remplissez:
   - **Name**: `CMS Accounting - Rendez-vous`
   - **Description**: `Calendrier pour les réservations clients via le site web`
   - **Time zone**: `(GMT+01:00) West Central Africa` ou `Africa/Tunis`
4. Cliquez sur **"Create calendar"**

**Option B: Utiliser votre calendrier principal**
- Utilisez votre calendrier existant (généralement votre email)

### 5.3 Partager le calendrier avec le Service Account

1. Dans la liste des calendriers (barre latérale gauche), trouvez votre calendrier
2. Passez la souris dessus et cliquez sur les **3 points verticaux (⋮)**
3. Sélectionnez **"Settings and sharing"**

4. Descendez jusqu'à la section **"Share with specific people or groups"**
5. Cliquez sur **"+ Add people and groups"**

6. **COLLEZ L'EMAIL DU SERVICE ACCOUNT** que vous avez copié à l'Étape 3.3:
   ```
   calendar-booking-service@cmsaccounting-calendar.iam.gserviceaccount.com
   ```

7. Dans le menu déroulant des permissions, sélectionnez:
   ```
   ✅ Make changes to events
   ```
   (Cela donne les permissions de lecture + création + modification + suppression)

8. **Décochez** "Send email notification" (pas besoin de notifier un bot)

9. Cliquez sur **"Send"**

✅ **Vérification**: Le Service Account apparaît dans la liste des personnes avec qui le calendrier est partagé

### 5.4 Récupérer l'ID du calendrier

1. Restez dans les paramètres du calendrier
2. Descendez jusqu'à la section **"Integrate calendar"**
3. Trouvez **"Calendar ID"**
4. **COPIEZ** cette valeur, elle ressemble à:
   - Pour un calendrier personnalisé: `xxxxxxxxxxxxxxxxxx@group.calendar.google.com`
   - Pour votre calendrier principal: `votre.email@gmail.com`

**⚠️ IMPORTANT: Gardez cet ID, vous en aurez besoin pour configurer AWS Lambda!**

---

## Étape 6: Configurer AWS Lambda

### 6.1 Préparer les variables d'environnement

Vous aurez besoin de ces 2 éléments:

1. **GOOGLE_CALENDAR_ID**: L'ID du calendrier copié à l'Étape 5.4
   ```
   Exemple: xxxxxxxxx@group.calendar.google.com
   ```

2. **GOOGLE_SERVICE_ACCOUNT_KEY**: Le contenu COMPLET du fichier JSON téléchargé à l'Étape 4
   ```json
   {"type":"service_account","project_id":"cmsaccounting-calendar",...}
   ```

### 6.2 Méthodes de configuration

**Option A: Via AWS SAM Template (RECOMMANDÉ)**

Modifiez `aws-lambda/template.yaml` pour ajouter:

```yaml
Parameters:
  GoogleCalendarId:
    Type: String
    Description: Google Calendar ID
    NoEcho: false

  GoogleServiceAccountKey:
    Type: String
    Description: Google Service Account JSON Key (full JSON string)
    NoEcho: true  # Masque la valeur dans la console

Resources:
  GetAvailabilityFunction:
    Type: AWS::Serverless::Function
    Properties:
      Environment:
        Variables:
          GOOGLE_CALENDAR_ID: !Ref GoogleCalendarId
          GOOGLE_SERVICE_ACCOUNT_KEY: !Ref GoogleServiceAccountKey

  CreateBookingFunction:
    Type: AWS::Serverless::Function
    Properties:
      Environment:
        Variables:
          GOOGLE_CALENDAR_ID: !Ref GoogleCalendarId
          GOOGLE_SERVICE_ACCOUNT_KEY: !Ref GoogleServiceAccountKey
```

Puis lors du déploiement:
```bash
sam deploy --guided --parameter-overrides \
  GoogleCalendarId=xxxxx@group.calendar.google.com \
  GoogleServiceAccountKey='{"type":"service_account",...}'
```

**Option B: Via AWS Console (Manuel)**

1. Allez sur [AWS Lambda Console](https://console.aws.amazon.com/lambda)
2. Sélectionnez votre fonction `calcom-get-availability`
3. Allez à **Configuration** → **Environment variables**
4. Cliquez **Edit** → **Add environment variable**:
   - Key: `GOOGLE_CALENDAR_ID`
   - Value: `xxxxxxxxx@group.calendar.google.com`
5. Ajoutez une deuxième variable:
   - Key: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: Collez le contenu COMPLET du JSON (tout sur une ligne)
6. Cliquez **Save**
7. **Répétez** pour la fonction `calcom-create-booking`

**Option C: Via AWS Secrets Manager (PLUS SÉCURISÉ)**

```bash
# Créer un secret pour la clé du Service Account
aws secretsmanager create-secret \
  --name google-calendar-service-account \
  --secret-string file://cmsaccounting-calendar-xxxxx.json \
  --region eu-west-1

# Donner les permissions à Lambda pour lire le secret
# (à ajouter dans le SAM template via Policies)
```

### 6.3 Installer les dépendances Google

Dans chaque dossier de fonction Lambda:

```bash
cd aws-lambda/get-availability
npm install googleapis

cd ../create-booking
npm install googleapis
```

✅ **Vérification**: Le fichier `package.json` doit contenir:
```json
{
  "dependencies": {
    "googleapis": "^131.0.0"
  }
}
```

---

## Étape 7: Tester l'intégration

### 7.1 Test manuel via AWS Console

1. Allez dans AWS Lambda Console
2. Ouvrez la fonction `calcom-get-availability`
3. Créez un événement de test:

```json
{
  "body": "{\"dateFrom\":\"2026-01-24\",\"dateTo\":\"2026-02-24\"}"
}
```

4. Cliquez **Test**
5. Vérifiez la réponse - elle doit ressembler à:

```json
{
  "statusCode": 200,
  "headers": {...},
  "body": "{\"success\":true,\"availability\":{\"slots\":{...}}}"
}
```

### 7.2 Test depuis le frontend

1. Ouvrez votre site web
2. Ouvrez la console du navigateur (F12)
3. Naviguez vers le formulaire de rendez-vous
4. Sélectionnez une date
5. Vérifiez dans la console qu'il n'y a pas d'erreurs
6. Les créneaux horaires doivent s'afficher

### 7.3 Test de création de rendez-vous

1. Remplissez le formulaire de rendez-vous complet
2. Cliquez sur "Confirmer la demande"
3. **Vérifiez dans Google Calendar** que le rendez-vous a été créé
4. Vérifiez que vous avez reçu un email de notification

---

## Résolution des problèmes

### ❌ Erreur: "Calendar usage limits exceeded"

**Cause**: Quota de l'API dépassé (rare)

**Solution**:
1. Vérifiez les quotas dans [Google Cloud Console > APIs & Services > Dashboard](https://console.cloud.google.com/apis/dashboard)
2. Augmentez les quotas si nécessaire (gratuit jusqu'à 1M requêtes/jour)

---

### ❌ Erreur: "The caller does not have permission"

**Cause**: Le Service Account n'a pas accès au calendrier

**Solution**:
1. **Retournez à l'Étape 5.3**
2. Vérifiez que vous avez bien partagé le calendrier avec l'email du Service Account
3. Vérifiez que les permissions sont **"Make changes to events"**
4. Attendez 1-2 minutes pour la propagation des permissions

---

### ❌ Erreur: "Invalid credentials"

**Cause**: Le JSON du Service Account est mal configuré

**Solution**:
1. Vérifiez que vous avez copié le JSON COMPLET (commence par `{` et finit par `}`)
2. Vérifiez qu'il n'y a pas de caractères spéciaux ajoutés
3. Si vous utilisez AWS Console, assurez-vous que le JSON est sur UNE seule ligne
4. Retéléchargez le JSON depuis Google Cloud Console si nécessaire

---

### ❌ Erreur: "Calendar not found"

**Cause**: L'ID du calendrier est incorrect

**Solution**:
1. Retournez dans Google Calendar
2. Paramètres du calendrier → "Integrate calendar" → Copiez le "Calendar ID"
3. Vérifiez la variable d'environnement `GOOGLE_CALENDAR_ID` dans Lambda
4. L'ID doit être EXACTEMENT celui copié (attention aux espaces)

---

### ❌ Les créneaux ne s'affichent pas

**Cause**: Problème de timezone ou de logique d'availability

**Solution**:
1. Vérifiez les logs CloudWatch de la fonction Lambda
2. Vérifiez que le calendrier est bien configuré avec le timezone `Africa/Tunis`
3. Testez manuellement l'API Google Calendar avec [OAuth Playground](https://developers.google.com/oauthplayground)

---

## Commandes utiles

### Vérifier les logs Lambda (AWS CLI)

```bash
# Voir les logs récents de get-availability
aws logs tail /aws/lambda/calcom-get-availability --follow --region eu-west-1

# Voir les logs récents de create-booking
aws logs tail /aws/lambda/calcom-create-booking --follow --region eu-west-1
```

### Tester l'authentification Google (Node.js local)

Créez un fichier `test-google-auth.js`:

```javascript
const { google } = require('googleapis');

const credentials = require('./cmsaccounting-calendar-xxxxx.json');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

async function test() {
  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.calendarList.list();
  console.log('Calendriers accessibles:', res.data.items);
}

test().catch(console.error);
```

```bash
npm install googleapis
node test-google-auth.js
```

---

## Sécurité et bonnes pratiques

### ✅ À FAIRE

- ✅ Stocker le JSON du Service Account uniquement dans AWS Lambda (variables d'environnement)
- ✅ Ajouter `*.json` dans `.gitignore`
- ✅ Utiliser AWS Secrets Manager pour une sécurité renforcée
- ✅ Créer un calendrier dédié pour les rendez-vous (séparé du calendrier personnel)
- ✅ Activer les logs CloudWatch pour le debugging
- ✅ Configurer des alertes sur les erreurs Lambda

### ⛔ À NE PAS FAIRE

- ⛔ Committer le fichier JSON du Service Account dans Git
- ⛔ Partager la clé publiquement (GitHub, Slack, email)
- ⛔ Utiliser OAuth2 avec consentement utilisateur (Service Account est mieux pour server-to-server)
- ⛔ Donner des permissions "Owner" au Service Account (seulement "Make changes to events")
- ⛔ Exposer les credentials dans le code frontend

---

## Prochaines étapes

Après avoir configuré les credentials:

1. ✅ Modifier `aws-lambda/get-availability/index.js` pour utiliser Google Calendar API
2. ✅ Modifier `aws-lambda/create-booking/index.js` pour utiliser Google Calendar API
3. ✅ Tester localement avec les credentials
4. ✅ Déployer sur AWS Lambda
5. ✅ Tester end-to-end depuis le site web
6. ✅ Supprimer les dépendances Cal.com

---

## Ressources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [Service Accounts Overview](https://cloud.google.com/iam/docs/service-accounts)
- [FreeBusy API Reference](https://developers.google.com/calendar/api/v3/reference/freebusy)
- [Events API Reference](https://developers.google.com/calendar/api/v3/reference/events)
- [googleapis Node.js Client](https://github.com/googleapis/google-api-nodejs-client)

---

## Support

Si vous rencontrez des problèmes:

1. Vérifiez les logs CloudWatch de vos fonctions Lambda
2. Testez l'authentification en local avec le script de test
3. Vérifiez que toutes les étapes ont été suivies exactement
4. Consultez la section "Résolution des problèmes" ci-dessus

---

**✅ Une fois cette configuration terminée, passez à l'implémentation du code Lambda!**
