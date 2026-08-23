/* ============================================================
   NOX — Ứng dụng học từ vựng (Thẻ / Viết / Quizz / Kho)
   ============================================================ */

const STORAGE_KEY = "nox_app_data_v1";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function defaultList(name) {
  return { id: uid(), name, items: [], createdAt: Date.now(), reminderEnabled: false };
}
function defaultDiaryList(name) {
  return { id: uid(), name, content: "", createdAt: Date.now() };
}

function defaultState() {
  return {
    themeLevel: 1,
    categories: {
      flashcard: [defaultList("Danh sách 1")],
      writing: [defaultList("Danh sách 1")],
      dictionary: [defaultList("Danh sách 1")],
      listening: [defaultList("Danh sách 1")],
      diary: [defaultDiaryList("Nhật ký 1")],
    },
    selected: { flashcard: [], writing: [], listening: [] },
    activeWhList: { flashcard: null, writing: null, dictionary: null, listening: null, diary: null },
    reminder: {
      enabled: false, autoRead: false, desktopNotify: false, mobileNotify: { enabled: false },
      background: { enabled: false, cycles: 1, intervalMin: 5 },
      autoOff: { enabled: false, mode: "cycles", cycles: 1, minutes: 5 },
      autoOn: { enabled: false, mode: "countdown", minutes: 5, clock: "17:00" },
    },
    settings: { flipVolume: 100, ttsVolume: 100, sfxEnabled: true, sfxVolume: 100, reminderMinDisplay: 10, reminderMaxReads: 2, fcFlipDuration: 10, qtClearOnRefocus: false, qtAutoDetectLang: false, showDiary: false, momentumSystemNotify: false, momentumQuickview: false, momentumThemeSync: false, momentumIdleMinutes: 3, wrDifficulty: "medium", ngheVoiceMode: "multi", ngheSingleVoiceURI: "" },
    studyMomentum: { score: 0, streakGain: 1, lastActionAt: null, history: [] },
    bubblePos: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // basic shape guard
    if (!parsed.categories) return defaultState();
    if (!parsed.selected) parsed.selected = { flashcard: [], writing: [] };
    if (!parsed.activeWhList) parsed.activeWhList = { flashcard: null, writing: null, dictionary: null, listening: null, diary: null };
    if (!parsed.categories.diary || !parsed.categories.diary.length) {
      parsed.categories.diary = [defaultDiaryList("Nhật ký 1")];
    }
    if (!("diary" in parsed.activeWhList)) parsed.activeWhList.diary = null;
    if (!parsed.categories.listening || !parsed.categories.listening.length) {
      parsed.categories.listening = [defaultList("Danh sách 1")];
    }
    if (!("listening" in parsed.activeWhList)) parsed.activeWhList.listening = null;
    if (!parsed.selected.listening) parsed.selected.listening = [];
    if (!parsed.reminder) parsed.reminder = { enabled: false };
    // backfill createdAt for lists saved before this field existed, preserving
    // their existing relative order
    Object.keys(parsed.categories).forEach((catKey) => {
      parsed.categories[catKey].forEach((list, idx) => {
        if (!list.createdAt) list.createdAt = Date.now() - (parsed.categories[catKey].length - idx) * 1000;
      });
    });
    if (!parsed.themeLevel) {
      // migrate from old light/dark boolean theme if present
      parsed.themeLevel = parsed.theme === "dark" ? 4 : 1;
    }
    if (parsed.themeLevel > 18) parsed.themeLevel = 18;
    if (parsed.reminder.autoRead === undefined) parsed.reminder.autoRead = false;
    if (parsed.reminder.desktopNotify === undefined) parsed.reminder.desktopNotify = false;
    if (!parsed.reminder.mobileNotify) parsed.reminder.mobileNotify = { enabled: false };
    if (parsed.reminder.mobileNotify.enabled === undefined) parsed.reminder.mobileNotify.enabled = false;
    delete parsed.reminder.mobileNotify.style; // đã bỏ lựa chọn kiểu, chỉ còn bong bóng chat
    if (!parsed.reminder.background) parsed.reminder.background = { enabled: false, cycles: 1, intervalMin: 5 };
    if (parsed.reminder.background.cycles === undefined) parsed.reminder.background.cycles = 1;
    if (parsed.reminder.background.intervalMin === undefined) parsed.reminder.background.intervalMin = 5;
    if (!parsed.reminder.autoOff) parsed.reminder.autoOff = { enabled: false, mode: "cycles", cycles: 1, minutes: 5 };
    if (parsed.reminder.autoOff.enabled === undefined) parsed.reminder.autoOff.enabled = false;
    if (parsed.reminder.autoOff.mode === undefined) parsed.reminder.autoOff.mode = "cycles";
    if (parsed.reminder.autoOff.cycles === undefined) parsed.reminder.autoOff.cycles = 1;
    if (parsed.reminder.autoOff.minutes === undefined) parsed.reminder.autoOff.minutes = 5;
    if (!parsed.reminder.autoOn) parsed.reminder.autoOn = { enabled: false, mode: "countdown", minutes: 5, clock: "17:00" };
    if (parsed.reminder.autoOn.enabled === undefined) parsed.reminder.autoOn.enabled = false;
    if (parsed.reminder.autoOn.mode === undefined) parsed.reminder.autoOn.mode = "countdown";
    if (parsed.reminder.autoOn.minutes === undefined) parsed.reminder.autoOn.minutes = 5;
    if (parsed.reminder.autoOn.clock === undefined) parsed.reminder.autoOn.clock = "17:00";
    if (!parsed.bubblePos) parsed.bubblePos = null; // vị trí bong bóng chat do người dùng tự kéo
    if (!parsed.settings) parsed.settings = { flipVolume: 70, ttsVolume: 100 };
    if (parsed.settings.flipVolume === undefined) parsed.settings.flipVolume = 70;
    if (parsed.settings.ttsVolume === undefined) parsed.settings.ttsVolume = 100;
    if (parsed.settings.reminderMinDisplay === undefined) parsed.settings.reminderMinDisplay = 10;
    if (parsed.settings.reminderMaxReads === undefined) parsed.settings.reminderMaxReads = 2;
    if (parsed.settings.fcFlipDuration === undefined) parsed.settings.fcFlipDuration = 10;
    if (parsed.settings.sfxEnabled === undefined) parsed.settings.sfxEnabled = true;
    if (parsed.settings.sfxVolume === undefined) parsed.settings.sfxVolume = 100;
    if (parsed.settings.qtClearOnRefocus === undefined) parsed.settings.qtClearOnRefocus = false;
    if (parsed.settings.qtAutoDetectLang === undefined) parsed.settings.qtAutoDetectLang = false;
    if (parsed.settings.showDiary === undefined) parsed.settings.showDiary = false;
    if (parsed.settings.momentumSystemNotify === undefined) parsed.settings.momentumSystemNotify = false;
    if (parsed.settings.momentumQuickview === undefined) parsed.settings.momentumQuickview = false;
    if (parsed.settings.momentumThemeSync === undefined) parsed.settings.momentumThemeSync = false;
    if (parsed.settings.momentumIdleMinutes === undefined) parsed.settings.momentumIdleMinutes = 3;
    if (parsed.settings.wrDifficulty === undefined) parsed.settings.wrDifficulty = "medium";
    if (!parsed.studyMomentum) parsed.studyMomentum = { score: 0, streakGain: 1, lastActionAt: null, history: [] };
    if (!parsed.studyMomentum._tzFixed && parsed.studyMomentum.history && parsed.studyMomentum.history.length) {
      const tzOffsetSec = -new Date().getTimezoneOffset() * 60;
      parsed.studyMomentum.history.forEach((p) => { p.t += tzOffsetSec; });
    }
    parsed.studyMomentum._tzFixed = true;
    return parsed;
  } catch (e) {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleCloudPush();
}

let state = loadState();

/* ============================================================
   ĐỒNG BỘ (FIREBASE REALTIME DATABASE)
   ============================================================ */
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBmyZrvB0WE8O60mmzzOrhtgawk8MG3FRo",
  authDomain: "nox-sync-3131e.firebaseapp.com",
  databaseURL: "https://nox-sync-3131e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nox-sync-3131e",
  storageBucket: "nox-sync-3131e.firebasestorage.app",
  messagingSenderId: "294723239052",
  appId: "1:294723239052:web:0aa8e72999cdc7d00b8fa9",
};

/* ---- Config database tuỳ chỉnh (để chuyển sang tài khoản / dự án Firebase khác) ---- */
const CUSTOM_FIREBASE_CONFIG_KEY = "nox_custom_firebase_config";
function getCustomFirebaseConfig() {
  try {
    const raw = localStorage.getItem(CUSTOM_FIREBASE_CONFIG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.databaseURL) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}
function getActiveFirebaseConfig() {
  return getCustomFirebaseConfig() || DEFAULT_FIREBASE_CONFIG;
}

const SYNC_CODE_KEY = "nox_sync_code";
const PENDING_PUSH_KEY = "nox_sync_pending";
let syncCode = localStorage.getItem(SYNC_CODE_KEY) || "";
let syncEnabled = false;
let applyingRemoteState = false;
let cloudPushTimer = null;
let fbDbRef = null;
let fbConnectedRef = null;
let hasPendingPush = localStorage.getItem(PENDING_PUSH_KEY) === "1";

function initFirebaseApp() {
  if (firebase.apps && firebase.apps.length) return;
  firebase.initializeApp(getActiveFirebaseConfig());
}
async function reinitFirebaseApp() {
  // Xoá app Firebase hiện tại (nếu có) rồi khởi tạo lại với config đang active —
  // dùng khi người dùng đổi sang database khác hoặc quay về mặc định.
  if (firebase.apps && firebase.apps.length) {
    await Promise.all(firebase.apps.map((a) => a.delete().catch(() => {})));
  }
  initFirebaseApp();
}

let currentSyncStatus = "off";
function setSyncStatus(status) {
  // status: off | connecting | synced | pending | offline | error
  currentSyncStatus = status;
  const dot = document.getElementById("settings-sync-dot");
  const label = document.getElementById("settings-sync-label");
  if (!dot) return;
  dot.className = "settings-sync-dot sync-" + status;
  if (label) {
    label.textContent =
      status === "synced" ? `Đã kết nối — mã: ${syncCode}` :
      status === "connecting" ? "Đang kết nối..." :
      status === "pending" ? `Mất mạng — đang chờ đồng bộ (mã: ${syncCode})` :
      status === "offline" ? `Không có mạng — dữ liệu vẫn lưu trên máy (mã: ${syncCode})` :
      status === "error" ? "Lỗi đồng bộ" :
      "Chưa kết nối";
  }
}

function markPendingPush(pending) {
  hasPendingPush = pending;
  if (pending) localStorage.setItem(PENDING_PUSH_KEY, "1");
  else localStorage.removeItem(PENDING_PUSH_KEY);
}

function renderCurrentTab() {
  applyThemeLevel(state.themeLevel || 1, false);
  const activeBtn = document.querySelector(".main-tab-btn.active");
  const tab = activeBtn ? activeBtn.dataset.tab : "flashcard";
  if (tab === "flashcard") renderFlashcardTab();
  if (tab === "writing") renderWritingTab();
  if (tab === "warehouse") renderWarehouseTab();
}

function connectSync(code) {
  initFirebaseApp();
  syncCode = code.trim();
  if (!syncCode) return;
  localStorage.setItem(SYNC_CODE_KEY, syncCode);
  syncEnabled = true;
  setSyncStatus("connecting");
  if (fbDbRef) fbDbRef.off();
  if (fbConnectedRef) fbConnectedRef.off();
  fbDbRef = firebase.database().ref("nox_sync/" + syncCode);
  fbDbRef.on(
    "value",
    (snap) => {
      const remote = snap.val();
      if (!remote || !remote.data) {
        pushStateToCloud(true);
        return;
      }
      if (applyingRemoteState) return;
      if (remote.updatedAt && remote.updatedAt <= (state.updatedAt || 0)) return;
      // nếu đang có thay đổi cục bộ chưa gửi được, ưu tiên giữ bản local
      // và để lần push tiếp theo (khi có mạng) tự quyết theo updatedAt
      if (hasPendingPush) return;
      applyingRemoteState = true;
      state = remote.data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      ensureSelected("flashcard");
      ensureSelected("writing");
      renderCurrentTab();
      applyingRemoteState = false;
    },
    () => setSyncStatus("error")
  );

  // Theo dõi trạng thái kết nối THẬT tới Firebase (đáng tin hơn navigator.onLine)
  fbConnectedRef = firebase.database().ref(".info/connected");
  fbConnectedRef.on("value", (snap) => {
    const isConnected = snap.val() === true;
    if (isConnected) {
      if (hasPendingPush) {
        pushStateToCloud(true); // mạng có lại — gửi luôn thay đổi đang chờ
      } else {
        setSyncStatus("synced");
      }
    } else {
      setSyncStatus(hasPendingPush ? "pending" : "offline");
    }
  });
}

window.addEventListener("online", () => {
  if (syncEnabled && hasPendingPush) pushStateToCloud(true);
});

function disconnectSync() {
  if (fbDbRef) fbDbRef.off();
  if (fbConnectedRef) fbConnectedRef.off();
  fbDbRef = null;
  fbConnectedRef = null;
  syncEnabled = false;
  syncCode = "";
  localStorage.removeItem(SYNC_CODE_KEY);
  markPendingPush(false);
  setSyncStatus("off");
}

function scheduleCloudPush() {
  if (!syncEnabled || applyingRemoteState) return;
  markPendingPush(true); // đánh dấu có thay đổi chưa chắc đã gửi thành công
  clearTimeout(cloudPushTimer);
  cloudPushTimer = setTimeout(() => pushStateToCloud(false), 800);
}

function pushStateToCloud(force) {
  if (!syncEnabled || !fbDbRef) return;
  if (applyingRemoteState && !force) return;
  state.updatedAt = Date.now();
  const payload = { data: state, updatedAt: state.updatedAt };
  markPendingPush(true);
  fbDbRef
    .set(payload)
    .then(() => {
      markPendingPush(false);
      setSyncStatus("synced");
    })
    .catch(() => {
      // gửi thất bại (mất mạng/lỗi) — giữ nguyên hàng đợi, sẽ tự thử lại khi có mạng
      setSyncStatus("pending");
    });
}

/* ------------------------------------------------------------
   Helpers on categories/lists/items
   ------------------------------------------------------------ */
function getCategory(cat) {
  return state.categories[cat];
}
function getList(cat, listId) {
  return getCategory(cat).find((l) => l.id === listId);
}
function ensureSelected(cat) {
  const ids = state.categories[cat].map((l) => l.id);
  state.selected[cat] = state.selected[cat].filter((id) => ids.includes(id));
  if (state.selected[cat].length === 0 && ids.length) state.selected[cat] = [ids[0]];
}
function itemsFromLists(cat, listIds) {
  const lists = getCategory(cat).filter((l) => listIds.includes(l.id));
  let items = [];
  lists.forEach((l) => (items = items.concat(l.items)));
  return items;
}
function allItems(cat) {
  let items = [];
  getCategory(cat).forEach((l) => (items = items.concat(l.items)));
  return items;
}
function statusLabel(cat, status) {
  if (cat === "writing") {
    return { new: "Chưa làm", known: "Làm đúng", difficult: "Làm sai" }[status];
  }
  return { new: "Đang học", known: "Đã biết", difficult: "Khó" }[status];
}
function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ============================================================
   ĐÀ HỌC TẬP (dùng cho tab Thống kê > Hệ số)
   - Mỗi hành động học (lật/đánh dấu thẻ, kiểm tra câu Viết, chọn đáp án Quizz)
     gọi logStudyAction(). Nếu hành động liên tiếp cách nhau < ngưỡng ngắt quãng
     (mặc định 3 phút, chỉnh được trong Cài đặt > Hệ số, min 1p max 30p — xem
     studyIdleTimeoutMs()) thì coi là đang học liên tục — "đà" (streakGain)
     tăng dần, điểm cộng vào ngày càng nhanh. Nếu cách nhau lâu hơn ngưỡng đó
     thì coi là bị ngắt quãng: trừ điểm theo thời gian vắng mặt (vắng càng lâu
     trừ càng nhanh) rồi "đà" về lại mức khởi điểm.
   - CHỈ Viết/Quizz mới thực sự xây "đà" (streakGain) và cộng điểm đáng kể.
     Thẻ (flashcard) chỉ giữ cho streak không bị coi là ngắt quãng (để không
     bị trừ điểm oan), nhưng bản thân không góp phần tăng đà và chỉ cộng một
     mức cực nhỏ, cố định — spam lật thẻ liên tục sẽ không đẩy hệ số lên
     đáng kể.
   ============================================================ */
// Thời gian ngắt quãng giờ lấy từ settings (thanh trượt trong Cài đặt > Hệ số),
// mặc định 3 phút, min 1 phút, max 30 phút — không còn là hằng số cố định.
function studyIdleTimeoutMs() {
  const minutes = Math.min(30, Math.max(1, (state.settings && state.settings.momentumIdleMinutes) || 3));
  return minutes * 60 * 1000;
}
const STUDY_IDLE_WARN_LEAD_MS = 20 * 1000; // cảnh báo trước 20 giây khi sắp hết hạn giữ đà
const FLASHCARD_FLAT_GAIN = 0.02; // mức cộng cố định, cực nhỏ, cho mỗi hành động ở Thẻ
let studyIdleWarnTimer = null;

// Lightweight Charts hiển thị timestamp số như thể nó là giờ UTC (không tự quy
// đổi múi giờ máy). Để trục thời gian hiện đúng giờ địa phương của người dùng,
// ta "đánh lừa" thư viện bằng cách cộng thêm độ lệch múi giờ vào timestamp
// trước khi đưa vào biểu đồ — chỉ ảnh hưởng phần HIỂN THỊ, không đụng đến
// mốc thời gian thật (m.lastActionAt) dùng để tính đà/suy giảm.
function chartLocalTs(epochMs) {
  const tzOffsetSec = -new Date().getTimezoneOffset() * 60;
  return Math.floor(epochMs / 1000) + tzOffsetSec;
}

function logStudyAction(source, isCorrect, customGain, customPenalty) {
  const m = state.studyMomentum;
  const now = Date.now();
  const isMinor = source === "flashcard"; // Thẻ: chỉ giữ streak, không xây đà

  if (m.lastActionAt !== null) {
    const gap = now - m.lastActionAt;
    if (gap > studyIdleTimeoutMs()) {
      const idleHours = gap / 3600000;
      const decay = 2 * idleHours + 0.3 * idleHours * idleHours;
      m.score -= decay;
      m.streakGain = 1;
    } else if (!isMinor) {
      m.streakGain = Math.min(m.streakGain + 0.2, 5);
    }
  }

  if (isMinor) {
    m.score += FLASHCARD_FLAT_GAIN;
  } else {
    m.score += m.streakGain;
    const gain = customGain !== undefined ? customGain : 0.5;
    const penalty = customPenalty !== undefined ? customPenalty : 0.2;
    if (isCorrect === true) m.score += gain;
    else if (isCorrect === false) m.score -= penalty;
  }
  m.lastActionAt = now;
  m.score = Math.round(m.score * 100) / 100;

  let ts = chartLocalTs(now);
  if (m.history.length && ts <= m.history[m.history.length - 1].t) {
    ts = m.history[m.history.length - 1].t + 1;
  }
  m.history.push({ t: ts, score: m.score });
  if (m.history.length > 5000) m.history.splice(0, m.history.length - 5000);
  saveState();

  scheduleStudyIdleWarning();
  updateBrandMomentumQuickview();
  applyMomentumThemeSync();
}

/* ---- Cảnh báo sắp hết thời gian giữ đà (chỉ hoạt động khi tab web đang mở) ---- */
function scheduleStudyIdleWarning() {
  if (studyIdleWarnTimer) clearTimeout(studyIdleWarnTimer);
  const m = state.studyMomentum;
  if (!m.lastActionAt) return;
  const remaining = studyIdleTimeoutMs() - STUDY_IDLE_WARN_LEAD_MS - (Date.now() - m.lastActionAt);
  if (remaining <= 0) return;
  studyIdleWarnTimer = setTimeout(fireStudyIdleWarning, remaining);
}
function fireStudyIdleWarning() {
  playMomentumWarnSound();
  showToast("⚠️ Sắp hết thời gian giữ đà học — làm thêm 1 hành động nữa để không bị ngắt quãng!", 5000);
  if (state.settings.momentumSystemNotify && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification("Nox — Sắp ngắt quãng đà học!", {
        body: "Quay lại học trong ít giây nữa để giữ đà, nếu không hệ số sẽ bắt đầu giảm.",
        icon: "icon-192.png",
        tag: "nox-momentum-warn",
      });
    } catch (e) { /* ignore */ }
  }
}

/* ---- Xem nhanh hệ số cạnh chữ "Nox" ---- */
function updateBrandMomentumQuickview() {
  const el = document.getElementById("brand-momentum");
  if (!el) return;
  const on = !!(state.settings && state.settings.momentumQuickview);
  el.classList.toggle("hidden", !on);
  if (!on) return;
  const score = state.studyMomentum.score;
  el.textContent = score.toFixed(1);
  el.classList.toggle("positive", score > 0);
  el.classList.toggle("negative", score < 0);
}

/* ---- Chỉ đổi màu viền các khung theo dấu của hệ số (không đổi cả theme) ---- */
function applyMomentumThemeSync() {
  if (!state.settings || !state.settings.momentumThemeSync) {
    const level = Math.min(18, Math.max(1, Math.round(state.themeLevel || 1)));
    const palette = THEME_PALETTES[level];
    document.body.style.setProperty("--border", palette.border);
    return;
  }
  const positive = state.studyMomentum.score >= 0;
  document.body.style.setProperty("--border", positive ? "#22c55e" : "#ef4444");
}

/* ============================================================
   TAB SWITCHING
   ============================================================ */
const tabButtons = document.querySelectorAll(".main-tab-btn");
const sidebarPanels = document.querySelectorAll(".sidebar-panel");
const tabContents = document.querySelectorAll(".tab-content");

function switchTab(tab) {
  if (typeof ngheStopFullPlay === "function") ngheStopFullPlay();
  tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  sidebarPanels.forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== tab));
  tabContents.forEach((c) => c.classList.toggle("hidden", c.dataset.content !== tab));
  if (tab === "flashcard") renderFlashcardTab();
  if (tab === "writing") renderWritingTab();
  if (tab === "listening") renderNgheTab();
  if (tab === "warehouse") renderWarehouseTab();
  mobilePanelExpanded = false;
  updateMobilePanelVisibility();
}
tabButtons.forEach((btn) => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
document.getElementById("warehouse-quick-open").addEventListener("click", () => switchTab("warehouse"));

/* ============================================================
   THEME TOGGLE
   ============================================================ */
/* ============================================================
   THEME LEVELS — 4 distinct fixed palettes (not interpolated)
   1 = Trắng, 2 = Ngả vàng, 3 = Hồng, 4 = Đen
   ============================================================ */
const THEME_PALETTES = {
  1: { // Trắng
    bg: "#f5f5f7", panel: "#ffffff", border: "#1f1f24", borderSoft: "#d8d8de",
    text: "#17171b", textMuted: "#6b6b76", accent: "#7c3aed", accentSoft: "#efe6ff",
    learningSoft: "#fff2dc", knownSoft: "#dff7ec", difficultSoft: "#fde3e2",
  },
  2: { // Ngả vàng
    bg: "#f5ecd7", panel: "#fbf4e4", border: "#3a2f18", borderSoft: "#e0d3ad",
    text: "#2b2410", textMuted: "#7d6d44", accent: "#7c3aed", accentSoft: "#f0e2c0",
    learningSoft: "#f7e0a8", knownSoft: "#dcead0", difficultSoft: "#f5d3bd",
  },
  3: { // Hồng
    bg: "#fbe0ea", panel: "#fff3f7", border: "#3a1a26", borderSoft: "#f0c9d8",
    text: "#2b0e18", textMuted: "#8a5a6c", accent: "#7c3aed", accentSoft: "#fbd9e8",
    learningSoft: "#fde0c0", knownSoft: "#dcefe0", difficultSoft: "#fbccd6",
  },
  4: { // Đen
    bg: "#111114", panel: "#1a1a1f", border: "#3a3a44", borderSoft: "#2c2c34",
    text: "#f2f2f5", textMuted: "#9a9aa6", accent: "#9d6bff", accentSoft: "#2c2140",
    learningSoft: "#3a2c12", knownSoft: "#0f2e22", difficultSoft: "#3a1616",
  },
  5: { // Đêm ấm — tông nâu hổ phách, ít ánh sáng xanh, dịu mắt ban đêm
    bg: "#1c1611", panel: "#241b14", border: "#4a3823", borderSoft: "#332818",
    text: "#e8d9c0", textMuted: "#a68f6c", accent: "#e0a458", accentSoft: "#3a2c17",
    learningSoft: "#3f2f14", knownSoft: "#1f2f1c", difficultSoft: "#3a1f18",
  },
  6: { // Đêm xanh rêu — tông xanh rêu trầm, dịu mắt ban đêm
    bg: "#101815", panel: "#16211d", border: "#2e4038", borderSoft: "#1f2d28",
    text: "#dce8e2", textMuted: "#84988f", accent: "#5fb894", accentSoft: "#1c2e27",
    learningSoft: "#332a14", knownSoft: "#173328", difficultSoft: "#301c1c",
  },
  7: { // Xanh biển
    bg: "#e7f2fb", panel: "#f6fbff", border: "#173247", borderSoft: "#cde3f3",
    text: "#0f2331", textMuted: "#587187", accent: "#2f7dd6", accentSoft: "#d7e9fb",
    learningSoft: "#fdecc4", knownSoft: "#d8f2e0", difficultSoft: "#fbdcdc",
  },
  8: { // Bạc hà
    bg: "#e3f7ef", panel: "#f3fdf8", border: "#123527", borderSoft: "#c7ead9",
    text: "#0d2a1e", textMuted: "#527863", accent: "#1f9d6c", accentSoft: "#d3f2e4",
    learningSoft: "#fbeecb", knownSoft: "#cdeedb", difficultSoft: "#fbdcdc",
  },
  9: { // Cam đào
    bg: "#fdece0", panel: "#fff6ef", border: "#4a2712", borderSoft: "#f3d3ba",
    text: "#38200f", textMuted: "#8a6247", accent: "#e8763a", accentSoft: "#fbe0cc",
    learningSoft: "#fbe3ad", knownSoft: "#dcefd6", difficultSoft: "#f8cfc5",
  },
  10: { // Tím than — dịu mắt ban đêm
    bg: "#13111f", panel: "#1b1830", border: "#3a3460", borderSoft: "#26213f",
    text: "#e6e2fa", textMuted: "#9089b8", accent: "#8b7bff", accentSoft: "#292350",
    learningSoft: "#382a17", knownSoft: "#152f25", difficultSoft: "#33191f",
  },
  11: { // Đỏ rượu vang — dịu mắt ban đêm
    bg: "#1a0f13", panel: "#241318", border: "#4a1f2a", borderSoft: "#33191f",
    text: "#f2dfe3", textMuted: "#a67885", accent: "#d1517a", accentSoft: "#3a1c25",
    learningSoft: "#332414", knownSoft: "#152a22", difficultSoft: "#3a161b",
  },
  12: { // Tử đằng
    bg: "#f0e9fb", panel: "#f9f5ff", border: "#2e1f47", borderSoft: "#e0d0f5",
    text: "#241536", textMuted: "#6f5c8a", accent: "#8b47d9", accentSoft: "#ead9fb",
    learningSoft: "#fbe6b8", knownSoft: "#d9f0da", difficultSoft: "#fbd7dc",
  },
  13: { // Xám khói
    bg: "#e8eaee", panel: "#f6f7f9", border: "#22262e", borderSoft: "#d2d6dd",
    text: "#1a1d23", textMuted: "#666e7a", accent: "#5b6b8c", accentSoft: "#dde1e7",
    learningSoft: "#fbeec4", knownSoft: "#d7f0dd", difficultSoft: "#fbd7d7",
  },
  14: { // Chanh
    bg: "#fbf8dc", panel: "#fffce8", border: "#3a3712", borderSoft: "#eee7ad",
    text: "#2c2a0d", textMuted: "#7c7640", accent: "#c9a227", accentSoft: "#f5edb0",
    learningSoft: "#fbe0a0", knownSoft: "#dcefd0", difficultSoft: "#f8d0c5",
  },
  15: { // Ngọc lam — dịu mắt ban đêm
    bg: "#0d1a1a", panel: "#122424", border: "#1f4545", borderSoft: "#193434",
    text: "#d9f2f0", textMuted: "#7fa8a5", accent: "#2dd4bf", accentSoft: "#123333",
    learningSoft: "#332b14", knownSoft: "#123322", difficultSoft: "#331a1a",
  },
  16: { // Hồng đất — dịu mắt ban đêm
    bg: "#1c1210", panel: "#261a16", border: "#4a2e22", borderSoft: "#33221b",
    text: "#f2e0d5", textMuted: "#a68475", accent: "#e07a5f", accentSoft: "#3a2620",
    learningSoft: "#332715", knownSoft: "#1a2e20", difficultSoft: "#3a1a17",
  },
  17: { // Xanh lục rừng — dịu mắt ban đêm
    bg: "#0e160f", panel: "#152016", border: "#294530", borderSoft: "#1e301f",
    text: "#dcefdc", textMuted: "#82a086", accent: "#4ade80", accentSoft: "#173319",
    learningSoft: "#332b14", knownSoft: "#173a24", difficultSoft: "#331a1a",
  },
  18: { // Đất nung — khớp màu trang Ngữ pháp (Eg_notes/grammar.html)
    bg: "#f3dcc7", panel: "#faf1e3", border: "#45566b", borderSoft: "#e3c4a6",
    text: "#45566b", textMuted: "#6b7c8f", accent: "#d4665a", accentSoft: "#ecc9b8",
    learningSoft: "#f5dcae", knownSoft: "#dcefd6", difficultSoft: "#fbd7d2",
  },
};
function cssVarName(key) {
  return "--" + key.replace(/([A-Z])/g, "-$1").toLowerCase();
}
function applyThemeLevel(level, persist = true) {
  level = Math.min(18, Math.max(1, Math.round(level)));
  const palette = THEME_PALETTES[level];
  Object.keys(palette).forEach((key) => {
    document.body.style.setProperty(cssVarName(key), palette[key]);
  });
  document.body.dataset.themeLevel = level;
  document.querySelectorAll(".theme-dot").forEach((d) => d.classList.toggle("active", parseInt(d.dataset.level, 10) === level));
  if (persist) {
    state.themeLevel = level;
    saveState();
  }
}
document.querySelectorAll(".theme-dot").forEach((dot) => {
  dot.addEventListener("click", () => applyThemeLevel(parseInt(dot.dataset.level, 10)));
});
applyThemeLevel(Math.min(18, state.themeLevel || 1), false);

/* ============================================================
   LIST PICKER POPUP (used by Thẻ / Viết / Quizz "Chọn danh sách")
   ============================================================ */
const listPickerOverlay = document.getElementById("list-picker-overlay");
const listPickerBody = document.getElementById("list-picker-body");
const listPickerTitle = document.getElementById("list-picker-title");
let listPickerCat = null; // one of: "flashcard", "writing", "quiz-flashcard", "quiz-dictionary"

// resolves a virtual picker key to { realCat, getArr(), ensureDefault() }
function pickerContext(cat) {
  if (cat === "quiz-flashcard" || cat === "quiz-dictionary") {
    const realCat = cat === "quiz-flashcard" ? "flashcard" : "dictionary";
    return {
      realCat,
      getArr: () => quiz.selectedLists[realCat],
      ensureDefault: () => ensureQuizSelected(realCat),
      allowEmpty: true, // Quizz cho phép bỏ chọn hết — người dùng tự chọn lại từ đầu
    };
  }
  return {
    realCat: cat,
    getArr: () => state.selected[cat],
    ensureDefault: () => ensureSelected(cat),
    allowEmpty: false,
  };
}

function openListPicker(cat) {
  listPickerCat = cat;
  const titles = { flashcard: "Thẻ", writing: "Viết", listening: "Nghe", "quiz-flashcard": "Thẻ (Quizz)", "quiz-dictionary": "Từ điển (Quizz)" };
  listPickerTitle.textContent = titles[cat] || cat;
  const ctx = pickerContext(cat);
  ctx.ensureDefault();
  renderListPickerBody();
  listPickerOverlay.classList.remove("hidden");
}
function renderListPickerBody() {
  listPickerBody.innerHTML = "";
  const ctx = pickerContext(listPickerCat);
  getCategory(ctx.realCat).forEach((list) => {
    const row = document.createElement("div");
    const selected = ctx.getArr().includes(list.id);
    row.className = "popup-list-item" + (selected ? " selected" : "");
    row.innerHTML = `<span class="dot"></span><span>${escapeHtml(list.name)}</span>`;
    row.addEventListener("click", () => {
      const arr = ctx.getArr();
      const idx = arr.indexOf(list.id);
      if (idx >= 0) {
        if (ctx.allowEmpty || arr.length > 1) arr.splice(idx, 1);
      } else {
        arr.push(list.id);
      }
      saveState();
      renderListPickerBody();
      if (listPickerCat === "flashcard") renderFlashcardTab();
      if (listPickerCat === "writing") renderWritingTab();
      if (listPickerCat === "listening") renderNgheTab();
      if (listPickerCat === "quiz-flashcard" || listPickerCat === "quiz-dictionary") updateQuizCountSliderMax();
    });
    listPickerBody.appendChild(row);
  });
}
document.getElementById("list-picker-close").addEventListener("click", () => listPickerOverlay.classList.add("hidden"));
listPickerOverlay.addEventListener("click", (e) => {
  if (e.target === listPickerOverlay) listPickerOverlay.classList.add("hidden");
});

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

// Chọn nhanh danh sách active (Thẻ / Viết) — thay cho popup "Chọn danh sách" cũ,
// hiển thị ngay 1 hàng danh sách để bấm chọn/bỏ chọn, giống kiểu bên Nghe.
function renderListQuickSelect(cat, containerId, onChange, singleSelect) {
  ensureSelected(cat);
  const box = document.getElementById(containerId);
  box.innerHTML = "";
  const lists = getCategory(cat);
  if (!lists.length) {
    box.innerHTML = `<div class="wh-preview-empty">Chưa có danh sách nào — vào Kho để thêm.</div>`;
    return;
  }
  lists.forEach((list) => {
    const btn = document.createElement("button");
    const selected = state.selected[cat].includes(list.id);
    btn.className = "nghe-item-btn" + (selected ? " active" : "");
    btn.innerHTML = `<span>${escapeHtml(list.name)}</span><span>${selected ? "✓" : ""}</span>`;
    btn.addEventListener("click", () => {
      const arr = state.selected[cat];
      if (singleSelect) {
        // Chỉ được chọn 1 danh sách — bấm vào danh sách khác sẽ thay thế
        // lựa chọn hiện tại thay vì cộng dồn.
        if (arr.length === 1 && arr[0] === list.id) return;
        state.selected[cat] = [list.id];
      } else {
        const idx = arr.indexOf(list.id);
        if (idx >= 0) {
          if (arr.length > 1) arr.splice(idx, 1);
        } else {
          arr.push(list.id);
        }
      }
      saveState();
      onChange();
    });
    box.appendChild(btn);
  });
}

/* ============================================================
   GENERIC UI UTILITIES: toast / prompt modal / confirm modal
   (replace native alert/confirm/prompt for a consistent look)
   ============================================================ */
function showToast(message, duration = 2000) {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, duration);
}

