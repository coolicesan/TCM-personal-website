// ─── Markdown 匯入解析器 ──────────────────────────────────────
// 把撰稿人準備好的 .md／.txt 文章（含頂部 SEO 設定註解區塊）解析成
// 文章管理後台的 article 物件（含 blocks 陣列），供匯入按鈕使用。
(function (global) {
  'use strict';

  function trimBlank(lines) {
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    return lines;
  }

  function splitTableRow(line) {
    var t = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    return t.split('|').map(function (c) { return c.trim(); });
  }
  function isTableSeparator(line) {
    return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line.trim());
  }

  // ── 解析頂部 SEO 設定註解 ──────────────────────────────────
  function parseSeoBlock(text) {
    var meta = { metaTitle: '', metaDescription: '', slug: '', keywords: [] };
    var m = text.match(/^\s*<!--([\s\S]*?)-->\s*/);
    var rest = text;
    if (m) {
      rest = text.slice(m[0].length);
      var block = m[1];
      var titleM = block.match(/Title\s*標籤[^：:]*[：:]\s*\n(.+)/);
      if (titleM) meta.metaTitle = titleM[1].trim();
      var descM = block.match(/Meta description[^：:]*[：:]\s*\n(.+)/);
      if (descM) meta.metaDescription = descM[1].trim();
      var slugM = block.match(/Slug[／\/]?URL[：:]\s*\n(.+)/);
      if (slugM) meta.slug = slugM[1].trim().replace(/^\/+/, '').replace(/[^a-zA-Z0-9\-_]/g, '');
      var kwPrimary = block.match(/主關鍵字[：:]\s*(.+)/);
      var kwSecondary = block.match(/次要關鍵字[：:]\s*(.+)/);
      var kws = [];
      if (kwPrimary) kws.push(kwPrimary[1].trim());
      if (kwSecondary) kws = kws.concat(kwSecondary[1].split(/[、,，]/).map(function (s) { return s.trim(); }).filter(Boolean));
      meta.keywords = kws.filter(Boolean);
    }
    return { meta: meta, body: rest };
  }

  function flushParagraph(buf, blocks, isFirst) {
    var text = buf.join(' ').trim();
    if (!text) return;
    blocks.push({ type: isFirst ? 'lead' : 'paragraph', text: text });
  }

  // ── 主解析函式 ────────────────────────────────────────────
  function parseMarkdownToArticle(raw, defaults) {
    var parsed = parseSeoBlock(raw);
    var meta = parsed.meta;
    var lines = parsed.body.replace(/\r\n/g, '\n').split('\n');

    var blocks = [];
    var title = '';
    var seenFirstParagraph = false;
    var mode = null; // null | 'faq' | 'refs'
    var faqItems = [];
    var curQ = null, curA = [];
    var paraBuf = [];
    var i = 0;

    function flushFaqQuestion() {
      if (curQ) { faqItems.push({ q: curQ, a: curA.join(' ').trim() }); curQ = null; curA = []; }
    }
    function flushFaq() {
      flushFaqQuestion();
      if (faqItems.length) { blocks.push({ type: 'faq', items: faqItems }); faqItems = []; }
    }
    function flushPara() {
      if (!paraBuf.length) return;
      if (mode === 'faq' && curQ) {
        curA.push(paraBuf.join(' ').trim());
      } else {
        flushParagraph(paraBuf, blocks, !seenFirstParagraph);
        seenFirstParagraph = true;
      }
      paraBuf = [];
    }

    while (i < lines.length) {
      var line = lines[i];
      var t = line.trim();

      // 空行 → 結束目前段落緩衝
      if (!t) { flushPara(); i++; continue; }

      // H1 標題
      var h1 = t.match(/^#\s+(.+)/);
      if (h1) { title = h1[1].trim(); i++; continue; }

      // 撰文／發布日期 byline（自動略過，後台自動產生）
      if (/^撰文[：:]/.test(t) || /^發布日期[：:]/.test(t)) { i++; continue; }

      // H2
      var h2 = t.match(/^##\s+(.+)/);
      if (h2) {
        flushPara(); flushFaq();
        var h2text = h2[1].trim();
        if (h2text.indexOf('常見問題') !== -1) { mode = 'faq'; blocks.push({ type: 'heading', text: h2text }); }
        else if (h2text.indexOf('參考資料') !== -1 || h2text.indexOf('參考文獻') !== -1) { mode = 'refs'; blocks.push({ type: 'references', items: [] }); }
        else { mode = null; blocks.push({ type: 'heading', text: h2text }); }
        i++; continue;
      }

      // H3
      var h3 = t.match(/^###\s+(.+)/);
      if (h3) {
        flushPara();
        if (mode === 'faq') { flushFaqQuestion(); curQ = h3[1].trim(); curA = []; }
        else { blocks.push({ type: 'subheading', text: h3[1].trim() }); }
        i++; continue;
      }

      // 定義型 blockquote：> **詞**：說明
      var defQuote = t.match(/^>\s*\*\*(.+?)\*\*[：:]\s*(.+)/);
      if (defQuote) {
        flushPara();
        blocks.push({ type: 'info', title: defQuote[1].trim(), text: defQuote[2].trim() });
        i++; continue;
      }
      // 一般 blockquote
      var quote = t.match(/^>\s*(.+)/);
      if (quote) {
        flushPara();
        blocks.push({ type: 'quote', text: quote[1].trim() });
        i++; continue;
      }

      // 表格
      if (/^\|/.test(t) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
        flushPara();
        var headers = splitTableRow(t);
        i += 2; // 跳過表頭與分隔線
        var rows = [];
        while (i < lines.length && /^\|/.test(lines[i].trim())) {
          rows.push(splitTableRow(lines[i]));
          i++;
        }
        blocks.push({ type: 'table', headers: headers, rows: rows });
        continue;
      }

      // 清單／參考文獻編號清單
      var bullet = t.match(/^[-*]\s+(.+)/);
      var numbered = t.match(/^\d+\.\s+(.+)/);
      if (bullet || numbered) {
        flushPara();
        var items = [];
        while (i < lines.length) {
          var lt = lines[i].trim();
          var bm = lt.match(/^[-*]\s+(.+)/);
          var nm = lt.match(/^\d+\.\s+(.+)/);
          if (!bm && !nm) break;
          items.push((bm || nm)[1].trim());
          i++;
        }
        if (mode === 'refs') {
          var refBlock = blocks[blocks.length - 1];
          if (refBlock && refBlock.type === 'references') refBlock.items = refBlock.items.concat(items);
          else blocks.push({ type: 'references', items: items });
        } else {
          blocks.push({ type: 'list', items: items });
        }
        continue;
      }

      // 一般段落文字（累積到下一個空行）
      paraBuf.push(t);
      i++;
    }
    flushPara();
    flushFaq();

    var article = Object.assign({
      slug: meta.slug || ('article-' + Date.now().toString(36)),
      stage: (defaults && defaults.stage) || '',
      tags: [],
      title: title || '未命名文章',
      excerpt: '',
      metaTitle: meta.metaTitle || '',
      metaDescription: meta.metaDescription || '',
      keywords: meta.keywords || [],
      readTime: 5,
      heroEyebrow: '',
      heroTags: [],
      publishDate: '',
      blocks: blocks
    }, defaults && defaults.overrides);

    // 摘要預設抓 meta description（若有）
    if (!article.excerpt) article.excerpt = meta.metaDescription || '';

    return article;
  }

  global.MDImport = { parseMarkdownToArticle: parseMarkdownToArticle };
})(window);
