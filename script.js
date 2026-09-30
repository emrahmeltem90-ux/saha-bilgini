// Açılış yükleme animasyonu (Splash Screen)
let loadProgress = 0;
const progressFill = document.getElementById("progress-fill");
const loadingText = document.getElementById("loading-text");
const splashScreen = document.getElementById("splash-screen");
const mainMenu = document.getElementById("main-menu");

const loadingInterval = setInterval(() => {
    loadProgress += 5;
    if (loadProgress <= 100) {
        progressFill.style.width = loadProgress + "%";
        loadingText.textContent = `LOADING... ${loadProgress}%`;
    } else {
        clearInterval(loadingInterval);
        splashScreen.classList.add("hidden");
        mainMenu.classList.remove("hidden");
        updateMenuUI();
    }
}, 30);

// Oyun Verileri ve Kayıt (LocalStorage)
let gameState = JSON.parse(localStorage.getItem("sahaBilginiState")) || {
    stars: 0,
    coins: 100,
    levelProgress: { 1: 0, 2: 0, 3: 0 } // Tamamlanan soru sayıları
};

function saveGame() {
    localStorage.setItem("sahaBilginiState", JSON.stringify(gameState));
}

// 10'ar soruluk level tabanlı soru havuzu
const questionBanks = {
    1: [
        { q: "Süper Lig tarihinde bir sezonda en çok gol atan (38 gol) futbolcu kimdir?", options: ["Alex de Souza", "Mario Jardel", "Tanju Çolak", "Mbaye Diagne"], a: 2 },
        { q: "UEFA Kupası'nı kazanan ilk ve tek Türk futbol kulübü hangisidir?", options: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"], a: 2 },
        { q: "A Milli Takımımız, 2002 FIFA Dünya Kupası'nda hangi dereceyi elde etmiştir?", options: ["Şampiyon", "İkinci", "Üçüncü", "Dördüncü"], a: 2 },
        { q: "Süper Lig tarihinde 200 gol barajını aşan ilk yabancı oyuncu kimdir?", options: ["Alex de Souza", "Ferdinand Coly", "Bafétimbi Gomis", "Muslera"], a: 0 },
        { q: "Türk futbolunun 'İmparator' lakaplı teknik direktörü kimdir?", options: ["Şenol Güneş", "Fatih Terim", "Mustafa Denizli", "Aykut Kocaman"], a: 1 },
        { q: "Hangi stadyum Galatasaray'ın iç saha maçlarına ev sahipliği yapar?", options: ["Şükrü Saracoğlu", "Rams Park", "Vodafone Park", "Medical Park"], a: 1 },
        { q: "Fenerbahçe'nin efsanevi kaptanı ve Brezilyalı 10 numarası kimdir?", options: ["Roberto Carlos", "Appiah", "Alex de Souza", "Anelka"], a: 2 },
        { q: "Beşiktaş'ın efsanevi başkanı merhum kimdir?", options: ["Süleyman Seba", "Metin Oktay", "Turgay Şeren", "Özkan Sümer"], a: 0 },
        { q: "Türkiye'de düzenlenen 2005 UEFA Şampiyonlar Ligi Finali hangi statta oynanmıştır?", options: ["İzmir Atatürk", "Atatürk Olimpiyat", "Şükrü Saracoğlu", "Ali Sami Yen"], a: 1 },
        { q: "Hangi takım Süper Lig'in ilk sezonu olan 1959'da şampiyon olmuştur?", options: ["Galatasaray", "Beşiktaş", "Fenerbahçe", "Trabzonspor"], a: 2 }
    ],
    2: [
        { q: "Süper Lig'de 'Kral' lakaplı, Galatasaray'ın unutulmaz simge ismi kimdir?", options: ["Metin Oktay", "Hakan Şükür", "Arda Turan", "Bülent Korkmaz"], a: 0 },
        { q: "A Milli Takımımız ile Euro 2008'de yarı finale kalan teknik direktör kimdir?", options: ["Fatih Terim", "Şenol Güneş", "Mustafa Denizli", "Abdullah Avcı"], a: 0 },
        { q: "Şampiyonlar Ligi'ni kazanan ilk ve tek Türk kökenli teknik direktör kimdir?", options: ["Mesut Özil", "Nuri Şahin", "İlkay Gündoğan", "Hiçbiri (Teknik direktör olarak kazanan yok)"], a: 3 },
        { q: "Trabzonspor'un Karadeniz Fırtınası lakaplı döneminde Anadolu'dan şampiyon çıkaran ilk teknik direktör kimdir?", options: ["Ahmet Suat Özyazıcı", "Şenol Güneş", "Özkan Sümer", "Gündüz Tekin Onay"], a: 0 },
        { q: "Hangi kaleci 'Taçsız Kral' lakabıyla anılmaz, kaleci olarak 'Kedi' lakabıyla bilinir?", options: ["Turgay Şeren", "Rüştü Reçber", "Muslera", "Volkan Demirel"], a: 0 },
        { q: "Dünya Kupası tarihinin en çok gol atan futbolcusu kimdir?", options: ["Pele", "Miroslav Klose", "Ronaldo Nazario", "Lionel Messi"], a: 1 },
        { q: "La Liga'da Real Madrid forması giyen ilk Türk futbolcu kimdir?", options: ["Arda Güler", "Hamit Altıntop", "Nuri Şahin", "Mesut Özil"], a: 0 },
        { q: "İngiltere Premier Lig'de 'The Special One' lakaplı teknik direktör kimdir?", options: ["Pep Guardiola", "Jurgen Klopp", "Jose Mourinho", "Carlo Ancelotti"], a: 2 },
        { q: "Hangi futbolcu kariyerinde 8 kez Ballon d'Or kazanmıştır?", options: ["Cristiano Ronaldo", "Lionel Messi", "Zinedine Zidane", "Michel Platini"], a: 1 },
        { q: "Türkiye futbol tarihinde Süper Lig'i kazanan Anadolu kulüpleri hangileridir?", options: ["Trabzonspor ve Bursaspor", "Sivasspor ve Konya", "Kocaelispor ve Sakarya", "Göztepe ve Altay"], a: 0 }
    ],
    3: [
        { q: "1996 yılında UEFA Kupası'nı kazanan Bayern Münih'i deviren Alman ekibi değil, UEFA'da Galatasaray'ın elediği ilk tur rakibi hangisiydi?", options: ["Sparta Prag", "Rapid Wien", "Sion", "Borussia Dortmund"], a: 2 },
        { q: "Türkiye'de profesyonel ligler kaç yılında kurulmuştur?", options: ["1923", "1959", "1965", "1970"], a: 1 },
        { q: "Millî takım formasını en çok giyen futbolcu kimdir?", options: ["Rüştü Reçber", "Bülent Korkmaz", "Hakan Şükür", "Emre Belözoğlu"], a: 0 },
        { q: "Fenerbahçe formasıyla bir maçta 4 gol atan yabancı orta saha oyuncusu kimdir?", options: ["Alex de Souza", "Jay-Jay Okocha", "Stephen Appiah", "Dirk Kuyt"], a: 0 },
        { q: "Beşiktaş'ın 100. yıl şampiyonluğunda teknik direktörlük yapan isim kimdir?", options: ["Mircea Lucescu", "Fatih Terim", "Del Bosque", "Sergen Yalçın"], a: 0 },
        { q: "Avrupa kupalarında en çok maç yöneten Türk hakem kimdir?", options: ["Cüneyt Çakır", "Doğan Babacan", "Ahmet Çakar", "Ali Palabıyık"], a: 0 },
        { q: "1954 FIFA Dünya Kupası'nda Türkiye'nin grup maçlarında kura ile elendiği rakip kimdi?", options: ["İspanya", "Batı Almanya", "İtalya", "Macaristan"], a: 0 },
        { q: "Galatasaray'ın UEFA Kupası finalinde Arsenal'i penaltılarla yendiği maç hangi şehirde oynandı?", options: ["Kopenhag", "Paris", "Madrid", "Glasgow"], a: 0 },
        { q: "Süper Lig tarihinde aralıksız en uzun süre gol yememe rekoru kıran kaleci kimdir?", options: ["Şenol Güneş", "Muslera", "Claudio Taffarel", "Mondragon"], a: 0 },
        { q: "Altın Ayakkabı (European Golden Shoe) ödülünü kazanan ilk Türk futbolcu kimdir?", options: ["Hakan Şükür", "Tanju Çolak", "Metin Oktay", "Burak Yılmaz"], a: 1 }
    ]
};

// UI Güncelleme Fonksiyonu
function updateMenuUI() {
    document.getElementById("star-count").textContent = gameState.stars;
    document.getElementById("coin-count").textContent = gameState.coins;

    // Level 1 Durumu
    let p1 = gameState.levelProgress[1] || 0;
    document.getElementById("l1-bar").style.width = (p1 * 10) + "%";
    document.getElementById("l1-text").textContent = `${p1}/10 Soru`;

    // Level 2 Kilit Kontrolü (Level 1'de en az 5 yıldız veya 5 soru çözülmüş olmalı)
    const cardL2 = document.getElementById("card-level-2");
    const l2Text = document.getElementById("l2-text");
    const l2Lock = document.getElementById("l2-lock");
    if (gameState.stars >= 5 || p1 >= 5) {
        cardL2.classList.remove("locked");
        let p2 = gameState.levelProgress[2] || 0;
        document.getElementById("l2-bar").style.width = (p2 * 10) + "%";
        l2Text.textContent = `${p2}/10 Soru`;
        l2Lock.textContent = "➡️";
    } else {
        cardL2.classList.add("locked");
        l2Text.textContent = "Kilitli (5 ⭐ Gerekli)";
        l2Lock.textContent = "🔒";
    }

    // Level 3 Kilit Kontrolü (Toplam 15 yıldız gerekli)
    const cardL3 = document.getElementById("card-level-3");
    const l3Text = document.getElementById("l3-text");
    const l3Lock = document.getElementById("l3-lock");
    if (gameState.stars >= 15) {
        cardL3.classList.remove("locked");
        let p3 = gameState.levelProgress[3] || 0;
        document.getElementById("l3-bar").style.width = (p3 * 10) + "%";
        l3Text.textContent = `${p3}/10 Soru`;
        l3Lock.textContent = "➡️";
    } else {
        cardL3.classList.add("locked");
        l3Text.textContent = "Kilitli (15 ⭐ Gerekli)";
        l3Lock.textContent = "🔒";
    }
}

// Reklam İzleme Simülasyonu
function watchAdForStars() {
    alert("📺 Reklam oynatılıyor... (Simülasyon)");
    setTimeout(() => {
        gameState.stars += 5;
        saveGame();
        updateMenuUI();
        alert("🎉 Tebrikler! Reklam izlendi ve +5 ⭐ hesabınıza eklendi!");
    }, 1000);
}

// Oyunu Sıfırla
function resetGameData() {
    if (confirm("Tüm ilerlemeniz sıfırlanacak. Emin misiniz?")) {
        localStorage.removeItem("sahaBilginiState");
        gameState = { stars: 0, coins: 100, levelProgress: { 1: 0, 2: 0, 3: 0 } };
        updateMenuUI();
        settingsModal.classList.add("hidden");
        alert("Oyun sıfırlandı.");
    }
}

// Ayarlar Modal Kontrolleri
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettings = document.getElementById("close-settings");

settingsBtn.addEventListener("click", () => settingsModal.classList.remove("hidden"));
closeSettings.addEventListener("click", () => settingsModal.classList.add("hidden"));

// OYUN VE SORU MOTORU
const gameScreen = document.getElementById("game-screen");
const questionTextEl = document.getElementById("question-text");
const optionBtns = [
    document.getElementById("opt-0"),
    document.getElementById("opt-1"),
    document.getElementById("opt-2"),
    document.getElementById("opt-3")
];
const currentQNumEl = document.getElementById("current-question-num");
const gameStarValEl = document.getElementById("game-star-val");

let currentLevel = 1;
let currentQuestionIndex = 0;
let currentBank = [];
let lockOptions = false;

function startLevel(levelNum) {
    // Kilit kontrolü
    if (levelNum === 2 && gameState.stars < 5 && (gameState.levelProgress[1] || 0) < 5) {
        alert("🔒 Bu seviye kilitli! Açmak için en az 5 yıldız toplamalısınız.");
        return;
    }
    if (levelNum === 3 && gameState.stars < 15) {
        alert("🔒 Bu seviye kilitli! Açmak için en az 15 yıldız toplamalısınız.");
        return;
    }

    currentLevel = levelNum;
    currentQuestionIndex = 0;
    currentBank = questionBanks[levelNum];
    
    mainMenu.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameStarValEl.textContent = gameState.stars;
    
    loadQuestion();
}

function loadQuestion() {
    lockOptions = false;
    const q = currentBank[currentQuestionIndex];
    questionTextEl.textContent = q.q;
    currentQNumEl.textContent = currentQuestionIndex + 1;
    
    for (let i = 0; i < 4; i++) {
        optionBtns[i].textContent = q.options[i];
        optionBtns[i].classList.remove("correct", "wrong");
    }
}

function checkAnswer(selectedOptionIndex) {
    if (lockOptions) return;
    lockOptions = true;
    
    const q = currentBank[currentQuestionIndex];
    const correctIndex = q.a;
    
    if (selectedOptionIndex === correctIndex) {
        optionBtns[selectedOptionIndex].classList.add("correct");
        gameState.stars += 1; // Her doğru cevap 1 yıldız
        gameStarValEl.textContent = gameState.stars;
    } else {
        optionBtns[selectedOptionIndex].classList.add("wrong");
        optionBtns[correctIndex].classList.add("correct");
    }
    
    // İlerlemeyi güncelle
    if (currentQuestionIndex + 1 > (gameState.levelProgress[currentLevel] || 0)) {
        gameState.levelProgress[currentLevel] = currentQuestionIndex + 1;
    }
    saveGame();
    
    // 1.5 saniye sonra sonraki soruya geç
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentBank.length) {
            loadQuestion();
        } else {
            alert(`🏆 Tebrikler! Level ${currentLevel} tamamlandı! Toplam Yıldızın: ${gameState.stars}`);
            backToMenu();
        }
    }, 1500);
}

function backToMenu() {
    gameScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    updateMenuUI();
}
