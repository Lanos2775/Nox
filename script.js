/* ============================================================
   NOX — Ứng dụng học từ vựng (Thẻ / Viết / Quizz / Kho)
   ============================================================ */

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
    settings: { flipVolume: 100, ttsVolume: 100, sfxEnabled: true, sfxVolume: 100, reminderMinDisplay: 10, reminderMaxReads: 2, fcFlipDuration: 10, qtClearOnRefocus: false, qtAutoDetectLang: false, momentumSystemNotify: false, momentumQuickview: false, momentumThemeSync: false, momentumIdleMinutes: 3, wrDifficulty: "medium", ngheVoiceMode: "multi", ngheSingleVoiceURI: "", wrHintKey: "AltLeft", wrTranslateKey: "F2", wrReadKey: "F3", showStudyMinutes: false },
    studyMomentum: { score: 0, streakGain: 1, lastActionAt: null, history: [] },
    studyTime: { date: todayKey(), writingSec: 0, listeningSec: 0, writingGoalMin: 60, listeningGoalMin: 60 },
    studyTimeTotal: { writingSec: 0, listeningSec: 0 },
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
    if (!parsed.settings.wrReadKey) parsed.settings.wrReadKey = "F3";
    if (!parsed.selected.wrFcSource) parsed.selected.wrFcSource = [];
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
    const level = Math.min(18, Math.max(1, Math.round(state.themeLevel || 1)));
    const palette = THEME_PALETTES[level];
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
  btn.textContent = "Danh sách: " + (wr.sourceCat === "flashcard" ? "Thẻ" : "Viết") + " ⇄";
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
  document.getElementById("quick-translate-bar").classList.add("hidden");
  qtWriting.clear();
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
  if (e.code === state.settings.wrTranslateKey) {
    e.preventDefault();
    wrToggleTranslateBar();
    return;
  }
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
   Cài đặt phím tắt cho Viết (gợi ý / mở thanh dịch) — người dùng tự gán
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
const WR_KEYBIND_ACTIONS = ["wrHintKey", "wrTranslateKey", "wrReadKey"];
const WR_KEYBIND_DEFAULTS = { wrHintKey: "AltLeft", wrTranslateKey: "F2", wrReadKey: "F3" };
function updateKeybindButtons() {
  WR_KEYBIND_ACTIONS.forEach((action) => {
    const btn = document.querySelector(`.keybind-btn[data-action="${action}"]`);
    if (btn) btn.textContent = keybindLabel(state.settings[action]);
  });
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
  // Khi thanh dịch nhanh đang MỞ, bấm vào câu tiếng Việt này sẽ điền thẳng
  // câu đó vào thanh dịch (và dịch luôn) — không cần gõ lại tay.
  bubble.title = "Nhấp để điền câu này vào thanh dịch (khi thanh dịch đang mở)";
  bubble.addEventListener("click", () => {
    const bar = document.getElementById("quick-translate-bar");
    if (!bar || bar.classList.contains("hidden")) return;
    qtWriting.setInputAndTranslateForced(item.vi, "vi-en");
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
  pctSpan.textContent = attempt.isHint ? "💡" : (attempt.correct ? "✓" : attempt.pct + "%");
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
  // Ẩn thanh dịch đi thì xoá luôn nội dung đang dịch — lần mở lại sau sẽ
  // trống, không còn sót bản dịch của lần trước.
  if (!show) qtWriting.clear();
}
document.getElementById("wr-translate-toggle-btn").addEventListener("click", () => wrToggleTranslateBar());

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
  btn.textContent = WR_DIFFICULTY_LABELS[wr.difficulty] + (wr.difficultyLocked ? " 🔒" : "");
  btn.classList.remove("difficulty-easy", "difficulty-medium", "difficulty-hard");
  btn.classList.add("difficulty-" + wr.difficulty);
  btn.classList.toggle("locked", wr.difficultyLocked);
  btn.title = wr.difficultyLocked
    ? "Đã bắt đầu làm câu này — sang câu tiếp theo mới đổi được độ khó"
    : "Bấm để đổi độ khó: Dễ → Trung bình → Khó";
  document.getElementById("wr-hint-btn").disabled = wr.difficulty === "hard";
  document.getElementById("wr-translate-toggle-btn").disabled = wr.difficulty === "hard";
  if (wr.difficulty === "hard") {
    document.getElementById("quick-translate-bar").classList.add("hidden");
    // updateWrDifficultyBtn() được gọi 1 lần lúc script khởi tạo (trước khi
    // qtWriting được khai báo ở dưới) — bọc try/catch để không vỡ lúc tải
    // trang nếu độ khó đã lưu sẵn là "Khó".
    try { qtWriting.clear(); } catch (e) { /* qtWriting chưa khởi tạo lúc này */ }
  }
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
// Nút nhỏ cạnh xáo trộn — mở lại đúng overlay chọn giọng đọc dùng chung với
// tab Nghe (state.settings.ngheVoiceMode / ngheSingleVoiceURI áp dụng cho cả
// 2 tab vì đều phát âm qua playAudio()).
document.getElementById("wr-voice-settings-btn").addEventListener("click", ngheOpenVoiceOverlay);

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
    // Xoá sạch nội dung đang dịch (ô nhập + kết quả + trạng thái nội bộ) —
    // dùng khi ẩn thanh dịch đi, để lần mở lại sau không còn sót bản dịch cũ.
    clear() {
      clearTimeout(qs.debounceHandle);
      qs.lastEn = "";
      qs.lastVi = "";
      qs.lastIPA = "";
      qs.sourceText = "";
      qs.hasBlurred = false;
      inputEl.value = "";
      resultBox.innerHTML = "";
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
const wh = { cat: "flashcard", tagFilter: [] };

function whCatLabel(cat) {
  return { flashcard: "Thẻ", writing: "Viết", listening: "Nghe", dictionary: "Từ điển", library: "Thư viện", stats: "Thống kê", admin: "Admin" }[cat];
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
  const isLibrary = wh.cat === "library";
  const isAdmin = wh.cat === "admin";
  const isSpecial = isStats || isLibrary || isAdmin;
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
  if (!list || !list.items.length) {
    table.innerHTML = `<div class="wh-empty-row">Chưa có mục nào trong danh sách này</div>`;
    document.getElementById("wh-progress").textContent = "Tiến độ: 0%";
    tagRow.classList.add("hidden");
    return;
  }

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
      clearChip.textContent = "Xoá lọc ✕";
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
  visibleItems.forEach((item) => {
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
        <button data-act="copy" title="Sao chép">📋</button>
        <button data-act="edit" title="Sửa">✎</button>
        <button data-act="move" title="Chuyển sang danh sách khác">⇄</button>
        <button data-act="del" title="Xoá">🗑</button>
      </span>`;
    
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

document.getElementById("grammar-open-btn").addEventListener("click", (e) => {
  if (isFeatureLocked("grammar")) {
    e.preventDefault();
    showToast(`Tài liệu Ngữ pháp đã bị khoá với cấp tài khoản (${roleLabel(accountRole)}) của bạn.`);
  }
});

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
const FEATURE_KEYS = ["grammar", "reminder"];
const FEATURE_LABELS = { grammar: "Mở tài liệu ngữ pháp", reminder: "Nhắc từ" };
let featuresConfig = null; // { grammar: {guest,free,premium,admin}, reminder: {...} }
function defaultFeaturesConfig() {
  const allOn = { guest: true, free: true, premium: true, admin: true };
  return { grammar: { ...allOn }, reminder: { ...allOn } };
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
    renderCurrentTab();
    if (!document.getElementById("admin-pane-features").classList.contains("hidden")) renderAdminFeaturesTab();
  });
}

/* ============================================================
   GIAO DIỆN TÀI KHOẢN (avatar header, popup đăng nhập/đăng ký,
   popup thông tin acc, quyền hạn hiển thị theo vai trò)
   ============================================================ */
function refreshAccountUI() {
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
      lines.push("❌ " + FEATURE_LABELS[k] + " đang bị khoá với cấp này.");
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
      toggle.textContent = `🚩 ${reports.length} báo cáo — xem lý do`;
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
  FEATURE_KEYS.forEach((key) => {
    const row = document.createElement("div");
    row.className = "admin-feature-row";
    const label = document.createElement("b");
    label.textContent = FEATURE_LABELS[key];
    row.appendChild(label);
    const rolesBox = document.createElement("div");
    rolesBox.className = "admin-feature-roles";
    ["guest", "free", "premium"].forEach((role) => {
      const lbl = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = cfg[key] ? cfg[key][role] !== false : true;
      cb.addEventListener("change", async () => {
        await firebase.database().ref(`config/features/${key}/${role}`).set(cb.checked);
        showToast("Đã lưu.");
      });
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(" " + roleLabel(role)));
      rolesBox.appendChild(lbl);
    });
    row.appendChild(rolesBox);
    pane.appendChild(row);
  });
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
      <div class="wh-library-card-meta"><span>👤 ${escapeHtml(p.anon ? "Ẩn danh" : (p.authorName || "?"))}</span><span>⬇ ${p.downloads || 0}</span></div>
      ${p.note ? `<div class="wh-library-card-note">"${escapeHtml(p.note)}"</div>` : ""}
      <div class="wh-library-card-footer">
        <button class="wh-library-card-like-btn${liked ? " liked" : ""}" title="Yêu thích">${liked ? "❤️" : "🤍"} <span>${p._likeCount}</span></button>
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
    likeBtn.innerHTML = `${liked ? "❤️" : "🤍"} <span id="lib-detail-like-count">${count}</span>`;
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
ensureSelected("flashcard");
ensureSelected("writing");
ensureSelected("flashcard", "wrFcSource");
renderFlashcardTab();
updateQuizCountSliderMax();
if (state.reminder.enabled) {
  startReminderCycle();
  scheduleReminderAutoOff();
} else {
  scheduleReminderAutoOn();
}
initAuthWatcher();
loadFeaturesConfig();
updateMobilePanelVisibility();
startQuizTipRotation();
saveState();

/* ---- Màn hình loading: hiện cố định ~1.3s rồi tự ẩn ---- */
setTimeout(() => {
  const loadingEl = document.getElementById("app-loading");
  if (loadingEl) loadingEl.classList.add("hidden");
}, 1300);
