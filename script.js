// Açılış yükleme animasyonu (Splash Screen)
let loadProgress = 0;
const progressFill = document.getElementById("progress-fill");
const loadingText = document.getElementById("loading-text");
const splashScreen = document.getElementById("splash-screen");
const mainMenu = document.getElementById("main-menu");

const loadingInterval = setInterval(() => {
    loadProgress += 4;
    if (loadProgress <= 100) {
        progressFill.style.width = loadProgress + "%";
        loadingText.textContent = `LOADING... ${loadProgress}%`;
    } else {
        clearInterval(loadingInterval);
        splashScreen.classList.add("hidden");
        mainMenu.classList.remove("hidden");
    }
}, 30);

// Ayarlar Modal Kontrolleri
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettings = document.getElementById("close-settings");

settingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("hidden");
});

closeSettings.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
});

// OYUN VE SORU HAVUZU MOTORU
const gameScreen = document.getElementById("game-screen");
const questionTextEl = document.getElementById("question-text");
const optionBtns = [
    document.getElementById("opt-0"),
    document.getElementById("opt-1"),
    document.getElementById("opt-2"),
    document.getElementById("opt-3")
];
const currentQNumEl = document.getElementById("current-question-num");
const scoreValEl = document.getElementById("score-val");

// Örnek Soru Havuzu (150 soruluk dev havuzun ilk örnekleri)
const questionBank = [
    {
        question: "Süper Lig tarihinde bir sezonlukta en çok gol atan (38 gol) futbolcu kimdir?",
        options: ["Alex de Souza", "Mario Jardel", "Tanju Çolak", "Mbaye Diagne"],
        answer: 2 // Tanju Çolak (1987-1988)
    },
    {
        question: "UEFA Kupası'nı (Şu anki UEFA Avrupa Ligi) kazanan ilk ve tek Türk futbol kulübü hangisidir?",
        options: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"],
        answer: 2
    },
    {
        question: "A Milli Futbol Takımımız, 2002 FIFA Dünya Kupası'nda hangi dereceden kürsüye çıkmıştır?",
        options: ["Şampiyon", "İkinci", "Üçüncü", "Dördüncü"],
        answer: 2
    },
    {
        question: "Hangi futbolcu Süper Lig tarihinde 200 gol barajını aşan ilk yabancı oyuncudur?",
        options: ["Alex de Souza", "Ferdinand Coly", "Bafétimbi Gomis", "Muslera"],
        answer: 0
    },
    {
        question: "Türk futbolunun efsanevi teknik direktörlerinden 'İmparator' lakaplı isim kimdir?",
        options: ["Şenol Güneş", "Fatih Terim", "Mustafa Denizli", "Aykut Kocaman"],
        answer: 1
    }
];

let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let lockOptions = false;

function startLevel(levelNum) {
    currentLevel = levelNum;
    currentQuestionIndex = 0;
    score = 0;
    scoreValEl.textContent = score;
    
    mainMenu.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    
    loadQuestion();
}

function loadQuestion() {
    lockOptions = false;
    const q = questionBank[currentQuestionIndex];
    questionTextEl.textContent = q.question;
    currentQNumEl.textContent = currentQuestionIndex + 1;
    
    for (let i = 0; i < 4; i++) {
        optionBtns[i].textContent = q.options[i];
        optionBtns[i].classList.remove("correct", "wrong");
    }
}

function checkAnswer(selectedOptionIndex) {
    if (lockOptions) return;
    lockOptions = true;
    
    const q = questionBank[currentQuestionIndex];
    const correctIndex = q.answer;
    
    if (selectedOptionIndex === correctIndex) {
        optionBtns[selectedOptionIndex].classList.add("correct");
        score += 20;
        scoreValEl.textContent = score;
    } else {
        optionBtns[selectedOptionIndex].classList.add("wrong");
        optionBtns[correctIndex].classList.add("correct");
    }
    
    // 1.5 saniye sonra sonraki soruya geç veya bitir
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questionBank.length) {
            loadQuestion();
        } else {
            alert(`Tebrikler Level ${currentLevel} tamamlandı! Toplam Puanın: ${score}`);
            backToMenu();
        }
    }, 1500);
}

function backToMenu() {
    gameScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");
}
