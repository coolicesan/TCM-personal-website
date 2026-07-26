// ─── HTML 匯入解析器 ──────────────────────────────────────────
// 專門用來重新匯入「這個後台自己產生過」的文章 HTML（articles/*.html）。
// 因為那些檔案都是用 article-render.js 固定的 class 命名產生的
// （.a-lead / .a-info / .a-warning / .a-alert / .a-comparison / .a-faq 等），
// 這裡直接反向辨識同一套 class，幾乎可以完整還原成區塊資料，不會失真。
// 對於來源不明、結構不同的 HTML，無法辨識的區塊會 fallback 成一般段落，
// 不會遺失文字內容，但排版種類會退化，需要人工重新分類。
(function (global) {
  'use strict';

  // 把一個 inline 節點（含 <strong>/<b>/<a>）轉回 markdown 風格純文字，
  // 跟 docx-import.js 的 nodeToInlineText 邏輯一致，讓三種匯入來源存出的資料格式相同。
  function nodeToInlineText(node) {
    var out = '';
    node.childNodes.forEach(function (child) {
      if (child.nodeType === Node.TEXT_NODE) {
        out += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        var tag = child.tagName.toLowerCase();
        var inner = nodeToInlineText(child);
        if (tag === 'strong' || tag === 'b') out += '**' + inner + '**';
        else if (tag === 'a' && child.getAttribute('href')) out += '[' + inner + '](' + child.getAttribute('href') + ')';
        else out += inner;
      }
    });
    return out;
  }
  function textOf(el) { return el ? nodeToInlineText(el).trim() : ''; }
  function listItems(root, selector) {
    return Array.prototype.slice.call(root.querySelectorAll(selector)).map(textOf);
  }

  // H1 是「主標題＋副標題」兩個 span，重新接回一個完整標題字串，
  // 跟 article-render.js 的 renderArticleTitle() 互為逆運算。
  function recoverTitle(h1El) {
    if (!h1El) return '';
    var primary = h1El.querySelector('.article-title-primary');
    var secondary = h1El.querySelector('.article-title-secondary');
    if (primary) return primary.textContent.trim() + (secondary ? secondary.textContent.trim() : '');
    return h1El.textContent.trim();
  }

  // 分期代碼藏在麵包屑連結的 ?stage=xxx 裡，比反查分期「中文名稱」更可靠
  function extractStageKey(doc) {
    var link = doc.querySelector('.article-breadcrumbs a[href*="stage="]');
    if (!link) return '';
    var m = (link.getAttribute('href') || '').match(/stage=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function parseBlocksFromSection(sectionEl) {
    var blocks = [];
    Array.prototype.slice.call(sectionEl.children).forEach(function (el) {
      var cls = el.className || '';
      var tag = el.tagName.toLowerCase();

      if (tag === 'h2') { blocks.push({ type: 'heading', text: textOf(el) }); return; }
      if (tag === 'h3') { blocks.push({ type: 'subheading', text: textOf(el) }); return; }
      if (tag === 'p') { blocks.push({ type: 'paragraph', text: textOf(el) }); return; }

      if (cls.indexOf('a-lead') !== -1) {
        var clone = el.cloneNode(true);
        var eyebrow = clone.querySelector('.a-lead-eyebrow');
        if (eyebrow) eyebrow.remove();
        blocks.push({ type: 'lead', text: textOf(clone) });
        return;
      }
      if (cls.indexOf('a-info') !== -1) {
        blocks.push({ type: 'info', title: textOf(el.querySelector('.a-info-title')), text: textOf(el.querySelector('.a-info-text')) });
        return;
      }
      if (cls.indexOf('a-warning') !== -1) {
        blocks.push({ type: 'warning', title: textOf(el.querySelector('.a-warning-title')), text: textOf(el.querySelector('.a-warning-text')) });
        return;
      }
      if (cls.indexOf('a-alert') !== -1) {
        blocks.push({ type: 'alert', title: textOf(el.querySelector('.a-alert-title')), items: listItems(el, 'li') });
        return;
      }
      if (tag === 'ul' && cls.indexOf('a-checklist') !== -1) {
        blocks.push({ type: 'checklist', items: listItems(el, 'li') });
        return;
      }
      if (tag === 'ul' && cls.indexOf('a-list') !== -1) {
        blocks.push({ type: 'list', items: listItems(el, 'li') });
        return;
      }
      if (cls.indexOf('a-quote') !== -1) {
        blocks.push({ type: 'quote', text: textOf(el.querySelector('p')), cite: textOf(el.querySelector('cite')) });
        return;
      }
      if (cls.indexOf('a-comparison') !== -1) {
        var leftCard = el.querySelector('.a-comp-card.left');
        var rightCard = el.querySelector('.a-comp-card.right');
        blocks.push({
          type: 'comparison',
          leftLabel: leftCard ? textOf(leftCard.querySelector('.a-comp-label')) : '',
          leftItems: leftCard ? listItems(leftCard, 'li') : [],
          rightLabel: rightCard ? textOf(rightCard.querySelector('.a-comp-label')) : '',
          rightItems: rightCard ? listItems(rightCard, 'li') : []
        });
        return;
      }
      if (cls.indexOf('a-table-wrap') !== -1) {
        var headers = listItems(el, 'thead th');
        var rows = Array.prototype.slice.call(el.querySelectorAll('tbody tr')).map(function (tr) {
          return Array.prototype.slice.call(tr.querySelectorAll('td')).map(textOf);
        });
        blocks.push({ type: 'table', headers: headers, rows: rows });
        return;
      }
      if (tag === 'details' && cls.indexOf('a-references') !== -1) {
        blocks.push({ type: 'references', items: listItems(el, 'ol > li') });
        return;
      }
      if (cls.indexOf('a-faq') !== -1) {
        var items = Array.prototype.slice.call(el.querySelectorAll('.a-faq-item')).map(function (item) {
          return { q: textOf(item.querySelector('.a-faq-q')), a: textOf(item.querySelector('.a-faq-a')) };
        });
        blocks.push({ type: 'faq', items: items });
        return;
      }
      if (cls.indexOf('a-cta') !== -1) {
        blocks.push({ type: 'cta', title: textOf(el.querySelector('h3')), text: textOf(el.querySelector('p')) });
        return;
      }

      // fallback：無法辨識的區塊，只要有文字就當段落保留，避免內容整段消失
      var fallbackText = textOf(el);
      if (fallbackText) blocks.push({ type: 'paragraph', text: fallbackText });
    });
    return blocks;
  }

  // ── 主要進入點：接收 HTML 檔案的純文字內容，回傳 article 物件 ──
  function parseHtmlToArticle(raw, defaults) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(raw, 'text/html');

    var h1 = doc.querySelector('.article-hero h1') || doc.querySelector('h1');
    var title = recoverTitle(h1);

    var excerptEl = doc.querySelector('.article-hero-subtitle');
    var heroEyebrowEl = doc.querySelector('.article-hero-eyebrow');
    var heroTags = listItems(doc, '.article-hero-tag');

    var metaLineEl = doc.querySelector('.article-hero-meta');
    var readTimeMatch = metaLineEl ? textOf(metaLineEl).match(/(\d+)/) : null;

    var descTag = doc.querySelector('meta[name="description"]');
    var kwTag = doc.querySelector('meta[name="keywords"]');
    var pubTag = doc.querySelector('meta[property="article:published_time"]');
    var modTag = doc.querySelector('meta[property="article:modified_time"]');

    var sectionEl = doc.querySelector('.article-section');
    var blocks = sectionEl ? parseBlocksFromSection(sectionEl) : [];

    var article = Object.assign({
      slug: (defaults && defaults.slug) || ('article-' + Date.now().toString(36)),
      stage: extractStageKey(doc) || (defaults && defaults.stage) || '',
      tags: [],
      title: title || '未命名文章',
      excerpt: textOf(excerptEl),
      metaTitle: '',
      metaDescription: descTag ? (descTag.getAttribute('content') || '') : '',
      keywords: kwTag ? (kwTag.getAttribute('content') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [],
      readTime: readTimeMatch ? parseInt(readTimeMatch[1], 10) : 5,
      heroEyebrow: textOf(heroEyebrowEl),
      heroTags: heroTags,
      publishDate: pubTag ? (pubTag.getAttribute('content') || '') : '',
      modifiedDate: modTag ? (modTag.getAttribute('content') || '') : '',
      conditionName: '',
      blocks: blocks
    }, defaults && defaults.overrides);

    return article;
  }

  global.HTMLImport = { parseHtmlToArticle: parseHtmlToArticle };
})(window);
