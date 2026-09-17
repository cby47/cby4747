/* =========================================
   V2 个人主页 · 交互增强
   - 导航当前区块高亮
   - 区块滚动进场动画
   - 页面滚动时导航加底部阴影
   ========================================= */

(function () {
  "use strict";

  /* 1) 导航当前区块高亮（Scrollspy） */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".links a");

  function setActiveLink() {
    var pos = window.scrollY + 120;
    var currentId = "";
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) {
        currentId = sec.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
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

  /* 4) 常驻桌宠交互：点击互动 / 按住拖动 / 滚轮缩放 / 右键菜单 / 气泡说话 */
  var floatPet = document.getElementById("float-pet");
  if (floatPet) {
    var petImg = document.getElementById("float-pet-img");
    var petBubble = document.getElementById("pet-bubble");
    var petMenu = document.getElementById("pet-menu");
    var petScale = 2.2; // 当前缩放（2.2 = 最大，开屏即最大）
    // 基准尺寸随视口切换（对应 CSS：桌面 110×132，≤640px 为 84×100）
    var isMobile = function () { return window.innerWidth <= 640; };
    var baseW = function () { return isMobile() ? 84 : 110; };
    var baseH = function () { return isMobile() ? 100 : 132; };
    var followMode = false, followTimer = null;
    var bubbleTimer = null;

    // 初始化：把 CSS 的 right/bottom 定位统一转成 left/top，
    // 使拖动/缩放/散步全部走同一套坐标，避免定位体系冲突。
    function initPetPos() {
      var rect = floatPet.getBoundingClientRect();
      floatPet.style.left = rect.left + "px";
      floatPet.style.top = rect.top + "px";
      floatPet.style.right = "auto";
      floatPet.style.bottom = "auto";
    }

    function clampPet() { // 缩放时约束桌宠不超出视口
      var rect = floatPet.getBoundingClientRect();
      floatPet.style.left = Math.max(0, Math.min(window.innerWidth - rect.width, rect.left)) + "px";
      floatPet.style.top = Math.max(0, Math.min(window.innerHeight - rect.height, rect.top)) + "px";
      floatPet.style.right = "auto";
      floatPet.style.bottom = "auto";
    }

    function applyScale() { // 用 width/height 实现真实缩放（img object-fit:contain）
      floatPet.style.width = Math.round(baseW() * petScale) + "px";
      floatPet.style.height = Math.round(baseH() * petScale) + "px";
    }

    function setBubble(text) { // 气泡说话
      if (!petBubble) return;
      petBubble.textContent = text;
      petBubble.classList.add("show");
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(function () { petBubble.classList.remove("show"); }, 1800);
    }

    function petAction(act) { // 各菜单动作
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
            stopWalk(); /* 跟随与散步互斥：开启跟随时停止散步 */
            startFollowLoop();
            setGlowMode("pet");
          } else {
            stopFollowLoop();
            setGlowMode("cursor");
          }
          /* 菜单切换：跟随 ↔ 停止跟随 */
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
    function wiggle() {
      floatPet.classList.remove("play");
      void floatPet.offsetWidth;
      floatPet.classList.add("play");
      floatPet.classList.remove("sleeping");
      setTimeout(function () { floatPet.classList.remove("play"); }, 600);
    }

    /* 散步：在网页内持续左右往返走动（真实移动位置），直到右键菜单「结束散步」才停下 */
    var walkTimer = null, walking = false;
    function walkMove(speak) {
    if (walking) return; // 正在散步则忽略重复触发
   speak = (speak === undefined)? true : speak; // 默认说话，可传 false 静默散步
   walking = true;
   setGlowMode("pet"); /* 散步开始：高光跟随桌宠 */
   // 菜单切换：散步开始 -> 隐藏"散步"，显示"停止散步"
   var walkItem = document.getElementById("pet-walk-item");
   var stopItem = document.getElementById("pet-stopwalk-item");
   if (walkItem) walkItem.style.display = "none";
   if (stopItem) stopItem.style.display = "block";
      followMode = false;      // 打断跟随
      stopFollowLoop();         // 停止跟随 rAF 循环
      floatPet.classList.remove("sleeping");
      var rect = floatPet.getBoundingClientRect();
      var startLeft = floatPet.offsetLeft;
      var startTop = floatPet.offsetTop;
      var startW = rect.width;

      // 在视口可用宽度内完整往返：右 -> 左 -> 右 -> 左 …（不回到起点停留）
      var margin = 8;                       // 边缘留白
      var maxRight = window.innerWidth - startW - margin;
      var maxLeft = margin;

      // 路线：向右走到右侧边缘，再向左走到左侧边缘，如此往复，永不止步
      var goingRight = true;
      var SPEED = 3 / 45; /* 像素/毫秒：保持原速度（原 45ms 走 3px） */
      var lastWalkTime = 0;
      var WALK_INTERVAL = 16; /* 约 60fps，流畅不掉帧 */

      function walkTick() {
        if (!walking) return; /* 已被「结束散步」中断则不再调度 */
        var now = performance.now();
        if (!lastWalkTime) lastWalkTime = now;
        var delta = Math.min(now - lastWalkTime, 50); /* 限制最大步长，避免切后台后跳变 */
        lastWalkTime = now;
        var step = SPEED * delta; /* 基于时间差的步长，帧率变化时速度一致 */
        var curLeft = parseFloat(floatPet.style.left) || floatPet.offsetLeft;
        floatPet.style.top = startTop + "px"; /* 固定高度，保持平滑不走动跳动 */
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
        glowFollowPet(); /* 散步中：高光跟随桌宠 */
        walkTimer = setTimeout(walkTick, WALK_INTERVAL); /* 16ms 约 60fps，流畅 */
      }

      if (speak) setBubble("出去散散步，玩一会儿~ 🚶");
      walkTimer = setTimeout(walkTick, WALK_INTERVAL);
    }
    function stopWalk() { // 中断散步，停在当前位置（不复位）
   if (walkTimer) { clearTimeout(walkTimer); walkTimer = null; }
   walking = false;
   setGlowMode("cursor"); /* 散步结束：恢复鼠标高光 */
   // 菜单切换：停止散步 -> 恢复"散步"，隐藏"停止散步"
   var walkItem = document.getElementById("pet-walk-item");
   var stopItem = document.getElementById("pet-stopwalk-item");
   if (walkItem) walkItem.style.display = "block";
    if (stopItem) stopItem.style.display = "none";
    }
    
    /* 4.1) 按住拖动（保持 fixed 定位） */
    var pDragging = false, pX = 0, pY = 0, pLeft = 0, pTop = 0, pMoved = false;
    floatPet.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return; // 只响应左键
      pDragging = true;
      pMoved = false;
      hideMenu();
      stopWalk(); // 点击/拖动时中断散步
      pX = e.clientX;
      pY = e.clientY;
      pLeft = floatPet.offsetLeft;
      pTop = floatPet.offsetTop;
      setGlowMode("pet"); /* 按下桌宠：光斑改为跟随桌宠（桌宠经过处有光） */
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
      glowFollowPet(); /* 拖动中：高光跟随桌宠位置 */
    });
    document.addEventListener("mouseup", function () {
      if (!pDragging) return;
      pDragging = false;
      if (!pMoved) setBubble("嘿！别乱点～ 😄"); // 点击互动
      setGlowMode("cursor"); /* 松开桌宠：恢复鼠标高光跟随 */
    });

    /* 4.2) 滚轮缩放 */
    floatPet.addEventListener("wheel", function (e) {
      e.preventDefault();
      petScale = Math.max(0.5, Math.min(2.2, petScale + (e.deltaY > 0 ? -0.15 : 0.15)));
      applyScale();
      clampPet();
      if (petScale > 1) setBubble("放大一下 🔍"); else if (petScale < 1) setBubble("缩小一点~");
    }, { passive: false });

    /* 4.3) 右键菜单 */
    floatPet.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      setGlowMode("off"); /* 打开菜单时关闭高光，避免干扰 */
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
      /* 菜单关闭后恢复高光：跟随/散步中保持 pet，否则 cursor */
      setGlowMode(followMode || walking ? "pet" : "cursor");
    }

    if (petMenu) {
      petMenu.addEventListener("click", function (e) {
        var item = e.target.closest(".pet-item");
        hideMenu(); /* 先关菜单再执行动作，保证散步/跟随的高光模式生效 */
        if (item) petAction(item.getAttribute("data-act"));
      });
    }
    document.addEventListener("click", function (e) {
      if (petMenu && !petMenu.contains(e.target) && e.target !== floatPet) hideMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hideMenu();
    });

    /* 4.4) 跟随模式：rAF 循环持续向鼠标靠拢（修复原 mousemove+clearTimeout 高频触发导致卡住） */
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
        var step = Math.min(12, dist * 0.06); /* 距离越远步长越大，近处缓慢 */
        floatPet.style.left = (floatPet.offsetLeft + dx / dist * step) + "px";
        floatPet.style.top = (floatPet.offsetTop + dy / dist * step) + "px";
        floatPet.style.right = "auto";
        floatPet.style.bottom = "auto";
        glowFollowPet(); /* 跟随移动：高光跟随桌宠 */
      }
      followRaf = requestAnimationFrame(followTick);
    }
    function startFollowLoop() { if (!followRaf) followRaf = requestAnimationFrame(followTick); }
    function stopFollowLoop() { if (followRaf) { cancelAnimationFrame(followRaf); followRaf = null; } }
    /* 4.5) 视口变化时重新应用缩放并约束位置 */
    window.addEventListener("resize", function () {
      applyScale();
      clampPet();
    });

    applyScale(); /* 先应用初始缩放（开屏最大），再转换坐标 */
    initPetPos(); // 启动时把 right/bottom 转成 left/top，统一坐标体系

    /* 4.6) 开屏自动散步：页面打开后稍等片刻，让桌宠自动走一圈（仅启动时触发一次） */
    var introWalkTimer = setTimeout(function () {
      walkMove(false); // 开屏自动散步：不说话
    }, 1200);
  }
