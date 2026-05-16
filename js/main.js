import {
  PAINTINGS,
  HOME_FEATURE_PAINTING_ID,
  ABOUT_PORTRAIT_PAINTING_ID,
  CONTACT_FEATURE_PAINTING_ID,
  CV_SELECTED_WORK_IDS,
  COLLAGE_ESSAY_PAINTING_ID,
  paintingById,
  cvNoteFromPainting,
} from "./paintings-data.js";

// ── Derived lookup (lightbox) ────────────────────────────────────────────────
const PAINTINGS_MAP = Object.fromEntries(PAINTINGS.map((p) => [p.id, p]));

var SECTIONS = ["home", "gallery", "about", "resume", "writing", "contact"];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

function renderGalleryGrid(grid) {
  if (!grid) return;
  grid.innerHTML = "";
  PAINTINGS.forEach(function (p, i) {
    var metaParts = [];
    if (p.medium) {
      metaParts.push("<span>" + escapeHtml(p.medium) + "</span>");
    }
    if (p.size) {
      if (metaParts.length) metaParts.push('<span class="dot-sep">·</span>');
      metaParts.push("<span>" + escapeHtml(p.size) + "</span>");
    }
    if (p.year != null && p.year !== "") {
      if (metaParts.length) metaParts.push('<span class="dot-sep">·</span>');
      metaParts.push("<span>" + escapeHtml(String(p.year)) + "</span>");
    }
    var metaHtml = metaParts.length
      ? '<div class="piece-meta">' + metaParts.join("") + "</div>"
      : "";

    var article = document.createElement("article");
    article.className = "piece piece-" + i;
    article.dataset.id = p.id;
    article.innerHTML =
      '<div class="piece-frame"><img src="' +
      escapeAttr(p.src) +
      '" alt="' +
      escapeAttr(p.title) +
      '" /></div>' +
      '<div class="piece-caption">' +
      '<div class="piece-num">' +
      escapeHtml(p.eyebrow) +
      "</div>" +
      '<h3 class="piece-title">' +
      escapeHtml(p.title) +
      "</h3>" +
      metaHtml +
      "</div>";
    grid.appendChild(article);
  });
}

function renderHomeFeature(container) {
  var p = paintingById(HOME_FEATURE_PAINTING_ID);
  if (!container || !p) return;
  var y = p.year != null ? String(p.year) : "";
  container.innerHTML =
    '<img src="' +
    escapeAttr(p.src) +
    '" alt="" class="swatch-img" />' +
    '<div class="swatch-tag">' +
    escapeHtml(p.eyebrow + " / " + p.title + " / " + y) +
    "</div>";
}

function renderAboutPortrait(container) {
  var p = paintingById(ABOUT_PORTRAIT_PAINTING_ID);
  if (!container || !p) return;
  var y = p.year != null ? String(p.year) : "";
  container.innerHTML =
    '<img src="' +
    escapeAttr(p.src) +
    '" alt="Serica Jones" class="swatch-img" />' +
    '<div class="swatch-tag">' +
    escapeHtml(p.eyebrow + " / " + p.title + " / " + y) +
    "</div>";
}

function renderCvWorks(container) {
  if (!container) return;
  container.innerHTML = "";
  CV_SELECTED_WORK_IDS.forEach(function (id) {
    var p = PAINTINGS_MAP[id];
    if (!p) return;
    var row = document.createElement("div");
    row.className = "cv-row";
    row.innerHTML =
      '<div class="cv-year">' +
      escapeHtml(p.year != null ? String(p.year) : "") +
      "</div>" +
      '<div class="cv-body">' +
      '<div class="cv-title">' +
      escapeHtml(p.title) +
      "</div>" +
      '<div class="cv-where">' +
      escapeHtml(cvNoteFromPainting(p)) +
      "</div>" +
      "</div>";
    container.appendChild(row);
  });
}

function renderContactFeature(container) {
  var p = paintingById(CONTACT_FEATURE_PAINTING_ID);
  if (!container || !p) return;
  var y = p.year != null ? String(p.year) : "";
  container.innerHTML =
    '<img src="' +
    escapeAttr(p.src) +
    '" alt="' +
    escapeAttr(p.title) +
    '" />' +
    '<div class="caption-mono" style="margin-top:12px">' +
    escapeHtml(p.title + " · " + y) +
    "</div>";
}

function renderCollageEssayExcerpt(el) {
  if (!el) return;
  var p = paintingById(COLLAGE_ESSAY_PAINTING_ID);
  if (!p) return;
  el.textContent =
    "A short essay on why I started cutting up old fabric — and why '" +
    p.title +
    "' wouldn't exist without a yard sale in 2024.";
}

