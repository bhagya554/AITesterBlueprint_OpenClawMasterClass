# Web Test Strategy — app.vwo.com

**Agent:** GanguBhai 🕸️  
**Project:** VWO (Visual Website Optimizer)  
**URL:** https://app.vwo.com  
**Date:** 2026-05-06  
**Scope:** Web Application Smoke → E2E → Regression

---

## 1. Objectives

- Validate core user journeys: Login → Dashboard → Campaign Management → Reporting
- Ensure cross-browser compatibility across Tier-1 & Tier-2 browsers
- Catch visual regressions, console errors, and broken redirects
- Verify accessibility (WCAG 2.1 AA) and responsive breakpoints

---

## 2. Test Levels

| Level | Focus | Tools |
|---|---|---|
| Smoke | Page loads, no 5xx, critical paths | Playwright + manual spot-checks |
| Functional | Form validation, CRUD, auth flows | Playwright E2E |
| Regression | Full suite on staging pre-release | CI pipeline |
| Visual | UI pixel-match across viewports | Playwright screenshots + manual |
| Accessibility | Keyboard nav, ARIA, color contrast | axe-core + Lighthouse |

---

## 3. In-Scope Modules

1. **Authentication** — Login, Logout, SSO, Session expiry, 2FA
2. **Dashboard** — Load widgets, navigation, role-based menus
3. **Campaigns** — Create, edit, pause, archive A/B tests
4. **Editor** — Visual editor loads, element selection, variant preview
5. **Reports** — Data rendering, date filters, export CSV/PDF
6. **Settings** — Account, billing, team member invites
7. **Integrations** — Webhook health, third-party tiles load

---

## 4. Out-of-Scope

- Backend-only API tests → delegated to PostmanKaka 📮
- Native mobile apps → delegated to Chotu 📱
- Load/performance benchmarks → delegated to Munna ⚡

---

## 5. Browser Matrix

See `Cross_Browser_Matrix.csv` for detailed version coverage.

**Tier-1 (Must Pass):**
- Chrome (latest, latest-1)
- Firefox (latest, latest-1)
- Safari (latest macOS + iOS)
- Edge (latest)

**Tier-2 (Should Pass):**
- Chrome (Android)
- Safari (iPad)
- Firefox ESR

---

## 6. Automation Stack

| Layer | Technology |
|---|---|
| Framework | Playwright (TypeScript) |
| CI | GitHub Actions |
| Reporting | Allure + HTML |
| Parallelism | Sharded workers (4x) |
| Screenshots | On failure + baseline diff |

---

## 7. Entry & Exit Criteria

**Entry:**
- Staging environment deployed and tagged
- Smoke tests green
- Test data seeded

**Exit:**
- 100% smoke tests pass
- ≤2 critical/severity-1 bugs open
- All Tier-1 browsers green
- Accessibility score ≥90 on Lighthouse

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Visual editor is canvas-heavy | Dedicated canvas interaction helpers in Playwright |
| Third-party widgets flaky | Mock or retry-wrapped assertions |
| SSO redirects cross-domain | Storage state + origin isolation handling |

---

## 9. Sign-Off

🕸️ GanguBhai: *"If it loads, I break it. If it breaks, I log it."*

---

## Related Deliverables
- `E2E_Test_Cases.md` — Detailed test case catalog
- `Cross_Browser_Matrix.csv` — Browser/device coverage matrix
- `Playwright_Automation_Scripts/` — Executable test suite