/* 5) 数字分身 · 本地智能问答 */
var avatarLauncher = document.getElementById("avatar-launcher");
var chatPanel = document.getElementById("chat-panel");
var chatClose = document.getElementById("chat-close");
var chatBody = document.getElementById("chat-body");
var chatForm = document.getElementById("chat-form");
var chatInput = document.getElementById("chat-input");
var quickButtons = document.querySelectorAll(".chat-quick button");

if (
avatarLauncher &&
chatPanel &&
chatClose &&
chatBody &&
chatForm &&
chatInput
) {
var chatIsOpen = false;

/* 打开或关闭聊天窗口 */
function setChatOpen(open) {
chatIsOpen = open;
chatPanel.classList.toggle("open", open);
chatPanel.setAttribute("aria-hidden", open? "false" : "true");
avatarLauncher.setAttribute("aria-expanded", open? "true" : "false");

if (open) {
window.setTimeout(function () {
chatInput.focus();
}, 220);
}
}

/* 添加一条聊天消息 */
function addChatMessage(text, role) {
var message = document.createElement("div");
message.className = "msg " + role;
message.textContent = text;
chatBody.appendChild(message);
chatBody.scrollTop = chatBody.scrollHeight;
}

/* 根据问题生成本地回复 */
function getAvatarReply(question) {
var text = question
.toLowerCase()
.replace(/\s+/g, "");

if (/你好|您好|嗨|hello|hi|在吗/.test(text)) {
return "你好呀～我是小宇，Bob 的数字分身。很高兴认识你！你可以问我关于他的学校、专业、获奖、兴趣和联系方式。";
}

if (/你是谁|小宇|数字分身|机器人|助手/.test(text)) {
return "我是「小宇」，陈柏宇（Bob）的本地数字分身。我负责接待来到个人主页的访客，并介绍他的学习经历、获奖信息和兴趣爱好。";
}

if (/介绍|陈柏宇|柏宇|bob|他是谁|关于他/.test(text)) {
return "陈柏宇，英文名 Bob Chen，是天津大学与香港理工大学联合培养的智能生物医学专业学生，计划于 2026 年 8 月开始大学生活。";
}

if (/学校|大学|天津大学|天大|香港理工|港理工|poly/.test(text)) {
return "Bob 就读于天津大学与香港理工大学联合培养项目，会在两所学校的学习环境中拓展自己的专业视野。";
}

if (/专业|生物医学|bme|学什么|方向/.test(text)) {
return "他的专业是智能生物医学，也就是 Biomedical Engineering（BME）。这是一个结合医学、工程、人工智能与生命科学的交叉学科。";
}

if (/年级|大几|入学|新生|什么时候/.test(text)) {
return "他是 2026 级大一新生，计划于 2026 年 8 月入学。";
}

if (/获奖|奖项|一等奖|比赛|大赛|机器人挑战/.test(text)) {
return "他曾在 2023 年横琴粤澳深度合作区人工智能大赛暨第五届粤港澳青少年机器人大赛中，获得人工智能轮式机器人创意挑战个人挑战赛一等奖。";
}

if (/兴趣|爱好|喜欢|平时做什么/.test(text)) {
return "他的兴趣包括科技与机器人、音乐、运动，以及阅读和持续学习。他很享受把想法转化为实际作品的过程。";
}

if (/机器人|人工智能|科技|ai/.test(text)) {
return "Bob 对人工智能和机器人很感兴趣，喜欢研究技术、动手搭建，并尝试把创意变成能够运行的作品。";
}

if (/音乐|听歌/.test(text)) {
return "音乐是他学习之余放松自己的方式，也是日常生活中的重要陪伴。";
}

if (/运动|足球|户外/.test(text)) {
return "他喜欢运动、球类与户外活动，希望通过运动保持活力和良好的状态。";
}

if (/邮箱|联系|联系方式|找他|email|邮件/.test(text)) {
return "你可以通过邮箱联系他：cby4747@tju.edu.cn";
}

if (/主页|网站|网页|作品/.test(text)) {
return "这个个人主页由 Bob 持续完善，目前包含个人介绍、获奖经历、成长足迹、兴趣爱好、互动桌宠和数字分身。";
}

if (/谢谢|感谢|好的|明白|再见|拜拜/.test(text)) {
return "不客气～很高兴能帮到你！如果还想了解 Bob，随时可以继续问我。";
}

return "这个问题我暂时还没有学会回答。你可以试试问我：Bob 是谁、他的学校和专业、获得过什么奖、有哪些兴趣，或者怎样联系他。";
}

/* 发送访客问题 */
function sendAvatarQuestion(question) {
var cleanQuestion = question.trim();

if (!cleanQuestion) {
return;
}

addChatMessage(cleanQuestion, "user");
chatInput.value = "";

window.setTimeout(function () {
addChatMessage(getAvatarReply(cleanQuestion), "bot");
}, 360);
}

/* 点击数字分身按钮 */
avatarLauncher.addEventListener("click", function () {
setChatOpen(!chatIsOpen);
});

/* 点击关闭按钮 */
chatClose.addEventListener("click", function () {
setChatOpen(false);
});

/* 输入框提交 */
chatForm.addEventListener("submit", function (event) {
event.preventDefault();
sendAvatarQuestion(chatInput.value);
});

/* 快捷问题 */
quickButtons.forEach(function (button) {
button.addEventListener("click", function () {
var question = button.getAttribute("data-q");

if (!chatIsOpen) {
setChatOpen(true);
}

sendAvatarQuestion(question || "");
});
});

/* 按 Escape 关闭聊天窗口 */
document.addEventListener("keydown", function (event) {
if (event.key === "Escape" && chatIsOpen) {
setChatOpen(false);
}
});
/* 上面的数字分身代码 */
} /* 修复：闭合 if (avatarLauncher && …) 判断块，否则脚本整体无法解析 */

