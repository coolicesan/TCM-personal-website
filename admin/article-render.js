// ─── 文章渲染引擎 ────────────────────────────────────────────
// 由「文章管理後台.html」使用：同一份邏輯負責「即時預覽」與「儲存時產生的正式文章 HTML」，
// 兩者輸出保證一致。此檔案不會被公開文章頁面載入（公開頁面是純靜態 HTML）。
(function (global) {
  'use strict';

  var SITE_BASE = 'https://coolicesan.github.io/TCM-personal-website/';
  var PERSON_ID = SITE_BASE + '#person';
  var ORG_ID = SITE_BASE + '#org';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // JSON-LD 內文字串需要另一套跳脫（不可用 HTML entity），單獨處理
  function jsonEsc(s) {
    return JSON.stringify(String(s == null ? '' : s)).slice(1, -1);
  }

  // 純文字版本（去除 markdown 記號），供 meta/JSON-LD 使用
  function plain(s) {
    return String(s == null ? '' : s).replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  }

  // Bilingual article fields are intentionally backwards-compatible.
  // Existing fields may remain plain strings; newer content may use either:
  //   title: { zh: '...', en: '...' }
  // or:
  //   i18n: { en: { title: '...', blocks: [...] } }
  function pickLocalized(value, lang) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
    return value[lang] || value.zh || value.en || '';
  }

  function localizeBlock(block, lang) {
    if (!block || typeof block !== 'object') return block;
    var localized = Object.assign({}, block, (block.i18n && block.i18n[lang]) || {});
    ['text', 'title', 'cite', 'leftLabel', 'rightLabel'].forEach(function (key) {
      localized[key] = pickLocalized(localized[key], lang);
    });
    ['headers', 'leftItems', 'rightItems'].forEach(function (key) {
      if (Array.isArray(localized[key])) localized[key] = localized[key].map(function (v) { return pickLocalized(v, lang); });
    });
    if (Array.isArray(localized.items) && localized.type !== 'faq') {
      localized.items = localized.items.map(function (v) { return pickLocalized(v, lang); });
    }
    if (Array.isArray(localized.rows)) {
      localized.rows = localized.rows.map(function (row) {
        return row.map(function (cell) { return pickLocalized(cell, lang); });
      });
    }
    if (Array.isArray(localized.items) && localized.type === 'faq') {
      localized.items = localized.items.map(function (qa) {
        var q = Object.assign({}, qa, (qa.i18n && qa.i18n[lang]) || {});
        q.q = pickLocalized(q.q, lang);
        q.a = pickLocalized(q.a, lang);
        return q;
      });
    }
    return localized;
  }

  function localizeArticle(article, lang) {
    lang = lang || 'zh';
    var localized = Object.assign({}, article, (article.i18n && article.i18n[lang]) || {});
    [
      'conditionName',
      'title',
      'excerpt',
      'metaTitle',
      'metaDescription',
      'heroEyebrow'
    ].forEach(function (key) {
      localized[key] = pickLocalized(localized[key], lang);
    });
    ['tags', 'keywords', 'heroTags'].forEach(function (key) {
      if (Array.isArray(localized[key])) localized[key] = localized[key].map(function (v) { return pickLocalized(v, lang); });
    });
    localized.blocks = (localized.blocks || []).map(function (block) { return localizeBlock(block, lang); });
    return localized;
  }

  // 允許內文段落使用簡單 **粗體** 與 [文字](網址) 語法，其餘照跳脫輸出
  // 外部連結（http/https）一律開新分頁、rel=noopener；內部錨點/相對連結維持原樣
  function linkAttrs(url) {
    var isExternal = /^https?:\/\//i.test(url);
    var attrs = 'href="' + esc(url) + '"';
    if (isExternal) attrs += ' target="_blank" rel="noopener"';
    return attrs;
  }

  function inline(s) {
    var out = esc(s == null ? '' : s);
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // 先處理 [文字](網址) 語法連結，用佔位符暫存避免被裸網址規則二次比對
    var placeholders = [];
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, text, url) {
      placeholders.push('<a ' + linkAttrs(url) + '>' + text + '</a>');
      return ' LINK' + (placeholders.length - 1) + ' ';
    });
    // 裸網址（未使用 markdown 連結語法時）自動轉為可點擊連結
    out = out.replace(/(^|[\s（(])((https?:\/\/)[^\s<>「」（）()]+)/g, function (_, pre, url) {
      return pre + '<a ' + linkAttrs(url) + '>' + url + '</a>';
    });
    out = out.replace(/ LINK(\d+) /g, function (_, idx) { return placeholders[idx]; });
    return out;
  }

  function renderArticleTitle(title) {
    var text = String(title == null ? '' : title).trim();
    var split = text.match(/^(.+?[：:])(.+)$/) || text.match(/^(.+?[？?])(.+)$/);
    if (!split) return inline(text);
    return '<span class="article-title-primary">' + inline(split[1].trim()) + '</span>' +
      '<span class="article-title-secondary">' + inline(split[2].trim()) + '</span>';
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
      return '<div class="a-lead"><span class="a-lead-eyebrow">重點速覽</span>' + inline(b.text) + '</div>';
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
    list: function (b) {
      var items = (b.items || []).map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('');
      return '<ul class="a-list">' + items + '</ul>';
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
    table: function (b) {
      var head = '<tr>' + (b.headers || []).map(function (h) { return '<th>' + inline(h) + '</th>'; }).join('') + '</tr>';
      var rows = (b.rows || []).map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
      }).join('');
      return '<div class="a-table-wrap"><table class="a-table"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
    },
    references: function (b) {
      var items = (b.items || []).map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('');
      var count = (b.items || []).length;
      return '<details class="a-references"><summary><span class="a-ref-label">參考資料</span><span class="a-ref-count">' + count + ' 項</span></summary><ol>' + items + '</ol></details>';
    },
    faq: function (b, ctx) {
      ctx.faqItems = ctx.faqItems || [];
      var html = (b.items || []).map(function (qa) {
        ctx.faqItems.push(qa);
        return '<div class="a-faq-item"><h3 class="a-faq-q">' + inline(qa.q) + '</h3>' +
          '<p class="a-faq-a">' + inline(qa.a) + '</p></div>';
      }).join('');
      return '<div class="a-faq">' + html + '</div>';
    },
    cta: function (b) {
      return '<div class="a-cta"><h3>' + inline(b.title || '想進一步了解自己的身體狀況？') + '</h3>' +
        '<p>' + inline(b.text || '歡迎預約中醫師門診，由醫師為您詳細辨證，制定個人化治療方案。') + '</p>' +
        '<a class="a-cta-btn" href="../index.html#contact">預約掛號 →</a></div>';
    }
  };

  function renderBlocks(blocks, ctx) {
    var hIdx = -1;
    ctx = ctx || {};
    ctx.headingIndex = function () { hIdx++; return hIdx; };
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

  // 從「參考資料」區塊擷取網址，供 JSON-LD citation 使用（純粹從既有內容擷取，不另外生成連結）
  function extractCitations(blocks) {
    var urls = [];
    var seen = {};
    var re = /https?:\/\/[^\s"'()（）「」『』《》〈〉，。；]+/g;
    (blocks || []).forEach(function (b) {
      if (b.type !== 'references') return;
      (b.items || []).forEach(function (item) {
        var m;
        re.lastIndex = 0;
        while ((m = re.exec(item))) {
          if (!seen[m[0]]) { seen[m[0]] = true; urls.push(m[0]); }
        }
      });
    });
    return urls;
  }

  // ── 麵包屑導覽（可見 HTML，置於 hero 內）──────────────────────
  function buildBreadcrumbNav(stageLabel, stageKey) {
    var crumbs = ['<a href="../index.html">首頁</a>', '<a href="../articles.html">文章知識庫</a>'];
    if (stageLabel) {
      var stageHref = '../articles.html' + (stageKey ? '?stage=' + esc(stageKey) : '');
      crumbs.push('<a href="' + stageHref + '">' + esc(stageLabel) + '</a>');
    }
    return '<nav class="article-breadcrumbs" aria-label="麵包屑導覽">' + crumbs.join('<span class="sep">›</span>') + '</nav>';
  }

  // ── 文末作者簡介框 ────────────────────────────────────────
  function buildAuthorBox() {
    return '<div class="article-authorbox">' +
      '<img src="../Profile pic.JPG" alt="胡佩珊中醫師" loading="lazy">' +
      '<div><h4>關於作者</h4>' +
      '<p><a href="../about.html">胡佩珊中醫師</a>，香港註冊中醫師（註冊編號：008823），專注女性健康及產前產後調理，善於結合中醫辨證與現代醫學知識，為病人制定個人化治療方案。</p>' +
      '</div></div>';
  }

  // ── 相關文章（同分類，最多 3 篇）─────────────────────────────
  function buildRelated(article, allArticles, stageLabelMap) {
    if (!allArticles || !allArticles.length) return '';
    var candidates = allArticles.filter(function (a) {
      return a.slug !== article.slug && !a.hidden && a.stage === article.stage;
    }).slice(0, 3);
    if (!candidates.length) return '';
    var items = candidates.map(function (a) {
      a = localizeArticle(a, 'zh');
      var tag = (stageLabelMap && stageLabelMap[a.stage]) || '';
      return '<a class="article-related-card" href="' + esc(a.slug) + '.html">' +
        (tag ? '<span class="article-related-tag">' + esc(tag) + '</span>' : '') +
        '<div class="article-related-title">' + esc(a.title) + '</div>' +
        '<div class="article-related-excerpt">' + esc(a.excerpt || '') + '</div>' +
        '</a>';
    }).join('');
    return '<nav class="article-related" aria-label="相關文章"><h4>相關文章</h4><div class="article-related-grid">' + items + '</div></nav>';
  }

  function buildJSONLD(article, pageUrl, ogImage, faqItems, stageLabel) {
    var blocks = [];
    var citations = extractCitations(article.blocks);
    var modified = article.modifiedDate || article.publishDate || undefined;

    blocks.push({
      '@context': 'https://schema.org',
      '@type': ['Article', 'MedicalWebPage'],
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      headline: plain(article.title),
      description: plain(article.metaDescription || article.excerpt || ''),
      image: [ogImage],
      inLanguage: 'zh-Hant-HK',
      datePublished: article.publishDate || undefined,
      dateModified: modified,
      author: { '@id': PERSON_ID },
      reviewedBy: { '@id': PERSON_ID },
      publisher: { '@id': ORG_ID },
      about: article.conditionName ? { '@type': 'MedicalCondition', name: article.conditionName } : undefined,
      audience: { '@type': 'Patient' },
      lastReviewed: modified,
      citation: citations.length ? citations : undefined
    });

    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': PERSON_ID,
      name: '胡佩珊中醫師',
      alternateName: ['胡佩珊', '胡佩珊醫師', 'Kate Woo'],
      url: SITE_BASE + 'about.html',
      image: SITE_BASE + 'Profile%20pic.JPG',
      jobTitle: '註冊中醫師',
      identifier: { '@type': 'PropertyValue', name: 'CMCHK 註冊編號', value: '008823' },
      knowsAbout: ['中醫婦科', '女性健康', '產後調理', '經期失調'],
      worksFor: { '@id': ORG_ID }
    });

    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORG_ID,
      name: '胡佩珊中醫師',
      url: SITE_BASE + 'index.html'
    });

    var crumbItems = [{ '@type': 'ListItem', position: 1, name: '首頁', item: SITE_BASE + 'index.html' }];
    crumbItems.push({ '@type': 'ListItem', position: 2, name: '文章知識庫', item: SITE_BASE + 'articles.html' });
    if (stageLabel) {
      var stageUrl = SITE_BASE + 'articles.html' + (article.stage ? '?stage=' + article.stage : '');
      crumbItems.push({ '@type': 'ListItem', position: crumbItems.length + 1, name: stageLabel, item: stageUrl });
    }
    crumbItems.push({ '@type': 'ListItem', position: crumbItems.length + 1, name: plain(article.title) });
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbItems
    });

    if (faqItems && faqItems.length) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(function (qa) {
          return {
            '@type': 'Question',
            name: plain(qa.q),
            acceptedAnswer: { '@type': 'Answer', text: plain(qa.a) }
          };
        })
      });
    }

    return blocks.map(function (obj) {
      // 移除 undefined 欄位
      var clean = JSON.parse(JSON.stringify(obj));
      return '<script type="application/ld+json">' + JSON.stringify(clean, null, 2) + '</script>';
    }).join('\n');
  }

  // ── 完整文章頁面 ──────────────────────────────────────────
  // allArticles / stageLabelMap 為選填，提供時會產生「相關文章」區塊
  function renderArticleHTML(article, stageLabel, allArticles, stageLabelMap, lang) {
    lang = lang || 'zh';
    article = localizeArticle(article, lang);
    var title = esc(article.metaTitle || (article.title + '｜胡佩珊中醫師'));
    var desc = esc(article.metaDescription || article.excerpt || '');
    var keywords = esc((article.keywords || []).join(','));
    var heroTags = (article.heroTags || []).map(function (t) {
      return '<span class="article-hero-tag">' + inline(t) + '</span>';
    }).join('');
    var toc = buildTOC(article.blocks);
    var ctx = {};
    var body = renderBlocks(article.blocks, ctx);
    var hasCta = (article.blocks || []).some(function (b) { return b.type === 'cta'; });
    var pageUrl = SITE_BASE + 'articles/' + esc(article.slug) + '.html';
    var ogImage = SITE_BASE + 'og-image.png';
    var jsonld = buildJSONLD(article, pageUrl, ogImage, ctx.faqItems, stageLabel);
    var robots = article.hidden ? 'noindex,follow' : 'index,follow,max-snippet:-1,max-image-preview:large';
    var metaLine = '約 ' + (article.readTime || 5) + ' 分鐘閱讀';
    var modified = article.modifiedDate || article.publishDate || '';
    var publishedMeta = article.publishDate ? '<meta property="article:published_time" content="' + esc(article.publishDate) + '">\n' : '';
    var modifiedMeta = modified ? '<meta property="article:modified_time" content="' + esc(modified) + '">\n' : '';
    var breadcrumbNav = buildBreadcrumbNav(stageLabel, article.stage);
    var authorBox = buildAuthorBox();
    var related = buildRelated(article, allArticles, stageLabelMap);

    return '<!DOCTYPE html>\n' +
'<html lang="zh-Hant-HK">\n' +
'<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'<title>' + title + '</title>\n' +
'<meta name="description" content="' + desc + '">\n' +
(keywords ? '<meta name="keywords" content="' + keywords + '">\n' : '') +
'<meta name="robots" content="' + robots + '">\n' +
'<link rel="canonical" href="' + pageUrl + '">\n' +
'<meta property="og:type" content="article">\n' +
'<meta property="og:title" content="' + title + '">\n' +
'<meta property="og:description" content="' + desc + '">\n' +
'<meta property="og:site_name" content="胡佩珊中醫師">\n' +
'<meta property="og:url" content="' + pageUrl + '">\n' +
'<meta property="og:image" content="' + ogImage + '">\n' +
'<meta property="og:locale" content="zh_HK">\n' +
publishedMeta +
modifiedMeta +
'<meta name="twitter:card" content="summary_large_image">\n' +
'<meta name="twitter:image" content="' + ogImage + '">\n' +
'<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
'<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@300;400;500;600&display=swap" rel="stylesheet">\n' +
'<link rel="stylesheet" href="article.css">\n' +
jsonld + '\n' +
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
breadcrumbNav + '\n' +
'  <div class="article-hero-eyebrow">' + inline(article.heroEyebrow || stageLabel || '') + '</div>\n' +
'  <h1>' + renderArticleTitle(article.title) + '</h1>\n' +
(article.excerpt ? '  <p class="article-hero-subtitle">' + inline(article.excerpt) + '</p>\n' : '') +
(heroTags ? '  <div class="article-hero-tags">' + heroTags + '</div>\n' : '') +
'  <div class="article-hero-meta">' + metaLine + '</div>\n' +
'</header>\n' +
'<main class="article-container">\n' +
toc + '\n' +
'<div class="article-section">\n' +
body + '\n' +
'</div>\n' +
(hasCta ? '' : '<div class="a-cta"><h3>想進一步了解自己的身體狀況？</h3><p>歡迎預約中醫師門診，由醫師為您詳細辨證，制定個人化治療方案。</p><a class="a-cta-btn" href="../index.html#contact">預約掛號 →</a></div>\n') +
authorBox + '\n' +
related + '\n' +
'<p class="article-disclaimer">本文內容僅供健康教育參考，不構成醫療建議，亦不能取代註冊醫師或中醫師的診斷與治療。若您出現急性或嚴重症狀，請立即求醫。撰文：胡佩珊中醫師（香港中醫藥管理委員會註冊中醫師，註冊編號：008823）。</p>\n' +
'</main>\n' +
'<script src="../shared-nav.js"></script>\n' +
'</body>\n' +
'</html>\n';
  }

  // ── 文章卡片 HTML 片段（首頁精選區 與 健康知識庫頁 共用）─────────
  // data-tags／data-search 供知識庫頁的標籤篩選與關鍵字搜尋使用，首頁卡片會忽略這兩個屬性
  function renderCardHTML(article, stageLabel, lang) {
    article = localizeArticle(article, lang || 'zh');
    var tagList = article.tags || [];
    var tags = tagList.join(',');
    var searchBlob = [article.title, article.excerpt, tagList.join(' '), (article.keywords || []).join(' ')]
      .join(' ').toLowerCase();
    var tagPills = tagList.length
      ? '        <div class="art-tags">' + tagList.map(function (t) { return '<span class="art-tag-pill">' + esc(t) + '</span>'; }).join('') + '</div>\n'
      : '';
    return '<a href="articles/' + esc(article.slug) + '.html" class="article-card" data-stage="' + esc(article.stage) + '" data-tags="' + esc(tags) + '" data-search="' + esc(searchBlob) + '">\n' +
tagPills +
'        <div class="art-title">' + esc(article.title) + '</div>\n' +
'        <div class="art-excerpt">' + esc(article.excerpt || '') + '</div>\n' +
'        <div class="art-footer"><span>⏱ 約 ' + (article.readTime || 5) + ' 分鐘</span><span class="art-read">閱讀更多 →</span></div>\n' +
'      </a>';
  }

  // ── 標籤篩選 chip（健康知識庫頁）────────────────────────────
  function renderTagChipHTML(tag) {
    return '<button type="button" class="tag-chip" data-tag="' + esc(tag) + '">' + esc(tag) + '</button>';
  }

  global.ArticleRender = {
    renderArticleHTML: renderArticleHTML,
    renderCardHTML: renderCardHTML,
    renderTagChipHTML: renderTagChipHTML,
    renderBlocks: renderBlocks,
    localizeArticle: localizeArticle,
    pickLocalized: pickLocalized,
    inline: inline,
    plain: plain,
    SITE_BASE: SITE_BASE,
    PERSON_ID: PERSON_ID,
    ORG_ID: ORG_ID
  };
})(window);
