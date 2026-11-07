# İyiAdım

Mobil uyumlu geriatri rehabilitasyonu ve günlük sağlık takibi eğitim uygulaması.

**Uygulama:** https://fizyoappa.github.io/-yiad-m/

**Sunum metni (PDF):** https://fizyoappa.github.io/-yiad-m/sunum-metni.pdf

## İşlevler

- Çoklu tanı, fonksiyonel hedef, günlük belirtiler ve gözetim koşullarına göre açıklanabilir hareket seçimi ve güvenlik kilitleri.
- 30 egzersiz, 90 aşamalı şematik çizim; sıklık/şiddet/doz açıklaması, teknik, nefes, hatalar, kolaylaştırma ve kaynaklar.
- Uzmanın verdiği bireysel planı kullanıcı beyanıyla kaydetme ve yapılan miktarı izleme; otomatik klinik reçete veya otomatik yük artırımı yok.
- İlaç/su/adım/belirti kaydı; tanıya özgü kan şekeri, tansiyon ve nefes darlığı alanları.
- 7/30/90 gün ve tarih aralığı analizi, ileriye dönük planlı gün takibi, günlük yaşam hedefi karşılaştırması, yerel PDF/yazdırma raporu.
- Kullanıcı adı/şifre üyeliği; kayıt sırasında bir kez gösterilen özel kurtarma koduyla şifre yenileme. E-posta veya doğrulanmış kimlik iddiası yok.
- Açık onaylı özel bulut kaydı; kullanıcı bazlı RLS, ayrı yerel kayıt alanları ve çakışma yönetimi. Misafir kayıtları kendiliğinden yüklenmez.
- Gerçek ortak destek grupları, takma ad, kendi mesajını silme, bildirme ve engelleme. Anında insan moderasyonu garantisi yok.
- İyi Dost: çevrimiçi gte-small anlam eşleştirme modeli ile uygulama rehberi seçimi; çevrimdışı hazır rehber. Üretken tıbbi sohbet modeli değildir.
- PWA / çevrimdışı uygulama, manuel sayaç ve süre kaydı; isteğe bağlı, ön planda çalışan deneysel telefon hareketi tahmini.
- İzinli ve desteklenen cihazlarda sunucudan Web Push ilaç saati bildirimi. Kilit ekranında ilaç adı veya doz gösterilmez. Gerçek cihaz teslimi OS/tarayıcı/ağ desteğine bağlıdır.

## Çalıştırma

```sh
python -m http.server 4175 --directory docs
node checks/clinical-rules.cjs
```

Uygulama dosyaları GitHub Pages `main:/docs` üzerinden yayımlanır. Yerel çalışmada HTTPS gerektiren bazı cihaz özellikleri yalnız localhost veya gerçek HTTPS yayında kullanılabilir.

## Sunucu ve veri

İyiAdım, Supabase'in Splint organizasyonu içinde **ayrı** `iyiadim-geriatric-rehab` projesini kullanır. Mevcut Splint uygulaması/veritabanı değiştirilmemiştir. `docs/cloud-config.js` yalnız yayımlanabilir URL, publishable key ve VAPID public key içerir. Service-role, cron ve VAPID private key tarayıcıda veya bu depoda bulunmaz.

Sunucu kaynakları `backend/` altındadır. Migrations dosyaları canlı uygulanan şemayı kaydeder. `server_config` anahtarları kaynak kontrolüne alınmaz; yeni kurulumda sunucuda ayrıca oluşturulmalıdır. Başka projeye migration/Edge Function kurulumu otomatik bu projeyi yeniden oluşturmaz; kimlik ayarları ve sunucu anahtarları ayrıca hazırlanmalıdır.

Kayıtlar misafirde yereldir; hesaptaki veriler yalnız açık onayla özel bulut alanına aktarılır. Topluluk kendi ayrı tablolarını kullanır. AI'ya profil veya ilaç listesi gönderilmez; yalnız kullanıcının yazdığı soru işlenir. Hiçbir veri otomatik olarak sağlık profesyoneline gönderilmez.

## Klinik kapsam ve değerlendirme

Bu bir eğitim prototipidir. Egzersizler, şemalar ve kurallar klinik olarak valide edilmiş değildir; profesyonel video yerine şematik çizim kullanılır. Başlangıç dozları ile 4/10 azaltma ve 7/10 seansı kilitleme kuralları ihtiyatlı tasarım tercihleridir. Hasta kullanımından önce klinik uzman incelemesi ve yaşlı katılımcılarla kullanılabilirlik değerlendirmesi gerekir. Bunlar henüz yapılmamıştır; [protokol](docs/review-protocol.md) hazırlanmıştır.

[Hedefli literatür taraması](docs/literatur-taramasi.md) · [Teknik test kaydı](checks/TEST-STATUS.md)