/* 6) 光标高光：默认跟随鼠标；与桌宠交互时暂停鼠标跟随；桌宠移动时高光跟随桌宠（桌宠经过处有光） */
var cursorGlow = document.getElementById("cursor-glow");
var glowMode = "cursor"; /* cursor=跟鼠标 / pet=跟桌宠 / off=关闭 */
var gX = 0, gY = 0, tX = 0, tY = 0, gRaf = null, gFirst = true;
var gReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function glowApply() {
  if (cursorGlow) cursorGlow.style.transform = "translate(" + gX + "px," + gY + "px)";
}
function setGlowMode(mode) { /* 桌宠交互联动：pet=跟随桌宠 / off=关闭 / cursor=恢复跟鼠标 */
  glowMode = mode;
  if (!cursorGlow) return;
  if (mode === "off") {
    cursorGlow.classList.remove("on");
    if (gRaf) { cancelAnimationFrame(gRaf); gRaf = null; }
  } else {
    cursorGlow.classList.add("on");
  }
}
function glowFollowPet() { /* 桌宠移动时把光斑中心移到桌宠目标位置（桌宠经过处有光） */
  if (glowMode !== "pet" || !cursorGlow || !floatPet) return;
  if (gRaf) { cancelAnimationFrame(gRaf); gRaf = null; }
  /* 用 style 目标坐标而非 getBoundingClientRect：桌宠 left/top 有 CSS 过渡，
     立即读 rect 会拿到过渡起始值导致光斑慢半拍 */
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
    if (glowMode !== "cursor") return; /* 与桌宠交互期间不跟随鼠标，避免拖动卡顿 */
    tX = e.clientX;
    tY = e.clientY;
    if (gFirst) { gX = tX; gY = tY; gFirst = false; }
    cursorGlow.classList.add("on");
    if (!gRaf) {
      gRaf = requestAnimationFrame(function tick() {
        gRaf = null;
        var dx = tX - gX, dy = tY - gY;
        if (!gReduce && (Math.abs(dx) >= 0.5 || Math.abs(dy) >= 0.5)) {
          gX += dx * 0.18; /* 缓动跟随：数值越小越"拖尾" */
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
    cursorGlow.classList.remove("on"); /* 光标离开页面时淡出 */
  });
}

/* 头像点击放大图（lightbox）：导航头像 + hero 大头像均可点击弹出大图 */
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
  avatarLightbox.addEventListener("click", closeAvatarLightbox); /* 点击遮罩关闭 */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAvatarLightbox();
  });
}

