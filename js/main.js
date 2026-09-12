/* =====================================================================
   Wedding Website — Shared JavaScript (single-page)
   ---------------------------------------------------------------------
   All sections live on one page and are stacked next to each other.
   The top bar links jump to each section, and scrolling reveals them
   in order. Edit site-wide details once in the SITE config below.
   ===================================================================== */

/* ---- SITE CONFIG (edit me!) ---------------------------------------- */
const SITE = {
  coupleName: "Our Wedding",                 // TODO: add the names here
  weddingDate: "2027-01-15T15:00:00+03:00",  // TODO: set real date/time (Kenya = UTC+3)
  location: "Nairobi, Kenya",
  // TODO: paste the shared Google Drive folder link here
  driveLink: "https://drive.google.com/",
};

/* ---- NAVIGATION ITEMS (in-page anchors) --------------------------- */
const NAV_ITEMS = [
  { href: "#home",     label: "Home" },
  { href: "#kenya",    label: "Explore Kenya" },
  { href: "#stay",     label: "Stay" },
  { href: "#services", label: "Get Ready" },
  { href: "#photos",   label: "Photos" },
];

/* ---- RENDER HEADER ------------------------------------------------- */
function renderHeader() {
  const mount = document.querySelector("[data-header]");
  if (!mount) return;

  const links = NAV_ITEMS.map(
    (item) => `<li><a href="${item.href}" data-nav>${item.label}</a></li>`
  ).join("");

  mount.innerHTML = `
    <header class="site-header">
      <div class="container nav">
        <a class="nav__brand" href="#home">${SITE.coupleName}</a>
        <ul class="nav__links" id="navLinks">${links}</ul>
      </div>
    </header>`;
}

/* ---- RENDER FOOTER ------------------------------------------------- */
function renderFooter() {
  const mount = document.querySelector("[data-footer]");
  if (!mount) return;

  const links = NAV_ITEMS.map(
    (item) => `<a href="${item.href}">${item.label}</a>`
  ).join("");

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer__brand">${SITE.coupleName}</div>
        <p>${SITE.location}</p>
        <nav>${links}</nav>
        <small>&copy; <span data-year></span> ${SITE.coupleName} &middot; Made with love</small>
      </div>
    </footer>`;

  const yr = mount.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
}

/* ---- SCROLLSPY (highlight the current section in the top bar) ------ */
function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((a) => {
      if (a.getAttribute("href") === `#${id}`) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* ---- COUNTDOWN ---------------------------------------------------- */
function initCountdown() {
  const el = document.querySelector("[data-countdown]");
  if (!el) return;

  const target = new Date(SITE.weddingDate).getTime();

  const units = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "mins", label: "Mins" },
    { key: "secs", label: "Secs" },
  ];

  el.innerHTML = units
    .map(
      (u) =>
        `<div class="countdown__unit"><div class="countdown__num" data-${u.key}>--</div><div class="countdown__label">${u.label}</div></div>`
    )
    .join("");

  let timer;
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      el.innerHTML = `<p class="hero__meta">The big day is here! 🎉</p>`;
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.querySelector("[data-days]").textContent = d;
    el.querySelector("[data-hours]").textContent = String(h).padStart(2, "0");
    el.querySelector("[data-mins]").textContent = String(m).padStart(2, "0");
    el.querySelector("[data-secs]").textContent = String(s).padStart(2, "0");
  }

  tick();
  timer = setInterval(tick, 1000);
}

/* ---- WIRE UP DRIVE LINKS ------------------------------------------ */
function wireDriveLinks() {
  document.querySelectorAll("[data-drive-link]").forEach((a) => {
    a.setAttribute("href", SITE.driveLink);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
}

/* ---- INIT --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initScrollSpy();
  initCountdown();
  wireDriveLinks();
});
