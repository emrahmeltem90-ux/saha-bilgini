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
                        showLevelScreen();
                    }, 500);
                }
            }, 500);
        }
        if(percentDisplay) percentDisplay.innerText = percent + '%';
    }, 100);
});

// --- TÜM SORULARI YÜKLE (4 DOSYA) ---
let levelsData = [];

async function loadAllQuestions() {
    const files = ['sorular_1.json', 'sorular_2.json', 'sorular_3.json', 'sorular_4.json'];
    
    try {
        for (const file of files) {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`${file} yüklenemedi`);
            const data = await response.json();
            
            let kategoriler = [];
            if (data.kategoriler && Array.isArray(data.kategoriler)) {
                kategoriler = data.kategoriler;
            } else if (Array.isArray(data)) {
                kategoriler = data;
            }
            
            levelsData = levelsData.concat(kategoriler);
        }
        console.log("Tüm sorular başarıyla yüklendi! Toplam kategori:", levelsData.length);
    } catch (error) {
        console.error("Sorular yüklenirken hata oluştu:", error);
        levelsData = [
            { kategori: "Yedek Kategori", sorular: [{ soru: "Yedek Soru?", secenekler: ["A", "B", "C", "D"], dogru: 0 }] }
        ];
    }
}

loadAllQuestions();

let currentLevelIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

let userProgress = JSON.parse(localStorage.getItem('futbol_quiz_progress')) || {
    levels: {},
    totalStars: 0,
    totalCoins: 100
};

if (!userProgress.levels[0]) {
    userProgress.levels[0] = { stars: 0, score: 0, unlocked: true };
}

