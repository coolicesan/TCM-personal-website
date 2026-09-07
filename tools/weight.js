/* ──────────────────────────────────────────────────────────────
   孕期體重管理
   建議範圍用美國國家醫學院（IOM 2009）按孕前 BMI 分組的指引。
   曲線畫法：第一孕期（至 13 週）增 0.5–2 kg，其後線性增至 40 週的總範圍，
   所以 40 週時剛好等於 IOM 的總增重上下限，中間不會自相矛盾。

   圖表只有一個重點——她的位置。其餘（範圍帶、格線、座標）全部退為背景，
   所以顏色只分「建議範圍」與「你」，判斷結果一律由文字講。
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var T = window.DrHuTools;
  var FIRST_TRIMESTER = 13;          /* 第一孕期的界線（週） */
  var FT_LOW = 0.5, FT_HIGH = 2.0;   /* 第一孕期的建議增重（kg） */
  var TERM = 40;

  var form = document.getElementById('wtForm');
  var errorBox = document.getElementById('wtError');
  var result = document.getElementById('wtResult');
  var svg = document.getElementById('wtSvg');
  var tip = document.getElementById('wtTip');
  var NS = 'http://www.w3.org/2000/svg';

  var babies = T.segmented(document.getElementById('babiesSeg'));

  /* IOM 2009。雙胎為暫定建議，孕前過輕的雙胎未有足夠數據。 */
  var RANGES = {
    1: { under: [12.5, 18], normal: [11.5, 16], over: [7, 11.5], obese: [5, 9] },
    2: { under: null,       normal: [17, 25],   over: [14, 23],  obese: [11, 19] }
  };

  var BMI_NAME = {
    under:  { zh: '過輕', en: 'Underweight' },
    normal: { zh: '正常', en: 'Healthy weight' },
    over:   { zh: '超重', en: 'Overweight' },
    obese:  { zh: '肥胖', en: 'Obese' }
  };

  var MSG = {
    needHeight: { zh: '請填寫身高（130 至 200 厘米）。', en: 'Enter your height (130 to 200 cm).' },
    needBefore: { zh: '請填寫孕前體重（30 至 200 公斤）。', en: 'Enter your pre-pregnancy weight (30 to 200 kg).' },
    needNow:    { zh: '請填寫現時體重（30 至 200 公斤）。', en: 'Enter your current weight (30 to 200 kg).' },
    needWeek:   { zh: '請填寫現時孕週（4 至 42 週）。', en: 'Enter your current gestational age (4 to 42 weeks).' },
    twinUnder:  { zh: '孕前過輕的雙胎孕婦，IOM 未有足夠數據訂出建議範圍。請直接與你的產科醫生商量目標。',
                  en: 'For twins with a pre-pregnancy underweight BMI, the IOM has no adequate data for a range. Set a target with your obstetrician instead.' },
    lost:       { zh: '你的體重比孕前輕了 {n} 公斤。第一孕期因孕吐輕微下降很常見，但跌幅超過孕前的 5% 應該求醫。',
                  en: 'You are {n} kg lighter than before pregnancy. A small drop from nausea is common in the first trimester, but more than 5% of your pre-pregnancy weight needs medical review.' },

    gain:       { zh: '增重 {n} 公斤', en: '{n} kg gained' },
    lostTitle:  { zh: '減了 {n} 公斤', en: '{n} kg lost' },
    verdict:    { zh: '孕前 BMI {bmi}（{name}）· 第 {week} 週 · {babies}',
                  en: 'Pre-pregnancy BMI {bmi} ({name}) · week {week} · {babies}' },
    single:     { zh: '單胎', en: 'singleton' },
    twin:       { zh: '雙胎', en: 'twins' },
    targetIn:   { zh: '現時的建議範圍是 {low}–{high} 公斤，你在範圍內',
                  en: 'The range for this week is {low}–{high} kg — you are inside it' },
    targetLow:  { zh: '現時的建議範圍是 {low}–{high} 公斤，你少了 {diff} 公斤',
                  en: 'The range for this week is {low}–{high} kg — you are {diff} kg under' },
    targetHigh: { zh: '現時的建議範圍是 {low}–{high} 公斤，你多了 {diff} 公斤',
                  en: 'The range for this week is {low}–{high} kg — you are {diff} kg over' },

    keyBand:    { zh: '建議範圍', en: 'Recommended range' },
    keyBandNote:{ zh: '第 {week} 週的累積增重', en: 'Cumulative gain at week {week}' },
    keyYou:     { zh: '你', en: 'You' },
    keyYouNote: { zh: '{before} → {now} 公斤', en: '{before} → {now} kg' },
    keyTotal:   { zh: '足月時的總範圍', en: 'Total by full term' },
    keyTotalNote:{ zh: '孕前 BMI {name}，{babies}', en: '{name} BMI, {babies}' },
    keyRate:    { zh: '往後每週', en: 'Weekly from here' },
    keyRateNote:{ zh: '第 {week} 週至足月的平均幅度', en: 'Average from week {week} to term' },
    kg:         { zh: '{n} 公斤', en: '{n} kg' },
    kgRange:    { zh: '{low}–{high} 公斤', en: '{low}–{high} kg' },
    kgWeek:     { zh: '{low}–{high} 公斤', en: '{low}–{high} kg' },

    tipWeek:    { zh: '第 {n} 週', en: 'Week {n}' },
    tipRange:   { zh: '建議 {low}–{high} 公斤', en: 'Recommended {low}–{high} kg' },
    axisWeek:   { zh: '孕週', en: 'Week' },
    axisKg:     { zh: '公斤', en: 'kg' },
    bandTop:    { zh: '上限', en: 'Upper' },
    bandLow:    { zh: '下限', en: 'Lower' },

    aheadNow:   { zh: '現在到足月', en: 'Now to term' },
    aheadWeeks: { zh: '還有 {n} 週', en: '{n} weeks left' },
    aheadTerm:  { zh: '足月時', en: 'At full term' },
    aheadTermNote:{ zh: '孕前 {before} 公斤起計', en: 'from {before} kg' },
    aheadWeekly:{ zh: '每週', en: 'Each week' },
    aheadDone:  { zh: '已到 40 週', en: 'Already at 40 weeks' },
    aheadDoneNote:{ zh: '之後不再按這個範圍計', en: 'The range no longer applies' },

    asianNote:  { zh: '用亞洲人 BMI 標準（超重 23、肥胖 25）你會分類為「{name}」',
                  en: 'On Asian BMI cut-offs (overweight 23, obese 25) you would be classed as “{name}”' }
  };

  var VERDICT = {
    inRange: {
      title: { zh: '你的增重在建議範圍內', en: 'Your gain is inside the recommended range' },
      body: { zh: '繼續按目前的步調就可以。體重每星期上落一公斤以內很常見，不用每天磅，一星期同一時間磅一次已經足夠。',
              en: 'Carry on as you are. A kilo either way from week to week is normal — weighing once a week at the same time of day is enough.' }
    },
    below: {
      title: { zh: '你比建議範圍少了 {n} 公斤', en: 'You are {n} kg below the recommended range' },
      body: { zh: '增重不足與胎兒體重偏低有關。先看是不是孕吐、胃口差或胃酸倒流令你吃不下——中醫在這幾項上幫得到手，比單純叫你「多吃」實際。',
              en: 'Gaining too little is linked to lower birth weight. Look first at whether nausea, poor appetite or reflux is in the way — those are treatable, and more useful than being told to eat more.' }
    },
    above: {
      title: { zh: '你比建議範圍多了 {n} 公斤', en: 'You are {n} kg above the recommended range' },
      body: { zh: '不需要減重，孕期減重並不安全。做得到的是放慢速度：留意飲品的糖分、飯後散步，並確認妊娠糖尿測試已經安排好。',
              en: 'This is not a reason to lose weight — that is not safe in pregnancy. The workable goal is to slow the rate: watch sugar in drinks, walk after meals, and make sure your glucose test is booked.' }
    }
  };

  var TCM = {
    1: {
      title: { zh: '第一孕期的體重與不適', en: 'Weight and symptoms in the first trimester' },
      sub: { zh: '這段時間體重沒怎麼變、甚至下降都很常見，重點是孕吐與胃口，不是磅數。',
             en: 'Little change or even a small drop is common now. What matters is the nausea and your appetite, not the number.' },
      reads: [
        ['../articles/孕期/first-trimester-discomfort.html',
          { zh: '懷孕初期不適，中醫怎麼幫？', en: 'Early pregnancy discomfort and Chinese medicine' },
          { zh: '孕吐吃不下時的處理次序', en: 'What to try when nausea stops you eating' }],
        ['../services/pregnancy.html',
          { zh: '孕期及產後中醫調理', en: 'Pregnancy and postpartum care' },
          { zh: '孕期看中醫的安全考慮', en: 'Safety considerations for treatment in pregnancy' }],
        ['due-date.html',
          { zh: '預產期計算器', en: 'Due date calculator' },
          { zh: '不確定孕週時先用這個', en: 'Use this first if you are unsure of your weeks' }]
      ]
    },
    2: {
      title: { zh: '第二孕期的體重管理', en: 'Managing weight in the second trimester' },
      sub: { zh: '增重最穩定的一段。脾虛濕困的人容易水腫與增重偏快，氣血不足的則多見增重偏慢。',
             en: 'The steadiest stretch. Damp retention tends to show as swelling and faster gain; qi and blood deficiency more often as slow gain.' },
      reads: [
        ['../articles/孕期/second-trimester-discomfort.html',
          { zh: '懷孕中期（14–27 週）不適：中醫調理指南', en: 'Second trimester (14–27w) discomfort' },
          { zh: '胃灼熱、便秘與水腫的處理', en: 'Heartburn, constipation and swelling' }],
        ['../services/weight.html',
          { zh: '體重管理', en: 'Weight management' },
          { zh: '中醫怎麼看增重過快與水腫', en: 'How Chinese medicine reads rapid gain and swelling' }],
        ['../articles/孕期/hong-kong-pregnancy-care-timeline.html',
          { zh: '香港驗到有孕後怎麼辦？', en: 'A positive test in Hong Kong: what happens next' },
          { zh: '妊娠糖尿測試安排在甚麼時候', en: 'When the glucose test is scheduled' }]
      ]
    },
    3: {
      title: { zh: '第三孕期的體重管理', en: 'Managing weight in the third trimester' },
      sub: { zh: '這階段的增重有不少是水分。分清楚是正常的孕期水腫，還是需要處理的問題，比追數字重要。',
             en: 'A fair share of this stage\'s gain is fluid. Telling ordinary swelling from the kind that needs attention matters more than chasing a number.' },
      reads: [
        ['../articles/孕期/third-trimester-tcm.html',
          { zh: '懷孕後期（28–40 週）不適：中醫助你輕鬆待產', en: 'Third trimester (28–40w) discomfort' },
          { zh: '水腫、失眠與恥骨痛', en: 'Swelling, insomnia and pelvic pain' }],
        ['../services/weight.html',
          { zh: '體重管理', en: 'Weight management' },
          { zh: '產後體重的處理留待坐月之後', en: 'Postpartum weight waits until after confinement' }],
        ['postpartum.html',
          { zh: '產後 100 天調理時間表', en: 'The first 100 days after birth' },
          { zh: '生產前先看一次', en: 'Worth reading before the birth' }]
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
    if (raw === '') return null;
    var v = parseFloat(raw);
    return isNaN(v) ? null : v;
  }

  function bmiClass(bmi, cuts) {
    if (bmi < 18.5) return 'under';
    if (bmi < cuts[0]) return 'normal';
    if (bmi < cuts[1]) return 'over';
    return 'obese';
  }

  var round1 = function (n) { return Math.round(n * 10) / 10; };

  /* 第一孕期線性到 0.5–2 kg，之後線性到 40 週的總範圍。 */
  function bandAt(week, total) {
    var w = Math.max(0, Math.min(TERM, week));
    if (w <= FIRST_TRIMESTER) {
      return [FT_LOW * w / FIRST_TRIMESTER, FT_HIGH * w / FIRST_TRIMESTER];
    }
    var t = (w - FIRST_TRIMESTER) / (TERM - FIRST_TRIMESTER);
    return [FT_LOW + (total[0] - FT_LOW) * t, FT_HIGH + (total[1] - FT_HIGH) * t];
  }

  /* ── 圖表 ── */
  var PLOT = { left: 44, right: 618, top: 40, bottom: 252 };
  var chartState = null;

  function el(name, attrs, text) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text != null) node.textContent = text;
    return node;
  }

  function drawChart(total, week, gain) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var yMax = Math.ceil(Math.max(total[1], gain + 2, 4) / 2) * 2;
    var x = function (w) { return PLOT.left + (w / TERM) * (PLOT.right - PLOT.left); };
    var y = function (kg) { return PLOT.bottom - (kg / yMax) * (PLOT.bottom - PLOT.top); };
    chartState = { total: total, x: x, y: y, yMax: yMax };

    /* 格線與縱軸刻度 */
    var step = yMax > 20 ? 5 : 2;
    for (var kg = 0; kg <= yMax; kg += step) {
      svg.appendChild(el('line', { x1: PLOT.left, x2: PLOT.right, y1: y(kg), y2: y(kg),
        stroke: kg === 0 ? '#D8C3AB' : '#EFE9DC', 'stroke-width': 1 }));
      svg.appendChild(el('text', { x: PLOT.left - 8, y: y(kg) + 4, class: 'tk-axis',
        'text-anchor': 'end' }, String(kg)));
    }

    /* 建議範圍帶——背景，不是主角 */
    var lows = [], highs = [];
    for (var w = 0; w <= TERM; w++) {
      var b = bandAt(w, total);
      lows.push([x(w), y(b[0])]);
      highs.push([x(w), y(b[1])]);
    }
    var d = 'M' + highs.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') +
      ' L' + lows.slice().reverse().map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') + ' Z';
    svg.appendChild(el('path', { d: d, fill: '#F2E9D8' }));
    svg.appendChild(el('path', { fill: 'none', stroke: '#D8C3AB', 'stroke-width': 2,
      'stroke-linecap': 'round',
      d: 'M' + highs.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') }));
    svg.appendChild(el('path', { fill: 'none', stroke: '#D8C3AB', 'stroke-width': 2,
      'stroke-linecap': 'round',
      d: 'M' + lows.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') }));

    /* 帶的上下限直接標在線上，不靠顏色分辨 */
    svg.appendChild(el('text', { x: PLOT.right - 4, y: y(total[1]) - 8, class: 'tk-band-label',
      'text-anchor': 'end' }, T.t(MSG.bandTop) + ' ' + round1(total[1])));
    svg.appendChild(el('text', { x: PLOT.right - 4, y: y(total[0]) + 15, class: 'tk-band-label',
      'text-anchor': 'end' }, T.t(MSG.bandLow) + ' ' + round1(total[0])));

    /* 橫軸 */
    [0, 10, 20, 30, 40].forEach(function (w) {
      svg.appendChild(el('line', { x1: x(w), x2: x(w), y1: PLOT.bottom, y2: PLOT.bottom + 5,
        stroke: '#D8C3AB', 'stroke-width': 1 }));
      svg.appendChild(el('text', { x: x(w), y: PLOT.bottom + 20, class: 'tk-axis',
        'text-anchor': 'middle' }, String(w)));
    });
    svg.appendChild(el('text', { x: PLOT.right, y: PLOT.bottom + 38, class: 'tk-axis tk-axis--unit',
      'text-anchor': 'end' }, T.t(MSG.axisWeek)));
    svg.appendChild(el('text', { x: PLOT.left - 8, y: PLOT.top - 18, class: 'tk-axis tk-axis--unit',
      'text-anchor': 'end' }, T.t(MSG.axisKg)));

    /* 你——唯一的重點 */
    var px = x(week), py = y(Math.max(0, gain));
    svg.appendChild(el('line', { x1: px, x2: px, y1: py, y2: PLOT.bottom,
      stroke: '#A98D72', 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: .7 }));
    svg.appendChild(el('circle', { cx: px, cy: py, r: 7, fill: '#FFFDF9' }));
    svg.appendChild(el('circle', { cx: px, cy: py, r: 5, fill: '#4A4038' }));
    var label = el('text', { x: px, y: py - 14, class: 'tk-point-label', 'text-anchor': 'middle' },
      (gain >= 0 ? '+' : '') + round1(gain));
    if (px > PLOT.right - 48) { label.setAttribute('text-anchor', 'end'); label.setAttribute('x', px + 6); }
    if (px < PLOT.left + 30) { label.setAttribute('text-anchor', 'start'); label.setAttribute('x', px - 6); }
    svg.appendChild(label);

    /* 游標層 */
    svg.appendChild(el('line', { id: 'wtCross', x1: 0, x2: 0, y1: PLOT.top, y2: PLOT.bottom,
      stroke: '#8A6F55', 'stroke-width': 1, opacity: 0 }));
    svg.appendChild(el('rect', { id: 'wtHit', x: PLOT.left, y: PLOT.top,
      width: PLOT.right - PLOT.left, height: PLOT.bottom - PLOT.top, fill: 'transparent' }));
  }

  function moveTip(event) {
    if (!chartState) return;
    var rect = svg.getBoundingClientRect();
    var point = event.touches ? event.touches[0] : event;
    var vx = (point.clientX - rect.left) / rect.width * 640;
    var week = Math.round(Math.max(0, Math.min(TERM,
      (vx - PLOT.left) / (PLOT.right - PLOT.left) * TERM)));
    var b = bandAt(week, chartState.total);
    var cross = svg.querySelector('#wtCross');
    cross.setAttribute('x1', chartState.x(week));
    cross.setAttribute('x2', chartState.x(week));
    cross.setAttribute('opacity', .45);
    tip.innerHTML = '<b>' + T.t(MSG.tipWeek, { n: week }) + '</b>' +
      T.t(MSG.tipRange, { low: round1(b[0]), high: round1(b[1]) });
    tip.hidden = false;
    tip.style.left = (chartState.x(week) / 640 * rect.width) + 'px';
    tip.style.top = (chartState.y(b[1]) / 320 * rect.height - 10) + 'px';
  }

  function hideTip() {
    tip.hidden = true;
    var cross = svg.querySelector('#wtCross');
    if (cross) cross.setAttribute('opacity', 0);
  }

  svg.addEventListener('mousemove', moveTip);
  svg.addEventListener('mouseleave', hideTip);
  svg.addEventListener('touchstart', moveTip, { passive: true });
  svg.addEventListener('touchmove', moveTip, { passive: true });
  svg.addEventListener('touchend', hideTip);

  function renderKey(rows) {
    var list = document.getElementById('wtKey');
    list.innerHTML = '';
    rows.forEach(function (row) {
      var li = document.createElement('li');
      li.innerHTML =
        '<i style="' + row[0] + '"></i>' +
        '<span style="text-align:left"><b>' + row[1] + '</b><em>' + row[2] + '</em></span>' +
        '<span>' + row[3] + '</span>';
      list.appendChild(li);
    });
  }

  function calculate(scroll) {
    errorBox.hidden = true;

    var height = num('height');
    if (!(height >= 130 && height <= 200)) return showError(T.t(MSG.needHeight));
    var before = num('before');
    if (!(before >= 30 && before <= 200)) return showError(T.t(MSG.needBefore));
    var now = num('now');
    if (!(now >= 30 && now <= 200)) return showError(T.t(MSG.needNow));
    var week = num('week');
    if (!(week >= 4 && week <= 42)) return showError(T.t(MSG.needWeek));

    var count = babies.value() === '2' ? 2 : 1;
    var bmi = before / Math.pow(height / 100, 2);
    var cls = bmiClass(bmi, [25, 30]);
    var total = RANGES[count][cls];
    if (!total) return showError(T.t(MSG.twinUnder));

    var gain = now - before;
    var band = bandAt(week, total);
    var state = gain < band[0] ? 'below' : (gain > band[1] ? 'above' : 'inRange');
    var diff = state === 'below' ? band[0] - gain : (state === 'above' ? gain - band[1] : 0);

    document.getElementById('wtGain').textContent = gain >= 0
      ? T.t(MSG.gain, { n: round1(gain) })
      : T.t(MSG.lostTitle, { n: round1(-gain) });
    document.getElementById('wtVerdict').textContent = T.t(MSG.verdict, {
      bmi: round1(bmi), name: T.t(BMI_NAME[cls]), week: week,
      babies: T.t(count === 2 ? MSG.twin : MSG.single)
    });
    document.getElementById('wtTarget').textContent = T.t(
      state === 'inRange' ? MSG.targetIn : (state === 'below' ? MSG.targetLow : MSG.targetHigh),
      { low: round1(band[0]), high: round1(band[1]), diff: round1(diff) });

    drawChart(total, week, gain);

    var weeksLeft = Math.max(0, TERM - week);
    var rate = weeksLeft
      ? [(total[0] - band[0]) / weeksLeft, (total[1] - band[1]) / weeksLeft]
      : null;
    renderKey([
      ['background:#F2E9D8;border-color:#D8C3AB', T.t(MSG.keyBand),
        T.t(MSG.keyBandNote, { week: week }), T.t(MSG.kgRange, { low: round1(band[0]), high: round1(band[1]) })],
      ['background:#4A4038;border-color:#4A4038', T.t(MSG.keyYou),
        T.t(MSG.keyYouNote, { before: round1(before), now: round1(now) }),
        (gain >= 0 ? '+' : '') + round1(gain) + ' kg'],
      ['background:transparent;border:1.5px dashed #D8C3AB', T.t(MSG.keyTotal),
        T.t(MSG.keyTotalNote, { name: T.t(BMI_NAME[cls]), babies: T.t(count === 2 ? MSG.twin : MSG.single) }),
        T.t(MSG.kgRange, { low: round1(total[0]), high: round1(total[1]) })]
    ]);

    /* 亞洲人的 BMI 分界不同，分類會變的話要講清楚。 */
    var asian = bmiClass(bmi, [23, 25]);
    var flagBox = document.getElementById('wtFlag');
    flagBox.innerHTML = '';
    var copy = VERDICT[state];
    var warn = state !== 'inRange';
    var extra = '';
    if (asian !== cls) extra = ' ' + T.t(MSG.asianNote, { name: T.t(BMI_NAME[asian]) }) + '。';
    if (gain < 0) extra += ' ' + T.t(MSG.lost, { n: round1(-gain) });
    var flag = document.createElement('div');
    flag.className = 'tk-flag' + (warn ? ' tk-flag--warn' : '');
    flag.innerHTML =
      '<span class="tk-flag-icon" aria-hidden="true">' + (warn ? '！' : '✓') + '</span>' +
      '<div><h3>' + T.t(copy.title, { n: round1(diff) }) + '</h3>' +
      '<p>' + T.t(copy.body) + extra + '</p></div>';
    flagBox.appendChild(flag);

    var ahead = document.getElementById('wtAhead');
    ahead.innerHTML = '';
    if (weeksLeft) {
      [[MSG.aheadNow, T.t(MSG.aheadWeeks, { n: weeksLeft }),
        T.t(MSG.kgRange, { low: round1(total[0] - band[0]), high: round1(total[1] - band[1]) })],
       [MSG.aheadWeekly, T.t(MSG.keyRateNote, { week: week }),
        T.t(MSG.kgWeek, { low: round1(rate[0]), high: round1(rate[1]) })],
       [MSG.aheadTerm, T.t(MSG.aheadTermNote, { before: round1(before) }),
        T.t(MSG.kgRange, { low: round1(before + total[0]), high: round1(before + total[1]) })]
      ].forEach(function (row) {
        var box = document.createElement('div');
        box.innerHTML = '<p>' + T.t(row[0]) + '</p><b>' + row[2] + '</b><em>' + row[1] + '</em>';
        ahead.appendChild(box);
      });
    } else {
      var box = document.createElement('div');
      box.innerHTML = '<p>' + T.t(MSG.aheadNow) + '</p><b>' + T.t(MSG.aheadDone) + '</b>' +
        '<em>' + T.t(MSG.aheadDoneNote) + '</em>';
      ahead.appendChild(box);
    }

    var phase = week < 14 ? 1 : (week < 28 ? 2 : 3);
    var tcm = TCM[phase];
    document.getElementById('wtTcmTitle').textContent = T.t(tcm.title);
    document.getElementById('wtTcmSub').textContent = T.t(tcm.sub);
    var reads = document.getElementById('wtTcmReads');
    reads.innerHTML = '';
    tcm.reads.forEach(function (row) {
      var a = document.createElement('a');
      a.href = row[0];
      a.innerHTML = T.t(row[1]) + '<em>' + T.t(row[2]) + '</em>';
      reads.appendChild(a);
    });

    hideTip();
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
    window.setTimeout(function () { babies.select('1'); }, 0);
  });

  T.onLanguageChange(function () {
    if (!result.hidden) calculate(false);
  });
})();
