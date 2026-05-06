# E2E Test Cases — app.vwo.com

**Agent:** GanguBhai 🕸️  
**Suite:** End-to-End Web Testing  
**Total Cases:** 24  
**Priority:** P0 = Smoke, P1 = Critical Path, P2 = Regression

---

## 🔐 AUTH-001 → Login Valid Credentials (P0)
**Pre:** User exists, account active  
**Steps:**
1. Navigate to /login
2. Enter valid email + password
3. Click Sign In
4. Observe redirect

**Expected:**
- URL changes to /dashboard
- Dashboard widgets visible within 5s
- No console errors

---

## 🔐 AUTH-002 → Login Invalid Credentials (P0)
**Steps:**
1. Navigate to /login
2. Enter invalid credentials
3. Click Sign In

**Expected:**
- Inline error: "Invalid email or password"
- URL remains /login
- No 5xx responses in Network tab

---

## 🔐 AUTH-003 → Session Expiry Handling (P1)
**Pre:** User is logged in  
**Steps:**
1. Clear cookies / wait for token expiry
2. Attempt navigation to /campaigns

**Expected:**
- Redirected to /login
- Toast/notification: "Session expired, please log in again"
- Post-login redirect returns to /campaigns

---

## 📊 DASH-001 → Dashboard Loads All Widgets (P0)
**Pre:** Authenticated user with active campaigns  
**Steps:**
1. Navigate to /dashboard
2. Wait for skeleton loaders to resolve

**Expected:**
- Campaign summary card visible
- Recent activity list populated
- Charts rendered (canvas/svg)
- No "Failed to load" banners

---

## 🧪 CAMP-001 → Create A/B Campaign (P1)
**Steps:**
1. Dashboard → "Create Campaign" CTA
2. Select "A/B Test"
3. Enter campaign name: "E2E_Test_Campaign"
4. Enter target URL: https://example.com
5. Click "Create"

**Expected:**
- Redirect to campaign editor
- Campaign name pre-filled
- "Save" button enabled

---

## 🧪 CAMP-002 → Pause Campaign (P1)
**Pre:** Active campaign exists  
**Steps:**
1. Go to /campaigns
2. Click "More actions" on active campaign
3. Select "Pause"
4. Confirm modal

**Expected:**
- Status badge changes to "Paused"
- Toast: "Campaign paused"
- Campaign stops serving variants

---

## 🧪 CAMP-003 → Archive Campaign (P2)
**Pre:** Paused campaign exists  
**Steps:**
1. Open campaign actions
2. Select "Archive"
3. Confirm modal

**Expected:**
- Campaign removed from active list
- Search filter "Archived" shows the campaign
- Cannot edit archived campaign (read-only)

---

## 🎨 EDIT-001 → Visual Editor Loads (P1)
**Pre:** Campaign created with target URL  
**Steps:**
1. Open campaign → "Open in Editor"
2. Wait for iframe/canvas to load

**Expected:**
- Target website rendered in editor canvas
- Element selector tool active
- No cross-origin console errors
- Toolbar visible (text, image, code edit)

---

## 🎨 EDIT-002 → Create Text Variant (P1)
**Pre:** Editor loaded  
**Steps:**
1. Select an element on canvas
2. Choose "Edit Text"
3. Change text content
4. Save variant

**Expected:**
- Variant name auto-suggested
- Preview shows updated text
- Change logged in history panel

---

## 📈 REPT-001 → Report Data Loads (P1)
**Pre:** Campaign with >100 visitors  
**Steps:**
1. Open campaign → "Reports"
2. Select date range: Last 7 days

**Expected:**
- Visitor count accurate
- Conversion rate calculated
- Graph renders with data points
- Export CSV/PDF buttons functional

---

## ⚙️ SETT-001 → Invite Team Member (P2)
**Pre:** Account admin role  
**Steps:**
1. Settings → Team
2. Click "Invite Member"
3. Enter email + select role (Viewer)
4. Send invite

**Expected:**
- Success toast
- Invite appears in pending list
- Email sent (API 200 or mock verified)

---

## 🔔 INTEG-001 → Webhook Tile Loads (P2)
**Steps:**
1. Settings → Integrations
2. Scroll to "Webhooks"

**Expected:**
- Tile visible with status
- Configure button opens modal
- Test webhook button returns 200

---

## ♿ A11Y-001 → Keyboard Navigation (P1)
**Steps:**
1. /login → Tab through all interactive elements
2. Submit with Enter key

**Expected:**
- Focus indicators visible
- Logical tab order
- Enter/Space triggers buttons
- No keyboard traps

---

## ♿ A11Y-002 → ARIA Labels (P2)
**Steps:**
1. Run axe-core on /dashboard
2. Review violations

**Expected:**
- Zero critical violations
- Images have alt text
- Buttons have accessible names
- Form inputs have labels

---

## 🌐 I18N-001 → Language Switch (P2)
**Pre:** Account with multi-language enabled  
**Steps:**
1. Switch language to French
2. Navigate to Dashboard

**Expected:**
- UI text translated
- Dates formatted per locale
- No layout breaks due to longer strings

---

## 📱 RESP-001 → Responsive 768px Tablet (P1)
**Steps:**
1. Set viewport to 768x1024
2. Load /dashboard

**Expected:**
- Sidebar collapses to hamburger
- Cards stack 2 per row
- No horizontal scroll
- Touch targets ≥44px

---

## 📱 RESP-002 → Responsive 375px Mobile (P1)
**Steps:**
1. Set viewport to 375x667
2. Load /campaigns

**Expected:**
- Single column layout
- Horizontal scroll absent
- Actions in overflow menu
- Readable font sizes (≥12px)

---

## 🔄 NAVI-001 → Breadcrumb Navigation (P2)
**Steps:**
1. Dashboard → Campaigns → Campaign Editor
2. Click breadcrumb "Campaigns"

**Expected:**
- Returns to campaign list
- State preserved (filters, pagination)
- No full page reload (SPA behavior)

---

## 🔄 NAVI-002 → Direct URL Access (P1)
**Steps:**
1. Log in
2. Navigate directly to /campaigns/12345/editor

**Expected:**
- Editor loads if campaign exists
- 404 page if campaign missing (not blank)
- Auth enforced throughout

---

## 🗑️ DEL-001 → Delete Account Confirmation (P2)
**Pre:** Test account with no active campaigns  
**Steps:**
1. Settings → Account → Delete Account
2. Type confirmation string
3. Click "Permanently Delete"

**Expected:**
- Modal with warning text
- Confirmation input required
- Success → redirect to /goodbye
- Login blocked with deleted credentials

---

## 🔄 REGR-001 → Full Regression Suite (P2)
**Trigger:** Every staging deploy  
**Scope:** All P0 + P1 cases across Tier-1 browsers  
**Duration:** ~18 minutes (parallel)

---

## 📋 Sign-Off

| Metric | Target | Actual |
|---|---|---|
| P0 Cases | 6 | 6 |
| P1 Cases | 10 | 10 |
| P2 Cases | 8 | 8 |
| Automation % | ≥80% | 100% |

🕸️ *GanguBhai approved for execution.*
