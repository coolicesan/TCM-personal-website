/* ──────────────────────────────────────────────────────────────
   小工具共用邏輯（日期運算、格式化、分段切換、直尺）
   所有運算都在瀏覽器完成，不會送出任何資料。
   ────────────────────────────────────────────────────────────── */
(function (global) {
  'use strict';

  var DAY = 86400000;
  var WEEKDAY = ['日', '一', '二', '三', '四', '五', '六'];
  var WEEKDAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  /* 網站的語言由 i18n.js 管；它不在的時候（例如單獨開這一頁）就當作中文。
     靜態文字由 i18n.js 逐句翻譯，這裡只處理 JS 生出來、帶數字的句子。 */
  function lang() {
    var api = global.DrHuI18n;
    return (api && api.getLang && api.getLang() === 'en') ? 'en' : 'zh';
  }

  function t(pair, vals) {
    var str = pair[lang()] || pair.zh;
    return String(str).replace(/\{(\w+)\}/g, function (m, key) {
      return vals && vals[key] != null ? vals[key] : m;
    });
  }

  function onLanguageChange(fn) {
    document.addEventListener('drhu:languagechange', fn);
  }

  /* 用本地時間的年月日建日期，避免 new Date('2026-09-06') 被當成 UTC 而差一天。 */
  function parseDate(value) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || '').trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    if (d.getFullYear() !== +m[1] || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[3]) return null;
    return d;
  }

  function today() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function addDays(date, days) {
    var d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }

  /* 以「天」為單位相減。先歸零到當地午夜，夏令時間才不會湊出 0.96 天。 */
  function diffDays(from, to) {
    var a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    var b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((b - a) / DAY);
  }

  function toISO(date) {
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var dd = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + mm + '-' + dd;
  }

  function formatFull(date) {
    if (lang() === 'en') {
      return date.getDate() + ' ' + MONTH_EN[date.getMonth()] + ' ' + date.getFullYear();
    }
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
  }

  function formatShort(date) {
    if (lang() === 'en') {
      return date.getDate() + ' ' + MONTH_EN[date.getMonth()].slice(0, 3);
    }
    return (date.getMonth() + 1) + '月' + date.getDate() + '日';
  }

  function weekday(date) {
    return lang() === 'en' ? WEEKDAY_EN[date.getDay()] : '星期' + WEEKDAY[date.getDay()];
  }

  /* 孕週：0 天 = 0週0天，習慣寫成「第 1 週」的那個 +1 不在這裡做。 */
  function toWeeks(days) {
    return { weeks: Math.floor(days / 7), days: days % 7 };
  }

  function formatWeeks(days) {
    var w = toWeeks(days);
    if (lang() === 'en') return w.days ? w.weeks + 'w ' + w.days + 'd' : w.weeks + 'w';
    return w.days ? w.weeks + ' 週 ' + w.days + ' 天' : w.weeks + ' 週';
  }

  /* ── 分段切換（計算方式）──
     每個 button 帶 data-method，對應一組 [data-when="方法"] 的欄位。 */
  function segmented(root, onChange) {
    var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-method]'));
    var scope = root.closest('form') || document;

    function select(method, focus) {
      buttons.forEach(function (btn) {
        var on = btn.dataset.method === method;
        btn.setAttribute('aria-checked', String(on));
        btn.tabIndex = on ? 0 : -1;
        if (on && focus) btn.focus();
      });
      scope.querySelectorAll('[data-when]').forEach(function (el) {
        var match = el.dataset.when.split(' ').indexOf(method) !== -1;
        el.hidden = !match;
        el.querySelectorAll('input,select').forEach(function (f) { f.disabled = !match; });
      });
      if (onChange) onChange(method);
    }

    function current() {
      return buttons.filter(function (b) { return b.getAttribute('aria-checked') === 'true'; })[0]
        || buttons[0];
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { select(btn.dataset.method); });
    });

    /* 左右鍵在同一組之間移動，是 radiogroup 該有的行為。 */
    root.addEventListener('keydown', function (event) {
      var step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key];
      if (!step) return;
      event.preventDefault();
      var next = (buttons.indexOf(current()) + step + buttons.length) % buttons.length;
      select(buttons[next].dataset.method, true);
    });

    select(current().dataset.method);

    return {
      value: function () { return current().dataset.method; },
      select: select
    };
  }

  /* ── 直尺：把「走了多遠」畫成一條線 ──
     ratio 是 0–1；超過 1 會夾在尾端，過期妊娠不會把記號推出畫面。 */
  function drawRuler(root, ratio) {
    var pct = Math.max(0, Math.min(1, ratio)) * 100;
    var mark = root.querySelector('.tk-ruler-mark');
    if (mark) mark.style.left = 'calc(' + pct + '% - 1px)';
  }


  /* ── 圓環：把一個週期畫成一圈，一格一天 ──
     days 是每天的相位代號，phase 決定顏色；今日那格會多一個記號。 */
  var RING_FILL = {
    period:  '#B4746A',
    fertile: '#C9AC80',
    ovulate: '#8A6F55',
    plain:   '#E4DACB'
  };

  function drawRing(svg, days, todayIndex) {
    var NS = 'http://www.w3.org/2000/svg';
    var cx = 50, cy = 50, rIn = 33, rOut = 44;
    var step = 360 / days.length;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    days.forEach(function (phase, i) {
      /* 每一格留一點縫，格數多的時候縫要窄一些，否則會碎掉。 */
      var gap = Math.min(step * 0.22, 3);
      var a1 = (-90 + i * step + gap / 2) * Math.PI / 180;
      var a2 = (-90 + (i + 1) * step - gap / 2) * Math.PI / 180;
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', [
        'M', cx + rOut * Math.cos(a1), cy + rOut * Math.sin(a1),
        'A', rOut, rOut, 0, 0, 1, cx + rOut * Math.cos(a2), cy + rOut * Math.sin(a2),
        'L', cx + rIn * Math.cos(a2), cy + rIn * Math.sin(a2),
        'A', rIn, rIn, 0, 0, 0, cx + rIn * Math.cos(a1), cy + rIn * Math.sin(a1),
        'Z'
      ].join(' '));
      path.setAttribute('fill', RING_FILL[phase] || RING_FILL.plain);
      path.setAttribute('class', 'tk-ring-day');
      svg.appendChild(path);
    });

    if (todayIndex != null && todayIndex >= 0 && todayIndex < days.length) {
      var mid = (-90 + (todayIndex + 0.5) * step) * Math.PI / 180;
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', cx + 27 * Math.cos(mid));
      dot.setAttribute('cy', cy + 27 * Math.sin(mid));
      dot.setAttribute('r', 2.6);
      dot.setAttribute('fill', '#4A4038');
      svg.appendChild(dot);
    }
  }

  /* 表單送出後把畫面捲到結果，手機上不用自己找。 */
  function revealResult(el) {
    if (!el) return;
    el.hidden = false;
    var reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var top = el.getBoundingClientRect().top + global.pageYOffset - 96;
    global.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
  }

  global.DrHuTools = {
    DAY: DAY,
    lang: lang,
    t: t,
    onLanguageChange: onLanguageChange,
    parseDate: parseDate,
    today: today,
    addDays: addDays,
    diffDays: diffDays,
    toISO: toISO,
    formatFull: formatFull,
    formatShort: formatShort,
    weekday: weekday,
    toWeeks: toWeeks,
    formatWeeks: formatWeeks,
    segmented: segmented,
    drawRuler: drawRuler,
    drawRing: drawRing,
    RING_FILL: RING_FILL,
    revealResult: revealResult
  };
})(window);
