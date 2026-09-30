// Açılış yükleme animasyonu (Splash Screen)
let loadProgress = 0;
const progressFill = document.getElementById("progress-fill");
const loadingText = document.getElementById("loading-text");
const splashScreen = document.getElementById("splash-screen");
const mainMenu = document.getElementById("main-menu");

const loadingInterval = setInterval(() => {
    loadProgress += 2;
    if (loadProgress <= 100) {
        progressFill.style.width = loadProgress + "%";
        loadingText.textContent = `LOADING... ${loadProgress}%`;
    } else {
        clearInterval(loadingInterval);
        // Yükleme bitince açılış ekranını gizle, ana menüyü aç
        splashScreen.classList.add("hidden");
        mainMenu.classList.remove("hidden");
    }
}, 30); // Yüklenme hızı

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

// Seviye seçme fonksiyonu (Şimdilik test amaçlı)
function startLevel(levelNum) {
    alert(`Level ${levelNum} yakında başlıyor! Soru ekranına geçiş hazırlanıyor.`);
}
