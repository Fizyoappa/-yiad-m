# İyiAdım

Yaşlı yetişkinler için mobil uyumlu geriatri rehabilitasyonu ve günlük sağlık takibi eğitim prototipi.

**Uygulama:** https://fizyoappa.github.io/-yiad-m/

## İçerik

- Çoklu tanı seçimi ve uyarlanan güvenlik soruları
- 30 egzersiz; tanı, tür ve pozisyona göre arama / filtreleme
- Fonksiyonel hedef, hareket düzeyi, belirtiler ve gözetim durumuna göre başlangıç seçenekleri
- İlaç saatleri, su, adım, ağrı, yorgunluk ve ilgili tanılara göre ek takip
- Kaynak bağlantıları, hedefli literatür raporu ve proje rubriği

## Çalıştırma

Kurulum veya derleme gerekmez. Python yüklüyse:

```sh
python -m http.server 4173 --directory docs
```

Ardından http://localhost:4173 adresini açın.

Kural testleri (Node.js):

```sh
node checks/clinical-rules.cjs
```

## Yayınlama

GitHub Pages, `main` dalındaki `/docs` klasörünü yayımlar. Uygulama kodu `docs/` altında bulunur. Değişiklikler `main` dalına gönderildikten sonra Pages tarafından yayımlanır. Ziyaretçiler için ChatGPT veya GitHub hesabı gerekmez.

## Veri ve mevcut sınırlar

Kayıtlar yalnızca kullanılan tarayıcıdaki localStorage içinde tutulur; GitHub'a veya bir sunucuya gönderilmez. Ortak cihazlarda gerçek sağlık bilgisi yerine örnek bilgi kullanın. Kaynaklar ekranından bu cihazdaki veriler silinebilir. Tarayıcı verilerini temizlemek kayıtları silebilir; cihazlar arası senkronizasyon yoktur.

Topluluk yerel önizlemedir. Yardımcı hazır yanıtlarla çalışır; üretken yapay zekâ bağlantısı yoktur. İlaç hatırlatıcıları yalnız sayfa açıkken çalışır; arka plan bildirimi ve otomatik adım sayımı yoktur.

## Klinik kapsam

Bu uygulama eğitim prototipidir; tıbbi değerlendirme veya kişisel egzersiz reçetesi değildir. Tanı beyanı doğrulanmaz. Kural motoru klinik olarak valide edilmemiştir. Kartlardaki örnek dozlar ve belirtiye göre azaltma/kilitleme eşikleri ihtiyatlı tasarım tercihleridir. Hasta kullanımından önce uzman incelemesi ve kullanılabilirlik değerlendirmesi gerekir.

[Hedefli literatür taraması](docs/literatur-taramasi.md)
