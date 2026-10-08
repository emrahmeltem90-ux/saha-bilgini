// ==========================================
// SAHA BİLGİNİ - SCRIPT.JS (1. PARÇA)
// ==========================================

// --- SES DOSYALARI ---
const sesDogru = new Audio('ses_dogru.mp3');
const sesYanlis = new Audio('ses_yanlis.mp3');
const sesTiklama = new Audio('ses_tiklama.mp3');
const sesCark = new Audio('ses_cark.mp3');
const sesCombo = new Audio('ses_combo.mp3');
sesDogru.volume = 0.7; sesYanlis.volume = 0.7; sesTiklama.volume = 0.5; sesCark.volume = 0.6; sesCombo.volume = 0.8;

const muzikArkaplan = new Audio('muzik_arkaplan.mp3');
muzikArkaplan.loop = true;
muzikArkaplan.volume = 0.3;
let muzikCaliniyor = false;

const WHEEL_PRIZES = [
    { label: "10 🪙", type: "coin", value: 10, color: "#8B2252" },
    { label: "25 🪙", type: "coin", value: 25, color: "#1B5E20" },
    { label: "50 🪙", type: "coin", value: 50, color: "#0D47A1" },
    { label: "5 ⭐", type: "star", value: 5, color: "#B8860B" },
    { label: "100 🪙", type: "coin", value: 100, color: "#4A148C" },
    { label: "✂️ JOKER", type: "joker", value: 1, color: "#B71C1C" },
    { label: "250 🪙", type: "coin", value: 250, color: "#E65100" },
    { label: "TEKRAR", type: "respin", value: 1, color: "#1B5E20" }
];
let isSpinning = false;

const DAILY_REWARDS = [
    { day: 1, coin: 50, star: 0 }, { day: 2, coin: 100, star: 0 },
    { day: 3, coin: 150, star: 0 }, { day: 4, coin: 200, star: 0 },
    { day: 5, coin: 250, star: 0 }, { day: 6, coin: 300, star: 0 },
    { day: 7, coin: 500, star: 5 }
];
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const DAILY_QUESTS = [
    { id: 'play_3_levels', icon: '🎮', title: '3 Level Oyna', desc: 'Bugün 3 level tamamla', reward: '150 🪙', coin: 150, star: 0, target: 3, type: 'levels' },
    { id: 'use_5_jokers', icon: '🃏', title: '5 Joker Kullan', desc: 'Bugün 5 joker kullan', reward: '100 🪙', coin: 100, star: 0, target: 5, type: 'jokers' },
    { id: 'spin_wheel', icon: '🎡', title: 'Çarkı Çevir', desc: 'Bugün 1 kez çark çevir', reward: '50 🪙', coin: 50, star: 0, target: 1, type: 'spins' },
    { id: 'get_20_correct', icon: '✅', title: '20 Doğru Yap', desc: 'Bugün 20 doğru cevap ver', reward: '200 🪙', coin: 200, star: 0, target: 20, type: 'correct' },
    { id: 'combo_5', icon: '🔥', title: '5 Combo Yap', desc: 'Bugün 5 combo yap', reward: '150 🪙', coin: 150, star: 0, target: 5, type: 'combo' },
    { id: 'no_joker_level', icon: '🚫', title: 'Jokersiz Bitir', desc: 'Joker kullanmadan bir level bitir', reward: '100 🪙', coin: 100, star: 0, target: 1, type: 'nojoker' }
];

const ACHIEVEMENTS = [
    { id: 'first_blood', icon: '🩸', title: 'İlk Kan', desc: 'İlk doğru cevabını ver', reward: '50 🪙', coin: 50, star: 0, check: (p) => (p.totalCorrect || 0) >= 1 },
    { id: 'ten_correct', icon: '🥉', title: 'Çaylak', desc: '10 doğru cevap yap', reward: '100 🪙', coin: 100, star: 0, check: (p) => (p.totalCorrect || 0) >= 10 },
    { id: 'fifty_correct', icon: '🥈', title: 'Usta', desc: '50 doğru cevap yap', reward: '300 🪙', coin: 300, star: 0, check: (p) => (p.totalCorrect || 0) >= 50 },
    { id: 'hundred_correct', icon: '🥇', title: 'Efsane', desc: '100 doğru cevap yap', reward: '500 🪙 + 5 ⭐', coin: 500, star: 5, check: (p) => (p.totalCorrect || 0) >= 100 },
    { id: 'perfect_level', icon: '💎', title: 'Mükemmeliyetçi', desc: 'Bir leveli tam puanla bitir', reward: '200 🪙', coin: 200, star: 0, check: (p) => (p.perfectLevels || 0) >= 1 },
    { id: 'five_levels', icon: '📚', title: 'Koleksiyoner', desc: '5 level tamamla', reward: '250 🪙', coin: 250, star: 0, check: (p) => Object.keys(p.levels).length >= 5 },
    { id: 'ten_levels', icon: '🏰', title: 'Fatih', desc: '10 level tamamla', reward: '500 🪙', coin: 500, star: 0, check: (p) => Object.keys(p.levels).length >= 10 },
    { id: 'level_10', icon: '🎯', title: 'Yolun Yarısı', desc: 'Level 10\'u tamamla', reward: '300 🪙', coin: 300, star: 0, check: (p) => p.levels[9] && p.levels[9].stars > 0 },
    { id: 'champion', icon: '👑', title: 'Şampiyon', desc: 'Şampiyonlar Ligi\'ne adım at', reward: '1000 🪙 + 10 ⭐', coin: 1000, star: 10, check: (p) => (p.totalStars || 0) >= 60 },
    { id: 'daily_7', icon: '📅', title: 'Sadık Oyuncu', desc: '7 gün üst üste giriş yap', reward: '1000 🪙 + 10 ⭐', coin: 1000, star: 10, check: (p) => (p.dailyStreak || 0) >= 7 },
    { id: 'spin_10', icon: '🎡', title: 'Şanslı', desc: '10 kez çark çevir', reward: '200 🪙', coin: 200, star: 0, check: (p) => (p.totalSpins || 0) >= 10 },
    { id: 'joker_5', icon: '🃏', title: 'Jokerci', desc: '5 kez joker kullan', reward: '150 🪙', coin: 150, star: 0, check: (p) => (p.totalJokersUsed || 0) >= 5 },
    { id: 'score_1000', icon: '💯', title: 'Binlik', desc: 'Toplam 1000 puana ulaş', reward: '300 🪙', coin: 300, star: 0, check: (p) => (p.totalScore || 0) >= 1000 },
    { id: 'sharer', icon: '📤', title: 'Paylaşımcı', desc: 'Oyunu bir kez paylaş', reward: '50 🪙', coin: 50, star: 0, check: (p) => (p.totalShares || 0) >= 1 },
    { id: 'combo_10', icon: '🔥', title: 'Ateşli', desc: '10 combo yap', reward: '500 🪙 + 5 ⭐', coin: 500, star: 5, check: (p) => (p.bestCombo || 0) >= 10 },
    { id: 'daily_q_5', icon: '🌟', title: 'Günün Yıldızı', desc: '5 günün sorusunu doğru bil', reward: '500 🪙 + 10 ⭐', coin: 500, star: 10, check: (p) => (p.dailyQuestionCorrect || 0) >= 5 }
];

// --- KATEGORİ EMOJİLERİ ---
const categoryEmojis = {
    1: { icon: "🏆", role: "DÜNYA KUPASI" }, 2: { icon: "⭐", role: "ŞAMPİYONLAR" }, 3: { icon: "🇹🇷", role: "TÜRK FUTBOLU" },
    4: { icon: "🦁", role: "PREMIER LİG" }, 5: { icon: "🇪🇸", role: "LA LIGA" }, 6: { icon: "🇮🇹", role: "SERIE A" },
    7: { icon: "🇩🇪", role: "BUNDESLIGA" }, 8: { icon: "🇫🇷", role: "LIGUE 1" }, 9: { icon: "🥇", role: "BALLON D'OR" },
    10: { icon: "🏅", role: "AVRUPA LİGİ" }, 11: { icon: "🌍", role: "MİLLİ TAKIMLAR" }, 12: { icon: "🇶🇦", role: "DÜNYA KUPASI 22" },
    13: { icon: "👑", role: "EFSANELER" }, 14: { icon: "🌱", role: "GENÇ YETENEKLER" }, 15: { icon: "🧤", role: "KALECİLER" },
    16: { icon: "🛡️", role: "DEFANSLAR" }, 17: { icon: "🎩", role: "ORTA SAHA" }, 18: { icon: "⚽", role: "FORVETLER" },
    19: { icon: "📋", role: "TEKNİK DİREKTÖR" }, 20: { icon: "📜", role: "KURALLAR" }
};

function getCategoryEmoji(id) { return categoryEmojis[id] || { icon: "⚽", role: "FUTBOL" }; }

function getEmojiByCategoryName(catName) {
    if (!catName) return { icon: "⚽", role: "FUTBOL" };
    let upper = catName.toUpperCase();
    if (upper.includes("DÜNYA KUPASI")) return { icon: "🏆", role: "DÜNYA KUPASI" };
    if (upper.includes("ŞAMPİYONLAR")) return { icon: "⭐", role: "ŞAMPİYONLAR" };
    if (upper.includes("TÜRK")) return { icon: "🇹🇷", role: "TÜRK FUTBOLU" };
    if (upper.includes("PREMIER")) return { icon: "🦁", role: "PREMIER LİG" };
    if (upper.includes("LA LIGA")) return { icon: "🇪🇸", role: "LA LIGA" };
    if (upper.includes("SERIE A")) return { icon: "🇮🇹", role: "SERIE A" };
    if (upper.includes("BUNDESLIGA")) return { icon: "🇩🇪", role: "BUNDESLIGA" };
    if (upper.includes("LIGUE")) return { icon: "🇫🇷", role: "LIGUE 1" };
    if (upper.includes("BALLON")) return { icon: "🥇", role: "BALLON D'OR" };
    if (upper.includes("AVRUPA LİGİ")) return { icon: "🏅", role: "AVRUPA LİGİ" };
    if (upper.includes("MİLLİ")) return { icon: "🌍", role: "MİLLİ TAKIMLAR" };
    if (upper.includes("EFSANE")) return { icon: "👑", role: "EFSANELER" };
    if (upper.includes("GENÇ")) return { icon: "🌱", role: "GENÇ YETENEKLER" };
    if (upper.includes("KALECİ")) return { icon: "🧤", role: "KALECİLER" };
    if (upper.includes("DEFANS")) return { icon: "🛡️", role: "DEFANSLAR" };
    if (upper.includes("ORTA SAHA")) return { icon: "🎩", role: "ORTA SAHA" };
    if (upper.includes("FORVET")) return { icon: "⚽", role: "FORVETLER" };
    if (upper.includes("TEKNİK")) return { icon: "📋", role: "TEKNİK DİREKTÖR" };
    if (upper.includes("KURAL")) return { icon: "📜", role: "KURALLAR" };
    if (upper.includes("REKOR")) return { icon: "🎯", role: "REKORLAR" };
    if (upper.includes("TARİH")) return { icon: "📖", role: "TARİH" };
    if (upper.includes("DERBİ")) return { icon: "🔥", role: "DERBİLER" };
    if (upper.includes("TURNUVA")) return { icon: "🏟️", role: "TURNUVALAR" };
    return { icon: "⚽", role: "FUTBOL" };
}

