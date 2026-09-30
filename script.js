// --- SES DOSYALARI ---
const sesDogru = new Audio('ses_dogru.mp3');
const sesYanlis = new Audio('ses_yanlis.mp3');
const sesTiklama = new Audio('ses_tiklama.mp3');
const sesCark = new Audio('ses_cark.mp3');
sesDogru.volume = 0.7; sesYanlis.volume = 0.7; sesTiklama.volume = 0.5; sesCark.volume = 0.6;

// --- ÇARKIFELEK ÖDÜLLERİ ---
const WHEEL_PRIZES = [
    { label: "10 🪙", type: "coin", value: 10, color: "#f472b6" },
    { label: "25 🪙", type: "coin", value: 25, color: "#34d399" },
    { label: "50 🪙", type: "coin", value: 50, color: "#60a5fa" },
    { label: "5 ⭐", type: "star", value: 5, color: "#fbbf24" },
    { label: "100 🪙", type: "coin", value: 100, color: "#a78bfa" },
    { label: "✂️ JOKER", type: "joker", value: 1, color: "#f87171" },
    { label: "250 🪙", type: "coin", value: 250, color: "#fb923c" },
    { label: "TEKRAR", type: "respin", value: 1, color: "#4ade80" }
];
let isSpinning = false;

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
    drawWheel();
    loadProfileName();
});

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

let currentLevelIndex = 0, currentQuestionIndex = 0, score = 0, correctCount = 0, wrongCount = 0, answered = false, timerInterval;
let selectedLockedLevel = -1;
let usedJokers = { "5050": false, "answer": false, "double": false };
let hasDoubleChance = false;
const JOKER_PRICES = { "5050": 20, "answer": 40, "double": 60 };

let userProgress = JSON.parse(localStorage.getItem('futbol_quiz_progress')) || {
    levels: {}, totalStars: 0, totalCoins: 100,
    profileName: "Oyuncu", totalScore: 0, totalCorrect: 0, totalWrong: 0, highScore: 0, perfectLevels: 0
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

const levelCoinCosts = { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250, 6: 300, 7: 350, 8: 400, 9: 450, 10: 500 };
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
    document.getElementById('menu-profile-name').innerText = userProgress.profileName || "Oyuncu";
}

// --- PROFİL FONKSİYONLARI ---
function showProfileScreen() {
    showScreen('profile-screen');
    document.getElementById('profile-name-input').value = userProgress.profileName || "Oyuncu";
    document.getElementById('stat-total-score').innerText = userProgress.totalScore || 0;
    document.getElementById('stat-total-correct').innerText = userProgress.totalCorrect || 0;
    document.getElementById('stat-total-wrong').innerText = userProgress.totalWrong || 0;
    document.getElementById('stat-high-score').innerText = userProgress.highScore || 0;
    document.getElementById('stat-levels-completed').innerText = Object.keys(userProgress.levels).length || 0;
    document.getElementById('stat-perfect-levels').innerText = userProgress.perfectLevels || 0;
}

function saveProfileName() {
    let newName = document.getElementById('profile-name-input').value.trim();
    if (newName === "") newName = "Oyuncu";
    userProgress.profileName = newName;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    sesDogru.play();
    alert("İsim kaydedildi: " + newName);
    updateTopPanel();
}

function loadProfileName() {
    document.getElementById('menu-profile-name').innerText = userProgress.profileName || "Oyuncu";
}

// --- ÇARKIFELEK ---
function showSpinScreen() {
    showScreen('spin-screen');
    document.getElementById('spin-coins-display').innerText = userProgress.totalCoins || 0;
    updateSpinTimer();
    drawWheel();
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

    if (userProgress.freeSpins > 0) {
        userProgress.freeSpins--;
    } else {
        if (userProgress.totalCoins >= 50) {
            userProgress.totalCoins -= 50;
            updateTopPanel();
        } else {
            alert("Yetersiz coin! Çevirmek için 50 🪙 gerekiyor.");
            isSpinning = false; spinBtn.disabled = false; return;
        }
    }

    sesCark.currentTime = 0;
    sesCark.play();

    const randomIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const sliceAngle = 360 / WHEEL_PRIZES.length;
    const targetAngle = 360 * 5 + (360 - (randomIndex * sliceAngle + sliceAngle / 2));

    const canvas = document.getElementById('wheel-canvas');
    let currentRotation = 0;
    let startTime = null;
    const duration = 4000;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / duration;
        if (progress > 1) progress = 1;
        let easeOut = 1 - Math.pow(1 - progress, 3);
        let rotation = easeOut * targetAngle;
        canvas.style.transform = `rotate(${rotation}deg)`;
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            givePrize(WHEEL_PRIZES[randomIndex]);
            userProgress.lastSpinTime = Date.now();
            localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
            updateSpinTimer();
        }
    }
    requestAnimationFrame(animate);
}

