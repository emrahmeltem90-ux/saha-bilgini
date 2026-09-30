// --- SES DOSYALARI ---
const sesDogru = new Audio('ses_dogru.mp3');
const sesYanlis = new Audio('ses_yanlis.mp3');
const sesTiklama = new Audio('ses_tiklama.mp3');
sesDogru.volume = 0.7; sesYanlis.volume = 0.7; sesTiklama.volume = 0.5;

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
let selectedLockedLevel = -1;

// YENİ: Joker durumları ve fiyatları
let usedJokers = { "5050": false, "answer": false, "double": false };
let hasDoubleChance = false;
const JOKER_PRICES = { "5050": 20, "answer": 40, "double": 60 };

let userProgress = JSON.parse(localStorage.getItem('futbol_quiz_progress')) || { levels: {}, totalStars: 0, totalCoins: 100 };
if (!userProgress.levels[0]) userProgress.levels[0] = { stars: 0, score: 0, unlocked: true };

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

        let statusHtml = isUnlocked ? '<span>🏆</span>' : `<div class="level-coin-btn">🪙 ${levelCoinCosts[i] || 100}</div>`;

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
        sesDogru.play();
        closeUnlockModal();
        showLevelScreen();
        updateTopPanel();
    } else {
        sesYanlis.play();
        alert("Yetersiz coin!");
    }
}

// --- OYUN MANTIĞI ---
function startLevel(index) {
    currentLevelIndex = index; currentQuestionIndex = 0; score = 0; correctCount = 0;
    // Jokerleri sıfırla
    usedJokers = { "5050": false, "answer": false, "double": false };
    hasDoubleChance = false;
    if (!levelsData[index] || levelsData[index].sorular.length === 0) { alert("Soru yok!"); return; }
    showScreen('quiz-screen'); loadQuestion();
}

function loadQuestion() {
    answered = false; clearInterval(timerInterval);
    // Joker butonlarını güncelle
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
                answered = true;
                const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
                for (let btn of buttons) btn.disabled = true;
                buttons[currentQ.dogru].classList.add("correct");
                sesYanlis.play(); setTimeout(nextQuestion, 1500);
            }
        }
    }, 1000);
}

// YENİ: Joker butonlarının durumunu güncelle
function updateJokerButtons() {
    const btn5050 = document.getElementById('joker-5050');
    const btnAnswer = document.getElementById('joker-answer');
    const btnDouble = document.getElementById('joker-double');

    // Kullanıldıysa veya yeterli coin yoksa pasif yap
    btn5050.disabled = usedJokers["5050"] || userProgress.totalCoins < JOKER_PRICES["5050"];
    btnAnswer.disabled = usedJokers["answer"] || userProgress.totalCoins < JOKER_PRICES["answer"];
    btnDouble.disabled = usedJokers["double"] || userProgress.totalCoins < JOKER_PRICES["double"];

    // Kullanıldıysa gri yap
    if (usedJokers["5050"]) btn5050.classList.add("used");
    if (usedJokers["answer"]) btnAnswer.classList.add("used");
    if (usedJokers["double"]) btnDouble.classList.add("used");
}

// YENİ: Joker kullanma fonksiyonu
function useJoker(type) {
    if (answered) return; // Soru cevaplanmışsa joker kullanılamaz

    let price = JOKER_PRICES[type];
    if (userProgress.totalCoins < price) {
        sesYanlis.play();
        alert(`Yetersiz coin! Bu joker için ${price} 🪙 gerekiyor.`);
        return;
    }
    if (usedJokers[type]) return;

    // Coin düş
    userProgress.totalCoins -= price;
    usedJokers[type] = true;
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel();
    sesTiklama.play();

    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
    let currentQ = normalizeQuestion(levelsData[currentLevelIndex].sorular[currentQuestionIndex]);

    if (type === "5050") {
        // İki yanlış şıkkı sil
        let wrongIndices = [];
        for (let i = 0; i < 4; i++) { if (i !== currentQ.dogru) wrongIndices.push(i); }
        // Rastgele 2 yanlış seç
        wrongIndices.sort(() => Math.random() - 0.5);
        let toHide = wrongIndices.slice(0, 2);
        toHide.forEach(idx => { if (buttons[idx]) buttons[idx].classList.add("hidden-option"); });
    } 
    else if (type === "answer") {
        // Doğru cevabı göster (yeşil yap)
        if (buttons[currentQ.dogru]) {
            buttons[currentQ.dogru].classList.add("correct");
            // Ama tıklanmasın diye disabled yapmıyoruz, sadece gösteriyoruz
        }
    } 
    else if (type === "double") {
        // Çift cevap hakkı ver
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
        // DOĞRU CEVAP
        answered = true;
        clearInterval(timerInterval);
        selectedBtn.classList.add("correct");
        score += 100;
        correctCount++;
        sesDogru.play();
        for (let btn of buttons) btn.disabled = true;
        setTimeout(nextQuestion, 1200);
    } else {
        // YANLIŞ CEVAP
        if (hasDoubleChance) {
            // Çift cevap hakkı varsa, hakkı kullan ve devam et
            hasDoubleChance = false;
            selectedBtn.classList.add("incorrect");
            selectedBtn.disabled = true;
            sesYanlis.play();
            // Diğer şıklar açık kalsın, oyuncu tekrar denesin
            updateJokerButtons();
        } else {
            // Normal yanlış cevap
            answered = true;
            clearInterval(timerInterval);
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
    } else {
        showResults();
    }
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

    let prevStars = userProgress.levels[currentLevelIndex] ? userProgress.levels[currentLevelIndex].stars : 0;
    if (starsEarned > prevStars) {
        userProgress.totalStars += (starsEarned - prevStars);
        userProgress.levels[currentLevelIndex] = { stars: starsEarned, score: score, unlocked: true };
    } else if (!userProgress.levels[currentLevelIndex]) {
        userProgress.levels[currentLevelIndex] = { stars: starsEarned, score: score, unlocked: true };
        userProgress.totalStars += starsEarned;
    }
    // YENİ: Her doğru cevap = 10 coin
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
