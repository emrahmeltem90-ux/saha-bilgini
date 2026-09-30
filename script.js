const questions = [
    // --- LEVEL 1 (Temel Futbol Kuralları ve Genel Terimler) ---
    { soru: "Futbol maçında bir takım sahada kaç oyuncuyla yer alır?", secenekler: ["9", "10", "11", "12"], dogru: 2 },
    { soru: "Standart bir futbol maçı normal sürede toplam kaç dakika sürer?", secenekler: ["80", "90", "100", "120"], dogru: 1 },
    { soru: "Futbol sahasının ortasındaki yuvarlak alanın merkezi ne olarak adlandırılır?", secenekler: ["Başlama noktası (Orta saha yuvarlağı)", "Kale sahası", "Taç çizgisi", "Ceza yayı"], dogru: 0 },
    { soru: "Bir futbol maçında hakemin oyuncuya ihraç (oyundan atılma) amacıyla gösterdiği kartın rengi nedir?", secenekler: ["Sarı", "Kırmızı", "Mavi", "Yeşil"], dogru: 1 },
    { soru: "El ile oynamak hariç, topun kaleye girmesini engellemekle görevli özel giysili oyuncu kimdir?", secenekler: ["Stoper", "Forvet", "Kaleci", "Libero"], dogru: 2 },
    { soru: "Topun taç çizgisini tamamen geçmesi durumunda oyunun tekrar başlaması için hangi atış kullanılır?", secenekler: ["Korner", "Taç atışı", "Endirek serbest vuruş", "Penaltı"], dogru: 1 },
    { soru: "Maçın orta hakeminin kararlarında ona yardımcı olan dış alandaki hakemler nasıl adlandırılır?", secenekler: ["Çizgi hakemi / Yardımcı hakem", "Masa hakemi", "Antrenör", "Gözlemci"], dogru: 0 },
    { soru: "Topun kaleye girmesi durumunda hakemin işaret ettiği orta nokta kararı neyi bildirir?", secenekler: ["Faul", "Gol", "Ofsayt", "Endirek vuruş"], dogru: 1 },
    { soru: "Bir futbol maçında kaleyi koruyan kalecinin ceza sahası dışında elleriyle topu tutması durumunda ne karara varılır?", secenekler: ["Devam", "Serbest vuruş / Kart", "Korner", "Taç"], dogru: 1 },
    { soru: "Maçın berabere bitmesi ve kural gereği kazananın çıkması gerekmesi durumunda oynanan ekstra devrelerin toplam süresi genellikle ne kadardır?", secenekler: ["15 dakika", "30 dakika", "45 dakika", "10 dakika"], dogru: 1 },

    // --- LEVEL 2 (Temel Terimler ve Hakemlik) ---
    { soru: "Hücum oyuncusunun rakip kaleye en yakın savunma oyuncusundan daha ileride top almasıyla oluşan kural dışı pozisyon nedir?", secenekler: ["Faul", "Ofsayt", "Aut", "Korner"], dogru: 1 },
    { soru: "Savunma oyuncularının topu kendi kale çizgisinden dışarı göndermesi sonucu rakip takımın kazandığı atış hangisidir?", secenekler: ["Taç", "Köşe vuruşu (Korner)", "Endirek vuruş", "Penaltı"], dogru: 1 },
    { soru: "Hücum oyuncusunun şutunda top kaleciden veya direkten dönüp tekrar aynı oyuncuya gelirse, ilk vuruş anında arkada kimse yoksa bu pozisyon ne ad alır?", secenekler: ["Ofsayt", "Devam / Ofsayt değil", "Faul", "Penaltı"], dogru: 1 },
    { soru: "Ceza sahası içinde savunma oyuncusunun yaptığı ciddi kural hatası (faul) sonucu verilen ceza vuruşu nedir?", secenekler: ["Endirek serbest vuruş", "Penaltı", "Taç", "Hakem atışı"], dogru: 1 },
    { soru: "Hakemin doğrudan kaleye vuruş yapılamayan, önce başka bir oyuncuya temas etmesi gereken durumlarda verdiği atış hangisidir?", secenekler: ["Direk serbest vuruş", "Endirek serbest vuruş", "Penaltı", "Korner"], dogru: 1 },
    { soru: "Futbolda sarı kart gören bir oyuncunun ikinci sarı kartı görmesi durumunda göreceği kart ve ceza nedir?", secenekler: ["Doğrudan kırmızı kart ve ihraç", "Maça devam", "Sarı-kırmızı kart ile uyarı", "Para cezası"], dogru: 0 },
    { soru: "Bir maçta oyuncu değişiklik hakkı modern futbol kurallarında genellikle kaç oyuncu ile sınırlıdır (standart resmi ligler için)?", secenekler: ["3", "5", "7", "Sınırsız"], dogru: 1 },
    { soru: "Maçın normal süresine hakem tarafından eklenen kayıp zamanlar tabelada ne olarak gösterilir?", secenekler: ["Uzatma dakikaları", "Devre arası", "Altın gol", "Gümüş gol"], dogru: 0 },
    { soru: "Topun tamamının taç veya kale çizgisini havadan veya yerden tamamen geçmesi durumunda ne karar verilir?", secenekler: ["Oyun devam eder", "Top taca veya auta çıkmıştır", "Faul çalınır", "Ofsayt olur"], dogru: 1 },
    { soru: "Futbolda maçın başlamasını veya devrelerin açılışını belirten vuruşun adı nedir?", secenekler: ["Santra vuruşu", "Penaltı vuruşu", "Endirek vuruş", "Aut atışı"], dogru: 0 },

    // --- LEVEL 3 (Türkiye Süper Lig Temelleri) ---
    { soru: "Türkiye'nin en üst seviyedeki profesyonel futbol liginin adı nedir?", secenekler: ["1. Lig", "Süper Lig", "Türkiye Kupası", "TFF 2. Lig"], dogru: 1 },
    { soru: "Süper Lig'in kuruluş tarihi resmi olarak hangi yıldır?", secenekler: ["1923", "1959", "1967", "1980"], dogru: 1 },
    { soru: "Galatasaray, Fenerbahçe ve Beşiktaş kulüplerinin merkezi hangi şehirde yer alır?", secenekler: ["Ankara", "İzmir", "İstanbul", "Bursa"], dogru: 2 },
    { soru: "Trabzonspor kulübünün renkleri hangi seçenekte doğru verilmiştir?", secenekler: ["Sarı-Kırmızı", "Sarı-Lacivert", "Bordo-Mavi", "Siyah-Beyaz"], dogru: 2 },
    { soru: "Beşiktaş'ın simgeleşmiş semt ve stat adıleşen bölgesi neresidir?", secenekler: ["Kadıköy", "Beşiktaş / Dolmabahçe", "Florya", "Ovacık"], dogru: 1 },
    { soru: "Fenerbahçe'nin stadının adı nedir?", secenekler: ["Ali Sami Yen", "Vodafone Park", "Şükrü Saracoğlu Stadyumu", "Medical Park Stadyumu"], dogru: 2 },
    { soru: "Galatasaray'ın iç saha maçlarını oynadığı stadyumun adı nedir?", secenekler: ["Rams Park", "Fenerbahçe Şükrü Saracoğlu", "Beşiktaş Park", "Eryaman Stadyumu"], dogru: 0 },
    { soru: "Süper Lig tarihinde şampiyonluk yaşamış Anadolu kulüplerinden biri aşağıdakilerden hangisidir?", secenekler: ["Altay", "Bursaspor", "Göztepe", "Ankaragücü"], dogru: 1 },
    { soru: "Bursaspor hangi yıl Süper Lig şampiyonu olarak büyük bir tarihi başarı elde etmiştir?", secenekler: ["1999-2000", "2009-2010", "2010-2011", "2015-2016"], dogru: 1 },
    { soru: "Süper Lig'de en çok şampiyonluk kazanan takım hangisidir?", secenekler: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"], dogru: 2 },

    // --- LEVEL 4 (Uluslararası Turnuvalar ve Kupalar) ---
    { soru: "Dünya Kupası ilk kez hangi yıl düzenlenmiştir?", secenekler: ["1920", "1930", "1950", "1960"], dogru: 1 },
    { soru: "İlk FIFA Dünya Kupası'na ev sahipliği yapan ve aynı zamanda finali kazanan ülke hangisidir?", secenekler: ["Brezilya", "İtalya", "Uruguay", "Arjantin"], dogru: 2 },
    { soru: "Avrupa Futbol Şampiyonası (EURO) ilk kez hangi yıl düzenlenmiştir?", secenekler: ["1952", "1960", "1972", "1980"], dogru: 1 },
    { soru: "UEFA Şampiyonlar Ligi'nin eski adı neydi?", secenekler: ["UEFA Kupası", "Şampiyon Kulüpler Kupası", "Kupa Galipleri Kupası", "Fuar Şehirleri Kupası"], dogru: 1 },
    { soru: "Dünya Kupası organizasyonu kaç yılda bir düzenlenir?", secenekler: ["2", "3", "4", "5"], dogru: 2 },
    { soru: "Milli takımlar düzeyinde Güney Amerika'nın en eski kıtasal turnuvasının adı nedir?", secenekler: ["Copa America", "Gold Cup", "Asya Kupası", "Afrika Uluslar Kupası"], dogru: 0 },
    { soru: "UEFA Avrupa Ligi'nin eski ismi hangi seçenekte doğru verilmiştir?", secenekler: ["UEFA Kupa Galipleri Kupası", "UEFA Kupası", "Intertoto Kupası", "Süper Kupa"], dogru: 1 },
    { soru: "Dünya Kupası tarihinde turnuvayı en çok kazanan (5 kez) ülke hangisidir?", secenekler: ["Almanya", "İtalya", "Brezilya", "Arjantin"], dogru: 2 },
    { soru: "Avrupa Futbol Şampiyonası'nı en çok kazanan ülkeler arasında aşağıdakilerden hangisi yer alır?", secenekler: ["İspanya ve Almanya", "İngiltere ve Fransa", "Brezilya ve Arjantin", "Portekiz ve Hollanda"], dogru: 0 },
    { soru: "FIFA'nın merkezi hangi ülkede bulunmaktadır?", secenekler: ["Fransa", "İsviçre", "İngiltere", "Almanya"], dogru: 1 },

    // --- LEVEL 5 (Efsanevi Futbolcular - Giriş) ---
    { soru: "Arjantinli efsanevi futbolcu Diego Maradona hangi ünlü golüyle tanınır?", secenekler: ["Tanrı'nın Eli", "Rövaşata Golü", "Orta Saha Golü", "Kafa Golü"], dogru: 0 },
    { soru: "Brezilyalı efsane futbolcu Pelé'nin gerçek adı nedir?", secenekler: ["Edson Arantes do Nascimento", "Ronaldo de Assis Moreira", "Arthur Antunes Coimbra", "Ricardo Izecson dos Santos Leite"], dogru: 0 },
    { soru: "Fransa futbolunun efsanevi orta saha oyuncusu ve Real Madrid'in eski teknik direktörü kimdir?", secenekler: ["Thierry Henry", "Zinedine Zidane", "Michel Platini", "Didier Deschamps"], dogru: 1 },
    { soru: "Kariyerinde çok sayıda Altın Top (Ballon d'Or) ödülü bulunan Portekizli yıldız kimdir?", secenekler: ["Lionel Messi", "Cristiano Ronaldo", "Neymar Jr.", "Kylian Mbappe"], dogru: 1 },
    { soru: "Barcelona ve Arjantin milli takımının efsanevi ismi, çok sayıda Ballon d'Or sahibi futbolcu kimdir?", secenekler: ["Lionel Messi", "Ronaldinho", "Diego Maradona", "Gabriel Batistuta"], dogru: 0 },
    { soru: "Hollandalı efsane oyuncu ve 'Total Futbol' felsefesinin simge ismi kimdir?", secenekler: ["Marco van Basten", "Johan Cruyff", "Ruud Gullit", "Frank Rijkaard"], dogru: 1 },
    { soru: "İngiliz futbolunun efsanevi golcüsü, uzun yıllar Manchester United forması giyen ve serbest vuruşlarıyla tanınan oyuncu kimdir?", secenekler: ["David Beckham", "Wayne Rooney", "Bobby Charlton", "Michael Owen"], dogru: 0 },
    { soru: "İtalyan savunma efsanesi, uzun yıllar Milan forması giymiş olan ünlü stadyumda adı anılan isim kimdir?", secenekler: ["Paolo Maldini", "Gianluigi Buffon", "Fabio Cannavaro", "Alessandro Nesta"], dogru: 0 },
    { soru: "Brezilyalı sol bek, muazzam sert frikikleriyle tanınan efsane oyuncu kimdir?", secenekler: ["Cafu", "Roberto Carlos", "Marcelo", "Dani Alves"], dogru: 1 },
    { soru: "Fransız golcü, Arsenal efsanesi 'Titi' lakaplı futbolcu kimdir?", secenekler: ["Thierry Henry", "David Trezeguet", "Karim Benzema", "Eric Cantona"], dogru: 0 },

... [360 soru daha benzer şekilde 40 level olarak sisteme entegre edilebilir]