function showPrompt(title, defaultValue = "") {
  return new Promise((resolve) => {
    const overlay = document.getElementById("generic-prompt-overlay");
    const input = document.getElementById("generic-prompt-input");
    const okBtn = document.getElementById("generic-prompt-ok");
    const cancelBtn = document.getElementById("generic-prompt-cancel");
    const cancelX = document.getElementById("generic-prompt-cancel-x");
    document.getElementById("generic-prompt-title").textContent = title;
    input.value = defaultValue;
    overlay.classList.remove("hidden");
    setTimeout(() => { input.focus(); input.select(); }, 50);

    function cleanup(val) {
      overlay.classList.add("hidden");
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      cancelX.removeEventListener("click", onCancel);
      input.removeEventListener("keydown", onKey);
      resolve(val);
    }
    function onOk() { cleanup(input.value.trim()); }
    function onCancel() { cleanup(null); }
    function onKey(e) {
      if (e.key === "Enter") { e.preventDefault(); onOk(); }
      if (e.key === "Escape") onCancel();
    }
    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
    cancelX.addEventListener("click", onCancel);
    input.addEventListener("keydown", onKey);
  });
}

function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.getElementById("generic-confirm-overlay");
    const okBtn = document.getElementById("generic-confirm-ok");
    const cancelBtn = document.getElementById("generic-confirm-cancel");
    document.getElementById("generic-confirm-message").textContent = message;
    overlay.classList.remove("hidden");

    function cleanup(val) {
      overlay.classList.add("hidden");
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      resolve(val);
    }
    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  });
}

/* ============================================================
   TAB 1: THẺ (FLASHCARD)
   ============================================================ */
const fc = {
  filter: "all",
  search: "",
  queue: [],
  index: 0,
  direction: "e-v", // e-v = show English first, v-e = show Vietnamese first
  showingBack: false,
  autoPlay: false,
  autoRead: false,
};

function statusFromFilter(f) {
  if (f === "learning") return "new";
  return f; // "all", "known", "difficult"
}

function fcCurrentItems() {
  ensureSelected("flashcard");
  let items = itemsFromLists("flashcard", state.selected.flashcard);
  if (fc.filter !== "all") items = items.filter((i) => i.status === statusFromFilter(fc.filter));
  if (fc.search.trim()) {
    const q = fc.search.trim().toLowerCase();
    items = items.filter((i) => i.en.toLowerCase().includes(q) || i.vi.toLowerCase().includes(q));
  }
  return items;
}

function rebuildFcQueue(keepIndex) {
  const items = fcCurrentItems();
  fc.queue = items.map((i) => i.id);
  if (!keepIndex || fc.index >= fc.queue.length) fc.index = 0;
  fc.showingBack = false;
}

function renderFlashcardTab() {
  ensureSelected("flashcard");
  const lists = getCategory("flashcard").filter((l) => state.selected.flashcard.includes(l.id));
  document.getElementById("fc-active-label").textContent = "Danh sách: " + (lists.map((l) => l.name).join(", ") || "—");
  renderListQuickSelect("flashcard", "fc-list-quickselect", renderFlashcardTab);

  const all = itemsFromLists("flashcard", state.selected.flashcard);
  document.getElementById("fc-stat-total").textContent = all.length;
  document.getElementById("fc-stat-learning").textContent = all.filter((i) => i.status === "new").length;
  document.getElementById("fc-stat-known").textContent = all.filter((i) => i.status === "known").length;
  document.getElementById("fc-stat-difficult").textContent = all.filter((i) => i.status === "difficult").length;

  rebuildFcQueue(true);
  renderFcCard();
}

function fcItemById(id) {
  for (const l of getCategory("flashcard")) {
    const found = l.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}

function renderFcCard() {
  const total = fc.queue.length;
  const counter = document.getElementById("fc-counter");
  const textEl = document.getElementById("fc-card-text");
  const hintEl = document.querySelector("#fc-card .card-hint");
  const statusPill = document.getElementById("fc-card-status");

  if (!total) {
    counter.textContent = "0 / 0";
    textEl.textContent = "Không có thẻ nào";
    hintEl.textContent = "Hãy chọn danh sách hoặc thêm thẻ trong Kho";
    statusPill.textContent = "";
    statusPill.className = "card-status-pill";
    return;
  }
  if (fc.index >= total) fc.index = 0;
  const item = fcItemById(fc.queue[fc.index]);
  counter.textContent = `${fc.index + 1} / ${total}`;

  let showEnglishSide;
  if (fc.direction === "e-v") showEnglishSide = !fc.showingBack;
  else showEnglishSide = fc.showingBack;

  textEl.textContent = showEnglishSide ? item.en : item.vi;
  hintEl.textContent = "";

  statusPill.textContent = statusLabel("flashcard", item.status);
  statusPill.className = "card-status-pill" + (item.status === "known" ? " known" : item.status === "difficult" ? " difficult" : "");

  if (fc.autoPlay) {
    fcAutoPlayCycle();
  } else {
    clearFcAutoPlayTimers();
  }
}

/* ============================================================
   AUTO PLAY — chia đều "thời gian lật thẻ" (cài đặt) cho 2 mặt,
   hết thời gian tự lật / tự chuyển thẻ tiếp theo. Nếu nút Đọc
   đang bật (fc.autoRead) thì đọc mặt đang hiện.
   ============================================================ */
let fcAutoPlayTimer = null;
function clearFcAutoPlayTimers() {
  clearTimeout(fcAutoPlayTimer);
  fcAutoPlayTimer = null;
}
function fcFlipDurationMs() {
  const sec = (state.settings && typeof state.settings.fcFlipDuration === "number") ? state.settings.fcFlipDuration : 10;
  return Math.max(5, Math.min(60, sec)) * 1000;
}
function fcAutoPlayCycle() {
  clearFcAutoPlayTimers();
  if (!fc.autoPlay || !fc.queue.length || !flashcardTabVisible()) return;
  const item = fcItemById(fc.queue[fc.index]);
  if (!item) return;

  const showEnglishSide = fc.direction === "e-v" ? !fc.showingBack : fc.showingBack;
  if (fc.autoRead) {
    playAudio(showEnglishSide ? item.en : item.vi, showEnglishSide ? "en-US" : "vi-VN");
  }

  const sideDuration = fcFlipDurationMs() / 2;
  const isBackSide = fc.showingBack;
  fcAutoPlayTimer = setTimeout(() => {
    if (!fc.autoPlay || !flashcardTabVisible()) return;
    if (!isBackSide) {
      flipFcCard(); // lật sang mặt còn lại — renderFcCard sẽ tự gọi lại fcAutoPlayCycle()
    } else {
      document.getElementById("fc-next").click(); // đã xem đủ 2 mặt — sang thẻ tiếp theo
    }
  }, sideDuration);
}

/* ============================================================
   ÂM THANH GIAO DIỆN — tổng hợp bằng Web Audio API (không dùng file ngoài)
   Dùng chung 1 AudioContext + DynamicsCompressor để âm thanh có thể to hơn
   nhiều mà không bị vỡ tiếng (clipping) khi âm lượng đẩy lên cao.
   ============================================================ */
let sfxCtx = null;
let sfxMasterGain = null;
function getSfxCtx() {
  if (!sfxCtx) {
    sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    const compressor = sfxCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-16, sfxCtx.currentTime);
    compressor.knee.setValueAtTime(22, sfxCtx.currentTime);
    compressor.ratio.setValueAtTime(8, sfxCtx.currentTime);
    compressor.attack.setValueAtTime(0.002, sfxCtx.currentTime);
    compressor.release.setValueAtTime(0.15, sfxCtx.currentTime);
    compressor.connect(sfxCtx.destination);
    sfxMasterGain = sfxCtx.createGain();
    sfxMasterGain.gain.value = 1;
    sfxMasterGain.connect(compressor);
  }
  if (sfxCtx.state === "suspended") sfxCtx.resume();
  return sfxCtx;
}
function sfxTone(freq, endFreq, duration, type, peakGain, vol, delay) {
  try {
    if (vol <= 0) return;
    const ctx = getSfxCtx();
    const t0 = ctx.currentTime + (delay || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + duration);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peakGain * vol), t0 + Math.min(0.02, duration / 4));
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(sfxMasterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.03);
  } catch (e) {
    /* audio not available, ignore */
  }
}

/* ---- Âm lượng hiệu ứng chung (bấm nút / đúng / sai / chuyển thẻ) ---- */
function getSfxVolume() {
  if (!state.settings || state.settings.sfxEnabled === false) return 0;
  const v = typeof state.settings.sfxVolume === "number" ? state.settings.sfxVolume : 100;
  return Math.max(0, v) / 100; // có thể >1 (đẩy to hơn 100%) — compressor sẽ chống vỡ tiếng
}
function playClickSound() {
  sfxTone(680, 420, 0.08, "sine", 0.22, getSfxVolume());
}
function playCorrectSound() {
  const vol = getSfxVolume();
  if (vol <= 0) return;
  sfxTone(660, null, 0.16, "sine", 0.6, vol, 0);
  sfxTone(990, null, 0.22, "sine", 0.55, vol, 0.09);
}
function playWrongSound() {
  const vol = getSfxVolume();
  if (vol <= 0) return;
  sfxTone(240, 110, 0.28, "sawtooth", 0.55, vol, 0);
}
function playCardSwitchSound() {
  sfxTone(320, 780, 0.14, "triangle", 0.4, getSfxVolume());
}
function playMomentumWarnSound() {
  const vol = getSfxVolume();
  if (vol <= 0) return;
  sfxTone(520, null, 0.14, "sine", 0.5, vol, 0);
  sfxTone(520, null, 0.14, "sine", 0.5, vol, 0.22);
}

/* Âm khi bấm nút — gắn cho hầu hết các <button>, trừ những nút đã có
   âm riêng (chuyển thẻ, đáp án quizz đúng/sai...) để tránh chồng 2 tiếng cùng lúc */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn || btn.disabled) return;
  if (btn.hasAttribute("data-no-click-sound")) return;
  playClickSound();
});

/* ---- Flip sound (lật thẻ) ---- */
function playFlipSound() {
  const vol = (state.settings && typeof state.settings.flipVolume === "number" ? state.settings.flipVolume : 100) / 100;
  sfxTone(520, 220, 0.15, "triangle", 0.55, vol);
}

function flipFcCard() {
  if (!fc.queue.length) return;
  const cardEl = document.getElementById("fc-card");
  playFlipSound();
  logStudyAction("flashcard");
  cardEl.classList.remove("flipping");
  void cardEl.offsetWidth; // restart animation
  cardEl.classList.add("flipping");
  setTimeout(() => {
    fc.showingBack = !fc.showingBack;
    renderFcCard();
  }, 160);
  setTimeout(() => cardEl.classList.remove("flipping"), 380);
}

let fcSwiped = false;
document.getElementById("fc-card").addEventListener("click", () => {
  if (fcSwiped) { fcSwiped = false; return; }
  flipFcCard();
});

/* ============================================================
   CHUYỂN THẺ CÓ HIỆU ỨNG (trượt + xoay nhẹ + mờ dần)
   action: "prev" | "next" — thẻ nào sẽ hiện ra tiếp theo
   opts.exitSign: -1 (thoát trái) | 1 (thoát phải) — mặc định theo action,
   nhưng khi vuốt tay thì dùng đúng hướng đang kéo để chuyển động liền mạch.
   opts.startX/startRot/startOpacity: vị trí bắt đầu (dùng khi nối tiếp từ thao tác vuốt).
   ============================================================ */
function fcSlideCard(action, opts) {
  opts = opts || {};
  if (!fc.queue.length) return;
  playCardSwitchSound();
  const cardEl = document.getElementById("fc-card");
  const w = cardEl.offsetWidth || 400;
  const exitSign = opts.exitSign != null ? opts.exitSign : (action === "next" ? -1 : 1);
  const enterSign = -exitSign;

  const startX = opts.startX || 0;
  const startRot = opts.startRot || 0;
  const startOpacity = opts.startOpacity != null ? opts.startOpacity : 1;

  cardEl.classList.remove("dragging");
  cardEl.style.transition = "none";
  cardEl.style.transform = `translateX(${startX}px) rotate(${startRot}deg)`;
  cardEl.style.opacity = String(startOpacity);
  void cardEl.offsetWidth; // reflow để transition mới áp dụng đúng từ vị trí bắt đầu
  cardEl.style.transition = "transform .22s cubic-bezier(.3,.8,.4,1), opacity .22s ease";
  cardEl.style.transform = `translateX(${exitSign * w * 0.9}px) rotate(${exitSign * 14}deg)`;
  cardEl.style.opacity = "0";

  setTimeout(() => {
    if (action === "next") fc.index = (fc.index + 1) % fc.queue.length;
    else fc.index = (fc.index - 1 + fc.queue.length) % fc.queue.length;
    fc.showingBack = false;
    renderFcCard();

    cardEl.style.transition = "none";
    cardEl.style.transform = `translateX(${enterSign * w * 0.6}px) rotate(${enterSign * 10}deg)`;
    cardEl.style.opacity = "0";
    void cardEl.offsetWidth;
    cardEl.style.transition = "transform .24s cubic-bezier(.2,.7,.3,1), opacity .24s ease";
    cardEl.style.transform = "translateX(0) rotate(0deg)";
    cardEl.style.opacity = "1";
    setTimeout(() => {
      cardEl.style.transition = "";
      cardEl.style.transform = "";
      cardEl.style.opacity = "";
    }, 260);
  }, 220);
}

/* ---- Vuốt trái = thẻ trước, vuốt phải = thẻ tiếp theo (kéo theo tay, thả ra để chuyển) ---- */
(function setupFcSwipe() {
  const cardEl = document.getElementById("fc-card");
  let startX = null, startY = null, dragging = false;
  cardEl.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragging = false;
  }, { passive: true });
  cardEl.addEventListener("touchmove", (e) => {
    if (startX === null) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (!dragging && Math.abs(dx) < Math.abs(dy) * 1.3) return; // đang cuộn dọc, bỏ qua
    dragging = true;
    cardEl.classList.add("dragging");
    cardEl.style.transition = "none";
    const rot = Math.max(-12, Math.min(12, dx / 10));
    cardEl.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
    cardEl.style.opacity = String(Math.max(0.5, 1 - Math.abs(dx) / 450));
  }, { passive: true });
  cardEl.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    startX = null; startY = null;
    const wasDragging = dragging;
    dragging = false;
    cardEl.classList.remove("dragging");
    const THRESHOLD = 50;
    if (!wasDragging || Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.3) {
      // chưa đủ để chuyển thẻ — trả thẻ về vị trí cũ
      cardEl.style.transition = "transform .22s ease, opacity .22s ease";
      cardEl.style.transform = "translateX(0) rotate(0deg)";
      cardEl.style.opacity = "1";
      setTimeout(() => { cardEl.style.transition = ""; cardEl.style.transform = ""; cardEl.style.opacity = ""; }, 220);
      return;
    }
    fcSwiped = true;
    const rot = Math.max(-12, Math.min(12, dx / 10));
    const opac = Math.max(0.5, 1 - Math.abs(dx) / 450);
    if (dx < 0) {
      fcSlideCard("prev", { exitSign: -1, startX: dx, startRot: rot, startOpacity: opac }); // vuốt trái → thẻ trước
    } else {
      fcSlideCard("next", { exitSign: 1, startX: dx, startRot: rot, startOpacity: opac }); // vuốt phải → thẻ tiếp theo
    }
  });
})();

function isTypingTarget() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}
function anyOverlayOpen() {
  return !!document.querySelector(".overlay:not(.hidden)");
}
function flashcardTabVisible() {
  const el = document.querySelector('.tab-content[data-content="flashcard"]');
  return el && !el.classList.contains("hidden");
}
document.addEventListener("keydown", (e) => {
  if (!flashcardTabVisible() || isTypingTarget() || anyOverlayOpen()) return;
  if (e.code === "Space") {
    e.preventDefault();
    flipFcCard();
  } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
    e.preventDefault();
    document.getElementById("fc-prev").click();
  } else if (e.code === "KeyD" || e.code === "ArrowRight") {
    e.preventDefault();
    document.getElementById("fc-next").click();
  }
});

document.getElementById("fc-prev").addEventListener("click", () => fcSlideCard("prev"));
document.getElementById("fc-next").addEventListener("click", () => fcSlideCard("next"));

function fcMark(status) {
  if (!fc.queue.length) return;
  const item = fcItemById(fc.queue[fc.index]);
  item.status = status;
  logStudyAction("flashcard");
  saveState();
  renderFlashcardTab();
  if (fc.queue.length) {
    fc.index = fc.index % fc.queue.length;
  }
}
document.getElementById("fc-mark-difficult").addEventListener("click", () => fcMark("difficult"));
document.getElementById("fc-mark-learning").addEventListener("click", () => fcMark("new"));
document.getElementById("fc-mark-known").addEventListener("click", () => fcMark("known"));

document.getElementById("fc-dir-toggle").addEventListener("click", (e) => {
  fc.direction = fc.direction === "e-v" ? "v-e" : "e-v";
  e.currentTarget.textContent = fc.direction === "e-v" ? "E - V" : "V - E";
  fc.showingBack = false;
  renderFcCard();
});

document.getElementById("fc-autoplay-toggle").addEventListener("click", (e) => {
  fc.autoPlay = !fc.autoPlay;
  e.currentTarget.classList.toggle("active", fc.autoPlay);
  if (fc.autoPlay) {
    fcAutoPlayCycle();
  } else {
    clearFcAutoPlayTimers();
    speechSynthesis.cancel();
  }
});
document.getElementById("fc-play-btn").addEventListener("click", (e) => {
  fc.autoRead = !fc.autoRead;
  e.currentTarget.classList.toggle("active", fc.autoRead);
  if (!fc.queue.length) return;
  const item = fcItemById(fc.queue[fc.index]);
  if (!item) return;
  const showEnglishSide = fc.direction === "e-v" ? !fc.showingBack : fc.showingBack;
  if (fc.autoRead) {
    playAudio(showEnglishSide ? item.en : item.vi, showEnglishSide ? "en-US" : "vi-VN");
  }
});

document.querySelectorAll('[data-filter]').forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    fc.filter = btn.dataset.filter;
    rebuildFcQueue(false);
    renderFcCard();
  });
});
document.getElementById("fc-search").addEventListener("input", (e) => {
  fc.search = e.target.value;
  rebuildFcQueue(false);
  renderFcCard();
});
document.getElementById("fc-shuffle").addEventListener("click", () => {
  fc.queue = shuffleArr(fc.queue);
  fc.index = 0;
  renderFcCard();
});

/* ============================================================
   TAB 2: VIẾT (WRITING)
   ============================================================ */
const wr = {
  filter: "undone",
  queue: [],
  cursor: 0,
  maxReached: 0,
  difficulty: state.settings.wrDifficulty || "medium",
  difficultyLocked: false,
  trackedAnswer: "", // đáp án (trong các đáp án được chấp nhận) đang gần giống nhất với những gì đang gõ
  historyIndex: null, // đang lướt lại lịch sử câu sai bằng phím ↑/↓ (null = không lướt)
};
// Dữ liệu tạm trong phiên làm việc (KHÔNG lưu vào state) — chỉ câu đã làm
// ĐÚNG mới được giữ lại vĩnh viễn (trong item.wrProgress, có saveState).
const wrAttempts = {};       // itemId -> [{text, pct}] các lần gõ sai của câu đang làm dở
const wrHintCount = {};      // itemId -> số lần đã dùng gợi ý
const wrEnterCount = {};     // itemId -> số lần đã bấm Enter (chỉ đếm ở độ khó Khó)
const wrSessionSkipped = {}; // itemId -> true nếu đã hết lượt Enter ở độ khó Khó, tạm bỏ qua trong phiên này

