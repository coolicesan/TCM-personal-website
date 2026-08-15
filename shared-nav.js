// Canonical site navigation shared across every page.
(function () {
  'use strict';

  /* 這個檔案永遠放在網站根目錄，所以用它自己的網址回推根目錄最可靠：
     不論頁面在第幾層、用 file:// 直接開啟，還是放在子目錄底下都成立。 */
  var SITE_ROOT = (function () {
    var el = document.currentScript;
    if (!el) {
      var scripts = document.querySelectorAll('script[src]');
      for (var i = scripts.length - 1; i >= 0; i--) {
        if (/shared-nav\.js(?:[?#]|$)/.test(scripts[i].getAttribute('src') || '')) { el = scripts[i]; break; }
      }
    }
    var src = el && el.src ? el.src.replace(/[?#].*$/, '') : '';
    var root = src.replace(/shared-nav\.js$/, '');
    return root && root !== src ? root : null;
  })();

  /* 萬一找不到腳本本身（理論上不會），才退回按已知資料夾推算層數。 */
  function depthPrefix() {
    if (SITE_ROOT) return SITE_ROOT;
    var path = location.pathname;
    if (/\/articles\/[^/]+\/[^/]+\.html$/.test(path)) return '../../';
    if (/\/(?:articles|treatments|services|admin)\/[^/]+\.html$/.test(path)) return '../';
    return '';
  }

  function link(prefix, href) {
    if (href.charAt(0) === '#') return prefix + 'index.html' + href;
    return prefix + href;
  }

  function ensureFavicon(prefix) {
    var iconHref = link(prefix, 'assets/logo.png?v=20260731-brown');
    [
      { rel: 'icon', type: 'image/png' },
      { rel: 'apple-touch-icon' }
    ].forEach(function (item) {
      var selector = 'link[rel="' + item.rel + '"]';
      var el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('link');
        el.rel = item.rel;
        document.head.appendChild(el);
      }
      if (item.type) el.type = item.type;
      el.href = iconHref;
    });
  }

  function submenuItems(items, prefix) {
    return items.map(function (item) {
      return '<a href="' + link(prefix, item.href) + '" data-nav-key="' + item.key + '">' + item.zh + '</a>';
    }).join('');
  }

  function treatmentSubmenuItems(items, prefix) {
    var left = items.filter(function (item) { return item.side !== 'right'; });
    var right = items.filter(function (item) { return item.side === 'right'; });
    return '<div class="drhu-submenu-col">' + submenuItems(left, prefix) + '</div>' +
      '<div class="drhu-submenu-col">' + submenuItems(right, prefix) + '</div>';
  }

  function buildNav() {
    var prefix = depthPrefix();
    var stageItems = [
      { key: 'stageMenstrual', zh: '月經及婦科問題', href: 'services/menstrual.html' },
      { key: 'stageFertility', zh: '備孕及不孕', href: 'services/fertility.html' },
      { key: 'stagePregnancy', zh: '孕期及產後', href: 'services/pregnancy.html' },
      { key: 'stageMenopause', zh: '更年期與停經後健康', href: 'services/menopause.html' },
      { key: 'stageSkin', zh: '皮膚問題', href: 'services/skin.html' },
      { key: 'stageBreast', zh: '乳房健康', href: 'services/breast.html' },
      { key: 'stageHairloss', zh: '脫髮治療', href: 'services/hairloss.html' },
      { key: 'stageWeight', zh: '體重管理', href: 'services/weight.html' },
      { key: 'stageMood', zh: '情緒健康', href: 'services/emotional.html' },
      { key: 'stageOncology', zh: '腫瘤輔助調理', href: 'treatments/treatment-oncology.html' },
      { key: 'stageInternal', zh: '內科調理', href: 'services/internal.html' }
    ];
    var treatmentItems = [
      { key: 'txAcupuncture', zh: '針灸治療', href: 'treatments/treatment-acupuncture.html' },
      { key: 'txHerbs', zh: '中藥調理', href: 'treatments/treatment-herbs.html' },
      { key: 'txAuricular', zh: '耳穴療法', href: 'treatments/treatment-auricular.html' },
      { key: 'txMoxa', zh: '艾灸療法', href: 'treatments/treatment-moxa.html', side: 'right' },
      { key: 'txCupping', zh: '拔罐・刮痧', href: 'treatments/treatment-cupping.html', side: 'right' },
      { key: 'txFacial', zh: '美顏針', href: 'treatments/treatment-facial.html', side: 'right' }
    ];
    return '<nav class="drhu-nav" aria-label="主要導覽">' +
      '<div class="drhu-nav-inner">' +
        '<a href="' + link(prefix, 'index.html#top') + '" class="drhu-nav-logo" data-nav="home-logo">' +
          '<img src="' + link(prefix, 'assets/logo.png') + '" alt="" class="drhu-logo-mark" width="52" height="52">' +
          '<span class="drhu-logo-name" data-nav-key="logo">胡佩珊中醫師</span>' +
        '</a>' +
        '<div class="drhu-nav-links" id="navLinks">' +
          '<a href="' + link(prefix, 'index.html#top') + '" data-nav-key="home">首頁</a>' +
          '<div class="drhu-nav-item has-submenu">' +
            '<a href="' + link(prefix, 'index.html#stages') + '" data-nav-key="stages" aria-haspopup="true">服務項目</a>' +
            '<div class="drhu-submenu" aria-label="服務項目子選單">' + submenuItems(stageItems, prefix) + '</div>' +
          '</div>' +
          '<div class="drhu-nav-item has-submenu">' +
            '<a href="' + link(prefix, 'index.html#services') + '" data-nav-key="services" aria-haspopup="true">治療項目</a>' +
            '<div class="drhu-submenu drhu-submenu-wide" aria-label="治療項目子選單">' + treatmentSubmenuItems(treatmentItems, prefix) + '</div>' +
          '</div>' +
          '<a href="' + link(prefix, 'index.html#assessments') + '" data-nav-key="assessments">健康評估</a>' +
          '<a href="' + link(prefix, 'articles.html') + '" data-nav-key="library">健康知識庫</a>' +
          '<a href="' + link(prefix, 'about.html') + '" data-nav-key="about">關於醫師</a>' +
          '<a href="' + link(prefix, 'index.html#contact') + '" class="drhu-nav-cta" data-nav-key="booking">預約掛號 →</a>' +
        '</div>' +
        '<div class="lang-switch drhu-lang-switch" id="langSwitch" aria-label="Language switcher">' +
          '<button type="button" data-lang="zh">繁</button><span>/</span><button type="button" data-lang="en">EN</button>' +
        '</div>' +
        '<button class="drhu-nav-toggle" id="navToggle" aria-label="開啟選單" aria-expanded="false" aria-controls="navLinks">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</nav>';
  }

  function ensureStyle() {
    if (document.getElementById('drhuSharedNavStyle')) return;
    var style = document.createElement('style');
    style.id = 'drhuSharedNavStyle';
    style.textContent = [
      '.drhu-nav{position:sticky;top:0;z-index:500;background:rgba(250,247,240,.94);backdrop-filter:blur(12px);border-bottom:1px solid #E9E0D0;font-family:"Noto Sans TC","Inter",system-ui,sans-serif;}',
      '.drhu-nav-inner{max-width:1180px;margin:0 auto;padding:.82rem clamp(1rem,3vw,2.5rem);display:flex;align-items:center;gap:1rem;position:relative;}',
      '.drhu-nav-logo{margin-right:auto;text-decoration:none;line-height:1.25;white-space:nowrap;display:inline-flex;align-items:center;gap:.6rem;}',
      '.drhu-logo-mark{width:52px;height:52px;object-fit:contain;flex:0 0 auto;}',
      '.drhu-logo-name{font-family:"Noto Serif TC",serif;font-weight:700;font-size:1.08rem;color:#4A4038;letter-spacing:.02em;}',
      '.drhu-nav-links{display:flex;align-items:center;gap:clamp(.75rem,1.8vw,1.35rem);}',
      '.drhu-nav-item{position:relative;}',
      '.drhu-nav-links a{display:block;font-size:.9rem;font-weight:500;color:#857A6E;text-decoration:none;padding:.35rem 0;border-bottom:2px solid transparent;transition:color .2s,border-color .2s,background .2s;}',
      '.drhu-nav-links a:hover,.drhu-nav-item:focus-within>a,.drhu-nav-item:hover>a{color:#8A6F55;border-color:#C9AC80;}',
      '.drhu-nav-links a[aria-current="page"]{color:#4A4038;border-color:#C9AC80;}',
      '.drhu-submenu{position:absolute;top:calc(100% + .65rem);left:50%;transform:translateX(-50%) translateY(6px);min-width:184px;padding:.55rem;background:#fffdf8;border:1px solid #E9E0D0;border-radius:8px;box-shadow:0 14px 36px rgba(74,64,56,.14);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .18s,transform .18s,visibility .18s;}',
      '.drhu-submenu::before{content:"";position:absolute;left:0;right:0;top:-.75rem;height:.75rem;}',
      '.drhu-submenu a{padding:.58rem .72rem!important;border-bottom:0!important;border-radius:6px;color:#5D5349;white-space:nowrap;font-size:.84rem;}',
      '.drhu-submenu a:hover{background:#F7F0E6;color:#8A6F55;}',
      '.has-submenu:hover .drhu-submenu,.has-submenu:focus-within .drhu-submenu{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0);}',
      '.drhu-submenu-wide{display:grid;grid-template-columns:repeat(2,minmax(140px,1fr));gap:.25rem;min-width:326px;}',
      '.drhu-submenu-col{display:flex;flex-direction:column;}',
      '.drhu-nav-cta{background:#A98D72;color:#fff!important;padding:.55rem 1.1rem!important;border-radius:999px;border-bottom:0!important;}',
      '.drhu-nav-cta:hover{background:#8A6F55!important;}',
      '.drhu-lang-switch{display:inline-flex;align-items:center;gap:.25rem;margin-left:.15rem;padding:.18rem;border:1px solid #E9E0D0;border-radius:999px;background:rgba(255,255,255,.7);color:#857A6E;font-size:.76rem;white-space:nowrap;}',
      '.drhu-lang-switch button{border:0;background:transparent;color:inherit;cursor:pointer;padding:.2rem .42rem;border-radius:999px;font-weight:700;font:inherit;}',
      '.drhu-lang-switch button.active{background:#A98D72;color:#fff;}',
      '.drhu-nav-toggle{display:none;flex-direction:column;gap:5px;background:none;border:0;cursor:pointer;padding:6px;}',
      '.drhu-nav-toggle span{width:22px;height:2px;background:#4A4038;border-radius:2px;display:block;}',
      '@media(max-width:900px){.drhu-nav-inner{padding:.66rem 1rem}.drhu-logo-mark{width:46px;height:46px}.drhu-logo-name{font-size:1rem}.drhu-nav-links{position:absolute;top:100%;left:0;right:0;background:#FAF7F0;border-bottom:1px solid #E9E0D0;flex-direction:column;align-items:stretch;gap:0;padding:.6rem 1rem 1rem;display:none;max-height:calc(100svh - 64px);overflow:auto}.drhu-nav-links.open{display:flex}.drhu-nav-links a{padding:.78rem .25rem;border-bottom:1px solid #E9E0D0}.drhu-nav-item{position:static}.drhu-submenu,.drhu-submenu-wide{position:static;display:grid;grid-template-columns:1fr;min-width:0;transform:none;opacity:1;visibility:visible;pointer-events:auto;box-shadow:none;border:0;border-left:2px solid #E9E0D0;border-radius:0;background:transparent;padding:0 0 0 .85rem;margin:.1rem 0 .6rem}.drhu-submenu::before{display:none}.drhu-submenu a{font-size:.82rem;padding:.52rem .25rem!important;color:#74685D}.drhu-nav-cta{margin-top:.7rem;text-align:center;border-radius:8px!important}.drhu-lang-switch{margin-left:auto}.drhu-nav-toggle{display:flex}}'
    ].join('');
    document.head.appendChild(style);
  }

  function updateSwitcher(lang) {
    document.querySelectorAll('#langSwitch button').forEach(function (btn) {
      var active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  var NAV_TEXT = {
    zh: {
      logo: '胡佩珊中醫師',
      home: '首頁',
      stages: '服務項目',
      services: '治療項目',
      assessments: '健康評估',
      library: '健康知識庫',
      about: '關於醫師',
      booking: '預約掛號 →',
      stageMenstrual: '月經及婦科問題',
      stageFertility: '備孕及不孕',
      stagePregnancy: '孕期及產後',
      stageMenopause: '更年期與停經後健康',
      stageSkin: '皮膚問題',
      stageBreast: '乳房健康',
      stageHairloss: '脫髮治療',
      stageWeight: '體重管理',
      stageMood: '情緒健康',
      stageOncology: '腫瘤輔助調理',
      stageInternal: '內科調理',
      txAcupuncture: '針灸治療',
      txHerbs: '中藥調理',
      txAuricular: '耳穴療法',
      txMoxa: '艾灸療法',
      txCupping: '拔罐・刮痧',
      txFacial: '美顏針'
    },
    en: {
      logo: 'CMP Kate Woo',
      home: 'Home',
      stages: 'Areas of Care',
      services: 'Treatments',
      assessments: 'Assessments',
      library: 'Health Library',
      about: 'About',
      booking: 'Book →',
      stageMenstrual: 'Menstrual & Gynaecological Care',
      stageFertility: 'Fertility Support',
      stagePregnancy: 'Pregnancy & Postpartum',
      stageMenopause: 'Menopause & Postmenopausal Health',
      stageSkin: 'Skin Concerns',
      stageBreast: 'Breast Health',
      stageHairloss: 'Hair Loss',
      stageWeight: 'Weight Management',
      stageMood: 'Emotional Wellbeing',
      stageOncology: 'Supportive Cancer Care',
      stageInternal: 'General Internal Care',
      txAcupuncture: 'Acupuncture',
      txHerbs: 'Herbal Medicine',
      txAuricular: 'Auricular Therapy',
      txMoxa: 'Moxibustion',
      txCupping: 'Cupping and Gua Sha',
      txFacial: 'Cosmetic Acupuncture'
    }
  };

  function storedLang() {
    try { return localStorage.getItem('drhu_site_lang') || 'zh'; } catch (_) { return 'zh'; }
  }

  function setStoredLang(lang) {
    try { localStorage.setItem('drhu_site_lang', lang); } catch (_) {}
  }

  function applyNavLanguage(lang) {
    lang = lang === 'en' ? 'en' : 'zh';
    document.querySelectorAll('[data-nav-key]').forEach(function (el) {
      var text = NAV_TEXT[lang][el.dataset.navKey];
      if (text) el.textContent = text;
    });
    updateSwitcher(lang);
  }

  function currentNavKey() {
    var path = decodeURIComponent(location.pathname);
    if (/\/about\.html$/.test(path)) return 'about';
    if (/\/articles\.html$/.test(path) || /\/articles\/[^/]+\.html$/.test(path) || /\/admin\/[^/]+\.html$/.test(path)) return 'library';
    if (/\/treatments\/[^/]+\.html$/.test(path)) return 'services';
    if (/\/constitution(?:-report)?\.html$/.test(path) || /\/女性健康問卷\.html$/.test(path)) return 'assessments';
    if (/\/(?:index\.html)?$/.test(path)) {
      var section = (location.hash || '#top').replace('#', '');
      if (section === 'stages') return 'stages';
      if (section === 'services') return 'services';
      if (section === 'assessments') return 'assessments';
      if (section === 'articles') return 'library';
      if (section === 'about') return 'about';
      if (section === 'contact') return 'booking';
      return 'home';
    }
    return '';
  }

  function markCurrent() {
    var key = currentNavKey();
    document.querySelectorAll('.drhu-nav-links a[aria-current="page"]').forEach(function (a) {
      a.removeAttribute('aria-current');
    });
    if (!key) return;
    var current = document.querySelector('.drhu-nav-links a[data-nav-key="' + key + '"]');
    if (current) current.setAttribute('aria-current', 'page');
  }

  function wireNav() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    var switcher = document.getElementById('langSwitch');
    if (switcher) {
      switcher.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-lang]');
        if (!btn) return;
        setStoredLang(btn.dataset.lang);
        applyNavLanguage(btn.dataset.lang);
        if (window.DrHuI18n && window.DrHuI18n.applyLanguage) window.DrHuI18n.applyLanguage(btn.dataset.lang);
      });
      var current = window.DrHuI18n && window.DrHuI18n.getLang ? window.DrHuI18n.getLang() : storedLang();
      applyNavLanguage(current);
    }
    markCurrent();
    window.addEventListener('hashchange', markCurrent);
  }

  function install() {
    ensureStyle();
    ensureFavicon(depthPrefix());
    var existing = document.querySelector('body > nav.nav, body > nav.site-nav');
    var adminTopbar = document.querySelector('body > header.topbar');
    var wrapper = document.createElement('div');
    wrapper.innerHTML = buildNav();
    var nav = wrapper.firstElementChild;

    if (existing) existing.replaceWith(nav);
    else if (adminTopbar) adminTopbar.parentNode.insertBefore(nav, adminTopbar);
    else document.body.insertBefore(nav, document.body.firstChild);

    wireNav();
    if (window.DrHuI18n && window.DrHuI18n.applyLanguage) {
      window.DrHuI18n.applyLanguage(window.DrHuI18n.getLang ? window.DrHuI18n.getLang() : 'zh');
    } else {
      applyNavLanguage(storedLang());
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