// --- MAĞAZA ÜRÜNLERİ ---
const SHOP_ITEMS = {
    themes: [
        { id: 'theme_red', icon: '🔴', title: 'Kırmızı Tema', desc: 'Kırmızı renk teması', price: 500 },
        { id: 'theme_green', icon: '🟢', title: 'Yeşil Tema', desc: 'Yeşil renk teması', price: 500 },
        { id: 'theme_purple', icon: '🟣', title: 'Mor Tema', desc: 'Mor renk teması', price: 750 },
        { id: 'theme_gold', icon: '🟡', title: 'Altın Tema', desc: 'Altın renk teması (VIP)', price: 1500 }
    ],
    jokers: [
        { id: 'joker_cut_1', icon: '✂️', title: '1x Yarı Yarıya', desc: 'Anında 1 joker al', price: 30 },
        { id: 'joker_answer_1', icon: '🎯', title: '1x Doğru Cevap', desc: 'Anında 1 joker al', price: 70 },
        { id: 'joker_heart_1', icon: '❤️', title: '1x Çift Cevap', desc: 'Anında 1 joker al', price: 50 }
    ],
    avatars: [
        { id: 'avatar_football', icon: '⚽', title: 'Futbol Topu', desc: 'Profil avatarı', price: 200 },
        { id: 'avatar_trophy', icon: '🏆', title: 'Kupa', desc: 'Profil avatarı', price: 300 },
        { id: 'avatar_crown', icon: '👑', title: 'Taç', desc: 'Profil avatarı (VIP)', price: 500 },
        { id: 'avatar_lion', icon: '🦁', title: 'Aslan', desc: 'Profil avatarı', price: 400 },
        { id: 'avatar_eagle', icon: '🦅', title: 'Kartal', desc: 'Profil avatarı', price: 400 }
    ]
};

// --- GÜNÜN SORULARI ---
const DAILY_QUESTIONS = [
    { soru: "Dünya Kupası'nı en çok kazanan ülke hangisidir?", secenekler: ["Almanya", "İtalya", "Brezilya", "Arjantin"], dogru: 2, aciklama: "Brezilya, 5 kez Dünya Kupası kazanmıştır (1958, 1962, 1970, 1994, 2002)." },
    { soru: "Şampiyonlar Ligi'ni en çok kazanan kulüp hangisidir?", secenekler: ["Milan", "Bayern", "Real Madrid", "Liverpool"], dogru: 2, aciklama: "Real Madrid, 14 kez Şampiyonlar Ligi şampiyonu olmuştur." },
    { soru: "Süper Lig'de en çok şampiyon olan takım hangisidir?", secenekler: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"], dogru: 2, aciklama: "Galatasaray, 23 kez Süper Lig şampiyonu olmuştur." },
    { soru: "Ballon d'Or'u en çok kazanan futbolcu kimdir?", secenekler: ["Cristiano Ronaldo", "Lionel Messi", "Michel Platini", "Johan Cruyff"], dogru: 1, aciklama: "Lionel Messi, 8 kez Ballon d'Or kazanmıştır." },
    { soru: "İlk FIFA Dünya Kupası hangi yıl düzenlenmiştir?", secenekler: ["1928", "1930", "1934", "1938"], dogru: 1, aciklama: "İlk Dünya Kupası 1930'da Uruguay'da düzenlenmiştir." },
    { soru: "Premier Lig'i yenilgisiz şampiyon tamamlayan tek takım hangisidir?", secenekler: ["Manchester United", "Chelsea", "Arsenal", "Manchester City"], dogru: 2, aciklama: "Arsenal, 2003-2004 sezonunda yenilgisiz şampiyon olmuştur." },
    { soru: "Türkiye'ye Dünya Kupası'nda üçüncülük kazandıran teknik direktör kimdir?", secenekler: ["Fatih Terim", "Mustafa Denizli", "Şenol Güneş", "Sepp Piontek"], dogru: 2, aciklama: "Şenol Güneş yönetiminde 2002 Dünya Kupası'nda üçüncü olduk." },
    { soru: "La Liga'da en çok gol atan futbolcu kimdir?", secenekler: ["Cristiano Ronaldo", "Telmo Zarra", "Lionel Messi", "Karim Benzema"], dogru: 2, aciklama: "Lionel Messi, La Liga'da 474 gol atmıştır." },
    { soru: "Serie A'da en çok şampiyonluk kazanan kulüp hangisidir?", secenekler: ["Milan", "Inter", "Juventus", "Roma"], dogru: 2, aciklama: "Juventus, 36 kez Serie A şampiyonu olmuştur." },
    { soru: "UEFA Avrupa Ligi'ni en çok kazanan kulüp hangisidir?", secenekler: ["Inter", "Juventus", "Liverpool", "Sevilla"], dogru: 3, aciklama: "Sevilla, 7 kez UEFA Avrupa Ligi şampiyonu olmuştur." }
];

// --- DEĞİŞKENLER ---
document.addEventListener("DOMContentLoaded", function() {
    let percent = 0;
    const percentDisplay = document.getElementById('splash-percent');
    const loaderContainer = document.getElementById('loader-container');
    const startBtn = document.getElementById('start-music-btn');
    const interval = setInterval(() => {
        percent += Math.floor(Math.random() * 5) + 1;
        if (percent >= 100) {
            percent = 100; clearInterval(interval);
            if(percentDisplay) percentDisplay.innerText = percent + '%';
            setTimeout(() => {
                if (loaderContainer) {
                    loaderContainer.style.opacity = '0';
                    setTimeout(() => {
                        loaderContainer.style.display = 'none';
                        if (startBtn) {
                            startBtn.style.display = 'block';
                            setTimeout(() => { startBtn.classList.add('show'); }, 50);
                        }
                    }, 500);
                }
            }, 500);
        }
        if(percentDisplay) percentDisplay.innerText = percent + '%';
    }, 100);
    drawWheel();
    loadProfileName();
    applyTheme();
});

let levelsData = [];
let championsData = [];
let efsanelerData = [];

async function loadAllQuestions() {
    const files = ['sorular_1.json', 'sorular_2.json', 'sorular_3.json', 'sorular_4.json'];
    try {
        for (const file of files) {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`${file} yüklenemedi`);
            const data = await response.json();
            let kategoriler = data.kategoriler || (Array.isArray(data) ? data : []);
            levelsData = levelsData.concat(kategoriler);
        }
    } catch (error) { console.error("Hata:", error); }

    try {
        const response = await fetch('sorular_5.json');
        if (response.ok) {
            const data = await response.json();
            championsData = data.seviyeler || [];
        }
    } catch (error) { console.log("Şampiyonlar Ligi yüklenemedi:", error); }

    try {
        const response = await fetch('sorular_6.json');
        if (response.ok) {
            const data = await response.json();
            efsanelerData = data.kategoriler || [];
        }
    } catch (error) { console.log("Efsaneler Ligi yüklenemedi:", error); }
}
loadAllQuestions();

let currentLevelIndex = 0, currentQuestionIndex = 0, score = 0, correctCount = 0, wrongCount = 0, answered = false, timerInterval;
let selectedLockedLevel = -1;
let usedJokers = { "cut": false, "answer": false, "heart": false };
let hasDoubleChance = false;
const JOKER_PRICES = { "cut": 30, "answer": 70, "heart": 50 };
let isChampionLevel = false;
let isPaused = false;
let currentCombo = 0;
let bestComboInLevel = 0;
let timerSecondsLeft = 15;

let userProgress = JSON.parse(localStorage.getItem('futbol_quiz_progress')) || {
    levels: {}, totalStars: 0, totalCoins: 100,
    profileName: "Oyuncu", totalScore: 0, totalCorrect: 0, totalWrong: 0, highScore: 0, perfectLevels: 0,
    lastDailyClaim: 0, dailyStreak: 0, totalSpins: 0, totalJokersUsed: 0, unlockedAchievements: [],
    musicEnabled: true, soundEnabled: true, vibrationEnabled: true, lastShareDate: "", totalShares: 0,
    theme: "dark", leaderboard: [], quests: {}, questDate: "",
    lastPlayedLevel: -1, lastPlayedQuestion: -1, lastPlayedChampion: false, lastPlayedScore: 0, lastPlayedCorrect: 0, lastPlayedWrong: 0,
    bestCombo: 0, totalCombos: 0, ownedThemes: ['default'], ownedAvatars: ['👤'], currentAvatar: '👤',
    currentTheme: 'default', lastDailyQuestionDate: '', dailyQuestionCorrect: 0, noJokerLevels: 0,
    categoryStats: {}
};
if (!userProgress.levels[0]) userProgress.levels[0] = { stars: 0, score: 0, unlocked: true };
if (userProgress.lastSpinTime === undefined) userProgress.lastSpinTime = 0;
if (userProgress.freeSpins === undefined) userProgress.freeSpins = 1;
if (userProgress.profileName === undefined) userProgress.profileName = "Oyuncu";
if (userProgress.totalScore === undefined) userProgress.totalScore = 0;
if (userProgress.totalCorrect === undefined) userProgress.totalCorrect = 0;
if (userProgress.totalWrong === undefined) userProgress.totalWrong = 0;
if (userProgress.highScore === undefined) userProgress.highScore = 0;
if (userProgress.perfectLevels === undefined) userProgress.perfectLevels = 0;
if (userProgress.lastDailyClaim === undefined) userProgress.lastDailyClaim = 0;
if (userProgress.dailyStreak === undefined) userProgress.dailyStreak = 0;
if (userProgress.totalSpins === undefined) userProgress.totalSpins = 0;
if (userProgress.totalJokersUsed === undefined) userProgress.totalJokersUsed = 0;
if (userProgress.unlockedAchievements === undefined) userProgress.unlockedAchievements = [];
if (userProgress.musicEnabled === undefined) userProgress.musicEnabled = true;
if (userProgress.soundEnabled === undefined) userProgress.soundEnabled = true;
if (userProgress.vibrationEnabled === undefined) userProgress.vibrationEnabled = true;
if (userProgress.lastShareDate === undefined) userProgress.lastShareDate = "";
if (userProgress.totalShares === undefined) userProgress.totalShares = 0;
if (userProgress.theme === undefined) userProgress.theme = "dark";
if (userProgress.leaderboard === undefined) userProgress.leaderboard = [];
if (userProgress.quests === undefined) userProgress.quests = {};
if (userProgress.questDate === undefined) userProgress.questDate = "";
if (userProgress.lastPlayedLevel === undefined) userProgress.lastPlayedLevel = -1;
if (userProgress.lastPlayedQuestion === undefined) userProgress.lastPlayedQuestion = -1;
if (userProgress.lastPlayedChampion === undefined) userProgress.lastPlayedChampion = false;
if (userProgress.lastPlayedScore === undefined) userProgress.lastPlayedScore = 0;
if (userProgress.lastPlayedCorrect === undefined) userProgress.lastPlayedCorrect = 0;
if (userProgress.lastPlayedWrong === undefined) userProgress.lastPlayedWrong = 0;
if (userProgress.bestCombo === undefined) userProgress.bestCombo = 0;
if (userProgress.totalCombos === undefined) userProgress.totalCombos = 0;
if (userProgress.ownedThemes === undefined) userProgress.ownedThemes = ['default'];
if (userProgress.ownedAvatars === undefined) userProgress.ownedAvatars = ['👤'];
if (userProgress.currentAvatar === undefined) userProgress.currentAvatar = '👤';
if (userProgress.currentTheme === undefined) userProgress.currentTheme = 'default';
if (userProgress.lastDailyQuestionDate === undefined) userProgress.lastDailyQuestionDate = '';
if (userProgress.dailyQuestionCorrect === undefined) userProgress.dailyQuestionCorrect = 0;
if (userProgress.noJokerLevels === undefined) userProgress.noJokerLevels = 0;
if (userProgress.categoryStats === undefined) userProgress.categoryStats = {};

const levelCoinCosts = { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250, 6: 300, 7: 350, 8: 400, 9: 450, 10: 500 };
for (let i = 11; i <= 40; i++) { levelCoinCosts[i-1] = 500 + (i - 10) * 50; }