function givePrize(prize) {
    let icon = "🎁";
    let title = "TEBRİKLER!";
    let text = "";

    if (prize.type === "coin") {
        userProgress.totalCoins += prize.value;
        icon = "🪙"; text = `${prize.value} Coin kazandın!`; sesDogru.play();
    } else if (prize.type === "star") {
        userProgress.totalStars += prize.value;
        icon = "⭐"; text = `${prize.value} Yıldız kazandın!`; sesDogru.play();
    } else if (prize.type === "joker") {
        icon = "✂️"; text = `1 adet Yarı Yarıya Joker kazandın!`; sesDogru.play();
    } else if (prize.type === "respin") {
        userProgress.freeSpins += 1;
        icon = "🎡"; text = `1 Bedava Çevirme Hakkı kazandın!`; sesDogru.play();
    }

    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel();
    document.getElementById('spin-coins-display').innerText = userProgress.totalCoins;

    const canvas = document.getElementById('wheel-canvas');
    if (canvas) canvas.style.transform = `rotate(0deg)`;

    document.getElementById('prize-icon').innerText = icon;
    document.getElementById('prize-title').innerText = title;
    document.getElementById('prize-text').innerText = text;
    document.getElementById('prize-modal').classList.add('active');
    updateSpinTimer();
}

function closePrizeModal() {
    document.getElementById('prize-modal').classList.remove('active');
    sesTiklama.play();
}

// --- OYUN MANTIĞI ---
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
        let statusHtml = isUnlocked ? '<span>🏆</span>' : `<div class="level-coin-btn">🪙 ${levelCoinCosts[i] || 100}</div>`;
        card.innerHTML = `
            <div class="level-avatar-box"><div class="level-avatar-icon">${emojiData.icon}</div><div class="level-avatar-role">${emojiData.role}</div></div>
            <div class="level-info">
                <div class="level-title">${catName}</div>
                <div class="level-progress-bar"><div class="level-progress-fill" style="width:${(progress.score / 100) * 100}%"></div><div class="level-progress-text">${progress.score}/100</div></div>
                <div class="level-stars">${starsStr}</div>
            </div>
            <div class="level-status">${statusHtml}</div>`;
        card.onclick = () => { sesTiklama.play(); if (isUnlocked) startLevel(i); else openUnlockModal(i); };
        container.appendChild(card);
    }
    showScreen('levels-screen');
}

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

function closeUnlockModal() {
    document.getElementById('unlock-modal').classList.remove('active');
    selectedLockedLevel = -1;
}

function unlockLevelWithCoins() {
    if (selectedLockedLevel === -1) return;
    let coinCost = levelCoinCosts[selectedLockedLevel] || 100;
    if (userProgress.totalCoins >= coinCost) {
        userProgress.totalCoins -= coinCost;
        if (!userProgress.levels[selectedLockedLevel]) userProgress.levels[selectedLockedLevel] = { stars: 0, score: 0, unlocked: true };
        else userProgress.levels[selectedLockedLevel].unlocked = true;
        localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
        sesDogru.play(); closeUnlockModal(); showLevelScreen(); updateTopPanel();
    } else { sesYanlis.play(); alert("Yetersiz coin!"); }
}

function startLevel(index) {
    currentLevelIndex = index; currentQuestionIndex = 0; score = 0; correctCount = 0; wrongCount = 0;
    usedJokers = { "5050": false, "answer": false, "double": false };
    hasDoubleChance = false;
    if (!levelsData[index] || levelsData[index].sorular.length === 0) { alert("Soru yok!"); return; }
    showScreen('quiz-screen'); loadQuestion();
}

function loadQuestion() {
    answered = false; clearInterval(timerInterval);
    updateJokerButtons();
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
        btn.onclick = () => { sesTiklama.play(); selectOption(index, btn); };
        optionsContainer.appendChild(btn);
    });
    let timeLeft = 30;
    document.getElementById('timer-text').innerText = timeLeft + 's';
    timerInterval = setInterval(() => {
        timeLeft--; document.getElementById('timer-text').innerText = timeLeft + 's';
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (!answered) {
                answered = true; wrongCount++;
                const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
                for (let btn of buttons) btn.disabled = true;
                buttons[currentQ.dogru].classList.add("correct");
                sesYanlis.play(); setTimeout(nextQuestion, 1500);
            }
        }
    }, 1000);
}

