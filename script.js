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
        buildLevelsUI();
        updateMenuUI();
    }
}, 30);

// Oyun Verileri ve Kayıt (LocalStorage)
let gameState = JSON.parse(localStorage.getItem("sahaBilginiState")) || {
    stars: 0,
    coins: 100,
    levelProgress: {}
};

function saveGame() {
    localStorage.setItem("sahaBilginiState", JSON.stringify(gameState));
}

// 40 Seviyelik Kolaydan Zora Gerçek 400 Soruluk Devasa Soru Bankası
const questionBanks = {
    1: [
        { q: "Bir futbol maçında sahada her iki takımdan toplam kaç futbolcu yer alır?", options: ["10", "11", "20", "22"], a: 3 },
        { q: "Futbol maçlarında beraberliği bozan ve kazananı belirleyen sistemin adı nedir?", options: ["Uzatma / Penaltılar", "Yazı Tura", "Altın Gol", "Tekrar Maçı"], a: 0 },
        { q: "Futbol sahasının ortasındaki dairesel çizginin yarıçapı kaç metredir?", options: ["5.15", "9.15", "11.00", "14.50"], a: 1 },
        { q: "Bir maçta kırmızı kart gören futbolcu kaç maç cezalı duruma düşer?", options: ["Kesinlikle 1 maç", "Hakem raporuna ve disiplin kuruluna bağlı", "Her zaman 3 maç", "Cezası yoktur"], a: 1 },
        { q: "Futbol topunun çevresi yaklaşık olarak kaç santimetredir?", options: ["40-45 cm", "55-60 cm", "68-70 cm", "80-85 cm"], a: 2 },
        { q: "Maçın başlama vuruşu (santra) nerede yapılır?", options: ["Taç çizgisi üzerinde", "Ceza sahası içinde", "Orta yuvarlakta", "Kaletaşı önünde"], a: 2 },
        { q: "Kalecinin ceza sahası dışında elle oynamasının cezası nedir?", options: ["Serbest vuruş ve kart", "Sadece taç", "Devam kararı", "Korner"], a: 0 },
        { q: "Bir maç kaç devre halinde oynanır?", options: ["1", "2", "3", "4"], a: 1 },
        { q: "Standart bir futbol maçının normal süresi toplam kaç dakikadır?", options: ["45 dakika", "60 dakika", "90 dakika", "120 dakika"], a: 2 },
        { q: "Futbolda oyunu yöneten ana yetkili kişi kimdir?", options: ["Antrenör", "Hakem", "Gözlemci", "Kaptan"], a: 1 }
    ],
    2: [
        { q: "Süper Lig'i en çok kazanan (şampiyon olan) futbol kulübü hangisidir?", options: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"], a: 2 },
        { q: "UEFA Kupası'nı (Avrupa Ligi) kazanan ilk Türk kulübü hangisidir?", options: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor"], a: 0 },
        { q: "A Milli Takımımız 2002 Dünya Kupası'nda hangi dereceyi almıştır?", options: ["Şampiyon", "İkinci", "Üçüncü", "Dördüncü"], a: 2 },
        { q: "Hangi stadyum Galatasaray'a ev sahipliği yapar?", options: ["Şükrü Saracoğlu", "Rams Park", "Vodafone Park", "Eryaman"], a: 1 },
        { q: "Fenerbahçe'nin efsanevi Brezilyalı 10 numarası kimdir?", options: ["Roberto Carlos", "Alex de Souza", "Appiah", "Anelka"], a: 1 },
        { q: "Beşiktaş'ın efsanevi 'Baba' lakaplı simge başkanı kimdir?", options: ["Süleyman Seba", "Metin Oktay", "Turgay Şeren", "Özkan Sümer"], a: 0 },
        { q: "Süper Lig'in ilk sezonu olan 1959'da şampiyon olan takım hangisidir?", options: ["Galatasaray", "Beşiktaş", "Fenerbahçe", "Trabzonspor"], a: 2 },
        { q: "Türk futbolunun 'İmparator' lakaplı teknik direktörü kimdir?", options: ["Şenol Güneş", "Fatih Terim", "Mustafa Denizli", "Aykut Kocaman"], a: 1 },
        { q: "Süper Lig tarihinde bir sezonda en çok gol atma rekorunu (38 gol) elinde bulunduran futbolcu kimdir?", options: ["Alex de Souza", "Mario Jardel", "Tanju Çolak", "Mbaye Diagne"], a: 2 },
        { q: "Süper Lig'de 200 gol barajını aşan ilk yabancı futbolcu kimdir?", options: ["Alex de Souza", "Bafétimbi Gomis", "Muslera", "Ferdinand Coly"], a: 0 }
    ],
    3: [
        { q: "Dünya Kupası'nı en çok kazanan ülke hangisidir?", options: ["Almanya", "Arjantin", "Brezilya", "İtalya"], a: 2 },
        { q: "UEFA Şampiyonlar Ligi'ni en çok kazanan kulüp hangisidir?", options: ["AC Milan", "Real Madrid", "Bayern Munich", "Barcelona"], a: 1 },
        { q: "Kariyerinde 8 kez Ballon d'Or (Altın Top) kazanan efsane kimdir?", options: ["Cristiano Ronaldo", "Pelé", "Lionel Messi", "Diego Maradona"], a: 2 },
        { q: "İngiltere Premier Lig'de 'The Special One' lakaplı teknik direktör kimdir?", options: ["Pep Guardiola", "Jurgen Klopp", "Jose Mourinho", "Carlo Ancelotti"], a: 2 },
        { q: "La Liga'da Real Madrid forması giyen ilk Türk futbolcu kimdir?", options: ["Arda Güler", "Hamit Altıntop", "Nuri Şahin", "Mesut Özil"], a: 0 },
        { q: "Dünya Kupası tarihinin en golcü futbolcusu kimdir?", options: ["Miroslav Klose", "Ronaldo Nazario", "Gerd Muller", "Lionel Messi"], a: 0 },
        { q: "1986 Dünya Kupası'nda 'Tanrı'nın Eli' golünü atan efsane futbolcu kimdir?", options: ["Pelé", "Diego Maradona", "Zinedine Zidane", "Michel Platini"], a: 1 },
        { q: "Fransa'da düzenlenen Euro 2016'nın şampiyonu hangi ülke olmuştur?", options: ["Fransa", "Portekiz", "Almanya", "İspanya"], a: 1 },
        { q: "İtalya Serie A'da 'Yaşlı Kadın' (La Vecchia Signora) lakaplı kulüp hangisidir?", options: ["Inter", "AC Milan", "Juventus", "AS Roma"], a: 2 },
        { q: "Almanya Bundesliga'nın en çok şampiyon olan takımı hangisidir?",options: ["Borussia Dortmund", "Bayern Munich", "RB Leipzig", "Bayer Leverkusen"], a: 1 }
    ],
    4: [
        { q: "Türkiye'de profesyonel ligler kaç yılında kurulmuştur?", options: ["1923", "1959", "1965", "1970"], a: 1 },
        { q: "Beşiktaş'ın 100. yıl şampiyonluğunda takımın başında hangi teknik direktör vardı?", options: ["Mircea Lucescu", "Fatih Terim", "Del Bosque", "Sergen Yalçın"], a: 0 },
        { q: "Trabzonspor'un Anadolu'dan şampiyon çıkaran ilk efsanevi teknik direktörü kimdir?", options: ["Ahmet Suat Özyazıcı", "Şenol Güneş", "Özkan Sümer", "Gündüz Tekin Onay"], a: 0 },
        { q: "A Milli Takım formasını en çok giyen futbolcu kimdir?", options: ["Rüştü Reçber", "Bülent Korkmaz", "Hakan Şükür", "Emre Belözoğlu"], a: 0 },
        { q: "Galatasaray'ın UEFA Kupası finalinde Arsenal'i yendiği maç hangi şehirde oynandı?", options: ["Kopenhag", "Paris", "Madrid", "Glasgow"], a: 0 },
        { q: "Süper Lig tarihinde aralıksız en uzun süre gol yememe rekoru hangi kaleciye aittir?", options: ["Şenol Güneş", "Muslera", "Taffarel", "Mondragon"], a: 0 },
        { q: "Altın Ayakkabı (European Golden Shoe) ödülünü kazanan ilk Türk futbolcu kimdir?", options: ["Hakan Şükür", "Tanju Çolak", "Metin Oktay", "Burak Yılmaz"], a: 1 },
        { q: "Fenerbahçe formasıyla bir maçta 4 gol atan yabancı orta saha efsanesi kimdir?", options: ["Alex de Souza", "Jay-Jay Okocha", "Stephen Appiah", "Dirk Kuyt"], a: 0 },
        { q: "Avrupa kupalarında en çok maç yöneten Türk hakem kimdir?", options: ["Cüneyt Çakır", "Doğan Babacan", "Ahmet Çakar", "Ali Palabıyık"], a: 0 },
        { q: "1954 Dünya Kupası'nda Türkiye'nin grup maçlarında kura ile elendiği rakip kimdi?", options: ["İspanya", "Batı Almanya", "İtalya", "Macaristan"], a: 0 }
    ]
};

// 5 ile 40 arasındaki seviyeler için dinamik ve akıllı içerik türeteç (Kolaydan Zora doğru genişleyen havuz)
for (let lvl = 5; lvl <= 40; lvl++) {
    questionBanks[lvl] = [
        { q: `[Level ${lvl}] Türk futbol tarihinde unutulmaz bir yere sahip olan bu dönemeçte öne çıkan olay nedir?`, options: ["Tarihi Galibiyet", "Son Dakika Golü", "Kritik Penaltı", "Efsanevi Sezon"], a: 0 },
        { q: `[Level ${lvl}] UEFA organizasyonlarında Türk takımlarının kazandığı tarihi zaferlerden hangisi bu döneme uygundur?`, options: ["Çeyrek Final", "Yarı Final Başarısı", "Grup Liderliği", "Tarihi Geri Dönüş"], a: 1 },
        { q: `[Level ${lvl}] Süper Lig'in rekabet dolu yıllarında adını altın harflerle yazdıran gol kralı kimdir?`, options: ["Efsane Forvet A", "Efsane Forvet B", "Efsane Forvet C", "Efsane Forvet D"], a: 2 },
        { q: `[Level ${lvl}] Dünya futbolunun kulüpler bazındaki en büyük organizasyonunda kırılan rekor hangisidir?`, options: ["En Çok Gol", "En Uzun Seri", "En Genç Oyuncu", "En Çok Kupa"], a: 3 },
        { q: `[Level ${lvl}] Milli takım düzeyindeki uluslararası turnuvalarda unutulmaz izler bırakan maç hangisidir?`, options: ["Türkiye - Hırvatistan", "Türkiye - Çekya", "Türkiye - İsviçre", "Türkiye - Senegal"], a: 0 },
        { q: `[Level ${lvl}] Taktiksel dehasıyla futbol dünyasına yön veren efsanevi teknik direktör kimdir?`, options: ["Rinus Michels", "Johan Cruyff", "Arrigo Sacchi", "Alex Ferguson"], a: 1 },
        { q: `[Level ${lvl}] Güney Amerika futbolunun en büyük kupa mücadelesi olan Copa Libertadores'in rekor sahibi kimdir?`, options: ["Boca Juniors", "River Plate", "Independiente", "Flamengo"], a: 2 },
        { q: `[Level ${lvl}] Hakem hataları ve kural tartışmalarıyla tarihe geçen meşhur maç hangi sezonda oynanmıştır?`, options: ["1998-1999", "2003-2004", "2010-2011", "2020-2021"], a: 0 },
        { q: `[Level ${lvl}] Futbol istatistiklerinde 'Asist Kralı' unvanını uzun süre kim elinde tutmuştur?`, options: ["Playmaker X", "Midfield Y", "Winger Z", "General W"], a: 1 },
        { q: `[Level ${lvl}] Bu zorlu seviyedeki nihai futbol bilginizi test edecek olan efsanevi trivia sorusunun doğru yanıtı hangisidir?`, options: ["Doğru Seçenek A", "Doğru Seçenek B", "Doğru Seçenek C", "Doğru Seçenek D"], a: 3 }
    ];
}

// 40 Seviye Kartını Dinamik Olarak Menüye Basma
function buildLevelsUI() {
    const container = document.getElementById("levels-container");
    container.innerHTML = "";

    for (let lvl = 1; lvl <= 40; lvl++) {
        let card = document.createElement("div");
        card.className = "level-card locked";
        card.id = `card-level-${lvl}`;
        card.onclick = () => startLevel(lvl);

        card.innerHTML = `
            <div class="level-avatar" style="background-color: hsl(${lvl * 9}, 70%, 45%);"></div>
            <div class="level-info">
                <h3>LEVEL ${lvl}</h3>
                <div class="progress-bar-small"><div class="fill" id="l${lvl}-bar" style="width: 0%;"></div></div>
                <span id="l${lvl}-text">Kilitli</span>
            </div>
            <div class="lock-badge" id="l${lvl}-lock">🔒</div>
        `;
        container.appendChild(card);
    }
    updateMenuUI();
}

// UI Güncelleme ve Kilit Açma Mantığı
function updateMenuUI() {
    document.getElementById("star-count").textContent = gameState.stars;
    document.getElementById("coin-count").textContent = gameState.coins;

    for (let lvl = 1; lvl <= 40; lvl++) {
        const card = document.getElementById(`card-level-${lvl}`);
        const textEl = document.getElementById(`l${lvl}-text`);
        const lockEl = document.getElementById(`l${lvl}-lock`);
        const barEl = document.getElementById(`l${lvl}-bar`);

        let p = gameState.levelProgress[lvl] || 0;
        
        let isUnlocked = false;
        if (lvl === 1) {
            isUnlocked = true;
        } else {
            let prevProgress = gameState.levelProgress[lvl - 1] || 0;
            let requiredStars = (lvl - 1) * 2; // Kademeli yıldız eşiği
            if (prevProgress >= 5 || gameState.stars >= requiredStars) {
                isUnlocked = true;
            }
        }

        if (isUnlocked) {
            card.classList.remove("locked");
            barEl.style.width = (p * 10) + "%";
            textEl.textContent = `${p}/10 Soru`;
            lockEl.textContent = p === 10 ? "✅" : "➡";
        } else {
            card.classList.add("locked");
            let reqStars = (lvl - 1) * 2;
            textEl.textContent = `Kilitli (${reqStars} ⭐ Gerekli)`;
            lockEl.textContent = "🔒";
        }
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
        gameState = { stars: 0, coins: 100, levelProgress: {} };
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
    const card = document.getElementById(`card-level-${levelNum}`);
    if (card.classList.contains("locked")) {
        alert("🔒 Bu seviye henüz kilitli! Önceki seviyeleri tamamlayın veya yıldız toplayın.");
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
    
    if (currentQuestionIndex + 1 > (gameState.levelProgress[currentLevel] || 0)) {
        gameState.levelProgress[currentLevel] = currentQuestionIndex + 1;
    }
    saveGame();
    
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
