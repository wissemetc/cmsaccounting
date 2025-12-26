# 🚀 Migration vers AWS Lambda + GitHub Pages

Ce guide vous aide à migrer vos fonctions Netlify vers AWS Lambda tout en hébergeant votre site sur GitHub Pages.

## 📋 Architecture

```
┌─────────────────┐
│  GitHub Pages   │  ← Site statique (HTML/CSS/JS) - GRATUIT
└────────┬────────┘
         │
         ↓ API calls
┌─────────────────────────────────┐
│  API Gateway + Lambda (AWS)     │  ← 2 fonctions serverless - GRATUIT
│  - get-availability             │    (1M requêtes/mois)
│  - create-booking               │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────┐
│   API Cal.com   │
└─────────────────┘
```

## 💰 Coûts

- **GitHub Pages** : 100% gratuit
- **AWS Lambda** :
  - 1 million de requêtes/mois GRATUIT (permanent)
  - 400 000 Go-secondes de calcul GRATUIT
  - Pour un site de comptabilité : **$0/mois** (largement dans les limites)

## 📦 Prérequis

1. **Compte AWS** existant
2. **AWS CLI** installé et configuré
3. **AWS SAM CLI** installé
4. **Git** pour GitHub Pages

### Installation AWS SAM CLI

**macOS :**
```bash
brew install aws-sam-cli
```

**Linux :**
```bash
# Télécharger et installer
wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
sudo ./sam-installation/install
```

**Windows :**
Téléchargez l'installateur depuis : https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

### Configuration AWS CLI

```bash
aws configure
# AWS Access Key ID: [Votre clé]
# AWS Secret Access Key: [Votre secret]
# Default region: eu-west-1 (ou votre région préférée)
# Default output format: json
```

## 🔧 Étape 1 : Déployer les Lambda Functions

### Option A : Script automatique (recommandé)

```bash
cd aws-lambda
./deploy.sh
```

Le script vous demandera :
- Votre `CALCOM_API_KEY`
- Votre `CALCOM_EVENT_TYPE_ID`
- Le slug de l'événement (défaut: `consultation-30min`)
- La région AWS (défaut: `eu-west-1`)

### Option B : Déploiement manuel

```bash
cd aws-lambda

# 1. Build
sam build

# 2. Deploy
sam deploy \
  --stack-name calcom-integration \
  --region eu-west-1 \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    CalcomApiKey="YOUR_CALCOM_API_KEY" \
    CalcomEventTypeId="4249503" \
    CalcomEventSlug="30min" \
  --resolve-s3
```

## 📝 Étape 2 : Récupérer les URLs de l'API

Après le déploiement, récupérez vos URLs :

```bash
aws cloudformation describe-stacks \
  --stack-name calcom-integration \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs' \
  --output table
```

Vous obtiendrez quelque chose comme :
```
https://abc123xyz.execute-api.eu-west-1.amazonaws.com/prod/get-availability
https://abc123xyz.execute-api.eu-west-1.amazonaws.com/prod/create-booking
```

## 🔄 Étape 3 : Configurer le frontend

Éditez `js/config.js` :

```javascript
const API_CONFIG = {
  // AWS Lambda (décommentez et remplacez par vos URLs)
  GET_AVAILABILITY_URL: 'https://VOTRE_API_ID.execute-api.eu-west-1.amazonaws.com/prod/get-availability',
  CREATE_BOOKING_URL: 'https://VOTRE_API_ID.execute-api.eu-west-1.amazonaws.com/prod/create-booking',

  // Netlify Functions (commentez ces lignes)
  // GET_AVAILABILITY_URL: '/.netlify/functions/get-availability',
  // CREATE_BOOKING_URL: '/.netlify/functions/create-booking',
};
```

## 📤 Étape 4 : Déployer sur GitHub Pages

### Option 1 : Via GitHub (simple)

1. Poussez votre code sur GitHub :
   ```bash
   git add .
   git commit -m "Migration vers AWS Lambda"
   git push origin main
   ```

2. Dans les paramètres du repo GitHub :
   - Allez dans **Settings** → **Pages**
   - Source : **Deploy from a branch**
   - Branch : `main` / `/ (root)`
   - Cliquez sur **Save**

3. Votre site sera disponible à : `https://VOTRE_USERNAME.github.io/cmsaccounting/`

### Option 2 : Avec domaine personnalisé

1. Dans **Settings** → **Pages** → **Custom domain**
2. Entrez votre domaine : `www.votredomaine.com`
3. Configurez vos DNS :
   ```
   Type: CNAME
   Name: www
   Value: VOTRE_USERNAME.github.io
   ```

## 🧪 Étape 5 : Tester

1. Ouvrez votre site GitHub Pages
2. Testez le calendrier de réservation
3. Vérifiez dans les logs AWS CloudWatch :
   ```bash
   sam logs --stack-name calcom-integration --tail
   ```

## 📊 Surveillance et logs

### Voir les logs en temps réel

```bash
# Tous les logs
sam logs --stack-name calcom-integration --tail

# Logs d'une fonction spécifique
aws logs tail /aws/lambda/calcom-get-availability --follow
```

### Métriques dans AWS Console

1. Allez sur AWS Lambda Console
2. Sélectionnez vos fonctions
3. Onglet **Monitor** pour voir :
   - Nombre de requêtes
   - Durée d'exécution
   - Erreurs

## 🔄 Mises à jour

Pour mettre à jour vos fonctions Lambda :

```bash
cd aws-lambda
./deploy.sh
```

SAM détectera automatiquement les changements et mettra à jour uniquement ce qui a changé.

## 🗑️ Suppression (si nécessaire)

Pour supprimer complètement le stack AWS :

```bash
aws cloudformation delete-stack \
  --stack-name calcom-integration \
  --region eu-west-1
```

## 🆘 Dépannage

### Erreur CORS

Si vous avez des erreurs CORS, vérifiez que :
1. Les headers CORS sont bien dans les fonctions Lambda
2. API Gateway a CORS activé (c'est dans le template.yaml)

### Fonction timeout

Si les appels à Cal.com prennent trop de temps :
1. Augmentez le timeout dans `template.yaml` (ligne `Timeout: 30`)
2. Redéployez avec `./deploy.sh`

### Variables d'environnement

Pour changer les variables d'environnement :

```bash
aws lambda update-function-configuration \
  --function-name calcom-get-availability \
  --environment "Variables={CALCOM_API_KEY=nouvelle_valeur}"
```

Ou redéployez avec `./deploy.sh`

## 🎯 Avantages de cette architecture

✅ **100% Gratuit** (dans les limites du tier gratuit AWS)
✅ **Performant** (Lambda + CloudFront CDN de GitHub)
✅ **Scalable** (gère automatiquement les pics de trafic)
✅ **Sécurisé** (API keys côté serveur)
✅ **Simple** (déploiement en 1 commande)

## 📚 Ressources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Cal.com API Documentation](https://cal.com/docs/api-reference)

## 🆚 Comparaison Netlify vs AWS

| Aspect | Netlify | AWS Lambda |
|--------|---------|------------|
| Requêtes gratuites | 125K/mois | 1M/mois |
| Hébergement site | Inclus | GitHub Pages séparé |
| Configuration | Très simple | Moyenne |
| Flexibilité | Limitée | Très flexible |
| Coût long terme | Gratuit puis payant | Gratuit permanent |

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou consultez la documentation AWS.
