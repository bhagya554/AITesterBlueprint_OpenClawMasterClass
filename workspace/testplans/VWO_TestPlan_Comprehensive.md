# VWO (app.vwo.com) - Comprehensive Test Plan

**Project:** VWO Dashboard (app.vwo.com)
**Date:** 2026-05-04
**Family Lead:** RamuKaka 🤖

## 📋 Executive Summary

VWO is a Conversion Rate Optimization (CRO) platform providing A/B testing, multivariate testing, heatmaps, session recordings, and surveys. The dashboard at app.vwo.com is the primary interface for marketers and product teams.

**Scope:** Web, Mobile, API, Performance testing across all major features.

---

## 🕸️ GanguBhai - Web Testing Plan

### 1. Authentication & Authorization

#### Sign Up Flow
- [ ] Email registration with valid/invalid formats
- [ ] Password strength validation (min 8 chars, special chars, numbers)
- [ ] Email verification link functionality
- [ ] Duplicate email prevention
- [ ] Social login (Google, Microsoft SSO)
- [ ] Terms and conditions acceptance
- [ ] CAPTCHA verification (if present)

#### Login Flow
- [ ] Valid credentials login
- [ ] Invalid credentials handling (error messages)
- [ ] Remember me functionality
- [ ] Session timeout handling (30 min inactivity)
- [ ] Concurrent session management
- [ ] Password reset via email
- [ ] Account lockout after failed attempts

#### Multi-Factor Authentication (if applicable)
- [ ] SMS/Email OTP verification
- [ ] TOTP authenticator app setup
- [ ] Backup recovery codes

### 2. Dashboard & Navigation

#### Dashboard Elements
- [ ] Home dashboard loads with all widgets
- [ ] Quick action buttons (Create Campaign, View Reports, etc.)
- [ ] Recent campaigns list
- [ ] Analytics overview (visitors, conversions, revenue)
- [ ] Notifications bell icon and dropdown
- [ ] Search functionality across campaigns

#### Navigation Menu
- [ ] Left sidebar navigation (Testing, Insights, Deploy, FullStack)
- [ ] Collapse/expand sidebar functionality
- [ ] Hover states and tooltips
- [ ] Breadcrumb navigation
- [ ] Page transition animations

### 3. A/B Testing Module (Core Feature)

#### Campaign Creation Flow
- [ ] Create new A/B test campaign
- [ ] Campaign naming conventions
- [ ] URL targeting patterns (exact, regex, substring)
- [ ] Audience segmentation setup
- [ ] Variation creation (add new variations)
- [ ] Visual editor - drag and drop elements
- [ ] Code editor - HTML/CSS/JS modifications
- [ ] Preview mode for each variation
- [ ] Traffic allocation (50/50, custom split)
- [ ] Goal configuration (page visits, clicks, custom events)

#### Campaign Management
- [ ] Start/Pause/Stop campaign
- [ ] Duplicate campaign
- [ ] Archive/Delete campaign
- [ ] Campaign status indicators (Running, Draft, Paused, Completed)
- [ ] Traffic distribution adjustment during active campaign
- [ ] Winner declaration mechanism

#### Campaign Reporting
- [ ] Real-time statistics display
- [ ] Conversion rate comparison
- [ ] Statistical significance calculator (95% confidence)
- [ ] Revenue impact analysis
- [ ] Segment-wise reporting (device, browser, location)
- [ ] Export reports (PDF, CSV, Excel)
- [ ] Date range selection (custom date pickers)
- [ ] Graph/chart rendering (line charts, bar charts)

### 4. Multivariate Testing (MVT)

- [ ] Multiple element combination testing
- [ ] Factor and level configuration
- [ ] Traffic allocation across combinations
- [ ] Partial factorial testing
- [ ] Combination preview and preview URLs

### 5. Split URL Testing

- [ ] Original vs. redirect URL setup
- [ ] Traffic split between URLs
- [ ] URL parameter preservation during redirects
- [ ] Campaign analytics across URLs

### 6. Heatmaps & Clickmaps

