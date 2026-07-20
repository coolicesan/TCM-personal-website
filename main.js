// ═══════════════════════════════════════════════════════════════
// 胡佩珊中醫師 — 首頁互動腳本
// ═══════════════════════════════════════════════════════════════

// 設計版本升級：清除舊版儲存的顏色與首頁文字，避免覆蓋新設計
(function () {
  try {
    if (localStorage.getItem('drhu_design_version') !== 'cream-1') {
      const cfg = JSON.parse(localStorage.getItem('drhu_config') || '{}');
      delete cfg.colors;
      localStorage.setItem('drhu_config', JSON.stringify(cfg));
      const content = JSON.parse(localStorage.getItem('drhu_content_v1') || '{}');
      delete content['index.html'];
      localStorage.setItem('drhu_content_v1', JSON.stringify(content));
      localStorage.removeItem('drhu_sel_styles_v1');
      localStorage.removeItem('drhu_content_sel_v1');
      localStorage.setItem('drhu_design_version', 'cream-1');
    }
  } catch (_) {}
})();

// ── 文章篩選（供 HTML onclick 使用，需掛到 window）──
function filterArticles(stage, btn) {
  document.querySelectorAll('#articleTabs .stage-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#articlesGrid .article-card').forEach(card => {
    card.style.display = (stage === 'all' || card.dataset.stage === stage) ? '' : 'none';
  });
}
window.filterArticles = filterArticles;

// ── 預約表單 → WhatsApp 預填訊息（供 HTML onsubmit 使用，需掛到 window）──
function handleSubmit(e) {
  e.preventDefault();
  const v = id => (document.getElementById(id)?.value || '').trim();
  const lines = [
    '您好，我想預約門診：',
    '姓名：' + v('name'),
    '電話：' + v('phone'),
    v('stage') ? '就診需求：' + v('stage') : '',
    v('message') ? '想詢問：' + v('message') : ''
  ].filter(Boolean);
  window.open('https://wa.me/85298152863?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
}
window.handleSubmit = handleSubmit;

// ── 需在 DOM 就緒後執行的初始化 ──
function initPage() {
  // 手機選單
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 進場動畫（尊重 reduced motion）
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
