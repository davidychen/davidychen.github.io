# Award-Winning Animation Effects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 7 award-winning animation effects (preloader, split text, smooth scroll, custom cursor, magnetic buttons, staggered grid, parallax tilt) to the portfolio using GSAP as the single animation engine.

**Architecture:** Replace existing Intersection Observer animation system with GSAP ScrollTrigger. Add Lenis for smooth scroll, SplitText for hero text, vanilla-tilt for card hover effects. All new libraries copied from node_modules to assets/plugins/ for static serving.

**Tech Stack:** GSAP (core + ScrollTrigger + SplitText), Lenis, vanilla-tilt.js, vanilla JS, CSS

**Spec:** `docs/superpowers/specs/2026-03-25-award-winning-animations-design.md`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `assets/plugins/gsap/gsap.min.js` | GSAP core (copy from node_modules) |
| `assets/plugins/gsap/ScrollTrigger.min.js` | Scroll-based triggers (copy) |
| `assets/plugins/gsap/SplitText.min.js` | Text splitting (copy) |
| `assets/plugins/lenis/lenis.min.js` | Smooth scroll (copy) |
| `assets/plugins/vanilla-tilt/vanilla-tilt.min.js` | Card tilt effect (copy) |
| `index.html` | Add preloader markup, cursor divs, script tags; remove `data-animate` attrs |
| `assets/css/theme-0.css` | Add preloader/cursor/no-js styles; remove old IO animation CSS |
| `assets/js/main.js` | Full animation rewrite: GSAP ScrollTrigger, preloader, cursor, magnetic, tilt |

---

### Task 1: Copy Library Files to assets/plugins/

**Files:**
- Create: `assets/plugins/gsap/gsap.min.js`
- Create: `assets/plugins/gsap/ScrollTrigger.min.js`
- Create: `assets/plugins/gsap/SplitText.min.js`
- Create: `assets/plugins/lenis/lenis.min.js`
- Create: `assets/plugins/vanilla-tilt/vanilla-tilt.min.js`

- [ ] **Step 1: Create plugin directories and copy minified files**

```bash
mkdir -p assets/plugins/gsap assets/plugins/lenis assets/plugins/vanilla-tilt
cp node_modules/gsap/dist/gsap.min.js assets/plugins/gsap/
cp node_modules/gsap/dist/ScrollTrigger.min.js assets/plugins/gsap/
cp node_modules/gsap/dist/SplitText.min.js assets/plugins/gsap/
cp node_modules/@studio-freight/lenis/dist/lenis.min.js assets/plugins/lenis/ 2>/dev/null || cp node_modules/lenis/dist/lenis.min.js assets/plugins/lenis/
cp node_modules/vanilla-tilt/dist/vanilla-tilt.min.js assets/plugins/vanilla-tilt/
```

If the Lenis path doesn't match, check `ls node_modules/ | grep lenis` and find the correct dist path.

- [ ] **Step 2: Verify all files were copied**

```bash
ls -la assets/plugins/gsap/ assets/plugins/lenis/ assets/plugins/vanilla-tilt/
```

Expected: All 5 .min.js files present with non-zero sizes.

- [ ] **Step 3: Commit**

```bash
git add assets/plugins/gsap/ assets/plugins/lenis/ assets/plugins/vanilla-tilt/
git commit -m "chore: copy GSAP, Lenis, vanilla-tilt to assets/plugins for static serving"
```

---

### Task 2: Add Script Tags and Preloader/Cursor Markup to index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add script tags before main.js**

In `index.html`, find the line:
```html
    <!-- custom js -->
    <script src="assets/js/main.js"></script>
```

Insert these lines immediately **before** `<!-- custom js -->`:
```html
    <!-- Animation Libraries -->
    <script src="assets/plugins/gsap/gsap.min.js"></script>
    <script src="assets/plugins/gsap/ScrollTrigger.min.js"></script>
    <script src="assets/plugins/gsap/SplitText.min.js"></script>
    <script src="assets/plugins/lenis/lenis.min.js"></script>
    <script src="assets/plugins/vanilla-tilt/vanilla-tilt.min.js"></script>
```

- [ ] **Step 2: Add preloader as first child of `<body>`**

Immediately after `<body>`, add:
```html
    <!-- Preloader -->
    <div class="preloader">
        <span class="preloader-counter">0</span>
    </div>
```

- [ ] **Step 3: Add custom cursor elements before closing `</body>`**