// --- EKRAN YÖNETİMİ ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    updateTopPanel();
}
function showMenuScreen() {
    showScreen('menu-screen');
    updateTopPanel();
    checkAchievements();
    checkDailyReminder();
    updateResumeButton();
    if (checkDailyReward()) {
        setTimeout(() => { showToast("🎁 Günlük ödülünü almayı unutma!"); }, 1500);
    }
}
function showSettingsScreen() {
    showScreen('settings-screen');
    document.getElementById('toggle-music').checked = userProgress.musicEnabled;
    document.getElementById('toggle-sound').checked = userProgress.soundEnabled;
    document.getElementById('toggle-vibration').checked = userProgress.vibrationEnabled;
    document.getElementById('theme-toggle-btn').innerText = userProgress.theme === 'dark' ? '🌙 KOYU' : '☀️ AÇIK';
}
function showHowToScreen() { showScreen('howto-screen'); }
function showLeaderboardScreen() { showScreen('leaderboard-screen'); renderLeaderboard(); }
function showAchievementsScreen() { showScreen('achievements-screen'); renderAchievements(); }
function showQuestsScreen() { showScreen('quests-screen'); initDailyQuests(); renderQuests(); }
function showDailyScreen() { showScreen('daily-screen'); renderDailyGrid(); }
function showDailyQuestionScreen() { 
    showScreen('daily-question-screen'); 
    renderDailyQuestion(); 
}
function showShopScreen() { showScreen('shop-screen'); showShopTab('themes'); }

function updateTopPanel() {
    document.getElementById('total-stars-display').innerText = userProgress.totalStars || 0;
    document.getElementById('total-coins-display').innerText = userProgress.totalCoins || 0;
    document.getElementById('menu-profile-name').innerText = userProgress.profileName || "Oyuncu";
}

function showToast(message) {
    const toast = document.getElementById('toast-notification');
    toast.innerText = message;
    toast.style.display = 'block';
    toast.style.opacity = '0';
    toast.style.top = '-100px';
    setTimeout(() => { toast.style.opacity = '1'; toast.style.top = '80px'; }, 50);
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.top = '-100px';
        setTimeout(() => { toast.style.display = 'none'; }, 400);
    }, 2500);
}

function vibrate(duration) {
    if (!userProgress.vibrationEnabled) return;
    if (window.Android && window.Android.vibrate) {
        try { window.Android.vibrate(duration); return; } catch(e) {}
    }
    if (navigator.vibrate) { navigator.vibrate(duration); }
}

// --- DEVAM ET ---
function updateResumeButton() {
    let resumeBtn = document.getElementById('resume-btn');
    if (userProgress.lastPlayedLevel >= 0 && userProgress.lastPlayedQuestion >= 0) {
        resumeBtn.style.display = 'flex';
    } else { resumeBtn.style.display = 'none'; }
}
function saveProgress(levelIndex, questionIndex) {
    userProgress.lastPlayedLevel = levelIndex;
    userProgress.lastPlayedQuestion = questionIndex;
    userProgress.lastPlayedChampion = isChampionLevel;
    userProgress.lastPlayedScore = score;
    userProgress.lastPlayedCorrect = correctCount;
    userProgress.lastPlayedWrong = wrongCount;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
}
function resumeGame() {
    if (userProgress.lastPlayedLevel < 0 || userProgress.lastPlayedQuestion < 0) return;
    isChampionLevel = userProgress.lastPlayedChampion;
    currentLevelIndex = userProgress.lastPlayedLevel;
    currentQuestionIndex = userProgress.lastPlayedQuestion;
    score = userProgress.lastPlayedScore || 0;
    correctCount = userProgress.lastPlayedCorrect || 0;
    wrongCount = userProgress.lastPlayedWrong || 0;
    usedJokers = { "cut": false, "answer": false, "heart": false };
    hasDoubleChance = false;
    currentCombo = 0; bestComboInLevel = 0;
    showScreen('quiz-screen');
    if (isChampionLevel) { loadChampionQuestion(); }
    else if (currentLevelIndex >= 100 && currentLevelIndex < 200) { loadEfsaneQuestion(); }
    else { loadQuestion(); }
}
function clearSavedProgress() {
    userProgress.lastPlayedLevel = -1;
    userProgress.lastPlayedQuestion = -1;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
}

// --- TEMA ---
function applyTheme() {
    if (userProgress.theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else { document.documentElement.removeAttribute('data-theme'); }
    // Özel tema renkleri
    if (userProgress.currentTheme === 'theme_red') {
        document.documentElement.style.setProperty('--accent-gold', '#ef4444');
    } else if (userProgress.currentTheme === 'theme_green') {
        document.documentElement.style.setProperty('--accent-gold', '#22c55e');
    } else if (userProgress.currentTheme === 'theme_purple') {
        document.documentElement.style.setProperty('--accent-gold', '#a855f7');
    } else if (userProgress.currentTheme === 'theme_gold') {
        document.documentElement.style.setProperty('--accent-gold', '#fbbf24');
    } else {
        document.documentElement.style.setProperty('--accent-gold', '#fbbf24');
    }
}
function toggleTheme() {
    userProgress.theme = userProgress.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    applyTheme();
    document.getElementById('theme-toggle-btn').innerText = userProgress.theme === 'dark' ? '🌙 KOYU' : '☀️ AÇIK';
    showToast(userProgress.theme === 'dark' ? "🌙 Koyu tema aktif" : "☀️ Açık tema aktif");
}

// --- GÜNLÜK HATIRLATICI ---
function checkDailyReminder() {
    let banner = document.getElementById('daily-reminder-banner');
    if (checkDailyReward()) { banner.style.display = 'block'; }
    else { banner.style.display = 'none'; }
}

// --- COMBO SİSTEMİ ---
function updateComboBar() {
    const comboBar = document.getElementById('combo-bar');
    const comboText = document.getElementById('combo-text');
    if (currentCombo >= 2) {
        comboBar.style.display = 'block';
        comboText.innerText = `🔥 ${currentCombo}x COMBO`;
        comboBar.style.animation = 'none';
        setTimeout(() => { comboBar.style.animation = 'pulse 1s infinite'; }, 10);
    } else {
        comboBar.style.display = 'none';
    }
}
function showComboAnimation() {
    const comboDisplay = document.getElementById('combo-display');
    comboDisplay.innerText = `🔥 ${currentCombo}x`;
    comboDisplay.classList.remove('show');
    void comboDisplay.offsetWidth;
    comboDisplay.classList.add('show');
    if (sesCombo) {
        try { sesCombo.currentTime = 0; sesCombo.play(); } catch(e) {}
    }
    setTimeout(() => { comboDisplay.classList.remove('show'); }, 1500);
}
function resetCombo() {
    if (currentCombo > userProgress.bestCombo) {
        userProgress.bestCombo = currentCombo;
    }
    if (currentCombo >= 5) {
        userProgress.totalCombos = (userProgress.totalCombos || 0) + 1;
        updateQuestProgress('combo', 1);
    }
    currentCombo = 0;
    updateComboBar();
}

// --- AÇIKLAMA ---
function showExplanation(text) {
    const box = document.getElementById('explanation-box');
    const txt = document.getElementById('explanation-text');
    if (text && text.trim() !== '') {
        txt.innerText = text;
        box.style.display = 'block';
    } else {
        box.style.display = 'none';
    }
}
function hideExplanation() {
    document.getElementById('explanation-box').style.display = 'none';
}

// --- LİDERLİK TABLOSU ---
function addToLeaderboard(levelName, scoreValue) {
    if (!userProgress.leaderboard) userProgress.leaderboard = [];
    userProgress.leaderboard.push({ level: levelName, score: scoreValue, date: new Date().toLocaleDateString('tr-TR') });
    userProgress.leaderboard.sort((a, b) => b.score - a.score);
    userProgress.leaderboard = userProgress.leaderboard.slice(0, 20);
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
}
function renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    if (!userProgress.leaderboard || userProgress.leaderboard.length === 0) {
        list.innerHTML = `<div class="ach-card"><div class="ach-info"><div class="ach-title">Henüz skor yok!</div><div class="ach-desc">Oyna ve liderlik tablosuna gir.</div></div></div>`;
        return;
    }
    userProgress.leaderboard.forEach((entry, index) => {
        let medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
        let card = document.createElement('div');
        card.className = 'ach-card' + (index === 0 ? ' done' : '');
        card.innerHTML = `<div class="ach-icon">${medal}</div><div class="ach-info"><div class="ach-title">${entry.level}</div><div class="ach-desc">${entry.date}</div></div><div class="ach-reward">${entry.score} Puan</div>`;
        list.appendChild(card);
    });
}

// --- GÜNLÜK GÖREVLER ---
function getTodayString() { return new Date().toDateString(); }
function initDailyQuests() {
    let today = getTodayString();
    if (userProgress.questDate !== today) {
        userProgress.quests = {};
        DAILY_QUESTS.forEach(q => { userProgress.quests[q.id] = { progress: 0, claimed: false }; });
        userProgress.questDate = today;
        localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    }
}
function updateQuestProgress(type, amount) {
    initDailyQuests();
    DAILY_QUESTS.forEach(q => {
        if (q.type === type) {
            if (userProgress.quests[q.id] && !userProgress.quests[q.id].claimed) {
                userProgress.quests[q.id].progress = (userProgress.quests[q.id].progress || 0) + amount;
                if (userProgress.quests[q.id].progress > q.target) userProgress.quests[q.id].progress = q.target;
            }
        }
    });
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
}
function renderQuests() {
    const list = document.getElementById('quests-list');
    list.innerHTML = '';
    DAILY_QUESTS.forEach(q => {
        let questData = userProgress.quests[q.id] || { progress: 0, claimed: false };
        let isCompleted = questData.progress >= q.target;
        let isClaimed = questData.claimed;
        let card = document.createElement('div');
        card.className = 'ach-card' + (isCompleted ? ' done' : '');
        card.innerHTML = `<div class="ach-icon">${q.icon}</div><div class="ach-info"><div class="ach-title">${q.title}</div><div class="ach-desc">${q.desc} (${questData.progress}/${q.target})</div><div class="ach-reward">Ödül: ${q.reward}</div></div><div class="ach-status">${isClaimed ? '✅' : (isCompleted ? '🎁' : '⏳')}</div>`;
        if (isCompleted && !isClaimed) {
            card.style.cursor = 'pointer';
            card.onclick = () => claimQuestReward(q.id);
        }
        list.appendChild(card);
    });
}
function claimQuestReward(questId) {
    let quest = DAILY_QUESTS.find(q => q.id === questId);
    if (!quest) return;
    let questData = userProgress.quests[questId];
    if (!questData || questData.claimed || questData.progress < quest.target) return;
    questData.claimed = true;
    userProgress.totalCoins += quest.coin;
    if (quest.star > 0) userProgress.totalStars += quest.star;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    sesDogru.play(); vibrate(50);
    showToast(`✅ ${quest.title} ödülü alındı: ${quest.reward}`);
    updateTopPanel(); renderQuests(); checkAchievements();
}

