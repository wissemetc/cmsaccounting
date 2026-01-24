#!/bin/bash

# Script de déploiement AWS Lambda + API Gateway
# Utilise AWS SAM CLI pour Google Calendar Integration

set -e

echo "🚀 Déploiement des Lambda Functions Google Calendar vers AWS..."
echo ""

# Vérifier que AWS SAM CLI est installé
if ! command -v sam &> /dev/null; then
    echo "❌ AWS SAM CLI n'est pas installé."
    echo "📦 Installation : https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    echo ""
    echo "Ou utilisez : brew install aws-sam-cli (macOS)"
    exit 1
fi

# Vérifier que AWS CLI est configuré
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI n'est pas configuré."
    echo "🔧 Exécutez : aws configure"
    exit 1
fi

echo "✅ AWS SAM CLI détecté"
echo "✅ AWS CLI configuré"
echo ""

# Variables d'environnement Google Calendar
echo "📅 Configuration Google Calendar"
echo ""
read -p "📧 GOOGLE_CALENDAR_ID (ex: xxxxx@group.calendar.google.com): " GOOGLE_CALENDAR_ID

echo ""
echo "🔑 GOOGLE_SERVICE_ACCOUNT_KEY"
echo "   Collez le contenu COMPLET du fichier JSON du Service Account"
echo "   (Commencez par { et finissez par })"
echo "   Puis appuyez sur Ctrl+D quand terminé:"
echo ""
GOOGLE_SERVICE_ACCOUNT_KEY=$(cat)

# Valider que c'est du JSON valide
if ! echo "$GOOGLE_SERVICE_ACCOUNT_KEY" | jq . > /dev/null 2>&1; then
    echo ""
    echo "❌ Le JSON du Service Account n'est pas valide."
    echo "💡 Assurez-vous d'avoir copié le fichier JSON complet."
    exit 1
fi

echo ""
echo "✅ JSON validé"

echo ""
read -p "🌍 Région AWS (défaut: eu-west-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-eu-west-1}

echo ""
read -p "📦 Nom du stack CloudFormation (défaut: google-calendar-integration): " STACK_NAME
STACK_NAME=${STACK_NAME:-google-calendar-integration}

echo ""
echo "📋 Configuration :"
echo "   - Région     : $AWS_REGION"
echo "   - Stack      : $STACK_NAME"
echo "   - Calendar ID: $GOOGLE_CALENDAR_ID"
echo ""

# Installer les dépendances
echo "📦 Installation des dépendances..."
cd get-availability && npm install && cd ..
cd create-booking && npm install && cd ..
echo "✅ Dépendances installées"
echo ""

# Build
echo "🔨 Build des fonctions Lambda..."
sam build

# Deploy
echo ""
echo "🚀 Déploiement vers AWS..."
sam deploy \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    "GoogleCalendarId=$GOOGLE_CALENDAR_ID" \
    "GoogleServiceAccountKey=$GOOGLE_SERVICE_ACCOUNT_KEY" \
  --no-confirm-changeset \
  --resolve-s3

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "📊 Récupération des URLs de l'API..."
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs' \
  --output table

echo ""
echo "🎉 Vos fonctions Lambda Google Calendar sont déployées !"
echo ""
echo "📝 Prochaines étapes :"
echo "1. Les URLs API sont les mêmes (/get-availability et /create-booking)"
echo "2. Aucune modification du frontend n'est nécessaire"
echo "3. Testez votre site - tout devrait fonctionner de manière transparente"
echo ""
echo "💡 Note: Si vous aviez déjà un stack 'calcom-integration', vous pouvez le supprimer:"
echo "   aws cloudformation delete-stack --stack-name calcom-integration --region $AWS_REGION"
echo ""
