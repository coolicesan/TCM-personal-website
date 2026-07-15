// Shared behaviour for all treatment detail pages.
(function () {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  document.querySelectorAll('.tx-disclosure-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.tx-disclosure-item').classList.toggle('open');
    });
  });

  // Highlight the TOC pill for whichever section is currently in view.
  const tocLinks = Array.from(document.querySelectorAll('.tx-toc a'));
  if (tocLinks.length) {
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
})();
