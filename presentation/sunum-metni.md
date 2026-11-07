# İyiAdım — sunum konuşma metni

**Geriatrik rehabilitasyonda kişiye göre uyarlanan mobil web uygulaması**  
**Hazırlık tarihi:** 7 Kasım 2026 · **Önerilen süre:** yaklaşık 15 dakika; bunun 2 dakikası canlı gösterim.  
**Uygulama:** [fizyoappa.github.io/-yiad-m](https://fizyoappa.github.io/-yiad-m/)  
**Sunucu notu:** Teknik özelliklerin anlatımı yayımlanan sürümle birlikte kontrol edilmelidir. Teknik testlerin tamamlanma durumu, klinik uzman onayı anlamına gelmez.

## Slayt 1 — Hangi soruna çözüm geliştirdik?

İyiAdım'ı, yaşlı bireylerin evde hareket programını ve günlük sağlık kayıtlarını tek bir yerde takip edebilmesi için geliştirdik. Başlangıç sorumuz şuydu: Aynı yaşta olan iki kişinin tanıları, günlük yaşam hedefleri ve yardım ihtiyacı farklıysa, neden ikisine aynı egzersiz listesi verilsin?

Bu nedenle yalnızca egzersiz gösteren bir uygulama yerine, kişinin durumunu soran, uygun olmayan durumda programı durduran ve yaptığı kayıtları anlaşılır biçimde sunan bir eğitim prototipi tasarladık. Öğretim elemanımızın istediği klinik uygunluk, güvenlik, kişiselleştirme ve fonksiyonel bağımsızlık başlıklarını tasarımın merkezine aldık. Uygulamanın klinik etkinliğini kanıtladığımızı değil, bu gereksinimlere yazılım içinde nasıl karşılık verdiğimizi göstereceğiz.

## Slayt 2 — Neden mobil web uygulaması?

Yaşlı bir kullanıcının farklı mağazalardan uygulama bulmasını gerektirmemek için, telefon ekranına uyarlanan bir web uygulaması geliştirdik. Bağlantısı olan herkes siteyi açabilir; temel kullanım için ChatGPT veya GitHub hesabı gerekmez. Destekleyen cihazlarda ana ekrana eklenebilir.

Akışı bugün, egzersizler, takip, topluluk, yardımcı ve profil etrafında düzenledik. Büyük yazılar, belirgin düğmeler, sade Türkçe ve yazıyla açıklanan uyarılar kullandık. Bilgiyi yalnız renkle aktarmamaya çalıştık. İlk açılıştan sonra çevrimdışı önbellek temel sayfalara ve yerel kayıtlara erişimi destekler; hesap senkronizasyonu, ortak topluluk ve çevrimiçi yardımcı bağlantı ister. Böylece teknik erişilebilirliği günlük kullanım ihtiyacıyla birlikte ele aldık.

## Slayt 3 — Profil neden yalnızca isim ve yaştan oluşmuyor?

Profilde kişinin kendisine konulmuş tanıları seçebileceği alanlar oluşturduk. Osteoartrit, osteoporoz, Parkinson, inme sonrası durum, diyabet, hipertansiyon, stabil kalp hastalığı, KOAH ve kırılganlık gibi sık karşılaşılan durumları ele aldık. Birden fazla tanı seçilebilir; bu seçim tanı koyma işlemi değildir.

Hareket düzeyini, gözetim ihtiyacını ve kişinin günlük yaşam hedefini de soruyoruz. Örneğin sandalyeden kalkabilmek ile yürüyüşü artırmak aynı önceliği oluşturmaz. Düşme, kırık, ameliyat, ayak yarası ve sıvı kısıtlaması gibi ek sorular tanıya göre görünür. Serbest yazılan notları otomatik tıbbi değerlendirme gibi yorumlamıyoruz. Tanılar değiştiğinde önceki uygunluk beyanını yeniden istiyoruz; eski bilginin yeni duruma taşınmasını engelliyoruz.

## Slayt 4 — Kişiselleştirmeyi nasıl kurduk?

Programı yalnız tanı adına göre seçmedik. Önce güvenlik koşullarını, sonra hareket düzeyini ve gözetimi, ardından fonksiyonel hedefi ve günlük belirtileri değerlendiriyoruz. Birden fazla hastalıkta güvenliği en çok sınırlayan koşul öncelik kazanıyor. Böylece iki ayrı hastalığın önerilerini birleştirip otomatik reçete üretmiyoruz.

Uygun kalan hareketler tanıyla ilişkisine ve kişinin hedefine göre sıralanıyor. Düşük hareket düzeyinde oturarak seçenekler öne çıkıyor; gerekli gözetim yoksa ayakta yapılan seçenekler çıkarılıyor. Kartlarda sıklık, şiddet, süre ve tür için açıklamalar bulunuyor; ancak kişisel dozun uzman tarafından belirlenmesi gerekiyor. Kullanıcının uzmanından aldığı egzersiz reçetesini kaydedebilmesini ekledik. Başarı işaretine bakarak otomatik yük artırmıyoruz; kolaylaştırma ve ilerletme seçenekleri uzman değerlendirmesiyle kullanılmalı.

## Slayt 5 — Güvenlik neden her gün yeniden soruluyor?

Dünkü uygunluk bugünün güvenli olduğunu göstermez. Bu nedenle egzersizden önce günlük kontrol oluşturduk. Yeni göğüs ağrısı, istirahatte ciddi nefes darlığı, bayılma veya ani nörolojik belirti bildirildiğinde seans açılmaz ve 112 yönlendirmesi görünür. Yeni yaralanma, akut kötüleşme ya da uzman kısıtlaması da programı durdurur.

Ağrı, yorgunluk ve nefes darlığı yüksekse güvenlik yaklaşımı daha kısıtlayıcı olur. Prototipte kullanılan 4/10 azaltma ve 7/10 kilitleme eşikleri doğrulanmış klinik eşikler değildir; uzman incelemesi bekleyen ihtiyatlı tasarım tercihleridir. İnmede uzman planı ve yardım koşulları, diyabette aktif ayak yarası, osteoporozda kırık öyküsü ayrıca değerlendirilir. Kullanıcıya yalnız engel göstermiyoruz; nedenini ve hangi değerlendirmeye başvuracağını açıklıyoruz.

## Slayt 6 — Egzersiz kütüphanesini nasıl hazırladık?

Kütüphanede 30 egzersizi kuvvet, denge, esneklik, hareketlilik, dayanıklılık, solunum ve günlük işlev başlıklarında düzenledik. Tanı, hareket türü ve pozisyona göre arama ve filtreleme ekledik. Sayıdan çok, her kartın öğretici olması üzerinde durduk.

Her kartta amaç, günlük yaşam bağlantısı, üç adımlı anlatım, örnek doz, sıklık, şiddet, nefes ipucu, sık hata, önlem ve kolaylaştırma seçenekleri bulunuyor. Otuz egzersiz için toplam 90 şematik hareket görseli hazırladık. Bunlar profesyonel egzersiz videosu veya biyomekanik doğrulaması yapılmış görsel değildir. Destekleyen tarayıcılarda sesli okuma, yazıyı takip etmekte zorlanan kullanıcıya ikinci bir anlatım yolu sunuyor. Hastalığa ait etiketler, o egzersizin o tanıdaki herkes için uygun olduğu anlamına gelmiyor.

## Slayt 7 — Egzersizi günlük yaşamla nasıl ilişkilendirdik?

Rubrikteki fonksiyonel yaklaşımı karşılamak için hareketleri kas isimleriyle sınırlamadık. Oturup kalkmayı sandalye ve tuvalet transferiyle; destekli dengeyi ayakta durma ve güvenli hareketle; kavrama görevlerini nesne tutmayla ilişkilendirdik. Böylece kullanıcı hareketin neden programında olduğunu görebiliyor.

Kişi bir günlük yaşam hedefi seçip bu işte yaşadığı zorlanmayı kaydedebiliyor. Aynı hedefte zaman içindeki ilk ve son kaydı karşılaştırıyoruz. Bu özbildirim, standart performans testinin veya düşme risk değerlendirmesinin yerine geçmez. Uygulamada doğrulanmamış bir düşme olasılığı yüzdesi üretmedik. Amacımız bağımsızlığı destekleyen anlamlı hedefi görünür yapmak ve uzman görüşmesinde konuşulabilecek bir kayıt oluşturmaktır.

## Slayt 8 — Günlük sağlık takibini neden ekledik?

Egzersizin günlük yaşamın diğer parçalarından kopuk kalmaması için ilaç saatleri, su, adım, ağrı ve yorgunluk kaydı ekledik. Tanıya bağlı olarak kan şekeri, tansiyon veya nefes darlığı alanları da görünür. İlaç bilgisi mevcut reçeteden girilir; uygulama doz hesaplamaz. Su hedefi kullanıcı ve uzman planına dayanır; sıvı kısıtlaması olan kişiye tek tip hedef dayatmayız.

Adım bilgisi elle girilebilir. Destekleyen cihazlarda izinle çalışan hareket sensörü ise deneysel, ön planda kullanılan bir tahmindir; tüm gün doğru sayım yapan bir pedometre değildir. Planlı bildirimler izin, internet, cihaz ve tarayıcı desteğine bağlıdır. Bildirimin iletilmesi ilacın alındığını kanıtlamaz; kullanıcı alım kaydını ayrıca işaretler. Bildirim metninde ilaç adı veya doz göstermeyerek ekranda sağlık bilgisinin açığa çıkmasını azaltıyoruz.

## Slayt 9 — İlerlemeyi nasıl gösteriyoruz?

Takip ekranında 7, 30 ve 90 günlük dönemler ya da seçilen tarih aralığı incelenebilir. Egzersiz tamamlama kayıtlarını, belirtileri ve fonksiyonel hedefteki zorlanmayı birlikte gösteriyoruz. Eksik günü sıfır ağrı veya başarısızlık olarak değerlendirmiyoruz; grafiklerde kayıt eksikliği korunuyor.

Kişinin planladığı hareket günleri kaydedildiği tarihten itibaren geçerli olur. Böylece geçmişe sonradan program uydurulmaz. Gösterdiğimiz oran, planlı günlerde egzersiz kaydı bulunmasını anlatır; bütün reçetenin doğru uygulandığını veya tedavinin etkili olduğunu göstermez. Uzman görüşmesi için tarih aralığı seçilip yazdırılabilir rapor hazırlanabilir. İlaç listesinin rapora eklenmesi isteğe bağlıdır. Kullanıcı raporu paylaşmaya kendisi karar verir; rapor otomatik olarak bir hekime gönderilmez.

## Slayt 10 — Destek grubu ve İyi Dost ne işe yarıyor?

Benzer deneyimlerin paylaşılması için ortak destek grupları oluşturduk. Hesabı olan kullanıcılar takma adla yazabilir; kendi paylaşımlarını silebilir, bir paylaşımı bildirebilir ve kullanıcı engelleyebilir. Tanılar toplulukta kendiliğinden yayımlanmaz. Bildirim aracı bulunması, bütün mesajların anında uzman tarafından incelendiği anlamına gelmez. Topluluk tıbbi tedavi önerisi kaynağı olarak tasarlanmadı.

Ana ekrandaki büyük bulut biçimli İyi Dost ise yardımın kolay bulunmasını sağlıyor. Kullanım adımlarını sade ve destekleyici ifadelerle anlatıyor. Çevrimiçi modda gte-small modeli, sorunun anlamını önceden hazırlanmış yardım başlıklarıyla eşleştiriyor; serbest tıbbi yanıt üretmiyor. Çevrimdışı kullanımda hazır yardım yanıtları kalıyor. Motive edici kapanışlar, ağrıya rağmen devam etme baskısı veya tıbbi güvence vermiyor.

## Slayt 11 — Hesap ve sağlık verilerini nasıl ele aldık?

Misafir kullanımını koruduk; bulut kaydı isteyenler için kullanıcı adı ve şifreyle hesap akışı ekledik. Kayıtta bir kez gösterilen kurtarma kodu, şifre unutulduğunda kullanılır; kullanıcı bu kodu özel olarak saklamalıdır. Kullanıcı adı doğrulanmış kimlik veya sağlık mesleği yetkisi anlamına gelmez. Yerel sağlık kayıtlarının buluta taşınması açık tercihe bağlı. Hesaplar arasında kayıtları ayırıyoruz ve sunucuda her kişinin yalnız kendi sağlık kaydına erişmesini sağlayan satır düzeyinde erişim kuralları kullanıyoruz. Aynı kaydın iki cihazda değişmesi halinde sessizce üzerine yazmak yerine çakışmayı belirtiyoruz.

İyiAdım için Splint organizasyonu altında ayrı bir proje kullanıyoruz; mevcut Splint uygulamasının verilerini veya kodunu değiştirmiyoruz. Bununla birlikte bu düzenlemeler bağımsız güvenlik denetimi yapıldığı veya mevzuat uyumu belgelendiği anlamına gelmez. Gerçek hasta kullanımı öncesinde veri yönetimi, izin metinleri ve kurumsal gereklilikler ayrıca değerlendirilmelidir.

## Slayt 12 — Literatürü uygulamaya nasıl çevirdik?

WHO, NICE ve ilgili meslek kuruluşlarının kılavuzlarını kapsayan hedefli bir tarama yaptık. Bu çalışma sistematik derleme değildir. Kaynağı yalnız listenin sonuna eklemek yerine, hangi önerinin hangi tasarım kararını desteklediğini kaydettik.

Örneğin osteoartritte kişiye göre kuvvet ve aerobik aktiviteyi; osteoporozda postür ve kırık öyküsünü; Parkinson'da güvenli zamanlama ve gözetimi; diyabette ayak komplikasyonlarını dikkate aldık. WHO'nun haftalık genel aktivite hedeflerini kırılgan kullanıcının zorunlu başlangıç dozu olarak vermedik. Kılavuzlardan yararlanmış olmak, bizim kural motorumuzun veya görsellerimizin klinik olarak doğrulandığını göstermez. İnme, kalp ve solunum hastalıklarında kişiye özel rehabilitasyon değerlendirmesini koruduk; ilaç ya da oksijen ayarı yapmadık.

## Slayt 13 — İki dakikalık canlı gösterim

**0:00–0:30:** Gerçek hasta verisi yerine örnek bir profil açıyoruz. Diz osteoartriti ve tip 2 diyabeti seçiyoruz. Hedefi sandalyeden daha rahat kalkmak olarak belirliyoruz. Hareket düzeyi, uzman uygunluğu ve gerekli gözetim bilgilerini tamamlıyoruz.

**0:30–1:00:** Günlük güvenlik kontrolünü yanıtlayıp programın gerekçesini gösteriyoruz. Bir egzersiz kartında üç adımı, nefes ipucunu ve günlük yaşam bağlantısını açıyoruz. Seçimin yalnız tanıdan oluşmadığını açıklıyoruz.

**1:00–1:30:** Profile aktif diyabetik ayak yarası ekliyoruz. Önceki uygunluğun yeniden istendiğini, programın değerlendirme için kilitlendiğini ve yük veren hareketlerin sunulmadığını gösteriyoruz. “Bir tanı egzersizi öne çıkarsa bile diğer tanının komplikasyonu güvenliği sınırlar” diyoruz.

**1:30–2:00:** İyi Dost bulutundan yardım açıyoruz; ardından örnek takip kaydı ve rapora geçiyoruz. Gelişim grafiğinin tıbbi iyileşme kanıtı değil, kullanıcı kayıtlarının görünümü olduğunu belirtiyoruz.

## Slayt 14 — Neyi geliştirdik, neyi doğrulamamız gerekiyor?

Teknik olarak profil, seçim kuralları, kütüphane, takip, rapor, yardımcı, hesap, topluluk ve desteklenen cihazlarda hatırlatma akışlarını geliştirdik. Teknik kontrollerde güvenlik kuralları, hesaplar arası veri ayrımı, açık onaylı bulut kaydı, gerçek ortak paylaşım ve çevrimdışı açılış sınandı. Yapay zekâ modeline gerçek istek ve sunucu zamanlayıcısına gerçek çağrılar denendi. Bunlar klinik doğrulama değildir; kapalı uygulamada bildirimin gerçek telefonda görünmesi ve sensör doğruluğu ayrıca cihaz üzerinde kontrol edilmelidir.

İnsan uzmanıyla yapılacak doğrulama ayrı bir aşamadır. Egzersiz kartlarının ve çoklu tanı kurallarının fizyoterapist ve ilgili hekimlerce incelenmesi; yaşlı katılımcılarla okunabilirlik, uyarıyı anlama ve yardım ihtiyacının değerlendirilmesi henüz yapılmadı. Bunun protokolünü hazırladık. İyiAdım'ı bu nedenle kılavuzlardan yararlanan bir eğitim prototipi olarak sunuyoruz; klinik olarak doğrulanmış bir tedavi ürünü olarak sunmuyoruz.

## Rubriğe karşılıklarımız — sunucu için kısa tablo

| Ölçüt | Ağırlık | Uygulamadaki karşılığı |
|---|---:|---|
| Klinik uygunluk | %15 | Geriatrik tanılar, çok bileşenli hareket, işlev hedefi |
| Güvenlik | %15 | Günlük kontrol, kırmızı bayrak, komplikasyon ve gözetim kilitleri |
| Kişiselleştirme | %15 | Çoklu tanı, düzey, hedef, belirtiler, uzman reçetesi |
| Egzersiz kütüphanesi | %10 | 30 kart, 90 şema, doz açıklaması, nefes ve hata ipuçları |
| Fonksiyonel yaklaşım | %10 | Transfer, yürüme, kavrama ve günlük yaşam bağlantıları |
| Kullanıcı deneyimi | %10 | Büyük kontroller, sade dil, sesli okuma, görünür yardımcı |
| İlerleme takibi | %10 | Dönem grafikleri, kayıt kapsamı, hedef karşılaştırması, rapor |
| Teknik işlevsellik | %5 | Mobil web, yerel kayıt, çevrimdışı erişim, hesap ve eşitleme |
| Kanıta dayalı yaklaşım | %5 | Kaynak–kural eşleştirmesi ve sınırların açıklanması |
| Sunum | %5 | Gerekçeli kullanıcı yolculuğu, canlı senaryo ve dürüst durum bildirimi |

## Öğretim elemanından gelebilecek beş soru

**1. Tanı seçmek kişiye özel egzersiz reçetesi için yeterli mi?**  
Hayır. Bu nedenle fonksiyon, belirtiler, komplikasyonlar, gözetim ve uzman planını birlikte ele aldık. Otomatik seçim uzman değerlendirmesinin yerini tutmaz.

**2. Bu uygulamanın güvenli ve etkili olduğunu gösterdiniz mi?**  
Kılavuz temelli gerekçeler ve teknik denetimler bunu tek başına göstermez. Klinik içerik ve yaşlı kullanıcı değerlendirmesi henüz yapılmadı; planı hazır.

**3. Yapay zekâ hastaya tedavi öneriyor mu?**  
Hayır. Model, uygulama kullanımı sorularını hazırlanmış yardım yanıtlarıyla eşleştiriyor. Tanı, ilaç dozu ve otomatik egzersiz reçetesi üretmiyor.

**4. Bildirim ve adım takibi her telefonda çalışır mı?**  
Hayır. Bildirimler destek ve izin gerektirir. Hareket sensörü tahmini ön planda ve deneysel çalışır; elle kayıt seçeneğini koruduk.

**5. Hasta neden yalnız egzersiz videosu izlemek yerine bunu kullansın?**  
Çünkü güvenlik sorgusu, kişisel hedef, takip ve anlaşılır gerekçeleri aynı akışta sunuyoruz. Bunun hastaya gerçek yararını ise ayrı değerlendirmeyle göstermemiz gerekir.

## Sunum kaynakçası

1. WHO (2020). [Physical Activity and Sedentary Behaviour](https://www.who.int/publications/i/item/9789240015128/).
2. NICE (2022). [Osteoarthritis, NG226](https://www.nice.org.uk/guidance/ng226/chapter/recommendations).
3. Brooke-Wavell ve ark. (2022). [Strong, steady and straight](https://pmc.ncbi.nlm.nih.gov/articles/PMC9304091/).
4. Parkinson's Foundation / ACSM (2025). [Exercise Guidelines](https://www.parkinson.org/sites/default/files/documents/Parkinsons-Exercise-Guidelines-1025.pdf).
5. NICE (2023). [Stroke rehabilitation, NG236](https://www.nice.org.uk/guidance/ng236/chapter/Recommendations).
6. ADA (2026). [Standards of Care, bölüm 5](https://pmc.ncbi.nlm.nih.gov/articles/PMC12690188/) ve [yaşlı yetişkinler, bölüm 13](https://doi.org/10.2337/dc26-s013).
7. AHA / ACC / HFSA (2022). [Heart Failure Guideline](https://doi.org/10.1016/j.jacc.2021.12.012).
8. AHA. [Getting Active to Control High Blood Pressure](https://www.heart.org/en/health-topics/high-blood-pressure/changes-you-can-make-to-manage-high-blood-pressure/getting-active-to-control-high-blood-pressure).
9. ATS (2023). [Pulmonary Rehabilitation Guideline](https://pmc.ncbi.nlm.nih.gov/articles/PMC10449064/).
10. Dent ve ark. (2019). [ICFSR Physical Frailty Guidelines](https://pmc.ncbi.nlm.nih.gov/articles/PMC6800406/).
11. NICE (2025). [Falls, NG249](https://www.nice.org.uk/guidance/ng249/chapter/Recommendations/).
12. CDC (2017). [STEADI Chair Rise Exercise](https://cdc.gov/steadi/pdf/STEADI-Brochure-ChairRiseEx-508.pdf).

Kaynakların uygulama kurallarıyla ilişkisi ve tarama yöntemi proje içindeki **literatur-taramasi.md** belgesinde; henüz uygulanmamış değerlendirme adımları **review-protocol.md** belgesindedir.
