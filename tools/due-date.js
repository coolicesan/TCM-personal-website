/* ──────────────────────────────────────────────────────────────
   預產期計算器
   四種算法最後都歸到同一個錨點：以 28 天週期回推的「等效末次經期」。
   之後所有孕週、產檢日期都由這個錨點 + 天數算出來，只有一條規則。

   靜態版面的文字由 i18n.js 逐句翻譯；這裡的 T.t({zh,en}) 只負責
   JS 生出來、夾著數字或日期而無法逐句對照的句子。
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var T = window.DrHuTools;
  var TERM = 280;           /* 40 週 0 天 */
  var RULER_DAYS = 294;     /* 直尺畫到 42 週，三個孕期剛好各佔一等分 */

  var form = document.getElementById('eddForm');
  var errorBox = document.getElementById('eddError');
  var result = document.getElementById('eddResult');
  var seg = T.segmented(document.getElementById('methodSeg'), function () { clearError(); });

  /* 香港常見的產檢安排。from / to 是由錨點起計的天數。 */
  var SCHEDULE = [
    { from: 42,  to: 56,  wk: { zh: '6–8 週', en: '6–8w' },
      name: { zh: '首次產科診症', en: 'First antenatal visit' },
      note: { zh: '確認宮內懷孕與胎心，開始建檔',
              en: 'Confirms an intrauterine pregnancy and heartbeat; your records are opened' } },
    { from: 77,  to: 97,  wk: { zh: '11–13 週', en: '11–13w' },
      name: { zh: '早期唐氏綜合症篩查', en: 'First-trimester Down syndrome screening' },
      note: { zh: '頸皮測試（NT）加血清，過了 13 週 6 天就做不到',
              en: 'Nuchal translucency plus serum; no longer possible after 13w6d' } },
    { from: 112, to: 140, wk: { zh: '16–20 週', en: '16–20w' },
      name: { zh: '中期唐氏血清篩查', en: 'Second-trimester serum screening' },
      note: { zh: '只在錯過早期篩查時安排',
              en: 'Arranged only if the first-trimester screen was missed' } },
    { from: 126, to: 154, wk: { zh: '18–22 週', en: '18–22w' },
      name: { zh: '詳細結構超聲波', en: 'Detailed anomaly scan' },
      note: { zh: '檢查器官發育，一般安排在 20 週前後',
              en: 'Checks organ development, usually around 20 weeks' } },
    { from: 168, to: 196, wk: { zh: '24–28 週', en: '24–28w' },
      name: { zh: '妊娠糖尿耐糖測試', en: 'Gestational diabetes screening (OGTT)' },
      note: { zh: '空腹抽血後飲糖水，需預留約兩小時',
              en: 'Fasting blood test then a glucose drink; allow about two hours' } },
    { from: 245, to: 259, wk: { zh: '35–37 週', en: '35–37w' },
      name: { zh: '乙型鏈球菌（GBS）拭子', en: 'Group B streptococcus (GBS) swab' },
      note: { zh: '結果影響分娩時是否需要抗生素',
              en: 'The result decides whether antibiotics are needed in labour' } },
    { from: 259, to: 259, wk: { zh: '37 週', en: '37w' },
      name: { zh: '足月', en: 'Full term' },
      note: { zh: '由這天起分娩都屬足月', en: 'From this day a birth counts as full term' } },
    { from: 280, to: 280, wk: { zh: '40 週', en: '40w' },
      name: { zh: '預產期', en: 'Due date' },
      note: { zh: '約 4% 的寶寶在這天出生', en: 'About 4% of babies arrive on this day' } },
    { from: 287, to: 287, wk: { zh: '41 週', en: '41w' },
      name: { zh: '過期妊娠評估', en: 'Post-term assessment' },
      note: { zh: '產科一般會開始討論引產', en: 'Your obstetrician will usually discuss induction' } }
  ];

  var TCM = {
    1: {
      title: { zh: '第一孕期的中醫調理', en: 'Chinese medicine in the first trimester' },
      sub: { zh: '孕吐、疲倦與安胎，是這段時間最常被問到的三件事。',
             en: 'Nausea, exhaustion and threatened miscarriage are the three questions that come up most.' },
      reads: [
        ['../articles/孕期/first-trimester-discomfort.html',
          { zh: '懷孕初期不適，中醫怎麼幫？', en: 'Early pregnancy discomfort and Chinese medicine' },
          { zh: '孕吐、疲倦、腰痠的處理次序', en: 'What to try first for nausea, fatigue and back ache' }],
        ['../articles/孕期/threatened-miscarriage-tcm.html',
          { zh: '有先兆流產跡象？中醫安胎怎麼做', en: 'Signs of threatened miscarriage' },
          { zh: '見紅、腹痛時應該先做甚麼', en: 'What to do first when there is bleeding or cramping' }],
        ['../articles/孕期/hong-kong-pregnancy-care-timeline.html',
          { zh: '香港驗到有孕後怎麼辦？', en: 'A positive test in Hong Kong: what happens next' },
          { zh: '公立與私家產檢流程的分別', en: 'How public and private antenatal care differ' }]
      ]
    },
    2: {
      title: { zh: '第二孕期的中醫調理', en: 'Chinese medicine in the second trimester' },
      sub: { zh: '不適一般在這段時間緩和，是處理睡眠、腸胃與體重的窗口。',
             en: 'Symptoms usually settle now — the window for working on sleep, digestion and weight.' },
      reads: [
        ['../articles/孕期/second-trimester-discomfort.html',
          { zh: '懷孕中期（14–27 週）不適：中醫調理指南', en: 'Second trimester (14–27w) discomfort' },
          { zh: '胃灼熱、便秘、抽筋與腰背痛', en: 'Heartburn, constipation, cramps and back pain' }],
        ['../articles/孕期/hong-kong-pregnancy-care-timeline.html',
          { zh: '香港驗到有孕後怎麼辦？', en: 'A positive test in Hong Kong: what happens next' },
          { zh: '結構超聲波與糖尿測試前後要注意甚麼', en: 'Preparing for the anomaly scan and the glucose test' }],
        ['../services/pregnancy.html',
          { zh: '孕期及產後中醫調理', en: 'Pregnancy and postpartum care' },
          { zh: '甚麼情況適合在孕期看中醫', en: 'When Chinese medicine is appropriate in pregnancy' }]
      ]
    },
    3: {
      title: { zh: '第三孕期的中醫調理', en: 'Chinese medicine in the third trimester' },
      sub: { zh: '水腫、失眠、恥骨痛與待產準備，是這段時間的重點。',
             en: 'Swelling, insomnia, pelvic pain and getting ready for labour.' },
      reads: [
        ['../articles/孕期/third-trimester-tcm.html',
          { zh: '懷孕後期（28–40 週）不適：中醫助你輕鬆待產', en: 'Third trimester (28–40w) discomfort' },
          { zh: '水腫、失眠與胎位的處理', en: 'Swelling, insomnia and the baby\'s position' }],
        ['../articles/產後/postpartum-care.html',
          { zh: '產後調理全指南：坐月、餵哺、身體恢復', en: 'The postpartum guide: confinement, feeding, recovery' },
          { zh: '生產前先看一次，坐月時不會手忙腳亂', en: 'Read it before the birth, not during confinement' }],
        ['../services/pregnancy.html',
          { zh: '孕期及產後中醫調理', en: 'Pregnancy and postpartum care' },
          { zh: '產前與產後的銜接安排', en: 'How antenatal and postpartum care join up' }]
      ]
    }
  };

  var MSG = {
    needLmp:     { zh: '請填寫末次月經第一天。', en: 'Enter the first day of your last period.' },
    badCycle:    { zh: '週期長度請填 20 至 45 之間；不確定就填 28。',
                   en: 'Cycle length must be between 20 and 45 days. Enter 28 if you are unsure.' },
    needConcept: { zh: '請填寫受孕日或排卵日。', en: 'Enter the date of conception or ovulation.' },
    needTransfer:{ zh: '請填寫胚胎植入日。', en: 'Enter the embryo transfer date.' },
    needScan:    { zh: '請填寫超聲波檢查日期。', en: 'Enter the date of the ultrasound scan.' },
    badScanWeek: { zh: '請填寫報告上的孕週（4 至 42 週）。',
                   en: 'Enter the gestational age from the report (4 to 42 weeks).' },
    badScanDay:  { zh: '孕週的「天」請填 0 至 6。', en: 'The days part must be between 0 and 6.' },
    notStarted:  { zh: '這樣算出來的懷孕還沒開始——請檢查日期是否填錯。',
                   en: 'That works out to a pregnancy that has not started yet. Please check the date.' },
    tooLate:     { zh: '這樣算出來已超過 45 週，日期看來不對，請再檢查一次。',
                   en: 'That works out to more than 45 weeks. Please check the date again.' },
    since:       { zh: '{weekday} · 距今 {days} 天', en: '{weekday} · in {days} days' },
    sincePast:   { zh: '{weekday} · {days} 天前', en: '{weekday} · {days} days ago' },
    phase:       { zh: '· 第{name}孕期', en: '· {name} trimester' }
  };

  var PHASE_NAME = [
    { zh: '一', en: 'First' },
    { zh: '二', en: 'Second' },
    { zh: '三', en: 'Third' }
  ];

  function phaseOf(days) {
    if (days < 98) return 1;
    if (days < 196) return 2;
    return 3;
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    result.hidden = true;
  }

  function clearError() {
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  function field(name) { return form.elements[name]; }
  function dateOf(name) { return T.parseDate(field(name).value); }

  /* 每種方法都回傳等效末次經期；回傳 {error} 代表輸入有問題。 */
  function anchorFor(method) {
    if (method === 'lmp') {
      var lmp = dateOf('lmp');
      if (!lmp) return { error: MSG.needLmp };
      var cycle = parseInt(field('cycle').value, 10);
      if (!(cycle >= 20 && cycle <= 45)) return { error: MSG.badCycle };
      return { date: T.addDays(lmp, cycle - 28) };
    }
    if (method === 'conception') {
      var c = dateOf('conception');
      if (!c) return { error: MSG.needConcept };
      return { date: T.addDays(c, -14) };
    }
    if (method === 'ivf') {
      var transfer = dateOf('transfer');
      if (!transfer) return { error: MSG.needTransfer };
      var embryo = parseInt(field('embryo').value, 10);
      return { date: T.addDays(transfer, -embryo - 14) };
    }
    var scan = dateOf('scanDate');
    if (!scan) return { error: MSG.needScan };
    var w = parseInt(field('scanWeeks').value, 10);
    var d = field('scanDays').value === '' ? 0 : parseInt(field('scanDays').value, 10);
    if (!(w >= 4 && w <= 42)) return { error: MSG.badScanWeek };
    if (!(d >= 0 && d <= 6)) return { error: MSG.badScanDay };
    return { date: T.addDays(scan, -(w * 7 + d)) };
  }

  /* 跨年的日子只寫「1月6日」會看不出是哪一年，所以非今年的就補上年份。 */
  function label(date) {
    if (date.getFullYear() === T.today().getFullYear()) return T.formatShort(date);
    return T.lang() === 'en'
      ? T.formatShort(date) + ' ' + date.getFullYear()
      : date.getFullYear() + '年' + T.formatShort(date);
  }

  function renderSchedule(anchor, gaDays) {
    var list = document.getElementById('eddSchedule');
    list.innerHTML = '';
    SCHEDULE.forEach(function (item) {
      var start = T.addDays(anchor, item.from);
      var end = T.addDays(anchor, item.to);
      var state = gaDays > item.to ? 'past' : (gaDays >= item.from ? 'now' : 'future');
      var when = item.from === item.to ? label(start) : label(start) + ' – ' + label(end);

      var li = document.createElement('li');
      li.dataset.state = state;
      li.innerHTML =
        '<span class="tk-sched-week">' + T.t(item.wk) + '</span>' +
        '<span class="tk-sched-name">' + T.t(item.name) + '<em>' + T.t(item.note) + '</em></span>' +
        '<span class="tk-sched-date">' + when + '</span>';
      list.appendChild(li);
    });
  }

  function renderTcm(phase) {
    var data = TCM[phase];
    document.getElementById('tcmTitle').textContent = T.t(data.title);
    document.getElementById('tcmSub').textContent = T.t(data.sub);
    var box = document.getElementById('tcmReads');
    box.innerHTML = '';
    data.reads.forEach(function (row) {
      var a = document.createElement('a');
      a.href = row[0];
      a.innerHTML = T.t(row[1]) + '<em>' + T.t(row[2]) + '</em>';
      box.appendChild(a);
    });
  }

  function calculate(scroll) {
    clearError();

    var anchor = anchorFor(seg.value());
    if (anchor.error) return showError(T.t(anchor.error));

    var gaDays = T.diffDays(anchor.date, T.today());
    if (gaDays < 0) return showError(T.t(MSG.notStarted));
    if (gaDays > 315) return showError(T.t(MSG.tooLate));

    var edd = T.addDays(anchor.date, TERM);
    var phase = phaseOf(gaDays);
    var away = T.diffDays(T.today(), edd);

    document.getElementById('eddDate').textContent = T.formatFull(edd);
    document.getElementById('eddWeekday').textContent =
      T.t(away >= 0 ? MSG.since : MSG.sincePast,
        { weekday: T.weekday(edd), days: Math.abs(away) });
    document.getElementById('gaNow').textContent = T.formatWeeks(gaDays);
    document.getElementById('gaPhase').textContent =
      T.t(MSG.phase, { name: T.t(PHASE_NAME[phase - 1]) });

    T.drawRuler(document.getElementById('eddRuler'), gaDays / RULER_DAYS);
    document.querySelectorAll('.tk-ruler-phases span').forEach(function (el) {
      el.dataset.current = String(+el.dataset.phase === phase);
    });

    renderSchedule(anchor.date, gaDays);
    renderTcm(phase);

    if (scroll) T.revealResult(result);
    else result.hidden = false;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    calculate(true);
  });

  form.addEventListener('reset', function () {
    clearError();
    result.hidden = true;
    window.setTimeout(function () { seg.select('lmp'); }, 0);
  });

  /* 訪客中途切換語言時，已經算好的結果也要跟著換過來。 */
  T.onLanguageChange(function () {
    if (!result.hidden) calculate(false);
  });
})();
