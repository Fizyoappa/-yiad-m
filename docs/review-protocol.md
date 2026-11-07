# İyiAdım: klinik içerik ve kullanılabilirlik değerlendirme protokolü

**Belge tarihi:** 7 Kasım 2026  
**Durum:** Uygulanmaya hazır değerlendirme planı. Bu belge uzman onayı veya yapılmış kullanıcı araştırması sonucu değildir. Klinik değerlendirme ve yaşlı kullanıcılarla test henüz yürütülmemiştir.

## 1. Amaç ve sınır

Bu protokol; egzersiz kartlarının, görsel anlatımların, çoklu tanı seçim kurallarının, güvenlik yönlendirmelerinin ve yaşlılara yönelik arayüzün değerlendirilmesini düzenler. Yazılım testinden geçmek klinik güvenliği veya etkinliği kanıtlamaz. Prototipin otomatik seçimleri tedavi reçetesi olarak değerlendirilmemelidir.

## 2. Klinik içerik incelemesi

İnceleme, geriatri rehabilitasyonunda deneyimli bir fizyoterapist tarafından ve gereken durumlarda ilgili hekim/ergoterapist/solunum veya kardiyak rehabilitasyon ekibiyle yapılmalıdır. İnceleyen kişinin adı, mesleği, tarih, incelenen sürüm ve her kart için kararı kaydedilir.

Her egzersiz için şu maddeler değerlendirilir:

- Fonksiyonel hedef: günlük yaşam aktivitesiyle ilişki doğru ve abartısız mı?
- İlgili tanı etiketleri: uygunluk olarak değil içerik ilişkisi olarak mı kullanılıyor?
- Başlangıç pozisyonu, destek yüzeyi, yardımcı cihaz ve gözetim koşulları açık mı?
- Üç adımlı talimatlar ve şematik çizimler birbiriyle uyumlu mu? Çizimler yanlış teknik veya tehlikeli hareket aralığı öğretiyor mu?
- Başlangıç dozu, sıklık, şiddet ve dinlenme örnekleri hedef kullanıcı için uygun mu? Kişisel dozun uzmana ait olduğu açık mı?
- Nefes, sık hatalar, kolaylaştırma ve ilerletme seçenekleri klinik olarak makul mü?
- Acil durdurma ve profesyonel değerlendirme gerektiren bulgular doğru mu?
- Omurga kırığı, inme sonrası ağrılı omuz, ayak yarası, hipoglisemi riski, kardiyak/pulmoner instabilite gibi özel durumlar yeterince ele alınıyor mu?
- Kaynak bağlantısı belirtilen kararı gerçekten destekliyor mu? Kaynak ile prototip tasarım tercihi ayrılmış mı?

Karar seçenekleri: **uygun / değişiklikle uygun / kapsam dışına al / ek değerlendirme gerekli**. Her olumsuz karar için gerekçe ve düzeltme kaydedilir. Kritik güvenlik itirazı çözülmeden ilgili içerik hasta kullanımına açılmaz. İnme sonrası hareketlerde kişiye özgü omuz ve fonksiyon değerlendirmesinin yerine genel çizim konulmaz.

## 3. Birden fazla tanı ve güvenlik senaryoları

En az şu örnekler, gerçek hasta verisi kullanmadan incelenir:

1. Osteoartrit + tip 2 diyabet; bağımsız hareket, sonra aktif ayak yarası eklenmesi.
2. Osteoporoz + kırılganlık; düşük travmalı/omurga kırığı öyküsü ve düşme öyküsü.
3. İnme + Parkinson; genel omuz görevlerinin çıkarılması, uzman yönlendirmeli görev ve gözetim gereksinimi.
4. Kalp yetersizliği + KOAH; stabilite belirsizliği, yeni nefes darlığı ve kişisel rehabilitasyon onayı.
5. Tanı bilinmiyor veya kapsam dışı tanı; programın otomatik uygunluk ilan etmemesi.
6. Günlük kontrolde göğüs ağrısı, bayılma veya ani nörolojik belirti; bütün seans eylemlerinin engellenmesi.
7. Günlük yüksek ağrı/yorgunluk/nefes darlığı kaydı; kontrol soruları temiz olsa da uygun güvenlik kilidinin korunması.
8. Profilde yeni tanı seçimi; önceki uzman uygunluğu/review beyanının yeniden değerlendirilmesi.

