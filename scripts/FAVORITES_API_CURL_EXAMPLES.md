# Favorites API - Manual cURL Testing

## Prerequisites
1. Start the dev server: `npm run dev`
2. Have a registered user account (from Story 4.3a)
3. Have some bulls in the database

## Authentication

NextAuth.js uses cookies for session management. You'll need to:
1. Login via the browser first
2. Copy the session cookie from browser DevTools
3. Use it in curl commands

OR use the automated script: `bash scripts/test-favorites-api.sh`

---

## Manual cURL Commands

### 1. Get All Favorites (Authenticated)

```bash
# Replace YOUR_SESSION_COOKIE with actual cookie value from browser
curl -X GET "http://localhost:3000/api/favorites" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_COOKIE" \
  | jq '.'
```

**Expected Response (with favorites):**
```json
{
  "favorites": [
    {
      "id": "clxxx...",
      "userId": "clxxx...",
      "bullId": "clxxx...",
      "createdAt": "2025-11-11T...",
      "bull": {
        "id": "clxxx...",
        "name": "Champion Black Angus",
        "breed": "Angus",
        "heroImage": "https://...",
        "ranch": {
          "name": "Wagner Premium Ranch",
          "slug": "wagner-premium-ranch"
        }
      }
    }
  ]
}
```

**Expected Response (no favorites):**
```json
{
  "favorites": []
}
```

**Expected Response (unauthenticated):**
```json
{
  "error": "Unauthorized"
}
```

---

### 2. Add Bull to Favorites

```bash
# Replace BULL_ID with actual bull ID
curl -X POST "http://localhost:3000/api/favorites/BULL_ID" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_COOKIE" \
  | jq '.'
```

**Expected Response (success):**
```json
{
  "favorite": {
    "id": "clxxx...",
    "userId": "clxxx...",
    "bullId": "clxxx...",
    "createdAt": "2025-11-11T..."
  }
}
```

**Expected Response (already favorited):**
```json
{
  "error": "Already favorited"
}
```

**Expected Response (bull not found):**
```json
{
  "error": "Bull not found"
}
```

---

### 3. Remove Bull from Favorites

```bash
# Replace BULL_ID with actual bull ID
curl -X DELETE "http://localhost:3000/api/favorites/BULL_ID" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_COOKIE" \
  | jq '.'
```

**Expected Response:**
```json
{
  "success": true
}
```

---

### 4. Get Bulls with Favorite Status

```bash
curl -X GET "http://localhost:3000/api/bulls/public?page=1" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_COOKIE" \
  | jq '.bulls[0] | {id, name, isFavorited}'
```

**Expected Response:**
```json
{
  "id": "clxxx...",
  "name": "Champion Black Angus",
  "isFavorited": true
}
```

---

## Getting Session Cookie from Browser

### Chrome/Edge:
1. Open DevTools (F12)
2. Go to Application tab
3. Expand Cookies → http://localhost:3000
4. Find `next-auth.session-token` or `__Secure-next-auth.session-token`
5. Copy the Value

### Firefox:
1. Open DevTools (F12)
2. Go to Storage tab
3. Expand Cookies → http://localhost:3000
4. Find `next-auth.session-token`
5. Copy the Value

---

## Testing Workflow

1. **Login via browser** at http://localhost:3000/login
2. **Get session cookie** from DevTools
3. **Get a bull ID** from the bulls page or API
4. **Add to favorites** using POST endpoint
5. **Verify** using GET favorites endpoint
6. **Check bulls API** to see isFavorited status
7. **Remove from favorites** using DELETE endpoint
8. **Verify removal** using GET favorites endpoint

---

## Automated Testing

For easier testing, use the automated script:

```bash
chmod +x scripts/test-favorites-api.sh
bash scripts/test-favorites-api.sh
```

This script will:
- Prompt for your credentials
- Login and save session cookie
- Run all API tests automatically
- Clean up cookies when done
