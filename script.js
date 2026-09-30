const questions = [
    {
        question: "Hangi takım Süper Lig tarihinde namağlup şampiyon olan tek takımdır?",
        options: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor"],
        answer: 2
    },
    {
        question: "2026 FIFA Dünya Kupası'na ev sahipliği yapan ülkelerden biri hangisidir?",
        options: ["Almanya", "Brezilya", "Amerika Birleşik Devletleri", "İspanya"],
        answer: 2
    },
    {
        question: "Şampiyonlar Ligi kupasını en çok kazanan kulüp hangisidir?",
        options: ["AC Milan", "Real Madrid", "Bayern Münih", "Barcelona"],
        answer: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let lockAnswer = false;

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const scoreDisplay = document.getElementById("score");
const questionCountDisplay = document.getElementById("question-count");
const nextBtn = document.getElementById("next-btn");

function loadQuestion() {
    lockAnswer = false;
    nextBtn.style.display = "none";
    
    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.question;
    optionsContainer.innerHTML = "";
    
    questionCountDisplay.textContent = `${currentQuestionIndex + 1}/${questions.length}`;

    currentQ.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = option;
        btn.addEventListener("click", () => selectOption(index, btn));
        optionsContainer.appendChild(btn);
    });
}

function selectOption(selectedIndex, selectedBtn) {
    if (lockAnswer) return;
    lockAnswer = true;

    const currentQ = questions[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll(".option-btn");

    if (selectedIndex === currentQ.answer) {
        selectedBtn.classList.add("correct");
        score += 100;
        scoreDisplay.textContent = score;
    } else {
        selectedBtn.classList.add("wrong");
        allButtons[currentQ.answer].classList.add("correct");
    }

    allButtons.forEach(btn => btn.disabled = true);
    nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        questionText.textContent = `Tebrikler! Yarışmayı tamamladın. Toplam Puanın: ${score}`;
        optionsContainer.innerHTML = "";
        nextBtn.style.display = "none";
    }
});

// Oyunu başlat
loadQuestion();