const PUNCT_REGEX = /[.,!?;:"'()…“”‘’\-]/g;
function stripPunct(str) {
  return str.replace(PUNCT_REGEX, "");
}
function normalizeAnswer(str) {
  return stripPunct(str).replace(/\s+/g, " ").trim().toLowerCase();
}

/* ================= Nhiều đáp án cho Viết ================= *
 * "/" trong 1 đáp án = các từ thay thế lẫn nhau tại đúng vị trí đó
 * (vd "I love/like her" chấp nhận cả "I love her" và "I like her").
 * item.enAlts = mảng các đáp án phụ (cấu trúc câu khác hẳn), mỗi đáp án
 * cũng dùng được "/" bên trong.
 * =========================================================== */
function expandSlashAnswer(str) {
  const tokens = (str || "").trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [""];
  let combos = [[]];
  tokens.forEach((tok) => {
    const opts = tok.split("/").map((s) => s.trim()).filter(Boolean);
    const useOpts = opts.length ? opts : [tok];
    const next = [];
    combos.forEach((c) => {
      useOpts.forEach((o) => next.push([...c, o]));
    });
    combos = next.length ? next.slice(0, 64) : combos; // giới hạn an toàn
  });
  return combos.map((c) => c.join(" "));
}

function allAcceptedAnswers(item) {
  const list = [];
  expandSlashAnswer(item.en || "").forEach((a) => list.push({ text: a, primary: true }));
  (item.enAlts || []).forEach((alt) => {
    expandSlashAnswer(alt).forEach((a) => list.push({ text: a, primary: false }));
  });
  return list;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// Chọn đáp án (trong tất cả đáp án được chấp nhận) đang gần giống nhất với
// những gì đang gõ, để gợi ý bám theo đáp án đó thay vì luôn cố định.
function wrUpdateTrackedAnswer(item, typedRaw) {
  const candidates = allAcceptedAnswers(item);
  if (!candidates.length) { wr.trackedAnswer = item.en || ""; return; }
  const typedKey = stripPunct(typedRaw || "").toLowerCase();
  let best = candidates[0];
  let bestDist = Infinity;
  candidates.forEach((c) => {
    const key = stripPunct(c.text).toLowerCase();
    const cmpKey = key.slice(0, typedKey.length);
    const dist = levenshtein(typedKey, cmpKey);
    if (dist < bestDist || (dist === bestDist && c.primary && !best.primary)) {
      bestDist = dist;
      best = c;
    }
  });
  wr.trackedAnswer = best.text;
}

// Chấm điểm % giống Nghe — so với TẤT CẢ đáp án được chấp nhận, lấy đáp án
// khớp nhất. "Đúng" vẫn theo chuẩn khớp tuyệt đối sau khi chuẩn hoá (giữ
// đúng tinh thần chấm cũ), % chỉ để hiển thị mức độ gần đúng.
function wrGradeAnswer(typed, item) {
  const candidates = allAcceptedAnswers(item);
  if (!candidates.length) return { pct: 0, correct: false };
  let best = { pct: 0, correct: false };
  candidates.forEach((c) => {
    const g = ngheGradeLine(typed, c.text);
    if (g.pct > best.pct) best = g;
  });
  const exact = candidates.some((c) => normalizeAnswer(typed) === normalizeAnswer(c.text));
  if (exact) best = { pct: 100, correct: true };
  return best;
}

// Giới hạn gợi ý (số từ) theo độ khó.
const WR_HINT_WORD_LIMIT = { easy: Infinity, medium: 3, hard: 0 };
const WR_ENTER_LIMIT_HARD = 10;

function wrStatusFromFilter(f) {
  if (f === "undone") return "new";
  if (f === "correct") return "known";
  if (f === "wrong") return "difficult";
  return f; // "all"
}

function wrCurrentItems() {
  ensureSelected("writing");
  const items = itemsFromLists("writing", state.selected.writing);
  if (wr.filter === "all") return items;
  return items.filter((i) => i.status === wrStatusFromFilter(wr.filter));
}

function wrItemById(id) {
  for (const l of getCategory("writing")) {
    const found = l.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}

// Đảm bảo item có tiến độ Viết hợp lệ — được lưu ngay trên item (qua
// saveState) nên sống sót qua reload trang. Chỉ câu ĐÃ LÀM ĐÚNG mới coi là
// "done"; câu từng làm sai (status "difficult" cũ) vẫn phải làm lại.
function ensureWrProgress(item) {
  if (!item.wrProgress || typeof item.wrProgress !== "object") {
    const wasDone = item.status === "known";
    item.wrProgress = { done: wasDone, correctText: wasDone ? item.en : "" };
  }
  return item.wrProgress;
}

function currentWrItem() {
  if (!wr.queue.length) return null;
  if (wr.cursor < 0 || wr.cursor >= wr.queue.length) return null;
  return wrItemById(wr.queue[wr.cursor]);
}

// Tìm câu kế tiếp cần làm (chưa đúng & chưa bị bỏ qua trong phiên này),
// ưu tiên các câu phía sau, hết thì vòng lại từ đầu — giống cơ chế ở Nghe.
function wrFindNextCursor(fromIdx) {
  for (let i = fromIdx + 1; i < wr.queue.length; i++) {
    const it = wrItemById(wr.queue[i]);
    if (it && !ensureWrProgress(it).done && !wrSessionSkipped[it.id]) return i;
  }
  for (let i = 0; i < fromIdx; i++) {
    const it = wrItemById(wr.queue[i]);
    if (it && !ensureWrProgress(it).done && !wrSessionSkipped[it.id]) return i;
  }
  return -1;
}

// Tính lại cursor/maxReached theo thứ tự hàng đợi hiện tại — nhảy thẳng tới
// câu đầu tiên chưa làm để không phải click qua các câu đã xong.
function wrRebuildCursor() {
  let cursor = wr.queue.findIndex((id) => {
    const it = wrItemById(id);
    return it && !ensureWrProgress(it).done;
  });
  if (cursor === -1) cursor = Math.max(0, wr.queue.length - 1);
  wr.cursor = cursor;
  wr.maxReached = cursor;
}

function rebuildWrQueue(keep) {
  const items = wrCurrentItems();
  const prevId = keep ? wr.queue[wr.cursor] : null;
  wr.queue = items.map((i) => i.id);
  wrRebuildCursor();
  if (keep && prevId) {
    const idx = wr.queue.indexOf(prevId);
    if (idx !== -1) { wr.cursor = idx; wr.maxReached = Math.max(wr.maxReached, idx); }
  }
  wr.difficultyLocked = false;
  wr.historyIndex = null;
}

function renderWritingTab() {
  ensureSelected("writing");
  // Phòng trường hợp còn sót nhiều danh sách được chọn từ trước khi đổi
  // sang chế độ chỉ chọn 1 danh sách — chỉ giữ lại danh sách đầu tiên.
  if (state.selected.writing.length > 1) {
    state.selected.writing = [state.selected.writing[0]];
    saveState();
  }
  renderListQuickSelect("writing", "wr-list-quickselect", renderWritingTab, true);

  const all = itemsFromLists("writing", state.selected.writing);
  document.getElementById("wr-stat-total").textContent = all.length;
  document.getElementById("wr-stat-undone").textContent = all.filter((i) => i.status === "new").length;
  document.getElementById("wr-stat-correct").textContent = all.filter((i) => i.status === "known").length;
  document.getElementById("wr-stat-wrong").textContent = all.filter((i) => i.status === "difficult").length;

  rebuildWrQueue(false);
  document.getElementById("wr-answer-input").value = "";
  document.getElementById("quick-translate-bar").classList.add("hidden");
  renderWrChat();
}

function renderWritingStatsOnly() {
  const all = itemsFromLists("writing", state.selected.writing);
  document.getElementById("wr-stat-total").textContent = all.length;
  document.getElementById("wr-stat-undone").textContent = all.filter((i) => i.status === "new").length;
  document.getElementById("wr-stat-correct").textContent = all.filter((i) => i.status === "known").length;
  document.getElementById("wr-stat-wrong").textContent = all.filter((i) => i.status === "difficult").length;
}

function wrResetQuestionUiState() {
  wr.difficultyLocked = false;
  wr.historyIndex = null;
  document.getElementById("wr-answer-input").value = "";
  wrHideQuickSaveWords();
  wrUpdateTypingDots();
  updateWrDifficultyBtn();
}

function wrGoNext() {
  if (!wr.queue.length) return;
  const next = wrFindNextCursor(wr.cursor);
  wr.cursor = next === -1 ? (wr.cursor + 1) % wr.queue.length : next;
  if (wr.cursor > wr.maxReached) wr.maxReached = wr.cursor;
  wrResetQuestionUiState();
  renderWrChat();
}

function wrGoPrev() {
  if (!wr.queue.length) return;
  wr.cursor = (wr.cursor - 1 + wr.queue.length) % wr.queue.length;
  if (wr.cursor > wr.maxReached) wr.maxReached = wr.cursor;
  wrResetQuestionUiState();
  renderWrChat();
}

// Chuyển nhanh câu bằng phím mũi tên trái/phải (không cần nút bấm riêng).
// Nếu đang gõ dở trong ô trả lời (còn chữ) thì mũi tên vẫn di chuyển con trỏ
// bình thường; chỉ chuyển câu khi ô trả lời đang trống hoặc không có focus.
function writingTabVisible() {
  const el = document.querySelector('.tab-content[data-content="writing"]');
  return el && !el.classList.contains("hidden");
}
document.addEventListener("keydown", (e) => {
  if (!writingTabVisible() || anyOverlayOpen()) return;
  if (e.code === "AltRight") {
    e.preventDefault();
    wrToggleTranslateBar();
    return;
  }
  if (e.code !== "ArrowLeft" && e.code !== "ArrowRight") return;
  if (isTypingTarget()) {
    const el = document.activeElement;
    const isAnswerBox = el && el.id === "wr-answer-input";
    if (!isAnswerBox || el.value.length > 0) return;
  }
  e.preventDefault();
  if (e.code === "ArrowLeft") wrGoPrev();
  else wrGoNext();
});

/* ============================================================
   Khung chat: câu đề (trái, luôn hiện) + đáp án (phải — đúng màu
   xanh giữ nguyên, sai màu đỏ chỉ tồn tại tới khi có đáp án đúng)
   ============================================================ */
function renderWrChat() {
  const scroll = document.getElementById("wr-chat-scroll");
  const empty = document.getElementById("wr-chat-empty");
  const titleEl = document.getElementById("wr-current-title");
  const dotEl = document.getElementById("wr-current-dot");
  scroll.querySelectorAll(".nghe-bubble-row").forEach((el) => el.remove());

  // Tiêu đề hiện tên danh sách đang chọn (chỉ 1 danh sách), không phải câu
  // đang làm.
  const listId = state.selected.writing[0];
  const list = listId ? getList("writing", listId) : null;
  titleEl.textContent = list ? list.name : "Chọn danh sách để bắt đầu";

  const item = currentWrItem();
  if (!item) {
    empty.classList.remove("hidden");
    dotEl.className = "status-dot";
    return;
  }
  empty.classList.add("hidden");
  dotEl.className = "status-dot dot " + (item.status === "known" ? "dot-known" : item.status === "difficult" ? "dot-difficult" : "dot-learning");

  let allDoneInView = true;
  for (let i = 0; i <= wr.maxReached && i < wr.queue.length; i++) {
    const it = wrItemById(wr.queue[i]);
    if (!it) continue;
    const prog = ensureWrProgress(it);
    const isActive = i === wr.cursor;
    // Câu đã làm đúng thì giữ lại trong lịch sử; câu CHƯA làm xong mà không
    // phải câu đang đứng thì bỏ qua — tránh việc chuyển câu (mà chưa trả
    // lời) làm hiện thêm câu bên dưới, thay vào đó chỉ có 1 câu "đang làm"
    // duy nhất tại một thời điểm.
    if (!prog.done && !isActive) continue;
    scroll.appendChild(wrBuildPromptBubble(it, i));
    if (prog.done) {
      scroll.appendChild(wrBuildAnswerBubble({ text: prog.correctText, correct: true }, false));
    } else {
      allDoneInView = false;
      (wrAttempts[it.id] || []).forEach((att) => {
        scroll.appendChild(wrBuildAnswerBubble(att, isActive));
      });
    }
  }

  const allDone = wr.queue.every((id) => {
    const it = wrItemById(id);
    return it && ensureWrProgress(it).done;
  });
  if (allDone && wr.queue.length) {
    const done = document.createElement("div");
    done.className = "nghe-bubble-row nghe-system-msg";
    done.textContent = "🎉 Đã làm hết các câu trong danh sách này!";
    scroll.appendChild(done);
  }

  scroll.scrollTop = scroll.scrollHeight;
  wrUpdateTypingDots();
}

function wrBuildPromptBubble(item, idx) {
  const row = document.createElement("div");
  row.className = "nghe-bubble-row left";
  const wrap = document.createElement("div");
  wrap.className = "nghe-left-wrap";
  const bubble = document.createElement("div");
  bubble.className = "nghe-bubble nghe-bubble-left";
  bubble.textContent = item.vi;
  wrap.appendChild(bubble);

  // Nút làm lại câu — ẩn theo mặc định, chỉ hiện khi di chuột vào câu đề.
  const redoBtn = document.createElement("button");
  redoBtn.type = "button";
  redoBtn.className = "nghe-translate-btn";
  redoBtn.title = "Làm lại câu này";
  redoBtn.textContent = "↺";
  redoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    wrRedoItem(item.id, idx);
  });
  wrap.appendChild(redoBtn);

  row.appendChild(wrap);
  return row;
}

function wrBuildAnswerBubble(attempt, clickable) {
  const row = document.createElement("div");
  row.className = "nghe-bubble-row right";
  const pctSpan = document.createElement("span");
  pctSpan.className = "nghe-pct";
  pctSpan.textContent = attempt.correct ? "✓" : attempt.pct + "%";
  const bubble = document.createElement("div");
  const isClickable = clickable && !attempt.correct;
  bubble.className = "nghe-bubble nghe-bubble-right " + (attempt.correct ? "correct" : "wrong") + (isClickable ? " clickable" : "");
  bubble.textContent = attempt.text;
  if (isClickable) {
    bubble.title = "Nhấp để dán lại câu này vào ô nhập";
    bubble.addEventListener("click", () => {
      const input = document.getElementById("wr-answer-input");
      input.value = attempt.text;
      input.focus();
      wr.historyIndex = null;
    });
  }
  row.appendChild(pctSpan);
  row.appendChild(bubble);
  return row;
}

// Làm lại 1 câu bất kỳ (kể cả đã đúng) — xoá tiến độ của riêng câu đó rồi
// nhảy tới đó để làm ngay.
function wrRedoItem(itemId, idx) {
  const item = wrItemById(itemId);
  if (!item) return;
  item.wrProgress = { done: false, correctText: "" };
  item.status = "new";
  delete wrAttempts[itemId];
  delete wrHintCount[itemId];
  delete wrEnterCount[itemId];
  delete wrSessionSkipped[itemId];
  saveState();
  wr.cursor = idx;
  if (idx > wr.maxReached) wr.maxReached = idx;
  wrResetQuestionUiState();
  renderWritingStatsOnly();
  renderWrChat();
  document.getElementById("wr-answer-input").focus();
}

/* ============================================================
   Chấm dấu "..." thay cho phản hồi trực tiếp bằng chữ — chỉ hiện
   khi độ khó cho phép (Dễ/Trung bình) và ô nhập đang có chữ.
   ============================================================ */
function wrLiveFeedbackAllowed() {
  return wr.difficulty !== "hard";
}
// Gõ tới đâu có đang khớp phần đầu của ít nhất 1 đáp án được chấp nhận
// không — dùng để tô màu chấm nháy xanh (đang đúng hướng) / đỏ (đã gõ sai).
function wrTypedOnTrack(item, typed) {
  const candidates = allAcceptedAnswers(item);
  if (!candidates.length) return true;
  const typedKey = stripPunct(typed).toLowerCase().trim();
  if (!typedKey) return true;
  return candidates.some((c) => stripPunct(c.text).toLowerCase().startsWith(typedKey));
}
function wrUpdateTypingDots() {
  const dots = document.getElementById("wr-typing-dots");
  const input = document.getElementById("wr-answer-input");
  const item = currentWrItem();
  const show = wrLiveFeedbackAllowed() && item && !ensureWrProgress(item).done && input.value.trim().length > 0;
  dots.classList.toggle("hidden", !show);
  if (show) {
    const onTrack = wrTypedOnTrack(item, input.value);
    dots.classList.toggle("wr-dots-wrong", !onTrack);
  } else {
    dots.classList.remove("wr-dots-wrong");
  }
}

/* ============================================================
   Thanh dịch nhanh — ẩn mặc định, bật/tắt bằng icon ⇄ trên thanh
   nhập câu hoặc phím Alt phải. Khoá hẳn ở độ khó Khó.
   ============================================================ */
function wrToggleTranslateBar(forceShow) {
  if (wr.difficulty === "hard") {
    showToast("Độ khó Khó: khoá thanh dịch nhanh.");
    return;
  }
  const bar = document.getElementById("quick-translate-bar");
  const show = forceShow !== undefined ? forceShow : bar.classList.contains("hidden");
  bar.classList.toggle("hidden", !show);
}
document.getElementById("wr-translate-toggle-btn").addEventListener("click", () => wrToggleTranslateBar());

/* ============================================================
   Gợi ý (nút ?) — hiện dần từng từ tiếp theo ngay trong ô nhập,
   giới hạn theo độ khó; khoá hẳn ở độ khó Khó.
   ============================================================ */
function wrUseHint() {
  const item = currentWrItem();
  if (!item || ensureWrProgress(item).done) return;
  if (wr.difficulty === "hard") {
    showToast("Độ khó Khó: khoá gợi ý.");
    return;
  }
  const limit = WR_HINT_WORD_LIMIT[wr.difficulty];
  const used = wrHintCount[item.id] || 0;
  if (used >= limit) {
    showToast("Đã dùng hết lượt gợi ý cho câu này.");
    return;
  }
  if (!wr.difficultyLocked) {
    wr.difficultyLocked = true;
    updateWrDifficultyBtn();
  }
  const input = document.getElementById("wr-answer-input");
  wrUpdateTrackedAnswer(item, input.value);
  const answer = wr.trackedAnswer || item.en;
  const cur = input.value.length;
  let nextSpace = answer.indexOf(" ", cur);
  if (nextSpace === -1) nextSpace = answer.length;
  else nextSpace += 1;
  input.value = input.value + answer.slice(cur, Math.max(nextSpace, cur + 1));
  wrHintCount[item.id] = used + 1;
  wr.historyIndex = null;
  wrUpdateTypingDots();
}
document.getElementById("wr-hint-btn").addEventListener("click", wrUseHint);

const WR_DIFFICULTY_GAIN = { easy: 5, medium: 15, hard: 35 };
const WR_DIFFICULTY_PENALTY = { easy: 2, medium: 6, hard: 14 };

function flashAnswerFeedback(isCorrect) {
  if (isCorrect) playCorrectSound(); else playWrongSound();
  const cls = isCorrect ? "flash-correct" : "flash-wrong";
  const el = document.getElementById("wr-chat-scroll");
  if (!el) return;
  el.classList.remove("flash-correct", "flash-wrong");
  void el.offsetWidth;
  el.classList.add(cls);
  clearTimeout(wr.flashTimeout);
  wr.flashTimeout = setTimeout(() => el.classList.remove("flash-correct", "flash-wrong"), 800);
}

function wrSubmitAnswer() {
  const item = currentWrItem();
  if (!item) return;
  const prog = ensureWrProgress(item);
  if (prog.done) return;
  const input = document.getElementById("wr-answer-input");
  const typed = input.value.trim();
  if (!typed) return;
  if (!wr.difficultyLocked) {
    wr.difficultyLocked = true;
    updateWrDifficultyBtn();
  }

  const isHard = wr.difficulty === "hard";
  if (isHard) wrEnterCount[item.id] = (wrEnterCount[item.id] || 0) + 1;

  const grade = wrGradeAnswer(typed, item);
  logStudyAction("writing", grade.correct, WR_DIFFICULTY_GAIN[wr.difficulty], WR_DIFFICULTY_PENALTY[wr.difficulty]);

  if (grade.correct) {
    item.status = "known";
    prog.done = true;
    prog.correctText = typed;
    delete wrAttempts[item.id];
    delete wrSessionSkipped[item.id];
    saveState();
    flashAnswerFeedback(true);
    wrShowQuickSaveWords(item);
    input.value = "";
    wr.historyIndex = null;
    wrGoNext();
    renderWritingStatsOnly();
  } else {
    item.status = "difficult";
    (wrAttempts[item.id] = wrAttempts[item.id] || []).push({ text: typed, pct: grade.pct });
    flashAnswerFeedback(false);
    wrHideQuickSaveWords();
    input.value = "";
    wr.historyIndex = null;
    if (isHard && wrEnterCount[item.id] >= WR_ENTER_LIMIT_HARD) {
      wrSessionSkipped[item.id] = true;
      showToast(`Đã hết ${WR_ENTER_LIMIT_HARD} lần thử — chuyển sang câu khác.`);
      saveState();
      renderWritingStatsOnly();
      wrGoNext();
    } else {
      saveState();
      renderWritingStatsOnly();
      renderWrChat();
    }
  }
}

document.getElementById("wr-answer-input").addEventListener("input", (e) => {
  wr.historyIndex = null;
  if (e.target.value.length > 0 && !wr.difficultyLocked) {
    wr.difficultyLocked = true;
    updateWrDifficultyBtn();
  }
  wrUpdateTypingDots();
});
document.getElementById("wr-answer-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    wrSubmitAnswer();
    return;
  }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    const item = currentWrItem();
    if (!item) return;
    const atts = wrAttempts[item.id] || [];
    if (!atts.length) return;
    e.preventDefault();
    if (e.key === "ArrowUp") {
      wr.historyIndex = wr.historyIndex === null ? atts.length - 1 : Math.max(0, wr.historyIndex - 1);
      e.target.value = atts[wr.historyIndex].text;
    } else {
      if (wr.historyIndex === null) return;
      if (wr.historyIndex < atts.length - 1) {
        wr.historyIndex++;
        e.target.value = atts[wr.historyIndex].text;
      } else {
        wr.historyIndex = null;
        e.target.value = "";
      }
    }
    wrUpdateTypingDots();
  }
});

const WR_DIFFICULTY_LABELS = { easy: "Độ khó: Dễ", medium: "Độ khó: Trung bình", hard: "Độ khó: Khó" };
const WR_DIFFICULTY_CYCLE = { easy: "medium", medium: "hard", hard: "easy" };
function updateWrDifficultyBtn() {
  const btn = document.getElementById("wr-difficulty-toggle");
  btn.textContent = WR_DIFFICULTY_LABELS[wr.difficulty] + (wr.difficultyLocked ? " 🔒" : "");
  btn.classList.remove("difficulty-easy", "difficulty-medium", "difficulty-hard");
  btn.classList.add("difficulty-" + wr.difficulty);
  btn.classList.toggle("locked", wr.difficultyLocked);
  btn.title = wr.difficultyLocked
    ? "Đã bắt đầu làm câu này — sang câu tiếp theo mới đổi được độ khó"
    : "Bấm để đổi độ khó: Dễ → Trung bình → Khó";
  document.getElementById("wr-hint-btn").disabled = wr.difficulty === "hard";
  document.getElementById("wr-translate-toggle-btn").disabled = wr.difficulty === "hard";
  if (wr.difficulty === "hard") document.getElementById("quick-translate-bar").classList.add("hidden");
  wrUpdateTypingDots();
}
document.getElementById("wr-difficulty-toggle").addEventListener("click", () => {
  // Chặn kiểu "bí quá hạ xuống Dễ xem gợi ý rồi chuyển lại Khó để ăn điểm cao" —
  // một khi đã gõ chữ đầu tiên hoặc dùng gợi ý ở câu này thì không đổi được nữa,
  // phải sang câu tiếp theo (wrResetQuestionUiState/rebuildWrQueue sẽ mở khoá lại).
  if (wr.difficultyLocked) {
    showToast("Đã bắt đầu làm câu này — sang câu tiếp theo mới đổi được độ khó nhé.");
    return;
  }
  wr.difficulty = WR_DIFFICULTY_CYCLE[wr.difficulty];
  state.settings.wrDifficulty = wr.difficulty;
  saveState();
  updateWrDifficultyBtn();
});
updateWrDifficultyBtn();

function wrHideQuickSaveWords() {
  const box = document.getElementById("wr-quicksave-words");
  if (!box) return;
  box.innerHTML = "";
  box.classList.add("hidden");
}
function wrShowQuickSaveWords(item) {
  const box = document.getElementById("wr-quicksave-words");
  if (!box) return;
  const words = item.en
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter(Boolean);
  if (!words.length) { wrHideQuickSaveWords(); return; }
  box.innerHTML = "";
  const selected = new Set(); // các chỉ số từ đang được chọn (chọn nhiều được)

  function applySelection() {
    const orderedIdx = [...selected].sort((a, b) => a - b);
    const phrase = orderedIdx.map((i) => words[i]).join(" ");
    if (phrase) {
      qtWriting.setInputAndTranslateForced(phrase, "en-vi");
      document.getElementById("quick-translate-bar").classList.remove("hidden");
    } else {
      document.getElementById("qt-input").value = "";
      document.getElementById("qt-result").innerHTML = "";
    }
  }

  words.forEach((w, idx) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "wr-word-chip";
    chip.textContent = w;
    chip.title = "Bấm để chọn — chọn thêm từ liền kề để ghép thành cụm, tra nhanh nghĩa";
    chip.addEventListener("click", () => {
      if (selected.has(idx)) selected.delete(idx);
      else selected.add(idx);
      chip.classList.toggle("selected", selected.has(idx));
      applySelection();
    });
    box.appendChild(chip);
  });
  box.classList.remove("hidden");
}
document.querySelectorAll('[data-wfilter]').forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll('[data-wfilter]').forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    wr.filter = btn.dataset.wfilter;
    rebuildWrQueue(false);
    wrResetQuestionUiState();
    renderWrChat();
  });
});
// ⟲ ở Viết KHÔNG xoá lịch sử — chỉ xáo trộn lại thứ tự câu trong hàng đợi.
// Các câu đã làm đúng vẫn giữ nguyên dữ liệu (item.wrProgress), chỉ là log
// hiện tại bắt đầu lại theo thứ tự mới.
document.getElementById("wr-shuffle").addEventListener("click", () => {
  wr.queue = shuffleArr(wr.queue);
  wrRebuildCursor();
  wrResetQuestionUiState();
  renderWrChat();
  showToast("Đã xáo trộn thứ tự câu.");
});

// Bôi đen 1 đoạn trong câu đề (bong bóng bên trái) sẽ tự điền + dịch nhanh
// đoạn đó trong thanh dịch (tự mở thanh dịch lên nếu đang ẩn).
document.getElementById("wr-chat-scroll").addEventListener("mouseup", (e) => {
  if (!e.target.closest(".nghe-bubble-left")) return;
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : "";
  if (!text) return;
  wrToggleTranslateBar(true);
  qtWriting.setInputAndTranslate(text);
});


/* ============================================================
   TỪ LOẠI (part of speech) — dùng Free Dictionary API, chỉ áp
   dụng cho từ đơn tiếng Anh (không có khoảng trắng)
   ============================================================ */
const POS_ABBREV = {
  noun: "N", verb: "V", adjective: "Adj", adverb: "Adv",
  pronoun: "Pron", preposition: "Prep", conjunction: "Conj",
  interjection: "Interj", exclamation: "Interj", determiner: "Det",
  numeral: "Num", article: "Art", auxiliary: "Aux",
};
function posAbbrev(pos) {
  return POS_ABBREV[pos] || pos;
}
async function fetchPartOfSpeech(word) {
  const w = (word || "").trim();
  if (!w || /\s/.test(w)) return [];
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w.toLowerCase())}`);
    if (!res.ok) return [];
    const data = await res.json();
    const set = new Set();
    (Array.isArray(data) ? data : []).forEach((entry) => {
      (entry.meanings || []).forEach((m) => { if (m.partOfSpeech) set.add(m.partOfSpeech); });
    });
    return Array.from(set);
  } catch {
    return [];
  }
}
async function fetchIPA(word) {
  const w = (word || "").trim();
  if (!w || /\s/.test(w)) return "";
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w.toLowerCase())}`);
    if (!res.ok) return "";
    const data = await res.json();
    if (Array.isArray(data) && data[0] && data[0].phonetic) return data[0].phonetic;
    return "";
  } catch {
    return "";
  }
}
/* ================= Parser dán nhanh cho Từ điển ================= *
 * Hỗ trợ dạng: • word /phiên âm/ [loại từ]: nghĩa [loại từ 2]: nghĩa 2 ...
 * - "•" tách các mục
 * - "<>" tách 2 từ trái nghĩa/đối lập trong cùng 1 mục thành 2 mục riêng
 * - "-->" giới thiệu cụm/từ phái sinh (vd: -->perfectly: hết chỗ nói...)
 *   "~" trong cụm sẽ được thay bằng từ gốc (vd: "be ~" -> "be patient")
 * ================================================================= */
function extractPosMeanings(text) {
  const posList = [];
  const meaningParts = [];
  let note = "";
  const t = (text || "").trim();
  if (!t) return { posList, meaningParts, note };
  const regex = /\[([^\]]+)\]\s*:?/g;
  const matches = [...t.matchAll(regex)];
  if (!matches.length) {
    meaningParts.push(t.replace(/^:\s*/, "").trim());
    return { posList, meaningParts, note };
  }
  if (matches[0].index > 0) {
    const prefix = t.slice(0, matches[0].index).trim();
    if (prefix && /[A-Za-zÀ-ỹ0-9]/.test(prefix)) note = prefix;
  }
  matches.forEach((m, i) => {
    const pos = m[1].trim();
    posList.push(pos);
    const startIdx = m.index + m[0].length;
    const endIdx = i + 1 < matches.length ? matches[i + 1].index : t.length;
    const meaning = t.slice(startIdx, endIdx).trim().replace(/[;,]\s*$/, "");
    if (meaning) meaningParts.push(meaning);
  });
  return { posList, meaningParts, note };
}

