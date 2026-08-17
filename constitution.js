// 中醫九種體質問卷 — 依據中華中醫藥學會《中醫體質分類與判定》ZYYXH/T157-2009
// 完整版：依標準量表條目編排，60 題填答、66 項分量表計分
// （平和8・氣虛8・陽虛7・陰虛8・痰濕8・濕熱6・血瘀7・氣鬱7・特稟7）
// 精簡版：自標準量表節選核心條目，25 題填答、27 項計分，供快速初篩
// 計分：轉化分 =［(原始分 − 條目數) / (條目數 × 4)］× 100
//   平和質條目為反向計分（「精力充沛」「能適應外界變化」為正向；其餘為反向）
//   平和質：轉化分 ≥60 且其他八種 <30 → 純平和質；≥60 且其他 <40 → 基本平和質
//   偏頗質：轉化分 ≥40 → 是；30–39 → 傾向是；<30 → 否

// ─── Override Store (populated by admin panel) ────────────────────────────
const CQ_OV = (() => {
  try { return JSON.parse(localStorage.getItem('drhu_cq_overrides') || '{}'); } catch(_) { return {}; }
})();
const cqOv    = (k, d) => k in CQ_OV ? CQ_OV[k] : d;
const cqOvArr = (k, d) => (k in CQ_OV && CQ_OV[k]) ? CQ_OV[k].split('\n').filter(s => s.trim()) : d;

function escHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
}

function applyConstitutionOv(c, ci) {
  return {
    ...c,
    name:            cqOv(ci+'.name',             c.name),
    tagline:         cqOv(ci+'.tagline',           c.tagline),
    description:     cqOv(ci+'.description',       c.description),
    recommendations: cqOvArr(ci+'.recommendations', c.recommendations),
    foods:           cqOvArr(ci+'.foods',            c.foods),
    avoid:           cqOvArr(ci+'.avoid',            c.avoid),
  };
}