- [ ] Heatmap generation from session data
- [ ] Click map visualization
- [ ] Scroll map (scroll depth analysis)
- [ ] Element-level click statistics
- [ ] Filter by device type, browser, date range
- [ ] Export heatmap images

### 7. Session Recordings

- [ ] Recording playback interface
- [ ] Playback controls (play, pause, speed 1x/2x/4x)
- [ ] Skip inactivity periods
- [ ] Search recordings by user behavior
- [ ] Filtering (rage clicks, errors, conversion events)
- [ ] Tagging and note-taking on recordings

### 8. Surveys & Feedback

- [ ] Survey creation wizard
- [ ] Question types (NPS, CSAT, open-ended, multiple choice)
- [ ] Trigger conditions (time on page, scroll depth, exit intent)
- [ ] Survey preview before publishing
- [ ] Response collection and analytics
- [ ] Net Promoter Score calculation

### 9. Form Analytics

- [ ] Form field tracking setup
- [ ] Field-level metrics (fills, blanks, refills)
- [ ] Time spent per field
- [ ] Hesitation time calculation
- [ ] Field abandonment tracking
- [ ] Conversion funnel visualization

### 10. Settings & Configuration

#### Account Settings
- [ ] Profile information update
- [ ] Company details and branding
- [ ] Team member management (invite, roles, permissions)
- [ ] Integration settings (Google Analytics, Adobe Analytics, Mixpanel)
- [ ] Webhook configuration
- [ ] Single Sign-On (SSO) setup
- [ ] API key generation and management

#### Billing & Subscription
- [ ] Plan comparison and selection
- [ ] Payment method management (credit card, PayPal)
- [ ] Invoice download and history
- [ ] Usage tracking (visitor quota, campaign limits)
- [ ] Plan upgrade/downgrade flows
- [ ] Cancellation flow and data retention policy

### 11. Cross-Browser Testing Matrix

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest, Latest-1 | ⏳ |
| Firefox | Latest, Latest-1 | ⏳ |
| Safari | Latest (Mac) | ⏳ |
| Edge | Latest | ⏳ |
| IE11 | (if supported) | ⏳ |

### 12. Responsive Design Testing

- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet landscape/portrait (1024x768, 768x1024)
- [ ] Mobile (375x667, 414x896)
- [ ] Sidebar collapse behavior on smaller screens
- [ ] Table/grid scrolling on mobile
- [ ] Modal dialog responsiveness
- [ ] Touch target sizes (min 44px)

### 13. Accessibility Testing (WCAG 2.1 AA)

- [ ] Keyboard navigation (Tab order, Enter/Space actions)
- [ ] Screen reader compatibility (NVDA, JAWS, VoiceOver)
- [ ] Color contrast ratios (4.5:1 for text)
- [ ] ARIA labels and roles
- [ ] Focus indicators
- [ ] Alt text for images/icons
- [ ] Form labels and error announcements
- [ ] Skip navigation links

### 14. Visual Testing

- [ ] UI consistency across pages
- [ ] Icon rendering and alignment
- [ ] Font loading and rendering
- [ ] Loading states and skeleton screens
- [ ] Empty states design
- [ ] Error page design (404, 500)
- [ ] Dark mode support (if applicable)

### 15. Error Handling

- [ ] 404 error page
- [ ] 500 server error handling
- [ ] Network disconnection handling
- [ ] Timeout scenarios (API calls >30s)
- [ ] Concurrent edit conflict resolution
- [ ] Data validation error messages
- [ ] File upload error handling (size, type)

---

## 📱 Chotu - Mobile Testing Plan

### 1. Mobile Web Testing (Responsive)

#### Device Coverage
| Device | OS | Resolution | Status |
|--------|-----|------------|--------|
| iPhone 15 Pro | iOS 18 | 393x852 | ⏳ |
| iPhone 14 | iOS 17 | 390x844 | ⏳ |
| Samsung S24 | Android 14 | 360x780 | ⏳ |
| Pixel 8 | Android 14 | 412x915 | ⏳ |
| iPad Pro | iPadOS 18 | 1024x1366 | ⏳ |
| iPad Mini | iPadOS 18 | 768x1024 | ⏳ |

