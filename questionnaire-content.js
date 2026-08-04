/* questionnaire-content.js
   ---------------------------------------------------------------------------
   The editable-copy layer for 女性健康問卷.

   The questionnaire holds its report copy in plain data objects (SECTIONS,
   SYMPTOM_INFO, PREGNANCY_STAGES, …). This module does two things with them:

     index(src)  → a flat, ordered list of every editable string, each with a
                   stable id. The admin renders its form from this.
     apply(src)  → writes saved overrides back onto those same objects, in
                   place, before the first render.

   Ids are built only from things that never change (question id, option value,
   stage id, list position). They are never derived from the text itself, so
   rewriting a sentence in the admin cannot orphan its own override.

   Storage is localStorage, so edits live in one browser only — visitors get the
   authored text. Use 匯出備份 in the admin to move or keep them.
   --------------------------------------------------------------------------- */
(function (global) {
  'use strict';

  var KEY = 'drhu_qnaire_content_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function save(obj) {
    localStorage.setItem(KEY, JSON.stringify(obj || {}));
  }
  function clear() {
    localStorage.removeItem(KEY);
  }

  /* ---- index -------------------------------------------------------------
     Groups are the top-level tabs in the admin. `kind` drives the input type:
     'line' is a single-line input, 'para' a textarea. */
  function index(src) {
    var groups = [];
    var overrides = load();

    function group(id, zh, note) {
      var g = { id: id, zh: zh, note: note || '', items: [] };
      groups.push(g);
      return g;
    }
    function add(g, o) {
      o.current = Object.prototype.hasOwnProperty.call(overrides, o.id)
        ? overrides[o.id] : o.value;
      o.edited = o.current !== o.value;
      g.items.push(o);
    }

    /* --- 1. 建議與調理文字 --------------------------------------------- */
    var gAdvice = group('advice', '建議與調理文字',
      '每個選項觸發的建議句，以及「自己可以做」欄位的調理做法。');

    var sectionName = {};
    (src.SECTIONS || []).forEach(function (s) { sectionName[s.id] = s.zh; });

    (src.SECTIONS || []).forEach(function (sec) {
      sec.questions.forEach(function (q) {
        (q.options || []).forEach(function (o) {
          if (!o.flag) return;
          var where = sectionName[sec.id] + ' · ' + (q.shortLabel || q.zh);
          var ctx = '選項：' + o.zh;
          add(gAdvice, {
            id: 'flag/' + q.id + '/' + o.value + '/zh',
            group: 'advice', where: where, context: ctx,
            label: '建議句（中）', kind: 'para', level: o.flag.level,
            value: o.flag.zh,
          });
          add(gAdvice, {
            id: 'flag/' + q.id + '/' + o.value + '/en',
            group: 'advice', where: where, context: ctx,
            label: '建議句（英）', kind: 'para', level: o.flag.level,
            value: o.flag.en,
          });
        });
      });
    });

    Object.keys(src.SYMPTOM_INFO || {}).forEach(function (k) {
      var info = src.SYMPTOM_INFO[k];
      if (info.tip == null) return;
      add(gAdvice, {
        id: 'sym/' + k + '/tip',
        group: 'advice', where: '自己可以做', context: k,
        label: '調理做法', kind: 'para', value: info.tip,
      });
    });

    /* --- 2. 什麼情況該就醫 --------------------------------------------- */
    var gCare = group('seekcare', '什麼情況該就醫',
      '症狀的就醫門檻，以及孕期／產後的紅旗清單。這是全份報告風險最高的文字。');

    Object.keys(src.SYMPTOM_INFO || {}).forEach(function (k) {
      var info = src.SYMPTOM_INFO[k];
      if (info.watch == null) return;
      add(gCare, {
        id: 'sym/' + k + '/watch',
        group: 'seekcare', where: '就醫門檻', context: k,
        label: '什麼情況該就醫', kind: 'para', value: info.watch,
      });
    });

    (src.PREGNANCY_RED_FLAGS || []).forEach(function (t, i) {
      add(gCare, {
        id: 'redflag/preg/' + i,
        group: 'seekcare', where: '孕期紅旗', context: '第 ' + (i + 1) + ' 項',
        label: '立即就醫項目', kind: 'para', value: t,
      });
    });
    (src.POSTPARTUM_RED_FLAGS || []).forEach(function (t, i) {
      add(gCare, {
        id: 'redflag/pp/' + i,
        group: 'seekcare', where: '產後紅旗', context: '第 ' + (i + 1) + ' 項',
        label: '立即就醫項目', kind: 'para', value: t,
      });
    });
    Object.keys(src.POSTPARTUM_STAGES || {}).forEach(function (sid) {
      var st = src.POSTPARTUM_STAGES[sid];
      if (st.watch == null) return;
      add(gCare, {
        id: 'pp/' + sid + '/watch',
        group: 'seekcare', where: '產後階段提醒', context: st.label,
        label: '這個階段特別要留意', kind: 'para', value: st.watch,
      });
    });

    /* --- 3. 階段說明 ---------------------------------------------------- */
    var gStage = group('stage', '階段說明',
      '孕期三期與產後四階段的「常見變化」「身體會發生什麼」「建議記錄」。');

    Object.keys(src.PREGNANCY_STAGES || {}).forEach(function (sid) {
      var st = src.PREGNANCY_STAGES[sid];
      [['common', '這個階段常見的變化'], ['diet', '飲食建議（會出現在自己可以做）'], ['track', '建議記錄']]
        .forEach(function (pair) {
          (st[pair[0]] || []).forEach(function (t, i) {
            add(gStage, {
              id: 'preg/' + sid + '/' + pair[0] + '/' + i,
              group: 'stage', where: '孕期 · ' + st.label, context: pair[1],
              label: '第 ' + (i + 1) + ' 條', kind: 'para', value: t,
            });
          });
        });
    });

    Object.keys(src.POSTPARTUM_STAGES || {}).forEach(function (sid) {
      var st = src.POSTPARTUM_STAGES[sid];
      (st.timeline || []).forEach(function (row, i) {
        add(gStage, {
          id: 'pp/' + sid + '/timeline/' + i + '/k',
          group: 'stage', where: '產後 · ' + st.label, context: '第 ' + (i + 1) + ' 列',
          label: '項目名稱', kind: 'line', value: row.k,
        });
        add(gStage, {
          id: 'pp/' + sid + '/timeline/' + i + '/v',
          group: 'stage', where: '產後 · ' + st.label, context: '第 ' + (i + 1) + ' 列 · ' + row.k,
          label: '說明', kind: 'para', value: row.v,
        });
      });
    });

    /* --- 4. 表格參考值與開場白 ------------------------------------------ */
    var gTable = group('table', '表格參考值與開場白',
      '小抄表格的欄位名稱與正常範圍說明、症狀說明句，以及整體評估區塊的開場文字。');

    Object.keys(src.ROW_REFS || {}).forEach(function (qid) {
      var r = src.ROW_REFS[qid];
      add(gTable, {
        id: 'tref/' + qid + '/label',
        group: 'table', where: '小抄欄位', context: qid,
        label: '欄位名稱', kind: 'line', value: r.label,
      });
      add(gTable, {
        id: 'tref/' + qid + '/ref',
        group: 'table', where: '小抄欄位', context: r.label,
        label: '正常範圍說明', kind: 'para', value: r.ref,
      });
    });

    Object.keys(src.ANSWER_TABLES || {}).forEach(function (tid) {
      var t = src.ANSWER_TABLES[tid];
      add(gTable, {
        id: 'atable/' + tid + '/title',
        group: 'table', where: '小抄表格', context: tid,
        label: '表格標題', kind: 'line', value: t.title,
      });
      (t.rows || []).forEach(function (row, i) {
        add(gTable, {
          id: 'atable/' + tid + '/rows/' + i + '/label',
          group: 'table', where: '小抄表格 · ' + t.title, context: '第 ' + (i + 1) + ' 列',
          label: '欄位名稱', kind: 'line', value: row.label,
        });
        add(gTable, {
          id: 'atable/' + tid + '/rows/' + i + '/ref',
          group: 'table', where: '小抄表格 · ' + t.title, context: row.label,
          label: '正常範圍說明', kind: 'para', value: row.ref,
        });
      });
      if (t.note != null) {
        add(gTable, {
          id: 'atable/' + tid + '/note',
          group: 'table', where: '小抄表格 · ' + t.title, context: '表格附註',
          label: '附註', kind: 'para', value: t.note,
        });
      }
    });

    Object.keys(src.SYMPTOM_INFO || {}).forEach(function (k) {
      var info = src.SYMPTOM_INFO[k];
      if (info.insight == null) return;
      add(gTable, {
        id: 'sym/' + k + '/insight',
        group: 'table', where: '症狀說明', context: k,
        label: '這代表什麼', kind: 'para', value: info.insight,
      });
    });

    var OV_LABEL = {
      urgent: '有需優先處理的項目時', screen_tcm: '有檢查建議＋可調理項目時',
      screen: '只有檢查建議時', tcm: '只有可調理項目時', clear: '全部正常時',
    };
    var OV_FIELD = {
      headline: '大標', body: '內文（中）', bodyEn: '內文（英）',
      extra: '附加句', lead: '前段', tcmClause: '中段（有可調理項目時）', tail: '結尾',
    };
    Object.keys(src.OVERVIEW_COPY || {}).forEach(function (bid) {
      var b = src.OVERVIEW_COPY[bid];
      Object.keys(b).forEach(function (f) {
        if (f === 'extraIf') return;
        add(gTable, {
          id: 'ov/' + bid + '/' + f,
          group: 'table',
          where: '整體評估開場白',
          context: OV_LABEL[bid] || bid,
          label: OV_FIELD[f] || f,
          kind: 'para',
          hint: '可用代碼：{urgentCount} {screenCount} {tcmCount} {totalCount} {urgentList} {screenList} {tcmList}',
          value: b[f],
        });
      });
    });

    Object.keys(src.DOMAIN_META || {}).forEach(function (did) {
      var m = src.DOMAIN_META[did];
      if (m.clear_zh != null) {
        add(gTable, {
          id: 'domain/' + did + '/clear_zh',
          group: 'table', where: '沒有發現問題時的說明', context: did,
          label: '正常說明（中）', kind: 'para', value: m.clear_zh,
        });
      }
      if (m.clear_en != null) {
        add(gTable, {
          id: 'domain/' + did + '/clear_en',
          group: 'table', where: '沒有發現問題時的說明', context: did,
          label: '正常說明（英）', kind: 'para', value: m.clear_en,
        });
      }
    });

    return groups;
  }

  /* ---- write --------------------------------------------------------------
     Writes an id→text map onto the data objects. Anything whose target no
     longer exists (a question was removed, a list got shorter) is skipped
     silently — a stale override must never break a render.

     `apply` is the normal path. `writeAll` is exposed separately for the admin,
     which restores the pristine text first so that removing an override really
     puts the authored sentence back, rather than leaving the last edit in place. */
  function writeAll(src, map) {
    var ov = map || {};
    var ids = Object.keys(ov);
    if (!ids.length) return 0;

    var optionIndex = null;
    function findOption(qid, value) {
      if (!optionIndex) {
        optionIndex = {};
        (src.SECTIONS || []).forEach(function (sec) {
          sec.questions.forEach(function (q) {
            (q.options || []).forEach(function (o) { optionIndex[q.id + '/' + o.value] = o; });
          });
        });
      }
      return optionIndex[qid + '/' + value] || null;
    }

    var applied = 0;
    ids.forEach(function (id) {
      var v = ov[id];
      if (typeof v !== 'string') return;
      var p = id.split('/');
      var ok = false;
      try {
        if (p[0] === 'flag') {
          var o = findOption(p[1], p[2]);
          if (o && o.flag) { o.flag[p[3]] = v; ok = true; }

        } else if (p[0] === 'sym') {
          /* key may itself contain '/', so rebuild it from the middle segments */
          var field = p[p.length - 1];
          var symKey = p.slice(1, -1).join('/');
          var info = (src.SYMPTOM_INFO || {})[symKey];
          if (info) { info[field] = v; ok = true; }

        } else if (p[0] === 'redflag') {
          var list = p[1] === 'preg' ? src.PREGNANCY_RED_FLAGS : src.POSTPARTUM_RED_FLAGS;
          var i = Number(p[2]);
          if (list && i < list.length) { list[i] = v; ok = true; }

        } else if (p[0] === 'preg') {
          var ps = (src.PREGNANCY_STAGES || {})[p[1]];
          var arr = ps && ps[p[2]];
          var pi = Number(p[3]);
          if (arr && pi < arr.length) { arr[pi] = v; ok = true; }

        } else if (p[0] === 'pp') {
          var qs = (src.POSTPARTUM_STAGES || {})[p[1]];
          if (qs && p[2] === 'watch') { qs.watch = v; ok = true; }
          else if (qs && p[2] === 'timeline') {
            var row = (qs.timeline || [])[Number(p[3])];
            if (row) { row[p[4]] = v; ok = true; }
          }

        } else if (p[0] === 'tref') {
          var rr = (src.ROW_REFS || {})[p[1]];
          if (rr) { rr[p[2]] = v; ok = true; }

        } else if (p[0] === 'atable') {
          var t = (src.ANSWER_TABLES || {})[p[1]];
          if (t && p[2] === 'rows') {
            var trow = (t.rows || [])[Number(p[3])];
            if (trow) { trow[p[4]] = v; ok = true; }
          } else if (t && (p[2] === 'title' || p[2] === 'note')) { t[p[2]] = v; ok = true; }

        } else if (p[0] === 'ov') {
          var branch = (src.OVERVIEW_COPY || {})[p[1]];
          if (branch) { branch[p[2]] = v; ok = true; }

        } else if (p[0] === 'domain') {
          var dm = (src.DOMAIN_META || {})[p[1]];
          if (dm) { dm[p[2]] = v; ok = true; }
        }
      } catch (e) { ok = false; }
      if (ok) applied++;
    });
    return applied;
  }

  function apply(src) { return writeAll(src, load()); }

  /* Flattens an index into the id→text map of authored defaults, so the admin
     can put everything back exactly as written. */
  function defaults(groups) {
    var map = {};
    (groups || []).forEach(function (g) {
      g.items.forEach(function (it) { map[it.id] = it.value; });
    });
    return map;
  }

  global.QContent = {
    KEY: KEY,
    load: load, save: save, clear: clear,
    index: index, apply: apply, writeAll: writeAll, defaults: defaults,
  };
})(window);
