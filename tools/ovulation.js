/* ──────────────────────────────────────────────────────────────
   排卵期與易孕期
   算法：排卵約在「下次月經前 14 天」，所以要先推下次經期，再倒數。
   常見的「這次經期後第 14 天」在非 28 天週期上會錯，這裡不用那個做法。

   靜態版面的文字由 i18n.js 逐句翻譯；這裡的 T.t({zh,en}) 只負責
   JS 生出來、夾著數字或日期而無法逐句對照的句子。
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var T = window.DrHuTools;
  var LUTEAL = 14;        /* 黃體期長度，個體差異一般在 12–16 天之間 */
  var SPERM_LIFE = 5;     /* 精子在體內可存活最多約 5 天 */

  var form = document.getElementById('ovuForm');
  var errorBox = document.getElementById('ovuError');
  var result = document.getElementById('ovuResult');

  var MSG = {
    needLmp:    { zh: '請填寫最近一次月經第一天。', en: 'Enter the first day of your most recent period.' },
    badCycle:   { zh: '週期長度請填 20 至 45 之間。', en: 'Cycle length must be between 20 and 45 days.' },
    badPeriod:  { zh: '經期長度請填 1 至 10 天。', en: 'Period length must be between 1 and 10 days.' },
    periodLong: { zh: '經期長度看來比整個週期還長，請再檢查一次。',
                  en: 'That period length is longer than the cycle allows. Please check again.' },
    swapped:    { zh: '最長週期不可以短於最短週期，請再檢查一次。',
                  en: 'The longest cycle cannot be shorter than the shortest one.' },
    future:     { zh: '月經第一天不可以是未來的日期。',
                  en: 'The first day of your period cannot be in the future.' },
    tooOld:     { zh: '這個日期距今超過四個月，請填最近一次的月經第一天。',
                  en: 'That date is over four months ago. Enter your most recent period instead.' },

    windowNote: { zh: '共 {n} 天 · 最有機會受孕的是排卵前兩天至排卵日',
                  en: '{n} days · chances peak from two days before ovulation to the day itself' },
    dayOf:      { zh: '第 {n} 天', en: 'Day {n}' },
    late:       { zh: '· 月經已遲了 {n} 天', en: '· period is {n} days late' },
    cycleDay:   { zh: '週期第 {n} 天', en: 'Cycle day {n}' },
    ringToday:  { zh: '圓環上的點是今日，週期第 {n} 天',
                  en: 'The dot marks today — cycle day {n}' },
    ringPast:   { zh: '今日已超出這個週期，圓環上沒有標示',
                  en: 'Today is past the end of this cycle, so it is not marked on the ring' },
    nthCycle:   { zh: '第 {n} 個週期', en: 'Cycle {n}' },
    periodAbout:{ zh: '月經約 {date} 到', en: 'Period due around {date}' },
    keyPeriod:  { zh: '第 1–{n} 天', en: 'Days 1–{n}' },
    keyNext:    { zh: '第 {n} 天，下一圈的開始', en: 'Day {n} — the start of the next ring' },
    confirmLink:{ zh: '怎樣確認自己有排卵 →', en: 'How to confirm that you ovulate →' }
  };

  var PHASE_NAME = {
    period:    { zh: '月經期', en: 'Period' },
    fertile:   { zh: '易孕期', en: 'Fertile window' },
    ovulate:   { zh: '排卵日', en: 'Ovulation day' },
    follicular:{ zh: '卵泡期', en: 'Follicular phase' },
    luteal:    { zh: '黃體期', en: 'Luteal phase' }
  };

  var KEY_LABEL = {
    fertileNote: { zh: '排卵前 5 天至排卵日', en: 'Five days before ovulation, plus the day itself' },
    ovuNote:     { zh: '下次月經前 14 天', en: '14 days before the next period' },
    nextPeriod:  { zh: '下次月經', en: 'Next period' }
  };

  var STEADY = {
    unknown: {
      title: { zh: '沒有填週期範圍，這個結果只是一個粗略估算',
               en: 'Without your cycle range, this is only a rough estimate' },
      body: { zh: '排卵日會隨每個月的週期長短前後移動。回去填上最近半年最短與最長的週期天數，才知道這個易孕期在你身上準不準。',
              en: 'Ovulation shifts with the length of each cycle. Add your shortest and longest cycles over the past six months to find out how reliable this window is for you.' }
    },
    outOfRange: {
      title: { zh: '你的週期落在正常範圍以外，計算法不適用',
               en: 'Your cycles fall outside the normal range, so calendar counting does not apply' },
      body: { zh: '週期短於 21 天或長於 35 天，排卵時間很難用日曆推算。與其對著日期試，不如先安排檢查，找出週期不穩的原因。',
              en: 'Below 21 days or above 35, ovulation is very hard to predict from a calendar. Rather than timing by dates, arrange an assessment to find out why the cycle is unsettled.' }
    },
    swing: {
      title: { zh: '你的週期每月相差 {n} 天，這個易孕期不可靠',
               en: 'Your cycles vary by {n} days, so this window is not reliable' },
      body: { zh: '相差 8 天或以上，排卵日可以前後移動一星期，日曆推算會失準。改用排卵試紙（LH）或基礎體溫來確認當月的排卵時間會實際得多。',
              en: 'With a swing of eight days or more, ovulation can move by a week. LH strips or basal body temperature will tell you far more than a calendar.' }
    },
    mild: {
      title: { zh: '你的週期算是穩定，但仍有 {n} 天浮動',
               en: 'Your cycles are fairly steady, with {n} days of movement' },
      body: { zh: '把易孕期前後各多算兩天會較保險。想確認實際排卵日，可在易孕期開始前兩天起用排卵試紙。',
              en: 'Allow two extra days on either side of the window. To pin down the actual day, start LH strips two days before the window opens.' }
    },
    steady: {
      title: { zh: '你的週期很穩定，這個易孕期可以參考',
               en: 'Your cycles are very steady, so this window is worth working with' },
      body: { zh: '週期每月相差在 3 天以內，日曆推算的誤差不大。仍建議用排卵試紙核對一兩個週期，確認排卵確實發生。',
              en: 'With under three days of variation, calendar counting is reasonably close. Still worth checking one or two cycles with LH strips to confirm ovulation happens.' }
    }
  };

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    result.hidden = true;
  }

  function num(name) {
    var raw = form.elements[name].value;
    return raw === '' ? null : parseInt(raw, 10);
  }

  /* 週期裡每一天的相位，用來畫圓環。第 0 天 = 經期第一天。 */
  function phases(cycle, periodDays, ovuIndex) {
    var out = [];
    for (var i = 0; i < cycle; i++) {
      if (i < periodDays) out.push('period');
      else if (i === ovuIndex) out.push('ovulate');
      else if (i >= ovuIndex - SPERM_LIFE && i < ovuIndex) out.push('fertile');
      else out.push('plain');
    }
    return out;
  }

  /* 週期穩不穩定，決定這個工具的答案值不值得信。 */
  function steadiness(shortest, longest) {
    if (shortest == null || longest == null) return { level: 'unknown', copy: STEADY.unknown };
    if (longest < shortest) return { level: 'error' };
    var swing = longest - shortest;
    if (shortest < 21 || longest > 35) return { level: 'warn', copy: STEADY.outOfRange };
    if (swing >= 8) return { level: 'warn', copy: STEADY.swing, swing: swing };
    if (swing >= 4) return { level: 'ok', copy: STEADY.mild, swing: swing };
    return { level: 'ok', copy: STEADY.steady };
  }

  function renderFlag(state) {
    var box = document.getElementById('ovuFlag');
    box.innerHTML = '';
    if (!state.copy) return;
    var warn = state.level === 'warn';
    var icon = warn ? '！' : (state.level === 'unknown' ? '？' : '✓');
    var el = document.createElement('div');
    el.className = 'tk-flag' + (warn ? ' tk-flag--warn' : '');
    el.innerHTML =
      '<span class="tk-flag-icon" aria-hidden="true">' + icon + '</span>' +
      '<div><h3>' + T.t(state.copy.title, { n: state.swing }) + '</h3>' +
      '<p>' + T.t(state.copy.body, { n: state.swing }) +
      ' <a href="../articles/備孕/confirm-ovulation.html">' + T.t(MSG.confirmLink) + '</a></p></div>';
    box.appendChild(el);
  }

  function renderKey(start, cycle, periodDays, fertileFrom, ovuDate, nextPeriod) {
    var rows = [
      ['period', PHASE_NAME.period, T.t(MSG.keyPeriod, { n: periodDays }),
        T.formatShort(start) + ' – ' + T.formatShort(T.addDays(start, periodDays - 1))],
      ['fertile', PHASE_NAME.fertile, T.t(KEY_LABEL.fertileNote),
        T.formatShort(fertileFrom) + ' – ' + T.formatShort(ovuDate)],
      ['ovulate', PHASE_NAME.ovulate, T.t(KEY_LABEL.ovuNote), T.formatShort(ovuDate)],
      ['nextPeriod', KEY_LABEL.nextPeriod, T.t(MSG.keyNext, { n: cycle + 1 }), T.formatShort(nextPeriod)]
    ];
    var list = document.getElementById('ovuKey');
    list.innerHTML = '';
    rows.forEach(function (row) {
      var li = document.createElement('li');
      li.innerHTML =
        '<i style="' + (row[0] === 'nextPeriod'
          ? 'background:transparent;border:1.5px dashed ' + T.RING_FILL.period
          : 'background:' + T.RING_FILL[row[0]]) + '"></i>' +
        '<span style="text-align:left"><b>' + T.t(row[1]) + '</b><em>' + row[2] + '</em></span>' +
        '<span>' + row[3] + '</span>';
      list.appendChild(li);
    });
  }

  function renderCycles(start, cycle) {
    var box = document.getElementById('ovuCycles');
    box.innerHTML = '';
    for (var n = 1; n <= 3; n++) {
      var periodStart = T.addDays(start, cycle * n);
      var ovu = T.addDays(periodStart, cycle - LUTEAL);
      var from = T.addDays(ovu, -SPERM_LIFE);
      var el = document.createElement('div');
      el.innerHTML =
        '<p>' + T.t(MSG.nthCycle, { n: n }) + '</p>' +
        '<b>' + T.formatShort(from) + ' – ' + T.formatShort(ovu) + '</b>' +
        '<em>' + T.t(MSG.periodAbout, { date: T.formatShort(periodStart) }) + '</em>';
      box.appendChild(el);
    }
  }

  function calculate(scroll) {
    errorBox.hidden = true;

    var start = T.parseDate(form.elements.lmp.value);
    if (!start) return showError(T.t(MSG.needLmp));

    var cycle = num('cycle');
    if (!(cycle >= 20 && cycle <= 45)) return showError(T.t(MSG.badCycle));

    var periodDays = num('period');
    if (!(periodDays >= 1 && periodDays <= 10)) return showError(T.t(MSG.badPeriod));
    if (periodDays >= cycle - LUTEAL) return showError(T.t(MSG.periodLong));

    var state = steadiness(num('shortest'), num('longest'));
    if (state.level === 'error') return showError(T.t(MSG.swapped));

    var elapsed = T.diffDays(start, T.today());
    if (elapsed < 0) return showError(T.t(MSG.future));
    if (elapsed > 120) return showError(T.t(MSG.tooOld));

    var ovuIndex = cycle - LUTEAL;                       /* 由經期第一天起算的第幾天 */
    var ovuDate = T.addDays(start, ovuIndex);
    var fertileFrom = T.addDays(ovuDate, -SPERM_LIFE);
    var nextPeriod = T.addDays(start, cycle);
    var dayOfCycle = elapsed + 1;

    document.getElementById('ovuWindow').innerHTML =
      '<span class="tk-date-part">' + T.formatFull(fertileFrom) + '</span> ' +
      '<span class="tk-date-part">– ' + T.formatShort(ovuDate) + '</span>';
    document.getElementById('ovuWindowNote').textContent =
      T.t(MSG.windowNote, { n: SPERM_LIFE + 1 });

    document.getElementById('ovuToday').textContent = T.t(MSG.dayOf, { n: dayOfCycle });
    var phaseEl = document.getElementById('ovuTodayPhase');
    if (elapsed >= cycle) {
      phaseEl.textContent = T.t(MSG.late, { n: dayOfCycle - cycle });
    } else {
      var phase = phases(cycle, periodDays, ovuIndex)[elapsed];
      var name = phase === 'plain'
        ? (elapsed < ovuIndex ? PHASE_NAME.follicular : PHASE_NAME.luteal)
        : PHASE_NAME[phase];
      phaseEl.textContent = '· ' + T.t(name);
    }

    document.getElementById('ovuDay').textContent = T.formatShort(ovuDate);
    document.getElementById('ovuDayNote').textContent = T.t(MSG.cycleDay, { n: ovuIndex + 1 });

    T.drawRing(document.getElementById('ovuRing'), phases(cycle, periodDays, ovuIndex),
      elapsed < cycle ? elapsed : null);
    document.getElementById('ovuRingNote').innerHTML = elapsed < cycle
      ? '<i aria-hidden="true"></i>' + T.t(MSG.ringToday, { n: dayOfCycle })
      : T.t(MSG.ringPast);

    renderKey(start, cycle, periodDays, fertileFrom, ovuDate, nextPeriod);
    renderFlag(state);
    renderCycles(start, cycle);

    if (scroll) T.revealResult(result);
    else result.hidden = false;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    calculate(true);
  });

  form.addEventListener('reset', function () {
    errorBox.hidden = true;
    result.hidden = true;
  });

  /* 訪客中途切換語言時，已經算好的結果也要跟著換過來。 */
  T.onLanguageChange(function () {
    if (!result.hidden) calculate(false);
  });
})();
