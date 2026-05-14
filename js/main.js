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
    'disco-baby': { eyebrow: 'No. 05', title: 'Disco Baby', blurb: '', size: '', src: 'assets/portfolio/Disco%20Baby%20copy.jpg' },
    'earth': { eyebrow: 'No. 06', title: 'Earth', blurb: '', size: '', src: 'assets/portfolio/Earth.jpg' },
    'frogador': { eyebrow: 'No. 07', title: 'Frogador', blurb: '', size: '', src: 'assets/portfolio/Frogador.jpg' },
    'brown-girl': { eyebrow: 'No. 08', title: 'Brown Girl', blurb: '', size: '', src: 'assets/portfolio/brown%20girl~2.jpeg' },
    'cool-hand-luke': { eyebrow: 'No. 09', title: 'Cool Hand Luke', blurb: '', size: '', src: 'assets/portfolio/cool%20hand%20luke.jpg' },
    'dusty-still': { eyebrow: 'No. 10', title: 'Dusty Still', blurb: '', size: '', src: 'assets/portfolio/dusty%20still.jpg' },
    'figure-1': { eyebrow: 'No. 11', title: 'Figure I', blurb: '', size: '', src: 'assets/portfolio/figure%201.jpg' },
    'flick': { eyebrow: 'No. 12', title: 'Flick', blurb: '', size: '', src: 'assets/portfolio/flick.jpg' },
    'jogger': { eyebrow: 'No. 13', title: 'The Jogger', blurb: '', size: '', src: 'assets/portfolio/jogger%20all.jpg' },
    'peace': { eyebrow: 'No. 14', title: 'Peace', blurb: '', size: '', src: 'assets/portfolio/peace.jpg' },
    'painting1': { eyebrow: 'No. 15', title: 'Untitled', blurb: '', size: '', src: 'assets/portfolio/painting1.JPG' },
    'wacky-olympics-a': { eyebrow: 'No. 16', title: 'Wacky Olympics', blurb: '', size: '', src: 'assets/portfolio/wacky%20olympics%20a..jpg' },
    'wacky-olympics-2': { eyebrow: 'No. 17', title: 'Wacky Olympics II', blurb: '', size: '', src: 'assets/portfolio/wacky%20olympics%202.jpg' },
    'img-17-i': { eyebrow: 'No. 18', title: 'Studio Work I', blurb: '', size: '', src: 'assets/portfolio/IMG_20171101_164423397.jpg' },
    'img-17-ii': { eyebrow: 'No. 19', title: 'Studio Work II', blurb: '', size: '', src: 'assets/portfolio/IMG_20171101_165401239.jpg' },
    'img-20-i': { eyebrow: 'No. 20', title: 'Studio Work III', blurb: '', size: '', src: 'assets/portfolio/IMG_20200324_125501455~2.jpg' },
    'img-20-ii': { eyebrow: 'No. 21', title: 'Studio Work IV', blurb: '', size: '', src: 'assets/portfolio/IMG_20200708_210820590.jpg' },
    'img-22-i': { eyebrow: 'No. 22', title: 'Studio Work V', blurb: '', size: '', src: 'assets/portfolio/IMG_20220401_162321232~2.jpg' },
    'img-22-ii': { eyebrow: 'No. 23', title: 'Studio Work VI', blurb: '', size: '', src: 'assets/portfolio/IMG_20220414_021615871~3.jpg' },
    'img-22-iii': { eyebrow: 'No. 24', title: 'Studio Work VII', blurb: '', size: '', src: 'assets/portfolio/IMG_20220414_021959543~5.jpg' },
    'img-23': { eyebrow: 'No. 25', title: 'Studio Work VIII', blurb: '', size: '', src: 'assets/portfolio/IMG_20231215_123908218~2.jpg' },
    'img-24': { eyebrow: 'No. 26', title: 'Studio Work IX', blurb: '', size: '', src: 'assets/portfolio/IMG_20241119_135833020~2.jpg' },
    'women-01': { eyebrow: 'No. 27', title: 'Figure Study I', blurb: '', size: '', src: 'assets/portfolio/body-profile-women01.jpg' },
    'women-02': { eyebrow: 'No. 28', title: 'Figure Study II', blurb: '', size: '', src: 'assets/portfolio/body-profile-women02.jpg' },
    'women-03': { eyebrow: 'No. 29', title: 'Figure Study III', blurb: '', size: '', src: 'assets/portfolio/body-profile-women03.jpg' },
    'man-01': { eyebrow: 'No. 30', title: 'Figure Study IV', blurb: '', size: '', src: 'assets/portfolio/body-profile-man01.jpg' },
    'man-02': { eyebrow: 'No. 31', title: 'Figure Study V', blurb: '', size: '', src: 'assets/portfolio/body-profile-man02.jpg' },
    'man-03': { eyebrow: 'No. 32', title: 'Figure Study VI', blurb: '', size: '', src: 'assets/portfolio/body-profile-man03.jpg' },
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

  function scrollToTop() {
    try {
      // Always instant: we hide the jump behind the paint transition.
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  function navigate(name) {
    if (name === currentSection) return;
    if (transition) {
      transition.requestNavigate(name);
      return;
    }
    showSection(name);
    scrollToTop();
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
    scrollToTop();
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
    lbBlurb.textContent = p.blurb || '';
    lbBlurb.style.display = p.blurb ? '' : 'none';
    lbSize.textContent = p.size || '';
    var lbSizeRow = lbSize.closest('.meta-k')?.parentElement;
    if (lbSizeRow) lbSizeRow.style.display = p.size ? '' : 'none';
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
        // Runs at full cover (midpoint) — safe time to jump scroll instantly.
        scrollToTop();
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
