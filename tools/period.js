/* ──────────────────────────────────────────────────────────────
   經期預測與週期檢查
   有兩次或以上的經期記錄時，一律用她自己的資料算平均，不用預設的 28 天；
   只填一次時才退回表單上的平均週期，並在結果上說明這一點。
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var T = window.DrHuTools;
  var NORMAL_MIN = 21;      /* 正常週期下限 */
  var NORMAL_MAX = 35;      /* 正常週期上限 */
  var STEADY_SWING = 8;     /* 每月相差達這個天數就當作不規律 */
  var AMENORRHEA = 90;      /* 連續三個月沒有月經 */

  var form = document.getElementById('cycForm');
  var errorBox = document.getElementById('cycError');
  var result = document.getElementById('cycResult');

  var MSG = {
    needFirst: { zh: '請至少填寫最近一次月經第一天。',
                 en: 'Enter at least the first day of your most recent period.' },
    future:    { zh: '月經第一天不可以是未來的日期。',
                 en: 'The first day of a period cannot be in the future.' },
    order:     { zh: '日期次序有誤：「{later}」應該比「{earlier}」遲。請由最近一次往回填。',
                 en: 'The dates are out of order: “{later}” should be later than “{earlier}”. Fill them from the most recent backwards.' },
    tooShort:  { zh: '有兩次經期只相差 {n} 天，看來不是兩個獨立的週期，請再檢查一次。',
                 en: 'Two of the dates are only {n} days apart, which is not two separate cycles. Please check them.' },
    badCycle:  { zh: '平均週期長度請填 20 至 60 之間。', en: 'Average cycle length must be between 20 and 60 days.' },
    badPeriod: { zh: '經期長度請填 1 至 14 天。', en: 'Period length must be between 1 and 14 days.' },
    tooOld:    { zh: '最近一次月經距今超過一年，請填近期的記錄。',
                 en: 'That was over a year ago. Enter a recent record instead.' },

    days:      { zh: '{n} 天', en: '{n} days' },
    times:     { zh: '{n} 次', en: '{n}' },
    dayOf:     { zh: '第 {n} 天', en: 'Day {n}' },
    inDays:    { zh: '還有 {n} 天 · 由最近一次月經推算',
                 en: 'in {n} days · counted from your most recent period' },
    dueToday:  { zh: '就是今天 · 由最近一次月經推算', en: 'that is today · counted from your most recent period' },
    lateBy:    { zh: '已遲了 {n} 天 · 由最近一次月經推算',
                 en: '{n} days late · counted from your most recent period' },
    ringToday: { zh: '圓環上的點是今日，週期第 {n} 天', en: 'The dot marks today — cycle day {n}' },
    ringPast:  { zh: '今日已超出一個平均週期，圓環上沒有標示',
                 en: 'Today is past one average cycle, so it is not marked on the ring' },
    avgNote:   { zh: '由 {n} 次記錄計出', en: 'from {n} records' },
    avgGuess:  { zh: '你填的預設值', en: 'the value you entered' },
    nth:       { zh: '第 {n} 次', en: 'Period {n}' },
    late:      { zh: '· 月經已遲了 {n} 天', en: '· period is {n} days late' },
    phasePeriod:{ zh: '· 行經中', en: '· bleeding' },
    phaseAfter: { zh: '· 經後', en: '· after your period' }
  };

  var STAT = {
    avg:    { zh: '平均週期', en: 'Average cycle' },
    range:  { zh: '最短 / 最長', en: 'Shortest / longest' },
    swing:  { zh: '每月起伏', en: 'Month-to-month swing' },
    records:{ zh: '用了幾次記錄', en: 'Records used' }
  };

  var VERDICT = {
    single: {
      title: { zh: '只有一次記錄，這只是一個推算',
               en: 'With one record this is only a projection' },
      body: { zh: '下次經期是用你填的平均週期推出來的，不是你的實際數據。下個月月經來的時候回來補一次日期，這個工具才開始有用。',
              en: 'The next date comes from the average you typed, not from your own data. Come back and add the date when your next period arrives — that is when this starts to be useful.' }
    },
    amenorrhea: {
      title: { zh: '有一段間隔超過 {n} 天，建議先安排檢查',
               en: 'One gap is over {n} days — an assessment comes first' },
      body: { zh: '連續三個月或以上沒有月經（繼發性閉經）需要找出原因，可能與體重、壓力、甲狀腺、泌乳素或多囊卵巢有關。先做檢查，比推算下次經期實際。',
              en: 'Three months or more without a period needs a cause found — weight, stress, thyroid, prolactin or PCOS are all possibilities. Investigating comes before predicting.' }
    },
    tooShort: {
      title: { zh: '你的平均週期是 {n} 天，短於 21 天',
               en: 'Your cycles average {n} days, under 21' },
      body: { zh: '週期短於 21 天稱為月經先期或頻發月經，長期如此容易造成貧血，也可能反映黃體期偏短。建議安排檢查，找出原因再調理。',
              en: 'Cycles under 21 days can lead to anaemia over time and may reflect a short luteal phase. Worth investigating before treating.' }
    },
    tooLong: {
      title: { zh: '你的平均週期是 {n} 天，長於 35 天',
               en: 'Your cycles average {n} days, over 35' },
      body: { zh: '週期長於 35 天稱為月經後期或稀發月經，常見於多囊卵巢綜合症、甲狀腺問題或體重變化。若同時難以受孕，應先做檢查。',
              en: 'Cycles over 35 days are common in PCOS, thyroid conditions and after weight changes. If conception is also proving difficult, start with investigations.' }
    },
    irregular: {
      title: { zh: '你的週期每月相差 {n} 天，屬於不規律',
               en: 'Your cycles vary by {n} days — that counts as irregular' },
      body: { zh: '相差 8 天或以上，預測日期只能當作粗略參考。持續不規律值得找原因，中醫會由經量、經色、經前症狀與體質一併看。',
              en: 'With a swing of eight days or more, a predicted date is only a rough guide. Persistent irregularity is worth investigating; Chinese medicine reads it alongside flow, colour, premenstrual symptoms and constitution.' }
    },
    regular: {
      title: { zh: '你的週期規律，落在正常範圍內',
               en: 'Your cycles are regular and within the normal range' },
      body: { zh: '平均 {n} 天、每月起伏不大，這個預測可以放心參考。繼續記錄，日後如果有變化也看得出來。',
              en: 'An average of {n} days with little movement — this prediction is reliable. Keep recording, so any change shows up.' }
    }
  };

  var TCM = {
    tooShort: {
      sub: { zh: '週期偏短在中醫多從血熱或氣虛不能固攝去看，兩者的經量與體感並不一樣。',
             en: 'Short cycles are usually read as heat in the blood or qi failing to hold — the flow and how you feel differ between the two.' },
      reads: [
        ['../articles/備孕/menstrual-cycle.html',
          { zh: '月經週期是怎麼運作的', en: 'How the menstrual cycle works' },
          { zh: '先看清楚正常的週期應該是甚麼樣子', en: 'What a normal cycle actually looks like' }],
        ['../services/menstrual.html',
          { zh: '月經及婦科問題調理', en: 'Menstrual and gynaecological care' },
          { zh: '甚麼情況應該開始檢查', en: 'When it is time to investigate' }],
        ['../women-health-questionnaire.html',
          { zh: '女性健康評估', en: 'Women\'s health assessment' },
          { zh: '用月經健康問卷看得更全面', en: 'The menstrual health questionnaire goes further' }]
      ]
    },
    tooLong: {
      sub: { zh: '週期偏長常與腎虛、血虛或痰濕有關，也是多囊卵巢最常見的表現之一。',
             en: 'Long cycles often relate to kidney or blood deficiency, or to damp-phlegm — and are one of the commonest signs of PCOS.' },
      reads: [
        ['../articles/備孕/pcos-pmos.html',
          { zh: '多囊卵巢綜合症（PCOS）', en: 'Polycystic ovary syndrome (PCOS)' },
          { zh: '週期長、經期稀發最常見的原因', en: 'The most common reason behind long, infrequent cycles' }],
        ['../articles/備孕/menstrual-cycle.html',
          { zh: '月經週期是怎麼運作的', en: 'How the menstrual cycle works' },
          { zh: '從卵泡期到黃體期，身體在做甚麼', en: 'What the body does from follicular to luteal phase' }],
        ['../services/menstrual.html',
          { zh: '月經及婦科問題調理', en: 'Menstrual and gynaecological care' },
          { zh: '中醫調周法的思路', en: 'How cycle regulation works in Chinese medicine' }]
      ]
    },
    irregular: {
      sub: { zh: '週期時長時短，中醫多從肝鬱氣滯去理解——壓力、作息與情緒的影響會直接反映在這裡。',
             en: 'Cycles that swing are usually read as liver qi constraint: stress, sleep and mood show up here directly.' },
      reads: [
        ['../articles/備孕/menstrual-cycle.html',
          { zh: '月經週期是怎麼運作的', en: 'How the menstrual cycle works' },
          { zh: '甚麼程度的浮動仍屬正常', en: 'How much variation is still normal' }],
        ['../services/emotional.html',
          { zh: '情緒健康調理', en: 'Emotional wellbeing' },
          { zh: '壓力與週期紊亂的關係', en: 'How stress and cycle disruption connect' }],
        ['../women-health-questionnaire.html',
          { zh: '女性健康評估', en: 'Women\'s health assessment' },
          { zh: '把經量、經痛與情緒一併看', en: 'Reads flow, pain and mood together' }]
      ]
    },
    regular: {
      sub: { zh: '週期正常時，中醫會轉為看經量、經色、經痛與經前症狀——這些才是接下來的重點。',
             en: 'When the cycle itself is fine, attention moves to flow, colour, pain and premenstrual symptoms.' },
      reads: [
        ['../articles/備孕/period-pain.html',
          { zh: '經痛是體質問題還是疾病？', en: 'Period pain: constitution or condition?' },
          { zh: '甚麼樣的經痛需要檢查', en: 'Which kinds of period pain need investigating' }],
        ['../articles/備孕/menstrual-cycle.html',
          { zh: '月經週期是怎麼運作的', en: 'How the menstrual cycle works' },
          { zh: '從卵泡期到黃體期，身體在做甚麼', en: 'What the body does from follicular to luteal phase' }],
        ['../constitution.html',
          { zh: '中醫體質問卷', en: 'Constitution questionnaire' },
          { zh: '由體質看自己適合的調理方向', en: 'Find the care direction that suits your constitution' }]
      ]
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

  var FIELD_LABEL = {
    d1: { zh: '最近一次', en: 'most recent' },
    d2: { zh: '對上一次', en: 'the one before' },
    d3: { zh: '再對上一次', en: 'two before' },
    d4: { zh: '更早一次', en: 'three before' }
  };

  /* 收集填了的日期，由近到遠。中間留空不當作錯誤，直接跳過。 */
  function collectDates() {
    var out = [];
    ['d1', 'd2', 'd3', 'd4'].forEach(function (name) {
      var date = T.parseDate(form.elements[name].value);
      if (date) out.push({ name: name, date: date });
    });
    return out;
  }

  function analyse(gaps, avg, single) {
    if (single) return { level: 'note', copy: VERDICT.single, key: 'regular' };
    var longest = Math.max.apply(null, gaps);
    var shortest = Math.min.apply(null, gaps);
    if (longest >= AMENORRHEA) {
      return { level: 'warn', copy: VERDICT.amenorrhea, n: AMENORRHEA, key: 'tooLong' };
    }
    if (avg < NORMAL_MIN) return { level: 'warn', copy: VERDICT.tooShort, n: avg, key: 'tooShort' };
    if (avg > NORMAL_MAX) return { level: 'warn', copy: VERDICT.tooLong, n: avg, key: 'tooLong' };
    if (longest - shortest >= STEADY_SWING) {
      return { level: 'warn', copy: VERDICT.irregular, n: longest - shortest, key: 'irregular' };
    }
    return { level: 'ok', copy: VERDICT.regular, n: avg, key: 'regular' };
  }

  function renderStats(avg, gaps, single) {
    var list = document.getElementById('cycStats');
    list.innerHTML = '';
    var rows = [[STAT.avg, T.t(MSG.days, { n: avg }), null]];
    if (!single) {
      var lo = Math.min.apply(null, gaps), hi = Math.max.apply(null, gaps);
      rows.push([STAT.range, lo + ' / ' + hi,
        (lo < NORMAL_MIN || hi > NORMAL_MAX) ? 'warn' : null]);
      rows.push([STAT.swing, T.t(MSG.days, { n: hi - lo }),
        (hi - lo >= STEADY_SWING) ? 'warn' : null]);
      rows.push([STAT.records, T.t(MSG.times, { n: gaps.length + 1 }), null]);
    }
    rows.forEach(function (row) {
      var li = document.createElement('li');
      li.className = 'tk-stat';
      if (row[2]) li.dataset.flag = row[2];
      li.innerHTML = '<span style="text-align:left"><b>' + T.t(row[0]) + '</b></span>' +
        '<span>' + row[1] + '</span>';
      list.appendChild(li);
    });
  }

  function renderFlag(state) {
    var box = document.getElementById('cycFlag');
    box.innerHTML = '';
    var warn = state.level === 'warn';
    var icon = warn ? '！' : (state.level === 'note' ? '？' : '✓');
    var el = document.createElement('div');
    el.className = 'tk-flag' + (warn ? ' tk-flag--warn' : '');
    el.innerHTML =
      '<span class="tk-flag-icon" aria-hidden="true">' + icon + '</span>' +
      '<div><h3>' + T.t(state.copy.title, { n: state.n }) + '</h3>' +
      '<p>' + T.t(state.copy.body, { n: state.n }) + '</p></div>';
    box.appendChild(el);
  }

  function renderNextThree(last, avg) {
    var box = document.getElementById('cycNextThree');
    box.innerHTML = '';
    for (var n = 1; n <= 3; n++) {
      var date = T.addDays(last, avg * n);
      var el = document.createElement('div');
      el.innerHTML =
        '<p>' + T.t(MSG.nth, { n: n }) + '</p>' +
        '<b>' + T.formatShort(date) + '</b>' +
        '<em>' + T.weekday(date) + '</em>';
      box.appendChild(el);
    }
  }

  function renderTcm(key) {
    var data = TCM[key];
    document.getElementById('cycTcmSub').textContent = T.t(data.sub);
    var box = document.getElementById('cycTcmReads');
    box.innerHTML = '';
    data.reads.forEach(function (row) {
      var a = document.createElement('a');
      a.href = row[0];
      a.innerHTML = T.t(row[1]) + '<em>' + T.t(row[2]) + '</em>';
      box.appendChild(a);
    });
  }

  function calculate(scroll) {
    errorBox.hidden = true;

    var dates = collectDates();
    if (!dates.length) return showError(T.t(MSG.needFirst));

    var today = T.today();
    for (var i = 0; i < dates.length; i++) {
      if (T.diffDays(dates[i].date, today) < 0) return showError(T.t(MSG.future));
    }
    /* 由近到遠，所以每一個都必須比前一個早。 */
    var gaps = [];
    for (var j = 0; j < dates.length - 1; j++) {
      var gap = T.diffDays(dates[j + 1].date, dates[j].date);
      if (gap <= 0) {
        return showError(T.t(MSG.order, {
          later: T.t(FIELD_LABEL[dates[j].name]),
          earlier: T.t(FIELD_LABEL[dates[j + 1].name])
        }));
      }
      if (gap < 15) return showError(T.t(MSG.tooShort, { n: gap }));
      gaps.push(gap);
    }

    var periodDays = num('period');
    if (!(periodDays >= 1 && periodDays <= 14)) return showError(T.t(MSG.badPeriod));

    var single = gaps.length === 0;
    var avg;
    if (single) {
      avg = num('cycle');
      if (!(avg >= 20 && avg <= 60)) return showError(T.t(MSG.badCycle));
    } else {
      avg = Math.round(gaps.reduce(function (a, b) { return a + b; }, 0) / gaps.length);
    }

    var last = dates[0].date;
    var elapsed = T.diffDays(last, today);
    if (elapsed > 365) return showError(T.t(MSG.tooOld));

    var next = T.addDays(last, avg);
    var until = T.diffDays(today, next);
    var dayOfCycle = elapsed + 1;

    document.getElementById('cycNext').textContent = T.formatFull(next);
    document.getElementById('cycCountdown').textContent =
      until > 0 ? T.t(MSG.inDays, { n: until })
        : (until === 0 ? T.t(MSG.dueToday) : T.t(MSG.lateBy, { n: -until }));

    document.getElementById('cycToday').textContent = T.t(MSG.dayOf, { n: dayOfCycle });
    document.getElementById('cycPhase').textContent =
      until < 0 ? T.t(MSG.late, { n: -until })
        : (elapsed < periodDays ? T.t(MSG.phasePeriod) : T.t(MSG.phaseAfter));

    document.getElementById('cycAvg').textContent = T.t(MSG.days, { n: avg });
    document.getElementById('cycAvgNote').textContent =
      single ? T.t(MSG.avgGuess) : T.t(MSG.avgNote, { n: gaps.length + 1 });

    /* 圓環只畫經期與其餘日子——排卵不是這個工具要回答的問題。 */
    var phases = [];
    for (var k = 0; k < avg; k++) phases.push(k < periodDays ? 'period' : 'plain');
    T.drawRing(document.getElementById('cycRing'), phases, elapsed < avg ? elapsed : null);
    document.getElementById('cycRingNote').innerHTML = elapsed < avg
      ? '<i aria-hidden="true"></i>' + T.t(MSG.ringToday, { n: dayOfCycle })
      : T.t(MSG.ringPast);

    var state = analyse(gaps, avg, single);
    renderStats(avg, gaps, single);
    renderFlag(state);
    renderNextThree(last, avg);
    renderTcm(state.key);

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

  T.onLanguageChange(function () {
    if (!result.hidden) calculate(false);
  });
})();
