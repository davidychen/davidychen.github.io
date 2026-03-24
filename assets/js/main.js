$(document).ready(function() {

  /* ======= External links open in new tab ======== */
  $("a").not($(".internal-link")).not($(".scrollto")).attr("target", "_blank");

  /* ======= Scrollspy ======= */
  $('body').scrollspy({
    target: '#page-nav-wrapper',
    offset: 100
  });

  /* ======= ScrollTo ======= */
  $('.scrollto').on('click', function(e) {
    var target = this.hash || $(this).data('target');
    if (!target) return;
    e.preventDefault();
    $('body').scrollTo(target, 800, {
      offset: -60,
      'axis': 'y',
      easing: 'easeInOutCubic'
    });
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
   * SCROLL ANIMATIONS (Intersection Observer)
   * ============================================ */
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('[data-animate]');

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      animatedElements.forEach(function(el) {
        el.classList.add('animated');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay')) || 0;
          setTimeout(function() {
            el.classList.add('animated');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  initScrollAnimations();

  /* ============================================
   * SKILL PROGRESS BARS
   * ============================================ */
  function initSkillBars() {
    var fills = document.querySelectorAll('.skill-progress-bar .fill');
    var percents = document.querySelectorAll('.skill-percent');

    if (!('IntersectionObserver' in window)) {
      fills.forEach(function(fill) {
        fill.style.width = fill.getAttribute('data-percent') + '%';
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var fill = bar.querySelector('.fill');
          var targetPercent = parseInt(fill.getAttribute('data-percent'));

          // Animate the bar fill
          setTimeout(function() {
            fill.style.width = targetPercent + '%';
          }, 200);

          // Find and animate the corresponding percentage number
          var card = bar.closest('.item-inner');
          if (card) {
            var percentEl = card.querySelector('.skill-percent');
            if (percentEl) {
              animateCounter(percentEl, 0, targetPercent, 1500);
            }
          }

          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-progress-bar').forEach(function(bar) {
      observer.observe(bar);
    });
  }

  function animateCounter(el, start, end, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.round(start + (end - start) * eased);
      el.textContent = current + '%';
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
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

  /* ============================================
   * SMOOTH PAGE TRANSITIONS
   * ============================================ */
  // Fade sections as they scroll into/out of the strong viewport
  function initSectionTransitions() {
    var sections = document.querySelectorAll('.section');

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    sections.forEach(function(section) {
      observer.observe(section);
    });
  }

  initSectionTransitions();

});
