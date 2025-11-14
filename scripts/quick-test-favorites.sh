#!/bin/bash

# Quick test - just check if endpoints respond
# Run this to verify the API is working

BASE_URL="http://localhost:3000"

echo "🔍 Quick Favorites API Health Check"
echo "===================================="
echo ""

# Test 1: Unauthenticated request (should return 401)
echo "1. Testing GET /api/favorites (unauthenticated)..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/favorites")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "401" ]; then
    echo "   ✅ Correctly returns 401 Unauthorized"
    echo "   Response: $BODY"
else
    echo "   ❌ Expected 401, got $HTTP_CODE"
    echo "   Response: $BODY"
fi
echo ""

# Test 2: Invalid bull ID (should return 401 or 404)
echo "2. Testing POST /api/favorites/invalid-id (unauthenticated)..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/favorites/invalid-id")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "401" ]; then
    echo "   ✅ Correctly returns 401 Unauthorized"
    echo "   Response: $BODY"
else
    echo "   ⚠️  Got $HTTP_CODE (expected 401)"
    echo "   Response: $BODY"
fi
echo ""

# Test 3: Check bulls API is accessible
echo "3. Testing GET /api/bulls/public (public endpoint)..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/bulls/public?page=1")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Bulls API is accessible"
    # Check if isFavorited field exists
    HAS_IS_FAVORITED=$(echo "$RESPONSE" | head -n-1 | grep -o '"isFavorited"' | head -1)
    if [ ! -z "$HAS_IS_FAVORITED" ]; then
        echo "   ✅ Bulls include 'isFavorited' field"
    else
        echo "   ⚠️  Bulls might not include 'isFavorited' field"
    fi
else
    echo "   ❌ Bulls API returned $HTTP_CODE"
fi
echo ""

echo "===================================="
echo "✅ Health check complete!"
echo ""
echo "To test with authentication:"
echo "1. Run: bash scripts/test-favorites-api.sh"
echo "2. Or see: scripts/FAVORITES_API_CURL_EXAMPLES.md"