function bindGalleryPieces() {
  document.querySelectorAll(".piece[data-id]").forEach(function (el) {
    el.addEventListener("click", function () {
      openLightbox(el.dataset.id);
    });
    el.style.cursor = "pointer";
  });
}

// ── Routing ─────────────────────────────────────────────────────────────────
var currentSection = "home";

function readHash() {
  var h = (window.location.hash || "").replace(/^#\/?/, "").trim();
  return SECTIONS.indexOf(h) !== -1 ? h : "home";
}

function showSection(name, skipHistory) {
  if (SECTIONS.indexOf(name) === -1) name = "home";
  currentSection = name;
  document.body.dataset.section = name;

  document.querySelectorAll(".section").forEach(function (el) {
    el.classList.remove("active");
  });
  var target = document.querySelector(".section-" + name);
  if (target) target.classList.add("active");

  document.querySelectorAll("[data-nav]").forEach(function (el) {
    el.classList.toggle("active", el.dataset.nav === name);
  });

  try {
    var rootStyles = getComputedStyle(document.documentElement);
    var paper = rootStyles.getPropertyValue("--paper").trim() || "#ffffff";
    var navBg = paper;
    if (name === "gallery") navBg = "#d1b399";
    else if (name === "writing") {
      navBg = rootStyles.getPropertyValue("--ink-mute").trim() || "#837767";
    } else if (name === "resume") {
      navBg = rootStyles.getPropertyValue("--sage").trim() || "#6b7d5e";
    } else if (name === "contact") {
      navBg = rootStyles.getPropertyValue("--ink").trim() || "#1a1612";
    }
    document.documentElement.style.setProperty("--nav-bg", navBg);
  } catch (e) {
    // no-op
  }

  if (!skipHistory) {
    var hash = name === "home" ? "#" : "#" + name;
    history.pushState({ section: name }, "", hash);
  }
}

var transition = null;

function scrollToTop() {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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

// ── Nav ─────────────────────────────────────────────────────────────────────
document.querySelectorAll("[data-nav]").forEach(function (el) {
  el.addEventListener("click", function () {
    navigate(el.dataset.nav);
  });
});

// ── Collapsible nav (mobile) ──────────────────────────────────────────────────
var nav = document.querySelector(".site-nav");
var navToggle = nav ? nav.querySelector(".nav-toggle") : null;
var navMenu = document.getElementById("site-nav-menu");
var siteMenu = document.getElementById("site-menu");
var siteMenuBackdrop = siteMenu ? siteMenu.querySelector(".site-menu-backdrop") : null;
var navMq = window.matchMedia("(max-width: 1024px)");
var priorBodyOverflow = "";

function setNavOpen(open) {
  if (!nav || !navToggle) return;
  document.body.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (siteMenu) siteMenu.setAttribute("aria-hidden", open ? "false" : "true");

  if (open) {
    priorBodyOverflow = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = priorBodyOverflow;
  }
}

function syncNavForViewport() {
  if (!navMq.matches) setNavOpen(false);
}

navToggle?.addEventListener("click", function (e) {
  e.preventDefault();
  var isOpen = document.body.classList.contains("menu-open");
  setNavOpen(!isOpen);
});

function maybeCloseFromNavClick(e) {
  var t = e.target;
  if (!navMq.matches) return;
  if (t && t.closest && t.closest("[data-nav]")) setNavOpen(false);
}
navMenu?.addEventListener("click", maybeCloseFromNavClick);
siteMenu?.addEventListener("click", maybeCloseFromNavClick);
siteMenuBackdrop?.addEventListener("click", function () {
  if (!navMq.matches) return;
  setNavOpen(false);
});

window.addEventListener("keydown", function (ev) {
  if (ev.key !== "Escape") return;
  if (!navMq.matches) return;
  if (document.body.classList.contains("menu-open")) setNavOpen(false);
});

navMq.addEventListener("change", syncNavForViewport);
syncNavForViewport();

window.addEventListener("popstate", function () {
  showSection(readHash(), true);
  scrollToTop();
});

// ── Lightbox ────────────────────────────────────────────────────────────────
var lightbox = document.getElementById("lightbox");
var lbImg = document.getElementById("lb-img");
var lbEyebrow = document.getElementById("lb-eyebrow");
var lbTitle = document.getElementById("lb-title");
var lbBlurb = document.getElementById("lb-blurb");
var lbSize = document.getElementById("lb-size");

function openLightbox(id) {
  var p = PAINTINGS_MAP[id];
  if (!p || !lightbox) return;
  lbImg.src = p.src;
  lbImg.alt = p.title;
  lbEyebrow.textContent = p.eyebrow;
  lbTitle.textContent = p.title;
  lbBlurb.textContent = p.blurb || "";
  lbBlurb.style.display = p.blurb ? "" : "none";
  lbSize.textContent = p.size || "";
  var lbSizeRow = lbSize.closest(".meta-k")?.parentElement;
  if (lbSizeRow) lbSizeRow.style.display = p.size ? "" : "none";
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.style.display = "none";
  document.body.style.overflow = "";
  lbImg.src = "";
}

document.getElementById("lb-close")?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", function (e) {
  if (e.target === lightbox) closeLightbox();
});

