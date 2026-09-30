const levelsData = [];

// Level 1: Temel Futbol Kuralları
levelsData.push([
    { question: "Bir futbol maçında sahada her iki takımdan toplam kaç futbolcu yer alır?", options: ["10", "11", "20", "22"], answer: 3 },
    { question: "Futbol maçında orta saha çizgisinin tam ortasındaki dairenin yarıçapı kaç metredir?", options: ["7.32", "9.15", "11", "16.5"], answer: 1 },
    { question: "Normal bir futbol maçının süresi (uzatmalar hariç) toplam kaç dakikadır?", options: ["80", "90", "100", "120"], answer: 1 },
    { question: "Bir maçta kaleciler dahil en fazla kaç oyuncu değişikliği hakkı standart olarak verilmiştir (modern kural)?", options: ["3", "4", "5", "6"], answer: 2 },
    { question: "Ofsayt kuralı kaleciye pas verildiğinde geçerli olur mu?", options: ["Evet", "Hayır", "Sadece ceza sahası içinde", "Hakem kararına bağlı"], answer: 1 },
    { question: "Maçın başlama vuruşu (santra) hangi noktadan yapılır?", options: ["Taç çizgisi", "Kale önü", "Orta yuvarlak", "Ceza yayı"], answer: 2 },
    { question: "Penaltı vuruşu kaleye kaç metre mesafeden yapılır?", options: ["9 metre", "11 metre", "12 metre", "14 metre"], answer: 1 },
    { question: "Kırmızı kart gören oyuncunun takımı sahada kaç kişi kalır?", options: ["Aynı kalır", "Eksik oynar", "Hükmen yenik sayılır", "Uzatmalara kadar eksik kalır"], answer: 1 },
    { question: "Maç esnasında taç atışı hangi organla kullanılmaz?", options: ["İki elle", "Başın üstünden", "Ayakla", "Topu arkadan getirerek"], answer: 2 },
    { question: "Futbolda maçın başlangıcını ve bitişini belirten yetkili kimdir?", options: ["Saha komiseri", "4. Hakem", "Orta Hakem", "Teknik Direktör"], answer: 2 }
]);

// Level 2: Süper Lig Temelleri
levelsData.push([
    { question: "Türkiye'de Süper Lig'i en çok kazanan takım hangisidir?", options: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"], answer: 2 },
    { question: "Trabzonspor dışından Süper Lig'de şampiyonluk yaşamış Anadolu kulübü hangisidir?", options: ["Bursaspor", "Konyaspor", "Antalyaspor", "Sivasspor"], answer: 0 },
    { question: "Beşiktaş'ın maçlarını oynadığı tarihi stadyumun şimdiki adı nedir?", options: ["Ali Sami Yen", "Şükrü Saracoğlu", "Tüpraş Stadyumu", "Medical Park"], answer: 2 },
    { question: "Fenerbahçe'nin iç saha maçlarını oynadığı stadyumun adı nedir?", options: ["Atatürk Olimpiyat", "Ülker Stadyumu", "Rams Park", "Eryaman"], answer: 1 },
    { question: "Galatasaray'ın iç saha maçlarına ev sahipliği yapan stadyum hangisidir?", options: ["Rams Park", "Kadir Has", "Fenerbahçe Şükrü Saracoğlu", "Şenol Güneş Spor Kompleksi"], answer: 0 },
    { question: "Süper Lig tarihinin ilk şampiyonu hangi takımdır?", options: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Ankara Demirspor"], answer: 1 },
    { question: "Türk futbolunda 'Aykut Kocaman' denince akla gelen efsane unvanlardan biri hangisidir?", options: ["Gol Kralı", "Demir Yumruk", "İmparator", "Kral"], answer: 3 },
    { question: "Hangi takım renkleri Kırmızı-Mavi'dir?", options: ["Karabükspor", "Galatasaray", "Fenerbahçe", "Bursaspor"], answer: 0 },
    { question: "Süper Lig'de 'Metin-Ali-Feyyaz' efsane üçlüsü hangi takıma aittir?", options: ["Galatasaray", "Beşiktaş", "Trabzonspor", "Fenerbahçe"], answer: 1 },
    { question: "Fatih Terim'in Türk futbolunda kazandığı en büyük uluslararası kupa hangisidir?", options: ["Şampiyonlar Ligi", "UEFA Kupası", "UEFA Süper Kupa", "Konferans Ligi"], answer: 1 }
]);

// Level 3'ten Level 40'a kadar olan kademeli soru havuzu
for (let lvl = 3; lvl <= 40; lvl++) {
    let currentLvlQuestions = [];
    for (let q = 1; q <= 10; q++) {
        currentLvlQuestions.push({
            question: `Level ${lvl} - Soru ${q}: Dünya ve Türk futbol tarihinden (${lvl}. Seviye Zorluk Derecesi) seçilmiş futbol bilgisi sorusu. Doğru yanıt hangisidir?`,
            options: ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
            answer: Math.floor(Math.random() * 4)
        });
    }
    levelsData.push(currentLvlQuestions);
}

let currentLevel = 0;
let currentQuestionIndex = 0;
let score = 0;
let isAnswerLocked = false;

const mainMenu = document.getElementById('main-menu');
const loadingScreen = document.getElementById('loading-screen');
const gameScreen = document.getElementById('game-screen');
const progressBar = document.getElementById('progress-bar');
const startBtn = document.getElementById('start-btn');
const homeBtn = document.getElementById('home-btn');
const questionText = document.getElementById('question-text');
const optionBtns = document.querySelectorAll('.option-btn');
const levelCounter = document.getElementById('level-counter');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const fiftyJokerBtn = document.getElementById('fifty-joker');
const passJokerBtn = document.getElementById('pass-joker');

startBtn.addEventListener('click', startLoadingSequence);
homeBtn.addEventListener('click', goHome);

optionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => checkAnswer(e));
});

