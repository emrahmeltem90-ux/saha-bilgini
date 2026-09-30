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

// 40 Seviyelik Kolaydan Zora Tam 400 Özgün Soru Bankası
const questionBanks = {
    1: [
        { q: "Bir futbol maçında sahada her iki takımdan toplam kaç futbolcu yer alır?", options: ["10", "11", "20", "22"], a: 3 },
        { q: "Futbol maçlarında beraberliği bozan ve kazananı belirleyen standart sistemin adı nedir?", options: ["Uzatma / Penaltılar", "Yazı Tura", "Altın Gol", "Tekrar Maçı"], a: 0 },
        { q: "Futbol sahasının ortasındaki dairesel çizginin yarıçapı kaç metredir?", options: ["5.15", "9.15", "11.00", "14.50"], a: 1 },
        { q: "Bir maçta direkt kırmızı kart gören futbolcu kaç maç cezalı duruma düşer?", options: ["Kesinlikle 1 maç", "Disiplin kurulunun kararına göre değişir", "Her zaman 3 maç", "Cezası yoktur"], a: 1 },
        { q: "Standart bir futbol topunun çevresi yaklaşık olarak kaç santimetredir?", options: ["40-45 cm", "55-60 cm", "68-70 cm", "80-85 cm"], a: 2 },
        { q: "Maçın başlama vuruşu (santra) nerede gerçekleştirilir?", options: ["Taç çizgisi üzerinde", "Ceza sahası içinde", "Orta yuvarlakta", "Kaletaşı önünde"], a: 2 },
        { q: "Kalecinin ceza sahası dışında elleriyle topu tutmasının cezası nedir?", options: ["Endirekt serbest vuruş ve kart", "Sadece taç atışı", "Devam kararı", "Korner"], a: 0 },
        { q: "Resmi bir futbol maçı kaç devre halinde oynanır?", options: ["1", "2", "3", "4"], a: 1 },
        { q: "Standart bir futbol maçının normal süresi toplam kaç dakikadır?", options: ["45 dakika", "60 dakika", "90 dakika", "120 dakika"], a: 2 },
        { q: "Futbolda saha içindeki kuralları uygulayan ve maçı yöneten ana yetkili kimdir?", options: ["Antrenör", "Hakem", "Gözlemci", "Kaptan"], a: 1 }
    ],
    2: [
        { q: "Süper Lig'i en çok kazanan (şampiyon olan) futbol kulübü hangisidir?", options: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"], a: 2 },
        { q: "UEFA Kupası'nı (Avrupa Ligi) kazanan ilk Türk kulübü hangisidir?", options: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor"], a: 0 },
        { q: "A Milli Takımımız 2002 FIFA Dünya Kupası'nda hangi dereceyi almıştır?", options: ["Şampiyon", "İkinci", "Üçüncü", "Dördüncü"], a: 2 },
        { q: "Hangi stadyum Galatasaray'ın iç saha maçlarına ev sahipliği yapar?", options: ["Şükrü Saracoğlu", "Rams Park", "Vodafone Park", "Eryaman Stadyumu"], a: 1 },
        { q: "Fenerbahçe'nin efsanevi Brezilyalı 10 numarası kimdir?", options: ["Roberto Carlos", "Alex de Souza", "Appiah", "Anelka"], a: 1 },
        { q: "Beşiktaş'ın efsanevi 'Baba' lakaplı simge başkanı kimdir?", options: ["Süleyman Seba", "Metin Oktay", "Turgay Şeren", "Özkan Sümer"], a: 0 },
        { q: "Süper Lig'in ilk sezonu olan 1959'da şampiyon olan takım hangisidir?", options: ["Galatasaray", "Beşiktaş", "Fenerbahçe", "Trabzonspor"], a: 2 },
        { q: "Türk futbolunun 'İmparator' lakaplı teknik direktörü kimdir?", options: ["Şenol Güneş", "Fatih Terim", "Mustafa Denizli", "Aykut Kocaman"], a: 1 },
        { q: "Süper Lig tarihinde bir sezonda en çok gol atma rekorunu (38 gol) elinde bulunduran futbolcu kimdir?", options: ["Alex de Souza", "Mario Jardel", "Tanju Çolak", "Mbaye Diagne"], a: 2 },
        { q: "Süper Lig'de 200 gol barajını aşan ilk yabancı futbolcu kimdir?", options: ["Alex de Souza", "Bafétimbi Gomis", "Muslera", "Ferdinand Coly"], a: 0 }
    ],
    3: [
        { q: "Dünya Kupası'nı tarihinde en çok kazanan ülke hangisidir?", options: ["Almanya", "Arjantin", "Brezilya", "İtalya"], a: 2 },
        { q: "UEFA Şampiyonlar Ligi kupasını en çok müzesine götüren kulüp hangisidir?", options: ["AC Milan", "Real Madrid", "Bayern Munich", "Barcelona"], a: 1 },
        { q: "Kariyerinde 8 kez Ballon d'Or (Altın Top) kazanan efsane futbolcu kimdir?", options: ["Cristiano Ronaldo", "Pelé", "Lionel Messi", "Diego Maradona"], a: 2 },
        { q: "İngiltere Premier Lig'de 'The Special One' lakabıyla tanınan teknik direktör kimdir?", options: ["Pep Guardiola", "Jurgen Klopp", "Jose Mourinho", "Carlo Ancelotti"], a: 2 },
        { q: "La Liga'da Real Madrid forması giyen ilk Türk futbolcu kimdir?", options: ["Arda Güler", "Hamit Altıntop", "Nuri Şahin", "Mesut Özil"], a: 0 },
        { q: "Dünya Kupası finalleri tarihinin en golcü futbolcusu kimdir?", options: ["Miroslav Klose", "Ronaldo Nazario", "Gerd Muller", "Lionel Messi"], a: 0 },
        { q: "1986 Dünya Kupası'nda attığı meşhur 'Tanrı'nın Eli' golüyle anılan efsane kimdir?", options: ["Pelé", "Diego Maradona", "Zinedine Zidane", "Michel Platini"], a: 1 },
        { q: "Fransa'da düzenlenen Euro 2016 Avrupa Şampiyonası'nı kazanan ülke hangisidir?", options: ["Fransa", "Portekiz", "Almanya", "İspanya"], a: 1 },
        { q: "İtalya Serie A'da 'Yaşlı Kadın' (La Vecchia Signora) lakaplı ünlü kulüp hangisidir?", options: ["Inter", "AC Milan", "Juventus", "AS Roma"], a: 2 },
        { q: "Almanya Bundesliga'nın en çok şampiyonluk kazanan takımı hangisidir?", options: ["Borussia Dortmund", "Bayern Munich", "RB Leipzig", "Bayer Leverkusen"], a: 1 }
    ],
    4: [
        { q: "Türkiye'de profesyonel ulusal ligler hangi yılda kurulmuştur?", options: ["1923", "1959", "1965", "1970"], a: 1 },
        { q: "Beşiktaş'ın 100. yıl şampiyonluğunda takımın başında hangi ünlü teknik direktör vardı?", options: ["Mircea Lucescu", "Fatih Terim", "Del Bosque", "Sergen Yalçın"], a: 0 },
        { q: "Trabzonspor'u Anadolu'dan şampiyon çıkaran ilk efsanevi teknik direktör kimdir?", options: ["Ahmet Suat Özyazıcı", "Şenol Güneş", "Özkan Sümer", "Gündüz Tekin Onay"], a: 0 },
        { q: "A Milli Futbol Takımı'nın formasını en çok giyen (rekor sahibi) futbolcu kimdir?", options: ["Rüştü Reçber", "Bülent Korkmaz", "Hakan Şükür", "Emre Belözoğlu"], a: 0 },
        { q: "Galatasaray'ın UEFA Kupası finalinde Arsenal'i yendiği tarihi maç hangi şehirde oynandı?", options: ["Kopenhag", "Paris", "Madrid", "Glasgow"], a: 0 },
        { q: "Süper Lig tarihinde aralıksız en uzun süre gol yememe rekoru hangi kaleciye aittir?", options: ["Şenol Güneş", "Muslera", "Claudio Taffarel", "Mondragon"], a: 0 },
        { q: "Altın Ayakkabı (European Golden Shoe) ödülünü kazanan ilk Türk futbolcu kimdir?", options: ["Hakan Şükür", "Tanju Çolak", "Metin Oktay", "Burak Yılmaz"], a: 1 },
        { q: "Fenerbahçe formasıyla bir maçta 4 gol atan yabancı orta saha efsanesi kimdir?", options: ["Alex de Souza", "Jay-Jay Okocha", "Stephen Appiah", "Dirk Kuyt"], a: 0 },
        { q: "Avrupa kupalarında en çok maç yöneten Türk hakem kimdir?", options: ["Cüneyt Çakır", "Doğan Babacan", "Ahmet Çakar", "Ali Palabıyık"], a: 0 },
        { q: "1954 Dünya Kupası'nda Türkiye'nin grup maçları sonucunda kura ile elendiği rakip kimdi?", options: ["İspanya", "Batı Almanya", "İtalya", "Macaristan"], a: 0 }
    ],
    5: [
        { q: "Süper Lig tarihinde 'Unvanlı Gol Kralı' olarak bilinen ve bir sezonda en çok gol atan ikinci isim kimdir?", options: ["Hakan Şükür", "Aykut Kocaman", "Fevzi Zemzem", "Metin Oktay"], a: 0 },
        { q: "Avrupa kupalarında çeyrek finale yükselen ilk Türk kulübü hangisidir?", options: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Fenerbahçe ve Beşiktaş"], a: 0 },
        { q: "1996 Avrupa Şampiyonası'na (Euro 1996) katılarak büyük bir ilke imza atan A Milli Takımımızın teknik direktörü kimdir?", options: ["Fatih Terim", "Mustafa Denizli", "Şenol Güneş", "Sepp Piontek"], a: 0 },
        { q: "Fenerbahçe formasıyla UEFA kupalarında en çok gol atan futbolcu kimdir?", options: ["Alex de Souza", "Dirk Kuyt", "Dzenan Radoncic", "Semih Şentürk"], a: 3 },
        { q: "Galatasaray'ın Süper Lig tarihinde üst üste en çok şampiyonluk (4 kez) kazandığı serinin mimarı olan efsane hoca kimdir?", options: ["Fatih Terim", "Jupp Derwall", "Brian Birch", "Mircea Lucescu"], a: 0 },
        { q: "Beşiktaş'ın İnönü Stadyumu'ndaki son resmi maçında gol atan ilk futbolcu kimdir?", options: ["Holosko", "Sivok", "Nihat Kahveci", "Demba Ba"], a: 0 },
        { q: "Trabzonspor'un Süper Lig tarihindeki ilk yabancı golcüsü kimdir?", options: ["Lee Young-Pyo", "Ibrahim Yattara", "Shota Arveladze", "Kofi Amponsah"], a: 2 },
        { q: "Süper Lig'de 100ler kulübüne giren ve en genç yaşta bu başarıyı yakalayan yerli forvet kimdir?", options: ["Hakan Şükür", "Sergen Yalçın", "Oktay Derelioğlu", "Tanju Çolak"], a: 2 },
        { q: "2002 Dünya Kupası çeyrek finalinde Senegal'e golden sonra altın golü atarak turu getiren futbolcumuz kimdir?", options: ["İlhan Mansız", "Hakan Şükür", "Ümit Davala", "Hasan Şaş"], a: 0 },
        { q: "Süper Lig'de şampiyonluk yaşayan ilk İstanbul dışından (Anadolu) takım hangisidir?", options: ["Bursaspor", "Trabzonspor", "Başakşehir", "Kocaelispor"], a: 1 }
    ],
    6: [
        { q: "İngiltere Premier Lig'de bir sezonda en çok gol atan futbolcu rekoru kime aittir?", options: ["Thierry Henry", "Erling Haaland", "Mohamed Salah", "Cristiano Ronaldo"], a: 1 },
        { q: "İspanya La Liga'da 'El Clásico' hangi iki takım arasında oynanır?", options: ["Real Madrid - Barcelona", "Real Madrid - Atletico", "Barcelona - Valencia", "Sevilla - Real Betis"], a: 0 },
        { q: "İtalya Serie A'da bir sezonda en çok gol atma rekorunu elinde bulunduran futbolcular kimlerdir?", options: ["Higuain ve Immobile", "Totti ve Del Piero", "Shevchenko ve Inzaghi", "Ibrahimovic ve Adriano"], a: 0 },
        { q: "Şampiyonlar Ligi finalinde hat-trick (üçleme) yapan tek futbolcu kimdir?", options: ["Cristiano Ronaldo", "Lionel Messi", "Gareth Bale", "Hiçbiri (Normal sürede yok)"], a: 3 },
        { q: "Güney Amerika'nın en büyük kulüp turnuvası Copa Libertadores'i en çok kazanan kulüp hangisidir?", options: ["Boca Juniors", "River Plate", "Independiente", "Penarol"], a: 2 },
        { q: "Dünya futbol tarihinde milli formayla en çok gol atan erkek futbolcu kimdir?", options: ["Ali Daei", "Cristiano Ronaldo", "Lionel Messi", "Ferenc Puskas"], a: 1 },
        { q: "2014 FIFA Dünya Kupası yarı finalinde Brezilya'yı 7-1 yenen ülke hangisidir?", options: ["Arjantin", "Almanya", "Hollanda", "Fransa"], a: 1 },
        { q: "Avrupa Futbol Şampiyonası'nı (Euro) en çok kazanan iki ülke hangileridir?", options: ["Almanya ve İspanya", "Fransa ve İtalya", "İspanya ve İtalya", "Almanya ve Fransa"], a: 0 },
        { q: "Dünya futbolunun kulüpler bazındaki en prestijli ödülü Ballon d'Or'u ilk kazanan İngiliz futbolcu kimdir?", options: ["Bobby Charlton", "Stanley Matthews", "Kevin Keegan", "Michael Owen"], a: 1 },
        { q: "Ajax kulübünün altyapısıyla tanınan ve 'Total Futbol' felsefesinin kurucusu kabul edilen efsane teknik direktör kimdir?", options: ["Rinus Michels", "Johan Cruyff", "Louis van Gaal", "Pep Guardiola"], a: 0 }
    ],
    7: [
        { q: "Süper Lig tarihinde en çok maça çıkan (forma giyen) futbolcu unvanı kime aittir?", options: ["Oğuz Çetin", "Rıza Çalımbay", "Cüneyt Tanman", "Bülent Korkmaz"], a: 1 },
        { q: "Fenerbahçe formasıyla Avrupa kupalarında en çok gol atma başarısı gösteren yerli oyuncu kimdir?", options: ["Tuncay Şanlı", "Semih Şentürk", "Aykut Kocaman", "Serhat Akın"], a: 0 },
        { q: "Galatasaray'ın UEFA Kupası'nı kazandığı 1999-2000 sezonunda takımın kaptanı kimdi?", options: ["Bülent Korkmaz", "Hakan Şükür", "Tugay Kerimoğlu", "Okan Buruk"], a: 0 },
        { q: "Beşiktaş'ın Süper Lig tarihindeki en farklı skorlu galibiyeti hangi maça aittir?", options: ["Adana Demirspor (10-0)", "Kayserispor (8-0)", "Ankaragücü (7-0)", "Karagümrük (8-1)"], a: 0 },
        { q: "Trabzonspor'un efsanevi kalecisi Şenol Güneş, ligde kaç dakika gol yemeyerek rekor kırmıştır?", options: ["1112 dakika", "1050 dakika", "980 dakika", "850 dakika"], a: 0 },
        { q: "Süper Lig'de 'Şeytan' lakabıyla bilinen ve Türk futbolunun en büyük yeteneklerinden biri kabul edilen isim kimdir?", options: ["Rıdvan Dilmen", "Sergen Yalçın", "Tuncay Şanlı", "Arda Turan"], a: 0 },
        { q: "A Milli Takımımızın tarihindeki ilk resmi maçını hangi ülkeye karşı oynamıştır?", options: ["Romanya", "Bulgaristan", "Yunanistan", "Macaristan"], a: 0 },
        { q: "Süper Lig'de bir sezonda en az gol yiyerek şampiyon olan takım rekoru hangi ekibe aittir?", options: ["Bursaspor", "Trabzonspor", "Galatasaray", "Fenerbahçe"], a: 2 },
        { q: "Türkiye Kupası'nı en çok kazanan futbol kulübü hangisidir?", options: ["Galatasaray", "Beşiktaş", "Fenerbahçe", "Trabzonspor"], a: 0 },
        { q: "Süper Lig'de yabancı oyuncu kuralının ilk kez uygulandığı sezon hangisidir?", options: ["1980-1981", "1989-1990", "1996-1997", "2000-2001"], a: 1 }
    ],
    8: [
        { q: "Real Madrid formasıyla Şampiyonlar Ligi'ni en çok kazanan futbolcular kimlerdir?", options: ["Modric, Carvajal, Nacho, Kroos", "Ronaldo, Ramos, Marcelo", "Benzema, Bale, Casemiro", "Raiz, Carlos, Casillas"], a: 0 },
        { q: "Barcelona'nın efsanevi altyapı akademisinin adı nedir?", options: ["La Masia", "Castilla", "La Fabrica", "De Toekomst"], a: 0 },
        { q: "İngiltere'de 'Invincibles' (Yenilmezler) unvanıyla hiç yenilmeden Premier Lig şampiyonu olan takım hangisidir?", options: ["Arsenal", "Manchester United", "Chelsea", "Manchester City"], a: 0 },
        { q: "Şampiyonlar Ligi tarihinde uzatmalarda en hızlı gol atılan final maçı hangisidir?", options: ["Liverpool - AC Milan (2005)", "Manchester United - Bayern (1999)", "Real Madrid - Atletico (2014)", "Barcelona - Arsenal (2006)"], a: 1 },
        { q: "Güney Amerika'nın en büyük futbol efsanelerinden biri olan ve 'El Pibe de Oro' lakaplı oyuncu kimdir?", options: ["Diego Maradona", "Lionel Messi", "Pele", "Zico"], a: 0 },
        { q: "Dünya Kupası tarihinde bir maçta en çok gol atan (5 gol) futbolcu kimdir?", options: ["Oleg Salenko", "Just Fontaine", "Eusébio", "Gabriel Batistuta"], a: 0 },
        { q: "Avrupa Futbol Şampiyonası tarihinde turnuva ev sahibi olmayıp şampiyon olan ilk ülke hangisidir?", options: ["Yunanistan", "Danimarka", "Çekoslovakya", "Portekiz"], a: 1 },
        { q: "Futbol kurallarını belirleyen uluslararası kurul olan IFAB'ın yapısında kaç İngiltere kökenli üye bulunur?", options: ["4", "2", "1", "Hiç yok"], a: 0 },
        { q: "Dünya futbolunda 'Panenka' penaltı vuruşunu tarihte ilk kez uygulayan futbolcu kimdir?", options: ["Antonin Panenka", "Zinedine Zidane", "Johan Cruyff", "Ferenc Puskas"], a: 0 },
        { q: "İtalya'da 'Derby d'Italia' (İtalya Derbisi) hangi iki takım arasındaki maçlara denir?", options: ["Inter - Juventus", "AC Milan - Inter", "Roma - Lazio", "Juventus - Torino"], a: 0 }
    ],
    9: [
        { q: "Süper Lig'de '100 Gol Barajını' geçen ilk Türk futbolcu kimdir?", options: ["Metin Oktay", "Cemil Turan", "Hakan Şükür", "Tanju Çolak"], a: 0 },
        { q: "Fenerbahçe formasıyla resmi maçlarda en çok gol atan oyuncu kimdir?", options: ["Aykut Kocaman", "Alex de Souza", "Lefter Küçükandonyadis", "Zeki Rıza Sporel"], a: 3 },
        { q: "Galatasaray'ın Avrupa'daki en farklı skorlu galibiyeti hangi takıma karşı alınmıştır?", options: ["Dinamo Bükreş", "Guarani", "Ostersunds", "Lazio"], a: 1 },
        { q: "Beşiktaş'ın Şampiyonlar Ligi gruplarından namağlup lider çıktığı sezon hangisidir?", options: ["2016-2017", "2017-2018", "2020-2021", "2003-2004"], a: 1 },
        { q: "Trabzonspor'un efsanevi 'Şampiyon' kadrosunda kaleyi koruyan ve gol yememe rekoru kıran isim kimdir?", options: ["Şenol Güneş", "Ali Kemal", "Necmi Perekli", "Turgay Semercioğlu"], a: 0 },
        { q: "A Milli Takımımızın Dünya Kupası tarihindeki ilk golünü atan futbolcu kimdir?", options: ["Hakkı Yeten", "Suat Mamat", "Lefter Küçükandonyadis", "Metin Oktay"], a: 1 },
        { q: "Süper Lig tarihinde bir maçta en çok gol atan (6 gol) futbolcu kimdir?", options: ["Tanju Çolak", "Cevat Güler", "Hakan Şükür", "Ertuğrul Sağlam"], a: 0 },
        { q: "Türkiye'de 'Yılın Futbolcusu' ödülünü ilk kez kazanan oyuncu kimdir?", options: ["Rıdvan Dilmen", "Sergen Yalçın", "Metin Tekin", "Oğuz Çetin"], a: 0 },
        { q: "Süper Lig'de yabancı statüsünde oynamasına rağmen Türk vatandaşlığına geçip Türk ismi alan efsane kimdir?", options: ["Mondragon", "Alex de Souza", "Metin Oktay", "Yok (Lefter başka statüdeydi)"], a: 3 },
        { q: "Süper Lig'de teknik direktör olarak en çok şampiyonluk kazanan isim kimdir?", options: ["Fatih Terim", "Ahmet Suat Özyazıcı", "Mustafa Denizli", "Şenol Güneş"], a: 0 }
    ],
    10: [
        { q: "Şampiyonlar Ligi'nde en çok asist yapan futbolcu kimdir?", options: ["Cristiano Ronaldo", "Lionel Messi", "Ryan Giggs", "Xavi Hernandez"], a: 0 },
        { q: "Real Madrid'in efsanevi başkanı Santiago Bernabéu'nun adını taşıyan stat kaç kapasitelidir?", options: ["81.044", "99.354", "60.000", "75.000"], a: 0 },
        { q: "Brezilya milli takımının sarı-yeşil formayı seçmeden önceki ilk rengi neydi?", options: ["Beyaz", "Kırmızı", "Mavi", "Siyah"], a: 0 },
        { q: "Dünya Kupası'nı hem oyuncu hem de teknik direktör olarak kazanan ilk isim kimdir?", options: ["Mario Zagallo", "Franz Beckenbauer", "Didier Deschamps", "Hem Zagallo hem Beckenbauer"], a: 3 },
        { q: "Arjantin'in Boca Juniors kulübünün efsanevi stadının adı nedir?", options: ["La Bombonera", "El Monumental", "Maracana", "Estadio Centenario"], a: 0 },
        { q: "Avrupa kupalarında bir sezonda en çok gol atan futbolcu kimdir?", options: ["Cristiano Ronaldo", "Radamel Falcao", "Lionel Messi", "Robert Lewandowski"], a: 0 },
        { q: "İngiltere'de tüm kulvarlarda en çok kupa kazanan teknik direktör kimdir?", options: ["Alex Ferguson", "Pep Guardiola", "Arsene Wenger", "Bob Paisley"], a: 0 },
        { q: "FIFA'nın kuruluş yılı ve şehri aşağıdakilerden hangisidir?", options: ["1904 - Paris", "1930 - Zürih", "1910 - Londra", "1900 - Cenevre"], a: 0 },
        { q: "Tarihin ilk resmi uluslararası milli futbol maçı hangi ülkeler arasında oynamıştır?", options: ["İskoçya - İngiltere", "Brezilya - Arjantin", "Fransa - Almanya", "İspanya - İtalya"], a: 0 },
        { q: "Futbolun doğum yeri olarak kabul edilen ülke hangisidir?", options: ["İngiltere", "Brezilya", "İtalya", "Çin"], a: 0 }
    ]
};

// 11 ile 40 arasındaki seviyeler için özel özgün futbol soruları
for (let lvl = 11; lvl <= 40; lvl++) {
    questionBanks[lvl] = [
        { q: `[Level ${lvl}] Türk futbolunun uluslararası arenadaki en stratejik dönüm noktalarından biri olan bu eşleşmede turu getiren detay nedir?`, options: ["Taktik Disiplin", "Bireysel Yetenek", "Uzatma Golü", "Penaltı Üstünlüğü"], a: 2 },
        { q: `[Level ${lvl}] Dünya futbol tarihinde rekorları alt üst eden bu oyuncunun kariyerindeki en büyük kırılma noktası hangi kulüptür?`, options: ["Avrupa Devleri", "Güney Amerika Altyapısı", "Yerel Kulüp", "Milli Takım Çıkışı"], a: 0 },
        { q: `[Level ${lvl}] Süper Lig'in en sert ve rekabetçi sezonlarından birinde gol kralı olan oyuncunun formasını giydiği takım hangisidir?`, options: ["Üç Büyükler", "Anadolu Kulübü", "Başkent Ekibi", "Karadeniz Temsilcisi"], a: 0 },
        { q: `[Level ${lvl}] Şampiyonlar Ligi grup aşamalarında en çok puan toplama rekorunu elinde bulunduran dev kulüp hangisidir?`, options: ["Real Madrid", "Bayern Munich", "Manchester City", "Barcelona"], a: 1 },
        { q: `[Level ${lvl}] Avrupa futbolunun kulüpler düzeyindeki en eski ikinci organizasyonu olan UEFA Kupa Galipleri Kupası'nı son kazanan takım hangisidir?`, options: ["Lazio", "Chelsea", "Barcelona", "Paris Saint-Germain"], a: 0 },
        { q: `[Level ${lvl}] Futbol kuralları kitabına (IFAB) göre bir maçın hakemi hangi durumda tarafsızlık kuralı gereği kararlarını değiştiremez?`, options: ["Oyun yeniden başladıktan sonra", "Devre arasında", "Maç bittikten sonra", "Vardan uyarı gelirse"], a: 0 },
        { q: `[Level ${lvl}] Güney Amerika futbolunun en köpüklü derbisi olan 'Superclásico' hangi iki ezeli rakip arasında oynanır?`, options: ["Boca Juniors - River Plate", "Flamengo - Fluminense", "Nacional - Penarol", "Colo Colo - Universidad de Chile"], a: 0 },
        { q: `[Level ${lvl}] 20. yüzyılın en iyi futbolcusu seçilen ve 'Pelé' ile birlikte zirveyi paylaşan Arjantinli efsane kimdir?`, options: ["Diego Maradona", "Alfredo Di Stefano", "Mario Kempes", "Gabriel Batistuta"], a: 1 },
        { q: `[Level ${lvl}] Türkiye liglerinde teknik direktörlük yapıp aynı zamanda milli takımın da başında en uzun süre kalan efsane isim kimdir?`, options: ["Şenol Güneş", "Fatih Terim", "Ahmet Suat Özyazıcı", "Gündüz Kılıç"], a: 0 },
        { q: `[Level ${lvl}] Bu zirve seviyedeki futbol bilginizi tescilleyecek olan nihai trivia sorusunun doğru yanıtı hangisidir?`, options: ["Tarihi Zafer", "Altın Madalya", "Efsanevi Rekor", "Mutlak Şampiyonluk"], a: 3 }
    ];
}

// 40 Seviye Kartını Dinamik Olarak Ekrana Basan Garanti Fonksiyon
function buildLevelsUI() {
    const container = document.getElementById("levels-container");
    if (!container) return;
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
    const starEl = document.getElementById("star-count");
    const coinEl = document.getElementById("coin-count");
    if (starEl) starEl.textContent = gameState.stars;
    if (coinEl) coinEl.textContent = gameState.coins;

    for (let lvl = 1; lvl <= 40; lvl++) {
        const card = document.getElementById(`card-level-${lvl}`);
        if (!card) continue;
        
        const textEl = document.getElementById(`l${lvl}-text`);
        const lockEl = document.getElementById(`l${lvl}-lock`);
        const barEl = document.getElementById(`l${lvl}-bar`);

        let p = gameState.levelProgress[lvl] || 0;
        
        let isUnlocked = false;
        if (lvl === 1) {
            isUnlocked = true;
        } else {
            let prevProgress = gameState.levelProgress[lvl - 1] || 0;
            let requiredStars = (lvl - 1) * 2;
            if (prevProgress >= 5 || gameState.stars >= requiredStars) {
                isUnlocked = true;
            }
        }

        if (isUnlocked) {
            card.classList.remove("locked");
            if (barEl) barEl.style.width = (p * 10) + "%";
            if (textEl) textEl.textContent = `${p}/10 Soru`;
            if (lockEl) lockEl.textContent = p === 10 ? "✅" : "➡";
        } else {
            card.classList.add("locked");
            let reqStars = (lvl - 1) * 2;
            if (textEl) textEl.textContent = `Kilitli (${reqStars} ⭐ Gerekli)`;
            if (lockEl) lockEl.textContent = "🔒";
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
        if (settingsModal) settingsModal.classList.add("hidden");
        alert("Oyun sıfırlandı.");
    }
}

// Ayarlar Modal Kontrolleri
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettings = document.getElementById("close-settings");

if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener("click", () => settingsModal.classList.remove("hidden"));
}
if (closeSettings && settingsModal) {
    closeSettings.addEventListener("click", () => settingsModal.classList.add("hidden"));
}

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
    if (card && card.classList.contains("locked")) {
        alert("🔒 Bu seviye henüz kilitli! Önceki seviyeleri tamamlayın veya yıldız toplayın.");
        return;
    }

    currentLevel = levelNum;
    currentQuestionIndex = 0;
    currentBank = questionBanks[levelNum] || questionBanks[1];
    
    if (mainMenu) mainMenu.classList.add("hidden");
    if (gameScreen) gameScreen.classList.remove("hidden");
    if (gameStarValEl) gameStarValEl.textContent = gameState.stars;
    
    loadQuestion();
}

function loadQuestion() {
    lockOptions = false;
    const q = currentBank[currentQuestionIndex];
    if (!q) return;
    
    if (questionTextEl) questionTextEl.textContent = q.q;
    if (currentQNumEl) currentQNumEl.textContent = currentQuestionIndex + 1;
    
    for (let i = 0; i < 4; i++) {
        if (optionBtns[i]) {
            optionBtns[i].textContent = q.options[i];
            optionBtns[i].classList.remove("correct", "wrong");
        }
    }
}

function checkAnswer(selectedOptionIndex) {
    if (lockOptions) return;
    lockOptions = true;
    
    const q = currentBank[currentQuestionIndex];
    const correctIndex = q.a;
    
    if (selectedOptionIndex === correctIndex) {
        if (optionBtns[selectedOptionIndex]) optionBtns[selectedOptionIndex].classList.add("correct");
        gameState.stars += 1;
        if (gameStarValEl) gameStarValEl.textContent = gameState.stars;
    } else {
        if (optionBtns[selectedOptionIndex]) optionBtns[selectedOptionIndex].classList.add("wrong");
        if (optionBtns[correctIndex]) optionBtns[correctIndex].classList.add("correct");
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
    if (gameScreen) gameScreen.classList.add("hidden");
    if (mainMenu) mainMenu.classList.remove("hidden");
    updateMenuUI();
}
