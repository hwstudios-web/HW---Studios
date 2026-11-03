/* =====================================================
   HW STUDIOS - script.js
   Vanilla JavaScript, no dependencies.
   ===================================================== */
 
/* -----------------------------------------------------
   1. CONTACT DETAILS  <-- EDIT THESE THREE VALUES ONLY
   Replace the placeholder text with your real details.
   All contact buttons and links on the site update
   automatically.
   ----------------------------------------------------- */
const CONTACT = {
  email: "hwstudios8206@gmail.com",                         // e.g. "hello@yourdomain.com"
  instagram: "hwstudios8206",             // e.g. "https://instagram.com/yourhandle"
  whatsapp: "916301245365"      // digits only, e.g. "919876543210"
};
 
(function () {
  "use strict";
 
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
 
  /* -----------------------------------------------------
     2. CONTACT LINKS
     A value still wrapped in [ ] is treated as a placeholder.
     Placeholder buttons show a friendly message instead of
     opening a broken link.
     ----------------------------------------------------- */
  const isPlaceholder = (v) => /^\s*\[.*\]\s*$/.test(v) || !v.trim();
 
  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
  }
 
  function buildLink(type) {
    const value = CONTACT[type].trim();
    if (type === "email") return "mailto:" + value;
    if (type === "instagram") return value;
    if (type === "whatsapp") return "https://wa.me/" + value.replace(/\D/g, "");
    return "#contact";
  }
 
  const labels = { email: "hwstudios8206@gmail.com", instagram: "WH Studios", whatsapp: "+91 6301245365" };
 
  $$("[data-contact]").forEach((el) => {
    const type = el.dataset.contact;
    if (!(type in CONTACT)) return;
 
    if (isPlaceholder(CONTACT[type])) {
      // Placeholder still in place: keep the page safe and tell the owner what to do.
      el.setAttribute("href", "#contact");
      el.removeAttribute("target");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("Add your real " + labels[type] + " in script.js to activate this button.");
      });
    } else {
      el.setAttribute("href", buildLink(type));
    }
  });
 
  // Show real values in the contact list once filled in
  $$("[data-contact-text]").forEach((el) => {
    const type = el.dataset.contactText;
    if (type in CONTACT && !isPlaceholder(CONTACT[type])) el.textContent = CONTACT[type];
  });
 
  /* -----------------------------------------------------
     3. MOBILE NAVIGATION TOGGLE
     ----------------------------------------------------- */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
 
  function setMenu(open) {
    navToggle.classList.toggle("open", open);
    navMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }
 
  navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
 
  // Close menu after choosing a link, pressing Escape, or resizing to desktop
  $$(".nav-link").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth >= 960) setMenu(false); });
 
  /* -----------------------------------------------------
     4. SMOOTH SCROLLING
     CSS handles smooth behaviour and header offset
     (scroll-behavior + scroll-padding-top). This only
     makes sure the URL hash updates cleanly.
     ----------------------------------------------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
 
  /* -----------------------------------------------------
     5. HEADER STYLE, BACK-TO-TOP BUTTON
     ----------------------------------------------------- */
  const header = $("#header");
  const toTop = $("#toTop");
 
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
 
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
 
  /* -----------------------------------------------------
     6. ACTIVE NAVIGATION LINK (IntersectionObserver)
     ----------------------------------------------------- */
  const navLinks = $$(".nav-link");
  const sections = navLinks
    .map((l) => $(l.getAttribute("href")))
    .filter(Boolean);
 
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) =>
              l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" } // a section is "active" when it crosses mid-screen
    );
    sections.forEach((s) => spy.observe(s));
 
    /* ---------------------------------------------------
       7. SCROLL REVEAL ANIMATIONS
       --------------------------------------------------- */
    const reveal = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
 
    $$(".reveal").forEach((el) => {
      // Small stagger for items that share a parent (cards, highlights, etc.)
      const siblings = $$(".reveal", el.parentElement);
      el.style.transitionDelay = Math.min(siblings.indexOf(el), 4) * 90 + "ms";
      reveal.observe(el);
    });
  } else {
    // Very old browsers: just show everything
    $$(".reveal").forEach((el) => el.classList.add("visible"));
  }
})();
 