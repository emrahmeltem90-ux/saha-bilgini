// --- SES DOSYALARI ---
const sesDogru = new Audio('ses_dogru.mp3');
const sesYanlis = new Audio('ses_yanlis.mp3');
const sesTiklama = new Audio('ses_tiklama.mp3');
sesDogru.volume = 0.7; sesYanlis.volume = 0.7; sesTiklama.volume = 0.5;

// --- GİRİŞ EKRANI ---
document.addEventListener("DOMContentLoaded", function() {
    let percent = 0;
    const percentDisplay = document.getElementById('splash-percent');
    const interval = setInterval(() => {
        percent += Math.floor(Math.random() * 5) + 1;
        if (percent >= 100) {
            percent = 100; clearInterval(interval);
            setTimeout(() => {
                const splash = document.getElementById('splash-screen');
                if (splash) {
                    splash.style.opacity = '0';
                    setTimeout(() => { splash.style.display = 'none'; showMenuScreen(); }, 500);
                }
            }, 500);
        }
        if(percentDisplay) percentDisplay.innerText = percent + '%';
    }, 100);
});

// --- SORULARI YÜKLE ---
let levelsData = [];
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
}
loadAllQuestions();

let currentLevelIndex = 0, currentQuestionIndex = 0, score = 0, correctCount = 0, answered = false, timerInterval;
let selectedLockedLevel = -1; // Kilit açma için seçilen level

let userProgress = JSON.parse(localStorage.getItem('futbol_quiz_progress')) || { levels: {}, totalStars: 0, totalCoins: 100 };
if (!userProgress.levels[0]) userProgress.levels[0] = { stars: 0, score: 0, unlocked: true };

// Her levelin coin fiyatı (Kilit açmak için)
const levelCoinCosts = {
    1: 50, 2: 100, 3: 150, 4: 200, 5: 250,
    6: 300, 7: 350, 8: 400, 9: 450, 10: 500,
    // Diğerleri için 50'şer artarak devam eder
};
for (let i = 11; i <= 40; i++) { levelCoinCosts[i-1] = 500 + (i - 10) * 50; }

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

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    updateTopPanel();
}
function showMenuScreen() { showScreen('menu-screen'); updateTopPanel(); }
function showSettingsScreen() { showScreen('settings-screen'); }
function updateTopPanel() {
    document.getElementById('total-stars-display').innerText = userProgress.totalStars || 0;
    document.getElementById('total-coins-display').innerText = userProgress.totalCoins || 0;
}

function normalizeQuestion(q) {
    let secenekler = [], dogruIndex = 0;
    if (Array.isArray(q.secenekler)) { secenekler = q.secenekler; dogruIndex = q.dogru; }
    else if (typeof q.secenekler === 'object') {
        secenekler = [q.secenekler.A, q.secenekler.B, q.secenekler.C, q.secenekler.D];
        if (q.dogru_cevap === 'A') dogruIndex = 0; else if (q.dogru_cevap === 'B') dogruIndex = 1;
        else if (q.dogru_cevap === 'C') dogruIndex = 2; else if (q.dogru_cevap === 'D') dogruIndex = 3;
    }
    return { soru: q.soru, secenekler, dogru: dogruIndex };
}

function showLevelScreen() {
    const container = document.getElementById('levels-container');
    container.innerHTML = ''; updateTopPanel();
    if (levelsData.length === 0) { container.innerHTML = "<p style='color:#fff;'>Yükleniyor...</p>"; return; }

    for (let i = 0; i < 40; i++) {
        let progress = userProgress.levels[i] || { stars: 0, score: 0, unlocked: false };
        let catData = levelsData[i] || { kategori: `LEVEL ${i+1}` };
        let catName = catData.kategori || catData.kategori_adi || `LEVEL ${i+1}`;
        let catId = catData.kategori_id || (i+1);
        let isUnlocked = progress.unlocked || (i === 0) || (userProgress.levels[i-1] && userProgress.levels[i-1].stars > 0);
        let emojiData = getCategoryEmoji(catId);

        let starsStr = '☆☆☆';
        if (progress.stars === 1) starsStr = '⭐☆☆';
        if (progress.stars === 2) starsStr = '⭐⭐☆';
        if (progress.stars === 3) starsStr = '⭐⭐⭐';

        let card = document.createElement('div');
        card.className = 'level-card' + (isUnlocked ? '' : ' locked');

        // Kilitliyse sağ tarafta coin butonu göster
        let statusHtml = '';
        if (isUnlocked) {
            statusHtml = '<span>🏆</span>';
        } else {
            let coinCost = levelCoinCosts[i] || 100;
            statusHtml = `<div class="level-coin-btn">🪙 ${coinCost}</div>`;
        }

        card.innerHTML = `
            <div class="level-avatar-box"><div class="level-avatar-icon">${emojiData.icon}</div><div class="level-avatar-role">${emojiData.role}</div></div>
            <div class="level-info">
                <div class="level-title">${catName}</div>
                <div class="level-progress-bar"><div class="level-progress-fill" style="width:${(progress.score / 100) * 100}%"></div><div class="level-progress-text">${progress.score}/100</div></div>
                <div class="level-stars">${starsStr}</div>
            </div>
            <div class="level-status">${statusHtml}</div>`;

        card.onclick = () => {
            sesTiklama.play();
            if (isUnlocked) startLevel(i);
            else openUnlockModal(i);
        };
        container.appendChild(card);
    }
    showScreen('levels-screen');
}

// --- YENİ: KİLİT AÇMA MODALI ---
function openUnlockModal(levelIndex) {
    selectedLockedLevel = levelIndex;
    let requiredStars = 0; // Bu level için gereken yıldız sayısı
    for (let i = 1; i <= levelIndex; i++) requiredStars += 3; // Bas
