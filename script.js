// --- GİRİŞ EKRANI KONTROLÜ ---
document.addEventListener("DOMContentLoaded", function() {
    // 3 saniye sonra giriş ekranını gizle
    setTimeout(function() {
        var splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(function() {
                splash.style.display = 'none';
            }, 500); // Geçiş animasyonu için bekle
        }
    }, 3000); // 3000ms = 3 saniye
});

// 40 Level - Her birinde 10 soru
const levelsData = [];
const sampleBaseQuestions = [
    { soru: "Futbol maçında sahada her bir takım kaç oyuncuyla yer alır?", secenekler: ["9", "10", "11", "12"], dogru: 2 },
    { soru: "Standart bir futbol maçı normal sürede toplam kaç dakikadır?", secenekler: ["80", "90", "100", "120"], dogru: 1 },
    { soru: "Hakemin oyuncuyu ihraç etmek için gösterdiği kartın rengi nedir?", secenekler: ["Sarı", "Kırmızı", "Mavi", "Yeşil"], dogru: 1 },
    { soru: "Kendi ceza sahası dışındayken elleriyle topu tutabilen tek oyuncu kimdir?", secenekler: ["Stoper", "Forvet", "Kaleci", "Kaptan"], dogru: 2 },
    { soru: "Topun taç çizgisini tamamen geçmesiyle hangi atış kullanılır?", secenekler: ["Korner", "Taç atışı", "Penaltı", "Aut"], dogru: 1 },
    { soru: "Ofsayt kuralı hangi alanda geçerlidir?", secenekler: ["Rakip yarı alanda", "Kendi yarı alanında", "Tüm sahada", "Orta yuvarlakta"], dogru: 0 },
    { soru: "Penaltı vuruşu kaleye kaç metre mesafeden yapılır?", secenekler: ["9 metre", "11 metre", "12 metre", "14 metre"], dogru: 1 },
    { soru: "Süper Lig'in kuruluş yılı resmi olarak hangisidir?", secenekler: ["1923", "1959", "1967", "1980"], dogru: 1 },
    { soru: "Şampiyonlar Ligi kupasını en çok kazanan kulüp hangisidir?", secenekler: ["AC Milan", "Barcelona", "Real Madrid", "Bayern Münih"], dogru: 2 },
    { soru: "Dünya Kupası organizasyonu kaç yılda bir düzenlenir?", secenekler: ["2", "3", "4", "5"], dogru: 2 }
];

for (let l = 1; l <= 40; l++) {
    let qList = [];
    for (let q = 1; q <= 10; q++) {
        let baseQ = sampleBaseQuestions[(q + l - 2) % sampleBaseQuestions.length];
        qList.push({
            soru: `[Level ${l}] ${baseQ.soru} (Soru ${q})`,
            secenekler: baseQ.secenekler,
            dogru: baseQ.dogru
        });
    }
    levelsData.push(qList);
}

let currentLevelIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

let userProgress = JSON.parse(localStorage.getItem('futbol_quiz_progress')) || {
    levels: {},
    totalStars: 0,
    totalCoins: 0
};

if (!userProgress.levels[0]) {
    userProgress.levels[0] = { stars: 0, score: 0, unlocked: true };
}

const levelRoles = [
    { role: "PLAYER", icon: "👤" },
    { role: "LEGEND", icon: "🌟" },
    { role: "COACH", icon: "🧑‍🏫" },
    { role: "CLUB", icon: "🛡️" },
    { role: "ICON", icon: "👑" },
    { role: "GOAT", icon: "🐐" }
];

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    updateTopPanel();
}

function showMenuScreen() {
    showScreen('menu-screen');
}

function updateTopPanel() {
    document.getElementById('total-stars-display').innerText = userProgress.totalStars || 0;
    document.getElementById('total-coins-display').innerText = userProgress.totalCoins || 0;
}