// ─── Constitution Data ─────────────────────────────────────────────────────
const constitutions = [
  {
    id: 'balanced',
    name: '平和質',
    emoji: '⚖️',
    img: 'constitution/balanced-type.PNG',
    color: '#7A9E7E',
    tagline: '陰陽調和，氣血充足',
    description: '恭喜您！平和質是最健康、最理想的體質。簡單來說，您的身體「運作順暢、內外平衡」——精神好、睡得香、吃得下、面色紅潤，情緒穩定，對環境變化的適應力也很強，平常不太容易生病。這種狀態需要靠良好的生活習慣持續維持。',
    recommendations: [
      '飲食均衡多樣，五穀、蔬果、蛋白質都要吃，別偏食',
      '作息規律，盡量 23 點前睡，每天睡足 7–8 小時',
      '每週運動 3–5 次，散步、游泳、太極都很適合',
      '保持好心情，多與人來往、培養興趣',
      '每年做一次健康檢查，把小問題擋在前面'
    ],
    foods: ['五穀雜糧、時令蔬果', '優質蛋白質（魚、蛋、豆）', '淮山、蓮子、紅棗（平補少量即可）'],
    avoid: ['過度偏食（全素或全肉）', '長期熬夜破壞平衡', '過度勞累或壓力積累'],
    shortQuestions: [
      { text: '您精力充沛嗎？', reverse: false },
      { text: '您容易疲乏嗎？', reverse: true, hideInSimple: true, answerFrom: '1_0' },
      { text: '您感到悶悶不樂、情緒低沉嗎？', reverse: true, hideInSimple: true, answerFrom: '7_0' },
    ],
    questions: [
      { text: '您精力充沛嗎？', reverse: false },
      { text: '您容易疲乏嗎？', reverse: true, hideInComplex: true, answerFrom: '1_0' },
      { text: '您說話聲音低弱無力嗎？', reverse: true, hideInComplex: true, answerFrom: '1_6' },
      { text: '您感到悶悶不樂、情緒低沉嗎？', reverse: true, hideInComplex: true, answerFrom: '7_0' },
      { text: '您比一般人耐受不了寒冷（冬天的寒冷，夏天的冷氣、風扇等）嗎？', reverse: true, hideInComplex: true, answerFrom: '2_3' },
      { text: '您能適應外界自然和社會環境的變化嗎？', reverse: false },
      { text: '您容易失眠嗎？', reverse: true },
      { text: '您容易忘事（健忘）嗎？', reverse: true, hideInComplex: true, answerFrom: '6_5' },
    ]
  },
  {
    id: 'qiDef',
    img: 'constitution/qi-deficiency.PNG',
    name: '氣虛質',
    emoji: '🌬️',
    color: '#B8C4A8',
    tagline: '元氣不足，容易疲乏',
    description: '「氣」是身體的能量來源，氣虛就像手機電量不足。您可能常覺得累、提不起勁、講話有氣無力，稍微動一下就流汗、容易喘，也比別人更容易感冒。這是身體能量偏低、臟腑運作力道不夠的表現，調理重點在「補氣、養脾胃」，慢慢把電充回來。',
    recommendations: [
      '別硬撐，作息規律、睡眠充足最重要',
      '多吃補氣食物：黃耆燉雞、紅棗桂圓茶、山藥粥',
      '選溫和的運動：八段錦、散步、瑜伽，避免爆汗',
      '注意保暖、少說耗力的話，減少感冒機會',
      '可艾灸足三里、氣海、關元幫助補養元氣'
    ],
    foods: ['山藥、小米、白米、南瓜、雞蛋', '雞肉、牛肉、白扁豆、豆腐、豆漿', '黃耆、黨參、紅棗、蓮子、桂圓（煲湯泡茶）'],
    avoid: ['生冷冰品、手搖凍飲', '油炸油膩、生蘿蔔（耗氣）', '濃咖啡、能量飲（提神是透支）'],
    shortQuestions: [
      { text: '您容易疲乏嗎？', reverse: false },
      { text: '您容易氣短（呼吸短促，接不上氣）嗎？', reverse: false },
      { text: '您說話聲音低弱無力嗎？', reverse: false },
    ],
    questions: [
      { text: '您容易疲乏嗎？', reverse: false },
      { text: '您容易氣短（呼吸短促，接不上氣）嗎？', reverse: false },
      { text: '您容易心慌嗎？', reverse: false },
      { text: '您容易頭暈或站起時眩暈嗎？', reverse: false },
      { text: '您比別人容易患感冒嗎？', reverse: false },
      { text: '您喜歡安靜、懶得說話嗎？', reverse: false },
      { text: '您說話聲音低弱無力嗎？', reverse: false },
      { text: '您活動量稍大就容易出虛汗嗎？', reverse: false },
    ]
  },
  {
    id: 'yangDef',
    img: 'constitution/yang-deficiency.PNG',
    name: '陽虛質',
    emoji: '🧊',
    color: '#A8C4D4',
    tagline: '陽氣不足，畏寒怕冷',
    description: '「陽氣」就像身體裡的暖爐，陽虛的人暖爐火力偏弱，所以特別怕冷、手腳冰涼，別人穿一件您要穿兩件。吃喝生冷容易腸胃不適、拉肚子，喝熱的或熱敷會比較舒服。調理方向是「幫身體加溫、補足陽氣」，讓暖爐重新旺起來。',
    recommendations: [
      '注意腹部、腰部保暖，冬天可加穿護腰、護腹',
      '每日艾灸關元、腎俞、命門 10–15 分鐘暖身',
      '飲食吃溫熱：薑、蔥、韭菜、羊肉等溫陽食物',
      '每天上午曬太陽約 30 分鐘補充陽氣',
      '睡前用 40°C 溫水泡腳 20 分鐘，改善手腳冰冷'
    ],
    foods: ['羊肉、雞肉、蝦、韭菜、生薑', '南瓜、核桃、栗子', '龍眼、荔枝（適量）', '肉桂、當歸、杜仲、薑棗茶'],
    avoid: ['生冷冰品、凍飲、刺身', '寒涼瓜菜（苦瓜、冬瓜、白蘿蔔）', '西瓜、螃蟹、綠豆等寒物'],
    shortQuestions: [
      { text: '您手腳發涼嗎？', reverse: false },
      { text: '您感到怕冷、衣服比別人穿得多嗎？', reverse: false },
      { text: '您吃（喝）涼的東西會感到不舒服或者怕吃（喝）涼的東西嗎？', reverse: false },
    ],
    questions: [
      { text: '您手腳發涼嗎？', reverse: false },
      { text: '您胃脘部、背部或腰膝部怕冷嗎？', reverse: false },
      { text: '您感到怕冷、衣服比別人穿得多嗎？', reverse: false },
      { text: '您比一般人耐受不了寒冷（冬天的寒冷，夏天的冷氣、風扇等）嗎？', reverse: false },
      { text: '您比別人容易患感冒嗎？', reverse: false, hideInComplex: true, answerFrom: '1_4' },
      { text: '您吃（喝）涼的東西會感到不舒服或者怕吃（喝）涼的東西嗎？', reverse: false },
      { text: '您受涼或吃（喝）涼的東西後，容易腹瀉（拉肚子）嗎？', reverse: false },
    ]
  },
  {
    id: 'yinDef',
    img: 'constitution/yin-deficiency.PNG',
    name: '陰虛質',
    emoji: '🔥',
    color: '#E8A898',
    tagline: '陰液虧虛，虛火偏旺',
    description: '「陰液」是身體裡的水分與滋潤，陰虛就像身體缺水、容易「乾燒」。您可能常感手心腳心發熱、口乾想喝水、晚上盜汗、睡不安穩、心情煩躁，皮膚偏乾也常見。調理方向是「幫身體補水、降虛火」，把滋潤補回來。',
    recommendations: [
      '早點睡（23 點前），熬夜最傷陰、最耗水',
      '多吃滋潤食物：銀耳百合湯、枸杞菊花茶、桑椹飲',
      '學著放鬆，避免情緒太激動或過度焦慮',
      '選溫和運動如游泳、瑜伽，避免大汗淋漓',
      '可用枸杞、麥冬、石斛泡茶，日常養陰'
    ],
    foods: ['鴨肉、豆腐、蓮藕、銀耳、百合', '雪梨、桑椹、甘蔗（生津潤燥）', '麥冬、玉竹、石斛、沙參、枸杞'],
    avoid: ['辛辣溫燥（辣椒、薑蒜多、羊肉）', '油炸燒烤煎炸', '濃咖啡、烈酒、濃茶、熬夜'],
    shortQuestions: [
      { text: '您感到手腳心發熱嗎？', reverse: false },
      { text: '您感到眼睛乾澀嗎？', reverse: false },
      { text: '您感到口乾咽燥、總想喝水嗎？', reverse: false },
    ],
    questions: [
      { text: '您感到手腳心發熱嗎？', reverse: false },
      { text: '您感覺身體、臉上發熱嗎？', reverse: false },
      { text: '您皮膚或口唇乾嗎？', reverse: false },
      { text: '您口唇的顏色比一般人紅嗎？', reverse: false },
      { text: '您容易便秘或大便乾燥嗎？', reverse: false },
      { text: '您面部兩顴潮紅或偏紅嗎？', reverse: false },
      { text: '您感到眼睛乾澀嗎？', reverse: false },
      { text: '您感到口乾咽燥、總想喝水嗎？', reverse: false },
    ]
  },
  {
    id: 'phlegmDamp',
    img: 'constitution/phlegm-dampness.PNG',
    name: '痰濕質',
    emoji: '💧',
    color: '#C4B8A8',
    tagline: '痰濕凝聚，形體肥胖',
    description: '痰濕就像身體裡的「水沒排乾淨」，濕氣和廢物堆積起來變成黏膩的痰濕。您可能覺得身體沉重、懶洋洋、容易發胖（尤其肚子鬆軟）、臉部出油、嘴裡黏黏的、痰比較多。調理重點是「動起來、把濕排掉」，健脾祛濕加上規律運動效果最好。',
    recommendations: [
      '每天做 30 分鐘以上有氧運動（快走、游泳、騎車），這點最關鍵',
      '飲食清淡，少糖少油，控制精緻澱粉',
      '喝薏仁茯苓粥、陳皮茶、荷葉茶幫助祛濕',
      '居家保持乾燥通風，別待在太潮濕的環境',
      '定期量體重、追蹤血糖與血脂'
    ],
    foods: ['薏米、赤小豆、冬瓜、白扁豆', '玉米、白蘿蔔、黑豆、燕麥', '陳皮、茯苓、五指毛桃、荷葉'],
    avoid: ['肥甘甜膩（肥肉、油炸、糕點）', '含糖飲品、生冷冰品', '啤酒、久坐不動'],
    shortQuestions: [
      { text: '您感到身體沉重不輕鬆或不爽快嗎？', reverse: false },
      { text: '您腹部肥滿鬆軟嗎？', reverse: false },
      { text: '您嘴裡有黏黏的感覺嗎？', reverse: false },
    ],
    questions: [
      { text: '您感到胸悶或腹部脹滿嗎？', reverse: false },
      { text: '您感到身體沉重不輕鬆或不爽快嗎？', reverse: false },
      { text: '您腹部肥滿鬆軟嗎？', reverse: false },
      { text: '您有額部油脂分泌多的現象嗎？', reverse: false },
      { text: '您上眼瞼比別人腫（有輕微隆起的現象）嗎？', reverse: false },
      { text: '您嘴裡有黏黏的感覺嗎？', reverse: false },
      { text: '您平時痰多，特別是咽喉部總感到有痰堵著嗎？', reverse: false },
      { text: '您舌苔厚膩或有舌苔厚厚的感覺嗎？', reverse: false },
    ]
  },
  {
    id: 'dampHeat',
    img: 'constitution/damp-heat.PNG',
    name: '濕熱質',
    emoji: '🌡️',
    color: '#D4A870',
    tagline: '濕熱內蘊，面垢油光',
    description: '濕熱就像身體裡又「濕」又「悶熱」，像梅雨季一樣黏膩上火。您可能臉部油光、容易長痘痘或粉刺、嘴巴苦或有異味、大便黏馬桶、解不乾淨，身體悶熱、人也容易煩躁。調理重點是「清熱又去濕」，其中飲食和作息的調整最關鍵。',
    recommendations: [
      '飲食清淡，辛辣、油炸、甜食和酒都要盡量避開',
      '作息規律不熬夜，熬夜會讓體內更「上火」',
      '喝蒲公英茶、薏仁綠豆湯幫助清熱去濕',
      '注意個人衛生，穿透氣的棉質衣物',
      '可請中醫以清肝膽濕熱方向調理（如龍膽瀉肝方向）'
    ],
    foods: ['綠豆、赤小豆、冬瓜、苦瓜、絲瓜', '青瓜、芹菜、通菜、蓮藕、鴨肉', '土茯苓、綿茵陳、夏枯草、菊花'],
    avoid: ['辛辣燒烤、羊肉、龍眼／榴槤', '油炸肥膩、煎炸', '酒精、甜膩、熬夜'],
    shortQuestions: [
      { text: '您面部或鼻部有油膩感或者油亮發光嗎？', reverse: false },
      { text: '您容易生痤瘡或瘡癤嗎？', reverse: false },
      { text: '您感到口苦或嘴裡有異味嗎？', reverse: false },
    ],
    questions: [
      { text: '您面部或鼻部有油膩感或者油亮發光嗎？', reverse: false },
      { text: '您容易生痤瘡或瘡癤嗎？', reverse: false },
      { text: '您感到口苦或嘴裡有異味嗎？', reverse: false },
      { text: '您大便黏滯不爽、有解不盡的感覺嗎？', reverse: false },
      { text: '您小便時尿道有發熱感、尿色濃（深）嗎？', reverse: false },
      { text: '女性：您帶下色黃（白帶顏色發黃）嗎？男性：您的陰囊部位潮濕嗎？', reverse: false },
    ]
  },
  {
    id: 'bloodStasis',
    img: 'constitution/blood-stasis.PNG',
    name: '血瘀質',
    emoji: '🔴',
    color: '#8C6878',
    tagline: '血行不暢，以瘀為主',
    description: '血瘀就像身體的「交通不順、血流塞車」，血液循環比較慢。您可能面色偏暗沉、有黑眼圈、容易長斑、嘴唇顏色偏暗，身體某處常固定刺痛或痠痛，這是血路不通的訊號。調理重點是「活血化瘀、讓血流順暢」，動一動、保持溫暖都有幫助。',
    recommendations: [
      '規律運動（快走、舞蹈、太極）促進血液循環',
      '保持心情舒暢，情緒悶住也會讓血更瘀',
      '喝山楂玫瑰茶、當歸田七烏雞湯幫助活血',
      '別久坐久站，每隔一段時間起來走動',
      '注意保暖，身體受寒會讓血更不流通'
    ],
    foods: ['黑木耳、洋蔥、山楂、黑豆', '油菜、胡蘿蔔、茄子、香菇', '玫瑰花、當歸、田七、丹參（部分需醫師指導）'],
    avoid: ['生冷冰凍（血遇寒則凝）', '肥膩油炸、甜食', '烏梅、柿子等收澀酸味'],
    shortQuestions: [
      { text: '您面色晦暗或容易出現褐斑嗎？', reverse: false },
      { text: '您容易有黑眼圈嗎？', reverse: false },
      { text: '您口唇顏色偏暗嗎？', reverse: false },
    ],
    questions: [
      { text: '您的皮膚在不知不覺中會出現青紫瘀斑（皮下出血）嗎？', reverse: false },
      { text: '您兩顴部有細微紅絲嗎？', reverse: false },
      { text: '您身體上有哪裡疼痛嗎？', reverse: false },
      { text: '您面色晦暗或容易出現褐斑嗎？', reverse: false },
      { text: '您容易有黑眼圈嗎？', reverse: false },
      { text: '您容易忘事（健忘）嗎？', reverse: false },
      { text: '您口唇顏色偏暗嗎？', reverse: false },
    ]
  },
  {
    id: 'qiStag',
    img: 'constitution/qi-stagnation.PNG',
    name: '氣鬱質',
    emoji: '💭',
    color: '#9888C4',
    tagline: '氣機鬱滯，情志不暢',
    description: '氣鬱和情緒關係最密切，就像心裡的「氣悶住、卡住了」。您可能容易心情低落、胸悶、常不自覺嘆氣、想太多、比較敏感，有時感覺喉嚨卡卡的（吞不下也吐不出），壓力大、久悶不抒時更明顯。調理重點是「疏解情緒、讓氣順起來」，放鬆和運動特別有效。',
    recommendations: [
      '多到戶外走走：散步、登山、看海都好',
      '練習深呼吸、正念冥想，幫自己放鬆',
      '喝玫瑰花茶、合歡花茶、佛手茶疏解鬱悶',
      '別悶著，多和信任的人聊聊、建立支持圈',
      '規律運動（跑步、跳舞）是很好的情緒出口'
    ],
    foods: ['蘿蔔、洋蔥、金針花、蕎麥', '柑橘、金桔、柚子、檸檬', '玫瑰花、陳皮、佛手、茉莉花、合歡花'],
    avoid: ['冰冷寒涼（令氣機更滯）', '烏梅等收斂酸澀', '濃咖啡、烈酒、油膩重口'],
    shortQuestions: [
      { text: '您感到悶悶不樂、情緒低沉嗎？', reverse: false },
      { text: '您容易精神緊張、焦慮不安嗎？', reverse: false },
      { text: '您多愁善感、感情脆弱嗎？', reverse: false },
    ],
    questions: [
      { text: '您感到悶悶不樂、情緒低沉嗎？', reverse: false },
      { text: '您容易精神緊張、焦慮不安嗎？', reverse: false },
      { text: '您多愁善感、感情脆弱嗎？', reverse: false },
      { text: '您容易感到害怕或受到驚嚇嗎？', reverse: false },
      { text: '您脅肋部或乳房脹痛嗎？', reverse: false },
      { text: '您無緣無故嘆氣嗎？', reverse: false },
      { text: '您咽喉部有異物感，且吐之不出、咽之不下嗎？', reverse: false },
    ]
  },
  {
    id: 'special',
    img: 'constitution/allergic-type.PNG',
    name: '特稟質',
    emoji: '🌿',
    color: '#C4D4A8',
    tagline: '先天特稟，過敏體質',
    description: '特稟質簡單說就是「天生比較敏感的過敏體質」，多和遺傳或環境有關。您可能容易過敏性鼻炎、氣喘、皮膚起蕁麻疹，或對某些食物、藥物、花粉特別敏感。調理重點是「增強身體防護力、調節免疫」，同時盡量遠離過敏原，需要耐心長期調養。',
    recommendations: [
      '找出並遠離自己的過敏原（花粉、塵蟎、特定食物等）',
      '可喝黃耆防風白朮茶增強體表防護力（玉屏風散方向）',
      '保持室內清潔，定期清洗、曝曬寢具',
      '外出戴口罩，花粉季做好防護',
      '體質調理要有耐心，長期堅持才見效'
    ],
    foods: ['山藥、白扁豆、蓮子、南瓜、糙米', '黃耆、白朮、防風（玉屏風散）', '紅棗、枸杞、靈芝（固表抗敏）'],
    avoid: ['個人已知過敏原（最重要）', '蝦蟹、魚腥、蠶豆、芒果等發物', '辛辣、酒精、生冷、加工食品'],
    shortQuestions: [
      { text: '您容易過敏（對藥物、食物、氣味、花粉或在季節交替、氣候變化時）嗎？', reverse: false },
      { text: '您的皮膚容易起蕁麻疹（風團、風疹塊、風疙瘩）嗎？', reverse: false },
      { text: '您沒有感冒時也會打噴嚏嗎？', reverse: false },
    ],
    questions: [
      { text: '您沒有感冒時也會打噴嚏嗎？', reverse: false },
      { text: '您沒有感冒時也會鼻塞、流鼻涕嗎？', reverse: false },
      { text: '您有因季節變化、溫度變化或異味等原因而咳喘的現象嗎？', reverse: false },
      { text: '您容易過敏（對藥物、食物、氣味、花粉或在季節交替、氣候變化時）嗎？', reverse: false },
      { text: '您的皮膚容易起蕁麻疹（風團、風疹塊、風疙瘩）嗎？', reverse: false },
      { text: '您的皮膚因過敏出現過紫癜（紫紅色瘀點、瘀斑）嗎？', reverse: false },
      { text: '您的皮膚一抓就紅，並出現抓痕嗎？', reverse: false },
    ]
  }
];

