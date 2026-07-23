// ─── Word (.docx) 匯入解析器 ──────────────────────────────────
// 需要頁面已載入 mammoth.js（見文章管理後台.html 的 CDN script）。
// 流程：docx → mammoth 轉 HTML → 走訪 DOM → 轉成跟 Markdown 匯入相同的
// block 結構（inline 文字一律轉回 **粗體**／[文字](網址) 語法，
// 讓儲存後的資料跟手動輸入、Markdown 匯入完全一致）。
(function (global) {
  'use strict';

  // 把一個 inline 節點（含 <strong>/<em>/<a>）轉回 markdown 風格純文字
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
        else out += inner; // em/i/span 等直接取純文字，不特別標記
      }
    });
    return out;
  }

  function textOf(el) { return nodeToInlineText(el).trim(); }

  function parseHtmlToBlocks(doc) {
    var blocks = [];
    var title = '';
    var mode = null; // null | 'faq' | 'refs'
    var faqItems = [];
    var curQ = null, curA = [];
    var seenFirstParagraph = false;

    function flushFaqQuestion() {
      if (curQ) { faqItems.push({ q: curQ, a: curA.join(' ').trim() }); curQ = null; curA = []; }
    }
    function flushFaq() {
      flushFaqQuestion();
      if (faqItems.length) { blocks.push({ type: 'faq', items: faqItems }); faqItems = []; }
    }

    var els = Array.prototype.slice.call(doc.body.children);
    els.forEach(function (el) {
      var tag = el.tagName.toLowerCase();
      var text = textOf(el);
      if (!text && tag !== 'table') return;

      if (tag === 'h1') { title = text; return; }

      if (tag === 'h2') {
        flushFaq();
        if (text.indexOf('常見問題') !== -1) { mode = 'faq'; blocks.push({ type: 'heading', text: text }); }
        else if (text.indexOf('參考資料') !== -1 || text.indexOf('參考文獻') !== -1) { mode = 'refs'; blocks.push({ type: 'references', items: [] }); }
        else { mode = null; blocks.push({ type: 'heading', text: text }); }
        return;
      }
      if (tag === 'h3') {
        if (mode === 'faq') { flushFaqQuestion(); curQ = text; curA = []; }
        else blocks.push({ type: 'subheading', text: text });
        return;
      }
      if (tag === 'blockquote') {
        var defM = text.match(/^\*\*(.+?)\*\*[：:]\s*(.+)/);
        if (defM) blocks.push({ type: 'info', title: defM[1].trim(), text: defM[2].trim() });
        else blocks.push({ type: 'quote', text: text });
        return;
      }
      if (tag === 'table') {
        var rows = Array.prototype.slice.call(el.querySelectorAll('tr')).map(function (tr) {
          return Array.prototype.slice.call(tr.querySelectorAll('th,td')).map(function (cell) { return textOf(cell); });
        });
        if (!rows.length) return;
        blocks.push({ type: 'table', headers: rows[0], rows: rows.slice(1) });
        return;
      }
      if (tag === 'ul' || tag === 'ol') {
        var items = Array.prototype.slice.call(el.querySelectorAll(':scope > li')).map(function (li) { return textOf(li); });
        if (mode === 'refs') {
          var last = blocks[blocks.length - 1];
          if (last && last.type === 'references') last.items = last.items.concat(items);
          else blocks.push({ type: 'references', items: items });
        } else {
          blocks.push({ type: 'list', items: items });
        }
        return;
      }
      if (tag === 'p') {
        if (mode === 'faq' && curQ) { curA.push(text); return; }
        blocks.push({ type: seenFirstParagraph ? 'paragraph' : 'lead', text: text });
        seenFirstParagraph = true;
        return;
      }
    });
    flushFaq();
    return { title: title, blocks: blocks };
  }

  // ── 主要進入點：接收 docx 檔的 ArrayBuffer，回傳 article 物件 ──
  async function parseDocxToArticle(arrayBuffer, defaults) {
    if (!global.mammoth) throw new Error('mammoth.js 尚未載入，請確認網路連線正常後重新整理頁面');
    var result = await global.mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    var parser = new DOMParser();
    var doc = parser.parseFromString('<!DOCTYPE html><html><body>' + result.value + '</body></html>', 'text/html');
    var parsed = parseHtmlToBlocks(doc);

    var article = Object.assign({
      slug: (defaults && defaults.slug) || ('article-' + Date.now().toString(36)),
      stage: (defaults && defaults.stage) || '',
      tags: [],
      title: parsed.title || '未命名文章',
      excerpt: '',
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      readTime: 5,
      heroEyebrow: '',
      heroTags: [],
      publishDate: '',
      blocks: parsed.blocks
    }, defaults && defaults.overrides);

    return article;
  }

  global.DocxImport = { parseDocxToArticle: parseDocxToArticle };
})(window);