// --- OYUN BAŞLAT ---
function startGameWithMusic() {
    if (userProgress.musicEnabled) {
        muzikArkaplan.play().then(() => { muzikCaliniyor = true; }).catch(err => console.log("Müzik hatası:", err));
    }
    const splash = document.getElementById('splash-screen');
    splash.style.opacity = '0';
    setTimeout(() => { splash.style.display = 'none'; showMenuScreen(); }, 500);
}
function toggleMusic() {
    userProgress.musicEnabled = !userProgress.musicEnabled;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    if (userProgress.musicEnabled) {
        muzikArkaplan.play().then(() => { muzikCaliniyor = true; }).catch(err => console.log(err));
    } else { muzikArkaplan.pause(); muzikCaliniyor = false; }
    document.getElementById('toggle-music').checked = userProgress.musicEnabled;
    document.getElementById('pause-toggle-music').checked = userProgress.musicEnabled;
}
function toggleSound() {
    userProgress.soundEnabled = !userProgress.soundEnabled;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    if (!userProgress.soundEnabled) {
        sesDogru.volume = 0; sesYanlis.volume = 0; sesTiklama.volume = 0; sesCark.volume = 0; sesCombo.volume = 0;
    } else {
        sesDogru.volume = 0.7; sesYanlis.volume = 0.7; sesTiklama.volume = 0.5; sesCark.volume = 0.6; sesCombo.volume = 0.8;
    }
    document.getElementById('toggle-sound').checked = userProgress.soundEnabled;
    document.getElementById('pause-toggle-sound').checked = userProgress.soundEnabled;
}
function toggleVibration() {
    userProgress.vibrationEnabled = !userProgress.vibrationEnabled;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    document.getElementById('toggle-vibration').checked = userProgress.vibrationEnabled;
    document.getElementById('pause-toggle-vibration').checked = userProgress.vibrationEnabled;
}

// --- BAŞARIMLAR ---
function checkAchievements() {
    let newUnlocks = [];
    ACHIEVEMENTS.forEach(ach => {
        if (!userProgress.unlockedAchievements.includes(ach.id)) {
            if (ach.check(userProgress)) {
                userProgress.unlockedAchievements.push(ach.id);
                userProgress.totalCoins += ach.coin;
                if (ach.star > 0) userProgress.totalStars += ach.star;
                newUnlocks.push(ach);
            }
        }
    });
    if (newUnlocks.length > 0) {
        localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
        updateTopPanel();
        newUnlocks.forEach((ach, index) => {
            setTimeout(() => { sesDogru.play(); vibrate(50); showToast(`🏆 Başarım: ${ach.title} (+${ach.coin}🪙)`); }, index * 1200);
        });
    }
}
function renderAchievements() {
    const list = document.getElementById('ach-list');
    list.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
        let done = userProgress.unlockedAchievements.includes(ach.id);
        let card = document.createElement('div');
        card.className = 'ach-card' + (done ? ' done' : '');
        card.innerHTML = `<div class="ach-icon">${ach.icon}</div><div class="ach-info"><div class="ach-title">${ach.title}</div><div class="ach-desc">${ach.desc}</div><div class="ach-reward">Ödül: ${ach.reward}</div></div><div class="ach-status">${done ? '✅' : '🔒'}</div>`;
        list.appendChild(card);
    });
}

// ==========================================
// SAHA BİLGİNİ - SCRIPT.JS (2. PARÇA)
// ==========================================

// --- PAYLAŞIM ---
function shareGameForStars() {
    let today = new Date().toDateString();
    if (userProgress.lastShareDate === today) {
        showToast("⏳ Bugünkü paylaşım ödülünü zaten aldın!");
        return;
    }
    let shareText = `⚽ Saha Bilgini'ni oyna ve futbol bilgini test et! 🏆 Şu an ${userProgress.totalStars} yıldızım var. Sen de beni geçebilir misin? 👉 https://emrahmeltem90-ux.github.io/saha-bilgini/`;
    let shareUrl = 'https://emrahmeltem90-ux.github.io/saha-bilgini/';
    if (navigator.share) {
        navigator.share({ title: 'Saha Bilgini', text: shareText, url: shareUrl })
        .then(() => { giveShareReward(today); })
        .catch((err) => { console.log("Paylaşım iptal:", err); giveShareReward(today); });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast("📋 Bağlantı kopyalandı! Arkadaşlarına gönderebilirsin.");
            giveShareReward(today);
        }).catch(() => { showToast("❌ Bu cihazda paylaşım desteklenmiyor."); });
    }
}
function giveShareReward(today) {
    userProgress.totalStars += 10;
    userProgress.lastShareDate = today;
    userProgress.totalShares = (userProgress.totalShares || 0) + 1;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel(); sesDogru.play(); vibrate(50);
    showToast("⭐ Tebrikler! 10 yıldız kazandın!");
    checkAchievements();
}
function shareScore() {
    let levelName = isChampionLevel ? championsData[currentLevelIndex].kategori : (levelsData[currentLevelIndex].kategori || `Level ${currentLevelIndex + 1}`);
    let totalQ = isChampionLevel ? championsData[currentLevelIndex].sorular.length : levelsData[currentLevelIndex].sorular.length;
    let shareText = `⚽ Saha Bilgini'nde "${levelName}" bölümünü ${score} puan ve ${correctCount}/${totalQ} doğruyla bitirdim! 🏆 Sen de beni geçebilir misin? 👉 https://emrahmeltem90-ux.github.io/saha-bilgini/`;
    if (navigator.share) {
        navigator.share({ title: 'Saha Bilgini', text: shareText, url: 'https://emrahmeltem90-ux.github.io/saha-bilgini/' })
        .catch((err) => { console.log("Paylaşım iptal:", err); });
    } else {
        let text = encodeURIComponent(shareText);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }
    userProgress.totalShares = (userProgress.totalShares || 0) + 1;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    checkAchievements();
}
function shareProfile() {
    let rank = calculateRank();
    let shareText = `⚽ Saha Bilgini'nde ${userProgress.profileName} adlı oyuncunun profili! 🏆 Rütbe: ${rank.name} | Toplam Puan: ${userProgress.totalScore} | Doğruluk: ${rank.percentage}% Sen de katıl! 👉 https://emrahmeltem90-ux.github.io/saha-bilgini/`;
    if (navigator.share) {
        navigator.share({ title: 'Saha Bilgini', text: shareText, url: 'https://emrahmeltem90-ux.github.io/saha-bilgini/' })
        .catch((err) => { console.log("Paylaşım iptal:", err); });
    } else {
        let text = encodeURIComponent(shareText);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }
    userProgress.totalShares = (userProgress.totalShares || 0) + 1;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    checkAchievements();
}

// --- GÜNLÜK ÖDÜL ---
function checkDailyReward() {
    let now = Date.now();
    let lastClaim = userProgress.lastDailyClaim || 0;
    if (now - lastClaim >= ONE_DAY_MS || lastClaim === 0) return true;
    return false;
}
function getDailyStreak() {
    let now = Date.now();
    let lastClaim = userProgress.lastDailyClaim || 0;
    if (now - lastClaim > 2 * ONE_DAY_MS) { userProgress.dailyStreak = 0; localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress)); }
    return userProgress.dailyStreak || 0;
}
function renderDailyGrid() {
    const grid = document.getElementById('daily-grid');
    grid.innerHTML = '';
    let currentStreak = getDailyStreak();
    let canClaim = checkDailyReward();
    for (let i = 0; i < DAILY_REWARDS.length; i++) {
        let reward = DAILY_REWARDS[i];
        let card = document.createElement('div');
        card.className = 'daily-card';
        if (i < currentStreak) card.classList.add('claimed');
        else if (i === currentStreak && canClaim) card.classList.add('today');
        let rewardText = `${reward.coin} 🪙`;
        if (reward.star > 0) rewardText += ` + ${reward.star} ⭐`;
        card.innerHTML = `<div class="daily-day">${reward.day}. Gün</div><div class="daily-reward">${rewardText}</div>`;
        grid.appendChild(card);
    }
    let btn = document.getElementById('daily-claim-btn');
    let status = document.getElementById('daily-status');
    if (canClaim) {
        btn.disabled = false; btn.innerText = 'ÖDÜLÜ AL 🎁';
        status.innerText = `Bugünkü ödülünü alabilirsin! (Seri: ${currentStreak + 1}/7)`;
    } else {
        btn.disabled = true;
        let remaining = ONE_DAY_MS - (Date.now() - (userProgress.lastDailyClaim || 0));
        let hours = Math.floor(remaining / (1000 * 60 * 60));
        let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        btn.innerText = 'YARIN TEKRAR GEL';
        status.innerText = `Sonraki ödül: ${hours} saat ${minutes} dakika sonra`;
    }
}
function claimDailyReward() {
    if (!checkDailyReward()) return;
    let currentStreak = getDailyStreak();
    if (currentStreak >= 7) currentStreak = 0;
    let reward = DAILY_REWARDS[currentStreak];
    userProgress.totalCoins += reward.coin;
    if (reward.star > 0) userProgress.totalStars += reward.star;
    userProgress.dailyStreak = currentStreak + 1;
    userProgress.lastDailyClaim = Date.now();
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    sesDogru.play(); vibrate(50);
    let msg = `🎁 ${reward.coin} Coin`;
    if (reward.star > 0) msg += ` + ${reward.star} Yıldız`;
    msg += " kazandın!";
    showToast(msg); updateTopPanel(); renderDailyGrid(); checkAchievements();
}

// --- GÜNÜN SORUSU ---
function getTodayIndex() {
    let today = new Date();
    let dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / ONE_DAY_MS);
    return dayOfYear % DAILY_QUESTIONS.length;
}
function getTodayString2() { return new Date().toDateString(); }
function renderDailyQuestion() {
    let today = getTodayString2();
    let qIndex = getTodayIndex();
    let q = DAILY_QUESTIONS[qIndex];
    let qText = document.getElementById('daily-q-text');
    let qOptions = document.getElementById('daily-q-options');
    let qStatus = document.getElementById('daily-q-status');
    
    if (userProgress.lastDailyQuestionDate === today) {
        qText.innerText = "✅ Bugünkü soruyu zaten cevapladın!";
        qOptions.innerHTML = '';
        qStatus.innerText = "Yarın yeni soru gelecek! 🌟";
        return;
    }
    
    qText.innerText = q.soru;
    qOptions.innerHTML = '';
    qStatus.innerText = '';
    
    q.secenekler.forEach((opt, idx) => {
        let btn = document.createElement('button');
        btn.className = 'daily-q-option';
        btn.innerText = `${String.fromCharCode(65 + idx)}) ${opt}`;
        btn.onclick = () => answerDailyQuestion(idx, q.dogru, q.aciklama, btn);
        qOptions.appendChild(btn);
    });
}
function answerDailyQuestion(selected, correct, aciklama, btn) {
    let today = getTodayString2();
    let qOptions = document.getElementById('daily-q-options');
    let buttons = qOptions.getElementsByClassName('daily-q-option');
    for (let b of buttons) b.disabled = true;
    
    if (selected === correct) {
        btn.classList.add('correct');
        userProgress.totalCoins += 100;
        userProgress.totalStars += 5;
        userProgress.dailyQuestionCorrect = (userProgress.dailyQuestionCorrect || 0) + 1;
        sesDogru.play(); vibrate(50);
        document.getElementById('daily-q-status').innerText = "🎉 Doğru! +100 🪙 +5 ⭐";
    } else {
        btn.classList.add('incorrect');
        if (buttons[correct]) buttons[correct].classList.add('correct');
        sesYanlis.play(); vibrate(100);
        document.getElementById('daily-q-status').innerText = `❌ Yanlış! Doğru cevap: ${String.fromCharCode(65 + correct)}`;
    }
    userProgress.lastDailyQuestionDate = today;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel();
    checkAchievements();
    setTimeout(() => {
        let qStatus = document.getElementById('daily-q-status');
        qStatus.innerText += `\n\n💡 ${aciklama}`;
    }, 500);
}