function parseDictionaryEntryHalf(half, results) {
  const chunks = half.split("-->").map((s) => s.trim()).filter(Boolean);
  const mainChunk = chunks[0] || "";
  const arrowChunks = chunks.slice(1);
  if (!mainChunk) return;

  let headword = "";
  let ipa = "";
  let rest = "";
  const withIpa = mainChunk.match(/^([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ'’-]*)\s*\/([^/]+)\/\s*(.*)$/);
  if (withIpa) {
    headword = withIpa[1].trim();
    ipa = withIpa[2].trim();
    rest = withIpa[3].trim();
  } else {
    const withBracket = mainChunk.match(/^([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ'’-]*)\s*(\[.*)$/);
    if (withBracket) {
      headword = withBracket[1].trim();
      rest = withBracket[2].trim();
    } else {
      const firstColon = mainChunk.indexOf(":");
      if (firstColon !== -1) {
        headword = mainChunk.slice(0, firstColon).trim();
        rest = mainChunk.slice(firstColon + 1).trim();
      } else {
        headword = mainChunk.trim();
      }
    }
  }
  if (!headword) return;

  let { posList, meaningParts, note } = extractPosMeanings(rest);
  const extraNotes = note ? [note] : [];

  arrowChunks.forEach((chunk) => {
    const bracketIdx = chunk.indexOf("[");
    const colonIdx = chunk.indexOf(":");
    if (colonIdx !== -1 && (bracketIdx === -1 || colonIdx < bracketIdx)) {
      const phraseRaw = chunk.slice(0, colonIdx).trim();
      const remainder = chunk.slice(colonIdx + 1).trim();
      const phrase = phraseRaw.includes("~") ? phraseRaw.replace(/~/g, headword) : phraseRaw;
      const subBracket = remainder.indexOf("[");
      const meaningText = (subBracket === -1 ? remainder : remainder.slice(0, subBracket)).trim();
      const continuation = subBracket === -1 ? "" : remainder.slice(subBracket).trim();
      if (meaningText && phrase) {
        results.push({ en: phrase, ipa: "", pos: "", vi: meaningText });
      }
      if (continuation) {
        const extra = extractPosMeanings(continuation);
        posList = posList.concat(extra.posList);
        meaningParts = meaningParts.concat(extra.meaningParts);
      }
    } else if (chunk) {
      extraNotes.push(chunk);
    }
  });

  let vi = meaningParts.join(" / ");
  if (extraNotes.length) vi = (vi ? vi + " " : "") + `(${extraNotes.join("; ")})`;

  results.push({ en: headword, ipa, pos: posList.join(", "), vi: vi.trim() });
}

function parseDictionaryBlob(raw) {
  const text = raw.replace(/\r/g, " ").replace(/\n/g, " ").replace(/\s+/g, " ").replace(/\.\s*$/, "").trim();
  const segments = text.split("•").map((s) => s.trim()).filter(Boolean);
  const results = [];
  segments.forEach((seg) => {
    seg.split("<>").map((s) => s.trim()).filter(Boolean).forEach((half) => parseDictionaryEntryHalf(half, results));
  });
  return results.filter((r) => r.en && r.vi);
}

function parseSimpleLines(raw) {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const results = [];
  lines.forEach((line) => {
    const sep = line.includes("-->") ? "-->" : line.includes("\t") ? "\t" : "-";
    const idx = line.indexOf(sep);
    if (idx === -1) return;
    const en = line.slice(0, idx).trim();
    const vi = line.slice(idx + sep.length).trim();
    if (!en || !vi) return;
    results.push({ en, ipa: "", pos: "", vi });
  });
  return results;
}

function playAudio(word, lang = "en-US") {
  const w = (word || "").trim();
  if (!w) return;
  const utterance = new SpeechSynthesisUtterance(w);
  utterance.lang = lang;
  utterance.rate = 0.95;
  const vol = (state.settings && typeof state.settings.ttsVolume === "number" ? state.settings.ttsVolume : 100) / 100;
  utterance.volume = Math.min(1, Math.max(0, vol));
  speechSynthesis.speak(utterance);
  return utterance;
}

/* ---- Chọn giọng đọc khác nhau cho từng người nói trong hội thoại (Nghe),
   để nghe giống 1 cuộc trò chuyện thật hơn là 1 giọng đọc đều đều ---- */
let ngheCachedVoices = [];
function ngheLoadVoices() {
  if (typeof speechSynthesis === "undefined") return;
  ngheCachedVoices = speechSynthesis.getVoices() || [];
}
if (typeof speechSynthesis !== "undefined") {
  ngheLoadVoices();
  speechSynthesis.onvoiceschanged = ngheLoadVoices;
}
function ngheGetEnglishVoices() {
  if (!ngheCachedVoices.length) ngheLoadVoices();
  const en = ngheCachedVoices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
  return en.length ? en : ngheCachedVoices;
}
const ngheSpeakerVoiceAssign = {};
let ngheVoiceAssignCount = 0;
function ngheGetVoiceForSpeaker(speaker) {
  const voices = ngheGetEnglishVoices();
  if (!voices.length) return null;
  const key = (speaker || "").trim().toLowerCase() || "_default";
  if (!(key in ngheSpeakerVoiceAssign)) {
    ngheSpeakerVoiceAssign[key] = ngheVoiceAssignCount % voices.length;
    ngheVoiceAssignCount++;
  }
  return voices[ngheSpeakerVoiceAssign[key]];
}
// Sinh 1 số 0..1 ổn định theo tên người nói — dùng để lệch nhẹ tốc độ/cao độ
// giữa các nhân vật, cho cảm giác nhấn nhá tự nhiên hơn thay vì đều một tông.
function ngheSpeakerSeed(speaker) {
  const s = (speaker || "").trim();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  return (h % 100) / 100;
}
// Chọn giọng đọc theo cài đặt hiện tại: "single" = luôn dùng 1 giọng người dùng
// chọn sẵn; "multi" (mặc định) = mỗi người nói trong hội thoại 1 giọng riêng.
function ngheVoiceMode() {
  return (state.settings && state.settings.ngheVoiceMode) || "multi";
}
function ngheResolveVoice(speaker) {
  const voices = ngheGetEnglishVoices();
  if (!voices.length) return null;
  if (ngheVoiceMode() === "single") {
    const uri = state.settings && state.settings.ngheSingleVoiceURI;
    const found = uri && voices.find((v) => v.voiceURI === uri);
    return found || voices[0];
  }
  return ngheGetVoiceForSpeaker(speaker);
}
// Đọc 1 câu duy nhất (dùng khi luyện từng câu) — vẫn áp dụng đúng giọng/tông
// theo người nói & cài đặt giọng đọc, giống hệt lúc bấm "đọc toàn bộ".
function ngheSpeakLine(text, speaker) {
  const w = (text || "").trim();
  if (!w) return;
  const utter = new SpeechSynthesisUtterance(w);
  utter.lang = "en-US";
  const voice = ngheResolveVoice(speaker);
  if (voice) utter.voice = voice;
  if (ngheVoiceMode() === "single") {
    utter.rate = 0.95;
    utter.pitch = 1;
  } else {
    const seed = ngheSpeakerSeed(speaker);
    utter.rate = 0.92 + seed * 0.1;
    utter.pitch = 0.9 + seed * 0.25;
  }
  const vol = (state.settings && typeof state.settings.ttsVolume === "number" ? state.settings.ttsVolume : 100) / 100;
  utter.volume = Math.min(1, Math.max(0, vol));
  speechSynthesis.speak(utter);
  return utter;
}

let ngheFullPlayToken = null;
function ngheStopFullPlay() {
  if (!ngheFullPlayToken) return;
  ngheFullPlayToken = null;
  speechSynthesis.cancel();
  const btn = document.getElementById("nghe-play-all-btn");
  if (btn) { btn.textContent = "▶"; btn.classList.remove("playing"); }
}
function ngheToggleFullPlay() {
  const item = ngheCurrentItem();
  if (!item || !item.lines.length) return;
  const btn = document.getElementById("nghe-play-all-btn");
  if (ngheFullPlayToken) {
    ngheStopFullPlay();
    return;
  }
  const token = {};
  ngheFullPlayToken = token;
  btn.textContent = "⏹";
  btn.classList.add("playing");
  ngheSpeakLinesSequentially(item.lines, 0, token, () => {
    if (ngheFullPlayToken === token) {
      ngheFullPlayToken = null;
      btn.textContent = "▶";
      btn.classList.remove("playing");
    }
  });
}
function ngheSpeakLinesSequentially(lines, idx, token, onDone) {
  if (ngheFullPlayToken !== token || idx >= lines.length) {
    onDone();
    return;
  }
  const line = lines[idx];
  const utter = new SpeechSynthesisUtterance(line.text);
  utter.lang = "en-US";
  const voice = ngheResolveVoice(line.speaker);
  if (voice) utter.voice = voice;
  if (ngheVoiceMode() === "single") {
    utter.rate = 0.95;
    utter.pitch = 1;
  } else {
    const seed = ngheSpeakerSeed(line.speaker);
    utter.rate = 0.92 + seed * 0.1;   // ~0.92–1.02, mỗi người nói 1 tốc độ hơi khác
    utter.pitch = 0.9 + seed * 0.25;  // ~0.9–1.15, mỗi người nói 1 cao độ hơi khác
  }
  const vol = (state.settings && typeof state.settings.ttsVolume === "number" ? state.settings.ttsVolume : 100) / 100;
  utter.volume = Math.min(1, Math.max(0, vol));
  const next = () => {
    if (ngheFullPlayToken !== token) { onDone(); return; }
    const pause = 420 + Math.random() * 260; // khoảng nghỉ giữa các lượt thoại, giống hội thoại thật
    setTimeout(() => ngheSpeakLinesSequentially(lines, idx + 1, token, onDone), pause);
  };
  utter.onend = next;
  utter.onerror = next;
  speechSynthesis.speak(utter);
}
document.getElementById("nghe-play-all-btn").addEventListener("click", ngheToggleFullPlay);

/* ---- Popup chọn giọng đọc (1 giọng cho tất cả / mỗi người nói 1 giọng) ---- */
function ngheOpenVoiceOverlay() {
  ngheLoadVoices();
  const mode = ngheVoiceMode();
  document.getElementById("nghe-voice-mode-multi").checked = mode === "multi";
  document.getElementById("nghe-voice-mode-single").checked = mode === "single";
  const select = document.getElementById("nghe-voice-select");
  const voices = ngheGetEnglishVoices();
  const emptyNote = document.getElementById("nghe-voice-empty-note");
  select.innerHTML = "";
  if (!voices.length) {
    emptyNote.classList.remove("hidden");
    select.classList.add("hidden");
  } else {
    emptyNote.classList.add("hidden");
    select.classList.remove("hidden");
    voices.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = v.name + (v.lang ? ` (${v.lang})` : "");
      select.appendChild(opt);
    });
    const savedUri = state.settings && state.settings.ngheSingleVoiceURI;
    if (savedUri && voices.some((v) => v.voiceURI === savedUri)) select.value = savedUri;
  }
  select.disabled = mode !== "single";
  document.getElementById("nghe-voice-overlay").classList.remove("hidden");
}
document.getElementById("nghe-voice-settings-btn").addEventListener("click", ngheOpenVoiceOverlay);
document.getElementById("nghe-voice-close").addEventListener("click", () => {
  document.getElementById("nghe-voice-overlay").classList.add("hidden");
});
document.getElementById("nghe-voice-overlay").addEventListener("click", (e) => {
  if (e.target.id === "nghe-voice-overlay") document.getElementById("nghe-voice-overlay").classList.add("hidden");
});
[document.getElementById("nghe-voice-mode-multi"), document.getElementById("nghe-voice-mode-single")].forEach((radio) => {
  radio.addEventListener("change", () => {
    const mode = document.getElementById("nghe-voice-mode-single").checked ? "single" : "multi";
    state.settings.ngheVoiceMode = mode;
    document.getElementById("nghe-voice-select").disabled = mode !== "single";
    saveState();
  });
});
document.getElementById("nghe-voice-select").addEventListener("change", (e) => {
  state.settings.ngheSingleVoiceURI = e.target.value;
  saveState();
});

const VI_DIACRITIC_REGEX = /[àáạảãăằắặẳẵâầấậẩẫđèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]/i;
function detectIsVietnamese(text) {
  return VI_DIACRITIC_REGEX.test(text || "");
}

/* ============================================================
   QUICK TRANSLATE BAR — reusable factory, instantiated once for
   the Viết tab ("qt") and once for the Thẻ tab ("qt2")
   ============================================================ */
function createQuickTranslateBar(prefix) {
  const qs = { dir: "vi-en", lastEn: "", lastVi: "", lastIPA: "", sourceText: "", debounceHandle: null, requestId: 0, hasBlurred: false };
  const inputEl = document.getElementById(`${prefix}-input`);
  const dirBtn = document.getElementById(`${prefix}-dir-toggle`);
  const resultBox = document.getElementById(`${prefix}-result`);
  const playBtn = document.getElementById(`${prefix}-play`);
  const saveBtn = document.getElementById(`${prefix}-save`);

  function updateDirButton() {
    dirBtn.title = qs.dir === "vi-en" ? "Đổi chiều dịch (V → E)" : "Đổi chiều dịch (E → V)";
    inputEl.placeholder = qs.dir === "vi-en" ? "Nhập từ hoặc cụm từ tiếng Việt ..." : "Nhập từ hoặc cụm từ tiếng Anh ...";
  }

  // Gộp lại các nghĩa đang được chọn (bấm chọn nhiều được, không chỉ 1) thành lastEn/lastVi
  function recomputeSelection() {
    const selected = [...resultBox.querySelectorAll(".qt-candidate-selected")].map((el) => el.textContent);
    const joined = selected.join(" / ");
    if (qs.dir === "vi-en") { qs.lastVi = qs.sourceText; qs.lastEn = joined; }
    else { qs.lastEn = qs.sourceText; qs.lastVi = joined; }
  }

  async function translate() {
    const text = inputEl.value.trim();
    resultBox.classList.remove("qt-error", "qt-loading");
    if (!text) {
      resultBox.innerHTML = "";
      qs.lastEn = "";
      qs.lastVi = "";
      return;
    }
    if (state.settings && state.settings.qtAutoDetectLang) {
      const wantedDir = detectIsVietnamese(text) ? "vi-en" : "en-vi";
      if (wantedDir !== qs.dir) {
        qs.dir = wantedDir;
        updateDirButton();
      }
    }
    qs.sourceText = text;
    resultBox.textContent = "Đang dịch...";
    resultBox.classList.add("qt-loading");
    const myRequestId = ++qs.requestId;
    const langpair = qs.dir === "vi-en" ? "vi|en" : "en|vi";
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}&de=nox-app@example.com`);
      const data = await res.json();
      if (myRequestId !== qs.requestId) return; // a newer request has since started, discard this one
      resultBox.classList.remove("qt-loading");

      // Gather candidate translations: the primary result plus any alternate
      // matches MyMemory found in its translation memory (gives synonyms).
      let candidates = [];
      const primary = data && data.responseData && data.responseData.translatedText;
      if (primary) candidates.push(primary.trim());
      if (Array.isArray(data.matches)) {
        data.matches
          .slice()
          .sort((a, b) => (b.match || 0) - (a.match || 0))
          .forEach((m) => {
            const t = (m.translation || "").trim();
            if (t) candidates.push(t);
          });
      }
      const seen = new Set();
      candidates = candidates.filter((c) => {
        const key = c.toLowerCase();
        if (!c || key === text.toLowerCase() || seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 6);

      if (!candidates.length) {
        resultBox.textContent = "Không tìm thấy bản dịch.";
        resultBox.classList.add("qt-error");
        qs.lastEn = "";
        qs.lastVi = "";
        return;
      }

      resultBox.innerHTML = "";
      candidates.forEach((c, idx) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "qt-candidate" + (idx === 0 ? " qt-candidate-primary qt-candidate-selected" : "");
        chip.textContent = c;
        chip.title = "Nhấn để chọn / bỏ chọn nghĩa này (chọn được nhiều nghĩa)";
        chip.addEventListener("click", () => {
          chip.classList.toggle("qt-candidate-selected");
          recomputeSelection();
        });
        resultBox.appendChild(chip);
      });
      recomputeSelection();

      const englishWord = qs.dir === "vi-en" ? candidates[0] : text;
      Promise.all([
        fetchPartOfSpeech(englishWord),
        fetchIPA(englishWord)
      ]).then(([posList, ipa]) => {
        if (myRequestId !== qs.requestId) return;
        qs.lastIPA = ipa;
        if (!posList.length && !ipa) return;
        const badges = [];
        if (ipa) {
          const ipaBadge = document.createElement("span");
          ipaBadge.className = "qt-ipa-badge";
          ipaBadge.textContent = ipa;
          ipaBadge.title = "Phiên âm";
          badges.push(ipaBadge);
        }
        if (posList.length) {
          const posBadge = document.createElement("span");
          posBadge.className = "qt-pos-badge";
          posBadge.textContent = posList.map(posAbbrev).join(" · ");
          posBadge.title = posList.join(", ");
          badges.push(posBadge);
        }
        badges.forEach(b => resultBox.insertBefore(b, resultBox.firstChild));
      });
    } catch (err) {
      if (myRequestId !== qs.requestId) return;
      resultBox.classList.remove("qt-loading");
      resultBox.textContent = "Lỗi kết nối, thử lại sau.";
      resultBox.classList.add("qt-error");
      qs.lastEn = "";
      qs.lastVi = "";
    }
  }

  dirBtn.addEventListener("click", () => {
    const prevTranslated = qs.dir === "vi-en" ? qs.lastEn : qs.lastVi;
    qs.dir = qs.dir === "vi-en" ? "en-vi" : "vi-en";
    updateDirButton();
    if (prevTranslated) {
      inputEl.value = prevTranslated;
      resultBox.innerHTML = "";
      translate();
    }
  });
  inputEl.addEventListener("input", () => {
    clearTimeout(qs.debounceHandle);
    qs.debounceHandle = setTimeout(translate, 600);
  });
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      clearTimeout(qs.debounceHandle);
      translate();
    }
  });
  inputEl.addEventListener("blur", () => { qs.hasBlurred = true; });
  inputEl.addEventListener("focus", () => {
    if (qs.hasBlurred && state.settings && state.settings.qtClearOnRefocus) {
      inputEl.value = "";
      resultBox.innerHTML = "";
      qs.lastEn = "";
      qs.lastVi = "";
      qs.lastIPA = "";
      qs.hasBlurred = false;
    }
  });
  playBtn.addEventListener("click", () => {
    if (!qs.lastEn) {
      showToast("Chưa có từ tiếng Anh để phát âm.");
      return;
    }
    playAudio(qs.lastEn);
  });

  saveBtn.addEventListener("click", () => {
    if (!qs.lastEn || !qs.lastVi) {
      showToast("Chưa có bản dịch để lưu.");
      return;
    }
    let list = getList("dictionary", state.activeWhList.dictionary);
    if (!list) {
      list = getCategory("dictionary")[0];
      if (!list) {
        list = defaultList("Danh sách 1");
        getCategory("dictionary").push(list);
      }
      state.activeWhList.dictionary = list.id;
    }
    list.items.push({ id: uid(), en: qs.lastEn, vi: qs.lastVi, status: "new", ipa: qs.lastIPA || "" });
    saveState();
    showToast(`Đã lưu vào Từ điển — ${list.name}`);
  });

  updateDirButton();

  return {
    setInputAndTranslate(text) {
      inputEl.value = text;
      clearTimeout(qs.debounceHandle);
      translate();
    },
    // Điền từ + ép chiều dịch (dùng cho khối từ "Lưu nhanh từ" — luôn là từ tiếng Anh)
    setInputAndTranslateForced(text, forceDir) {
      if (forceDir && qs.dir !== forceDir) {
        qs.dir = forceDir;
        updateDirButton();
      }
      inputEl.value = text;
      clearTimeout(qs.debounceHandle);
      translate();
    },
  };
}

const qtWriting = createQuickTranslateBar("qt");
const qtFlashcard = createQuickTranslateBar("qt2");

/* ============================================================
   TAB: NGHE (LISTENING)
   ============================================================ */
// Dán 1 đoạn hội thoại/đoạn văn -> tách thành từng dòng {speaker, text}.
// Dòng dạng "A: nội dung" thì tách nhãn người nói ra riêng (không tính vào
// phần chấm điểm/TTS đọc). Dòng thường (không có "Tên:") thì cả dòng là 1 câu.
function parseListeningBlob(raw) {
  const lines = [];
  raw.split(/\n\s*\n/).forEach((block) => {
    block.split("\n").forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) return;
      const m = line.match(/^([^:]{1,24}):\s*(.+)$/);
      if (m) lines.push({ speaker: m[1].trim(), text: m[2].trim() });
      else lines.push({ speaker: "", text: line });
    });
  });
  return lines;
}

// Levenshtein ở mức TỪ (không phải ký tự) — dùng để chấm nới lỏng cho Nghe.
function wordLevenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// Dung sai theo % SỐ TỪ sai vẫn tính đúng — nới lỏng hơn Viết (Viết chấm theo
// từng ký tự) vì nghe vốn khó hơn đọc. Dễ ~20%, Trung bình ~15%, Khó gần như
// phải khớp tuyệt đối (0% dung sai, chỉ bỏ qua khác biệt hoa/thường & dấu câu).
const NGHE_TOLERANCE_PCT = { easy: 0.2, medium: 0.15, hard: 0 };
function ngheWordTolerance(wordCount) {
  if (nghe.difficulty === "hard") return 0;
  return Math.max(1, Math.round(wordCount * NGHE_TOLERANCE_PCT[nghe.difficulty]));
}
function ngheGradeLine(typed, target) {
  const typedWords = normalizeAnswer(typed).split(" ").filter((w) => w.length);
  const targetWords = normalizeAnswer(target).split(" ").filter((w) => w.length);
  const dist = wordLevenshtein(typedWords, targetWords);
  const pct = targetWords.length ? Math.max(0, Math.round((1 - dist / targetWords.length) * 100)) : 100;
  return { pct, correct: dist <= ngheWordTolerance(targetWords.length) };
}

// Điểm hệ số & giới hạn nghe lại theo độ khó — cùng thang điểm với Viết theo
// yêu cầu người dùng (Dễ +5/-2, Trung bình +15/-6, Khó +35/-14).
const NGHE_DIFFICULTY_GAIN = { easy: 5, medium: 15, hard: 35 };
const NGHE_DIFFICULTY_PENALTY = { easy: 2, medium: 6, hard: 14 };
const NGHE_REPLAY_LIMIT = { easy: Infinity, medium: 3, hard: 1 };
const NGHE_DIFFICULTY_LABELS = { easy: "Độ khó: Dễ", medium: "Độ khó: Trung bình", hard: "Độ khó: Khó" };
const NGHE_DIFFICULTY_CYCLE = { easy: "medium", medium: "hard", hard: "easy" };

const nghe = {
  currentItemId: null,
  listenCount: 0, // số lần chủ động bấm nghe câu đang làm (dòng active), reset mỗi khi đổi dòng active
  difficulty: state.settings.ngheDifficulty || "medium",
  difficultyLocked: false,
  historyIndex: null, // đang lướt lại lịch sử câu sai bằng phím ↑/↓ (null = không lướt)
};

function ngheItemById(id) {
  for (const l of getCategory("listening")) {
    const found = l.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}
function ngheCurrentItem() {
  return nghe.currentItemId ? ngheItemById(nghe.currentItemId) : null;
}
function ngheCurrentItems() {
  return itemsFromLists("listening", state.selected.listening);
}

// Đảm bảo item có cấu trúc tiến độ (progress) hợp lệ & khớp số dòng hiện tại —
// progress được lưu trong item (qua saveState) nên sống sót qua reload trang.
function ngheEnsureProgress(item) {
  if (!item) return null;
  const n = item.lines.length;
  let p = item.progress;
  if (!p || !Array.isArray(p.lineStates) || p.lineStates.length !== n) {
    p = {
      cursor: 0,
      maxReached: 0,
      lineStates: item.lines.map(() => ({ done: false, skipped: false, attempts: [] })),
      itemHadMistake: false,
    };
    item.progress = p;
  }
  return p;
}

function ngheItemLabel(item, idx) {
  return item.title || ("Bài " + (idx + 1));
}

function renderNgheSidebar() {
  const box = document.getElementById("nghe-item-list");
  box.innerHTML = "";
  const items = ngheCurrentItems();
  items.forEach((it, idx) => {
    const btn = document.createElement("button");
    btn.className = "nghe-item-btn" + (nghe.currentItemId === it.id ? " active" : "");
    const dotClass = it.status === "known" ? "dot-known" : it.status === "difficult" ? "dot-difficult" : "dot-learning";
    btn.innerHTML = `<span>${idx + 1}. ${escapeHtml(ngheItemLabel(it, idx))}</span><span class="dot ${dotClass}"></span>`;
    btn.addEventListener("click", () => ngheSelectItem(it.id));
    box.appendChild(btn);
  });
  if (!items.length) {
    box.innerHTML = `<div class="wh-preview-empty">Chưa có bài nào — vào Kho &gt; Nghe để thêm.</div>`;
  }
}

function ngheSelectItem(id) {
  ngheStopFullPlay();
  nghe.currentItemId = id;
  nghe.listenCount = 0;
  nghe.difficultyLocked = false;
  nghe.historyIndex = null;
  const item = ngheItemById(id);
  ngheEnsureProgress(item);
  renderNgheSidebar();
  updateNgheDifficultyBtn();
  document.getElementById("nghe-answer-input").value = "";
  renderNgheChat();
  // Không tự động đọc khi vừa chuyển sang bài khác — người học tự bấm nghe.
}

function renderNgheChat() {
  const scroll = document.getElementById("nghe-chat-scroll");
  const empty = document.getElementById("nghe-chat-empty");
  const item = ngheCurrentItem();
  const titleEl = document.getElementById("nghe-current-title");
  const dotEl = document.getElementById("nghe-current-dot");
  scroll.querySelectorAll(".nghe-bubble-row").forEach((el) => el.remove());

  if (!item) {
    empty.classList.remove("hidden");
    titleEl.textContent = "Chọn 1 bài ở thanh bên trái";
    dotEl.className = "status-dot";
    return;
  }
  empty.classList.add("hidden");
  const progress = ngheEnsureProgress(item);
  const items = ngheCurrentItems();
  const idx = items.findIndex((i) => i.id === item.id);
  const preview = ngheItemLabel(item, idx);
  titleEl.textContent = (idx + 1) + ". " + preview;
  dotEl.className = "status-dot dot " + (item.status === "known" ? "dot-known" : item.status === "difficult" ? "dot-difficult" : "dot-learning");

  const allDone = progress.lineStates.every((ls) => ls.done);

  item.lines.forEach((line, i) => {
    if (i > progress.maxReached) return;
    const lineState = progress.lineStates[i];
    const isActive = i === progress.cursor;
    scroll.appendChild(ngheBuildLeftBubble(line, lineState, i, isActive, item));
    lineState.attempts.forEach((att) => {
      scroll.appendChild(ngheBuildRightBubble(att, isActive && !lineState.done));
    });
  });

  if (allDone) {
    const done = document.createElement("div");
    done.className = "nghe-bubble-row nghe-system-msg";
    done.textContent = "🎉 Hoàn thành bài này! Chọn bài khác ở thanh bên trái để luyện tiếp.";
    scroll.appendChild(done);
  }

  scroll.scrollTop = scroll.scrollHeight;
}

function ngheBuildLeftBubble(line, lineState, lineIdx, isActive, item) {
  const row = document.createElement("div");
  row.className = "nghe-bubble-row left";
  const avatar = document.createElement("div");
  avatar.className = "nghe-avatar";
  avatar.textContent = line.speaker ? line.speaker[0].toUpperCase() : "🔊︎";
  const wrap = document.createElement("div");
  wrap.className = "nghe-left-wrap";
  const bubble = document.createElement("button");
  bubble.type = "button";
  const revealed = lineState.done;
  bubble.className = "nghe-bubble nghe-bubble-left" + (revealed ? "" : " unrevealed");
  if (revealed) {
    bubble.textContent = line.text;
  } else {
    bubble.innerHTML = `<span class="nghe-play-icon">▶</span><span class="nghe-wave"></span>`;
    if (lineState.skipped) {
      const skipBadge = document.createElement("span");
      skipBadge.className = "nghe-skip-badge";
      skipBadge.title = "Câu đã bỏ qua — bấm để quay lại làm";
      skipBadge.textContent = "⏭";
      bubble.appendChild(skipBadge);
    }
    if (isActive) {
      const limit = NGHE_REPLAY_LIMIT[nghe.difficulty];
      if (limit !== Infinity) {
        const badge = document.createElement("span");
        badge.className = "nghe-replay-badge";
        badge.textContent = "còn " + Math.max(0, limit - nghe.listenCount);
        bubble.appendChild(badge);
      }
    }
  }
  bubble.addEventListener("click", () => ngheAttemptPlay(lineIdx));
  wrap.appendChild(bubble);

  // Nút dịch — ẩn theo mặc định, chỉ hiện khi di chuột vào câu đã lộ đáp án.
  // Bản dịch chỉ lưu trong bộ nhớ phiên làm việc (ngheSessionTranslations),
  // mất hẳn khi tải lại trang.
  if (revealed && item) {
    const cacheKey = item.id + "_" + lineIdx;
    const tSpan = document.createElement("span");
    tSpan.className = "nghe-translate-result";
    const cached = ngheSessionTranslations[cacheKey];
    if (cached) tSpan.textContent = cached;

    const tBtn = document.createElement("button");
    tBtn.type = "button";
    tBtn.className = "nghe-translate-btn";
    tBtn.title = "Dịch câu này sang Tiếng Việt";
    tBtn.textContent = "🌐";
    tBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      ngheToggleTranslate(cacheKey, line.text, tSpan);
    });
    wrap.appendChild(tBtn);
    wrap.appendChild(tSpan);
  }

  row.appendChild(avatar);
  row.appendChild(wrap);
  return row;
}

// Bộ nhớ đệm bản dịch — chỉ tồn tại trong phiên làm việc hiện tại (biến JS
// thường, không lưu vào state/localStorage), tải lại trang là mất.
const ngheSessionTranslations = {};
async function ngheToggleTranslate(cacheKey, text, tSpan) {
  if (tSpan.classList.contains("show")) {
    tSpan.classList.remove("show");
    return;
  }
  if (ngheSessionTranslations[cacheKey]) {
    tSpan.textContent = ngheSessionTranslations[cacheKey];
    tSpan.classList.add("show");
    return;
  }
  tSpan.textContent = "Đang dịch...";
  tSpan.classList.add("show", "loading");
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi&de=nox-app@example.com`);
    const data = await res.json();
    const translated = data && data.responseData && data.responseData.translatedText;
    tSpan.classList.remove("loading");
    if (translated) {
      const clean = translated.trim();
      ngheSessionTranslations[cacheKey] = clean;
      tSpan.textContent = clean;
    } else {
      tSpan.textContent = "Không dịch được.";
    }
  } catch (err) {
    tSpan.classList.remove("loading");
    tSpan.textContent = "Lỗi mạng — thử lại.";
  }
}

function ngheBuildRightBubble(attempt, clickable) {
  const row = document.createElement("div");
  row.className = "nghe-bubble-row right";
  const pctSpan = document.createElement("span");
  pctSpan.className = "nghe-pct";
  pctSpan.textContent = attempt.correct ? "✓" : attempt.pct + "%";
  const bubble = document.createElement("div");
  const isClickable = clickable && !attempt.correct;
  bubble.className = "nghe-bubble nghe-bubble-right " + (attempt.correct ? "correct" : "wrong") + (isClickable ? " clickable" : "");
  bubble.textContent = attempt.text;
  if (isClickable) {
    bubble.title = "Nhấp để dán lại câu này vào ô nhập";
    bubble.addEventListener("click", () => {
      const input = document.getElementById("nghe-answer-input");
      input.value = attempt.text;
      input.focus();
      nghe.historyIndex = null;
    });
  }
  row.appendChild(pctSpan);
  row.appendChild(bubble);
  return row;
}

// Bấm vào 1 bong bóng bên trái: nếu đã lộ đáp án -> nghe lại thoải mái;
// nếu là dòng đang active -> nghe câu hiện tại; nếu là dòng đã bỏ qua/chưa
// làm khác -> nhảy tới đó để làm tiếp (chèn đúng vị trí trong hội thoại).
function ngheAttemptPlay(lineIdx) {
  const item = ngheCurrentItem();
  if (!item) return;
  const progress = ngheEnsureProgress(item);
  const lineState = progress.lineStates[lineIdx];
  if (lineState.done) {
    ngheStopFullPlay();
    ngheSpeakLine(item.lines[lineIdx].text, item.lines[lineIdx].speaker);
    return;
  }
  if (lineIdx === progress.cursor) {
    nghePlayCurrentLine(false);
  } else {
    ngheJumpToLine(lineIdx);
  }
}

function ngheJumpToLine(lineIdx) {
  const item = ngheCurrentItem();
  if (!item) return;
  const progress = ngheEnsureProgress(item);
  if (progress.lineStates[lineIdx].done) return;
  progress.cursor = lineIdx;
  nghe.listenCount = 0;
  nghe.difficultyLocked = false;
  nghe.historyIndex = null;
  saveState();
  document.getElementById("nghe-answer-input").value = "";
  renderNgheChat();
  updateNgheDifficultyBtn();
  document.getElementById("nghe-answer-input").focus();
  nghePlayCurrentLine(true);
}

function nghePlayCurrentLine(isAuto) {
  const item = ngheCurrentItem();
  if (!item) return;
  ngheStopFullPlay();
  const progress = ngheEnsureProgress(item);
  const cursor = progress.cursor;
  if (progress.lineStates[cursor] && progress.lineStates[cursor].done) return;
  const limit = NGHE_REPLAY_LIMIT[nghe.difficulty];
  if (!isAuto) {
    if (limit !== Infinity && nghe.listenCount >= limit) {
      showToast("Đã hết lượt nghe lại cho câu này ở độ khó hiện tại.");
      return;
    }
    nghe.listenCount++;
    if (!nghe.difficultyLocked) {
      nghe.difficultyLocked = true;
      updateNgheDifficultyBtn();
    }
    renderNgheChat();
  }
  ngheSpeakLine(item.lines[cursor].text, item.lines[cursor].speaker);
}

function ngheResolveLine(outcome) {
  // outcome: "correct" | "revealed" | "skip"
  const item = ngheCurrentItem();
  if (!item) return;
  const progress = ngheEnsureProgress(item);
  const idx = progress.cursor;
  const lineState = progress.lineStates[idx];
  if (!lineState || lineState.done) return;

  if (outcome === "skip") {
    lineState.skipped = true; // vẫn chưa xong — trung lập, không cộng/trừ điểm
  } else {
    lineState.done = true;
    if (outcome === "revealed" || (outcome === "correct" && lineState.attempts.some((a) => !a.correct))) progress.itemHadMistake = true;
    if (outcome === "correct") {
      logStudyAction("listening", true, NGHE_DIFFICULTY_GAIN[nghe.difficulty], NGHE_DIFFICULTY_PENALTY[nghe.difficulty]);
    } else if (outcome === "revealed") {
      logStudyAction("listening", false, NGHE_DIFFICULTY_GAIN[nghe.difficulty], NGHE_DIFFICULTY_PENALTY[nghe.difficulty]);
    }
  }

  // Tìm dòng tiếp theo cần làm: ưu tiên các dòng phía sau chưa xong, hết thì
  // vòng lại tìm dòng đã bỏ qua trước đó (để "quay lại đoạn bỏ qua").
  let next = -1;
  for (let i = idx + 1; i < item.lines.length; i++) {
    if (!progress.lineStates[i].done) { next = i; break; }
  }
  if (next === -1) {
    for (let i = 0; i < idx; i++) {
      if (!progress.lineStates[i].done) { next = i; break; }
    }
  }

  if (next === -1) {
    item.status = progress.itemHadMistake ? "difficult" : "known";
  } else {
    progress.cursor = next;
    if (next > progress.maxReached) progress.maxReached = next;
  }

  nghe.listenCount = 0;
  nghe.difficultyLocked = false;
  nghe.historyIndex = null;
  saveState();
  document.getElementById("nghe-answer-input").value = "";
  renderNgheChat();
  renderNgheSidebar();
  updateNgheDifficultyBtn();
  if (next !== -1) nghePlayCurrentLine(true);
}

function ngheSubmitAnswer() {
  const item = ngheCurrentItem();
  if (!item) return;
  const progress = ngheEnsureProgress(item);
  const lineState = progress.lineStates[progress.cursor];
  if (!lineState || lineState.done) return;
  const input = document.getElementById("nghe-answer-input");
  const typed = input.value.trim();
  if (!typed) return;
  if (!nghe.difficultyLocked) {
    nghe.difficultyLocked = true;
    updateNgheDifficultyBtn();
  }
  const target = item.lines[progress.cursor].text;
  const { pct, correct } = ngheGradeLine(typed, target);
  if (correct) {
    lineState.attempts.push({ text: typed, pct: 100, correct: true });
    ngheResolveLine("correct");
  } else {
    lineState.attempts.push({ text: typed, pct });
    input.value = "";
    nghe.historyIndex = null;
    saveState();
    renderNgheChat();
  }
}

document.getElementById("nghe-answer-input").addEventListener("input", (e) => {
  nghe.historyIndex = null;
  if (e.target.value.length > 0 && !nghe.difficultyLocked) {
    nghe.difficultyLocked = true;
    updateNgheDifficultyBtn();
  }
});
document.getElementById("nghe-answer-input").addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    nghePlayCurrentLine(false);
  } else if (e.key === "Enter") {
    e.preventDefault();
    ngheSubmitAnswer();
  } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    const item = ngheCurrentItem();
    if (!item) return;
    const progress = ngheEnsureProgress(item);
    const lineState = progress.lineStates[progress.cursor];
    const atts = lineState ? lineState.attempts : [];
    if (!atts.length) return;
    e.preventDefault();
    if (e.key === "ArrowUp") {
      nghe.historyIndex = nghe.historyIndex === null ? atts.length - 1 : Math.max(0, nghe.historyIndex - 1);
      e.target.value = atts[nghe.historyIndex].text;
    } else {
      if (nghe.historyIndex === null) return;
      if (nghe.historyIndex < atts.length - 1) {
        nghe.historyIndex++;
        e.target.value = atts[nghe.historyIndex].text;
      } else {
        nghe.historyIndex = null;
        e.target.value = "";
      }
    }
  }
});
document.getElementById("nghe-show-answer-btn").addEventListener("click", () => {
  if (!ngheCurrentItem()) return;
  ngheResolveLine("revealed");
});
document.getElementById("nghe-skip-btn").addEventListener("click", () => {
  if (!ngheCurrentItem()) return;
  ngheResolveLine("skip");
});
document.getElementById("nghe-reset-progress-btn").addEventListener("click", async () => {
  const item = ngheCurrentItem();
  if (!item) return;
  const ok = await showConfirm("Xoá toàn bộ lịch sử làm bài này (các câu đúng/sai đã lưu) và làm lại từ đầu?");
  if (!ok) return;
  item.progress = {
    cursor: 0,
    maxReached: 0,
    lineStates: item.lines.map(() => ({ done: false, skipped: false, attempts: [] })),
    itemHadMistake: false,
  };
  item.status = "new";
  nghe.listenCount = 0;
  nghe.difficultyLocked = false;
  nghe.historyIndex = null;
  saveState();
  document.getElementById("nghe-answer-input").value = "";
  renderNgheChat();
  renderNgheSidebar();
  updateNgheDifficultyBtn();
  nghePlayCurrentLine(true);
  showToast("Đã đặt lại bài này từ đầu.");
});

function updateNgheDifficultyBtn() {
  const btn = document.getElementById("nghe-difficulty-toggle");
  btn.textContent = NGHE_DIFFICULTY_LABELS[nghe.difficulty] + (nghe.difficultyLocked ? " 🔒" : "");
  btn.classList.remove("difficulty-easy", "difficulty-medium", "difficulty-hard");
  btn.classList.add("difficulty-" + nghe.difficulty);
  btn.classList.toggle("locked", nghe.difficultyLocked);
  btn.title = nghe.difficultyLocked
    ? "Đã bắt đầu làm câu này — sang câu tiếp theo mới đổi được độ khó"
    : "Bấm để đổi độ khó: Dễ → Trung bình → Khó";
}
document.getElementById("nghe-difficulty-toggle").addEventListener("click", () => {
  if (nghe.difficultyLocked) {
    showToast("Đã bắt đầu làm câu này — sang câu tiếp theo mới đổi được độ khó nhé.");
    return;
  }
  nghe.difficulty = NGHE_DIFFICULTY_CYCLE[nghe.difficulty];
  state.settings.ngheDifficulty = nghe.difficulty;
  saveState();
  updateNgheDifficultyBtn();
});
updateNgheDifficultyBtn();

function renderNgheTab() {
  ensureSelected("listening");
  renderNgheSidebar();
  renderNgheChat();
}

document.getElementById("nghe-choose-list").addEventListener("click", () => openListPicker("listening"));

/* ============================================================
   TAB 3: QUIZZ
   ============================================================ */
const quiz = {
  source: "flashcard",
  selectedLists: { flashcard: [], dictionary: [] },
  difficulty: "all",
  countMode: "custom",
  count: 10,
  lang: "random",
  timeMode: "infinite",
  countdownSeconds: 10,
  listenMode: false,
  listenMaxCount: 3,
  listenUsed: 0,
  remaining: 0,
  running: false,
  questions: [],
  qIndex: 0,
  correct: 0,
  wrong: 0,
  timerSec: 0,
  timerHandle: null,
  paused: false,
  answered: false,
};

// Quizz mặc định KHÔNG chọn sẵn danh sách nào — người dùng tự chọn qua "Chọn danh sách"
function ensureQuizSelected(cat) {
  const ids = getCategory(cat).map((l) => l.id);
  quiz.selectedLists[cat] = quiz.selectedLists[cat].filter((id) => ids.includes(id));
}
function quizSourceItems() {
  ensureQuizSelected(quiz.source);
  let items = itemsFromLists(quiz.source, quiz.selectedLists[quiz.source]);
  if (quiz.difficulty !== "all") items = items.filter((i) => i.status === quiz.difficulty);
  return items;
}

document.querySelectorAll('[data-source]').forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll('[data-source]').forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    quiz.source = btn.dataset.source;
    updateQuizCountSliderMax();
  });
});
document.getElementById("quiz-choose-list").addEventListener("click", () => {
  openListPicker(quiz.source === "flashcard" ? "quiz-flashcard" : "quiz-dictionary");
});
document.querySelectorAll('[data-difficulty]').forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll('[data-difficulty]').forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    quiz.difficulty = btn.dataset.difficulty;
    updateQuizCountSliderMax();
  });
});
document.querySelectorAll('[data-countmode]').forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll('[data-countmode]').forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    quiz.countMode = btn.dataset.countmode;
    document.getElementById("quiz-count-row").classList.toggle("hidden", quiz.countMode === "untilWrong");
  });
});
document.querySelectorAll('[data-lang]').forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll('[data-lang]').forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    quiz.lang = btn.dataset.lang;
  });
});
document.querySelectorAll('[data-timemode]').forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll('[data-timemode]').forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    quiz.timeMode = btn.dataset.timemode;
    document.getElementById("quiz-countdown-row").classList.toggle("hidden", quiz.timeMode !== "countdown");
  });
});

/* ---- Số lượng câu: thanh trượt, Max = tổng số câu trong danh sách đã chọn ---- */
function updateQuizCountSliderMax() {
  const pool = quizSourceItems().filter((i) => i.en && i.vi);
  const max = Math.max(1, pool.length);
  const slider = document.getElementById("quiz-count-input");
  slider.max = max;
  if (pool.length > 0 && quiz.count > max) quiz.count = max;
  if (quiz.count < 1) quiz.count = 1;
  const displayVal = Math.min(quiz.count, max);
  slider.value = displayVal;
  document.getElementById("quiz-count-val").textContent = displayVal + " câu";
}
document.getElementById("quiz-countdown-input").addEventListener("input", (e) => {
  quiz.countdownSeconds = Math.max(3, Math.min(60, parseInt(e.target.value, 10) || 10));
  document.getElementById("quiz-countdown-val").textContent = quiz.countdownSeconds + "s / câu";
});
document.getElementById("quiz-count-input").addEventListener("input", (e) => {
  const max = parseInt(e.target.max, 10) || 200;
  quiz.count = Math.max(1, Math.min(max, parseInt(e.target.value, 10) || 1));
  document.getElementById("quiz-count-val").textContent = quiz.count + " câu";
});
document.querySelectorAll("[data-listenmode]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-listenmode]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    quiz.listenMode = btn.dataset.listenmode === "on";
    document.getElementById("quiz-listen-count-row").classList.toggle("hidden", !quiz.listenMode);
  });
});
document.getElementById("quiz-listen-count-input").addEventListener("input", (e) => {
  quiz.listenMaxCount = Math.max(1, parseInt(e.target.value) || 3);
});

function buildQuizQuestions() {
  const pool = quizSourceItems().filter((i) => i.en && i.vi);
  const shuffled = shuffleArr(pool);
  const n = quiz.countMode === "untilWrong" ? shuffled.length : Math.min(quiz.count, shuffled.length);
  const chosen = shuffled.slice(0, n);
  return chosen.map((item) => {
    let dir = quiz.lang;
    if (quiz.listenMode) dir = "e-v"; // listen mode chỉ hỗ trợ E→V
    else if (dir === "random") dir = Math.random() < 0.5 ? "e-v" : "v-e";
    const questionText = dir === "e-v" ? item.en : item.vi;
    const correctAnswer = dir === "e-v" ? item.vi : item.en;
    const distractPool = pool.filter((p) => p !== item).map((p) => (dir === "e-v" ? p.vi : p.en));
    const distractors = shuffleArr(distractPool).slice(0, 3);
    const choices = shuffleArr([correctAnswer, ...distractors]);
    return { questionText, correctAnswer, choices, item };
  });
}

