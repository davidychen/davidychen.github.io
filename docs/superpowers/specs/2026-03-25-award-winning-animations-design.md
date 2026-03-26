# Award-Winning Animation Effects — Design Spec

**Date:** 2026-03-25
**Branch:** `feature/award-winning-animations`
**Personality:** Refined & Subtle — smooth, understated motion felt more than seen

## Overview

Add 7 award-winning animation effects to the portfolio site using a GSAP-centric approach. Replace the existing Intersection Observer animation system with GSAP ScrollTrigger as the single animation engine. Add Lenis for smooth scroll. All effects tuned for a professional, premium feel.

## Library Stack

| Library | Purpose | Source |
|---------|---------|--------|
| GSAP Core | Animation engine | Already in node_modules |
| GSAP ScrollTrigger | Scroll-based animation triggers | GSAP plugin (free) |
| GSAP SplitText | Hero text word-level splitting | GSAP plugin (free) |
| Lenis | Smooth scroll with inertia | Already in node_modules |
| vanilla-tilt.js | 3D parallax tilt on hover | Already in node_modules |

All libraries are already installed in `node_modules/`. Minified dist files will be **copied to `assets/plugins/`** (matching the existing plugin pattern) so the site works without a build step on GitHub Pages.

## File Changes

### Modified Files

- **`index.html`** — Add preloader markup, cursor elements, GSAP/Lenis script tags, update data attributes
- **`assets/js/main.js`** — Full rewrite of animation system: replace IO with GSAP ScrollTrigger, add all 7 effects
- **`assets/css/theme-0.css`** — Add preloader styles, cursor styles, initial animation states; remove old IO keyframes

### What Gets Removed

- `initScrollAnimations()` function (Intersection Observer) → replaced by GSAP ScrollTrigger
- `initSectionTransitions()` function → replaced by GSAP ScrollTrigger
- jQuery scrollTo plugin usage → replaced by Lenis `scrollTo()`
- CSS `@keyframes` for scroll animations (fade-up, fade-left, etc.) → GSAP handles inline
- `data-animate` HTML attributes → replaced by GSAP class/element selectors

### What Stays Unchanged

- Particle canvas (`initParticles()`) — independent system, keep as-is
- CSS blob/geometric shape animations — decorative, keep
- Isotope portfolio filtering — separate concern
- SimpleLightbox — separate concern
- Bootstrap grid system — layout unchanged
- Video backgrounds — untouched
- Scrollspy (Bootstrap) — keep, but requires Lenis integration: call `$('[data-spy="scroll"]').scrollspy('refresh')` inside Lenis `scroll` callback so Bootstrap receives updated scroll position. Lenis dispatches native `scroll` events on `window` by default, so Scrollspy should continue to work, but `refresh` ensures accuracy after Lenis transforms.
- External link handling — keep

---

## Effect Specifications

### G. Preloader + Entrance Sequence

**HTML:** New `<div class="preloader">` as first child of `<body>`, positioned fixed, z-index 10000, background `#0c0c1d`. Contains a `<span class="preloader-counter">0</span>` centered on screen.

**Timeline (total ~3s):**

| Time | Action | Details |
|------|--------|---------|
| 0 → 1.5s | Counter animates 0→100% | Font: Inter 700, 48px, white. Easing: `power2.inOut`. Uses GSAP `onUpdate` to set textContent |
| 1.5 → 2.0s | Overlay slides up | `yPercent: -100`, easing: `power4.inOut`. Set `display: none` after |
| 2.0 → 2.4s | Profile image appears | `opacity: 0→1, scale: 0.8→1`, easing: `power2.out` |
| 2.3 → 2.8s | Hero h1 split text reveal | Words slide up from mask, stagger: 0.08s, easing: `power3.out` |
| 2.6 → 3.0s | Supporting elements | Subtitle, profile paragraph, top bar, contact info fade up (`y: 20→0, opacity: 0→1`) |

**Body scroll locked during preloader** via `overflow: hidden` on `<html>`, removed after timeline completes.

### A. Split Text Reveal (Hero Only)

**Targets:** `h1.name` ("David Chen"), `.title` (subtitle)

**Implementation:**
- GSAP SplitText splits into `type: "words"`
- Each word auto-wrapped in `overflow: hidden` mask div
- Words animate from `yPercent: 100, opacity: 0` → `yPercent: 0, opacity: 1`
- Stagger: `0.08s` between words
- Duration: `0.8s` per word
- Easing: `power3.out`
- Triggered as part of preloader entrance timeline (not scroll-based)
- Initial state: hero text hidden via CSS `visibility: hidden` (prevents FOUC)

### E. Smooth Scroll (Lenis)

**Configuration:**
```
duration: 1.2
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))  // exponential ease-out
orientation: 'vertical'
smoothWheel: true
touchMultiplier: 2
```

**Integration:**
- `lenis.on('scroll', ScrollTrigger.update)` — sync with GSAP
- `gsap.ticker.add((time) => lenis.raf(time * 1000))` — use GSAP RAF loop
- `gsap.ticker.lagSmoothing(0)` — prevent lag compensation conflicts
- Anchor links: `lenis.scrollTo(target, { offset: -60 })` replaces jQuery scrollTo

**Mobile:** `smoothWheel` disabled on touch devices via `(hover: hover)` media query check. Native scroll preserved for touch.

### F. Custom Cursor (Dot + Ring)

**HTML:** Two divs appended to `<body>`:
```html
<div class="cursor-dot"></div>
<div class="cursor-ring"></div>
```

