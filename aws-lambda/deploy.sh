#!/bin/bash

# Script de déploiement AWS Lambda + API Gateway
# Utilise AWS SAM CLI

set -e

echo "🚀 Déploiement des Lambda Functions Cal.com vers AWS..."
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

# Variables d'environnement
read -p "🔑 CALCOM_API_KEY: " CALCOM_API_KEY
read -p "🆔 CALCOM_EVENT_TYPE_ID: " CALCOM_EVENT_TYPE_ID
read -p "📌 CALCOM_EVENT_SLUG (défaut: consultation-30min): " CALCOM_EVENT_SLUG
CALCOM_EVENT_SLUG=${CALCOM_EVENT_SLUG:-consultation-30min}

echo ""
read -p "🌍 Région AWS (défaut: eu-west-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-eu-west-1}

echo ""
read -p "📦 Nom du stack CloudFormation (défaut: calcom-integration): " STACK_NAME
STACK_NAME=${STACK_NAME:-calcom-integration}

echo ""
echo "📋 Configuration :"
echo "   - Région : $AWS_REGION"
echo "   - Stack  : $STACK_NAME"
echo "   - Event  : $CALCOM_EVENT_SLUG"
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
    "ParameterKey=CalcomApiKey,ParameterValue=$CALCOM_API_KEY" \
    "ParameterKey=CalcomEventTypeId,ParameterValue=$CALCOM_EVENT_TYPE_ID" \
    "ParameterKey=CalcomEventSlug,ParameterValue=$CALCOM_EVENT_SLUG" \
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
echo "🎉 Vos fonctions Lambda sont déployées !"
echo ""
echo "📝 Prochaines étapes :"
echo "1. Copiez les URLs affichées ci-dessus"
echo "2. Mettez à jour js/main.js avec ces URLs"
echo "3. Testez votre site"