// --- EMOJİ EŞLEŞTİRME ---
// Her kategori ID'sine karşılık gelen emojiyi burada tanımlıyoruz.
const categoryEmojis = {
    1: { icon: "🏆", role: "DÜNYA KUPASI" },
    2: { icon: "⭐", role: "ŞAMPİYONLAR LİGİ" },
    3: { icon: "🇹🇷", role: "TÜRK FUTBOLU" },
    4: { icon: "🦁", role: "PREMIER LİG" },
    5: { icon: "🇪🇸", role: "LA LIGA" },
    6: { icon: "🇮🇹", role: "SERIE A" },
    7: { icon: "🇩🇪", role: "BUNDESLIGA" },
    8: { icon: "🇫🇷", role: "LIGUE 1" },
    9: { icon: "🥇", role: "BALLON D'OR" },
    10: { icon: "🏅", role: "AVRUPA LİGİ" },
    11: { icon: "🌍", role: "MİLLİ TAKIMLAR" },
    12: { icon: "🇶🇦", role: "DÜNYA KUPASI 2022" },
    13: { icon: "👑", role: "EFSANELER" },
    14: { icon: "🌱", role: "GENÇ YETENEKLER" },
    15: { icon: "🧤", role: "KALECİ EFSANELERİ" },
    16: { icon: "🛡️", role: "DEFANS EFSANELERİ" },
    17: { icon: "🎩", role: "ORTA SAHA" },
    18: { icon: "⚽", role: "FORVET YILDIZLARI" },
    19: { icon: "📋", role: "TEKNİK DİREKTÖRLER" },
    20: { icon: "📜", role: "KURALLAR" },
    21: { icon: "🏟️", role: "AVRUPA KUPALARI" },
    22: { icon: "🌐", role: "MİLLİ TAKIMLAR" },
    23: { icon: "📊", role: "REKORLAR" },
    24: { icon: "♟️", role: "TAKTİKLER" },
    25: { icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", role: "PREMIER LİG" },
    26: { icon: "🇪🇸", role: "LA LIGA" },
    27: { icon: "🇮🇹", role: "SERIE A" },
    28: { icon: "🇩🇪", role: "BUNDESLIGA" },
    29: { icon: "🇫🇷", role: "LIGUE 1" },
    30: { icon: "🥇", role: "BALLON D'OR" },
    31: { icon: "🏆", role: "SÜPER LİG" },
    32: { icon: "🇹🇷", role: "MİLLİ TAKIM" },
    33: { icon: "🦁", role: "GALATASARAY" },
    34: { icon: "🟡", role: "FENERBAHÇE" },
    35: { icon: "🦅", role: "BEŞİKTAŞ" },
    36: { icon: "⚓", role: "TRABZONSPOR" },
    37: { icon: "✈️", role: "AVRUPA'DA TÜRKLER" },
    38: { icon: "📺", role: "TEKNOLOJİ (VAR)" },
    39: { icon: "👩", role: "KADIN FUTBOLU" },
    40: { icon: "🌟", role: "GELECEK YILDIZLAR" }
};

// Eğer tanımlı bir emoji yoksa varsayılan emojiyi kullan
function getCategoryEmoji(categoryId) {
    return categoryEmojis[categoryId] || { icon: "⚽", role: "FUTBOL" };
}

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

function normalizeQuestion(q) {
    let soruMetni = q.soru;
    let secenekler = [];
    let dogruIndex = 0;

    if (Array.isArray(q.secenekler)) {
        secenekler = q.secenekler;
        dogruIndex = q.dogru;
    } 
    else if (typeof q.secenekler === 'object' && q.secenekler !== null) {
        secenekler = [q.secenekler.A, q.secenekler.B, q.secenekler.C, q.secenekler.D];
        const harf = q.dogru_cevap;
        if (harf === 'A') dogruIndex = 0;
        else if (harf === 'B') dogruIndex = 1;
        else if (harf === 'C') dogruIndex = 2;
        else if (harf === 'D') dogruIndex = 3;
    }

    return {
        soru: soruMetni,
        secenekler: secenekler,
        dogru: dogruIndex
    };
}

function showLevelScreen() {
    const container = document.getElementById('levels-container');
    container.innerHTML = '';
    updateTopPanel();

    if (levelsData.length === 0) {
        container.innerHTML = "<p style='color: #fff; text-align: center;'>Sorular yükleniyor...</p>";
        return;
    }

    let totalLevels = 40;

    for (let i = 0; i < totalLevels; i++) {
        let lvlNum = i + 1;
        let progress = userProgress.levels[i] || { stars: 0, score: 0, unlocked: false };
        
        let categoryData = levelsData[i] || { kategori: "Gelecek Kategori", kategori_adi: "Gelecek Kategori", sorular: [] };
        let categoryName = categoryData.kategori || categoryData.kategori_adi || `LEVEL ${lvlNum}`;
        let categoryId = categoryData.kategori_id || (i + 1); // Kategori ID'sini al

        let isUnlocked = (i === 0) || (userProgress.levels[i-1] && userProgress.levels[i-1].stars > 0);

        let card = document.createElement('div');
        card.className = 'level-card' + (isUnlocked ? '' : ' locked');
        
        // --- EMOJİ EŞLEŞTİRMESİ ---
        let emojiData = getCategoryEmoji(categoryId);

        let starsStr = '☆☆☆';
        if (progress.stars === 1) starsStr = '⭐☆☆';
        if (progress.stars === 2) starsStr = '⭐⭐☆';
        if (progress.stars === 3) starsStr = '⭐⭐⭐';

        let progressPercent = (progress.score / 100) * 100;
        let progressText = `${progress.score}/100`;

        card.innerHTML = `
            <div class="level-avatar-box">
                <div class="level-avatar-icon">${emojiData.icon}</div>
                <div class="level-avatar-role">${emojiData.role}</div>
            </div>
            <div class="level-info">
                <div class="level-title">${categoryName}</div>
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
    
    if (!levelsData[levelIndex] || !levelsData[levelIndex].sorular || levelsData[levelIndex].sorular.length === 0) {
        alert("Bu level için henüz soru eklenmemiş. Lütfen daha sonra tekrar dene.");
        return;
    }
    
    showScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    answered = false;
    document.getElementById('next-btn').style.display = "none";
    
    let currentCategory = levelsData[currentLevelIndex];
    let questionsInCategory = currentCategory.sorular;
    
    if (currentQuestionIndex >= questionsInCategory.length) {
        currentQuestionIndex = currentQuestionIndex % questionsInCategory.length;
    }
    
    const rawQ = questionsInCategory[currentQuestionIndex];
    const currentQ = normalizeQuestion(rawQ);
    
    if (!currentQ) {
        document.getElementById('question-text').innerText = "Soru bulunamadı.";
        return;
    }

    let categoryName = currentCategory.kategori || currentCategory.kategori_adi || `Level ${currentLevelIndex + 1}`;
    document.getElementById('level-title-indicator').innerText = categoryName;
    document.getElementById('question-counter').innerText = `Soru: ${currentQuestionIndex + 1} / ${questionsInCategory.length}`;
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
    
    let currentCategory = levelsData[currentLevelIndex];
    let rawQ = currentCategory.sorular[currentQuestionIndex];
    let currentQ = normalizeQuestion(rawQ);
    
    const buttons = document.getElementById('options-container').getElementsByClassName("option-btn");

    if (selectedIndex === currentQ.dogru) {
        selectedBtn.classList.add("correct");
        score += 10;
        document.getElementById('score-display').innerText = `Puan: ${score}`;
    } else {
        selectedBtn.classList.add("incorrect");
        if (buttons[currentQ.dogru]) {
            buttons[currentQ.dogru].classList.add("correct");
        }
    }

    for (let btn of buttons) { btn.disabled = true; }

    if (currentQuestionIndex < currentCategory.sorular.length - 1) {
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
    
    let currentCategory = levelsData[currentLevelIndex];
    let totalPossibleScore = currentCategory.sorular.length * 10;
    let percentage = (score / (totalPossibleScore || 100)) * 100;

    if (percentage >= 30) starsEarned = 1;
    if (percentage >= 70) starsEarned = 2;
    if (percentage >= 100) starsEarned = 3;

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

    localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
    updateTopPanel();

    let starsDisplay = '☆☆☆';
    if (starsEarned === 1) starsDisplay = '⭐☆☆';
    if (starsEarned === 2) starsDisplay = '⭐⭐☆';
    if (starsEarned === 3) starsDisplay = '⭐⭐⭐';

    document.getElementById('result-stars').innerText = starsDisplay;
    document.getElementById('final-score-text').innerText = `Toplam Puanınız: ${score} / ${totalPossibleScore}\nKazanılan Coin: ${coinsEarned} 🪙`;
}

function restartLevel() {
    startLevel(currentLevelIndex);
}

function watchAdForStars() {
    alert("Reklam izleniyor... (Simülasyon)");
    setTimeout(() => {
        userProgress.totalStars = (userProgress.totalStars || 0) + 5;
        localStorage.setItem('futbol_quiz_progress', JSON.stringify(userProgress));
        updateTopPanel();
        alert("Tebrikler! 5 yıldız kazandın. ⭐");
        showLevelScreen();
    }, 1500);
}
