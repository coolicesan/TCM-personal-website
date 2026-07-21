// ─── 文章渲染引擎 ────────────────────────────────────────────
// 由「文章管理後台.html」使用：同一份邏輯負責「即時預覽」與「儲存時產生的正式文章 HTML」，
// 兩者輸出保證一致。此檔案不會被公開文章頁面載入（公開頁面是純靜態 HTML）。
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // 允許內文段落使用簡單 **粗體** 與 [文字](網址) 語法，其餘照跳脫輸出
  function inline(s) {
    var out = esc(s == null ? '' : s);
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, text, url) {
      return '<a href="' + esc(url) + '">' + text + '</a>';
    });
    return out;
  }

  function slugifyHeading(text, index) {
    return 'sec-' + (index + 1);
  }

  // ── 各區塊型別 → HTML ──────────────────────────────────────
  var BLOCK_RENDERERS = {
    heading: function (b, ctx) {
      var id = slugifyHeading(b.text, ctx.headingIndex());
      return '<h2 id="' + id + '">' + inline(b.text) + '</h2>';
    },
    subheading: function (b) {
      return '<h3>' + inline(b.text) + '</h3>';
    },
    paragraph: function (b) {
      return '<p>' + inline(b.text) + '</p>';
    },
    lead: function (b) {
      return '<div class="a-lead">' + inline(b.text) + '</div>';
    },
    info: function (b) {
      return '<div class="a-info">' +
        (b.title ? '<div class="a-info-title">' + inline(b.title) + '</div>' : '') +
        '<div class="a-info-text">' + inline(b.text) + '</div></div>';
    },
    warning: function (b) {
      return '<div class="a-warning">' +
        (b.title ? '<div class="a-warning-title">' + inline(b.title) + '</div>' : '') +
        '<div class="a-warning-text">' + inline(b.text) + '</div></div>';
    },
    alert: function (b) {
      var items = (b.items || []).map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('');
      return '<div class="a-alert">' +
        '<div class="a-alert-title">' + inline(b.title || '出現以下情況請盡快就醫') + '</div>' +
        '<ul>' + items + '</ul></div>';
    },
    checklist: function (b) {
      var items = (b.items || []).map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('');
      return '<ul class="a-checklist">' + items + '</ul>';
    },
    quote: function (b) {
      return '<div class="a-quote"><p>' + inline(b.text) + '</p>' +
        (b.cite ? '<cite>' + inline(b.cite) + '</cite>' : '') + '</div>';
    },
    comparison: function (b) {
      var l = (b.leftItems || []).map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('');
      var r = (b.rightItems || []).map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('');
      return '<div class="a-comparison">' +
        '<div class="a-comp-card left"><div class="a-comp-label">' + inline(b.leftLabel || '') + '</div><ul>' + l + '</ul></div>' +
        '<div class="a-comp-card right"><div class="a-comp-label">' + inline(b.rightLabel || '') + '</div><ul>' + r + '</ul></div>' +
        '</div>';
    },
    references: function (b) {
      var items = (b.items || []).map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('');
      return '<div class="a-references"><h4>參考資料</h4><ol>' + items + '</ol></div>';
    },
    cta: function (b) {
      return '<div class="a-cta"><h3>' + inline(b.title || '想進一步了解自己的體質？') + '</h3>' +
        '<p>' + inline(b.text || '歡迎預約胡佩珊中醫師門診，由醫師為您詳細辨證，制定個人化調理方案。') + '</p>' +
        '<a class="a-cta-btn" href="../index.html#contact">預約掛號 →</a></div>';
    }
  };

  function renderBlocks(blocks) {
    var hIdx = -1;
    var ctx = { headingIndex: function () { hIdx++; return hIdx; } };
    return (blocks || []).map(function (b) {
      var fn = BLOCK_RENDERERS[b.type];
      return fn ? fn(b, ctx) : '';
    }).join('\n');
  }

  function buildTOC(blocks) {
    var headings = (blocks || []).filter(function (b) { return b.type === 'heading'; });
    if (headings.length < 2) return '';
    var items = headings.map(function (b, i) {
      return '<li><a href="#sec-' + (i + 1) + '">' + inline(b.text) + '</a></li>';
    }).join('');
    return '<nav class="article-toc"><div class="article-toc-title">本文重點</div><ol>' + items + '</ol></nav>';
  }

  // ── 完整文章頁面 ──────────────────────────────────────────
  function renderArticleHTML(article, stageLabel) {
    var title = esc(article.metaTitle || (article.title + '｜胡佩珊中醫師'));
    var desc = esc(article.metaDescription || article.excerpt || '');
    var keywords = esc((article.keywords || []).join(','));
    var heroTags = (article.heroTags || []).map(function (t) {
      return '<span class="article-hero-tag">' + inline(t) + '</span>';
    }).join('');
    var toc = buildTOC(article.blocks);
    var body = renderBlocks(article.blocks);
    var hasCta = (article.blocks || []).some(function (b) { return b.type === 'cta'; });
    var pageUrl = 'https://coolicesan.github.io/TCM-personal-website/articles/' + esc(article.slug) + '.html';
    var ogImage = 'https://coolicesan.github.io/TCM-personal-website/og-image.png';

    return '<!DOCTYPE html>\n' +
'<html lang="zh-Hant-HK">\n' +
'<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'<title>' + title + '</title>\n' +
'<meta name="description" content="' + desc + '">\n' +
(keywords ? '<meta name="keywords" content="' + keywords + '">\n' : '') +
'<link rel="canonical" href="' + pageUrl + '">\n' +
'<meta property="og:type" content="article">\n' +
'<meta property="og:title" content="' + title + '">\n' +
'<meta property="og:description" content="' + desc + '">\n' +
'<meta property="og:site_name" content="胡佩珊中醫師">\n' +
'<meta property="og:url" content="' + pageUrl + '">\n' +
'<meta property="og:image" content="' + ogImage + '">\n' +
'<meta property="og:locale" content="zh_HK">\n' +
'<meta name="twitter:card" content="summary_large_image">\n' +
'<meta name="twitter:image" content="' + ogImage + '">\n' +
'<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
'<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@300;400;500;600&display=swap" rel="stylesheet">\n' +
'<link rel="stylesheet" href="article.css">\n' +
'</head>\n' +
'<body>\n' +
'<nav class="site-nav">\n' +
'  <a href="../index.html" class="site-nav-logo">胡佩珊中醫師</a>\n' +
'  <div class="site-nav-links">\n' +
'    <a href="../index.html#articles" class="hide-mobile">← 健康知識庫</a>\n' +
'    <a href="../index.html#contact" class="site-nav-cta">預約掛號</a>\n' +
'  </div>\n' +
'</nav>\n' +
'<header class="article-hero">\n' +
'  <div class="article-hero-eyebrow">' + inline(article.heroEyebrow || stageLabel || '') + '</div>\n' +
'  <h1>' + inline(article.title) + '</h1>\n' +
(article.excerpt ? '  <p class="article-hero-subtitle">' + inline(article.excerpt) + '</p>\n' : '') +
(heroTags ? '  <div class="article-hero-tags">' + heroTags + '</div>\n' : '') +
'  <div class="article-hero-meta">' + (stageLabel ? esc(stageLabel) + ' · ' : '') + '約 ' + (article.readTime || 5) + ' 分鐘閱讀</div>\n' +
'</header>\n' +
'<main class="article-container">\n' +
toc + '\n' +
'<div class="article-section">\n' +
body + '\n' +
'</div>\n' +
(hasCta ? '' : '<div class="a-cta"><h3>想進一步了解自己的體質？</h3><p>歡迎預約胡佩珊中醫師門診，由醫師為您詳細辨證，制定個人化調理方案。</p><a class="a-cta-btn" href="../index.html#contact">預約掛號 →</a></div>\n') +
'<p class="article-disclaimer">本文內容僅供健康教育參考，不構成醫療建議，亦不能取代註冊醫師或中醫師的診斷與治療。若您出現急性或嚴重症狀，請立即求醫。</p>\n' +
'</main>\n' +
'</body>\n' +
'</html>\n';
  }

  // ── 首頁卡片 HTML 片段 ──────────────────────────────────────
  function renderCardHTML(article, stageLabel) {
    return '<a href="articles/' + esc(article.slug) + '.html" class="article-card" data-stage="' + esc(article.stage) + '">\n' +
'        <span class="art-stage-tag">' + esc(stageLabel || '') + '</span>\n' +
'        <div class="art-title">' + esc(article.title) + '</div>\n' +
'        <div class="art-excerpt">' + esc(article.excerpt || '') + '</div>\n' +
'        <div class="art-footer"><span>⏱ 約 ' + (article.readTime || 5) + ' 分鐘</span><span class="art-read">閱讀更多 →</span></div>\n' +
'      </a>';
  }

  global.ArticleRender = {
    renderArticleHTML: renderArticleHTML,
    renderCardHTML: renderCardHTML,
    renderBlocks: renderBlocks,
    inline: inline
  };
})(window);
