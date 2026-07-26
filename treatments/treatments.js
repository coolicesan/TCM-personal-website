// Shared behaviour for all treatment detail pages.
let treatmentTocObserver = null;

function initTreatmentDisclosure() {
  if (document.documentElement.dataset.boundTreatmentDisclosure === '1') return;
  document.documentElement.dataset.boundTreatmentDisclosure = '1';
  document.addEventListener('click', (event) => {
    if (!event.target || !event.target.closest) return;
    const btn = event.target.closest('.tx-disclosure-q');
    if (!btn) return;
    const item = btn.closest('.tx-disclosure-item');
    if (!item) return;
    event.preventDefault();
    item.classList.toggle('open');
  });
}

function initTreatmentToc() {
  // Highlight the TOC pill for whichever section is currently in view.
  if (treatmentTocObserver) treatmentTocObserver.disconnect();
  const tocLinks = Array.from(document.querySelectorAll('.tx-toc a'));
  if (!tocLinks.length) return;
  if (!('IntersectionObserver' in window)) return;
  const sections = tocLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const setActive = (id) => {
    tocLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  };
  treatmentTocObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-120px 0px -70% 0px', threshold: 0 }
  );
  sections.forEach((s) => treatmentTocObserver.observe(s));
}

window.initTreatmentDisclosure = initTreatmentDisclosure;
window.initTreatmentToc = initTreatmentToc;

(function () {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  initTreatmentDisclosure();
  initTreatmentToc();
})();
