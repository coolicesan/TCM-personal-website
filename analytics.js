/* ============================================================================
   analytics.js — Google Analytics 4

   ── 設定：把 GA4 的評估 ID 填進 measurementId 就會啟用 ───────────────────
   留空的時候，這個檔案完全不會載入 GA、不會發出任何網絡請求、也不會種
   cookie；window.track() 依然存在但是靜默的空函數，所以其他檔案裡埋的事件
   不需要先檢查 GA 有沒有設定好。

   ⚠ 啟用 GA4 = 網站開始種第三方 cookie。privacy.html 第八節必須同步反映，
   否則私隱聲明與實際做法不符。
   ========================================================================= */
(function () {
  'use strict';

  var SETUP = {
    /* GA4 後台（管理 → 資料串流 → 網站）拿到的評估 ID，格式 G-XXXXXXXXXX。
       留空 = 停用，網站照常運作。 */
    measurementId: ''
  };

  var ID = SETUP.measurementId;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  /* 全站統一的事件入口。未設定 ID 時是 no-op，
     所以 constitution.js / lead-capture.js 可以無條件呼叫。 */
  window.track = function (name, params) {
    if (!ID) return;
    try { gtag('event', name, params || {}); } catch (_) {}
  };

  if (!ID) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', ID);

  /* 全站 49 條 wa.me 連結和 17 條 mailto 不用逐條改 — 事件委派一次過蓋住，
     日後新增的連結也自動計入。用 capture 階段，確保連結在新視窗開啟之前先記錄。 */
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el || !el.closest) return;
    var a = el.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1) {
      window.track('whatsapp_click', { page_path: location.pathname });
    } else if (href.indexOf('mailto:') === 0) {
      window.track('email_click', { page_path: location.pathname });
    }
  }, true);
})();