const SCALE_LABELS = ['沒有', '很少', '有時', '經常', '總是'];

// Neutral topic names — no constitution labels shown to the user
const TOPICS = [
  { title: '整體狀態',   desc: '關於您整體精力、睡眠與身體適應力' },
  { title: '精力與體能', desc: '關於您日常的能量狀態與體力表現' },
  { title: '寒熱偏性',   desc: '關於您對冷熱環境的感受與反應' },
  { title: '乾燥與燥熱', desc: '關於體內津液與燥熱感的情況' },
  { title: '水分代謝',   desc: '關於身體水分與濕氣代謝的狀態' },
  { title: '熱象反應',   desc: '關於體表分泌物與熱象的表現' },
  { title: '血液循環',   desc: '關於血流狀況與外在色澤的表現' },
  { title: '情緒與心理', desc: '關於情緒反應模式與心理狀態' },
  { title: '過敏與免疫', desc: '關於您對外界刺激的敏感程度' },
];

let quizMode = 'simple'; // 'simple' (3 q/section) or 'complex' (66 scored items)
let userName = '';

function getPageQuestions(ci) {
  const c = constitutions[ci];
  return quizMode === 'simple' ? c.shortQuestions : c.questions;
}

function answerKey(ci, qi) {
  return ci + '_' + qi;
}