// ── Resume tabs ─────────────────────────────────────────────────────────────
document.querySelectorAll(".cv-tabs button[data-tab]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var tabId = btn.dataset.tab;
    document.querySelectorAll(".cv-tabs button").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    document.querySelectorAll(".cv-pane").forEach(function (pane) {
      pane.classList.remove("active");
    });
    var pane = document.getElementById("cv-" + tabId);
    if (pane) pane.classList.add("active");
  });
});

// ── Contact form ─────────────────────────────────────────────────────────────
var contactForm = document.getElementById("contact-form");
var formSent = document.querySelector(".form-sent");
var sendAnother = document.getElementById("send-another");

contactForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  if (contactForm) contactForm.style.display = "none";
  if (formSent) formSent.style.display = "block";
});

sendAnother?.addEventListener("click", function () {
  if (formSent) formSent.style.display = "none";
  if (contactForm) {
    contactForm.reset();
    contactForm.style.display = "";
  }
});

document.querySelectorAll(".subject-pills button").forEach(function (pill) {
  pill.addEventListener("click", function () {
    document.querySelectorAll(".subject-pills button").forEach(function (p) {
      p.classList.remove("active");
    });
    pill.classList.add("active");
  });
});

document.querySelectorAll(".subject-pills").forEach(function (wrap) {
  var active = wrap.querySelector("button.active");
  if (!active) {
    var commission = wrap.querySelector('button[data-subject="commission"]');
    if (commission) commission.classList.add("active");
  }
});

// ── Cursor dab ──────────────────────────────────────────────────────────────
var cursorDab = document.getElementById("cursor-dab");
var dabTimeout = null;

if (cursorDab) {
  document.addEventListener("mousemove", function (e) {
    cursorDab.style.left = e.clientX + "px";
    cursorDab.style.top = e.clientY + "px";
    cursorDab.classList.add("active");
    clearTimeout(dabTimeout);
    dabTimeout = setTimeout(function () {
      cursorDab.classList.remove("active");
    }, 1200);
  });
}

// ── Keyboard shortcuts ──────────────────────────────────────────────────────
document.addEventListener("keydown", function (e) {
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA"))
    return;
  var idx = parseInt(e.key, 10);
  if (idx >= 1 && idx <= 6) {
    navigate(SECTIONS[idx - 1]);
  }
  if (e.key === "Escape") {
    closeLightbox();
  }
});

// ── Paint transition ────────────────────────────────────────────────────────
var svg = document.querySelector(".transition-svg svg");
var brushPanel = document.getElementById("brushPanel");
var brushImg = brushPanel ? brushPanel.querySelector("img") : null;

if (svg && brushPanel && brushImg && window.SericaTransition) {
  var trans = window.SericaTransition.createPaintTransition({
    svg: svg,
    brushPanel: brushPanel,
    brushImg: brushImg,
    initialSection: readHash(),
    onMidNavigate: function (name) {
      scrollToTop();
      showSection(name);
    },
  });
  transition = trans;
  requestAnimationFrame(function () {
    trans.initIntro();
  });
}

// ── Populate DOM from shared painting data ───────────────────────────────────
renderGalleryGrid(document.getElementById("gallery-grid"));
bindGalleryPieces();
renderHomeFeature(document.getElementById("home-feature-swatch"));
renderAboutPortrait(document.getElementById("about-portrait-swatch"));
renderCvWorks(document.getElementById("cv-works-rows"));
renderContactFeature(document.getElementById("contact-feature-art"));
renderCollageEssayExcerpt(document.querySelector("[data-painting-excerpt]"));

// ── Init ────────────────────────────────────────────────────────────────────
showSection(readHash(), true);
