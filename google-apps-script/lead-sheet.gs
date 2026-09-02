/**
 * lead-sheet.gs — 把體質問卷收到的聯絡資料寫入 Google 試算表
 *
 * 這段程式碼貼在 Google 試算表的 Apps Script 編輯器裡，部署成「網頁應用程式」，
 * 再把拿到的 /exec 網址填進 lead-capture.js 的 SETUP.endpoint。
 * 部署步驟見同一個資料夾的 README.md。
 *
 * 收到一筆資料 → 加一行到試算表 → 回一句 {"ok":true}，
 * 網站那邊收到就即刻把完整報告解鎖給訪客。全程不用人手。
 */

/* ── 設定 ────────────────────────────────────────────────────────────── */

/** 資料寫入哪一張工作表。沒有的話會自動開一張。 */
var SHEET_NAME = 'Leads';

/** 想每收到一筆就有電郵通知，填你的 email；留空 = 不通知，只寫入試算表。
    Google 免費帳號每日上限 100 封，體質問卷的流量遠低於這個數。 */
var NOTIFY_EMAIL = '';

/** 通知信裡的報告連結用哪個網域（結尾不要加斜線）。 */
var SITE_ORIGIN = 'https://katewoo.com';

/**
 * 預覽密鑰：要和 lead-capture.js 的 SETUP.previewKey 一模一樣。
 * 試算表裡的報告連結會帶著它，所以你在任何裝置打開都不會被閘擋住。
 * 換密鑰的話兩邊都要改。
 */
var PREVIEW_KEY = 'ee9a93e3d2accfd5';

var HEADERS = [
  '時間', 'lead_id', '姓名', '電話', 'Email',
  '體質', '體質 slug', '語言', '同意收健康資訊', '來源', '報告連結'
];

/* ── 主要入口 ────────────────────────────────────────────────────────── */

function doPost(e) {
  /* 兩個人同時做完問卷的話，兩條執行緒會搶同一行。等最多 30 秒再寫。 */
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (_) {
    return json({ ok: false, error: 'busy' });
  }

  try {
    var p = readParams(e);
    if (!p.email && !p.name) return json({ ok: false, error: 'empty' });

    var sheet = getSheet();
    var leadId = String(p.lead_id || '');

    /* 網站送出失敗會用 no-cors 重送一次（見 lead-capture.js 的 postLead）。
       同一個 lead_id 已經在表裡，就當作成功，不要寫第二行。 */
    if (leadId && hasLeadId(sheet, leadId)) {
      return json({ ok: true, duplicate: true });
    }

    var reportUrl = buildReportUrl(p);

    sheet.appendRow([
      new Date(),
      leadId,
      p.name || '',
      p.phone || '',
      p.email || '',
      p.constitution || '',
      p.constitution_slug || '',
      p.lang || '',
      p.marketing_opt_in === 'true' ? '是' : '否',
      p.source || '',
      reportUrl
    ]);

    notify(p, reportUrl);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** 在瀏覽器直接開 /exec 網址時看到的東西，用來確認部署成功。 */
function doGet() {
  return json({ ok: true, service: 'katewoo-lead-sheet' });
}

/* ── 小工具 ──────────────────────────────────────────────────────────── */

/**
 * 試算表裡那條報告連結。網站會把訪客實際看到的那條（帶次要體質、語言、稱呼）
 * 一併送過來，用它就等於看到對方看到的同一份；沒有的話用體質類型自己組一條。
 * 連結尾的 pv=<密鑰> 是讓報告頁放行的參數，你在任何裝置打開都不會被閘擋住。
 * 這條連結等於一條後門，只適合留在你自己的試算表裡，不要公開貼出去。
 */
function buildReportUrl(p) {
  var path = String(p.report_path || '');
  /* 只接受預期中的報告連結，別把任何送進來的字串照單全收寫入表格。 */
  if (path.indexOf('constitution-report.html?') === 0) {
    return SITE_ORIGIN + '/' + path + '&pv=' + PREVIEW_KEY;
  }
  return SITE_ORIGIN + '/constitution-report.html?const='
    + encodeURIComponent(p.constitution || '') + '&pv=' + PREVIEW_KEY;
}

/** 表單欄位（正常情況）或 JSON body（日後改用其他前端時）都讀得到。 */
function readParams(e) {
  var out = {};
  if (e && e.parameter) {
    for (var k in e.parameter) out[k] = e.parameter[k];
  }
  var raw = e && e.postData && e.postData.contents;
  if (raw && raw.charAt(0) === '{') {
    try {
      var body = JSON.parse(raw);
      for (var j in body) if (out[j] === undefined) out[j] = String(body[j]);
    } catch (_) {}
  }
  return out;
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function hasLeadId(sheet, leadId) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var ids = sheet.getRange(2, 2, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === leadId) return true;
  }
  return false;
}

function notify(p, reportUrl) {
  if (!NOTIFY_EMAIL) return;
  var subject = '體質問卷新登記：' + (p.name || '（未填姓名）')
    + '（' + (p.constitution || '未知體質') + '）';
  var lines = [
    '姓名：' + (p.name || '—'),
    '電話：' + (p.phone || '—'),
    'Email：' + (p.email || '—'),
    '體質：' + (p.constitution || '—'),
    '語言：' + (p.lang === 'en' ? '英文' : '中文'),
    '同意收健康資訊：' + (p.marketing_opt_in === 'true' ? '是' : '否'),
    '',
    '對方已經在網站上看到這份報告：',
    reportUrl
  ];
  try {
    MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join('\n'));
  } catch (_) {
    /* 寄不出通知也不能拖累寫入 —— 資料已經在試算表裡了。 */
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
