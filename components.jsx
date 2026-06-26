// =====================================================================
// Site sections for Serica Jones — artist portfolio.
// =====================================================================

import {
  PAINTINGS,
  HOME_FEATURE_PAINTING_ID,
  ABOUT_PORTRAIT_PAINTING_ID,
  CONTACT_FEATURE_PAINTING_ID,
  CV_SELECTED_WORK_IDS,
  COLLAGE_ESSAY_PAINTING_ID,
  paintingById,
  cvNoteFromPainting,
} from "./js/paintings-data.js";

const homeFeaturePainting = paintingById(HOME_FEATURE_PAINTING_ID);
const aboutPortraitPainting = paintingById(ABOUT_PORTRAIT_PAINTING_ID);
const contactFeaturePainting = paintingById(CONTACT_FEATURE_PAINTING_ID);
const collageEssayTitle =
  paintingById(COLLAGE_ESSAY_PAINTING_ID)?.title ?? "";

// ---------- Nav -------------------------------------------------------
function Nav({ current, onNav }) {
  const items = ["home", "gallery", "about", "resume", "writing", "contact"];
  return (
    <nav className="site-nav">
      <div className="nav-mark" onClick={() => onNav("home")}>
        <span className="nav-mark-glyph">Serica Jones</span>
      </div>
      <button
        className="nav-toggle"
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="site-nav-menu"
      >
        Menu
      </button>
      <ul id="site-nav-menu">
        {items.map((id) => (
          <li key={id}>
            <button
              className={current === id ? "active" : ""}
              onClick={() => onNav(id)}
            >
              <span className="nav-num">
                {String(items.indexOf(id) + 1).padStart(2, "0")}.
              </span>
              <span className="nav-label">{id}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ---------- Home / hero -----------------------------------------------
function Home({ onNav }) {
  return (
    <section className="section section-home" data-screen-label="01 Home">
      <div className="home-grid">
        <div className="home-eyebrow">
          <span className="dot" /> Serica Jones
          <span className="muted"> · artist &amp; art educator</span>
        </div>

        <h1 className="home-title">
          <span className="line">Painted</span>
          <span className="line italic">in the time</span>
          <span className="line">it takes a</span>
          <span className="line accent">brush to lift.</span>
        </h1>

        <p className="home-lede">
          Paintings and mixed-media works — landscapes carried from memory and
          portraits built up in layers. When she isn’t in the studio, she’s in
          the classroom teaching foundations and critique.
        </p>

        <div className="home-cta">
          <button className="btn btn-primary" onClick={() => onNav("gallery")}>
            View the work
            <span className="arrow">→</span>
          </button>
          <button className="btn btn-ghost" onClick={() => onNav("about")}>
            About the artist
          </button>
        </div>
      </div>

      <div className="home-accent">
        <div className="paper-swatch">
          <img
            src={homeFeaturePainting.src}
            alt=""
            className="swatch-img"
          />
          <div className="swatch-tag">
            {homeFeaturePainting.eyebrow} / {homeFeaturePainting.title} /{" "}
            {homeFeaturePainting.year}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Gallery ---------------------------------------------------
function PieceMeta({ p }) {
  const nodes = [];
  if (p.medium) nodes.push(<span key="m">{p.medium}</span>);
  if (p.size) {
    if (nodes.length) nodes.push(<span key="d1" className="dot-sep">·</span>);
    nodes.push(<span key="s">{p.size}</span>);
  }
  if (p.year != null && p.year !== "") {
    if (nodes.length) nodes.push(<span key="d2" className="dot-sep">·</span>);
    nodes.push(<span key="y">{p.year}</span>);
  }
  if (!nodes.length) return null;
  return <div className="piece-meta">{nodes}</div>;
}

function Gallery({ onOpen }) {
  return (
    <section className="section section-gallery" data-screen-label="02 Gallery">
      <header className="section-head">
        <div className="head-num">02.</div>
        <h2 className="head-title">
          The <em>Gallery</em>
        </h2>
        <p className="head-sub">
          Works on view. Click a piece to open it.
        </p>
      </header>

      <div className="gallery-grid">
        {PAINTINGS.map((p, i) => (
          <article
            key={p.id}
            className={`piece piece-${i}`}
            onClick={() => onOpen(p)}
          >
            <div className="piece-frame">
              <img src={p.src} alt={p.title} />
            </div>
            <div className="piece-caption">
              <div className="piece-num">{p.eyebrow}</div>
              <h3 className="piece-title">{p.title}</h3>
              <PieceMeta p={p} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------- Lightbox --------------------------------------------------
function Lightbox({ piece, onClose }) {
  if (!piece) return null;
  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="lb-frame">
          <img src={piece.src} alt={piece.title} />
        </div>
        <div className="lb-caption">
          <div className="lb-eyebrow">{piece.eyebrow}</div>
          <h3 className="lb-title">{piece.title}</h3>
          {piece.blurb ? <p className="lb-blurb">{piece.blurb}</p> : null}
          <div className="lb-meta">
            {piece.size ? (
              <div>
                <div className="meta-k">Size</div>
                <div className="meta-v">{piece.size}</div>
              </div>
            ) : null}
            <div>
              <div className="meta-k">Status</div>
              <div className="meta-v">Available — inquire</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- About -----------------------------------------------------
function About() {
  return (
    <section className="section section-about" data-screen-label="03 About">
      <header className="section-head">
        <div className="head-num">03.</div>
        <h2 className="head-title">
          About <em>Serica</em>
        </h2>
      </header>

      <div className="about-grid">
        <div className="about-portrait">
          <div className="paper-swatch tilted">
            <img
              src={aboutPortraitPainting.src}
              alt="Serica Jones"
              className="swatch-img"
            />
            <div className="swatch-tag">
              {aboutPortraitPainting.eyebrow} / {aboutPortraitPainting.title} /{" "}
              {aboutPortraitPainting.year}
            </div>
          </div>
        </div>

        <div className="about-copy">
          <p className="about-lede">
            Serica Jones is a painter and art school instructor working in
            acrylic and mixed media. Her work moves between memory-based
            landscapes and layered portraits — anything that can hold a story.
          </p>
          <p>
            She began painting at a kitchen table in 2016 and now splits her
            weeks between making work and teaching. She’s most interested in
            the moment a painting “turns” — usually somewhere between the third
            and fourth layer — when a lesson from class meets an accident in
            the studio.
          </p>
          <p>
            Recent work moves between two registers: quiet, distance-soft
            landscapes, and dense layered portraits that gather the textures
            of a life — flags, lace, sheet music, hair. Both are built with
            the same tools she teaches: drawing, edges, and patience.
          </p>

          <div className="pull-quote">
            <span className="quote-mark">"</span>
            You can’t use up creativity. The more you use, the more you have.
            <span className="quote-attr">
              — Maya Angelou, <cite>Conversations with Maya Angelou</cite>, 1989
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Resume ----------------------------------------------------
const RESUME = {
  exhibitions: [
    {
      year: "2026",
      title: "Group show — Coastal Arts Center",
      where: "Saint Augustine, FL",
      kind: "upcoming",
    },
    {
      year: "2025",
      title: '"Crowned & Carried" — solo exhibition',
      where: "Marigold Gallery, Atlanta GA",
    },
    {
      year: "2024",
      title: "Small Works Annual",
      where: "River Bend Co-op",
    },
    {
      year: "2023",
      title: 'Two-person — "Shorelines"',
      where: "Studio 14, Brunswick GA",
    },
    {
      year: "2022",
      title: "Open Studios (debut)",
      where: "Hometown Arts Festival",
    },
  ],
  selectedWorks: CV_SELECTED_WORK_IDS.map((id) => paintingById(id))
    .filter(Boolean)
    .map((p) => ({
      year: String(p.year),
      title: p.title,
      note: cvNoteFromPainting(p),
    })),
  education: [
    {
      year: "2016 →",
      title: "Self-directed practice",
      note: "Workshops with M. Allard, K. Otieno, L. Pham",
    },
    {
      year: "2019",
      title: "Color Theory Intensive",
      note: "Coastal Arts Center · 8 wks",
    },
  ],
};

function Resume() {
  const [section, setSection] = React.useState("exhibitions");
  const map = {
    exhibitions: ["Selected exhibitions", RESUME.exhibitions],
    works: ["Selected works", RESUME.selectedWorks],
    education: ["Education & study", RESUME.education],
  };
  const [label, rows] = map[section];

  return (
    <section className="section section-resume" data-screen-label="04 Resume">
      <header className="section-head">
        <div className="head-num">04.</div>
        <h2 className="head-title">
          Curriculum <em>Vitae</em>
        </h2>
        <p className="head-sub">
          A working record. Updated when something happens.
        </p>
      </header>

      <div className="cv-tabs">
        {Object.entries(map).map(([k, [labelText]]) => (
          <button
            key={k}
            className={section === k ? "active" : ""}
            onClick={() => setSection(k)}
          >
            {labelText}
          </button>
        ))}
      </div>

      <div className="cv-list">
        <div className="cv-list-head">{label}</div>
        {rows.map((r, i) => (
          <div key={i} className={`cv-row ${r.kind === "upcoming" ? "upcoming" : ""}`}>
            <div className="cv-year">{r.year}</div>
            <div className="cv-body">
              <div className="cv-title">
                {r.title}
                {r.kind === "upcoming" && (
                  <span className="cv-tag">upcoming</span>
                )}
              </div>
              {r.where && <div className="cv-where">{r.where}</div>}
              {r.note && <div className="cv-where">{r.note}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="cv-download">
        <button className="btn btn-ghost btn-sm">
          Download full CV (PDF) <span className="arrow">↓</span>
        </button>
      </div>
    </section>
  );
}

// ---------- Writing / blog --------------------------------------------
const POSTS = [
  {
    date: "April 22, 2026",
    read: "4 min",
    title: "What I learned underpainting in burnt sienna for a year",
    excerpt:
      "I stopped reaching for white gesso last spring. The work got warmer, slower, and a little harder to start — which turned out to be the point.",
    tag: "Process",
  },
  {
    date: "March 03, 2026",
    read: "6 min",
    title: "The grammar of a horizon line",
    excerpt:
      "Where you put the horizon decides who the painting is for. A few notes from working through three sunset studies in one week.",
    tag: "Notes",
  },
  {
    date: "January 18, 2026",
    read: "3 min",
    title: "On finishing — and on the ten paintings under each finished one",
    excerpt:
      "Every piece in the studio has a small graveyard underneath it. I don't mind. It's where the painting learned what it didn't want to be.",
    tag: "Studio",
  },
  {
    date: "November 04, 2025",
    read: "5 min",
    title: "Collage as a way of saying 'all of this, please'",
    excerpt:
      "A short essay on why I started cutting up old fabric — and why '" +
      collageEssayTitle +
      "' wouldn't exist without a yard sale in 2024.",
    tag: "Essays",
  },
];

function Writing() {
  return (
    <section className="section section-writing" data-screen-label="05 Writing">
      <header className="section-head">
        <div className="head-num">05.</div>
        <h2 className="head-title">
          Notes from <em>the studio</em>
        </h2>
        <p className="head-sub">
          Short essays, mostly about process. Roughly monthly.
        </p>
      </header>

      <div className="posts">
        {POSTS.map((p, i) => (
          <article className="post" key={i}>
            <div className="post-meta">
              <span className="post-tag">{p.tag}</span>
              <span className="post-date">{p.date}</span>
              <span className="post-read">{p.read} read</span>
            </div>
            <div>
              <h3 className="post-title">{p.title}</h3>
              <p className="post-excerpt">{p.excerpt}</p>
              <button className="post-link">
                Read the post <span className="arrow">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------- Contact ---------------------------------------------------
function Contact() {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "commission",
    message: "",
  });
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="section section-contact" data-screen-label="06 Contact">
      <header className="section-head">
        <div className="head-num">06.</div>
        <h2 className="head-title">
          Get in <em>touch</em>
        </h2>
      </header>

      <div className="contact-grid">
        <div className="contact-aside">
          <div className="contact-block">
            <div className="meta-k">Commissions</div>
            <div className="meta-v">Currently open · limited slots each term</div>
          </div>
          <div className="contact-block">
            <div className="meta-k">Email</div>
            <div className="meta-v">
              <a href="mailto:hello@sericajones.studio">
                hello@sericajones.studio
              </a>
            </div>
          </div>
          <div className="contact-block">
            <div className="meta-k">Commission inquiries</div>
            <div className="meta-v">
              Share size, subject, timeline, and budget range.
            </div>
          </div>
          <div className="contact-block">
            <div className="meta-k">Elsewhere</div>
            <div className="meta-v">
              <a href="#">@sericajones.studio</a> · Instagram
            </div>
          </div>

          <div className="contact-artwork">
            <img
              src={contactFeaturePainting.src}
              alt={contactFeaturePainting.title}
            />
            <div className="caption-mono" style={{ marginTop: "12px" }}>
              {contactFeaturePainting.title} · {contactFeaturePainting.year}
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={onSubmit}>
          {sent ? (
            <div className="form-sent">
              <div className="sent-mark">✓</div>
              <h4>Thanks — message received.</h4>
              <p>
                I read everything personally. Replies usually arrive within a
                week, sometimes faster if it's sunny and the brushes are
                drying.
              </p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setSent(false)}
              >
                Send another
              </button>
            </div>
          ) : (
            <>
              <div className="form-row">
                <label>
                  <span>Your name</span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </label>
              </div>
              <label className="full">
                <span>This is about</span>
                <div className="subject-pills">
                  {[
                    ["commission", "Commission"],
                    ["other", "Something else"],
                  ].map(([k, v]) => (
                    <button
                      type="button"
                      key={k}
                      className={form.subject === k ? "active" : ""}
                      onClick={() => setForm({ ...form, subject: k })}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </label>
              <label className="full">
                <span>Message</span>
                <textarea
                  rows="5"
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Send
                <span className="arrow">→</span>
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

// Site-wide footer (sibling under #app-shell — matches index.html)
function SiteFooter() {
  return (
    <footer className="site-foot">
      <div>© 2026 Serica Jones · all paintings</div>
      <div className="foot-mark">Serica Jones</div>
      <div className="site-foot-byline">
        Painted with pixels, wired with logic · By{" "}
        <a
          href="https://gerlinpl.com/"
          className="foot-credit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gerlinpl
        </a>
      </div>
    </footer>
  );
}

// Export to window for cross-script access
Object.assign(window, {
  Nav, Home, Gallery, Lightbox, About, Resume, Writing, Contact, SiteFooter,
  PAINTINGS,
});
