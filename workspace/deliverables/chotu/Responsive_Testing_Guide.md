# Responsive Testing Guide — app.vwo.com

**Agent:** Chotu 📱  
**Scope:** Breakpoint behavior, fluid layouts, mobile-first validation

---

## 1. Breakpoints

| Name | Width | Target Devices | Key Changes |
|---|---|---|---|
| Mobile Small | 320px | iPhone SE, old Android | Single column, hamburger, stacked cards |
| Mobile | 375px | iPhone 14/15 standard | 16px base font, 44px touch targets |
| Mobile Large | 428px | iPhone 15 Pro Max | Slightly wider cards |
| Tablet | 768px | iPad Mini, tablets | 2-column grid, visible sidebar |
| Desktop Small | 1024px | iPad Pro landscape | Full layout, reduced padding |
| Desktop | 1440px | Standard monitors | Optimal layout |
| Desktop Large | 1920px+ | External monitors | Max-width container (1400px) |

---

## 2. Test Checklist Per Breakpoint

### Layout
- [ ] No horizontal scroll (`overflow-x: hidden` enforced)
- [ ] Content readable without zoom (font-size ≥12px)
- [ ] Images scale proportionally (`max-width: 100%`)
- [ ] Tables scroll horizontally if needed (not squashed)

### Navigation
- [ ] Hamburger menu below 768px
- [ ] Sidebar visible above 768px
- [ ] Breadcrumb truncated with ellipsis on mobile
- [ ] Footer links collapse to accordion on mobile

### Forms
- [ ] Input fields full-width on mobile
- [ ] Date picker uses native mobile picker
- [ ] File upload triggers camera roll on mobile
- [ ] Error messages inline, not tooltips

### Touch
- [ ] All interactive elements ≥44×44px
- [ ] No hover-dependent features on touch devices
- [ ] Swipe gestures where expected (lists, carousels)
- [ ] Pinch-zoom disabled where it breaks UI (editor)

---

## 3. Common Failures

| Issue | Detection | Fix |
|---|---|---|
| 100vh bug on iOS | Content hidden behind bottom nav | Use `-webkit-fill-available` or JS calc |
| Fixed elements on zoom | Header/footer overlap content | Use `position: sticky` not `fixed` |
| Font inflation on Android | Text renders larger than specified | `text-size-adjust: 100%` |
| Hover menus on mobile | No way to access dropdown | Add click toggle for touch |

---

## 4. Tools

- **Chrome DevTools:** Device emulation, throttling
- **Playwright:** Automated breakpoint testing (see GanguBhai)
- **BrowserStack:** Real device screenshots per breakpoint
- **Lighthouse:** Mobile score audit

---

## 5. Automation

Use GanguBhai's `responsive.spec.ts` (Playwright) for regression. Add new breakpoints as needed.

---

📱 *Chotu: "Break it at 320px, and it'll break nowhere else."*