// --- MAĞAZA ---
function showShopTab(tab) {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    const content = document.getElementById('shop-content');
    content.innerHTML = '';
    let items = SHOP_ITEMS[tab] || [];
    
    if (tab === 'themes') {
        items.forEach(item => {
            let owned = userProgress.ownedThemes.includes(item.id);
            let active = userProgress.currentTheme === item.id;
            let card = document.createElement('div');
            card.className = 'shop-item' + (owned ? ' owned' : '');
            let btnHtml = owned 
                ? (active ? `<div class="shop-item-price owned-btn">AKTİF ✅</div>` : `<div class="shop-item-price owned-btn" onclick="activateTheme('${item.id}')">KULLAN</div>`)
                : `<div class="shop-item-price" onclick="buyItem('${item.id}', ${item.price}, 'theme')">🪙 ${item.price}</div>`;
            card.innerHTML = `<div class="shop-item-icon">${item.icon}</div><div class="shop-item-info"><div class="shop-item-title">${item.title}</div><div class="shop-item-desc">${item.desc}</div></div>${btnHtml}`;
            content.appendChild(card);
        });
    } else if (tab === 'jokers') {
        items.forEach(item => {
            let card = document.createElement('div');
            card.className = 'shop-item';
            card.innerHTML = `<div class="shop-item-icon">${item.icon}</div><div class="shop-item-info"><div class="shop-item-title">${item.title}</div><div class="shop-item-desc">${item.desc}</div></div><div class="shop-item-price" onclick="buyJoker('${item.id}', ${item.price})">🪙 ${item.price}</div>`;
            content.appendChild(card);
        });
    } else if (tab === 'avatars') {
        items.forEach(item => {
            let owned = userProgress.ownedAvatars.includes(item.icon);
            let active = userProgress.currentAvatar === item.icon;
            let card = document.createElement('div');
            card.className = 'shop-item' + (owned ? ' owned' : '');
            let btnHtml = owned 
                ? (active ? `<div class="shop-item-price owned-btn">AKTİF ✅</div>` : `<div class="shop-item-price owned-btn" onclick="activateAvatar('${item.icon}')">KULLAN</div>`)
                : `<div class="shop-item-price" onclick="buyItem('${item.id}', ${item.price}, 'avatar', '${item.icon}')">🪙 ${item.price}</div>`;
            card.innerHTML = `<div class="shop-item-icon">${item.icon}</div><div class="shop-item-info"><div class="shop-item-title">${item.title}</div><div class="shop-item-desc">${item.desc}</div></div>${btnHtml}`;
            content.appendChild(card);
        });
    }
}
function buyItem(id, price, type, icon) {
    if (userProgress.totalCoins < price) {
        showToast("❌ Yetersiz coin!");
        sesYanlis.play(); vibrate(100);
        return;
    }
    userProgress.totalCoins -= price;
    if (type === 'theme') {
        if (!userProgress.ownedThemes.includes(id)) userProgress.ownedThemes.push(id);
        userProgress.currentTheme = id;
        showToast("🎨 Tema satın alındı!");
    } else if (type === 'avatar') {
        if (!userProgress.ownedAvatars.includes(icon)) userProgress.ownedAvatars.push(icon);
        userProgress.currentAvatar = icon;
        showToast("👤 Avatar satın alındı!");
    }
    sesDogru.play(); vibrate(50);
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    applyTheme();
    updateTopPanel();
    showShopTab(type === 'theme' ? 'themes' : 'avatars');
}
function buyJoker(id, price) {
    if (userProgress.totalCoins < price) {
        showToast("❌ Yetersiz coin!");
        sesYanlis.play(); vibrate(100);
        return;
    }
    userProgress.totalCoins -= price;
    showToast("🃏 Joker satın alındı! (Oyunda kullanılabilir)");
    sesDogru.play(); vibrate(50);
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel();
}
function activateTheme(id) {
    userProgress.currentTheme = id;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    applyTheme();
    showToast("🎨 Tema aktif!");
    showShopTab('themes');
}
function activateAvatar(icon) {
    userProgress.currentAvatar = icon;
    document.getElementById('player-avatar-emoji').innerText = icon;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    showToast("👤 Avatar aktif!");
    showShopTab('avatars');
}

// --- RÜTBE ---
function calculateRank() {
    let total = (userProgress.totalCorrect || 0) + (userProgress.totalWrong || 0);
    if (total === 0) return { name: "🏅 ACEMİ", desc: "Daha yeni başlıyorsun, devam et!", percentage: 0 };
    let percentage = Math.round(((userProgress.totalCorrect || 0) / total) * 100);
    if (percentage >= 90) return { name: "👑 EFSANE", desc: "Sen bir futbol dehasısın!", percentage: percentage };
    if (percentage >= 75) return { name: "🌟 PROFESYONEL", desc: "Harika gidiyorsun!", percentage: percentage };
    if (percentage >= 50) return { name: "⚽ USTA", desc: "İyi gidiyorsun, devam!", percentage: percentage };
    return { name: "🏅 ACEMİ", desc: "Daha yeni başlıyorsun, devam et!", percentage: percentage };
}
function drawStatsCircle(percentage) {
    const canvas = document.getElementById('stats-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    const lineWidth = 15;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = lineWidth; ctx.stroke();
    let endAngle = -Math.PI / 2 + (2 * Math.PI) * (percentage / 100);
    ctx.beginPath(); ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
    ctx.strokeStyle = percentage >= 75 ? '#fbbf24' : (percentage >= 50 ? '#22c55e' : '#3b82f6');
    ctx.lineWidth = lineWidth; ctx.lineCap = 'round'; ctx.stroke();
    document.getElementById('stats-percentage').innerText = percentage + '%';
}
function showProfileScreen() {
    showScreen('profile-screen');
    document.getElementById('profile-name-input').value = userProgress.profileName || "Oyuncu";
    document.getElementById('player-welcome').innerText = `Hoş geldin, ${userProgress.profileName || "Oyuncu"}!`;
    document.getElementById('player-avatar-emoji').innerText = userProgress.currentAvatar || '👤';
    document.getElementById('stat-total-score').innerText = userProgress.totalScore || 0;
    document.getElementById('stat-total-correct').innerText = userProgress.totalCorrect || 0;
    document.getElementById('stat-total-wrong').innerText = userProgress.totalWrong || 0;
    document.getElementById('stat-high-score').innerText = userProgress.highScore || 0;
    document.getElementById('stat-levels-completed').innerText = Object.keys(userProgress.levels).length || 0;
    document.getElementById('stat-perfect-levels').innerText = userProgress.perfectLevels || 0;
    let rank = calculateRank();
    document.getElementById('player-rank').innerText = rank.name;
    document.getElementById('player-rank-desc').innerText = rank.desc;
    drawStatsCircle(rank.percentage);
}
function saveProfileName() {
    let newName = document.getElementById('profile-name-input').value.trim();
    if (newName === "") newName = "Oyuncu";
    userProgress.profileName = newName;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    sesDogru.play(); vibrate(50);
    showToast("✅ İsim kaydedildi: " + newName);
    updateTopPanel();
    document.getElementById('player-welcome').innerText = `Hoş geldin, ${newName}!`;
}
function loadProfileName() {
    document.getElementById('menu-profile-name').innerText = userProgress.profileName || "Oyuncu";
}

// --- ÇARKIFELEK ---
function showSpinScreen() {
    showScreen('spin-screen');
    document.getElementById('spin-coins-display').innerText = userProgress.totalCoins || 0;
    updateSpinTimer(); drawWheel();
}
function drawWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const sliceAngle = (2 * Math.PI) / WHEEL_PRIZES.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < WHEEL_PRIZES.length; i++) {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        ctx.beginPath(); ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath(); ctx.fillStyle = WHEEL_PRIZES[i].color; ctx.fill();
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "right"; ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif";
        ctx.fillText(WHEEL_PRIZES[i].label, radius - 15, 5);
        ctx.restore();
    }
}
function updateSpinTimer() {
    let now = Date.now();
    let lastSpin = userProgress.lastSpinTime || 0;
    let cooldown = 4 * 60 * 60 * 1000;
    let timePassed = now - lastSpin;
    let timerText = document.getElementById('spin-timer-text');
    let spinBtn = document.getElementById('spin-btn');
    if (userProgress.freeSpins > 0) {
        timerText.innerText = `Ücretsiz Çevirme: ${userProgress.freeSpins} hak`;
        spinBtn.disabled = false;
    } else if (timePassed >= cooldown) {
        userProgress.freeSpins = 1;
        localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
        timerText.innerText = "Ücretsiz Çevirme: Hazır!";
        spinBtn.disabled = false;
    } else {
        let remaining = cooldown - timePassed;
        let hours = Math.floor(remaining / (1000 * 60 * 60));
        let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        timerText.innerText = `Yeni Hak: ${hours}s ${minutes}d ${seconds}sn`;
        spinBtn.disabled = true;
    }
}
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;
    if (userProgress.freeSpins > 0) { userProgress.freeSpins--; }
    else {
        if (userProgress.totalCoins >= 50) { userProgress.totalCoins -= 50; updateTopPanel(); }
        else { showToast("❌ Yetersiz coin!"); isSpinning = false; spinBtn.disabled = false; return; }
    }
    sesCark.currentTime = 0; sesCark.play(); vibrate(30);
    const randomIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const sliceAngle = 360 / WHEEL_PRIZES.length;
    const targetAngle = 360 * 5 + (360 - (randomIndex * sliceAngle + sliceAngle / 2));
    const canvas = document.getElementById('wheel-canvas');
    let startTime = null;
    const duration = 4000;
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / duration;
        if (progress > 1) progress = 1;
        let easeOut = 1 - Math.pow(1 - progress, 3);
        let rotation = easeOut * targetAngle;
        canvas.style.transform = `rotate(${rotation}deg)`;
        if (progress < 1) { requestAnimationFrame(animate); }
        else {
            isSpinning = false;
            userProgress.totalSpins = (userProgress.totalSpins || 0) + 1;
            givePrize(WHEEL_PRIZES[randomIndex]);
            userProgress.lastSpinTime = Date.now();
            updateQuestProgress('spins', 1);
            localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
            updateSpinTimer();
        }
    }
    requestAnimationFrame(animate);
}
function givePrize(prize) {
    let icon = "🎁", title = "TEBRİKLER!", text = "";
    if (prize.type === "coin") { userProgress.totalCoins += prize.value; icon = "🪙"; text = `${prize.value} Coin kazandın!`; sesDogru.play(); }
    else if (prize.type === "star") { userProgress.totalStars += prize.value; icon = "⭐"; text = `${prize.value} Yıldız kazandın!`; sesDogru.play(); }
    else if (prize.type === "joker") { icon = "✂️"; text = `1 adet Yarı Yarıya Joker kazandın!`; sesDogru.play(); }
    else if (prize.type === "respin") { userProgress.freeSpins += 1; icon = "🎡"; text = `1 Bedava Çevirme Hakkı kazandın!`; sesDogru.play(); }
    vibrate(50);
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel();
    document.getElementById('spin-coins-display').innerText = userProgress.totalCoins;
    const canvas = document.getElementById('wheel-canvas');
    if (canvas) canvas.style.transform = `rotate(0deg)`;
    document.getElementById('prize-icon').innerText = icon;
    document.getElementById('prize-title').innerText = title;
    document.getElementById('prize-text').innerText = text;
    document.getElementById('prize-modal').classList.add('active');
    updateSpinTimer(); checkAchievements();
}
function closePrizeModal() { document.getElementById('prize-modal').classList.remove('active'); sesTiklama.play(); }