#### Touch Interactions
- [ ] Tap targets minimum 44x44px
- [ ] Swipe gestures (sidebar, carousel, lists)
- [ ] Pinch-to-zoom on graphs/charts
- [ ] Long-press actions (context menus)
- [ ] Pull-to-refresh on campaign lists
- [ ] Scroll performance (60fps target)

#### Mobile Navigation
- [ ] Hamburger menu functionality
- [ ] Bottom navigation bar (if present)
- [ ] Back button behavior (browser vs. app)
- [ ] Modal presentation (bottom sheet vs. full screen)
- [ ] Sticky header behavior on scroll

### 2. Visual Editor on Mobile

- [ ] Drag and drop elements (touch vs. mouse)
- [ ] Element selection via touch
- [ ] Context menu positioning (avoid screen edges)
- [ ] Zoom in/out for precision editing
- [ ] Undo/redo gesture support

### 3. Campaign Preview on Mobile

- [ ] Responsive preview modes
- [ ] Device frame simulation
- [ ] Orientation change handling (portrait ↔ landscape)
- [ ] Preview URL sharing (QR code generation)

### 4. Push Notifications (if applicable)

- [ ] Campaign status change notifications
- [ ] Statistical significance reached alerts
- [ ] Weekly/monthly report notifications
- [ ] Notification permission request flow
- [ ] Deep linking from notifications to specific campaigns

### 5. Offline Behavior

- [ ] Data caching during network issues
- [ ] Queue actions for sync when online
- [ ] Offline indicator/banner
- [ ] Graceful degradation of features

### 6. Performance on Mobile Networks

- [ ] 3G network simulation
- [ ] 4G/LTE network simulation
- [ ] Slow connection handling
- [ ] Data usage optimization
- [ ] Image/video lazy loading

### 7. Mobile-Specific Features

- [ ] Camera access (if QR scanning present)
- [ ] GPS/Geolocation (if geo-targeting present)
- [ ] Vibration API (notification feedback)
- [ ] Share API (share reports via native share)
- [ ] Add to Home Screen (PWA functionality)

---

## 📮 PostmanKaka - API Testing Plan

### 1. Authentication APIs

#### POST /auth/login
```json
{
  "email": "user@vwo.com",
  "password": "securePassword123",
  "rememberMe": true
}
```
- [ ] Valid credentials → 200 + JWT token
- [ ] Invalid email format → 400 Bad Request
- [ ] Wrong password → 401 Unauthorized
- [ ] Missing required fields → 422 Validation Error
- [ ] Rate limiting (5 attempts per minute)
- [ ] Response headers (X-RateLimit-Remaining)

#### POST /auth/register
- [ ] Valid registration → 201 Created
- [ ] Duplicate email → 409 Conflict
- [ ] Weak password → 422 Validation Error
- [ ] Email verification trigger

#### POST /auth/refresh-token
- [ ] Valid refresh token → 200 + new JWT
- [ ] Expired refresh token → 401 Unauthorized
- [ ] Token rotation (old token invalidated)

