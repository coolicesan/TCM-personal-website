// Canonical site navigation shared across every page.
(function () {
  'use strict';

  function depthPrefix() {
    var path = location.pathname;
    if (/\/articles\/[^/]+\.html$/.test(path) || /\/treatments\/[^/]+\.html$/.test(path) || /\/admin\/[^/]+\.html$/.test(path)) {
      return '../';
    }
    return '';
  }

  function link(prefix, href) {
    if (href.charAt(0) === '#') return prefix + 'index.html' + href;
    return prefix + href;
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
      { key: 'stagePeriods', zh: '月經調理', href: '女性健康問卷.html' },
      { key: 'stageGyne', zh: '婦科疾病', href: '女性健康問卷.html' },
      { key: 'stageFertility', zh: '備孕・不孕', href: '女性健康問卷.html' },
      { key: 'stagePregnancy', zh: '產前安胎', href: '女性健康問卷.html' },
      { key: 'stagePostpartum', zh: '產後月子調理', href: '女性健康問卷.html' },
      { key: 'stageMenopause', zh: '更年期調理', href: '女性健康問卷.html' },
      { key: 'stageMood', zh: '情緒健康', href: '女性健康問卷.html' },
      { key: 'stageOncology', zh: '癌症治療', href: 'treatments/treatment-oncology.html' },
      { key: 'stageInternal', zh: '內科調理', href: 'treatments/treatment-internal.html' }
    ];
    var treatmentItems = [
      { key: 'txHerbs', zh: '中藥調理', href: 'treatments/treatment-herbs.html' },
      { key: 'txAcupuncture', zh: '針灸治療', href: 'treatments/treatment-acupuncture.html' },
      { key: 'txAuricular', zh: '耳穴療法', href: 'treatments/treatment-auricular.html' },
      { key: 'txCupping', zh: '拔罐・刮痧', href: 'treatments/treatment-cupping.html' },
      { key: 'txMoxa', zh: '艾灸療法', href: 'treatments/treatment-moxa.html' },
      { key: 'txFacial', zh: '美顏針', href: 'treatments/treatment-facial.html', side: 'right' },
      { key: 'txWeight', zh: '體重管理', href: 'treatments/treatment-weight.html', side: 'right' },
      { key: 'txHairloss', zh: '脫髮治療', href: 'treatments/treatment-hairloss.html', side: 'right' },
      { key: 'txMammary', zh: '乳腺針灸', href: 'treatments/treatment-mammary.html', side: 'right' }
    ];
    return '<nav class="drhu-nav" aria-label="主要導覽">' +
      '<div class="drhu-nav-inner">' +
        '<a href="' + link(prefix, 'index.html#top') + '" class="drhu-nav-logo" data-nav="home-logo">' +
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
          '<a href="' + link(prefix, 'index.html#about') + '" data-nav-key="about">關於醫師</a>' +
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
      '.drhu-nav-logo{margin-right:auto;text-decoration:none;line-height:1.25;white-space:nowrap;}',
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
      '@media(max-width:900px){.drhu-nav-inner{padding:.76rem 1rem}.drhu-nav-links{position:absolute;top:100%;left:0;right:0;background:#FAF7F0;border-bottom:1px solid #E9E0D0;flex-direction:column;align-items:stretch;gap:0;padding:.6rem 1rem 1rem;display:none;max-height:calc(100svh - 64px);overflow:auto}.drhu-nav-links.open{display:flex}.drhu-nav-links a{padding:.78rem .25rem;border-bottom:1px solid #E9E0D0}.drhu-nav-item{position:static}.drhu-submenu,.drhu-submenu-wide{position:static;display:grid;grid-template-columns:1fr;min-width:0;transform:none;opacity:1;visibility:visible;pointer-events:auto;box-shadow:none;border:0;border-left:2px solid #E9E0D0;border-radius:0;background:transparent;padding:0 0 0 .85rem;margin:.1rem 0 .6rem}.drhu-submenu::before{display:none}.drhu-submenu a{font-size:.82rem;padding:.52rem .25rem!important;color:#74685D}.drhu-nav-cta{margin-top:.7rem;text-align:center;border-radius:8px!important}.drhu-lang-switch{margin-left:auto}.drhu-nav-toggle{display:flex}}'
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
      stagePeriods: '月經調理',
      stageGyne: '婦科疾病',
      stageFertility: '備孕・不孕',
      stagePregnancy: '產前安胎',
      stagePostpartum: '產後月子調理',
      stageMenopause: '更年期調理',
      stageMood: '情緒健康',
      stageOncology: '癌症治療',
      stageInternal: '內科調理',
      txHerbs: '中藥調理',
      txAcupuncture: '針灸治療',
      txFacial: '美顏針',
      txWeight: '體重管理',
      txHairloss: '脫髮治療',
      txMammary: '乳腺針灸',
      txAuricular: '耳穴療法',
      txCupping: '拔罐・刮痧',
      txMoxa: '艾灸療法'
    },
    en: {
      logo: 'Dr. Kate Woo',
      home: 'Home',
      stages: 'Care Focus',
      services: 'Treatments',
      assessments: 'Assessments',
      library: 'Health Library',
      about: 'About',
      booking: 'Book →',
      stagePeriods: 'Period Care',
      stageGyne: 'Gynecology',
      stageFertility: 'Fertility Support',
      stagePregnancy: 'Pregnancy Support',
      stagePostpartum: 'Postpartum Recovery',
      stageMenopause: 'Menopause Care',
      stageMood: 'Emotional Wellbeing',
      stageOncology: 'Cancer Support',
      stageInternal: 'Internal Medicine',
      txHerbs: 'Herbal Medicine',
      txAcupuncture: 'Acupuncture',
      txFacial: 'Cosmetic Acupuncture',
      txWeight: 'Weight Management',
      txHairloss: 'Hair Loss Treatment',
      txMammary: 'Breast Acupuncture',
      txAuricular: 'Auricular Therapy',
      txCupping: 'Cupping and Gua Sha',
      txMoxa: 'Moxibustion'
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
