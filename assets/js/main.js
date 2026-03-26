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
    gsap.set('.header .profile', { opacity: 0, y: 20 });

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
        // Recalculate ScrollTrigger positions now that scroll is unlocked
        ScrollTrigger.refresh();
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

  /* ============================================
   * SCROLL REVEAL ANIMATIONS (GSAP ScrollTrigger)
   * ============================================ */
  function initScrollReveals() {
    // Helper: gsap.fromTo with ScrollTrigger (avoids gsap.from natural-state capture bug)
    function reveal(target, fromVars, toVars, triggerEl) {
      gsap.fromTo(target, fromVars, Object.assign({}, toVars, {
        scrollTrigger: {
          trigger: triggerEl || target,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }));
    }

    // Section titles — fade up
    gsap.utils.toArray('.section-title').forEach(function(el) {
      reveal(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
    });

    // About section content
    reveal('.about-content', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });

    // Experience timeline items — alternate left/right
    gsap.utils.toArray('.timeline .item').forEach(function(item, i) {
      var direction = i % 2 === 0 ? 40 : -40;
      reveal(item, { x: direction, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
    });

    // Impact cards — staggered
    gsap.fromTo('.impact-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.impact-section .row', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    // Education cards — staggered
    gsap.fromTo('#education-section .item-inner',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '#education-section .row', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    // Skills section — top skills staggered
    gsap.fromTo('#skills-section .top-skills .item-inner',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '#skills-section .top-skills', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    // Skill tags — staggered scale-in
    gsap.fromTo('.skill-tag',
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out',
        scrollTrigger: { trigger: '.other-skills', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    // Testimonials section
    reveal('#testimonials-section .testimonials-carousel',
      { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '#testimonials-section'
    );

    // Portfolio grid — staggered (C)
    gsap.fromTo('.isotope .item',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: { each: 0.1, from: 'start' }, ease: 'power2.out',
        scrollTrigger: { trigger: '.isotope', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    // Contact section
    reveal('#contact-section .intro',
      { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '#contact-section'
    );

    // Section divider metrics
    gsap.utils.toArray('.section-divider .divider-content').forEach(function(el) {
      reveal(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
    });
  }

  initScrollReveals();

  /* ============================================
   * CUSTOM CURSOR (F)
   * ============================================ */
  function initCustomCursor() {
    if (isTouch) return;

    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('cursor-active');

    // Track whether cursor is on a dark section
    var onDark = false;
    var darkColor = 'rgba(255,255,255,0.5)';
    var lightColor = 'rgba(102,126,234,0.5)';

    var dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    var dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });
    var ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
    var ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

    window.addEventListener('mousemove', function(e) {
      dotX(e.clientX - 3);
      dotY(e.clientY - 3);
      ringX(e.clientX - 18);
      ringY(e.clientY - 18);

      // Detect dark sections (header, section-dividers, footer)
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var isDark = false;
      if (el) {
        isDark = !!el.closest('.header, .section-divider, .footer');
      }
      if (isDark !== onDark) {
        onDark = isDark;
        if (isDark) {
          document.body.classList.add('cursor-light');
        } else {
          document.body.classList.remove('cursor-light');
        }
      }
    });

    var shown = false;
    window.addEventListener('mousemove', function() {
      if (!shown) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        shown = true;
      }
    });

    // Hover effects on interactive elements
    var interactiveEls = document.querySelectorAll('a, button, .btn, .type, .nav-link');
    interactiveEls.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        var hoverColor = onDark ? 'rgba(255,255,255,0.2)' : 'rgba(102,126,234,0.2)';
        gsap.to(ring, { scale: 1.5, borderColor: hoverColor, duration: 0.3 });
      });
      el.addEventListener('mouseleave', function() {
        var baseColor = onDark ? darkColor : lightColor;
        gsap.to(ring, { scale: 1, borderColor: baseColor, duration: 0.3 });
      });
    });

    // Larger hover on portfolio items
    var portfolioItems = document.querySelectorAll('.item-inner');
    portfolioItems.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        gsap.to(ring, { scale: 2, borderColor: 'rgba(102,126,234,0.15)', duration: 0.3 });
      });
      el.addEventListener('mouseleave', function() {
        var baseColor = onDark ? darkColor : lightColor;
        gsap.to(ring, { scale: 1, borderColor: baseColor, duration: 0.3 });
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

  /* ============================================
   * MAGNETIC BUTTONS (B)
   * ============================================ */
  function initMagneticButtons() {
    if (isTouch) return;

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

  /* ============================================
   * PARALLAX TILT CARDS (J)
   * ============================================ */
  function initTiltCards() {
    if (isTouch) return;

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

  /* ======= Lightbox ======= */
  $('.items-wrapper .link-mask').simpleLightbox({
    nav: false
  });

  /* ======= Isotope portfolio ======= */
  var $container = $('.isotope');
  $container.imagesLoaded(function() {
    $('.isotope').isotope({
      itemSelector: '.item'
    });
  });

  $('#filters').on('click', '.type', function() {
    var filterValue = $(this).attr('data-filter');
    $container.isotope({ filter: filterValue });
  });

  $('.filters').each(function(i, typeGroup) {
    var $typeGroup = $(typeGroup);
    $typeGroup.on('click', '.type', function() {
      $typeGroup.find('.active').removeClass('active');
      $(this).addClass('active');
    });
  });

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
          gsap.to(fill, {
            width: targetPercent + '%',
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.2,
          });

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

  /* ============================================
   * PARTICLE CANVAS (Hero background)
   * ============================================ */
  function initParticles() {
    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 50;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function(p) {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + p.opacity + ')';
        ctx.fill();
      });

      // Draw connections between nearby particles
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + (0.08 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  initParticles();

});
