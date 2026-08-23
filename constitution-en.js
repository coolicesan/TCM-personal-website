/* constitution-en.js — English language pack for the constitution questionnaire.
   ---------------------------------------------------------------------------
   Loaded by constitution-en.html BEFORE constitution.js. The questionnaire keeps
   one copy of its logic and scoring; this file only supplies the words.

   Question texts are matched by position, so the arrays here must stay the same
   length and order as `questions` / `shortQuestions` in constitution.js. A
   missing entry falls back to the Chinese text rather than breaking the page.

   The questions are written for someone who has never met Chinese medicine:
   everyday words, contractions, and the plain thing a person would notice about
   their own body — not a literal rendering of the Chinese item.

   `name` carries the English term plus a plain-English gloss for headings;
   `shortName` is the compact label used on the radar chart.
   `nameZh` is filled in by constitution.js so the report link, the analytics
   event and the practitioner's lead list all stay in Chinese.
   --------------------------------------------------------------------------- */
window.CQ_I18N = {
  lang: 'en',

  scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],

  topics: [
    { title: 'Overall wellbeing',       desc: 'Your general energy, sleep and how easily you adapt' },
    { title: 'Energy and stamina',      desc: 'How much you have in the tank day to day' },
    { title: 'Warmth and cold',         desc: 'How well you cope with cold surroundings and cold food' },
    { title: 'Dryness and heat',        desc: 'Thirst, dryness and that warm, restless feeling' },
    { title: 'Fluid balance',           desc: 'Heaviness, puffiness and how your body holds fluid' },
    { title: 'Heat and oiliness',       desc: 'Oily skin, spots and other signs of heat building up' },
    { title: 'Circulation',             desc: 'How freely your blood moves, and what your skin shows' },
    { title: 'Mood and stress',         desc: 'How you feel things and how you carry pressure' },
    { title: 'Sensitivity and allergy', desc: 'How strongly you react to things around you' },
  ],

  ui: {
    /* ── Progress rail ── */
    progressStart:      'Getting started',
    progressVersion:    'Choose a version',
    progressDone:       'Assessment complete',
    progressCount:      'Part {page} of {total} · {answered} of {pageTotal} answered',

    /* ── Name gate ── */
    nameKicker:         'Getting started',
    nameTitle:          'Tell us your name',
    nameSub:            '',
    namePlaceholder:    'e.g. Sarah, Wai Man',
    nameButton:         'Let\'s begin →',
    nameError:          'Please add your name so we can carry on 🙂',

    /* ── Version select ── */
    versionKicker:      'Getting started',
    versionTitle:       'Choose a version',
    versionSub:         'Both give you a full result. The longer one simply reads your body in more detail.',
    versionQuickName:   'Quick version',
    versionQuickStat:   '25 questions · about 5 minutes',
    versionFullName:    'Full version',
    versionFullStat:    '60 questions · about 15 minutes',
    versionBadge:       'Recommended',
    versionStart:       'Start →',
    versionStandard:    'Follows the Classification and Determination of Constitution in TCM (ZYYXH/T157-2009), China Association of Chinese Medicine',

    /* ── Question pages ── */
    pageStep:           'Part {page} of {total}',
    pageHint:            'Answer honestly for <strong>the past month</strong>',
    navPrev:            '← Back',
    navNext:            'Next →',
    navSubmit:          'See my results →',
    errorOne:           'One question on this page still needs an answer.',
    errorMany:          '{n} questions on this page still need an answer.',
    errorIncomplete:    'Some questions are still blank. Please go back and finish them.',

    /* ── Results ── */
    resultKicker:       'Your main constitution',
    resultKickerNamed:  '{name}\'s main constitution',
    balancedPure:       'Fully Balanced Type',
    balancedBasic:      'Largely Balanced Type',
    balancedNote:       'You\'re broadly in balance, with a few mild tendencies worth keeping an eye on.',
    summaryPrimary:     'Main constitution',
    summarySecondary:   'Secondary constitution',
    summaryNone:        'Nothing significant',
    summaryNoneHint:    'A fairly clear-cut picture',
    radarTitle:         'Your constitution profile',
    radarSub:           'Hover or tap to read each type. The further the shape reaches out, the stronger that tendency.',
    radarAria:          'Radar chart of your tendencies across the nine constitutions',
    aboutTitle:         'What this means',
    careTitle:          'Your care plan',
    dietGood:           '✓ Foods that suit you',
    dietAvoid:          '✕ Best to go easy on',
    secLabel:           'Secondary constitution',
    secFocus:           'Where to focus',
    secNote:            'Do mention your secondary type at your consultation, so it can be weighed up alongside the main one.',
    warning:            '⚠️ This questionnaire follows the standard TCM constitution classification. It\'s for general health guidance only and isn\'t a medical diagnosis. For a full assessment and a plan of your own, please book a consultation with a registered practitioner.',
    actionBook:         'Book with CMP Kate Woo',
    actionRestart:      'Start again',

    /* ── Tendency labels on the radar ── */
    tendPure:           'Fully balanced',
    tendBasic:          'Largely balanced',
    tendNotBalanced:    'Not balanced',
    tendMarked:         'Strong tendency',
    tendMild:           'Mild tendency',
    tendNone:           'No clear tendency',

    /* ── Report hand-off ── */
    reportReadyTitle:   'Your full report is ready',
    reportReadySub:     'Inside: food-therapy soups and recipes for {name}, tea blends, acupressure and ear points, and a guide to eating out.',
    reportOpen:         'Open my full report →',
    reportLangNote:     'The full report is currently written in Traditional Chinese.',
  },

  types: {
    balanced: {
      name: 'Balanced Type',
      shortName: 'Balanced',
      tagline: 'Yin and yang in step, energy and blood plentiful',
      description: 'Good news — the balanced type is the healthiest of the nine. In plain terms, your body runs smoothly and keeps itself in balance: good spirits, sound sleep, a healthy appetite, a fresh complexion, steady moods, and the ability to take change in your stride. You don\'t fall ill easily. What keeps you here is consistency, so the aim is to hold the habits you already have.',
      recommendations: [
        'Eat widely and in balance — grains, vegetables, fruit and protein, without cutting whole groups out',
        'Keep regular hours: in bed before 11pm, seven to eight hours a night',
        'Move three to five times a week — walking, swimming and tai chi all suit you',
        'Look after your spirits: stay social and keep up the things you enjoy',
        'Have a health check once a year and catch small problems early',
      ],
      foods: ['Wholegrains, seasonal vegetables and fruit', 'Good-quality protein (fish, eggs, beans)', 'Chinese yam, lotus seed, red dates (gentle tonics, small amounts)'],
      avoid: ['Very narrow diets (all-meat or all-raw)', 'Regular late nights, which undo the balance', 'Overwork and stress left to pile up'],
      shortQuestions: [
        'Do you feel full of energy?',
        'Do you get tired easily?',
        'Do you feel low or down?',
      ],
      questions: [
        'Do you feel full of energy?',
        'Do you get tired easily?',
        'Does your voice sound weak or quiet when you speak?',
        'Do you feel low or down?',
        'Do you struggle with the cold more than most people — winter weather, or air conditioning and fans in summer?',
        'Do you take changes in weather, surroundings and daily life in your stride?',
        'Do you have trouble falling asleep or staying asleep?',
        'Do you forget things easily?',
      ],
    },

    qiDef: {
      name: 'Qi Deficiency (Low Energy Type)',
      shortName: 'Qi Deficiency',
      tagline: 'Low Energy Type — running low on fuel, tires easily',
      description: 'Qi is the energy your body runs on, and qi deficiency is like living on a low battery. You may be tired much of the time, short of drive, quiet-voiced, quick to sweat or lose your breath after very little, and first in the queue for every cold going round. It points to low reserves overall, with the organs working below their usual strength. Care is about building energy and looking after digestion, so the battery charges back up.',
      recommendations: [
        'Don\'t push through exhaustion — regular hours and enough sleep matter most',
        'Eat energy-building food: chicken soup with astragalus, red date and longan tea, Chinese yam congee',
        'Choose gentle exercise — ba duan jin, walking, yoga — over anything that leaves you drenched',
        'Keep warm and don\'t talk yourself hoarse; both cut down how often you catch colds',
        'Moxibustion at Zusanli (ST36), Qihai (CV6) and Guanyuan (CV4) helps build your reserves',
      ],
      foods: ['Chinese yam, millet, rice, pumpkin, eggs', 'Chicken, beef, white hyacinth bean, tofu, soy milk', 'Astragalus, codonopsis, red dates, lotus seed, longan (in soups and teas)'],
      avoid: ['Raw or chilled food and iced drinks', 'Deep-fried and greasy food, raw radish (it drains your energy)', 'Strong coffee and energy drinks — borrowed energy, not new energy'],
      shortQuestions: [
        'Do you get tired easily?',
        'Do you get out of breath easily?',
        'Does your voice sound weak or quiet when you speak?',
      ],
      questions: [
        'Do you get tired easily?',
        'Do you get out of breath easily?',
        'Do you get palpitations — a racing or fluttering heart?',
        'Do you get dizzy, or light-headed when you stand up?',
        'Do you catch colds more often than most people?',
        'Do you prefer to keep quiet, and find talking an effort?',
        'Does your voice sound weak or quiet when you speak?',
        'Do you break out in a sweat after only light activity?',
      ],
    },

    yangDef: {
      name: 'Yang Deficiency (Cold-Prone Type)',
      shortName: 'Yang Deficiency',
      tagline: 'Cold-Prone Type — the inner heating runs low, and you feel it',
      description: 'Yang is your body\'s heating system. When yang is low the heating burns weakly, so the cold gets to you and your hands and feet stay chilly — where other people need one jumper, you need two. Cold food and drinks unsettle your stomach or send you to the loo, while something warm or a hot water bottle brings quick relief. Care is about warming you through and rebuilding yang, so the heating runs properly again.',
      recommendations: [
        'Keep your middle and lower back warm; a wrap or back support helps in winter',
        'Moxibustion at Guanyuan (CV4), Shenshu (BL23) and Mingmen (GV4), 10–15 minutes a day',
        'Eat warm and warming: ginger, spring onion, garlic chives, lamb',
        'Get about 30 minutes of morning sun to top yourself up',
        'Soak your feet in 40°C water for 20 minutes before bed if your hands and feet are cold',
      ],
      foods: ['Lamb, chicken, prawns, garlic chives, fresh ginger', 'Pumpkin, walnuts, chestnuts', 'Longan and lychee (in moderation)', 'Cinnamon, angelica root, eucommia, ginger and date tea'],
      avoid: ['Raw or chilled food, iced drinks, sashimi', 'Cooling vegetables (bitter melon, winter melon, white radish)', 'Watermelon, crab, mung bean and other cooling foods'],
      shortQuestions: [
        'Do your hands and feet feel cold?',
        'Do you feel the cold, and wear more layers than the people around you?',
        'Do cold food and drinks upset you, or do you avoid them?',
      ],
      questions: [
        'Do your hands and feet feel cold?',
        'Do your stomach, back, lower back or knees get cold easily?',
        'Do you feel the cold, and wear more layers than the people around you?',
        'Do you struggle with the cold more than most people — winter weather, or air conditioning and fans in summer?',
        'Do you catch colds more often than most people?',
        'Do cold food and drinks upset you, or do you avoid them?',
        'Do you tend to get diarrhoea after a chill, or after something cold to eat or drink?',
      ],
    },

    yinDef: {
      name: 'Yin Deficiency (Dry-Heat Type)',
      shortName: 'Yin Deficiency',
      tagline: 'Dry-Heat Type — running dry, with a low simmering heat',
      description: 'Yin is the moisture side of you — the water that cools and softens everything. When yin runs low you dry out and start to overheat: hot palms and soles, a dry mouth you can\'t quench, night sweats, broken sleep, a short fuse and skin on the dry side. Care is about putting the moisture back and settling that low simmering heat.',
      recommendations: [
        'Get to bed early (before 11pm) — nothing drains yin faster than late nights',
        'Eat moistening food: snow fungus and lily bulb soup, goji and chrysanthemum tea, mulberry drinks',
        'Learn to wind down; strong emotion and constant worry burn yin',
        'Choose gentler exercise such as swimming or yoga over anything that leaves you dripping',
        'Brew goji berry, ophiopogon or dendrobium as an everyday moistening tea',
      ],
      foods: ['Duck, tofu, lotus root, snow fungus, lily bulb', 'Pear, mulberry, sugar cane — they bring moisture back', 'Ophiopogon, polygonatum, dendrobium, adenophora, goji berry'],
      avoid: ['Hot, spicy, drying food (chilli, heavy ginger and garlic, lamb)', 'Deep-fried and barbecued food', 'Strong coffee, spirits, strong tea and late nights'],
      shortQuestions: [
        'Do your palms and the soles of your feet feel hot?',
        'Do your eyes feel dry or gritty?',
        'Are your mouth and throat dry, so you\'re always reaching for a drink?',
      ],
      questions: [
        'Do your palms and the soles of your feet feel hot?',
        'Do your face and body feel hot?',
        'Do you have dry skin or dry lips?',
        'Are your lips redder than most people\'s?',
        'Are you constipated, or are your stools dry and hard?',
        'Do your cheeks look flushed?',
        'Do your eyes feel dry or gritty?',
        'Are your mouth and throat dry, so you\'re always reaching for a drink?',
      ],
    },

    phlegmDamp: {
      name: 'Phlegm-Damp (Heavy and Sluggish Type)',
      shortName: 'Phlegm-Damp',
      tagline: 'Heavy and Sluggish Type — damp collecting, everything feels heavy',
      description: 'Phlegm-damp is what happens when fluid doesn\'t drain away properly: it collects, thickens and turns sticky. You may feel heavy and slow to get going, put weight on easily (especially a soft middle), get an oily face, a sticky mouth and more phlegm than most. Care is about getting you moving and clearing the damp — strengthening digestion alongside regular exercise works far better than either on its own.',
      recommendations: [
        'Thirty minutes or more of aerobic exercise a day (brisk walking, swimming, cycling) — this is the one that counts',
        'Keep meals light: less sugar, less oil, fewer refined carbohydrates',
        'Try job\'s tears and poria congee, tangerine peel tea or lotus leaf tea to help drain damp',
        'Keep your home dry and well aired, and stay out of damp rooms',
        'Weigh yourself regularly and keep an eye on blood sugar and cholesterol',
      ],
      foods: ['Job\'s tears, adzuki bean, winter melon, white hyacinth bean', 'Sweetcorn, white radish, black bean, oats', 'Tangerine peel, poria, hairy fig root, lotus leaf'],
      avoid: ['Rich, sweet, greasy food (fatty meat, fried food, pastries)', 'Sugary drinks, raw and iced food', 'Beer, and long stretches of sitting still'],
      shortQuestions: [
        'Does your body feel heavy, as though you\'re wading through the day?',
        'Is your stomach soft and full, especially around the waist?',
        'Does your mouth feel sticky?',
      ],
      questions: [
        'Does your chest feel tight, or your stomach bloated?',
        'Does your body feel heavy, as though you\'re wading through the day?',
        'Is your stomach soft and full, especially around the waist?',
        'Does your forehead get oily?',
        'Are your upper eyelids a little puffy?',
        'Does your mouth feel sticky?',
        'Do you often have phlegm, or feel it catching in your throat?',
        'Does your tongue have a thick, greasy coating?',
      ],
    },

    dampHeat: {
      name: 'Damp-Heat (Humid Heat Type)',
      shortName: 'Damp-Heat',
      tagline: 'Humid Heat Type — damp and heat together, muggy and close',
      description: 'Damp-heat is damp and heat at the same time — muggy and sticky, like the rainy season indoors. It tends to show as a shiny face, spots that keep coming back, a bitter or off taste in the mouth, sticky stools that never feel finished, a stuffy overheated feeling and a short temper. Care is about clearing the heat and draining the damp, and here what you eat and when you sleep make the biggest difference of all.',
      recommendations: [
        'Keep meals light and steer clear of spicy, fried and sweet food and alcohol',
        'Keep regular hours — late nights only stoke the heat',
        'Dandelion tea, or job\'s tears and mung bean soup, helps clear heat and damp',
        'Stay on top of personal hygiene and wear breathable cotton',
        'A practitioner can prescribe along the lines of clearing liver and gallbladder damp-heat',
      ],
      foods: ['Mung bean, adzuki bean, winter melon, bitter melon, loofah', 'Cucumber, celery, water spinach, lotus root, duck', 'Smilax, capillaris, prunella, chrysanthemum'],
      avoid: ['Spicy grills, lamb, longan and durian', 'Deep-fried and fatty food', 'Alcohol, very sweet food, and late nights'],
      shortQuestions: [
        'Does your face or nose feel greasy, or look shiny?',
        'Do you break out in spots or boils easily?',
        'Do you get a bitter or unpleasant taste in your mouth?',
      ],
      questions: [
        'Does your face or nose feel greasy, or look shiny?',
        'Do you break out in spots or boils easily?',
        'Do you get a bitter or unpleasant taste in your mouth?',
        'Are your stools sticky, so you never quite feel finished?',
        'Does it burn when you pass urine, or is your urine dark?',
        'Women: is your discharge yellowish? Men: does the scrotal area feel damp?',
      ],
    },

    bloodStasis: {
      name: 'Blood Stasis (Sluggish Circulation Type)',
      shortName: 'Blood Stasis',
      tagline: 'Sluggish Circulation Type — blood moving slowly, and it shows',
      description: 'Blood stasis is congestion on your body\'s roads — the blood moves, but sluggishly. Your skin may look dull, with dark circles, pigment patches that appear easily and lips on the dark side, and there\'s often one spot that aches or stabs in the same place. All of it points to flow that isn\'t clear. Care is about getting the blood moving again; keeping active and keeping warm both help more than you\'d expect.',
      recommendations: [
        'Exercise regularly (brisk walking, dance, tai chi) to keep the blood moving',
        'Keep your mood light — feelings kept in make stasis worse',
        'Try hawthorn and rose tea, or black chicken soup with angelica and notoginseng',
        'Don\'t sit or stand for hours; get up and move at intervals',
        'Stay warm — cold thickens the blood and slows it further',
      ],
      foods: ['Black fungus, onion, hawthorn, black bean', 'Choy sum, carrot, aubergine, shiitake', 'Rose bud, angelica root, notoginseng, salvia (some need practitioner guidance)'],
      avoid: ['Raw and iced food — cold congeals the blood', 'Rich, fried food and sweets', 'Sharp, astringent foods such as dark plum and persimmon'],
      shortQuestions: [
        'Does your skin look dull, or do brown patches appear easily?',
        'Do you get dark circles under your eyes?',
        'Do your lips look dark or dusky?',
      ],
      questions: [
        'Do you bruise without remembering any knock?',
        'Do you have fine red thread veins on your cheeks?',
        'Do you get pain anywhere in your body?',
        'Does your skin look dull, or do brown patches appear easily?',
        'Do you get dark circles under your eyes?',
        'Do you forget things easily?',
        'Do your lips look dark or dusky?',
      ],
    },

    qiStag: {
      name: 'Qi Stagnation (Stress-Sensitive Type)',
      shortName: 'Qi Stagnation',
      tagline: 'Stress-Sensitive Type — energy held up, feelings held in',
      description: 'Of the nine, this is the type most tied to how you feel — energy that has got stuck. You might feel low or tight in the chest, catch yourself sighing, turn things over and over, and take things to heart; sometimes there\'s a lump in the throat that won\'t swallow away. It shows itself most when you\'re under pressure, or when something has gone unsaid for a long time. Care is about letting feeling move again, and relaxation and exercise do more here than any herb on its own.',
      recommendations: [
        'Get outdoors often: a walk, a hike, an hour by the sea',
        'Practise slow breathing or mindfulness to help yourself unwind',
        'Rose bud tea, albizia flower tea or finger citron tea ease that stuck feeling',
        'Don\'t sit on it — talk to people you trust and keep a circle around you',
        'Regular exercise (running, dance) gives feeling somewhere to go',
      ],
      foods: ['Radish, onion, daylily buds, buckwheat', 'Citrus, kumquat, pomelo, lemon', 'Rose bud, tangerine peel, finger citron, jasmine, albizia flower'],
      avoid: ['Cold and raw food — it slows things further', 'Sharp, astringent foods such as dark plum', 'Strong coffee, spirits, heavy and greasy food'],
      shortQuestions: [
        'Do you feel low or down?',
        'Do you get tense or anxious easily?',
        'Do you feel things deeply, and get upset easily?',
      ],
      questions: [
        'Do you feel low or down?',
        'Do you get tense or anxious easily?',
        'Do you feel things deeply, and get upset easily?',
        'Do you get frightened or startled easily?',
        'Do you get a tight, sore feeling under your ribs or in your breasts?',
        'Do you catch yourself sighing for no reason?',
        'Does your throat feel as if something is stuck in it, that you can neither swallow nor cough up?',
      ],
    },

    special: {
      name: 'Allergic Type (Sensitive Constitution)',
      shortName: 'Allergic Type',
      tagline: 'Sensitive Constitution — quick to react, from the start',
      description: 'This one is, in plain terms, being born more sensitive than most — an allergy-prone make-up, usually inherited or shaped by where you grew up. Hay fever, asthma and hives are common, as is reacting strongly to a particular food, medicine or pollen. Care works on two fronts: strengthening your defences so you react less, and keeping clear of your own triggers. It moves slowly, and rewards sticking with it.',
      recommendations: [
        'Work out what sets you off (pollen, dust mites, particular foods) and keep clear of it',
        'Astragalus, siler and atractylodes tea strengthens your outer defences (the Jade Screen approach)',
        'Keep your home clean, and wash and air your bedding regularly',
        'Wear a mask outdoors and take precautions in pollen season',
        'Be patient — this constitution shifts slowly, but it does shift',
      ],
      foods: ['Chinese yam, white hyacinth bean, lotus seed, pumpkin, brown rice', 'Astragalus, atractylodes, siler (the Jade Screen formula)', 'Red dates, goji berry, reishi, to firm up your defences'],
      avoid: ['Whatever you already know sets you off — this matters most of all', 'Prawns, crab, oily fish, broad beans, mango and other common triggers', 'Spicy food, alcohol, raw and chilled food, processed food'],
      shortQuestions: [
        'Do you have allergic reactions easily — to medicines, food, smells, pollen, or when the season or weather changes?',
        'Does your skin come up in hives or welts?',
        'Do you sneeze even when you don\'t have a cold?',
      ],
      questions: [
        'Do you sneeze even when you don\'t have a cold?',
        'Do you get a blocked or runny nose even without a cold?',
        'Do you cough or wheeze when the season or temperature changes, or around strong smells?',
        'Do you have allergic reactions easily — to medicines, food, smells, pollen, or when the season or weather changes?',
        'Does your skin come up in hives or welts?',
        'Has a reaction ever left purple-red spots or patches on your skin?',
        'Does your skin go red and mark as soon as you scratch it?',
      ],
    },
  },
};
