/**
 * Single source of truth for all paintings. Edit here — index.html (via main.js)
 * and components.jsx both consume this module.
 */

/** @typedef {{ id: string, src: string, title: string, eyebrow: string, year?: number|null, medium?: string, size?: string, blurb?: string }} Painting */

/** Featured painting on the home hero swatch */
export const HOME_FEATURE_PAINTING_ID = "sunset-lake";

/** Portrait swatch on the About section */
export const ABOUT_PORTRAIT_PAINTING_ID = "collage-portrait";

/** Small artwork on the contact aside */
export const CONTACT_FEATURE_PAINTING_ID = "beach-cat";

/** Order = CV "Selected works" list (newest first) */
export const CV_SELECTED_WORK_IDS = [
  "collage-portrait",
  "jazz",
  "sunset-lake",
  "beach-cat",
];

/** Painting title referenced in the collage essay excerpt */
export const COLLAGE_ESSAY_PAINTING_ID = "collage-portrait";

/**
 * Gallery display order — colour-forward top, monochrome/studies bottom.
 * @type {Painting[]}
 */
export const PAINTINGS = [
  // ── Top third: colour-forward ──────────────────────────────────────────────
  {
    id: "sunset-lake",
    eyebrow: "No. 01",
    title: "Lake at Last Light",
    year: 2024,
    medium: "Acrylic on canvas",
    size: '11 × 14"',
    blurb:
      "Painted over three evenings in August, chasing the precise moment the sky goes copper just before the light fails. The water in the foreground is four layers — the last one applied with a palette knife to get the shimmer right.",
    src: "images/sunset-lake.jpg",
  },
  {
    id: "collage-portrait",
    eyebrow: "No. 02",
    title: "Sisters",
    year: 2025,
    medium: "Mixed media",
    size: '18 × 24"',
    blurb:
      "Built up from lace, sheet music, cut fabric, and old photographs before the paint touched it. The gold is from a 1970s paperback spine I found at an estate sale. I spent more time cutting than painting, which felt right.",
    src: "images/collage-portrait.jpg",
  },
  {
    id: "jazz",
    eyebrow: "No. 03",
    title: "Jazz",
    year: 2026,
    medium: "Acrylic on canvas",
    size: '18 × 24"',
    blurb:
      "From a small club with the lights low — brass and warmth, the shapes half-remembered the next morning. I kept it loose on purpose: rhythm first, detail only where the music landed.",
    src: "images/Jazz.jpg",
  },
  {
    id: "verna",
    eyebrow: "No. 04",
    title: "Verna",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/verna.jpg",
  },
  {
    id: "img-20-i",
    eyebrow: "No. 05",
    title: "Studio Work",
    year: 2020,
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/IMG_20200324_125501455~2.jpg",
  },
  {
    id: "beach-cat",
    eyebrow: "No. 06",
    title: "Sentinel by the Sea",
    year: 2023,
    medium: "Acrylic on canvas",
    size: '24 × 24"',
    blurb:
      "A cat I met on a beach in Georgia, standing at the exact point where the dry sand meets the wet. She stayed there for twenty minutes, watching something I couldn't see. I painted her from memory a week later.",
    src: "images/beach-cat.jpg",
  },
  {
    id: "img-20-ii",
    eyebrow: "No. 07",
    title: "Falls in the Green",
    year: 2020,
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/IMG_20200708_210820590.jpg",
  },
  {
    id: "img-22-iii",
    eyebrow: "No. 08",
    title: "Poetic Justice",
    year: 2022,
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/IMG_20220414_021959543~5.jpg",
  },
  {
    id: "img-22-ii",
    eyebrow: "No. 09",
    title: "Fairy",
    year: 2022,
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/IMG_20220414_021615871~3.jpg",
  },
  {
    id: "img-17-ii",
    eyebrow: "No. 10",
    title: "Forever — Study",
    year: 2017,
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/IMG_20171101_165401239.jpg",
  },
  {
    id: "img-24",
    eyebrow: "No. 11",
    title: "Forever Love",
    year: 2024,
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/IMG_20241119_135833020~2.jpg",
  },
  // ── Middle third: mixed-energy ─────────────────────────────────────────────
  {
    id: "earth",
    eyebrow: "No. 12",
    title: "Earth",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/Earth.jpg",
  },
  {
    id: "disco-baby",
    eyebrow: "No. 13",
    title: "Disco Baby",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/Disco%20Baby%20copy.jpg",
  },
  {
    id: "frogador",
    eyebrow: "No. 14",
    title: "Frogador",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/Frogador.jpg",
  },
  {
    id: "img-23",
    eyebrow: "No. 15",
    title: "350",
    year: 2023,
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/IMG_20231215_123908218~2.jpg",
  },
  {
    id: "img-22-i",
    eyebrow: "No. 16",
    title: "Burning City, Burning Tree",
    year: 2022,
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/IMG_20220401_162321232~2.jpg",
  },
  {
    id: "jogger",
    eyebrow: "No. 17",
    title: "The Jogger",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/jogger%20all.jpg",
  },
  {
    id: "wacky-olympics-2",
    eyebrow: "No. 18",
    title: "Olympics — Ice",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/wacky%20olympics%202.jpg",
  },
  {
    id: "wacky-olympics-a",
    eyebrow: "No. 19",
    title: "Olympics — Ant",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/wacky%20olympics%20a..jpg",
  },
  {
    id: "dusty-still",
    eyebrow: "No. 20",
    title: "Dusty Still",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/dusty%20still.jpg",
  },
  // ── Lower third: monochrome ─────────────────────────────────────────────────
  {
    id: "img-17-i",
    eyebrow: "No. 21",
    title: "The Kiss",
    year: 2017,
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/IMG_20171101_164423397.jpg",
  },
  {
    id: "cool-hand-luke",
    eyebrow: "No. 22",
    title: "Cool Hand Luke",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/cool%20hand%20luke.jpg",
  },
  {
    id: "peace",
    eyebrow: "No. 23",
    title: "The Dancer",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/peace.jpg",
  },
  {
    id: "figure-1",
    eyebrow: "No. 24",
    title: "Ribcage, Reclining",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/figure%201.jpg",
  },
  {
    id: "flick",
    eyebrow: "No. 25",
    title: "Pelvis & Leg",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/flick.jpg",
  },
  {
    id: "brown-girl",
    eyebrow: "No. 26",
    title: "Brown Girl",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/brown%20girl~2.jpeg",
  },
  // ── Bottom: figure study series ────────────────────────────────────────────
  {
    id: "women-01",
    eyebrow: "No. 27",
    title: "Standing — Skin",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/body-profile-women01.jpg",
  },
  {
    id: "women-02",
    eyebrow: "No. 28",
    title: "Standing — Muscle",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/body-profile-women02.jpg",
  },
  {
    id: "women-03",
    eyebrow: "No. 29",
    title: "Standing — Bone",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/body-profile-women03.jpg",
  },
  {
    id: "man-01",
    eyebrow: "No. 30",
    title: "Seated — Skin",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/body-profile-man01.jpg",
  },
  {
    id: "man-02",
    eyebrow: "No. 31",
    title: "Seated — Muscle",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/body-profile-man02.jpg",
  },
  {
    id: "man-03",
    eyebrow: "No. 32",
    title: "Seated — Bone",
    medium: "",
    size: "",
    blurb: "",
    src: "assets/portfolio/body-profile-man03.jpg",
  },
];

export function paintingById(id) {
  return PAINTINGS.find((p) => p.id === id);
}

/** CV subtitle line: "Acrylic · …" / "Mixed media · …" */
export function cvNoteFromPainting(p) {
  if (!p) return "";
  const dim = p.size || "";
  const med = p.medium || "";
  if (med.includes("Mixed")) return dim ? `Mixed media · ${dim}` : "Mixed media";
  if (med.includes("Acrylic")) return dim ? `Acrylic · ${dim}` : "Acrylic";
  return [med, dim].filter(Boolean).join(" · ");
}