// --- SORU NORMALİZASYONU ---
function normalizeQuestion(q) {
    let secenekler = [], dogruIndex = 0;
    if (Array.isArray(q.secenekler)) { secenekler = q.secenekler; dogruIndex = q.dogru; }
    else if (typeof q.secenekler === 'object') {
        secenekler = [q.secenekler.A, q.secenekler.B, q.secenekler.C, q.secenekler.D];
        if (q.dogru_cevap === 'A') dogruIndex = 0; else if (q.dogru_cevap === 'B') dogruIndex = 1;
        else if (q.dogru_cevap === 'C') dogruIndex = 2; else if (q.dogru_cevap === 'D') dogruIndex = 3;
    }
    return { soru: q.soru, secenekler, dogru: dogruIndex, aciklama: q.aciklama || '' };
}

// --- LEVEL SEÇİM ---
function showLevelScreen() {
    const container = document.getElementById('levels-container');
    container.innerHTML = ''; updateTopPanel();
    if (levelsData.length === 0) { container.innerHTML = "<p style='color:#fff;'>Yükleniyor...</p>"; return; }
    
    for (let i = 0; i < levelsData.length; i++) {
        let progress = userProgress.levels[i] || { stars: 0, score: 0, unlocked: false };
        let catData = levelsData[i] || { kategori: `LEVEL ${i+1}` };
        let catName = catData.kategori || catData.kategori_adi || `LEVEL ${i+1}`;
        let catId = catData.kategori_id || (i+1);
        let isUnlocked = progress.unlocked || (i === 0) || (userProgress.levels[i-1] && userProgress.levels[i-1].stars > 0);
        let emojiData = getEmojiByCategoryName(catName);
        let starsStr = '☆☆☆';
        if (progress.stars === 1) starsStr = '⭐☆☆';
        if (progress.stars === 2) starsStr = '⭐⭐☆';
        if (progress.stars === 3) starsStr = '⭐⭐⭐';
        let displayScore = Math.min(progress.score, 100);
        let progressPercent = displayScore;
        let card = document.createElement('div');
        card.className = 'level-card' + (isUnlocked ? '' : ' locked');
        let statusHtml = isUnlocked ? '<span>🏆</span>' : `<div class="level-coin-btn">🪙 ${levelCoinCosts[i] || 100}</div>`;
        card.innerHTML = `<div class="level-avatar-box"><div class="level-avatar-icon">${emojiData.icon}</div><div class="level-avatar-role">${emojiData.role}</div></div><div class="level-info"><div class="level-title">${catName}</div><div class="level-progress-bar"><div class="level-progress-fill" style="width:${progressPercent}%"></div><div class="level-progress-text">${displayScore}/100</div></div><div class="level-stars">${starsStr}</div></div><div class="level-status">${statusHtml}</div>`;
        card.onclick = () => { sesTiklama.play(); vibrate(20); if (isUnlocked) startLevel(i); else openUnlockModal(i); };
        container.appendChild(card);
    }

    if (efsanelerData.length > 0) {
        let efsanelerHeader = document.createElement('div');
        efsanelerHeader.className = 'champion-header';
        efsanelerHeader.innerHTML = `<span>⭐ EFSANELER LİGİ ⭐</span>`;
        container.appendChild(efsanelerHeader);
        for (let i = 0; i < efsanelerData.length; i++) {
            let cat = efsanelerData[i];
            let progress = userProgress.levels[100 + i] || { stars: 0, score: 0, unlocked: false };
            let prevEfsaneCompleted = (i === 0) ? true : (userProgress.levels[100 + i - 1] && userProgress.levels[100 + i - 1].stars > 0);
            let isUnlocked = prevEfsaneCompleted && (userProgress.totalStars || 0) >= (cat.gereken_yildiz || 20);
            let starsStr = '☆☆☆';
            if (progress.stars === 1) starsStr = '⭐☆☆';
            if (progress.stars === 2) starsStr = '⭐⭐☆';
            if (progress.stars === 3) starsStr = '⭐⭐⭐';
            let displayScore = Math.min(progress.score, 100);
            let card = document.createElement('div');
            card.className = 'level-card champion-card' + (isUnlocked ? '' : ' locked');
            let statusHtml = isUnlocked ? '<span>👑</span>' : `<div class="level-coin-btn">⭐ ${cat.gereken_yildiz || 20}</div>`;
            card.innerHTML = `<div class="level-avatar-box champion-avatar"><div class="level-avatar-icon">⭐</div><div class="level-avatar-role">EFSANE</div></div><div class="level-info"><div class="level-title">${cat.kategori}</div><div class="level-progress-bar"><div class="level-progress-fill" style="width:${displayScore}%"></div><div class="level-progress-text">${displayScore}/100</div></div><div class="level-stars">${starsStr}</div></div><div class="level-status">${statusHtml}</div>`;
            card.onclick = () => { sesTiklama.play(); vibrate(20); if (isUnlocked) startEfsaneLevel(i); else showToast(`Bu bölüm için ${cat.gereken_yildiz || 20} yıldız gerekiyor!`); };
            container.appendChild(card);
        }
    }

    if (championsData.length > 0) {
        let header = document.createElement('div');
        header.className = 'champion-header';
        header.innerHTML = `<span>👑 ŞAMPİYONLAR LİGİ</span>`;
        container.appendChild(header);
        for (let i = 0; i < championsData.length; i++) {
            let champ = championsData[i];
            let levelIndex = 200 + i;
            let progress = userProgress.levels[levelIndex] || { stars: 0, score: 0, unlocked: false };
            let requiredStars = champ.gereken_yildiz || 30;
            let prevChampCompleted = (i === 0) ? true : (userProgress.levels[200 + i - 1] && userProgress.levels[200 + i - 1].stars > 0);
            let isUnlocked = prevChampCompleted && (userProgress.totalStars || 0) >= requiredStars;
            let starsStr = '☆☆☆';
            if (progress.stars === 1) starsStr = '⭐☆☆';
            if (progress.stars === 2) starsStr = '⭐⭐☆';
            if (progress.stars === 3) starsStr = '⭐⭐⭐';
            let displayScore = Math.min(progress.score, 100);
            let card = document.createElement('div');
            card.className = 'level-card champion-card' + (isUnlocked ? '' : ' locked');
            let statusHtml = isUnlocked ? '<span>👑</span>' : `<div class="level-coin-btn">⭐ ${requiredStars}</div>`;
            card.innerHTML = `<div class="level-avatar-box champion-avatar"><div class="level-avatar-icon">👑</div><div class="level-avatar-role">ŞAMPİYON</div></div><div class="level-info"><div class="level-title">${champ.kategori}</div><div class="level-progress-bar"><div class="level-progress-fill" style="width:${displayScore}%"></div><div class="level-progress-text">${displayScore}/100</div></div><div class="level-stars">${starsStr}</div></div><div class="level-status">${statusHtml}</div>`;
            card.onclick = () => { sesTiklama.play(); vibrate(20); if (isUnlocked) startChampionLevel(i); else showToast(`Bu bölüm için ${requiredStars} yıldız gerekiyor!`); };
            container.appendChild(card);
        }
    }
    showScreen('levels-screen');
}

// --- ŞAMPİYONLAR LİGİ ---
function startChampionLevel(champIndex) {
    isChampionLevel = true;
    currentLevelIndex = champIndex;
    currentQuestionIndex = 0; score = 0; correctCount = 0; wrongCount = 0;
    usedJokers = { "cut": false, "answer": false, "heart": false };
    hasDoubleChance = false;
    currentCombo = 0; bestComboInLevel = 0;
    if (!championsData[champIndex] || championsData[champIndex].sorular.length === 0) { showToast("Soru yok!"); return; }
    showScreen('quiz-screen'); loadChampionQuestion();
}
function loadChampionQuestion() {
    if (isPaused) return;
    answered = false; clearInterval(timerInterval);
    updateJokerButtons(); hideExplanation();
    document.getElementById('quiz-coins-display').innerText = userProgress.totalCoins || 0;
    let currentCategory = championsData[currentLevelIndex];
    let questions = currentCategory.sorular;
    if (currentQuestionIndex >= questions.length) currentQuestionIndex = 0;
    const currentQ = normalizeQuestion(questions[currentQuestionIndex]);
    document.getElementById('question-counter').innerText = `👑 ${currentQuestionIndex + 1}/${questions.length}`;
    document.getElementById('question-text').innerText = currentQ.soru;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = "";
    const letters = ['A', 'B', 'C', 'D'];
    currentQ.secenekler.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerHTML = `<span class="option-letter">${letters[index]}</span> ${option}`;
        btn.onclick = () => { sesTiklama.play(); vibrate(20); selectChampionOption(index, btn, currentQ); };
        optionsContainer.appendChild(btn);
    });
    saveProgress(currentLevelIndex, currentQuestionIndex);
    startTimer(currentQ.dogru, nextChampionQuestion);
}
function selectChampionOption(selectedIndex, selectedBtn, currentQ) {
    if (answered || isPaused) return;
    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
    if (selectedIndex === currentQ.dogru) {
        answered = true; clearInterval(timerInterval);
        selectedBtn.classList.add("correct");
        selectedBtn.innerHTML += ' <span class="gol-ikon">⚽</span>';
        score += 100 + (currentCombo * 10);
        correctCount++;
        currentCombo++;
        if (currentCombo > bestComboInLevel) bestComboInLevel = currentCombo;
        if (currentCombo > userProgress.bestCombo) userProgress.bestCombo = currentCombo;
        sesDogru.play(); vibrate(50);
        if (currentCombo >= 2) { showComboAnimation(); }
        updateComboBar();
        updateQuestProgress('correct', 1);
        for (let btn of buttons) btn.disabled = true;
        setTimeout(nextChampionQuestion, 1500);
    } else {
        if (hasDoubleChance) {
            hasDoubleChance = false;
            selectedBtn.classList.add("incorrect"); selectedBtn.disabled = true;
            sesYanlis.play(); vibrate(100); updateJokerButtons();
        } else {
            answered = true; clearInterval(timerInterval); wrongCount++;
            selectedBtn.classList.add("incorrect");
            selectedBtn.innerHTML += ' <span class="kart-ikon">🟥</span>';
            if (buttons[currentQ.dogru]) buttons[currentQ.dogru].classList.add("correct");
            sesYanlis.play(); vibrate(100);
            resetCombo();
            if (currentQ.aciklama) showExplanation(currentQ.aciklama);
            for (let btn of buttons) btn.disabled = true;
            setTimeout(nextChampionQuestion, 3000);
        }
    }
}
function nextChampionQuestion() {
    if (currentQuestionIndex < championsData[currentLevelIndex].sorular.length - 1) {
        currentQuestionIndex++; loadChampionQuestion();
    } else { showChampionResults(); }
}
function showChampionResults() {
    clearInterval(timerInterval); showScreen('score-screen');
    let totalQ = championsData[currentLevelIndex].sorular.length;
    let totalPossible = totalQ * 100;
    let percentage = (score / totalPossible) * 100;
    let starsEarned = 0;
    if (percentage >= 30) starsEarned = 1;
    if (percentage >= 70) starsEarned = 2;
    if (percentage >= 100) starsEarned = 3;
    userProgress.totalScore = (userProgress.totalScore || 0) + score;
    userProgress.totalCorrect = (userProgress.totalCorrect || 0) + correctCount;
    userProgress.totalWrong = (userProgress.totalWrong || 0) + wrongCount;
    if (score > (userProgress.highScore || 0)) userProgress.highScore = score;
    if (starsEarned === 3) userProgress.perfectLevels = (userProgress.perfectLevels || 0) + 1;
    let levelIndex = 200 + currentLevelIndex;
    let prevStars = userProgress.levels[levelIndex] ? userProgress.levels[levelIndex].stars : 0;
    if (starsEarned > prevStars) {
        userProgress.totalStars += (starsEarned - prevStars);
        userProgress.levels[levelIndex] = { stars: starsEarned, score: score, unlocked: true };
    } else if (!userProgress.levels[levelIndex]) {
        userProgress.levels[levelIndex] = { stars: starsEarned, score: score, unlocked: true };
        userProgress.totalStars += starsEarned;
    }
    let coinsEarned = 0;
    if (prevStars === 0) { coinsEarned = correctCount * 20; }
    else if (starsEarned > prevStars) { coinsEarned = (starsEarned - prevStars) * 20; }
    else { coinsEarned = 0; }
    if (usedJokers["cut"] || usedJokers["answer"] || usedJokers["heart"]) {}
    else { userProgress.noJokerLevels = (userProgress.noJokerLevels || 0) + 1; updateQuestProgress('nojoker', 1); }
    userProgress.totalCoins += coinsEarned;
    addToLeaderboard(`👑 ${championsData[currentLevelIndex].kategori}`, score);
    clearSavedProgress();
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    let starsDisplay = '☆☆☆';
    if (starsEarned === 1) starsDisplay = '⭐☆☆';
    if (starsEarned === 2) starsDisplay = '⭐⭐☆';
    if (starsEarned === 3) starsDisplay = '⭐⭐⭐';
    document.getElementById('result-stars').innerText = starsDisplay;
    document.getElementById('final-score-text').innerText = `👑 SKOR: ${score}`;
    document.getElementById('final-correct-text').innerText = `Doğru: ${correctCount}/${totalQ} | En İyi Combo: ${bestComboInLevel}x | Coin: ${coinsEarned} 🪙`;
    isChampionLevel = false;
    checkAchievements();
    if (starsEarned === 3) { setTimeout(() => { openChestModal(); }, 2000); }
}