document.getElementById("quiz-start-btn").addEventListener("click", () => {
  if (quiz.selectedLists[quiz.source].length === 0) {
    showToast("Hãy chọn ít nhất một danh sách trước khi bắt đầu.");
    return;
  }
  const pool = quizSourceItems().filter((i) => i.en && i.vi);
  if (pool.length < 4) {
    showToast("Cần ít nhất 4 mục có đủ nghĩa Anh - Việt trong danh sách & độ khó đã chọn.");
    return;
  }
  quiz.questions = buildQuizQuestions();
  quiz.qIndex = 0;
  quiz.correct = 0;
  quiz.wrong = 0;
  quiz.timerSec = 0;
  quiz.paused = false;
  quiz.running = true;
  document.getElementById("quiz-setup-panel").classList.add("hidden");
  document.getElementById("quiz-start-btn").classList.add("hidden");
  document.getElementById("quiz-topbar").classList.remove("hidden");
  document.getElementById("quiz-empty-state").classList.add("hidden");
  stopQuizTipRotation();
  document.getElementById("quiz-result-block").classList.add("hidden");
  document.getElementById("quiz-question-block").classList.remove("hidden");
  startQuizTimer();
  renderQuizQuestion();
});

function startQuizTimer() {
  clearInterval(quiz.timerHandle);
  if (quiz.timeMode === "countdown") {
    quiz.remaining = quiz.countdownSeconds;
    document.getElementById("quiz-timer-val").textContent = quiz.remaining + "s";
  } else {
    quiz.timerSec = 0;
    document.getElementById("quiz-timer-val").textContent = "0s";
  }
  quiz.timerHandle = setInterval(() => {
    if (quiz.paused) return;
    if (quiz.timeMode === "countdown") {
      if (quiz.answered) return;
      quiz.remaining--;
      document.getElementById("quiz-timer-val").textContent = Math.max(quiz.remaining, 0) + "s";
      if (quiz.remaining <= 0) handleQuizTimeout();
    } else {
      quiz.timerSec++;
      document.getElementById("quiz-timer-val").textContent = quiz.timerSec + "s";
    }
  }, 1000);
}
function handleQuizTimeout() {
  if (!quiz.running || quiz.answered) return;
  quiz.answered = true;
  playWrongSound();
  const q = quiz.questions[quiz.qIndex];
  document.querySelectorAll(".quiz-choice-btn").forEach((b) => {
    b.disabled = true;
    if (b.querySelector(".choice-text").textContent === q.correctAnswer) b.classList.add("correct");
  });
  quiz.wrong++;
  q.item.status = "difficult";
  saveState();
  document.getElementById("quiz-wrong-count").textContent = quiz.wrong;
  showToast("Hết giờ!");
  setTimeout(() => {
    if (quiz.countMode === "untilWrong") {
      endQuiz();
      return;
    }
    quiz.qIndex++;
    if (quiz.qIndex >= quiz.questions.length) {
      endQuiz();
    } else {
      renderQuizQuestion();
    }
  }, 700);
}
document.getElementById("quiz-pause").addEventListener("click", (e) => {
  quiz.paused = !quiz.paused;
  e.currentTarget.textContent = quiz.paused ? "▶" : "⏸";
});

function quizPlayCurrentQuestion() {
  if (!quiz.running || quiz.answered) return;
  if (quiz.listenUsed >= quiz.listenMaxCount) {
    showToast("Đã hết lượt nghe.");
    return;
  }
  const q = quiz.questions[quiz.qIndex];
  playAudio(q.questionText);
  quiz.listenUsed++;
  const rem = quiz.listenMaxCount - quiz.listenUsed;
  document.getElementById("quiz-listen-remaining").textContent =
    rem > 0 ? `(còn ${rem} lần)` : "(hết lượt)";
}

function quizSlideIn(block) {
  block.classList.remove("quiz-slide-in", "quiz-slide-out");
  void block.offsetWidth;
  block.classList.add("quiz-slide-in");
}

function renderQuizQuestion(skipAnimation) {
  quiz.answered = false;
  quiz.listenUsed = 0;
  if (quiz.timeMode === "countdown") {
    quiz.remaining = quiz.countdownSeconds;
    document.getElementById("quiz-timer-val").textContent = quiz.remaining + "s";
  }
  const total = quiz.questions.length;
  document.getElementById("quiz-current-q").textContent = Math.min(quiz.qIndex + 1, total);
  document.getElementById("quiz-total-q").textContent = total;
  document.getElementById("quiz-total-count").textContent = total;
  document.getElementById("quiz-total-count2").textContent = total;
  document.getElementById("quiz-correct-count").textContent = quiz.correct;
  document.getElementById("quiz-wrong-count").textContent = quiz.wrong;

  const q = quiz.questions[quiz.qIndex];
  const block = document.getElementById("quiz-question-block");
  const listenHint = document.getElementById("quiz-listen-hint");
  const questionTextEl = document.getElementById("quiz-question-text");

  // xoá reveal cũ nếu có
  const oldReveal = block.querySelector(".quiz-reveal-question");
  if (oldReveal) oldReveal.remove();

  if (quiz.listenMode) {
    listenHint.classList.remove("hidden");
    questionTextEl.classList.add("hidden");
    document.getElementById("quiz-listen-remaining").textContent = `(${quiz.listenMaxCount} lần)`;
  } else {
    listenHint.classList.add("hidden");
    questionTextEl.classList.remove("hidden");
    questionTextEl.textContent = q.questionText;
  }

  const btns = document.querySelectorAll(".quiz-choice-btn");
  btns.forEach((btn, i) => {
    btn.classList.remove("correct", "wrong");
    btn.querySelector(".choice-text").textContent = q.choices[i] || "";
    btn.disabled = false;
  });

  if (!skipAnimation) quizSlideIn(block);

  if (quiz.listenMode) {
    // delay 1.5s rồi tự đọc — lần này KHÔNG tính vào lượt
    setTimeout(() => {
      if (!quiz.running || quiz.answered) return;
      playAudio(q.questionText);
      document.getElementById("quiz-listen-remaining").textContent = `(${quiz.listenMaxCount} lần)`;
    }, 1500);
  }
}

document.querySelectorAll(".quiz-choice-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!quiz.running || quiz.answered) return;
    quiz.answered = true;
    const q = quiz.questions[quiz.qIndex];
    const chosenText = btn.querySelector(".choice-text").textContent;
    const isCorrect = chosenText === q.correctAnswer;
    logStudyAction("quiz", isCorrect);
    document.querySelectorAll(".quiz-choice-btn").forEach((b) => {
      b.disabled = true;
      if (b.querySelector(".choice-text").textContent === q.correctAnswer) b.classList.add("correct");
    });
    if (!isCorrect) {
      playWrongSound();
      btn.classList.add("wrong");
      quiz.wrong++;
      q.item.status = "difficult";
    } else {
      playCorrectSound();
      quiz.correct++;
      q.item.status = "known";
    }
    saveState();
    document.getElementById("quiz-correct-count").textContent = quiz.correct;
    document.getElementById("quiz-wrong-count").textContent = quiz.wrong;

    // Nếu listen mode: hiện câu hỏi sau khi chọn đáp án
    if (quiz.listenMode) {
      const block = document.getElementById("quiz-question-block");
      const oldReveal = block.querySelector(".quiz-reveal-question");
      if (oldReveal) oldReveal.remove();
      const reveal = document.createElement("div");
      reveal.className = "quiz-reveal-question quiz-slide-in";
      reveal.textContent = q.questionText;
      const choiceGrid = block.querySelector(".quiz-choice-grid");
      block.insertBefore(reveal, choiceGrid);
    }

    setTimeout(() => {
      if (quiz.countMode === "untilWrong" && !isCorrect) {
        endQuiz();
        return;
      }
      quiz.qIndex++;
      if (quiz.qIndex >= quiz.questions.length) {
        endQuiz();
      } else {
        const block = document.getElementById("quiz-question-block");
        block.classList.add("quiz-slide-out");
        setTimeout(() => renderQuizQuestion(), 300);
      }
    }, 1200);
  });
});

// click vào ô listen hint để nghe lại
document.getElementById("quiz-listen-hint").addEventListener("click", () => {
  if (!quiz.running || !quiz.listenMode) return;
  if (quiz.answered) return;
  quizPlayCurrentQuestion();
});

function endQuiz() {
  quiz.running = false;
  clearInterval(quiz.timerHandle);
  document.getElementById("quiz-question-block").classList.add("hidden");
  document.getElementById("quiz-topbar").classList.add("hidden");
  document.getElementById("quiz-result-block").classList.remove("hidden");
  document.getElementById("quiz-result-score").textContent = `${quiz.correct} / ${quiz.qIndex + (quiz.correct + quiz.wrong > quiz.qIndex ? 1 : 0) || quiz.questions.length}`;
  document.getElementById("quiz-result-score").textContent = `${quiz.correct} / ${quiz.correct + quiz.wrong}`;
}
function exitQuiz() {
  quiz.running = false;
  clearInterval(quiz.timerHandle);
  document.getElementById("quiz-setup-panel").classList.remove("hidden");
  document.getElementById("quiz-start-btn").classList.remove("hidden");
  document.getElementById("quiz-topbar").classList.add("hidden");
  document.getElementById("quiz-question-block").classList.add("hidden");
  document.getElementById("quiz-result-block").classList.add("hidden");
  document.getElementById("quiz-empty-state").classList.remove("hidden");
  startQuizTipRotation();
}
document.getElementById("quiz-exit").addEventListener("click", exitQuiz);
document.getElementById("quiz-result-exit").addEventListener("click", exitQuiz);
document.getElementById("quiz-restart").addEventListener("click", () => {
  document.getElementById("quiz-start-btn").click();
});

/* ---- Màn hình chờ Quiz: xoay vòng mẹo nhỏ cho đỡ nhàm ---- */
const QUIZ_WAIT_TIPS = [
  "💡 Bật \"Chế độ nghe\" để luyện phản xạ nghe song song với từ vựng.",
  "🎯 Lọc theo \"Đang học\" để tập trung ôn đúng những từ chưa nhớ.",
  "📈 Làm đúng câu Quizz cũng cộng vào Hệ số — xem ở Kho > Thống kê.",
  "⏱ Thử chế độ đếm ngược để luyện phản xạ trả lời nhanh hơn.",
  "🔀 Bật \"Ngẫu nhiên\" ở Ngôn ngữ để không đoán được chiều câu hỏi tiếp theo.",
  "🔥 Làm đúng liên tục không nghỉ — \"đà\" (streak) của Hệ số sẽ tăng nhanh hơn.",
  "🧩 Chơi \"đến khi sai\" để thử xem giữ được chuỗi đúng dài bao nhiêu câu.",
];
let quizTipTimer = null;
let quizTipIndex = -1;
function showNextQuizTip() {
  const el = document.getElementById("quiz-empty-tip");
  if (!el) return;
  el.classList.add("fade");
  setTimeout(() => {
    let next;
    do { next = Math.floor(Math.random() * QUIZ_WAIT_TIPS.length); }
    while (next === quizTipIndex && QUIZ_WAIT_TIPS.length > 1);
    quizTipIndex = next;
    el.textContent = QUIZ_WAIT_TIPS[quizTipIndex];
    el.classList.remove("fade");
  }, 350);
}
function startQuizTipRotation() {
  showNextQuizTip();
  clearInterval(quizTipTimer);
  quizTipTimer = setInterval(showNextQuizTip, 5000);
}
function stopQuizTipRotation() {
  clearInterval(quizTipTimer);
  quizTipTimer = null;
}

document.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;
  if (!quiz.running || !quiz.listenMode || quiz.answered) return;
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
  e.preventDefault();
  quizPlayCurrentQuestion();
});

/* ============================================================
   TAB 4: KHO (WAREHOUSE)
   ============================================================ */
const wh = { cat: "flashcard" };

function whCatLabel(cat) {
  return { flashcard: "Thẻ", writing: "Viết", listening: "Nghe", dictionary: "Từ điển", diary: "Nhật Ký", stats: "Thống kê" }[cat];
}

document.querySelectorAll("[data-wh-cat]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-wh-cat]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    wh.cat = btn.dataset.whCat;
    renderWarehouseTab();
  });
});

function whActiveList() {
  const lists = getCategory(wh.cat);
  let activeId = state.activeWhList[wh.cat];
  if (!activeId || !lists.find((l) => l.id === activeId)) {
    activeId = lists[0] ? lists[0].id : null;
    state.activeWhList[wh.cat] = activeId;
  }
  return lists.find((l) => l.id === activeId) || null;
}

function renderWarehouseTab() {
  const isStats = wh.cat === "stats";
  document.getElementById("wh-sidebar-list-section").classList.toggle("hidden", isStats);
  document.getElementById("wh-stats-sidebar-note").classList.toggle("hidden", !isStats);
  document.getElementById("wh-current-list-title").classList.toggle("hidden", isStats);
  document.getElementById("wh-toolbar").classList.toggle("hidden", isStats);
  document.getElementById("wh-legend").classList.toggle("hidden", isStats);
  document.getElementById("wh-bottom-bar").classList.toggle("hidden", isStats);
  // Luôn ẩn hết các khung con trước — chỉ khung đúng với wh.cat hiện tại mới
  // được hiện lại bên dưới. Tránh trường hợp 1 khung bị "kẹt" hiện ra khi
  // chuyển cat (vd: bài Nghe bị chèn sang lúc xem Thống kê).
  document.getElementById("wh-stats-view").classList.add("hidden");
  document.getElementById("wh-table-wrap").classList.add("hidden");
  document.getElementById("wh-diary-preview").classList.add("hidden");
  document.getElementById("wh-listening-view").classList.add("hidden");
  if (isStats) {
    document.getElementById("wh-stats-view").classList.remove("hidden");
    renderStatsTab();
    return;
  }

  document.getElementById("wh-lists-title").textContent = whCatLabel(wh.cat);
  const grid = document.getElementById("wh-list-grid");
  grid.innerHTML = "";
  const activeList = whActiveList();
  const canRemind = wh.cat === "flashcard" || wh.cat === "dictionary";
  getCategory(wh.cat).forEach((list) => {
    const btn = document.createElement("button");
    btn.className = "wh-list-item" + (activeList && list.id === activeList.id ? " active" : "");
    btn.innerHTML = `<span class="wh-list-item-name">${escapeHtml(list.name)}</span>`;
    if (canRemind) {
      const dot = document.createElement("span");
      dot.className = "wh-list-reminder-dot" + (list.reminderEnabled ? " on" : "");
      dot.textContent = "🔔";
      dot.title = list.reminderEnabled ? "Đang bật nhắc từ cho danh sách này — nhấn để tắt" : "Bật nhắc từ cho danh sách này";
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        list.reminderEnabled = !list.reminderEnabled;
        saveState();
        renderWarehouseTab();
        if (state.reminder.enabled) reminderRefillQueue();
      });
      btn.appendChild(dot);
    }
    btn.addEventListener("click", () => {
      state.activeWhList[wh.cat] = list.id;
      saveState();
      renderWarehouseTab();
    });
    grid.appendChild(btn);
  });

  const isDiary = wh.cat === "diary";
  const isListening = wh.cat === "listening";
  document.getElementById("wh-table-wrap").classList.toggle("compact-cols", wh.cat !== "dictionary");
  document.getElementById("wh-table-wrap").classList.toggle("hidden", isDiary || isListening);
  document.getElementById("wh-diary-preview").classList.toggle("hidden", !isDiary);
  document.getElementById("wh-listening-view").classList.toggle("hidden", !isListening);
  document.getElementById("wh-toolbar").classList.toggle("hidden", isDiary);
  document.getElementById("wh-legend").classList.toggle("hidden", isDiary || isListening);
  document.getElementById("wh-bottom-bar").classList.toggle("hidden", isDiary);
  document.getElementById("wh-reminder-toggle").classList.toggle("hidden", !canRemind);
  document.getElementById("wh-reminder-toggle").classList.toggle("active", state.reminder.enabled);
  document.getElementById("wh-reminder-read-toggle").classList.toggle("hidden", !canRemind);
  document.getElementById("wh-reminder-read-toggle").classList.toggle("active", state.reminder.autoRead);

  if (!isDiary && !isListening) {
    const legendMap = {
      flashcard: ["Đang học", "Đã biết", "Khó"],
      writing: ["Chưa làm", "Làm đúng", "Làm sai"],
      dictionary: ["Đang học", "Đã biết", "Khó"],
    };
    const [l1, l2, l3] = legendMap[wh.cat];
    document.getElementById("wh-legend-1").textContent = l1;
    document.getElementById("wh-legend-2").textContent = l2;
    document.getElementById("wh-legend-3").textContent = l3;
  }

  document.getElementById("wh-current-list-title").textContent = activeList ? activeList.name : "—";
  if (isDiary) {
    renderDiaryPreview();
  } else if (isListening) {
    renderWhListeningView();
  } else {
    renderWhTable();
  }
}

/* ============================================================
   TAB THỐNG KÊ (Kho > Thống kê)
   ============================================================ */
let statsChartInstance = null;
let statsSeriesInstance = null;

function statsSnapshotForCat(cat) {
  const items = allItems(cat);
  const total = items.length;
  const known = items.filter((i) => i.status === "known").length;
  const difficult = items.filter((i) => i.status === "difficult").length;
  const fresh = Math.max(0, total - known - difficult);
  return { total, known, difficult, fresh };
}

function renderStatsSnapshot() {
  const box = document.getElementById("wh-stats-snapshot");
  box.innerHTML = "";
  [
    { cat: "flashcard", title: "Thẻ", knownLabel: "Đã biết", difficultLabel: "Khó", freshLabel: "Đang học" },
    { cat: "writing", title: "Viết", knownLabel: "Làm đúng", difficultLabel: "Làm sai", freshLabel: "Chưa làm" },
    { cat: "dictionary", title: "Từ điển", knownLabel: "Đã biết", difficultLabel: "Khó", freshLabel: "Đang học" },
  ].forEach((cfg) => {
    const s = statsSnapshotForCat(cfg.cat);
    const pctKnown = s.total ? Math.round((s.known / s.total) * 100) : 0;
    const pctDifficult = s.total ? (s.difficult / s.total) * 100 : 0;
    const pctFresh = s.total ? (s.fresh / s.total) * 100 : 0;
    const card = document.createElement("div");
    card.className = "wh-stats-card";
    card.innerHTML = `
      <div class="wh-stats-card-title">${cfg.title}</div>
      <div class="wh-stats-card-total">${s.total} mục · ${pctKnown}% ${cfg.knownLabel.toLowerCase()}</div>
      <div class="wh-stats-card-bar">
        <span class="seg-known" style="width:${(s.total ? (s.known / s.total) * 100 : 0)}%"></span>
        <span class="seg-difficult" style="width:${pctDifficult}%"></span>
        <span class="seg-new" style="width:${pctFresh}%"></span>
      </div>
      <div class="wh-stats-card-legend">
        <span><span class="dot" style="background:#22c55e"></span>${cfg.knownLabel}: ${s.known}</span>
        <span><span class="dot" style="background:#ef4444"></span>${cfg.difficultLabel}: ${s.difficult}</span>
        <span><span class="dot" style="background:var(--text-muted)"></span>${cfg.freshLabel}: ${s.fresh}</span>
      </div>`;
    box.appendChild(card);
  });
}

function renderStatsMomentumChart() {
  const m = state.studyMomentum;
  const valEl = document.getElementById("wh-stats-momentum-val");
  valEl.textContent = m.score.toFixed(1);
  valEl.classList.toggle("positive", m.score > 0);
  valEl.classList.toggle("negative", m.score < 0);

  const container = document.getElementById("wh-stats-chart");
  if (typeof LightweightCharts === "undefined") {
    container.innerHTML = `<div class="wh-stats-card-title" style="padding:20px 0;">Không tải được thư viện biểu đồ — cần kết nối mạng ở lần mở đầu tiên.</div>`;
    return;
  }
  if (!m.history.length) {
    container.innerHTML = `<div class="wh-stats-card-title" style="padding:20px 0;">Chưa có dữ liệu. Bắt đầu học ở Thẻ / Viết / Quizz để bắt đầu ghi.</div>`;
    return;
  }

  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  if (!statsChartInstance) {
    container.innerHTML = "";
    statsChartInstance = LightweightCharts.createChart(container, {
      layout: { background: { color: "transparent" }, textColor: cssVar("--text-muted") || "#888" },
      grid: {
        vertLines: { color: cssVar("--border") || "#333" },
        horzLines: { color: cssVar("--border") || "#333" },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
      crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
      autoSize: true,
    });
    statsSeriesInstance = statsChartInstance.addBaselineSeries({
      baseValue: { type: "price", price: 0 },
      topLineColor: "rgba(34,197,94,1)",
      topFillColor1: "rgba(34,197,94,0.28)",
      topFillColor2: "rgba(34,197,94,0.05)",
      bottomLineColor: "rgba(239,68,68,1)",
      bottomFillColor1: "rgba(239,68,68,0.05)",
      bottomFillColor2: "rgba(239,68,68,0.28)",
      lineWidth: 2,
    });
  } else {
    statsChartInstance.applyOptions({
      layout: { background: { color: "transparent" }, textColor: cssVar("--text-muted") || "#888" },
      grid: {
        vertLines: { color: cssVar("--border") || "#333" },
        horzLines: { color: cssVar("--border") || "#333" },
      },
    });
  }

  statsSeriesInstance.setData(m.history.map((p) => ({ time: p.t, value: p.score })));
  statsChartInstance.timeScale().fitContent();
  requestAnimationFrame(() => {
    if (statsChartInstance && container.clientWidth) {
      statsChartInstance.resize(container.clientWidth, container.clientHeight || 300);
      statsChartInstance.timeScale().fitContent();
    }
  });
}

function renderStatsTab() {
  renderStatsSnapshot();
  renderStatsMomentumChart();
}

function renderDiaryPreview() {
  const list = whActiveList();
  const box = document.getElementById("wh-diary-preview-content");
  if (!list || !list.content || !list.content.trim()) {
    box.innerHTML = `<p class="wh-diary-empty">Chưa có nội dung. Nhấn "Mở để viết" để bắt đầu ghi chép.</p>`;
  } else {
    box.innerHTML = list.content;
  }
}

let whDragSrcId = null;

function renderWhTable() {
  const table = document.getElementById("wh-table");
  table.innerHTML = "";
  const list = whActiveList();
  if (!list || !list.items.length) {
    table.innerHTML = `<div class="wh-empty-row">Chưa có mục nào trong danh sách này</div>`;
    document.getElementById("wh-progress").textContent = "Tiến độ: 0%";
    return;
  }
  list.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "wh-row";
    row.draggable = true;
    row.dataset.itemId = item.id;
    const dotClass = item.status === "known" ? "dot-known" : item.status === "difficult" ? "dot-difficult" : "dot-learning";
    row.innerHTML = `
      <span class="wh-row-handle" title="Kéo để sắp xếp lại">≡</span>
      <span class="wh-row-en">${escapeHtml(item.en)}</span>
      <span class="wh-row-ipa" id="wh-ipa-${item.id}"></span>
      <span class="wh-row-pos" id="wh-pos-${item.id}"></span>
      <span class="wh-row-arrow">→</span>
      <span class="wh-row-vi">${escapeHtml(item.vi)}</span>
      <span class="wh-row-dot ${dotClass}" title="${escapeHtml(statusLabel(wh.cat === "dictionary" ? "flashcard" : wh.cat, item.status))}"></span>
      <span class="wh-row-actions">
        <button data-act="play" title="Phát âm">🔊︎</button>
        <button data-act="edit" title="Sửa">✎</button>
        <button data-act="del" title="Xoá">🗑</button>
      </span>`;
    
    row.querySelector('[data-act="play"]').addEventListener("click", () => playAudio(item.en));
    row.querySelector('[data-act="edit"]').addEventListener("click", () => openWhEdit(item.id));
    row.querySelector('[data-act="del"]').addEventListener("click", async () => {
      const ok = await showConfirm("Xoá mục này?");
      if (!ok) return;
      list.items = list.items.filter((i) => i.id !== item.id);
      saveState();
      renderWarehouseTab();
    });
    row.querySelector(".wh-row-dot").addEventListener("click", () => {
      const order = ["new", "known", "difficult"];
      item.status = order[(order.indexOf(item.status) + 1) % order.length];
      saveState();
      renderWhTable();
    });

    /* ---- drag & drop reordering ---- */
    row.addEventListener("dragstart", (e) => {
      whDragSrcId = item.id;
      row.classList.add("dragging");
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        try { e.dataTransfer.setData("text/plain", item.id); } catch (err) { /* ignore */ }
      }
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      table.querySelectorAll(".wh-row").forEach((r) => r.classList.remove("drag-over-top", "drag-over-bottom"));
      whDragSrcId = null;
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
      if (!whDragSrcId || whDragSrcId === item.id) return;
      const rect = row.getBoundingClientRect();
      const isAfter = e.clientY - rect.top > rect.height / 2;
      row.classList.toggle("drag-over-bottom", isAfter);
      row.classList.toggle("drag-over-top", !isAfter);
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over-top", "drag-over-bottom");
    });
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      const isAfter = row.classList.contains("drag-over-bottom");
      row.classList.remove("drag-over-top", "drag-over-bottom");
      if (!whDragSrcId || whDragSrcId === item.id) return;
      const fromIdx = list.items.findIndex((i) => i.id === whDragSrcId);
      let toIdx = list.items.findIndex((i) => i.id === item.id);
      if (fromIdx === -1 || toIdx === -1) return;
      const [moved] = list.items.splice(fromIdx, 1);
      toIdx = list.items.findIndex((i) => i.id === item.id);
      list.items.splice(isAfter ? toIdx + 1 : toIdx, 0, moved);
      saveState();
      renderWhTable();
    });

    table.appendChild(row);

    // Cột Phiên âm / Loại từ chỉ áp dụng cho tab Từ điển
    if (wh.cat === "dictionary") {
      const storedPos = (item.pos || "").split(",").map((s) => s.trim()).filter(Boolean);
      Promise.all([
        Promise.resolve(item.ipa || ""),
        item.ipa ? Promise.resolve("") : fetchIPA(item.en),
        storedPos.length ? Promise.resolve(storedPos) : fetchPartOfSpeech(item.en)
      ]).then(([storedIPA, fetchedIPA, posList]) => {
        const ipa = storedIPA || fetchedIPA;
        const ipaEl = document.getElementById(`wh-ipa-${item.id}`);
        const posEl = document.getElementById(`wh-pos-${item.id}`);
        if (ipa && ipaEl) ipaEl.textContent = ipa;
        if (posList.length && posEl) {
          posEl.textContent = posList.map(posAbbrev).join(" · ");
          posEl.title = posList.join(", ");
        }
      }).catch(() => {});
    }
  });
  const known = list.items.filter((i) => i.status === "known").length;
  const pct = Math.round((known / list.items.length) * 100);
  document.getElementById("wh-progress").textContent = `Tiến độ: ${pct}%`;
}

async function addWhList() {
  const defaultName = wh.cat === "diary" ? "Nhật ký " + (getCategory(wh.cat).length + 1) : "Danh sách " + (getCategory(wh.cat).length + 1);
  const name = await showPrompt("Tên danh sách mới", defaultName);
  if (!name) return;
  const list = wh.cat === "diary" ? defaultDiaryList(name) : defaultList(name);
  getCategory(wh.cat).push(list);
  state.activeWhList[wh.cat] = list.id;
  saveState();
  renderWarehouseTab();
}
document.getElementById("wh-add-list").addEventListener("click", addWhList);

document.getElementById("wh-rename-list").addEventListener("click", async () => {
  const list = whActiveList();
  if (!list) return;
  const name = await showPrompt("Đổi tên danh sách", list.name);
  if (!name) return;
  list.name = name;
  saveState();
  renderWarehouseTab();
});
document.getElementById("wh-delete-list").addEventListener("click", async () => {
  const list = whActiveList();
  if (!list) return;
  const lists = getCategory(wh.cat);
  if (lists.length <= 1) {
    showToast("Phải có ít nhất một danh sách.");
    return;
  }
  const ok = await showConfirm(`Xoá danh sách "${list.name}"? Toàn bộ mục bên trong sẽ mất.`);
  if (!ok) return;
  state.categories[wh.cat] = lists.filter((l) => l.id !== list.id);
  state.activeWhList[wh.cat] = null;
  state.selected.flashcard = state.selected.flashcard.filter((id) => id !== list.id);
  state.selected.writing = state.selected.writing.filter((id) => id !== list.id);
  saveState();
  renderWarehouseTab();
});
document.getElementById("wh-clear-all").addEventListener("click", async () => {
  const list = whActiveList();
  if (!list || !list.items.length) return;
  const ok = await showConfirm("Xoá toàn bộ mục trong danh sách này?");
  if (!ok) return;
  list.items = [];
  saveState();
  renderWarehouseTab();
});
document.getElementById("wh-reset-status").addEventListener("click", () => {
  const list = whActiveList();
  if (!list) return;
  list.items.forEach((i) => (i.status = "new"));
  saveState();
  renderWarehouseTab();
});

/* ---- Thêm vào (bulk add) modal ---- */
const whAddOverlay = document.getElementById("wh-add-overlay");
const whAddInputView = document.getElementById("wh-add-input-view");
const whAddPreviewView = document.getElementById("wh-add-preview-view");
let whPreviewItems = [];

function whShowInputView() {
  whAddPreviewView.classList.add("hidden");
  whAddInputView.classList.remove("hidden");
}
function whShowPreviewView() {
  whAddInputView.classList.add("hidden");
  whAddPreviewView.classList.remove("hidden");
}

document.getElementById("wh-add-items").addEventListener("click", () => {
  const list = whActiveList();
  if (!list) return;
  if (wh.cat === "listening") {
    whListeningEditingId = null;
    document.getElementById("wh-listening-add-list-name").textContent = "— " + list.name;
    document.getElementById("wh-listening-add-textarea").value = "";
    whListeningShowInputView();
    document.getElementById("wh-listening-add-overlay").classList.remove("hidden");
    return;
  }
  document.getElementById("wh-add-list-name").textContent = "— " + list.name;
  const textarea = document.getElementById("wh-add-textarea");
  textarea.value = "";
  if (wh.cat === "dictionary") {
    textarea.placeholder = 'Nhập câu hoặc nhiều câu ở đây ...\n( Câu Tiếng Anh - Câu Tiếng Việt )\n\nHoặc dán cả đoạn định dạng • từ /phiên âm/ [loại từ]: nghĩa';
  } else if (wh.cat === "writing") {
    textarea.placeholder = 'Nhập mỗi câu 1 dòng:\nI like/love her - Tôi thích cô ấy\nI like her | She\'s someone I like - Tôi thích cô ấy\n\nDùng "/" cho từ thay thế trong 1 đáp án, dùng "|" để thêm đáp án khác hẳn';
  } else {
    textarea.placeholder = 'Nhập câu hoặc nhiều câu ở đây ...\n( Câu Tiếng Anh - Câu Tiếng Việt )';
  }
  whShowInputView();
  whAddOverlay.classList.remove("hidden");
});
document.getElementById("wh-add-close").addEventListener("click", () => whAddOverlay.classList.add("hidden"));
whAddOverlay.addEventListener("click", (e) => { if (e.target === whAddOverlay) whAddOverlay.classList.add("hidden"); });
document.getElementById("wh-add-clear").addEventListener("click", () => {
  document.getElementById("wh-add-textarea").value = "";
});

document.getElementById("wh-add-confirm").addEventListener("click", () => {
  const list = whActiveList();
  if (!list) return;
  const raw = document.getElementById("wh-add-textarea").value;
  if (!raw.trim()) { showToast("Chưa có nội dung để chuyển."); return; }
  whPreviewItems = wh.cat === "dictionary" ? parseDictionaryBlob(raw) : parseSimpleLines(raw);
  if (!whPreviewItems.length) {
    showToast(
      wh.cat === "dictionary"
        ? 'Không nhận diện được mục nào. Dùng định dạng: "• từ /phiên âm/ [loại từ]: nghĩa"'
        : 'Không nhận diện được dòng nào. Dùng định dạng: "Câu Tiếng Anh - Câu Tiếng Việt" mỗi dòng.'
    );
    return;
  }
  renderWhPreview();
  whShowPreviewView();
});

