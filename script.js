/* ============================================================
   NOX — Ứng dụng học từ vựng (Thẻ / Viết / Nghe / Kho)
   ============================================================ */

const ICON_PATHS = {
  gear: `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`,
  trash: `<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>`,
  mic: `<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>`,
  volume: `<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`,
  copy: `<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
  globe: `<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  bulb: `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`,
  bell: `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,
  lock: `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  heart: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  heartf: `<path class="f" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  user: `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  download: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>`,
  play: `<path class="f" d="M7 4.5v15l12-7.5Z"/>`,
  stop: `<rect class="f" x="6" y="6" width="12" height="12" rx="1.5"/>`,
  skip: `<path class="f" d="M5 5v14l10-7Z"/><path d="M19 5v14"/>`,
  sparkle: `<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 15v4"/><path d="M17 17h4"/><path d="M5 17v3"/><path d="M3.5 18.5h3"/>`
};
/* Icon nét đen dạng SVG (đi theo màu chữ của nút) — thay cho emoji nhiều màu */
function icon(name) {
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
}

const STORAGE_KEY = "nox_app_data_v1";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

// Khoá ngày dạng "YYYY-MM-DD" theo giờ địa phương — dùng để reset số phút học
// mỗi ngày (thời gian học Viết/Nghe ở tab Thống kê).
function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function defaultList(name) {
  return { id: uid(), name, items: [], createdAt: Date.now(), reminderEnabled: false };
}
function defaultState() {
  return {
    themeLevel: 1,
    categories: {
      flashcard: [defaultList("Danh sách 1")],
      writing: [defaultList("Danh sách 1")],
      dictionary: [defaultList("Danh sách 1")],
      listening: [defaultList("Danh sách 1")],
    },
    selected: { flashcard: [], writing: [], listening: [], wrFcSource: [] },
    activeWhList: { flashcard: null, writing: null, dictionary: null, listening: null },
    reminder: {
      enabled: false, autoRead: false, desktopNotify: false, mobileNotify: { enabled: false },
      background: { enabled: false, cycles: 1, intervalMin: 5 },
      autoOff: { enabled: false, mode: "cycles", cycles: 1, minutes: 5 },
      autoOn: { enabled: false, mode: "countdown", minutes: 5, clock: "17:00" },
    },
    settings: { flipVolume: 100, ttsVolume: 100, sfxEnabled: true, sfxVolume: 100, reminderMinDisplay: 10, reminderMaxReads: 2, fcFlipDuration: 10, qtClearOnRefocus: false, qtAutoDetectLang: false, translateKey: "F2", translateFollowSel: true, translateFollowCard: false, momentumSystemNotify: false, momentumQuickview: false, momentumThemeSync: false, momentumIdleMinutes: 3, wrDifficulty: "medium", ngheVoiceMode: "multi", ngheSingleVoiceURI: "", wrHintKey: "AltLeft", wrTranslateKey: "F2", wrReadKey: "F3", showStudyMinutes: false },
    studyMomentum: { score: 0, streakGain: 1, lastActionAt: null, history: [] },
    studyTime: { date: todayKey(), writingSec: 0, listeningSec: 0, writingGoalMin: 60, listeningGoalMin: 60 },
    studyTimeTotal: { writingSec: 0, listeningSec: 0 },
    bubblePos: null,
    trash: [],
    myShares: [],
    grammar: { lastUnit: null, bookmarks: [] },
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
    if (!parsed.activeWhList) parsed.activeWhList = { flashcard: null, writing: null, dictionary: null, listening: null };
    delete parsed.categories.diary;
    delete parsed.activeWhList.diary;
    if (parsed.settings) delete parsed.settings.showDiary;
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
    // (mức giao diện đã gỡ được ánh xạ lại trong normThemeLevel khi áp dụng)
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
    if (!parsed.studyTime) parsed.studyTime = { date: todayKey(), writingSec: 0, listeningSec: 0, writingGoalMin: 60, listeningGoalMin: 60 };
    if (parsed.studyTime.writingSec === undefined) parsed.studyTime.writingSec = 0;
    if (parsed.studyTime.listeningSec === undefined) parsed.studyTime.listeningSec = 0;
    if (parsed.studyTime.writingGoalMin === undefined) parsed.studyTime.writingGoalMin = 60;
    if (parsed.studyTime.listeningGoalMin === undefined) parsed.studyTime.listeningGoalMin = 60;
    // Tổng số giờ học CỘNG DỒN, KHÔNG BAO GIỜ reset theo ngày (khác với
    // studyTime.writingSec/listeningSec ở trên chỉ tính riêng "hôm nay" cho
    // vòng tròn mục tiêu). Trước đây không có trường này nên số giờ học bị
    // mất mỗi khi qua ngày mới / nghỉ 1 hôm rồi quay lại — nay tách riêng để
    // sống sót qua mọi lần đổi ngày.
    if (!parsed.studyTimeTotal) {
      // Lần đầu nâng cấp lên bản có trường này: lấy tạm số giây "hôm nay" hiện
      // có (nếu còn đúng ngày) làm mốc khởi điểm, còn hơn là bắt đầu lại từ 0.
      parsed.studyTimeTotal = {
        writingSec: parsed.studyTime.date === todayKey() ? (parsed.studyTime.writingSec || 0) : 0,
        listeningSec: parsed.studyTime.date === todayKey() ? (parsed.studyTime.listeningSec || 0) : 0,
      };
    }
    if (parsed.studyTimeTotal.writingSec === undefined) parsed.studyTimeTotal.writingSec = 0;
    if (parsed.studyTimeTotal.listeningSec === undefined) parsed.studyTimeTotal.listeningSec = 0;
    if (parsed.studyTime.date !== todayKey()) {
      parsed.studyTime.date = todayKey();
      parsed.studyTime.writingSec = 0;
      parsed.studyTime.listeningSec = 0;
    }
    if (parsed.settings.showStudyMinutes === undefined) parsed.settings.showStudyMinutes = false;
    if (!parsed.settings.wrHintKey) parsed.settings.wrHintKey = "AltLeft";
    if (!parsed.settings.wrTranslateKey) parsed.settings.wrTranslateKey = "F2";
    // Phím mở popup dịch nay dùng chung toàn app: kế thừa phím người dùng đã gán cho thanh dịch Viết cũ
    if (!parsed.settings.translateKey) parsed.settings.translateKey = parsed.settings.wrTranslateKey || "F2";
    if (parsed.settings.translateFollowSel === undefined) parsed.settings.translateFollowSel = true;
    if (parsed.settings.translateFollowCard === undefined) parsed.settings.translateFollowCard = false;
    if (!parsed.settings.wrReadKey) parsed.settings.wrReadKey = "F3";
    if (!parsed.selected.wrFcSource) parsed.selected.wrFcSource = [];
    if (!parsed.grammar) parsed.grammar = { lastUnit: null, bookmarks: [] };
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
  applyGrammarLock();
  const activeBtn = document.querySelector(".main-tab-btn.active");
  const tab = activeBtn ? activeBtn.dataset.tab : "flashcard";
  if (tab === "flashcard") renderFlashcardTab();
  if (tab === "writing") renderWritingTab();
  if (tab === "warehouse") renderWarehouseTab();
  if (tab === "grammar") renderGrammarSidebar();
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
      ensureSelected("flashcard", "wrFcSource");
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

/* ============================================================
   TÀI KHOẢN — Firebase Authentication + vai trò
   Khách (mặc định, chỉ local) → Free → Premium → Admin.
   Đăng nhập bằng TÊN (tra usernames/{tên} -> email -> đăng nhập Firebase).
   Đồng bộ dữ liệu giờ đi theo UID (connectSync(uid)) thay vì mã thủ công.
   ============================================================ */
let currentUser = null;      // firebase.auth().currentUser, null = Khách
let pendingShareCode = new URLSearchParams(location.search).get("share"); // ?share=MÃ trên link chia sẻ riêng tư
let accountProfile = null;   // /users/{uid}/profile
let accountRole = "guest";   // "guest" | "free" | "premium" | "admin"
let profileListenerRef = null;
const ADMIN_PASS_SESSION_KEY = "nox_admin_unlocked";
let adminUnlocked = sessionStorage.getItem(ADMIN_PASS_SESSION_KEY) === "1";

function roleLabel(role) {
  return { guest: "Khách", free: "Free", premium: "Premium", admin: "Admin" }[role] || "Khách";
}
function nameKey(name) {
  return (name || "").trim().toLowerCase();
}
function todayDateStr() { return todayKey(); }

async function registerAccount(name, password, email) {
  name = (name || "").trim();
  email = (email || "").trim();
  if (!name) throw new Error("Nhập tên.");
  if (name.length > 10) throw new Error("Tên tối đa 10 ký tự.");
  if (!password || password.length < 6) throw new Error("Mật khẩu tối thiểu 6 ký tự.");
  if (!email) throw new Error("Nhập email.");
  initFirebaseApp();
  const key = nameKey(name);
  const takenSnap = await firebase.database().ref("usernames/" + key).once("value");
  if (takenSnap.exists()) throw new Error("Tên này đã có người dùng, hãy chọn tên khác.");
  const capSnap = await firebase.database().ref("config/regCap").once("value");
  const cap = capSnap.val();
  if (cap) {
    const countSnap = await firebase.database().ref("config/userCount").once("value");
    if ((countSnap.val() || 0) >= cap) throw new Error("Đã đủ số lượng tài khoản đăng ký cho phép.");
  }
  const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
  const uid = cred.user.uid;
  // Người ĐẦU TIÊN đăng ký trên database này tự động là Admin (chủ app) —
  // để có người mở khoá Admin Panel đầu tiên mà không cần chỉnh tay qua
  // Firebase Console. Từ người thứ 2 trở đi, vai trò mặc định là Free.
  const countResult = await firebase.database().ref("config/userCount").transaction((c) => (c || 0) + 1);
  const isFirstUser = countResult.committed && countResult.snapshot.val() === 1;
  const profile = {
    name, nameLower: key, email, role: isFirstUser ? "admin" : "free", banned: false,
    createdAt: Date.now(), upgradeRequested: false,
    uploadCount: 0, uploadDate: "", downloadCount: 0, downloadDate: "",
    emailChangeCount: 0, emailChangeDate: "",
  };
  await firebase.database().ref("users/" + uid + "/profile").set(profile);
  await firebase.database().ref("usernames/" + key).set(email);
  return cred.user;
}

async function loginWithName(nameOrEmail, password) {
  initFirebaseApp();
  const raw = (nameOrEmail || "").trim();
  if (!raw) throw new Error("Nhập tên hoặc email.");
  // Cho phép điền tên đăng nhập HOẶC email đều được — nếu có dạng email thì
  // đăng nhập thẳng bằng email, ngược lại tra usernames/{tên} -> email như cũ.
  if (raw.includes("@")) {
    await firebase.auth().signInWithEmailAndPassword(raw, password);
    return;
  }
  const key = nameKey(raw);
  const snap = await firebase.database().ref("usernames/" + key).once("value");
  const email = snap.val();
  if (!email) throw new Error("Không tìm thấy tài khoản với tên này.");
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function sendForgotPassword(email) {
  initFirebaseApp();
  await firebase.auth().sendPasswordResetEmail((email || "").trim());
}

async function logoutAccount() {
  if (profileListenerRef) { profileListenerRef.off(); profileListenerRef = null; }
  await firebase.auth().signOut();
  // Về lại trạng thái Khách "sạch" — tránh dữ liệu của acc vừa đăng xuất còn
  // sót trên máy rồi bị lỡ tay đẩy nhầm vào 1 acc khác đăng nhập sau đó.
  state = defaultState();
  saveState();
  renderCurrentTab();
}

async function loadAccountProfile(uid) {
  if (profileListenerRef) profileListenerRef.off();
  profileListenerRef = firebase.database().ref("users/" + uid + "/profile");
  return new Promise((resolve) => {
    let first = true;
    profileListenerRef.on("value", (snap) => {
      const prevRole = accountProfile ? accountProfile.role : null;
      accountProfile = snap.val();
      if (accountProfile) {
        accountRole = accountProfile.role || "free";
        if (accountProfile.banned) {
          showToast("Tài khoản của bạn đã bị khoá.");
          logoutAccount();
          if (first) resolve();
          first = false;
          return;
        }
        if (!first && prevRole && prevRole !== accountRole) {
          showToast(`Vai trò tài khoản của bạn vừa được đổi thành ${roleLabel(accountRole)}.`);
        }
      }
      refreshAccountUI();
      if (first) { first = false; resolve(); }
    });
  });
}

function initAuthWatcher() {
  initFirebaseApp();
  firebase.auth().onAuthStateChanged(async (user) => {
    currentUser = user;
    if (user) {
      await loadAccountProfile(user.uid);
      connectSync(user.uid); // sẽ tự đẩy dữ liệu local hiện có lên nếu acc chưa có dữ liệu (xem connectSync)
    } else {
      if (profileListenerRef) { profileListenerRef.off(); profileListenerRef = null; }
      accountProfile = null;
      accountRole = "guest";
      adminUnlocked = false;
      sessionStorage.removeItem(ADMIN_PASS_SESSION_KEY);
      disconnectSync();
    }
    refreshAccountUI();
    if (pendingShareCode) {
      const code = pendingShareCode;
      pendingShareCode = null;
      history.replaceState(null, "", location.pathname);
      if (user) {
        document.getElementById("wh-redeem-input").value = code;
        document.getElementById("wh-redeem-error").classList.add("hidden");
        document.getElementById("wh-redeem-overlay").classList.remove("hidden");
      } else {
        showToast(`Đăng nhập rồi mở "Nhập từ mã chia sẻ" và nhập mã ${code} để nhận danh sách được chia sẻ.`, 5000);
      }
    }
  });
}

/* ---- Giới hạn/quota theo ngày (tải lên/tải xuống thư viện, đổi email) ---- */
function checkAndBumpDailyQuota(countKey, dateKey, limit) {
  // trả về true nếu còn hạn mức và ĐÃ tăng đếm; false nếu đã hết hạn mức hôm nay
  if (!accountProfile) return false;
  const today = todayDateStr();
  let count = accountProfile[countKey] || 0;
  if (accountProfile[dateKey] !== today) count = 0;
  if (limit !== Infinity && count >= limit) return false;
  count += 1;
  firebase.database().ref(`users/${currentUser.uid}/profile`).update({ [countKey]: count, [dateKey]: today });
  accountProfile[countKey] = count;
  accountProfile[dateKey] = today;
  return true;
}
function dailyQuotaRemaining(countKey, dateKey, limit) {
  if (limit === Infinity) return Infinity;
  if (!accountProfile) return 0;
  const today = todayDateStr();
  const count = accountProfile[dateKey] === today ? (accountProfile[countKey] || 0) : 0;
  return Math.max(0, limit - count);
}
function libraryDownloadLimit() {
  return { guest: 0, free: 5, premium: Infinity, admin: Infinity }[accountRole];
}
function libraryUploadLimit() {
  return { guest: 0, free: 3, premium: Infinity, admin: Infinity }[accountRole];
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
function ensureSelected(cat, selKey) {
  const key = selKey || cat;
  const ids = state.categories[cat].map((l) => l.id);
  if (!state.selected[key]) state.selected[key] = [];
  state.selected[key] = state.selected[key].filter((id) => ids.includes(id));
  if (state.selected[key].length === 0 && ids.length) state.selected[key] = [ids[0]];
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
   - Mỗi hành động học (lật/đánh dấu thẻ, kiểm tra câu Viết)
     gọi logStudyAction(). Nếu hành động liên tiếp cách nhau < ngưỡng ngắt quãng
     (mặc định 3 phút, chỉnh được trong Cài đặt > Hệ số, min 1p max 30p — xem
     studyIdleTimeoutMs()) thì coi là đang học liên tục — "đà" (streakGain)
     tăng dần, điểm cộng vào ngày càng nhanh. Nếu cách nhau lâu hơn ngưỡng đó
     thì coi là bị ngắt quãng: trừ điểm theo thời gian vắng mặt (vắng càng lâu
     trừ càng nhanh) rồi "đà" về lại mức khởi điểm.
   - CHỈ Viết mới thực sự xây "đà" (streakGain) và cộng điểm đáng kể.
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
  applyMomentumThemeSync();
}

/* ---- Cảnh báo sắp hết thời gian giữ đà: ĐÃ TẮT — tính năng "Hệ số/đà học"
   đã bị ẩn khỏi giao diện (xem statsSnapshotForCat ở trên) nhưng phần cảnh
   báo (toast + thông báo hệ thống) trước đây vẫn chạy ngầm và tự nổi lên dù
   không còn tính năng nào để xem, gây khó chịu. Giữ lại 2 hàm rỗng (thay vì
   xoá hẳn) để không phải dọn các lời gọi rải rác (logStudyAction, cài đặt
   ngưỡng ngắt quãng, khởi động app...). ---- */
function scheduleStudyIdleWarning() {
  if (studyIdleWarnTimer) clearTimeout(studyIdleWarnTimer);
}
function fireStudyIdleWarning() { /* đã tắt */ }

/* ---- Xem nhanh số phút đã học hôm nay cạnh chữ "Nox" ----
   Bật/tắt trong Cài đặt > Thời gian học. Hiện tổng số phút đã học hôm nay
   (Viết + Nghe cộng lại — 2 mảng thời gian đang được theo dõi thực sự).
   Badge tự cập nhật mỗi giây khi đang học (qua studyTimeTick). */
function updateBrandMinutesQuickview() {
  const el = document.getElementById("brand-momentum");
  if (!el) return;
  if (!state.settings || !state.settings.showStudyMinutes) {
    el.classList.add("hidden");
    return;
  }
  ensureStudyTimeToday();
  const totalMin = Math.floor((state.studyTime.writingSec + state.studyTime.listeningSec) / 60);
  el.textContent = totalMin + "p";
  el.classList.remove("hidden");
}

/* ---- Chỉ đổi màu viền các khung theo dấu của hệ số (không đổi cả theme) ---- */
function applyMomentumThemeSync() {
  if (!state.settings || !state.settings.momentumThemeSync) {
    const level = normThemeLevel(state.themeLevel || 1);
    const palette = THEME_PALETTES[themeLockedFor(level) ? THEME_FALLBACK[level] : level];
    document.body.style.setProperty("--border", palette.border);
    return;
  }
  const positive = state.studyMomentum.score >= 0;
  document.body.style.setProperty("--border", positive ? "#22c55e" : "#ef4444");
}

/* ============================================================
   THỜI GIAN HỌC (tab Thống kê — 2 vòng tròn mục tiêu Viết/Nghe)
   - Đếm số giây thực tế người dùng đang ở tab Viết hoặc Nghe, ĐANG mở trình
     duyệt (visibilitychange), mỗi giây +1. Reset về 0 mỗi khi sang ngày mới.
   - Ghi localStorage định kỳ (không gọi saveState() mỗi giây để tránh làm
     "trôi" mãi bộ đếm chờ đồng bộ cloud — xem scheduleCloudPush); lưu đầy đủ
     (kèm đẩy lên cloud) khi rời tab/ẩn trang/trước khi đóng trang.
   ============================================================ */
function ensureStudyTimeToday() {
  if (!state.studyTimeTotal) state.studyTimeTotal = { writingSec: 0, listeningSec: 0 };
  if (!state.studyTime) {
    state.studyTime = { date: todayKey(), writingSec: 0, listeningSec: 0, writingGoalMin: 60, listeningGoalMin: 60 };
    return;
  }
  const key = todayKey();
  if (state.studyTime.date !== key) {
    state.studyTime.date = key;
    state.studyTime.writingSec = 0;
    state.studyTime.listeningSec = 0;
  }
}
function currentTrackedStudyCat() {
  if (document.visibilityState !== "visible") return null;
  const activeBtn = document.querySelector(".main-tab-btn.active");
  const tab = activeBtn ? activeBtn.dataset.tab : null;
  if (tab === "writing" || tab === "listening") return tab;
  return null;
}
let studyTimeTickCount = 0;
function studyTimeTick() {
  ensureStudyTimeToday();
  const cat = currentTrackedStudyCat();
  if (cat) {
    if (cat === "writing") {
      state.studyTime.writingSec += 1;
      state.studyTimeTotal.writingSec += 1;
    } else {
      state.studyTime.listeningSec += 1;
      state.studyTimeTotal.listeningSec += 1;
    }
    studyTimeTickCount++;
    if (studyTimeTickCount >= 10) {
      studyTimeTickCount = 0;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    }
  }
  if (wh.cat === "stats" && !document.getElementById("wh-stats-view").classList.contains("hidden")) {
    updateRingLiveValues();
  }
  if (cat && state.settings && state.settings.showStudyMinutes) updateBrandMinutesQuickview();
}
setInterval(studyTimeTick, 1000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveState();
});
window.addEventListener("beforeunload", () => {
  try { saveState(); } catch (e) { /* ignore */ }
});

/* ============================================================
   TAB SWITCHING
   ============================================================ */
const tabButtons = document.querySelectorAll(".main-tab-btn");
const sidebarPanels = document.querySelectorAll(".sidebar-panel");
const tabContents = document.querySelectorAll(".tab-content");

function switchTab(tab) {
  if (tab === "grammar" && isFeatureLocked("grammar")) {
    showToast(`Tài liệu Ngữ pháp đã bị khoá với cấp tài khoản (${roleLabel(accountRole)}) của bạn.`);
    return;
  }
  if (typeof ngheStopFullPlay === "function") ngheStopFullPlay();
  grammarSaveScrollNow(); // lưu vị trí đọc TRƯỚC khi tab bị ẩn (ẩn xong scrollTop sẽ về 0)
  tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  sidebarPanels.forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== tab));
  tabContents.forEach((c) => c.classList.toggle("hidden", c.dataset.content !== tab));
  if (tab === "flashcard") renderFlashcardTab();
  if (tab === "writing") renderWritingTab();
  if (tab === "listening") renderNgheTab();
  if (tab === "grammar") renderGrammarTab();
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
  12: { // Tử đằng
    bg: "#f0e9fb", panel: "#f9f5ff", border: "#2e1f47", borderSoft: "#e0d0f5",
    text: "#241536", textMuted: "#6f5c8a", accent: "#8b47d9", accentSoft: "#ead9fb",
    learningSoft: "#fbe6b8", knownSoft: "#d9f0da", difficultSoft: "#fbd7dc",
  },
  18: { // Đất nung — khớp màu trang Ngữ pháp (Eg_notes/grammar.html)
    bg: "#f3dcc7", panel: "#faf1e3", border: "#45566b", borderSoft: "#e3c4a6",
    text: "#45566b", textMuted: "#6b7c8f", accent: "#d4665a", accentSoft: "#ecc9b8",
    learningSoft: "#f5dcae", knownSoft: "#dcefd6", difficultSoft: "#fbd7d2",
  },
  19: { // Manga — giấy báo + mực đen, điểm nhấn đỏ (phần còn lại do CSS body[data-theme-level="19"])
    bg: "#f3efe4", panel: "#ffffff", border: "#111111", borderSoft: "#cfc8b8",
    text: "#111111", textMuted: "#5b5750", accent: "#e63946", accentSoft: "#ffe1de", accentText: "#ffffff",
    learningSoft: "#fff0a8", knownSoft: "#cdf3dc", difficultSoft: "#ffd0d0",
  },
  20: { // Đêm đầy sao (Van Gogh) — xanh cobalt đậm + vàng ánh trăng
    bg: "#0b1a3f", panel: "#13295c", border: "#7da0e0", borderSoft: "#244391",
    text: "#f7edc6", textMuted: "#a5bbe8", accent: "#f6c945", accentSoft: "#27458a", accentText: "#10204a",
    learningSoft: "#4b3f15", knownSoft: "#14473b", difficultSoft: "#4d2232",
  },
  21: { // Hacker Terminal / CRT cyberpunk — theo bản mẫu
    bg: "#0a0e0a", panel: "#0a0e0a", border: "#1a3a1a", borderSoft: "#0f240f",
    text: "#b8ffb8", textMuted: "#4a7a4a", accent: "#00ff41", accentSoft: "rgba(0,255,65,0.10)", accentText: "#050805",
    learningSoft: "rgba(255,176,0,0.12)", knownSoft: "rgba(0,255,65,0.10)", difficultSoft: "rgba(255,0,60,0.12)",
  },
  22: { // Tu tiên — ngọc bích + vàng kim (phần còn lại do CSS body[data-theme-level="22"])
    bg: "#06231f", panel: "#0c3a35", border: "#38a88c", borderSoft: "#14574b",
    text: "#e8f6ee", textMuted: "#8fc4b3", accent: "#e6c15a", accentSoft: "rgba(230,193,90,0.16)", accentText: "#06251f",
    learningSoft: "#3d3512", knownSoft: "#0f4a3a", difficultSoft: "#4a1f2a",
  },
  24: { // Genshin — giấy kem, xanh than, viền vàng
    bg: "#9cc4e8", panel: "#ece5d8", border: "#c9b27c", borderSoft: "#ddd3bd",
    text: "#3b4255", textMuted: "#6b7183", accent: "#4a5266", accentSoft: "#f6ecd0", accentText: "#ece5d8",
    learningSoft: "#f6e7bd", knownSoft: "#d8ecd4", difficultSoft: "#f6d5cf",
  },
  25: { // Ma pháp — tím đêm, rune sáng
    bg: "#0a0820", panel: "#15123a", border: "#6c55d6", borderSoft: "#2a2468",
    text: "#ece8ff", textMuted: "#a69fd6", accent: "#a98bff", accentSoft: "rgba(169,139,255,0.18)", accentText: "#07051a",
    learningSoft: "#3a3270", knownSoft: "#10404a", difficultSoft: "#4a1b3a",
  },
  23: { // Hoàng triều — đỏ thẫm, vàng kim
    bg: "#4a0b0b", panel: "#5c1212", border: "#c5972c", borderSoft: "#7a2a22",
    text: "#f5ede0", textMuted: "#d9c3a0", accent: "#d4a843", accentSoft: "rgba(212,168,67,0.16)", accentText: "#3a0808",
    learningSoft: "#6b3a12", knownSoft: "#1f4a2e", difficultSoft: "#7a1f1f",
  },
};
function cssVarName(key) {
  return "--" + key.replace(/([A-Z])/g, "-$1").toLowerCase();
}
/* ---- Giao diện: các mức còn dùng + ánh xạ cho mức đã bị gỡ (dữ liệu cũ / đồng bộ từ máy khác) ---- */
/* ---- Giao diện ĐẶC BIỆT ----
   Muốn thêm giao diện mới: (1) thêm 1 mục vào SPECIAL_THEMES, (2) thêm bảng màu vào THEME_PALETTES,
   (3) viết khối CSS body[data-theme-level="N"] + hình xem trước .tsw[data-tsw="N"] trong style.css.
   Popup chọn giao diện đặc biệt, khoá/mở theo cấp tài khoản của Admin, tải font... đều tự có. */
const SPECIAL_THEMES = [
  { level: 19, feature: "theme_manga", name: "Manga", desc: "Tranh vẽ manga / anime: giấy báo, chấm screentone, khung truyện", fallback: 1,
    featureLabel: "Giao diện Manga", featureDesc: "Giao diện phong cách tranh vẽ manga / anime (Cài đặt > Giao diện > Giao diện đặc biệt). Khoá cấp nào thì cấp đó tự quay về giao diện thường.",
    font: "https://fonts.googleapis.com/css2?family=Bangers&family=Patrick+Hand&display=swap" },
  { level: 20, feature: "theme_vangogh", name: "Đêm sao", desc: "Đêm đầy sao của Van Gogh: trời xoáy cọ, trăng khuyết, khung tranh", fallback: 4,
    featureLabel: "Giao diện Đêm đầy sao (Van Gogh)", featureDesc: "Giao diện tranh Đêm đầy sao của Vincent van Gogh (Cài đặt > Giao diện > Giao diện đặc biệt).",
    font: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,500..800;1,500..800&display=swap" },
  { level: 21, feature: "theme_terminal", name: "Terminal", desc: "Hacker Terminal / CRT cyberpunk: xanh phosphor, scanline", fallback: 4,
    featureLabel: "Giao diện Hacker Terminal", featureDesc: "Giao diện Hacker Terminal / CRT cyberpunk (Cài đặt > Giao diện > Giao diện đặc biệt).",
    font: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" },
  { level: 22, feature: "theme_tutien", name: "Tu tiên", desc: "Kiếm tiên: ngọc bích & vàng kim, trận pháp, phi kiếm, đảo bay", fallback: 4,
    featureLabel: "Giao diện Tu tiên (Kiếm tiên)", featureDesc: "Giao diện tu tiên / kiếm tiên, màu ngọc bích và vàng kim (Cài đặt > Giao diện > Giao diện đặc biệt).",
    font: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500..700;1,500..700&display=swap" },
  { level: 24, feature: "theme_genshin", name: "Genshin", desc: "Phong cách game phiêu lưu fantasy: trời xanh, mây, đảo bay, giấy kem viền vàng", fallback: 1,
    featureLabel: "Giao diện Genshin", featureDesc: "Giao diện lấy cảm hứng từ game phiêu lưu fantasy Genshin (Cài đặt > Giao diện > Giao diện đặc biệt).",
    font: "https://fonts.googleapis.com/css2?family=Lora:wght@500..700&display=swap" },
  { level: 25, feature: "theme_mapphap", name: "Ma pháp", desc: "Vòng tròn ma pháp: rune phát sáng, trận đồ xoay chậm, triệu hồi và vỡ", fallback: 4,
    featureLabel: "Giao diện Ma pháp", featureDesc: "Giao diện vòng tròn ma pháp (Cài đặt > Giao diện > Giao diện đặc biệt).",
    font: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500..700&family=Cormorant+Garamond:ital,wght@0,500..700;1,500..700&display=swap" },
  { level: 23, feature: "theme_hoangtrieu", name: "Hoàng triều", desc: "Việt phục hoàng triều: gấm đỏ rồng phượng, trống đồng Đông Sơn, hoa mai rơi", fallback: 1,
    featureLabel: "Giao diện Hoàng triều", featureDesc: "Giao diện hoàng triều Việt (Cài đặt > Giao diện > Giao diện đặc biệt).",
    font: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500..800&family=Lora:wght@400..700&display=swap" },
];
const THEME_VALID_LEVELS = [1, 2, 3, 4, 7, 8, 9, 12, 18].concat(SPECIAL_THEMES.map((t) => t.level));
const THEME_REMOVED_MAP = { 5: 4, 6: 4, 10: 4, 11: 4, 15: 4, 16: 4, 17: 4, 13: 1, 14: 1 };
function normThemeLevel(level) {
  level = Math.round(Number(level) || 1);
  if (THEME_REMOVED_MAP[level]) return THEME_REMOVED_MAP[level];
  return THEME_VALID_LEVELS.includes(level) ? level : 1;
}
/* Giao diện đặc biệt — admin khoá/mở theo cấp tài khoản (Admin > Chức năng); suy ra từ SPECIAL_THEMES */
const THEME_FEATURE = {};
const THEME_FALLBACK = {};
const THEME_FONT_URLS = {};
SPECIAL_THEMES.forEach((t) => { THEME_FEATURE[t.level] = t.feature; THEME_FALLBACK[t.level] = t.fallback; THEME_FONT_URLS[t.level] = t.font; });
function themeLockedFor(level) {
  const key = THEME_FEATURE[level];
  if (!key) return false;
  try { return isFeatureLocked(key); } catch (e) { return false; } // chưa khởi tạo xong -> coi như chưa khoá
}
function loadThemeFont(level) {
  const url = THEME_FONT_URLS[level];
  if (!url || document.getElementById("theme-font-" + level)) return;
  const link = document.createElement("link");
  link.id = "theme-font-" + level;
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}
// Màn hình loading kiểu "hacking" cho giao diện Terminal (dòng ngẫu nhiên mỗi ~240ms, giữ 22 dòng gần nhất)
function termBootFx() {
  const host = document.getElementById("app-loading");
  if (!host || host.classList.contains("hidden") || document.getElementById("term-boot-log")) return;
  const pre = document.createElement("pre");
  pre.id = "term-boot-log";
  host.appendChild(pre);
  const lines = [];
  const hh = () => new Date().toTimeString().slice(0, 8);
  const hex = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase()).join(" ");
  const gens = [
    () => `[${hh()}] > ACCESSING NODE ${Math.floor(Math.random() * 999)}...`,
    () => `[${hh()}]   0x${hex(8)}`,
    () => { const p = Math.floor(Math.random() * 100); const f = Math.round(p / 100 * 16); return `[${hh()}] ${"█".repeat(f)}${"░".repeat(16 - f)} ${p}%`; },
    () => `[${hh()}] !! BREACH INITIATED`,
    () => `[${hh()}] #! ANOMALY :: ${hex(3)}`,
    () => "",
  ];
  lines.push(`[${hh()}] > NOX :: BOOT SEQUENCE`);
  const t = setInterval(() => {
    if (host.classList.contains("hidden") || !document.body.contains(pre)) { clearInterval(t); pre.remove(); return; }
    lines.push(gens[Math.floor(Math.random() * gens.length)]());
    if (lines.length > 22) lines.shift();
    pre.textContent = lines.join("\n");
  }, 240);
  pre.textContent = lines.join("\n");
}
function applyThemeLevel(level, persist = true) {
  level = normThemeLevel(level);
  if (persist) {
    if (themeLockedFor(level)) {
      showToast("Giao diện này đã bị khoá với cấp tài khoản của bạn.");
      return;
    }
    state.themeLevel = level;
    saveState();
  }
  // Hiển thị: nếu giao diện đã lưu đang bị khoá thì tạm dùng giao diện thay thế (không ghi đè lựa chọn đã lưu)
  const shown = themeLockedFor(level) ? THEME_FALLBACK[level] : level;
  const palette = THEME_PALETTES[shown];
  // Xoá mọi biến màu do giao diện trước đặt (vd --accent-text của Terminal) trước khi đặt biến mới
  const allKeys = new Set();
  Object.values(THEME_PALETTES).forEach((p) => Object.keys(p).forEach((k) => allKeys.add(k)));
  allKeys.forEach((key) => document.body.style.removeProperty(cssVarName(key)));
  Object.keys(palette).forEach((key) => {
    document.body.style.setProperty(cssVarName(key), palette[key]);
  });
  document.body.dataset.themeLevel = shown;
  loadThemeFont(shown);
  document.querySelectorAll(".theme-dot").forEach((d) => d.classList.toggle("active", parseInt(d.dataset.level, 10) === shown));
  applyThemeLocks();
  updateSpecialThemeUI(shown);
  magicBgSync();
  hoangSync();
}
// Đánh dấu thẻ giao diện đặc biệt bị khoá (gọi lại khi tải xong cấu hình / đổi tài khoản)
function applyThemeLocks() {
  document.querySelectorAll(".theme-pick-card").forEach((card) => {
    const lvl = parseInt(card.dataset.level, 10);
    const locked = themeLockedFor(lvl);
    card.classList.toggle("locked", locked);
    card.setAttribute("aria-disabled", locked ? "true" : "false");
    const tag = card.querySelector(".theme-pick-tag");
    if (tag) tag.textContent = locked ? "Khoá" : "Đang dùng";
  });
}
// Nút "Giao diện đặc biệt" trong Cài đặt: hiện hình + tên giao diện đặc biệt đang dùng (hoặc gợi ý nếu chưa chọn)
function updateSpecialThemeUI(shown) {
  const btn = document.getElementById("theme-special-btn");
  if (!btn) return;
  const t = SPECIAL_THEMES.find((x) => x.level === shown);
  const sw = document.getElementById("theme-special-swatch");
  const sub = document.getElementById("theme-special-sub");
  btn.classList.toggle("has-special", !!t);
  if (t) {
    sw.dataset.tsw = String(t.level);
    sw.innerHTML = "";
    sub.textContent = t.name;
    btn.title = "Đang dùng: " + t.name + " — bấm để đổi giao diện đặc biệt";
  } else {
    sw.dataset.tsw = "0";
    sw.innerHTML = icon("sparkle");
    sub.textContent = "Chưa chọn — bấm để xem";
    btn.title = "Chọn giao diện đặc biệt";
  }
  document.querySelectorAll(".theme-pick-card").forEach((card) => {
    card.classList.toggle("active", parseInt(card.dataset.level, 10) === shown);
  });
}
function buildThemePicker() {
  const grid = document.getElementById("theme-picker-grid");
  if (!grid) return;
  grid.innerHTML = "";
  SPECIAL_THEMES.forEach((t) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "theme-pick-card";
    card.dataset.level = String(t.level);
    card.innerHTML = `<span class="tsw tsw-lg" data-tsw="${t.level}"></span>
      <span class="theme-pick-name">${escapeHtml(t.name)}</span>
      <span class="theme-pick-desc">${escapeHtml(t.desc)}</span>
      <span class="theme-pick-tag"></span>`;
    card.addEventListener("click", () => {
      if (themeLockedFor(t.level)) {
        showToast("Giao diện này đã bị khoá với cấp tài khoản của bạn.");
        return;
      }
      applyThemeLevel(t.level);
      closeThemePicker();
    });
    grid.appendChild(card);
  });
}
function openThemePicker() { document.getElementById("theme-picker-overlay").classList.remove("hidden"); }
function closeThemePicker() { document.getElementById("theme-picker-overlay").classList.add("hidden"); }
function refreshThemeAfterLockChange() {
  applyThemeLocks();
  const saved = normThemeLevel(state.themeLevel || 1);
  const shouldShow = themeLockedFor(saved) ? THEME_FALLBACK[saved] : saved;
  if (parseInt(document.body.dataset.themeLevel, 10) !== shouldShow) applyThemeLevel(saved, false);
}
document.querySelectorAll(".theme-dot").forEach((dot) => {
  dot.addEventListener("click", () => applyThemeLevel(parseInt(dot.dataset.level, 10)));
});
buildThemePicker();
document.getElementById("theme-special-btn").addEventListener("click", openThemePicker);
document.getElementById("theme-picker-close").addEventListener("click", closeThemePicker);
document.getElementById("theme-picker-overlay").addEventListener("click", (e) => {
  if (e.target.id === "theme-picker-overlay") closeThemePicker();
});
// Esc đóng popup chọn giao diện trước (capture) để không kéo theo các phím tắt Esc khác
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !document.getElementById("theme-picker-overlay").classList.contains("hidden")) {
    e.stopPropagation();
    closeThemePicker();
  }
}, true);
/* ---- Ma pháp: lớp nền trận đồ + hạt (particle) ---- */
const MC_BG_SPECS = [{"s": 125, "x": 88, "y": 90, "o": 0.3, "rd": 150, "rv": false, "t": "stat", "cy": 30, "dl": 0, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#b9a3ff\" stroke-width=\"0.6\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M224.5 13.6L225.5 6.7M248.7 18.4L250.5 11.6M271.9 26.3L274.6 19.8M294 37.2L297.5 31.1M314.4 50.8L318.7 45.3M332.9 67.1L337.9 62.1M349.2 85.6L354.7 81.3M362.8 106L368.9 102.5M373.7 128.1L380.2 125.4M381.6 151.3L388.4 149.5M386.4 175.5L393.3 174.5M388 200L395 200M386.4 224.5L393.3 225.5M381.6 248.7L388.4 250.5M373.7 271.9L380.2 274.6M362.8 294L368.9 297.5M349.2 314.4L354.7 318.7M332.9 332.9L337.9 337.9M314.4 349.2L318.7 354.7M294 362.8L297.5 368.9M271.9 373.7L274.6 380.2M248.7 381.6L250.5 388.4M224.5 386.4L225.5 393.3M200 388L200 395M175.5 386.4L174.5 393.3M151.3 381.6L149.5 388.4M128.1 373.7L125.4 380.2M106 362.8L102.5 368.9M85.6 349.2L81.3 354.7M67.1 332.9L62.1 337.9M50.8 314.4L45.3 318.7M37.2 294L31.1 297.5M26.3 271.9L19.8 274.6M18.4 248.7L11.6 250.5M13.6 224.5L6.7 225.5M12 200L5 200M13.6 175.5L6.7 174.5M18.4 151.3L11.6 149.5M26.3 128.1L19.8 125.4M37.2 106L31.1 102.5M50.8 85.6L45.3 81.3M67.1 67.1L62.1 62.1M85.6 50.8L81.3 45.3M106 37.2L102.5 31.1M128.1 26.3L125.4 19.8M151.3 18.4L149.5 11.6M175.5 13.6L174.5 6.7\" stroke=\"#b9a3ff\" stroke-width=\"0.6\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"158\" stroke=\"#b9a3ff\" stroke-width=\"0.8\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M220.5 46.4L217.8 66.2M214.1 51.3L219 57.7M225.4 52.8L219 57.7M246.8 52.3L238.4 60.1M238.4 60.1L240.8 71.3M246.8 52.3L249.2 63.5M249.2 63.5L240.8 71.3M268 60.7L271.6 72.2M271.6 72.2L260.1 75.8M268 60.7L258.8 78.4M291.1 74.6L279 90.4M291.1 74.6L291.8 87.7M291.8 87.7L279 90.4M311.5 92.3L296.8 105.8M304.2 99.1L314.1 101.5M300 102.9L309.9 105.4M330.8 117L314 127.6M327.2 119.2L333.9 121.8M322.4 122.3L329.1 124.8M341.1 135.7L327 153.8M345.4 146.2L322.7 143.3M330.7 165.4L351.3 166.7M351.3 166.7L333.1 176.5M339.6 166.4L340.8 171.9M354.6 189.2L334.7 190.1M354.6 189.2L347.9 198.1M347.9 198.1L341.8 189.8M353.6 220.5L333.8 217.8M354.3 214.8L352.8 226.1M334.6 212.2L333.1 223.5M347.7 246.8L328.7 240.8M340.9 244.7L348.1 241M335.5 243L339.2 250.1M339.3 268L321.6 258.8M330.5 263.4L335.4 275.6M330.5 263.4L317.7 266.3M325.4 291.1L309.6 279M320.2 297.9L304.4 285.8M322 288.5L307.8 288.4M306.8 308.5L298.4 316.1M302.6 312.3L291.1 299.7M295.3 295.9L290.7 307.7M283 330.8L272.4 314M284.8 323L276.9 321.2M275.2 329.1L276.9 321.2M259.1 343.3L260.5 331.9M260.5 331.9L251.5 324.8M259.1 343.3L250 336.2M250 336.2L251.5 324.8M237.5 350.4L227.3 343.9M227.3 343.9L233.8 333.7M237.5 350.4L233.2 331M210.8 354.6L209.9 334.7M210.8 354.6L201.8 345M201.8 345L209.9 334.7M183.8 354.2L186.4 334.4M185.1 344.3L175.9 348.8M185.8 338.6L176.6 343.2M153.2 347.7L159.2 328.7M154.5 343.6L147.7 346M156.2 338.2L149.5 340.6M133.3 340L132.4 317M123.2 334.7L142.5 322.3M122.1 310.5L105.5 322.8M105.5 322.8L113.1 303.5M114.7 315.5L110.2 312M88.5 307.7L103.2 294.2M88.5 307.7L88 296.5M88 296.5L97.9 299M69.2 283L86 272.4M72.2 287.8L66.1 278.2M89.1 277.2L83 267.6M56.7 259.1L75.2 251.5M63.3 256.4L60.2 263.8M68.6 254.2L61.2 251.1M49.6 237.5L69 233.2M59.3 235.3L47.8 229.1M59.3 235.3L67.2 224.8M45.4 210.8L65.3 209.9M45 202.2L64.9 201.4M49.6 210.6L60.6 201.6M48.5 185.5L50 174.3M49.2 179.9L66.2 182.2M65.4 187.8L61.3 175.8M52.3 153.2L71.3 159.2M56 160.3L63.1 156.6M59.4 149.5L63.1 156.6M62.7 128.2L68.9 137.9M68.9 137.9L80.3 137.5M62.7 128.2L74.1 127.8M74.1 127.8L80.3 137.5M74.6 108.9L86.6 107.3M86.6 107.3L88.1 119.3M74.6 108.9L90.4 121M92.3 88.5L105.8 103.2M92.3 88.5L105.4 90.1M105.4 90.1L105.8 103.2M113.4 71.5L124 88.3M118.7 79.9L122.8 70.5M121.7 84.7L125.9 75.3M140.9 56.7L148.5 75.2M142.6 60.7L146.2 54.6M144.7 66L148.4 59.8M161.1 49.9L176.5 66.9M172.3 47.4L165.4 69.3M188.6 65.3L193.5 45.2M193.5 45.2L200 64.9M191.1 56.7L196.8 56.4\" stroke=\"#f0d58a\" stroke-width=\"0.8\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"200\" cy=\"200\" r=\"132\" stroke=\"#b9a3ff\" stroke-width=\"1.1\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><path d=\"M200 73L274.7 302.8L79.2 160.7L320.8 160.7L125.3 302.8Z\" stroke=\"#f0d58a\" stroke-width=\"1.1\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><path d=\"M234.9 139.5L260.5 234.9L165.1 260.5L139.5 165.1ZM267.5 181.9L218.1 267.5L132.5 218.1L181.9 132.5Z\" stroke=\"#b9a3ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"200\" cy=\"200\" r=\"63.5\" stroke=\"#b9a3ff\" stroke-width=\"1\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><path d=\"M200 169.5L200 136.5M211.7 171.8L224.3 141.3M221.6 178.4L244.9 155.1M228.2 188.3L258.7 175.7M230.5 200L263.5 200M228.2 211.7L258.7 224.3M221.6 221.6L244.9 244.9M211.7 228.2L224.3 258.7M200 230.5L200 263.5M188.3 228.2L175.7 258.7M178.4 221.6L155.1 244.9M171.8 211.7L141.3 224.3M169.5 200L136.5 200M171.8 188.3L141.3 175.7M178.4 178.4L155.1 155.1M188.3 171.8L175.7 141.3\" stroke=\"#b9a3ff\" stroke-width=\"0.7\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"200\" cy=\"200\" r=\"30.5\" stroke=\"#f0d58a\" stroke-width=\"1.1\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/></g></svg>"}, {"s": 86, "x": 6, "y": 8, "o": 0.26, "rd": 110, "rv": true, "t": "stat", "cy": 30, "dl": 0, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#8fe0ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><path d=\"M200 30L299.9 337.5L38.3 147.5L361.7 147.5L100.1 337.5Z\" stroke=\"#d9ccff\" stroke-width=\"1.1\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><circle cx=\"200\" cy=\"30\" r=\"6.8\" stroke=\"#8fe0ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"361.7\" cy=\"147.5\" r=\"6.8\" stroke=\"#8fe0ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><circle cx=\"299.9\" cy=\"337.5\" r=\"6.8\" stroke=\"#8fe0ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"100.1\" cy=\"337.5\" r=\"6.8\" stroke=\"#8fe0ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><circle cx=\"38.3\" cy=\"147.5\" r=\"6.8\" stroke=\"#8fe0ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><path d=\"M246.8 119L246.8 281L106.5 200ZM293.5 200L153.2 281L153.2 119Z\" stroke=\"#8fe0ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"200\" cy=\"200\" r=\"85\" stroke=\"#8fe0ff\" stroke-width=\"1\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><path d=\"M200 159.2L200 115M215.6 162.3L232.5 121.5M228.8 171.2L260.1 139.9M237.7 184.4L278.5 167.5M240.8 200L285 200M237.7 215.6L278.5 232.5M228.8 228.8L260.1 260.1M215.6 237.7L232.5 278.5M200 240.8L200 285M184.4 237.7L167.5 278.5M171.2 228.8L139.9 260.1M162.3 215.6L121.5 232.5M159.2 200L115 200M162.3 184.4L121.5 167.5M171.2 171.2L139.9 139.9M184.4 162.3L167.5 121.5\" stroke=\"#8fe0ff\" stroke-width=\"0.7\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"200\" cy=\"200\" r=\"40.8\" stroke=\"#d9ccff\" stroke-width=\"1.1\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/></g></svg>"}, {"s": 52, "x": 78, "y": 14, "o": 0.4, "rd": 70, "rv": false, "t": "draw", "cy": 32, "dl": 0, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#b9a3ff\" stroke-width=\"2.5\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#b9a3ff\" stroke-width=\"1\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M209.8 12.3L210.2 5.3M219.7 13L220.4 6.1M229.4 14.3L230.5 7.4M239.1 16.1L240.5 9.3M248.7 18.4L250.5 11.6M258.1 21.2L260.3 14.5M267.4 24.5L269.9 18M276.5 28.3L279.3 21.9M285.4 32.5L288.5 26.3M294 37.2L297.5 31.1M302.4 42.3L306.2 36.5M310.5 47.9L314.6 42.2M318.3 53.9L322.7 48.5M325.8 60.3L330.5 55.1M332.9 67.1L337.9 62.1M339.7 74.2L344.9 69.5M346.1 81.7L351.5 77.3M352.1 89.5L357.8 85.4M357.7 97.6L363.5 93.8M362.8 106L368.9 102.5M367.5 114.6L373.7 111.5M371.7 123.5L378.1 120.7M375.5 132.6L382 130.1M378.8 141.9L385.5 139.7M381.6 151.3L388.4 149.5M383.9 160.9L390.7 159.5M385.7 170.6L392.6 169.5M387 180.3L393.9 179.6M387.7 190.2L394.7 189.8M388 200L395 200M387.7 209.8L394.7 210.2M387 219.7L393.9 220.4M385.7 229.4L392.6 230.5M383.9 239.1L390.7 240.5M381.6 248.7L388.4 250.5M378.8 258.1L385.5 260.3M375.5 267.4L382 269.9M371.7 276.5L378.1 279.3M367.5 285.4L373.7 288.5M362.8 294L368.9 297.5M357.7 302.4L363.5 306.2M352.1 310.5L357.8 314.6M346.1 318.3L351.5 322.7M339.7 325.8L344.9 330.5M332.9 332.9L337.9 337.9M325.8 339.7L330.5 344.9M318.3 346.1L322.7 351.5M310.5 352.1L314.6 357.8M302.4 357.7L306.2 363.5M294 362.8L297.5 368.9M285.4 367.5L288.5 373.7M276.5 371.7L279.3 378.1M267.4 375.5L269.9 382M258.1 378.8L260.3 385.5M248.7 381.6L250.5 388.4M239.1 383.9L240.5 390.7M229.4 385.7L230.5 392.6M219.7 387L220.4 393.9M209.8 387.7L210.2 394.7M200 388L200 395M190.2 387.7L189.8 394.7M180.3 387L179.6 393.9M170.6 385.7L169.5 392.6M160.9 383.9L159.5 390.7M151.3 381.6L149.5 388.4M141.9 378.8L139.7 385.5M132.6 375.5L130.1 382M123.5 371.7L120.7 378.1M114.6 367.5L111.5 373.7M106 362.8L102.5 368.9M97.6 357.7L93.8 363.5M89.5 352.1L85.4 357.8M81.7 346.1L77.3 351.5M74.2 339.7L69.5 344.9M67.1 332.9L62.1 337.9M60.3 325.8L55.1 330.5M53.9 318.3L48.5 322.7M47.9 310.5L42.2 314.6M42.3 302.4L36.5 306.2M37.2 294L31.1 297.5M32.5 285.4L26.3 288.5M28.3 276.5L21.9 279.3M24.5 267.4L18 269.9M21.2 258.1L14.5 260.3M18.4 248.7L11.6 250.5M16.1 239.1L9.3 240.5M14.3 229.4L7.4 230.5M13 219.7L6.1 220.4M12.3 209.8L5.3 210.2M12 200L5 200M12.3 190.2L5.3 189.8M13 180.3L6.1 179.6M14.3 170.6L7.4 169.5M16.1 160.9L9.3 159.5M18.4 151.3L11.6 149.5M21.2 141.9L14.5 139.7M24.5 132.6L18 130.1M28.3 123.5L21.9 120.7M32.5 114.6L26.3 111.5M37.2 106L31.1 102.5M42.3 97.6L36.5 93.8M47.9 89.5L42.2 85.4M53.9 81.7L48.5 77.3M60.3 74.2L55.1 69.5M67.1 67.1L62.1 62.1M74.2 60.3L69.5 55.1M81.7 53.9L77.3 48.5M89.5 47.9L85.4 42.2M97.6 42.3L93.8 36.5M106 37.2L102.5 31.1M114.6 32.5L111.5 26.3M123.5 28.3L120.7 21.9M132.6 24.5L130.1 18M141.9 21.2L139.7 14.5M151.3 18.4L149.5 11.6M160.9 16.1L159.5 9.3M170.6 14.3L169.5 7.4M180.3 13L179.6 6.1M190.2 12.3L189.8 5.3\" stroke=\"#b9a3ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"159.8\" stroke=\"#b9a3ff\" stroke-width=\"1.4\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M203.6 43.3L203.1 65.8M203.5 48.1L210 43.4M203.3 54.6L209.9 49.9M226 45.3L234 70M238.6 47.9L221.4 67.4M245.4 73.5L260 55.2M260 55.2L257.3 78.5M252 65.8L258 68.3M281.5 66L269.2 84.9M281.5 66L285.2 78M285.2 78L273.6 78.2M308.2 86.6L292.7 102.9M303.6 82.1L312.9 91M288 98.5L297.3 107.4M327.2 108.4L308.9 121.6M320.7 113.1L322.2 104.1M315.5 116.9L324.5 118.4M339.8 129L319.4 138.6M329.6 133.8L343.9 137.7M329.6 133.8L323.5 147.3M350.5 155.9L328.7 161.6M352.9 165.2L331.1 170.9M345.8 157.1L335.8 169.7M352.7 182.9L353.6 195.8M353.2 189.3L333.9 190.7M333.4 184.2L340.8 196.7M355.7 218L333.3 215.4M350.1 210.9L342.9 216.5M348.6 223.7L342.9 216.5M349.8 246.3L340.9 236.8M340.9 236.8L328.2 239.7M349.8 246.3L337.1 249.2M337.1 249.2L328.2 239.7M341 268.8L327.9 272.8M327.9 272.8L323.8 259.8M341 268.8L321 258.3M325.9 293.5L308.2 279.5M325.9 293.5L311.1 294.1M311.1 294.1L308.2 279.5M306.6 315.1L291.8 298M299.2 306.5L296.1 317.8M294.9 301.7L291.9 312.9M279.5 335.1L268 315.7M277 331L273.9 338.4M273.7 325.4L270.6 332.8M259.3 345.2L239.5 328.4M247.2 349.6L251.7 324M228 331.4L225.3 354.7M225.3 354.7L215.3 333.5M226.4 341.5L220 342.5M201.2 356.8L201.8 334.3M201.2 356.8L191.8 348.6M191.8 348.6L201.6 342.3M167.7 353.4L172.3 331.3M174 354.7L161.4 352.1M178.6 332.6L166 330M140 344.8L148.7 324M143.1 337.4L146.6 345.8M145.6 331.4L137.2 334.9M118.5 334L130.8 315.1M124.7 324.5L110.4 328.7M124.7 324.5L122.7 309.8M95.3 316.7L110.8 300.4M88.3 310.1L103.8 293.7M98.6 313.2L100.5 297.2M79.2 294.9L71.6 284.5M75.4 289.7L91.1 278.4M94.9 283.6L82.1 276.9M58.1 266.6L78.5 257.1M66.7 269.7L69.8 261.2M61.2 258.1L69.8 261.2M48.3 239.4L60.8 242.8M60.8 242.8L70.1 233.8M48.3 239.4L57.6 230.4M57.6 230.4L70.1 233.8M43.9 215.7L52.9 205.4M52.9 205.4L63.2 214.4M43.9 215.7L66.5 214.1M43.7 186.8L66.1 189.4M43.7 186.8L56 178.5M56 178.5L66.1 189.4M48.8 158.3L70.4 165M59.6 161.6L56.3 150.5M65.8 163.5L62.4 152.4M61.3 126.9L81.3 137.5M65.6 129.2L64.3 121.2M71.3 132.2L70 124.2M73.1 107.7L98.8 111.6M81.1 97.6L90.8 121.8M107 103L97.1 81.8M97.1 81.8L116.7 94.6M103.1 93.6L108 89.4M116.4 67.3L127.8 86.8M116.4 67.3L128.8 69.4M128.8 69.4L123.7 79.8M146.7 52.6L154.4 73.8M140.7 54.8L152.8 50.4M148.3 76L160.5 71.6M174.7 45.3L178.4 67.6M176 53.2L168.6 47.9M177.1 59.6L182.4 52.2\" stroke=\"#8fe0ff\" stroke-width=\"1.3\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"200\" cy=\"200\" r=\"131.2\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><path d=\"M200 73.8L263.1 309.3L90.7 136.9L326.2 200L90.7 263.1L263.1 90.7L200 326.2L136.9 90.7L309.3 263.1L73.8 200L309.3 136.9L136.9 309.3Z\" stroke=\"#8fe0ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><circle cx=\"200\" cy=\"73.8\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"263.1\" cy=\"90.7\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><circle cx=\"309.3\" cy=\"136.9\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"326.2\" cy=\"200\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/><circle cx=\"309.3\" cy=\"263.1\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:11\"/><circle cx=\"263.1\" cy=\"309.3\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:12\"/><circle cx=\"200\" cy=\"326.2\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:13\"/><circle cx=\"136.9\" cy=\"309.3\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:14\"/><circle cx=\"90.7\" cy=\"263.1\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:15\"/><circle cx=\"73.8\" cy=\"200\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:16\"/><circle cx=\"90.7\" cy=\"136.9\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:17\"/><circle cx=\"136.9\" cy=\"90.7\" r=\"7\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:18\"/><path d=\"M249.1 150.9L249.1 249.1L150.9 249.1L150.9 150.9ZM269.4 200L200 269.4L130.6 200L200 130.6Z\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:19\"/><circle cx=\"200\" cy=\"200\" r=\"63.1\" stroke=\"#b9a3ff\" stroke-width=\"1.6\" pathLength=\"1\" class=\"d\" style=\"--i:20\"/><path d=\"M200 169.7L200 136.9M211.6 172L224.1 141.7M221.4 178.6L244.6 155.4M228 188.4L258.3 175.9M230.3 200L263.1 200M228 211.6L258.3 224.1M221.4 221.4L244.6 244.6M211.6 228L224.1 258.3M200 230.3L200 263.1M188.4 228L175.9 258.3M178.6 221.4L155.4 244.6M172 211.6L141.7 224.1M169.7 200L136.9 200M172 188.4L141.7 175.9M178.6 178.6L155.4 155.4M188.4 172L175.9 141.7\" stroke=\"#b9a3ff\" stroke-width=\"1.2\" pathLength=\"1\" class=\"d\" style=\"--i:21\"/><circle cx=\"200\" cy=\"200\" r=\"30.3\" stroke=\"#8fe0ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:22\"/></g></svg>"}, {"s": 38, "x": 14, "y": 78, "o": 0.42, "rd": 55, "rv": true, "t": "erase", "cy": 28, "dl": 4, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#e9a8ff\" stroke-width=\"3.5\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#e9a8ff\" stroke-width=\"1.4\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M224.5 13.6L225.5 6.7M248.7 18.4L250.5 11.6M271.9 26.3L274.6 19.8M294 37.2L297.5 31.1M314.4 50.8L318.7 45.3M332.9 67.1L337.9 62.1M349.2 85.6L354.7 81.3M362.8 106L368.9 102.5M373.7 128.1L380.2 125.4M381.6 151.3L388.4 149.5M386.4 175.5L393.3 174.5M388 200L395 200M386.4 224.5L393.3 225.5M381.6 248.7L388.4 250.5M373.7 271.9L380.2 274.6M362.8 294L368.9 297.5M349.2 314.4L354.7 318.7M332.9 332.9L337.9 337.9M314.4 349.2L318.7 354.7M294 362.8L297.5 368.9M271.9 373.7L274.6 380.2M248.7 381.6L250.5 388.4M224.5 386.4L225.5 393.3M200 388L200 395M175.5 386.4L174.5 393.3M151.3 381.6L149.5 388.4M128.1 373.7L125.4 380.2M106 362.8L102.5 368.9M85.6 349.2L81.3 354.7M67.1 332.9L62.1 337.9M50.8 314.4L45.3 318.7M37.2 294L31.1 297.5M26.3 271.9L19.8 274.6M18.4 248.7L11.6 250.5M13.6 224.5L6.7 225.5M12 200L5 200M13.6 175.5L6.7 174.5M18.4 151.3L11.6 149.5M26.3 128.1L19.8 125.4M37.2 106L31.1 102.5M50.8 85.6L45.3 81.3M67.1 67.1L62.1 62.1M85.6 50.8L81.3 45.3M106 37.2L102.5 31.1M128.1 26.3L125.4 19.8M151.3 18.4L149.5 11.6M175.5 13.6L174.5 6.7\" stroke=\"#e9a8ff\" stroke-width=\"1.3\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"150.7\" stroke=\"#e9a8ff\" stroke-width=\"1.9\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M216.4 53.1L213.7 72.8M216.4 53.1L223.5 64.1M223.5 64.1L213.7 72.8M271.4 70.6L261.3 87.7M266.3 79.1L276.5 78.6M263.5 84L273.7 83.5M318 111.2L302.2 123.1M314.6 113.7L321.4 115.7M310.1 117.1L316.9 119.1M341.6 157.6L325.3 173.5M344.4 168.6L322.4 162.6M327.4 212.3L346.3 220.6M346.3 220.6L325.8 223.5M335.4 216.3L334.7 221.9M329.4 271.4L312.3 261.3M329.4 271.4L319 275.1M319 275.1L318.4 264.9M288.8 318L276.9 302.2M293.4 314.6L284.3 321.4M281.4 298.8L272.4 305.6M236.9 343L232 323.8M235.1 336.2L242 340.2M233.7 330.7L229.7 337.6M183.6 346.9L186.3 327.2M185 337L175.2 345.7M185 337L177.9 326M128.6 329.4L138.7 312.3M121.3 325.1L131.4 308M130.8 325.7L129.2 311.7M87.7 291.7L80.8 282.6M84.2 287.1L97.8 276.9M101.2 281.4L89.9 275.8M57 236.9L76.2 232M63.9 241L67.9 234.1M61 230L67.9 234.1M53.7 179.4L62.8 186.4M62.8 186.4L73.4 182.1M53.7 179.4L64.3 175.1M64.3 175.1L73.4 182.1M70.6 128.6L82.2 125.6M82.2 125.6L85.2 137.2M70.6 128.6L87.7 138.7M107.8 84.5L119.7 100.4M107.8 84.5L120.5 87.3M120.5 87.3L119.7 100.4M159 58L163.9 77.2M161.5 67.6L168.3 60M162.9 73.1L169.7 65.5\" stroke=\"#f0d58a\" stroke-width=\"1.7\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"200\" cy=\"200\" r=\"124.9\" stroke=\"#e9a8ff\" stroke-width=\"2.5\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><path d=\"M200 80.1L259.9 303.8L96.2 140.1L319.9 200L96.2 259.9L259.9 96.2L200 319.9L140.1 96.2L303.8 259.9L80.1 200L303.8 140.1L140.1 303.8Z\" stroke=\"#f0d58a\" stroke-width=\"2.5\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><circle cx=\"200\" cy=\"80.1\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"259.9\" cy=\"96.2\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><circle cx=\"303.8\" cy=\"140.1\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"319.9\" cy=\"200\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/><circle cx=\"303.8\" cy=\"259.9\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:11\"/><circle cx=\"259.9\" cy=\"303.8\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:12\"/><circle cx=\"200\" cy=\"319.9\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:13\"/><circle cx=\"140.1\" cy=\"303.8\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:14\"/><circle cx=\"96.2\" cy=\"259.9\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:15\"/><circle cx=\"80.1\" cy=\"200\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:16\"/><circle cx=\"96.2\" cy=\"140.1\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:17\"/><circle cx=\"140.1\" cy=\"96.2\" r=\"7.8\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:18\"/><path d=\"M200 134.1L265.9 200L200 265.9L134.1 200Z\" stroke=\"#e9a8ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:19\"/><circle cx=\"200\" cy=\"200\" r=\"59.9\" stroke=\"#e9a8ff\" stroke-width=\"2.2\" pathLength=\"1\" class=\"d\" style=\"--i:20\"/><path d=\"M200 171.2L200 140.1M214.4 175.1L230 148.1M224.9 185.6L251.9 170M228.8 200L259.9 200M224.9 214.4L251.9 230M214.4 224.9L230 251.9M200 228.8L200 259.9M185.6 224.9L170 251.9M175.1 214.4L148.1 230M171.2 200L140.1 200M175.1 185.6L148.1 170M185.6 175.1L170 148.1\" stroke=\"#e9a8ff\" stroke-width=\"1.6\" pathLength=\"1\" class=\"d\" style=\"--i:21\"/><circle cx=\"200\" cy=\"200\" r=\"28.8\" stroke=\"#f0d58a\" stroke-width=\"2.5\" pathLength=\"1\" class=\"d\" style=\"--i:22\"/></g></svg>"}, {"s": 66, "x": 42, "y": 108, "o": 0.34, "rd": 130, "rv": true, "t": "draw", "cy": 44, "dl": 8, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#8fe0ff\" stroke-width=\"2\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#8fe0ff\" stroke-width=\"0.8\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M216.4 12.7L217 5.7M232.6 14.9L233.9 8M248.7 18.4L250.5 11.6M264.3 23.3L266.7 16.8M279.5 29.6L282.4 23.3M294 37.2L297.5 31.1M307.8 46L311.8 40.3M320.8 56L325.3 50.6M332.9 67.1L337.9 62.1M344 79.2L349.4 74.7M354 92.2L359.7 88.2M362.8 106L368.9 102.5M370.4 120.5L376.7 117.6M376.7 135.7L383.2 133.3M381.6 151.3L388.4 149.5M385.1 167.4L392 166.1M387.3 183.6L394.3 183M388 200L395 200M387.3 216.4L394.3 217M385.1 232.6L392 233.9M381.6 248.7L388.4 250.5M376.7 264.3L383.2 266.7M370.4 279.5L376.7 282.4M362.8 294L368.9 297.5M354 307.8L359.7 311.8M344 320.8L349.4 325.3M332.9 332.9L337.9 337.9M320.8 344L325.3 349.4M307.8 354L311.8 359.7M294 362.8L297.5 368.9M279.5 370.4L282.4 376.7M264.3 376.7L266.7 383.2M248.7 381.6L250.5 388.4M232.6 385.1L233.9 392M216.4 387.3L217 394.3M200 388L200 395M183.6 387.3L183 394.3M167.4 385.1L166.1 392M151.3 381.6L149.5 388.4M135.7 376.7L133.3 383.2M120.5 370.4L117.6 376.7M106 362.8L102.5 368.9M92.2 354L88.2 359.7M79.2 344L74.7 349.4M67.1 332.9L62.1 337.9M56 320.8L50.6 325.3M46 307.8L40.3 311.8M37.2 294L31.1 297.5M29.6 279.5L23.3 282.4M23.3 264.3L16.8 266.7M18.4 248.7L11.6 250.5M14.9 232.6L8 233.9M12.7 216.4L5.7 217M12 200L5 200M12.7 183.6L5.7 183M14.9 167.4L8 166.1M18.4 151.3L11.6 149.5M23.3 135.7L16.8 133.3M29.6 120.5L23.3 117.6M37.2 106L31.1 102.5M46 92.2L40.3 88.2M56 79.2L50.6 74.7M67.1 67.1L62.1 62.1M79.2 56L74.7 50.6M92.2 46L88.2 40.3M106 37.2L102.5 31.1M120.5 29.6L117.6 23.3M135.7 23.3L133.3 16.8M151.3 18.4L149.5 11.6M167.4 14.9L166.1 8M183.6 12.7L183 5.7\" stroke=\"#8fe0ff\" stroke-width=\"0.7\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"165.2\" stroke=\"#8fe0ff\" stroke-width=\"1.1\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M196.8 37.8L196.5 60.5M206.5 37.9L206.3 60.6M196.7 42.7L206.3 55.8M226.2 43.1L238.9 45.8M232.6 44.5L228.6 63.5M222.2 62.2L236.3 58.5M263.6 50.8L254.7 71.7M255 54.2L258.5 62.8M267 59.3L258.5 62.8M291.5 66.1L279.7 71.8M279.7 71.8L278.6 84.9M291.5 66.1L290.4 79.1M290.4 79.1L278.6 84.9M312.4 83L312.3 96.8M312.3 96.8L298.5 96.7M312.4 83L296.2 98.9M333.1 107.2L314 119.6M333.1 107.2L328.9 121.6M328.9 121.6L314 119.6M348.6 134.9L327.5 143.4M338.1 139.2L347.7 145.8M332.1 141.6L341.7 148.2M359.4 170L337 174.2M354.6 170.9L360.6 176.4M348.2 172.1L354.2 177.6M362.2 195.1L339.4 207.9M362.1 208.1L339.5 194.9M337.8 222.2L358.7 233.2M358.7 233.2L335.1 234.9M346.7 227.4L345.3 233.8M351.1 259.1L330.2 250.2M351.1 259.1L339.8 264.9M339.8 264.9L337.6 253.4M333.9 291.5L315.1 278.6M337.6 286.1L330.3 296.8M318.8 273.3L311.5 284M313.5 315.8L297.6 299.6M307.8 310L317 310.1M303.3 305.4L303.2 314.6M292.8 333.1L280.4 314M286.6 323.6L284.6 338.4M286.6 323.6L272.2 319.4M265.1 348.6L256.6 327.5M256 352.3L247.5 331.2M263.2 344.1L249.3 335.7M235.8 355L223 357.4M229.4 356.2L225.8 337M232.2 335.8L220.6 344.6M198.4 362.2L198.6 339.4M204.9 355.7L198.5 349.2M191.9 355.6L198.5 349.2M166.8 358.7L175.4 348.9M175.4 348.9L171.4 336.5M166.8 358.7L162.7 346.3M162.7 346.3L171.4 336.5M140.9 351.1L135.8 338.3M135.8 338.3L148.6 333.2M140.9 351.1L149.8 330.2M112.6 336.7L125.4 317.9M112.6 336.7L110.9 321.8M110.9 321.8L125.4 317.9M87.6 317L103.8 301.1M95.7 309L84.2 306.6M100.3 304.5L88.9 302.1M64.3 288.7L83.3 276.3M68.3 286.1L60.7 283.3M73.8 282.5L66.1 279.7M52 266.6L68.2 246M47.1 254.5L73.1 258.1M64.2 232.2L40.6 230M40.6 230L61.8 219.4M54 230.8L52.8 224.4M37.8 203.2L60.5 203.5M37.8 203.2L46 193.6M46 193.6L52.4 203.4M41.3 166.8L63.5 171.4M39.9 173.1L42.6 160.4M62.2 177.8L64.9 165.1M50.8 136.4L71.7 145.3M58.3 139.6L49.8 143M64.3 142.2L60.8 133.6M63.3 112.6L82.1 125.4M72.7 119L68.8 104.5M72.7 119L87.6 117.3M83 87.6L98.9 103.8M90 80.8L105.9 97M86.4 91.1L102.5 93.5M107.6 70.5L118.5 63.4M113.1 67L123.7 83.3M118.3 86.8L125.6 74.3M139.5 49.6L147.9 70.7M135.9 58L144.3 61.6M147.9 53.2L144.3 61.6M170 40.6L165.7 53M165.7 53L174.2 63M170 40.6L178.5 50.6M178.5 50.6L174.2 63\" stroke=\"#b9a3ff\" stroke-width=\"1\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"200\" cy=\"200\" r=\"136.4\" stroke=\"#8fe0ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><path d=\"M200 68.6L265.7 313.8L86.2 134.3L331.4 200L86.2 265.7L265.7 86.2L200 331.4L134.3 86.2L313.8 265.7L68.6 200L313.8 134.3L134.3 313.8Z\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><path d=\"M236.1 137.4L236.1 262.6L127.7 200Z\" stroke=\"#8fe0ff\" stroke-width=\"1.2\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"200\" cy=\"200\" r=\"65.7\" stroke=\"#8fe0ff\" stroke-width=\"1.3\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><path d=\"M200 168.5L200 134.3M215.8 172.7L232.9 143.1M227.3 184.2L256.9 167.1M231.5 200L265.7 200M227.3 215.8L256.9 232.9M215.8 227.3L232.9 256.9M200 231.5L200 265.7M184.2 227.3L167.1 256.9M172.7 215.8L143.1 232.9M168.5 200L134.3 200M172.7 184.2L143.1 167.1M184.2 172.7L167.1 143.1\" stroke=\"#8fe0ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"200\" cy=\"200\" r=\"31.5\" stroke=\"#b9a3ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/></g></svg>"}, {"s": 28, "x": 92, "y": 55, "o": 0.45, "rd": 40, "rv": false, "t": "erase", "cy": 24, "dl": 2, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#d9ccff\" stroke-width=\"4.7\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"154.2\" stroke=\"#d9ccff\" stroke-width=\"2.6\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M203.4 48.8L202.4 68.6M202.9 58.7L211.7 53.5M202.6 64.4L211.4 59.2M264.9 63.5L256.3 81.4M263 67.3L270 65.9M260.6 72.4L267.6 71M308.4 94.5L301.2 116.2M316 102.9L293.6 107.8M321.8 150.6L342.4 149.3M342.4 149.3L325.6 161.3M330.8 150.5L332.7 155.8M351.2 203.4L331.4 202.4M351.2 203.4L343.7 211.6M343.7 211.6L338.4 202.8M336.5 264.9L318.6 256.3M339 259.7L334.1 270M321 251.2L316.2 261.5M301.3 312.2L288 297.4M296.6 306.9L304.6 307.3M292.8 302.7L292.4 310.7M254.7 341L248 322.3M251.4 331.6L246.7 343.8M251.4 331.6L240 325.1M196.6 351.2L197.6 331.4M188.1 350.7L189.1 330.9M196.8 346.9L188.9 335.2M141.5 336.4L131.2 331.5M136.4 334L143.7 318.6M148.8 321L136.1 321.3M87.8 301.3L102.6 288M95.8 301.7L96.2 293.7M88.2 293.3L96.2 293.7M57.6 250.7L68.8 252.7M68.8 252.7L76.3 244M57.6 250.7L65 242M65 242L76.3 244M48.8 196.6L57.7 188.5M57.7 188.5L65.8 197.4M48.8 196.6L68.6 197.6M61.6 139L79.6 147.5M61.6 139L74.3 135.6M74.3 135.6L79.6 147.5M95.5 90.7L108.8 105.4M102.2 98L104.7 88.1M106 102.3L108.5 92.3M149.3 57.6L156 76.3M150.7 61.6L154.7 55.7M152.7 66.9L156.6 61\" stroke=\"#f0d58a\" stroke-width=\"2.4\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"128.3\" stroke=\"#d9ccff\" stroke-width=\"3.4\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M200 76.7L287.2 287.2L76.7 200L287.2 112.8L200 323.3L112.8 112.8L323.3 200L112.8 287.2Z\" stroke=\"#f0d58a\" stroke-width=\"3.4\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><path d=\"M233.9 141.3L233.9 258.7L132.2 200ZM267.8 200L166.1 258.7L166.1 141.3Z\" stroke=\"#d9ccff\" stroke-width=\"2.8\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><circle cx=\"200\" cy=\"200\" r=\"61.7\" stroke=\"#d9ccff\" stroke-width=\"3\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><path d=\"M200 170.4L200 138.3M220.9 179.1L243.6 156.4M229.6 200L261.7 200M220.9 220.9L243.6 243.6M200 229.6L200 261.7M179.1 220.9L156.4 243.6M170.4 200L138.3 200M179.1 179.1L156.4 156.4\" stroke=\"#d9ccff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"200\" cy=\"200\" r=\"29.6\" stroke=\"#f0d58a\" stroke-width=\"3.4\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/></g></svg>"}, {"s": 44, "x": 46, "y": -4, "o": 0.38, "rd": 90, "rv": false, "t": "draw", "cy": 36, "dl": 12, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#b9a3ff\" stroke-width=\"3\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#b9a3ff\" stroke-width=\"1.2\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M219.7 13L220.4 6.1M239.1 16.1L240.5 9.3M258.1 21.2L260.3 14.5M276.5 28.3L279.3 21.9M294 37.2L297.5 31.1M310.5 47.9L314.6 42.2M325.8 60.3L330.5 55.1M339.7 74.2L344.9 69.5M352.1 89.5L357.8 85.4M362.8 106L368.9 102.5M371.7 123.5L378.1 120.7M378.8 141.9L385.5 139.7M383.9 160.9L390.7 159.5M387 180.3L393.9 179.6M388 200L395 200M387 219.7L393.9 220.4M383.9 239.1L390.7 240.5M378.8 258.1L385.5 260.3M371.7 276.5L378.1 279.3M362.8 294L368.9 297.5M352.1 310.5L357.8 314.6M339.7 325.8L344.9 330.5M325.8 339.7L330.5 344.9M310.5 352.1L314.6 357.8M294 362.8L297.5 368.9M276.5 371.7L279.3 378.1M258.1 378.8L260.3 385.5M239.1 383.9L240.5 390.7M219.7 387L220.4 393.9M200 388L200 395M180.3 387L179.6 393.9M160.9 383.9L159.5 390.7M141.9 378.8L139.7 385.5M123.5 371.7L120.7 378.1M106 362.8L102.5 368.9M89.5 352.1L85.4 357.8M74.2 339.7L69.5 344.9M60.3 325.8L55.1 330.5M47.9 310.5L42.2 314.6M37.2 294L31.1 297.5M28.3 276.5L21.9 279.3M21.2 258.1L14.5 260.3M16.1 239.1L9.3 240.5M13 219.7L6.1 220.4M12 200L5 200M13 180.3L6.1 179.6M16.1 160.9L9.3 159.5M21.2 141.9L14.5 139.7M28.3 123.5L21.9 120.7M37.2 106L31.1 102.5M47.9 89.5L42.2 85.4M60.3 74.2L55.1 69.5M74.2 60.3L69.5 55.1M89.5 47.9L85.4 42.2M106 37.2L102.5 31.1M123.5 28.3L120.7 21.9M141.9 21.2L139.7 14.5M160.9 16.1L159.5 9.3M180.3 13L179.6 6.1\" stroke=\"#b9a3ff\" stroke-width=\"1.1\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"164\" stroke=\"#b9a3ff\" stroke-width=\"1.6\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M220.5 40.3L218.3 57.3M220 44L225.3 41M219.4 48.8L224.7 45.8M266.8 53.5L268 73.1M275.6 57.8L259.3 68.8M298.7 95.2L314.2 86.6M314.2 86.6L305.5 102.1M305.6 91.7L309 95.2M343.3 126.5L327.9 134M343.3 126.5L341 135.8M341 135.8L333.4 131.3M359.8 180.7L342.8 182.7M359.2 175.8L360.4 185.5M342.2 177.9L343.4 187.6M357.4 233.6L340.7 230M351.5 232.3L357.3 228.6M346.7 231.3L350.4 237.1M339.9 279.8L325.2 271M332.5 275.4L336.1 286M332.5 275.4L321.4 277.2M306.4 320.9L295.4 307.8M300.8 325.6L289.8 312.5M304 318.1L292.1 315.3M261.6 346.1L252.5 349.7M257.1 347.9L251.8 334.2M256.4 332.5L249 340.5M206.1 360.9L205.4 343.8M210.8 355.8L205.7 351.1M201 356.2L205.7 351.1M153.5 354.1L160.7 347.3M160.7 347.3L158.4 337.7M153.5 354.1L151.3 344.5M151.3 344.5L158.4 337.7M109 332.8L107.3 322.6M107.3 322.6L117.5 320.9M109 332.8L118.9 318.9M70.8 296.1L84.7 286.2M70.8 296.1L73.5 285.1M73.5 285.1L84.7 286.2M46.6 248.9L63 244.1M54.8 246.5L48 240.8M59.5 245.1L52.7 239.4M39.2 192.8L56.3 193.5M42.8 192.9L39.4 187.9M47.7 193.1L44.3 188.1M48.5 145.5L68 142.7M52 136.4L64.4 151.8M87.4 110.3L77.5 95.5M77.5 95.5L93.7 102.9M83.4 103.7L86.6 100M114.9 63.3L123.6 78M114.9 63.3L124.4 64.8M124.4 64.8L120.5 72.7M167.5 42.3L171 59.1M162.8 43.3L172.3 41.3M166.2 60.1L175.8 58.1\" stroke=\"#f0d58a\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"200\" cy=\"200\" r=\"140.9\" stroke=\"#b9a3ff\" stroke-width=\"2.2\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><path d=\"M200 64.1L333.8 176.4L246.5 327.7L82.3 267.9L112.7 95.9L287.3 95.9L317.7 267.9L153.5 327.7L66.2 176.4Z\" stroke=\"#f0d58a\" stroke-width=\"2.2\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><circle cx=\"200\" cy=\"64.1\" r=\"8.1\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"287.3\" cy=\"95.9\" r=\"8.1\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><circle cx=\"333.8\" cy=\"176.4\" r=\"8.1\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"317.7\" cy=\"267.9\" r=\"8.1\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/><circle cx=\"246.5\" cy=\"327.7\" r=\"8.1\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:11\"/><circle cx=\"153.5\" cy=\"327.7\" r=\"8.1\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:12\"/><circle cx=\"82.3\" cy=\"267.9\" r=\"8.1\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:13\"/><circle cx=\"66.2\" cy=\"176.4\" r=\"8.1\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:14\"/><circle cx=\"112.7\" cy=\"95.9\" r=\"8.1\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:15\"/><path d=\"M200 125.3L274.7 200L200 274.7L125.3 200Z\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:16\"/><circle cx=\"200\" cy=\"200\" r=\"67.9\" stroke=\"#b9a3ff\" stroke-width=\"1.9\" pathLength=\"1\" class=\"d\" style=\"--i:17\"/><path d=\"M200 167.4L200 132.1M212.5 169.9L226 137.2M223.1 176.9L248 152M230.1 187.5L262.8 174M232.6 200L267.9 200M230.1 212.5L262.8 226M223.1 223.1L248 248M212.5 230.1L226 262.8M200 232.6L200 267.9M187.5 230.1L174 262.8M176.9 223.1L152 248M169.9 212.5L137.2 226M167.4 200L132.1 200M169.9 187.5L137.2 174M176.9 176.9L152 152M187.5 169.9L174 137.2\" stroke=\"#b9a3ff\" stroke-width=\"1.4\" pathLength=\"1\" class=\"d\" style=\"--i:18\"/><circle cx=\"200\" cy=\"200\" r=\"32.6\" stroke=\"#f0d58a\" stroke-width=\"2.2\" pathLength=\"1\" class=\"d\" style=\"--i:19\"/></g></svg>"}, {"s": 20, "x": 30, "y": 38, "o": 0.48, "rd": 32, "rv": true, "t": "stat", "cy": 30, "dl": 0, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#8fe0ff\" stroke-width=\"6.6\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#8fe0ff\" stroke-width=\"2.7\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M213.1 12.5L213.6 5.5M226.2 13.8L227.1 6.9M239.1 16.1L240.5 9.3M251.8 19.3L253.7 12.6M264.3 23.3L266.7 16.8M276.5 28.3L279.3 21.9M288.3 34L291.5 27.8M299.6 40.6L303.3 34.6M310.5 47.9L314.6 42.2M320.8 56L325.3 50.6M330.6 64.8L335.5 59.7M339.7 74.2L344.9 69.5M348.1 84.3L353.7 79.9M355.9 94.9L361.7 91M362.8 106L368.9 102.5M369 117.6L375.3 114.5M374.3 129.6L380.8 127M378.8 141.9L385.5 139.7M382.4 154.5L389.2 152.8M385.1 167.4L392 166.1M387 180.3L393.9 179.6M387.9 193.4L394.9 193.2M387.9 206.6L394.9 206.8M387 219.7L393.9 220.4M385.1 232.6L392 233.9M382.4 245.5L389.2 247.2M378.8 258.1L385.5 260.3M374.3 270.4L380.8 273M369 282.4L375.3 285.5M362.8 294L368.9 297.5M355.9 305.1L361.7 309M348.1 315.7L353.7 320.1M339.7 325.8L344.9 330.5M330.6 335.2L335.5 340.3M320.8 344L325.3 349.4M310.5 352.1L314.6 357.8M299.6 359.4L303.3 365.4M288.3 366L291.5 372.2M276.5 371.7L279.3 378.1M264.3 376.7L266.7 383.2M251.8 380.7L253.7 387.4M239.1 383.9L240.5 390.7M226.2 386.2L227.1 393.1M213.1 387.5L213.6 394.5M200 388L200 395M186.9 387.5L186.4 394.5M173.8 386.2L172.9 393.1M160.9 383.9L159.5 390.7M148.2 380.7L146.3 387.4M135.7 376.7L133.3 383.2M123.5 371.7L120.7 378.1M111.7 366L108.5 372.2M100.4 359.4L96.7 365.4M89.5 352.1L85.4 357.8M79.2 344L74.7 349.4M69.4 335.2L64.5 340.3M60.3 325.8L55.1 330.5M51.9 315.7L46.3 320.1M44.1 305.1L38.3 309M37.2 294L31.1 297.5M31 282.4L24.7 285.5M25.7 270.4L19.2 273M21.2 258.1L14.5 260.3M17.6 245.5L10.8 247.2M14.9 232.6L8 233.9M13 219.7L6.1 220.4M12.1 206.6L5.1 206.8M12.1 193.4L5.1 193.2M13 180.3L6.1 179.6M14.9 167.4L8 166.1M17.6 154.5L10.8 152.8M21.2 141.9L14.5 139.7M25.7 129.6L19.2 127M31 117.6L24.7 114.5M37.2 106L31.1 102.5M44.1 94.9L38.3 91M51.9 84.3L46.3 79.9M60.3 74.2L55.1 69.5M69.4 64.8L64.5 59.7M79.2 56L74.7 50.6M89.5 47.9L85.4 42.2M100.4 40.6L96.7 34.6M111.7 34L108.5 27.8M123.5 28.3L120.7 21.9M135.7 23.3L133.3 16.8M148.2 19.3L146.3 12.6M160.9 16.1L159.5 9.3M173.8 13.8L172.9 6.9M186.9 12.5L186.4 5.5\" stroke=\"#8fe0ff\" stroke-width=\"2.4\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"151.3\" stroke=\"#8fe0ff\" stroke-width=\"3.6\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M241.4 57.6L232.6 66.1M232.6 66.1L235.5 78M241.4 57.6L244.3 69.5M244.3 69.5L235.5 78M274.5 71.6L277.4 84.2M277.4 84.2L264.9 87.1M274.5 71.6L263.2 89.7M306.3 96.5L290.7 110.8M306.3 96.5L304.6 110.4M304.6 110.4L290.7 110.8M330.3 129L311.4 138.6M320.8 133.8L330.4 139.2M315.4 136.5L324.9 141.9M345.5 171.3L324.7 175.4M341.1 172.2L346.7 177.2M335.1 173.3L340.7 178.4M348.3 205.6L326.2 216M347.4 217.7L327.2 203.9M321.4 238.1L339.3 251.1M339.3 251.1L317.2 249.5M328.9 244L326.8 249.7M323 283.1L305.7 270.6M323 283.1L311.5 286M311.5 286L311.9 275.1M292.4 316L279.2 299.4M297.2 312.2L287.7 319.8M284 295.6L274.5 303.2M257.7 336.6L249.5 317.1M254.8 329.6L262.7 332.9M252.4 324.1L249.2 332M223.2 346.6L220.6 325.5M221.9 336L214.2 347.7M221.9 336L211.5 326.6M182.8 347.4L185.9 326.4M173.8 346.1L176.9 325.1M183.5 342.9L176.3 329.6M146.3 335.1L135.2 330.2M140.8 332.7L148.2 316.1M153.7 318.5L140.2 319.1M105.2 314.1L118.8 297.8M113.8 313.3L113 304.8M104.5 305.6L113 304.8M78 284.3L90.2 283.3M90.2 283.3L95.4 272.2M78 284.3L83.3 273.3M83.3 273.3L95.4 272.2M61.2 252.6L66.9 241M66.9 241L78.4 246.6M61.2 252.6L81.3 245.7M52.2 213.2L73.4 211.9M52.2 213.2L62.3 203.5M62.3 203.5L73.4 211.9M54.1 172.8L74.9 177.3M64.5 175.1L60.5 164.9M70.4 176.4L66.4 166.2M69 130.4L87.8 140.4M73 132.6L71.8 125.1M78.4 135.4L77.2 127.9M88.4 102.1L112.2 107.9M96.8 93.3L103.8 116.7M129.8 93.9L124.2 72.5M124.2 72.5L140.3 87.7M127.8 84.5L133 81.4M157 58L162.5 78.5M157 58L167.8 62.9M167.8 62.9L160.6 71.2M201.5 51.7L201.3 72.9M195.4 51.6L207.6 51.7M195.2 72.9L207.3 73\" stroke=\"#e9a8ff\" stroke-width=\"3.3\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"200\" cy=\"200\" r=\"124.1\" stroke=\"#8fe0ff\" stroke-width=\"4.8\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><path d=\"M200 80.9L303.1 259.5L96.9 259.5ZM303.1 140.5L200 319.1L96.9 140.5Z\" stroke=\"#e9a8ff\" stroke-width=\"4.8\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><circle cx=\"200\" cy=\"80.9\" r=\"8.3\" stroke=\"#8fe0ff\" stroke-width=\"3.9\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"303.1\" cy=\"140.5\" r=\"8.3\" stroke=\"#8fe0ff\" stroke-width=\"3.9\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><circle cx=\"303.1\" cy=\"259.5\" r=\"8.3\" stroke=\"#8fe0ff\" stroke-width=\"3.9\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"200\" cy=\"319.1\" r=\"8.3\" stroke=\"#8fe0ff\" stroke-width=\"3.9\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/><circle cx=\"96.9\" cy=\"259.5\" r=\"8.3\" stroke=\"#8fe0ff\" stroke-width=\"3.9\" pathLength=\"1\" class=\"d\" style=\"--i:11\"/><circle cx=\"96.9\" cy=\"140.5\" r=\"8.3\" stroke=\"#8fe0ff\" stroke-width=\"3.9\" pathLength=\"1\" class=\"d\" style=\"--i:12\"/><path d=\"M246.3 153.7L246.3 246.3L153.7 246.3L153.7 153.7ZM265.5 200L200 265.5L134.5 200L200 134.5Z\" stroke=\"#8fe0ff\" stroke-width=\"3.9\" pathLength=\"1\" class=\"d\" style=\"--i:13\"/><circle cx=\"200\" cy=\"200\" r=\"59.5\" stroke=\"#8fe0ff\" stroke-width=\"4.2\" pathLength=\"1\" class=\"d\" style=\"--i:14\"/><path d=\"M200 171.4L200 140.5M220.2 179.8L242.1 157.9M228.6 200L259.5 200M220.2 220.2L242.1 242.1M200 228.6L200 259.5M179.8 220.2L157.9 242.1M171.4 200L140.5 200M179.8 179.8L157.9 157.9\" stroke=\"#8fe0ff\" stroke-width=\"3\" pathLength=\"1\" class=\"d\" style=\"--i:15\"/><circle cx=\"200\" cy=\"200\" r=\"28.6\" stroke=\"#e9a8ff\" stroke-width=\"4.8\" pathLength=\"1\" class=\"d\" style=\"--i:16\"/></g></svg>"}, {"s": 56, "x": 62, "y": 64, "o": 0.3, "rd": 120, "rv": true, "t": "erase", "cy": 40, "dl": 6, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#e9a8ff\" stroke-width=\"2.4\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#e9a8ff\" stroke-width=\"1\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M216.4 12.7L217 5.7M232.6 14.9L233.9 8M248.7 18.4L250.5 11.6M264.3 23.3L266.7 16.8M279.5 29.6L282.4 23.3M294 37.2L297.5 31.1M307.8 46L311.8 40.3M320.8 56L325.3 50.6M332.9 67.1L337.9 62.1M344 79.2L349.4 74.7M354 92.2L359.7 88.2M362.8 106L368.9 102.5M370.4 120.5L376.7 117.6M376.7 135.7L383.2 133.3M381.6 151.3L388.4 149.5M385.1 167.4L392 166.1M387.3 183.6L394.3 183M388 200L395 200M387.3 216.4L394.3 217M385.1 232.6L392 233.9M381.6 248.7L388.4 250.5M376.7 264.3L383.2 266.7M370.4 279.5L376.7 282.4M362.8 294L368.9 297.5M354 307.8L359.7 311.8M344 320.8L349.4 325.3M332.9 332.9L337.9 337.9M320.8 344L325.3 349.4M307.8 354L311.8 359.7M294 362.8L297.5 368.9M279.5 370.4L282.4 376.7M264.3 376.7L266.7 383.2M248.7 381.6L250.5 388.4M232.6 385.1L233.9 392M216.4 387.3L217 394.3M200 388L200 395M183.6 387.3L183 394.3M167.4 385.1L166.1 392M151.3 381.6L149.5 388.4M135.7 376.7L133.3 383.2M120.5 370.4L117.6 376.7M106 362.8L102.5 368.9M92.2 354L88.2 359.7M79.2 344L74.7 349.4M67.1 332.9L62.1 337.9M56 320.8L50.6 325.3M46 307.8L40.3 311.8M37.2 294L31.1 297.5M29.6 279.5L23.3 282.4M23.3 264.3L16.8 266.7M18.4 248.7L11.6 250.5M14.9 232.6L8 233.9M12.7 216.4L5.7 217M12 200L5 200M12.7 183.6L5.7 183M14.9 167.4L8 166.1M18.4 151.3L11.6 149.5M23.3 135.7L16.8 133.3M29.6 120.5L23.3 117.6M37.2 106L31.1 102.5M46 92.2L40.3 88.2M56 79.2L50.6 74.7M67.1 67.1L62.1 62.1M79.2 56L74.7 50.6M92.2 46L88.2 40.3M106 37.2L102.5 31.1M120.5 29.6L117.6 23.3M135.7 23.3L133.3 16.8M151.3 18.4L149.5 11.6M167.4 14.9L166.1 8M183.6 12.7L183 5.7\" stroke=\"#e9a8ff\" stroke-width=\"0.9\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"161.5\" stroke=\"#e9a8ff\" stroke-width=\"1.3\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M223.9 43.2L220.7 60.9M222.3 52.1L230.8 48.4M221.4 57.1L229.9 53.4M264.2 55.1L256.9 71.5M262.7 58.6L268.9 57.2M260.6 63.3L266.8 61.9M293 71.5L290.1 92M301.1 77.8L282 85.7M306.9 108.7L324.2 101.5M324.2 101.5L313.3 116.7M314.6 105.9L317.8 109.9M342.6 130.6L326.2 138.1M342.6 130.6L339.9 140.3M339.9 140.3L332.1 135.4M355.8 170.5L338.1 173.9M354.8 165.5L356.7 175.6M337.1 168.8L339.1 178.9M358.3 208.7L340.3 207.7M351.9 208.3L357.3 203.5M346.7 208L351.6 213.4M352.7 242.6L335.5 237.4M344.1 240L350.5 250M344.1 240L333.3 244.7M338.1 277.9L322.7 268.7M334.2 284.5L318.7 275.3M334.8 275.9L322 277.3M314.5 306L307.3 313.3M310.9 309.6L300 298.8M303.6 295.2L300 306.1M282.8 335.2L273.4 319.9M284.5 328.1L277.4 326.4M275.7 333.5L277.4 326.4M248 351.1L250.2 340.9M250.2 340.9L242.6 333.9M248 351.1L240.4 344.1M240.4 344.1L242.6 333.9M214.3 357.9L206.1 350.7M206.1 350.7L213.3 342.5M214.3 357.9L213.1 340M176.1 356.8L179.3 339.1M176.1 356.8L170.1 346.6M170.1 346.6L179.3 339.1M139.3 346.5L146.6 330.1M142.9 338.3L133.8 339.8M145 333.6L135.9 335.1M103 325.3L114 311.1M105.3 322.3L98.9 322.2M108.5 318.2L102 318.1M79 302.5L86.7 283.3M72.6 294.5L93.1 291.3M74.3 263.1L55.8 265.9M55.8 265.9L70 253.7M66.2 264L64.1 259.3M45 233.3L62.6 229.9M45 233.3L49.8 224.5M49.8 224.5L56.3 231.1M41.7 191.3L59.7 192.3M41.4 196.5L42 186.2M59.4 197.4L59.9 187.2M48.4 153.7L65.6 159M54.5 155.6L48.1 159M59.4 157.1L56 150.7M61.9 122.1L77.3 131.3M69.6 126.7L65.8 115.5M69.6 126.7L81.3 124.7M84.6 91.3L97.3 103.9M90 85.8L102.8 98.5M87.3 94L100 95.7M114.2 69.7L122.9 64.3M118.6 67L126.6 80.1M122.2 82.8L128.3 73.1M152 48.9L157.4 66.1M148.6 55.4L155.1 58.7M158.4 52.3L155.1 58.7M189.5 41.8L185 51.1M185 51.1L190.7 59.8M189.5 41.8L195.2 50.5M195.2 50.5L190.7 59.8\" stroke=\"#8fe0ff\" stroke-width=\"1.2\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"200\" cy=\"200\" r=\"137.5\" stroke=\"#e9a8ff\" stroke-width=\"1.7\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><path d=\"M200 67.5L277.9 307.2L73.9 159L326.1 159L122.1 307.2Z\" stroke=\"#8fe0ff\" stroke-width=\"1.7\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><path d=\"M251.5 148.5L251.5 251.5L148.5 251.5L148.5 148.5Z\" stroke=\"#e9a8ff\" stroke-width=\"1.4\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"200\" cy=\"200\" r=\"66.3\" stroke=\"#e9a8ff\" stroke-width=\"1.5\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><path d=\"M200 168.2L200 133.7M215.9 172.5L233.1 142.6M227.5 184.1L257.4 166.9M231.8 200L266.3 200M227.5 215.9L257.4 233.1M215.9 227.5L233.1 257.4M200 231.8L200 266.3M184.1 227.5L166.9 257.4M172.5 215.9L142.6 233.1M168.2 200L133.7 200M172.5 184.1L142.6 166.9M184.1 172.5L166.9 142.6\" stroke=\"#e9a8ff\" stroke-width=\"1.1\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"200\" cy=\"200\" r=\"31.8\" stroke=\"#8fe0ff\" stroke-width=\"1.7\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/></g></svg>"}, {"s": 14, "x": 70, "y": 88, "o": 0.55, "rd": 26, "rv": false, "t": "draw", "cy": 20, "dl": 3, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#d9ccff\" stroke-width=\"8.8\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#d9ccff\" stroke-width=\"3.6\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M213.1 12.5L213.6 5.5M226.2 13.8L227.1 6.9M239.1 16.1L240.5 9.3M251.8 19.3L253.7 12.6M264.3 23.3L266.7 16.8M276.5 28.3L279.3 21.9M288.3 34L291.5 27.8M299.6 40.6L303.3 34.6M310.5 47.9L314.6 42.2M320.8 56L325.3 50.6M330.6 64.8L335.5 59.7M339.7 74.2L344.9 69.5M348.1 84.3L353.7 79.9M355.9 94.9L361.7 91M362.8 106L368.9 102.5M369 117.6L375.3 114.5M374.3 129.6L380.8 127M378.8 141.9L385.5 139.7M382.4 154.5L389.2 152.8M385.1 167.4L392 166.1M387 180.3L393.9 179.6M387.9 193.4L394.9 193.2M387.9 206.6L394.9 206.8M387 219.7L393.9 220.4M385.1 232.6L392 233.9M382.4 245.5L389.2 247.2M378.8 258.1L385.5 260.3M374.3 270.4L380.8 273M369 282.4L375.3 285.5M362.8 294L368.9 297.5M355.9 305.1L361.7 309M348.1 315.7L353.7 320.1M339.7 325.8L344.9 330.5M330.6 335.2L335.5 340.3M320.8 344L325.3 349.4M310.5 352.1L314.6 357.8M299.6 359.4L303.3 365.4M288.3 366L291.5 372.2M276.5 371.7L279.3 378.1M264.3 376.7L266.7 383.2M251.8 380.7L253.7 387.4M239.1 383.9L240.5 390.7M226.2 386.2L227.1 393.1M213.1 387.5L213.6 394.5M200 388L200 395M186.9 387.5L186.4 394.5M173.8 386.2L172.9 393.1M160.9 383.9L159.5 390.7M148.2 380.7L146.3 387.4M135.7 376.7L133.3 383.2M123.5 371.7L120.7 378.1M111.7 366L108.5 372.2M100.4 359.4L96.7 365.4M89.5 352.1L85.4 357.8M79.2 344L74.7 349.4M69.4 335.2L64.5 340.3M60.3 325.8L55.1 330.5M51.9 315.7L46.3 320.1M44.1 305.1L38.3 309M37.2 294L31.1 297.5M31 282.4L24.7 285.5M25.7 270.4L19.2 273M21.2 258.1L14.5 260.3M17.6 245.5L10.8 247.2M14.9 232.6L8 233.9M13 219.7L6.1 220.4M12.1 206.6L5.1 206.8M12.1 193.4L5.1 193.2M13 180.3L6.1 179.6M14.9 167.4L8 166.1M17.6 154.5L10.8 152.8M21.2 141.9L14.5 139.7M25.7 129.6L19.2 127M31 117.6L24.7 114.5M37.2 106L31.1 102.5M44.1 94.9L38.3 91M51.9 84.3L46.3 79.9M60.3 74.2L55.1 69.5M69.4 64.8L64.5 59.7M79.2 56L74.7 50.6M89.5 47.9L85.4 42.2M100.4 40.6L96.7 34.6M111.7 34L108.5 27.8M123.5 28.3L120.7 21.9M135.7 23.3L133.3 16.8M148.2 19.3L146.3 12.6M160.9 16.1L159.5 9.3M173.8 13.8L172.9 6.9M186.9 12.5L186.4 5.5\" stroke=\"#d9ccff\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"156.7\" stroke=\"#d9ccff\" stroke-width=\"4.8\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M234.2 67.4L243.6 52.6M243.6 52.6L243.4 70.2M238.5 61.2L243.2 62.6M269.2 62.7L261.2 77.6M269.2 62.7L272.7 71.4M272.7 71.4L264.1 72.3M298.2 81.7L287.4 94.7M294.5 78.7L301.9 84.8M283.7 91.7L291.1 97.8M320 103.9L306.8 114.5M315.3 107.7L316 100.9M311.5 110.7L318.3 111.5M335.2 126.8L320.2 134.5M327.7 130.7L338.5 133.3M327.7 130.7L323.5 141M347.2 155.5L330.9 160M349.1 162.5L332.8 167M343.7 156.5L336.3 166M350.6 185L351.3 194.7M350.9 189.8L336.5 190.8M336.2 186L341.6 195.3M352.3 220.8L335.6 218.5M348.2 215.3L342.7 219.5M346.9 224.9L342.7 219.5M345 251L338.6 243.6M338.6 243.6L329.1 245.4M345 251L335.4 252.7M335.4 252.7L329.1 245.4M333.6 276L323.7 278.5M323.7 278.5L321.2 268.6M333.6 276L319.1 267.3M315.6 301.4L303.2 289.9M315.6 301.4L304.5 301M304.5 301L303.2 289.9M292.8 322.6L282.9 308.9M287.9 315.7L284.8 323.9M285.1 311.8L282 319.9M262.9 340.2L256 324.8M261.5 336.9L258.5 342.2M259.5 332.5L256.6 337.8M238.1 349L225 334.6M228.7 351.1L234.5 332.5M207.1 336.7L202.5 353.7M202.5 353.7L197.4 336.9M204.8 344L200 344.1M175.1 351.7L178.2 335.1M175.1 351.7L169.1 344.4M169.1 344.4L177.1 341M141.7 342.2L148.1 326.6M146.2 344.1L137.3 340.4M152.6 328.4L143.7 324.8M114.3 327.6L123.7 313.6M117.7 322.6L119 329.3M120.4 318.6L113.7 319.9M92.9 310.3L105 298.5M98.9 304.4L87.8 305.1M98.9 304.4L99.9 293.3M72.9 286.5L87.1 277.3M69 280.4L83.1 271.2M75.9 284.5L80.1 273.2M60.8 259.4L57.3 250.4M59 254.9L72.5 249.6M74.3 254.1L66.3 246.9M48.5 225.8L65.1 222.9M54 229.7L58 224.2M52.4 220.2L58 224.2M46.4 194.8L54.7 199.9M54.7 199.9L63.3 195.3M46.4 194.8L55 190.2M55 190.2L63.3 195.3M49.7 167.5L58.5 162.1M58.5 162.1L63.8 170.9M49.7 167.5L66.2 171.4M59.4 137.9L74.7 145.1M59.4 137.9L70.1 134.9M70.1 134.9L74.7 145.1M74.8 110.8L88.3 121M81.5 115.9L82 107.2M85.4 118.8L85.9 110.1M98 85.1L109.2 97.7M100.4 87.8L101.6 81.8M103.6 91.4L104.8 85.5M119 69.3L135.8 79.1M127.4 64.5L127.5 83.9M152.3 71.7L151.6 54.1M151.6 54.1L161.5 68.6M152.3 64.1L156.9 62.5M178.3 47.8L180.3 64.6M178.3 47.8L186.2 52.9M186.2 52.9L179.6 58.6M213 46.9L211.6 63.7M208.2 46.4L217.8 47.3M206.8 63.3L216.4 64.1\" stroke=\"#f0d58a\" stroke-width=\"4.4\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"200\" cy=\"200\" r=\"133.8\" stroke=\"#d9ccff\" stroke-width=\"6.4\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><path d=\"M200 71.2L264.4 311.5L88.5 135.6L328.8 200L88.5 264.4L264.4 88.5L200 328.8L135.6 88.5L311.5 264.4L71.2 200L311.5 135.6L135.6 311.5Z\" stroke=\"#f0d58a\" stroke-width=\"6.4\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><circle cx=\"200\" cy=\"71.2\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"264.4\" cy=\"88.5\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><circle cx=\"311.5\" cy=\"135.6\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"328.8\" cy=\"200\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/><circle cx=\"311.5\" cy=\"264.4\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:11\"/><circle cx=\"264.4\" cy=\"311.5\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:12\"/><circle cx=\"200\" cy=\"328.8\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:13\"/><circle cx=\"135.6\" cy=\"311.5\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:14\"/><circle cx=\"88.5\" cy=\"264.4\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:15\"/><circle cx=\"71.2\" cy=\"200\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:16\"/><circle cx=\"88.5\" cy=\"135.6\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:17\"/><circle cx=\"135.6\" cy=\"88.5\" r=\"7.6\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:18\"/><path d=\"M250.1 149.9L250.1 250.1L149.9 250.1L149.9 149.9Z\" stroke=\"#d9ccff\" stroke-width=\"5.2\" pathLength=\"1\" class=\"d\" style=\"--i:19\"/><circle cx=\"200\" cy=\"200\" r=\"64.4\" stroke=\"#d9ccff\" stroke-width=\"5.6\" pathLength=\"1\" class=\"d\" style=\"--i:20\"/><path d=\"M200 169.1L200 135.6M215.5 173.2L232.2 144.2M226.8 184.5L255.8 167.8M230.9 200L264.4 200M226.8 215.5L255.8 232.2M215.5 226.8L232.2 255.8M200 230.9L200 264.4M184.5 226.8L167.8 255.8M173.2 215.5L144.2 232.2M169.1 200L135.6 200M173.2 184.5L144.2 167.8M184.5 173.2L167.8 144.2\" stroke=\"#d9ccff\" stroke-width=\"4\" pathLength=\"1\" class=\"d\" style=\"--i:21\"/><circle cx=\"200\" cy=\"200\" r=\"30.9\" stroke=\"#f0d58a\" stroke-width=\"6.4\" pathLength=\"1\" class=\"d\" style=\"--i:22\"/></g></svg>"}, {"s": 24, "x": 4, "y": 40, "o": 0.45, "rd": 48, "rv": false, "t": "draw", "cy": 26, "dl": 10, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#f0d58a\" stroke-width=\"5.5\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#f0d58a\" stroke-width=\"2.2\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M209.8 12.3L210.2 5.3M219.7 13L220.4 6.1M229.4 14.3L230.5 7.4M239.1 16.1L240.5 9.3M248.7 18.4L250.5 11.6M258.1 21.2L260.3 14.5M267.4 24.5L269.9 18M276.5 28.3L279.3 21.9M285.4 32.5L288.5 26.3M294 37.2L297.5 31.1M302.4 42.3L306.2 36.5M310.5 47.9L314.6 42.2M318.3 53.9L322.7 48.5M325.8 60.3L330.5 55.1M332.9 67.1L337.9 62.1M339.7 74.2L344.9 69.5M346.1 81.7L351.5 77.3M352.1 89.5L357.8 85.4M357.7 97.6L363.5 93.8M362.8 106L368.9 102.5M367.5 114.6L373.7 111.5M371.7 123.5L378.1 120.7M375.5 132.6L382 130.1M378.8 141.9L385.5 139.7M381.6 151.3L388.4 149.5M383.9 160.9L390.7 159.5M385.7 170.6L392.6 169.5M387 180.3L393.9 179.6M387.7 190.2L394.7 189.8M388 200L395 200M387.7 209.8L394.7 210.2M387 219.7L393.9 220.4M385.7 229.4L392.6 230.5M383.9 239.1L390.7 240.5M381.6 248.7L388.4 250.5M378.8 258.1L385.5 260.3M375.5 267.4L382 269.9M371.7 276.5L378.1 279.3M367.5 285.4L373.7 288.5M362.8 294L368.9 297.5M357.7 302.4L363.5 306.2M352.1 310.5L357.8 314.6M346.1 318.3L351.5 322.7M339.7 325.8L344.9 330.5M332.9 332.9L337.9 337.9M325.8 339.7L330.5 344.9M318.3 346.1L322.7 351.5M310.5 352.1L314.6 357.8M302.4 357.7L306.2 363.5M294 362.8L297.5 368.9M285.4 367.5L288.5 373.7M276.5 371.7L279.3 378.1M267.4 375.5L269.9 382M258.1 378.8L260.3 385.5M248.7 381.6L250.5 388.4M239.1 383.9L240.5 390.7M229.4 385.7L230.5 392.6M219.7 387L220.4 393.9M209.8 387.7L210.2 394.7M200 388L200 395M190.2 387.7L189.8 394.7M180.3 387L179.6 393.9M170.6 385.7L169.5 392.6M160.9 383.9L159.5 390.7M151.3 381.6L149.5 388.4M141.9 378.8L139.7 385.5M132.6 375.5L130.1 382M123.5 371.7L120.7 378.1M114.6 367.5L111.5 373.7M106 362.8L102.5 368.9M97.6 357.7L93.8 363.5M89.5 352.1L85.4 357.8M81.7 346.1L77.3 351.5M74.2 339.7L69.5 344.9M67.1 332.9L62.1 337.9M60.3 325.8L55.1 330.5M53.9 318.3L48.5 322.7M47.9 310.5L42.2 314.6M42.3 302.4L36.5 306.2M37.2 294L31.1 297.5M32.5 285.4L26.3 288.5M28.3 276.5L21.9 279.3M24.5 267.4L18 269.9M21.2 258.1L14.5 260.3M18.4 248.7L11.6 250.5M16.1 239.1L9.3 240.5M14.3 229.4L7.4 230.5M13 219.7L6.1 220.4M12.3 209.8L5.3 210.2M12 200L5 200M12.3 190.2L5.3 189.8M13 180.3L6.1 179.6M14.3 170.6L7.4 169.5M16.1 160.9L9.3 159.5M18.4 151.3L11.6 149.5M21.2 141.9L14.5 139.7M24.5 132.6L18 130.1M28.3 123.5L21.9 120.7M32.5 114.6L26.3 111.5M37.2 106L31.1 102.5M42.3 97.6L36.5 93.8M47.9 89.5L42.2 85.4M53.9 81.7L48.5 77.3M60.3 74.2L55.1 69.5M67.1 67.1L62.1 62.1M74.2 60.3L69.5 55.1M81.7 53.9L77.3 48.5M89.5 47.9L85.4 42.2M97.6 42.3L93.8 36.5M106 37.2L102.5 31.1M114.6 32.5L111.5 26.3M123.5 28.3L120.7 21.9M132.6 24.5L130.1 18M141.9 21.2L139.7 14.5M151.3 18.4L149.5 11.6M160.9 16.1L159.5 9.3M170.6 14.3L169.5 7.4M180.3 13L179.6 6.1M190.2 12.3L189.8 5.3\" stroke=\"#f0d58a\" stroke-width=\"2\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><path d=\"M200 30L285 347.2L52.8 115L370 200L52.8 285L285 52.8L200 370L115 52.8L347.2 285L30 200L347.2 115L115 347.2Z\" stroke=\"#b9a3ff\" stroke-width=\"4\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><circle cx=\"200\" cy=\"30\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"285\" cy=\"52.8\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><circle cx=\"347.2\" cy=\"115\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><circle cx=\"370\" cy=\"200\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"347.2\" cy=\"285\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><circle cx=\"285\" cy=\"347.2\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"200\" cy=\"370\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/><circle cx=\"115\" cy=\"347.2\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:11\"/><circle cx=\"52.8\" cy=\"285\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:12\"/><circle cx=\"30\" cy=\"200\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:13\"/><circle cx=\"52.8\" cy=\"115\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:14\"/><circle cx=\"115\" cy=\"52.8\" r=\"8.9\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:15\"/><path d=\"M266.1 133.9L266.1 266.1L133.9 266.1L133.9 133.9Z\" stroke=\"#f0d58a\" stroke-width=\"3.2\" pathLength=\"1\" class=\"d\" style=\"--i:16\"/><circle cx=\"200\" cy=\"200\" r=\"85\" stroke=\"#f0d58a\" stroke-width=\"3.5\" pathLength=\"1\" class=\"d\" style=\"--i:17\"/><path d=\"M200 159.2L200 115M220.4 164.7L242.5 126.4M235.3 179.6L273.6 157.5M240.8 200L285 200M235.3 220.4L273.6 242.5M220.4 235.3L242.5 273.6M200 240.8L200 285M179.6 235.3L157.5 273.6M164.7 220.4L126.4 242.5M159.2 200L115 200M164.7 179.6L126.4 157.5M179.6 164.7L157.5 126.4\" stroke=\"#f0d58a\" stroke-width=\"2.5\" pathLength=\"1\" class=\"d\" style=\"--i:18\"/><circle cx=\"200\" cy=\"200\" r=\"40.8\" stroke=\"#b9a3ff\" stroke-width=\"4\" pathLength=\"1\" class=\"d\" style=\"--i:19\"/></g></svg>"}, {"s": 34, "x": 56, "y": 30, "o": 0.28, "rd": 80, "rv": true, "t": "stat", "cy": 30, "dl": 0, "svg": "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"200\" cy=\"200\" r=\"196\" stroke=\"#b9a3ff\" stroke-width=\"3.9\" pathLength=\"1\" class=\"d\" style=\"--i:0\"/><circle cx=\"200\" cy=\"200\" r=\"187\" stroke=\"#b9a3ff\" stroke-width=\"1.6\" pathLength=\"1\" class=\"d\" style=\"--i:1\"/><path d=\"M200 12L200 5M209.8 12.3L210.2 5.3M219.7 13L220.4 6.1M229.4 14.3L230.5 7.4M239.1 16.1L240.5 9.3M248.7 18.4L250.5 11.6M258.1 21.2L260.3 14.5M267.4 24.5L269.9 18M276.5 28.3L279.3 21.9M285.4 32.5L288.5 26.3M294 37.2L297.5 31.1M302.4 42.3L306.2 36.5M310.5 47.9L314.6 42.2M318.3 53.9L322.7 48.5M325.8 60.3L330.5 55.1M332.9 67.1L337.9 62.1M339.7 74.2L344.9 69.5M346.1 81.7L351.5 77.3M352.1 89.5L357.8 85.4M357.7 97.6L363.5 93.8M362.8 106L368.9 102.5M367.5 114.6L373.7 111.5M371.7 123.5L378.1 120.7M375.5 132.6L382 130.1M378.8 141.9L385.5 139.7M381.6 151.3L388.4 149.5M383.9 160.9L390.7 159.5M385.7 170.6L392.6 169.5M387 180.3L393.9 179.6M387.7 190.2L394.7 189.8M388 200L395 200M387.7 209.8L394.7 210.2M387 219.7L393.9 220.4M385.7 229.4L392.6 230.5M383.9 239.1L390.7 240.5M381.6 248.7L388.4 250.5M378.8 258.1L385.5 260.3M375.5 267.4L382 269.9M371.7 276.5L378.1 279.3M367.5 285.4L373.7 288.5M362.8 294L368.9 297.5M357.7 302.4L363.5 306.2M352.1 310.5L357.8 314.6M346.1 318.3L351.5 322.7M339.7 325.8L344.9 330.5M332.9 332.9L337.9 337.9M325.8 339.7L330.5 344.9M318.3 346.1L322.7 351.5M310.5 352.1L314.6 357.8M302.4 357.7L306.2 363.5M294 362.8L297.5 368.9M285.4 367.5L288.5 373.7M276.5 371.7L279.3 378.1M267.4 375.5L269.9 382M258.1 378.8L260.3 385.5M248.7 381.6L250.5 388.4M239.1 383.9L240.5 390.7M229.4 385.7L230.5 392.6M219.7 387L220.4 393.9M209.8 387.7L210.2 394.7M200 388L200 395M190.2 387.7L189.8 394.7M180.3 387L179.6 393.9M170.6 385.7L169.5 392.6M160.9 383.9L159.5 390.7M151.3 381.6L149.5 388.4M141.9 378.8L139.7 385.5M132.6 375.5L130.1 382M123.5 371.7L120.7 378.1M114.6 367.5L111.5 373.7M106 362.8L102.5 368.9M97.6 357.7L93.8 363.5M89.5 352.1L85.4 357.8M81.7 346.1L77.3 351.5M74.2 339.7L69.5 344.9M67.1 332.9L62.1 337.9M60.3 325.8L55.1 330.5M53.9 318.3L48.5 322.7M47.9 310.5L42.2 314.6M42.3 302.4L36.5 306.2M37.2 294L31.1 297.5M32.5 285.4L26.3 288.5M28.3 276.5L21.9 279.3M24.5 267.4L18 269.9M21.2 258.1L14.5 260.3M18.4 248.7L11.6 250.5M16.1 239.1L9.3 240.5M14.3 229.4L7.4 230.5M13 219.7L6.1 220.4M12.3 209.8L5.3 210.2M12 200L5 200M12.3 190.2L5.3 189.8M13 180.3L6.1 179.6M14.3 170.6L7.4 169.5M16.1 160.9L9.3 159.5M18.4 151.3L11.6 149.5M21.2 141.9L14.5 139.7M24.5 132.6L18 130.1M28.3 123.5L21.9 120.7M32.5 114.6L26.3 111.5M37.2 106L31.1 102.5M42.3 97.6L36.5 93.8M47.9 89.5L42.2 85.4M53.9 81.7L48.5 77.3M60.3 74.2L55.1 69.5M67.1 67.1L62.1 62.1M74.2 60.3L69.5 55.1M81.7 53.9L77.3 48.5M89.5 47.9L85.4 42.2M97.6 42.3L93.8 36.5M106 37.2L102.5 31.1M114.6 32.5L111.5 26.3M123.5 28.3L120.7 21.9M132.6 24.5L130.1 18M141.9 21.2L139.7 14.5M151.3 18.4L149.5 11.6M160.9 16.1L159.5 9.3M170.6 14.3L169.5 7.4M180.3 13L179.6 6.1M190.2 12.3L189.8 5.3\" stroke=\"#b9a3ff\" stroke-width=\"1.4\" pathLength=\"1\" class=\"d\" style=\"--i:2\"/><circle cx=\"200\" cy=\"200\" r=\"148.1\" stroke=\"#b9a3ff\" stroke-width=\"2.1\" pathLength=\"1\" class=\"d\" style=\"--i:3\"/><path d=\"M216.4 73.6L224.3 57M224.3 57L226.3 75.3M220.1 66.5L225.1 67.4M253.2 65L246.2 81.3M253.2 65L257.7 73.7M257.7 73.7L248.7 75.4M285.9 83.1L275.4 97.4M281.8 80.1L290 86.1M271.4 94.4L279.5 100.4M310.6 106.1L297.1 117.5M305.7 110.2L306.3 103M301.9 113.4L309 114M327.5 130.7L311.7 138.8M319.6 134.7L331 137.5M319.6 134.7L315.2 145.5M340.1 162L322.9 166.2M341.8 169.4L324.7 173.6M336.4 162.9L328.3 172.7M342.5 194.1L342.6 204.2M342.5 199.1L327.4 199.2M327.3 194.2L332.5 204.2M341.4 232.6L324.1 228.6M337.6 226.5L331.5 230.3M335.3 236.4L331.5 230.3M330 264.3L324.3 255.9M324.3 255.9L314.2 256.5M330 264.3L319.9 264.9M319.9 264.9L314.2 256.5M314.1 289.6L303.4 290.6M303.4 290.6L302.4 280M314.1 289.6L300.5 278.4M290.4 313.5L279.7 299.4M290.4 313.5L279 311M279 311L279.7 299.4M261.7 331.3L254.6 315.1M258.2 323.2L253.3 330.9M256.2 318.6L251.2 326.3M226.1 342.7L222.9 325.3M225.4 339L221.1 343.6M224.5 334L220.2 338.6M197.5 345.1L188.3 326.9M187.4 344.6L198.4 327.5M169.1 323.7L159.2 339.2M159.2 339.2L159.4 320.8M164.5 330.2L159.7 328.8M131.5 327.9L140.3 312.6M131.5 327.9L128.1 318.7M128.1 318.7L137.2 318.1M101.1 306.1L113.2 293.2M104.8 309.6L97.4 302.7M116.9 296.6L109.5 289.7M79.3 280.5L94 270.6M84.5 276.9L83.1 284M88.8 274.1L81.7 272.7M65.3 254L81.9 247.8M73.6 250.9L62.7 246.9M73.6 250.9L79.3 240.7M56.5 221.5L74 219.3M55.6 214L73.1 211.8M60.2 221L69.4 212.3M57.8 189.3L58.9 179.3M58.3 184.3L73.4 186M72.8 191L68.9 180.4M63.4 151.2L80 157.2M66.4 157.7L72.9 154.6M69.8 148.2L72.9 154.6M78.3 121L83 130.1M83 130.1L93.2 130.7M78.3 121L88.5 121.6M88.5 121.6L93.2 130.7M97.1 97.7L107.8 98M107.8 98L107.5 108.7M97.1 97.7L109.3 110.5M123.4 76.7L132.4 92M123.4 76.7L134.4 80.5M134.4 80.5L132.4 92M153.9 62.4L159.1 79.3M156.5 70.9L162.3 63.8M158 75.7L163.8 68.6M190.7 55.2L191.8 72.9M190.9 59L195.7 54.9M191.3 64.1L196.1 60\" stroke=\"#8fe0ff\" stroke-width=\"1.9\" pathLength=\"1\" class=\"d\" style=\"--i:4\"/><circle cx=\"200\" cy=\"200\" r=\"124.4\" stroke=\"#b9a3ff\" stroke-width=\"2.8\" pathLength=\"1\" class=\"d\" style=\"--i:5\"/><path d=\"M200 80.6L259.7 303.4L96.6 140.3L319.4 200L96.6 259.7L259.7 96.6L200 319.4L140.3 96.6L303.4 259.7L80.6 200L303.4 140.3L140.3 303.4Z\" stroke=\"#8fe0ff\" stroke-width=\"2.8\" pathLength=\"1\" class=\"d\" style=\"--i:6\"/><circle cx=\"200\" cy=\"80.6\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:7\"/><circle cx=\"259.7\" cy=\"96.6\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:8\"/><circle cx=\"303.4\" cy=\"140.3\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:9\"/><circle cx=\"319.4\" cy=\"200\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:10\"/><circle cx=\"303.4\" cy=\"259.7\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:11\"/><circle cx=\"259.7\" cy=\"303.4\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:12\"/><circle cx=\"200\" cy=\"319.4\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:13\"/><circle cx=\"140.3\" cy=\"303.4\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:14\"/><circle cx=\"96.6\" cy=\"259.7\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:15\"/><circle cx=\"80.6\" cy=\"200\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:16\"/><circle cx=\"96.6\" cy=\"140.3\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:17\"/><circle cx=\"140.3\" cy=\"96.6\" r=\"9.3\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:18\"/><path d=\"M232.8 143.1L256.9 232.8L167.2 256.9L143.1 167.2Z\" stroke=\"#b9a3ff\" stroke-width=\"2.3\" pathLength=\"1\" class=\"d\" style=\"--i:19\"/><circle cx=\"200\" cy=\"200\" r=\"59.7\" stroke=\"#b9a3ff\" stroke-width=\"2.5\" pathLength=\"1\" class=\"d\" style=\"--i:20\"/><path d=\"M200 171.4L200 140.3M214.3 175.2L229.8 148.3M224.8 185.7L251.7 170.2M228.6 200L259.7 200M224.8 214.3L251.7 229.8M214.3 224.8L229.8 251.7M200 228.6L200 259.7M185.7 224.8L170.2 251.7M175.2 214.3L148.3 229.8M171.4 200L140.3 200M175.2 185.7L148.3 170.2M185.7 175.2L170.2 148.3\" stroke=\"#b9a3ff\" stroke-width=\"1.8\" pathLength=\"1\" class=\"d\" style=\"--i:21\"/><circle cx=\"200\" cy=\"200\" r=\"28.6\" stroke=\"#8fe0ff\" stroke-width=\"2.8\" pathLength=\"1\" class=\"d\" style=\"--i:22\"/></g></svg>"}];
const MC_RUNE_GLYPHS = ["M5 0L5 14M5 3L9 0M5 7L9 4", "M2 0L2 14M2 0L8 5M8 5L2 9", "M2 0L2 14M2 7L8 0M2 7L8 14", "M5 0L5 14M1 4L5 8M9 4L5 8", "M2 0L2 14M2 0L8 7M8 7L2 14", "M1 0L9 14M9 0L1 14", "M5 0L5 14M1 0L9 0M1 14L9 14", "M2 0L2 14M8 0L8 14M2 3L8 11", "M5 0L1 7M1 7L5 14M5 0L9 7M9 7L5 14", "M2 0L2 14M2 7L8 3M2 11L8 7", "M1 14L5 0M5 0L9 14M3 8L7 8", "M5 0L5 14M5 5L1 1M5 9L9 5", "M1 2L9 2M5 2L5 14M1 14L9 10", "M2 0L8 6M8 6L2 12M2 0L2 14"];
const MC_MINI_SVG = "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"46\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"50\" r=\"36\" stroke-width=\"2.4\"/><path d=\"M50 16L79.4 67L20.6 67ZM79.4 33L50 84L20.6 33Z\" stroke-width=\"3\"/><path d=\"M50 12L50 4M69 17.1L73 10.2M82.9 31L89.8 27M88 50L96 50M82.9 69L89.8 73M69 82.9L73 89.8M50 88L50 96M31 82.9L27 89.8M17.1 69L10.2 73M12 50L4 50M17.1 31L10.2 27M31 17.1L27 10.2\" stroke-width=\"2.4\"/><circle cx=\"50\" cy=\"50\" r=\"6\" stroke-width=\"3\"/></svg>";
function magicBgSync() {
  if (document.body.dataset.themeLevel !== "25" || document.getElementById("mc-bg")) return;
  const bg = document.createElement("div");
  bg.id = "mc-bg"; bg.className = "mc-bg"; bg.setAttribute("aria-hidden", "true");
  MC_BG_SPECS.forEach((sp) => {
    const d = document.createElement("div");
    d.className = "mc-c " + sp.t;
    d.style.cssText = "--s:" + sp.s + ";--x:" + sp.x + "%;--y:" + sp.y + "%;--o:" + sp.o + ";--rd:" + sp.rd + "s;--rdir:" + (sp.rv ? "reverse" : "normal") + ";--cy:" + sp.cy + "s;--dl:" + sp.dl + "s";
    d.innerHTML = sp.svg;
    bg.appendChild(d);
  });
  const pt = document.createElement("div");
  pt.className = "mc-pt"; pt.setAttribute("aria-hidden", "true");
  const fg = document.createElement("div");
  fg.className = "mc-pt mc-fg"; fg.setAttribute("aria-hidden", "true");
  const k = window.innerWidth < 700 ? 0.5 : 1;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const cols = ["#d9ccff", "#8fe0ff", "#f0d58a", "#e9a8ff", "#b9a3ff"];
  const add = (host, type, n, o) => {
    for (let i = 0; i < Math.round(n * k); i++) {
      const p = document.createElement("span");
      p.className = "mc-p " + type;
      const du = type === "spark" ? rnd(3, 7) : type === "mote" ? rnd(16, 34) : rnd(28, 56);
      const sz = type === "mote" ? rnd(o.a, o.b) : type === "spark" ? rnd(7, 15) : type === "rune" ? rnd(11, 20) : rnd(18, 34);
      p.style.cssText = "--x:" + rnd(1, 99).toFixed(1) + "%;--y:" + rnd(4, 96).toFixed(1) + "%;--c:" + cols[Math.floor(Math.random() * cols.length)]
        + ";--sz:" + sz.toFixed(1) + "px;--du:" + du.toFixed(1) + "s;--dl:-" + rnd(0, du).toFixed(1) + "s;--dx:" + rnd(-60, 60).toFixed(0) + "px;--o:" + rnd(o.lo, o.hi).toFixed(2);
      if (type === "rune") p.innerHTML = '<svg viewBox="0 0 10 14"><path d="' + MC_RUNE_GLYPHS[Math.floor(Math.random() * MC_RUNE_GLYPHS.length)] + '"/></svg>';
      else if (type === "ring") p.innerHTML = MC_MINI_SVG;
      host.appendChild(p);
    }
  };
  add(pt, "mote", 24, { a: 3, b: 7, lo: 0.5, hi: 0.9 });
  add(pt, "rune", 10, { lo: 0.35, hi: 0.7 });
  add(pt, "ring", 5, { lo: 0.3, hi: 0.55 });
  add(pt, "spark", 14, { lo: 0.5, hi: 0.95 });
  add(fg, "mote", 10, { a: 2, b: 4, lo: 0.35, hi: 0.7 });
  document.body.appendChild(bg);
  document.body.appendChild(pt);
  document.body.appendChild(fg);
}

/* ---- Hoàng triều: trống đồng, nền gấm, hạt hoa mai ---- */
const HD_DRUM_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-200 -200 400 400\" fill=\"none\" stroke=\"#D4AF37\"><circle r=\"197\" stroke-width=\"2\"/><circle r=\"189\" stroke-width=\"0.8\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(0)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(4)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(8)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(12)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(16)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(20)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(24)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(28)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(32)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(36)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(40)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(44)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(48)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(52)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(56)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(60)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(64)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(68)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(72)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(76)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(80)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(84)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(88)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(92)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(96)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(100)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(104)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(108)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(112)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(116)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(120)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(124)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(128)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(132)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(136)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(140)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(144)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(148)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(152)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(156)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(160)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(164)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(168)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(172)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(176)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(180)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(184)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(188)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(192)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(196)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(200)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(204)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(208)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(212)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(216)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(220)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(224)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(228)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(232)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(236)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(240)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(244)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(248)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(252)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(256)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(260)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(264)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(268)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(272)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(276)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(280)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(284)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(288)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(292)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(296)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(300)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(304)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(308)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(312)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(316)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(320)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(324)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(328)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(332)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(336)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(340)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(344)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(348)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(352)\"/><line x1=\"0\" y1=\"-189\" x2=\"0\" y2=\"-180\" stroke-width=\"0.7\" transform=\"rotate(356)\"/><circle r=\"180\" stroke-width=\"0.8\"/><g transform=\"rotate(0) translate(0 -152)\"><path d=\"M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z\" stroke-width=\"1\" fill=\"#D4AF37\" fill-opacity=\"0.18\"/><path d=\"M-8 4 L-14 16 M2 4 L-2 15\" stroke-width=\"0.8\"/><circle cx=\"12\" cy=\"-2.5\" r=\"1.4\" fill=\"#D4AF37\" stroke=\"none\"/></g><g transform=\"rotate(45) translate(0 -152)\"><path d=\"M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z\" stroke-width=\"1\" fill=\"#D4AF37\" fill-opacity=\"0.18\"/><path d=\"M-8 4 L-14 16 M2 4 L-2 15\" stroke-width=\"0.8\"/><circle cx=\"12\" cy=\"-2.5\" r=\"1.4\" fill=\"#D4AF37\" stroke=\"none\"/></g><g transform=\"rotate(90) translate(0 -152)\"><path d=\"M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z\" stroke-width=\"1\" fill=\"#D4AF37\" fill-opacity=\"0.18\"/><path d=\"M-8 4 L-14 16 M2 4 L-2 15\" stroke-width=\"0.8\"/><circle cx=\"12\" cy=\"-2.5\" r=\"1.4\" fill=\"#D4AF37\" stroke=\"none\"/></g><g transform=\"rotate(135) translate(0 -152)\"><path d=\"M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z\" stroke-width=\"1\" fill=\"#D4AF37\" fill-opacity=\"0.18\"/><path d=\"M-8 4 L-14 16 M2 4 L-2 15\" stroke-width=\"0.8\"/><circle cx=\"12\" cy=\"-2.5\" r=\"1.4\" fill=\"#D4AF37\" stroke=\"none\"/></g><g transform=\"rotate(180) translate(0 -152)\"><path d=\"M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z\" stroke-width=\"1\" fill=\"#D4AF37\" fill-opacity=\"0.18\"/><path d=\"M-8 4 L-14 16 M2 4 L-2 15\" stroke-width=\"0.8\"/><circle cx=\"12\" cy=\"-2.5\" r=\"1.4\" fill=\"#D4AF37\" stroke=\"none\"/></g><g transform=\"rotate(225) translate(0 -152)\"><path d=\"M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z\" stroke-width=\"1\" fill=\"#D4AF37\" fill-opacity=\"0.18\"/><path d=\"M-8 4 L-14 16 M2 4 L-2 15\" stroke-width=\"0.8\"/><circle cx=\"12\" cy=\"-2.5\" r=\"1.4\" fill=\"#D4AF37\" stroke=\"none\"/></g><g transform=\"rotate(270) translate(0 -152)\"><path d=\"M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z\" stroke-width=\"1\" fill=\"#D4AF37\" fill-opacity=\"0.18\"/><path d=\"M-8 4 L-14 16 M2 4 L-2 15\" stroke-width=\"0.8\"/><circle cx=\"12\" cy=\"-2.5\" r=\"1.4\" fill=\"#D4AF37\" stroke=\"none\"/></g><g transform=\"rotate(315) translate(0 -152)\"><path d=\"M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z\" stroke-width=\"1\" fill=\"#D4AF37\" fill-opacity=\"0.18\"/><path d=\"M-8 4 L-14 16 M2 4 L-2 15\" stroke-width=\"0.8\"/><circle cx=\"12\" cy=\"-2.5\" r=\"1.4\" fill=\"#D4AF37\" stroke=\"none\"/></g><circle r=\"124\" stroke-width=\"0.8\"/><circle cx=\"0.00\" cy=\"-117.00\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"12.23\" cy=\"-116.36\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"24.33\" cy=\"-114.44\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"36.15\" cy=\"-111.27\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"47.59\" cy=\"-106.88\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"58.50\" cy=\"-101.32\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"68.77\" cy=\"-94.65\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"78.29\" cy=\"-86.95\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"86.95\" cy=\"-78.29\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"94.65\" cy=\"-68.77\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"101.32\" cy=\"-58.50\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"106.88\" cy=\"-47.59\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"111.27\" cy=\"-36.15\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"114.44\" cy=\"-24.33\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"116.36\" cy=\"-12.23\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"117.00\" cy=\"0.00\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"116.36\" cy=\"12.23\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"114.44\" cy=\"24.33\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"111.27\" cy=\"36.15\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"106.88\" cy=\"47.59\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"101.32\" cy=\"58.50\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"94.65\" cy=\"68.77\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"86.95\" cy=\"78.29\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"78.29\" cy=\"86.95\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"68.77\" cy=\"94.65\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"58.50\" cy=\"101.32\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"47.59\" cy=\"106.88\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"36.15\" cy=\"111.27\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"24.33\" cy=\"114.44\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"12.23\" cy=\"116.36\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"0.00\" cy=\"117.00\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-12.23\" cy=\"116.36\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-24.33\" cy=\"114.44\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-36.15\" cy=\"111.27\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-47.59\" cy=\"106.88\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-58.50\" cy=\"101.32\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-68.77\" cy=\"94.65\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-78.29\" cy=\"86.95\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-86.95\" cy=\"78.29\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-94.65\" cy=\"68.77\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-101.32\" cy=\"58.50\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-106.88\" cy=\"47.59\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-111.27\" cy=\"36.15\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-114.44\" cy=\"24.33\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-116.36\" cy=\"12.23\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-117.00\" cy=\"0.00\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-116.36\" cy=\"-12.23\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-114.44\" cy=\"-24.33\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-111.27\" cy=\"-36.15\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-106.88\" cy=\"-47.59\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-101.32\" cy=\"-58.50\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-94.65\" cy=\"-68.77\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-86.95\" cy=\"-78.29\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-78.29\" cy=\"-86.95\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-68.77\" cy=\"-94.65\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-58.50\" cy=\"-101.32\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-47.59\" cy=\"-106.88\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-36.15\" cy=\"-111.27\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-24.33\" cy=\"-114.44\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle cx=\"-12.23\" cy=\"-116.36\" r=\"1.6\" fill=\"#D4AF37\" stroke=\"none\"/><circle r=\"110\" stroke-width=\"0.8\"/><path d=\"M0.00,-93.00 L9.15,-104.60 L16.15,-91.59 L27.18,-101.42 L31.81,-87.39 L44.37,-95.16 L46.50,-80.54 L60.23,-86.01 L59.78,-71.24 L74.25,-74.25 L71.24,-59.78 L86.01,-60.23 L80.54,-46.50 L95.16,-44.37 L87.39,-31.81 L101.42,-27.18 L91.59,-16.15 L104.60,-9.15 L93.00,0.00 L104.60,9.15 L91.59,16.15 L101.42,27.18 L87.39,31.81 L95.16,44.37 L80.54,46.50 L86.01,60.23 L71.24,59.78 L74.25,74.25 L59.78,71.24 L60.23,86.01 L46.50,80.54 L44.37,95.16 L31.81,87.39 L27.18,101.42 L16.15,91.59 L9.15,104.60 L0.00,93.00 L-9.15,104.60 L-16.15,91.59 L-27.18,101.42 L-31.81,87.39 L-44.37,95.16 L-46.50,80.54 L-60.23,86.01 L-59.78,71.24 L-74.25,74.25 L-71.24,59.78 L-86.01,60.23 L-80.54,46.50 L-95.16,44.37 L-87.39,31.81 L-101.42,27.18 L-91.59,16.15 L-104.60,9.15 L-93.00,0.00 L-104.60,-9.15 L-91.59,-16.15 L-101.42,-27.18 L-87.39,-31.81 L-95.16,-44.37 L-80.54,-46.50 L-86.01,-60.23 L-71.24,-59.78 L-74.25,-74.25 L-59.78,-71.24 L-60.23,-86.01 L-46.50,-80.54 L-44.37,-95.16 L-31.81,-87.39 L-27.18,-101.42 L-16.15,-91.59 L-9.15,-104.60 L-0.00,-93.00Z\" stroke-width=\"0.8\"/><circle r=\"88\" stroke-width=\"0.8\"/><g transform=\"rotate(0) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(15) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(30) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(45) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(60) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(75) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(90) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(105) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(120) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(135) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(150) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(165) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(180) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(195) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(210) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(225) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(240) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(255) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(270) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(285) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(300) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(315) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(330) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><g transform=\"rotate(345) translate(0 -76)\"><circle r=\"7\" stroke-width=\"0.8\"/><circle r=\"2.5\" stroke-width=\"0.6\"/></g><circle r=\"64\" stroke-width=\"0.8\"/><path d=\"M0.00,-58.00 L3.78,-16.57 L25.17,-52.26 L10.60,-13.29 L45.35,-36.16 L15.32,-7.38 L56.55,-12.91 L17.00,0.00 L56.55,12.91 L15.32,7.38 L45.35,36.16 L10.60,13.29 L25.17,52.26 L3.78,16.57 L0.00,58.00 L-3.78,16.57 L-25.17,52.26 L-10.60,13.29 L-45.35,36.16 L-15.32,7.38 L-56.55,12.91 L-17.00,0.00 L-56.55,-12.91 L-15.32,-7.38 L-45.35,-36.16 L-10.60,-13.29 L-25.17,-52.26 L-3.78,-16.57Z\" fill=\"#D4AF37\" fill-opacity=\"0.28\" stroke-width=\"1\"/><circle r=\"13\" stroke-width=\"1\" fill=\"#D4AF37\" fill-opacity=\"0.4\"/></svg>";
function hoangIsOn() {
  return document.body.dataset.themeLevel === "23" && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function bootHoldMs() {
  const lv = document.body.dataset.themeLevel;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 1300;
  return lv === "25" ? 3700 : lv === "23" ? 4300 : 1300;
}
function hoangBootBuild() {
  const host = document.querySelector(".hd-boot-drum");
  if (!host || host.firstChild) return;
  let i = 0;
  host.innerHTML = HD_DRUM_SVG.replace(/<(circle|line|path)\b([^>]*?)\/?>/g, (m0, tag, attrs) => {
    attrs = attrs.replace(/\s+$/, "");
    const filled = /fill="#D4AF37"/.test(attrs);
    const noStroke = /stroke="none"/.test(attrs);
    const fo = (attrs.match(/fill-opacity="([\d.]+)"/) || [])[1] || "1";
    const d = Math.min(i * 0.011, 2.6).toFixed(3);
    i++;
    const cls = ((noStroke ? "" : "d") + (filled ? " f" : "")).trim();
    return "<" + tag + attrs + (noStroke ? "" : ' pathLength="1"') + ' class="' + cls + '" style="--d:' + d + "s;--fo:" + fo + '"/>';
  });
}
function hoangBgBuild() {
  if (document.getElementById("hd-bg")) return;
  const bg = document.createElement("div");
  bg.id = "hd-bg"; bg.className = "hd-bg"; bg.setAttribute("aria-hidden", "true");
  bg.innerHTML = '<div class="hd-img"></div><div class="hd-vig"></div><div class="hd-drum a"></div><div class="hd-drum b"></div>';
  const pt = document.createElement("div");
  pt.className = "hd-pt"; pt.setAttribute("aria-hidden", "true");
  const fg = document.createElement("div");
  fg.className = "hd-pt hd-fg"; fg.setAttribute("aria-hidden", "true");
  const k = window.innerWidth < 700 ? 0.5 : 1;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const petalCols = ["#f4c542", "#f4c542", "#ffe08a", "#f2a93b", "#e8563a"];
  const dustCols = ["#f5d77a", "#d4a843", "#fff1c1"];
  let petal = '<svg viewBox="0 0 40 40">';
  for (let a = 0; a < 5; a++) petal += '<ellipse cx="20" cy="9.5" rx="6.5" ry="9" transform="rotate(' + a * 72 + ' 20 20)"/>';
  petal += '<circle class="ct" cx="20" cy="20" r="3"/></svg>';
  const add = (host, type, n, o) => {
    for (let i = 0; i < Math.round(n * k); i++) {
      const p = document.createElement("span");
      p.className = "hd-p " + type;
      const du = type === "spark" ? rnd(3, 7) : type === "dust" ? rnd(18, 36) : rnd(16, 30);
      const sz = type === "petal" ? rnd(o.a, o.b) : type === "dust" ? rnd(3, 7) : rnd(7, 15);
      p.style.cssText = "--x:" + rnd(1, 99).toFixed(1) + "%;--y:" + rnd(4, 96).toFixed(1) + "%;--c:" + pick(type === "petal" ? petalCols : dustCols)
        + ";--sz:" + sz.toFixed(1) + "px;--du:" + du.toFixed(1) + "s;--dl:-" + rnd(0, du).toFixed(1) + "s;--dx:" + rnd(-90, 90).toFixed(0) + "px;--o:" + rnd(o.lo, o.hi).toFixed(2) + ";--fl:" + rnd(3.5, 7).toFixed(1) + "s";
      if (type === "petal") p.innerHTML = petal;
      host.appendChild(p);
    }
  };
  add(pt, "petal", 18, { a: 11, b: 22, lo: 0.6, hi: 0.95 });
  add(pt, "dust", 20, { lo: 0.45, hi: 0.85 });
  add(pt, "spark", 12, { lo: 0.5, hi: 0.95 });
  add(fg, "petal", 6, { a: 10, b: 18, lo: 0.5, hi: 0.85 });
  document.body.appendChild(bg);
  document.body.appendChild(pt);
  document.body.appendChild(fg);
}
function hoangSync() {
  if (document.body.dataset.themeLevel !== "23") return;
  if (!document.body.style.getPropertyValue("--hd-drum")) {
    document.body.style.setProperty("--hd-drum", 'url("data:image/svg+xml;utf8,' + encodeURIComponent(HD_DRUM_SVG) + '")');
  }
  hoangBootBuild();
  hoangBgBuild();
}
function hoangFlipFx(cardEl) {
  if (!hoangIsOn() || !cardEl) return;
  let c = cardEl.querySelector(".hd-flip-drum");
  if (!c) {
    c = document.createElement("span");
    c.className = "hd-flip-drum";
    c.setAttribute("aria-hidden", "true");
    cardEl.insertBefore(c, cardEl.firstChild);
  }
  c.classList.remove("go");
  void c.offsetWidth;
  c.classList.add("go");
}
function hoangAnswerFx(ok, anchorEl) {
  if (!hoangIsOn()) return;
  const vw = window.innerWidth, vh = window.innerHeight;
  let cx = vw / 2, cy = vh / 2, size = Math.min(vw, vh, 320);
  if (anchorEl) {
    const r = anchorEl.getBoundingClientRect();
    if (r.width && r.height) {
      const top = Math.max(r.top, 0), bottom = Math.min(r.bottom, vh);
      cx = r.left + r.width / 2;
      cy = (top + bottom) / 2;
      size = Math.min(r.width, bottom - top, 340) * 0.92;
    }
  }
  size = Math.max(150, size);
  const host = document.createElement("div");
  host.className = "mc-fx hd-fx " + (ok ? "hd-fx-ok" : "hd-fx-bad");
  host.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + (cx - size / 2) + "px;top:" + (cy - size / 2) + "px";
  let inner = '<div class="hd-fx-drum"></div>';
  if (!ok) {
    let cr = "";
    MC_CRACKS.forEach((d, i) => {
      cr += '<path class="mc-crack" pathLength="1" d="' + d + '" style="animation-delay:' + (0.2 + i * 0.05).toFixed(2) + 's,1s"/>';
    });
    inner += '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' + cr + "</svg>";
  }
  host.innerHTML = inner;
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 2000);
}

applyThemeLevel(state.themeLevel || 1, false);
if (document.body.dataset.themeLevel === "21") termBootFx();

/* ---- Ma pháp: hiệu ứng JS (lật thẻ, đúng/sai) ---- */
const MC_FX_OK_SVG = "<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"200\" cy=\"200\" r=\"192\" stroke=\"currentColor\" stroke-width=\"2.4\"/><circle cx=\"200\" cy=\"200\" r=\"176\" stroke=\"currentColor\" stroke-width=\"1\"/><path d=\"M200 22L200 10M215.5 22.7L216.6 10.7M230.9 24.7L233 12.9M246.1 28.1L249.2 16.5M260.9 32.7L265 21.5M275.2 38.7L280.3 27.8M289 45.8L295 35.5M302.1 54.2L309 44.4M314.4 63.6L322.1 54.5M325.9 74.1L334.4 65.6M336.4 85.6L345.5 77.9M345.8 97.9L355.6 91M354.2 111L364.5 105M361.3 124.8L372.2 119.7M367.3 139.1L378.5 135M371.9 153.9L383.5 150.8M375.3 169.1L387.1 167M377.3 184.5L389.3 183.4M378 200L390 200M377.3 215.5L389.3 216.6M375.3 230.9L387.1 233M371.9 246.1L383.5 249.2M367.3 260.9L378.5 265M361.3 275.2L372.2 280.3M354.2 289L364.5 295M345.8 302.1L355.6 309M336.4 314.4L345.5 322.1M325.9 325.9L334.4 334.4M314.4 336.4L322.1 345.5M302.1 345.8L309 355.6M289 354.2L295 364.5M275.2 361.3L280.3 372.2M260.9 367.3L265 378.5M246.1 371.9L249.2 383.5M230.9 375.3L233 387.1M215.5 377.3L216.6 389.3M200 378L200 390M184.5 377.3L183.4 389.3M169.1 375.3L167 387.1M153.9 371.9L150.8 383.5M139.1 367.3L135 378.5M124.8 361.3L119.7 372.2M111 354.2L105 364.5M97.9 345.8L91 355.6M85.6 336.4L77.9 345.5M74.1 325.9L65.6 334.4M63.6 314.4L54.5 322.1M54.2 302.1L44.4 309M45.8 289L35.5 295M38.7 275.2L27.8 280.3M32.7 260.9L21.5 265M28.1 246.1L16.5 249.2M24.7 230.9L12.9 233M22.7 215.5L10.7 216.6M22 200L10 200M22.7 184.5L10.7 183.4M24.7 169.1L12.9 167M28.1 153.9L16.5 150.8M32.7 139.1L21.5 135M38.7 124.8L27.8 119.7M45.8 111L35.5 105M54.2 97.9L44.4 91M63.6 85.6L54.5 77.9M74.1 74.1L65.6 65.6M85.6 63.6L77.9 54.5M97.9 54.2L91 44.4M111 45.8L105 35.5M124.8 38.7L119.7 27.8M139.1 32.7L135 21.5M153.9 28.1L150.8 16.5M169.1 24.7L167 12.9M184.5 22.7L183.4 10.7\" stroke=\"currentColor\" stroke-width=\"1\"/><circle cx=\"200\" cy=\"200\" r=\"126\" stroke=\"currentColor\" stroke-width=\"1.8\"/><path d=\"M195.3 37.2L195.3 58.8M195.3 48L204.7 37.2M195.3 48L204.7 58.8M245.9 43.7L239.2 64.3M254.7 46.6L248 67.2M244.5 48.1L249.5 62.8M288.9 67.1L298.9 74.4M293.9 70.8L283 85.8M277.9 82.2L291.6 84.4M331.7 104.3L314.2 117M323.1 102.9L321.7 111.6M330.4 112.9L321.7 111.6M354.9 149.7L342.6 147.1M342.6 147.1L334.2 156.4M354.9 149.7L346.5 158.9M346.5 158.9L334.2 156.4M362.9 195.3L353.6 204.7M353.6 204.7L344.2 195.3M362.9 195.3L341.1 195.3M356.3 245.9L335.7 239.2M356.3 245.9L343.1 251.4M343.1 251.4L335.7 239.2M334.5 292L316.9 279.2M325.7 285.6L325.3 296.7M320.7 281.9L320.2 293.1M295.7 331.7L283 314.2M293 328L290.7 335.4M289.3 323L287.1 330.4M256.2 353L237.7 336.2M244.4 356.8L249.5 332.3M206.2 341.1L200 362.9M200 362.9L193.8 341.1M203.1 350.4L196.9 350.4M154.1 356.3L160.8 335.7M154.1 356.3L147.6 346.1M147.6 346.1L158.4 343M104.3 331.7L117 314.2M109.3 335.4L99.3 328.1M122.1 317.8L112 310.5M68.3 295.7L85.8 283M74.5 291.2L73.1 299.8M79.5 287.5L70.9 286.1M46.6 254.7L67.2 248M56.9 251.4L43.7 245.9M56.9 251.4L64.3 239.2M37.2 204.7L58.8 204.7M37.2 195.4L58.8 195.4M41.8 204.7L54.2 195.4M46.2 156.5L50 144.7M48.1 150.6L65.8 156.4M63.8 162.3L61.8 148.6M68.3 104.3L85.8 117M69.6 112.9L78.3 111.6M76.9 102.9L78.3 111.6M104.3 68.3L105.6 80.7M105.6 80.7L117 85.8M104.3 68.3L115.7 73.4M115.7 73.4L117 85.8M145.3 46.6L157 52.5M157 52.5L151 64.2M145.3 46.6L152 67.2\" stroke=\"currentColor\" stroke-width=\"1.5\"/><path d=\"M200 80L303.9 260L96.1 260ZM303.9 140L200 320L96.1 140Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M200 138L243.8 243.8L138 200L243.8 156.2L200 262L156.2 156.2L262 200L156.2 243.8Z\" stroke=\"currentColor\" stroke-width=\"1.4\"/><circle cx=\"200\" cy=\"200\" r=\"22\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>";
const MC_SHARD_RUNES = ["M109 14L107.5 24.8M109 14L113.1 18.5M113.1 18.5L108 20.9M133.1 20.1L128.9 30.2M130.2 18.9L136 21.3M126 29L131.8 31.4M152.6 31.4L146 40.1M150.3 34.5L149.7 30.1M148.4 37L152.7 36.4M167.2 45.5L158.5 52.2M162.8 48.8L170 49.2M162.8 48.8L161.4 55.9", "M179 64.8L168.9 68.9M180.8 69.1L170.7 73.3M176.8 65.6L172.8 72.4M183.8 85.8L184.6 92M184.2 88.9L174.9 90.1M174.5 87L178.4 92.8M185.7 111.3L174.9 109.9M183 107.8L179.5 110.5M182.2 114L179.5 110.5M179.9 133.1L176 128.1M176 128.1L169.8 128.9M179.9 133.1L173.6 133.9M173.6 133.9L169.8 128.9", "M170 150.8L163.5 151.6M163.5 151.6L162.6 145.1M170 150.8L161.4 144.1M154.5 167.2L147.8 158.5M154.5 167.2L147.5 165.7M147.5 165.7L147.8 158.5M135.2 179L131.1 168.9M133.2 173.9L130 178.6M132 171.1L128.8 175.7M111.3 185.7L109.9 174.9M111 183.4L108.2 186.1M110.6 180.3L107.8 183", "M91.8 186.1L87 174.5M85.6 185.3L93.2 175.3M74 171L66.9 179.9M66.9 179.9L68.2 168.6M70.7 174.7L67.9 173.5M49.2 170L55.9 161.4M49.2 170L47.9 164.1M47.9 164.1L53.5 164.4M31.4 152.6L40.1 146M33.3 155.1L29.5 150.2M42 148.5L38.2 143.5", "M20.1 133.1L30.2 128.9M23.7 131.6L22 135.7M26.6 130.4L22.5 128.7M14.6 113.6L25.4 112.2M20 112.9L14 109M20 112.9L24.8 107.5M14 91L24.8 92.5M14.6 86.4L25.4 87.8M16.3 91.3L23.1 87.5M20.4 70.4L22.8 64.6M21.6 67.5L30.2 71.1M29 74L28.5 67", "M31.4 47.4L40.1 54M32 51.7L36.4 51.2M35.8 46.8L36.4 51.2M47.4 31.4L48.2 37.6M48.2 37.6L54 40.1M47.4 31.4L53.2 33.8M53.2 33.8L54 40.1M64.8 21L70.9 23.5M70.9 23.5L68.3 29.7M64.8 21L68.9 31.1M86.4 14.6L87.8 25.4M86.4 14.6L91.7 19.4M91.7 19.4L87.8 25.4"];
const MC_CRACKS = [
  "M100 100L92 84L98 70L88 52L93 36L86 10",
  "M100 100L114 90L112 74L126 62L124 44L138 28",
  "M100 100L118 108L134 104L146 116L164 112L190 122",
  "M100 100L106 118L96 132L104 148L94 166L100 192",
  "M100 100L84 108L70 104L56 118L40 112L10 124",
  "M100 100L86 94L72 86L58 90L44 76L22 68"
];
function magicIsOn() {
  return document.body.dataset.themeLevel === "25" && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function magicFlipFx(cardEl) {
  if (document.body.dataset.themeLevel === "23") { hoangFlipFx(cardEl); return; }
  if (!magicIsOn() || !cardEl) return;
  let c = cardEl.querySelector(".mc-flip-circle");
  if (!c) {
    c = document.createElement("span");
    c.className = "mc-flip-circle";
    c.setAttribute("aria-hidden", "true");
    cardEl.insertBefore(c, cardEl.firstChild);
  }
  c.classList.remove("go");
  void c.offsetWidth;
  c.classList.add("go");
}
function magicBadSvg() {
  const arc = (r, a0, a1) => {
    const p = (a, rr) => (100 + rr * Math.cos(a)).toFixed(1) + " " + (100 + rr * Math.sin(a)).toFixed(1);
    return "M" + p(a0, r) + "A" + r + " " + r + " 0 0 1 " + p(a1, r);
  };
  let shards = "";
  for (let i = 0; i < 6; i++) {
    const a0 = ((i * 60 - 90 + 2) * Math.PI) / 180;
    const a1 = (((i + 1) * 60 - 90 - 2) * Math.PI) / 180;
    const mid = ((i * 60 - 90 + 30) * Math.PI) / 180;
    const tx = (Math.cos(mid) * 30 + (i % 2 ? 5 : -5)).toFixed(1);
    const ty = (Math.sin(mid) * 30 + 8 + i).toFixed(1);
    const rt = (i % 2 ? 1 : -1) * (10 + i * 4);
    shards += '<g class="mc-shard" style="--tx:' + tx + 'px;--ty:' + ty + 'px;--rot:' + rt + 'deg">'
      + '<path d="' + arc(92, a0, a1) + '" stroke-width="2.4"/>'
      + '<path d="' + arc(70, a0, a1) + '" stroke-width="1.4"/>'
      + '<path d="' + MC_SHARD_RUNES[i] + '" stroke-width="1.1"/></g>';
  }
  let cracks = "";
  MC_CRACKS.forEach((d, i) => {
    cracks += '<path class="mc-crack" pathLength="1" d="' + d + '" style="animation-delay:' + (0.2 + i * 0.04).toFixed(2) + 's,1s"/>';
  });
  return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g class="mc-ring">' + shards + '</g>' + cracks + '</svg>';
}
function magicAnswerFx(ok, anchorEl) {
  if (document.body.dataset.themeLevel === "23") { hoangAnswerFx(ok, anchorEl); return; }
  if (!magicIsOn()) return;
  const vw = window.innerWidth, vh = window.innerHeight;
  let cx = vw / 2, cy = vh / 2, size = Math.min(vw, vh, 320);
  if (anchorEl) {
    const r = anchorEl.getBoundingClientRect();
    if (r.width && r.height) {
      const top = Math.max(r.top, 0), bottom = Math.min(r.bottom, vh);
      cx = r.left + r.width / 2;
      cy = (top + bottom) / 2;
      size = Math.min(r.width, bottom - top, 340) * 0.92;
    }
  }
  size = Math.max(150, size);
  const host = document.createElement("div");
  host.className = "mc-fx " + (ok ? "mc-fx-ok" : "mc-fx-bad");
  host.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + (cx - size / 2) + "px;top:" + (cy - size / 2) + "px";
  host.innerHTML = ok ? MC_FX_OK_SVG : magicBadSvg();
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 2000);
}

/* ============================================================
   LIST PICKER POPUP (used by Thẻ / Viết / Nghe "Chọn danh sách")
   ============================================================ */
const listPickerOverlay = document.getElementById("list-picker-overlay");
const listPickerBody = document.getElementById("list-picker-body");
const listPickerTitle = document.getElementById("list-picker-title");
let listPickerCat = null; // one of: "flashcard", "writing", "listening"

// resolves a picker key to { realCat, getArr(), ensureDefault() }
function pickerContext(cat) {
  return {
    realCat: cat,
    getArr: () => state.selected[cat],
    ensureDefault: () => ensureSelected(cat),
    allowEmpty: false,
  };
}

function openListPicker(cat) {
  listPickerCat = cat;
  const titles = { flashcard: "Thẻ", writing: "Viết", listening: "Nghe" };
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
function renderListQuickSelect(cat, containerId, onChange, singleSelect, selKey) {
  const key = selKey || cat;
  ensureSelected(cat, key);
  const box = document.getElementById(containerId);
  box.innerHTML = "";
  const lists = getCategory(cat);
  if (!lists.length) {
    box.innerHTML = `<div class="wh-preview-empty">Chưa có danh sách nào — vào Kho để thêm.</div>`;
    return;
  }
  lists.forEach((list) => {
    const btn = document.createElement("button");
    const selected = state.selected[key].includes(list.id);
    btn.className = "nghe-item-btn" + (selected ? " active" : "");
    btn.innerHTML = `<span>${escapeHtml(list.name)}</span><span>${selected ? "✓" : ""}</span>`;
    btn.addEventListener("click", () => {
      const arr = state.selected[key];
      if (singleSelect) {
        // Chỉ được chọn 1 danh sách — bấm vào danh sách khác sẽ thay thế
        // lựa chọn hiện tại thay vì cộng dồn.
        if (arr.length === 1 && arr[0] === list.id) return;
        state.selected[key] = [list.id];
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

/* Popup chọn 1 giá trị trong danh sách — dùng cho "Chuyển sang danh sách khác",
   "Nhập từ mã chia sẻ vào danh sách nào", v.v. options = [{value, label}]. */
let selectResolve = null;
function closeGenericSelect(val) {
  document.getElementById("generic-select-overlay").classList.add("hidden");
  if (selectResolve) { const r = selectResolve; selectResolve = null; r(val); }
}
function showSelect(title, options) {
  return new Promise((resolve) => {
    selectResolve = resolve;
    document.getElementById("generic-select-title").textContent = title;
    const body = document.getElementById("generic-select-body");
    body.innerHTML = "";
    if (!options.length) {
      body.innerHTML = `<p class="wh-preview-empty">Không có lựa chọn nào khác.</p>`;
    }
    options.forEach((opt) => {
      const row = document.createElement("div");
      row.className = "popup-list-item";
      row.innerHTML = `<span>${escapeHtml(opt.label)}</span>`;
      row.addEventListener("click", () => closeGenericSelect(opt.value));
      body.appendChild(row);
    });
    document.getElementById("generic-select-overlay").classList.remove("hidden");
  });
}
document.getElementById("generic-select-cancel-x").addEventListener("click", () => closeGenericSelect(null));
document.getElementById("generic-select-overlay").addEventListener("click", (e) => {
  if (e.target.id === "generic-select-overlay") closeGenericSelect(null);
});

/* Toast có nút "Hoàn tác" — dùng cho các thao tác xoá dễ bấm nhầm. */
function showUndoToast(message, restoreFn, duration = 6000) {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = "toast toast-undo";
  el.innerHTML = `<span>${escapeHtml(message)}</span><button type="button" class="toast-undo-btn">Hoàn tác</button>`;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }
  el.querySelector(".toast-undo-btn").addEventListener("click", () => {
    if (done) return;
    restoreFn();
    finish();
    showToast("Đã hoàn tác.");
  });
  setTimeout(finish, duration);
}

/* ============================================================
   TAB 1: THẺ (FLASHCARD)
   ============================================================ */
const fc = {
  filter: "all",
  sourceCat: "flashcard", // "flashcard" (Thẻ) hoặc "dictionary" (Từ điển) — nguồn danh sách của tab Thẻ
  view: "read",           // "read" (đọc cả danh sách) hoặc "flip" (lật thẻ). Mặc định: Thẻ→đọc, Từ điển→lật thẻ
  readFilter: "all",      // "all" | "star" — lọc ở giao diện đọc
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

// Khoá lưu danh sách đang chọn: Thẻ dùng state.selected.flashcard; Từ điển dùng
// khoá riêng (state.selected.fcDictSource) để không đụng tới lựa chọn trong Kho.
function fcSelKey() {
  return fc.sourceCat === "dictionary" ? "fcDictSource" : "flashcard";
}
function fcCurrentItems() {
  const key = fcSelKey();
  ensureSelected(fc.sourceCat, key);
  let items = itemsFromLists(fc.sourceCat, state.selected[key]);
  if (fc.filter !== "all") items = items.filter((i) => i.status === statusFromFilter(fc.filter));
  return items;
}

function rebuildFcQueue(keepIndex) {
  const items = fcCurrentItems();
  fc.queue = items.map((i) => i.id);
  if (!keepIndex || fc.index >= fc.queue.length) fc.index = 0;
  fc.showingBack = false;
}

function renderFlashcardTab() {
  const key = fcSelKey();
  ensureSelected(fc.sourceCat, key);
  renderListQuickSelect(fc.sourceCat, "fc-list-quickselect", renderFlashcardTab, false, key);

  const all = itemsFromLists(fc.sourceCat, state.selected[key]);
  document.getElementById("fc-stat-total").textContent = all.length;
  document.getElementById("fc-stat-learning").textContent = all.filter((i) => i.status === "new").length;
  document.getElementById("fc-stat-known").textContent = all.filter((i) => i.status === "known").length;
  document.getElementById("fc-stat-difficult").textContent = all.filter((i) => i.status === "difficult").length;

  document.getElementById("fc-source-toggle").textContent = "Danh sách: " + (fc.sourceCat === "dictionary" ? "Từ điển" : "Thẻ");
  document.getElementById("fc-view-toggle").textContent = "Giao diện: " + (fc.view === "read" ? "Đọc" : "Lật thẻ");
  fcApplyView(true);
}

// Hiện đúng giao diện (đọc / lật thẻ) và vẽ lại nội dung của nó.
function fcApplyView(keepIndex) {
  const flip = fc.view === "flip";
  document.getElementById("fc-flip-view").classList.toggle("hidden", !flip);
  document.getElementById("fc-read-view").classList.toggle("hidden", flip);
  if (flip) {
    rebuildFcQueue(!!keepIndex);
    renderFcCard();
  } else {
    // Rời giao diện lật thẻ: tắt auto play + đọc tự động để không chạy ngầm
    if (fc.autoPlay) {
      fc.autoPlay = false;
      document.getElementById("fc-autoplay-toggle").classList.remove("active");
    }
    clearFcAutoPlayTimers();
    try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    renderFcRead();
  }
}

function fcItemById(id) {
  for (const l of getCategory(fc.sourceCat)) {
    const found = l.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}

/* ============================================================
   GIAO DIỆN ĐỌC — hiện cả danh sách như một trang tài liệu.
   Đánh dấu ★ câu hay (item.star) rồi lọc "Đã đánh dấu" để xem lại nhanh.
   ============================================================ */
function fcReadItems() {
  let items = fcCurrentItems();
  if (fc.readFilter === "star") items = items.filter((i) => i.star);
  return items;
}
function fcReadRowHtml(item, n) {
  const st = item.status === "known" ? " st-known" : item.status === "difficult" ? " st-difficult" : "";
  const meta = [item.ipa ? `<span class="fc-read-ipa">${escapeHtml(item.ipa)}</span>` : "", item.pos ? `<span class="fc-read-pos">${escapeHtml(item.pos)}</span>` : ""].filter(Boolean).join(" ");
  const en = escapeHtml(String(item.en || "").split("|")[0].trim());
  return `<div class="fc-read-row${st}${item.star ? " starred" : ""}" data-id="${escapeHtml(item.id)}">
    <span class="fc-read-num">${n}</span>
    <div class="fc-read-body">
      <div class="fc-read-en">${en}${meta ? " " + meta : ""}</div>
      <div class="fc-read-vi">${escapeHtml(item.vi || "")}</div>
    </div>
    <div class="fc-read-actions">
      <button type="button" class="fc-read-act fc-read-speak" title="Đọc to" aria-label="Đọc to">${icon("volume")}</button>
      <button type="button" class="fc-read-act fc-read-star" title="Đánh dấu câu hay" aria-label="Đánh dấu">${item.star ? "★" : "☆"}</button>
    </div>
  </div>`;
}
function fcUpdateReadCounts() {
  const base = fcCurrentItems();
  const stars = base.filter((i) => i.star).length;
  document.getElementById("fc-read-star-count").textContent = stars;
  document.getElementById("fc-read-count").textContent =
    (fc.readFilter === "star" ? stars : base.length) + " mục";
}
function renderFcRead() {
  const box = document.getElementById("fc-read-list");
  const hideVi = !!(state.settings && state.settings.fcReadHideVi);
  box.classList.toggle("hide-vi", hideVi);
  document.getElementById("fc-read-vi-toggle").textContent = "Nghĩa: " + (hideVi ? "Ẩn" : "Hiện");
  document.getElementById("fc-read-vi-toggle").classList.toggle("active", hideVi);
  document.querySelectorAll("[data-rfilter]").forEach((b) => b.classList.toggle("active", b.dataset.rfilter === fc.readFilter));

  const items = fcReadItems();
  fcUpdateReadCounts();
  if (!items.length) {
    const msg = fc.readFilter === "star"
      ? "Chưa có mục nào được đánh dấu ★ — bấm ☆ ở bên phải mỗi dòng để lưu câu hay."
      : "Không có mục nào. Hãy chọn danh sách khác hoặc thêm nội dung trong Kho.";
    box.innerHTML = `<div class="wh-preview-empty">${msg}</div>`;
    return;
  }
  box.innerHTML = items.map((it, i) => fcReadRowHtml(it, i + 1)).join("");
}
document.getElementById("fc-read-list").addEventListener("click", (e) => {
  const row = e.target.closest(".fc-read-row");
  if (!row) return;
  const item = fcItemById(row.dataset.id);
  if (!item) return;
  if (e.target.closest(".fc-read-speak")) {
    playAudio(String(item.en || "").split("|")[0].trim(), "en-US");
    return;
  }
  if (e.target.closest(".fc-read-star")) {
    const wasStar = !!item.star;
    item.star = !wasStar;
    if (!item.star) delete item.star;
    saveState();
    if (fc.readFilter === "star" && wasStar) {
      row.remove();
      fcUpdateReadCounts();
      if (!document.querySelector("#fc-read-list .fc-read-row")) renderFcRead();
      showUndoToast("Đã bỏ đánh dấu.", () => { item.star = true; saveState(); renderFcRead(); });
    } else {
      row.classList.toggle("starred", !!item.star);
      row.querySelector(".fc-read-star").textContent = item.star ? "★" : "☆";
      fcUpdateReadCounts();
    }
    return;
  }
  // Bấm vào dòng khi đang ẩn nghĩa: hiện nghĩa của riêng dòng đó
  if (document.getElementById("fc-read-list").classList.contains("hide-vi") && !window.getSelection().toString()) {
    row.classList.toggle("reveal");
  }
});
document.querySelectorAll("[data-rfilter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    fc.readFilter = btn.dataset.rfilter;
    renderFcRead();
  });
});
document.getElementById("fc-read-vi-toggle").addEventListener("click", () => {
  state.settings.fcReadHideVi = !state.settings.fcReadHideVi;
  saveState();
  renderFcRead();
});

// Nút bên bảng điều khiển: đổi nguồn (Thẻ ⇄ Từ điển) và đổi giao diện (Đọc ⇄ Lật thẻ)
document.getElementById("fc-source-toggle").addEventListener("click", () => {
  fc.sourceCat = fc.sourceCat === "dictionary" ? "flashcard" : "dictionary";
  // Mặc định: Từ điển → lật thẻ, Thẻ → đọc
  fc.view = fc.sourceCat === "dictionary" ? "flip" : "read";
  fc.index = 0;
  fc.showingBack = false;
  fc.readFilter = "all";
  renderFlashcardTab();
});
document.getElementById("fc-view-toggle").addEventListener("click", () => {
  fc.view = fc.view === "read" ? "flip" : "read";
  fc.showingBack = false;
  renderFlashcardTab();
});

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
  hintEl.textContent = (showEnglishSide && fc.sourceCat === "dictionary")
    ? [item.ipa, item.pos].filter(Boolean).join("  ·  ")
    : "";

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
  if (!fc.autoPlay || fc.view !== "flip" || !fc.queue.length || !flashcardTabVisible()) return;
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
/* Âm thanh nhẹ khi vòng tròn mục tiêu ở Thống kê "bung ra" — 3 nốt lên dần,
   phát khi người dùng mở xem tab Thống kê (delay lệch nhau giữa 2 vòng). */
function playRingRevealSound(delay) {
  const vol = getSfxVolume();
  if (vol <= 0) return;
  const d = delay || 0;
  sfxTone(440, null, 0.12, "sine", 0.35, vol, d);
  sfxTone(560, null, 0.12, "sine", 0.32, vol, d + 0.08);
  sfxTone(700, null, 0.18, "sine", 0.3, vol, d + 0.16);
}

/* Âm khi bấm nút — gắn cho hầu hết các <button>, trừ những nút đã có
   âm riêng (chuyển thẻ, đúng/sai...) để tránh chồng 2 tiếng cùng lúc */
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
  magicFlipFx(cardEl);
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
  if (!flashcardTabVisible() || fc.view !== "flip" || isTypingTarget() || anyOverlayOpen()) return;
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
    fc.index = 0;
    fcApplyView(false);
  });
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
  filter: "all",
  sourceCat: "writing", // "writing" hoặc "flashcard" — nguồn danh sách để luyện Viết
  queue: [],
  cursor: 0,
  maxReached: 0,
  difficulty: state.settings.wrDifficulty || "medium",
  difficultyLocked: false,
  trackedAnswer: "", // đáp án (trong các đáp án được chấp nhận) đang gần giống nhất với những gì đang gõ
  historyIndex: null, // đang lướt lại lịch sử câu sai bằng phím ↑/↓ (null = không lướt)
};
// Khi wr.sourceCat === "flashcard", danh sách đang chọn để luyện Viết được
// lưu riêng ở đây (state.selected.wrFcSource) — KHÔNG dùng chung
// state.selected.flashcard, để không ảnh hưởng tới danh sách đang chọn ở
// tab Thẻ.
function wrSelKey() {
  return wr.sourceCat === "flashcard" ? "wrFcSource" : "writing";
}
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
// khớp nhất để hiển thị mức độ gần đúng (%). "Đúng" (correct) CHỈ được tính
// khi khớp TUYỆT ĐỐI (sau khi chuẩn hoá dấu câu/hoa-thường) với ít nhất 1
// đáp án được chấp nhận — không dùng ngưỡng dung sai (tolerance) như bên
// Nghe nữa, vì trước đây lỡ dùng chung "correct" từ ngheGradeLine (chỉ cần
// khớp ~80% số từ đã được tính đúng dù còn thiếu chữ ở cuối câu).
function wrGradeAnswer(typed, item) {
  const candidates = allAcceptedAnswers(item);
  if (!candidates.length) return { pct: 0, correct: false, matchedText: "" };
  let best = { pct: 0, correct: false, matchedText: candidates[0].text };
  candidates.forEach((c) => {
    const g = ngheGradeLine(typed, c.text);
    if (g.pct > best.pct) best = { pct: g.pct, correct: false, matchedText: c.text };
  });
  const exactMatch = candidates.find((c) => normalizeAnswer(typed) === normalizeAnswer(c.text));
  if (exactMatch) best = { pct: 100, correct: true, matchedText: exactMatch.text };
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
  const key = wrSelKey();
  ensureSelected(wr.sourceCat, key);
  const items = itemsFromLists(wr.sourceCat, state.selected[key]);
  if (wr.filter === "all") return items;
  return items.filter((i) => i.status === wrStatusFromFilter(wr.filter));
}

function wrItemById(id) {
  for (const l of getCategory(wr.sourceCat)) {
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

// Nút đổi nguồn danh sách luyện Viết giữa "Viết" và "Thẻ" (để có thể luyện
// viết trên cả những danh sách đang nằm trong Thẻ mà không cần copy sang).
function updateWrSourceToggleBtn() {
  const btn = document.getElementById("wr-source-toggle");
  if (!btn) return;
  btn.textContent = "Danh sách: " + (wr.sourceCat === "flashcard" ? "Thẻ" : "Viết");
}
document.getElementById("wr-source-toggle").addEventListener("click", () => {
  wr.sourceCat = wr.sourceCat === "flashcard" ? "writing" : "flashcard";
  renderWritingTab();
});

function renderWritingTab() {
  const key = wrSelKey();
  ensureSelected(wr.sourceCat, key);
  // Phòng trường hợp còn sót nhiều danh sách được chọn từ trước khi đổi
  // sang chế độ chỉ chọn 1 danh sách — chỉ giữ lại danh sách đầu tiên.
  if (state.selected[key].length > 1) {
    state.selected[key] = [state.selected[key][0]];
    saveState();
  }
  updateWrSourceToggleBtn();
  renderListQuickSelect(wr.sourceCat, "wr-list-quickselect", renderWritingTab, true, key);

  const all = itemsFromLists(wr.sourceCat, state.selected[key]);
  document.getElementById("wr-stat-total").textContent = all.length;
  document.getElementById("wr-stat-undone").textContent = all.filter((i) => i.status === "new").length;
  document.getElementById("wr-stat-correct").textContent = all.filter((i) => i.status === "known").length;
  document.getElementById("wr-stat-wrong").textContent = all.filter((i) => i.status === "difficult").length;

  rebuildWrQueue(false);
  document.getElementById("wr-answer-input").value = "";
  renderWrChat();
}

function renderWritingStatsOnly() {
  const all = itemsFromLists(wr.sourceCat, state.selected[wrSelKey()]);
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
  if (e.code === state.settings.wrHintKey) {
    e.preventDefault();
    wrUseHint();
    return;
  }
  if (e.code === state.settings.wrReadKey) {
    e.preventDefault();
    wrReadCurrentAnswer();
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
   Cài đặt phím tắt (gợi ý Viết / mở popup dịch / đọc câu) — người dùng tự gán
   phím mình muốn trong Cài đặt > Phím tắt (Viết).
   ============================================================ */
function keybindLabel(code) {
  if (!code) return "?";
  const map = {
    AltLeft: "Alt trái", AltRight: "Alt phải",
    ControlLeft: "Ctrl trái", ControlRight: "Ctrl phải",
    ShiftLeft: "Shift trái", ShiftRight: "Shift phải",
    Tab: "Tab", Space: "Space", Enter: "Enter", Escape: "Esc",
    CapsLock: "Caps Lock", Backquote: "`", Backslash: "\\",
    ArrowLeft: "←", ArrowRight: "→", ArrowUp: "↑", ArrowDown: "↓",
  };
  if (map[code]) return map[code];
  if (/^F([1-9]|1[0-9]|2[0-4])$/.test(code)) return code;
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("Numpad")) return "Numpad " + code.slice(6);
  return code;
}
// Danh sách các hành động có thể gán phím tắt riêng — thêm hành động mới chỉ
// cần thêm 1 dòng vào đây, không phải sửa nhiều nơi.
const WR_KEYBIND_ACTIONS = ["wrHintKey", "translateKey", "wrReadKey"];
const WR_KEYBIND_DEFAULTS = { wrHintKey: "AltLeft", translateKey: "F2", wrReadKey: "F3" };
function updateKeybindButtons() {
  WR_KEYBIND_ACTIONS.forEach((action) => {
    const btn = document.querySelector(`.keybind-btn[data-action="${action}"]`);
    if (btn) btn.textContent = keybindLabel(state.settings[action]);
  });
  tpUpdateHotkeyHint();
}
let keybindListening = null; // 1 trong WR_KEYBIND_ACTIONS, hoặc null
function startKeybindCapture(action, btn) {
  document.querySelectorAll(".keybind-btn").forEach((b) => {
    b.classList.remove("listening");
    if (WR_KEYBIND_ACTIONS.includes(b.dataset.action)) b.textContent = keybindLabel(state.settings[b.dataset.action]);
  });
  keybindListening = action;
  btn.classList.add("listening");
  btn.textContent = "Nhấn phím...";
}
document.querySelectorAll(".keybind-btn").forEach((btn) => {
  btn.addEventListener("click", () => startKeybindCapture(btn.dataset.action, btn));
});
// Bắt phím ở pha capture để chặn được cả những phím trình duyệt có thể can
// thiệp trước (ví dụ Tab, F2, Alt) — chỉ hoạt động khi đang ở chế độ chờ gán.
document.addEventListener("keydown", (e) => {
  if (!keybindListening) return;
  e.preventDefault();
  e.stopPropagation();
  if (e.code === "Escape") {
    const btn = document.querySelector(`.keybind-btn[data-action="${keybindListening}"]`);
    keybindListening = null;
    updateKeybindButtons();
    if (btn) btn.classList.remove("listening");
    return;
  }
  const conflictAction = WR_KEYBIND_ACTIONS.find((a) => a !== keybindListening && state.settings[a] === e.code);
  if (conflictAction) {
    showToast("Phím này đang được gán cho hành động khác rồi.");
    return;
  }
  const btn = document.querySelector(`.keybind-btn[data-action="${keybindListening}"]`);
  state.settings[keybindListening] = e.code;
  saveState();
  keybindListening = null;
  updateKeybindButtons();
  if (btn) btn.classList.remove("listening");
}, true);
document.getElementById("settings-keybind-reset").addEventListener("click", () => {
  WR_KEYBIND_ACTIONS.forEach((action) => { state.settings[action] = WR_KEYBIND_DEFAULTS[action]; });
  saveState();
  updateKeybindButtons();
  showToast("Đã đặt lại phím tắt mặc định.");
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
  const listId = state.selected[wrSelKey()][0];
  const list = listId ? getList(wr.sourceCat, listId) : null;
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
    done.textContent = "Đã làm hết các câu trong danh sách này!";
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
  // Khi popup dịch nhanh đang MỞ, bấm vào câu tiếng Việt này sẽ điền thẳng
  // câu đó vào popup (và dịch luôn) — không cần gõ lại tay.
  bubble.title = "Nhấp để điền câu này vào popup dịch (khi popup đang mở)";
  bubble.addEventListener("click", () => {
    if (!tp.open) return;
    tpSetText(item.vi, { dir: "vi-en" });
  });
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
  if (attempt.isHint) pctSpan.innerHTML = icon("bulb");
  else pctSpan.textContent = attempt.correct ? "✓" : attempt.pct + "%";
  const bubble = document.createElement("div");
  const isClickable = clickable && !attempt.correct;
  bubble.className = "nghe-bubble nghe-bubble-right " + (attempt.isHint ? "hint" : (attempt.correct ? "correct" : "wrong")) + (isClickable ? " clickable" : "");
  bubble.textContent = attempt.text;
  if (isClickable) {
    if (attempt.isHint) {
      bubble.title = "Nhấp để chèn từ gợi ý này vào ô nhập";
      bubble.addEventListener("click", () => {
        const input = document.getElementById("wr-answer-input");
        const sep = input.value && !/\s$/.test(input.value) ? " " : "";
        // Thêm dấu cách NGAY SAU từ vừa chèn — để wrCorrectPrefixWordCount()
        // tính từ này là "đã gõ xong", nhờ đó lần bấm gợi ý tiếp theo mới
        // nhận ra và đưa tới đúng từ kế tiếp, thay vì lặp lại mãi từ này
        // (bug cũ: thiếu dấu cách khiến từ luôn bị coi là "đang gõ dở").
        input.value = input.value + sep + attempt.text + " ";
        input.focus();
        wr.historyIndex = null;
        wrUpdateTypingDots();
      });
    } else {
      bubble.title = "Nhấp để dán lại câu này vào ô nhập";
      bubble.addEventListener("click", () => {
        const input = document.getElementById("wr-answer-input");
        input.value = attempt.text;
        input.focus();
        wr.historyIndex = null;
      });
    }
  }
  row.appendChild(pctSpan);
  if (attempt.correct) {
    // Đáp án đúng — không còn nút loa riêng, bấm THẲNG vào bong bóng câu để
    // đọc luôn (đỡ phải rê chuột tìm icon nhỏ).
    bubble.classList.add("clickable");
    bubble.title = "Nhấp để nghe lại câu này";
    bubble.addEventListener("click", (e) => {
      e.stopPropagation();
      playAudio(attempt.text, "en-US");
    });
  }
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

/* Nút ⇄ trên thanh nhập câu: mở/đóng popup dịch nhanh dùng chung toàn app
   (bị khoá ở độ khó Khó — xem tpBlockedReason). */
document.getElementById("wr-translate-toggle-btn").addEventListener("click", () => toggleTranslatePopup());

/* ============================================================
   Gợi ý (nút ? / phím tắt) — mỗi lần dùng gửi 1 bong bóng chat riêng chứa
   TRỌN VẸN 1 TỪ tiếp theo (theo ranh giới từ, không cắt giữa chừng), KHÔNG
   điền trực tiếp vào ô nhập (ô nhập vẫn giữ nguyên những gì người dùng đang
   tự gõ). Các bong bóng gợi ý tự biến mất khỏi khung chat ngay khi câu được
   làm đúng (renderWrChat chỉ hiện đáp án đúng cho câu đã "done", không hiện
   lại các attempt/gợi ý cũ nữa).
   ============================================================ */
// Tách đáp án thành mảng từ (theo khoảng trắng) — dùng để gợi ý luôn theo
// TRỌN 1 TỪ, tránh lỗi cắt giữa từ khi so theo số ký tự thô (ví dụ gõ dở
// "a " của "arrived" từng làm gợi ý nhảy nhầm ra "rrived").
function wrAnswerWords(answer) {
  return (answer || "").split(/\s+/).filter(Boolean);
}
// Đếm số từ ĐÚNG liên tiếp tính từ đầu câu mà người dùng đã tự gõ XONG (đã
// có khoảng trắng theo sau) — từ đang gõ dở (chưa có dấu cách sau nó) KHÔNG
// tính. Vừa gặp 1 từ gõ SAI (không khớp từ đúng ở đúng vị trí đó) là dừng
// đếm ngay, để gợi ý không bao giờ nhảy qua từ đang gõ sai/gõ dở sang từ
// tiếp theo — ví dụ gõ "I am a goo " (sai "good") thì vẫn dừng ở từ thứ 4,
// gợi ý sẽ tiếp tục đưa ra "good" chứ không nhảy sang từ kế tiếp.
function wrCorrectPrefixWordCount(words, typed) {
  const raw = typed || "";
  if (!raw.trim()) return 0;
  const endsWithSpace = /\s$/.test(raw);
  const tokens = raw.trim().split(/\s+/);
  const completedCount = endsWithSpace ? tokens.length : Math.max(0, tokens.length - 1);
  let correct = 0;
  for (let i = 0; i < completedCount; i++) {
    const typedWord = stripPunct(tokens[i] || "").toLowerCase();
    const correctWord = stripPunct(words[i] || "").toLowerCase();
    if (!typedWord || typedWord !== correctWord) break;
    correct++;
  }
  return correct;
}
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
  const words = wrAnswerWords(answer);
  // Từ bắt đầu gợi ý = từ ngay sau từ ĐÚNG cuối cùng người dùng đã tự gõ.
  // Nếu chưa gõ đúng từ đó (kể cả đã dùng gợi ý cho nó trước đây nhưng
  // chưa gõ lại vào ô nhập), gợi ý sẽ tiếp tục đưa ra ĐÚNG từ đó, không
  // đẩy sang từ tiếp theo.
  const idx = wrCorrectPrefixWordCount(words, input.value);
  if (idx >= words.length) return; // đã lộ hết đáp án, không còn gì để gợi ý thêm
  const word = words[idx];
  // Chống spam: nếu lần gợi ý gần nhất CŨNG đang gợi ý đúng từ này (idx chưa
  // đổi vì người dùng chưa gõ/chèn từ đó vào ô nhập), không tính thêm lượt
  // và không nhân thêm bong bóng trùng lặp — bấm dồn dập không còn dồn ra
  // nhiều từ/cả câu nữa, chỉ khi nào từ hiện tại đã "gõ xong" đúng thì mới
  // được cấp gợi ý tiếp theo.
  const existing = wrAttempts[item.id] || [];
  const lastHint = [...existing].reverse().find((a) => a.isHint);
  if (lastHint && lastHint.text === word) {
    showToast("Chèn từ gợi ý vào ô nhập rồi mới gợi ý được từ tiếp theo.");
    return;
  }
  wrHintCount[item.id] = used + 1;
  (wrAttempts[item.id] = existing);
  existing.push({ text: word, isHint: true });
  renderWrChat();
}
document.getElementById("wr-hint-btn").addEventListener("click", wrUseHint);

/* ============================================================
   Đọc nhanh câu đúng/gợi ý bằng phím tắt (Cài đặt > Phím tắt > "Đọc câu
   đúng/gợi ý") — chỉ đọc lại những gì ĐANG hiện sẵn trong khung chat (bong
   bóng đáp án đúng nếu câu đã xong, hoặc bong bóng gợi ý gần nhất nếu chưa),
   không tiết lộ thêm thông tin nào mới ngoài những gì người dùng đã thấy.
   ============================================================ */
function wrReadCurrentAnswer() {
  const item = currentWrItem();
  if (!item) return;
  const prog = ensureWrProgress(item);
  if (prog.done) {
    playAudio(prog.correctText || item.en, "en-US");
    return;
  }
  const atts = wrAttempts[item.id] || [];
  for (let i = atts.length - 1; i >= 0; i--) {
    if (atts[i].isHint) {
      playAudio(atts[i].text, "en-US");
      return;
    }
  }
  showToast("Chưa có gợi ý nào để đọc — dùng gợi ý trước đã.");
}


const WR_DIFFICULTY_GAIN = { easy: 5, medium: 15, hard: 35 };
const WR_DIFFICULTY_PENALTY = { easy: 2, medium: 6, hard: 14 };

function flashAnswerFeedback(isCorrect) {
  if (isCorrect) playCorrectSound(); else playWrongSound();
  const cls = isCorrect ? "flash-correct" : "flash-wrong";
  const el = document.getElementById("wr-chat-scroll");
  magicAnswerFx(isCorrect, el);
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
    // Hiện đáp án CHUẨN có sẵn trong dữ liệu (đáp án vừa khớp), không lấy
    // nguyên văn người chơi gõ — tránh lệch hoa/thường, dấu câu, khoảng
    // trắng thừa... so với đáp án gốc.
    prog.correctText = grade.matchedText || item.en;
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
  btn.textContent = WR_DIFFICULTY_LABELS[wr.difficulty] + (wr.difficultyLocked ? " · khoá" : "");
  btn.classList.remove("difficulty-easy", "difficulty-medium", "difficulty-hard");
  btn.classList.add("difficulty-" + wr.difficulty);
  btn.classList.toggle("locked", wr.difficultyLocked);
  btn.title = wr.difficultyLocked
    ? "Đã bắt đầu làm câu này — sang câu tiếp theo mới đổi được độ khó"
    : "Bấm để đổi độ khó: Dễ → Trung bình → Khó";
  document.getElementById("wr-hint-btn").disabled = wr.difficulty === "hard";
  document.getElementById("wr-translate-toggle-btn").disabled = wr.difficulty === "hard";
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
      // từ trong đáp án ĐÃ lộ nên cho tra kể cả ở độ khó Khó (force)
      openTranslatePopup({ text: phrase, dir: "en-vi", force: true, noFocus: true });
    } else if (tp.open) {
      tpClearAll();
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
// Nút nhỏ cạnh xáo trộn — mở lại đúng overlay chọn giọng đọc dùng chung với
// tab Nghe (state.settings.ngheVoiceMode / ngheSingleVoiceURI áp dụng cho cả
// 2 tab vì đều phát âm qua playAudio()).
document.getElementById("wr-voice-settings-btn").addEventListener("click", ngheOpenVoiceOverlay);

// Bôi đen 1 đoạn trong câu đề (bong bóng bên trái) sẽ tự điền + dịch nhanh
// đoạn đó trong popup dịch (tự mở popup lên nếu đang đóng).
document.getElementById("wr-chat-scroll").addEventListener("mouseup", (e) => {
  if (!e.target.closest(".nghe-bubble-left")) return;
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : "";
  if (!text) return;
  openTranslatePopup({ text, noFocus: true });
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
  if (btn) { btn.innerHTML = icon("play"); btn.classList.remove("playing"); }
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
  btn.innerHTML = icon("stop");
  btn.classList.add("playing");
  ngheSpeakLinesSequentially(item.lines, 0, token, () => {
    if (ngheFullPlayToken === token) {
      ngheFullPlayToken = null;
      btn.innerHTML = icon("play");
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
   DỊCH NHANH — popup NỔI dùng chung toàn app
   - Mở/đóng: phím tắt (Cài đặt > Phím tắt (Chung)), nút ở đầu thanh bên, nút ⇄ ở tab Viết.
   - KHÔNG đóng khi bấm ra ngoài; đóng bằng ✕, phím Esc hoặc bấm lại phím tắt.
   - Không chặn trang: vẫn bấm / bôi đen chữ phía sau được (lúc popup mở, phím tắt của trang tạm tắt).
   - Lấy nội dung trực tiếp: chữ đang bôi đen, hoặc nội dung đang hiện ở tab hiện tại
     (Thẻ: mặt thẻ · Viết: câu đề / câu đang gõ · Nghe: câu đã mở).
   ============================================================ */
const TP_CACHE_KEY = "nox_tr_cache_v1";
const TP_POS_KEY = "nox_tr_pos_v1";
const TP_MAX_CHARS = 450;         // MyMemory giới hạn ~500 byte mỗi lần gọi
const TP_MAX_FOLLOW_CHARS = 1500; // bôi đen dài hơn mức này thì không tự điền

const tp = {
  open: false,
  dir: "vi-en",
  lastEn: "", lastVi: "", lastIPA: "", sourceText: "",
  requestId: 0,
  debounce: null,
  pollTimer: null,
  selTimer: null,
  sourcesSig: "",
  followSig: "",
  activeSourceId: null,
  lastSelFilled: "",
  selMemory: "",   // chữ bôi đen gần nhất đã lấy (giữ lại nút nguồn dù vùng chọn trên trang đã mất)
  prevFocus: null,
};
function tpEl(id) { return document.getElementById(id); }

/* ---------- Bộ nhớ đệm bản dịch (localStorage, tối đa ~300 mục) ---------- */
function tpCacheGet(key) {
  try {
    const m = JSON.parse(localStorage.getItem(TP_CACHE_KEY) || "{}");
    return m[key] && Array.isArray(m[key].c) ? m[key].c : null;
  } catch (e) { return null; }
}
function tpCacheSet(key, candidates) {
  try {
    const m = JSON.parse(localStorage.getItem(TP_CACHE_KEY) || "{}");
    m[key] = { c: candidates, t: Date.now() };
    const keys = Object.keys(m);
    if (keys.length > 300) keys.sort((x, y) => m[x].t - m[y].t).slice(0, keys.length - 250).forEach((k) => { delete m[k]; });
    localStorage.setItem(TP_CACHE_KEY, JSON.stringify(m));
  } catch (e) { /* hết dung lượng thì bỏ qua */ }
}

/* ---------- Gọi MyMemory ---------- */
// Cắt đoạn dài thành các khúc ≤ TP_MAX_CHARS, ưu tiên cắt ở cuối câu
function tpSplitChunks(text) {
  const parts = text.match(/[^.!?…\n]+[.!?…]*/g) || [text];
  const chunks = [];
  let cur = "";
  parts.forEach((p0) => {
    let p = p0.trim();
    if (!p) return;
    while (p.length > TP_MAX_CHARS) {
      let cut = p.lastIndexOf(" ", TP_MAX_CHARS);
      if (cut < 1) cut = TP_MAX_CHARS;
      if (cur) { chunks.push(cur); cur = ""; }
      chunks.push(p.slice(0, cut).trim());
      p = p.slice(cut).trim();
    }
    if (cur && (cur + " " + p).length > TP_MAX_CHARS) { chunks.push(cur); cur = p; }
    else cur = cur ? cur + " " + p : p;
  });
  if (cur) chunks.push(cur);
  return chunks;
}

async function tpFetchCandidates(text, dir) {
  const key = dir + "|" + text.toLowerCase();
  const cached = tpCacheGet(key);
  if (cached) return cached;
  const langpair = dir === "vi-en" ? "vi|en" : "en|vi";
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}&de=nox-app@example.com`);
  const data = await res.json();
  const primary = data && data.responseData && data.responseData.translatedText;
  if (Number(data && data.responseStatus) === 429 || /MYMEMORY WARNING/i.test(primary || "")) {
    const err = new Error("quota");
    err.quota = true; // hết lượt dịch miễn phí trong ngày
    throw err;
  }
  // Gom bản dịch chính + các nghĩa thay thế MyMemory tìm được trong kho dịch (gợi ý đồng nghĩa)
  let candidates = [];
  if (primary) candidates.push(primary.trim());
  if (data && Array.isArray(data.matches)) {
    data.matches.slice().sort((x, y) => (y.match || 0) - (x.match || 0)).forEach((m) => {
      const t = (m.translation || "").trim();
      if (t) candidates.push(t);
    });
  }
  const seen = new Set();
  candidates = candidates.filter((c) => {
    const k = c.toLowerCase();
    if (!c || k === text.toLowerCase() || seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 6);
  if (candidates.length) tpCacheSet(key, candidates);
  return candidates;
}

/* ---------- Giao diện: chiều dịch, kết quả, nút ---------- */
function tpUpdateDirUI() {
  const vi = tp.dir === "vi-en";
  tpEl("translate-lang-from").textContent = vi ? "Tiếng Việt" : "Tiếng Anh";
  tpEl("translate-lang-to").textContent = vi ? "Tiếng Anh" : "Tiếng Việt";
  tpEl("translate-input").placeholder = vi ? "Nhập hoặc dán tiếng Việt ..." : "Nhập hoặc dán tiếng Anh ...";
  tpEl("translate-dir-toggle").title = vi ? "Đổi chiều dịch (V → E)" : "Đổi chiều dịch (E → V)";
}
function tpUpdateGoogleLink() {
  const text = tpEl("translate-input").value.trim();
  const vi = tp.dir === "vi-en";
  tpEl("translate-open-google").href = "https://translate.google.com/?sl=" + (vi ? "vi" : "en") + "&tl=" + (vi ? "en" : "vi") +
    (text ? "&text=" + encodeURIComponent(text) : "") + "&op=translate";
}
function tpAutoGrow() {
  const el = tpEl("translate-input");
  el.style.height = "auto";
  el.style.height = Math.min(160, Math.max(58, el.scrollHeight)) + "px";
}
function tpResetOutput() {
  tp.lastEn = ""; tp.lastVi = ""; tp.lastIPA = ""; tp.sourceText = "";
}
function tpClearAll() {
  clearTimeout(tp.debounce);
  tp.requestId++; // huỷ yêu cầu đang chờ
  tpEl("translate-input").value = "";
  tpEl("translate-result").innerHTML = "";
  tpEl("translate-result").classList.remove("qt-error", "qt-loading");
  tpResetOutput();
  tp.activeSourceId = null;
  tpAutoGrow();
  tpUpdateGoogleLink();
}
// Gộp lại các nghĩa đang được chọn (chọn nhiều được) thành lastEn / lastVi
function tpRecomputeSelection() {
  const selected = [...tpEl("translate-result").querySelectorAll(".qt-candidate-selected")].map((el) => el.textContent);
  const joined = selected.join(" / ");
  if (tp.dir === "vi-en") { tp.lastVi = tp.sourceText; tp.lastEn = joined; }
  else { tp.lastEn = tp.sourceText; tp.lastVi = joined; }
}

async function tpTranslate() {
  const input = tpEl("translate-input");
  const box = tpEl("translate-result");
  const text = input.value.trim();
  box.classList.remove("qt-error", "qt-loading");
  if (!text) {
    box.innerHTML = "";
    tpResetOutput();
    tpUpdateGoogleLink();
    return;
  }
  if (state.settings && state.settings.qtAutoDetectLang) {
    const wanted = detectIsVietnamese(text) ? "vi-en" : "en-vi";
    if (wanted !== tp.dir) { tp.dir = wanted; tpUpdateDirUI(); }
  }
  tp.sourceText = text;
  tpUpdateGoogleLink();
  box.textContent = "Đang dịch...";
  box.classList.add("qt-loading");
  const myId = ++tp.requestId;
  try {
    let candidates;
    if (text.length > TP_MAX_CHARS) {
      // đoạn dài: dịch từng khúc rồi ghép lại thành 1 bản dịch
      const out = [];
      for (const chunk of tpSplitChunks(text)) {
        const c = await tpFetchCandidates(chunk, tp.dir);
        if (myId !== tp.requestId) return;
        out.push(c[0] || chunk);
      }
      candidates = [out.join(" ")];
    } else {
      candidates = await tpFetchCandidates(text, tp.dir);
    }
    if (myId !== tp.requestId) return; // đã có yêu cầu mới hơn, bỏ kết quả này
    box.classList.remove("qt-loading");
    if (!candidates.length) {
      box.textContent = "Không tìm thấy bản dịch.";
      box.classList.add("qt-error");
      tp.lastEn = ""; tp.lastVi = "";
      return;
    }
    box.innerHTML = "";
    candidates.forEach((c, idx) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "qt-candidate" + (idx === 0 ? " qt-candidate-primary qt-candidate-selected" : "");
      chip.textContent = c;
      chip.title = "Nhấn để chọn / bỏ chọn nghĩa này (chọn được nhiều nghĩa)";
      chip.addEventListener("click", () => {
        chip.classList.toggle("qt-candidate-selected");
        tpRecomputeSelection();
      });
      box.appendChild(chip);
    });
    tpRecomputeSelection();

    // Phiên âm + từ loại (chỉ áp dụng cho TỪ ĐƠN tiếng Anh)
    const englishWord = tp.dir === "vi-en" ? candidates[0] : text;
    Promise.all([fetchPartOfSpeech(englishWord), fetchIPA(englishWord)]).then(([posList, ipa]) => {
      if (myId !== tp.requestId) return;
      tp.lastIPA = ipa;
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
      badges.forEach((b) => box.insertBefore(b, box.firstChild));
    });
  } catch (err) {
    if (myId !== tp.requestId) return;
    box.classList.remove("qt-loading");
    box.textContent = err && err.quota
      ? "Đã hết lượt dịch miễn phí hôm nay — bấm “Mở Google Translate” bên dưới để dịch tiếp."
      : "Lỗi kết nối, thử lại sau.";
    box.classList.add("qt-error");
    tp.lastEn = ""; tp.lastVi = "";
  }
}

// Điền nội dung + dịch. dir bỏ trống thì tự nhận diện Việt / Anh theo dấu tiếng Việt.
function tpSetText(text, opts = {}) {
  const input = tpEl("translate-input");
  input.value = text;
  tp.dir = opts.dir || (detectIsVietnamese(text) ? "vi-en" : "en-vi");
  tpUpdateDirUI();
  tpAutoGrow();
  clearTimeout(tp.debounce);
  if (opts.translate !== false) tpTranslate();
  else tpUpdateGoogleLink();
}

/* ---------- Lấy nội dung trực tiếp từ trang ---------- */
function tpCurrentTab() {
  const el = document.querySelector(".tab-content:not(.hidden)");
  return el ? el.dataset.content : "";
}
// Chữ đang bôi đen NGOÀI popup (kể cả bôi trong ô nhập như câu đang gõ)
function tpSelectionText() {
  const pop = tpEl("translate-overlay");
  const ae = document.activeElement;
  if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA") && !pop.contains(ae) && !ae.closest(".hidden")) {
    try {
      if (typeof ae.selectionStart === "number" && ae.selectionEnd > ae.selectionStart) {
        return ae.value.slice(ae.selectionStart, ae.selectionEnd).trim();
      }
    } catch (e) { /* một số kiểu input không cho đọc vùng chọn */ }
  }
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return "";
  const node = sel.anchorNode;
  const elNode = node && (node.nodeType === 1 ? node : node.parentElement);
  if (elNode && (pop.contains(elNode) || elNode.closest(".hidden"))) return ""; // bỏ vùng chọn cũ nằm trong tab đã ẩn
  return sel.toString().trim();
}
// Danh sách nguồn nội dung đang có. Nguồn đầu tiên là nguồn mặc định khi mở popup.
function tpGatherSources() {
  const out = [];
  const sel = tpSelectionText();
  if (sel) out.push({ id: "sel", label: "Chữ đang bôi đen", text: sel });
  else if (tp.open && tp.selMemory) out.push({ id: "sel", label: "Chữ vừa bôi đen", text: tp.selMemory });
  const tab = tpCurrentTab();
  if (tab === "flashcard" && fc.view === "flip") {
    const item = fc.queue.length ? fcItemById(fc.queue[Math.min(fc.index, fc.queue.length - 1)]) : null;
    if (item) {
      const front = fc.direction === "e-v" ? item.en : item.vi;
      const back = fc.direction === "e-v" ? item.vi : item.en;
      out.push({ id: "fc-shown", label: "Thẻ đang hiện", text: fc.showingBack ? back : front });
      out.push({ id: "fc-other", label: fc.showingBack ? "Mặt trước" : "Mặt sau", text: fc.showingBack ? front : back });
    }
  } else if (tab === "writing") {
    const item = currentWrItem();
    if (item) {
      out.push({ id: "wr-prompt", label: "Câu đề", text: item.vi });
      const typed = (tpEl("wr-answer-input").value || "").trim();
      if (typed) out.push({ id: "wr-typed", label: "Câu đang gõ", text: typed });
      if (ensureWrProgress(item).done) out.push({ id: "wr-answer", label: "Đáp án đúng", text: item.en.split("|")[0].trim() });
    }
  } else if (tab === "listening") {
    const item = ngheCurrentItem();
    if (item) {
      const p = ngheEnsureProgress(item);
      const opened = item.lines.filter((l, i) => p.lineStates[i] && p.lineStates[i].done);
      if (opened.length) {
        out.push({ id: "ng-last", label: "Câu vừa mở", text: opened[opened.length - 1].text });
        if (opened.length > 1) out.push({ id: "ng-all", label: "Cả đoạn đã mở", text: opened.map((l) => l.text).join(" ") });
      }
      const typed = (tpEl("nghe-answer-input").value || "").trim();
      if (typed) out.push({ id: "ng-typed", label: "Câu đang gõ", text: typed });
    }
  }
  return out;
}
function tpRenderSources(sources) {
  const box = tpEl("translate-sources");
  box.innerHTML = "";
  const cur = tpEl("translate-input").value.trim();
  sources.forEach((src) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tp-source-chip" + (src.text.trim() === cur ? " active" : "");
    b.textContent = src.label;
    b.title = src.text.length > 140 ? src.text.slice(0, 140) + "…" : src.text;
    b.addEventListener("mousedown", (e) => e.preventDefault()); // không làm mất focus / vùng bôi đen
    b.addEventListener("click", () => { tp.activeSourceId = src.id; tpSetText(src.text); });
    box.appendChild(b);
  });
  const paste = document.createElement("button");
  paste.type = "button";
  paste.className = "tp-source-chip tp-paste";
  paste.textContent = "Dán";
  paste.title = "Dán chữ từ clipboard";
  paste.addEventListener("click", async () => {
    try {
      const t = ((await navigator.clipboard.readText()) || "").trim();
      if (t) { tp.activeSourceId = "paste"; tpSetText(t); }
      else showToast("Clipboard đang trống.");
    } catch (e) {
      showToast("Trình duyệt không cho đọc clipboard — hãy dán (Ctrl+V) vào ô nhập.");
    }
  });
  box.appendChild(paste);
}

// Lý do popup không được dùng ở màn hình hiện tại ("" = được dùng)
function tpBlockedReason() {
  if (tpCurrentTab() === "writing" && wr.difficulty === "hard") return "Độ khó Khó: khoá dịch nhanh ở tab Viết.";
  return "";
}

// Chạy định kỳ khi popup mở: cập nhật nút nguồn khi đổi thẻ / câu / tab, và tự điền nếu bật chế độ theo dõi
function tpPoll() {
  if (!tp.open) return;
  const reason = tpBlockedReason();
  if (reason) { closeTranslatePopup(true); showToast(reason); return; }
  const sources = tpGatherSources();
  const sig = tpCurrentTab() + "§" + sources.map((x) => x.id + "=" + x.text).join("§") + "§" + tpEl("translate-input").value.trim();
  if (sig !== tp.sourcesSig) { tp.sourcesSig = sig; tpRenderSources(sources); }
  const main = sources.find((x) => x.id !== "sel" && x.id !== "wr-typed" && x.id !== "ng-typed");
  const followSig = tpCurrentTab() + "§" + (main ? main.id + "=" + main.text : "");
  if (followSig !== tp.followSig) {
    const hadPrev = tp.followSig !== "";
    tp.followSig = followSig;
    if (hadPrev && main && state.settings.translateFollowCard) { tp.activeSourceId = main.id; tpSetText(main.text); }
  }
}

// Bôi đen chữ ở trang khi popup đang mở -> tự điền + dịch (nếu bật trong Cài đặt)
function tpOnSelectionChange() {
  clearTimeout(tp.selTimer);
  if (!tp.open || state.settings.translateFollowSel === false) return;
  tp.selTimer = setTimeout(() => {
    if (!tp.open || tpBlockedReason()) return;
    const text = tpSelectionText();
    if (!text) { tp.lastSelFilled = ""; return; }
    if (text.length > TP_MAX_FOLLOW_CHARS || text === tp.lastSelFilled) return;
    tp.lastSelFilled = text;
    tp.selMemory = text;
    tp.activeSourceId = "sel";
    tpSetText(text);
  }, 350);
}
document.addEventListener("selectionchange", tpOnSelectionChange);

/* ---------- Mở / đóng / vị trí ---------- */
function tpIsMobile() { return window.matchMedia("(max-width:900px)").matches; }
function tpClampPos(left, top) {
  const pop = tpEl("translate-popup");
  const w = pop.offsetWidth, h = pop.offsetHeight;
  return {
    left: Math.min(Math.max(8, left), Math.max(8, window.innerWidth - w - 8)),
    top: Math.min(Math.max(8, top), Math.max(8, window.innerHeight - h - 8)),
  };
}
function tpApplyPosition() {
  const pop = tpEl("translate-popup");
  let saved = null;
  if (!tpIsMobile()) { try { saved = JSON.parse(localStorage.getItem(TP_POS_KEY) || "null"); } catch (e) { saved = null; } }
  if (saved && typeof saved.left === "number" && typeof saved.top === "number") {
    const p = tpClampPos(saved.left, saved.top);
    pop.style.left = p.left + "px"; pop.style.top = p.top + "px";
    pop.style.right = "auto"; pop.style.bottom = "auto";
  } else {
    pop.style.left = ""; pop.style.top = ""; pop.style.right = ""; pop.style.bottom = "";
  }
}
function tpUpdateHotkeyHint() {
  const label = keybindLabel(state.settings.translateKey || "F2");
  const hint = document.getElementById("translate-hotkey-hint");
  if (hint) hint.textContent = label;
  const btn = document.getElementById("translate-open-btn");
  if (btn) btn.title = "Dịch nhanh (" + label + ")";
}

// opts: text / dir = nội dung + chiều dịch muốn điền sẵn; force = bỏ qua khoá độ khó;
//       noFocus = không chuyển con trỏ vào popup (dùng khi mở từ thao tác bấm / bôi đen trên trang)
function openTranslatePopup(opts = {}) {
  const reason = opts.force ? "" : tpBlockedReason();
  if (reason) { showToast(reason); return; }
  const overlay = tpEl("translate-overlay");
  const wasOpen = tp.open;
  if (!wasOpen) {
    const ae = document.activeElement;
    tp.prevFocus = ae && !overlay.contains(ae) ? ae : null;
  }
  tp.open = true;
  overlay.classList.remove("hidden");
  tpApplyPosition();
  tpUpdateHotkeyHint();
  const sources = tpGatherSources();
  let text = opts.text;
  if ((text === undefined || text === null || text === "") && !wasOpen && sources.length) {
    text = sources[0].text;
    tp.activeSourceId = sources[0].id;
  }
  if (text) {
    tpSetText(text, { dir: opts.dir });
    if (sources.length && sources[0].id === "sel") { tp.lastSelFilled = sources[0].text; tp.selMemory = sources[0].text; }
  } else if (!wasOpen) {
    if (state.settings.qtClearOnRefocus) tpClearAll();
    else if (tpEl("translate-result").classList.contains("qt-loading")) tpTranslate();
    tpUpdateDirUI();
  }
  tp.sourcesSig = "";
  const main = sources.find((x) => x.id !== "sel" && x.id !== "wr-typed" && x.id !== "ng-typed");
  tp.followSig = tpCurrentTab() + "§" + (main ? main.id + "=" + main.text : "");
  tpRenderSources(sources);
  if (!tp.pollTimer) tp.pollTimer = setInterval(tpPoll, 500);
  if (!opts.noFocus) {
    setTimeout(() => { const el = tpEl("translate-input"); el.focus(); el.select(); }, 0);
  }
}
function closeTranslatePopup(skipRestoreFocus) {
  if (!tp.open) return;
  tp.open = false;
  tp.selMemory = "";
  tp.lastSelFilled = "";
  clearTimeout(tp.debounce);
  clearTimeout(tp.selTimer);
  clearInterval(tp.pollTimer);
  tp.pollTimer = null;
  const overlay = tpEl("translate-overlay");
  const ae = document.activeElement;
  if (ae && overlay.contains(ae)) ae.blur();
  overlay.classList.add("hidden");
  const prev = tp.prevFocus;
  tp.prevFocus = null;
  if (!skipRestoreFocus && prev && document.contains(prev) && typeof prev.focus === "function") {
    try { prev.focus({ preventScroll: true }); } catch (e) { /* bỏ qua */ }
  }
}
function toggleTranslatePopup() {
  if (tp.open) closeTranslatePopup();
  else openTranslatePopup();
}

/* ---------- Gắn sự kiện ---------- */
tpEl("translate-close").addEventListener("click", () => closeTranslatePopup());
tpEl("translate-open-btn").addEventListener("click", () => toggleTranslatePopup());
tpEl("translate-clear").addEventListener("click", () => { tpClearAll(); tpEl("translate-input").focus(); });
tpEl("translate-dir-toggle").addEventListener("click", () => {
  const prevTranslated = tp.dir === "vi-en" ? tp.lastEn : tp.lastVi;
  tp.dir = tp.dir === "vi-en" ? "en-vi" : "vi-en";
  tpUpdateDirUI();
  if (prevTranslated) {
    // đảo chiều: bản dịch hiện tại trở thành nội dung nguồn mới
    tpEl("translate-input").value = prevTranslated;
    tpEl("translate-result").innerHTML = "";
    tpAutoGrow();
    tpTranslate();
  } else {
    tpUpdateGoogleLink();
  }
});
tpEl("translate-input").addEventListener("input", () => {
  tpAutoGrow();
  clearTimeout(tp.debounce);
  tp.debounce = setTimeout(tpTranslate, 600);
});
tpEl("translate-input").addEventListener("keydown", (e) => {
  // Enter = dịch ngay; Shift+Enter = xuống dòng
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    clearTimeout(tp.debounce);
    tpTranslate();
  }
});
tpEl("translate-play").addEventListener("click", () => {
  if (!tp.lastEn) { showToast("Chưa có từ tiếng Anh để phát âm."); return; }
  playAudio(tp.lastEn);
});
tpEl("translate-save").addEventListener("click", () => {
  if (!tp.lastEn || !tp.lastVi) { showToast("Chưa có bản dịch để lưu."); return; }
  let list = getList("dictionary", state.activeWhList.dictionary);
  if (!list) {
    list = getCategory("dictionary")[0];
    if (!list) {
      list = defaultList("Danh sách 1");
      getCategory("dictionary").push(list);
    }
    state.activeWhList.dictionary = list.id;
  }
  list.items.push({ id: uid(), en: tp.lastEn, vi: tp.lastVi, status: "new", ipa: tp.lastIPA || "" });
  saveState();
  showToast(`Đã lưu vào Từ điển — ${list.name}`);
});
tpEl("translate-copy").addEventListener("click", async () => {
  const out = tp.dir === "vi-en" ? tp.lastEn : tp.lastVi;
  if (!out) { showToast("Chưa có bản dịch để sao chép."); return; }
  try {
    await navigator.clipboard.writeText(out);
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = out;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e2) { /* bỏ qua */ }
    ta.remove();
  }
  showToast("Đã sao chép bản dịch.");
});

// Phím tắt chung (bắt ở pha capture để dùng được cả khi đang gõ trong ô nhập).
document.addEventListener("keydown", (e) => {
  // đang gán phím ở Cài đặt (hoặc chính lần nhấn phím vừa dùng để gán) thì không xử lý
  if (keybindListening || e.defaultPrevented || e.repeat) return;
  if (tp.open && e.code === "Escape") {
    e.preventDefault();
    closeTranslatePopup();
    return;
  }
  const code = state.settings.translateKey || "F2";
  if (e.code !== code) return;
  const isModifierKey = /^(Alt|Control|Shift|Meta)/.test(code);
  // Phím F1–F12 / Alt / Ctrl... không in ra ký tự nên dùng được cả khi đang gõ; phím chữ thì chỉ khi KHÔNG đang gõ
  const typingSafe = /^F\d+$/.test(code) || isModifierKey;
  if (!typingSafe && isTypingTarget()) return;
  if (!isModifierKey && (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey)) return; // F2 khác với Ctrl+F2...
  e.preventDefault();
  e.stopPropagation();
  toggleTranslatePopup();
}, true);

// Kéo popup bằng thanh tiêu đề (chỉ máy tính; điện thoại popup nằm sát đáy màn hình)
(function tpSetupDrag() {
  const handle = tpEl("translate-drag-handle");
  const pop = tpEl("translate-popup");
  let drag = null;
  handle.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button") || tpIsMobile()) return;
    const r = pop.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    try { handle.setPointerCapture(e.pointerId); } catch (err) { /* bỏ qua */ }
    e.preventDefault();
  });
  handle.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const p = tpClampPos(e.clientX - drag.dx, e.clientY - drag.dy);
    pop.style.left = p.left + "px"; pop.style.top = p.top + "px";
    pop.style.right = "auto"; pop.style.bottom = "auto";
  });
  const end = (e) => {
    if (!drag) return;
    drag = null;
    try { handle.releasePointerCapture(e.pointerId); } catch (err) { /* bỏ qua */ }
    const r = pop.getBoundingClientRect();
    try { localStorage.setItem(TP_POS_KEY, JSON.stringify({ left: Math.round(r.left), top: Math.round(r.top) })); } catch (err) { /* bỏ qua */ }
  };
  handle.addEventListener("pointerup", end);
  handle.addEventListener("pointercancel", end);
  window.addEventListener("resize", () => { if (tp.open) tpApplyPosition(); });
})();
tpUpdateHotkeyHint();

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
    done.textContent = "Hoàn thành bài này! Chọn bài khác ở thanh bên trái để luyện tiếp.";
    scroll.appendChild(done);
  }

  scroll.scrollTop = scroll.scrollHeight;
}

function ngheBuildLeftBubble(line, lineState, lineIdx, isActive, item) {
  const row = document.createElement("div");
  row.className = "nghe-bubble-row left";
  const avatar = document.createElement("div");
  avatar.className = "nghe-avatar";
  if (line.speaker) avatar.textContent = line.speaker[0].toUpperCase();
  else avatar.innerHTML = icon("volume");
  const wrap = document.createElement("div");
  wrap.className = "nghe-left-wrap";
  const bubble = document.createElement("button");
  bubble.type = "button";
  const revealed = lineState.done;
  bubble.className = "nghe-bubble nghe-bubble-left" + (revealed ? "" : " unrevealed");
  if (revealed) {
    bubble.textContent = line.text;
  } else {
    bubble.innerHTML = `<span class="nghe-play-icon">${icon("play")}</span><span class="nghe-wave"></span>`;
    if (lineState.skipped) {
      const skipBadge = document.createElement("span");
      skipBadge.className = "nghe-skip-badge";
      skipBadge.title = "Câu đã bỏ qua — bấm để quay lại làm";
      skipBadge.innerHTML = icon("skip");
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
    tBtn.innerHTML = icon("globe");
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
    magicAnswerFx(true, document.getElementById("nghe-chat-scroll"));
    ngheResolveLine("correct");
  } else {
    lineState.attempts.push({ text: typed, pct });
    magicAnswerFx(false, document.getElementById("nghe-chat-scroll"));
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
  btn.textContent = NGHE_DIFFICULTY_LABELS[nghe.difficulty] + (nghe.difficultyLocked ? " · khoá" : "");
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
   TAB 3: NGỮ PHÁP
   - Nội dung ở grammar-data.json (tải 1 lần khi mở tab; Service Worker giữ cache để đọc offline).
   - state.grammar (đồng bộ cloud): unit đang đọc + danh sách unit đã đánh dấu.
   - Vị trí cuộn lưu RIÊNG theo thiết bị (localStorage) vì mỗi màn hình cuộn một khác,
     và để việc cuộn không đẩy cả state lên cloud liên tục.
   ============================================================ */
const GRAMMAR_DATA_URL = "grammar-data.json";
const GRAMMAR_POS_KEY = "nox_grammar_pos";

const grammar = {
  units: null,      // mảng unit sau khi tải xong
  byId: {},
  loading: false,
  failed: false,
  currentId: null,
  query: "",        // từ khoá đã chuẩn hoá (thường, bỏ dấu); rỗng = không tìm
  matches: {},      // unitId -> số chỗ khớp
  hits: [],         // các <mark> trong unit đang mở
  hitIndex: -1,
  lastP: 0,         // vị trí cuộn gần nhất (0..1) của unit đang mở
  searchTimer: null,
  scrollTimer: null,
  indexReady: false,
};

// state.grammar có thể chưa tồn tại (backup / dữ liệu cloud từ bản cũ) -> luôn đi qua hàm này
function grammarState() {
  if (!state.grammar || typeof state.grammar !== "object") state.grammar = { lastUnit: null, bookmarks: [] };
  if (!Array.isArray(state.grammar.bookmarks)) state.grammar.bookmarks = [];
  return state.grammar;
}

function grammarTabVisible() {
  const el = document.querySelector('.tab-content[data-content="grammar"]');
  return !!el && !el.classList.contains("hidden");
}

// Chuẩn hoá để tìm không phân biệt hoa/thường và dấu tiếng Việt. Mỗi ký tự vào cho ra đúng
// độ dài cũ, nên vị trí khớp trong chuỗi chuẩn hoá trỏ đúng vị trí trong chuỗi gốc.
function grammarFold(str) {
  let out = "";
  for (const ch of str) {
    const f = ch === "đ" || ch === "Đ" ? "d" : ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    out += f.length === ch.length ? f : ch;
  }
  return out;
}

/* ---------- Tải dữ liệu ---------- */
async function loadGrammarData() {
  if (grammar.loading) return;
  grammar.loading = true;
  grammar.failed = false;
  try {
    const res = await fetch(GRAMMAR_DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data || !Array.isArray(data.units) || !data.units.length) throw new Error("Dữ liệu ngữ pháp không hợp lệ");
    grammar.units = data.units;
    grammar.byId = {};
    data.units.forEach((u) => { grammar.byId[u.id] = u; });
    grammar.indexReady = false;
    const sel = document.getElementById("grammar-unit-select");
    sel.innerHTML = "";
    data.units.forEach((u) => {
      const opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = `Unit ${u.num}: ${u.title}`;
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error("Không tải được ngữ pháp:", err);
    grammar.failed = true;
  }
  grammar.loading = false;
  if (grammarTabVisible()) renderGrammarTab();
}

/* ---------- Vẽ tab ---------- */
function renderGrammarTab() {
  const view = document.getElementById("grammar-view");
  if (!grammar.units) {
    if (grammar.failed) {
      view.innerHTML = '<div class="grammar-empty">Không tải được dữ liệu ngữ pháp.<br>Kiểm tra kết nối mạng rồi thử lại.<br><button type="button" class="block-btn primary" id="grammar-retry-btn">Thử lại</button></div>';
      document.getElementById("grammar-retry-btn").addEventListener("click", () => {
        view.innerHTML = '<div class="grammar-empty">Đang tải ngữ pháp…</div>';
        loadGrammarData();
      });
    } else {
      view.innerHTML = '<div class="grammar-empty">Đang tải ngữ pháp…</div>';
      if (!grammar.loading) loadGrammarData();
    }
    syncGrammarControls();
    return;
  }
  if (!grammar.currentId) {
    // lần đầu mở trong phiên này: về đúng unit + vị trí đang đọc dở
    const gs = grammarState();
    const startId = grammar.byId[gs.lastUnit] ? gs.lastUnit : grammar.units[0].id;
    let p = 0;
    try {
      const pos = JSON.parse(localStorage.getItem(GRAMMAR_POS_KEY) || "null");
      if (pos && pos.id === startId && typeof pos.p === "number") p = pos.p;
    } catch (e) { /* bỏ qua */ }
    openGrammarUnit(startId, { restoreP: p });
    renderGrammarSidebar();
  } else {
    // quay lại tab: tab bị ẩn làm scrollTop về 0 nên đặt lại vị trí cũ
    renderGrammarSidebar();
    syncGrammarControls();
    grammarApplyScroll(grammar.lastP);
  }
}

function grammarApplyScroll(p) {
  const sc = document.getElementById("grammar-scroll");
  requestAnimationFrame(() => {
    sc.scrollTop = Math.max(0, p) * Math.max(0, sc.scrollHeight - sc.clientHeight);
  });
}

function grammarStorePos(id, p) {
  grammar.lastP = p;
  try {
    localStorage.setItem(GRAMMAR_POS_KEY, JSON.stringify({ id, p: Math.round(p * 10000) / 10000 }));
  } catch (e) { /* bỏ qua */ }
}

// đọc vị trí cuộn THỰC TẾ rồi lưu (chỉ gọi khi người dùng đã cuộn / rời tab)
function grammarSaveScrollNow() {
  if (!grammar.currentId || !grammarTabVisible()) return;
  const sc = document.getElementById("grammar-scroll");
  const range = sc.scrollHeight - sc.clientHeight;
  grammarStorePos(grammar.currentId, range > 0 ? Math.min(1, Math.max(0, sc.scrollTop / range)) : 0);
}

document.getElementById("grammar-scroll").addEventListener("scroll", () => {
  clearTimeout(grammar.scrollTimer);
  grammar.scrollTimer = setTimeout(grammarSaveScrollNow, 400);
});
document.addEventListener("visibilitychange", () => { if (document.hidden) grammarSaveScrollNow(); });
window.addEventListener("pagehide", grammarSaveScrollNow);

/* ---------- Mở 1 unit ---------- */
function grammarUnitHtml(unit) {
  return `<h1>${escapeHtml(`Unit ${unit.num}: ${unit.title}`)}</h1>` + unit.html;
}
function renderGrammarUnitBody(unit) {
  const view = document.getElementById("grammar-view");
  view.innerHTML = grammarUnitHtml(unit);
  grammar.hits = grammar.query ? grammarHighlight(view, grammar.query) : [];
  grammar.hitIndex = -1;
}

// opts: restoreP (0..1) = khôi phục vị trí cuộn; goHit = nhảy tới kết quả tìm kiếm đầu tiên
function openGrammarUnit(id, opts = {}) {
  const unit = grammar.byId[id];
  if (!unit) return;
  const changed = grammar.currentId !== id;
  grammar.currentId = id;
  renderGrammarUnitBody(unit);
  const sc = document.getElementById("grammar-scroll");
  if (opts.restoreP != null) {
    grammar.lastP = opts.restoreP;
    grammarApplyScroll(opts.restoreP);
  } else {
    grammar.lastP = 0;
    sc.scrollTop = 0;
  }
  if (opts.goHit && grammar.hits.length) grammarGoToHit(0);
  if (changed) {
    grammarState().lastUnit = id;
    saveState();
  }
  syncGrammarControls();
  updateGrammarSearchMeta();
  if (opts.restoreP == null) grammarStorePos(id, 0); // unit mới -> vị trí đọc bắt đầu từ đầu
}

function grammarStep(delta) {
  if (!grammar.units) return;
  const i = grammar.units.findIndex((u) => u.id === grammar.currentId);
  const next = grammar.units[i + delta];
  if (next) openGrammarUnit(next.id);
}
document.getElementById("grammar-prev").addEventListener("click", () => grammarStep(-1));
document.getElementById("grammar-next").addEventListener("click", () => grammarStep(1));
document.getElementById("grammar-unit-select").addEventListener("change", (e) => openGrammarUnit(e.target.value));

document.addEventListener("keydown", (e) => {
  if (!grammarTabVisible() || isTypingTarget() || anyOverlayOpen()) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.code === "ArrowLeft") { e.preventDefault(); grammarStep(-1); }
  else if (e.code === "ArrowRight") { e.preventDefault(); grammarStep(1); }
});

/* ---------- Đánh dấu ---------- */
function toggleGrammarBookmark() {
  const id = grammar.currentId;
  if (!id) return;
  const gs = grammarState();
  const idx = gs.bookmarks.indexOf(id);
  if (idx >= 0) gs.bookmarks.splice(idx, 1);
  else gs.bookmarks.push(id);
  saveState();
  renderGrammarSidebar();
  syncGrammarControls();
  showToast(idx >= 0 ? "Đã bỏ đánh dấu" : "Đã đánh dấu unit này");
}
document.getElementById("grammar-bookmark-btn").addEventListener("click", toggleGrammarBookmark);

/* ---------- Cập nhật nút điều khiển ---------- */
function syncGrammarControls() {
  const ready = !!grammar.units && !!grammar.currentId;
  const idx = ready ? grammar.units.findIndex((u) => u.id === grammar.currentId) : -1;
  document.getElementById("grammar-prev").disabled = !ready || idx <= 0;
  document.getElementById("grammar-next").disabled = !ready || idx < 0 || idx >= grammar.units.length - 1;
  const bm = document.getElementById("grammar-bookmark-btn");
  const marked = ready && grammarState().bookmarks.includes(grammar.currentId);
  bm.disabled = !ready;
  bm.textContent = marked ? "★" : "☆";
  bm.classList.toggle("active", marked);
  bm.title = marked ? "Bỏ đánh dấu unit này" : "Đánh dấu unit này";
  if (ready) document.getElementById("grammar-unit-select").value = grammar.currentId;
  document.querySelectorAll(".grammar-unit-btn").forEach((b) => b.classList.toggle("active", b.dataset.unit === grammar.currentId));
}

/* ---------- Sidebar: danh sách unit / kết quả tìm / đã đánh dấu ---------- */
function makeGrammarUnitButton(u, withSnippet) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "grammar-unit-btn" + (u.id === grammar.currentId ? " active" : "");
  btn.dataset.unit = u.id;
  const count = grammar.query ? grammar.matches[u.id] || 0 : 0;
  let html = `<span class="grammar-unit-row"><span class="grammar-unit-title">${escapeHtml(`Unit ${u.num}: ${u.title}`)}</span>`;
  if (count) html += `<span class="grammar-unit-count">${count}</span>`;
  html += "</span>";
  if (withSnippet && count && u._snip) {
    const sn = u._snip;
    html += `<span class="grammar-unit-snippet">${escapeHtml(sn.before)}<mark>${escapeHtml(sn.match)}</mark>${escapeHtml(sn.after)}</span>`;
  }
  btn.innerHTML = html;
  btn.addEventListener("click", () => openGrammarUnit(u.id, { goHit: !!grammar.query }));
  return btn;
}

function renderGrammarSidebar() {
  if (!grammar.units) return;
  const q = grammar.query;
  const list = document.getElementById("grammar-unit-list");
  list.innerHTML = "";
  const shown = q ? grammar.units.filter((u) => (grammar.matches[u.id] || 0) > 0) : grammar.units;
  document.getElementById("grammar-units-label").textContent = q ? `Kết quả (${shown.length}/${grammar.units.length} unit)` : "Các unit";
  if (!shown.length) {
    const empty = document.createElement("div");
    empty.className = "grammar-empty";
    empty.textContent = "Không có unit nào chứa từ khoá này";
    list.appendChild(empty);
  } else {
    shown.forEach((u) => list.appendChild(makeGrammarUnitButton(u, !!q)));
  }
  const marked = grammar.units.filter((u) => grammarState().bookmarks.includes(u.id));
  document.getElementById("grammar-bookmarks-section").classList.toggle("hidden", !marked.length);
  const bmList = document.getElementById("grammar-bookmark-list");
  bmList.innerHTML = "";
  marked.forEach((u) => bmList.appendChild(makeGrammarUnitButton(u, false)));
}

/* ---------- Tìm kiếm ---------- */
// Lập chỉ mục 1 lần: với mỗi unit, tách các đoạn chữ (text node) để đếm khớp đúng như lúc tô sáng
function grammarBuildIndex() {
  if (grammar.indexReady) return;
  grammar.units.forEach((u) => {
    const box = document.createElement("div");
    box.innerHTML = grammarUnitHtml(u);
    // duyệt cả thẻ lẫn chữ để chèn 1 khoảng trắng giữa các đoạn/ô/dòng (<br>) khi cắt đoạn trích
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    const nodes = [];
    let plain = "";
    let needSep = false;
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.nodeType === 1) {
        if (/^(H[1-6]|P|LI|TD|TH|TR|BLOCKQUOTE|BR|UL|OL|HR)$/.test(n.tagName)) needSep = true;
        continue;
      }
      if (needSep && plain && !plain.endsWith(" ")) plain += " ";
      needSep = false;
      nodes.push({ text: n.nodeValue, fold: grammarFold(n.nodeValue), offset: plain.length });
      plain += n.nodeValue;
    }
    u._nodes = nodes;
    u._plain = plain;
  });
  grammar.indexReady = true;
}

function grammarComputeMatches() {
  grammarBuildIndex();
  const q = grammar.query;
  grammar.matches = {};
  grammar.units.forEach((u) => {
    let count = 0;
    let first = -1;
    u._nodes.forEach((n) => {
      let i = n.fold.indexOf(q);
      while (i >= 0) {
        if (first < 0) first = n.offset + i;
        count++;
        i = n.fold.indexOf(q, i + q.length);
      }
    });
    u._snip = null;
    if (count) {
      grammar.matches[u.id] = count;
      const a = Math.max(0, first - 28);
      const lead = u._plain.slice(a, first);
      u._snip = {
        before: a > 0 ? "…" + lead.replace(/^\S*\s/, "") : lead, // cắt bỏ nửa từ đầu đoạn trích
        match: u._plain.slice(first, first + q.length),
        after: u._plain.slice(first + q.length, first + q.length + 56) + (first + q.length + 56 < u._plain.length ? "…" : ""),
      };
    }
  });
}

// Bọc các chỗ khớp trong <mark>; trả về mảng <mark> theo thứ tự xuất hiện
function grammarHighlight(root, q) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const marks = [];
  nodes.forEach((node) => {
    const text = node.nodeValue;
    const fold = grammarFold(text);
    let idx = fold.indexOf(q);
    if (idx < 0) return;
    const frag = document.createDocumentFragment();
    let last = 0;
    while (idx >= 0) {
      if (idx > last) frag.appendChild(document.createTextNode(text.slice(last, idx)));
      const mk = document.createElement("mark");
      mk.className = "grammar-hit";
      mk.textContent = text.slice(idx, idx + q.length);
      frag.appendChild(mk);
      marks.push(mk);
      last = idx + q.length;
      idx = fold.indexOf(q, last);
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
  return marks;
}

function grammarGoToHit(i) {
  if (!grammar.hits.length) return;
  grammar.hitIndex = (i + grammar.hits.length) % grammar.hits.length;
  grammar.hits.forEach((m, k) => m.classList.toggle("current", k === grammar.hitIndex));
  const sc = document.getElementById("grammar-scroll");
  const el = grammar.hits[grammar.hitIndex];
  const r = el.getBoundingClientRect();
  const s = sc.getBoundingClientRect();
  sc.scrollTop += r.top - s.top - sc.clientHeight / 2 + r.height / 2;
  updateGrammarSearchMeta();
}

function updateGrammarSearchMeta() {
  const box = document.getElementById("grammar-search-meta");
  const text = document.getElementById("grammar-search-meta-text");
  const raw = document.getElementById("grammar-search-input").value.trim();
  if (!raw) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  const prev = document.getElementById("grammar-hit-prev");
  const next = document.getElementById("grammar-hit-next");
  if (!grammar.query) {
    text.textContent = "Gõ ít nhất 2 ký tự";
    prev.classList.add("hidden"); next.classList.add("hidden");
    return;
  }
  const units = Object.keys(grammar.matches).length;
  const total = Object.values(grammar.matches).reduce((a, b) => a + b, 0);
  const n = grammar.hits.length;
  prev.classList.toggle("hidden", n < 2);
  next.classList.toggle("hidden", n < 2);
  if (!units) text.textContent = "Không có kết quả";
  else if (n) text.textContent = `Trong unit này: ${grammar.hitIndex >= 0 ? grammar.hitIndex + 1 : "–"}/${n} · Tổng ${total} chỗ ở ${units} unit`;
  else text.textContent = `Unit này không có · Tổng ${total} chỗ ở ${units} unit`;
}

function applyGrammarSearch() {
  const input = document.getElementById("grammar-search-input");
  const q = grammarFold(input.value.trim()).replace(/\s+/g, " ");
  grammar.query = q.length >= 2 ? q : "";
  if (!grammar.units) { updateGrammarSearchMeta(); return; }
  if (grammar.query) grammarComputeMatches();
  else grammar.matches = {};
  renderGrammarSidebar();
  const unit = grammar.byId[grammar.currentId];
  if (unit) {
    const sc = document.getElementById("grammar-scroll");
    const top = sc.scrollTop;
    renderGrammarUnitBody(unit);
    sc.scrollTop = top;
    if (grammar.query && !grammar.hits.length) {
      // unit đang mở không có kết quả -> mở luôn unit có NHIỀU chỗ khớp nhất (hoà thì lấy unit đứng trước)
      let best = null;
      grammar.units.forEach((u) => {
        if (grammar.matches[u.id] && (!best || grammar.matches[u.id] > grammar.matches[best.id])) best = u;
      });
      if (best) { openGrammarUnit(best.id, { goHit: true }); return; }
    } else if (grammar.hits.length) {
      grammarGoToHit(0);
    }
  }
  updateGrammarSearchMeta();
}

const grammarSearchInput = document.getElementById("grammar-search-input");
grammarSearchInput.addEventListener("input", () => {
  clearTimeout(grammar.searchTimer);
  grammar.searchTimer = setTimeout(applyGrammarSearch, 180);
});
grammarSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    clearTimeout(grammar.searchTimer);
    applyGrammarSearch();
    if (grammar.hits.length) grammarGoToHit(grammar.hitIndex + (e.shiftKey ? -1 : 1));
  } else if (e.key === "Escape") {
    grammarSearchInput.value = "";
    applyGrammarSearch();
    grammarSearchInput.blur();
  }
});
document.getElementById("grammar-hit-prev").addEventListener("click", () => grammarGoToHit(grammar.hitIndex - 1));
document.getElementById("grammar-hit-next").addEventListener("click", () => grammarGoToHit(grammar.hitIndex + 1));

/* ============================================================
   TAB 4: KHO (WAREHOUSE)
   ============================================================ */
const wh = { cat: "flashcard", tagFilter: [], selectedItems: new Set(), selectedListId: null, sortCol: null, sortDir: "asc" };

function whCatLabel(cat) {
  return { flashcard: "Thẻ", writing: "Viết", listening: "Nghe", dictionary: "Từ điển", library: "Thư viện", stats: "Thống kê", admin: "Admin", trash: "Thùng rác" }[cat];
}

document.querySelectorAll("[data-wh-cat]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-wh-cat]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    wh.cat = btn.dataset.whCat;
    renderWarehouseTab();
  });
});

/* ============================================================
   THÙNG RÁC — giữ mục/danh sách/lần "xoá hết" đã xoá trong 24h,
   độc lập với toast Hoàn tác 6 giây (2 lớp an toàn khác nhau).
   entry: { id, type: "item"|"list"|"clear", cat, listId, listName, payload, deletedAt }
   ============================================================ */
const TRASH_MAX_AGE_MS = 24 * 60 * 60 * 1000;
function pushTrash(type, cat, listId, listName, payload) {
  state.trash = state.trash || [];
  state.trash.push({ id: uid(), type, cat, listId, listName, payload, deletedAt: Date.now() });
  saveState();
}
function pruneTrash() {
  const before = (state.trash || []).length;
  state.trash = (state.trash || []).filter((e) => Date.now() - e.deletedAt < TRASH_MAX_AGE_MS);
  if (state.trash.length !== before) saveState();
}
function trashEntryLabel(e) {
  if (e.type === "item") return `Mục: "${e.payload.en}"`;
  if (e.type === "list") return `Danh sách: "${e.payload.name}" (${(e.payload.items || []).length} mục)`;
  return `Xoá hết ${e.payload.length} mục trong "${e.listName}"`;
}
function renderTrashTab() {
  pruneTrash();
  const box = document.getElementById("wh-trash-list");
  const entries = (state.trash || []).slice().sort((a, b) => b.deletedAt - a.deletedAt);
  document.getElementById("wh-trash-empty-btn").disabled = !entries.length;
  box.innerHTML = "";
  if (!entries.length) { box.innerHTML = `<p class="wh-preview-empty">Thùng rác trống.</p>`; return; }
  entries.forEach((e) => {
    const row = document.createElement("div");
    row.className = "admin-row";
    const remainMin = Math.max(0, Math.ceil((TRASH_MAX_AGE_MS - (Date.now() - e.deletedAt)) / 60000));
    const remainTxt = remainMin >= 60 ? `${Math.ceil(remainMin / 60)} giờ` : `${remainMin} phút`;
    row.innerHTML = `<div class="admin-row-main"><b>${escapeHtml(trashEntryLabel(e))}</b><span class="admin-row-sub">${whCatLabel(e.cat)} · còn ${remainTxt} trước khi mất hẳn</span></div>`;
    const actions = document.createElement("div");
    actions.className = "admin-row-actions";
    const restoreBtn = document.createElement("button");
    restoreBtn.className = "pill-btn primary";
    restoreBtn.textContent = "Khôi phục";
    restoreBtn.addEventListener("click", () => {
      restoreTrashEntry(e);
      state.trash = state.trash.filter((x) => x.id !== e.id);
      saveState();
      renderTrashTab();
    });
    actions.appendChild(restoreBtn);
    const delBtn = document.createElement("button");
    delBtn.className = "pill-btn-outline";
    delBtn.textContent = "Xoá vĩnh viễn";
    delBtn.addEventListener("click", async () => {
      const ok = await showConfirm("Xoá vĩnh viễn khỏi thùng rác? Không thể hoàn tác.");
      if (!ok) return;
      state.trash = state.trash.filter((x) => x.id !== e.id);
      saveState();
      renderTrashTab();
    });
    actions.appendChild(delBtn);
    row.appendChild(actions);
    box.appendChild(row);
  });
}
function restoreTrashEntry(e) {
  if (e.type === "item") {
    const l = getList(e.cat, e.listId);
    if (!l) { showToast(`Không tìm thấy danh sách "${e.listName}" để khôi phục mục — có thể danh sách đã bị xoá hẳn.`); return; }
    l.items.push(e.payload);
    saveState();
    if (wh.cat === e.cat) renderWarehouseTab();
    showToast(`Đã khôi phục mục "${e.payload.en}" vào "${l.name}".`);
  } else if (e.type === "list") {
    getCategory(e.cat).push(e.payload);
    saveState();
    if (wh.cat === e.cat) renderWarehouseTab();
    showToast(`Đã khôi phục danh sách "${e.payload.name}".`);
  } else if (e.type === "clear") {
    const l = getList(e.cat, e.listId);
    if (!l) { showToast(`Không tìm thấy danh sách "${e.listName}" để khôi phục — có thể danh sách đã bị xoá hẳn.`); return; }
    l.items.push(...e.payload);
    saveState();
    if (wh.cat === e.cat) renderWarehouseTab();
    showToast(`Đã khôi phục ${e.payload.length} mục vào "${l.name}".`);
  }
}
document.getElementById("wh-trash-empty-btn").addEventListener("click", async () => {
  if (!(state.trash || []).length) return;
  const ok = await showConfirm("Dọn sạch thùng rác? Toàn bộ mục/danh sách đã xoá sẽ mất vĩnh viễn, không thể hoàn tác.");
  if (!ok) return;
  state.trash = [];
  saveState();
  renderTrashTab();
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
  const isLibrary = wh.cat === "library";
  const isAdmin = wh.cat === "admin";
  const isTrash = wh.cat === "trash";
  const isSpecial = isStats || isLibrary || isAdmin || isTrash;
  document.getElementById("wh-library-upload-open").classList.toggle("hidden", isSpecial || accountRole === "guest");
  document.getElementById("wh-sidebar-list-section").classList.toggle("hidden", isSpecial);
  document.getElementById("wh-stats-sidebar-note").classList.toggle("hidden", !isStats);
  document.getElementById("wh-library-sidebar-section").classList.toggle("hidden", !isLibrary);
  document.getElementById("wh-admin-sidebar-note").classList.toggle("hidden", !isAdmin);
  document.getElementById("wh-current-list-title").classList.toggle("hidden", isSpecial);
  document.getElementById("wh-tag-filter-row").classList.toggle("hidden", true);
  document.getElementById("wh-toolbar").classList.toggle("hidden", isSpecial);
  document.getElementById("wh-legend").classList.toggle("hidden", isSpecial);
  document.getElementById("wh-bottom-bar").classList.toggle("hidden", isSpecial);
  // Luôn ẩn hết các khung con trước — chỉ khung đúng với wh.cat hiện tại mới
  // được hiện lại bên dưới. Tránh trường hợp 1 khung bị "kẹt" hiện ra khi
  // chuyển cat (vd: bài Nghe bị chèn sang lúc xem Thống kê).
  document.getElementById("wh-stats-view").classList.add("hidden");
  document.getElementById("wh-table-wrap").classList.add("hidden");
  document.getElementById("wh-library-view").classList.add("hidden");
  document.getElementById("wh-listening-view").classList.add("hidden");
  document.getElementById("wh-admin-view").classList.add("hidden");
  document.getElementById("wh-trash-view").classList.add("hidden");
  if (isStats) {
    document.getElementById("wh-stats-view").classList.remove("hidden");
    renderStatsTab();
    return;
  }
  if (isLibrary) {
    document.getElementById("wh-library-view").classList.remove("hidden");
    renderLibraryTab();
    return;
  }
  if (isAdmin) {
    document.getElementById("wh-admin-view").classList.remove("hidden");
    renderWhAdminView();
    return;
  }
  if (isTrash) {
    document.getElementById("wh-trash-view").classList.remove("hidden");
    renderTrashTab();
    return;
  }

  document.getElementById("wh-lists-title").textContent = whCatLabel(wh.cat);
  const grid = document.getElementById("wh-list-grid");
  grid.innerHTML = "";
  const activeList = whActiveList();
  const canRemind = (wh.cat === "flashcard" || wh.cat === "dictionary") && !isFeatureLocked("reminder");
  getCategory(wh.cat).forEach((list) => {
    const btn = document.createElement("button");
    btn.className = "wh-list-item" + (activeList && list.id === activeList.id ? " active" : "");
    btn.innerHTML = `<span class="wh-list-item-name">${escapeHtml(list.name)}</span>`;
    if (canRemind) {
      const dot = document.createElement("span");
      dot.className = "wh-list-reminder-dot" + (list.reminderEnabled ? " on" : "");
      dot.innerHTML = icon("bell");
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

  const isListening = wh.cat === "listening";
  document.getElementById("wh-table-wrap").classList.toggle("compact-cols", wh.cat !== "dictionary");
  document.getElementById("wh-table-wrap").classList.toggle("hidden", isListening);
  document.getElementById("wh-listening-view").classList.toggle("hidden", !isListening);
  document.getElementById("wh-reminder-toggle").classList.toggle("hidden", !canRemind);
  document.getElementById("wh-reminder-toggle").classList.toggle("active", state.reminder.enabled);
  document.getElementById("wh-reminder-read-toggle").classList.toggle("hidden", !canRemind);
  document.getElementById("wh-reminder-read-toggle").classList.toggle("active", state.reminder.autoRead);

  if (!isListening) {
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
  if (isListening) {
    renderWhListeningView();
  } else {
    renderWhTable();
  }
}

/* ============================================================
   TAB THỐNG KÊ (Kho > Thống kê) — vòng tròn mục tiêu Viết/Nghe
   (tính năng cũ "Hệ số"/biểu đồ đà học tạm ẩn — statsSnapshotForCat vẫn
   dùng lại cho 3 vạch hoàn thành Viết/Nghe/Thẻ bên dưới)
   ============================================================ */
const RING_CIRCUMFERENCE = 2 * Math.PI * 88; // r=88, khớp bán kính trong SVG

function statsSnapshotForCat(cat) {
  const items = allItems(cat);
  const total = items.length;
  const known = items.filter((i) => i.status === "known").length;
  const difficult = items.filter((i) => i.status === "difficult").length;
  const fresh = Math.max(0, total - known - difficult);
  return { total, known, difficult, fresh };
}

let ringEditMode = false;

function ringGoalMin(cat) {
  ensureStudyTimeToday();
  return cat === "writing" ? state.studyTime.writingGoalMin : state.studyTime.listeningGoalMin;
}
function ringMinutesDone(cat) {
  ensureStudyTimeToday();
  const sec = cat === "writing" ? state.studyTime.writingSec : state.studyTime.listeningSec;
  return sec / 60;
}
// Tổng số phút đã học CỘNG DỒN từ trước tới nay (không reset theo ngày) —
// dùng cho số "giờ" nhỏ bên dưới vòng tròn, để nghỉ 1 hôm không làm mất số
// giờ đã học trước đó (khác với ringMinutesDone chỉ tính riêng "hôm nay").
function ringTotalMinutes(cat) {
  ensureStudyTimeToday();
  const sec = cat === "writing" ? state.studyTimeTotal.writingSec : state.studyTimeTotal.listeningSec;
  return sec / 60;
}
function formatHours(minutes) {
  return (minutes / 60).toFixed(minutes < 600 ? 1 : 0) + "h";
}

/* Số nhỏ bên dưới (giờ) — luôn tính từ MỘT giá trị phút cho trước, dùng
   chung cho cả 2 trường hợp: đang xem tiến độ (phút đã học) hoặc đang
   chỉnh mục tiêu (phút mục tiêu đang gõ/lăn chuột). */
function syncHourDisplay(cat, minutes) {
  const hourEl = document.getElementById("ring-hours-" + cat);
  if (hourEl) hourEl.textContent = formatHours(minutes);
}

/* Cập nhật vòng tròn + số phút khi đang xem tab Thống kê (mỗi giây) — chỉ
   cập nhật số + vòng, KHÔNG chạy lại hiệu ứng "bung ra" ban đầu. Khi đang ở
   chế độ chỉnh mục tiêu thì bỏ qua phần số (input đang được người dùng gõ),
   chỉ vẫn cập nhật vòng tròn để xem trước % theo mục tiêu mới ngay lập tức. */
function updateRingLiveValues() {
  ["writing", "listening"].forEach((cat) => {
    const minutesDone = ringMinutesDone(cat);
    const goal = Math.max(1, ringGoalMin(cat));
    const pct = Math.min(1, minutesDone / goal);
    const ring = document.getElementById("ring-progress-" + cat);
    if (ring) ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - pct);
    if (!ringEditMode) {
      const valEl = document.getElementById("ring-value-" + cat);
      if (valEl) valEl.textContent = Math.floor(minutesDone);
      syncHourDisplay(cat, ringTotalMinutes(cat));
    }
  });
}

// Đếm số tăng dần từ 0 -> target, đồng bộ với hiệu ứng "bung ra" của vòng tròn.
function animateRingNumber(el, target, duration) {
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(target * eased);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* Hiệu ứng "bung ra" cho vòng tròn mỗi khi người dùng MỞ tab Thống kê — vòng
   chạy từ 0% lên đúng % hiện tại + số phút đếm lên + phát âm thanh nhẹ.
   Số to = phút đã học, số nhỏ bên dưới = quy đổi ra giờ. */
function renderStatsRings(animate) {
  ["writing", "listening"].forEach((cat, idx) => {
    const minutesDone = Math.floor(ringMinutesDone(cat));
    const goal = Math.max(1, ringGoalMin(cat));
    const pct = Math.min(1, minutesDone / goal);
    const ring = document.getElementById("ring-progress-" + cat);
    const valEl = document.getElementById("ring-value-" + cat);
    syncHourDisplay(cat, ringTotalMinutes(cat));

    if (animate && ring) {
      ring.style.transition = "none";
      ring.style.strokeDashoffset = RING_CIRCUMFERENCE;
      valEl.textContent = "0";
      // buộc reflow rồi mới bật lại transition, để hiệu ứng chạy từ 0
      void ring.getBoundingClientRect();
      ring.style.transition = "";
      requestAnimationFrame(() => {
        ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - pct);
        ring.classList.remove("ring-pop");
        void ring.getBoundingClientRect();
        ring.classList.add("ring-pop");
      });
      animateRingNumber(valEl, minutesDone, 1000);
      playRingRevealSound(idx * 0.12);
    } else if (ring) {
      ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - pct);
      valEl.textContent = minutesDone;
    }
  });
}

function renderProgressBars() {
  const box = document.getElementById("wh-progress-bars");
  box.innerHTML = "";
  [
    { cat: "writing", label: "Viết" },
    { cat: "listening", label: "Nghe" },
    { cat: "flashcard", label: "Thẻ" },
  ].forEach((cfg) => {
    const s = statsSnapshotForCat(cfg.cat);
    const pct = s.total ? Math.round((s.known / s.total) * 100) : 0;
    const row = document.createElement("div");
    row.className = "wh-progress-bar-row";
    row.innerHTML = `
      <span class="wh-progress-bar-label">${cfg.label}</span>
      <span class="wh-progress-bar-track"><span class="wh-progress-bar-done" style="width:0%"></span></span>
      <span class="wh-progress-bar-pct">${pct}%</span>`;
    box.appendChild(row);
    requestAnimationFrame(() => {
      row.querySelector(".wh-progress-bar-done").style.width = pct + "%";
    });
  });
}

/* Bật/tắt chế độ chỉnh mục tiêu — khi bật, số TO (phút) trong vòng tròn biến
   thành ô nhập; số NHỎ (giờ) bên dưới tự quy đổi theo mỗi khi số phút đổi. */
function renderRingGoalEditors() {
  ["writing", "listening"].forEach((cat) => {
    let holder = document.getElementById("ring-value-" + cat);
    if (ringEditMode) {
      if (holder.tagName !== "INPUT") {
        const input = document.createElement("input");
        input.type = "number";
        input.min = "5";
        input.max = "600";
        input.step = "5";
        input.className = "ring-goal-input";
        input.id = "ring-value-" + cat;
        input.value = ringGoalMin(cat);
        input.addEventListener("input", () => {
          const v = Math.max(5, Math.min(600, parseInt(input.value, 10) || 5));
          setRingGoal(cat, v, false);
          syncHourDisplay(cat, v);
        });
        input.addEventListener("blur", () => {
          const v = Math.max(5, Math.min(600, parseInt(input.value, 10) || 5));
          input.value = v;
          setRingGoal(cat, v, true);
          syncHourDisplay(cat, v);
        });
        holder.replaceWith(input);
      }
      syncHourDisplay(cat, ringGoalMin(cat));
    } else if (holder.tagName === "INPUT") {
      const span = document.createElement("span");
      span.className = "ring-value";
      span.id = "ring-value-" + cat;
      span.textContent = Math.floor(ringMinutesDone(cat));
      holder.replaceWith(span);
      syncHourDisplay(cat, ringTotalMinutes(cat));
    }
  });
}

function setRingGoal(cat, minutes, persist) {
  ensureStudyTimeToday();
  if (cat === "writing") state.studyTime.writingGoalMin = minutes;
  else state.studyTime.listeningGoalMin = minutes;
  updateRingLiveValues();
  if (persist) saveState();
}

document.getElementById("ring-adjust-btn").addEventListener("click", () => {
  ringEditMode = !ringEditMode;
  document.getElementById("ring-adjust-btn").classList.toggle("active", ringEditMode);
  document.getElementById("ring-edit-hint").classList.toggle("hidden", !ringEditMode);
  renderRingGoalEditors();
  if (!ringEditMode) saveState();
});

// Lăn chuột trên vòng tròn để tăng/giảm mục tiêu — chỉ hoạt động khi đang ở
// chế độ chỉnh (đã bấm nút ở giữa 2 vòng tròn). Số giờ bên dưới tự quy đổi.
document.querySelectorAll(".ring-goal-item").forEach((el) => {
  el.addEventListener("wheel", (e) => {
    if (!ringEditMode) return;
    e.preventDefault();
    const cat = el.dataset.ringCat;
    const cur = ringGoalMin(cat);
    const next = Math.max(5, Math.min(600, cur + (e.deltaY < 0 ? 5 : -5)));
    setRingGoal(cat, next, false);
    const holder = document.getElementById("ring-value-" + cat);
    if (holder && holder.tagName === "INPUT") holder.value = next;
    syncHourDisplay(cat, next);
    clearTimeout(el._wheelSaveTimer);
    el._wheelSaveTimer = setTimeout(() => saveState(), 400);
  }, { passive: false });
});

function renderStatsTab() {
  ensureStudyTimeToday();
  ringEditMode = false;
  document.getElementById("ring-adjust-btn").classList.remove("active");
  document.getElementById("ring-edit-hint").classList.add("hidden");
  renderRingGoalEditors();
  renderStatsRings(true);
  renderProgressBars();
}

let whDragSrcId = null;

function renderWhTable() {
  const table = document.getElementById("wh-table");
  table.innerHTML = "";
  const list = whActiveList();
  const tagRow = document.getElementById("wh-tag-filter-row");
  if (!list || list.id !== wh.selectedListId) {
    wh.selectedItems = new Set();
    wh.selectedListId = list ? list.id : null;
  }
  updateWhBulkBar();
  if (!list || !list.items.length) {
    table.innerHTML = `<div class="wh-empty-row">Chưa có mục nào trong danh sách này</div>`;
    document.getElementById("wh-progress").textContent = "Tiến độ: 0%";
    tagRow.classList.add("hidden");
    return;
  }

  // ---- Sắp xếp theo cột (bấm tiêu đề "Tiếng Anh"/"Tiếng Việt") ----
  if (wh.sortCol) {
    list.items.sort((a, b) => {
      const cmp = (a[wh.sortCol] || "").localeCompare(b[wh.sortCol] || "", "vi");
      return wh.sortDir === "desc" ? -cmp : cmp;
    });
  }
  ["en", "vi"].forEach((col) => {
    const arrow = document.getElementById("wh-col-sort-arrow-" + col);
    if (arrow) arrow.textContent = wh.sortCol === col ? (wh.sortDir === "desc" ? "↓" : "↑") : "";
  });

  // ---- Bộ lọc theo thẻ (tags) ----
  const allTags = [...new Set(list.items.flatMap((it) => it.tags || []))].sort();
  wh.tagFilter = (wh.tagFilter || []).filter((t) => allTags.includes(t)); // tự dọn thẻ không còn tồn tại trong danh sách
  tagRow.innerHTML = "";
  if (allTags.length) {
    tagRow.classList.remove("hidden");
    allTags.forEach((tag) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "wh-tag-chip" + (wh.tagFilter.includes(tag) ? " active" : "");
      chip.textContent = "#" + tag;
      chip.addEventListener("click", () => {
        const i = wh.tagFilter.indexOf(tag);
        if (i >= 0) wh.tagFilter.splice(i, 1); else wh.tagFilter.push(tag);
        renderWhTable();
      });
      tagRow.appendChild(chip);
    });
    if (wh.tagFilter.length) {
      const clearChip = document.createElement("button");
      clearChip.type = "button";
      clearChip.className = "wh-tag-chip wh-tag-chip-clear";
      clearChip.textContent = "Xoá lọc";
      clearChip.addEventListener("click", () => { wh.tagFilter = []; renderWhTable(); });
      tagRow.appendChild(clearChip);
    }
  } else {
    tagRow.classList.add("hidden");
  }
  const visibleItems = wh.tagFilter.length
    ? list.items.filter((it) => wh.tagFilter.every((t) => (it.tags || []).includes(t)))
    : list.items;
  if (!visibleItems.length) {
    table.innerHTML = `<div class="wh-empty-row">Không có mục nào khớp thẻ đã chọn.</div>`;
  }
  document.getElementById("wh-select-all").checked = visibleItems.length > 0 && visibleItems.every((it) => wh.selectedItems.has(it.id));
  visibleItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "wh-row";
    row.draggable = true;
    row.dataset.itemId = item.id;
    const dotClass = item.status === "known" ? "dot-known" : item.status === "difficult" ? "dot-difficult" : "dot-learning";
    row.innerHTML = `
      <span class="wh-row-select"><input type="checkbox" ${wh.selectedItems.has(item.id) ? "checked" : ""}></span>
      <span class="wh-row-handle" title="Kéo để sắp xếp lại">≡</span>
      <span class="wh-row-en">${escapeHtml(item.en)}</span>
      <span class="wh-row-ipa" id="wh-ipa-${item.id}"></span>
      <span class="wh-row-pos" id="wh-pos-${item.id}"></span>
      <span class="wh-row-arrow">→</span>
      <span class="wh-row-vi">${escapeHtml(item.vi)}</span>
      <span class="wh-row-dot ${dotClass}" title="${escapeHtml(statusLabel(wh.cat === "dictionary" ? "flashcard" : wh.cat, item.status))}"></span>
      <span class="wh-row-actions">
        <button data-act="play" title="Phát âm">${icon("volume")}</button>
        <button data-act="copy" title="Sao chép">${icon("copy")}</button>
        <button data-act="edit" title="Sửa">✎</button>
        <button data-act="move" title="Chuyển sang danh sách khác">⇄</button>
        <button data-act="del" title="Xoá">${icon("trash")}</button>
      </span>`;
    
    row.querySelector(".wh-row-select input").addEventListener("change", (e) => {
      if (e.target.checked) wh.selectedItems.add(item.id); else wh.selectedItems.delete(item.id);
      updateWhBulkBar();
      document.getElementById("wh-select-all").checked = visibleItems.every((it) => wh.selectedItems.has(it.id));
    });
    row.querySelector('[data-act="play"]').addEventListener("click", () => playAudio(item.en));
    row.querySelector('[data-act="copy"]').addEventListener("click", () => {
      const text = `${item.en} — ${item.vi}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast("Đã sao chép."), () => showToast(text));
      } else {
        showToast(text);
      }
    });
    row.querySelector('[data-act="edit"]').addEventListener("click", () => openWhEdit(item.id));
    row.querySelector('[data-act="move"]').addEventListener("click", async () => {
      const others = getCategory(wh.cat).filter((l) => l.id !== list.id);
      if (!others.length) { showToast("Không có danh sách nào khác để chuyển tới."); return; }
      const targetId = await showSelect("Chuyển sang danh sách nào?", others.map((l) => ({ value: l.id, label: l.name })));
      if (!targetId) return;
      const target = getList(wh.cat, targetId);
      if (!target) return;
      list.items = list.items.filter((i) => i.id !== item.id);
      target.items.push(item);
      saveState();
      renderWarehouseTab();
      showToast(`Đã chuyển "${item.en}" sang "${target.name}".`);
    });
    row.querySelector('[data-act="del"]').addEventListener("click", async () => {
      const ok = await showConfirm("Xoá mục này?");
      if (!ok) return;
      const removedIdx = list.items.findIndex((i) => i.id === item.id);
      const removedItem = list.items[removedIdx];
      list.items = list.items.filter((i) => i.id !== item.id);
      saveState();
      renderWarehouseTab();
      pushTrash("item", wh.cat, list.id, list.name, removedItem);
      showUndoToast(`Đã xoá "${removedItem.en}".`, () => {
        const l = getList(wh.cat, list.id);
        if (!l) return;
        l.items.splice(Math.min(removedIdx, l.items.length), 0, removedItem);
        saveState();
        renderWarehouseTab();
      });
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

/* ---- Chọn nhiều dòng (multi-select) + thanh hành động hàng loạt ---- */
function updateWhBulkBar() {
  const bar = document.getElementById("wh-bulk-bar");
  const n = wh.selectedItems.size;
  bar.classList.toggle("hidden", n === 0);
  if (n) document.getElementById("wh-bulk-count").textContent = `Đã chọn ${n} mục`;
}
document.getElementById("wh-select-all").addEventListener("change", (e) => {
  const list = whActiveList();
  if (!list) return;
  const visibleItems = wh.tagFilter.length
    ? list.items.filter((it) => wh.tagFilter.every((t) => (it.tags || []).includes(t)))
    : list.items;
  if (e.target.checked) visibleItems.forEach((it) => wh.selectedItems.add(it.id));
  else visibleItems.forEach((it) => wh.selectedItems.delete(it.id));
  renderWhTable();
});
document.getElementById("wh-bulk-cancel").addEventListener("click", () => {
  wh.selectedItems.clear();
  renderWhTable();
});
document.getElementById("wh-bulk-delete").addEventListener("click", async () => {
  const list = whActiveList();
  if (!list) return;
  const ids = new Set(wh.selectedItems);
  const ok = await showConfirm(`Xoá ${ids.size} mục đã chọn?`);
  if (!ok) return;
  const removed = list.items.filter((it) => ids.has(it.id));
  const removedIdxs = removed.map((it) => list.items.indexOf(it));
  list.items = list.items.filter((it) => !ids.has(it.id));
  wh.selectedItems.clear();
  saveState();
  renderWarehouseTab();
  const cat = wh.cat, listId = list.id;
  removed.forEach((it) => pushTrash("item", cat, listId, list.name, it));
  showUndoToast(`Đã xoá ${removed.length} mục.`, () => {
    const l = getList(cat, listId);
    if (!l) return;
    removed.forEach((it, i) => l.items.splice(Math.min(removedIdxs[i], l.items.length), 0, it));
    saveState();
    if (wh.cat === cat) renderWarehouseTab();
  });
});
document.getElementById("wh-bulk-move").addEventListener("click", async () => {
  const list = whActiveList();
  if (!list) return;
  const others = getCategory(wh.cat).filter((l) => l.id !== list.id);
  if (!others.length) { showToast("Không có danh sách nào khác để chuyển tới."); return; }
  const targetId = await showSelect(`Chuyển ${wh.selectedItems.size} mục sang danh sách nào?`, others.map((l) => ({ value: l.id, label: l.name })));
  if (!targetId) return;
  const target = getList(wh.cat, targetId);
  if (!target) return;
  const ids = new Set(wh.selectedItems);
  const moved = list.items.filter((it) => ids.has(it.id));
  list.items = list.items.filter((it) => !ids.has(it.id));
  target.items.push(...moved);
  wh.selectedItems.clear();
  saveState();
  renderWarehouseTab();
  showToast(`Đã chuyển ${moved.length} mục sang "${target.name}".`);
});
document.getElementById("wh-bulk-tag").addEventListener("click", async () => {
  const list = whActiveList();
  if (!list) return;
  const raw = await showPrompt("Gắn thẻ cho các mục đã chọn (cách nhau bởi dấu phẩy)", "");
  if (!raw) return;
  const tags = raw.split(",").map((t) => t.trim()).filter(Boolean);
  if (!tags.length) return;
  const ids = new Set(wh.selectedItems);
  list.items.forEach((it) => {
    if (!ids.has(it.id)) return;
    const existing = new Set(it.tags || []);
    tags.forEach((t) => existing.add(t));
    it.tags = [...existing];
  });
  saveState();
  renderWarehouseTab();
  showToast(`Đã gắn thẻ cho ${ids.size} mục.`);
});

/* ---- Sắp xếp bảng theo cột (bấm tiêu đề "Tiếng Anh" / "Tiếng Việt") ---- */
document.querySelectorAll(".wh-col-sort-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const col = btn.dataset.sortCol;
    if (wh.sortCol === col) wh.sortDir = wh.sortDir === "asc" ? "desc" : "asc";
    else { wh.sortCol = col; wh.sortDir = "asc"; }
    saveState();
    renderWhTable();
  });
});

async function addWhList() {
  const defaultName = "Danh sách " + (getCategory(wh.cat).length + 1);
  const name = await showPrompt("Tên danh sách mới", defaultName);
  if (!name) return;
  const list = defaultList(name);
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
  const cat = wh.cat;
  const removedIdx = lists.findIndex((l) => l.id === list.id);
  state.categories[cat] = lists.filter((l) => l.id !== list.id);
  state.activeWhList[cat] = null;
  state.selected.flashcard = state.selected.flashcard.filter((id) => id !== list.id);
  state.selected.writing = state.selected.writing.filter((id) => id !== list.id);
  saveState();
  renderWarehouseTab();
  pushTrash("list", cat, list.id, list.name, list);
  showUndoToast(`Đã xoá danh sách "${list.name}".`, () => {
    const arr = getCategory(cat);
    arr.splice(Math.min(removedIdx, arr.length), 0, list);
    state.activeWhList[cat] = list.id;
    saveState();
    if (wh.cat === cat) renderWarehouseTab();
  });
});
document.getElementById("wh-clear-all").addEventListener("click", async () => {
  const list = whActiveList();
  if (!list || !list.items.length) return;
  const ok = await showConfirm("Xoá toàn bộ mục trong danh sách này?");
  if (!ok) return;
  const removedItems = list.items.slice();
  const listId = list.id;
  const cat = wh.cat;
  list.items = [];
  saveState();
  renderWarehouseTab();
  pushTrash("clear", cat, listId, list.name, removedItems);
  showUndoToast(`Đã xoá ${removedItems.length} mục.`, () => {
    const l = getList(cat, listId);
    if (!l) return;
    l.items = removedItems;
    saveState();
    if (wh.cat === cat) renderWarehouseTab();
  });
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
  const list = whActiveList();
  const existingKeys = new Set((list ? list.items : []).map((it) => (it.en || "").toLowerCase().trim()));
  const dupCount = whPreviewItems.filter((it) => existingKeys.has((it.en || "").toLowerCase().trim())).length;
  document.getElementById("wh-preview-hint").textContent =
    `Xem trước ${whPreviewItems.length} mục — có thể chỉnh sửa từng ô, xoá mục không cần, rồi nhấn OK để thêm vào danh sách.`
    + (dupCount ? ` Lưu ý: ${dupCount} mục trùng với từ đã có trong danh sách này (đánh dấu vàng).` : "");
  if (!whPreviewItems.length) {
    box.innerHTML = `<div class="wh-preview-empty">Không có mục nào để xem trước.</div>`;
    return;
  }
  if (dupCount) {
    const dupBtn = document.createElement("button");
    dupBtn.type = "button";
    dupBtn.className = "pill-btn-outline";
    dupBtn.style.marginBottom = "8px";
    dupBtn.textContent = `Bỏ ${dupCount} mục trùng`;
    dupBtn.addEventListener("click", () => {
      whPreviewItems = whPreviewItems.filter((it) => !existingKeys.has((it.en || "").toLowerCase().trim()));
      renderWhPreview();
    });
    box.appendChild(dupBtn);
  }
  whPreviewItems.forEach((it, idx) => {
    const isDup = existingKeys.has((it.en || "").toLowerCase().trim());
    const row = document.createElement("div");
    row.className = "wh-preview-row" + (isDict ? "" : " simple") + (isDup ? " wh-preview-dup" : "");
    row.dataset.idx = idx;
    row.innerHTML = isDict
      ? `<input class="wh-preview-en" value="${escapeHtml(it.en)}" placeholder="Từ tiếng Anh">
         <input class="wh-preview-ipa" value="${escapeHtml(it.ipa)}" placeholder="Phiên âm">
         <input class="wh-preview-pos" value="${escapeHtml(it.pos)}" placeholder="Loại từ">
         <textarea class="wh-preview-vi" placeholder="Nghĩa tiếng Việt">${escapeHtml(it.vi)}</textarea>
         <button class="wh-preview-remove" title="Bỏ mục này">${icon("trash")}</button>`
      : `<input class="wh-preview-en" value="${escapeHtml(it.en)}" placeholder="Tiếng Anh">
         <textarea class="wh-preview-vi" placeholder="Tiếng Việt">${escapeHtml(it.vi)}</textarea>
         <button class="wh-preview-remove" title="Bỏ mục này">${icon("trash")}</button>`;
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
       <button class="wh-preview-remove" title="Bỏ dòng này">${icon("trash")}</button>`;
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
        <button class="nghe-wh-card-delete" title="Xoá">${icon("trash")}</button>
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
  document.getElementById("wh-edit-tags").value = (item.tags || []).join(", ");
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
  const tags = document.getElementById("wh-edit-tags").value.split(",").map((t) => t.trim()).filter(Boolean);
  if (tags.length) item.tags = tags;
  else delete item.tags;
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
    const enRaw = line.slice(0, idx).trim();
    const vi = line.slice(idx + sep.length).trim();
    if (!enRaw || !vi) return;
    // "|" tách nhiều đáp án hẳn khác nhau (đáp án chính + các đáp án phụ),
    // giống hệt cách xử lý khi thêm tay 1 mục trong Kho.
    const enParts = enRaw.split("|").map((s) => s.trim()).filter(Boolean);
    const en = enParts[0] || enRaw;
    const enAlts = enParts.slice(1);
    const item = { id: uid(), en, vi, status: "new" };
    if (enAlts.length) item.enAlts = enAlts;
    current.items.push(item);
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
              // "|" trong i.en (hoặc mảng i.enAlts có sẵn) = các đáp án phụ,
              // giống hệt cách xử lý khi thêm tay 1 mục trong Kho.
              const enParts = String(i.en || "").split("|").map((s) => s.trim()).filter(Boolean);
              const en = enParts[0] || i.en;
              const enAlts = enParts.slice(1).concat(Array.isArray(i.enAlts) ? i.enAlts : []);
              const item = { id: uid(), en, vi: i.vi, status: "new" };
              if (enAlts.length) item.enAlts = enAlts;
              newList.items.push(item);
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
   CÀI ĐẶT (SETTINGS POPUP)
   Đồng bộ giờ đi theo tài khoản (UID) một cách tự động, không còn
   khái niệm "mã đồng bộ" thủ công nữa — xem module TÀI KHOẢN bên dưới.
   ============================================================ */
function updateSettingsAccountStatusUI() {
  const note = document.getElementById("settings-account-status-note");
  if (!note) return;
  if (currentUser) {
    note.textContent = `Đã đăng nhập với tên "${accountProfile ? accountProfile.name : "..."}" — dữ liệu đang tự động đồng bộ lên tài khoản này.`;
  } else {
    note.textContent = "Chưa đăng nhập — dữ liệu chỉ lưu trên máy này. Bấm vào avatar ở góc trên bên trái để đăng nhập/đăng ký.";
  }
}

document.getElementById("settings-open").addEventListener("click", () => {
  updateSettingsAccountStatusUI();
  updateKeybindButtons();
  document.getElementById("settings-overlay").classList.remove("hidden");
});
document.getElementById("settings-close").addEventListener("click", () => {
  document.getElementById("settings-overlay").classList.add("hidden");
});
document.getElementById("settings-overlay").addEventListener("click", (e) => {
  if (e.target.id === "settings-overlay") document.getElementById("settings-overlay").classList.add("hidden");
});

/* ============================================================
   SAO LƯU DỮ LIỆU (xuất/nhập file JSON toàn bộ state cục bộ)
   ============================================================ */
document.getElementById("settings-export-backup-btn").addEventListener("click", () => {
  try {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `nox-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Đã xuất file sao lưu.");
  } catch (err) {
    showToast("Lỗi khi xuất dữ liệu: " + (err && err.message ? err.message : "?"));
  }
});
document.getElementById("settings-import-backup-btn").addEventListener("click", () => {
  document.getElementById("settings-import-backup-input").click();
});
document.getElementById("settings-import-backup-input").addEventListener("change", async (e) => {
  const file = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!file) return;
  const ok = await showConfirm("Nhập dữ liệu sẽ GHI ĐÈ toàn bộ dữ liệu hiện tại trên máy này bằng nội dung trong file. Tiếp tục?");
  if (!ok) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null) throw new Error("File không đúng định dạng.");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    showToast("Đã nhập dữ liệu — đang tải lại trang...");
    setTimeout(() => window.location.reload(), 800);
  } catch (err) {
    showToast("Lỗi khi nhập file: " + (err && err.message ? err.message : "File không hợp lệ."));
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
  updateDbConfigUI();
  document.getElementById("db-config-overlay").classList.remove("hidden");
});
function closeDbConfigOverlay() {
  document.getElementById("db-config-overlay").classList.add("hidden");
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
  initAuthWatcher();
  updateDbConfigUI();
  showToast("Đã đổi database. Nếu đang đăng nhập, hệ thống sẽ tự kết nối lại.");
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
  initAuthWatcher();
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

/* ---- Popup dịch nhanh: xoá bản dịch cũ khi mở lại, tự nhận diện ngôn ngữ, tự lấy chữ bôi đen / thẻ hiện tại ---- */
document.getElementById("settings-qt-clear-refocus").addEventListener("change", (e) => {
  state.settings.qtClearOnRefocus = e.target.checked;
  saveState();
});
document.getElementById("settings-qt-autodetect").addEventListener("change", (e) => {
  state.settings.qtAutoDetectLang = e.target.checked;
  saveState();
});
document.getElementById("settings-qt-follow-sel").addEventListener("change", (e) => {
  state.settings.translateFollowSel = e.target.checked;
  saveState();
});
document.getElementById("settings-qt-follow-card").addEventListener("change", (e) => {
  state.settings.translateFollowCard = e.target.checked;
  saveState();
});
document.getElementById("settings-qt-clear-refocus").checked = !!state.settings.qtClearOnRefocus;
document.getElementById("settings-qt-autodetect").checked = !!state.settings.qtAutoDetectLang;
document.getElementById("settings-qt-follow-sel").checked = state.settings.translateFollowSel !== false;
document.getElementById("settings-qt-follow-card").checked = !!state.settings.translateFollowCard;


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

/* ---- Cài đặt Thời gian học: hiện số phút đã học cạnh chữ "Nox" ---- */
document.getElementById("settings-study-minutes-quickview").addEventListener("change", (e) => {
  state.settings.showStudyMinutes = e.target.checked;
  saveState();
  updateBrandMinutesQuickview();
});
document.getElementById("settings-study-minutes-quickview").checked = !!state.settings.showStudyMinutes;

updateBrandMinutesQuickview();
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
    version: "2.41",
    changes: [
      "Thêm giao diện đặc biệt Hoàng triều, thay thế giao diện Tết Việt (ai đang dùng Tết Việt sẽ chuyển sang Hoàng triều nếu đã được mở khoá): nền gấm đỏ rồng phượng, trống đồng Đông Sơn xoay chậm, thẻ lật hiện trống đồng dưới chữ rồi tan, loading trống đồng tự vẽ rồi hiện Nox, vòng mục tiêu viền hoa văn trống đồng, trả lời đúng trống sáng vàng / sai trống rung nứt đỏ, toast huy hiệu trống đồng, hoa mai rơi và bụi vàng",
      "Admin > Chức năng: công tắc giao diện Tết Việt được thay bằng công tắc giao diện Hoàng triều",
    ],
  },
  {
    version: "2.40",
    changes: [
      "Thêm giao diện đặc biệt Ma pháp: nền có 12 trận đồ nhiều cỡ quay liên tục (một số tự vẽ, một số tự xoá) cùng hạt rune, đốm sáng, tia sao; màn chính, bảng điều khiển và popup trong suốt nhìn xuyên được nền; thẻ lật hiện vòng ma pháp dưới chữ rồi tan, loading tự vẽ trận đồ rồi hiện Nox, vòng mục tiêu có rune quanh vành, trả lời đúng vòng sáng lên / sai vòng nứt vỡ, toast có vòng rune nhỏ",
      "Admin > Chức năng: thêm công tắc khoá/mở giao diện Ma pháp",
    ],
  },
  {
    version: "2.39",
    changes: [
      "Cài đặt: bỏ nút “Mở tài liệu ngữ pháp” (tab Ngữ pháp trong app vẫn dùng bình thường)",
      "Bỏ icon chèn thêm trong các nút có chữ; icon nhiều màu (⚙, 🗑, 🎙, 🔊, ❤...) đổi sang icon nét đen đi theo màu chữ",
      "Popup Dịch nhanh không còn lớp làm mờ nền ở các giao diện đặc biệt (kể cả giao diện thêm sau này)",
      "Giao diện đặc biệt gom vào 1 nút trong Cài đặt > Giao diện: bấm để mở popup chọn, nút hiện hình giao diện đang dùng",
      "Thêm 3 giao diện đặc biệt: Tu tiên (ngọc bích & vàng kim), Tết cổ truyền (hoa đào, hoa mai, lì xì, đèn lồng) và Genshin (trời xanh, mây, đảo bay, giấy kem viền vàng)",
      "Admin > Chức năng: có công tắc khoá/mở riêng cho từng giao diện đặc biệt mới",
    ],
  },
  {
    version: "2.38",
    changes: [
      "Dịch nhanh: thay các thanh dịch bằng 1 popup nổi dùng chung toàn app — KHÔNG đóng khi bấm ra ngoài; mở/đóng bằng phím tắt (mặc định F2, đổi trong Cài đặt > Phím tắt (Chung)), nút Dịch ở đầu thanh bên, Esc để đóng; kéo được sang chỗ khác",
      "Dịch nhanh lấy nội dung trực tiếp: chữ đang bôi đen, thẻ đang hiện / mặt sau (Thẻ), câu đề / câu đang gõ (Viết), câu và cả đoạn đã mở (Nghe); tuỳ chọn tự điền khi đổi thẻ, đổi câu; có thể dán từ clipboard",
      "Dịch nhanh: nhớ bản dịch cũ (đỡ tốn lượt miễn phí), dịch được đoạn dài, báo rõ khi hết lượt trong ngày, có nút Sao chép và mở Google Translate",
      "Đã xoá thanh dịch trong tab Thẻ và thanh dịch nội tuyến trong tab Viết (độ khó Khó vẫn khoá dịch ở tab Viết)",
      "Admin: khoá/mở “Tài liệu ngữ pháp” nay khoá/mở luôn cả tab Ngữ pháp; giao diện chọn cấp đổi sang nút viên thuốc cùng phong cách app",
    ],
  },
  {
    version: "2.37",
    changes: [
      "Thêm tab Ngữ pháp (thay chỗ Quizz): 29 unit ghi chú ngữ pháp có bảng so sánh, mẹo nhớ, ví dụ đúng/sai — đổi màu theo theme của app và đọc được cả khi offline",
      "Ngữ pháp: tìm kiếm trong toàn bộ unit (không cần gõ dấu), hiện số chỗ khớp + trích đoạn, tô sáng và nhảy giữa các kết quả bằng Enter / Shift+Enter",
      "Ngữ pháp: tự nhớ unit và vị trí đang đọc dở; đánh dấu ★ các unit hay xem lại (đồng bộ giữa các thiết bị); phím ← → chuyển unit",
    ],
  },
  {
    version: "2.36",
    changes: [
      "Gỡ bỏ hoàn toàn tab Quizz (bao gồm Thách đấu bạn bè) để app gọn và nhẹ hơn; dữ liệu Thẻ / Viết / Kho không bị ảnh hưởng",
      "Sửa lỗi kẹt màn hình loading (tím, chữ Nox) khi mở app: Service Worker nay ưu tiên lấy file mới nhất, có nút 'Làm mới & thử lại' nếu tải quá lâu",
    ],
  },
  {
    version: "2.35",
    changes: [
      "Quizz: tính điểm — mỗi câu đúng 100 điểm + thưởng theo tốc độ trả lời (tối đa +50), cứ 5 câu có 1 câu Boss x2 điểm với đáp án nhiễu khó hơn; điểm hiện ngay trên thanh trên và ở màn kết quả",
      "Quizz: Thách đấu bạn bè — sau khi làm xong, tạo mã/link mời để bạn bè làm đúng bộ câu hỏi đó, có bảng xếp hạng điểm; hoặc bấm 'Nhập mã thách đấu' để tham gia",
      "Quizz: Nguồn thêm 'Viết' và chọn được đồng thời Thẻ / Viết / Từ điển, mỗi nguồn có nút chọn danh sách riêng",
      "Quizz: đổi 'Dạng câu hỏi' thành 'Loại câu hỏi', bỏ chú thích và icon trong 4 nút chọn",
      "Giao diện: thu nhỏ các nút Tìm kiếm / Kho / Cài đặt trên đầu sidebar để không che tên User",
    ],
  },
  {
    version: "2.34",
    changes: [
      "Quizz: thêm 3 dạng câu hỏi mới trộn ngẫu nhiên cùng Trắc nghiệm — ⌨️ Gõ đáp án, ✅ Đúng/Sai, 🔀 Xáo chữ (chọn dạng nào muốn bật ở màn thiết lập)",
      "Quizz: đáp án nhiễu trong Trắc nghiệm giờ ưu tiên chọn các đáp án có độ dài gần giống đáp án đúng thay vì hoàn toàn ngẫu nhiên, đỡ bị đoán mò",
      "Quizz: thêm huy hiệu 🔥 Combo hiện ngay lúc làm bài khi trả lời đúng liên tiếp ≥2 câu",
      "Quizz: màn kết quả thêm chuỗi đúng liên tiếp dài nhất + danh sách xem lại từng câu trả lời sai (câu hỏi/đáp án của bạn/đáp án đúng)",
      "Quizz: trả lời đúng/sai giờ luôn đổi trạng thái mục tương ứng trong Kho (Đã biết / Khó) ở cả 4 dạng câu hỏi, không chỉ riêng Trắc nghiệm như trước",
    ],
  },
  {
    version: "2.33",
    changes: [
      "Thêm vào (nhập liệu hàng loạt): cảnh báo mục trùng với dữ liệu đã có trong danh sách (tô vàng + nút 'Bỏ N mục trùng')",
      "Kho: thêm checkbox chọn nhiều dòng + thanh hành động hàng loạt (Gắn thẻ / Chuyển danh sách / Xoá / Bỏ chọn), có checkbox 'chọn tất cả'",
      "Kho: thêm sắp xếp theo cột — bấm tiêu đề 'Tiếng Anh'/'Tiếng Việt' để sort A-Z/Z-A (được lưu lại thứ tự)",
      "Kho: thêm tab 🗑 Thùng rác — mục/danh sách/lần 'xoá hết' đã xoá được giữ 24 giờ, có thể Khôi phục hoặc Xoá vĩnh viễn, độc lập với toast Hoàn tác 6 giây trước đó",
    ],
  },
  {
    version: "2.32",
    changes: [
      "Kho: thêm thẻ (tags) cho từng mục — sửa mục có ô nhập tags, thanh chip lọc theo tag phía trên bảng",
      "Kho: thêm nút Tìm kiếm toàn bộ (icon 🔍 cạnh icon Kho) — tìm xuyên suốt mọi danh sách/loại nội dung, bấm kết quả để nhảy thẳng tới đó",
      "Kho: thêm nút ⇄ Chuyển mục sang danh sách khác, nút ⧉ Nhân bản danh sách",
      "Kho: thêm Chia sẻ riêng tư qua mã 6 ký tự (khác Thư viện công khai — không cần Admin duyệt, chỉ ai có mã/link mới nhập được) và popup Nhập từ mã chia sẻ; mở link có ?share=MÃ sẽ tự gợi ý nhập",
      "Kho: xoá 1 mục / xoá cả danh sách / xoá hết mục giờ có toast Hoàn tác trong 6 giây",
      "Kho: thêm nút 🖨️ Xuất Worksheet — in ra định dạng từ + chỗ trống viết nghĩa kèm trang đáp án (qua hộp thoại In của trình duyệt để giữ đúng dấu tiếng Việt)",
      "Kho: thêm nút 📋 Sao chép nhanh trên mỗi dòng",
    ],
  },
  {
    version: "2.31",
    changes: [
      "Thư viện: thêm nút Yêu thích (❤️) trên từng gói + sắp xếp 'Yêu thích'; thêm nút Báo cáo (🚩) trong chi tiết gói",
      "Admin > Thư viện: hiện số báo cáo trên mỗi gói (xem lý do, bỏ qua báo cáo), gói bị báo cáo/chờ duyệt được đẩy lên đầu danh sách",
      "Admin: thêm khối thống kê nhanh (tổng user, Premium, Admin, gói chờ duyệt, gói bị báo cáo), ô tìm kiếm trong tab User, tab Nhật ký ghi lại các hành động admin (ban, đổi vai trò, xoá tài khoản, duyệt/xoá gói...)",
      "Admin: giới hạn 5 lần nhập sai mật khẩu mở khoá trước khi khoá tạm 60 giây",
      "PWA: hiện banner 'Có bản cập nhật mới' kèm nút tải lại thay vì tự động cập nhật ngầm",
      "Cài đặt: thêm Xuất/Nhập dữ liệu (JSON) để tự sao lưu tiến độ học",
    ],
  },
  {
    version: "2.30",
    changes: [
      "Admin Panel: chuyển thành 1 tab (Admin) bên trong Kho thay vì popup — khoá bằng mật khẩu đăng nhập của Admin, có nút Khoá lại; bỏ hẳn icon 🛠️ và ô mở khoá trong Cài đặt",
      "Admin > User: thêm nút Xoá tài khoản (xoá hồ sơ + tên đăng nhập khỏi hệ thống, yêu cầu nhập lại mật khẩu admin) và nút Xem mật khẩu (Firebase không lưu mật khẩu ở dạng đọc được nên thao tác này gửi email đặt lại mật khẩu cho user, cũng yêu cầu mật khẩu admin)",
      "Đăng ký: thêm ô Nhập lại mật khẩu để đối chiếu trước khi tạo tài khoản",
      "Đăng nhập: ô Tên đăng nhập giờ nhận cả tên HOẶC email",
      "Kho: đổi icon 🗄️ sang icon hộp mới; chuyển bộ lọc Loại nội dung/Sắp xếp của tab Thư viện ra khung điều khiển bên trái (giống các tab khác); thêm thanh tìm kiếm gói phía trên danh sách Thư viện",
    ],
  },
  {
    version: "2.29",
    changes: [
      "Thêm hệ thống tài khoản: Đăng ký/Đăng nhập bằng Tên (≤10 ký tự, duy nhất) + mật khẩu + email, Quên mật khẩu qua email",
      "4 cấp tài khoản: Khách (chỉ local, không Thư viện) / Free / Premium / Admin — người đăng ký đầu tiên trên database tự động là Admin",
      "Avatar tài khoản thay chữ \"Nox\" ở góc trên bên trái — bấm vào để đăng nhập/đăng ký hoặc xem thông tin tài khoản (đổi tên/mật khẩu/email, xin nâng cấp Premium)",
      "Kho: thêm tab Thư viện chung (lọc theo Thẻ/Viết/Nghe/Từ điển, sắp xếp Mới nhất/Cũ nhất/Xu hướng) + nút Đăng lên Thư viện ở mỗi danh sách",
      "Giới hạn Thư viện: Free tải xuống 5 gói/ngày & tải lên 3 gói/ngày (cần Admin duyệt), Premium/Admin không giới hạn (đăng lên hiện ngay), Khách không dùng được Thư viện",
      "Admin Panel (mở qua nhập mật khẩu trong Cài đặt): quản lý User (đổi vai trò, Ban/Unban, duyệt yêu cầu nâng cấp), duyệt/xoá gói Thư viện, đổi cấu hình Database, khoá/mở tính năng Ngữ pháp & Nhắc từ theo từng cấp",
      "Dữ liệu tự động đồng bộ theo tài khoản (bỏ hẳn \"mã đồng bộ\" thủ công) — dữ liệu đang có trên máy tự chuyển vào tài khoản khi đăng ký/đăng nhập lần đầu",
      "Xoá hoàn toàn tính năng Nhật Ký (đã ngừng dùng từ trước)",
    ],
  },
  {
    version: "2.28",
    changes: [
      "Viết: bỏ nút loa 🔊 riêng cạnh đáp án đúng — giờ bấm thẳng vào bong bóng câu để nghe lại",
      "Viết: thêm phím tắt riêng (đổi được trong Cài đặt > Phím tắt) để đọc nhanh câu đúng/gợi ý đang hiện trong khung chat, mặc định F3",
      "Viết: đảo vị trí nút Độ khó và nút xáo trộn ⟲, thêm nút 🎙 cạnh xáo trộn để mở nhanh bảng chọn giọng đọc (dùng chung với Nghe)",
      "Fix bug gợi ý: bấm gợi ý dồn dập không còn tự đẩy ra hết cả câu — mỗi lượt chỉ đưa đúng 1 từ tiếp theo, phải chèn/gõ đúng từ đang gợi ý rồi mới được gợi ý từ kế tiếp",
      "Fix bug Thống kê: số giờ đã học không còn bị reset về 0 khi nghỉ 1 hôm không mở app — tách riêng bộ đếm cộng dồn vĩnh viễn khỏi bộ đếm mục tiêu hằng ngày",
      "Xoá thông báo \"sắp ngắt quãng đà học\" còn sót lại (toast + thông báo hệ thống) — tính năng Hệ số/đà học đã ẩn khỏi giao diện từ trước nên thông báo này không còn ý nghĩa",
    ],
  },
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
  if (isFeatureLocked("reminder")) {
    showToast(`Tính năng Nhắc từ đã bị khoá với cấp tài khoản (${roleLabel(accountRole)}) của bạn.`);
    document.getElementById("settings-reminder-quick-toggle").checked = false;
    return;
  }
  setReminderEnabled(!state.reminder.enabled);
}
document.getElementById("settings-reminder-quick-toggle").addEventListener("change", toggleGlobalReminder);
document.getElementById("settings-reminder-quick-toggle").checked = state.reminder.enabled;


/* ============================================================
   MOBILE — TỰ ẨN BẢNG ĐIỀU KHIỂN
   ============================================================ */
let mobilePanelExpanded = false;
function isMobileViewport() {
  return window.matchMedia("(max-width:900px)").matches;
}
function updateMobilePanelVisibility() {
  const toggle = document.getElementById("mobile-panel-toggle");
  const activeTab = document.querySelector(".main-tab-btn.active")?.dataset.tab;
  if (!isMobileViewport()) {
    toggle.classList.add("hidden");
    document.querySelectorAll(".sidebar-panel").forEach((p) => p.classList.remove("mobile-collapsed"));
    return;
  }
  toggle.classList.remove("hidden");
  document.querySelectorAll(".sidebar-panel").forEach((p) => {
    p.classList.toggle("mobile-collapsed", p.dataset.panel === activeTab && !mobilePanelExpanded);
  });
  toggle.textContent = mobilePanelExpanded ? "Ẩn tuỳ chọn" : "Hiện tuỳ chọn";
}
document.getElementById("mobile-panel-toggle").addEventListener("click", () => {
  mobilePanelExpanded = !mobilePanelExpanded;
  updateMobilePanelVisibility();
});
window.addEventListener("resize", updateMobilePanelVisibility);
/* generic dropdown menu handling (dùng cho menu sort của Kho) */
function closeAllDiaryDropdowns() {
  document.querySelectorAll(".diary-dropdown-menu").forEach((m) => m.classList.add("hidden"));
}
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

/* ============================================================
   CHỨC NĂNG — khoá/mở theo vai trò (Admin Panel > tab Chức năng)
   ============================================================ */
const FEATURE_KEYS = ["grammar", "reminder"].concat(SPECIAL_THEMES.map((t) => t.feature));
const FEATURE_LABELS = { grammar: "Tab Ngữ pháp", reminder: "Nhắc từ" };
const FEATURE_DESCS = {
  grammar: "Khoá/mở tab Ngữ pháp (khoá cấp nào thì cấp đó không dùng được tab này).",
  reminder: "Popup nhắc từ định kỳ (Cài đặt > Nhắc từ).",
};
SPECIAL_THEMES.forEach((t) => { FEATURE_LABELS[t.feature] = t.featureLabel; FEATURE_DESCS[t.feature] = t.featureDesc; });
let featuresConfig = null; // { grammar: {guest,free,premium,admin}, reminder: {...} }
function defaultFeaturesConfig() {
  const allOn = { guest: true, free: true, premium: true, admin: true };
  const cfg = { grammar: { ...allOn }, reminder: { ...allOn } };
  SPECIAL_THEMES.forEach((t) => { cfg[t.feature] = { ...allOn }; });
  return cfg;
}
function isFeatureLocked(key) {
  if (accountRole === "admin") return false; // admin luôn full quyền
  if (!featuresConfig || !featuresConfig[key]) return false; // chưa tải xong config -> tạm không khoá
  return featuresConfig[key][accountRole] === false;
}
function loadFeaturesConfig() {
  initFirebaseApp();
  firebase.database().ref("config/features").on("value", (snap) => {
    featuresConfig = { ...defaultFeaturesConfig(), ...(snap.val() || {}) };
    refreshThemeAfterLockChange();
    renderCurrentTab();
    if (!document.getElementById("admin-pane-features").classList.contains("hidden")) renderAdminFeaturesTab();
  });
}

/* ============================================================
   GIAO DIỆN TÀI KHOẢN (avatar header, popup đăng nhập/đăng ký,
   popup thông tin acc, quyền hạn hiển thị theo vai trò)
   ============================================================ */
// Công tắc "grammar" khoá/mở tab Ngữ pháp theo cấp tài khoản. Gọi lại mỗi khi đổi vai trò hoặc config thay đổi.
function applyGrammarLock() {
  const btn = document.querySelector('.main-tab-btn[data-tab="grammar"]');
  if (!btn) return;
  const locked = isFeatureLocked("grammar");
  btn.classList.toggle("locked", locked);
  btn.setAttribute("aria-disabled", locked ? "true" : "false");
  btn.title = locked ? `Tài liệu Ngữ pháp đã bị khoá với cấp tài khoản (${roleLabel(accountRole)})` : "";
  if (locked && grammarTabVisible()) switchTab("flashcard"); // đang đứng ở tab Ngữ pháp thì đưa về tab Thẻ
}

function refreshAccountUI() {
  applyGrammarLock();
  refreshThemeAfterLockChange();
  const avatar = document.getElementById("account-avatar");
  const nameEl = document.getElementById("account-brand-name");
  const roleEl = document.getElementById("account-brand-role");
  avatar.className = "account-avatar" + (accountRole !== "guest" ? " role-" + accountRole : "");
  if (currentUser && accountProfile) {
    avatar.textContent = (accountProfile.name || "?").trim().charAt(0).toUpperCase();
    nameEl.textContent = accountProfile.name;
  } else {
    avatar.textContent = "?";
    nameEl.textContent = "Khách";
  }
  roleEl.textContent = currentUser ? roleLabel(accountRole) : "Chưa đăng nhập — bấm để đăng nhập";
  document.getElementById("wh-cat-library-btn").classList.toggle("hidden", accountRole === "guest");
  document.getElementById("wh-cat-admin-btn").classList.toggle("hidden", accountRole !== "admin");
  if (accountRole !== "admin") {
    adminUnlocked = false;
    sessionStorage.removeItem(ADMIN_PASS_SESSION_KEY);
  }
  if (wh.cat === "library" && accountRole === "guest") {
    wh.cat = "flashcard";
    document.querySelectorAll(".wh-cat-btn").forEach((b) => b.classList.toggle("active", b.dataset.whCat === "flashcard"));
  }
  if (wh.cat === "admin" && accountRole !== "admin") {
    wh.cat = "flashcard";
    document.querySelectorAll(".wh-cat-btn").forEach((b) => b.classList.toggle("active", b.dataset.whCat === "flashcard"));
  }
  updateSettingsAccountStatusUI();
  renderCurrentTab();
}

document.getElementById("account-open-btn").addEventListener("click", () => {
  if (currentUser) {
    openAccountInfoPopup();
  } else {
    document.getElementById("auth-overlay").classList.remove("hidden");
  }
});

/* ---- Đăng nhập / Đăng ký / Quên mật khẩu ---- */
function switchAuthTab(tab) {
  document.querySelectorAll(".auth-subtab-btn[data-auth-tab]").forEach((b) => b.classList.toggle("active", b.dataset.authTab === tab));
  document.getElementById("auth-pane-login").classList.toggle("hidden", tab !== "login");
  document.getElementById("auth-pane-register").classList.toggle("hidden", tab !== "register");
  document.getElementById("auth-pane-forgot").classList.add("hidden");
}
document.querySelectorAll(".auth-subtab-btn[data-auth-tab]").forEach((btn) => {
  btn.addEventListener("click", () => switchAuthTab(btn.dataset.authTab));
});
document.getElementById("auth-close").addEventListener("click", () => document.getElementById("auth-overlay").classList.add("hidden"));
document.getElementById("auth-overlay").addEventListener("click", (e) => {
  if (e.target.id === "auth-overlay") document.getElementById("auth-overlay").classList.add("hidden");
});

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove("hidden");
}
function friendlyAuthError(err) {
  const code = err && err.code || "";
  if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Sai mật khẩu.";
  if (code.includes("user-not-found")) return "Không tìm thấy tài khoản.";
  if (code.includes("email-already-in-use")) return "Email này đã được dùng cho tài khoản khác.";
  if (code.includes("invalid-email")) return "Email không hợp lệ.";
  if (code.includes("weak-password")) return "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
  if (code.includes("network")) return "Lỗi mạng, thử lại sau.";
  return err && err.message ? err.message : "Có lỗi xảy ra.";
}

document.getElementById("auth-login-submit").addEventListener("click", async () => {
  const name = document.getElementById("auth-login-name").value;
  const pass = document.getElementById("auth-login-pass").value;
  document.getElementById("auth-login-error").classList.add("hidden");
  try {
    await loginWithName(name, pass);
    document.getElementById("auth-overlay").classList.add("hidden");
    showToast("Đăng nhập thành công.");
  } catch (err) {
    showAuthError("auth-login-error", friendlyAuthError(err));
  }
});

document.getElementById("auth-reg-submit").addEventListener("click", async () => {
  const name = document.getElementById("auth-reg-name").value;
  const pass = document.getElementById("auth-reg-pass").value;
  const pass2 = document.getElementById("auth-reg-pass2").value;
  const email = document.getElementById("auth-reg-email").value;
  document.getElementById("auth-reg-error").classList.add("hidden");
  if (pass !== pass2) {
    showAuthError("auth-reg-error", "Mật khẩu nhập lại không khớp.");
    return;
  }
  try {
    await registerAccount(name, pass, email);
    document.getElementById("auth-overlay").classList.add("hidden");
    showToast("Tạo tài khoản thành công — dữ liệu hiện có trên máy đã được đưa vào tài khoản mới.");
  } catch (err) {
    showAuthError("auth-reg-error", friendlyAuthError(err));
  }
});

document.getElementById("auth-forgot-open").addEventListener("click", () => {
  document.getElementById("auth-pane-login").classList.add("hidden");
  document.getElementById("auth-pane-register").classList.add("hidden");
  document.getElementById("auth-pane-forgot").classList.remove("hidden");
});
document.getElementById("auth-forgot-back").addEventListener("click", () => switchAuthTab("login"));
document.getElementById("auth-forgot-submit").addEventListener("click", async () => {
  const email = document.getElementById("auth-forgot-email").value;
  document.getElementById("auth-forgot-error").classList.add("hidden");
  try {
    await sendForgotPassword(email);
    showToast("Đã gửi email đặt lại mật khẩu (kiểm tra cả mục Spam).");
    switchAuthTab("login");
  } catch (err) {
    showAuthError("auth-forgot-error", friendlyAuthError(err));
  }
});

/* ---- Popup thông tin tài khoản ---- */
function permsDescriptionForRole(role) {
  const lines = [];
  lines.push(role === "guest"
    ? "Dữ liệu chỉ lưu trên máy này, không đồng bộ. Không dùng được Thư viện."
    : "Dữ liệu tự động đồng bộ lên tài khoản, dùng được trên nhiều thiết bị.");
  if (role !== "guest") {
    const dl = libraryDownloadLimit();
    const ul = libraryUploadLimit();
    lines.push("Tải xuống Thư viện: " + (dl === Infinity ? "không giới hạn" : dl + " gói/ngày"));
    lines.push("Tải lên Thư viện: " + (ul === Infinity ? "không giới hạn" : ul + " gói/ngày") + (role === "free" ? " (cần Admin duyệt)" : " (hiện công khai ngay)"));
  }
  FEATURE_KEYS.forEach((k) => {
    if (featuresConfig && featuresConfig[k] && featuresConfig[k][role] === false) {
      lines.push("• " + FEATURE_LABELS[k] + " đang bị khoá với cấp này.");
    }
  });
  return lines.join("\n");
}
function openAccountInfoPopup() {
  if (!accountProfile) return;
  document.getElementById("acc-info-name").textContent = accountProfile.name;
  document.getElementById("acc-info-email").textContent = accountProfile.email || "—";
  document.getElementById("acc-info-role").textContent = roleLabel(accountRole);
  const quotaRow = document.getElementById("acc-info-quota-row");
  if (accountRole === "free") {
    quotaRow.classList.remove("hidden");
    document.getElementById("acc-info-quota").textContent =
      dailyQuotaRemaining("downloadCount", "downloadDate", libraryDownloadLimit()) + "/" + libraryDownloadLimit() + " lượt tải hôm nay còn lại";
  } else {
    quotaRow.classList.add("hidden");
  }
  document.getElementById("acc-info-perms").textContent = permsDescriptionForRole(accountRole);
  document.getElementById("acc-upgrade-btn").classList.toggle("hidden", accountRole !== "free");
  document.getElementById("acc-upgrade-btn").textContent = accountProfile.upgradeRequested ? "Đã gửi yêu cầu nâng cấp — chờ Admin duyệt" : "Xin nâng cấp lên Premium";
  document.getElementById("acc-upgrade-btn").disabled = !!accountProfile.upgradeRequested;
  document.getElementById("account-info-overlay").classList.remove("hidden");
}
document.getElementById("account-info-close").addEventListener("click", () => document.getElementById("account-info-overlay").classList.add("hidden"));
document.getElementById("account-info-overlay").addEventListener("click", (e) => {
  if (e.target.id === "account-info-overlay") document.getElementById("account-info-overlay").classList.add("hidden");
});
document.getElementById("acc-logout-btn").addEventListener("click", async () => {
  const ok = await showConfirm("Đăng xuất? Dữ liệu trên tài khoản vẫn được giữ nguyên trên máy chủ, thiết bị này sẽ quay về trạng thái Khách.");
  if (!ok) return;
  await logoutAccount();
  document.getElementById("account-info-overlay").classList.add("hidden");
  showToast("Đã đăng xuất.");
});
document.getElementById("acc-upgrade-btn").addEventListener("click", async () => {
  await firebase.database().ref("users/" + currentUser.uid + "/profile").update({ upgradeRequested: true });
  showToast("Đã gửi yêu cầu nâng cấp lên Premium tới Admin.");
  openAccountInfoPopup();
});
document.getElementById("acc-change-name-btn").addEventListener("click", async () => {
  const name = await showPrompt("Tên mới (tối đa 10 ký tự)", accountProfile.name);
  if (!name) return;
  if (name.length > 10) { showToast("Tên tối đa 10 ký tự."); return; }
  const key = nameKey(name);
  if (key !== accountProfile.nameLower) {
    const taken = await firebase.database().ref("usernames/" + key).once("value");
    if (taken.exists()) { showToast("Tên này đã có người dùng."); return; }
    await firebase.database().ref("usernames/" + accountProfile.nameLower).remove();
    await firebase.database().ref("usernames/" + key).set(accountProfile.email);
  }
  await firebase.database().ref("users/" + currentUser.uid + "/profile").update({ name, nameLower: key });
  showToast("Đã đổi tên.");
  openAccountInfoPopup();
});
document.getElementById("acc-change-pass-btn").addEventListener("click", async () => {
  const pass = await showPrompt("Mật khẩu mới (tối thiểu 6 ký tự)", "");
  if (!pass) return;
  if (pass.length < 6) { showToast("Mật khẩu tối thiểu 6 ký tự."); return; }
  try {
    await currentUser.updatePassword(pass);
    showToast("Đã đổi mật khẩu.");
  } catch (err) {
    showToast(friendlyAuthError(err) + " (có thể cần đăng nhập lại rồi thử lại)");
  }
});
document.getElementById("acc-change-email-btn").addEventListener("click", async () => {
  if (!checkAndBumpDailyQuota("emailChangeCount", "emailChangeDate", 3)) {
    showToast("Đã đổi email tối đa 3 lần hôm nay, thử lại vào ngày mai.");
    return;
  }
  const email = await showPrompt("Email mới", accountProfile.email || "");
  if (!email) return;
  try {
    await currentUser.updateEmail(email.trim());
    await firebase.database().ref("users/" + currentUser.uid + "/profile").update({ email: email.trim() });
    await firebase.database().ref("usernames/" + accountProfile.nameLower).set(email.trim());
    showToast("Đã đổi email.");
    openAccountInfoPopup();
  } catch (err) {
    showToast(friendlyAuthError(err) + " (có thể cần đăng nhập lại rồi thử lại)");
  }
});

/* ============================================================
   ADMIN PANEL — giờ là 1 tab (Admin) trong Kho, khoá bằng mật khẩu
   đăng nhập của chính tài khoản Admin (reauthenticate).
   ============================================================ */
async function adminReauthenticate(password) {
  if (!currentUser || !password) return false;
  try {
    const cred = firebase.auth.EmailAuthProvider.credential(currentUser.email, password);
    await currentUser.reauthenticateWithCredential(cred);
    return true;
  } catch (err) {
    return false;
  }
}

/* Ghi log hành động admin vào admin_log/ (chỉ admin đọc/ghi được — xem firebase-rules.json) */
function logAdminAction(action, detail) {
  if (!currentUser) return;
  firebase.database().ref("admin_log").push({
    by: (accountProfile && accountProfile.name) || currentUser.email || "?",
    action, detail: detail || "",
    at: Date.now(),
  }).catch(() => {});
}

/* Giới hạn số lần nhập sai mật khẩu mở khoá Admin Panel (chống dò mật khẩu) */
let adminUnlockFails = 0;
let adminUnlockLockUntil = 0;

function renderWhAdminView() {
  const isUnlocked = accountRole === "admin" && adminUnlocked;
  document.getElementById("admin-lock").classList.toggle("hidden", isUnlocked);
  document.getElementById("admin-content").classList.toggle("hidden", !isUnlocked);
  if (isUnlocked) { switchAdminTab("users"); renderAdminQuickStats(); }
}
document.getElementById("admin-unlock-btn").addEventListener("click", async () => {
  const input = document.getElementById("admin-unlock-input");
  const pass = input.value;
  const errEl = document.getElementById("admin-unlock-error");
  errEl.classList.add("hidden");
  const remainMs = adminUnlockLockUntil - Date.now();
  if (remainMs > 0) {
    errEl.textContent = `Đã nhập sai quá nhiều lần — thử lại sau ${Math.ceil(remainMs / 1000)} giây.`;
    errEl.classList.remove("hidden");
    return;
  }
  if (!pass || !currentUser) return;
  const ok = await adminReauthenticate(pass);
  if (ok) {
    adminUnlockFails = 0;
    adminUnlocked = true;
    sessionStorage.setItem(ADMIN_PASS_SESSION_KEY, "1");
    input.value = "";
    renderWhAdminView();
    refreshAccountUI();
  } else {
    adminUnlockFails++;
    if (adminUnlockFails >= 5) {
      adminUnlockLockUntil = Date.now() + 60000;
      adminUnlockFails = 0;
      errEl.textContent = "Đã nhập sai quá nhiều lần — thử lại sau 60 giây.";
    } else {
      errEl.textContent = `Sai mật khẩu (còn ${5 - adminUnlockFails} lần thử).`;
    }
    errEl.classList.remove("hidden");
  }
});
document.getElementById("admin-unlock-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); document.getElementById("admin-unlock-btn").click(); }
});
document.getElementById("admin-relock-btn").addEventListener("click", () => {
  adminUnlocked = false;
  sessionStorage.removeItem(ADMIN_PASS_SESSION_KEY);
  renderWhAdminView();
  showToast("Đã khoá lại Admin Panel.");
});

async function renderAdminQuickStats() {
  const box = document.getElementById("admin-quick-stats");
  if (!box) return;
  const [usersSnap, librarySnap] = await Promise.all([
    firebase.database().ref("users").once("value"),
    firebase.database().ref("library").once("value"),
  ]);
  const users = Object.values(usersSnap.val() || {}).map((u) => u.profile || {});
  const lib = Object.values(librarySnap.val() || {});
  const chips = [
    { n: users.length, label: "Tổng user" },
    { n: users.filter((u) => u.role === "premium").length, label: "Premium" },
    { n: users.filter((u) => u.role === "admin").length, label: "Admin" },
    { n: lib.filter((p) => p.status === "pending").length, label: "Gói chờ duyệt" },
    { n: lib.filter((p) => p.reports && Object.keys(p.reports).length).length, label: "Gói bị báo cáo" },
  ];
  box.innerHTML = chips.map((c) => `<div class="admin-stat-chip"><b>${c.n}</b><span>${escapeHtml(c.label)}</span></div>`).join("");
}

function switchAdminTab(tab) {
  document.querySelectorAll("#admin-panel-tabs [data-admin-tab]").forEach((b) => b.classList.toggle("active", b.dataset.adminTab === tab));
  ["users", "library", "log", "database", "features"].forEach((t) => {
    document.getElementById("admin-pane-" + t).classList.toggle("hidden", t !== tab);
  });
  document.getElementById("admin-users-search").classList.toggle("hidden", tab !== "users");
  if (tab === "users") renderAdminUsersTab();
  if (tab === "library") renderAdminLibraryTab();
  if (tab === "log") renderAdminLogTab();
  if (tab === "database") renderAdminDatabaseTab();
  if (tab === "features") renderAdminFeaturesTab();
}
document.querySelectorAll("#admin-panel-tabs [data-admin-tab]").forEach((btn) => {
  btn.addEventListener("click", () => switchAdminTab(btn.dataset.adminTab));
});

async function renderAdminLogTab() {
  const pane = document.getElementById("admin-pane-log");
  pane.innerHTML = `<p class="admin-empty">Đang tải...</p>`;
  const snap = await firebase.database().ref("admin_log").limitToLast(50).once("value");
  const entries = Object.values(snap.val() || {}).sort((a, b) => (b.at || 0) - (a.at || 0));
  pane.innerHTML = "";
  if (!entries.length) { pane.appendChild(Object.assign(document.createElement("p"), { className: "admin-empty", textContent: "Chưa có hoạt động nào được ghi lại." })); return; }
  entries.forEach((e) => {
    const row = document.createElement("div");
    row.className = "admin-log-row";
    row.innerHTML = `<span><b>${escapeHtml(e.by || "?")}</b> — ${escapeHtml(e.action || "")}${e.detail ? ": " + escapeHtml(e.detail) : ""}</span><span class="admin-log-time">${e.at ? new Date(e.at).toLocaleString("vi-VN") : ""}</span>`;
    pane.appendChild(row);
  });
}

let adminUsersCache = [];
async function renderAdminUsersTab() {
  const pane = document.getElementById("admin-pane-users");
  pane.innerHTML = `<p class="admin-empty">Đang tải...</p>`;
  const snap = await firebase.database().ref("users").once("value");
  const users = snap.val() || {};
  adminUsersCache = Object.entries(users).map(([uid, u]) => ({ uid, ...(u.profile || {}) }));
  renderAdminUsersList();
}
document.getElementById("admin-users-search").addEventListener("input", renderAdminUsersList);
function renderAdminUsersList() {
  const pane = document.getElementById("admin-pane-users");
  const q = document.getElementById("admin-users-search").value.trim().toLowerCase();
  const entries = q
    ? adminUsersCache.filter((u) => (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q))
    : adminUsersCache;
  const pending = entries.filter((u) => u.upgradeRequested && u.role === "free");
  const allPending = adminUsersCache.filter((u) => u.upgradeRequested && u.role === "free");
  document.getElementById("admin-badge-users").classList.toggle("hidden", allPending.length === 0);
  document.getElementById("admin-badge-users").textContent = allPending.length;
  pane.innerHTML = "";
  if (pending.length) {
    const h = document.createElement("div");
    h.className = "section-label";
    h.textContent = `Yêu cầu chờ duyệt (${pending.length})`;
    pane.appendChild(h);
    pending.forEach((u) => pane.appendChild(buildAdminUserRow(u, true)));
    const sep = document.createElement("div");
    sep.className = "section-label";
    sep.textContent = "Tất cả tài khoản";
    pane.appendChild(sep);
  }
  if (!entries.length) pane.appendChild(Object.assign(document.createElement("p"), { className: "admin-empty", textContent: q ? "Không tìm thấy user nào." : "Chưa có tài khoản nào." }));
  entries.forEach((u) => pane.appendChild(buildAdminUserRow(u, false)));
}
function buildAdminUserRow(u, highlightPending) {
  const row = document.createElement("div");
  row.className = "admin-row";
  const main = document.createElement("div");
  main.className = "admin-row-main";
  main.innerHTML = `<b>${escapeHtml(u.name || "?")}</b><span class="admin-row-sub">${escapeHtml(u.email || "")}${u.banned ? " · ĐÃ BỊ KHOÁ" : ""}${highlightPending ? " · xin nâng cấp Premium" : ""}</span>`;
  row.appendChild(main);
  const actions = document.createElement("div");
  actions.className = "admin-row-actions";
  const select = document.createElement("select");
  select.className = "admin-role-select";
  ["free", "premium", "admin"].forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r; opt.textContent = roleLabel(r);
    if (u.role === r) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener("change", async () => {
    await firebase.database().ref("users/" + u.uid + "/profile").update({ role: select.value, upgradeRequested: false });
    logAdminAction("Đổi vai trò", `${u.name} → ${roleLabel(select.value)}`);
    showToast("Đã đổi vai trò " + u.name + " thành " + roleLabel(select.value) + ".");
    renderAdminUsersTab();
    renderAdminQuickStats();
  });
  actions.appendChild(select);
  const banBtn = document.createElement("button");
  banBtn.className = "pill-btn-outline";
  banBtn.textContent = u.banned ? "Unban" : "Ban";
  banBtn.addEventListener("click", async () => {
    await firebase.database().ref("users/" + u.uid + "/profile").update({ banned: !u.banned });
    logAdminAction(u.banned ? "Unban" : "Ban", u.name);
    showToast((u.banned ? "Đã unban " : "Đã ban ") + u.name + ".");
    renderAdminUsersTab();
  });
  actions.appendChild(banBtn);

  const resetBtn = document.createElement("button");
  resetBtn.className = "pill-btn-outline";
  resetBtn.textContent = "Xem mật khẩu";
  resetBtn.title = "Firebase không lưu mật khẩu ở dạng đọc được — thao tác này gửi email đặt lại mật khẩu cho user";
  resetBtn.addEventListener("click", async () => {
    if (!u.email) { showToast("Tài khoản này không có email."); return; }
    const pass = await showPrompt("Nhập mật khẩu admin để xác nhận", "");
    if (!pass) return;
    const ok = await adminReauthenticate(pass);
    if (!ok) { showToast("Sai mật khẩu admin."); return; }
    try {
      await firebase.auth().sendPasswordResetEmail(u.email);
      logAdminAction("Gửi email đặt lại mật khẩu", u.name);
      showToast("Không thể xem trực tiếp mật khẩu (Firebase mã hoá, kể cả Admin cũng không đọc được) — đã gửi email đặt lại mật khẩu tới " + u.email + ".");
    } catch (err) {
      showToast(friendlyAuthError(err));
    }
  });
  actions.appendChild(resetBtn);

  const delAccBtn = document.createElement("button");
  delAccBtn.className = "pill-btn-outline";
  delAccBtn.textContent = "Xoá tài khoản";
  delAccBtn.addEventListener("click", async () => {
    const ok1 = await showConfirm(`Xoá tài khoản "${u.name}" khỏi hệ thống? Hồ sơ và tên đăng nhập sẽ bị xoá vĩnh viễn (không thể hoàn tác).`);
    if (!ok1) return;
    const pass = await showPrompt("Nhập mật khẩu admin để xác nhận", "");
    if (!pass) return;
    const ok = await adminReauthenticate(pass);
    if (!ok) { showToast("Sai mật khẩu admin."); return; }
    try {
      if (u.nameLower) await firebase.database().ref("usernames/" + u.nameLower).remove();
      await firebase.database().ref("users/" + u.uid + "/profile").remove();
      logAdminAction("Xoá tài khoản", u.name);
      showToast("Đã xoá tài khoản " + u.name + " khỏi hệ thống.");
      renderAdminUsersTab();
      renderAdminQuickStats();
    } catch (err) {
      showToast("Lỗi khi xoá: " + (err && err.message ? err.message : "?"));
    }
  });
  actions.appendChild(delAccBtn);

  row.appendChild(actions);
  return row;
}

async function renderAdminLibraryTab() {
  const pane = document.getElementById("admin-pane-library");
  pane.innerHTML = `<p class="admin-empty">Đang tải...</p>`;
  const snap = await firebase.database().ref("library").once("value");
  const all = snap.val() || {};
  const entries = Object.entries(all).map(([id, p]) => ({ id, ...p }));
  const pending = entries.filter((p) => p.status === "pending");
  const reportedCount = entries.filter((p) => p.reports && Object.keys(p.reports).length).length;
  document.getElementById("admin-badge-library").classList.toggle("hidden", pending.length === 0 && reportedCount === 0);
  document.getElementById("admin-badge-library").textContent = pending.length + reportedCount;
  pane.innerHTML = "";
  if (!entries.length) { pane.appendChild(Object.assign(document.createElement("p"), { className: "admin-empty", textContent: "Thư viện chưa có gói nào." })); return; }
  // Ưu tiên hiện gói bị báo cáo và gói chờ duyệt lên đầu.
  entries.sort((a, b) => {
    const ar = a.reports ? Object.keys(a.reports).length : 0;
    const br = b.reports ? Object.keys(b.reports).length : 0;
    const ap = a.status === "pending" ? 1 : 0;
    const bp = b.status === "pending" ? 1 : 0;
    if ((br > 0) !== (ar > 0)) return br > 0 ? 1 : -1;
    if (ap !== bp) return bp - ap;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
  entries.forEach((p) => {
    const reports = p.reports ? Object.values(p.reports) : [];
    const row = document.createElement("div");
    row.className = "admin-row";
    const main = document.createElement("div");
    main.className = "admin-row-main";
    const itemCount = p.items ? p.items.length : 0;
    main.innerHTML = `<b>${escapeHtml(p.title || "?")}</b><span class="admin-row-sub">Tác giả thật: ${escapeHtml(p.authorName || "?")}${p.anon ? " (đăng ẩn danh)" : ""} · ${whCatLabel(p.cat)} · ${itemCount} mục · ${p.downloads || 0} lượt tải · trạng thái: ${p.status === "pending" ? "chờ duyệt" : "đã duyệt"}</span>`;
    if (reports.length) {
      const toggle = document.createElement("button");
      toggle.className = "admin-report-toggle";
      toggle.textContent = `${reports.length} báo cáo — xem lý do`;
      const list = document.createElement("div");
      list.className = "admin-report-list hidden";
      list.innerHTML = reports.map((r) => `• ${escapeHtml(r.reason || "(không có lý do)")} <span class="admin-log-time">${r.at ? new Date(r.at).toLocaleString("vi-VN") : ""}</span>`).join("<br>");
      toggle.addEventListener("click", () => list.classList.toggle("hidden"));
      main.appendChild(toggle);
      main.appendChild(list);
    }
    row.appendChild(main);
    const actions = document.createElement("div");
    actions.className = "admin-row-actions";
    if (p.status === "pending") {
      const approveBtn = document.createElement("button");
      approveBtn.className = "pill-btn primary";
      approveBtn.textContent = "Duyệt";
      approveBtn.addEventListener("click", async () => {
        await firebase.database().ref("library/" + p.id).update({ status: "approved" });
        logAdminAction("Duyệt gói thư viện", p.title);
        showToast("Đã duyệt gói " + p.title + ".");
        renderAdminLibraryTab();
        renderAdminQuickStats();
      });
      actions.appendChild(approveBtn);
    }
    if (reports.length) {
      const dismissBtn = document.createElement("button");
      dismissBtn.className = "pill-btn-outline";
      dismissBtn.textContent = "Bỏ qua báo cáo";
      dismissBtn.addEventListener("click", async () => {
        await firebase.database().ref("library/" + p.id + "/reports").remove();
        logAdminAction("Bỏ qua báo cáo", p.title);
        showToast("Đã xoá các báo cáo của gói " + p.title + ".");
        renderAdminLibraryTab();
        renderAdminQuickStats();
      });
      actions.appendChild(dismissBtn);
    }
    const delBtn = document.createElement("button");
    delBtn.className = "pill-btn-outline";
    delBtn.textContent = "Xoá";
    delBtn.addEventListener("click", async () => {
      const ok = await showConfirm(`Xoá gói "${p.title}" khỏi Thư viện?`);
      if (!ok) return;
      await firebase.database().ref("library/" + p.id).remove();
      logAdminAction("Xoá gói thư viện", p.title);
      showToast("Đã xoá.");
      renderAdminLibraryTab();
      renderAdminQuickStats();
    });
    actions.appendChild(delBtn);
    row.appendChild(actions);
    pane.appendChild(row);
  });
}

async function renderAdminDatabaseTab() {
  const cfg = getActiveFirebaseConfig();
  document.getElementById("admin-db-info").textContent = `Đang dùng database: ${cfg.databaseURL || "(mặc định)"}`;
  const capSnap = await firebase.database().ref("config/regCap").once("value");
  document.getElementById("admin-reg-cap-input").value = capSnap.val() || "";
}
document.getElementById("admin-reg-cap-save").addEventListener("click", async () => {
  const val = parseInt(document.getElementById("admin-reg-cap-input").value, 10);
  await firebase.database().ref("config/regCap").set(val > 0 ? val : null);
  showToast("Đã lưu giới hạn đăng ký.");
});

function renderAdminFeaturesTab() {
  const pane = document.getElementById("admin-pane-features");
  pane.innerHTML = "";
  const cfg = featuresConfig || defaultFeaturesConfig();

  const hint = document.createElement("p");
  hint.className = "admin-feature-hint";
  hint.textContent = "Bấm vào từng cấp để khoá / mở chức năng. Nút sáng = được dùng, nút mờ = bị khoá. Admin luôn có đủ quyền.";
  pane.appendChild(hint);

  const list = document.createElement("div");
  list.className = "admin-feature-list";
  FEATURE_KEYS.forEach((key) => {
    const row = document.createElement("div");
    row.className = "admin-feature-row";

    const info = document.createElement("div");
    info.className = "admin-feature-info";
    const name = document.createElement("div");
    name.className = "admin-feature-name";
    name.textContent = FEATURE_LABELS[key];
    info.appendChild(name);
    if (FEATURE_DESCS[key]) {
      const desc = document.createElement("div");
      desc.className = "admin-feature-desc";
      desc.textContent = FEATURE_DESCS[key];
      info.appendChild(desc);
    }
    row.appendChild(info);

    const rolesBox = document.createElement("div");
    rolesBox.className = "admin-feature-roles";
    ["guest", "free", "premium"].forEach((role) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "admin-role-chip";
      const paint = (on) => {
        chip.classList.toggle("on", on);
        chip.setAttribute("aria-pressed", on ? "true" : "false");
        chip.textContent = roleLabel(role);
        chip.title = on ? `${roleLabel(role)}: đang được dùng — bấm để khoá` : `${roleLabel(role)}: đang bị khoá — bấm để mở`;
      };
      paint(cfg[key] ? cfg[key][role] !== false : true);
      chip.addEventListener("click", async () => {
        const next = !chip.classList.contains("on");
        chip.disabled = true;
        try {
          await firebase.database().ref(`config/features/${key}/${role}`).set(next);
          paint(next);
          showToast(`${next ? "Đã mở" : "Đã khoá"} “${FEATURE_LABELS[key]}” với ${roleLabel(role)}.`);
        } catch (err) {
          showToast("Không lưu được — thử lại sau.");
        }
        chip.disabled = false;
      });
      rolesBox.appendChild(chip);
    });
    row.appendChild(rolesBox);
    list.appendChild(row);
  });
  pane.appendChild(list);
}

/* ============================================================
   THƯ VIỆN (Kho > Thư viện)
   ============================================================ */
const libUi = { cat: "flashcard", sort: "new", search: "" };
document.querySelectorAll(".wh-library-filter-btn[data-lib-cat]").forEach((btn) => {
  btn.addEventListener("click", () => {
    libUi.cat = btn.dataset.libCat;
    document.querySelectorAll(".wh-library-filter-btn[data-lib-cat]").forEach((b) => b.classList.toggle("active", b === btn));
    renderLibraryTab();
  });
});
document.querySelectorAll(".wh-library-filter-btn[data-lib-sort]").forEach((btn) => {
  btn.addEventListener("click", () => {
    libUi.sort = btn.dataset.libSort;
    document.querySelectorAll(".wh-library-filter-btn[data-lib-sort]").forEach((b) => b.classList.toggle("active", b === btn));
    renderLibraryTab();
  });
});
const whLibSearchInput = document.getElementById("wh-library-search");
const whLibSearchClear = document.getElementById("wh-library-search-clear");
whLibSearchInput.addEventListener("input", () => {
  libUi.search = whLibSearchInput.value;
  whLibSearchClear.classList.toggle("hidden", !libUi.search);
  renderLibraryTab();
});
whLibSearchClear.addEventListener("click", () => {
  libUi.search = "";
  whLibSearchInput.value = "";
  whLibSearchClear.classList.add("hidden");
  whLibSearchInput.focus();
  renderLibraryTab();
});

async function renderLibraryTab() {
  const quotaEl = document.getElementById("wh-library-quota");
  const listEl = document.getElementById("wh-library-list");
  if (accountRole === "guest") {
    quotaEl.textContent = "Đăng nhập/đăng ký để dùng Thư viện.";
    listEl.innerHTML = `<p class="wh-library-empty">Bấm vào avatar ở góc trên bên trái để đăng nhập hoặc tạo tài khoản.</p>`;
    return;
  }
  const dl = libraryDownloadLimit();
  const remain = dailyQuotaRemaining("downloadCount", "downloadDate", dl);
  quotaEl.textContent = dl === Infinity ? "Tải xuống: không giới hạn." : `Còn ${remain}/${dl} lượt tải hôm nay.`;
  listEl.innerHTML = `<p class="wh-library-empty">Đang tải...</p>`;
  const snap = await firebase.database().ref("library").orderByChild("cat").equalTo(libUi.cat).once("value");
  let entries = Object.entries(snap.val() || {}).map(([id, p]) => ({ id, ...p })).filter((p) => p.status === "approved");
  entries.forEach((p) => { p._likeCount = p.likes ? Object.keys(p.likes).length : 0; });
  if (libUi.sort === "new") entries.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  else if (libUi.sort === "old") entries.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  else if (libUi.sort === "likes") entries.sort((a, b) => b._likeCount - a._likeCount);
  else entries.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
  const q = (libUi.search || "").trim().toLowerCase();
  if (q) {
    entries = entries.filter((p) =>
      (p.title || "").toLowerCase().includes(q) ||
      (!p.anon && (p.authorName || "").toLowerCase().includes(q)) ||
      (p.note || "").toLowerCase().includes(q)
    );
  }
  listEl.innerHTML = "";
  if (!entries.length) {
    listEl.innerHTML = q
      ? `<p class="wh-library-empty">Không tìm thấy gói nào khớp với "${escapeHtml(libUi.search)}".</p>`
      : `<p class="wh-library-empty">Chưa có gói nào ở mục này.</p>`;
    return;
  }
  const canDownload = dl === Infinity || remain > 0;
  const myUid = currentUser ? currentUser.uid : null;
  entries.forEach((p) => {
    const liked = !!(myUid && p.likes && p.likes[myUid]);
    const card = document.createElement("div");
    card.className = "wh-library-card";
    card.innerHTML = `
      <div class="wh-library-card-title">${escapeHtml(p.title || "?")}</div>
      <div class="wh-library-card-meta"><span>${icon("user")} ${escapeHtml(p.anon ? "Ẩn danh" : (p.authorName || "?"))}</span><span>${icon("download")} ${p.downloads || 0}</span></div>
      ${p.note ? `<div class="wh-library-card-note">"${escapeHtml(p.note)}"</div>` : ""}
      <div class="wh-library-card-footer">
        <button class="wh-library-card-like-btn${liked ? " liked" : ""}" title="Yêu thích">${liked ? icon("heartf") : icon("heart")} <span>${p._likeCount}</span></button>
        <button class="pill-btn primary wh-library-card-dl" ${canDownload ? "" : "disabled"}>Tải về Kho</button>
      </div>
    `;
    card.addEventListener("click", (e) => {
      if (e.target.closest(".wh-library-card-dl") || e.target.closest(".wh-library-card-like-btn")) return;
      openLibraryDetail(p);
    });
    card.querySelector(".wh-library-card-dl").addEventListener("click", (e) => {
      e.stopPropagation();
      downloadLibraryPackage(p);
    });
    card.querySelector(".wh-library-card-like-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLibraryLike(p);
    });
    listEl.appendChild(card);
  });
}

async function toggleLibraryLike(p) {
  if (!currentUser) { showToast("Cần đăng nhập để yêu thích gói."); return; }
  const ref = firebase.database().ref(`library/${p.id}/likes/${currentUser.uid}`);
  const alreadyLiked = !!(p.likes && p.likes[currentUser.uid]);
  await ref.set(alreadyLiked ? null : true);
  renderLibraryTab();
}

function openLibraryDetail(p) {
  document.getElementById("lib-detail-title").textContent = p.title || "?";
  document.getElementById("lib-detail-author").textContent = p.anon ? "Ẩn danh" : (p.authorName || "?");
  document.getElementById("lib-detail-downloads").textContent = p.downloads || 0;
  document.getElementById("lib-detail-date").textContent = p.createdAt ? new Date(p.createdAt).toLocaleDateString("vi-VN") : "—";
  document.getElementById("lib-detail-note").textContent = p.note || "";
  const preview = document.getElementById("lib-detail-preview");
  preview.innerHTML = "";
  (p.items || []).slice(0, 20).forEach((it) => {
    const line = document.createElement("div");
    line.className = "lib-detail-preview-item";
    line.textContent = it.en || it.name || JSON.stringify(it).slice(0, 60);
    preview.appendChild(line);
  });
  if ((p.items || []).length > 20) preview.innerHTML += `<div class="lib-detail-preview-item">... và ${p.items.length - 20} mục khác</div>`;
  const dlBtn = document.getElementById("lib-detail-download-btn");
  const dl = libraryDownloadLimit();
  const remain = dailyQuotaRemaining("downloadCount", "downloadDate", dl);
  dlBtn.disabled = !(dl === Infinity || remain > 0);
  dlBtn.onclick = () => downloadLibraryPackage(p);

  const likeBtn = document.getElementById("lib-detail-like-btn");
  const likeCountEl = document.getElementById("lib-detail-like-count");
  function refreshLikeBtn(pkg) {
    const liked = !!(currentUser && pkg.likes && pkg.likes[currentUser.uid]);
    const count = pkg.likes ? Object.keys(pkg.likes).length : 0;
    likeBtn.classList.toggle("liked", liked);
    likeBtn.innerHTML = `${liked ? icon("heartf") : icon("heart")} <span id="lib-detail-like-count">${count}</span>`;
  }
  refreshLikeBtn(p);
  likeBtn.onclick = async () => {
    await toggleLibraryLike(p);
    const snap = await firebase.database().ref("library/" + p.id).once("value");
    const fresh = { id: p.id, ...(snap.val() || {}) };
    Object.assign(p, fresh);
    refreshLikeBtn(p);
  };

  document.getElementById("lib-detail-report-btn").onclick = async () => {
    if (!currentUser) { showToast("Cần đăng nhập để báo cáo."); return; }
    const reason = await showPrompt("Lý do báo cáo gói này (nội dung sai, vi phạm, spam...)", "");
    if (!reason) return;
    await firebase.database().ref(`library/${p.id}/reports/${currentUser.uid}`).set({ reason, at: Date.now() });
    showToast("Đã gửi báo cáo tới Admin. Cảm ơn bạn!");
  };

  document.getElementById("library-detail-overlay").classList.remove("hidden");
}
document.getElementById("library-detail-close").addEventListener("click", () => document.getElementById("library-detail-overlay").classList.add("hidden"));
document.getElementById("library-detail-overlay").addEventListener("click", (e) => {
  if (e.target.id === "library-detail-overlay") document.getElementById("library-detail-overlay").classList.add("hidden");
});

async function downloadLibraryPackage(p) {
  const dl = libraryDownloadLimit();
  if (!checkAndBumpDailyQuota("downloadCount", "downloadDate", dl)) {
    showToast("Đã hết lượt tải hôm nay.");
    return;
  }
  const cat = p.cat;
  const existingKeys = new Set(allItems(cat).map((it) => (it.en || it.name || "").toLowerCase().trim()));
  const newItems = (p.items || []).filter((it) => !existingKeys.has((it.en || it.name || "").toLowerCase().trim()));
  const list = defaultList(p.title || "Gói từ thư viện");
  list.items = newItems.map((it) => ({ ...it, id: uid() }));
  getCategory(cat).push(list);
  await firebase.database().ref("library/" + p.id + "/downloads").transaction((c) => (c || 0) + 1);
  saveState();
  showToast(`Đã thêm "${list.name}" vào Kho (${newItems.length} mục mới, bỏ qua ${p.items.length - newItems.length} mục trùng).`);
  document.getElementById("library-detail-overlay").classList.add("hidden");
  renderLibraryTab();
  if (wh.cat === cat) renderWarehouseTab();
}

/* ---- Tải danh sách hiện có lên Thư viện ---- */
let libUploadSourceList = null;
document.getElementById("wh-library-upload-open").addEventListener("click", () => {
  if (accountRole === "guest") { showToast("Cần đăng nhập để đăng lên Thư viện."); return; }
  const list = whActiveList();
  if (!list || !list.items || !list.items.length) { showToast("Danh sách hiện tại chưa có mục nào."); return; }
  const ul = libraryUploadLimit();
  const remain = dailyQuotaRemaining("uploadCount", "uploadDate", ul);
  if (!(ul === Infinity || remain > 0)) { showToast("Đã hết lượt đăng lên hôm nay."); return; }
  libUploadSourceList = list;
  document.getElementById("lib-upload-list-name").textContent = `Danh sách: "${list.name}" (${list.items.length} mục, loại ${whCatLabel(wh.cat)})`;
  document.getElementById("lib-upload-title").value = list.name;
  document.getElementById("lib-upload-anon").checked = false;
  document.getElementById("lib-upload-note").value = "";
  document.getElementById("lib-upload-error").classList.add("hidden");
  document.getElementById("library-upload-overlay").classList.remove("hidden");
});
document.getElementById("library-upload-close").addEventListener("click", () => document.getElementById("library-upload-overlay").classList.add("hidden"));
document.getElementById("library-upload-overlay").addEventListener("click", (e) => {
  if (e.target.id === "library-upload-overlay") document.getElementById("library-upload-overlay").classList.add("hidden");
});
document.getElementById("lib-upload-submit").addEventListener("click", async () => {
  const title = document.getElementById("lib-upload-title").value.trim();
  if (!title) { showAuthError("lib-upload-error", "Nhập tên gói."); return; }
  const ul = libraryUploadLimit();
  if (!checkAndBumpDailyQuota("uploadCount", "uploadDate", ul)) {
    showAuthError("lib-upload-error", "Đã hết lượt đăng lên hôm nay.");
    return;
  }
  const anon = document.getElementById("lib-upload-anon").checked;
  const note = document.getElementById("lib-upload-note").value.trim();
  const pkg = {
    title, cat: wh.cat, note,
    authorUid: currentUser.uid, authorName: accountProfile.name, anon,
    createdAt: Date.now(), downloads: 0,
    status: accountRole === "premium" || accountRole === "admin" ? "approved" : "pending",
    items: libUploadSourceList.items,
  };
  await firebase.database().ref("library").push(pkg);
  document.getElementById("library-upload-overlay").classList.add("hidden");
  showToast(pkg.status === "approved" ? "Đã đăng lên Thư viện." : "Đã gửi lên Thư viện — chờ Admin duyệt.");
});

/* ---- Nhân bản danh sách hiện tại ---- */
document.getElementById("wh-duplicate-list").addEventListener("click", () => {
  const list = whActiveList();
  if (!list) return;
  const clone = defaultList(list.name + " (bản sao)");
  clone.items = list.items.map((it) => ({ ...it, id: uid() }));
  getCategory(wh.cat).push(clone);
  state.activeWhList[wh.cat] = clone.id;
  saveState();
  renderWarehouseTab();
  showToast(`Đã nhân bản thành "${clone.name}".`);
});

/* ============================================================
   CHIA SẺ RIÊNG TƯ (khác Thư viện công khai — không cần Admin
   duyệt, không hiện công khai, chỉ ai có mã/link mới nhập được)
   ============================================================ */
function genShareCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
function copyShareLink(code) {
  const link = `${location.origin}${location.pathname}?share=${code}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => showToast("Đã sao chép link chia sẻ: " + link), () => showToast("Mã chia sẻ: " + code));
  } else {
    showToast("Mã chia sẻ: " + code);
  }
}
function renderShareOverlay() {
  const list = whActiveList();
  document.getElementById("wh-share-current-list").textContent = list ? `Danh sách hiện tại: "${list.name}" (${list.items.length} mục)` : "Chưa chọn danh sách nào.";
  document.getElementById("wh-share-create-btn").disabled = !list || !list.items.length;
  const box = document.getElementById("wh-share-my-list");
  const mine = state.myShares || [];
  box.innerHTML = "";
  if (!mine.length) { box.innerHTML = `<p class="wh-preview-empty">Bạn chưa tạo mã chia sẻ nào.</p>`; return; }
  mine.slice().reverse().forEach((s) => {
    const row = document.createElement("div");
    row.className = "admin-row";
    row.innerHTML = `<div class="admin-row-main"><b>${escapeHtml(s.listName)}</b><span class="admin-row-sub">Mã: <code>${s.code}</code> · ${whCatLabel(s.cat)}</span></div>`;
    const actions = document.createElement("div");
    actions.className = "admin-row-actions";
    const copyBtn = document.createElement("button");
    copyBtn.className = "pill-btn-outline";
    copyBtn.textContent = "Sao chép link";
    copyBtn.addEventListener("click", () => copyShareLink(s.code));
    actions.appendChild(copyBtn);
    const revokeBtn = document.createElement("button");
    revokeBtn.className = "pill-btn-outline";
    revokeBtn.textContent = "Thu hồi";
    revokeBtn.addEventListener("click", async () => {
      const ok = await showConfirm(`Thu hồi mã chia sẻ "${s.code}"? Người có mã sẽ không nhập được nữa.`);
      if (!ok) return;
      await firebase.database().ref("shares/" + s.code).remove().catch(() => {});
      state.myShares = (state.myShares || []).filter((x) => x.code !== s.code);
      saveState();
      renderShareOverlay();
      showToast("Đã thu hồi mã chia sẻ.");
    });
    actions.appendChild(revokeBtn);
    row.appendChild(actions);
    box.appendChild(row);
  });
}
document.getElementById("wh-share-open").addEventListener("click", () => {
  if (accountRole === "guest") { showToast("Cần đăng nhập để tạo mã chia sẻ."); return; }
  renderShareOverlay();
  document.getElementById("wh-share-overlay").classList.remove("hidden");
});
document.getElementById("wh-share-close").addEventListener("click", () => document.getElementById("wh-share-overlay").classList.add("hidden"));
document.getElementById("wh-share-overlay").addEventListener("click", (e) => {
  if (e.target.id === "wh-share-overlay") document.getElementById("wh-share-overlay").classList.add("hidden");
});
document.getElementById("wh-share-create-btn").addEventListener("click", async () => {
  const list = whActiveList();
  if (!list || !list.items.length || !currentUser) return;
  const code = genShareCode();
  const pkg = {
    ownerUid: currentUser.uid, ownerName: (accountProfile && accountProfile.name) || "?",
    cat: wh.cat, title: list.name, items: list.items, createdAt: Date.now(),
  };
  try {
    await firebase.database().ref("shares/" + code).set(pkg);
    state.myShares = state.myShares || [];
    state.myShares.push({ code, cat: wh.cat, listName: list.name, createdAt: Date.now() });
    saveState();
    renderShareOverlay();
    copyShareLink(code);
  } catch (err) {
    showToast("Lỗi khi tạo mã: " + (err && err.message ? err.message : "?"));
  }
});

async function redeemShareCode(rawCode) {
  const code = (rawCode || "").trim().toUpperCase();
  const errEl = document.getElementById("wh-redeem-error");
  errEl.classList.add("hidden");
  if (!code) return;
  if (!currentUser) { showToast("Cần đăng nhập để nhập từ mã chia sẻ."); return; }
  try {
    const snap = await firebase.database().ref("shares/" + code).once("value");
    const pkg = snap.val();
    if (!pkg) { errEl.textContent = "Không tìm thấy mã này (có thể sai hoặc đã bị thu hồi)."; errEl.classList.remove("hidden"); return; }
    const cat = pkg.cat;
    const existingKeys = new Set(allItems(cat).map((it) => (it.en || it.name || "").toLowerCase().trim()));
    const newItems = (pkg.items || []).filter((it) => !existingKeys.has((it.en || it.name || "").toLowerCase().trim()));
    const list = defaultList(pkg.title || "Danh sách chia sẻ");
    list.items = newItems.map((it) => ({ ...it, id: uid() }));
    getCategory(cat).push(list);
    saveState();
    document.getElementById("wh-redeem-overlay").classList.add("hidden");
    showToast(`Đã thêm "${list.name}" vào Kho (${newItems.length} mục mới, bỏ qua ${pkg.items.length - newItems.length} mục trùng).`);
    if (wh.cat === cat) renderWarehouseTab();
  } catch (err) {
    errEl.textContent = "Lỗi: " + (err && err.message ? err.message : "?");
    errEl.classList.remove("hidden");
  }
}
document.getElementById("wh-redeem-open").addEventListener("click", () => {
  if (accountRole === "guest") { showToast("Cần đăng nhập để nhập từ mã chia sẻ."); return; }
  document.getElementById("wh-redeem-input").value = "";
  document.getElementById("wh-redeem-error").classList.add("hidden");
  document.getElementById("wh-redeem-overlay").classList.remove("hidden");
});
document.getElementById("wh-redeem-close").addEventListener("click", () => document.getElementById("wh-redeem-overlay").classList.add("hidden"));
document.getElementById("wh-redeem-overlay").addEventListener("click", (e) => {
  if (e.target.id === "wh-redeem-overlay") document.getElementById("wh-redeem-overlay").classList.add("hidden");
});
document.getElementById("wh-redeem-submit").addEventListener("click", () => redeemShareCode(document.getElementById("wh-redeem-input").value));
document.getElementById("wh-redeem-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); document.getElementById("wh-redeem-submit").click(); }
});

/* ---- Xuất Worksheet (in ra / lưu PDF qua hộp thoại In của trình duyệt —
   tránh lỗi font tiếng Việt khi build PDF bằng thư viện JS) ---- */
document.getElementById("wh-worksheet-btn").addEventListener("click", () => {
  const list = whActiveList();
  if (!list || !list.items.length) { showToast("Danh sách hiện tại chưa có mục nào."); return; }
  const rows = list.items.map((it, i) => `
    <tr><td class="wno">${i + 1}</td><td class="wen">${escapeHtml(it.en)}</td><td class="wblank"></td></tr>`).join("");
  const answerItems = list.items.map((it) => `<li>${escapeHtml(it.en)} — ${escapeHtml(it.vi)}</li>`).join("");
  const html = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8">
<title>${escapeHtml(list.name)} — Worksheet</title>
<style>
  body{font-family:Arial,'Segoe UI',sans-serif;padding:24px;color:#111;}
  h1{font-size:1.3rem;margin-bottom:4px;}
  p.sub{color:#666;margin-top:0;margin-bottom:20px;font-size:.85rem;}
  table{width:100%;border-collapse:collapse;}
  td{border-bottom:1px solid #ccc;padding:9px 6px;vertical-align:bottom;font-size:.95rem;}
  td.wno{width:28px;color:#888;}
  td.wen{width:40%;font-weight:600;}
  td.wblank{border-bottom:1px solid #333;}
  .answer-key{margin-top:40px;page-break-before:always;}
  .answer-key h2{font-size:1.05rem;}
  .answer-key ol{columns:2;font-size:.85rem;line-height:1.6;padding-left:18px;}
  @media print { .no-print{display:none;} }
</style></head><body>
  <button class="no-print" onclick="window.print()" style="margin-bottom:16px;">In / Lưu PDF</button>
  <h1>${escapeHtml(list.name)}</h1>
  <p class="sub">Worksheet — điền nghĩa tiếng Việt vào chỗ trống (${list.items.length} từ)</p>
  <table>${rows}</table>
  <div class="answer-key"><h2>Đáp án</h2><ol>${answerItems}</ol></div>
</body></html>`;
  const win = window.open("", "_blank");
  if (!win) { showToast("Trình duyệt đã chặn cửa sổ mới — hãy cho phép popup để xuất worksheet."); return; }
  win.document.write(html);
  win.document.close();
  setTimeout(() => { try { win.print(); } catch (e) { /* ignore */ } }, 400);
});

/* ============================================================
   TÌM KIẾM TOÀN BỘ (xuyên suốt tất cả danh sách/loại nội dung)
   ============================================================ */
document.getElementById("global-search-open").addEventListener("click", () => {
  document.getElementById("global-search-input").value = "";
  document.getElementById("global-search-results").innerHTML = `<p class="wh-preview-empty">Gõ ít nhất 2 ký tự để tìm.</p>`;
  document.getElementById("global-search-overlay").classList.remove("hidden");
  setTimeout(() => document.getElementById("global-search-input").focus(), 50);
});
document.getElementById("global-search-close").addEventListener("click", () => document.getElementById("global-search-overlay").classList.add("hidden"));
document.getElementById("global-search-overlay").addEventListener("click", (e) => {
  if (e.target.id === "global-search-overlay") document.getElementById("global-search-overlay").classList.add("hidden");
});
document.getElementById("global-search-input").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const box = document.getElementById("global-search-results");
  if (q.length < 2) { box.innerHTML = `<p class="wh-preview-empty">Gõ ít nhất 2 ký tự để tìm.</p>`; return; }
  const cats = ["flashcard", "writing", "listening", "dictionary"];
  const results = [];
  cats.forEach((cat) => {
    getCategory(cat).forEach((list) => {
      (list.items || []).forEach((item) => {
        const hay = [item.en, item.vi, ...(item.tags || [])].filter(Boolean).join(" ").toLowerCase();
        if (hay.includes(q)) results.push({ cat, list, item });
      });
    });
  });
  box.innerHTML = "";
  if (!results.length) { box.innerHTML = `<p class="wh-preview-empty">Không tìm thấy kết quả nào.</p>`; return; }
  results.slice(0, 60).forEach((r) => {
    const row = document.createElement("div");
    row.className = "global-search-row";
    row.innerHTML = `<div><b>${escapeHtml(r.item.en)}</b> → ${escapeHtml(r.item.vi)}</div><div class="admin-row-sub">${whCatLabel(r.cat)} · ${escapeHtml(r.list.name)}</div>`;
    row.addEventListener("click", () => {
      wh.cat = r.cat;
      wh.tagFilter = [];
      state.activeWhList[r.cat] = r.list.id;
      saveState();
      document.querySelectorAll(".wh-cat-btn").forEach((b) => b.classList.toggle("active", b.dataset.whCat === r.cat));
      switchTab("warehouse");
      renderWarehouseTab();
      document.getElementById("global-search-overlay").classList.add("hidden");
    });
    box.appendChild(row);
  });
  if (results.length > 60) box.insertAdjacentHTML("beforeend", `<p class="wh-preview-empty">...và ${results.length - 60} kết quả khác, hãy gõ cụ thể hơn.</p>`);
});

/* ============================================================
   INIT
   ============================================================ */
try {
  ensureSelected("flashcard");
  ensureSelected("writing");
  ensureSelected("flashcard", "wrFcSource");
  renderFlashcardTab();
  if (state.reminder.enabled) {
    startReminderCycle();
    scheduleReminderAutoOff();
  } else {
    scheduleReminderAutoOn();
  }
  initAuthWatcher();
  loadFeaturesConfig();
  updateMobilePanelVisibility();
  pruneTrash();
  saveState();
} catch (err) {
  console.error("Nox INIT lỗi:", err);
}

/* ---- Màn hình loading: hiện cố định ~1.3s rồi tự ẩn ---- */
setTimeout(() => {
  const loadingEl = document.getElementById("app-loading");
  if (loadingEl) loadingEl.classList.add("hidden");
}, bootHoldMs());
