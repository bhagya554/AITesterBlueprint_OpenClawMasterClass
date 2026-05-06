# Mobile Test Strategy — app.vwo.com

**Agent:** Chotu 📱  
**Project:** VWO Web (Mobile-First Validation)  
**Scope:** Responsive web, PWA capabilities, touch interactions, device-specific behaviors

---

## 1. Objectives

- Validate mobile web experience across real device OS versions
- Ensure touch targets meet WCAG 2.1 (44×44dp minimum)
- Verify PWA manifest, service worker, offline behavior
- Test native-like gestures: swipe, pinch, pull-to-refresh
- Validate viewport handling and orientation changes

---

## 2. Test Levels

| Level | Focus | Tools |
|---|---|---|
| Smoke | Mobile page loads, no crashes, touch works | Real devices + emulators |
| Functional | Forms, navigation, campaign creation on mobile | Appium + Playwright mobile |
| Responsive | Breakpoint behavior: 320px to 768px | Chrome DevTools + real devices |
| Performance | Mobile Lighthouse, 3G throttling | Lighthouse CI |
| PWA | Install prompt, offline, push notifications | Chrome DevTools + manual |

---

## 3. Device Coverage

See `Device_Matrix.csv` for full list.

**Tier-1 (Must Pass):**
- iPhone 15 Pro / iOS 17 (Safari)
- iPhone 14 / iOS 16 (Safari)
- Samsung Galaxy S24 / Android 14 (Chrome)
- Google Pixel 8 / Android 14 (Chrome)
- iPad Pro / iPadOS 17 (Safari)

**Tier-2 (Should Pass):**
- iPhone SE (3rd gen) / small viewport
- Samsung Galaxy A54 / mid-range performance
- Xiaomi Redmi Note / MIUI browser quirks

---

## 4. In-Scope Modules

1. **Login/Auth** — Touch-friendly inputs, biometric auth (Face ID / fingerprint)
2. **Dashboard** — Scroll performance, card stacking, hamburger menu
3. **Campaign List** — Swipe actions, infinite scroll, pull-to-refresh
4. **Visual Editor** — Touch-based element selection (if supported on mobile)
5. **Reports** — Chart pinch-to-zoom, date picker usability
6. **Settings** — Toggle switches, file upload (camera roll)

---

## 5. Gesture Test Cases

| Gesture | Application | Pass Criteria |
|---|---|---|
| Tap | Button activation | Immediate feedback, no 300ms delay |
| Swipe left | Campaign archive/delete | Action reveals, no accidental triggers |
| Swipe right | Navigation drawer | Smooth 60fps animation |
| Pinch | Report chart zoom | Zoom centers on pinch point |
| Pull down | Refresh campaign list | Spinner visible, data updates |
| Long press | Context menu | Haptic feedback on supported devices |

---

## 6. Automation Stack

| Layer | Technology |
|---|---|
| Framework | Appium 2.x + WebDriverIO |
| Cloud | BrowserStack / Sauce Labs |
| Local | Android Emulator + iOS Simulator |
| CI | GitHub Actions with cloud grid |
| Reporting | Allure |

---

## 7. PWA Checklist

- [ ] `/manifest.json` valid and linked
- [ ] Service worker registered
- [ ] Offline page cached (fallback)
- [ ] Add to Home Screen prompt triggers
- [ ] Icons in all required sizes (192px, 512px)
- [ ] Theme color matches branding
- [ ] Standalone mode hides browser chrome
- [ ] Push notification permission flow tested

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| iOS Safari quirks (bounce scroll, 100vh) | Dedicated iOS test suite, viewport-unit-fix |
| Android fragmentation | Test on Samsung + Pixel + Xiaomi |
| Slow networks | 3G/4G throttling in tests |
| Touch vs mouse detection | Appium touch actions, not click() |

---

## 9. Sign-Off

📱 *Chotu: "Found 1 bug already — /login direct URL empty. GanguBhai missed that!"*