Just before the `<!-- Javascript -->` comment, add:
```html
    <!-- Custom Cursor -->
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
```

- [ ] **Step 4: Add `no-js` class to `<html>` and `hero-hidden` to hero intro for FOUC prevention**

Change `<html lang="en">` to:
```html
<html lang="en" class="no-js">
```

Also add `hero-hidden` class to the intro div to prevent flash of unstyled hero before JS runs:
```html
<div class="intro hero-hidden">
```

- [ ] **Step 5: Remove `data-animate` and `data-delay` attributes from all elements**

Remove all `data-animate="fade-up"`, `data-animate="fade-left"`, `data-animate="fade-right"`, `data-animate="scale-in"`, and `data-delay="..."` attributes from every element in index.html. These are no longer needed since GSAP ScrollTrigger will target elements by CSS selectors instead.

Elements that have these attributes include:
- `#about-section` (fade-up)
- `#experiences-section` (fade-up)
- Timeline `.item` elements (fade-right, fade-left)
- `#impact-section` (fade-up), its `.col-*` children (fade-up + delays)
- `#education-section` (fade-up), its `.item` children (fade-up + delays)
- `#skills-section` (fade-up), its `.item` children (fade-up + delays)
- `.other-skills` (fade-up), `.skill-tag` elements (scale-in + delays)
- `#testimonials-section` (fade-up)
- `#portfolio-section` (fade-up)
- `#contact-section` (fade-up)

- [ ] **Step 6: Verify HTML is valid**

Open `index.html` in a browser (or use `python3 -m http.server 8080`) and check:
- Preloader div is present at top of body
- Cursor divs are present before scripts
- All 5 new script tags load (check network tab)
- No `data-animate` attributes remain (search the file)

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: add preloader, cursor markup, GSAP script tags; remove data-animate attrs"
```

---

### Task 3: Add Preloader, Cursor, and Graceful Degradation CSS to theme-0.css

**Files:**
- Modify: `assets/css/theme-0.css`

- [ ] **Step 1: Add no-js fallback at the top of the file (after `:root`)**

After the closing `}` of the `:root` block, add:
```css
/* ===== Graceful Degradation ===== */
html.no-js .preloader { display: none; }
html.no-js [data-animate],
html.no-js .section,
html.no-js .item,
html.no-js .impact-card,
html.no-js .skill-tag {
  opacity: 1 !important;
  transform: none !important;
}
```

- [ ] **Step 2: Add preloader CSS**

Add at the end of the file:
```css
/* ===== Preloader ===== */
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0c0c1d;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.preloader-counter {
  font-family: 'Inter', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #fff;
}

/* CSS-only fallback: auto-hide preloader after 5s if JS fails */
@keyframes preloader-fallback {
  0%, 99% { opacity: 1; visibility: visible; }
  100% { opacity: 0; visibility: hidden; pointer-events: none; }
}
html.no-js .preloader,
.preloader--fallback {
  animation: preloader-fallback 5s forwards;
}
```

- [ ] **Step 3: Add custom cursor CSS**

```css
/* ===== Custom Cursor ===== */
.cursor-dot {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s;
}

.cursor-ring {
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9998;
  opacity: 0;
  transition: opacity 0.3s;
}

.cursor-active .cursor-dot,
.cursor-active .cursor-ring {
  opacity: 1;
}

.cursor-active {
  cursor: none;
}

.cursor-active a,
.cursor-active button,
.cursor-active .btn,
.cursor-active .type,
.cursor-active .nav-link,
.cursor-active .item-inner {
  cursor: none;
}