function shouldHideQuestion(q) {
  return (quizMode === 'complex' && q.hideInComplex) || (quizMode === 'simple' && q.hideInSimple);
}

function getStoredAnswer(ci, qi, q) {
  const direct = allAnswers[answerKey(ci, qi)];
  if (direct) return direct;
  return q.answerFrom ? allAnswers[q.answerFrom] : undefined;
}

function getVisibleQuestionRefs(ci) {
  return getPageQuestions(ci)
    .map((q, qi) => ({ q, qi }))
    .filter(({ q }) => !shouldHideQuestion(q));
}

// ─── Override text for question ───────────────────────────────────────────
function getConstitutionText(ci, qi, defaultText) {
  const newKey = ci + '.q.' + qi + '.text';

  if (newKey in CQ_OV) return CQ_OV[newKey];
  try {
    const ov = JSON.parse(localStorage.getItem('drhu_quiz_text') || '{}');
    return (ov.constitution || {})[`${ci}_${qi}`] || defaultText;
  } catch (_) { return defaultText; }
}

// ─── Multi-page quiz state ────────────────────────────────────────────────
let cqPage = 0;
let allAnswers = {}; // keyed "ci_qi" → integer 1-5

// ─── Progress bar ─────────────────────────────────────────────────────────
function updateProgress(pageIndex) {
  const totalQ = constitutions.reduce((s, _, i) => s + getVisibleQuestionRefs(i).length, 0);
  const answeredQ = constitutions.reduce((s, _, i) => (
    s + getVisibleQuestionRefs(i).filter(({ q, qi }) => getStoredAnswer(i, qi, q)).length
  ), 0);
  const pct = Math.min(95, (answeredQ / totalQ) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  const pageRefs = getVisibleQuestionRefs(pageIndex);
  const pageTotal = pageRefs.length;
  const pageAnswered = pageRefs.filter(({ q, qi }) => getStoredAnswer(pageIndex, qi, q)).length;
  document.getElementById('progressText').textContent =
    `第 ${pageIndex + 1} / ${constitutions.length} 部分　已填 ${pageAnswered} / ${pageTotal} 題`;
}

// ─── Render one page ──────────────────────────────────────────────────────
function renderPage(pageIndex) {
  const ci = pageIndex;
  const topic = TOPICS[ci];
  const isLast = pageIndex === constitutions.length - 1;
  const container = document.getElementById('quizContainer');
  const qRefs = getVisibleQuestionRefs(ci);
  document.querySelector('.cq-progress-meta')?.classList.remove('is-intro');
  document.querySelector('.cq-hero-desc')?.style.setProperty('display', 'none');


  const qHtml = qRefs.map(({ q, qi }, displayIndex) => {
    const saved = getStoredAnswer(ci, qi, q);
    const scaleHtml = SCALE_LABELS.map((label, val) => {
      const id = 'q_' + ci + '_' + qi + '_' + val;
      const checked = saved === (val + 1) ? 'checked' : '';
      return `<input type="radio" name="q_${ci}_${qi}" id="${id}" value="${val + 1}" ${checked}>` +
             `<label for="${id}">${label}</label>`;
    }).join('');
    return `<div class="question-block">
      <div class="question-text">${displayIndex + 1}. ${escHtml(getConstitutionText(ci, qi, q.text))}</div>
      <div class="options-scale">${scaleHtml}</div>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="cq-page-header">
      <div class="cq-page-step">第 ${pageIndex + 1} 部分，共 ${constitutions.length} 部分</div>
      <div class="cq-page-title">${topic.title}</div>
      <div class="cq-page-tagline">${topic.desc}</div>
      <div class="cq-page-hint">請依照<strong>最近一個月</strong>的狀況如實填答</div>
    </div>
    <div class="cq-scale-legend">
      ${SCALE_LABELS.map((l, i) => `<span><strong>${i + 1}</strong> ${l}</span>`).join('')}
    </div>
    ${qHtml}
    <div class="cq-nav">
      ${pageIndex > 0
        ? `<button class="btn btn-outline" onclick="cqPrev()">← 上一部分</button>`
        : `<div></div>`}
      <button class="btn btn-primary" id="cqNextBtn" onclick="${isLast ? 'cqSubmit()' : 'cqNext()'}">
        ${isLast ? '查看評估結果 →' : '下一部分 →'}
      </button>
    </div>
  `;

  container.querySelectorAll('input[type=radio]').forEach(inp => {
    inp.addEventListener('change', () => {
      const parts = inp.name.split('_');
      allAnswers[parts[1] + '_' + parts[2]] = parseInt(inp.value);
      updateProgress(pageIndex);
    });
  });

  updateProgress(pageIndex);
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cqNext() {
  const missing = getVisibleQuestionRefs(cqPage).filter(({ q, qi }) => !getStoredAnswer(cqPage, qi, q)).length;
  if (missing > 0) {
    showCqError(`本頁還有 ${missing} 題未填，請完整作答後繼續。`);
    return;
  }
  cqPage++;
  renderPage(cqPage);
}

function cqPrev() {
  cqPage--;
  renderPage(cqPage);
}

function cqSubmit() {
  const missing = getVisibleQuestionRefs(cqPage).filter(({ q, qi }) => !getStoredAnswer(cqPage, qi, q)).length;
  if (missing > 0) {
    showCqError(`本頁還有 ${missing} 題未填，請完整作答後繼續。`);
    return;
  }
  calculateResults();
}

function showCqError(msg) {
  let el = document.getElementById('cqError');
  if (!el) {
    el = document.createElement('div');
    el.id = 'cqError';
    el.style.cssText = 'background:#FEF2F2;border:1.5px solid #FCA5A5;border-radius:10px;padding:.75rem 1rem;color:#991B1B;font-size:.88rem;margin-bottom:1rem;';
    const nav = document.querySelector('.cq-nav');
    if (nav) nav.parentNode.insertBefore(el, nav);
  }
  el.textContent = '⚠ ' + msg;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── (Tongue analysis removed) ────────────────────────────────────────────


let _resultState = null;

// ─── Calculate Results ────────────────────────────────────────────────────
function calculateResults() {
  const results = constitutions.map((c, ci) => {
    const qs = getPageQuestions(ci);
    const scores = qs.map((q, qi) => {
      let val = getStoredAnswer(ci, qi, q);
      if (!val) return null;
      if (q.reverse) val = 6 - val;
      return val;
    });
    if (scores.includes(null)) return null;
    const n = qs.length;
    const raw = scores.reduce((a, b) => a + b, 0);
    const transformed = ((raw - n) / (n * 4)) * 100;
    return { ...c, score: Math.round(transformed) };
  });

  if (results.includes(null)) {
    showCqError('部分題目未填寫，請返回補齊。');
    return;
  }

  const balanced = results.find(r => r.id === 'balanced');
  const biased = results.filter(r => r.id !== 'balanced');
  const biasedMax = Math.max(...biased.map(r => r.score));

  let primary;
  let balancedLabel = null;
  if (balanced.score >= 60 && biasedMax < 40) {
    // 平和質（純 or 基本）— 平和質當主體質
    primary = balanced;
    balancedLabel = biasedMax < 30 ? '純平和質' : '基本平和質';
  } else {
    // 偏頗質條件：從 8 種偏頗質中取最高分（平和質不參與此競爭）
    primary = [...biased].sort((a, b) => b.score - a.score)[0];
  }

  // 兼夾體質：排除主體質與平和質，快速版 ≥40 / 詳細版 ≥30，只顯示最高 1 個
  const secThreshold = quizMode === 'simple' ? 40 : 30;
  const secondary = results
    .filter(r => r.id !== primary.id && r.id !== 'balanced' && r.score >= secThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, 1);

  renderResults(primary, secondary, results, balancedLabel);
}

// ─── Radar Chart (interactive) ───────────────────────────────────────────
function drawRadarChart(all, primaryColor) {
  const n = all.length;
  const cx = 265, cy = 248;
  const maxR = 138;
  const labelR = 192;

  function toXY(i, pct) {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    return [
      cx + maxR * pct * Math.cos(angle),
      cy + maxR * pct * Math.sin(angle)
    ];
  }

  const levels = [0.25, 0.5, 0.75, 1.0];
  const gridSVG = levels.map(lev => {
    const pts = all.map((_, i) => toXY(i, lev).map(v => v.toFixed(1)).join(',')).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="#D0C8C0" stroke-width="${lev === 1 ? 1.5 : 1}" opacity="${lev === 1 ? 0.6 : 0.25}"/>`;
  }).join('');

  const axisSVG = all.map((_, i) => {
    const [x2, y2] = toXY(i, 1);
    return `<line class="radar-axis" data-idx="${i}" x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#D0C8C0" stroke-width="1" opacity="0.4"/>`;
  }).join('');

  const scorePts = all.map((r, i) => {
    const pct = Math.max(0, Math.min(100, r.score)) / 100;
    return toXY(i, pct).map(v => v.toFixed(1)).join(',');
  }).join(' ');

  const labelSVG = all.map((r, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    const lx = (cx + labelR * Math.cos(angle)).toFixed(1);
    const cosA = Math.cos(angle);
    const anchor = cosA > 0.15 ? 'start' : cosA < -0.15 ? 'end' : 'middle';
    const high = r.score >= 40;
    const tend = r.score >= 30;
    const fill = high ? r.color : tend ? r.color + 'BB' : '#C0B8B0';
    const fw = high ? '700' : '400';
    const ly = (cy + labelR * Math.sin(angle)).toFixed(1);
    return `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="middle"
      font-size="12" fill="${fill}" font-weight="${fw}"
      font-family="Noto Sans TC,sans-serif">${r.emoji} ${r.name}</text>`;
  }).join('');

  // Vertex dots for interaction
  const dotsSVG = all.map((r, i) => {
    const pct = Math.max(0, Math.min(100, r.score)) / 100;
    const [vx, vy] = toXY(i, pct);
    return `<circle class="radar-dot" data-idx="${i}" cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="5" fill="${r.color}" opacity="0.7" style="cursor:pointer;transition:r .15s,opacity .15s"/>`;
  }).join('');

  return `
    <div style="position:relative;">
      <svg id="cqRadarSvg" viewBox="0 0 530 496" style="width:100%;max-width:480px;display:block;margin:0 auto;cursor:crosshair;" role="img" aria-label="九種體質傾向雷達圖">
        <g id="radarHighlight"></g>
        ${gridSVG}${axisSVG}
        <polygon points="${scorePts}" fill="${primaryColor}28" stroke="${primaryColor}" stroke-width="2.5" stroke-linejoin="round"/>
        ${dotsSVG}${labelSVG}
      </svg>
      <div id="radarTooltip" style="display:none;text-align:center;margin-top:.5rem;padding:.45rem 1rem;background:var(--cream);border:1.5px solid var(--border);border-radius:99px;font-size:.88rem;align-items:center;gap:.5rem;justify-content:center;flex-wrap:wrap;"></div>
    </div>`;
}

// ─── Radar interaction (called after DOM insertion) ───────────────────────
function initRadarInteraction(all) {
  const svg = document.getElementById('cqRadarSvg');
  const tooltip = document.getElementById('radarTooltip');
  if (!svg || !tooltip) return;

  const n = all.length;
  const cx = 265, cy = 248, maxR = 138;
  const markedBiasedIds = new Set(
    all
      .filter(c => c.id !== 'balanced' && c.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(c => c.id)
  );

  function tendencyLabel(c) {
    if (c.id === 'balanced') {
      if (c.score >= 60) return c.score >= 70 ? '純平和質' : '基本平和質';
      return '非平和質';
    }
    if (c.score >= 40 && markedBiasedIds.has(c.id)) return '明顯偏頗';
    if (c.score >= 30) return '輕度傾向';
    return '無明顯傾向';
  }

  function nearestIdx(clientX, clientY) {
    const rect = svg.getBoundingClientRect();
    const svgX = (clientX - rect.left) * (530 / rect.width);
    const svgY = (clientY - rect.top)  * (496 / rect.height);
    const dx = svgX - cx, dy = svgY - cy;
    const mouseAngle = Math.atan2(dy, dx);
    let minDiff = Infinity, best = 0;
    all.forEach((_, i) => {
      const axisAngle = (i * 2 * Math.PI / n) - Math.PI / 2;
      let diff = Math.abs(mouseAngle - axisAngle);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      if (diff < minDiff) { minDiff = diff; best = i; }
    });
    return best;
  }

  function highlight(idx) {
    const c = all[idx];
    const angle = (idx * 2 * Math.PI / n) - Math.PI / 2;
    const x2 = (cx + maxR * Math.cos(angle)).toFixed(1);
    const y2 = (cy + maxR * Math.sin(angle)).toFixed(1);
    const pct = Math.max(0, Math.min(100, c.score)) / 100;
    const vx = (cx + maxR * pct * Math.cos(angle)).toFixed(1);
    const vy = (cy + maxR * pct * Math.sin(angle)).toFixed(1);

    const hl = document.getElementById('radarHighlight');
    hl.innerHTML = `
      <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${c.color}" stroke-width="2.5" opacity="0.6"/>
      <circle cx="${vx}" cy="${vy}" r="9" fill="${c.color}" opacity="0.25"/>
      <circle cx="${vx}" cy="${vy}" r="5.5" fill="${c.color}" opacity="0.9"/>`;

    const tend = tendencyLabel(c);
    const tendColor = tend === '明顯偏頗' ? 'var(--terracotta)' : tend === '輕度傾向' ? '#B07820' : 'var(--text-light)';
    tooltip.style.display = 'flex';
    tooltip.innerHTML = `<span style="font-size:1.1rem;">${c.emoji}</span><strong style="color:var(--plum);">${c.name}</strong><span style="color:${tendColor};font-size:.8rem;">${tend}</span>`;
  }

  function clear() {
    document.getElementById('radarHighlight').innerHTML = '';
    tooltip.style.display = 'none';
  }

  svg.addEventListener('mousemove', e => highlight(nearestIdx(e.clientX, e.clientY)));
  svg.addEventListener('mouseleave', clear);
  svg.addEventListener('touchmove', e => {
    e.preventDefault();
    highlight(nearestIdx(e.touches[0].clientX, e.touches[0].clientY));
  }, { passive: false });
  svg.addEventListener('touchend', clear);
}

// ─── Render Results ───────────────────────────────────────────────────────
function renderResults(primary, secondary, all, balancedLabel) {
  const pi = constitutions.findIndex(c => c.id === primary.id);
  if (pi >= 0) primary = { ...applyConstitutionOv(primary, pi), score: primary.score };
  secondary = secondary.map(s => {
    const si = constitutions.findIndex(c => c.id === s.id);
    return si >= 0 ? { ...applyConstitutionOv(s, si), score: s.score } : s;
  });

  document.getElementById('quizContainer').style.display = 'none';
  document.getElementById('progressBar').style.width = '100%';
  document.getElementById('progressText').textContent = '評估完成';
  const container = document.getElementById('results');
  container.className = 'results-container active';

  const displayName = balancedLabel || primary.name;
  const sec = secondary[0] || null;

  // Store state for report hand-off
  _resultState = { primary, secondary, all, balancedLabel, displayName };

  const reportState = {
    source: 'constitution-quiz',
    mode: quizMode,
    userName,
    balancedLabel,
    primary: { name: primary.name, displayName },
    secondary: sec ? { name: sec.name } : null,
    createdAt: new Date().toISOString()
  };
  try {
    sessionStorage.setItem('drhu_cq_report', JSON.stringify(reportState));
  } catch (_) {}

  const reportParams = new URLSearchParams({
    const: primary.name,
    mode: quizMode
  });
  if (sec) {
    reportParams.set('sec', sec.name);
  }
  if (balancedLabel) reportParams.set('label', balancedLabel);
  if (userName) reportParams.set('name', userName);
  const reportUrl = `constitution-report.html?${reportParams.toString()}`;

  const balancedNote = balancedLabel === '基本平和質'
    ? '體質大致平衡，仍有少量偏頗傾向，宜留意保養。'
    : '';

  // ── Summary strip: primary + secondary side by side ──
  const summaryHtml = `
    <div class="cq-summary">
      <div class="cq-summary-item cq-summary-primary" style="--c:${primary.color};">
        <div class="cq-summary-role">主要體質</div>
        <div class="cq-summary-name">${primary.emoji} ${displayName}</div>
      </div>
      ${sec ? `
      <div class="cq-summary-item cq-summary-secondary" style="--c:${sec.color};">
        <div class="cq-summary-role">兼夾體質</div>
        <div class="cq-summary-name">${sec.emoji} ${sec.name}</div>
      </div>` : `
      <div class="cq-summary-item cq-summary-secondary cq-summary-none">
        <div class="cq-summary-role">兼夾體質</div>
        <div class="cq-summary-name" style="color:var(--text-light);">無明顯兼夾</div>
        <div class="cq-summary-hint">體質相對單純</div>
      </div>`}
    </div>`;

  // ── Secondary block (compact) ──
  const secDetailHtml = sec ? `
    <div class="result-card active cq-sec-card" style="--c:${sec.color};">
      <div class="cq-sec-head">
        <span class="cq-sec-emoji">${sec.emoji}</span>
        <div>
          <div class="cq-sec-label">兼夾體質</div>
          <div class="cq-sec-name">${sec.name}</div>
        </div>
      </div>
      <p class="cq-sec-desc">${sec.description || sec.tagline}</p>
      ${sec.recommendations && sec.recommendations.length ? `
      <div class="result-section" style="margin-top:1rem;">
        <div class="result-section-title">調理方向</div>
        <div class="result-tags">${sec.recommendations.slice(0, 3).map(r => `<span class="result-tag">${r}</span>`).join('')}</div>
      </div>` : ''}
      <p class="cq-sec-note">兼夾體質建議一併告知醫師，由醫師綜合辨證調理。</p>
    </div>` : '';

  container.innerHTML = `
    <!-- ── Hero ── -->
    <div class="cq-result-hero">
      ${primary.img
        ? `<div class="cq-result-portrait" style="border-color:${primary.color}55;"><img src="${primary.img}" alt="${displayName}"></div>`
        : `<div class="cq-result-emblem" style="background:${primary.color}1F;color:${primary.color};">${primary.emoji}</div>`}
      <div class="cq-result-kicker">${userName ? `${escHtml(userName)} 的主要體質` : '您的主要體質'}</div>
      <h2 class="cq-result-name">${displayName}</h2>
      <div class="cq-result-tag">${primary.tagline}</div>
      ${balancedNote ? `<p class="cq-result-note">${balancedNote}</p>` : ''}
    </div>

    ${summaryHtml}

    <!-- ── Radar ── -->
    <div class="result-card active cq-block">
      <div class="cq-block-title">體質傾向分佈</div>
      <p class="cq-block-sub">移動滑鼠或觸控查看各體質傾向，圖形越向外突出代表傾向越明顯。</p>
      ${drawRadarChart(all, primary.color)}
    </div>

    <!-- ── Primary detail ── -->
    <div class="result-card active cq-block">
      <div class="cq-block-title">體質簡介</div>
      <p class="cq-block-text">${primary.description}</p>
    </div>

    <!-- ── Recommendations ── -->
    <div class="result-card active cq-block">
      <div class="cq-block-title">個人化調理建議</div>
      <div class="result-tags" style="margin-bottom:1.25rem;">${primary.recommendations.map(r => `<span class="result-tag">${r}</span>`).join('')}</div>
      <div class="cq-diet-grid">
        <div>
          <div class="cq-diet-head cq-diet-good">✓ 適宜飲食</div>
          <div class="result-tags">${primary.foods.map(f => `<span class="result-tag" style="background:var(--sage-light);color:var(--plum);">${f}</span>`).join('')}</div>
        </div>
        <div>
          <div class="cq-diet-head cq-diet-avoid">✕ 應注意避免</div>
          <div class="result-tags">${primary.avoid.map(a => `<span class="result-tag" style="background:#FDF0E8;color:var(--terracotta);">${a}</span>`).join('')}</div>
        </div>
      </div>
    </div>

    ${secDetailHtml}

    <div id="cqGate"></div>

    <div class="result-warning cq-warning">⚠️ 本問卷依中醫體質分類判定標準設計，僅供健康參考，不作為醫療診斷依據。建議預約中醫師門診，進行完整四診辨證，獲取個人化調理方案。</div>

    <div class="cq-actions">
      <a href="index.html#contact" class="btn btn-primary">預約胡醫師門診</a>
      <button class="btn btn-outline" onclick="location.reload()">重新測驗</button>
    </div>
  `;

  mountReportGate(reportUrl, displayName, userName);
  initRadarInteraction(all);
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* 完整報告的聯絡資料閘。摘要（上面所有內容）永遠免費，只有完整報告要留資料。
   已經留過的人（localStorage）直接看到按鈕，不會被問第二次。
   lead-capture.js 沒載入時整段跳過 — 報告按鈕照舊直接顯示，不會鎖死訪客。 */
function mountReportGate(reportUrl, displayName, userName) {
  const slot = document.getElementById('cqGate');
  if (!slot) return;

  const openReport = () => {
    slot.innerHTML = `
      <div class="cq-block" style="text-align:center;">
        <div style="font-size:1.6rem;line-height:1;margin-bottom:.5rem;">📖</div>
        <div style="font-family:var(--font-display);font-size:1.15rem;color:var(--plum);margin-bottom:.35rem;">完整體質報告已準備好</div>
        <p class="cq-block-sub" style="margin-bottom:1.1rem;text-align:center;">
          內含${escHtml(displayName)}的食療湯水、茶飲配方、穴位保健與外食指南。
        </p>
        <a href="${reportUrl}" class="btn btn-sage">查看完整體質報告 →</a>
      </div>`;
  };

  if (!window.LeadCapture) { openReport(); return; }

  if (window.LeadCapture.hasLead()) { openReport(); return; }

  window.LeadCapture.renderGate(slot, {
    constitution: displayName,
    name: userName,
    reportUrl
  }, () => {
    openReport();
    slot.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ─── Version Select Screen ────────────────────────────────────────────────
function renderNameGate() {
  document.getElementById('progressText').textContent = '開始評估';
  document.getElementById('progressBar').style.width = '0%';
  document.querySelector('.cq-progress-meta')?.classList.add('is-intro');
  document.querySelector('.cq-hero-desc')?.style.removeProperty('display');
  const container = document.getElementById('quizContainer');

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:1.75rem;">
      <div class="cq-emblem cq-name-badge" aria-hidden="true">👋</div>
      <div style="font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--terracotta);margin-bottom:.5rem;">開始評估</div>
      <h2 style="font-family:var(--font-display);font-size:1.8rem;color:var(--plum);text-align:center;">怎麼稱呼您呢？</h2>
      <p style="font-size:.85rem;color:var(--text-light);margin-top:.5rem;text-align:center;">這樣就能用您的名字，為您專屬打造這份體質報告</p>
    </div>
    <div class="cq-name-gate">
      <input type="text" id="cqNameInput" class="cq-name-input" placeholder="例如：美美、志明" value="${escHtml(userName)}" maxlength="30">
      <div id="cqNameError" class="cq-name-error" style="display:none;"></div>
      <button class="btn btn-primary cq-name-btn" onclick="submitName()">好，開始吧 →</button>
    </div>
  `;

  const input = document.getElementById('cqNameInput');
  input.focus();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submitName(); });
  input.addEventListener('input', () => {
    const err = document.getElementById('cqNameError');
    if (err) err.style.display = 'none';
  });
}

function submitName() {
  const input = document.getElementById('cqNameInput');
  const val = input.value.trim();
  if (!val) {
    const err = document.getElementById('cqNameError');
    err.textContent = '別忘了留下您的稱呼，才能繼續喔 🙂';
    err.style.display = 'block';
    input.focus();
    return;
  }
  userName = val;
  renderVersionSelect();
}

function renderVersionSelect() {
  document.getElementById('progressText').textContent = '選擇評估版本';
  document.getElementById('progressBar').style.width = '0%';
  document.querySelector('.cq-progress-meta')?.classList.add('is-intro');
  document.querySelector('.cq-hero-desc')?.style.removeProperty('display');
  const container = document.getElementById('quizContainer');

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:1.75rem;">
      <div style="font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--terracotta);margin-bottom:.5rem;">開始評估</div>
      <h2 style="font-family:var(--font-display);font-size:1.8rem;color:var(--plum);">選擇評估版本</h2>
    </div>
    <div class="cq-version-grid">
      <div class="cq-version-card" onclick="startQuiz('simple')">
        <div class="cq-version-icon">⚡</div>
        <div class="cq-version-name">快速版</div>
        <div class="cq-version-stat">25 題填答・約 5 分鐘</div>
        <div class="cq-version-btn">開始評估 →</div>
      </div>
      <div class="cq-version-card cq-version-card-featured" onclick="startQuiz('complex')">
        <div class="cq-version-badge">推薦</div>
        <div class="cq-version-icon">🔍</div>
        <div class="cq-version-name">完整版</div>
        <div class="cq-version-stat">60 題填答・約 15 分鐘</div>
        <div class="cq-version-btn">開始評估 →</div>
      </div>
    </div>
    <p style="text-align:center;font-size:.7rem;color:var(--text-light);opacity:.7;margin-top:1.75rem;line-height:1.6;">依中華中醫藥學會《中醫體質分類與判定》標準（ZYYXH/T157-2009）</p>
  `;
}

function startQuiz(mode) {
  quizMode = mode;
  allAnswers = {};
  cqPage = 0;
  renderPage(0);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('quizContainer')) return;
  renderNameGate();
});