Uygulamadaki 4/10 azaltma ve 7/10 kilitleme eşikleri doğrulanmış tanısal eşikler değildir; ihtiyatlı prototip kurallarıdır. İnceleyen klinisyen bu kuralları ayrıca kabul etmeli, değiştirmeli veya kaldırmalıdır. Tek bir kan şekeri/tansiyon sayısından otomatik egzersiz uygunluğu veya ilaç kararı üretilmemelidir.

## 4. Yaşlı kullanıcılarla kullanım değerlendirmesi

İlk tur için 5–8 gönüllü yaşlı yetişkinle, farklı dijital deneyim düzeyleri gözetilerek küçük bir kullanılabilirlik çalışması planlanabilir. Bu sayı etkililik veya güvenlik kanıtı üretmez; arayüz sorunlarını bulmak içindir. Katılımcıya amaç, gönüllülük, istediğinde bırakabilme ve hangi verilerin kaydedileceği açıkça anlatılmalı; gerekli kurum/etik süreçleri değerlendirilmelidir.

**Gerçek tanı, ilaç, kimlik veya iletişim bilgisi girmeleri istenmez.** Önceden hazırlanmış örnek profiller kullanılır. Görevler ekrandaki işlemlerle sınırlıdır; katılımcılardan sağlık uygunluğu değerlendirilmeden egzersiz yapmaları istenmez. Ses/video kaydı ancak açık ve ayrı onam varsa yapılır.

Görevler:

- Ana ekrandaki İyi Dost bulutunu bulup açmak ve yardım istemek.
- Örnek profilde iki tanı seçmek, belirsiz bir soruda yardım aramak ve kaydetmek.
- Güvenlik uyarısının anlamını kendi cümlesiyle anlatmak; seansın neden kilitlendiğini bulmak.
- Kütüphanede oturarak egzersiz aramak, üç adımlı görseli okumak ve durdurma kuralını bulmak.
- Örnek ilaç saatini eklemek, alımı işaretlemek, yanlış su kaydını düzeltmek.
- Günlük ağrı/yorgunluk kaydı eklemek ve gelişim raporuna ulaşmak.
- Hesap varsa oturumu kapatmak; ortak cihazda kendi verisinin başkasına görünmemesini kontrol etmek.
- Destek grubunda profil/sağlık bilgilerinin otomatik paylaşılmadığını fark etmek ve bildirme aracını bulmak.

Araştırmacı, katılımcının isteği dışında görevi onun yerine yapmaz. Güvenlik uyarısı yanlış anlaşılıyorsa görev durdurulur, anlamı açıklanır ve sorun kaydedilir.

## 5. Toplanacak gözlemler

Her görev için başarı (bağımsız / yardımla / tamamlayamadı), yaklaşık süre, yanlış dokunmalar, geri dönüşler, yardım ihtiyacı ve katılımcının kısa yorumu kaydedilir. Yazı okunabilirliği, renk/kontrast, dokunma hedefleri, uyarıların anlaşılması, dilin saygılı bulunması ve bilişsel yük değerlendirilir. İyi Dost'un destekleyici kapanışlarının tıbbi güvence veya egzersize zorlama olarak algılanıp algılanmadığı sorulur.

Önceden belirlenen düzeltme önceliği:

- **Kritik:** Acil uyarıyı yanlış anlamak, uygun olmayan seansı başlatabilmek, başka kişinin verisini görmek.
- **Yüksek:** Temel işlemi yardım olmadan bulamamak, kayıt/geri alma karışıklığı, küçük metin nedeniyle talimatı okuyamamak.
- **Orta:** Gereksiz adım, belirsiz etiket, raporun anlaşılmaması.
- **Düşük:** Tercihe bağlı görsel veya metin iyileştirmeleri.

Kritik sorunlar giderilmeden çalışma genişletilmez. Önemli değişikliklerden sonra aynı görevlerin kısa tekrar turu planlanır.

## 6. Sonuç kaydı şablonu

| Alan | Doldurulacak bilgi |
|---|---|
| Sürüm / commit | … |
| Tarih ve değerlendirici | … |
| Değerlendirme türü | Klinik içerik / kullanılabilirlik / teknik |
| Kart veya görev | … |
| Bulgular | … |
| Ciddiyet | Kritik / yüksek / orta / düşük |
| Önerilen düzeltme | … |
| Sorumlu ve hedef tarih | … |
| Düzeltme sonrası kontrol | … |
| Son karar | Uygun / koşullu / bekliyor |

Boş şablonların bulunması, değerlendirmenin yapıldığı anlamına gelmez. Sunumda mevcut durum **“değerlendirme protokolü hazır; uzman ve katılımcı değerlendirmesi bekliyor”** olarak belirtilmelidir.
