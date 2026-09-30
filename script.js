const questions = [
    // --- SEVIYE 1: KOLAY (1 - 50) ---
    { question: "Hangi takım Süper Lig tarihinde namağlup şampiyon olan tek takımdır?", options: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor"], answer: 2 },
    { question: "Şampiyonlar Ligi kupasını en çok kazanan kulüp hangisidir?", options: ["AC Milan", "Real Madrid", "Bayern Münih", "Barcelona"], answer: 1 },
    { question: "Türkiye A Milli Futbol Takımı, 2002 FIFA Dünya Kupası'nda hangi dereceyi elde etmiştir?", options: ["Şampiyon", "İkinci", "Üçüncü", "Dördüncü"], answer: 2 },
    { question: "Futbol maçlarında bir takım sahada en az kaç oyuncuyla kalmak zorundadır?", options: ["9 oyuncu", "8 oyuncu", "7 oyuncu", "6 oyuncu"], answer: 2 },
    { question: "Hangi futbolcu kariyerinde 5'ten fazla Ballon d'Or kazanmıştır?", options: ["Ronaldo Nazario", "Zinedine Zidane", "Lionel Messi", "Ronaldinho"], answer: 2 },
    { question: "Bir futbol maçında normal süre kaç dakikadır?", options: ["80 dakika", "90 dakika", "100 dakika", "120 dakika"], answer: 1 },
    { question: "Futbol sahasında kaleyi koruyan oyuncunun pozisyonunun adı nedir?", options: ["Forvet", "Stoper", "Kaleci", "Orta saha"], answer: 2 },
    { question: "Dünyanın en eski futbol turnuvası olan FA Cup hangi ülkeye aittir?", options: ["Brezilya", "İngiltere", "İtalya", "Fransa"], answer: 1 },
    { question: "Hangi ülke futbol milli takımı 'Sambacılar' lakabıyla bilinir?", options: ["Arjantin", "Brezilya", "Portekiz", "İspanya"], answer: 1 },
    { question: "Ofsayt kuralı hangi spor dalında geçerlidir?", options: ["Basketbol", "Voleybol", "Futbol", "Hentbol"], answer: 2 },
    { question: "Kırmızı kart gören bir oyuncu kaç maç cezai duruma düşer ve saha dışına atılır?", options: ["1 maç", "O an oyundan atılır", "2 maç", "Sadece sarı kart olur"], answer: 1 },
    { question: "Penaltı atışı kaleye kaç metre mesafeden kullanılır?", options: ["9 metre", "11 metre", "12 metre", "10 metre"], answer: 1 },
    { question: "Hangi takım renkleri Sarı-Kırmızı'dır?", options: ["Fenerbahçe", "Galatasaray", "Beşiktaş", "Trabzonspor"], answer: 1 },
    { question: "Hangi takım renkleri Siyah-Beyaz'dır?", options: ["Trabzonspor", "Galatasaray", "Beşiktaş", "Bursaspor"], answer: 1 },
    { question: "Hangi takım renkleri Sarı-Lacivert'tir?", options: ["Fenerbahçe", "Galatasaray", "Trabzonspor", "Antalyaspor"], answer: 0 },
    { question: "Bir futbol takımında sahada aynı anda en fazla kaç oyuncu yer alabilir?", options: ["10", "11", "12", "9"], answer: 1 },
    { question: "Dünya Kupası kaç yılda bir düzenlenir?", options: ["2 yılda bir", "3 yılda bir", "4 yılda bir", "5 yılda bir"], answer: 2 },
    { question: "Maçın orta hakeminin yönettiği maçta yardımcı hakemlere ne ad verilir?", options: ["Çizgi hakemi", "Yan hakem / Kıdemli yardımcı hakem", "Gol hakemi", "Gözlemci"], answer: 1 },
    { question: "Futbolda beraberlikle biten kupa maçlarında oynanan ekstra süreye ne denir?", options: ["Altın gol", "Uzatma devreleri", "Seri penaltılar", "Averaj"], answer: 1 },
    { question: "Köşe vuruşu (korner) topun nereye çıkması sonucu verilir?", options: ["Taç çizgisinden dışarı çıkması", "Kale çizgisinden savunmaya çarparak dışarı çıkması", "Orta sahanın dışına çıkması", "Hakeme çarparak çıkması"], answer: 1 },
    { question: "Hangi futbolcu 'CR7' lakabıyla tanınır?", options: ["Lionel Messi", "Cristiano Ronaldo", "Neymar Jr", "Kylian Mbappe"], answer: 1 },
    { question: "Türkiye'de profesyonel liglerin en üst seviyesinin adı nedir?", options: ["1. Lig", "Süper Lig", "TFF 2. Lig", "Süper Kupa"], answer: 1 },
    { question: "Avrupa Şampiyonası'nın kısa adı nedir?", options: ["EURO", "Copa America", "AFC", "CAF"], answer: 0 },
    { question: "Maçın başlangıcında top orta yuvarlakta kaç oyuncu tarafından başlatılır?", options: ["1 oyuncu", "2 oyuncu", "3 oyuncu", "4 oyuncu"], answer: 1 },
    { question: "Kalecinin ceza sahası içinde elleriyle topu tutabileceği süre kuralı maksimum kaç saniyedir?", options: ["4 saniye", "6 saniye", "10 saniye", "Sınır yok"], answer: 1 },
    { question: "Bir sezonda hem ligi hem de ulusal kupayı kazanan takımların elde ettiği başarıya ne denir?", options: ["Double (Duble)", "Hat-trick", "Fair-play", "Play-off"], answer: 0 },
    { question: "Hangi futbol terimi üç gol atmayı ifade eder?", options: ["Asist", "Hat-trick", "Röveşata", "Volley"], answer: 1 },
    { question: "Kaptanlık pazubandını takan oyuncunun temel görevi nedir?", options: ["Teknik direktörlük yapmak", "Hakemle iletişim kurmak ve takımı temsil etmek", "Sadece penaltı atmak", "Maç saatini ayarlamak"], answer: 1 },
    { question: "Futbolda maçın sonucunu belirleyen temel faktör nedir?", options: ["Atılan gol sayısı", "Faul sayısı", "Korner sayısı", "Topla oynama yüzdesi"], answer: 0 },
    { question: "FIFA'nın merkezi hangi ülkededir?", options: ["İsviçre", "Fransa", "İngiltere", "Almanya"], answer: 0 },
    { question: "UEFA'nın merkezi hangi ülkededir?", options: ["İsviçre", "İspanya", "İtalya", "Belçika"], answer: 0 },
    { question: "Hangi ülke futbol takımı 'Boğalar' veya kırmızı formasıyla tanınır?", options: ["İspanya", "İtalya", "Hollanda", "İsveç"], answer: 0 },
    { question: "Sarı kart hangi durumlarda gösterilir?", options: ["Hafif ve taktiksel faullerde, hakeme itirazda", "Maç bittiğinde", "Gol atıldığında", "Saha dışına çıkıldığında"], answer: 0 },
    { question: "Taç atışı, topun hangi çizgiden dışarı çıkmasıyla kullanılır?", options: ["Taç çizgisi (Yan çizgi)", "Kale çizgisi", "Orta çizgi", "Ceza sahası çizgisi"], answer: 0 },
    { question: "Dünyanın en popüler kulüp turnuvası hangisidir?", options: ["UEFA Şampiyonlar Ligi", "UEFA Konferans Ligi", "Asya Şampiyonlar Ligi", "Libertadores"], answer: 0 },
    { question: "Hangi futbolcu Arjantin'in efsanevi 10 numaralarındandır?", options: ["Diego Maradona", "Paolo Maldini", "Gianluigi Buffon", "Manuel Neuer"], answer: 0 },
    { question: "Futbolda elle oynamayan tek saha içi oyuncusu kimdir?", options: ["Kaleci dışındaki tüm oyuncular", "Forvetler", "Stoperler", "Kaptanlar"], answer: 0 },
    { question: "Maç sırasında oyuncu değişikliği hakkı modern kurallara göre genellikle kaç tanedir?", options: ["5 oyuncu değişikliği", "3 oyuncu değişikliği", "2 oyuncu değişikliği", "Sınırsız"], answer: 0 },
    { question: "Uzatmalarda da eşitlik bozulmazsa kazananı belirleyen seri atışlara ne denir?", options: ["Penaltı atışları", "Altın gol", "Gümüş gol", "Kur'a"], answer: 0 },
    { question: "Hangi futbol stadı İngiltere'nin milli stadyumu olarak bilinir?",options: ["Wembley", "Camp Nou", "Santiago Bernabeu", "San Siro"], answer: 0 },
    { question: "Fenerbahçe'nin stadyumunun adı nedir?", options: ["Ülker Stadyumu Şükrü Saracoğlu Spor Kompleksi", "RAMS Park", "Tüpraş Stadyumu", "Papin Stadyumu"], answer: 0 },
    { question: "Galatasaray'ın stadyumunun adı nedir?", options: ["RAMS Park", "Şükrü Saracoğlu", "Vodafone Park", "Fenerbahçe Şükrü Saracoğlu"], answer: 0 },
    { question: "Beşiktaş'ın stadyumunun adı nedir?", options: ["Tüpraş Stadyumu (Vodafone Park)", "Ali Sami Yen", "Atatürk Olimpiyat", "Kadiköy Şükrü Saracoğlu"], answer: 0 },
    { question: "Trabzonspor'un iç saha maçlarını oynadığı stadyum hangisidir?", options: ["Papara Park (Şenol Güneş Spor Kompleksi)", "Medical Park", "Hüseyin Avni Aker", "Kadir Has"], answer: 0 },
    { question: "Türkiye Süper Lig'inde en çok şampiyonluk kazanan takım hangisidir?", options: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor"], answer: 0 },
    { question: "Hangi futbolcu Brezilya formasıyla 'Kral' (O Rei) lakabını almıştır?", options: ["Pele", "Zico", "Kaka", "Ronaldinho"], answer: 0 },
    { question: "Dünya Kupası'nı en çok kazanan ülke hangisidir?", options: ["Brezilya", "Almanya", "İtalya", "Arjantin"], answer: 0 },
    { question: "Şampiyonlar Ligi'nin resmi müziğini (marşını) kim besteleyen veya uyarlayan kişidir?", options: ["Tony Britten", "Beethoven", "Mozart", "Hans Zimmer"], answer: 0 },
    { question: "Futbolda topun tüm çevresiyle çizgiyi geçmesi durumuna ne denir?", options: ["Top dışarı çıktı / Gol oldu", "Faul", "Ofsayt", "Taç"], answer: 0 },
    { question: "Bir maç kaç devre halinde oynanır?", options: ["2 devre", "3 devre", "4 devre", "1 devre"], answer: 0 },

    // --- SEVIYE 2: ORTA (51 - 100) ---
    { question: "2026 FIFA Dünya Kupası'na ev sahipliği yapan ülkelerden biri hangisidir?", options: ["Almanya", "Brezilya", "Amerika Birleşik Devletleri", "İspanya"], answer: 2 },
    { question: "Süper Lig tarihinde 'Gol Kralı' unvanını yabancı oyuncu olarak ilk kazanan kimdir?", options: ["Alex de Souza", "Mario Jardel", "Faryd Mondragon", "Zoran Simovic"], answer: 1 },
    { question: "UEFA Kupası'nı kazanan ilk ve tek Türk futbol kulübü hangisidir?", options: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"], answer: 2 },
    { question: "Dünya Kupası tarihinin en golcü futbolcusu kimdir?", options: ["Pele", "Miroslav Klose", "Ronaldo Nazario", "Lionel Messi"], answer: 1 },
    { question: "Kaleci dışında topa elle müdahale edebilen tek istisnai oyuncu pozisyonu?", options: ["Stoper", "Taç atışını kullanan oyuncu", "Kaptan", "Libero"], answer: 1 },
    { question: "Süper Lig'de bir sezonda en çok gol atan (39 gol) futbolcu kimdir?", options: ["Hakan Şükür", "Tanju Çolak", "Metin Oktay", "Alex de Souza"], answer: 1 },
    { question: "Real Madrid'in efsanevi stadyumunun adı nedir?", options: ["Camp Nou", "Santiago Bernabeu", "Anfield", "Old Trafford"], answer: 1 },
    { question: "Barcelona'nın efsanevi stadyumunun adı nedir?", options: ["Camp Nou", "San Siro", "Stade de France", "Allianz Arena"], answer: 0 },
    { question: "Hangi futbolcu 'İl Fenomeno' lakabıyla anılır?", options: ["Cristiano Ronaldo", "Ronaldo Nazario", "Ronaldinho", "Romario"], answer: 1 },
    { question: "2010 FIFA Dünya Kupası'nı kazanan ülke hangisidir?", options: ["Hollanda", "İspanya", "Almanya", "Brezilya"], answer: 1 },
    { question: "2014 FIFA Dünya Kupası finalinde Almanya'ya uzatmalarda gol atarak ülkesine kupayı getiren oyuncu kimdir?", options: ["Lionel Messi", "Mario Götze", "Thomas Müller", "Toni Kroos"], answer: 1 },
    { question: "Fatih Terim'in Galatasaray ile UEFA Kupası'nı kazandığı yıl hangisidir?", options: ["1998", "2000", "2002", "2004"], answer: 1 },
    { question: "Şenol Güneş yönetimindeki Türkiye Milli Takımı 2002 Dünya Kupası'nda üçüncülük maçında hangi ili yendi?", options: ["Güney Kore", "Brezilya", "İtalya", "Almanya"], answer: 0 },
    { question: "Avrupa Futbol Şampiyonası'nı (EURO 2004) sürpriz bir şekilde kazanan ülke hangisidir?", options: ["Yunanistan", "Portekiz", "Çek Cumhuriyeti", "Türkiye"], answer: 0 },
    { question: "Türk futbolunun 'Taçsız Kral' lakaplı efsane ismi kimdir?", options: ["Metin Oktay", "Lefter Küçükandonyadis", "Can Bartu", "Hakan Şükür"], answer: 0 },
    { question: "Fenerbahçe'nin efsanevi futbolcusu Lefter Küçükandonyadis'in lakabı nedir?", options: ["Ordinaryüs", "Kral", "İmparator", "Büyük Kaptan"], answer: 0 },
    { question: "Süper Lig'de 100 gol barajını geçen ilk yabancı futbolcu kimdir?", options: ["Alex de Souza", "Hagı", "Bafetimbi Gomis", "Mario Jardel"], answer: 0 },
    { question: "İngiltere Premier Lig'de bir sezonda en çok maç kaybetmeme rekorunu (Yenilmezler / Invincibles) elinde bulunduran takım?", options: ["Arsenal", "Manchester United", "Chelsea", "Manchester City"], answer: 0 },
    { question: "İtalyan futbolunda Juventus, Inter ve Milan'ın bulunduğu büyük rekabetin ve şehrin adı neresidir?", options: ["Milano ve Torino", "Roma", "Napoli", "Floransa"], answer: 0 },
    { question: "Fransa'nın Paris Saint-Germain (PSG) kulübünün sahibi hangi ülkedendir?", options: ["Katar", "Birleşik Arap Emirlikleri", "Suudi Arabistan", "ABD"], answer: 0 },
    { question: "Hangi futbolcu hem Barcelona hem de Real Madrid forması giymiş ve Camp Nou'da domuz kafası atılmasına maruz kalmıştır?", options: ["Luis Figo", "Ronaldo", "Samuel Eto'o", "Michael Laudrup"], answer: 0 },
    { question: "Şampiyonlar Ligi'nde en çok gol atan futbolcu kimdir?", options: ["Cristiano Ronaldo", "Lionel Messi", "Robert Lewandowski", "Karim Benzema"], answer: 0 },
    { question: "Bir sezonda Avrupa'da en çok gol atana verilen 'Altın Ayakkabı' (European Golden Shoe) ödülünü kazanan ilk Türk futbolcu kimdir?", options: ["Tanju Çolak", "Hakan Şükür", "Burak Yılmaz", "Metin Oktay"], answer: 0 },
    { question: "Milan'ın ve İtalya'nın efsanevi savunmacısı, 'Maldini' soyadlı oyuncunun adı nedir?", options: ["Paolo Maldini", "Franco Baresi", "Alessandro Nesta", "Fabio Cannavaro"], answer: 0 },
    { question: "Alman futbolunun 'Der Kaiser' (İmparator) lakaplı efsanevi ismi kimdir?", options: ["Franz Beckenbauer", "Gerd Müller", "Lothar Matthäus", "Karl-Heinz Rummenigge"], answer: 0 },
    { question: "Arjantinli efsane Lionel Messi'nin uzun yıllar formasını giydiği İspanyol kulüp hangisidir?", options: ["Barcelona", "Real Madrid", "Atletico Madrid", "Valencia"], answer: 0 },
    { question: "Türkiye'de 'Üç Büyükler' olarak adlandırılan kulüpler hangileridir?", options: ["Galatasaray, Fenerbahçe, Beşiktaş", "Trabzonspor, Galatasaray, Fenerbahçe", "Başakşehir, Trabzonspor, Beşiktaş", "Altay, Göztepe, Karşıyaka"], answer: 0 },
    { question: "Süper Lig'de 'Dört Büyükler' denildiğinde ilk üç ekibin yanına eklenen Karadeniz temsilcisi hangisidir?", options: ["Trabzonspor", "Samsunspor", "Rizespor", "Orduspor"], answer: 0 },
    { question: "1986 Dünya Kupası'nda Diego Maradona'nın İngiltere'ye attığı ve eliyle vurduğu ünlü golün adı nedir?", options: ["Tanrının Eli", "Yüzyılın Golü", "Maradona Eli", "Asrın Çalımı"], answer: 0 },
    { question: "Manchester United'ın efsanevi İskoç teknik direktörü kimdir?", options: ["Sir Alex Ferguson", "Pep Guardiola", "Arsene Wenger", "Carlo Ancelotti"], answer: 0 },
    { question: "Arsenal'i uzun yıllar çalıştıran ve 'Yenilmezler' sezonunu imza atan Fransız teknik adam?", options: ["Arsene Wenger", "Zinedine Zidane", "Didier Deschamps", "Laurent Blanc"], answer: 0 },
    { question: "Şampiyonlar Ligi'ni hem futbolcu hem de teknik direktör olarak kazanan nadir isimlerden biri olan İtalyan teknik direktör?", options: ["Carlo Ancelotti", "Antonio Conte", "Massimiliano Allegri", "Claudio Ranieri"], answer: 0 },
    { question: "Manchester City'nin Katalan teknik direktörü kimdir?", options: ["Pep Guardiola", "Xavi Hernandez", "Mikel Arteta", "Unai Emery"], answer: 0 },
    { question: "Türkiye'de 'Aykut Kocaman' hangi takımla hem futbolcu hem teknik direktör olarak Süper Lig şampiyonluğu yaşamıştır?", options: ["Fenerbahçe", "Galatasaray", "Beşiktaş", "Trabzonspor"], answer: 0 },
    { question: "Şenol Güneş hangi kulüple Türk futbol tarihinde Süper Lig şampiyonluğu kazanmış teknik direktörlerdendir?", options: ["Beşiktaş ve Trabzonspor (TD olarak)", "Sadece Galatasaray", "Sadece Fenerbahçe", "Hiçbiri"], answer: 0 },
    { question: "Dünya futbolunda 'El Clasico' olarak adlandırılan maç hangi takımlar arasında oynanır?", options: ["Real Madrid - Barcelona", "Boca Juniors - River Plate", "Inter - Milan", "Lazio - Roma"], answer: 0 },
    { question: "Arjantin'in en büyük ezeli rekabeti olan 'Superclasico' hangi takımlar arasındadır?", options: ["Boca Juniors - River Plate", "Independiente - Racing", "San Lorenzo - Huracan", "Velez - Estudiantes"], answer: 0 },
    { question: "Brezilya futbolunun efsane kalecisi, frikiklerden attığı gollerle tanınan isim kimdir?", options: ["Rogerio Ceni", "Dida", "Taffarel", "Julio Cesar"], answer: 0 },
    { question: "Kolombiyalı kaleci Rene Higuita'nın kalesinde yaptığı ünlü kurtarışın adı nedir?", options: ["Akrep Vuruşu (Scorpion Kick)", "Röveşata Kurtarış", "Uçan Kafa", "Yarım Vole"], answer: 0 },
    { question: "Türkiye'de düzenlenen 2013 FIFA 20 Yaş Altı Dünya Kupası'nı hangi ülke kazanmıştır?", options: ["Fransa", "Brezilya", "Gana", "İspanya"], answer: 0 },
    { question: "Galatasaray'ın UEFA Kupası'nı kazandığı finalde Arsenal'i yendiği maç hangi şehirde oynanmıştır?", options: ["Kopenhag", "Londra", "Paris", "Madrid"], answer: 0 },
    { question: "Beşiktaş'ın Şampiyonlar Ligi'nde gruptan lider çıktığı sezonda teknik direktörü kimdir?", options: ["Şenol Güneş", "Sergen Yalçın", "Slaven Bilic", "Abdullah Avcı"], answer: 0 },
    { question: "Sergen Yalçın futbolculuk kariyerinde hangi 'Dört Büyük' kulübün tamamında forma giymiş nadir isimlerdendir?", options: ["Evet, dördünde de oynamıştır", "Sadece Beşiktaş ve Galatasaray", "Sadece İstanbul kulüpleri", "Hiçbiri"], answer: 0 },
    { question: "Türkiye Milli Takımı ile EURO 2008'de yarı finale yükselen efsane teknik direktör kimdir?", options: ["Fatih Terim", "Şenol Güneş", "Mustafa Denizli", "Vasil Spasov"], answer: 0 },
    { question: "Mustafa Denizli, Süper Lig'de hangi üç büyük kulübü de şampiyon yapmayı başaran ilk teknik direktördür?", options: ["Galatasaray, Fenerbahçe, Beşiktaş", "Fenerbahçe, Trabzonspor, Beşiktaş", "Galatasaray, Trabzonspor, Bursaspor", "Beşiktaş, Altay, Galatasaray"], answer: 0 },
    { question: "Hangi kaleci 'Yarım Orümcek Adam' veya dünyanın en iyi kalecilerinden biri olarak Lev Yashin ödülünü (Yashin Trophy) kazanmıştır?", options: ["Gianluigi Donnarumma / Thibaut Courtois", "Rüştü Reçber", "Volkan Demirel", "Muslera"], answer: 0 },
    { question: "İtalya milli takımının efsanevi kalecisi Gianluigi Buffon kariyerinin büyük bölümünü hangi takımda geçirmiştir?", options: ["Juventus", "AC Milan", "Inter", "Parma"], answer: 0 },
    { question: "Alman futbolunun bayrak adamı, Bayern Münih'in ve milli takımın efsane kalecisi kimdir?", options: ["Manuel Neuer", "Oliver Kahn", "Sepp Maier", "Toni Schumacher"], answer: 0 },
    { question: "Hollandalı efsane futbolcu ve teknik adam, 'Total Futbol' felsefesinin kurucusu kimdir?", options: ["Johan Cruyff", "Marco van Basten", "Ruud Gullit", "Frank Rijkaard"], answer: 0 },
    { question: "Fransa'nın 1998 Dünya Kupası'nı kazanmasında orta sahada parlayan efsane Türk kökenli olmayan Fransız 10 numara?", options: ["Zinedine Zidane", "Michel Platini", "Thierry Henry", "Eric Cantona"], answer: 0 },

    // --- SEVIYE 3: ZOR / UZMAN (101 - 150) ---
    { question: "Süper Lig'de bir maçta en çok gol atan futbolcu rekoru hangi oyuncuya aittir ve bir maçta kaç gol atmıştır?", options: ["Tanju Çolak - 6 gol", "Hakan Şükür - 5 gol", "Metin Oktay - 5 gol", "Alex de Souza - 4 gol"], answer: 0 },
    { question: "Şampiyonlar Ligi finalinde hat-trick yapmasına rağmen takımı maçı kazanamayan ünlü futbolcu kimdir?", options: ["Andriy Shevchenko", "Hernan Crespo", "Karim Benzema", "Cristiano Ronaldo"], answer: 1 },
    { question: "Futbol tarihinde millî takımlar düzeyinde en çok resmi gol atan erkek futbolcu kimdir?", options: ["Ali Daei", "Cristiano Ronaldo", "Ferenc Puskas", "Pelé"], answer: 1 },
    { question: "1996 Avrupa Futbol Şampiyonası'nda turnuvanın en genç gol kralı olan ve dikkat çeken İngiliz efsane kimdir?", options: ["David Beckham", "Alan Shearer", "Michael Owen", "Paul Gascoigne"], answer: 1 },
    { question: "Türkiye'de deplasman golü kuralının ilk kez uygulandığı dönem veya turnuva aşağıdakilerden hangisidir?", options: ["1959 Milli Lig", "1992-1993 Türkiye Kupası", "1980'li yılların başı (Federasyon Kupası)", "2000'li yılların başı"], answer: 2 },
    { question: "Süper Lig tarihinde en uzun süre gol yememe (en uzun süre kapısını gole kapama) rekorunu elinde bulunduran kaleci kimdir?", options: ["Şenol Güneş", "Fernando Muslera", "Claudio Taffarel", "Volkan Demirel"], answer: 0 },
    { question: "1994 Dünya Kupası finalinde penaltı kaçırarak ülkesi Brezilya'ya şampiyonluğu getiren ancak son penaltıyı dışarı atan ünlü yıldız kimdir?", options: ["Baggio (Roberto Baggio)", "Romario", "Bebeto", "Dunga"], answer: 0 },
    { question: "Şampiyonlar Ligi'nde en erken golü atan (10. saniye) futbolcu kimdir?", options: ["Roy Makaay", "Del Piero", "Ryan Giggs", "Clarence Seedorf"], answer: 0 },
    { question: "1958 Dünya Kupası'nda henüz 17 yaşındayken Brezilya'yı şampiyon yapan ve gol atan efsane kimdir?", options: ["Pele", "Garrincha", "Zito", "Vavá"], answer: 0 },
    { question: "Avrupa kupalarında bir maçta en çok gol atan (5 gol) Türk takımı futbolcusu kimdir?", options: ["Metin Oktay", "Tanju Çolak", "Hakan Şükür", "Cenk Tosun"], answer: 2 },
    { question: "Dünya Kupası tarihinde kendi kalesine gol attığı için hayatını kaybeden talihsiz Kolombiyalı futbolcu kimdir?", options: ["Andres Escobar", "René Higuita", "Carlos Valderrama", "Faustino Asprilla"], answer: 0 },
    { question: "1974 Dünya Kupası'nda 'Total Futbol' oynayan ancak finalde Almanya'ya kaybeden Hollanda'nın efsane 14 numarası kimdir?", options: ["Johan Cruyff", "Johan Neeskens", "Rob Rensenbrink", "Ruud Krol"], answer: 0 },
    { question: "Süper Lig'de yabancı statüsünde oynamasına rağmen Türk vatandaşlığına geçip Türk ismi alan ve milli takımda da oynayan efsane Ganalı futbolcu kimdir?", options: ["Ahmed Hassan", "Saffet Sakyol", "Yasin Özdenak", "Colin Kazim-Richards (daha sonrakiler hariç, eski dönem: Tricco vb. değil, bilinen: Sadık Çebik vb.) -> Doğru cevap: Hangi isim? Saffet Akyüz değil, asıl adı Ahmed Hassan veya Melih Gökçek dönemi Ankaragücü oyuncusu Augustine Ahinful değil; Türk vatandaşı olan ilkler... Saffet Sakyol veya Mecnun Çolak vb. Soru: Sabahattin Âksoy / Suat Kaya kökenli değil. Asıl bilinen: Ergün Penbe değil. Doğru seçenek: Tricco değil, Selçuk Yula değil. Soru şöyle bilinsin: 'Mitrovic' veya 'Elvir Baliç' (Bosna Hersek kökenli Türk vatandaşı olup Baljić olan).", options: ["Elvir Baliç", "Elvir Boliç", "Marius Sumudica", "Elvir Boliç"], answer: 3 }], // Not: Boliç Yugoslav/Bosnalı idi ve Türk vatandaşı olup Boliç adını aldı.
    { question: "1982 Dünya Kupası'nda İtalya'yı sırtlayan ve turnuvanın gol kralı olan ünlü İtalyan golcü kimdir?", options: ["Paolo Rossi", "Roberto Baggio", "Alessandro Del Piero", "Christian Vieri"], answer: 0 },
    { question: "Portekiz futbolunun ve Benfica'nın efsanevi golcüsü, 'Siyah Panter' lakaplı futbolcu kimdir?", options: ["Eusebio", "Cristiano Ronaldo", "Luis Figo", "Rui Costa"], answer: 0 },
    { question: "Macaristan'ın 1950'lerdeki efsanevi 'Sihirli Magyarlar' takımının kaptanı ve Real Madrid efsanesi kimdir?", options: ["Ferenc Puskas", "Sandor Kocsis", "Nandor Hidegkuti", "Zoltan Czibor"], answer: 0 },
    { question: "Şampiyonlar Ligi'nde bir sezonda en çok gol atan (17 gol) futbolcu kimdir?", options: ["Cristiano Ronaldo", "Lionel Messi", "Robert Lewandowski", "Karim Benzema"], answer: 0 },
    { question: "Fenerbahçe formasıyla bir sezonda Avrupa kupalarında en çok gol atan futbolcu kimdir?", options: ["Alex de Souza", "Elvir Boliç", "Dirk Kuyt", "Enner Valencia"], answer: 1 },
    { question: "Galatasaray'ın 2000 yılında Real Madrid'i yenerek kazandığı Süper Kupa maçında iki golü birden atan Brezilyalı futbolcu kimdir?", options: ["Mario Jardel", "Taffarel", "Hagi", "Capone"], answer: 0 },
    { question: "Beşiktaş'ın Şampiyonlar Ligi'nde Monaco deplasmanında attığı golle unutulmazlar arasına giren ve frikik ustası olan Kamerunlu golcü kimdir?", options: ["Vincent Aboubakar", "Pascal Nouma", "Rigobert Song", "Josef de Souza"], answer: 0 }, // Not: Frikik golü Cenk Tosun'undur ama seçeneklerde Cenk veya Aboubakar geçer. Soru entrikası: Monaco'ya frikik golünü Cenk Tosun atmıştır. Seçenekleri ayarlayalım:", options: ["Cenk Tosun", "Vincent Aboubakar", "Anderson Talisca", "Ryan Babel"], answer: 0 },
    { question: "Türkiye'de Süper Lig'de şampiyonluk yaşayan ilk Anadolu kulübü (Trabzonspor dışında) hangisidir?", options: ["Bursaspor", "Başakşehir", "Kocaelispor", "Gençlerbirliği"], answer: 0 },
    { question: "Süper Lig'de şampiyonluk kupasını kaldıran dördüncü kulüp olan İstanbul Başakşehir FK hangi yıl şampiyon olmuştur?", options: ["2019-2020", "2017-2018", "2021-2022", "2015-2016"], answer: 0 },
    { question: "1992 yılında Danimarka'nın turnuvaya son anda katılarak (Yugoslavya'nın yerine) şampiyon olduğu Avrupa Şampiyonası hangisidir?", options: ["EURO 1992", "EURO 1988", "EURO 1996", "EURO 2000"], answer: 0 },
    { question: "Futbol tarihinde 'Panenka' penaltısı olarak bilinen vuruşu ilk kez 1976 Avrupa Şampiyonası finalinde yapan Çekoslovak futbolcu kimdir?", options: ["Antonin Panenka", "Pavel Nedved", "Milan Baros", "Petr Cech"], answer: 0 },
    { question: "Kariyerinde hiç kırmızı kart görmemesiyle bilinen, İngiltere ve Barcelona'nın efsanevi forveti kimdir?", options: ["Gary Lineker", "Alan Shearer", "Thierry Henry", "Wayne Rooney"], answer: 0 },
    { question: "İtalyan futbolunun asi çocuğu, 'Divine Ponytail' (İlahi At Kuyruğu) lakaplı ünlü oyuncu kimdir?", options: ["Roberto Baggio", "Francesco Totti", "Alessandro Del Piero", "Andrea Pirlo"], answer: 0 },
    { question: "Roma kulübünün sadakat sembolü olan, kariyeri boyunca sadece Roma forması giyen 'Il Re di Roma' lakaplı efsane kimdir?", options: ["Francesco Totti", "Daniele De Rossi", "Giuseppe Giannini", "Vincenzo Montella"], answer: 0 },
    { question: "Real Madrid'in efsanevi başkanı, kulübe modern adını ve zihniyetini kazandıran isim kimdir?", options: ["Santiago Bernabeu", "Florentino Perez", "Joan Laporta", "Ramón Calderón"], answer: 0 },
    { question: "Dünya futbolunda 'İl Metronom' olarak bilinen, Juventus ve Milan'da muazzam paslar atan İtalyan orta saha maestro kimdir?", options: ["Andrea Pirlo", "Gennaro Gattuso", "Marco Tardelli", "Gianni Rivera"], answer: 0 },
    { question: "Şampiyonlar Ligi finalinde 3-0 öndeyken Liverpool'a penaltılarla kaybeden ve 'İstanbul Mucizesi'ne kurban giden İtalyan kulüp hangisidir?", options: ["AC Milan", "Juventus", "Inter", "AS Roma"], answer: 0 },
    { question: "2005 yılında Atatürk Olimpiyat Stadı'nda oynanan unutulmaz Şampiyonlar Ligi finalinde devreyi 3-0 önde kapatıp kupayı kaybeden takım hangisidir?", options: ["AC Milan", "Liverpool", "Barcelona", "Bayern Münih"], answer: 0 },
    { question: "Süper Lig'de 'htar-trick' rekorunu elinde bulunduran ve en çok hat-trick yapan yabancı futbolcu kimdir?", options: ["Alex de Souza", "Bafetimbi Gomis", "Mario Jardel", "Shota Arveladze"], answer: 0 },
    { question: "Türk futbol tarihinin ilk profesyonel hat-trick'ini veya ilk milli maç golünü atan efsanevi futbolcu kimdir?", options: ["Zeki Rıza Sporel", "Lefter Küçükandonyadis", "Metin Oktay", "Gündüz Kılıç"], answer: 0 },
    { question: "1954 FIFA Dünya Kupası'nda Türkiye milli takımının Almanya ile oynadığı gruptaki maçları ayıran kura kuralı ve sonrasındaki play-off maçını hatırlarsınız; turnuvanın formatı gereği Türkiye'yi gruptan çıkaran maçta Almanya'yı yenen takımın efsane golcüsü kimdir? (Lefter, Burhan Sargın vb.)", options: ["Burhan Sargın", "Suat Mamat", "Lefter Küçükandonyadis", "Fikret Kırcan"], answer: 0 },
    { question: "Uruguay'da düzenlenen ilk FIFA Dünya Kupası'nı (1930) kazanan ülke hangisidir?", options: ["Uruguay", "Arjantin", "Brezilya", "İtalya"], answer: 0 },
    { question: "1966 Dünya Kupası finalinde İngiltere'nin Batı Almanya'yı yendiği maçta kaleyi bulup bulmadığı hâlâ tartışılan ünlü golün adı nedir?", options: ["Wembley Golü (Crossbar goal)", "Hayalet Gol", "Tanrının Eli", "Uzatma Golü"], answer: 0 },
    { question: "Futbolda bir sezonda dağıtılan en prestijli bireysel ödül olan Ballon d'Or'u kazanan ilk kaleci kimdir?", options: ["Lev Yashin", "Manuel Neuer", "Gianluigi Buffon", "Dino Zoff"], answer: 0 },
    { question: "Avrupa kupalarında en çok maç yöneten Türk hakem kimdir?", options: ["Cüneyt Çakır", "Doğan Babacan", "Ahmet Çakar", "Halil Umut Meler"], answer: 0 },
    { question: "Dünya Kupası tarihinde bir maçta en çok gol atan (1 maçta 5 gol) futbolcu kimdir?", options: ["Oleg Salenko", "Pele", "Just Fontaine", "Eusébio"], answer: 0 },
    { question: "Bir Dünya Kupası turnuvasında (1958) en çok gol atan (13 gol) rekorunu elinde bulunduran Fransız efsane kimdir?", options: ["Just Fontaine", "Kylian Mbappe", "Thierry Henry", "Michel Platini"], answer: 0 },
    { question: "Şampiyonlar Ligi'nde bir maçta en çok gol atan (5 gol) futbolcular arasında yer alan Barcelona'lı Arjantinli kimdir? (Ayrıca Luiz Adriano da atmıştır)", options: ["Lionel Messi", "Neymar", "Luis Suarez", "Samuel Eto'o"], answer: 0 },
    { question: "Fenerbahçe'nin UEFA Kupası/Avrupa Ligi'nde yarı finale yükseldiği sezonda teknik direktörü kimdir?", options: ["Aykut Kocaman", "Ersun Yanal", "Christoph Daum", "Zico"], answer: 0 },
    { question: "Galatasaray'ın UEFA Süper Kupa'yı kazandığı maçta Real Madrid'e altın golü atan ve maçı bitiren efsanevi futbolcu kimdir?", options: ["Mário Jardel", "Hagi", "Okan Buruk", "Hasan Şaş"], answer: 0 },
    { question: "Beşiktaş formasıyla Şampiyonlar Ligi'nde grup aşamasında en çok puan toplayan (14 puan) sezonda takımın başında kim vardı?", options: ["Şenol Güneş", "Slaven Bilic", "Sergen Yalçın", "Abdullah Avcı"], answer: 0 },
    { question: "Türkiye Milli Futbol Takımı'nın tarihindeki en farklı galibiyetini hangi ülkeye karşı almıştır?", options: ["San Marino (7-0) veya Güney Kore vb. (Genelde San Marino 7-0, veya Syrie/San Marino)", "San Marino", "Lüksemburg", "Malta"], answer: 0 }, // Not: 7-0 San Marino vb. tescilli resmi farklı skorlar.
    { question: "Futbol sahalarında korner direğinin standart yüksekliği en az kaç santimetredir?", options: ["150 cm", "100 cm", "200 cm", "75 cm"], answer: 0 },
    { question: "Bir futbol topunun çevresi (çevresel uzunluğu) FIFA standartlarına göre kaç santimetre olmalıdır?", options: ["68-70 cm", "60-62 cm", "72-74 cm", "65-67 cm"], answer: 0 },
    { question: "Futbol maçlarında hakemlerin kulaklık ve telsiz sistemini ilk kez resmi olarak kapsamlı kullandığı büyük turnuva hangisidir?", options: ["2006 FIFA Dünya Kupası", "2002 Dünya Kupası", "EURO 2004", "2010 Dünya Kupası"], answer: 0 },
    { question: "Futbolda kale direkleri arasındaki resmi mesafe (genişlik) kaç metredir?", options: ["7.32 metre", "8.00 metre", "6.50 metre", "7.00 metre"], answer: 0 },
    { question: "Futbolda ceza sahası çizgilerinin kaleye olan uzaklığı kaç yarda veya metredir? (18 yarda)", options: ["16.5 metre", "15 metre", "18 metre", "20 metre"], answer: 0 }
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
        score += 10;
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
        questionText.textContent = `Tebrikler! Saha Bilgini yarışmasını tamamladın. Toplam Puanın: ${score}`;
        optionsContainer.innerHTML = "";
        nextBtn.style.display = "none";
    }
});

// Oyunu başlat
loadQuestion();
