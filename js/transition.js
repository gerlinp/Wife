/* global gsap */
// Paint transition — adapted from the real Serica site transition.
// Two long brush-stroke SVG paths animate on (cover) then off (reveal),
// with a brush PNG that follows the tip of the top stroke.
//
// Exposes window.SericaTransition with: initIntro(), requestNavigate(route)

(function () {
  /**
   * Lower stroke palette (stroke-1). Section fields are subset of ~5–6 solids; forbidding from+to
   * removes at most 2, so 13 entries always leaves multiple picks — and the deck reshuffles unused
   * colors before repeats (beyond the from/to/avoid-same-chain rules below).
   */
  const LOWER_STROKE_PALETTE = [
    "#e07a3c",
    "#c85a1c",
    "#f09048",
    "#d68028",
    "#1a1612",
    "#463c33",
    "#6b7d5e",
    "#d1b399",
    "#f6f0e4",
    "#837767",
    "#ffffff",

    // ── Palette extras after #ffffff (dusty terracotta, deep forest-gray):
    "#9c6f4e",
    "#2c3d35",
  ];

  function shuffled(arr) {
    const c = [...arr];
    for (let i = c.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
  }

  function normalizeHex(hex) {
    return String(hex || "").trim().toLowerCase();
  }

  const BRUSH_ART_W = 1721.433;
  const BRUSH_ART_H = 3086.997;
  const BRUSH_TIP_X = 640;
  const BRUSH_TIP_Y = 2790;
  const BRUSH_IMG_CSS_WIDTH = 520;
  const TOP_STROKE_INDEX = 1;
  const COVER_DURATION = 1.5;
  const REVEAL_DURATION = 1.5;

  /** Section main field (aligned with showSection / --nav-bg logic in main.js). */
  function backgroundHexForSection(sectionName) {
    const n = String(sectionName || "home").trim();
    try {
      const rs = getComputedStyle(document.documentElement);
      if (n === "gallery") return "#d1b399";
      if (n === "writing") {
        return rs.getPropertyValue("--ink-mute").trim() || "#837767";
      }
      if (n === "resume") {
        return rs.getPropertyValue("--sage").trim() || "#6b7d5e";
      }
      if (n === "contact") {
        return rs.getPropertyValue("--ink").trim() || "#1a1612";
      }
      return rs.getPropertyValue("--paper").trim() || "#f6f0e4";
    } catch (e) {
      return "#f6f0e4";
    }
  }

  function createPaintTransition(opts) {
    const {
      svg,
      brushPanel,
      brushImg,
      onMidNavigate,
      initialSection = "home",
    } = opts;

    let paths = [];
    let brushShown = false;
    /** Consumed in order after each shuffle (see nextLowerStrokeColor). */
    let lowerStrokeQueue = [];
    /** Normalized hex of last stroke-1; avoids repeating the same lower back-to-back. */
    let lastLowerStrokeNorm = null;
    let introComplete = false;
    let introTl = null;
    let routeTl = null;

    function brushDistanceAlongStroke(path, length) {
      const off = parseFloat(path.style.strokeDashoffset);
      if (!Number.isFinite(off)) return Math.min(length * 0.5, length - 1e-4);
      return Math.min(Math.max(length - off, 1e-4), length - 1e-4);
    }

    function applyBrushHudVisibility() {
      if (!brushPanel) return;
      brushPanel.style.opacity = brushShown ? "1" : "0";
      brushPanel.style.visibility = brushShown ? "visible" : "hidden";
    }

    function setBrushLayerVisible(on) {
      brushShown = on;
      applyBrushHudVisibility();
    }

    function syncBrushFollowToTopStroke() {
      if (!brushShown) return;
      const path = paths[TOP_STROKE_INDEX];
      if (!brushImg || !path?.ownerSVGElement) return;
      const owner = path.ownerSVGElement;
      const length = path.getTotalLength();
      const drawn = brushDistanceAlongStroke(path, length);
      const lp = path.getPointAtLength(drawn);
      const ctm = path.getScreenCTM();
      if (!ctm) return;
      const ptSvg = owner.createSVGPoint();
      ptSvg.x = lp.x;
      ptSvg.y = lp.y;
      const sp = ptSvg.matrixTransform(ctm);
      const w = BRUSH_IMG_CSS_WIDTH;
      const displayedH = (w * BRUSH_ART_H) / BRUSH_ART_W;
      const tipXPx = (BRUSH_TIP_X / BRUSH_ART_W) * w;
      const tipYPx = (BRUSH_TIP_Y / BRUSH_ART_H) * displayedH;
      brushImg.style.left = `${sp.x - tipXPx}px`;
      brushImg.style.top = `${sp.y - tipYPx}px`;
      brushImg.style.width = `${w}px`;
      brushImg.style.transform = "none";
      brushImg.style.transformOrigin = `${tipXPx}px ${tipYPx}px`;
    }

    /** Stroke-1 = lower (palette). Never matches destination or origin field; avoids same as last lower. */
    function nextLowerStrokeColor(toBgHex, fromBgHexMayBeNull) {
      const forbidden = new Set();
      forbidden.add(normalizeHex(toBgHex));
      const fromN = fromBgHexMayBeNull != null ? normalizeHex(fromBgHexMayBeNull) : "";
      if (fromN) forbidden.add(fromN);

      const allowed = (c) =>
        !forbidden.has(normalizeHex(c)) &&
        normalizeHex(c) !== lastLowerStrokeNorm;

      if (!lowerStrokeQueue.length) {
        lowerStrokeQueue = shuffled([...LOWER_STROKE_PALETTE]);
      }
      let idx = lowerStrokeQueue.findIndex(allowed);
      if (idx === -1) {
        idx = lowerStrokeQueue.findIndex((c) => !forbidden.has(normalizeHex(c)));
      }
      if (idx === -1) {
        const pool = LOWER_STROKE_PALETTE.filter((c) => !forbidden.has(normalizeHex(c)));
        lowerStrokeQueue = pool.length ? shuffled(pool) : shuffled([...LOWER_STROKE_PALETTE]);
        idx = 0;
      }
      const [chosen] = lowerStrokeQueue.splice(idx, 1);
      lastLowerStrokeNorm = normalizeHex(chosen);
      return chosen;
    }

    function setStrokeColorsForDestination(toSection, fromSectionMayBeNull) {
      const top = backgroundHexForSection(toSection);
      const fromBg =
        fromSectionMayBeNull != null && String(fromSectionMayBeNull).trim() !== ""
          ? backgroundHexForSection(fromSectionMayBeNull)
          : null;
      const bottom = nextLowerStrokeColor(top, fromBg);
      document.documentElement.style.setProperty("--transition-stroke-1", bottom);
      document.documentElement.style.setProperty("--transition-stroke-2", top);
    }

    function refreshPathsFromSvg() {
      paths = Array.from(svg.querySelectorAll("path.transition-stroke"));
    }

    function playIntroReveal(lengthsOverride) {
      introTl?.pause();
      setStrokeColorsForDestination(initialSection, null);
      refreshPathsFromSvg();
      const lengths =
        lengthsOverride ?? paths.map((p) => p.getTotalLength());

      paths.forEach((path, idx) => {
        path.style.strokeDasharray = String(lengths[idx]);
        path.style.strokeDashoffset = "0";
        path.style.strokeWidth = "700";
      });

      const sync = () => syncBrushFollowToTopStroke();

      const tl = gsap.timeline({
        onStart: () => {
          setBrushLayerVisible(true);
          sync();
          queueMicrotask(sync);
          requestAnimationFrame(sync);
        },
        onUpdate: sync,
        onComplete: () => {
          introComplete = true;
          setBrushLayerVisible(false);
        },
      });

      paths.forEach((path, idx) => {
        tl.to(
          path,
          {
            strokeDashoffset: lengths[idx],
            strokeWidth: 200,
            duration: REVEAL_DURATION,
            ease: "none",
          },
          0
        );
      });

      introTl = tl;
    }

    function requestNavigate(targetRoute) {
      refreshPathsFromSvg();
      if (!paths.length) {
        onMidNavigate(targetRoute);
        return;
      }

      if (!introComplete) {
        introTl?.pause();
        setBrushLayerVisible(false);
        onMidNavigate(targetRoute);
        return;
      }

      routeTl?.kill();
      setBrushLayerVisible(false);

      const lengths = paths.map((p) => p.getTotalLength());
      paths.forEach((path, idx) => {
        path.style.strokeDasharray = String(lengths[idx]);
        path.style.strokeDashoffset = String(lengths[idx]);
        path.style.strokeWidth = "200";
      });

      var fromRoute =
        (document.body && document.body.dataset && document.body.dataset.section) || "home";
      setStrokeColorsForDestination(targetRoute, fromRoute);
      const sync = () => syncBrushFollowToTopStroke();

      const tl = gsap.timeline({
        onStart: () => {
          setBrushLayerVisible(true);
          sync();
          queueMicrotask(sync);
          requestAnimationFrame(sync);
        },
        onUpdate: sync,
        onComplete: () => setBrushLayerVisible(false),
      });
      routeTl = tl;

      paths.forEach((path) => {
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            strokeWidth: 700,
            duration: COVER_DURATION,
            ease: "none",
          },
          0
        );
      });

      tl.call(() => onMidNavigate(targetRoute), [], COVER_DURATION);

      paths.forEach((path, idx) => {
        tl.to(
          path,
          {
            strokeDashoffset: lengths[idx],
            strokeWidth: 200,
            duration: REVEAL_DURATION,
            ease: "none",
          },
          COVER_DURATION
        );
      });
    }

    function initIntro() {
      refreshPathsFromSvg();
      const lengths = paths.map((p) => p.getTotalLength());
      paths.forEach((path, idx) => {
        path.style.strokeDasharray = String(lengths[idx]);
        path.style.strokeDashoffset = "0";
        path.style.strokeWidth = "700";
      });
      if (!introComplete) playIntroReveal(lengths);
    }

    return { initIntro, requestNavigate };
  }

  window.SericaTransition = { createPaintTransition };
})();
