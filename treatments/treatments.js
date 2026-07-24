// Shared behaviour for all treatment detail pages.
function initTreatmentDisclosure() {
  document.querySelectorAll('.tx-disclosure-q').forEach((btn) => {
    if (btn.dataset.boundDisclosure === '1') return;
    btn.dataset.boundDisclosure = '1';
    btn.addEventListener('click', () => {
      btn.closest('.tx-disclosure-item').classList.toggle('open');
    });
  });
}

function initTreatmentToc() {
  // Highlight the TOC pill for whichever section is currently in view.
  const tocLinks = Array.from(document.querySelectorAll('.tx-toc a'));
  if (!tocLinks.length) return;
  const sections = tocLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const setActive = (id) => {
    tocLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-120px 0px -70% 0px', threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));
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