function showLevelScreen() {
    const container = document.getElementById('levels-container');
    container.innerHTML = '';
    updateTopPanel();

    for (let i = 0; i < 40; i++) {
        let lvlNum = i + 1;
        let progress = userProgress.levels[i] || { stars: 0, score: 0, unlocked: false };
        let isUnlocked = progress.unlocked || (i === 0) || (userProgress.levels[i-1] && userProgress.levels[i-1].stars > 0);

        let card = document.createElement('div');
        card.className = 'level-card' + (isUnlocked ? '' : ' locked');
        let roleData = levelRoles[i % levelRoles.length];

        let starsStr = '☆☆☆';
        if (progress.stars === 1) starsStr = '⭐☆☆';
        if (progress.stars === 2) starsStr = '⭐⭐☆';
        if (progress.stars === 3) starsStr = '⭐⭐⭐';

        let progressPercent = (progress.score / 100) * 100;
        let progressText = `${progress.score}/100`;

        card.innerHTML = `
            <div class="level-avatar-box">
                <div class="level-avatar-icon">${roleData.icon}</div>
                <div class="level-avatar-role">${roleData.role}</div>
            </div>
            <div class="level-info">
                <div class="level-title">LEVEL ${lvlNum}</div>
                <div class="level-progress-bar">
                    <div class="level-progress-fill" style="width: ${progressPercent}%"></div>
                    <div class="level-progress-text">${progressText}</div>
                </div>
                <div class="level-stars">${starsStr}</div>
            </div>
            <div class="level-status">
                ${isUnlocked ? '<span class="trophy-icon">🏆</span>' : '<span class="lock-icon">🔒</span>'}
            </div>
        `;

        if (isUnlocked) {
            card.onclick = () => startLevel(i);
        } else {
            card.onclick = () => alert("Bu level kilitli! Lütfen önceki leveli en az 1 yıldızla tamamlayın.");
        }
        container.appendChild(card);
    }
    showScreen('levels-screen');
}

function startLevel(levelIndex) {
    currentLevelIndex = levelIndex;
    currentQuestionIndex = 0;
    score = 0;
    showScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    answered = false;
    document.getElementById('next-btn').style.display = "none";
    const currentQ = levelsData[currentLevelIndex][currentQuestionIndex];
    document.getElementById('level-title-indicator').innerText = `Level ${currentLevelIndex + 1}`;
    document.getElementById('question-counter').innerText = `Soru: ${currentQuestionIndex + 1} / 10`;
    document.getElementById('score-display').innerText = `Puan: ${score}`;
    document.getElementById('question-text').innerText = currentQ.soru;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = "";

    currentQ.secenekler.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerText = option;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(selectedIndex, selectedBtn) {
    if (answered) return;
    answered = true;
    const currentQ = levelsData[currentLevelIndex][currentQuestionIndex];
    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");

    if (selectedIndex === currentQ.dogru) {
        selectedBtn.classList.add("correct");
        score += 10;
        document.getElementById('score-display').innerText = `Puan: ${score}`;
    } else {
        selectedBtn.classList.add("incorrect");
        buttons[currentQ.dogru].classList.add("correct");
    }

    for (let btn of buttons) { btn.disabled = true; }

    if (currentQuestionIndex < 9) {
        document.getElementById('next-btn').style.display = "block";
    } else {
        setTimeout(showResults, 1000);
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function showResults() {
    showScreen('score-screen');
    let starsEarned = 0;
    if (score >= 30) starsEarned = 1;
    if (score >= 70) starsEarned = 2;
    if (score >= 100) starsEarned = 3;

    let previousStars = userProgress.levels[currentLevelIndex] ? userProgress.levels[currentLevelIndex].stars : 0;
    
    if (starsEarned > previousStars) {
        let diff = starsEarned - previousStars;
        userProgress.totalStars = (userProgress.totalStars || 0) + diff;
        userProgress.levels[currentLevelIndex] = { stars: starsEarned, score: score, unlocked: true };
    } else if (!userProgress.levels[currentLevelIndex]) {
        userProgress.levels[currentLevelIndex] = { stars: starsEarned, score: score, unlocked: true };
        userProgress.totalStars = (userProgress.totalStars || 0) + starsEarned;
    }

    let coinsEarned = Math.floor(score / 10);
    userProgress.totalCoins = (userProgress.totalCoins || 0) + coinsEarned;

    if (starsEarned >= 1 && currentLevelIndex + 1 < 40) {
        if (!userProgress.levels[currentLevelIndex + 1]) {
            userProgress.levels[currentLevelIndex + 1] = { stars: 0, score: 0, unlocked: true };
        } else {
            userProgress.levels[currentLevelIndex + 1].unlocked = true;
        }
    }

    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel();

    let starsDisplay = '☆☆☆';
    if (starsEarned === 1) starsDisplay = '⭐☆☆';
    if (starsEarned === 2) starsDisplay = '⭐⭐☆';
    if (starsEarned === 3) starsDisplay = '⭐⭐⭐';

    document.getElementById('result-stars').innerText = starsDisplay;
    document.getElementById('final-score-text').innerText = `Toplam Puanınız: ${score} / 100\nKazanılan Coin: ${coinsEarned} 🪙`;
}

function restartLevel() {
    startLevel(currentLevelIndex);
}
