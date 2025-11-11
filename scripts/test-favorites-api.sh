#!/bin/bash

# Test script for Favorites API
# Make sure the dev server is running: npm run dev

BASE_URL="http://localhost:3000"

echo "🧪 Testing Favorites API"
echo "========================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Try to get favorites without authentication (should fail)
echo -e "${YELLOW}Test 1: GET /api/favorites (unauthenticated - should fail)${NC}"
curl -s -X GET "$BASE_URL/api/favorites" | jq '.'
echo ""
echo ""

# Test 2: Login to get session cookie
echo -e "${YELLOW}Test 2: Login to get session${NC}"
echo "Enter your email:"
read USER_EMAIL
echo "Enter your password:"
read -s USER_PASSWORD
echo ""

# Login and save cookies
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST "$BASE_URL/api/auth/callback/credentials" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASSWORD\"}")

echo "Login response saved to cookies.txt"
echo ""

# Test 3: Get favorites (authenticated)
echo -e "${YELLOW}Test 3: GET /api/favorites (authenticated)${NC}"
curl -s -b cookies.txt -X GET "$BASE_URL/api/favorites" | jq '.'
echo ""
echo ""

# Test 4: Get list of bulls to find a bull ID
echo -e "${YELLOW}Test 4: GET /api/bulls/public (to find a bull ID)${NC}"
BULLS_RESPONSE=$(curl -s -b cookies.txt -X GET "$BASE_URL/api/bulls/public?page=1")
FIRST_BULL_ID=$(echo $BULLS_RESPONSE | jq -r '.bulls[0].id')
FIRST_BULL_NAME=$(echo $BULLS_RESPONSE | jq -r '.bulls[0].name')

echo "First bull: $FIRST_BULL_NAME (ID: $FIRST_BULL_ID)"
echo ""
echo ""

# Test 5: Add bull to favorites
echo -e "${YELLOW}Test 5: POST /api/favorites/$FIRST_BULL_ID (add to favorites)${NC}"
curl -s -b cookies.txt -X POST "$BASE_URL/api/favorites/$FIRST_BULL_ID" | jq '.'
echo ""
echo ""

# Test 6: Get favorites again (should show the added bull)
echo -e "${YELLOW}Test 6: GET /api/favorites (should show added bull)${NC}"
curl -s -b cookies.txt -X GET "$BASE_URL/api/favorites" | jq '.'
echo ""
echo ""

# Test 7: Try to add same bull again (should fail - already favorited)
echo -e "${YELLOW}Test 7: POST /api/favorites/$FIRST_BULL_ID (duplicate - should fail)${NC}"
curl -s -b cookies.txt -X POST "$BASE_URL/api/favorites/$FIRST_BULL_ID" | jq '.'
echo ""
echo ""

# Test 8: Remove bull from favorites
echo -e "${YELLOW}Test 8: DELETE /api/favorites/$FIRST_BULL_ID (remove from favorites)${NC}"
curl -s -b cookies.txt -X DELETE "$BASE_URL/api/favorites/$FIRST_BULL_ID" | jq '.'
echo ""
echo ""

# Test 9: Get favorites again (should be empty or not include removed bull)
echo -e "${YELLOW}Test 9: GET /api/favorites (should not show removed bull)${NC}"
curl -s -b cookies.txt -X GET "$BASE_URL/api/favorites" | jq '.'
echo ""
echo ""

# Test 10: Check bulls API includes isFavorited status
echo -e "${YELLOW}Test 10: GET /api/bulls/public (check isFavorited field)${NC}"
curl -s -b cookies.txt -X GET "$BASE_URL/api/bulls/public?page=1" | jq '.bulls[0] | {id, name, isFavorited}'
echo ""
echo ""

# Cleanup
rm -f cookies.txt
echo -e "${GREEN}✅ Tests complete! Cookies cleaned up.${NC}"