// --- EFSANELER LİGİ ---
function startEfsaneLevel(index) {
    isChampionLevel = false;
    currentLevelIndex = 100 + index;
    currentQuestionIndex = 0; score = 0; correctCount = 0; wrongCount = 0;
    usedJokers = { "cut": false, "answer": false, "heart": false };
    hasDoubleChance = false;
    currentCombo = 0; bestComboInLevel = 0;
    if (!efsanelerData[index] || efsanelerData[index].sorular.length === 0) { showToast("Soru yok!"); return; }
    showScreen('quiz-screen'); loadEfsaneQuestion();
}
function loadEfsaneQuestion() {
    if (isPaused) return;
    answered = false; clearInterval(timerInterval);
    updateJokerButtons(); hideExplanation();
    document.getElementById('quiz-coins-display').innerText = userProgress.totalCoins || 0;
    let currentCategory = efsanelerData[currentLevelIndex - 100];
    let questions = currentCategory.sorular;
    if (currentQuestionIndex >= questions.length) currentQuestionIndex = 0;
    const currentQ = normalizeQuestion(questions[currentQuestionIndex]);
    document.getElementById('question-counter').innerText = `⭐ ${currentQuestionIndex + 1}/${questions.length}`;
    document.getElementById('question-text').innerText = currentQ.soru;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = "";
    const letters = ['A', 'B', 'C', 'D'];
    currentQ.secenekler.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerHTML = `<span class="option-letter">${letters[index]}</span> ${option}`;
        btn.onclick = () => { sesTiklama.play(); vibrate(20); selectEfsaneOption(index, btn, currentQ); };
        optionsContainer.appendChild(btn);
    });
    saveProgress(currentLevelIndex, currentQuestionIndex);
    startTimer(currentQ.dogru, nextEfsaneQuestion);
}
function selectEfsaneOption(selectedIndex, selectedBtn, currentQ) {
    if (answered || isPaused) return;
    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
    if (selectedIndex === currentQ.dogru) {
        answered = true; clearInterval(timerInterval);
        selectedBtn.classList.add("correct");
        selectedBtn.innerHTML += ' <span class="gol-ikon">⚽</span>';
        score += 100 + (currentCombo * 10);
        correctCount++;
        currentCombo++;
        if (currentCombo > bestComboInLevel) bestComboInLevel = currentCombo;
        if (currentCombo > userProgress.bestCombo) userProgress.bestCombo = currentCombo;
        sesDogru.play(); vibrate(50);
        if (currentCombo >= 2) { showComboAnimation(); }
        updateComboBar();
        updateQuestProgress('correct', 1);
        for (let btn of buttons) btn.disabled = true;
        setTimeout(nextEfsaneQuestion, 1500);
    } else {
        if (hasDoubleChance) {
            hasDoubleChance = false;
            selectedBtn.classList.add("incorrect"); selectedBtn.disabled = true;
            sesYanlis.play(); vibrate(100); updateJokerButtons();
        } else {
            answered = true; clearInterval(timerInterval); wrongCount++;
            selectedBtn.classList.add("incorrect");
            selectedBtn.innerHTML += ' <span class="kart-ikon">🟥</span>';
            if (buttons[currentQ.dogru]) buttons[currentQ.dogru].classList.add("correct");
            sesYanlis.play(); vibrate(100);
            resetCombo();
            if (currentQ.aciklama) showExplanation(currentQ.aciklama);
            for (let btn of buttons) btn.disabled = true;
            setTimeout(nextEfsaneQuestion, 3000);
        }
    }
}
function nextEfsaneQuestion() {
    if (currentQuestionIndex < efsanelerData[currentLevelIndex - 100].sorular.length - 1) {
        currentQuestionIndex++; loadEfsaneQuestion();
    } else { showEfsaneResults(); }
}
function showEfsaneResults() {
    clearInterval(timerInterval); showScreen('score-screen');
    let totalQ = efsanelerData[currentLevelIndex - 100].sorular.length;
    let totalPossible = totalQ * 100;
    let percentage = (score / totalPossible) * 100;
    let starsEarned = 0;
    if (percentage >= 30) starsEarned = 1;
    if (percentage >= 70) starsEarned = 2;
    if (percentage >= 100) starsEarned = 3;
    userProgress.totalScore = (userProgress.totalScore || 0) + score;
    userProgress.totalCorrect = (userProgress.totalCorrect || 0) + correctCount;
    userProgress.totalWrong = (userProgress.totalWrong || 0) + wrongCount;
    if (score > (userProgress.highScore || 0)) userProgress.highScore = score;
    if (starsEarned === 3) userProgress.perfectLevels = (userProgress.perfectLevels || 0) + 1;
    let prevStars = userProgress.levels[currentLevelIndex] ? userProgress.levels[currentLevelIndex].stars : 0;
    if (starsEarned > prevStars) {
        userProgress.totalStars += (starsEarned - prevStars);
        userProgress.levels[currentLevelIndex] = { stars: starsEarned, score: score, unlocked: true };
    } else if (!userProgress.levels[currentLevelIndex]) {
        userProgress.levels[currentLevelIndex] = { stars: starsEarned, score: score, unlocked: true };
        userProgress.totalStars += starsEarned;
    }
    let coinsEarned = 0;
    if (prevStars === 0) { coinsEarned = correctCount * 20; }
    else if (starsEarned > prevStars) { coinsEarned = (starsEarned - prevStars) * 20; }
    else { coinsEarned = 0; }
    userProgress.totalCoins += coinsEarned;
    addToLeaderboard(`⭐ ${efsanelerData[currentLevelIndex - 100].kategori}`, score);
    clearSavedProgress();
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    let starsDisplay = '☆☆☆';
    if (starsEarned === 1) starsDisplay = '⭐☆☆';
    if (starsEarned === 2) starsDisplay = '⭐⭐☆';
    if (starsEarned === 3) starsDisplay = '⭐⭐⭐';
    document.getElementById('result-stars').innerText = starsDisplay;
    document.getElementById('final-score-text').innerText = `⭐ SKOR: ${score}`;
    document.getElementById('final-correct-text').innerText = `Doğru: ${correctCount}/${totalQ} | En İyi Combo: ${bestComboInLevel}x | Coin: ${coinsEarned} 🪙`;
    isChampionLevel = false;
    checkAchievements();
    if (starsEarned === 3) { setTimeout(() => { openChestModal(); }, 2000); }
}

// --- ZAMANLAYICI ---
function startTimer(dogruIndex, nextFunc) {
    let timeLeft = 15;
    timerSecondsLeft = timeLeft;
    document.getElementById('timer-text').innerText = timeLeft + 's';
    document.querySelector('.timer-circle').classList.remove('warning');
    timerInterval = setInterval(() => {
        if (isPaused) return;
        timeLeft--; timerSecondsLeft = timeLeft;
        document.getElementById('timer-text').innerText = timeLeft + 's';
        if (timeLeft <= 5) { document.querySelector('.timer-circle').classList.add('warning'); }
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (!answered) {
                answered = true; wrongCount++;
                const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
                for (let btn of buttons) btn.disabled = true;
                if (buttons[dogruIndex]) buttons[dogruIndex].classList.add("correct");
                sesYanlis.play(); vibrate(100);
                resetCombo();
                setTimeout(nextFunc, 1500);
            }
        }
    }, 1000);
}