function renderWhPreview() {
  const box = document.getElementById("wh-preview-list");
  box.innerHTML = "";
  const isDict = wh.cat === "dictionary";
  document.getElementById("wh-preview-hint").textContent =
    `Xem trước ${whPreviewItems.length} mục — có thể chỉnh sửa từng ô, xoá mục không cần, rồi nhấn OK để thêm vào danh sách.`;
  if (!whPreviewItems.length) {
    box.innerHTML = `<div class="wh-preview-empty">Không có mục nào để xem trước.</div>`;
    return;
  }
  whPreviewItems.forEach((it, idx) => {
    const row = document.createElement("div");
    row.className = "wh-preview-row" + (isDict ? "" : " simple");
    row.dataset.idx = idx;
    row.innerHTML = isDict
      ? `<input class="wh-preview-en" value="${escapeHtml(it.en)}" placeholder="Từ tiếng Anh">
         <input class="wh-preview-ipa" value="${escapeHtml(it.ipa)}" placeholder="Phiên âm">
         <input class="wh-preview-pos" value="${escapeHtml(it.pos)}" placeholder="Loại từ">
         <textarea class="wh-preview-vi" placeholder="Nghĩa tiếng Việt">${escapeHtml(it.vi)}</textarea>
         <button class="wh-preview-remove" title="Bỏ mục này">🗑</button>`
      : `<input class="wh-preview-en" value="${escapeHtml(it.en)}" placeholder="Tiếng Anh">
         <textarea class="wh-preview-vi" placeholder="Tiếng Việt">${escapeHtml(it.vi)}</textarea>
         <button class="wh-preview-remove" title="Bỏ mục này">🗑</button>`;
    row.querySelector(".wh-preview-remove").addEventListener("click", () => {
      whPreviewItems.splice(idx, 1);
      renderWhPreview();
    });
    box.appendChild(row);
  });
}

document.getElementById("wh-add-back").addEventListener("click", () => whShowInputView());

document.getElementById("wh-add-ok").addEventListener("click", () => {
  const list = whActiveList();
  if (!list) return;
  const isDict = wh.cat === "dictionary";
  const isWriting = wh.cat === "writing";
  const rows = document.querySelectorAll("#wh-preview-list .wh-preview-row");
  let added = 0;
  rows.forEach((row) => {
    const enRaw = row.querySelector(".wh-preview-en").value.trim();
    const vi = row.querySelector(".wh-preview-vi").value.trim();
    if (!enRaw || !vi) return;
    let en = enRaw;
    let enAlts = [];
    if (isWriting && enRaw.includes("|")) {
      const parts = enRaw.split("|").map((s) => s.trim()).filter(Boolean);
      en = parts[0] || enRaw;
      enAlts = parts.slice(1);
    }
    const item = { id: uid(), en, vi, status: "new" };
    if (enAlts.length) item.enAlts = enAlts;
    if (isDict) {
      const ipa = row.querySelector(".wh-preview-ipa").value.trim();
      const pos = row.querySelector(".wh-preview-pos").value.trim();
      if (ipa) item.ipa = ipa;
      if (pos) item.pos = pos;
    }
    list.items.push(item);
    added++;
  });
  saveState();
  whAddOverlay.classList.add("hidden");
  renderWarehouseTab();
  if (!added) showToast("Không có mục hợp lệ nào được thêm (thiếu Tiếng Anh hoặc Tiếng Việt).");
  else showToast(`Đã thêm ${added} mục.`);
});

/* ---- Kho > Nghe: thêm/sửa 1 bài (nhiều dòng hội thoại) ---- */
let whListeningPreviewLines = [];
let whListeningEditingId = null; // null = đang thêm bài mới, có id = đang sửa bài cũ

function whListeningShowInputView() {
  document.getElementById("wh-listening-add-preview-view").classList.add("hidden");
  document.getElementById("wh-listening-add-input-view").classList.remove("hidden");
  updateWhListeningTitleRow();
}
function whListeningShowPreviewView() {
  document.getElementById("wh-listening-add-input-view").classList.add("hidden");
  document.getElementById("wh-listening-add-preview-view").classList.remove("hidden");
  updateWhListeningTitleRow();
}
function renderWhListeningPreview() {
  const box = document.getElementById("wh-listening-preview-list");
  box.innerHTML = "";
  if (!whListeningPreviewLines.length) {
    box.innerHTML = `<div class="wh-preview-empty">Không có dòng nào để xem trước.</div>`;
    return;
  }
  whListeningPreviewLines.forEach((ln, idx) => {
    const row = document.createElement("div");
    row.className = "wh-preview-row nghe-preview-row";
    row.innerHTML = `<input class="wh-preview-speaker" value="${escapeHtml(ln.speaker)}" placeholder="Tên (bỏ trống nếu không có)">
       <textarea class="wh-preview-en">${escapeHtml(ln.text)}</textarea>
       <button class="wh-preview-remove" title="Bỏ dòng này">🗑</button>`;
    row.querySelector(".wh-preview-remove").addEventListener("click", () => {
      whListeningPreviewLines.splice(idx, 1);
      renderWhListeningPreview();
    });
    box.appendChild(row);
  });
}
document.getElementById("wh-listening-add-close").addEventListener("click", () => {
  document.getElementById("wh-listening-add-overlay").classList.add("hidden");
  whListeningEditingId = null;
});
document.getElementById("wh-listening-add-overlay").addEventListener("click", (e) => {
  if (e.target.id === "wh-listening-add-overlay") {
    document.getElementById("wh-listening-add-overlay").classList.add("hidden");
    whListeningEditingId = null;
  }
});
function updateWhListeningTitleRow() {
  const row = document.getElementById("wh-listening-item-title-row");
  const btn = document.getElementById("wh-listening-item-title-btn");
  if (!whListeningEditingId) { row.classList.add("hidden"); return; }
  const list = whActiveList();
  const item = list && list.items.find((i) => i.id === whListeningEditingId);
  if (!item) { row.classList.add("hidden"); return; }
  const idx = list.items.findIndex((i) => i.id === item.id);
  btn.textContent = item.title || ("Bài " + (idx + 1));
  row.classList.remove("hidden");
}
document.getElementById("wh-listening-item-title-btn").addEventListener("click", async () => {
  if (!whListeningEditingId) return;
  const list = whActiveList();
  const item = list && list.items.find((i) => i.id === whListeningEditingId);
  if (!item) return;
  const idx = list.items.findIndex((i) => i.id === item.id);
  const name = await showPrompt("Đổi tên bài nghe", item.title || ("Bài " + (idx + 1)));
  if (!name) return;
  item.title = name.trim();
  saveState();
  updateWhListeningTitleRow();
  renderWhListeningView();
  if (typeof renderNgheSidebar === "function") renderNgheSidebar();
  if (typeof renderNgheChat === "function") renderNgheChat();
});
document.getElementById("wh-listening-add-clear").addEventListener("click", () => {
  document.getElementById("wh-listening-add-textarea").value = "";
});
document.getElementById("wh-listening-add-confirm").addEventListener("click", () => {
  const raw = document.getElementById("wh-listening-add-textarea").value;
  if (!raw.trim()) { showToast("Chưa có nội dung để chuyển."); return; }
  whListeningPreviewLines = parseListeningBlob(raw);
  if (!whListeningPreviewLines.length) { showToast("Không nhận diện được dòng nào."); return; }
  renderWhListeningPreview();
  whListeningShowPreviewView();
});
document.getElementById("wh-listening-add-back").addEventListener("click", whListeningShowInputView);
document.getElementById("wh-listening-add-ok").addEventListener("click", () => {
  const list = whActiveList();
  if (!list) return;
  const rows = document.querySelectorAll("#wh-listening-preview-list .nghe-preview-row");
  const lines = [];
  rows.forEach((row) => {
    const speaker = row.querySelector(".wh-preview-speaker").value.trim();
    const text = row.querySelector(".wh-preview-en").value.trim();
    if (text) lines.push({ speaker, text });
  });
  if (!lines.length) { showToast("Không có câu hợp lệ nào để lưu."); return; }
  if (whListeningEditingId) {
    const item = list.items.find((i) => i.id === whListeningEditingId);
    if (item) item.lines = lines;
    whListeningEditingId = null;
  } else {
    list.items.push({ id: uid(), lines, status: "new", createdAt: Date.now() });
  }
  saveState();
  document.getElementById("wh-listening-add-overlay").classList.add("hidden");
  renderWhListeningView();
  showToast(`Đã lưu bài (${lines.length} câu).`);
});

function openWhListeningEdit(itemId) {
  const list = whActiveList();
  const item = list.items.find((i) => i.id === itemId);
  if (!item) return;
  whListeningEditingId = itemId;
  whListeningPreviewLines = item.lines.map((l) => ({ speaker: l.speaker, text: l.text }));
  document.getElementById("wh-listening-add-list-name").textContent = "— " + list.name;
  renderWhListeningPreview();
  whListeningShowPreviewView();
  document.getElementById("wh-listening-add-overlay").classList.remove("hidden");
}

function renderWhListeningView() {
  // Chỉ vẽ khi đang thực sự ở Kho > Nghe — chặn trường hợp có nơi khác gọi
  // nhầm hàm này lúc đang xem cat khác (vd Thống kê) khiến thẻ "Bài" bị chèn.
  if (wh.cat !== "listening") return;
  const list = whActiveList();
  const grid = document.getElementById("wh-listening-grid");
  grid.innerHTML = "";
  if (!list || !list.items.length) {
    grid.innerHTML = `<div class="wh-preview-empty">Chưa có bài nào — bấm "Thêm vào" để dán bài hội thoại đầu tiên.</div>`;
    return;
  }
  list.items.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "nghe-wh-card";
    const dotClass = item.status === "known" ? "dot-known" : item.status === "difficult" ? "dot-difficult" : "dot-learning";
    const title = item.title || ("Bài " + (idx + 1));
    card.innerHTML = `
      <div class="nghe-wh-card-head">
        <span class="dot ${dotClass}"></span>
        <span class="nghe-wh-card-title">${escapeHtml(title)} — ${item.lines.length} câu</span>
      </div>
      <div class="nghe-wh-card-actions">
        <button class="nghe-wh-card-delete" title="Xoá">🗑</button>
      </div>`;
    card.addEventListener("click", () => openWhListeningEdit(item.id));
    card.querySelector(".nghe-wh-card-delete").addEventListener("click", (e) => {
      e.stopPropagation();
      list.items.splice(list.items.findIndex((i) => i.id === item.id), 1);
      saveState();
      renderWhListeningView();
    });
    grid.appendChild(card);
  });
}

/* ---- Edit item modal ---- */
const whEditOverlay = document.getElementById("wh-edit-overlay");
let whEditItemId = null;

function whEditAddAltRow(value) {
  const list = document.getElementById("wh-edit-alts-list");
  const row = document.createElement("div");
  row.className = "wh-edit-alts-row";
  row.innerHTML = `<input type="text" class="text-input" placeholder="Đáp án khác (vd: She's someone I like)">
    <button type="button" title="Xoá đáp án này">✕</button>`;
  row.querySelector("input").value = value || "";
  row.querySelector("button").addEventListener("click", () => row.remove());
  list.appendChild(row);
}
document.getElementById("wh-edit-alts-add").addEventListener("click", () => whEditAddAltRow(""));

function openWhEdit(itemId) {
  const list = whActiveList();
  const item = list.items.find((i) => i.id === itemId);
  if (!item) return;
  whEditItemId = itemId;
  document.getElementById("wh-edit-en").value = item.en;
  document.getElementById("wh-edit-vi").value = item.vi;
  const altsSection = document.getElementById("wh-edit-alts-section");
  const altsList = document.getElementById("wh-edit-alts-list");
  altsList.innerHTML = "";
  if (wh.cat === "writing") {
    altsSection.classList.remove("hidden");
    (item.enAlts || []).forEach((alt) => whEditAddAltRow(alt));
  } else {
    altsSection.classList.add("hidden");
  }
  whEditOverlay.classList.remove("hidden");
}
document.getElementById("wh-edit-close").addEventListener("click", () => whEditOverlay.classList.add("hidden"));
whEditOverlay.addEventListener("click", (e) => { if (e.target === whEditOverlay) whEditOverlay.classList.add("hidden"); });
document.getElementById("wh-edit-save").addEventListener("click", () => {
  const list = whActiveList();
  const item = list.items.find((i) => i.id === whEditItemId);
  if (!item) return;
  item.en = document.getElementById("wh-edit-en").value.trim();
  item.vi = document.getElementById("wh-edit-vi").value.trim();
  if (wh.cat === "writing") {
    const alts = [...document.querySelectorAll("#wh-edit-alts-list input")]
      .map((inp) => inp.value.trim())
      .filter(Boolean);
    if (alts.length) item.enAlts = alts;
    else delete item.enAlts;
  }
  saveState();
  whEditOverlay.classList.add("hidden");
  renderWarehouseTab();
});

/* ---- Export / Import modal ---- */
const whExportOverlay = document.getElementById("wh-export-overlay");
document.getElementById("wh-export-open").addEventListener("click", () => whExportOverlay.classList.remove("hidden"));
document.getElementById("wh-export-close").addEventListener("click", () => whExportOverlay.classList.add("hidden"));
whExportOverlay.addEventListener("click", (e) => { if (e.target === whExportOverlay) whExportOverlay.classList.add("hidden"); });

function getExportScope() {
  return document.querySelector('input[name="wh-export-scope"]:checked').value;
}
function exportData() {
  const scope = getExportScope();
  if (scope === "current") {
    const list = whActiveList();
    return list ? [list] : [];
  }
  return getCategory(wh.cat);
}
function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
document.getElementById("wh-export-json").addEventListener("click", () => {
  download(`nox-${wh.cat}.json`, JSON.stringify(exportData(), null, 2), "application/json");
});
document.getElementById("wh-export-txt").addEventListener("click", () => {
  const lists = exportData();
  let txt = "";
  lists.forEach((l) => {
    txt += `# ${l.name}\n`;
    if (wh.cat === "listening") {
      l.items.forEach((it, idx) => {
        txt += `## Bài ${idx + 1}\n`;
        it.lines.forEach((ln) => (txt += ln.speaker ? `${ln.speaker}: ${ln.text}\n` : `${ln.text}\n`));
        txt += "\n";
      });
    } else {
      l.items.forEach((i) => (txt += `${i.en} - ${i.vi}\n`));
    }
    txt += "\n";
  });
  download(`nox-${wh.cat}.txt`, txt, "text/plain");
});
document.getElementById("wh-export-copy").addEventListener("click", () => {
  const lists = exportData();
  let txt = "";
  lists.forEach((l) => {
    txt += `# ${l.name}\n`;
    if (wh.cat === "listening") {
      l.items.forEach((it, idx) => {
        txt += `## Bài ${idx + 1}\n`;
        it.lines.forEach((ln) => (txt += ln.speaker ? `${ln.speaker}: ${ln.text}\n` : `${ln.text}\n`));
        txt += "\n";
      });
    } else {
      l.items.forEach((i) => (txt += `${i.en} - ${i.vi}\n`));
    }
    txt += "\n";
  });
  navigator.clipboard.writeText(txt).then(() => showToast("Đã sao chép vào clipboard!"));
});
document.getElementById("wh-import-btn").addEventListener("click", () => {
  document.getElementById("wh-import-file").click();
});

/* Parse a .txt file into blocks: a line starting with "#" starts a new
   named list; subsequent "en - vi" lines belong to that list. Lines that
   appear before any "#" header go into a null-name block (handled by
   falling back to the currently active list on import). */
function parseTxtIntoLists(text) {
  const lines = text.split("\n");
  const blocks = [];
  let current = null;
  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith("#")) {
      current = { name: line.replace(/^#+/, "").trim() || "Danh sách nhập", items: [] };
      blocks.push(current);
      return;
    }
    if (!current) {
      current = { name: null, items: [] };
      blocks.push(current);
    }
    const sep = line.includes("-->") ? "-->" : line.includes("\t") ? "\t" : "-";
    const idx = line.indexOf(sep);
    if (idx === -1) return;
    const en = line.slice(0, idx).trim();
    const vi = line.slice(idx + sep.length).trim();
    if (en && vi) current.items.push({ id: uid(), en, vi, status: "new" });
  });
  return blocks;
}

document.getElementById("wh-import-file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      let listsCreated = 0;
      if (file.name.endsWith(".json")) {
        const data = JSON.parse(reader.result);
        const lists = Array.isArray(data) ? data : [data];
        lists.forEach((l) => {
          const newList = defaultList(l.name || "Danh sách nhập");
          (l.items || []).forEach((i) => {
            if (wh.cat === "listening") {
              if (Array.isArray(i.lines) && i.lines.length) {
                newList.items.push({ id: uid(), lines: i.lines, status: "new", createdAt: Date.now() });
              }
            } else {
              newList.items.push({ id: uid(), en: i.en, vi: i.vi, status: "new" });
            }
          });
          getCategory(wh.cat).push(newList);
          state.activeWhList[wh.cat] = newList.id;
          listsCreated++;
        });
      } else if (wh.cat === "listening") {
        showToast('Nghe chỉ nhập được file .json (xuất từ chính Nox) — dán trực tiếp bằng nút "Thêm vào" cho file .txt.');
        e.target.value = "";
        return;
      } else {
        const blocks = parseTxtIntoLists(reader.result);
        blocks.forEach((block) => {
          if (!block.items.length) return;
          let targetList;
          if (block.name) {
            // "#Tên" header -> create (or reuse) a list with that exact name
            targetList = getCategory(wh.cat).find((l) => l.name === block.name);
            if (!targetList) {
              targetList = defaultList(block.name);
              getCategory(wh.cat).push(targetList);
              listsCreated++;
            }
          } else {
            // no header before these lines -> fall back to the active list
            targetList = whActiveList();
            if (!targetList) {
              targetList = defaultList("Danh sách nhập");
              getCategory(wh.cat).push(targetList);
              listsCreated++;
            }
          }
          targetList.items.push(...block.items);
          state.activeWhList[wh.cat] = targetList.id;
        });
      }
      saveState();
      renderWarehouseTab();
      whExportOverlay.classList.add("hidden");
      showToast(listsCreated > 0 ? `Nhập file thành công! Đã tạo ${listsCreated} danh sách mới.` : "Nhập file thành công!");
    } catch (err) {
      showToast("Không đọc được file: " + err.message);
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

/* ============================================================
   NHẮC TỪ (REMINDER) — bottom-left popup with random word every 5s,
   sourced from Thẻ/Từ điển lists individually toggled on
   ============================================================ */
const reminder = { timerHandle: null, hideTimeout: null, queue: [], lastShown: null, currentUtterance: null, cyclesCompleted: 0 };

function reminderEligibleItems() {
  let items = [];
  ["flashcard", "dictionary"].forEach((cat) => {
    getCategory(cat).forEach((list) => {
      if (!list.reminderEnabled) return;
      list.items.forEach((item) => {
        if (item.en && item.vi) items.push({ ...item, _catLabel: whCatLabel(cat), _listName: list.name });
      });
    });
  });
  return items;
}

function reminderRefillQueue(countCycle) {
  const pool = reminderEligibleItems();
  let shuffled = shuffleArr(pool);
  // avoid an immediate repeat right across a cycle boundary
  if (shuffled.length > 1 && reminder.lastShown && shuffled[0].id === reminder.lastShown.id) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  reminder.queue = shuffled;
  // countCycle = true nghĩa là lần refill này xảy ra vì hàng đợi đã hết —
  // tức vừa đọc xong một lượt tất cả các danh sách đang bật nhắc từ = 1 chu kỳ
  if (countCycle) reminder.cyclesCompleted = (reminder.cyclesCompleted || 0) + 1;
}
function reminderCycleAutoOffReached() {
  const autoOff = state.reminder.autoOff;
  return !!(
    autoOff && autoOff.enabled && autoOff.mode === "cycles" &&
    (reminder.cyclesCompleted || 0) >= Math.max(1, Math.min(10, autoOff.cycles || 1))
  );
}

function reminderRepeatCount() {
  const n = state.settings && typeof state.settings.reminderMaxReads === "number" ? state.settings.reminderMaxReads : 2;
  return Math.max(1, Math.min(10, n));
}

function showNextReminder() {
  if (!reminder.queue.length) {
    reminderRefillQueue(true);
    if (reminderCycleAutoOffReached()) {
      setReminderEnabled(false);
      showToast("Đã tự động tắt thông báo nhắc từ (đủ số chu kỳ đã đặt).");
      return;
    }
  }
  if (!reminder.queue.length) return; // nothing enabled/eligible — stay silent
  const item = reminder.queue.shift();
  reminder.lastShown = item;

  const popup = document.getElementById("reminder-popup");
  document.getElementById("reminder-popup-source").textContent = `${item._catLabel} — ${item._listName}`;
  document.getElementById("reminder-popup-en").textContent = item.en;
  document.getElementById("reminder-popup-vi").textContent = item.vi;

  popup.classList.remove("hidden");

  const minDisplaySec = state.settings && typeof state.settings.reminderMinDisplay === "number" ? state.settings.reminderMinDisplay : 10;
  const MIN_DISPLAY_MS = Math.max(5, Math.min(60, minDisplaySec)) * 1000;

  // restart the CSS countdown-bar animation (thời lượng theo cài đặt)
  const bar = document.getElementById("reminder-popup-bar-fill");
  bar.style.animation = "none";
  void bar.offsetWidth;
  bar.style.animation = "";
  bar.style.animationDuration = (MIN_DISPLAY_MS / 1000) + "s";

  let minTimerDone = false;
  let readDone = !state.reminder.autoRead; // nếu không bật đọc tự động thì coi như đã xong ngay
  let notifyFired = false;
  function fireNotifyOnce() {
    if (notifyFired) return;
    notifyFired = true;
    fireReminderDesktopNotification(item);
    fireReminderMobileNotification(item);
  }

  function tryAdvance() {
    if (!minTimerDone || !readDone) return;
    if (reminder.timerHandle !== "running") return;
    popup.classList.add("hidden");
    showNextReminder();
  }

  clearTimeout(reminder.hideTimeout);
  reminder.hideTimeout = setTimeout(() => {
    minTimerDone = true;
    tryAdvance();
  }, MIN_DISPLAY_MS);

  if (state.reminder.autoRead) {
    speechSynthesis.cancel();
    const READ_GAP_MS = 450;
    let readsLeft = reminderRepeatCount();

    function readOnce() {
      if (reminder.timerHandle !== "running") return;
      const utterance = playAudio(item.en);
      reminder.currentUtterance = utterance;
      if (!utterance) {
        fireNotifyOnce();
        readDone = true;
        tryAdvance();
        return;
      }
      utterance.onend = () => {
        fireNotifyOnce(); // hiện thông báo ngay sau lần đọc đầu tiên
        readsLeft--;
        if (readsLeft > 0 && reminder.timerHandle === "running") {
          setTimeout(readOnce, READ_GAP_MS);
        } else {
          readDone = true;
          tryAdvance();
        }
      };
      utterance.onerror = () => {
        fireNotifyOnce();
        readDone = true;
        tryAdvance();
      };
    }
    readOnce();
  } else {
    fireNotifyOnce(); // không bật đọc tự động — hiện thông báo ngay
  }
}

function startReminderCycle() {
  stopReminderCycle();
  reminder.cyclesCompleted = 0;
  reminderRefillQueue();
  reminder.timerHandle = "running";
  showNextReminder();
}
function stopReminderCycle() {
  clearTimeout(reminder.hideTimeout);
  speechSynthesis.cancel();
  reminder.timerHandle = null;
  document.getElementById("reminder-popup").classList.add("hidden");
}
document.getElementById("reminder-popup-close").addEventListener("click", () => {
  document.getElementById("reminder-popup").classList.add("hidden");
  clearTimeout(reminder.hideTimeout);
  speechSynthesis.cancel();
  if (reminder.timerHandle === "running") showNextReminder();
});
document.getElementById("wh-reminder-toggle").addEventListener("click", toggleGlobalReminder);
document.getElementById("wh-reminder-read-toggle").addEventListener("click", () => {
  state.reminder.autoRead = !state.reminder.autoRead;
  saveState();
  document.getElementById("wh-reminder-read-toggle").classList.toggle("active", state.reminder.autoRead);
});

/* ============================================================
   NHẬT KÝ (DIARY) — quick popup rich-text editor
   ============================================================ */
let diaryCurrentListId = null;
let diaryAutosaveHandle = null;

function diaryActiveList() {
  const lists = getCategory("diary");
  let activeId = state.activeWhList.diary;
  if (!activeId || !lists.find((l) => l.id === activeId)) {
    activeId = lists[0] ? lists[0].id : null;
    state.activeWhList.diary = activeId;
  }
  return lists.find((l) => l.id === activeId) || null;
}

function renderDiaryNoteSelect() {
  const select = document.getElementById("dy-note-select");
  select.innerHTML = "";
  getCategory("diary").forEach((l) => {
    const opt = document.createElement("option");
    opt.value = l.id;
    opt.textContent = l.name;
    if (l.id === diaryCurrentListId) opt.selected = true;
    select.appendChild(opt);
  });
}

function openDiaryPopup(listId) {
  let target = listId ? getCategory("diary").find((l) => l.id === listId) : diaryActiveList();
  if (!target) {
    target = defaultDiaryList("Nhật ký 1");
    getCategory("diary").push(target);
  }
  diaryCurrentListId = target.id;
  state.activeWhList.diary = target.id;
  saveState();

  const content = document.getElementById("dy-content");
  content.innerHTML = target.content || "";
  content.contentEditable = "true";
  document.getElementById("dy-mode-btn").classList.remove("active-state");
  closeAllDiaryDropdowns();
  renderDiaryNoteSelect();
  document.getElementById("diary-popup-overlay").classList.remove("hidden");
  setTimeout(() => content.focus(), 60);
}

function saveDiaryContent() {
  if (!diaryCurrentListId) return;
  const list = getCategory("diary").find((l) => l.id === diaryCurrentListId);
  if (!list) return;
  cleanupEmptyFloatBoxes();
  list.content = document.getElementById("dy-content").innerHTML;
  saveState();
}

function closeDiaryPopup() {
  saveDiaryContent();
  closeAllDiaryDropdowns();
  document.getElementById("diary-popup-overlay").classList.add("hidden");
  const whTab = document.querySelector('.tab-content[data-content="warehouse"]');
  if (whTab && !whTab.classList.contains("hidden") && wh.cat === "diary") {
    renderWarehouseTab();
  }
}

function scheduleDiaryAutosave() {
  clearTimeout(diaryAutosaveHandle);
  diaryAutosaveHandle = setTimeout(saveDiaryContent, 800);
}

document.getElementById("diary-quick-open").addEventListener("click", () => openDiaryPopup());

/* ============================================================
   CÀI ĐẶT (SETTINGS POPUP)
   ============================================================ */
function updateSettingsSyncUI() {
  const connectRow = document.getElementById("settings-sync-connect-row");
  const disconnectBtn = document.getElementById("settings-sync-disconnect");
  if (syncEnabled) {
    connectRow.classList.add("hidden");
    disconnectBtn.classList.remove("hidden");
  } else {
    connectRow.classList.remove("hidden");
    disconnectBtn.classList.add("hidden");
  }
}

document.getElementById("settings-open").addEventListener("click", () => {
  updateSettingsSyncUI();
  document.getElementById("settings-sync-code-input").value = syncCode || "";
  document.getElementById("settings-overlay").classList.remove("hidden");
});
document.getElementById("settings-close").addEventListener("click", () => {
  document.getElementById("settings-overlay").classList.add("hidden");
});
document.getElementById("settings-overlay").addEventListener("click", (e) => {
  if (e.target.id === "settings-overlay") document.getElementById("settings-overlay").classList.add("hidden");
});

const MIN_SYNC_CODE_LEN = 8;
function generateRandomSyncCode(len = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"; // bỏ ký tự dễ nhầm (0/O, 1/l/I)
  let out = "";
  if (window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint32Array(len);
    window.crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
  } else {
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
document.getElementById("settings-sync-generate").addEventListener("click", () => {
  const code = generateRandomSyncCode();
  document.getElementById("settings-sync-code-input").value = code;
  showToast("Đã tạo mã mới — nhớ lưu lại mã này rồi bấm Kết nối.");
});
document.getElementById("settings-sync-connect").addEventListener("click", () => {
  const input = document.getElementById("settings-sync-code-input");
  const code = input.value.trim();
  if (!code) {
    showToast("Nhập mã đồng bộ trước đã.");
    return;
  }
  if (code.length < MIN_SYNC_CODE_LEN) {
    showToast(`Mã đồng bộ cần ít nhất ${MIN_SYNC_CODE_LEN} ký tự để an toàn. Bấm "🎲 Tạo mã ngẫu nhiên" cho nhanh.`);
    return;
  }
  connectSync(code);
  showToast("Đang bật đồng bộ...");
  setTimeout(updateSettingsSyncUI, 300);
});
document.getElementById("settings-sync-disconnect").addEventListener("click", async () => {
  const ok = await showConfirm(`Đang đồng bộ với mã "${syncCode}". Ngắt kết nối trên thiết bị này?`);
  if (ok) {
    disconnectSync();
    showToast("Đã ngắt đồng bộ.");
    updateSettingsSyncUI();
  }
});

/* ============================================================
   ĐỔI DATABASE (chuyển sang project Firebase khác — ví dụ chuyển acc)
   ============================================================ */
function updateDbConfigUI() {
  const input = document.getElementById("settings-db-config-input");
  const hint = document.getElementById("db-config-status-hint");
  const custom = getCustomFirebaseConfig();
  input.value = custom ? JSON.stringify(custom, null, 2) : "";
  hint.textContent = custom
    ? `Đang dùng database tuỳ chỉnh (project: ${custom.projectId || "?"}).`
    : "Đang dùng database mặc định của Nox.";
}

document.getElementById("db-config-open-btn").addEventListener("click", () => {
  document.getElementById("settings-overlay").classList.add("hidden");
  updateDbConfigUI();
  document.getElementById("db-config-overlay").classList.remove("hidden");
});
function closeDbConfigOverlay() {
  document.getElementById("db-config-overlay").classList.add("hidden");
  document.getElementById("settings-overlay").classList.remove("hidden");
}
document.getElementById("db-config-close").addEventListener("click", closeDbConfigOverlay);
document.getElementById("db-config-overlay").addEventListener("click", (e) => {
  if (e.target.id === "db-config-overlay") closeDbConfigOverlay();
});

document.getElementById("db-config-apply").addEventListener("click", async () => {
  const input = document.getElementById("settings-db-config-input");
  const raw = input.value.trim();
  if (!raw) {
    showToast("Dán config Firebase (dạng JSON) vào ô trước đã.");
    return;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    showToast("Config không đúng định dạng JSON.");
    return;
  }
  if (!parsed || !parsed.databaseURL || !parsed.apiKey) {
    showToast("Config thiếu apiKey hoặc databaseURL.");
    return;
  }
  const ok = await showConfirm("Đổi sang database mới? Đồng bộ hiện tại (nếu có) sẽ bị ngắt, và ứng dụng sẽ dùng database này cho lần đồng bộ tiếp theo. Dữ liệu đang lưu trên máy sẽ không bị mất.");
  if (!ok) return;
  disconnectSync();
  localStorage.setItem(CUSTOM_FIREBASE_CONFIG_KEY, JSON.stringify(parsed));
  await reinitFirebaseApp();
  updateSettingsSyncUI();
  updateDbConfigUI();
  showToast("Đã đổi database. Nhập mã đồng bộ ở trên để kết nối lại.");
});

document.getElementById("db-config-reset").addEventListener("click", async () => {
  if (!getCustomFirebaseConfig()) {
    showToast("Đang dùng database mặc định rồi.");
    return;
  }
  const ok = await showConfirm("Quay lại dùng database mặc định của Nox?");
  if (!ok) return;
  disconnectSync();
  localStorage.removeItem(CUSTOM_FIREBASE_CONFIG_KEY);
  await reinitFirebaseApp();
  updateSettingsSyncUI();
  updateDbConfigUI();
  showToast("Đã quay lại database mặc định.");
});

document.getElementById("db-config-help-btn").addEventListener("click", () => {
  document.getElementById("db-config-help-overlay").classList.remove("hidden");
});
document.getElementById("db-config-help-close").addEventListener("click", () => {
  document.getElementById("db-config-help-overlay").classList.add("hidden");
});
document.getElementById("db-config-help-overlay").addEventListener("click", (e) => {
  if (e.target.id === "db-config-help-overlay") document.getElementById("db-config-help-overlay").classList.add("hidden");
});

document.getElementById("settings-sfx-enabled").addEventListener("change", (e) => {
  state.settings.sfxEnabled = e.target.checked;
  saveState();
  if (state.settings.sfxEnabled) playClickSound();
});
document.getElementById("settings-sfx-volume").addEventListener("input", (e) => {
  state.settings.sfxVolume = parseInt(e.target.value, 10);
  document.getElementById("settings-sfx-volume-val").textContent = state.settings.sfxVolume + "%";
  saveState();
});
document.getElementById("settings-sfx-volume").addEventListener("change", () => playClickSound());
document.getElementById("settings-flip-volume").addEventListener("input", (e) => {
  state.settings.flipVolume = parseInt(e.target.value, 10);
  document.getElementById("settings-flip-volume-val").textContent = state.settings.flipVolume + "%";
  saveState();
});
document.getElementById("settings-flip-volume").addEventListener("change", () => playFlipSound());
document.getElementById("settings-tts-volume").addEventListener("input", (e) => {
  state.settings.ttsVolume = parseInt(e.target.value, 10);
  document.getElementById("settings-tts-volume-val").textContent = state.settings.ttsVolume + "%";
  saveState();
});
document.getElementById("settings-sfx-enabled").checked = state.settings.sfxEnabled;
document.getElementById("settings-sfx-volume").value = state.settings.sfxVolume;
document.getElementById("settings-sfx-volume-val").textContent = state.settings.sfxVolume + "%";
document.getElementById("settings-flip-volume").value = state.settings.flipVolume;
document.getElementById("settings-flip-volume-val").textContent = state.settings.flipVolume + "%";
document.getElementById("settings-tts-volume").value = state.settings.ttsVolume;
document.getElementById("settings-tts-volume-val").textContent = state.settings.ttsVolume + "%";

/* ---- Thanh dịch nhanh: xoá khi bấm ra rồi vào lại + tự nhận diện ngôn ngữ ---- */
document.getElementById("settings-qt-clear-refocus").addEventListener("change", (e) => {
  state.settings.qtClearOnRefocus = e.target.checked;
  saveState();
});
document.getElementById("settings-qt-autodetect").addEventListener("change", (e) => {
  state.settings.qtAutoDetectLang = e.target.checked;
  saveState();
});
document.getElementById("settings-qt-clear-refocus").checked = !!state.settings.qtClearOnRefocus;
document.getElementById("settings-qt-autodetect").checked = !!state.settings.qtAutoDetectLang;

/* ---- Ẩn/hiện tính năng Nhật ký ---- */
function applyDiaryVisibility() {
  const show = !!state.settings.showDiary;
  const catBtn = document.getElementById("wh-cat-diary-btn");
  const quickBtn = document.getElementById("diary-quick-open");
  if (catBtn) catBtn.classList.toggle("hidden", !show);
  if (quickBtn) quickBtn.classList.toggle("hidden", !show);
  if (!show && wh.cat === "diary") {
    wh.cat = "flashcard";
    document.querySelectorAll(".wh-cat-btn").forEach((b) => b.classList.toggle("active", b.dataset.whCat === "flashcard"));
    renderWarehouseTab();
  }
}
document.getElementById("settings-show-diary").addEventListener("change", (e) => {
  state.settings.showDiary = e.target.checked;
  saveState();
  applyDiaryVisibility();
});
document.getElementById("settings-show-diary").checked = !!state.settings.showDiary;
applyDiaryVisibility();

/* ---- Cài đặt Hệ số (đà học tập) ---- */
document.getElementById("settings-momentum-system-notify").addEventListener("change", (e) => {
  if (e.target.checked) {
    if (!("Notification" in window)) {
      showToast("Trình duyệt này không hỗ trợ thông báo hệ thống.");
      e.target.checked = false;
      return;
    }
    Notification.requestPermission().then((perm) => {
      if (perm !== "granted") {
        showToast("Chưa được cấp quyền thông báo — hãy cho phép trong cài đặt trình duyệt nếu muốn dùng tính năng này.");
        e.target.checked = false;
        state.settings.momentumSystemNotify = false;
        saveState();
      } else {
        state.settings.momentumSystemNotify = true;
        saveState();
      }
    });
  } else {
    state.settings.momentumSystemNotify = false;
    saveState();
  }
});
document.getElementById("settings-momentum-system-notify").checked = !!state.settings.momentumSystemNotify;

document.getElementById("settings-momentum-quickview").addEventListener("change", (e) => {
  state.settings.momentumQuickview = e.target.checked;
  saveState();
  updateBrandMomentumQuickview();
});
document.getElementById("settings-momentum-quickview").checked = !!state.settings.momentumQuickview;

document.getElementById("settings-momentum-theme-sync").addEventListener("change", (e) => {
  state.settings.momentumThemeSync = e.target.checked;
  saveState();
  applyMomentumThemeSync();
});
document.getElementById("settings-momentum-theme-sync").checked = !!state.settings.momentumThemeSync;

/* ---- Hệ số: thời gian ngưỡng ngắt quãng (1-30 phút, mặc định 3) ---- */
const momentumIdleSlider = document.getElementById("settings-momentum-idle-minutes");
momentumIdleSlider.value = state.settings.momentumIdleMinutes;
document.getElementById("settings-momentum-idle-minutes-val").textContent = state.settings.momentumIdleMinutes + "p";
momentumIdleSlider.addEventListener("input", (e) => {
  state.settings.momentumIdleMinutes = parseInt(e.target.value, 10);
  document.getElementById("settings-momentum-idle-minutes-val").textContent = state.settings.momentumIdleMinutes + "p";
  saveState();
  scheduleStudyIdleWarning();
});

updateBrandMomentumQuickview();
applyMomentumThemeSync();
scheduleStudyIdleWarning();

/* ---- Nhắc từ: thời gian hiện tối thiểu + số lần đọc tối đa ---- */
const reminderMinDisplaySlider = document.getElementById("settings-reminder-min-display");
const reminderMaxReadsSlider = document.getElementById("settings-reminder-max-reads");
reminderMinDisplaySlider.value = state.settings.reminderMinDisplay;
document.getElementById("settings-reminder-min-display-val").textContent = state.settings.reminderMinDisplay + "s";
reminderMaxReadsSlider.value = state.settings.reminderMaxReads;
document.getElementById("settings-reminder-max-reads-val").textContent = state.settings.reminderMaxReads + " lần";
reminderMinDisplaySlider.addEventListener("input", (e) => {
  state.settings.reminderMinDisplay = parseInt(e.target.value, 10);
  document.getElementById("settings-reminder-min-display-val").textContent = state.settings.reminderMinDisplay + "s";
  saveState();
});
reminderMaxReadsSlider.addEventListener("input", (e) => {
  state.settings.reminderMaxReads = parseInt(e.target.value, 10);
  document.getElementById("settings-reminder-max-reads-val").textContent = state.settings.reminderMaxReads + " lần";
  saveState();
});

/* ---- Tự động tắt thông báo nhắc từ (theo chu kỳ / theo thời gian) ---- */
(function setupReminderAutoOff() {
  const cfg = state.reminder.autoOff;
  const checkbox = document.getElementById("settings-reminder-autooff");
  const box = document.getElementById("settings-reminder-autooff-options");
  const modeBtns = document.querySelectorAll("[data-autooff-mode]");
  const cyclesRow = document.getElementById("settings-reminder-autooff-cycles-row");
  const minutesRow = document.getElementById("settings-reminder-autooff-minutes-row");
  const cyclesSlider = document.getElementById("settings-reminder-autooff-cycles");
  const minutesSlider = document.getElementById("settings-reminder-autooff-minutes");

  checkbox.checked = cfg.enabled;
  box.classList.toggle("hidden", !cfg.enabled);
  modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.autooffMode === cfg.mode));
  cyclesRow.classList.toggle("hidden", cfg.mode !== "cycles");
  minutesRow.classList.toggle("hidden", cfg.mode !== "time");
  cyclesSlider.value = cfg.cycles;
  minutesSlider.value = cfg.minutes;
  document.getElementById("settings-reminder-autooff-cycles-val").textContent = cfg.cycles;
  document.getElementById("settings-reminder-autooff-minutes-val").textContent = cfg.minutes;

  checkbox.addEventListener("change", () => {
    cfg.enabled = checkbox.checked;
    box.classList.toggle("hidden", !cfg.enabled);
    saveState();
    if (state.reminder.enabled) scheduleReminderAutoOff();
  });
  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      cfg.mode = btn.dataset.autooffMode;
      cyclesRow.classList.toggle("hidden", cfg.mode !== "cycles");
      minutesRow.classList.toggle("hidden", cfg.mode !== "time");
      saveState();
      if (state.reminder.enabled) scheduleReminderAutoOff();
    });
  });
  cyclesSlider.addEventListener("input", (e) => {
    cfg.cycles = parseInt(e.target.value, 10);
    document.getElementById("settings-reminder-autooff-cycles-val").textContent = cfg.cycles;
    saveState();
  });
  minutesSlider.addEventListener("input", (e) => {
    cfg.minutes = parseInt(e.target.value, 10);
    document.getElementById("settings-reminder-autooff-minutes-val").textContent = cfg.minutes;
    saveState();
    if (state.reminder.enabled) scheduleReminderAutoOff();
  });
})();