function updateJokerButtons() {
    const btn5050 = document.getElementById('joker-5050');
    const btnAnswer = document.getElementById('joker-answer');
    const btnDouble = document.getElementById('joker-double');
    if(btn5050) btn5050.disabled = usedJokers["5050"] || userProgress.totalCoins < JOKER_PRICES["5050"];
    if(btnAnswer) btnAnswer.disabled = usedJokers["answer"] || userProgress.totalCoins < JOKER_PRICES["answer"];
    if(btnDouble) btnDouble.disabled = usedJokers["double"] || userProgress.totalCoins < JOKER_PRICES["double"];
    if (usedJokers["5050"] && btn5050) btn5050.classList.add("used");
    if (usedJokers["answer"] && btnAnswer) btnAnswer.classList.add("used");
    if (usedJokers["double"] && btnDouble) btnDouble.classList.add("used");
}

function useJoker(type) {
    if (answered) return;
    let price = JOKER_PRICES[type];
    if (userProgress.totalCoins < price) { sesYanlis.play(); alert(`Yetersiz coin! Bu joker için ${price} 🪙 gerekiyor.`); return; }
    if (usedJokers[type]) return;
    userProgress.totalCoins -= price; usedJokers[type] = true;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel(); sesTiklama.play();
    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
    let currentQ = normalizeQuestion(levelsData[currentLevelIndex].sorular[currentQuestionIndex]);
    if (type === "5050") {
        let wrongIndices = [];
        for (let i = 0; i < 4; i++) { if (i !== currentQ.dogru) wrongIndices.push(i); }
        wrongIndices.sort(() => Math.random() - 0.5);
        let toHide = wrongIndices.slice(0, 2);
        toHide.forEach(idx => { if (buttons[idx]) buttons[idx].classList.add("hidden-option"); });
    } else if (type === "answer") {
        if (buttons[currentQ.dogru]) buttons[currentQ.dogru].classList.add("correct");
    } else if (type === "double") {
        hasDoubleChance = true;
        alert("❤️ Çift Cevap Hakkı aktif! Yanlış yaparsan bir hak daha kazanacaksın.");
    }
    updateJokerButtons();
}

function selectOption(selectedIndex, selectedBtn) {
    if (answered) return;
    let currentQ = normalizeQuestion(levelsData[currentLevelIndex].sorular[currentQuestionIndex]);
    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
    if (selectedIndex === currentQ.dogru) {
        answered = true; clearInterval(timerInterval);
        selectedBtn.classList.add("correct");
        score += 100; correctCount++; sesDogru.play();
        for (let btn of buttons) btn.disabled = true;
        setTimeout(nextQuestion, 1200);
    } else {
        if (hasDoubleChance) {
            hasDoubleChance = false;
            selectedBtn.classList.add("incorrect");
            selectedBtn.disabled = true;
            sesYanlis.play(); updateJokerButtons();
        } else {
            answered = true; clearInterval(timerInterval);
            wrongCount++;
            selectedBtn.classList.add("incorrect");
            if (buttons[currentQ.dogru]) buttons[currentQ.dogru].classList.add("correct");
            sesYanlis.play();
            for (let btn of buttons) btn.disabled = true;
            setTimeout(nextQuestion, 1200);
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

    // İstatistikleri güncelle
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
    let coinsEarned = correctCount * 10;
    userProgress.totalCoins += coinsEarned;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));

    let starsDisplay = '☆☆☆';
    if (starsEarned === 1) starsDisplay = '⭐☆☆';
    if (starsEarned === 2) starsDisplay = '⭐⭐☆';
    if (starsEarned === 3) starsDisplay = '⭐⭐⭐';
    document.getElementById('result-stars').innerText = starsDisplay;
    document.getElementById('final-score-text').innerText = `SKOR: ${score}`;
    document.getElementById('final-correct-text').innerText = `Doğru Sayısı: ${correctCount}/${totalQ} | Kazanılan Coin: ${coinsEarned} 🪙`;
}

function restartLevel() { sesTiklama.play(); startLevel(currentLevelIndex); }
function resetGame() { if(confirm("Tüm ilerlemen silinecek. Emin misin?")) { localStorage.removeItem('futbol_quiz_progress'); location.reload(); } }
function watchAdForStars() {
    sesTiklama.play(); alert("Reklam izleniyor... (Simülasyon)");
    setTimeout(() => {
        userProgress.totalStars += 5;
        localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
        updateTopPanel(); alert("Tebrikler! 5 yıldız kazandın. ⭐"); showLevelScreen();
    }, 1500);
                              }
