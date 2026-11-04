/* =========================================
   V3.1 个人主页 · 交互脚本
   - 导航高亮 / 进场动画 / 滚动阴影
   - 桌宠（拖动/缩放/散步/跟随/菜单）
   - 数字分身47（DeepSeek API）
   - 鼠标跟随高光
   - 头像 lightbox
   - 足迹照片墙 + 胶卷弹窗
   - 反馈表单（Supabase）
   - 【新增】中英切换
   - 【新增】兴趣详情弹窗
   ========================================= */

(function () {
  "use strict";

  /* ============================================================
     【V3.1 新增】中英切换
     ============================================================ */
  var I18N = {
    nav_about: { zh: "关于", en: "About" },
    nav_interests: { zh: "兴趣", en: "Interests" },
    nav_journey: { zh: "足迹", en: "Journey" },
    nav_contact: { zh: "联系", en: "Contact" },
    nav_board: { zh: "留言板", en: "Message Board" },
    nav_avatar: { zh: "数字分身47", en: "Digital Twin 47" },
    hero_kicker: { zh: "你好，我是", en: "Hi, I'm" },
    hero_name: { zh: "陈柏宇", en: "Bob Chen" },
    hero_tag: { zh: "天津大学·香港理工大学 智能生物医学 大一新生", en: "BME Freshman · Tianjin University · PolyU" },
    hero_btn_about: { zh: "了解我的经历", en: "My Story" },
    hero_btn_contact: { zh: "联系我", en: "Contact Me" },
    about_title: { zh: "关于我", en: "About Me" },
    about_motto: { zh: "「兴趣是最好的老师」", en: "\"Interest is the best teacher\"" },
    edu_title: { zh: "求学之路", en: "My Journey" },
    edu_stage_kindergarten: { zh: "幼儿园", en: "Kindergarten" },
    edu_school_kindergarten: { zh: "珠海机关一幼", en: "Zhuhai No.1 Kindergarten" },
    edu_note_kindergarten: { zh: "梦想开始的地方", en: "Where dreams began" },
    edu_stage_primary: { zh: "小学", en: "Primary School" },
    edu_school_primary: { zh: "香洲一小", en: "Xiangzhou No. 1 Primary School" },
    edu_note_primary: { zh: "小学时光", en: "Primary school years" },
    edu_stage_middle: { zh: "初中", en: "Middle School" },
    edu_school_middle: { zh: "珠海紫荆中学", en: "Zhuhai Zijing Middle School" },
    edu_note_middle: { zh: "青春懵懂的三年", en: "Three years of youth" },
    edu_stage_high: { zh: "高中", en: "High School" },
    edu_school_high: { zh: "珠海一中", en: "Zhuhai No.1 High School" },
    edu_note_high: { zh: "拼搏奋斗的三年", en: "Three years of hard work" },
    edu_stage_university: { zh: "大学", en: "University" },
    edu_school_university: { zh: "天津大学·香港理工大学", en: "Tianjin Univ · PolyU" },
    edu_note_university: { zh: "联合培养项目", en: "Joint program" },
    edu_stage_now: { zh: "现在", en: "Now" },
    edu_school_now: { zh: "深圳未来技术学院 BME", en: "Shenzhen Inst. of Future Tech · BME" },
    edu_note_now: { zh: "智能生物医学，正在进行时", en: "Biomedical Engineering, in progress" },
    interests_title: { zh: "我的兴趣", en: "My Interests" },
    interests_note: { zh: "点击卡片查看详情 —— 内容持续完善中", en: "Click cards for details — content coming soon" },
    interest_coding: { zh: "编程", en: "Coding" },
    interest_coding_desc: { zh: "用代码把想法变成现实，享受创造的乐趣。", en: "Turning ideas into reality with code, enjoying the joy of creation." },
    interest_music: { zh: "音乐", en: "Music" },
    interest_music_desc: { zh: "旋律是生活的调味剂，听歌让心情更美好。", en: "Melody is the spice of life, music makes every day better." },
    interest_host: { zh: "主持", en: "Hosting" },
    interest_host_desc: { zh: "站在舞台上，用声音连接每一个人。", en: "On stage, connecting everyone with the power of voice." },
    interest_sports: { zh: "运动", en: "Sports" },
    interest_sports_desc: { zh: "热爱球类运动，最近获得学校羽毛球比赛单打、双打冠军。", en: "Loves ball sports; recently won school badminton singles and doubles championships." },
    journey_title: { zh: "我的足迹", en: "My Footprints" },
    journey_note: { zh: "一串绳子，挂着一张张旅行的记忆 —— 点击照片查看城市详情。", en: "A string of travel memories — click photos for city details." },
    journey_hint: { zh: "点击明信片，展开旅行胶卷", en: "Click a postcard to unroll the film" },
    contact_title: { zh: "联系我", en: "Contact" },
    contact_intro: { zh: "如果你想进一步了解我，欢迎通过邮箱联系：", en: "Feel free to reach out by email:" },
    contact_email: { zh: "邮箱：", en: "Email: " },
    contact_github: { zh: "GitHub：", en: "GitHub: " },
    board_title: { zh: "留言板", en: "Message Board" },
    board_note: { zh: "留下你的想法和建议 —— 无需登录，提交后即可看到提示。", en: "Leave your thoughts and suggestions — no login needed." },
    fb_name: { zh: "姓名（可选）", en: "Name (optional)" },
    fb_email: { zh: "邮箱（可选，用于回复）", en: "Email (optional, for reply)" },
    fb_type: { zh: "留言类型", en: "Type" },
    fb_type_content: { zh: "📝 内容建议", en: "📝 Content" },
    fb_type_structure: { zh: "🔧 结构体验", en: "🔧 Structure" },
    fb_type_feature: { zh: "✨ 功能需求", en: "✨ Feature" },
    fb_type_other: { zh: "💬 其他", en: "💬 Other" },
    fb_message: { zh: "留言内容 ", en: "Message " },
    fb_submit: { zh: "提交留言", en: "Submit" },

    /* 关于我 · 一句话简介（含 HTML 高亮，通过 data-i18n-html 注入） */
    about_lead: {
      zh: "我是 <strong>陈柏宇</strong>，<span class='hl'>热爱运动、啥都懂一点的猫奴</span>。",
      en: "I'm <strong>Bob Chen</strong>, <span class='hl'>a cat lover who enjoys sports and dabbles in a bit of everything</span>."
    },

    /* 足迹城市地名（data-city 仍保留中文作为照片路径键） */
    city_shanghai: { zh: "上海", en: "Shanghai" },
    city_beijing: { zh: "北京", en: "Beijing" },
    city_chengdu: { zh: "成都", en: "Chengdu" },
    city_xian: { zh: "西安", en: "Xi'an" },
    city_guangzhou: { zh: "广州", en: "Guangzhou" },
    city_shaoguan: { zh: "韶关", en: "Shaoguan" },
    city_hangzhou: { zh: "杭州", en: "Hangzhou" },
    city_nanjing: { zh: "南京", en: "Nanjing" },
    city_changsha: { zh: "长沙", en: "Changsha" },
    city_shenzhen: { zh: "深圳", en: "Shenzhen" },
    city_chaozhou: { zh: "潮州", en: "Chaozhou" },
    city_shantou: { zh: "汕头", en: "Shantou" },
    city_macau: { zh: "澳门", en: "Macau" },
    city_hongkong: { zh: "香港", en: "Hong Kong" },
    city_chongqing: { zh: "重庆", en: "Chongqing" },
    city_singapore: { zh: "新加坡", en: "Singapore" },
    city_malaysia: { zh: "马来西亚", en: "Malaysia" },

    /* 胶卷弹窗提示 */
    film_hint: { zh: "滚动鼠标滚轮浏览更多照片", en: "Scroll to see more photos" },

    /* 数字分身47 · 对话面板 */
    chat_head_sub: { zh: "陈柏宇的 AI 数字分身", en: "Bob's AI digital twin" },
    chat_welcome: {
      zh: "你好呀～我是陈柏宇（Bob）的 AI 数字分身「47」。你可以自由提问，我会依据他公开的资料回答。",
      en: "Hi! I'm 47, Bob Chen's AI digital twin. Ask me anything; I'll answer from his public profile."
    },
    chat_q_who: { zh: "他是谁", en: "About" },
    chat_q_major: { zh: "专业", en: "Major" },
    chat_q_interest: { zh: "兴趣", en: "Interests" },
    chat_q_contact: { zh: "联系", en: "Contact" },
    chat_input_ph: { zh: "输入你想问的……", en: "Type your question…" },
    chat_input_aria: { zh: "输入问题", en: "Type a question" },
    chat_launcher_aria: { zh: "打开47", en: "Open 47" },
    chat_dialog_aria: { zh: "与47对话", en: "Chat with 47" },
    chat_close_aria: { zh: "关闭对话", en: "Close chat" },
    chat_send_aria: { zh: "发送", en: "Send" }
  };

  var currentLang = "zh";
  var langToggle = document.getElementById("lang-toggle");

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (I18N[key] && I18N[key][lang]) {
        el.textContent = I18N[key][lang];
      }
    });
    /* 含 HTML 结构（加粗/高亮）的文案 */
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (I18N[key] && I18N[key][lang]) {
        el.innerHTML = I18N[key][lang];
      }
    });
    /* 输入框占位符 */
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      if (I18N[key] && I18N[key][lang]) el.setAttribute("placeholder", I18N[key][lang]);
    });
    /* 无障碍标签 */
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (I18N[key] && I18N[key][lang]) el.setAttribute("aria-label", I18N[key][lang]);
    });
    if (langToggle) {
      langToggle.classList.toggle("en-mode", lang === "en");
      var cnSpan = langToggle.querySelector(".lang-cn");
      var enSpan = langToggle.querySelector(".lang-en");
      if (cnSpan) cnSpan.classList.toggle("active", lang === "zh");
      if (enSpan) enSpan.classList.toggle("active", lang === "en");
    }
  }

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      applyLang(currentLang === "zh" ? "en" : "zh");
    });
  }

  /* ============================================================
     【V3.1 新增】兴趣详情弹窗
     ============================================================ */
  var interestModal = document.getElementById("interest-modal");
  var interestEmojiEl = document.getElementById("interest-modal-emoji");
  var interestTitleEl = document.getElementById("interest-modal-title");

  var INTEREST_DATA = {
    "编程": {
      emoji: "💻", title: "编程", count: 3,
      desc: "热爱编程，享受用代码把想法变成现实的过程。从网页开发到算法挑战，不断探索技术的边界。"
    },
    "音乐": {
      emoji: "🎵", title: "音乐", count: 5,
      desc: "音乐是生活中不可或缺的部分。喜欢听歌，也享受音乐带来的放松和灵感。"
    },
    "主持": {
      emoji: "🎤", title: "主持", count: 3,
      desc: "热爱主持，享受站在舞台上用声音连接每一个人的感觉。多次担任活动主持人。"
    },
    "运动": {
      emoji: "🏸", title: "运动", count: 7,
      desc: "热爱运动和球类，最近获得学校羽毛球比赛单打、双打冠军。"
    }
  };

  var interestFilmFrames = document.getElementById("interest-film-frames");

  function openInterestModal(name) {
    var data = INTEREST_DATA[name] || { emoji: "✨", title: name, count: 0 };
    if (interestEmojiEl) interestEmojiEl.textContent = data.emoji;
    var INTEREST_TITLE_EN = { "编程": "Coding", "音乐": "Music", "主持": "Hosting", "运动": "Sports" };
    if (interestTitleEl) {
      interestTitleEl.textContent = currentLang === "en" ? (INTEREST_TITLE_EN[data.title] || data.title) : data.title;
    }
    if (interestFilmFrames) {
      interestFilmFrames.innerHTML = "";
      var count = data.count || 0;
      for (var i = 1; i <= count; i++) {
        (function (idx) {
          var src = "assets/photos/interests/" + name + "/photo_" + idx + ".jpg";
          var frame = document.createElement("div");
          frame.className = "film-frame landscape";
          frame.style.setProperty("--i", idx - 1);
          var photo = document.createElement("img");
          photo.className = "film-photo";
          photo.src = src;
          photo.alt = name + "照片" + idx;
          frame.appendChild(photo);
          interestFilmFrames.appendChild(frame);
          var img = new Image();
          img.onload = function () {
            frame.classList.remove("landscape", "portrait");
            frame.classList.add(img.naturalWidth >= img.naturalHeight ? "landscape" : "portrait");
          };
          img.src = src;
        })(i);
      }
      interestFilmFrames.scrollLeft = 0;
    }
    if (interestModal) interestModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeInterestModal() {
    if (interestModal) interestModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  /* 胶片滚轮：在滚轮事件内【同步】把垂直滚轮 / 触控板横向滑动映射为横向滚动；
     绑在整个弹窗上（暗背景、标题区也能滚）。不用 rAF（后台标签 rAF 冻结会卡住），
     也不用 CSS smooth（高频滚轮会反复中断平滑动画）。deltaMode：0=像素 1=行(×16) 2=页(×容器宽) */
  function bindFilmWheel(modalEl, scroller) {
    if (!modalEl || !scroller) return;
    modalEl.addEventListener("wheel", function (e) {
      e.preventDefault();
      var d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (e.deltaMode === 1) {
        d *= 16;
      } else if (e.deltaMode === 2) {
        d *= (scroller.clientWidth || 800);
      }
      scroller.scrollLeft += d;
    }, { passive: false });
    /* 触屏横向滑动兜底（不影响鼠标滚轮） */
    var touchX = 0, touchLeft = 0;
    modalEl.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) { touchX = e.touches[0].clientX; touchLeft = scroller.scrollLeft; }
    }, { passive: true });
    modalEl.addEventListener("touchmove", function (e) {
      if (e.touches.length === 1) {
        scroller.scrollLeft = touchLeft - (e.touches[0].clientX - touchX);
      }
    }, { passive: true });
  }
  bindFilmWheel(interestModal, interestFilmFrames);

  document.querySelectorAll(".interest").forEach(function (card) {
    card.addEventListener("click", function () {
      openInterestModal(card.getAttribute("data-interest"));
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInterestModal(card.getAttribute("data-interest"));
      }
    });
  });

  if (interestModal) {
    var interestClose = interestModal.querySelector(".interest-modal-close");
    var interestBackdrop = interestModal.querySelector(".interest-modal-backdrop");
    if (interestClose) interestClose.addEventListener("click", closeInterestModal);
    if (interestBackdrop) interestBackdrop.addEventListener("click", closeInterestModal);
  }

  /* ============================================================
     1) 导航当前区块高亮（Scrollspy）
     ============================================================ */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".links a");

  function setActiveLink() {
    var pos = window.scrollY + (document.querySelector(".nav")?.offsetHeight || 76) + 24;
    var currentId = "";
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) {
        currentId = sec.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", currentId !== "" && link.getAttribute("href") === "#" + currentId);
    });
  }

  /* 2) 区块滚动进场动画 */
  var revealItems = document.querySelectorAll(".section, .card");
  revealItems.forEach(function (el) {
    el.classList.add("reveal");
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* 3) 滚动时导航加阴影 */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (window.scrollY > 10) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
    setActiveLink();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", function () {
    setActiveLink();
    onScroll();
  });

  /* ============================================================
     3.5) 关于我 · 点击猫猫在两张手账贴纸间切换（Y 轴翻牌）
     ============================================================ */
  (function () {
    var cat = document.querySelector(".cat-sticker");
    if (!cat) return;
    var catSrcs = ["assets/cat-sticker.png", "assets/cat-sticker-2.png"];
    var catIdx = 0;
    catSrcs.forEach(function (s) { var pre = new Image(); pre.src = s; });
    cat.setAttribute("tabindex", "0");
    cat.setAttribute("role", "button");

    function catTitle() {
      var isEn = document.documentElement.lang === "en";
      cat.setAttribute("title", isEn ? "Click me for another pose" : "点我换个姿势");
      cat.setAttribute("aria-label", isEn ? "Switch the cat sticker" : "切换猫咪贴纸");
    }
    catTitle();

    function switchCat() {
      if (cat.classList.contains("switching")) return;
      cat.classList.add("switching");
      window.setTimeout(function () {
        catIdx = (catIdx + 1) % catSrcs.length;
        cat.src = catSrcs[catIdx];
      }, 240);
      window.setTimeout(function () {
        cat.classList.remove("switching");
      }, 530);
    }
    cat.addEventListener("click", switchCat);
    cat.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switchCat();
      }
    });
    if (langToggle) langToggle.addEventListener("click", function () {
      window.setTimeout(catTitle, 0);
    });
  })();

  /* ============================================================
     4) 常驻桌宠交互
     ============================================================ */
  var floatPet = document.getElementById("float-pet");
  if (floatPet) {
    var petImg = document.getElementById("float-pet-img");
    var petBubble = document.getElementById("pet-bubble");
    var petMenu = document.getElementById("pet-menu");
    var petLayout = function () { return window.innerWidth <= 640 ? "phone" : window.innerWidth <= 900 ? "tablet" : "desktop"; };
    var isMobile = function () { return petLayout() !== "desktop"; };
    var petScale = isMobile() ? 1 : 2.2;
    var previousPetLayout = petLayout();
    var baseW = function () { return petLayout() === "phone" ? 54 : petLayout() === "tablet" ? 84 : 110; };
    var baseH = function () { return petLayout() === "phone" ? 64 : petLayout() === "tablet" ? 100 : 132; };
    var followMode = false, followTimer = null;
    var bubbleTimer = null;

    function initPetPos() {
      var rect = floatPet.getBoundingClientRect();
      floatPet.style.left = rect.left + "px";
      floatPet.style.top = rect.top + "px";
      floatPet.style.right = "auto";
      floatPet.style.bottom = "auto";
    }

    function clampPet() {
      var rect = floatPet.getBoundingClientRect();
      floatPet.style.left = Math.max(0, Math.min(window.innerWidth - rect.width, rect.left)) + "px";
      floatPet.style.top = Math.max(0, Math.min(window.innerHeight - rect.height, rect.top)) + "px";
      floatPet.style.right = "auto";
      floatPet.style.bottom = "auto";
    }

    function applyScale() {
      floatPet.style.width = Math.round(baseW() * petScale) + "px";
      floatPet.style.height = Math.round(baseH() * petScale) + "px";
    }

    function setBubble(text, duration) {
      if (!petBubble) return;
      idleBubbleActive = false;
      petBubble.textContent = text;
      petBubble.classList.add("show");
      clearTimeout(bubbleTimer);
      var hold = duration || 1800;
      bubbleTimer = setTimeout(function () { petBubble.classList.remove("show"); }, hold);
    }

    /* 30秒未点击页面 → 桌宠主动提示互动 */
    var idleTimer = null;
    var idleBubbleActive = false;
    function showIdlePrompt() {
      setBubble("右键与我互动吧 👉", 4000);
      idleBubbleActive = true;
    }
    function resetIdlePrompt() {
      clearTimeout(idleTimer);
      /* 用户一旦操作，立即收回空闲提示气泡 */
      if (idleBubbleActive && petBubble) {
        idleBubbleActive = false;
        petBubble.classList.remove("show");
        clearTimeout(bubbleTimer);
      }
      idleTimer = setTimeout(function () {
        showIdlePrompt();
        idleTimer = setTimeout(showIdlePrompt, 30000);
      }, 30000);
    }
    ["click", "contextmenu", "wheel", "touchstart"].forEach(function (evt) {
      document.addEventListener(evt, resetIdlePrompt, { passive: true });
    });
    resetIdlePrompt();

    function petAction(act) {
      switch (act) {
        case "chat":  setBubble("你好呀～我是你的小助手 🎓"); bounce(); break;
        case "pet":   setBubble("呵呵，好舒服～ 🥰"); bounce(); break;
        case "feed":  setBubble("谢谢投喂！🍎 好吃！"); bounce(); break;
        case "walk": walkMove(); break;
        case "stopwalk": stopWalk(); setBubble("散步结束啦～ 就停这儿 ✋"); break;
        case "sleep": setBubble("呼……让我眯一会儿 😴"); floatPet.classList.add("sleeping"); break;
        case "follow":
          followMode = !followMode;
          if (followMode) {
            stopWalk();
            startFollowLoop();
            setGlowMode("pet");
          } else {
            stopFollowLoop();
            setGlowMode("cursor");
          }
          var fi = document.getElementById("pet-follow-item");
          var sfi = document.getElementById("pet-stopfollow-item");
          if (fi) fi.style.display = followMode ? "none" : "block";
          if (sfi) sfi.style.display = followMode ? "block" : "none";
          setBubble(followMode ? "开启跟随模式～跟着你走 🐾" : "已退出跟随模式");
          break;
        case "zoom-in":  petScale = Math.min(2.2, petScale + 0.2); applyScale(); setBubble("放大一点！🔍"); break;
        case "zoom-out": petScale = Math.max(0.5, petScale - 0.2); applyScale(); setBubble("缩小一点~"); break;
        case "reset": petScale = 1; applyScale(); setBubble("回到原始大小 ✨"); break;
      }
    }

    function bounce() {
      floatPet.classList.remove("play");
      void floatPet.offsetWidth;
      floatPet.classList.add("play");
      floatPet.classList.remove("sleeping");
      setTimeout(function () { floatPet.classList.remove("play"); }, 600);
    }

    /* 散步 */
    var walkTimer = null, walking = false;
    function walkMove(speak) {
    if (walking) return;
   speak = (speak === undefined)? true : speak;
   walking = true;
   setGlowMode("pet");
   var walkItem = document.getElementById("pet-walk-item");
   var stopItem = document.getElementById("pet-stopwalk-item");
   if (walkItem) walkItem.style.display = "none";
   if (stopItem) stopItem.style.display = "block";
      followMode = false;
      stopFollowLoop();
      floatPet.classList.remove("sleeping");
      var rect = floatPet.getBoundingClientRect();
      var startLeft = floatPet.offsetLeft;
      var startTop = floatPet.offsetTop;
      var startW = rect.width;

      var margin = 8;
      var maxRight = window.innerWidth - startW - margin;
      var maxLeft = margin;

      var goingRight = true;
      var SPEED = 3 / 45;
      var lastWalkTime = 0;
      var WALK_INTERVAL = 16;

      function walkTick() {
        if (!walking) return;
        var now = performance.now();
        if (!lastWalkTime) lastWalkTime = now;
        var delta = Math.min(now - lastWalkTime, 50);
        lastWalkTime = now;
        var step = SPEED * delta;
        var curLeft = parseFloat(floatPet.style.left) || floatPet.offsetLeft;
        floatPet.style.top = startTop + "px";
        if (goingRight) {
          var nL = curLeft + step;
          if (nL >= maxRight) { nL = maxRight; goingRight = false; }
          floatPet.style.left = nL + "px";
        } else {
          var nL3 = curLeft - step;
          if (nL3 <= maxLeft) { nL3 = maxLeft; goingRight = true; }
          floatPet.style.left = nL3 + "px";
        }
        floatPet.style.right = "auto";
        floatPet.style.bottom = "auto";
        glowFollowPet();
        walkTimer = setTimeout(walkTick, WALK_INTERVAL);
      }

      if (speak) setBubble("出去散散步，玩一会儿~ 🚶");
      walkTimer = setTimeout(walkTick, WALK_INTERVAL);
    }
    function stopWalk() {
   if (walkTimer) { clearTimeout(walkTimer); walkTimer = null; }
   walking = false;
   setGlowMode("cursor");
   var walkItem = document.getElementById("pet-walk-item");
   var stopItem = document.getElementById("pet-stopwalk-item");
   if (walkItem) walkItem.style.display = "block";
    if (stopItem) stopItem.style.display = "none";
    }

    /* 按住拖动 */
    var pDragging = false, pX = 0, pY = 0, pLeft = 0, pTop = 0, pMoved = false;
    floatPet.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      pDragging = true;
      pMoved = false;
      hideMenu();
      stopWalk();
      pX = e.clientX;
      pY = e.clientY;
      pLeft = floatPet.offsetLeft;
      pTop = floatPet.offsetTop;
      setGlowMode("pet");
      glowFollowPet();
      e.preventDefault();
    });
    document.addEventListener("mousemove", function (e) {
      if (!pDragging) return;
      var dx = e.clientX - pX;
      var dy = e.clientY - pY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) pMoved = true;
      floatPet.style.left = pLeft + dx + "px";
      floatPet.style.top = pTop + dy + "px";
      floatPet.style.right = "auto";
      floatPet.style.bottom = "auto";
      glowFollowPet();
    });
    document.addEventListener("mouseup", function () {
      if (!pDragging) return;
      pDragging = false;
      if (!pMoved) setBubble("嘿！别乱点～ 😄");
      setGlowMode("cursor");
    });

    /* 滚轮缩放 */
    floatPet.addEventListener("wheel", function (e) {
      e.preventDefault();
      petScale = Math.max(0.5, Math.min(2.2, petScale + (e.deltaY > 0 ? -0.15 : 0.15)));
      applyScale();
      clampPet();
      if (petScale > 1) setBubble("放大一下 🔍"); else if (petScale < 1) setBubble("缩小一点~");
    }, { passive: false });

    /* 右键菜单 */
    floatPet.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      setGlowMode("off");
      showMenu(e.clientX, e.clientY);
    });

    function showMenu(x, y) {
      if (!petMenu) return;
      petMenu.classList.add("open");
      var mw = petMenu.offsetWidth, mh = petMenu.offsetHeight;
      var lx = Math.min(x, window.innerWidth - mw - 8);
      var ly = Math.min(y, window.innerHeight - mh - 8);
      petMenu.style.left = lx + "px";
      petMenu.style.top = ly + "px";
    }
    function hideMenu() {
      if (petMenu) petMenu.classList.remove("open");
      setGlowMode(followMode || walking ? "pet" : "cursor");
    }

    if (petMenu) {
      petMenu.addEventListener("click", function (e) {
        var item = e.target.closest(".pet-item");
        hideMenu();
        if (item) petAction(item.getAttribute("data-act"));
      });
    }
    document.addEventListener("click", function (e) {
      if (petMenu && !petMenu.contains(e.target) && e.target !== floatPet) hideMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hideMenu();
    });

    /* 跟随模式 */
    var followMouseX = 0, followMouseY = 0, followRaf = null;
    document.addEventListener("mousemove", function (e) {
      followMouseX = e.clientX;
      followMouseY = e.clientY;
    });
    function followTick() {
      if (!followMode || pDragging || walking) { followRaf = null; return; }
      var rect = floatPet.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = followMouseX - cx, dy = followMouseY - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 130) {
        var step = Math.min(12, dist * 0.06);
        floatPet.style.left = (floatPet.offsetLeft + dx / dist * step) + "px";
        floatPet.style.top = (floatPet.offsetTop + dy / dist * step) + "px";
        floatPet.style.right = "auto";
        floatPet.style.bottom = "auto";
        glowFollowPet();
      }
      followRaf = requestAnimationFrame(followTick);
    }
    function startFollowLoop() { if (!followRaf) followRaf = requestAnimationFrame(followTick); }
    function stopFollowLoop() { if (followRaf) { cancelAnimationFrame(followRaf); followRaf = null; } }

    window.addEventListener("resize", function () {
      var layout = petLayout();
      if (layout !== previousPetLayout) {
        petScale = layout === "desktop" ? 2.2 : 1;
        previousPetLayout = layout;
        floatPet.style.left = "auto";
        floatPet.style.top = layout === "desktop" ? "52%" : "auto";
        floatPet.style.right = layout === "phone" ? "94px" : layout === "tablet" ? "100px" : "60px";
        floatPet.style.bottom = layout === "phone" ? "calc(8px + env(safe-area-inset-bottom))" : layout === "tablet" ? "16px" : "auto";
        applyScale();
        initPetPos();
        return;
      }
      applyScale();
      clampPet();
    });

    applyScale();
    initPetPos();

    if (!isMobile()) {
      setTimeout(function () { walkMove(false); }, 1200);
    }
  }

  /* ============================================================
     5) 数字分身47 · 真实模型问答
     ============================================================ */
  var avatarLauncher = document.getElementById("avatar-launcher");
  var chatPanel = document.getElementById("chat-panel");
  var chatClose = document.getElementById("chat-close");
  var chatBody = document.getElementById("chat-body");
  var chatForm = document.getElementById("chat-form");
  var chatInput = document.getElementById("chat-input");
  var quickButtons = document.querySelectorAll(".chat-quick button");

  if (avatarLauncher && chatPanel && chatClose && chatBody && chatForm && chatInput) {
    var chatIsOpen = false;

    function setChatOpen(open) {
      chatIsOpen = open;
      document.body.classList.toggle("chat-open", open);
      chatPanel.classList.toggle("open", open);
      chatPanel.setAttribute("aria-hidden", open ? "false" : "true");
      avatarLauncher.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        window.setTimeout(function () { chatInput.focus(); }, 220);
      }
    }

    function addChatMessage(text, role) {
      var message = document.createElement("div");
      message.className = "msg " + role;
      message.textContent = text;
      chatBody.appendChild(message);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    var CHAT_API_URL = "https://ymlwhymikjbuliwiruhb.supabase.co/functions/v1/digital-twin";
    var CHAT_PUBLISHABLE_KEY = "sb_publishable_rz02vXoTBHzapd0DrrdLVw_hMAK3XxL";
    var chatHistory = [];
    var chatBusy = false;
    var chatSendButton = chatForm.querySelector(".chat-send");

    async function sendAvatarQuestion(question) {
      var cleanQuestion = question.trim();
      if (!cleanQuestion || chatBusy) return;
      chatBusy = true;
      chatInput.value = "";
      chatInput.disabled = true;
      if (chatSendButton) chatSendButton.disabled = true;
      chatBody.setAttribute("aria-busy", "true");
      addChatMessage(cleanQuestion, "user");
      var pending = document.createElement("div");
      pending.className = "msg bot";
      pending.textContent = currentLang === "en" ? "Thinking…" : "正在思考…";
      chatBody.appendChild(pending);
      chatBody.scrollTop = chatBody.scrollHeight;

      var controller = new AbortController();
      var timeout = window.setTimeout(function () { controller.abort(); }, 30000);
      try {
        var response = await fetch(CHAT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: CHAT_PUBLISHABLE_KEY
          },
          body: JSON.stringify({ question: cleanQuestion, history: chatHistory }),
          signal: controller.signal
        });
        var result = await response.json().catch(function () { return {}; });
        if (!response.ok || typeof result.reply !== "string" || !result.reply.trim()) {
          throw new Error(response.status === 429 ? "rate_limited" : "service_unavailable");
        }
        pending.textContent = result.reply.trim();
        chatHistory.push({ role: "user", content: cleanQuestion });
        chatHistory.push({ role: "assistant", content: pending.textContent });
        chatHistory = chatHistory.slice(-8);
      } catch (error) {
        if (error.message === "rate_limited") {
          pending.textContent = currentLang === "en"
            ? "Too many questions right now. Please try again later."
            : "提问有点频繁，请稍后再试。";
        } else {
          pending.textContent = currentLang === "en"
            ? "I can't connect right now. Please try again shortly."
            : "暂时无法连接数字分身，请稍后再试。";
        }
      } finally {
        window.clearTimeout(timeout);
        chatBusy = false;
        chatInput.disabled = false;
        if (chatSendButton) chatSendButton.disabled = false;
        chatBody.removeAttribute("aria-busy");
        chatInput.focus();
      }
    }
    avatarLauncher.addEventListener("click", function () { setChatOpen(!chatIsOpen); });
    var navAvatar = document.getElementById("nav-avatar");
    if (navAvatar) {
      navAvatar.addEventListener("click", function (e) {
        e.preventDefault();
        setChatOpen(true);
      });
    }
    chatClose.addEventListener("click", function () { setChatOpen(false); });
    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sendAvatarQuestion(chatInput.value);
    });
    quickButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var question = button.getAttribute("data-q");
        if (!chatIsOpen) setChatOpen(true);
        sendAvatarQuestion(question || "");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && chatIsOpen) setChatOpen(false);
    });
  }

  /* ============================================================
     6) 鼠标跟随高光
     ============================================================ */
  var cursorGlow = document.getElementById("cursor-glow");
  var glowMode = "cursor";
  var gX = 0, gY = 0, tX = 0, tY = 0, gRaf = null, gFirst = true;
  var gReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function glowApply() {
    if (cursorGlow) cursorGlow.style.transform = "translate(" + gX + "px," + gY + "px)";
  }
  function setGlowMode(mode) {
    glowMode = mode;
    if (!cursorGlow) return;
    if (mode === "off") {
      cursorGlow.classList.remove("on");
      if (gRaf) { cancelAnimationFrame(gRaf); gRaf = null; }
    } else {
      cursorGlow.classList.add("on");
    }
  }
  function glowFollowPet() {
    if (glowMode !== "pet" || !cursorGlow || !floatPet) return;
    if (gRaf) { cancelAnimationFrame(gRaf); gRaf = null; }
    var l = parseFloat(floatPet.style.left);
    var t = parseFloat(floatPet.style.top);
    if (isNaN(l)) l = floatPet.offsetLeft;
    if (isNaN(t)) t = floatPet.offsetTop;
    gX = l + floatPet.offsetWidth / 2;
    gY = t + floatPet.offsetHeight / 2;
    glowApply();
  }

  if (cursorGlow) {
    document.addEventListener("mousemove", function (e) {
      if (glowMode !== "cursor") return;
      tX = e.clientX;
      tY = e.clientY;
      if (gFirst) { gX = tX; gY = tY; gFirst = false; }
      cursorGlow.classList.add("on");
      if (!gRaf) {
        gRaf = requestAnimationFrame(function tick() {
          gRaf = null;
          var dx = tX - gX, dy = tY - gY;
          if (!gReduce && (Math.abs(dx) >= 0.5 || Math.abs(dy) >= 0.5)) {
            gX += dx * 0.18;
            gY += dy * 0.18;
            gRaf = requestAnimationFrame(tick);
          } else {
            gX = tX; gY = tY;
          }
          glowApply();
        });
      }
    });
    document.documentElement.addEventListener("mouseleave", function () {
      cursorGlow.classList.remove("on");
    });
  }

  /* ============================================================
     头像点击放大图
     ============================================================ */
  var avatarLightbox = document.getElementById("avatar-lightbox");
  if (avatarLightbox) {
    function openAvatarLightbox() { avatarLightbox.classList.add("show"); }
    function closeAvatarLightbox() { avatarLightbox.classList.remove("show"); }
    document.querySelectorAll(".brand-avatar, .hero-avatar").forEach(function (img) {
      img.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openAvatarLightbox();
      });
    });
    avatarLightbox.addEventListener("click", closeAvatarLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAvatarLightbox();
    });
  }

  /* ============================================================
     足迹照片墙 · 点击弹出旅游详情
     ============================================================ */
  var travelModal = document.getElementById("travel-modal");
  if (travelModal) {
    var travelModalCity = document.getElementById("travel-modal-city");
    var filmFrames = document.getElementById("film-frames");
    var travelModalClose = travelModal.querySelector(".travel-modal-close");
    var travelModalBackdrop = travelModal.querySelector(".travel-modal-backdrop");

    var travelData = {
      "上海": { date: "待补充", count: 10 }, "北京": { date: "待补充", count: 10 },
      "成都": { date: "待补充", count: 6 }, "西安": { date: "待补充", count: 7 },
      "广州": { date: "待补充", count: 3 }, "韶关": { date: "待补充", count: 3 },
      "杭州": { date: "待补充", count: 7 }, "南京": { date: "待补充", count: 7 },
      "长沙": { date: "待补充", count: 6 }, "深圳": { date: "待补充", count: 5 },
      "潮州": { date: "待补充", count: 4 }, "汕头": { date: "待补充", count: 6 },
      "澳门": { date: "待补充", count: 4 }, "香港": { date: "待补充", count: 8 },
      "重庆": { date: "待补充", count: 4 }, "新加坡": { date: "待补充", count: 2 },
      "马来西亚": { date: "待补充", count: 3 }
    };

    /* 城市中文名 → 英文名（弹窗标题随语言切换；data-city 仍用中文作路径键） */
    var CITY_EN = {
      "上海": "Shanghai", "北京": "Beijing", "成都": "Chengdu", "西安": "Xi'an",
      "广州": "Guangzhou", "韶关": "Shaoguan", "杭州": "Hangzhou", "南京": "Nanjing",
      "长沙": "Changsha", "深圳": "Shenzhen", "潮州": "Chaozhou", "汕头": "Shantou",
      "澳门": "Macau", "香港": "Hong Kong", "重庆": "Chongqing",
      "新加坡": "Singapore", "马来西亚": "Malaysia"
    };

    /* 检测照片方向，返回 landscape / portrait */
    function detectOrientation(src, callback) {
      var img = new Image();
      img.onload = function () {
        callback(img.naturalWidth >= img.naturalHeight ? "landscape" : "portrait");
      };
      img.onerror = function () { callback("landscape"); };
      img.src = src;
    }

    function openTravelModal(city) {
      var data = travelData[city] || { count: 0 };
      travelModalCity.textContent = currentLang === "en" ? (CITY_EN[city] || city) : city;
      filmFrames.innerHTML = "";
      var count = data.count || 0;
      for (var i = 1; i <= count; i++) {
        (function (idx) {
          var src = "assets/photos/cities/" + city + "/photo_" + idx + ".jpg";
          var frame = document.createElement("div");
          frame.className = "film-frame landscape";
          frame.style.setProperty("--i", idx - 1);
          var photo = document.createElement("img");
          photo.className = "film-photo";
          photo.src = src;
          photo.alt = city + "旅行照片" + idx;
          frame.appendChild(photo);
          filmFrames.appendChild(frame);
          detectOrientation(src, function (ori) {
            frame.classList.remove("landscape", "portrait");
            frame.classList.add(ori);
          });
        })(i);
      }
      filmFrames.scrollLeft = 0;
      travelModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    function closeTravelModal() {
      travelModal.classList.remove("active");
      document.body.style.overflow = "";
    }

    /* 鼠标滚轮（弹窗内任意位置）→ 同步横向浏览照片（共用 bindFilmWheel） */
    bindFilmWheel(travelModal, filmFrames);

    document.querySelectorAll(".photo-item").forEach(function (item) {
      item.addEventListener("click", function () {
        openTravelModal(item.getAttribute("data-city"));
      });
    });

    travelModalClose.addEventListener("click", closeTravelModal);
    travelModalBackdrop.addEventListener("click", closeTravelModal);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeTravelModal();
        closeInterestModal();
      }
    });

    /* 初始化照片墙封面：用每个城市的第一张真实照片 */
    document.querySelectorAll(".photo-item").forEach(function (item) {
      var city = item.getAttribute("data-city");
      var imgEl = item.querySelector(".photo-img");
      if (imgEl && city) {
        imgEl.style.background = "url('assets/photos/cities/" + city + "/photo_1.jpg') center center / cover no-repeat";
      }
    });
  }

  /* ============================================================
     V3 反馈表单（Supabase 存储）
     ============================================================ */
  var feedbackForm = document.getElementById("feedback-form");
  if (feedbackForm) {
    var SUPABASE_URL = "https://ymlwhymikjbuliwiruhb.supabase.co";
    var SUPABASE_ANON_KEY = "sb_publishable_rz02vXoTBHzapd0DrrdLVw_hMAK3XxL";
    var supabaseClient = null;
    if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    var fbName = document.getElementById("fb-name");
    var fbEmail = document.getElementById("fb-email");
    var fbMessage = document.getElementById("fb-message");
    var fbCount = document.getElementById("fb-count");
    var fbSubmit = document.getElementById("fb-submit");
    var fbResult = document.getElementById("fb-result");
    var fbSubmitText = fbSubmit.querySelector(".submit-text");

    fbMessage.addEventListener("input", function () {
      fbCount.textContent = fbMessage.value.length;
    });

    function showFbResult(msg, type) {
      fbResult.textContent = msg;
      fbResult.className = "feedback-result show " + type;
    }
    function hideFbResult() {
      fbResult.className = "feedback-result";
      fbResult.textContent = "";
    }

    function validateFb() {
      var valid = true;
      fbMessage.classList.remove("error");
      if (!fbMessage.value.trim()) {
        fbMessage.classList.add("error");
        showFbResult("请填写留言内容后再提交～", "error");
        valid = false;
      }
      if (fbEmail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fbEmail.value.trim())) {
        showFbResult("邮箱格式不正确，请检查后重试。", "error");
        valid = false;
      }
      return valid;
    }

    function getFbType() {
      var checked = document.querySelector('input[name="type"]:checked');
      return checked ? checked.value : "未分类";
    }

    feedbackForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      hideFbResult();
      if (!validateFb()) return;

      fbSubmit.classList.add("loading");
      fbSubmitText.textContent = "提交中";
      fbSubmit.disabled = true;

      var payload = {
        name: fbName.value.trim() || "匿名",
        email: fbEmail.value.trim() || null,
        type: getFbType(),
        message: fbMessage.value.trim(),
        created_at: new Date().toISOString()
      };

      try {
        if (supabaseClient) {
          var { data, error } = await supabaseClient.from("feedback").insert([payload]);
          if (error) throw error;
          showFbResult("✅ 留言提交成功！感谢你的宝贵建议，我会认真阅读并改进。", "success");
        } else {
          throw new Error("Supabase SDK 未加载，留言未保存");
        }
        feedbackForm.reset();
        fbCount.textContent = "0";
      } catch (err) {
        console.error("[Feedback] 提交失败:", err);
        showFbResult("❌ 提交失败，请稍后重试。如问题持续请通过邮箱联系我。", "error");
      } finally {
        fbSubmit.classList.remove("loading");
        fbSubmitText.textContent = currentLang === "zh" ? "提交反馈" : "Submit";
        fbSubmit.disabled = false;
      }
    });
  }

})();

