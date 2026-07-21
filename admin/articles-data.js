// ─── 文章資料庫 ──────────────────────────────────────────────
// 由「文章管理後台.html」讀取與寫回，請透過後台編輯，不建議手動修改本檔案格式。
// stages：首頁文章分類頁籤（順序 = 顯示順序）
// articles：每篇文章的完整資料（順序 = 首頁卡片顯示順序）
window.ARTICLES_DATA = {
  stages: [
    { key: 'adolescent',    label: '青春期' },
    { key: 'reproductive',  label: '育齡期' },
    { key: 'fertility',     label: '備孕' },
    { key: 'pregnancy',     label: '懷孕' },
    { key: 'postpartum',    label: '產後' },
    { key: 'menopause',     label: '更年期' },
    { key: 'postmenopause', label: '停經後' }
  ],

  articles: [
    {
      slug: 'demo-sample-article',
      stage: 'fertility',
      tags: ['範例', '示範文章'],
      title: '【範例文章】這是文章管理後台的示範內容',
      excerpt: '這是一篇示範文章，用來展示後台的各種內容區塊長什麼樣子。確認格式沒問題後，可以直接在後台把這篇刪除，換上真正的文章內容。',
      metaTitle: '',
      metaDescription: '',
      keywords: ['示範', '範例文章'],
      readTime: 3,
      heroEyebrow: '示範用途 · 請勿正式發布',
      heroTags: ['#示範文章', '#後台範例'],
      publishDate: '',
      blocks: [
        { type: 'lead', text: '這段是**開場摘要**，會用比較大的字放在文章最前面，通常用來一句話說明這篇文章要解決什麼問題。' },
        { type: 'heading', text: '這是一個大標題（H2）' },
        { type: 'paragraph', text: '這是一般段落文字。可以用 **文字** 讓部分文字變粗體，也可以用 [文字](https://example.com) 加超連結。段落是最常用的內容區塊。' },
        { type: 'info', title: '小提醒', text: '這是「資訊框」，適合放需要特別留意、但不算警示的補充說明。' },
        { type: 'warning', title: '注意事項', text: '這是「提醒框」，顏色比資訊框更醒目一點，適合放需要小心處理的事項。' },
        { type: 'subheading', text: '這是次標題（H3）' },
        { type: 'checklist', items: ['勾選清單項目一', '勾選清單項目二', '勾選清單項目三'] },
        { type: 'alert', title: '出現以下情況請盡快就醫', items: ['紅色警示項目一（例如：劇烈腹痛）', '紅色警示項目二'] },
        { type: 'comparison', leftLabel: '中醫觀點', leftItems: ['論點一', '論點二'], rightLabel: '西醫觀點', rightItems: ['論點一', '論點二'] },
        { type: 'quote', text: '這是中醫典籍引用文字。', cite: '——《黃帝內經》' },
        { type: 'references', items: ['參考文獻範例一', '參考文獻範例二'] },
        { type: 'cta' }
      ]
    }
  ]
};
