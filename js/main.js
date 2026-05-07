(function () {
  // ── Data ──────────────────────────────────────────────────────────────────
  var PAINTINGS = {
    'sunset-lake': {
      eyebrow: 'No. 01',
      title: 'Lake at Last Light',
      blurb: 'Painted over three evenings in August, chasing the precise moment the sky goes copper just before the light fails. The water in the foreground is four layers — the last one applied with a palette knife to get the shimmer right.',
      size: '11 × 14"',
      src: 'images/sunset-lake.jpg',
    },
    'beach-cat': {
      eyebrow: 'No. 02',
      title: 'Sentinel by the Sea',
      blurb: 'A cat I met on a beach in Georgia, standing at the exact point where the dry sand meets the wet. She stayed there for twenty minutes, watching something I couldn\'t see. I painted her from memory a week later.',
      size: '24 × 24"',
      src: 'images/beach-cat.jpg',
    },
    'collage-portrait': {
      eyebrow: 'No. 03',
      title: 'Crowned',
      blurb: 'Built up from lace, sheet music, cut fabric, and old photographs before the paint touched it. The gold is from a 1970s paperback spine I found at an estate sale. I spent more time cutting than painting, which felt right.',
      size: '18 × 24"',
      src: 'images/collage-portrait.jpg',
    },
    jazz: {
      eyebrow: 'No. 04',
      title: 'Jazz',
      blurb: 'From a small club with the lights low — brass and warmth, the shapes half-remembered the next morning. I kept it loose on purpose: rhythm first, detail only where the music landed.',
      size: '18 × 24"',
      src: 'images/Jazz.jpg',
    },
  };

  var SECTIONS = ['home', 'gallery', 'about', 'resume', 'writing', 'contact'];

  // ── Routing ───────────────────────────────────────────────────────────────
  var currentSection = 'home';

  function readHash() {
    var h = (window.location.hash || '').replace(/^#\/?/, '').trim();
    return SECTIONS.indexOf(h) !== -1 ? h : 'home';
  }

  function showSection(name, skipHistory) {
    if (SECTIONS.indexOf(name) === -1) name = 'home';
    currentSection = name;
    document.body.dataset.section = name;

    document.querySelectorAll('.section').forEach(function (el) {
      el.classList.remove('active');
    });
    var target = document.querySelector('.section-' + name);
    if (target) target.classList.add('active');

    document.querySelectorAll('[data-nav]').forEach(function (el) {
      el.classList.toggle('active', el.dataset.nav === name);
    });

    // Keep mobile open-menu navbar background synced to section
    try {
      var rootStyles = getComputedStyle(document.documentElement);
      var paper = rootStyles.getPropertyValue('--paper').trim() || '#ffffff';
      var navBg = paper;
      if (name === 'gallery') navBg = '#d1b399';
      else if (name === 'writing') {
        navBg = rootStyles.getPropertyValue('--ink-mute').trim() || '#837767';
      } else if (name === 'resume') {
        navBg = rootStyles.getPropertyValue('--sage').trim() || '#6b7d5e';
      } else if (name === 'contact') {
        navBg = rootStyles.getPropertyValue('--ink').trim() || '#1a1612';
      }
      document.documentElement.style.setProperty('--nav-bg', navBg);
    } catch (e) {
      // no-op
    }

    if (!skipHistory) {
      var hash = name === 'home' ? '#' : '#' + name;
      history.pushState({ section: name }, '', hash);
    }
  }

  var transition = null;

  function navigate(name) {
    if (name === currentSection) return;
    if (transition) {
      transition.requestNavigate(name);
    } else {
      showSection(name);
    }
  }

  // ── Nav ───────────────────────────────────────────────────────────────────
  document.querySelectorAll('[data-nav]').forEach(function (el) {
    el.addEventListener('click', function () {
      navigate(el.dataset.nav);
    });
  });

  // ── Collapsible nav (mobile) ───────────────────────────────────────────────
  var nav = document.querySelector('.site-nav');
  var navToggle = nav ? nav.querySelector('.nav-toggle') : null;
  var navMenu = document.getElementById('site-nav-menu');
  var siteMenu = document.getElementById('site-menu');
  var siteMenuBackdrop = siteMenu ? siteMenu.querySelector('.site-menu-backdrop') : null;
  var navMq = window.matchMedia('(max-width: 1024px)');
  var priorBodyOverflow = '';

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    document.body.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (siteMenu) siteMenu.setAttribute('aria-hidden', open ? 'false' : 'true');

    if (open) {
      priorBodyOverflow = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = priorBodyOverflow;
    }
  }

  function syncNavForViewport() {
    if (!navMq.matches) setNavOpen(false);
  }

  navToggle?.addEventListener('click', function (e) {
    e.preventDefault();
    var isOpen = document.body.classList.contains('menu-open');
    setNavOpen(!isOpen);
  });

  // Close when selecting a nav item (only in mobile mode)
  function maybeCloseFromNavClick(e) {
    var t = e.target;
    if (!navMq.matches) return;
    if (t && t.closest && t.closest('[data-nav]')) setNavOpen(false);
  }
  navMenu?.addEventListener('click', maybeCloseFromNavClick);
  siteMenu?.addEventListener('click', maybeCloseFromNavClick);
  siteMenuBackdrop?.addEventListener('click', function () {
    if (!navMq.matches) return;
    setNavOpen(false);
  });

  // Close on Escape
  window.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    if (!navMq.matches) return;
    if (document.body.classList.contains('menu-open')) setNavOpen(false);
  });

  navMq.addEventListener('change', syncNavForViewport);
  syncNavForViewport();

  window.addEventListener('popstate', function () {
    showSection(readHash(), true);
  });

  // ── Lightbox ──────────────────────────────────────────────────────────────
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbEyebrow = document.getElementById('lb-eyebrow');
  var lbTitle = document.getElementById('lb-title');
  var lbBlurb = document.getElementById('lb-blurb');
  var lbSize = document.getElementById('lb-size');

  function openLightbox(id) {
    var p = PAINTINGS[id];
    if (!p || !lightbox) return;
    lbImg.src = p.src;
    lbImg.alt = p.title;
    lbEyebrow.textContent = p.eyebrow;
    lbTitle.textContent = p.title;
    lbBlurb.textContent = p.blurb;
    lbSize.textContent = p.size;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  document.querySelectorAll('.piece[data-id]').forEach(function (el) {
    el.addEventListener('click', function () {
      openLightbox(el.dataset.id);
    });
    el.style.cursor = 'pointer';
  });

  document.getElementById('lb-close')?.addEventListener('click', closeLightbox);

  lightbox?.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // ── Resume tabs ───────────────────────────────────────────────────────────
  document.querySelectorAll('.cv-tabs button[data-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabId = btn.dataset.tab;
      document.querySelectorAll('.cv-tabs button').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      document.querySelectorAll('.cv-pane').forEach(function (pane) {
        pane.classList.remove('active');
      });
      var pane = document.getElementById('cv-' + tabId);
      if (pane) pane.classList.add('active');
    });
  });

  // ── Contact form ──────────────────────────────────────────────────────────
  var contactForm = document.getElementById('contact-form');
  var formSent = document.querySelector('.form-sent');
  var sendAnother = document.getElementById('send-another');

  contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    if (contactForm) contactForm.style.display = 'none';
    if (formSent) formSent.style.display = 'block';
  });

  sendAnother?.addEventListener('click', function () {
    if (formSent) formSent.style.display = 'none';
    if (contactForm) {
      contactForm.reset();
      contactForm.style.display = '';
    }
  });

  document.querySelectorAll('.subject-pills button').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.subject-pills button').forEach(function (p) {
        p.classList.remove('active');
      });
      pill.classList.add('active');
    });
  });

  // Ensure default subject matches updated pills
  document
    .querySelectorAll('.subject-pills')
    .forEach(function (wrap) {
      var active = wrap.querySelector('button.active');
      if (!active) {
        var commission = wrap.querySelector('button[data-subject="commission"]');
        if (commission) commission.classList.add('active');
      }
    });

  // ── Cursor dab ────────────────────────────────────────────────────────────
  var cursorDab = document.getElementById('cursor-dab');
  var dabTimeout = null;

  if (cursorDab) {
    document.addEventListener('mousemove', function (e) {
      cursorDab.style.left = e.clientX + 'px';
      cursorDab.style.top = e.clientY + 'px';
      cursorDab.classList.add('active');
      clearTimeout(dabTimeout);
      dabTimeout = setTimeout(function () {
        cursorDab.classList.remove('active');
      }, 1200);
    });
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    var idx = parseInt(e.key, 10);
    if (idx >= 1 && idx <= 6) {
      navigate(SECTIONS[idx - 1]);
    }
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // ── Paint transition ──────────────────────────────────────────────────────
  var svg = document.querySelector('.transition-svg svg');
  var brushPanel = document.getElementById('brushPanel');
  var brushImg = brushPanel ? brushPanel.querySelector('img') : null;

  if (svg && brushPanel && brushImg && window.SericaTransition) {
    var trans = window.SericaTransition.createPaintTransition({
      svg: svg,
      brushPanel: brushPanel,
      brushImg: brushImg,
      initialSection: readHash(),
      onMidNavigate: function (name) {
        showSection(name);
      },
    });
    transition = trans;
    requestAnimationFrame(function () {
      trans.initIntro();
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  showSection(readHash(), true);
})();