/* Hide cursor elements on touch devices */
@media (hover: none) {
  .cursor-dot,
  .cursor-ring {
    display: none !important;
  }
}
```

- [ ] **Step 4: Add initial animation states for GSAP-driven elements**

These ensure elements are hidden before GSAP reveals them, preventing FOUC:
```css
/* ===== GSAP Animation Initial States ===== */
.hero-hidden {
  visibility: hidden;
}
```

- [ ] **Step 5: Remove old Intersection Observer animation CSS**

Find and **remove** the following CSS blocks from theme-0.css:
- Any `[data-animate]` selector rules (initial hidden states and `.animated` states)
- Any `@keyframes` rules for fade-up, fade-left, fade-right, scale-in scroll animations

Keep these CSS animations (they are NOT related to IO):
- `@keyframes blobFloat` — decorative hero blob
- `@keyframes geoFloat1/2/3` — geometric shapes
- `@keyframes profileGlow` — profile image glow
- `@keyframes scrollBounce` — scroll indicator
- `@keyframes typingCursor` — typing cursor
- `@keyframes blink` — blink effect

- [ ] **Step 6: Commit**

```bash
git add assets/css/theme-0.css
git commit -m "feat: add preloader, cursor, no-js fallback CSS; remove old IO animation styles"
```

---

### Task 4: Rewrite main.js — Core Setup (Lenis + GSAP Registration + No-JS Removal)

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Replace the entire top section of main.js**

Replace the opening `$(document).ready(function() {` and the first few sections (external links, scrollspy, scrollTo, fixed page nav) with:

```javascript
/* ============================================
 * GSAP + LENIS CORE SETUP
 * ============================================ */

// Remove no-js class (JS is working)
document.documentElement.classList.remove('no-js');

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// Detect touch device
const isTouch = !window.matchMedia('(hover: hover)').matches;

// Initialize Lenis smooth scroll (desktop only)
let lenis;
if (!isTouch) {
  lenis = new Lenis({
    duration: 1.2,
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    orientation: 'vertical',
    smoothWheel: true,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

$(document).ready(function() {

  /* ======= External links open in new tab ======== */
  $("a").not($(".internal-link")).not($(".scrollto")).attr("target", "_blank");

  /* ======= Scrollspy ======= */
  $('body').scrollspy({
    target: '#page-nav-wrapper',
    offset: 100
  });

  /* ======= ScrollTo (Lenis-powered) ======= */
  $('.scrollto').on('click', function(e) {
    var target = this.hash || $(this).data('target');
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -60 });
    } else {
      // Touch fallback
      var el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* ======= Fixed page nav with glassmorphism ======= */
  $(window).on('scroll resize load', function() {
    $('#page-nav-wrapper').removeClass('fixed');
    var scrollTop = $(this).scrollTop();
    var topDistance = $('#page-nav-wrapper').offset().top;
    if (topDistance > scrollTop) {
      $('#page-nav-wrapper').removeClass('fixed');
      $('body').removeClass('sticky-page-nav');
    } else {
      $('#page-nav-wrapper').addClass('fixed');
      $('body').addClass('sticky-page-nav');
    }
  });
```

- [ ] **Step 2: Verify Lenis loads without errors**

Open the site, check browser console for:
- No errors from GSAP or Lenis
- Smooth scroll works on desktop (scroll with mouse wheel — should feel inertia-based)
- Touch devices fall back to native scroll

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: add GSAP/Lenis core setup, replace jQuery scrollTo with Lenis"
```

---

### Task 5: Implement Preloader + Split Text Entrance Sequence

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Add preloader timeline inside the `$(document).ready` block**

After the fixed page nav section, add:

```javascript
  /* ============================================
   * PRELOADER + ENTRANCE SEQUENCE
   * ============================================ */
  function initPreloader() {
    var preloader = document.querySelector('.preloader');
    var counter = document.querySelector('.preloader-counter');
    if (!preloader || !counter) return;

    // Lock scroll during preloader
    document.documentElement.style.overflow = 'hidden';

    // Hide hero elements initially
    gsap.set('.header .intro', { visibility: 'hidden' });
    gsap.set('.header .top-bar', { opacity: 0, y: -20 });
    gsap.set('.header .contact-info', { opacity: 0, y: 20 });
    gsap.set('.header .scroll-indicator', { opacity: 0 });
    gsap.set('.header .profile-image', { opacity: 0, scale: 0.8 });

    // Split hero text
    var nameSplit = new SplitText('.header .name', { type: 'words', wordsClass: 'word' });
    var titleSplit = new SplitText('.header .intro .title', { type: 'words', wordsClass: 'word' });

    // Wrap each word parent in overflow hidden for mask effect
    nameSplit.words.forEach(function(word) {
      word.parentNode.style.overflow = 'hidden';
      word.style.display = 'inline-block';
    });
    titleSplit.words.forEach(function(word) {
      word.parentNode.style.overflow = 'hidden';
      word.style.display = 'inline-block';
    });

    gsap.set(nameSplit.words, { yPercent: 100, opacity: 0 });
    gsap.set(titleSplit.words, { yPercent: 100, opacity: 0 });

    // Build timeline
    var tl = gsap.timeline({
      onComplete: function() {
        // Unlock scroll
        document.documentElement.style.overflow = '';
        // Remove preloader from DOM
        preloader.style.display = 'none';
        // Activate Lenis if available
        if (lenis) lenis.start();
      }
    });

    // Pause Lenis during preloader
    if (lenis) lenis.stop();

    var counterObj = { val: 0 };

    tl
      // Counter: 0 → 100%
      .to(counterObj, {
        val: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: function() {
          counter.textContent = Math.round(counterObj.val);
        }
      })
      // Overlay slides up
      .to(preloader, {
        yPercent: -100,
        duration: 0.5,
        ease: 'power4.inOut',
      })
      // Show hero intro container
      .set('.header .intro', { visibility: 'visible' })
      // Profile image
      .to('.header .profile-image', {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
      // Name split text reveal
      .to(nameSplit.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.2')
      // Title split text reveal
      .to(titleSplit.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.5')
      // Profile paragraph
      .to('.header .profile', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4')
      // Top bar + contact info
      .to('.header .top-bar', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.4')
      .to('.header .contact-info', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.3')
      // Scroll indicator
      .to('.header .scroll-indicator', {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.2');
  }

  initPreloader();
```

- [ ] **Step 2: Also set initial state for `.header .profile` in CSS or JS**

Add this line inside the `initPreloader` function, after the other `gsap.set` calls:
```javascript
    gsap.set('.header .profile', { opacity: 0, y: 20 });
```

- [ ] **Step 3: Verify preloader works**

Reload page. Expected:
- Dark overlay with counter 0→100 (1.5s)
- Overlay slides up revealing hero
- Profile image fades/scales in
- "David Chen" words slide up one by one
- Subtitle words slide up
- Description, top bar, contact info fade in
- Scroll indicator appears last
- Page scroll unlocks after sequence

- [ ] **Step 4: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: implement preloader entrance sequence with split text hero reveal"
```

---

### Task 6: Replace Intersection Observer with GSAP ScrollTrigger

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Remove the old `initScrollAnimations()` and `initSectionTransitions()` functions**

Find and delete these entire functions from main.js:
- `function initScrollAnimations() { ... }` and its call `initScrollAnimations();`
- `function initSectionTransitions() { ... }` and its call `initSectionTransitions();`

- [ ] **Step 2: Add GSAP ScrollTrigger reveal animations**

Add after the preloader function:

```javascript
  /* ============================================
   * SCROLL REVEAL ANIMATIONS (GSAP ScrollTrigger)
   * ============================================ */
  function initScrollReveals() {
    // Section titles — fade up
    gsap.utils.toArray('.section-title').forEach(function(el) {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // About section content
    gsap.from('.about-content', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Experience timeline items — alternate left/right
    gsap.utils.toArray('.timeline .item').forEach(function(item, i) {
      var direction = i % 2 === 0 ? 40 : -40;
      gsap.from(item, {
        x: direction,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Impact cards — staggered
    gsap.from('.impact-card', {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.impact-section .row',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Education cards — staggered
    gsap.from('#education-section .item-inner', {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#education-section .row',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Skills section — top skills staggered
    gsap.from('#skills-section .top-skills .item-inner', {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#skills-section .top-skills',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Skill tags — staggered scale-in
    gsap.from('.skill-tag', {
      scale: 0.95,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.other-skills',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Testimonials section
    gsap.from('#testimonials-section .testimonials-carousel', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#testimonials-section',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Contact section
    gsap.from('#contact-section .intro', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#contact-section',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Section divider metrics
    gsap.utils.toArray('.section-divider .divider-content').forEach(function(el) {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });
  }

  initScrollReveals();
```

- [ ] **Step 3: Verify scroll animations work**

Scroll through the page. Each section should fade/slide in as it enters the viewport at 85%. Check:
- About section fades up
- Experience items alternate from left/right
- Impact cards stagger in
- Education cards stagger in
- Skill bars and tags animate in
- Testimonials fade up
- Portfolio and contact sections fade up

- [ ] **Step 4: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: replace Intersection Observer with GSAP ScrollTrigger scroll reveals"
```

---

### Task 7: Implement Staggered Portfolio Grid Cards

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Add staggered grid animation for portfolio items**

Add inside the `initScrollReveals()` function, before its closing `}`:

```javascript
    // Portfolio grid — staggered (C)
    gsap.from('.isotope .item', {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: { each: 0.1, from: 'start' },
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.isotope',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
```

- [ ] **Step 2: Verify portfolio cards stagger in**

Scroll to Creative Work section. Cards should cascade in with 0.1s delay between each.

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: add staggered portfolio grid card animations"
```

---

### Task 8: Implement Custom Cursor (Dot + Ring)

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Add cursor initialization function**

Add after the scroll reveals section:

```javascript
  /* ============================================
   * CUSTOM CURSOR (F)
   * ============================================ */
  function initCustomCursor() {
    if (isTouch) return; // No cursor on touch devices

    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    // Add cursor-active class to body
    document.body.classList.add('cursor-active');

    // GSAP quickTo for smooth following
    var dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    var dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });
    var ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
    var ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

    // Center offset (dot = 3px, ring = 18px)
    window.addEventListener('mousemove', function(e) {
      dotX(e.clientX - 3);
      dotY(e.clientY - 3);
      ringX(e.clientX - 18);
      ringY(e.clientY - 18);
    });

    // Show cursor after first mousemove
    var shown = false;
    window.addEventListener('mousemove', function() {
      if (!shown) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        shown = true;
      }
    }, { once: false });

    // Hover effects on interactive elements
    var interactiveEls = document.querySelectorAll('a, button, .btn, .type, .nav-link');
    interactiveEls.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        gsap.to(ring, { scale: 1.5, borderColor: 'rgba(255,255,255,0.2)', duration: 0.3 });
      });
      el.addEventListener('mouseleave', function() {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 });
      });
    });

    // Larger hover on portfolio items
    var portfolioItems = document.querySelectorAll('.item-inner');
    portfolioItems.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        gsap.to(ring, { scale: 2, borderColor: 'rgba(255,255,255,0.15)', duration: 0.3 });
      });
      el.addEventListener('mouseleave', function() {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 });
      });
    });

    // Click pulse
    window.addEventListener('mousedown', function() {
      gsap.to(ring, { scale: 0.8, duration: 0.15 });
    });
    window.addEventListener('mouseup', function() {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
    });
  }

  initCustomCursor();
```

- [ ] **Step 2: Verify cursor works**

- Default cursor should be hidden, custom dot + ring visible
- Ring follows with slight delay
- Ring scales up over links/buttons (1.5×)
- Ring scales up more over portfolio cards (2×)
- Click produces brief pulse
- On mobile/touch: no custom cursor, default cursor visible

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: implement custom dot + ring cursor with hover states"
```

---

### Task 9: Implement Magnetic Buttons

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Add magnetic button function**

Add after the cursor section:

```javascript
  /* ============================================
   * MAGNETIC BUTTONS (B)
   * ============================================ */
  function initMagneticButtons() {
    if (isTouch) return; // No magnetic effect on touch

    var magneticEls = document.querySelectorAll('.btn, #page-nav-wrapper .nav-link, .social a, #filters .type');

    magneticEls.forEach(function(el) {
      el.addEventListener('mousemove', function(e) {
        var rect = el.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var x = (e.clientX - centerX) * 0.3;
        var y = (e.clientY - centerY) * 0.3;

        gsap.to(el, {
          x: x,
          y: y,
          duration: 0.3,
          ease: 'power3.out',
        });
      });

      el.addEventListener('mouseleave', function() {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)',
        });
      });
    });
  }

  initMagneticButtons();
```

- [ ] **Step 2: Verify magnetic effect**

Hover over nav links, Email Me button, social icons, portfolio filter buttons. They should:
- Subtly follow the cursor (30% of offset)
- Spring back with elastic bounce on mouse leave
- Not work on touch/mobile

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: implement magnetic button hover effect with elastic spring return"
```

---

### Task 10: Implement Parallax Tilt Cards

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Add vanilla-tilt initialization**

Add after the magnetic buttons section:

```javascript
  /* ============================================
   * PARALLAX TILT CARDS (J)
   * ============================================ */
  function initTiltCards() {
    if (isTouch) return; // vanilla-tilt ignores touch, but skip init entirely

    var tiltElements = document.querySelectorAll('.portfolio-section .item-inner, #education-section .item-inner');

    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(Array.from(tiltElements), {
        max: 5,
        speed: 400,
        glare: true,
        'max-glare': 0.08,
        perspective: 1000,
        scale: 1.02,
      });
    }
  }

  initTiltCards();
```

- [ ] **Step 2: Verify tilt effect**

Hover over portfolio cards and education cards. They should:
- Tilt subtly (max 5°) following cursor position
- Show very faint glare reflection
- Scale up slightly (1.02)
- Return smoothly to flat on mouse leave

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: implement parallax tilt on portfolio and education cards"
```

---

### Task 11: Migrate Skill Bars to GSAP + Final Cleanup

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Replace `initSkillBars()` with GSAP version**

Find the existing `initSkillBars()` function and `animateCounter()` function. Replace both with:

```javascript
  /* ============================================
   * SKILL PROGRESS BARS (GSAP version)
   * ============================================ */
  function initSkillBars() {
    var bars = document.querySelectorAll('.skill-progress-bar');
    if (!bars.length) return;

    bars.forEach(function(bar) {
      var fill = bar.querySelector('.fill');
      var targetPercent = parseInt(fill.getAttribute('data-percent'));
      var card = bar.closest('.item-inner');
      var percentEl = card ? card.querySelector('.skill-percent') : null;

      ScrollTrigger.create({
        trigger: bar,
        start: 'top 85%',
        once: true,
        onEnter: function() {
          // Animate bar fill
          gsap.to(fill, {
            width: targetPercent + '%',
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.2,
          });

          // Animate counter
          if (percentEl) {
            var counterObj = { val: 0 };
            gsap.to(counterObj, {
              val: targetPercent,
              duration: 1.5,
              ease: 'power2.out',
              delay: 0.2,
              onUpdate: function() {
                percentEl.textContent = Math.round(counterObj.val) + '%';
              }
            });
          }
        }
      });
    });
  }

  initSkillBars();
```

- [ ] **Step 2: Ensure closing bracket of `$(document).ready` is intact**

The file should end with:
```javascript
  /* ============================================
   * LIGHTBOX + ISOTOPE (unchanged)
   * ============================================ */
  // ... (existing lightbox and isotope code stays as-is)

  // ... (existing particle canvas stays as-is)

}); // end $(document).ready
```

Make sure all the kept functions (lightbox, isotope, particles) are still inside the `$(document).ready` block, and the `});` closing is at the very end.

- [ ] **Step 3: Remove the jQuery scrollTo plugin script tag from index.html**

Since Lenis now handles smooth scroll, remove this line from index.html:
```html
    <script src="assets/plugins/jquery-scrollTo/jquery.scrollTo.min.js"></script>
```

Also remove `jquery.easing.1.3.js` if it was only used by scrollTo:
```html
    <script src="assets/plugins/jquery.easing.1.3.js"></script>
```

Note: keep jquery.easing if Bootstrap carousel or other components depend on it. Check by searching for `easing` usage in the code. If only scrollTo used it, remove it.

- [ ] **Step 4: Full end-to-end test**

Test the complete page flow:
1. **Preloader:** Counter 0→100%, overlay slides up, hero elements choreograph in
2. **Smooth scroll:** Mouse wheel scrolling feels buttery with inertia (desktop only)
3. **Scroll reveals:** All sections animate in on scroll
4. **Portfolio stagger:** Cards cascade in with delay
5. **Custom cursor:** Dot + ring follow mouse, hover states work
6. **Magnetic buttons:** Nav links, buttons follow cursor subtly
7. **Parallax tilt:** Portfolio/education cards tilt on hover
8. **Skill bars:** Animate fill + counter on scroll
9. **Mobile:** No cursor, no magnetic, no tilt, native scroll. All content still visible.

- [ ] **Step 5: Commit**

```bash
git add assets/js/main.js index.html
git commit -m "feat: migrate skill bars to GSAP, remove unused jQuery plugins, final cleanup"
```

---

### Task 12: Final Polish and Cross-Browser Verification

**Files:**
- Possibly modify: `assets/css/theme-0.css`, `assets/js/main.js`

- [ ] **Step 1: Test in multiple browsers**

Test in Chrome, Safari, Firefox. Check for:
- Smooth scroll working (Chrome/Safari should work, Firefox check Lenis compat)
- Custom cursor rendering correctly
- Tilt glare not causing visual artifacts
- Preloader timing feels right

- [ ] **Step 2: Performance check**

Open DevTools Performance tab, scroll through page:
- No janky frames during scroll animations
- No excessive repaints (check "Paint flashing")
- Preloader doesn't cause layout shift

- [ ] **Step 3: Fix any issues found**

Apply fixes as needed.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "polish: cross-browser fixes and performance tuning"
```
