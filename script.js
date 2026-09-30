// --- GİRİŞ EKRANI KONTROLÜ ---
document.addEventListener("DOMContentLoaded", function() {
    let percent = 0;
    const percentDisplay = document.getElementById('splash-percent');
    
    const interval = setInterval(() => {
        percent += Math.floor(Math.random() * 5) + 1;
        if (percent >= 100) {
            percent = 100;
            clearInterval(interval);
            setTimeout(() => {
                const splash = document.getElementById('splash-screen');
                if (splash) {
                    splash.style.opacity = '0';
                    setTimeout(() => {
                        splash.style.display = 'none';
                        showMenuScreen();
                    }, 500);
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
        console.log("Sorular yüklendi! Toplam kategori:", levelsData.length);
    } catch (error) {
        console.error("Hata:", error);
    }
}
loadAllQuestions();

let currentLevelIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let answered = false;
let timerInterval;

let userProgress = JSON.parse(localStorage.getItem('futbol_quiz_progress')) || {
    levels: {},
    totalStars: 0,
    totalCoins: 100
};

if (!userProgress.levels[0]) {
    userProgress.levels[0] = { stars: 0, score: 0, unlocked: true };
}

const categoryEmojis = {
    1: { icon: "🏆", role: "DÜNYA KUPASI" }, 2: { icon: "⭐", role: "ŞAMPİYONLAR" },
    3: { icon: "🇹🇷", role: "TÜRK FUTBOLU" }, 4: { icon: "🦁", role: "PREMIER LİG" },
    5: { icon: "🇪🇸", role: "LA LIGA" }, 6: { icon: "🇮🇹", role: "SERIE A" },
    7: { icon: "🇩🇪", role: "BUNDESLIGA" }, 8: { icon: "🇫🇷", role: "LIGUE 1" },
    9: { icon: "🥇", role: "BALLON D'OR" }, 10: { icon: "🏅", role: "AVRUPA LİGİ" },
    11: { icon: "🌍", role: "MİLLİ TAKIMLAR" }, 12: { icon: "🇶🇦", role: "DÜNYA KUPASI 22" },
    13: { icon: "👑", role: "EFSANELER" }, 14: { icon: "🌱", role: "GENÇ YETENEKLER" },
    15: { icon: "🧤", role: "KALECİLER" }, 16: { icon: "🛡️", role: "DEFANSLAR" },
    17: { icon: "🎩", role: "ORTA SAHA" }, 18: { icon: "⚽", role: "FORVETLER" },
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
        if (q.dogru_cevap === 'A') dogruIndex = 0;
        else if (q.dogru_cevap === 'B') dogruIndex = 1;
        else if (q.dogru_cevap === 'C') dogruIndex = 2;
        else if (q.dogru_cevap === 'D') dogruIndex = 3;
    }
    return { soru: q.soru, secenekler, dogru: dogruIndex };
}

function showLevelScreen() {
    const container = document.getElementById('levels-container');
    container.innerHTML = '';
    updateTopPanel();

    if (levelsData.length === 0) { container.innerHTML = "<p style='color:#fff;'>Yükleniyor...</p>"; return; }

    for (let i = 0; i < 40; i++) {
        let progress = userProgress.levels[i] || { stars: 0, score: 0, unlocked: false };
        let catData = levelsData[i] || { kategori: `LEVEL ${i+1}` };
        let catName = catData.kategori || catData.kategori_adi || `LEVEL ${i+1}`;
        let catId = catData.kategori_id || (i+1);
        let isUnlocked = (i === 0) || (userProgress.levels[i-1] && userProgress.levels[i-1].stars > 0);
        let emojiData = getCategoryEmoji(catId);

        let starsStr = '☆☆☆';
        if (progress.stars === 1) starsStr = '⭐☆☆';
        if (progress.stars === 2) starsStr = '⭐⭐☆';
        if (progress.stars === 3) starsStr = '⭐⭐⭐';

        let progressPercent = (progress.score / 100) * 100;

        let card = document.createElement('div');
        card.className = 'level-card' + (isUnlocked ? '' : ' locked');
        card.innerHTML = `
            <div class="level-avatar-box"><div class="level-avatar-icon">${emojiData.icon}</div><div class="level-avatar-role">${emojiData.role}</div></div>
            <div class="level-info">
                <div class="level-title">${catName}</div>
                <div class="level-progress-bar"><div class="level-progress-fill" style="width:${progressPercent}%"></div><div class="level-progress-text">${progress.score}/100</div></div>
                <div class="level-stars">${starsStr}</div>
            </div>
            <div class="level-status">${isUnlocked ? '🏆' : '🔒'}</div>`;

        if (isUnlocked) card.onclick = () => startLevel(i);
        else card.onclick = () => alert("Bu level kilitli!");
        container.appendChild(card);
    }
    showScreen('levels-screen');
}

function startLevel(index) {
    currentLevelIndex = index;
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    if (!levelsData[index] || levelsData[index].sorular.length === 0) { alert("Soru yok!"); return; }
    showScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    answered = false;
    clearInterval(timerInterval);
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
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });

    // Süre başlat
    let timeLeft = 30;
    document.getElementById('timer-text').innerText = timeLeft + 's';
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').innerText = timeLeft + 's';
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (!answered) {
                answered = true;
                const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");
                for (let btn of buttons) btn.disabled = true;
                buttons[currentQ.dogru].classList.add("correct");
                setTimeout(nextQuestion, 1500);
            }
        }
    }, 1000);
}

function selectOption(selectedIndex, selectedBtn) {
    if (answered) return;
    answered = true;
    clearInterval(timerInterval);

    let currentQ = normalizeQuestion(levelsData[currentLevelIndex].sorular[currentQuestionIndex]);
    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");

    if (selectedIndex === currentQ.dogru) {
        selectedBtn.classList.add("correct");
        score += 100;
        correctCount++;
    } else {
        selectedBtn.classList.add("incorrect");
        if (buttons[currentQ.dogru]) buttons[currentQ.dogru].classList.add("correct");
    }

    for (let btn of buttons) btn.disabled = true;
    setTimeout(nextQuestion, 1200);
}

function nextQuestion() {
    if (currentQuestionIndex < levelsData[currentLevelIndex].sorular.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    clearInterval(timerInterval);
    showScreen('score-screen');

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

    userProgress.totalCoins += Math.floor(score / 100);
    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));

    let starsDisplay = '☆☆☆';
    if (starsEarned === 1) starsDisplay = '⭐☆☆';
    if (starsEarned === 2) starsDisplay = '⭐⭐☆';
    if (starsEarned === 3) starsDisplay = '⭐⭐⭐';

    document.getElementById('result-stars').innerText = starsDisplay;
    document.getElementById('final-score-text').innerText = `SKOR: ${score}`;
    document.getElementById('final-correct-text').innerText = `Doğru Sayısı: ${correctCount}/${totalQ}`;
}

function restartLevel() { startLevel(currentLevelIndex); }

function resetGame() {
    if(confirm("Tüm ilerlemen silinecek. Emin misin?")) {
        localStorage.removeItem('futbol_quiz_progress');
        location.reload();
    }
}

function watchAdForStars() {
    alert("Reklam izleniyor... (Simülasyon)");
    setTimeout(() => {
        userProgress.totalStars += 5;
        localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
        updateTopPanel();
        alert("Tebrikler! 5 yıldız kazandın. ⭐");
        showLevelScreen();
    }, 1500);
}
