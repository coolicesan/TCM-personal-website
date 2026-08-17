/* ============================================================================
   lead-capture.js — 完整體質報告的聯絡資料收集閘

   體質問卷做完之後，摘要（體質類型、雷達圖、飲食方向）仍然免費即時顯示；
   「完整體質報告」則要先留下聯絡方式才解鎖。

   ⚠ 這是「君子閘」，不是保安措施。
   constitution-report.html 是公開的靜態檔案，懂得看原始碼或直接打 URL 的人
   一定繞得過。用來收 lead 沒問題（絕大多數訪客會照填），但千萬不要拿它來
   賣收費內容 — 收了錢而內容拿得到，是會出事的。

   ── 設定：把 SETUP 裡的 endpoint 填好就會自動寄信 ──────────────────────
   endpoint 為空的時候，表單會退回 WhatsApp 模式（資料經 WhatsApp 傳給醫師，
   仍然收得到 lead），所以未設定之前網站一樣運作正常。
   ========================================================================= */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────────────
     SETUP — 你只需要改這一段
     ───────────────────────────────────────────────────────────────────────
     1. 開一個 MailerLite（或 Brevo）免費帳號，建立一個 form / list。
     2. 把它的 form action URL 貼進 endpoint。
        · MailerLite：Forms → Embedded form → 取 <form action="..."> 的網址
        · Brevo：     Forms → Share → 取 https://sibforms.com/serve/... 的網址
     3. 對照該表單的欄位名稱，改 fields 裡的值。
     4. 在後台建立 automation：有人加入名單 → 自動寄出報告連結的 email。
        報告連結格式：https://katewoo.com/constitution-report.html?const=氣虛質
        （名單欄位會帶著體質類型，automation 可以用它組出對應連結）
     ------------------------------------------------------------------- */
  var SETUP = {
    // 貼上表單 endpoint。留空 = 使用 WhatsApp 退回模式。
    endpoint: '',

    // 表單欄位名稱對照（依你的 MailerLite / Brevo 欄位改）
    fields: {
      name:         'name',          // 姓名
      phone:        'phone',         // 電話
      email:        'email',         // Email
      consent:      'marketing_opt_in', // 直接促銷同意（true / false）
      constitution: 'constitution',      // 體質類型（中文），用於稱呼與分眾
      constSlug:    'constitution_slug', // 體質 slug，automation 用來組報告連結
      source:       'source'             // 來源，方便日後分辨不同表單
    },

    // WhatsApp 退回模式 / 送出失敗時使用的號碼
    whatsapp: '85298152863',

    // 電話是否必填。改成 true 會提高流失率 — 建議維持 false。
    phoneRequired: false
  };

  var STORAGE_KEY = 'drhu_lead_v1';

  /* 中文體質名 → ASCII slug。自動化電郵用 slug 組連結
     （constitution-report.html?c=qi-deficiency&k=cq），
     免得中文字在郵件客戶端被改壞。與報告頁的圖片檔名一致。 */
  var SLUGS = {
    '平和質': 'balanced-type',
    '氣虛質': 'qi-deficiency',
    '陽虛質': 'yang-deficiency',
    '陰虛質': 'yin-deficiency',
    '痰濕質': 'phlegm-dampness',
    '濕熱質': 'damp-heat',
    '血瘀質': 'blood-stasis',
    '氣鬱質': 'qi-stagnation',
    '特稟質': 'allergic-type'
  };
  function slugFor(zh) {
    if (!zh) return '';
    if (SLUGS[zh]) return SLUGS[zh];
    /* 「基本平和質」之類的變體名：取包含關係做後備比對 */
    var hit = Object.keys(SLUGS).filter(function (k) { return zh.indexOf(k) !== -1; })[0];
    return hit ? SLUGS[hit] : '';
  }

  /* ── 樣式（注入，讓問卷頁和報告頁共用）────────────────────────────── */
  var CSS = [
    '.lc-gate{background:linear-gradient(135deg,var(--blush) 0%,#fff 62%);',
    'border:1.5px solid var(--border);border-radius:var(--radius-lg);',
    'padding:1.75rem 1.5rem 1.6rem;margin-bottom:1.25rem;}',

    '.lc-gate-head{text-align:center;margin-bottom:1.25rem;}',
    '.lc-gate-icon{font-size:1.9rem;line-height:1;margin-bottom:.5rem;}',
    '.lc-gate-title{font-family:var(--font-display);font-size:1.3rem;',
    'color:var(--plum);line-height:1.4;margin-bottom:.35rem;}',
    '.lc-gate-sub{font-size:.86rem;color:var(--text-light);line-height:1.7;}',

    '.lc-list{list-style:none;margin:0 auto 1.35rem;padding:0;max-width:380px;',
    'display:flex;flex-direction:column;gap:.4rem;}',
    '.lc-list li{font-size:.85rem;color:var(--text);line-height:1.6;',
    'display:flex;gap:.55rem;align-items:flex-start;}',
    '.lc-list li::before{content:"✓";color:var(--sage);font-weight:700;flex-shrink:0;}',

    '.lc-form{max-width:380px;margin:0 auto;display:flex;flex-direction:column;gap:.7rem;}',
    '.lc-field{display:flex;flex-direction:column;gap:.3rem;}',
    '.lc-label{font-size:.79rem;color:var(--text-light);padding-left:.2rem;}',
    '.lc-label .lc-opt{opacity:.75;}',
    '.lc-input{width:100%;padding:.8rem 1.1rem;border:1.5px solid var(--border);',
    'border-radius:var(--radius);background:#fff;font-family:var(--font-body);',
    'font-size:.95rem;color:var(--text);transition:border-color .2s,box-shadow .2s;}',
    '.lc-input::placeholder{color:var(--text-light);opacity:.6;}',
    '.lc-input:focus{outline:none;border-color:var(--dusty-rose);',
    'box-shadow:0 0 0 4px rgba(201,143,130,.16);}',
    '.lc-input:focus-visible{outline:none;}',
    '.lc-input.is-bad{border-color:var(--terracotta);}',
    '.lc-err{font-size:.76rem;color:var(--terracotta);padding-left:.2rem;min-height:0;}',

    '.lc-consent{display:flex;gap:.6rem;align-items:flex-start;',
    'font-size:.8rem;color:var(--text-light);line-height:1.65;cursor:pointer;',
    'background:#fff;border:1.5px solid var(--border);border-radius:var(--radius);',
    'padding:.7rem .85rem;transition:border-color .2s;}',
    '.lc-consent:hover{border-color:var(--plum-light);}',
    '.lc-consent input{accent-color:var(--plum);margin-top:.22rem;flex-shrink:0;',
    'width:16px;height:16px;cursor:pointer;}',

    '.lc-submit{width:100%;justify-content:center;margin-top:.15rem;}',
    '.lc-submit[disabled]{opacity:.6;cursor:not-allowed;transform:none;}',

    '.lc-pics{font-size:.73rem;color:var(--text-light);line-height:1.7;',
    'margin-top:.15rem;text-align:center;opacity:.9;}',
    '.lc-pics a{color:var(--plum);text-decoration:underline;white-space:nowrap;}',
    '.lc-pics a:hover{color:var(--terracotta);}',

    '.lc-steps{max-width:380px;margin:0 auto 1.25rem;padding-left:1.35rem;',
    'display:flex;flex-direction:column;gap:.45rem;}',
    '.lc-steps li{font-size:.88rem;color:var(--text);line-height:1.7;padding-left:.2rem;}',
    '.lc-steps li::marker{color:var(--terracotta);font-weight:700;}',
    '.lc-steps strong{color:var(--plum);}',
    '.lc-reopen{display:block;text-align:center;font-size:.79rem;',
    'color:var(--text-light);text-decoration:underline;margin-top:.15rem;}',
    '.lc-reopen:hover{color:var(--plum);}',

    '.lc-fail{background:#FDF0E8;border:1.5px solid var(--terracotta);',
    'border-radius:var(--radius);padding:.8rem 1rem;font-size:.83rem;',
    'color:var(--text);line-height:1.7;}',

    /* 報告頁的遮罩 */
    '.lc-veil{position:fixed;inset:0;z-index:9999;background:rgba(250,247,242,.97);',
    'backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;',
    'padding:1.5rem;overflow-y:auto;}',
    '.lc-veil-card{background:#fff;border:1.5px solid var(--border);',
    'border-radius:var(--radius-lg);padding:2.25rem 1.75rem;max-width:420px;',
    'text-align:center;box-shadow:0 18px 50px rgba(61,36,53,.14);}',
    '.lc-veil-card .lc-gate-title{margin-bottom:.6rem;}',
    '.lc-veil-actions{display:flex;flex-direction:column;gap:.6rem;margin-top:1.35rem;}',

    '@media (max-width:600px){.lc-gate{padding:1.4rem 1.15rem 1.35rem;}}'
  ].join('');

  function injectCss() {
    if (document.getElementById('lc-styles')) return;
    var s = document.createElement('style');
    s.id = 'lc-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ── 已留過資料的訪客不用再填 ────────────────────────────────────── */
  function getLead() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch (_) { return null; }
  }
  function hasLead() { return !!(getLead() && getLead().email); }
  function saveLead(lead) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lead)); } catch (_) {}
  }

  /* ── 驗證 ────────────────────────────────────────────────────────── */
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function isPhone(v) { return (v.replace(/\D/g, '').length >= 8); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ── 送出 ────────────────────────────────────────────────────────── */
  function waLink(lead) {
    var msg = '你好，我完成咗網上中醫體質評估。\n'
      + '體質類型：' + (lead.constitution || '—') + '\n'
      + '姓名：' + lead.name + '\n'
      + (lead.phone ? '電話：' + lead.phone + '\n' : '')
      + 'Email：' + lead.email + '\n'
      + '想索取完整體質報告，謝謝！';
    return 'https://wa.me/' + SETUP.whatsapp + '?text=' + encodeURIComponent(msg);
  }

  /* 各家表單服務的 CORS 政策不一：先照正常 CORS 送，被擋就改用 no-cors 重送。
     no-cors 讀不到回應，但請求確實送達伺服器，所以視為成功。 */
  function postLead(lead) {
    if (!SETUP.endpoint) return Promise.reject(new Error('no-endpoint'));

    var f = SETUP.fields;
    var body = new FormData();
    body.append(f.name, lead.name);
    if (lead.phone) body.append(f.phone, lead.phone);
    body.append(f.email, lead.email);
    body.append(f.consent, lead.consent ? 'true' : 'false');
    body.append(f.constitution, lead.constitution || '');
    body.append(f.constSlug, slugFor(lead.constitution));
    body.append(f.source, lead.source || 'constitution-quiz');

    return fetch(SETUP.endpoint, {
      method: 'POST',
      body: body,
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('http-' + res.status);
      return true;
    }).catch(function () {
      return fetch(SETUP.endpoint, { method: 'POST', body: body, mode: 'no-cors' })
        .then(function () { return true; });
    });
  }

  /* ── 表單畫面 ─────────────────────────────────────────────────────── */
  function gateHtml(ctx) {
    var perks = ctx.perks || [
      '體質成因、典型表現與常見誤區',
      '適宜與忌口食材完整清單',
      '對症食療湯水食譜與做法',
      '茶飲配方、穴位按摩與耳穴保健',
      '外食族點餐指南與生活調養建議'
    ];
    var sendLabel = SETUP.endpoint ? '免費取得完整報告 →' : '透過 WhatsApp 索取報告 →';

    /* 收集個人資料聲明要講實話：WhatsApp 模式下報告不是用電郵寄的，
       別寫成「用作寄送這份報告」。 */
    var picsUse = SETUP.endpoint
      ? '你的姓名及聯絡方式只用作寄送這份報告'
      : '你的姓名及聯絡方式會透過 WhatsApp 傳送給胡醫師，用作跟進你的報告查詢';

    return ''
      + '<div class="lc-gate" id="lcGate">'
      +   '<div class="lc-gate-head">'
      +     '<div class="lc-gate-icon" aria-hidden="true">🔓</div>'
      +     '<h3 class="lc-gate-title">解鎖'
      +       (ctx.constitution ? '「' + esc(ctx.constitution) + '」' : '你的')
      +       '完整報告</h3>'
      +     '<p class="lc-gate-sub">留下聯絡方式，即可查看為你的體質整理的完整調理內容。</p>'
      +   '</div>'
      +   '<ul class="lc-list">' + perks.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>'
      +   '<form class="lc-form" id="lcForm" novalidate>'
      +     '<div class="lc-field">'
      +       '<label class="lc-label" for="lcName">姓名</label>'
      +       '<input class="lc-input" id="lcName" name="name" type="text" autocomplete="name" placeholder="怎樣稱呼你">'
      +     '</div>'
      +     '<div class="lc-field">'
      +       '<label class="lc-label" for="lcEmail">Email</label>'
      +       '<input class="lc-input" id="lcEmail" name="email" type="email" autocomplete="email" placeholder="report@example.com">'
      +     '</div>'
      +     '<div class="lc-field">'
      +       '<label class="lc-label" for="lcPhone">電話'
      +         (SETUP.phoneRequired ? '' : '<span class="lc-opt">（選填，方便 WhatsApp 跟進）</span>')
      +       '</label>'
      +       '<input class="lc-input" id="lcPhone" name="phone" type="tel" autocomplete="tel" placeholder="9xxx xxxx">'
      +     '</div>'
      +     '<div class="lc-err" id="lcErr" role="alert" aria-live="polite"></div>'
      +     '<label class="lc-consent">'
      +       '<input type="checkbox" id="lcConsent">'
      +       '<span>我願意日後收到胡醫師的健康資訊、調理貼士與服務推廣。（選填，可隨時取消）</span>'
      +     '</label>'
      +     '<button type="submit" class="btn btn-primary lc-submit" id="lcSubmit">' + sendLabel + '</button>'
      +     '<p class="lc-pics">' + picsUse
      +       '（以及在你勾選同意後，寄送健康資訊）。問卷的逐題答案不會上載，'
      +       '只會記錄評估得出的體質類型，用以配對正確的報告內容。'
      +       '詳情見<a href="privacy.html" target="_blank" rel="noopener">私隱政策</a>。</p>'
      +   '</form>'
      + '</div>';
  }

  /* ctx: { constitution, reportUrl, perks }  onUnlock: function(lead) */
  function renderGate(container, ctx, onUnlock) {
    injectCss();
    container.innerHTML = gateHtml(ctx);

    var form    = container.querySelector('#lcForm');
    var elName  = container.querySelector('#lcName');
    var elEmail = container.querySelector('#lcEmail');
    var elPhone = container.querySelector('#lcPhone');
    var elCons  = container.querySelector('#lcConsent');
    var elErr   = container.querySelector('#lcErr');
    var elBtn   = container.querySelector('#lcSubmit');

    /* 問卷一開始已經問過稱呼，不要再叫人打多次。 */
    if (ctx.name) elName.value = ctx.name;

    /* WhatsApp 已開啟之後的確認畫面 */
    function showWaConfirm(lead) {
      container.innerHTML = ''
        + '<div class="lc-gate">'
        +   '<div class="lc-gate-head">'
        +     '<div class="lc-gate-icon" aria-hidden="true">💬</div>'
        +     '<h3 class="lc-gate-title">WhatsApp 已為你開啟</h3>'
        +     '<p class="lc-gate-sub">訊息已經幫你打好，按傳送就可以了。</p>'
        +   '</div>'
        +   '<ol class="lc-steps">'
        +     '<li>在 WhatsApp 視窗按<strong>傳送</strong></li>'
        +     '<li>回到這一頁，按下面的按鈕查看報告</li>'
        +   '</ol>'
        +   '<div class="lc-form">'
        +     '<button type="button" class="btn btn-primary lc-submit" id="lcDone">已傳送，查看報告 →</button>'
        +     '<a class="lc-reopen" href="' + esc(waLink(lead)) + '" target="_blank" rel="noopener">'
        +       'WhatsApp 沒有開啟？點這裡再試一次</a>'
        +   '</div>'
        + '</div>';
      container.querySelector('#lcDone')
        .addEventListener('click', function () { onUnlock(lead); });
    }

    function fail(msg, el) {
      elErr.textContent = msg;
      [elName, elEmail, elPhone].forEach(function (i) { i.classList.remove('is-bad'); });
      if (el) { el.classList.add('is-bad'); el.focus(); }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var lead = {
        name:  elName.value.trim(),
        email: elEmail.value.trim(),
        phone: elPhone.value.trim(),
        consent: elCons.checked,
        constitution: ctx.constitution || '',
        source: 'constitution-quiz',
        at: new Date().toISOString()
      };

      if (!lead.name)                        return fail('請填寫姓名。', elName);
      if (!isEmail(lead.email))              return fail(SETUP.endpoint
                                                ? '請填寫有效的 Email，報告會寄到這個地址。'
                                                : '請填寫有效的 Email。', elEmail);
      if (SETUP.phoneRequired && !lead.phone) return fail('請填寫電話。', elPhone);
      if (lead.phone && !isPhone(lead.phone)) return fail('電話號碼格式不正確。', elPhone);

      fail('');
      elBtn.disabled = true;
      elBtn.textContent = '處理中…';

      /* WhatsApp 模式：訊息只在對方真的按下傳送時才會到達醫師手上。
         如果這裡即刻解鎖，訪客拿到報告就會直接關掉 WhatsApp，醫師收不到任何
         資料。所以改成兩步：先開 WhatsApp，再由對方自己確認已傳送才顯示報告。
         繞得過（本來就是君子閘），但把「傳送」變成流程的一步而不是可略過的岔路。 */
      if (!SETUP.endpoint) {
        saveLead(lead);
        window.open(waLink(lead), '_blank', 'noopener');
        showWaConfirm(lead);
        return;
      }

      postLead(lead).then(function () {
        saveLead(lead);
        onUnlock(lead);
      }).catch(function () {
        elBtn.disabled = false;
        elBtn.textContent = '再試一次';
        elErr.innerHTML = '';
        var box = document.createElement('div');
        box.className = 'lc-fail';
        box.innerHTML = '送出時遇到問題。你可以再按一次，或'
          + '<a href="' + esc(waLink(lead)) + '" target="_blank" rel="noopener" id="lcWa">'
          + '直接用 WhatsApp 傳給醫師</a>。';
        elErr.appendChild(box);
        var wa = box.querySelector('#lcWa');
        wa.addEventListener('click', function () { saveLead(lead); onUnlock(lead); });
      });
    });
  }

  /* ── 報告頁的遮罩：沒留過資料就請對方先做問卷 ──────────────────────
     三種情況要放行：
       1. 這部裝置填過表單（localStorage）
       2. 連結帶 ?k=cq — 自動化電郵寄出的連結。收信人可能在另一部裝置開，
          本機沒有紀錄，但他確實已經留過資料，不放行等於整個流程失效。
       3. ?admin=1 — 醫師自己預覽九種報告的既有做法
     ?k=cq 猜得到，但這本來就是君子閘，不是保安措施。 */
  function guard() {
    var p = new URLSearchParams(location.search);
    if (hasLead() || p.get('k') === 'cq' || p.get('admin') === '1') return;
    injectCss();

    var veil = document.createElement('div');
    veil.className = 'lc-veil';
    veil.innerHTML = ''
      + '<div class="lc-veil-card">'
      +   '<div class="lc-gate-icon" aria-hidden="true">☯</div>'
      +   '<h2 class="lc-gate-title">完整體質報告</h2>'
      +   '<p class="lc-gate-sub">這份報告是按個人體質評估結果整理的。'
      +     '請先完成體質問卷，就能即時查看屬於你的完整內容。</p>'
      +   '<div class="lc-veil-actions">'
      +     '<a class="btn btn-primary" href="constitution.html">開始體質評估 →</a>'
      +     '<a class="btn btn-outline" href="index.html">返回首頁</a>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(veil);
    document.body.style.overflow = 'hidden';
  }

  window.LeadCapture = {
    hasLead: hasLead,
    getLead: getLead,
    renderGate: renderGate,
    guard: guard,
    isConfigured: function () { return !!SETUP.endpoint; }
  };
})();