**Dot (inner):**
- Size: 6px circle, background: white
- Position: exact mouse position via `gsap.quickTo()` (duration: 0.1s)
- `pointer-events: none`, `position: fixed`, `z-index: 9999`

**Ring (outer):**
- Size: 36px circle, border: `1.5px solid rgba(255,255,255,0.5)`, no fill
- Position: follows with lerp delay via `gsap.quickTo()` (duration: 0.35s, ease: `power2.out`)
- `pointer-events: none`, `position: fixed`, `z-index: 9998`

**Hover states:**
- Links/buttons (`a, button, .btn`): ring scales to 1.5×, border opacity drops to 0.2
- Project cards (`.item`): ring scales to 2×, no text overlay (keep it minimal)
- Click anywhere: brief pulse (ring scale 0.8→1, duration: 0.3s)

**CSS:** `cursor: none` on `body` when custom cursor is active.

**Mobile:** Completely disabled. Check `window.matchMedia('(hover: hover)')`. If no hover capability, don't create cursor elements, don't set `cursor: none`.

### B. Magnetic Buttons

**Targets:** `.btn`, `#page-nav-wrapper a`, `.social a`, `#filters .type`

**Behavior:**
- On `mouseenter`: start tracking mouse position
- On `mousemove`: calculate offset from element center, apply `transform: translate(x, y)` where `x = (mouseX - centerX) * 0.3`, `y = (mouseY - centerY) * 0.3`
- Follow easing: `gsap.to()` with `power3.out`, duration: `0.3s`
- On `mouseleave`: animate back to `translate(0, 0)` with `elastic.out(1, 0.3)`, duration: `0.7s`
- Movement capped at 30% of element dimensions

**Mobile:** Disabled on touch devices. No effect.

### C. Staggered Grid Cards

**Targets:** Portfolio `.item` elements, `.education-card`, `.impact-card`

**Animation:**
- Initial state (CSS): `opacity: 0, transform: translateY(40px)`
- Animate to: `opacity: 1, y: 0`
- Stagger: `{ each: 0.1, from: "start" }`
- Duration: `0.6s` per card
- Easing: `power2.out`

**ScrollTrigger config:**
- `trigger`: parent container (`.isotope`, education row, impact row)
- `start: "top 85%"`
- `toggleActions: "play none none none"` — plays once, never reverses

### J. Parallax Tilt Cards

**Targets:** Portfolio `.item-inner`, `.education-card`

**vanilla-tilt.js config:**
```
max: 5          // max tilt degrees (very subtle)
speed: 400      // transition speed ms
glare: true
max-glare: 0.08 // barely visible light reflection
perspective: 1000
scale: 1.02     // tiny scale on hover
```

**Mobile:** Disabled by default — vanilla-tilt ignores touch devices. Cards keep existing CSS hover effects.

### Scroll Reveal Animations (IO Replacement)

All existing `data-animate` elements migrated to GSAP ScrollTrigger:

| Animation | From | To | Duration | Easing |
|-----------|------|-----|----------|--------|
| Fade-up | `y: 30, opacity: 0` | `y: 0, opacity: 1` | 0.8s | `power2.out` |
| Fade-left | `x: -40, opacity: 0` | `x: 0, opacity: 1` | 0.8s | `power2.out` |
| Fade-right | `x: 40, opacity: 0` | `x: 0, opacity: 1` | 0.8s | `power2.out` |
| Scale-in | `scale: 0.95, opacity: 0` | `scale: 1, opacity: 1` | 0.6s | `power2.out` |

All triggers: `start: "top 85%"`, play once. Experience timeline items get `stagger: 0.15s`.

---

## Global Design Tokens

### Easing Palette
- **Entrance:** `power2.out` — default for reveals
- **Exit:** `power2.in` — for elements leaving
- **Dramatic:** `power4.inOut` — preloader overlay
- **Spring:** `elastic.out(1, 0.3)` — magnetic button return

### Duration Scale
- **Fast (hover):** 0.3s
- **Base (reveals):** 0.6–0.8s
- **Slow (preloader):** 1.5s
- **Stagger gap:** 0.08–0.15s

---

## Performance Considerations

- All animations use `transform` and `opacity` only (GPU-composited, no layout triggers)
- Lenis smooth scroll disabled on touch devices to preserve native performance
- Custom cursor disabled on touch devices
- Magnetic buttons disabled on touch devices
- vanilla-tilt auto-disabled on touch devices
- ScrollTrigger `once: true` pattern — animations don't re-trigger, reducing scroll handler work
- Preloader prevents layout shift by hiding content until entrance sequence
- GSAP `will-change` management handled automatically
- **Graceful degradation:** If GSAP fails to load, all animated elements should still be visible (initial CSS states use `opacity: 0` but a `<noscript>` fallback and `.no-js` body class override ensures content shows). Preloader has a CSS-only timeout fallback (`animation-delay` that auto-hides after 5s).

## Script Loading Order

```html
<!-- After existing plugins, before main.js -->
<script src="assets/plugins/gsap/gsap.min.js"></script>
<script src="assets/plugins/gsap/ScrollTrigger.min.js"></script>
<script src="assets/plugins/gsap/SplitText.min.js"></script>
<script src="assets/plugins/lenis/lenis.min.js"></script>
<script src="assets/plugins/vanilla-tilt/vanilla-tilt.min.js"></script>
```

GSAP plugins registered at top of `main.js`:
```js
gsap.registerPlugin(ScrollTrigger, SplitText);
```
