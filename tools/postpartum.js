/* ──────────────────────────────────────────────────────────────
   產後 100 天調理時間表
   全部日期都由分娩日 + 天數算出，直尺畫到產後 120 天。
   分娩方式與餵哺方式只決定哪幾項出現，不改變其他項目的時間。
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var T = window.DrHuTools;
  var RULER_DAYS = 120;     /* 直尺畫到產後 120 天，100 天落在 83.3% */

  var form = document.getElementById('ppForm');
  var errorBox = document.getElementById('ppError');
  var result = document.getElementById('ppResult');
  var modeSeg = T.segmented(document.getElementById('modeSeg'));

  /* 餵哺那組沒有對應的欄位要顯示隱藏，所以自己接一個簡單的切換。 */
  var feedButtons = Array.prototype.slice.call(
    document.querySelectorAll('#feedSeg [data-feed]'));
  function feedValue() {
    var on = feedButtons.filter(function (b) { return b.getAttribute('aria-checked') === 'true'; })[0];
    return (on || feedButtons[0]).dataset.feed;
  }
  function selectFeed(value, focus) {
    feedButtons.forEach(function (b) {
      var on = b.dataset.feed === value;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
  }
  feedButtons.forEach(function (b) {
    b.addEventListener('click', function () { selectFeed(b.dataset.feed); });
  });
  document.getElementById('feedSeg').addEventListener('keydown', function (event) {
    var step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key];
    if (!step) return;
    event.preventDefault();
    var at = feedButtons.map(function (b) { return b.dataset.feed; }).indexOf(feedValue());
    selectFeed(feedButtons[(at + step + feedButtons.length) % feedButtons.length].dataset.feed, true);
  });
  selectFeed('breast');

  /* only：'vaginal' / 'caesarean' / 'breast' / 'mixed' / 'formula'，
     留空代表所有情況都會出現。 */
  var SCHEDULE = [
    { from: 0, to: 2, wk: { zh: '第 1–3 天', en: 'Days 1–3' },
      name: { zh: '血性惡露', en: 'Red lochia' },
      note: { zh: '量最多、色鮮紅，需要用產褥墊；有小血塊屬正常',
              en: 'Heaviest and bright red; maternity pads needed. Small clots are normal.' } },
    { from: 0, to: 6, wk: { zh: '第 1–7 天', en: 'Days 1–7' }, only: 'caesarean',
      name: { zh: '剖腹傷口觀察', en: 'Caesarean wound care' },
      note: { zh: '保持乾爽，留意紅腫、滲液與異味；起身時先側身撐起',
              en: 'Keep it dry and watch for redness, discharge or odour. Roll to your side to get up.' } },
    { from: 1, to: 6, wk: { zh: '第 2–7 天', en: 'Days 2–7' }, only: 'vaginal',
      name: { zh: '會陰護理', en: 'Perineal care' },
      note: { zh: '每次如廁後由前往後清洗；坐下時用軟墊分散壓力',
              en: 'Rinse front to back after using the toilet; sit on a cushion to spread the pressure.' } },
    { from: 2, to: 4, wk: { zh: '第 3–5 天', en: 'Days 3–5' }, only: 'breast mixed',
      name: { zh: '脹奶高峰', en: 'Engorgement peaks' },
      note: { zh: '泌乳建立的時期，乳房會明顯脹硬；頻密餵哺比熱敷更有效',
              en: 'Milk comes in and the breasts feel hard. Frequent feeding helps more than heat.' } },
    { from: 2, to: 6, wk: { zh: '第 3–7 天', en: 'Days 3–7' },
      name: { zh: '生化湯的一般時間窗口', en: 'When Sheng Hua Tang usually applies' },
      note: { zh: '順產一般在惡露仍多時開始、服數天；剖腹或有傷口感染者未必適合，必須由中醫師評估',
              en: 'Usually started while lochia is still heavy after a vaginal birth. Not always suitable after a caesarean or with an infected wound — a practitioner must assess.' } },
    { from: 3, to: 9, wk: { zh: '第 4–10 天', en: 'Days 4–10' }, only: 'formula',
      name: { zh: '退奶期', en: 'Suppressing lactation' },
      note: { zh: '避免刺激乳房，脹痛時冷敷；不要完全不排空，以免乳腺炎',
              en: 'Avoid stimulating the breasts and use cold packs for pain. Do not let them stay completely full — mastitis follows.' } },
    { from: 4, to: 9, wk: { zh: '第 5–10 天', en: 'Days 5–10' },
      name: { zh: '惡露轉淡（漿液性）', en: 'Lochia turns pink-brown' },
      note: { zh: '由鮮紅轉為粉紅或褐色，量減少', en: 'From bright red to pink or brown, and lighter.' } },
    { from: 7, to: 13, wk: { zh: '第 8–14 天', en: 'Days 8–14' }, only: 'caesarean',
      name: { zh: '傷口覆診 / 拆線', en: 'Wound review or suture removal' },
      note: { zh: '按醫院安排；可吸收線不需拆，仍要覆診檢查',
              en: 'As arranged by your hospital. Dissolvable sutures still need a review.' } },
    { from: 14, to: 28, wk: { zh: '第 3–4 週', en: 'Weeks 3–4' },
      name: { zh: '惡露轉白或停止', en: 'Lochia turns white or stops' },
      note: { zh: '一般在產後 4 至 6 週內乾淨；超過 6 週仍有應求診',
              en: 'Usually clears within four to six weeks. Beyond six weeks, get it checked.' } },
    { from: 29, to: 29, wk: { zh: '第 30 天', en: 'Day 30' },
      name: { zh: '傳統坐月結束', en: 'End of the traditional confinement month' },
      note: { zh: '不代表身體已完全恢復，子宮復舊一般要到六週',
              en: 'Not the same as being recovered — the uterus takes about six weeks.' } },
    { from: 42, to: 42, wk: { zh: '第 6 週', en: 'Week 6' },
      name: { zh: '產後檢查', en: 'Six-week postnatal check' },
      note: { zh: '檢查子宮復舊、傷口、血壓與情緒，並討論避孕安排',
              en: 'Covers uterine involution, the wound, blood pressure, mood and contraception.' } },
    { from: 42, to: 56, wk: { zh: '第 6–8 週', en: 'Weeks 6–8' },
      name: { zh: '可開始溫和運動', en: 'Gentle exercise can start' },
      note: { zh: '產後檢查通過後由散步、伸展開始；剖腹的腹部訓練要再延後',
              en: 'Start with walking and stretching once you are cleared. Abdominal work waits longer after a caesarean.' } },
    { from: 42, to: 90, wk: { zh: '第 6–13 週', en: 'Weeks 6–13' },
      name: { zh: '骨盆底復健', en: 'Pelvic floor rehabilitation' },
      note: { zh: '漏尿、下墜感不會自己好；愈早開始練習效果愈好',
              en: 'Leaking and heaviness do not resolve on their own. The earlier you train, the better.' } },
    { from: 42, to: 120, open: true, wk: { zh: '第 6 週起', en: 'From week 6' }, only: 'breast mixed',
      name: { zh: '塞奶與乳腺炎警覺期', en: 'Watch for blocked ducts and mastitis' },
      note: { zh: '硬塊加上發燒即屬乳腺炎，需盡快處理，不要自行推揉硬推',
              en: 'A lump plus fever means mastitis and needs prompt care. Do not force-massage it.' } },
    { from: 84, to: 105, wk: { zh: '約第 100 天', en: 'Around day 100' },
      name: { zh: '一般體力恢復參考點', en: 'Where stamina usually returns' },
      note: { zh: '約產後 100 天；仍疲累、脫髮或情緒低落是常見的，值得處理',
              en: 'Around 100 days. Still tired, shedding hair or low in mood is common — and worth addressing.' } }
  ];

  var STAGES = [
    { until: 7,   key: 1,
      name: { zh: '頭 7 天', en: 'First week' },
      title: { zh: '頭一星期的中醫調理', en: 'Chinese medicine in the first week' },
      sub: { zh: '這幾天的重點是排惡露、止痛與休息，不是進補。',
             en: 'These days are about clearing lochia, easing pain and resting — not about tonics.' },
      reads: [
        ['../articles/產後/postpartum-lochia.html',
          { zh: '產後惡露多久才乾淨？', en: 'How long does lochia last?' },
          { zh: '正常的顏色與量，以及甚麼時候要求醫', en: 'Normal colour and volume, and when to seek care' }],
        ['../articles/產後/shenghua-decoction.html',
          { zh: '生化湯要不要飲？飲多久？', en: 'Sheng Hua Tang: should you take it, and for how long?' },
          { zh: '甚麼情況不適合飲', en: 'When it is not appropriate' }],
        ['../articles/產後/postpartum-care.html',
          { zh: '產後調理全指南', en: 'The complete postpartum guide' },
          { zh: '坐月、餵哺與身體恢復', en: 'Confinement, feeding and recovery' }]
      ] },
    { until: 30,  key: 2,
      name: { zh: '坐月期', en: 'Confinement' },
      title: { zh: '坐月期的中醫調理', en: 'Chinese medicine during confinement' },
      sub: { zh: '傳統禁忌有些有道理，有些沒有。分清楚，比全部照做輕鬆得多。',
             en: 'Some confinement rules have a basis and some do not. Telling them apart makes the month much easier.' },
      reads: [
        ['../articles/產後/confinement-taboos.html',
          { zh: '坐月禁忌，哪些要守哪些可以放下', en: 'Which confinement rules to keep and which to let go' },
          { zh: '洗頭、吹風、飲水的實際說法', en: 'Washing your hair, draughts and drinking water' }],
        ['../articles/產後/breastfeeding-chinese-medicine.html',
          { zh: '餵哺期間可以看中醫嗎？', en: 'Can you take Chinese medicine while breastfeeding?' },
          { zh: '哪些藥材要避開', en: 'Which herbs to avoid' }],
        ['../articles/產後/postpartum-care.html',
          { zh: '產後調理全指南', en: 'The complete postpartum guide' },
          { zh: '坐月、餵哺與身體恢復', en: 'Confinement, feeding and recovery' }]
      ] },
    { until: 42,  key: 3,
      name: { zh: '產褥期末', en: 'End of the puerperium' },
      title: { zh: '產褥期末的中醫調理', en: 'Chinese medicine at the end of the puerperium' },
      sub: { zh: '子宮差不多復舊，這時才是開始補氣血、處理疲累與脫髮的時候。',
             en: 'The uterus has largely recovered — now is when building qi and blood, and tackling fatigue and hair loss, makes sense.' },
      reads: [
        ['../articles/產後/postpartum-hair-loss.html',
          { zh: '產後脫髮甚麼時候會停？', en: 'When does postpartum hair loss stop?' },
          { zh: '哪些屬正常，哪些要檢查', en: 'What is normal and what needs checking' }],
        ['../articles/產後/caesarean-recovery.html',
          { zh: '剖腹產後的恢復與疤痕護理', en: 'Recovery and scar care after a caesarean' },
          { zh: '傷口、腹部與運動的時間安排', en: 'Timing for the wound, the abdomen and exercise' }],
        ['../services/pregnancy.html',
          { zh: '孕期及產後中醫調理', en: 'Pregnancy and postpartum care' },
          { zh: '產後甚麼時候適合開始調理', en: 'When postpartum treatment can begin' }]
      ] },
    { until: 9999, key: 4,
      name: { zh: '恢復期', en: 'Recovery' },
      title: { zh: '恢復期的中醫調理', en: 'Chinese medicine during recovery' },
      sub: { zh: '過了六週仍然疲累、脫髮、情緒低落或漏尿，都不是「捱下就過」的事。',
             en: 'Fatigue, hair loss, low mood or leaking beyond six weeks are not things to simply endure.' },
      reads: [
        ['../articles/產後/postpartum-hair-loss.html',
          { zh: '產後脫髮甚麼時候會停？', en: 'When does postpartum hair loss stop?' },
          { zh: '哪些屬正常，哪些要檢查', en: 'What is normal and what needs checking' }],
        ['../services/emotional.html',
          { zh: '情緒健康調理', en: 'Emotional wellbeing' },
          { zh: '產後情緒低落與產後抑鬱的分別', en: 'Baby blues and postnatal depression are not the same' }],
        ['../women-health-questionnaire.html',
          { zh: '女性健康評估', en: 'Women\'s health assessment' },
          { zh: '產後恢復與情緒問卷', en: 'The postpartum recovery and mood questionnaires' }]
      ] }
  ];

  var MSG = {
    needBirth: { zh: '請填寫分娩日期。', en: 'Enter the date of birth.' },
    future:    { zh: '分娩日期不可以是未來的日期。', en: 'The date of birth cannot be in the future.' },
    tooOld:    { zh: '分娩距今超過一年，這個時間表已經用不著了。恢復上仍有問題的話，直接約診會實際得多。',
                 en: 'That was over a year ago, so this timeline no longer applies. If recovery is still a problem, a consultation will help more.' },
    dayOf:     { zh: '產後第 {n} 天', en: 'Day {n} after birth' },
    weekOf:    { zh: '{date}（{weekday}）分娩 · 第 {n} 週',
                 en: 'Born {date} ({weekday}) · week {n}' },
    stage:     { zh: '目前在{name}', en: 'Currently in: {name}' },
    onwards:   { zh: '{date} 起', en: 'From {date}' },
    beyond:    { zh: '· 已超出這個時間表的範圍', en: '· past the end of this timeline' }
  };

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    result.hidden = true;
  }

  function applies(item, mode, feed) {
    if (!item.only) return true;
    return item.only.split(' ').indexOf(mode) !== -1 || item.only.split(' ').indexOf(feed) !== -1;
  }

  function stageFor(days) {
    for (var i = 0; i < STAGES.length; i++) {
      if (days < STAGES[i].until) return STAGES[i];
    }
    return STAGES[STAGES.length - 1];
  }

  function label(date, birthYear) {
    if (date.getFullYear() === birthYear) return T.formatShort(date);
    return T.lang() === 'en'
      ? T.formatShort(date) + ' ' + date.getFullYear()
      : date.getFullYear() + '年' + T.formatShort(date);
  }

  function renderSchedule(birth, days, mode, feed) {
    var list = document.getElementById('ppSchedule');
    list.innerHTML = '';
    SCHEDULE.filter(function (item) { return applies(item, mode, feed); }).forEach(function (item) {
      var start = T.addDays(birth, item.from);
      var end = T.addDays(birth, item.to);
      var state = days > item.to ? 'past' : (days >= item.from ? 'now' : 'future');
      var when = item.open
        ? T.t(MSG.onwards, { date: label(start, birth.getFullYear()) })
        : (item.from === item.to
          ? label(start, birth.getFullYear())
          : label(start, birth.getFullYear()) + ' – ' + label(end, birth.getFullYear()));

      var li = document.createElement('li');
      li.dataset.state = state;
      li.innerHTML =
        '<span class="tk-sched-week">' + T.t(item.wk) + '</span>' +
        '<span class="tk-sched-name">' + T.t(item.name) + '<em>' + T.t(item.note) + '</em></span>' +
        '<span class="tk-sched-date">' + when + '</span>';
      list.appendChild(li);
    });
  }

  function renderTcm(stage) {
    document.getElementById('ppTcmTitle').textContent = T.t(stage.title);
    document.getElementById('ppTcmSub').textContent = T.t(stage.sub);
    var box = document.getElementById('ppTcmReads');
    box.innerHTML = '';
    stage.reads.forEach(function (row) {
      var a = document.createElement('a');
      a.href = row[0];
      a.innerHTML = T.t(row[1]) + '<em>' + T.t(row[2]) + '</em>';
      box.appendChild(a);
    });
  }

  function calculate(scroll) {
    errorBox.hidden = true;

    var birth = T.parseDate(form.elements.birth.value);
    if (!birth) return showError(T.t(MSG.needBirth));

    var days = T.diffDays(birth, T.today());
    if (days < 0) return showError(T.t(MSG.future));
    if (days > 365) return showError(T.t(MSG.tooOld));

    var mode = modeSeg.value();
    var feed = feedValue();
    var stage = stageFor(days);

    document.getElementById('ppDay').textContent = T.t(MSG.dayOf, { n: days + 1 });
    document.getElementById('ppDayNote').textContent = T.t(MSG.weekOf, {
      date: T.formatFull(birth), weekday: T.weekday(birth), n: Math.floor(days / 7) + 1
    });
    document.getElementById('ppStage').textContent = T.t(MSG.stage, { name: T.t(stage.name) })
      + (days > RULER_DAYS ? ' ' + T.t(MSG.beyond) : '');

    T.drawRuler(document.getElementById('ppRuler'), days / RULER_DAYS);
    document.querySelectorAll('.tk-stages li').forEach(function (el) {
      el.dataset.current = String(+el.dataset.phase === stage.key);
    });

    renderSchedule(birth, days, mode, feed);
    renderTcm(stage);

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
    window.setTimeout(function () { modeSeg.select('vaginal'); selectFeed('breast'); }, 0);
  });

  T.onLanguageChange(function () {
    if (!result.hidden) calculate(false);
  });
})();