/* 足迹照片墙 · 点击弹出旅游详情 */
var travelModal = document.getElementById("travel-modal");
if (travelModal) {
  var travelModalCity = document.getElementById("travel-modal-city");
  var travelModalDate = document.getElementById("travel-modal-date");
  var filmFrames = document.getElementById("film-frames");
  var travelModalClose = travelModal.querySelector(".travel-modal-close");
  var travelModalBackdrop = travelModal.querySelector(".travel-modal-backdrop");

  /* 旅游数据（预留，后续可补充真实详情） */
  var travelData = {
    "上海": { date: "待补充" },
    "北京": { date: "待补充" },
    "成都": { date: "待补充" },
    "西安": { date: "待补充" },
    "广州": { date: "待补充" },
    "韶关": { date: "待补充" },
    "杭州": { date: "待补充" },
    "南京": { date: "待补充" },
    "长沙": { date: "待补充" },
    "深圳": { date: "待补充" },
    "潮州": { date: "待补充" },
    "汕头": { date: "待补充" },
    "澳门": { date: "待补充" },
    "香港": { date: "待补充" },
    "重庆": { date: "待补充" },
    "新加坡": { date: "待补充" },
    "马来西亚": { date: "待补充" }
  };

  /* 基于城市名生成 6 张不同色调的渐变照片（模拟胶卷里的多张照片） */
  function generateCityGradients(city) {
    var hue = 0;
    for (var i = 0; i < city.length; i++) hue += city.charCodeAt(i) * 17;
    hue = hue % 360;
    var grads = [];
    for (var j = 0; j < 6; j++) {
      var h1 = (hue + j * 22) % 360;
      var h2 = (hue + j * 22 + 45) % 360;
      var s1 = 65 + (j % 3) * 8;
      var l1 = 55 + (j % 2) * 8;
      grads.push("linear-gradient(" + (120 + j * 12) + "deg, hsl(" + h1 + "," + s1 + "%," + l1 + "%), hsl(" + h2 + "," + (s1 + 10) + "%," + (l1 - 8) + "%))");
    }
    return grads;
  }

  function openTravelModal(city) {
    var data = travelData[city] || { date: "待补充" };
    travelModalCity.textContent = city;
    travelModalDate.textContent = data.date;
    /* 生成胶卷照片帧 */
    filmFrames.innerHTML = "";
    var gradients = generateCityGradients(city);
    gradients.forEach(function (grad, idx) {
      var frame = document.createElement("div");
      frame.className = "film-frame";
      frame.style.animation = "frameIn 0.45s cubic-bezier(0.34,1.56,0.64,1) " + (idx * 0.07) + "s both";
      var photo = document.createElement("div");
      photo.className = "film-photo";
      photo.style.background = grad;
      photo.style.backgroundSize = "cover";
      photo.style.backgroundPosition = "center";
      frame.appendChild(photo);
      filmFrames.appendChild(frame);
    });
    filmFrames.scrollLeft = 0; /* 每次打开重置到开头 */
    travelModal.classList.add("active");
  }
  function closeTravelModal() { travelModal.classList.remove("active"); }

  document.querySelectorAll(".photo-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var city = item.getAttribute("data-city");
      openTravelModal(city);
    });
  });

  travelModalClose.addEventListener("click", closeTravelModal);
  travelModalBackdrop.addEventListener("click", closeTravelModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeTravelModal();
  });
}

