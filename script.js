// 40 Level ve her level'da 10'ar soru (Toplam 400 Soru Havuzu)
const levelsData = [];

for (let level = 1; level <= 40; level++) {
    let levelQuestions = [];
    for (let q = 1; q <= 10; q++) {
        levelQuestions.push({
            question: `Level ${level} - Soru ${q}: Profesyonel futbol tarihi ve kültürü üzerine bu seviyeye uygun test sorusu. Doğru yanıt hangisidir?`,
            options: ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
            answer: Math.floor(Math.random() * 4)
        });
    }
    levelsData.push(levelQuestions);
}

let currentLevel = 0;
let currentQuestionIndex = 0;
let score = 0;
let isAnswerLocked = false;

const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const homeBtn = document.getElementById('home-btn');
const questionText = document.getElementById('question-text');
const optionBtns = document.querySelectorAll('.option-btn');
const levelCounter = document.getElementById('level-counter');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const fiftyJokerBtn = document.getElementById('fifty-joker');
const passJokerBtn = document.getElementById('pass-joker');

startBtn.addEventListener('click', startGame);
homeBtn.addEventListener('click', goHome);

optionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => checkAnswer(e));
});

fiftyJokerBtn.addEventListener('click', useFiftyJoker);
passJokerBtn.addEventListener('click', usePassJoker);

function startGame() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'flex';
    currentLevel = 0;
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
}

function goHome() {
    gameScreen.style.display = 'none';
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
