# API Test Plan — app.vwo.com

**Agent:** PostmanKaka 📮  
**Base URL:** https://app.vwo.com/api/v3  
**Scope:** REST API validation, auth enforcement, data integrity, security

---

## 1. Objectives

- Verify all public API endpoints return expected status codes
- Validate request/response schemas against OpenAPI spec
- Ensure authentication is enforced (no unauthenticated data leaks)
- Test rate limiting and error handling
- Validate CRUD operations on campaigns, users, reports

---

## 2. API Modules

| Module | Endpoints | Priority |
|---|---|---|
| Health | `GET /health` | P0 |
| Authentication | `POST /auth/login`, `POST /auth/refresh` | P0 |
| Campaigns | `GET/POST/PUT/DELETE /campaigns` | P0 |
| Variants | `GET/POST/PUT /campaigns/{id}/variants` | P1 |
| Reports | `GET /campaigns/{id}/reports` | P1 |
| Users | `GET/POST /users`, `PUT /users/{id}` | P1 |
| Teams | `GET/POST /teams`, `DELETE /teams/{id}` | P2 |
| Webhooks | `GET/POST /webhooks`, `DELETE /webhooks/{id}` | P2 |
| Integrations | `GET /integrations` | P2 |

---

## 3. Test Types

### Functional
- Happy path: valid requests return 200/201
- Validation: malformed payloads return 400 with clear errors
- Not found: missing IDs return 404
- Conflict: duplicate names return 409

### Security
- No auth → 401 on all protected endpoints
- Invalid token → 401
- Expired token → 401
- Cross-tenant access → 403
- SQL injection in query params → sanitized/400

### Contract
- Response schema matches OpenAPI spec
- Required fields always present
- Data types correct (date as ISO-8601, numbers not strings)

### Performance
- 95th percentile latency < 500ms for GETs
- 95th percentile latency < 1000ms for POSTs
- No response body > 10MB without pagination

---

## 4. Environments

| Env | Base URL | Data |
|---|---|---|
| Staging | `https://staging-app.vwo.com/api/v3` | Seeded test data |
| Production | `https://app.vwo.com/api/v3` | Read-only tests only |

---

## 5. Automation Stack

| Layer | Technology |
|---|---|
| Manual/Exploratory | Postman Collections |
| CI Automation | REST Assured (Java) + TestNG |
| Contract | Pact (consumer-driven) |
| Reporting | Allure |

---

## 6. Key Scenarios

### AUTH-001: Valid Login
```
POST /auth/login
Body: { "email": "valid@test.com", "password": "correct" }
Expect: 200, accessToken + refreshToken, expiresIn
```

### AUTH-002: Invalid Login
```
POST /auth/login
Body: { "email": "valid@test.com", "password": "wrong" }
Expect: 401, error: "Invalid credentials"
```

### CAMP-001: Create Campaign
```
POST /campaigns
Headers: Authorization: Bearer {token}
Body: { "name": "API Test Campaign", "type": "ab", "url": "https://example.com" }
Expect: 201, id, createdAt, status: "draft"
```

### CAMP-002: List Campaigns
```
GET /campaigns?page=1&limit=10
Headers: Authorization: Bearer {token}
Expect: 200, array, meta: { total, page, limit }
```

### CAMP-003: Update Campaign
```
PUT /campaigns/{id}
Body: { "name": "Updated Name", "status": "paused" }
Expect: 200, name updated, status changed
```

### CAMP-004: Delete Campaign
```
DELETE /campaigns/{id}
Expect: 204
GET /campaigns/{id} → 404
```

### SEC-001: No Auth Access
```
GET /campaigns
Headers: none
Expect: 401, error: "Authentication required"
```

### SEC-002: Invalid Token
```
GET /campaigns
Headers: Authorization: Bearer invalid_token_123
Expect: 401, error: "Invalid token"
```

---

## 7. Data Setup

```json
{
  "testUser": {
    "email": "api-test@vwo.internal",
    "password": "TestPass123!",
    "role": "admin"
  },
  "seedCampaign": {
    "name": "API Seed Campaign",
    "type": "ab",
    "url": "https://seed.example.com"
  }
}
```

---

## 8. Sign-Off

📮 *PostmanKaka: "Auth first, data second. No leaks on my watch."*
