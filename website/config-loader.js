// config-loader.js — applied to every page, loads saved colors / fonts / photos / content
(function () {
  const CFG = 'drhu_config';
  const CONTENT = 'drhu_content_v1';

  // ── Inject colors as a <style> so they apply before paint ──
  try {
    const cfg = JSON.parse(localStorage.getItem(CFG) || '{}');
    if (cfg.colors) {
      const vars = Object.entries(cfg.colors)
        .map(([k, v]) => `--${k}: ${v}`)
        .join('; ');
      const s = document.createElement('style');
      s.id = 'cfg-colors';
      s.textContent = `:root { ${vars} }`;
      document.head.appendChild(s);
    }
  } catch (_) {}

  // ── Inject typography CSS ──────────────────────────────────────────────
  try {
    const cfg = JSON.parse(localStorage.getItem(CFG) || '{}');
    const fonts = cfg.fonts || {};
    const typo  = cfg.typography || {};
    const rules = [];

    // CSS custom properties (font families)
    const vars = [];
    if (fonts.displayFont) vars.push(`--font-display: '${fonts.displayFont}', serif`);
    if (fonts.bodyFont)    vars.push(`--font-body: '${fonts.bodyFont}', sans-serif`);
    if (vars.length) rules.push(`:root { ${vars.join('; ')} }`);

    // Body
    const bodyR = [];
    if (fonts.baseSize)     bodyR.push(`font-size: ${fonts.baseSize}px`);
    if (fonts.bodyFont)     bodyR.push(`font-family: '${fonts.bodyFont}', sans-serif`);
    if (typo.lineHeight)    bodyR.push(`line-height: ${typo.lineHeight}`);
    if (typo.bodyAlign)     bodyR.push(`text-align: ${typo.bodyAlign}`);
    if (bodyR.length) rules.push(`body { ${bodyR.join('; ')} }`);

    // H1 + main section titles
    const h1R = [];
    if (typo.h1Size)        h1R.push(`font-size: ${typo.h1Size}rem`);
    if (typo.h1Align)       h1R.push(`text-align: ${typo.h1Align}`);
    if (typo.letterSpacing != null) h1R.push(`letter-spacing: ${typo.letterSpacing}em`);
    if (h1R.length) rules.push(`h1, .section-title, .hero-title { ${h1R.join('; ')} }`);

    // H2
    const h2R = [];
    if (typo.h2Size)  h2R.push(`font-size: ${typo.h2Size}rem`);
    if (typo.h2Align) h2R.push(`text-align: ${typo.h2Align}`);
    if (h2R.length) rules.push(`h2 { ${h2R.join('; ')} }`);

    // Paragraphs
    const pR = [];
    if (typo.bodySize)  pR.push(`font-size: ${typo.bodySize}rem`);
    if (typo.bodyAlign) pR.push(`text-align: ${typo.bodyAlign}`);
    if (pR.length) rules.push(`p { ${pR.join('; ')} }`);

    // Nav
    if (typo.navSize) rules.push(`.nav-links a { font-size: ${typo.navSize}rem }`);

    if (rules.length) {
      const s = document.createElement('style');
      s.id = 'drhu-typo';
      s.textContent = rules.join('\n');
      document.head.appendChild(s);
    }
  } catch (_) {}

  // ── Inject hidden blocks (before paint, so they never flash) ─────────────────
  try {
    const hidden = JSON.parse(localStorage.getItem('drhu_hidden_v1') || '{}');
    const hiddenSels = Object.keys(hidden).filter(Boolean);
    if (hiddenSels.length) {
      const s = document.createElement('style');
      s.id = 'drhu-hidden-styles';
      s.textContent = hiddenSels.map(sel => sel + '{display:none!important}').join('\n');
      document.head.appendChild(s);
    }
  } catch (_) {}

  // ── Inject selector-level styles (from unified editor) ────────────────────────
  try {
    const selStyles = JSON.parse(localStorage.getItem('drhu_sel_styles_v1') || '{}');
    if (Object.keys(selStyles).length) {
      const rules = Object.entries(selStyles).map(([sel, props]) => {
        const decl = Object.entries(props)
          .map(([k, v]) => k.replace(/([A-Z])/g, m => '-' + m.toLowerCase()) + ':' + v + ' !important')
          .join(';');
        return sel + '{' + decl + '}';
      }).join('\n');
      const s = document.createElement('style');
      s.id = 'drhu-el-styles';
      s.textContent = rules;
      document.head.appendChild(s);
    }
  } catch (_) {}

  document.addEventListener('DOMContentLoaded', function () {
    try {
      const cfg = JSON.parse(localStorage.getItem(CFG) || '{}');

      // Font base size
      if (cfg.fonts?.baseSize) {
        document.body.style.fontSize = cfg.fonts.baseSize + 'px';
      }

      // Border radius scale
      if (cfg.style?.radius) {
        const r = cfg.style.radius;
        document.documentElement.style.setProperty('--radius', r + 'px');
        document.documentElement.style.setProperty('--radius-lg', (r * 2) + 'px');
      }

      // Doctor photo
      if (cfg.photos?.doctor) {
        const c = document.getElementById('dr-photo-container');
        if (c) {
          c.style.position = 'relative';
          c.innerHTML = `<img src="${cfg.photos.doctor}" alt="醫師照片" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
        }
      }
    } catch (_) {}

    // Load saved text content (data-edit attribute system)
    try {
      const all = JSON.parse(localStorage.getItem(CONTENT) || '{}');
      const page = location.pathname.split('/').pop() || 'index.html';
      Object.entries(all[page] || {}).forEach(([key, val]) => {
        const el = document.querySelector(`[data-edit="${key}"]`);
        if (el) el.innerHTML = val;
      });
    } catch (_) {}

    // Load selector-based text content (universal text editor)
    try {
      const contentSel = JSON.parse(localStorage.getItem('drhu_content_sel_v1') || '{}');
      Object.entries(contentSel).forEach(([sel, html]) => {
        try {
          const el = document.querySelector(sel);
          if (el) el.innerHTML = html;
        } catch (_) {}
      });
    } catch (_) {}
  });
})();