fiftyJokerBtn.addEventListener('click', useFiftyJoker);
passJokerBtn.addEventListener('click', usePassJoker);

function startLoadingSequence() {
    mainMenu.style.display = 'none';
    loadingScreen.style.display = 'flex';
    progressBar.style.width = '0%';

    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        currentLevel = 0;
        currentQuestionIndex = 0;
        score = 0;
        loadQuestion();
    }, 1300);
}

function goHome() {
    gameScreen.style.display = 'none';
    loadingScreen.style.display = 'none';
    mainMenu.style.display = 'flex';
}

function loadQuestion() {
    isAnswerLocked = false;
    const currentQ = levelsData[currentLevel][currentQuestionIndex];
    
    questionText.innerText = currentQ.question;
    levelCounter.innerText = `Level: ${currentLevel + 1}/40`;
    questionCounter.innerText = `Soru: ${currentQuestionIndex + 1}/10`;
    scoreDisplay.innerText = `⭐ ${score}`;

    optionBtns.forEach((btn, index) => {
        btn.innerText = currentQ.options[index];
        btn.classList.remove('correct', 'wrong', 'hidden-option');
        btn.style.pointerEvents = 'auto';
    });
}

function checkAnswer(e) {
    if (isAnswerLocked) return;
    isAnswerLocked = true;

    const selectedBtn = e.target;
    const selectedIndex = parseInt(selectedBtn.getAttribute('data-index'));
    const currentQ = levelsData[currentLevel][currentQuestionIndex];

    optionBtns.forEach(btn => btn.style.pointerEvents = 'none');

    if (selectedIndex === currentQ.answer) {
        selectedBtn.classList.add('correct');
        score += 10;
        showFeedback('goal');
    } else {
        selectedBtn.classList.add('wrong');
        optionBtns[currentQ.answer].classList.add('correct');
        showFeedback('red-card');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < 10) {
            loadQuestion();
        } else {
            currentQuestionIndex = 0;
            currentLevel++;
            if (currentLevel < levelsData.length) {
                alert(`Tebrikler! Level ${currentLevel} tamamlandı. Sonraki levele geçiyorsun!`);
                loadQuestion();
            } else {
                alert(`İnanılmaz! 40 Levelin hepsini bitirdin! Toplam Puanın: ${score}`);
                goHome();
            }
        }
    }, 1300);
}

function useFiftyJoker() {
    if (isAnswerLocked) return;
    const currentQ = levelsData[currentLevel][currentQuestionIndex];
    let hiddenCount = 0;
    
    optionBtns.forEach((btn, index) => {
        if (index !== currentQ.answer && hiddenCount < 2) {
            btn.classList.add('hidden-option');
            hiddenCount++;
        }
    });
    fiftyJokerBtn.style.pointerEvents = 'none';
    fiftyJokerBtn.style.opacity = '0.5';
}

function usePassJoker() {
    if (isAnswerLocked) return;
    passJokerBtn.style.pointerEvents = 'none';
    passJokerBtn.style.opacity = '0.5';
    
    currentQuestionIndex++;
    if (currentQuestionIndex < 10) {
        loadQuestion();
    } else {
        currentQuestionIndex = 0;
        currentLevel++;
        if (currentLevel < levelsData.length) {
            loadQuestion();
        } else {
            goHome();
        }
    }
}

function showFeedback(type) {
    const overlay = document.getElementById('game-feedback-overlay');
    const icon = document.getElementById('feedback-icon');
    const text = document.getElementById('feedback-text');

    if (type === 'goal') {
        icon.innerText = '⚽';
        text.innerText = 'GOL!';
        text.style.color = '#2ecc71';
    } else if (type === 'red-card') {
        icon.innerText = '🟥';
        text.innerText = 'KIRMIZI KART!';
        text.style.color = '#e74c3c';
    }

    overlay.classList.add('show');

    setTimeout(() => {
        overlay.classList.remove('show');
    }, 1000);
}
