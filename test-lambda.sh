#!/bin/bash
# Test AWS Lambda Cal.com Integration

API_ENDPOINT="https://dsmnajivu2.execute-api.eu-west-1.amazonaws.com/prod"

echo "🧪 Testing Cal.com Integration..."
echo ""

# Test 1: Get Availability
echo "📅 Test 1: Get Availability"
echo "----------------------------"

RESPONSE=$(curl -s -X POST \
  "${API_ENDPOINT}/get-availability" \
  -H "Content-Type: application/json" \
  -d '{
    "dateFrom": "'$(date +%Y-%m-%d)'",
    "dateTo": "'$(date -d '+30 days' +%Y-%m-%d)'"
  }')

echo "$RESPONSE" | jq '.'

# Check for errors
if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    echo "❌ Error found in response"
    echo ""
    echo "🔍 Common fixes:"
    echo "1. Verify CALCOM_API_KEY is set correctly in Lambda"
    echo "2. Check CALCOM_EVENT_TYPE_ID matches your Cal.com event"
    echo "3. Ensure API key has proper permissions in Cal.com"
else
    echo "✅ Success! Availability retrieved"
fi

echo ""
echo "📊 To check Lambda logs:"
echo "aws logs tail /aws/lambda/calcom-get-availability --follow --region eu-west-1"