/* ---- Tự động bật lại thông báo nhắc từ (đếm ngược / giờ thực) ---- */
(function setupReminderAutoOn() {
  const cfg = state.reminder.autoOn;
  const checkbox = document.getElementById("settings-reminder-autoon");
  const box = document.getElementById("settings-reminder-autoon-options");
  const modeBtns = document.querySelectorAll("[data-autoon-mode]");
  const minutesRow = document.getElementById("settings-reminder-autoon-minutes-row");
  const clockRow = document.getElementById("settings-reminder-autoon-clock-row");
  const minutesSlider = document.getElementById("settings-reminder-autoon-minutes");
  const clockInput = document.getElementById("settings-reminder-autoon-clock");

  checkbox.checked = cfg.enabled;
  box.classList.toggle("hidden", !cfg.enabled);
  modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.autoonMode === cfg.mode));
  minutesRow.classList.toggle("hidden", cfg.mode !== "countdown");
  clockRow.classList.toggle("hidden", cfg.mode !== "clock");
  minutesSlider.value = cfg.minutes;
  clockInput.value = cfg.clock;
  document.getElementById("settings-reminder-autoon-minutes-val").textContent = cfg.minutes;

  checkbox.addEventListener("change", () => {
    cfg.enabled = checkbox.checked;
    box.classList.toggle("hidden", !cfg.enabled);
    saveState();
    if (!state.reminder.enabled) scheduleReminderAutoOn();
    else clearReminderAutoOnTimer();
  });
  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      cfg.mode = btn.dataset.autoonMode;
      minutesRow.classList.toggle("hidden", cfg.mode !== "countdown");
      clockRow.classList.toggle("hidden", cfg.mode !== "clock");
      saveState();
      if (!state.reminder.enabled) scheduleReminderAutoOn();
    });
  });
  minutesSlider.addEventListener("input", (e) => {
    cfg.minutes = parseInt(e.target.value, 10);
    document.getElementById("settings-reminder-autoon-minutes-val").textContent = cfg.minutes;
    saveState();
    if (!state.reminder.enabled) scheduleReminderAutoOn();
  });
  clockInput.addEventListener("change", () => {
    cfg.clock = clockInput.value || "17:00";
    saveState();
    if (!state.reminder.enabled) scheduleReminderAutoOn();
  });
})();

/* ---- Thẻ: thời gian Auto play ---- */
const fcFlipDurationSlider = document.getElementById("settings-fc-flip-duration");
fcFlipDurationSlider.value = state.settings.fcFlipDuration;
document.getElementById("settings-fc-flip-duration-val").textContent = state.settings.fcFlipDuration + "s";
fcFlipDurationSlider.addEventListener("input", (e) => {
  state.settings.fcFlipDuration = parseInt(e.target.value, 10);
  document.getElementById("settings-fc-flip-duration-val").textContent = state.settings.fcFlipDuration + "s";
  saveState();
});

/* ---- Desktop Notifications cho popup nhắc từ ---- */
function updateNotifyHint() {
  const hint = document.getElementById("settings-notify-hint");
  if (!("Notification" in window)) {
    hint.textContent = "Trình duyệt này không hỗ trợ Desktop Notification.";
    return;
  }
  if (Notification.permission === "denied") {
    hint.textContent = "Bạn đã chặn quyền thông báo — vào cài đặt trình duyệt để bật lại.";
  } else if (Notification.permission === "granted") {
    hint.textContent = "Đã cấp quyền — thông báo sẽ nổi lên ngay cả khi bạn ở tab/app khác.";
  } else {
    hint.textContent = "Cần cấp quyền thông báo của trình duyệt khi bật.";
  }
}
const desktopNotifyCheckbox = document.getElementById("settings-desktop-notify");
desktopNotifyCheckbox.checked = state.reminder.desktopNotify;
updateNotifyHint();
desktopNotifyCheckbox.addEventListener("change", async () => {
  if (desktopNotifyCheckbox.checked) {
    if (!("Notification" in window)) {
      showToast("Trình duyệt không hỗ trợ Desktop Notification.");
      desktopNotifyCheckbox.checked = false;
      return;
    }
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    if (perm !== "granted") {
      showToast("Bạn chưa cấp quyền thông báo.");
      desktopNotifyCheckbox.checked = false;
      updateNotifyHint();
      return;
    }
    state.reminder.desktopNotify = true;
    showToast("Đã bật Desktop Notification cho nhắc từ.");
  } else {
    state.reminder.desktopNotify = false;
  }
  saveState();
  updateNotifyHint();
});

/* ---- Thông báo trên điện thoại (chỉ còn bong bóng chat) ---- */
const mobileNotifyCheckbox = document.getElementById("settings-mobile-notify");
mobileNotifyCheckbox.checked = state.reminder.mobileNotify.enabled;
mobileNotifyCheckbox.addEventListener("change", () => {
  state.reminder.mobileNotify.enabled = mobileNotifyCheckbox.checked;
  saveState();
  if (mobileNotifyCheckbox.checked) showToast("Đã bật bong bóng chat nhắc từ.");
});

/* ---- Chạy nền (best-effort) ----
   Web/PWA không có quyền chạy nền vô hạn hay vẽ đè app khác — khi tab bị
   trình duyệt treo (tắt màn hình lâu / rời app lâu), lịch chạy nền sẽ dừng.
   Kênh duy nhất thật sự "vọng" ra ngoài khi bạn đang ở app khác là System
   Notification, nên tính năng này sẽ xin quyền đó khi bật. */
const bgRunCheckbox = document.getElementById("settings-background-run");
const bgOptionsBox = document.getElementById("settings-bg-options");
const bgCyclesSlider = document.getElementById("settings-bg-cycles");
const bgIntervalSlider = document.getElementById("settings-bg-interval");

bgRunCheckbox.checked = state.reminder.background.enabled;
bgOptionsBox.classList.toggle("hidden", !state.reminder.background.enabled);
bgCyclesSlider.value = state.reminder.background.cycles;
bgIntervalSlider.value = state.reminder.background.intervalMin;
document.getElementById("settings-bg-cycles-val").textContent = state.reminder.background.cycles;
document.getElementById("settings-bg-interval-val").textContent = state.reminder.background.intervalMin;

bgCyclesSlider.addEventListener("input", (e) => {
  state.reminder.background.cycles = parseInt(e.target.value, 10);
  document.getElementById("settings-bg-cycles-val").textContent = state.reminder.background.cycles;
  saveState();
});
bgIntervalSlider.addEventListener("input", (e) => {
  state.reminder.background.intervalMin = parseInt(e.target.value, 10);
  document.getElementById("settings-bg-interval-val").textContent = state.reminder.background.intervalMin;
  saveState();
});

bgRunCheckbox.addEventListener("change", async () => {
  if (bgRunCheckbox.checked) {
    if (!("Notification" in window)) {
      showToast("Trình duyệt không hỗ trợ — không thể chạy nền.");
      bgRunCheckbox.checked = false;
      return;
    }
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    if (perm !== "granted") {
      showToast("Cần cấp quyền thông báo để chạy nền hoạt động khi bạn rời app.");
      bgRunCheckbox.checked = false;
      return;
    }
    state.reminder.background.enabled = true;
    bgOptionsBox.classList.remove("hidden");
    showToast("Đã bật chạy nền (thử nghiệm).");
  } else {
    state.reminder.background.enabled = false;
    bgOptionsBox.classList.add("hidden");
    stopBackgroundRun();
  }
  saveState();
});

let bgRunTimer = null;
let bgRunCyclesLeft = 0;
function stopBackgroundRun() {
  clearTimeout(bgRunTimer);
  bgRunTimer = null;
  bgRunCyclesLeft = 0;
}
function scheduleBackgroundCycle() {
  clearTimeout(bgRunTimer);
  if (!state.reminder.background.enabled || !state.reminder.enabled) return;
  if (bgRunCyclesLeft <= 0) {
    // hết số chu kỳ đã đặt — tự động tắt chạy nền
    state.reminder.background.enabled = false;
    saveState();
    bgRunCheckbox.checked = false;
    bgOptionsBox.classList.add("hidden");
    return;
  }
  const intervalMs = Math.max(1, state.reminder.background.intervalMin) * 60 * 1000;
  bgRunTimer = setTimeout(() => {
    if (document.visibilityState === "hidden") {
      const pool = reminderEligibleItems();
      if (pool.length) {
        const item = pool[Math.floor(Math.random() * pool.length)];
        fireReminderDesktopNotification(item, true);
      }
    }
    bgRunCyclesLeft--;
    scheduleBackgroundCycle();
  }, intervalMs);
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    if (state.reminder.background.enabled && state.reminder.enabled) {
      bgRunCyclesLeft = state.reminder.background.cycles;
      scheduleBackgroundCycle();
    }
  } else {
    stopBackgroundRun();
  }
});

/* ---- Kéo thả vị trí bong bóng chat ---- */
(function setupChatBubbleDrag() {
  const bubble = document.getElementById("chat-bubble-notify");
  let dragging = false, moved = false, offX = 0, offY = 0;

  function applyPos(x, y) {
    const maxX = window.innerWidth - bubble.offsetWidth - 8;
    const maxY = window.innerHeight - bubble.offsetHeight - 8;
    x = Math.min(Math.max(8, x), Math.max(8, maxX));
    y = Math.min(Math.max(8, y), Math.max(8, maxY));
    bubble.style.left = x + "px";
    bubble.style.top = y + "px";
    bubble.style.right = "auto";
    bubble.style.bottom = "auto";
  }
  if (state.bubblePos) applyPos(state.bubblePos.x, state.bubblePos.y);

  function start(clientX, clientY) {
    dragging = true;
    moved = false;
    bubble.classList.add("dragging");
    const rect = bubble.getBoundingClientRect();
    offX = clientX - rect.left;
    offY = clientY - rect.top;
  }
  function move(clientX, clientY) {
    if (!dragging) return;
    moved = true;
    applyPos(clientX - offX, clientY - offY);
  }
  function end() {
    if (!dragging) return;
    dragging = false;
    bubble.classList.remove("dragging");
    if (moved) {
      const rect = bubble.getBoundingClientRect();
      state.bubblePos = { x: rect.left, y: rect.top };
      saveState();
    }
  }

  bubble.addEventListener("mousedown", (e) => { start(e.clientX, e.clientY); e.preventDefault(); });
  window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
  window.addEventListener("mouseup", end);

  bubble.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    start(t.clientX, t.clientY);
  }, { passive: true });
  bubble.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    move(t.clientX, t.clientY);
  }, { passive: true });
  bubble.addEventListener("touchend", end);

  bubble.addEventListener("click", () => {
    if (moved) { moved = false; return; } // vừa kéo xong thì không đóng
    bubble.classList.add("hidden");
    clearTimeout(chatBubbleHideTimeout);
  });
})();