// --- NORMAL OYUN ---
function startLevel(index) {
    isChampionLevel = false;
    currentLevelIndex = index; currentQuestionIndex = 0; score = 0; correctCount = 0; wrongCount = 0;
    usedJokers = { "cut": false, "answer": false, "heart": false };
    hasDoubleChance = false;
    currentCombo = 0; bestComboInLevel = 0;
    if (!levelsData[index] || levelsData[index].sorular.length === 0) { showToast("Soru yok!"); return; }
    showScreen('quiz-screen'); loadQuestion();
}
function loadQuestion() {
    if (isPaused) return;
    answered = false; clearInterval(timerInterval);
    updateJokerButtons(); hideExplanation();
    document.getElementById('quiz-coins-display').innerText = userProgress.totalCoins || 0;
    let currentCategory = levelsData[currentLevelIndex];
    let questions = currentCategory.sorular;
    if (currentQuestionIndex >= questions.length) currentQuestionIndex = 0;
    const currentQ = normalizeQuestion(questions[currentQuestionIndex]);
    document.getElementById('question-counter').innerText = `Soru ${currentQuestionIndex + 1}/${questions.length}`;
    document.getElementById('question-text').innerText = currentQ.soru;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = "";
    const letters = ['A', 'B', 'C', 'D'];
    currentQ.secenekler.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerHTML = `<span class="option-letter">${letters[index]}</span> ${option}`;
        btn.onclick = () => { sesTiklama.play(); vibrate(20); selectOption(index, btn, currentQ); };
        optionsContainer.appendChild(btn);
    });
    saveProgress(currentLevelIndex, currentQuestionIndex);
    startTimer(currentQ.dogru, nextQuestion);
}
function updateJokerButtons() {
    const btnCut = document.getElementById('joker-cut');
    const btnAnswer = document.getElementById('joker-answer');
    const btnHeart = document.getElementById('joker-heart');
    if(btnCut) btnCut.disabled = usedJokers["cut"] || userProgress.totalCoins < JOKER_PRICES["cut"];
    if(btnAnswer) btnAnswer.disabled = usedJokers["answer"] || userProgress.totalCoins < JOKER_PRICES["answer"];
    if(btnHeart) btnHeart.disabled = usedJokers["heart"] || userProgress.totalCoins < JOKER_PRICES["heart"];
    if (usedJokers["cut"] && btnCut) btnCut.classList.add("used");
    if (usedJokers["answer"] && btnAnswer) btnAnswer.classList.add("used");
    if (usedJokers["heart"] && btnHeart) btnHeart.classList.add("used");
    document.getElementById('quiz-coins-display').innerText = userProgress.totalCoins || 0;
}
function useJoker(type) {
    if (answered || isPaused) return;
    let price = JOKER_PRICES[type];
    if (userProgress.totalCoins < price) { sesYanlis.play(); vibrate(100); showToast(`❌ Yetersiz coin! ${price} 🪙 gerekiyor.`); return; }
    if (usedJokers[type]) return;
    userProgress.totalCoins -= price; usedJokers[type] = true;
    userProgress.totalJokersUsed = (userProgress.totalJokersUsed || 0) + 1;
    updateQuestProgress('jokers', 1);
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel(); sesTiklama.play(); vibrate(30);
    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
    let currentQ = isChampionLevel ? normalizeQuestion(championsData[currentLevelIndex].sorular[currentQuestionIndex]) : (currentLevelIndex >= 100 && currentLevelIndex < 200 ? normalizeQuestion(efsanelerData[currentLevelIndex - 100].sorular[currentQuestionIndex]) : normalizeQuestion(levelsData[currentLevelIndex].sorular[currentQuestionIndex]));
    if (type === "cut") {
        let wrongIndices = [];
        for (let i = 0; i < 4; i++) { if (i !== currentQ.dogru) wrongIndices.push(i); }
        wrongIndices.sort(() => Math.random() - 0.5);
        let toHide = wrongIndices.slice(0, 2);
        toHide.forEach(idx => { if (buttons[idx]) buttons[idx].classList.add("hidden-option"); });
    } else if (type === "answer") {
        if (buttons[currentQ.dogru]) buttons[currentQ.dogru].classList.add("correct");
    } else if (type === "heart") {
        hasDoubleChance = true;
        showToast("❤️ Çift Cevap Hakkı aktif!");
    }
    updateJokerButtons();
}
function selectOption(selectedIndex, selectedBtn, currentQ) {
    if (answered || isPaused) return;
    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
    if (selectedIndex === currentQ.dogru) {
        answered = true; clearInterval(timerInterval);
        selectedBtn.classList.add("correct");
        selectedBtn.innerHTML += ' <span class="gol-ikon">⚽</span>';
        score += 100 + (currentCombo * 10);
        correctCount++;
        currentCombo++;
        if (currentCombo > bestComboInLevel) bestComboInLevel = currentCombo;
        if (currentCombo > userProgress.bestCombo) userProgress.bestCombo = currentCombo;
        sesDogru.play(); vibrate(50);
        if (currentCombo >= 2) { showComboAnimation(); }
        updateComboBar();
        updateQuestProgress('correct', 1);
        for (let btn of buttons) btn.disabled = true;
        setTimeout(nextQuestion, 1500);
    } else {
        if (hasDoubleChance) {
            hasDoubleChance = false;
            selectedBtn.classList.add("incorrect"); selectedBtn.disabled = true;
            sesYanlis.play(); vibrate(100); updateJokerButtons();
        } else {
            answered = true; clearInterval(timerInterval); wrongCount++;
            selectedBtn.classList.add("incorrect");
            selectedBtn.innerHTML += ' <span class="kart-ikon">🟥</span>';
            if (buttons[currentQ.dogru]) buttons[currentQ.dogru].classList.add("correct");
            sesYanlis.play(); vibrate(100);
            resetCombo();
            if (currentQ.aciklama) showExplanation(currentQ.aciklama);
            for (let btn of buttons) btn.disabled = true;
            setTimeout(nextQuestion, 3000);
        }
    }
}
function nextQuestion() {
    if (currentQuestionIndex < levelsData[currentLevelIndex].sorular.length - 1) {
        currentQuestionIndex++; loadQuestion();
    } else { showResults(); }
}
function showResults() {
    clearInterval(timerInterval); showScreen('score-screen');
    let totalQ = levelsData[currentLevelIndex].sorular.length;
    let totalPossible = totalQ * 100;
    let percentage = (score / totalPossible) * 100;
    let starsEarned = 0;
    if (percentage >= 30) starsEarned = 1;
    if (percentage >= 70) starsEarned = 2;
    if (percentage >= 100) starsEarned = 3;
    userProgress.totalScore = (userProgress.totalScore || 0) + score;
    userProgress.totalCorrect = (userProgress.totalCorrect || 0) + correctCount;
    userProgress.totalWrong = (userProgress.totalWrong || 0) + wrongCount;
    if (score > (userProgress.highScore || 0)) userProgress.highScore = score;
    if (starsEarned === 3) userProgress.perfectLevels = (userProgress.perfectLevels || 0) + 1;
    let prevStars = userProgress.levels[currentLevelIndex] ? userProgress.levels[currentLevelIndex].stars : 0;
    if (starsEarned > prevStars) {
        userProgress.totalStars += (starsEarned - prevStars);
        userProgress.levels[currentLevelIndex] = { stars: starsEarned, score: score, unlocked: true };
    } else if (!userProgress.levels[currentLevelIndex]) {
        userProgress.levels[currentLevelIndex] = { stars: starsEarned, score: score, unlocked: true };
        userProgress.totalStars += starsEarned;
    }
    let coinsEarned = 0;
    if (prevStars === 0) { coinsEarned = correctCount * 5; }
    else if (starsEarned > prevStars) { coinsEarned = (starsEarned - prevStars) * 5; }
    else { coinsEarned = 0; }
    if (!usedJokers["cut"] && !usedJokers["answer"] && !usedJokers["heart"]) {
        userProgress.noJokerLevels = (userProgress.noJokerLevels || 0) + 1;
        updateQuestProgress('nojoker', 1);
    }
    userProgress.totalCoins += coinsEarned;
    updateQuestProgress('levels', 1);
    addToLeaderboard(levelsData[currentLevelIndex].kategori || `Level ${currentLevelIndex + 1}`, score);
    clearSavedProgress();
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    let starsDisplay = '☆☆☆';
    if (starsEarned === 1) starsDisplay = '⭐☆☆';
    if (starsEarned === 2) starsDisplay = '⭐⭐☆';
    if (starsEarned === 3) starsDisplay = '⭐⭐⭐';
    document.getElementById('result-stars').innerText = starsDisplay;
    document.getElementById('final-score-text').innerText = `SKOR: ${score}`;
    document.getElementById('final-correct-text').innerText = `Doğru: ${correctCount}/${totalQ} | En İyi Combo: ${bestComboInLevel}x | Coin: ${coinsEarned} 🪙`;
    checkAchievements();
    if (starsEarned === 3) { setTimeout(() => { openChestModal(); }, 2000); }
}
function restartLevel() { sesTiklama.play(); vibrate(30); if (isChampionLevel) startChampionLevel(currentLevelIndex); else if (currentLevelIndex >= 100 && currentLevelIndex < 200) startEfsaneLevel(currentLevelIndex - 100); else startLevel(currentLevelIndex); }
function resetGame() { if(confirm("Tüm ilerlemen silinecek. Emin misin?")) { localStorage.removeItem('futbol_quiz_progress'); location.reload(); } }
function watchAdForStars() {
    sesTiklama.play(); vibrate(20);
    if (!navigator.onLine) { showToast("📡 İnternet bağlantısı yok!"); return; }
    showToast("⏳ Reklam sistemi henüz aktif değil. Yakında eklenecek!");
}

// --- PAUSE ---
function openPauseMenu() {
    if (isPaused) return;
    isPaused = true; clearInterval(timerInterval);
    document.getElementById('pause-toggle-music').checked = userProgress.musicEnabled;
    document.getElementById('pause-toggle-sound').checked = userProgress.soundEnabled;
    document.getElementById('pause-toggle-vibration').checked = userProgress.vibrationEnabled;
    document.getElementById('pause-modal').classList.add('active');
    sesTiklama.play(); vibrate(20);
}
function resumeFromPause() {
    document.getElementById('pause-modal').classList.remove('active');
    isPaused = false; sesTiklama.play(); vibrate(20);
    if (isChampionLevel) { loadChampionQuestion(); }
    else if (currentLevelIndex >= 100 && currentLevelIndex < 200) { loadEfsaneQuestion(); }
    else { loadQuestion(); }
}
function restartFromPause() {
    document.getElementById('pause-modal').classList.remove('active');
    isPaused = false; sesTiklama.play(); vibrate(20);
    if (isChampionLevel) startChampionLevel(currentLevelIndex);
    else if (currentLevelIndex >= 100 && currentLevelIndex < 200) startEfsaneLevel(currentLevelIndex - 100);
    else startLevel(currentLevelIndex);
}
function exitToMenuFromPause() {
    document.getElementById('pause-modal').classList.remove('active');
    isPaused = false; sesTiklama.play(); vibrate(20);
    showMenuScreen();
}

// --- ÖDÜL KUTUSU ---
function openChestModal() {
    document.getElementById('chest-modal').classList.add('active');
    document.getElementById('chest-icon').innerText = '📦';
    document.getElementById('chest-text').innerText = 'Kutuyu açmak için dokun!';
}
function openChest() {
    let chestIcon = document.getElementById('chest-icon');
    let chestText = document.getElementById('chest-text');
    let random = Math.random();
    let rewardText;
    if (random < 0.4) { let v = Math.floor(Math.random() * 100) + 50; userProgress.totalCoins += v; rewardText = `${v} Coin kazandın!`; chestIcon.innerText = '🪙'; }
    else if (random < 0.7) { let v = Math.floor(Math.random() * 5) + 3; userProgress.totalStars += v; rewardText = `${v} Yıldız kazandın!`; chestIcon.innerText = '⭐'; }
    else { rewardText = `1 adet Yarı Yarıya Joker kazandın!`; chestIcon.innerText = '✂️'; }
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel(); sesDogru.play(); vibrate(50);
    chestText.innerText = `🎉 ${rewardText}`;
    document.getElementById('chest-open-btn').innerText = 'TAMAM ✅';
    document.getElementById('chest-open-btn').onclick = closeChestModal;
    checkAchievements();
}
function closeChestModal() {
    document.getElementById('chest-modal').classList.remove('active');
    document.getElementById('chest-open-btn').innerText = 'AÇ 📦';
    document.getElementById('chest-open-btn').onclick = openChest;
    sesTiklama.play();
}

// --- UNLOCK MODAL ---
function openUnlockModal(levelIndex) {
    selectedLockedLevel = levelIndex;
    let requiredStars = 0;
    for (let i = 1; i <= levelIndex; i++) requiredStars += 3;
    let coinCost = levelCoinCosts[levelIndex] || 100;
    document.getElementById('modal-required-stars').innerText = requiredStars;
    document.getElementById('modal-coin-cost').innerText = coinCost;
    let btn = document.getElementById('modal-unlock-btn');
    let statusText = document.getElementById('modal-coin-status');
    if (userProgress.totalCoins >= coinCost) {
        btn.disabled = false;
        statusText.innerText = `Mevcut Coin: ${userProgress.totalCoins} 🪙`;
        statusText.style.color = '#22c55e';
    } else {
        btn.disabled = true;
        statusText.innerText = `Yetersiz Coin! Gereken: ${coinCost} 🪙, Mevcut: ${userProgress.totalCoins} 🪙`;
        statusText.style.color = '#f87171';
    }
    document.getElementById('unlock-modal').classList.add('active');
}
function closeUnlockModal() { document.getElementById('unlock-modal').classList.remove('active'); selectedLockedLevel = -1; }
function unlockLevelWithCoins() {
    if (selectedLockedLevel === -1) return;
    let coinCost = levelCoinCosts[selectedLockedLevel] || 100;
    if (userProgress.totalCoins >= coinCost) {
        userProgress.totalCoins -= coinCost;
        if (!userProgress.levels[selectedLockedLevel]) userProgress.levels[selectedLockedLevel] = { stars: 0, score: 0, unlocked: true };
        else userProgress.levels[selectedLockedLevel].unlocked = true;
        localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
        sesDogru.play(); vibrate(50); closeUnlockModal(); showLevelScreen(); updateTopPanel();
    } else { showToast("❌ Yetersiz coin!"); }
}

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => { console.log('Service Worker kaydedildi!', registration.scope); })
            .catch(err => { console.log('Service Worker kaydedilemedi:', err); });
    });
        }
