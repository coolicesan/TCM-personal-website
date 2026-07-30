// Shared in-page language switcher: Traditional Chinese by default, English on demand.
(function () {
  'use strict';

  var LANG_KEY = 'drhu_site_lang';
  var DEFAULT_LANG = 'zh';

  function getLang() {
    try { return localStorage.getItem(LANG_KEY) || DEFAULT_LANG; } catch (_) { return DEFAULT_LANG; }
  }

  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
  }

  var TEXT = {
    '胡佩珊中醫師': 'CMP Kate Woo',
    '胡佩珊': 'Kate Woo',
    '中醫師': 'Chinese Medicine Practitioner',
    '服務項目': 'Areas of Care',
    '治療項目': 'Treatments',
    '中醫治療項目': 'Chinese Medicine Services',
    '健康評估': 'Health Assessments',
    '健康文章': 'Health Articles',
    '健康知識庫': 'Health Library',
    '關於醫師': 'About',
    '預約掛號': 'Book a Consultation',
    '預約掛號 →': 'Book a Consultation →',
    '首頁': 'Home',
    '全部': 'All',
    '青春期': 'Adolescence',
    '育齡期': 'Reproductive Years',
    '備孕': 'Fertility',
    '懷孕': 'Pregnancy',
    '產後': 'Postpartum',
    '更年期': 'Menopause',
    '停經後': 'Postmenopause',
    '了解更多 →': 'Learn More →',
    '立即預約門診 →': 'Book a Consultation →',
    'WhatsApp 即時查詢': 'WhatsApp Enquiry',

    '香港註冊中醫師 · 婦科專科 · 身心同治': 'Hong Kong Registered Chinese Medicine Practitioner · Women’s Health · Mind-Body Care',
    '以中醫智慧，溫柔陪伴': 'Holistic care for women’s health',
    '每個階段': 'at every stage of life',
    '女性每個階段': 'at every stage of life',
    '從青春期、備孕、孕產到更年期，胡醫師以中醫調理為本、融合現代醫學知識與心理輔導專業，聆聽每位女性的真實需求，制定溫和細膩的個人化調理方案。': 'CMP Kate Woo blends Chinese medicine with modern medical knowledge and counselling training to support women at every stage — from menstrual health and fertility to pregnancy, postpartum recovery, menopause, emotional wellbeing and long-term constitutional care. Every consultation is attentive, unhurried and shaped around you.',
    '先了解我的體質': 'Start with a Health Assessment',
    '從您的困擾出發，找到對應的調理方向': 'Care pathways for your everyday concerns',

    '月經調理': 'Period and Cycle Care',
    '更年期調理': 'Menopause Care',

    '月經及婦科問題': 'Menstrual & Gynaecological Care',
    '經期・婦科問題': 'Menstrual symptoms and gynaecological concerns',
    '月經不規律': 'Irregular periods',
    '經前症候群': 'PMS',
    '子宮內膜異位症': 'Endometriosis',
    '備孕及不孕': 'Fertility Support',
    '自然備孕・IVF/IUI': 'Natural conception, IVF and IUI',
    '卵巢調養': 'Ovarian function',
    '子宮環境改善': 'Endometrial and uterine support',
    '試管前後調理': 'IVF cycle support',
    '孕期及產後': 'Pregnancy & Postpartum',
    '孕期安胎・坐月調理': 'Pregnancy support and postpartum recovery',
    '孕吐安胎': 'Nausea and pregnancy stability',
    '坐月子調補': 'Postnatal replenishment',
    '產後情緒': 'Postpartum mood and sleep',
    '更年期與停經後健康': 'Menopause & Postmenopausal Health',
    '更年期・停經後保健': 'Perimenopause and postmenopause care',
    '潮熱盜汗': 'Hot flashes and night sweats',
    '失眠情緒': 'Sleep and mood',
    '骨質保健': 'Bone and metabolic health',
    '皮膚問題': 'Skin Concerns',
    '濕疹・暗瘡・皮膚體質': 'Eczema, acne and skin constitution',
    '濕疹調理': 'Eczema support',
    '暗瘡調理': 'Acne support',
    '皮膚敏感': 'Sensitive skin',
    '乳房': 'Breast Health',
    '乳腺增生・乳房脹痛': 'Breast lumps and tenderness',
    '乳腺增生': 'Fibrocystic changes',
    '乳房脹痛': 'Breast tenderness',
    '乳腺炎/塞奶': 'Mastitis and blocked ducts',
    '脫髮': 'Hair Loss',
    '掉髮・脫髮調理': 'Hair shedding and hair loss support',
    '產後脫髮': 'Postpartum hair loss',
    '雄性禿': 'Androgenetic alopecia',
    '壓力性脫髮': 'Stress-related hair loss',
    '健康減重・代謝調理': 'Healthy weight and metabolic support',
    '代謝失調': 'Metabolic imbalance',
    '水腫肥胖': 'Water retention and weight gain',
    '產後體重': 'Postpartum weight',
    '情緒健康': 'Emotional Wellbeing',
    '焦慮・抑鬱・驚恐・失眠': 'Anxiety, low mood, panic and insomnia',
    '焦慮症': 'Anxiety',
    '抑鬱・驚恐症': 'Depression / panic',
    '失眠調理': 'Insomnia support',
    '癌症治療': 'Supportive Cancer Care',
    '腫瘤輔助調理・康復支援': 'Support during and after oncology treatment',
    '化療副作用紓緩': 'Chemo side-effect support',
    '電療後調理': 'Post-radiotherapy recovery',
    '體質扶正': 'Strength and appetite support',
    '內科調理': 'General Internal Care',
    '脾胃・肝腎調養': 'Digestion, fatigue and whole-body regulation',
    '慢性疲勞': 'Chronic fatigue',
    '消化不良': 'Indigestion',
    '頭暈心悸': 'Dizziness and palpitations',

    '中醫治療項目': 'Chinese Medicine Services',
    '多元治療・全面調理': 'Treatments tailored to your body and goals',
    '中藥調理': 'Herbal Medicine',
    '根據望聞問切四診，為您配製個人化中藥方，從根本調補氣血、平衡陰陽。': 'Individual herbal prescriptions based on consultation, pulse and tongue assessment, adjusted as your body responds.',
    '針灸治療': 'Acupuncture',
    '疏通經絡、調節氣血運行，改善痛經、失眠、不孕等婦科問題，療效直接。': 'Sterile, single-use needles selected to support pain, sleep, stress, fertility and women’s health concerns.',
    '美顏針': 'Cosmetic Acupuncture',
    '細針刺激面部穴位，促進膠原生成，提拉緊緻、淡化細紋。': 'A natural approach to skin vitality, facial tension, circulation and complexion, with constitution considered alongside the face.',
    '體重管理': 'Weight Management',
    '耳穴療法': 'Auricular Therapy',
    '透過耳部反射區調節全身臟腑功能，特別適合調節內分泌、改善睡眠與食慾。': 'Small ear seeds or stimulation points used as gentle support for sleep, stress, appetite and hormonal regulation.',
    '拔罐・刮痧': 'Cupping and Gua Sha',
    '排濕排毒、舒筋活絡，改善因氣滯血瘀引起的肩頸痠痛、月經不暢等問題。': 'Hands-on external therapies for muscle tension, heaviness, stagnation and circulation-related discomfort.',
    '艾灸療法': 'Moxibustion',
    '以艾草溫熱刺激穴位，溫經散寒、補益陽氣，特別適合宮寒不孕、痛經及產後虛寒體質。': 'Warming moxa care for cold-type patterns, period pain, postpartum coldness and selected fertility concerns.',

    '線上健康評估': 'Online Health Assessments',
    '花幾分鐘，更了解自己的身體': 'Begin with a health questionnaire',
    '中醫體質問卷': 'TCM Constitution Questionnaire',
    '王琦九種體質 · 中華中醫藥學會標準': 'Nine-constitution framework used in TCM',
    '了解您屬於氣虛、陽虛、陰虛、痰濕、濕熱、血瘀、氣鬱、特稟還是平和體質——體質是認識自己身體的起點，也決定了適合您的飲食與生活方式。': 'A guided questionnaire to help you recognise your constitutional patterns and see which diet, lifestyle and acupoint suggestions may suit you.',
    '60 題，約 8–10 分鐘': '60 questions, about 8-10 minutes',
    '即時顯示各體質評分與主要體質': 'Instant scores and likely dominant constitution',
    '專屬食療、茶飲與穴位建議': 'Tailored food, tea and acupoint suggestions',
    '連結對應體質的健康文章': 'Links to articles matched to your body type',
    '開始體質測驗 →': 'Take the Body Type Quiz →',
    '女性全方位健康評估': 'Women’s Health Assessment',
    '9 大問卷 · 涵蓋所有生命階段': 'Nine modules for different life stages',
    '依您目前的生命階段選擇評估：月經健康、備孕力、多囊卵巢、孕期不適與情緒、產後恢復與情緒、更年期症狀，幫助您更全面認識目前的身體狀況。': 'Choose the assessment that matches where you are now, including periods, fertility, PCOS, pregnancy symptoms, postpartum recovery, mood and menopause.',
    '月經 · 備孕 · 孕期 · 產後 · 更年期': 'Periods · fertility · pregnancy · postpartum · menopause',
    '採用國際通用量表，結果客觀可靠': 'Includes recognised screening tools where relevant',
    '對應中醫辨證分型與體質分析': 'Connects results with TCM pattern insights',
    '即時結果＋個人化調理方向': 'Instant results with next-step care suggestions',
    '進入女性評估中心 →': 'Open the Women’s Health Assessment →',
    '完成評估後，可依結果閱讀對應的健康文章，慢慢認識自己的身體。': 'After completing an assessment, you can read related articles and bring your results to a consultation if you wish.',

    '健康衛教文章': 'Patient Education',
    '女性健康知識庫': 'Health Library',
    '查看全部文章 →': 'View All Articles →',
    '閱讀更多 →': 'Read More →',

    '產後調理全指南：由第一日到第六個月，每個階段要注意什麼': 'Postpartum Recovery Guide: What to Watch From Day One to Month Six',
    '由產後第一日到第六個月，每個階段的身體變化與調理重點。香港註冊中醫師整理惡露、坐月、餵哺、脫髮、腰痛、情緒等常見問題的處理方向，以及哪些情況必須即時求醫。': 'A practical guide to postpartum changes and recovery priorities, including lochia, confinement care, feeding, hair loss, back pain, mood and when to seek urgent medical help.',
    '惡露多久才乾淨？顏色代表什麼？中醫拆解產後惡露 3 個階段': 'How Long Should Lochia Last? A TCM View of Postpartum Bleeding',
    '惡露一般 2 至 6 週排清，顏色由鮮紅轉為淡黃白。香港註冊中醫師拆解惡露三個階段、顏色代表甚麼、惡露不絕的中醫成因，以及哪些情況要立即求醫。': 'Lochia usually settles over two to six weeks. Learn what colour changes may mean, how TCM understands prolonged bleeding and which warning signs need prompt medical care.',
    '產後脫髮什麼時候停？中醫拆解成因、恢復時間與調理方向': 'Postpartum Hair Loss: Causes, Timeline and TCM Support',
    '產後脫髮多在分娩後 2 至 4 個月開始，約四個月時最明顯，大部分人在寶寶一歲前回復。香港註冊中醫師拆解脫髮成因、中醫體質分型、日常護理，以及哪些情況要求醫。': 'Postpartum shedding often starts two to four months after birth and usually improves within the first year. This article explains common causes, TCM patterns, daily care and red flags.',
    '餵母乳可不可以服用中藥？中醫師講解安全須知': 'Can You Take Chinese Herbs While Breastfeeding?',
    '餵母乳期間可以服用中藥，但必須由註冊中醫師處方並知悉你正在授乳。香港註冊中醫師拆解中藥經乳汁的一般原則、有回奶作用的藥材、需要審慎的類別，以及寶寶出現什麼反應要停藥求醫。': 'Chinese herbs may be used while breastfeeding when prescribed by a registered practitioner who knows you are nursing. Learn the safety principles, herbs that may reduce milk supply and signs to watch in your baby.',
    '奶量不足怎麼辦？中醫拆解母乳不足的真假訊號與調理方向': 'Low Milk Supply: Real Signs, False Alarms and TCM Support',
    '覺得奶量不足，未必真係奶量不足。香港註冊中醫師拆解怎樣用尿片與體重判斷寶寶吃得夠不足、常見的假警號、真正影響奶量的因素，以及中醫對缺乳的辨證與湯水的正確用法。': 'Feeling low on milk does not always mean supply is truly low. Learn how nappies and weight gain help assess intake, what can affect supply and how TCM approaches lactation support.',
    '塞奶、石頭胸、乳腺炎怎樣分辨？中醫拆解成因與正確處理方法': 'Blocked Ducts, Engorgement or Mastitis? How to Tell the Difference',
    '塞奶、石頭胸與乳腺炎其實屬同一系列的乳房發炎問題。香港註冊中醫師拆解三者分別、最新國際指引為什麼叫停大力按摩與熱敷、中醫辨證處理方向，以及哪些情況要立即求醫。': 'A clear guide to breast inflammation during breastfeeding, including why forceful massage and heat are no longer recommended, TCM support options and when to seek urgent care.',
    '⏱ 約 5 分鐘': 'About 5 min read',

    '胡佩珊中醫師 Kate Woo': 'Kate Woo',
    '胡醫師為香港註冊中醫師，專注於女性健康，提倡「身心同治」的治療理念，善於結合傳統中醫智慧、現代醫學知識及心理輔導學專業，注重聆聽病人的真實需求，致力於以溫和細膩的治療方法，為每位病人制定客製化的治療方案。': 'Dr. Kate Woo is a Registered Chinese Medicine Practitioner in Hong Kong specializing in women\'s health. She focuses on women\'s wellness through a mind-body healing philosophy. She brings together the ancient wisdom of traditional Chinese medicine, modern clinical insights, and professional counseling to provide truly comprehensive care. She prioritizes listening to her patients, providing gentle and refined treatments tailored to each individual\'s unique needs.',
    '胡佩珊醫師專注於女性健康，提倡「身心同治」的治療理念，善於結合傳統中醫智慧、現代醫學知識及心理輔導學專業，注重聆聽病人的真實需求，致力於以溫和細膩的治療方法，為每位病人制定客製化的治療方案。': 'Dr. Kate Woo is a Registered Chinese Medicine Practitioner in Hong Kong specializing in women\'s health. She focuses on women\'s wellness through a mind-body healing philosophy. She brings together the ancient wisdom of traditional Chinese medicine, modern clinical insights, and professional counseling to provide truly comprehensive care. She prioritizes listening to her patients, providing gentle and refined treatments tailored to each individual\'s unique needs.',
    '香港中醫藥管理委員會註冊中醫師（註冊編號：008823）': 'Registered Chinese Medicine Practitioner, Chinese Medicine Council of Hong Kong (No. 008823)',
    '香港浸會大學中醫藥及生物醫學學士（一級榮譽）': 'BSc in Chinese Medicine and Biomedical Science, Hong Kong Baptist University (First Class Honours)',
    '香港浸會大學輔導學社會科學碩士': 'MSocSc in Counselling, Hong Kong Baptist University',
    '中醫學深造證書（臨床婦科學）': 'Advanced Certificate in Chinese Medicine (Clinical Gynaecology)',
    '中醫專業實踐證書（西方醫學婦產科學）': 'Professional Practice Certificate in Chinese Medicine (Western Obstetrics and Gynaecology)',
    'JMCAA 3D立體美顏針證書': 'JMCAA 3D Facial Acupuncture Certification',
    '日本小顏矯正證書': 'Japanese Small Face Correction Certification',
    'IFA芳香治療師認證': 'IFA Aromatherapist',

    '與胡醫師預約門診': 'Book a consultation with CMP Kate Woo',
    '歡迎透過 WhatsApp 或填寫表單預約。如想先多了解自己的身體，也可以先完成': 'You are welcome to book through WhatsApp or the form below. If you would like to understand your symptoms first, start with an ',
    '線上健康評估': 'online health assessment',
    '中環診所': 'Central Clinic',
    '香港中環德輔道中19號': 'Unit 1103, 11/F, World-Wide House,',
    '環球大廈 1103室': '19 Des Voeux Rd Central, Central',
    '鑽石山診所': 'Diamond Hill Clinic',
    '鑽石山彩虹道235號': 'Shop B04, B1/F, Kai Chuen Shopping Centre,',
    '啟鑽商場 B1樓 B04號舖': '235 Choi Hung Road, Diamond Hill',
    'WhatsApp 預約': 'WhatsApp',
    '電郵': 'Email',
    '線上預約表單': 'Online Booking Form',
    '姓名 *': 'Name *',
    '聯絡電話 *': 'Phone *',
    '就診需求': 'Main Concern',
    '請選擇': 'Please select',
    '青春期調理': 'Teen menstrual health',
    '備孕調養': 'Fertility preparation',
    '孕期保健': 'Pregnancy support',
    '產後復原': 'Postpartum recovery',
    '停經後養生': 'Postmenopause support',
    '情緒與睡眠': 'Mood and sleep',
    '中醫美容（美顏針）': 'Cosmetic acupuncture',
    '體質調養': 'Constitution care',
    '其他': 'Other',
    '想告訴醫師的事': 'Notes for the practitioner',
    '透過 WhatsApp 送出預約': 'Send via WhatsApp',
    '按下送出後會開啟 WhatsApp，內容已為您整理好，確認後傳送即可。': 'Submitting will open WhatsApp with your message prepared. Please review it before sending.',
    '快速前往': 'Quick Links',
    '女性健康評估': 'Women’s Health Assessment',
    '聯絡方式': 'Contact',
    '以中醫智慧與身心同治的理念，陪伴女性每個生命階段。': 'Professional, gentle Chinese medicine care for women’s health in Hong Kong.',
    '本網站所有內容與線上評估僅供健康教育參考，不構成醫療建議，亦不能取代註冊醫師或中醫師的診斷與治療。若您出現急性或嚴重症狀，請立即求醫。': 'All content and online assessments on this site are for educational purposes only. They are not a substitute for professional medical advice, diagnosis or treatment. Please seek urgent care if you have acute or severe symptoms.',

    '什麼是針灸': 'What Is Acupuncture',
    '什麼是耳穴療法': 'What Is Auricular Therapy',
    '什麼是拔罐刮痧': 'What Are Cupping and Gua Sha',
    '什麼是美顏針': 'What Is Cosmetic Acupuncture',
    '什麼是輔助調理': 'What Is Supportive Care',
    '什麼是體重管理': 'What Is Weight Management',
    '什麼是艾灸': 'What Is Moxibustion',
    '中西醫怎麼看': 'TCM and Biomedical Views',
    '適合哪些人': 'Who It May Help',
    '治療流程': 'Treatment Process',
    '常見問題': 'FAQ',
    '對比醫學美容': 'Compared With Aesthetic Medicine',
    '中醫治療': 'Chinese Medicine Treatment',
    '中醫美容': 'Chinese Medicine Aesthetics',
    '中醫調理': 'Chinese Medicine Care',
    '中醫輔助治療': 'Supportive Chinese Medicine',
    '相關療程': 'Related Treatments',
    '您可能也感興趣': 'You May Also Like',
    '您可能想問的問題': 'Questions You May Have',
    '中醫怎麼治療': 'How TCM Treatment Works',
    '療程如何進行': 'How a Session Works',
    '西醫角度': 'Biomedical View',
    '中醫角度': 'TCM View',
    '本網站資訊僅供參考，不替代醫療診斷。如有身體不適，請務必諮詢專業醫師。': 'Information on this website is for reference only and does not replace medical diagnosis. Please consult a qualified professional if you feel unwell.',
    '© 2024 胡佩珊中醫師': '© 2024 CMP Kate Woo',
    '© 2026 胡佩珊中醫師 · 香港中醫藥管理委員會註冊中醫師（008823）': '© 2026 CMP Kate Woo · Registered Chinese Medicine Practitioner, Chinese Medicine Council of Hong Kong (008823)'
  };

  var ATTR_TEXT = {
    '請輸入您的姓名': 'Please enter your name',
    '簡述主要困擾或想詢問的問題...': 'Briefly describe your main concern or question...',
    '搜尋文章關鍵字，例如：惡露、脫髮、塞奶⋯': 'Search articles, e.g. lochia, hair loss, blocked ducts...',
    '開啟選單': 'Open menu',
    '選單': 'Menu',
    'WhatsApp 即時查詢': 'WhatsApp Enquiry'
  };

  var META = {
    index: {
      title: 'CMP Kate Woo | Women’s Health Chinese Medicine in Hong Kong',
      description: 'CMP Kate Woo is a Hong Kong registered Chinese medicine practitioner providing women’s health, fertility, pregnancy, postpartum, menopause, emotional wellbeing and constitutional care.'
    },
    about: {
      title: 'About CMP Kate Woo | Hong Kong Registered Chinese Medicine Practitioner',
      description: 'Learn about CMP Kate Woo, a Hong Kong registered Chinese medicine practitioner focusing on women’s health, gynaecology, fertility, postpartum recovery and mind-body care.'
    }
  };

  var TREATMENTS = {
    'treatment-herbs.html': {
      title: 'Herbal Medicine',
      category: 'Chinese Medicine Treatment',
      hero: 'Personalised herbal prescriptions to regulate qi, blood, yin and yang from the root, based on your constitution and symptoms.',
      whatTitle: 'Personalised Herbs for Constitutional Care',
      what: [
        'Chinese herbal medicine is prescribed after a full TCM assessment. Rather than using one formula for one symptom, CMP Kate Woo considers your constitution, cycle pattern, digestion, sleep, mood and medical history before choosing a formula.',
        'Herbs may be used for menstrual concerns, fertility preparation, pregnancy support when appropriate, postpartum recovery, menopause symptoms, sleep, digestion and general constitutional care.',
        'Each prescription is adjusted over time according to your response, so the treatment remains precise and safe.'
      ],
      compareTitle: 'Single Ingredient or Whole-Formula Thinking',
      west: ['Focuses on active ingredients and pharmacological effects', 'Usually targets a named condition or symptom', 'Safety depends on dosage, interactions and diagnosis', 'Often separates gynaecology, digestion, sleep and mood'],
      tcm: ['Uses formula compatibility and pattern diagnosis', 'Treats the body as an interconnected system', 'Adjusts herbs according to constitution and stage', 'Can work alongside acupuncture, moxibustion and lifestyle care'],
      detail: 'Herbal medicine is most useful when the formula matches the person, not just the diagnosis. Please tell CMP Kate Woo about pregnancy, breastfeeding, existing medications and any liver, kidney or cancer history before taking herbs.',
      tags: ['Irregular periods', 'Period pain', 'PMS', 'Fertility support', 'PCOS', 'IVF / IUI support', 'Pregnancy care', 'Postpartum recovery', 'Menopause symptoms', 'Sleep and anxiety', 'Low qi and blood', 'Constitution care'],
      steps: [['Consultation and TCM assessment', 'Detailed questioning, tongue and pulse assessment to understand the pattern behind your symptoms.'], ['Pattern diagnosis', 'Identify whether the concern relates to qi deficiency, blood deficiency, cold, heat, dampness, stagnation or other patterns.'], ['Formula design', 'Combine herbs according to treatment principle, constitution and safety needs.'], ['Dosage form', 'Choose granules, decoction or other forms according to practicality and clinical need.'], ['Follow-up adjustment', 'Review changes and fine-tune the formula as the body responds.']],
      faq: [['Are Chinese herbs safe?', 'When prescribed by a qualified Chinese medicine practitioner after proper assessment, herbs are generally safe. Please disclose medications, pregnancy, breastfeeding and chronic illnesses.'], ['How long do I need to take herbs?', 'It depends on the condition. Acute symptoms may improve quickly, while menstrual, fertility or chronic constitutional issues usually need several cycles of review.'], ['Can herbs be taken with Western medicine?', 'Sometimes yes, but timing and interactions must be checked. Bring your medication list to the consultation.'], ['Do herbs taste bitter?', 'Some formulas are bitter, while others are mild or sweet. Granules are often easier to take.'], ['Can I stop once I feel better?', 'Do not stop abruptly for ongoing conditions without discussion. CMP Kate Woo will advise when to taper or adjust.']],
      related: ['Acupuncture', 'Moxibustion', 'Auricular Therapy'],
      ctaTitle: 'Book Your Herbal Medicine Consultation',
      ctaText: 'CMP Kate Woo will assess your constitution and symptoms in detail before designing a personalised herbal care plan.'
    },
    'treatment-acupuncture.html': {
      title: 'Acupuncture',
      category: 'Chinese Medicine Treatment',
      hero: 'Very fine sterile needles stimulate specific acupoints to regulate body function and relieve symptoms, from pain and digestion to sleep, mood, women’s health, fertility and postpartum recovery.',
      whatTitle: 'Fine-Needle Care for Body Regulation',
      what: ['Acupuncture uses very fine needles to stimulate selected points on the body. It is best known for pain relief, but its clinical use is broader than many people expect.', 'Depending on the person, acupuncture may be considered for pain, digestive symptoms, nausea, sleep and stress-related physical symptoms, menstrual concerns, fertility preparation, pregnancy-related discomfort, postpartum recovery and menopause support.', 'CMP Kate Woo chooses points after a full TCM assessment, considering your symptoms, constitution, medical history and safety factors. All needles are single-use and sterile.'],
      compareTitle: 'Traditional Meridian Theory and Modern Research',
      west: ['Often studied as a neuromodulation therapy', 'May involve adenosine A1 receptor activity in local pain relief', 'May promote endogenous pain-relieving substances such as endorphins', 'Brain imaging studies suggest broader nervous-system regulation', 'Evidence strength varies by condition'],
      tcm: ['Stimulates acupoints along meridians to regulate qi and blood', 'Unblocks stagnation and supports smoother body function', 'Uses pattern diagnosis rather than one fixed protocol', 'Aims to harmonise yin-yang and organ function', 'Can be combined with herbs, moxibustion or auricular therapy'],
      detail: 'Research suggests acupuncture may affect local adenosine signalling, endorphin release and nervous-system regulation. Large individual-patient meta-analysis data support clinically meaningful effects for chronic pain that cannot be explained by placebo alone. Evidence is stronger for chronic pain and postoperative nausea than for some other indications, so treatment should be discussed case by case.',
      tags: ['Chronic low back pain', 'Neck and shoulder pain', 'Knee osteoarthritis pain', 'Headache and migraine', 'Postoperative nausea', 'Selected chemotherapy-related nausea', 'Indigestion', 'Functional digestive symptoms', 'Insomnia', 'Anxiety-related body symptoms', 'Period pain', 'Irregular periods', 'Fertility and IVF/IUI support', 'Postpartum back pain and lactation support', 'Menopause hot flashes and sleep', 'Facial palsy and stroke rehabilitation support', 'Selected allergic rhinitis symptoms'],
      steps: [['Consultation and TCM assessment', 'Review symptoms, medical history, constitution, sleep, digestion, menstruation or other relevant concerns before deciding the treatment direction.'], ['Point selection', 'Choose main and supporting points according to the pattern and care goal, rather than using one fixed point set for everyone.'], ['Sterile needling', 'Use very fine single-use sterile needles. Most people feel only a light prick followed by a dull, heavy or aching deqi sensation.'], ['Needle retention and follow-up', 'Needles are usually retained for 20-30 minutes. Treatment frequency and point selection are adjusted according to response.']],
      faq: [['Does acupuncture hurt?', 'Most people feel only a light prick. When the needle reaches the point, a dull, heavy, aching or tingling deqi sensation can occur. This is different from sharp pain and usually settles quickly.'], ['Is acupuncture evidence-based?', 'Yes, especially for chronic pain and postoperative nausea and vomiting. Mechanisms such as adenosine signalling, endorphin release and neuromodulation are being studied. Evidence strength still varies by condition.'], ['How many sessions are needed?', 'It depends on the problem. Acute pain may respond within one to a few sessions. Constitutional concerns such as menstrual regulation, fertility preparation or insomnia often need weekly treatment over several weeks.'], ['Is acupuncture safe?', 'When performed by a registered practitioner using sterile single-use needles, acupuncture is generally safe. Tell CMP Kate Woo if you are pregnant, taking anticoagulants, have a bleeding tendency, have a pacemaker or feel very weak or faint.'], ['What should I do before and after treatment?', 'Avoid coming on an empty stomach or immediately after a very heavy meal, and wear comfortable loose clothing. After treatment, avoid intense exercise, alcohol and overexertion for the rest of the day.']],
      related: ['Herbal Medicine', 'Moxibustion', 'Auricular Therapy'],
      ctaTitle: 'Book Your Acupuncture Session',
      ctaText: 'CMP Kate Woo will assess your condition and design a personalised acupuncture plan.'
    },
    'treatment-facial.html': {
      title: 'Cosmetic Acupuncture',
      category: 'Chinese Medicine Aesthetics',
      hero: 'Facial acupuncture supports circulation, collagen renewal and complexion while also caring for the internal constitution behind skin concerns.',
      whatTitle: 'Natural Beauty Through Qi and Blood',
      what: ['Cosmetic acupuncture uses very fine needles on facial and body points to support circulation, muscle tone and skin vitality.', 'Unlike fillers or surgery, it is a gradual and natural approach with little downtime. Many people also notice better sleep, mood and overall energy when constitution is treated together.', 'CMP Kate Woo assesses both skin presentation and internal patterns, because dullness, puffiness or acne may arise from different constitutional roots.'],
      compareTitle: 'Skin Science Meets Qi-Blood Regulation',
      west: ['Focuses on collagen, UV damage and cell turnover', 'Uses skincare, devices and injectable treatments', 'Often gives faster local effects', 'May require downtime or repeated maintenance'],
      tcm: ['Facial appearance reflects internal qi, blood and organ balance', 'Uses meridian stimulation and constitution care', 'Addresses sleep, stress and digestion as skin factors', 'Gradual, natural-looking improvement'],
      detail: 'Facial acupuncture may create tiny local stimulation similar in principle to microneedling while also regulating body points. Results vary by age, skin condition and treatment consistency.',
      tags: ['Facial sagging', 'Fine lines', 'Dull complexion', 'Large pores', 'Acne marks', 'Dark circles', 'Facial puffiness', 'Adult acne', 'Overall glow'],
      steps: [['Skin and constitution assessment', 'Review sleep, stress, digestion and menstrual patterns alongside skin concerns.'], ['Facial point needling', 'Needle selected facial points and body points to support circulation and tone.'], ['Constitution care', 'Add herbs or other therapies when internal imbalance affects skin.'], ['Course planning', 'Begin with more frequent sessions, then shift to maintenance as results stabilise.'], ['Regular review', 'Adjust points and focus according to skin response.']],
      faq: [['Will it hurt or leave marks?', 'The needles are very fine. Tiny needle marks usually close quickly and visible marks are uncommon.'], ['When will I see results?', 'Many people notice glow or lifting after a few sessions; longer-lasting texture changes take a course of treatment.'], ['Is there downtime?', 'Usually no. You can return to normal activity after treatment.'], ['Can it replace Botox or fillers?', 'No. It offers a more natural, gradual approach and does not create the same instant structural effect.'], ['Can acne-prone skin do it?', 'Often yes, but active infection or severe inflammation should be assessed first.']],
      related: ['Herbal Medicine', 'Acupuncture', 'Weight Management'],
      ctaTitle: 'Book Your Cosmetic Acupuncture Session',
      ctaText: 'CMP Kate Woo will assess your skin and constitution to create a natural beauty care plan.'
    },
    'treatment-weight.html': {
      title: 'Weight Management',
      category: 'Chinese Medicine Care',
      hero: 'A constitution-based approach to metabolism, water retention, appetite and sustainable weight control.',
      whatTitle: 'More Than Weight Loss',
      what: ['Chinese medicine does not reduce weight concerns to willpower alone. CMP Kate Woo looks for patterns such as spleen deficiency with dampness, phlegm-dampness, liver qi stagnation or yang deficiency.', 'Treatment may combine acupuncture, herbs and practical lifestyle advice to improve metabolism and reduce rebound.', 'It is especially suitable for people who have tried dieting or exercise but experience repeated weight fluctuations.'],
      compareTitle: 'Complementary, Not Opposing Views',
      west: ['Focuses on calorie balance, exercise and measurable indices', 'May use medication or metabolic surgery when needed', 'Often tracks BMI and body fat percentage', 'Less emphasis on individual constitution'],
      tcm: ['Starts from pattern diagnosis and constitution', 'Regulates spleen-stomach function, dampness and endocrine balance', 'Considers sleep, stress and appetite', 'Aims for sustainable regulation and less rebound'],
      detail: 'Acupuncture and auricular therapy may support appetite and autonomic balance, but lasting results still require realistic diet, movement and sleep habits.',
      tags: ['Low metabolism', 'Postpartum weight gain', 'Menopause weight gain', 'Water retention', 'Stress eating', 'PCOS-related weight gain', 'Weight rebound', 'Poor dieting response', 'Limited exercise time'],
      steps: [['Constitution assessment', 'Identify the pattern behind weight gain or water retention.'], ['Acupuncture regulation', 'Use points that support digestion, dampness transformation and metabolism.'], ['Personalised herbs', 'Prescribe according to dampness, stagnation, deficiency or cold patterns.'], ['Diet and routine advice', 'Create sustainable habits rather than extreme restriction.'], ['Follow-up tracking', 'Review weight, body feel, digestion and energy to refine the plan.']],
      faq: [['Can acupuncture help with weight loss?', 'It can support appetite, digestion and water metabolism, but works best with realistic lifestyle changes.'], ['Do I need strict dieting?', 'No. The aim is sustainable adjustment, not extreme restriction.'], ['How long before changes appear?', 'Many people feel less bloated and more energetic within several weeks; weight change varies.'], ['Are there side effects?', 'Treatment is generally gentle, but tell CMP Kate Woo about medications, pregnancy or breastfeeding.'], ['Will weight rebound after stopping?', 'The goal is to improve the underlying pattern and maintain healthy habits, reducing rebound risk.']],
      related: ['Hair Loss Support', 'Herbal Medicine', 'Acupuncture'],
      ctaTitle: 'Start Your Weight Management Plan',
      ctaText: 'CMP Kate Woo will assess your constitution and metabolism to design a personalised plan.'
    },
    'treatment-hairloss.html': {
      title: 'Hair Loss Support',
      category: 'Chinese Medicine Care',
      hero: 'Nourish kidney essence and blood, support scalp circulation and rebuild a healthier environment for hair growth.',
      whatTitle: 'Hair Reflects Blood and Essence',
      what: ['In Chinese medicine, hair health is closely related to blood, kidney essence, stress and digestion. Hair loss may appear after childbirth, illness, stress, poor sleep or hormonal changes.', 'Treatment focuses on the root pattern rather than the scalp alone, often combining herbs, acupuncture and scalp care advice.', 'CMP Kate Woo also considers when biomedical assessment is needed, such as thyroid concerns, iron deficiency or sudden severe shedding.'],
      compareTitle: 'From Follicles to Qi and Blood',
      west: ['Looks at follicles, hormones, thyroid, iron and inflammatory scalp disease', 'May use topical or oral medication', 'Measures shedding pattern and density', 'Targets the hair cycle directly'],
      tcm: ['Looks at kidney essence, blood, liver qi and spleen function', 'Uses herbs and acupuncture to nourish and regulate', 'Considers sleep, postpartum state and stress', 'Supports the internal environment for growth'],
      detail: 'Hair growth cycles are slow, so meaningful improvement usually requires patience and consistent follow-up.',
      tags: ['Postpartum hair loss', 'Stress shedding', 'Thinning hair', 'Oily scalp', 'Genetic hair loss support', 'Late nights', 'Menopause hair loss', 'Post-illness weakness', 'Sensitive scalp'],
      steps: [['Scalp and constitution assessment', 'Review shedding pattern, scalp state, sleep, stress and menstrual/postpartum history.'], ['Scalp acupuncture', 'Stimulate selected scalp and body points to support circulation.'], ['Personalised herbs', 'Nourish blood, kidney essence or regulate liver qi according to pattern.'], ['Scalp care advice', 'Recommend practical washing, sleep and nutrition habits.'], ['Regular review', 'Track shedding and density over time.']],
      faq: [['How long does treatment take?', 'Hair cycles are slow; a few months of consistent care is usually needed.'], ['Is postpartum hair loss normal?', 'Often yes, but severe or prolonged shedding should be assessed.'], ['Can TCM help genetic hair loss?', 'It may support scalp health and slow progression, but expectations should be realistic.'], ['Do I need blood tests?', 'Sometimes, especially for sudden or severe shedding.'], ['Can I combine with topical treatment?', 'Often yes. Bring your current products or medication list.']],
      related: ['Herbal Medicine', 'Acupuncture', 'Internal Medicine Care'],
      ctaTitle: 'Start Your Hair Loss Support Plan',
      ctaText: 'CMP Kate Woo will assess your scalp, constitution and health history to plan suitable care.'
    },
    'treatment-mammary.html': {
      title: 'Breast Acupuncture',
      category: 'Chinese Medicine Treatment',
      hero: 'Regulate liver qi, blood circulation and breast meridians to ease breast tenderness, benign breast concerns and lactation stagnation.',
      whatTitle: 'Meridian Care for Breast Discomfort',
      what: ['Breast discomfort often fluctuates with the menstrual cycle, emotions and postpartum lactation. TCM commonly relates this to liver qi stagnation, blood stasis or qi-blood deficiency.', 'Breast acupuncture aims to soothe liver qi, improve circulation and support lactation flow when appropriate.', 'New lumps, abnormal discharge or worrying breast changes should first be assessed by Western medical imaging.'],
      compareTitle: 'Hormones and Liver Qi',
      west: ['Assesses hormonal change and breast imaging findings', 'Uses ultrasound, mammography or biopsy when needed', 'Prioritises ruling out malignancy', 'Manages lactation issues with appropriate medical support'],
      tcm: ['Analyses liver qi stagnation and blood stasis patterns', 'Combines acupuncture and herbs to move qi and blood', 'Considers mood and menstrual timing', 'Supports postpartum lactation flow safely'],
      detail: 'Breast acupuncture is supportive care for suitable benign conditions and does not replace imaging or cancer assessment.',
      tags: ['Premenstrual breast tenderness', 'Benign breast hyperplasia', 'Known benign lumps', 'Blocked milk flow', 'Weaning support', 'Cycle-related breast pain', 'Emotional stagnation', 'Post-surgery support for benign cysts'],
      steps: [['Consultation and assessment', 'Review timing, menstrual relation, mood, lactation and previous imaging.'], ['Breast-related acupuncture', 'Use local and distal points to move qi and blood gently.'], ['Personalised herbs', 'Support liver qi, blood circulation or qi-blood nourishment as needed.'], ['Postpartum lactation support', 'Combine acupoint stimulation and gentle manual guidance when appropriate.'], ['Cycle-based follow-up', 'Review changes across menstrual cycles.']],
      faq: [['Is it suitable for all breast problems?', 'No. New lumps or abnormal discharge should first be medically checked.'], ['Will breast acupuncture hurt?', 'Techniques are gentle; most people feel mild heaviness or soreness only.'], ['How quickly can blocked milk improve?', 'Some people feel improvement within hours to a couple of days, depending on severity.'], ['Should I come before every period?', 'For cyclical pain, treatment before the period may help; frequency can reduce as symptoms improve.'], ['Can I continue breastfeeding?', 'Usually yes; herbs and points are chosen with breastfeeding safety in mind.']],
      related: ['Herbal Medicine', 'Acupuncture', 'Moxibustion'],
      ctaTitle: 'Start Your Breast Acupuncture Care',
      ctaText: 'CMP Kate Woo will review your symptoms, cycle and lactation status to design safe supportive care.'
    },
    'treatment-auricular.html': {
      title: 'Auricular Therapy',
      category: 'Chinese Medicine Treatment',
      hero: 'Tiny ear points reflect whole-body regulation. Ear seeds provide gentle ongoing stimulation for hormones, sleep, appetite and stress.',
      whatTitle: 'A Body Map on the Ear',
      what: ['Auricular therapy uses the ear as a microsystem connected with organs, meridians and the nervous system.', 'Small vaccaria seeds are taped to selected ear points so you can gently press them at home between visits.', 'It is non-invasive, convenient and often paired with acupuncture or herbs.'],
      compareTitle: 'Neural Reflex or Microsystem Correspondence',
      west: ['The ear has branches of the vagus and trigeminal nerves', 'Often explained through reflex and autonomic regulation', 'Studied for pain, nausea, smoking cessation and appetite', 'Evidence varies by condition'],
      tcm: ['The ear reflects the whole body in microsystem theory', 'Sustained pressure regulates organ and meridian function', 'Useful as home self-care between visits', 'A gentle option for sensitive or depleted patients'],
      detail: 'Auricular therapy may influence autonomic balance through ear nerve branches, which may explain effects on sleep, appetite and stress.',
      tags: ['Hormonal imbalance', 'Irregular periods', 'PCOS', 'Insomnia', 'Anxiety', 'Appetite control', 'Menopause hot flashes', 'Indigestion', 'Smoking support', 'Allergy support'],
      steps: [['Ear and constitution assessment', 'Observe the ear and review symptoms.'], ['Point selection', 'Choose points such as Shenmen, endocrine or digestive points according to need.'], ['Ear seed application', 'Apply vaccaria seeds with tape for gentle stimulation.'], ['Home pressing guidance', 'Learn how often and how firmly to press.'], ['Replacement follow-up', 'Change seeds every 5-7 days and adjust points.']],
      faq: [['Can I shower with ear seeds?', 'Yes, but avoid direct soaking and dry gently afterward.'], ['Does it help insomnia?', 'It may help as supportive care, especially when combined with acupuncture or herbs.'], ['What if my skin is sensitive?', 'Tell CMP Kate Woo; low-allergy tape can be used. Remove if there is marked redness or itching.'], ['Can it be used alone?', 'Yes for mild concerns, or combined with other therapies for complex issues.'], ['Is it safe in pregnancy?', 'Usually possible with point selection adjusted; tell CMP Kate Woo if pregnant.']],
      related: ['Acupuncture', 'Internal Medicine Care', 'Weight Management'],
      ctaTitle: 'Book Your Auricular Therapy Session',
      ctaText: 'Auricular therapy is gentle and can be used alone or alongside acupuncture and herbs.'
    },
    'treatment-cupping.html': {
      title: 'Cupping and Gua Sha',
      category: 'Chinese Medicine Treatment',
      hero: 'External therapies to release stagnation, relax muscles, move qi and blood, and help the body feel lighter and freer.',
      whatTitle: 'Traditional Therapies for Circulation and Release',
      what: ['Cupping uses negative pressure to lift the skin and promote local circulation. Gua sha uses repeated scraping along channels to release surface stagnation.', 'They are often used for neck, shoulder and back tension, damp-heavy body sensations, early wind-cold symptoms and certain menstrual stagnation patterns.', 'Marks after treatment are common and usually fade naturally.'],
      compareTitle: 'Microcirculation or Releasing Pathogens',
      west: ['May increase local circulation and lymphatic flow', 'Sometimes viewed as fascia or soft-tissue release', 'Used in pain and sports recovery contexts', 'Marks are small bruising responses rather than literal toxins'],
      tcm: ['Understands pain through qi stagnation, blood stasis, cold and dampness', 'Cupping draws deeper stagnation; gua sha releases surface stagnation', 'Emphasises “free flow means no pain”', 'Mark colour may guide follow-up treatment'],
      detail: 'Cupping and gua sha marks are normal microvascular responses and typically fade within days to two weeks.',
      tags: ['Neck, shoulder and back pain', 'Damp heaviness', 'Qi stagnation and blood stasis', 'Poor menstrual flow', 'Early wind-cold symptoms', 'Dull complexion', 'Fatigue', 'Digestive bloating', 'Muscle recovery'],
      steps: [['Consultation and assessment', 'Identify whether the pattern is cold-damp, qi stagnation or blood stasis.'], ['Choose area and method', 'Select cupping, gua sha or both.'], ['Treatment', 'Cups are retained briefly or gua sha is applied along channels.'], ['Observe marks', 'Mark colour and depth guide interpretation and aftercare.'], ['Aftercare advice', 'Keep warm, drink water and avoid wind or cold.']],
      faq: [['How long do cupping marks last?', 'Usually 3-7 days, sometimes longer if stagnation is marked.'], ['Is gua sha painful?', 'Pressure is adjusted to your tolerance. A warm, sore feeling can be normal.'], ['Can I do it during menstruation or pregnancy?', 'Heavy periods and pregnancy require caution; consult CMP Kate Woo first.'], ['Which should I choose?', 'CMP Kate Woo will choose based on whether the issue is deeper tightness, surface heat, dampness or stagnation.'], ['What should I avoid after treatment?', 'Avoid cold showers, wind exposure and heavy rubbing for several hours.']],
      related: ['Moxibustion', 'Acupuncture', 'Internal Medicine Care'],
      ctaTitle: 'Book Your Cupping or Gua Sha Session',
      ctaText: 'CMP Kate Woo will choose the most suitable external therapy according to your constitution and symptoms.'
    },
    'treatment-moxa.html': {
      title: 'Moxibustion',
      category: 'Chinese Medicine Treatment',
      hero: 'The warmth of mugwort supports yang, dispels cold and is especially suited to cold-deficiency constitutions.',
      whatTitle: 'Warmth That Awakens Yang',
      what: ['Moxibustion burns processed mugwort near selected acupoints to warm the meridians, dispel cold and support yang qi.', 'It is commonly used for cold-type period pain, cold uterus patterns, delayed or scanty periods, postpartum coldness and digestive weakness.', 'CMP Kate Woo chooses the moxa method and points according to safety, constitution and treatment goal.'],
      compareTitle: 'Heat Therapy or Yang Support',
      west: ['Warmth may promote local blood flow and tissue metabolism', 'Comparable in part to heat therapy concepts', 'Ventilation matters for smoke sensitivity', 'Research quality varies by condition'],
      tcm: ['Explains cold pain and weakness through yang deficiency and cold invasion', 'Uses mugwort warmth to unblock and supplement', 'Especially important in gynecological cold-deficiency patterns', 'Often paired with internal herbal care'],
      detail: 'Moxibustion has traditional and emerging evidence in gynaecology, but treatment must be carefully selected, especially in pregnancy.',
      tags: ['Cold uterus', 'Period pain', 'Clots', 'Delayed or scanty periods', 'Cold-type infertility', 'IVF preparation', 'Postpartum coldness', 'Cold hands and feet', 'Low immunity', 'Weak digestion', 'Cold lower back and knees'],
      steps: [['Constitution diagnosis', 'Assess whether yang deficiency or cold-damp patterns are present.'], ['Point selection', 'Choose points such as Guanyuan, Qihai, Sanyinjiao or Shenshu when appropriate.'], ['Choose moxa method', 'Select suspended moxa, moxa box or ginger moxa.'], ['Apply moxa', 'Control warmth and duration, observing skin response closely.'], ['Treatment planning', 'Plan frequency and whether herbs should be combined.']],
      faq: [['Can moxa burn the skin?', 'Under professional care it should feel warm but not burning. Tell CMP Kate Woo immediately if too hot.'], ['Is moxa smoke a problem?', 'Ventilation and low-smoke options can reduce discomfort for sensitive people.'], ['Can pregnant women use moxa?', 'Some pregnancy uses require professional guidance; many abdominal and strong-moving points are avoided.'], ['Can I use it during my period?', 'It may help cold-type pain or scanty flow, but heavy flow requires caution.'], ['Can I do moxa at home?', 'Only after professional guidance because fire safety, point selection and timing matter.']],
      related: ['Herbal Medicine', 'Cupping and Gua Sha', 'Acupuncture'],
      ctaTitle: 'Begin Warm Moxibustion Care',
      ctaText: 'For cold-deficiency constitutions, herbs and moxibustion often work best together.'
    },
    'treatment-internal.html': {
      title: 'Internal Medicine Care',
      category: 'Chinese Medicine Care',
      hero: 'Regulate spleen-stomach, liver and kidney function to support chronic fatigue, digestion, sleep and daily sub-health concerns.',
      whatTitle: 'Care for Everyday Internal Balance',
      what: ['Internal medicine in TCM looks at how digestion, energy, sleep, mood, circulation and organ functions interact.', 'It is suitable for people with chronic discomfort, fatigue or symptoms that remain even when routine checks are normal.', 'CMP Kate Woo uses herbs, acupuncture and lifestyle advice to rebuild regulation gradually.'],
      compareTitle: 'Individual Organs and Whole-System Coordination',
      west: ['Investigates organs, blood tests and imaging findings', 'Treats named diseases and abnormal results', 'Provides essential diagnosis and urgent care', 'May not fully explain sub-health symptoms'],
      tcm: ['Looks at spleen-stomach, liver qi, kidney and qi-blood patterns', 'Treats the person’s overall regulatory state', 'Connects stress, sleep and digestion', 'Works gradually through constitutional care'],
      detail: 'TCM internal care is supportive and should be integrated with appropriate medical investigation when red flags or persistent symptoms are present.',
      tags: ['Chronic fatigue', 'Indigestion', 'Sensitive gut', 'Dizziness', 'Palpitations', 'Insomnia', 'Cold lower back', 'Stress-related gut symptoms', 'Normal tests but persistent discomfort'],
      steps: [['Detailed consultation', 'Review symptoms, lifestyle, tongue and pulse.'], ['Personalised herbs', 'Prescribe according to the core pattern.'], ['Acupuncture support', 'Use points to regulate digestion, sleep, circulation or mood.'], ['Diet and routine advice', 'Make practical changes suited to your constitution.'], ['Regular follow-up', 'Track symptom changes and adjust treatment.']],
      faq: [['Can TCM help when tests are normal?', 'Often it can support sub-health patterns, but persistent or severe symptoms still need medical follow-up.'], ['Do I need both herbs and acupuncture?', 'Not always. The plan depends on your symptoms and preference.'], ['How long does chronic fatigue take?', 'It varies; gradual improvement over weeks to months is common.'], ['Can it help digestion?', 'Yes, digestion is a core focus of TCM internal care.'], ['Is it suitable with Western medication?', 'Often, but please disclose all medication for safety.']],
      related: ['Herbal Medicine', 'Acupuncture', 'Auricular Therapy'],
      ctaTitle: 'Book Internal Medicine Care',
      ctaText: 'CMP Kate Woo will review your symptoms and constitution to create a steady regulation plan.'
    },
    'treatment-oncology.html': {
      title: 'Cancer Supportive Care',
      category: 'Supportive Chinese Medicine',
      hero: 'Supportive TCM care alongside oncology treatment to ease side effects, support strength and improve quality of life.',
      whatTitle: 'Supporting, Not Replacing, Oncology Care',
      what: ['Chinese medicine in cancer care is supportive. It does not replace surgery, chemotherapy, radiotherapy, targeted therapy or immunotherapy.', 'Common goals include easing nausea, dry mouth, fatigue, low appetite, sleep disturbance, mood stress and recovery after treatment.', 'All herbs or acupuncture must be coordinated safely with the oncology team.'],
      compareTitle: 'Two Teams, One Goal',
      west: ['Focuses on tumour control, staging and treatment protocols', 'Uses surgery, chemotherapy, radiotherapy, targeted or immune therapies', 'Manages side effects with evidence-based medication', 'Requires regular scans and blood tests'],
      tcm: ['Focuses on supporting righteous qi and reducing side-effect burden', 'Uses gentle acupuncture and carefully selected herbs', 'Supports sleep, appetite, energy and emotional wellbeing', 'Never delays or replaces oncology treatment'],
      detail: 'Some evidence supports acupuncture for chemotherapy-related nausea, but herbal use during cancer treatment must be checked carefully for interactions.',
      tags: ['Chemotherapy nausea', 'Radiotherapy skin or mucosal reactions', 'Cancer-related fatigue', 'Low white blood cells', 'Low appetite', 'Post-surgery recovery', 'Anxiety and low mood', 'Constitution rebuilding after treatment'],
      steps: [['Diagnosis and treatment-stage review', 'Understand cancer type, stage, current oncology treatment and medications.'], ['Constitution diagnosis', 'Assess qi, blood, yin, yang, deficiency and excess patterns.'], ['Supportive acupuncture and herbs', 'Use gentle methods to ease side effects and support strength.'], ['Oncology communication', 'Confirm herbal safety with the oncology team when needed.'], ['Ongoing adjustment', 'Adapt the plan as treatment stage changes.']],
      faq: [['Can TCM replace chemotherapy or radiotherapy?', 'No. It is supportive care only and should never delay conventional oncology treatment.'], ['Can I take herbs during chemotherapy?', 'Only after safety is checked because interactions are possible.'], ['Can acupuncture help nausea?', 'Some studies support acupuncture or acupressure for chemotherapy-related nausea.'], ['Can I have acupuncture when white blood cells are low?', 'It depends on infection risk and blood counts; tell CMP Kate Woo before treatment.'], ['Is TCM useful after treatment ends?', 'Yes, it may support energy, immunity rebuilding and lingering side effects, alongside oncology follow-up.']],
      related: ['Internal Medicine Care', 'Herbal Medicine', 'Acupuncture'],
      ctaTitle: 'Discuss Supportive TCM Cancer Care',
      ctaText: 'CMP Kate Woo will review your diagnosis and treatment stage, and coordinate care safely with your oncology plan.'
    }
  };

  function normalizedText(node) {
    return node.nodeValue.replace(/\s+/g, ' ').trim();
  }

  function translateTextNodes(root, lang) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!normalizedText(node)) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        if (!parent || /^(SCRIPT|STYLE|TEXTAREA)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (!node.__zhText) node.__zhText = node.nodeValue;
      if (lang === 'zh') {
        node.nodeValue = node.__zhText;
        return;
      }
      var key = normalizedText(node);
      if (TEXT[key]) {
        var leading = (node.__zhText.match(/^\s*/) || [''])[0];
        var trailing = (node.__zhText.match(/\s*$/) || [''])[0];
        node.nodeValue = leading + TEXT[key] + trailing;
      }
    });
  }

  function translateAttributes(lang) {
    document.querySelectorAll('[placeholder], [aria-label], [title]').forEach(function (el) {
      ['placeholder', 'aria-label', 'title'].forEach(function (attr) {
        if (!el.hasAttribute(attr)) return;
        var raw = el.getAttribute(attr);
        var store = '__zh_' + attr;
        if (!el[store]) el[store] = raw;
        if (lang === 'zh') el.setAttribute(attr, el[store]);
        else if (ATTR_TEXT[el[store]]) el.setAttribute(attr, ATTR_TEXT[el[store]]);
      });
    });
  }

  function setMeta(lang) {
    var page = document.body.classList.contains('home-page') || /index\.html$|\/$/.test(location.pathname) ? 'index' : '';
    if (/about\.html$/.test(location.pathname)) page = 'about';
    if (!page || !META[page]) return;
    if (!document.__zhTitle) document.__zhTitle = document.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && !desc.__zhContent) desc.__zhContent = desc.getAttribute('content');
    document.title = lang === 'en' ? META[page].title : document.__zhTitle;
    if (desc) desc.setAttribute('content', lang === 'en' ? META[page].description : desc.__zhContent);
  }

  function currentTreatmentKey() {
    var key = location.pathname.split('/').pop();
    return TREATMENTS[key] ? key : '';
  }

  function renderList(items) {
    return '<ul>' + items.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>';
  }

  function renderTreatmentEnglish(data) {
    var steps = data.steps.map(function (s, i) {
      return '<div class="tx-step"><div class="tx-step-num">' + (i + 1) + '</div><div><div class="tx-step-title">' + s[0] + '</div><div class="tx-step-desc">' + s[1] + '</div></div></div>';
    }).join('');
    var faq = data.faq.map(function (qa) {
      return '<div class="tx-disclosure-item"><button class="tx-disclosure-q">' + qa[0] + '<span class="tx-disclosure-chevron">▼</span></button><div class="tx-disclosure-a">' + qa[1] + '</div></div>';
    }).join('');
    var related = data.related.map(function (name) { return '<a href="../index.html#services">' + name + '</a>'; }).join('');
    return '<div class="tx-section" id="what"><div class="tx-label">What This Treatment Is</div><h2>' + data.whatTitle + '</h2>' + data.what.map(function (p) { return '<p class="tx-prose">' + p + '</p>'; }).join('') + '</div>' +
      '<div class="tx-section" id="compare"><div class="tx-label">TCM and Biomedical Views</div><h2>' + data.compareTitle + '</h2><div class="tx-compare"><div class="tx-compare-card tx-compare-card--west"><div class="tx-compare-badge">🔬</div><h4>Biomedical View</h4>' + renderList(data.west) + '</div><div class="tx-compare-card tx-compare-card--tcm"><div class="tx-compare-badge">🌿</div><h4>TCM View</h4>' + renderList(data.tcm) + '</div></div><div class="tx-more"><div class="tx-disclosure-item"><button class="tx-disclosure-q">More detail: mechanism and evidence<span class="tx-disclosure-chevron">▼</span></button><div class="tx-disclosure-a">' + data.detail + '</div></div></div></div>' +
      '<div class="tx-section" id="who"><div class="tx-label">Who It May Help</div><h2>Symptoms This Treatment May Support</h2><div class="tx-tags">' + data.tags.map(function (tag) { return '<span class="tx-tag">' + tag + '</span>'; }).join('') + '</div></div>' +
      '<div class="tx-section" id="how"><div class="tx-label">How Treatment Works</div><h2>How a Session Works</h2><div class="tx-steps">' + steps + '</div></div>' +
      '<div class="tx-section" id="faq"><div class="tx-label">FAQ</div><h2>Questions You May Have</h2><div class="tx-faq">' + faq + '</div></div>' +
      '<div class="tx-section" style="border-bottom:none; padding-bottom:0;"><div class="tx-label">Related Treatments</div><h2>You May Also Like</h2><div class="tx-related">' + related + '</div></div>' +
      '<div class="tx-cta"><h3>' + data.ctaTitle + '</h3><p>' + data.ctaText + '</p><a href="../index.html#contact" class="btn-white">Book Now →</a></div>';
  }

  function applyTreatmentPage(lang) {
    var key = currentTreatmentKey();
    if (!key) return;
    var data = TREATMENTS[key];
    var heroBody = document.querySelector('.tx-hero .tx-body');
    var mainBody = document.querySelector('section.section .tx-body');
    var toc = document.querySelector('.tx-toc');
    if (!heroBody || !mainBody) return;
    if (!heroBody.__zhHtml) heroBody.__zhHtml = heroBody.innerHTML;
    if (!mainBody.__zhHtml) mainBody.__zhHtml = mainBody.innerHTML;
    if (toc && !toc.__zhHtml) toc.__zhHtml = toc.innerHTML;

    if (lang === 'zh') {
      heroBody.innerHTML = heroBody.__zhHtml;
      mainBody.innerHTML = mainBody.__zhHtml;
      if (toc) toc.innerHTML = toc.__zhHtml;
      if (window.initTreatmentDisclosure) window.initTreatmentDisclosure();
      if (window.initTreatmentToc) window.initTreatmentToc();
      return;
    }

    heroBody.innerHTML = '<div class="tx-breadcrumb"><a href="../index.html">Home</a><span>›</span><a href="../index.html#services">Treatments</a><span>›</span>' + data.title + '</div>' +
      '<div class="tx-hero-icon">' + (document.querySelector('.tx-hero-icon')?.textContent || '🌿') + '</div>' +
      '<div class="tx-hero-tag">' + data.category + '</div><h1>' + data.title + '</h1><p class="tx-hero-sub">' + data.hero + '</p>';
    if (toc) {
      toc.innerHTML = '<a href="#what">What It Is</a><a href="#compare">TCM / Biomedical Views</a><a href="#who">Who It Helps</a><a href="#how">Process</a><a href="#faq">FAQ</a>';
    }
    mainBody.innerHTML = renderTreatmentEnglish(data);
    if (window.initTreatmentDisclosure) window.initTreatmentDisclosure();
    if (window.initTreatmentToc) window.initTreatmentToc();
  }

  function ensureSwitcher() {
    var nav = document.querySelector('.nav-inner') || document.querySelector('.nav');
    if (!nav || document.getElementById('langSwitch')) return;
    var wrap = document.createElement('div');
    wrap.className = 'lang-switch';
    wrap.id = 'langSwitch';
    wrap.setAttribute('aria-label', 'Language switcher');
    wrap.innerHTML = '<button type="button" data-lang="zh">繁</button><span>/</span><button type="button" data-lang="en">EN</button>';
    var toggle = document.getElementById('navToggle');
    nav.insertBefore(wrap, toggle || null);
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      applyLanguage(btn.dataset.lang);
    });
  }

  function updateSwitcher(lang) {
    document.querySelectorAll('#langSwitch button').forEach(function (btn) {
      var active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function applyLanguage(lang) {
    lang = lang === 'en' ? 'en' : 'zh';
    setLang(lang);
    document.documentElement.lang = lang === 'en' ? 'en-HK' : 'zh-Hant-HK';
    applyTreatmentPage(lang);
    translateTextNodes(document.body, lang);
    translateAttributes(lang);
    setMeta(lang);
    updateSwitcher(lang);
    document.dispatchEvent(new CustomEvent('drhu:languagechange', { detail: { lang: lang } }));
  }

  function init() {
    ensureSwitcher();
    applyLanguage(getLang());
  }

  window.DrHuI18n = {
    applyLanguage: applyLanguage,
    getLang: getLang,
    text: TEXT,
    treatments: TREATMENTS
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