/* ============ V3 反馈表单 Feedback（Supabase 存储） ============ */
var feedbackForm = document.getElementById("feedback-form");
if (feedbackForm) {
  /* ===== Supabase 配置（请填入你的项目 URL 和 anon key） ===== */
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

  /* 字数统计 */
  fbMessage.addEventListener("input", function () {
    fbCount.textContent = fbMessage.value.length;
  });

  /* 显示结果提示 */
  function showFbResult(msg, type) {
    fbResult.textContent = msg;
    fbResult.className = "feedback-result show " + type;
  }
  function hideFbResult() {
    fbResult.className = "feedback-result";
    fbResult.textContent = "";
  }

  /* 表单验证 */
  function validateFb() {
    var valid = true;
    fbMessage.classList.remove("error");
    if (!fbMessage.value.trim()) {
      fbMessage.classList.add("error");
      showFbResult("请填写反馈内容后再提交～", "error");
      valid = false;
    }
    if (fbEmail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fbEmail.value.trim())) {
      showFbResult("邮箱格式不正确，请检查后重试。", "error");
      valid = false;
    }
    return valid;
  }

  /* 获取选中的反馈类型 */
  function getFbType() {
    var checked = document.querySelector('input[name="type"]:checked');
    return checked ? checked.value : "未分类";
  }

  /* 提交处理 */
  feedbackForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideFbResult();
    if (!validateFb()) return;

    /* 提交中状态 */
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
        /* 真实提交到 Supabase */
        var { data, error } = await supabaseClient.from("feedback").insert([payload]);
        if (error) throw error;
        showFbResult("✅ 反馈提交成功！感谢你的宝贵建议，我会认真阅读并改进。", "success");
      } else {
        /* Supabase 未配置时的本地模拟（用于预览交互效果） */
        await new Promise(function (r) { setTimeout(r, 800); });
        console.log("[Feedback] Supabase 未配置，本地模拟提交。payload:", payload);
        showFbResult("✅ 反馈提交成功！（当前为本地预览模式，配置 Supabase 后将真实存储）感谢你的宝贵建议！", "success");
      }
      /* 提交成功后清空表单 */
      feedbackForm.reset();
      fbCount.textContent = "0";
    } catch (err) {
      console.error("[Feedback] 提交失败:", err);
      showFbResult("❌ 提交失败，请稍后重试。如问题持续请通过邮箱联系我。", "error");
    } finally {
      fbSubmit.classList.remove("loading");
      fbSubmitText.textContent = "提交反馈";
      fbSubmit.disabled = false;
    }
  });
}

})(); /* 修复：IIFE 需要 () 调用才会执行 */