function fireReminderDesktopNotification(item, force) {
  if (!force && !state.reminder.desktopNotify) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  // chỉ nổi lên khi tab Nox không phải đang focus, tránh trùng lặp với popup trong app
  if (document.visibilityState === "visible" && document.hasFocus()) return;
  try {
    const n = new Notification(`🔔 ${item.en}`, {
      body: item.vi,
      tag: "nox-reminder",
      icon: "icon-192.png",
      silent: false,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch (e) {
    /* ignore */
  }
}

let chatBubbleHideTimeout = null;
function showChatBubbleNotification(item) {
  const bubble = document.getElementById("chat-bubble-notify");
  document.getElementById("chat-bubble-en").textContent = item.en;
  document.getElementById("chat-bubble-vi").textContent = item.vi;
  bubble.classList.remove("hidden");
  bubble.style.animation = "none";
  void bubble.offsetWidth;
  bubble.style.animation = "";
  clearTimeout(chatBubbleHideTimeout);
  chatBubbleHideTimeout = setTimeout(() => bubble.classList.add("hidden"), 6000);
}

function fireReminderMobileNotification(item) {
  const cfg = state.reminder.mobileNotify;
  if (!cfg || !cfg.enabled) return;
  if (!isMobileViewport()) return;
  // chỉ hiện được khi tab Nox đang là app đang xem — không thể vẽ đè app khác
  if (document.visibilityState !== "visible") return;
  showChatBubbleNotification(item);
}

/* ---- Phiên bản & cập nhật ---- */
const NOX_CHANGELOG = [
  {
    version: "2.27",
    changes: [
      "Viết: thiết kế lại toàn bộ giao diện theo kiểu khung chat, giống Nghe — câu đề bên trái, câu trả lời bên phải, đúng giữ nguyên xanh, sai (đỏ, kèm %) chỉ mất khi có đáp án đúng",
      "Viết: bỏ bảng chấm chữ trực tiếp — thay bằng chấm \"...\" đang gõ ở góc phải trên thanh nhập; cơ chế chấm điểm vẫn giữ nguyên phía sau",
      "Viết: nút ⟲ giờ chỉ xáo trộn thứ tự câu, không xoá lịch sử — câu đã làm đúng luôn được giữ lại kể cả sau khi tải lại trang, tiện lướt xem lại",
      "Viết: thanh dịch nhanh mặc định ẩn — bấm icon ⇄ trên thanh nhập (hoặc phím Alt phải) để bật/tắt; nút loa & lưu từ chuyển vào lồng trong khung kết quả, bỏ viền",
      "Viết: gộp 2 nút gợi ý cũ thành 1 nút \"?\" hiện từ tiếp theo ngay trong ô nhập",
      "Viết: kế thừa phím tắt như Nghe — ↑/↓ lấy lại câu đã gõ sai trước đó, ←/→ chuyển câu",
      "Viết: hover vào câu đề hiện icon ↺ làm lại câu đó",
      "Viết: chỉnh lại luật độ khó — Dễ (phản hồi trực tiếp + thanh dịch + gợi ý không giới hạn), Trung bình (như Dễ nhưng gợi ý tối đa 3 lần), Khó (khoá phản hồi/thanh dịch/gợi ý, chỉ kiểm tra bằng Enter, tối đa 10 lần bấm rồi tự chuyển câu)",
      "Toàn bộ web: đổi icon loa 🔊 sang 🔊︎",
    ],
  },
  {
    version: "2.26",
    changes: [
      "Thẻ & Viết: bảng điều khiển giờ tự cuộn riêng khi có nhiều danh sách, không kéo cả trang phải cuộn theo nữa",
      "Thẻ & Viết: nút Xáo trộn lồng thẳng vào thanh tên danh sách (không tách khung riêng), đổi sang icon đơn giản hơn",
      "Thẻ: chỉnh lại khoảng cách ô \"Tìm thẻ\" — cách xa hàng nút phía trên, sát lại gần thanh dịch hơn, và giảm bớt độ dài ô",
    ],
  },
  {
    version: "2.25",
    changes: [
      "Thẻ & Viết: bỏ hàng nút lọc/sắp xếp/đặt lại trạng thái/chọn danh sách cũ dưới mục \"Quản lý\" — 4 ô thống kê giờ kiêm luôn nút lọc (bấm để lọc Tất cả/Đang học/Đã biết/Khó), bỏ hẳn nút sắp xếp A-Z",
      "Thẻ & Viết: nút Xáo trộn giờ là icon 🔀 nằm ngay trên thanh tên danh sách, góc phải",
      "Thẻ & Viết: bỏ nút \"Chọn danh sách\" dạng popup — thay bằng hàng danh sách hiện sẵn để bấm chọn nhanh, giống kiểu bên Nghe",
      "Thẻ: chuyển ô \"Tìm thẻ\" từ thanh bên sang nằm ngay trên thanh dịch nhanh trong màn hình chính",
      "Viết: thêm chuyển nhanh câu bằng phím mũi tên trái/phải (không cần nút bấm riêng)",
    ],
  },
  {
    version: "2.24",
    changes: [
      "Nghe: sửa lỗi đổi giọng chỉ có tác dụng lúc bấm \"đọc toàn bộ\" — giờ nghe từng câu lúc làm bài cũng đúng giọng/tông theo người nói",
      "Nghe: thêm nút 🎙 cạnh nút đọc toàn bộ, mở popup chọn kiểu giọng đọc — 1 giọng cho tất cả (chọn được giọng cụ thể) hoặc nhiều giọng (mỗi người nói 1 giọng khác nhau)",
      "Nghe: giữ lại cả câu mình gõ đúng trong khung chat (bong bóng xanh riêng), không chỉ hiện đáp án gốc bên trái nữa",
      "Nghe: hover vào câu đáp án (bên trái) hiện nút 🌐 dịch nhanh sang Tiếng Việt ngay cạnh câu đó (chữ mờ, không khung) — chỉ lưu trong phiên làm việc, tải lại trang là mất",
    ],
  },
  {
    version: "2.23",
    changes: [
      "Nghe: thêm nút ▶ cạnh tên bài / độ khó để đọc toàn bộ đoạn hội thoại một lượt",
      "Nghe: tắt tự động đọc khi vừa chuyển sang bài khác — chỉ đọc khi tự bấm",
      "Nghe: mỗi người nói trong hội thoại giờ dùng 1 giọng đọc riêng (nếu máy có nhiều giọng tiếng Anh), có lệch nhẹ tốc độ/cao độ và khoảng nghỉ giữa các lượt thoại để nghe tự nhiên hơn",
      "Kho > Nghe: đổi vị trí 2 nút trong popup thêm bài (nút phụ sang trái, nút chính sang phải), rút gọn nút xác nhận chỉ còn chữ \"OK\"",
    ],
  },
  {
    version: "2.22",
    changes: [
      "Nghe: sửa lỗi khung chat khi nhắn nhiều bị kéo dài ra thay vì cuộn — giờ khung có chiều cao cố định theo màn hình, chỉ phần tin nhắn cuộn, thanh nhập câu luôn cố định phía dưới",
      "Nghe: sidebar chọn bài & tiêu đề giờ lấy đúng tên bài đã đặt trong Kho (\"Bài N\" hoặc tên tuỳ chỉnh), không còn lấy câu đầu tiên làm tên nữa",
      "Kho > Nghe: bỏ dòng chữ \"Thêm bài nghe — Danh sách...\" và \"Xem trước N câu...\" trong popup, bỏ luôn dòng xem trước câu đầu ở thẻ bài trong lưới",
      "Kho: toàn bộ nội dung danh sách/thẻ giờ cuộn riêng bên trong khung cố định theo màn hình, khu vực nút Xoá hết / Tiến độ / Đặt lại / Thêm vào và chú thích màu luôn cố định ở đáy khung, không bị trôi theo danh sách dài",
      "Sửa lỗi khi chuyển sang tab Thống kê, các thẻ bài của Nghe bị chèn/hiện lẫn vào giao diện (ẩn cứng toàn bộ khung con trước khi vẽ lại đúng khung của mục đang chọn)",
    ],
  },
  {
    version: "2.21",
    changes: [
      "Kho > Nghe: sửa lỗi giao diện popup Thêm/Sửa bài nghe bị tràn khung (ô dán văn bản nhỏ, nút Chuyển/OK bị đẩy khỏi màn hình)",
      "Kho > Nghe: bỏ nút sửa riêng, giờ nhấp thẳng vào thẻ bài là mở popup sửa; thu nhỏ nút xoá",
      "Kho > Nghe: thêm đổi tên từng bài — nhấp vào tên bài trong popup sửa để đặt tên riêng (thay vì luôn là \"Bài N\")",
      "Nghe: không tự xoá các câu gõ sai khi sang câu tiếp theo nữa — giữ lại toàn bộ lịch sử đúng/sai của bài, chỉ mất khi bấm nút Đặt lại (⟲) cạnh Độ khó",
      "Nghe: tiến độ làm bài (câu đã xong, câu đang làm, các lần gõ sai) được lưu lại — tắt/mở lại trang vẫn tiếp tục đúng chỗ đang học",
      "Nghe: sửa nút Skip — bỏ qua không còn lộ đáp án ngay, câu bị bỏ qua vẫn ở dạng chưa nghe (có nhãn ⏭), nhấp lại vào là quay về làm tiếp đúng vị trí đó",
      "Nghe: nhấp vào câu mình từng gõ sai (hoặc phím ↑/↓) để dán lại y nguyên câu đó vào ô nhập, tiện sửa tiếp",
    ],
  },
  {
    version: "2.20",
    changes: [
      "Thêm tab \"Nghe\" mới — luyện nghe chép chính tả kiểu chat hội thoại, dùng giọng đọc TTS có sẵn (không cần audio thật)",
      "Kho: thêm category \"Nghe\" để dán đoạn hội thoại/đoạn văn, tự tách từng câu (nhận diện nhãn người nói dạng \"A: ...\")",
      "Chấm điểm Nghe nới lỏng theo % số từ (không phải từng ký tự như Viết) — Dễ ~20% dung sai, Trung bình ~15%, Khó gần như tuyệt đối",
      "Nghe có 3 độ khó Dễ/Trung bình/Khó riêng (không chung với Viết) — ảnh hưởng dung sai chấm điểm, số lần nghe lại mỗi câu (Dễ không giới hạn/Trung bình 3 lần/Khó 1 lần) và điểm Hệ số (+5/+15/+35), khoá đổi độ khó giữa chừng câu giống Viết",
      "Header: nút 🔔 nhắc từ nhanh dời vào Cài đặt > Nhắc từ; vị trí đó giờ là nút 🗄️ mở nhanh Kho",
      "Tab chính đổi thành Thẻ / Viết / Nghe / Quizz — Kho không còn nằm trong hàng tab nữa",
    ],
  },
  {
    version: "2.19",
    changes: [
      "Fix bug độ khó Khó: sau vài từ tự dưng không hiện nữa dù gõ đúng — do đáp án bám theo (hỗ trợ nhiều đáp án) bị đổi giữa chừng khi gõ, giờ khoá cứng 1 đáp án ngay từ đầu câu",
      "Chống ăn gian: một khi đã gõ chữ đầu tiên hoặc dùng gợi ý ở câu đang làm thì khoá không cho đổi Độ khó nữa (icon 🔒), phải sang câu tiếp theo mới đổi được",
      "Nút bật/tắt nhắc từ nhanh (🔔) đổi khung bo góc giống hệt nút Cài đặt (⚙️) bên cạnh, bỏ hình viên thuốc tròn",
    ],
  },
  {
    version: "2.18",
    changes: [
      "Viết: nút \"Ẩn xem trước\" đổi thành nút Độ khó (Dễ / Trung bình / Khó, bấm để chuyển lần lượt)",
      "Độ khó Dễ: 10 gợi ý chữ, 3 gợi ý từ, điểm hệ số +5/đúng",
      "Độ khó Trung bình (= Ẩn xem trước cũ): 5 gợi ý chữ, 1 gợi ý từ, điểm hệ số +15/đúng",
      "Độ khó Khó (mới): khoá toàn bộ gợi ý, phải gõ hết cả từ mới biết đúng/sai — gõ sai 1 từ thì từ đó và mọi từ sau đều không hiện gì nữa (kể cả sửa lại đúng), điểm hệ số +35/đúng",
      "Lưu nhanh từ giờ luôn bật mặc định, bỏ nút bật/tắt riêng",
      "Bỏ nút \"Kiểm tra\" ở Viết — chỉ dùng phím Enter để kiểm tra/chuyển câu tiếp theo",
      "Quizz: màn hình chờ lúc thiết lập giờ có icon + mẹo nhỏ xoay vòng cho đỡ nhàm",
    ],
  },
  {
    version: "2.17",
    changes: [
      "Fix layout Kho: các nút Thêm/Sửa/Xoá/Xuất-Nhập trước đây dính sát vào danh sách phía trên, giờ có khoảng cách đều, cân đối hơn",
      "Đổi database giờ rút gọn, xếp cùng hàng với Tạo mã ngẫu nhiên trong Cài đặt",
      "Bổ sung tên đầy đủ còn thiếu cho Unit 2/3/4 trong tài liệu Ngữ pháp",
      "Ẩn thanh cuộn trên toàn app (vẫn cuộn bình thường) — thanh cuộn mặc định trước đây có viền trắng đè lên viền bo góc theme, phá bố cục",
    ],
  },
  {
    version: "2.16",
    changes: [
      "Thêm tab Ngữ pháp (grammar.html) mở ở tab trình duyệt riêng, truy cập từ Cài đặt — tải theo kiểu network-first nên sửa nội dung xong mở lại là thấy ngay, không cần cập nhật app",
      "Thêm theme #18 \"Đất nung\" khớp màu trang Ngữ pháp",
      "Đổi icon app sang biểu tượng trăng lưỡi liềm mới",
      "Thêm màn hình loading khi mở app (hiện cố định ~1.3s)",
      "Fix bug ở Viết: bấm gợi ý \"Hiện chữ/từ tiếp theo\" trước đây tự sửa luôn hết các chữ gõ sai phía trước — giờ chỉ nối thêm gợi ý vào cuối, phần gõ sai vẫn giữ nguyên hiện sai",
      "Bỏ nút \"Đáp án\" (xem đáp án đầy đủ khi bỏ cuộc) ở Viết, thay bằng nút \"Kiểm tra\"/\"Tiếp\" — chỉ còn 2 gợi ý tăng dần (Tab / Hiện từ), không còn cách xem trọn đáp án ngay lập tức",
      "Thêm thanh trượt chỉnh thời gian ngắt quãng Hệ số trong Cài đặt (mặc định 3 phút, min 1p, max 30p) — trước đây cố định 3 phút",
      "Rút gọn tên các mục & bỏ bớt dòng chữ mờ gợi ý trong Cài đặt cho gọn hơn",
    ],
  },
  {
    version: "2.15",
    changes: [
      "Fix lỗi tắt \"đổi màu viền theo Hệ số\" làm viền khung bị mờ/sai màu (nhất là theme tối) — giờ tắt đi sẽ trả lại đúng màu viền gốc của theme đang dùng ngay lập tức, không cần đổi qua theme khác rồi đổi lại nữa",
    ],
  },
  {
    version: "2.14",
    changes: [
      "Fix lỗ hổng: spam lật thẻ liên tục ở Thẻ trước đây đẩy Hệ số lên rất cao — giờ Thẻ chỉ giữ streak không bị ngắt quãng, cộng điểm cực nhỏ và không góp phần xây đà; chỉ Viết/Quizz mới thực sự tăng Hệ số đáng kể",
      "Sửa lại tính năng đổi màu theo Hệ số: không đổi cả theme nữa, chỉ đổi màu viền các khung (dương → viền xanh, âm → viền đỏ), giữ nguyên theme đang chọn",
    ],
  },
  {
    version: "2.13",
    changes: [
      "Fix lỗi trục thời gian ở biểu đồ Hệ số bị lệch múi giờ (thư viện biểu đồ mặc định hiện theo UTC, không tự quy đổi giờ Việt Nam) — giờ hiện đúng giờ máy đang dùng, các điểm dữ liệu cũ đã ghi trước đó cũng được tự sửa lại lần mở app này",
    ],
  },
  {
    version: "2.12",
    changes: [
      "Thêm cảnh báo nhỏ (kèm âm thanh) khi sắp hết 3 phút giữ đà học — mặc định chỉ báo trong web, có thể bật thêm thông báo hệ thống trong Cài đặt",
      "Tab Thống kê: đưa biểu đồ Hệ số lên trên và phóng to, 3 mục Thẻ/Viết/Từ điển đẩy xuống dưới, bỏ dòng hướng dẫn, đổi tên \"Đà học tập\" thành \"Hệ số\"",
      "Cài đặt mới: xem nhanh Hệ số cạnh chữ \"Nox\", và tự động đổi theme theo dấu Hệ số (dương → Xanh lục rừng, âm → Đỏ rượu vang)",
    ],
  },
  {
    version: "2.11",
    changes: [
      "Thêm tab \"Thống kê\" trong Kho: snapshot số liệu Thẻ/Viết/Từ điển (bao nhiêu đã thuộc/khó/mới), và biểu đồ \"Đà học tập\" theo thời gian thực (dùng Lightweight Charts)",
      "Đà học tập tăng khi học liên tục ở Thẻ/Viết/Quizz (không ngắt quãng quá 3 phút) — học liên tục càng lâu tăng càng nhanh; ngắt quãng sẽ giảm dần, ngắt càng lâu giảm càng nhanh; làm đúng Viết/Quizz cộng thêm, làm sai trừ nhẹ",
      "Biểu đồ bắt đầu ghi từ bản cập nhật này — không có dữ liệu quá khứ trước đó",
    ],
  },
  {
    version: "2.10",
    changes: [
      "Tạm ẩn tính năng Nhật ký (tab Nhật Ký trong Kho + nút 📔 nhanh) — có thể bật lại bất kỳ lúc nào trong Cài đặt > Nhật ký",
    ],
  },
  {
    version: "2.9",
    changes: [
      "Fix lỗi nghiêm trọng: khi gõ dở đáp án phụ/đáp án dùng \"/\", hệ thống hay bám nhầm sang đáp án khác khiến chữ đang gõ đúng vẫn hiện đỏ hết (do so sánh cả câu thay vì chỉ so phần đã gõ) — giờ bám đúng ngay từ ký tự đầu tiên khác nhau",
      "Lưu nhanh từ: giờ chọn được nhiều từ liên tiếp (bấm từ này rồi bấm thêm từ liền kề), tự ghép thành cụm theo đúng thứ tự trong câu rồi tra nghĩa cả cụm",
    ],
  },
  {
    version: "2.8",
    changes: [
      "Viết: hỗ trợ nhiều đáp án cho 1 câu — dùng \"/\" giữa từ đồng nghĩa ngay trong 1 đáp án (vd \"I love/like her\"), và thêm hẳn đáp án khác cấu trúc khác qua popup Sửa hoặc dán hàng loạt bằng \"|\"",
      "Viết: tô màu & gợi ý (Tab/hiện từ) giờ tự bám theo đáp án đang gần giống nhất với những gì đang gõ, thay vì chỉ 1 đáp án cố định",
      "Viết: chấm chặt hơn — gõ sai hoặc dùng quá gợi ý sẽ tính \"Làm sai\" vĩnh viễn cho câu đó dù sau gõ đúng lại; sai 1 chữ trong 1 từ thì cả từ đó hiện sai hết (không lật lại đúng); khi bật \"Ẩn xem trước\" thì lan luôn ra cả câu còn lại",
      "\"Ẩn xem trước\" giờ mặc định luôn bật sẵn",
      "Viết: thanh dịch nhanh giờ luôn hiện sẵn; nút \"Dịch\" đổi thành \"Lưu nhanh từ\" — bật lên thì làm đúng 1 câu sẽ hiện từng từ trong câu dưới dạng khối bấm được để tra nhanh nghĩa",
      "Thanh dịch nhanh: bấm chọn nhiều nghĩa cùng lúc (không còn chỉ chọn được 1) khi lưu vào Từ điển",
      "Cài đặt mới: xoá bản dịch cũ khi bấm ra rồi bấm lại vào thanh dịch, và tự động nhận diện Anh/Việt khi gõ",
      "Fix lỗi cột Tiếng Việt ở Từ điển bị thừa nhãn [C] [U] [Vi]... khi dán đoạn định dạng từ điển hàng loạt",
    ],
  },
  {
    version: "2.7",
    changes: [
      "Popup \"Thêm vào\" ở Kho giờ to bằng ~75% màn hình, dễ nhìn và dễ nhập hơn",
      "Thêm bước Xem trước sau khi nhấn \"Chuyển\": có thể sửa từng ô (Tiếng Anh / Phiên âm / Loại từ / Tiếng Việt) hoặc xoá bớt mục trước khi nhấn OK để thêm vào danh sách",
      "Viết lại bộ tách dữ liệu dán vào cho danh sách Từ điển: nhận diện đúng định dạng \"• từ /phiên âm/ [loại từ]: nghĩa\", tự tách các mục trái nghĩa nối bằng \"<>\" và các cụm/từ phái sinh nối bằng \"-->\" thành từng mục riêng",
      "Cột Phiên âm và Loại từ trong bảng ở Kho giờ chỉ hiện ở tab Từ điển, ẩn ở tab Thẻ và Viết",
    ],
  },
  {
    version: "2.6",
    changes: [
      "Fix tiếp lỗi xem trước nhật ký ở Kho: khung \"Viết tự do\" giờ quay về nằm gọn theo dòng chữ bình thường khi xem trước, không còn kéo giãn vùng cuộn / hiện thanh cuộn kỳ lạ",
      "Khung xem nhật ký ở Kho giờ kéo dài hết chiều cao trang thay vì bị giới hạn ngắn, thừa nhiều khoảng trống bên dưới như trước",
    ],
  },
  {
    version: "2.5",
    changes: [
      "Fix lỗi khung \"Viết tự do\" tràn lung tung ra ngoài khi xem trước nhật ký ở tab Kho — giờ luôn nằm gọn trong khung xem trước, chỉ đọc không sửa được ở đó",
      "Fix lỗi phím tắt A/D (chuyển thẻ trước/sau) vẫn hoạt động ngầm khi đang gõ chữ trong popup Nhật ký (hoặc bất kỳ popup nào khác đang mở)",
    ],
  },
  {
    version: "2.4",
    changes: [
      "Fix lỗi Viết tự do: bấm vào trang hiện ô nhưng không gõ được chữ (do cấu trúc ô cũ không có chỗ hợp lệ để đặt con trỏ)",
      "Viết tự do: bật công cụ lên sẽ tự đánh dấu (viền + nền màu) toàn bộ khung đang có trên trang cho dễ nhận biết",
      "Fix lỗi ô Viết tự do trống (chưa gõ gì) vẫn bị lưu lại và hiện lại mỗi lần mở nhật ký — giờ luôn được dọn sạch trước khi lưu",
    ],
  },
  {
    version: "2.3",
    changes: [
      "Bỏ 4 công cụ vẽ hình vừa thêm ở Nhật ký nhanh, thay bằng 1 công cụ duy nhất: \"Viết tự do\" (✥)",
      "Viết tự do: bật lên rồi bấm vào bất kỳ đâu trên trang nhật ký là viết được ngay tại đó, không theo dòng có sẵn, kéo tay cầm ⠿ để di chuyển đoạn vừa viết đi bất kỳ đâu",
    ],
  },
  {
    version: "2.2",
    changes: [
      "Âm thanh khi bấm nút giờ êm hơn, đỡ chát tai (đổi từ sóng vuông sang sóng sine mềm)",
      "Bỏ nút Highlight trong Nhật ký nhanh",
      "Fix lỗi rung nhẹ + xuất hiện thanh cuộn ngang khi chuyển về thẻ trước ở tab Thẻ",
      "Thêm công cụ vẽ hình vuông, tròn, đường thẳng, mũi tên trong Nhật ký nhanh — chọn công cụ rồi kéo thả trực tiếp trên nội dung",
    ],
  },
  {
    version: "2.1",
    changes: [
      "Thêm hiệu ứng âm khi bấm nút, làm đúng, làm sai và chuyển thẻ",
      "Thêm cài đặt bật/tắt hiệu ứng âm + thanh chỉnh âm lượng riêng (Cài đặt → Âm thanh)",
      "Âm thanh (lật thẻ, hiệu ứng) to hơn đáng kể so với trước, kéo được tới 150% mà không bị vỡ tiếng",
    ],
  },
  {
    version: "2.0",
    changes: [
      "Thêm 6 màu giao diện mới: Tử đằng, Xám khói, Chanh, Ngọc lam, Hồng đất, Xanh lục rừng (tổng 17 màu)",
      "Mã đồng bộ giờ bắt buộc tối thiểu 8 ký tự, có nút \"Tạo mã ngẫu nhiên\" để tạo mã an toàn",
    ],
  },
  {
    version: "1.9",
    changes: [
      "Thiết kế lại popup Cài đặt: có thể cuộn, không còn tràn ra ngoài màn hình",
      "Tách phần \"Đổi database\" ra popup riêng, mở bằng nút bấm cho gọn",
      "Thêm tự động tắt thông báo nhắc từ: theo số chu kỳ (1-10) hoặc theo thời gian đếm ngược (1-60 phút)",
      "Thêm tự động bật lại thông báo nhắc từ: đếm ngược (1-60 phút) hoặc theo giờ thực trong ngày",
      "Quizz: số lượng câu và thời gian đếm ngược giờ chỉnh bằng thanh trượt; số câu tối đa tự tính theo danh sách đã chọn",
      "Quizz: mặc định không chọn sẵn danh sách nào — tự chọn qua nút \"Chọn danh sách\"",
    ],
  },
  {
    version: "1.8",
    changes: [
      "Hiệu ứng trượt + xoay nhẹ khi chuyển thẻ (nút mũi tên, phím tắt, auto play)",
      "Vuốt thẻ mượt hơn: thẻ đi theo tay khi kéo, bay ra khi thả tay đủ xa",
      "Thêm 5 màu giao diện mới: Xanh biển, Bạc hà, Cam đào, Tím than, Đỏ rượu vang",
      "Bỏ nhãn \"Còn thiếu\" trong khung phản hồi trực tiếp ở tab Viết",
      "Cho phép dán config Firebase riêng để đổi sang database khác (hữu ích khi chuyển tài khoản), kèm nút hướng dẫn tạo database mới",
    ],
  },
  {
    version: "1.7",
    changes: [
      "Popup Cài đặt: gộp đồng bộ, màu giao diện, âm lượng vào một chỗ",
      "Thêm 2 màu giao diện dịu mắt ban đêm: Đêm ấm, Đêm xanh rêu",
      "Chỉnh âm lượng riêng cho âm thanh lật thẻ và giọng đọc",
      "Nút chuông bật/tắt nhắc từ nhanh ở đầu trang",
      "Tự động đọc + nút đọc thủ công trong popup nhắc từ",
      "Tự động đọc (auto play) + nút đọc thủ công ở tab Thẻ",
      "Tự ẩn bảng điều khiển trên điện thoại (trừ tab Quizz), có nút hiện lại",
    ],
  },
  {
    version: "1.6",
    changes: [
      "Chế độ nghe trong Quizz: ẩn câu hỏi, đọc bằng giọng nói, nhấn Space để nghe lại",
      "Hiện lại câu hỏi sau khi chọn đáp án + animation chuyển câu",
      "Kho từ điển: tách riêng cột Phiên âm và Loại từ",
      "Đồng bộ dữ liệu tự động xếp hàng khi mất mạng, gửi lại khi có mạng",
    ],
  },
  {
    version: "1.5",
    changes: [
      "Thêm phát âm (Web Speech API) + phiên âm IPA + loại từ ở thanh dịch nhanh và kho từ điển",
      "Đồng bộ dữ liệu giữa các thiết bị qua Firebase Realtime Database",
    ],
  },
];
function renderVersionInfo() {
  const body = document.getElementById("version-info-body");
  body.innerHTML = NOX_CHANGELOG.map(
    (v) => `<div class="version-entry">
      <div class="version-entry-title">Phiên bản ${escapeHtml(v.version)}</div>
      <ul>${v.changes.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
    </div>`
  ).join("");
}
document.getElementById("version-info-btn").addEventListener("click", () => {
  renderVersionInfo();
  document.getElementById("version-info-overlay").classList.remove("hidden");
});
document.getElementById("version-info-close").addEventListener("click", () => {
  document.getElementById("version-info-overlay").classList.add("hidden");
});
document.getElementById("version-info-overlay").addEventListener("click", (e) => {
  if (e.target.id === "version-info-overlay") document.getElementById("version-info-overlay").classList.add("hidden");
});

/* ============================================================
   NHẮC TỪ NHANH (nút chuông đầu trang) — dùng chung logic với
   nút 🔔 Nhắc từ trong Kho
   ============================================================ */
let reminderAutoOffTimer = null;
let reminderAutoOnTimer = null;
function clearReminderAutoOffTimer() { clearTimeout(reminderAutoOffTimer); reminderAutoOffTimer = null; }
function clearReminderAutoOnTimer() { clearTimeout(reminderAutoOnTimer); reminderAutoOnTimer = null; }

/* Chỉ áp dụng cho chế độ "theo thời gian" — chế độ "theo chu kỳ" được kiểm tra
   trực tiếp trong showNextReminder() mỗi khi một chu kỳ đọc hết vừa hoàn tất. */
function scheduleReminderAutoOff() {
  clearReminderAutoOffTimer();
  const autoOff = state.reminder.autoOff;
  if (!autoOff || !autoOff.enabled || autoOff.mode !== "time") return;
  const ms = Math.max(1, Math.min(60, autoOff.minutes || 5)) * 60 * 1000;
  reminderAutoOffTimer = setTimeout(() => {
    setReminderEnabled(false);
    showToast("Đã tự động tắt thông báo nhắc từ (hết thời gian đặt).");
  }, ms);
}
function scheduleReminderAutoOn() {
  clearReminderAutoOnTimer();
  const autoOn = state.reminder.autoOn;
  if (!autoOn || !autoOn.enabled) return;
  let ms;
  if (autoOn.mode === "clock") {
    const [hh, mm] = (autoOn.clock || "17:00").split(":").map((x) => parseInt(x, 10));
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh || 0, mm || 0, 0, 0);
    if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
    ms = target.getTime() - now.getTime();
  } else {
    ms = Math.max(1, Math.min(60, autoOn.minutes || 5)) * 60 * 1000;
  }
  reminderAutoOnTimer = setTimeout(() => {
    setReminderEnabled(true);
    showToast("Đã tự động bật lại thông báo nhắc từ.");
  }, ms);
}

function setReminderEnabled(on) {
  state.reminder.enabled = on;
  saveState();
  document.getElementById("wh-reminder-toggle").classList.toggle("active", on);
  const quickToggle = document.getElementById("settings-reminder-quick-toggle");
  if (quickToggle) quickToggle.checked = on;
  if (on) {
    clearReminderAutoOnTimer();
    if (!reminderEligibleItems().length) {
      showToast("Hãy bật nhắc từ cho ít nhất một danh sách trong lưới bên trái trước.");
    }
    startReminderCycle();
    scheduleReminderAutoOff();
  } else {
    clearReminderAutoOffTimer();
    stopReminderCycle();
    scheduleReminderAutoOn();
  }
}
function toggleGlobalReminder() {
  setReminderEnabled(!state.reminder.enabled);
}
document.getElementById("settings-reminder-quick-toggle").addEventListener("change", toggleGlobalReminder);
document.getElementById("settings-reminder-quick-toggle").checked = state.reminder.enabled;

/* ============================================================
   MOBILE — TỰ ẨN BẢNG ĐIỀU KHIỂN (trừ tab Quizz)
   ============================================================ */
let mobilePanelExpanded = false;
function isMobileViewport() {
  return window.matchMedia("(max-width:900px)").matches;
}
function updateMobilePanelVisibility() {
  const toggle = document.getElementById("mobile-panel-toggle");
  const activeTab = document.querySelector(".main-tab-btn.active")?.dataset.tab;
  if (!isMobileViewport() || activeTab === "quiz") {
    toggle.classList.add("hidden");
    document.querySelectorAll(".sidebar-panel").forEach((p) => p.classList.remove("mobile-collapsed"));
    return;
  }
  toggle.classList.remove("hidden");
  document.querySelectorAll(".sidebar-panel").forEach((p) => {
    p.classList.toggle("mobile-collapsed", p.dataset.panel === activeTab && !mobilePanelExpanded);
  });
  toggle.textContent = mobilePanelExpanded ? "▴ Ẩn tuỳ chọn" : "▾ Hiện tuỳ chọn";
}
document.getElementById("mobile-panel-toggle").addEventListener("click", () => {
  mobilePanelExpanded = !mobilePanelExpanded;
  updateMobilePanelVisibility();
});
window.addEventListener("resize", updateMobilePanelVisibility);
document.getElementById("wh-diary-open-editor").addEventListener("click", () => {
  const list = whActiveList();
  openDiaryPopup(list ? list.id : null);
});
document.getElementById("dy-close-btn").addEventListener("click", closeDiaryPopup);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !document.getElementById("diary-popup-overlay").classList.contains("hidden")) {
    closeDiaryPopup();
  }
});
window.addEventListener("beforeunload", () => {
  if (!document.getElementById("diary-popup-overlay").classList.contains("hidden")) {
    saveDiaryContent();
  }
});
// NOTE: clicking the backdrop intentionally does NOT close this popup (per request),
// unlike the other overlays in the app.

document.getElementById("dy-note-select").addEventListener("change", (e) => {
  saveDiaryContent();
  const list = getCategory("diary").find((l) => l.id === e.target.value);
  if (!list) return;
  diaryCurrentListId = list.id;
  state.activeWhList.diary = list.id;
  document.getElementById("dy-content").innerHTML = list.content || "";
  saveState();
});

document.getElementById("dy-content").addEventListener("input", scheduleDiaryAutosave);

/* ---- formatting commands ---- */
function diaryExec(cmd, value = null) {
  const content = document.getElementById("dy-content");
  content.focus();
  try {
    document.execCommand(cmd, false, value);
  } catch (e) {
    /* execCommand is legacy but broadly supported; fail silently if unavailable */
  }
  scheduleDiaryAutosave();
}
document.getElementById("dy-bold-btn").addEventListener("click", () => diaryExec("bold"));
document.getElementById("dy-italic-btn").addEventListener("click", () => diaryExec("italic"));
document.getElementById("dy-underline-btn").addEventListener("click", () => diaryExec("underline"));

/* undo / redo */
document.getElementById("dy-undo-btn").addEventListener("click", () => diaryExec("undo"));
document.getElementById("dy-redo-btn").addEventListener("click", () => diaryExec("redo"));

/* generic dropdown menu handling (shared by diary toolbar + Kho sort menu) */
function closeAllDiaryDropdowns() {
  document.querySelectorAll(".diary-dropdown-menu").forEach((m) => m.classList.add("hidden"));
}
document.getElementById("dy-fontsize-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const menu = document.getElementById("dy-fontsize-menu");
  const wasHidden = menu.classList.contains("hidden");
  closeAllDiaryDropdowns();
  menu.classList.toggle("hidden", !wasHidden);
});
document.querySelectorAll("#dy-fontsize-menu [data-size]").forEach((btn) => {
  btn.addEventListener("click", () => {
    diaryExec("fontSize", btn.dataset.size);
    document.getElementById("dy-fontsize-btn").textContent = btn.textContent + " ▾";
    document.getElementById("dy-fontsize-menu").classList.add("hidden");
  });
});

/* alignment / list dropdown */
document.getElementById("dy-align-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const menu = document.getElementById("dy-align-menu");
  const wasHidden = menu.classList.contains("hidden");
  closeAllDiaryDropdowns();
  menu.classList.toggle("hidden", !wasHidden);
});
document.querySelectorAll("#dy-align-menu [data-cmd]").forEach((btn) => {
  btn.addEventListener("click", () => {
    diaryExec(btn.dataset.cmd);
    document.getElementById("dy-align-menu").classList.add("hidden");
  });
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".diary-dd-wrap")) closeAllDiaryDropdowns();
});

/* Kho: sort danh sách dropdown (Theo ngày / Theo tên) */
document.getElementById("wh-sort-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const menu = document.getElementById("wh-sort-menu");
  const wasHidden = menu.classList.contains("hidden");
  closeAllDiaryDropdowns();
  menu.classList.toggle("hidden", !wasHidden);
});
document.querySelectorAll("#wh-sort-menu [data-sort]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const list = getCategory(wh.cat);
    if (btn.dataset.sort === "date") {
      list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }
    saveState();
    renderWarehouseTab();
    document.getElementById("wh-sort-menu").classList.add("hidden");
  });
});

/* text color */
document.getElementById("dy-color-btn").addEventListener("click", () => {
  document.getElementById("dy-color-input").click();
});
document.getElementById("dy-color-input").addEventListener("input", (e) => {
  diaryExec("foreColor", e.target.value);
  document.getElementById("dy-color-btn").style.color = e.target.value;
  document.getElementById("dy-color-btn").style.borderColor = e.target.value;
});

/* ---- Highlight & Đóng khung: custom toggle-on/toggle-off spans ----
   (not using execCommand hiliteColor, since it can't reliably be
   detected/removed on re-selection — these need real toggle behaviour) */
function unwrapSpan(span) {
  const parent = span.parentNode;
  if (!parent) return;
  while (span.firstChild) parent.insertBefore(span.firstChild, span);
  parent.removeChild(span);
}
function wrapRangeInSpan(range, className) {
  const span = document.createElement("span");
  span.className = className;
  try {
    range.surroundContents(span);
  } catch (err) {
    const frag = range.extractContents();
    span.appendChild(frag);
    range.insertNode(span);
  }
  return span;
}
function toggleInlineSpanClass(className, emptyMessage) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || sel.isCollapsed) {
    showToast(emptyMessage);
    return;
  }
  const range = sel.getRangeAt(0);
  let container = range.commonAncestorContainer;
  if (container.nodeType === 3) container = container.parentElement;
  const existing = container && container.closest ? container.closest("." + className) : null;
  if (existing) {
    unwrapSpan(existing);
  } else {
    wrapRangeInSpan(range, className);
  }
  sel.removeAllRanges();
  scheduleDiaryAutosave();
}
document.getElementById("dy-box-btn").addEventListener("click", () => {
  toggleInlineSpanClass("diary-boxed", "Hãy bôi đen đoạn chữ cần đóng khung trước.");
});

/* ============================================================
   VIẾT TỰ DO — bật lên thì bấm vào bất kỳ đâu trên trang nhật ký
   cũng viết được ngay tại đó (không theo dòng chữ có sẵn), và có
   thể kéo di chuyển đoạn vừa viết đi khắp trang bằng tay cầm ⠿.
   ============================================================ */
function cleanupEmptyFloatBoxes() {
  const content = document.getElementById("dy-content");
  if (!content) return;
  content.querySelectorAll(".dy-float-box").forEach((box) => {
    const textEl = box.querySelector(".dy-float-text");
    let isEmpty;
    if (textEl) {
      isEmpty = textEl.textContent.trim() === "" && !textEl.querySelector("img,svg");
    } else {
      // định dạng cũ (trước khi fix lỗi không gõ được chữ) — không có .dy-float-text riêng
      const clone = box.cloneNode(true);
      clone.querySelectorAll(".dy-float-handle").forEach((h) => h.remove());
      isEmpty = clone.textContent.trim() === "" && !clone.querySelector("img,svg");
    }
    if (isEmpty) box.remove();
  });
}

(function setupDiaryFreeWrite() {
  const content = document.getElementById("dy-content");
  const toggleBtn = document.getElementById("dy-freewrite-btn");
  let freeWriteMode = false;

  function setFreeWriteMode(on) {
    freeWriteMode = on;
    toggleBtn.classList.toggle("active-state", on);
    // bật lên -> đánh dấu hiện toàn bộ khung viết tự do đang có trên trang cho dễ thấy
    content.classList.toggle("dy-freewrite-mode", on);
    if (!on) cleanupEmptyFloatBoxes();
  }
  toggleBtn.addEventListener("click", () => setFreeWriteMode(!freeWriteMode));

  function createFloatBox(clientX, clientY) {
    const rect = content.getBoundingClientRect();
    const x = clientX - rect.left + content.scrollLeft;
    const y = clientY - rect.top + content.scrollTop;
    const box = document.createElement("div");
    box.className = "dy-float-box";
    box.contentEditable = "false"; // bản thân khung không nằm trong luồng soạn thảo chính
    box.style.left = Math.max(0, x) + "px";
    box.style.top = Math.max(0, y) + "px";

    const handle = document.createElement("span");
    handle.className = "dy-float-handle";
    handle.textContent = "⠿";

    const textEl = document.createElement("div");
    textEl.className = "dy-float-text";
    textEl.contentEditable = "true"; // vùng gõ chữ thật sự, tách riêng để luôn đặt được con trỏ

    box.appendChild(handle);
    box.appendChild(textEl);
    content.appendChild(box);
    textEl.focus();
    return box;
  }

  /* bấm vào trang khi đang bật chế độ -> tạo ô viết tự do mới tại đó */
  content.addEventListener("mousedown", (e) => {
    if (!freeWriteMode) return;
    if (e.target.closest(".dy-float-box")) return; // bấm vào ô đã có sẵn (kể cả tay cầm) -> để xử lý riêng, không tạo chồng ô mới
    e.preventDefault();
    createFloatBox(e.clientX, e.clientY);
  });

  /* dọn ô trống ngay khi rời khỏi nó mà chưa viết gì */
  content.addEventListener("focusout", (e) => {
    const textEl = e.target.closest ? e.target.closest(".dy-float-text") : null;
    if (!textEl) return;
    const box = textEl.closest(".dy-float-box");
    if (box && textEl.textContent.trim() === "" && !textEl.querySelector("img,svg")) {
      box.remove();
    }
    scheduleDiaryAutosave();
  });
  content.addEventListener("input", (e) => {
    if (e.target.closest && e.target.closest(".dy-float-text")) scheduleDiaryAutosave();
  });

  /* kéo di chuyển bằng tay cầm ⠿ — dùng event delegation nên vẫn hoạt động
     với cả những ô đã được load sẵn từ nội dung đã lưu trước đó */
  let dragBox = null, dragStartX = 0, dragStartY = 0, dragBoxLeft = 0, dragBoxTop = 0;
  function beginDrag(box, clientX, clientY) {
    dragBox = box;
    dragStartX = clientX;
    dragStartY = clientY;
    dragBoxLeft = parseFloat(box.style.left) || 0;
    dragBoxTop = parseFloat(box.style.top) || 0;
  }
  function moveDrag(clientX, clientY) {
    if (!dragBox) return;
    dragBox.style.left = Math.max(0, dragBoxLeft + (clientX - dragStartX)) + "px";
    dragBox.style.top = Math.max(0, dragBoxTop + (clientY - dragStartY)) + "px";
  }
  function endDrag() {
    if (!dragBox) return;
    dragBox = null;
    scheduleDiaryAutosave();
  }
  content.addEventListener("mousedown", (e) => {
    const handle = e.target.closest(".dy-float-handle");
    if (!handle) return;
    e.preventDefault();
    beginDrag(handle.closest(".dy-float-box"), e.clientX, e.clientY);
  });
  document.addEventListener("mousemove", (e) => moveDrag(e.clientX, e.clientY));
  document.addEventListener("mouseup", endDrag);
  content.addEventListener("touchstart", (e) => {
    const handle = e.target.closest(".dy-float-handle");
    if (!handle || e.touches.length !== 1) return;
    beginDrag(handle.closest(".dy-float-box"), e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  document.addEventListener("touchmove", (e) => {
    if (!dragBox || e.touches.length !== 1) return;
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  document.addEventListener("touchend", endDrag);
})();

/* edit / view mode toggle */
document.getElementById("dy-mode-btn").addEventListener("click", () => {
  const content = document.getElementById("dy-content");
  const isCurrentlyEditable = content.contentEditable === "true";
  if (isCurrentlyEditable) {
    saveDiaryContent();
    content.contentEditable = "false";
  } else {
    content.contentEditable = "true";
    content.focus();
  }
  document.getElementById("dy-mode-btn").classList.toggle("active-state", isCurrentlyEditable);
});

/* keyboard shortcuts while editing */
document.getElementById("dy-content").addEventListener("keydown", (e) => {
  const ctrl = e.ctrlKey || e.metaKey;
  if (!ctrl) return;
  const key = e.key.toLowerCase();
  if (!e.shiftKey && key === "b") { e.preventDefault(); diaryExec("bold"); }
  else if (!e.shiftKey && key === "i") { e.preventDefault(); diaryExec("italic"); }
  else if (!e.shiftKey && key === "u") { e.preventDefault(); diaryExec("underline"); }
  else if (!e.shiftKey && key === "z") { e.preventDefault(); diaryExec("undo"); }
  else if (!e.shiftKey && key === "y") { e.preventDefault(); diaryExec("redo"); }
  else if (e.shiftKey && key === "d") { e.preventDefault(); document.getElementById("dy-box-btn").click(); }
  else if (e.shiftKey && key === "l") { e.preventDefault(); diaryExec("justifyLeft"); }
  else if (e.shiftKey && key === "e") { e.preventDefault(); diaryExec("justifyCenter"); }
  else if (e.shiftKey && key === "r") { e.preventDefault(); diaryExec("justifyRight"); }
  else if (e.shiftKey && key === "m") { e.preventDefault(); document.getElementById("dy-mode-btn").click(); }
  else if (e.shiftKey && e.code === "Digit7") { e.preventDefault(); diaryExec("insertOrderedList"); }
  else if (e.shiftKey && e.code === "Digit8") { e.preventDefault(); diaryExec("insertUnorderedList"); }
  else if (e.key === ">") { e.preventDefault(); diaryExec("fontSize", "5"); document.getElementById("dy-fontsize-btn").textContent = "Lớn ▾"; }
  else if (e.key === "<") { e.preventDefault(); diaryExec("fontSize", "2"); document.getElementById("dy-fontsize-btn").textContent = "Nhỏ ▾"; }
});


/* ============================================================
   INIT
   ============================================================ */
ensureSelected("flashcard");
ensureSelected("writing");
renderFlashcardTab();
updateQuizCountSliderMax();
if (state.reminder.enabled) {
  startReminderCycle();
  scheduleReminderAutoOff();
} else {
  scheduleReminderAutoOn();
}
if (syncCode) connectSync(syncCode);
updateMobilePanelVisibility();
startQuizTipRotation();
saveState();

/* ---- Màn hình loading: hiện cố định ~1.3s rồi tự ẩn ---- */
setTimeout(() => {
  const loadingEl = document.getElementById("app-loading");
  if (loadingEl) loadingEl.classList.add("hidden");
}, 1300);
