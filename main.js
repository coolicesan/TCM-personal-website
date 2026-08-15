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
  const lang = window.DrHuI18n?.getLang?.() || 'zh';
  const lines = lang === 'en'
    ? [
        'Hello, I would like to book a consultation:',
        'Name: ' + v('name'),
        'Phone: ' + v('phone'),
        v('stage') ? 'Reason for visit: ' + v('stage') : '',
        v('message') ? 'Message: ' + v('message') : ''
      ].filter(Boolean)
    : [
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

// ── 健康知識庫頁：搜尋 + 生命階段 + 標籤 篩選（僅在 articles.html 有對應元素時執行）──
function initKnowledgeBase() {
  const grid = document.getElementById('kbGrid');
  if (!grid) return;
  const cards = Array.prototype.slice.call(grid.querySelectorAll('.article-card'));
  const searchInput = document.getElementById('kbSearch');
  const stageTabs = document.getElementById('kbStageTabs');
  const tagBox = document.getElementById('kbTagChips');
  const emptyEl = document.getElementById('kbEmpty');
  const countEl = document.getElementById('kbCountNum');
  const state = { stage: 'all', tags: new Set(), q: '' };

  // 由文章頁麵包屑帶入 ?stage= 參數時，預先選取對應的生命階段分頁
  if (stageTabs) {
    const urlStage = new URLSearchParams(window.location.search).get('stage');
    if (urlStage) {
      let matched = false;
      stageTabs.querySelectorAll('.stage-tab').forEach((b) => {
        const isMatch = b.dataset.stage === urlStage;
        b.classList.toggle('active', isMatch);
        if (isMatch) matched = true;
      });
      if (matched) state.stage = urlStage;
    }
  }

  function apply() {
    const q = state.q.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const stageOk = state.stage === 'all' || card.dataset.stage === state.stage;
      const cardTags = (card.dataset.tags || '').split(',').filter(Boolean);
      const tagOk = state.tags.size === 0 || cardTags.some((t) => state.tags.has(t));
      const searchOk = !q || (card.dataset.search || '').indexOf(q) !== -1;
      const show = stageOk && tagOk && searchOk;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (emptyEl) emptyEl.classList.toggle('show', visible === 0);
    if (countEl) countEl.textContent = visible;
    syncTagChips(q);
  }

  // 只顯示在目前生命階段／搜尋條件下真的有文章的主題標籤，
  // 避免出現按下去得到 0 篇的死路（例如在「備孕」看到「坐月」）。
  function syncTagChips(q) {
    if (!tagBox) return;
    tagBox.querySelectorAll('.tag-chip').forEach((chip) => {
      const tag = chip.dataset.tag;
      const usable = cards.some((card) => {
        const stageOk = state.stage === 'all' || card.dataset.stage === state.stage;
        const searchOk = !q || (card.dataset.search || '').indexOf(q) !== -1;
        const hasTag = (card.dataset.tags || '').split(',').indexOf(tag) !== -1;
        return stageOk && searchOk && hasTag;
      });
      // 已選取的標籤一定要留著，否則使用者無法取消選取
      chip.hidden = !usable && !state.tags.has(tag);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => { state.q = searchInput.value; apply(); });
  }
  if (stageTabs) {
    stageTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.stage-tab');
      if (!btn) return;
      stageTabs.querySelectorAll('.stage-tab').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.stage = btn.dataset.stage;
      apply();
    });
  }
  if (tagBox) {
    tagBox.addEventListener('click', (e) => {
      const chip = e.target.closest('.tag-chip');
      if (!chip) return;
      const tag = chip.dataset.tag;
      if (state.tags.has(tag)) { state.tags.delete(tag); chip.classList.remove('active'); }
      else { state.tags.add(tag); chip.classList.add('active'); }
      apply();
    });
  }

  apply();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKnowledgeBase);
} else {
  initKnowledgeBase();
}
