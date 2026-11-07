# Teknik kontrol kaydı — 7 Kasım 2026

## Gerçek servisle kontrol edilenler

- Ayrı Supabase projesinin oluşturulması, RLS ve en az yetki ilkesi.
- İki geçici test hesabıyla: birinin sağlık kaydı diğerinde görünmüyor; başka kullanıcı adına insert/update/delete engelleniyor.
- Eski revision ile güncelleme açık çakışma döndürüyor.
- Ortak paylaşım iki hesap arasında görünür; başka kişinin mesajını silme engellenir, engelleme RLS ile görünümü sınırlar.
- Tarayıcı istemcisi sunucu anahtar tablosuna erişemez.
- gte-small modeline gerçek soru; ilgili ilaç yardım başlığı eşleştirilir.
- Cron çağrıları başarılı HTTP200 döndürür; yetkisiz dispatch isteği401 alır. Bu, gerçek telefonda bildirimin göründüğü anlamına gelmez.
- Gerçek kullanıcı adı kaydı, kurtarma kodu, giriş, açık bulut onayı, şifre kurtarma ve yeni şifreyle giriş.

## Tarayıcı kontrolleri

- Mobil sayfa taşması, ana sayfa ve yardımcı, 30 kart ve 3 aşamalı şema.
- Çevrimdışı yeniden açılış ve yerel kayıt; ortak iletişim için internet gerekir.
- Uzman raporu, mevcut kayıtlar, tarih filtresi, eksik günlerin korunması.
- Bulut onayı olmadan aktarım yok; misafir ve farklı kullanıcı kayıt alanları ayrı.
- Push izni otomatik istenmez; yalnız düğmeye dokunmayla abonelik başlatılır.

## Yapılmamış / cihaz veya insan gerektiren kontroller

- Klinik etkinlik, gerçek hasta güvenliği ve fizyoterapist tarafından içerik onayı.
- Yaşlı katılımcılarla kullanılabilirlik değerlendirmesi.
- Gerçek Android/iOS cihazda kapalı uygulama bildiriminin görülmesi ve sensör doğruluğu.
- Bağımsız güvenlik / mevzuat uygunluk denetimi ve yüksek yük testi.

Supabase güvenlik taramasındaki servis tabloları için “RLS enabled no policy” INFO bulguları kasıtlıdır: anon/authenticated erişimi kapalı, yalnız service_role erişebilir. Projenin yerleşik sızmış parola koruma ayarı kapalıdır; sağlayıcı ayarları ve üretim kullanımı ayrıca değerlendirilmelidir. Bunlar “tam güvenli / mevzuata uygun” beyanı değildir.
