// Örnek Soru Listesi
const questions = [
    {
        question: "Bir futbol maçında sahada her iki takımdan toplam kaç futbolcu yer alır?",
        options: ["10", "11", "20", "22"],
        answer: 3 // 22 index 3
    },
    {
        question: "Türkiye'de Süper Lig'i en çok kazanan takım hangisidir?",
        options: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"],
        answer: 2 // Galatasaray index 2
    },
    {
        question: "Dünya Kupası'nı en çok kazanan milli takım hangisidir?",
        options: ["Almanya", "Brezilya", "Arjantin", "İtalya"],
        answer: 1 // Brezilya index 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let isAnswerLocked = false;

const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const homeBtn = document.getElementById('home-btn');
const questionText = document.getElementById('question-text');
const optionBtns = document.querySelectorAll('.option-btn');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');

startBtn.addEventListener('click', startGame);
homeBtn.addEventListener('click', goHome);

optionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => checkAnswer(e));
});

function startGame() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'flex';
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
    const currentQ = questions[currentQuestionIndex];
    
    questionText.innerText = currentQ.question;
    questionCounter.innerText = `Soru: ${currentQuestionIndex + 1}/${questions.length}`;
    scoreDisplay.innerText = `⭐ ${score}`;

    optionBtns.forEach((btn, index) => {
        btn.innerText = currentQ.options[index];
        btn.classList.remove('correct', 'wrong');
        btn.style.pointerEvents = 'auto';
    });
}

function checkAnswer(e) {
    if (isAnswerLocked) return;
    isAnswerLocked = true;

    const selectedBtn = e.target;
    const selectedIndex = parseInt(selectedBtn.getAttribute('data-index'));
    const currentQ = questions[currentQuestionIndex];

    optionBtns.forEach(btn => btn.style.pointerEvents = 'none');

    if (selectedIndex === currentQ.answer) {
        // Doğru Cevap
        selectedBtn.classList.add('correct');
        score += 10;
        showFeedback('goal');
    } else {
        // Yanlış Cevap
        selectedBtn.classList.add('wrong');
        optionBtns[currentQ.answer].classList.add('correct'); // Doğruyu göster
        showFeedback('red-card');
    }

    // 1.3 saniye sonra sonraki soruya geç veya bitir
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            alert(`Oyun Bitti! Toplam Puanın: ${score}`);
            goHome();
        }
    }, 1300);
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