#### POST /auth/forgot-password
- [ ] Valid email → 200 + email sent
- [ ] Non-existent email → 200 (security - don't reveal)
- [ ] Rate limiting (1 request per hour)

### 2. Campaign APIs

#### GET /api/campaigns
- [ ] List all campaigns → 200 + paginated array
- [ ] Filter by status (running, paused, draft)
- [ ] Filter by date range
- [ ] Sort by created_at, name, status
- [ ] Pagination (limit/offset)
- [ ] Search by campaign name
- [ ] Authorization: only user's campaigns

#### POST /api/campaigns
```json
{
  "name": "Homepage CTA Test",
  "type": "ab",
  "url": "https://example.com",
  "targeting": {
    "pattern": "exact",
    "value": "https://example.com"
  },
  "variations": [
    {
      "name": "Control",
      "traffic": 50
    },
    {
      "name": "Variation 1",
      "traffic": 50,
      "changes": [...]
    }
  ],
  "goals": [
    {
      "type": "visit",
      "url": "https://example.com/thank-you"
    }
  ]
}
```
- [ ] Valid creation → 201 + campaign object
- [ ] Invalid JSON → 400 Bad Request
- [ ] Missing required fields → 422
- [ ] Invalid URL format → 422
- [ ] Traffic allocation != 100% → 422
- [ ] Duplicate campaign name → 409

#### GET /api/campaigns/{id}
- [ ] Valid ID → 200 + campaign details
- [ ] Invalid ID format → 400
- [ ] Non-existent ID → 404
- [ ] Other user's campaign → 403 Forbidden

#### PUT /api/campaigns/{id}
- [ ] Update name, targeting, variations
- [ ] Cannot modify running campaign's URL
- [ ] Partial updates (PATCH vs PUT)

#### DELETE /api/campaigns/{id}
- [ ] Soft delete (archive) → 200
- [ ] Hard delete with data cleanup → 200
- [ ] Delete running campaign warning
- [ ] Cascade delete (variations, goals, data)

#### POST /api/campaigns/{id}/start
- [ ] Start draft campaign → 200
- [ ] Start already running → 409
- [ ] Start without valid goals → 422

#### POST /api/campaigns/{id}/pause
- [ ] Pause running → 200
- [ ] Pause already paused → 409

#### POST /api/campaigns/{id}/stop
- [ ] Stop campaign → 200
- [ ] Finalize data collection
- [ ] Generate final report

### 3. Campaign Data & Reporting APIs

#### GET /api/campaigns/{id}/stats
```json
{
  "campaign_id": "12345",
  "period": "last_7_days",
  "metrics": {
    "visitors": 10000,
    "conversions": 500,
    "conversion_rate": 5.0,
    "revenue": 15000.00
  },
  "variations": [
    {
      "id": "var_1",
      "name": "Control",
      "visitors": 5000,
      "conversions": 200,
      "conversion_rate": 4.0
    },
    {
      "id": "var_2",
      "name": "Variation 1",
      "visitors": 5000,
      "conversions": 300,
      "conversion_rate": 6.0,
      "lift": 50.0,
      "significance": 95.5
    }
  ]
}
```
- [ ] Real-time data aggregation
- [ ] Statistical significance calculation
- [ ] Filter by date range
- [ ] Filter by segment (device, location, browser)
- [ ] Caching strategy (ETag, Last-Modified)

#### GET /api/campaigns/{id}/heatmap
- [ ] Click coordinates aggregation
- [ ] Scroll depth data
- [ ] Filter by page variation
- [ ] Time-based filtering

### 4. Integration APIs

#### POST /api/integrations/google-analytics
- [ ] Valid GA tracking ID → 200
- [ ] Connection verification
- [ ] Data sync configuration
- [ ] Disconnect functionality

#### POST /api/webhooks
```json
{
  "url": "https://myapp.com/vwo-webhook",
  "events": ["campaign.started", "campaign.completed", "goal.achieved"],
  "secret": "webhook_secret_key"
}
```
- [ ] Valid webhook → 201
- [ ] Webhook signature verification (HMAC)
- [ ] Retry mechanism (exponential backoff)
- [ ] Webhook delivery logs

### 5. User Management APIs

#### GET /api/users
- [ ] List team members (admin only)
- [ ] Role-based filtering
- [ ] Search by name/email

#### POST /api/users/invite
- [ ] Invite by email → 201
- [ ] Duplicate invite handling
- [ ] Invitation link expiration (7 days)
- [ ] Role assignment (admin, editor, viewer)

#### PUT /api/users/{id}/role
- [ ] Update role → 200
- [ ] Prevent self-demotion from admin
- [ ] Role hierarchy enforcement

### 6. API Testing Scenarios

#### Rate Limiting
- [ ] Identify rate limits per endpoint
- [ ] Test 429 Too Many Requests response
- [ ] Rate limit headers (X-RateLimit-Limit, X-RateLimit-Reset)
- [ ] Different limits per plan (Free, Growth, Pro)

#### Pagination
- [ ] Default page size
- [ ] Custom page size (max 100)
- [ ] Total count in response
- [ ] Next/previous page links
- [ ] Page number beyond range

#### Filtering & Sorting
- [ ] Single filter parameter
- [ ] Multiple filter parameters combined
- [ ] Sort ascending/descending
- [ ] Sort by multiple fields
- [ ] Invalid filter values → 400

#### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request failed validation",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  }
}
```
- [ ] Consistent error format across all endpoints
- [ ] Proper HTTP status codes
- [ ] Error logging and monitoring

### 7. API Security Testing

- [ ] SQL Injection attempts on all inputs
- [ ] XSS attempts in campaign names/descriptions
- [ ] CSRF token validation
- [ ] Content-Type validation
- [ ] Request size limits
- [ ] CORS configuration
- [ ] API versioning (v1, v2 in URL or header)
- [ ] OAuth 2.0 flow (if third-party integrations)

### 8. Async Operations

- [ ] Campaign data export (CSV/Excel)
- [ ] Report generation (PDF)
- [ ] Bulk operations (bulk pause/delete)
- [ ] Job status polling endpoints
- [ ] Webhook notifications on completion

---

## ⚡ Munna - Performance Testing Plan

### 1. Load Testing Scenarios

#### Scenario A: Normal Traffic (Baseline)
- Concurrent Users: 500
- Ramp-up Time: 5 minutes
- Duration: 30 minutes
- Target RPS: 1000

#### Scenario B: Peak Traffic (Marketing Campaign)
- Concurrent Users: 2000
- Ramp-up Time: 10 minutes
- Duration: 1 hour
- Target RPS: 5000

#### Scenario C: Stress Testing (Breaking Point)
- Start with 100 users
- Increase by 100 every 2 minutes
- Continue until errors > 5% or response time > 5s
- Identify maximum capacity

#### Scenario D: Spike Testing (Sudden Traffic)
- Sudden increase from 100 to 5000 users in 30 seconds
- Maintain for 5 minutes
- Sudden drop back to 100 users
- Measure recovery time

### 2. Key Performance Metrics

#### Response Time SLAs
| Operation | p50 | p95 | p99 | Max |
|-----------|-----|-----|-----|-----|
| Page Load (Dashboard) | <1s | <2s | <3s | <5s |
| API Response (GET) | <200ms | <500ms | <1s | <2s |
| API Response (POST) | <300ms | <600ms | <1.2s | <3s |
| Campaign Creation | <2s | <4s | <6s | <10s |
| Report Generation | <3s | <8s | <15s | <30s |
| Login Authentication | <500ms | <1s | <2s | <3s |

#### Throughput Targets
- Dashboard page loads: 500/sec
- Campaign API CRUD: 200/sec
- Real-time analytics updates: 1000 events/sec
- Report generation: 50/minute
- User authentication: 300/sec

#### Resource Utilization Limits
- CPU Usage: <70% average
- Memory Usage: <80%
- Database Connections: <80% of pool
- Disk I/O: <50MB/s
- Network I/O: <100MB/s

### 3. Critical User Journeys (CUJ)

#### CUJ 1: User Login → Dashboard → Campaign Creation
```
1. GET /login (load login page)
2. POST /auth/login (authenticate)
3. GET /dashboard (load dashboard)
4. GET /api/campaigns (list existing)
5. POST /api/campaigns (create new)
6. GET /api/campaigns/{id}/preview (preview campaign)
```

#### CUJ 2: Real-time Analytics Viewing
```
1. GET /api/campaigns/{id}/stats (load stats)
2. WebSocket connection for live updates
3. GET /api/campaigns/{id}/heatmap (load heatmap data)
4. Multiple concurrent analytics requests
```

#### CUJ 3: Team Collaboration
```
1. GET /api/users (list team)
2. POST /api/users/invite (send invite)
3. PUT /api/users/{id}/role (update role)
4. Multiple admin operations simultaneously
```

### 4. Database Performance

#### Query Performance
- [ ] Campaign list query (with filters) <500ms
- [ ] Stats aggregation query <2s
- [ ] User lookup by email <100ms
- [ ] Heatmap data retrieval <3s
- [ ] Report generation queries <10s

#### Connection Pool
- [ ] Max connections: 100
- [ ] Connection timeout: 30s
- [ ] Connection leaks detection
- [ ] Connection pool exhaustion handling

#### Caching Strategy
- [ ] Redis cache hit rate >90%
- [ ] Campaign metadata caching (TTL: 5 min)
- [ ] User session caching (TTL: 30 min)
- [ ] Report result caching (TTL: 1 hour)
- [ ] Cache invalidation on updates

### 5. Static Asset Performance

- [ ] JS bundle size <500KB (gzip)
- [ ] CSS bundle size <100KB (gzip)
- [ ] Image optimization (WebP format)
- [ ] CDN delivery (CloudFlare/AWS CloudFront)
- [ ] Browser caching headers
- [ ] Lazy loading for below-fold content
- [ ] Code splitting by route

### 6. Monitoring & Alerting

#### Application Performance Monitoring (APM)
- [ ] New Relic / Datadog / Dynatrace integration
- [ ] Transaction traces for slow requests
- [ ] Error rate tracking
- [ ] Database query analysis
- [ ] External API call monitoring

#### Infrastructure Monitoring
- [ ] Server CPU/Memory/Disk metrics
- [ ] Load balancer health checks
- [ ] Auto-scaling triggers
- [ ] Container orchestration metrics (if K8s)

#### Alert Thresholds
- [ ] Response time p95 >3s for 5 minutes → Alert
- [ ] Error rate >1% for 2 minutes → Alert
- [ ] CPU usage >80% for 10 minutes → Alert
- [ ] Memory usage >85% → Alert
- [ ] Disk usage >90% → Critical Alert
- [ ] 5xx errors >10/minute → Critical Alert

---

## 📊 Test Execution Strategy

### Phase 1: Smoke Testing (Day 1)
- Basic functionality validation
- Critical path verification
- Login/logout flows
- Campaign creation basic flow

### Phase 2: Functional Testing (Days 2-5)
- All test cases from web/mobile/API plans
- Cross-browser testing
- Mobile responsive testing
- API endpoint validation

### Phase 3: Integration Testing (Day 6)
- End-to-end user journeys
- Third-party integrations (GA, Mixpanel)
- Webhook functionality
- Data synchronization

### Phase 4: Performance Testing (Days 7-8)
- Load testing with 500 concurrent users
- Stress testing to breaking point
- Spike testing scenarios
- Database performance validation

### Phase 5: Security Testing (Day 9)
- OWASP Top 10 validation
- Authentication/authorization testing
- Data encryption verification
- Penetration testing (if scope allows)

### Phase 6: Regression & UAT (Day 10)
- Full regression suite
- User Acceptance Testing
- Final bug verification
- Go/no-go decision

---

## 🎯 Success Criteria

### Functional
- [ ] 100% critical path test cases pass
- [ ] 95% of all test cases pass
- [ ] 0 critical/blocker bugs open
- [ ] 100% of high-priority bugs resolved

### Performance
- [ ] All response time SLAs met
- [ ] System stable at 2x normal load
- [ ] 99.9% uptime during testing
- [ ] No memory leaks over 24-hour period

### Security
- [ ] No OWASP Top 10 vulnerabilities
- [ ] All API endpoints authenticated
- [ ] Data encrypted in transit and at rest
- [ ] Input validation on all endpoints

### Compatibility
- [ ] Works on all target browsers
- [ ] Mobile responsive on all target devices
- [ ] API backward compatible (versioned)

---

## 🐛 Bug Severity Definitions

| Severity | Definition | Example |
|----------|-----------|---------|
| **Critical** | Complete blocker, system unusable | Login failure, campaign creation crash, data loss |
| **High** | Major feature broken, workaround difficult | Report generation fails, API returns 500, mobile app crash |
| **Medium** | Feature partially broken, workaround exists | Sorting not working, date filter incorrect, slow performance |
| **Low** | Minor issue, cosmetic, enhancement | UI misalignment, typo, missing tooltip |

---

*Test Plan Created by Testing Family*
*🤖 RamuKaka | 🕸️ GanguBhai | 📱 Chotu | ⚡ Munna | 📮 PostmanKaka*
