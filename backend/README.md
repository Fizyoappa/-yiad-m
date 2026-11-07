# Sunucu kurulumu

Bu klasör yalnız kaynak ve migration içerir; canlıya uygulanmış SQL `migrations/` altında sıralıdır. İyiAdım ayrı Supabase proje ref: `ayzhiiqnretefqwsdsqj`.

Edge Functions:

- `account-access.ts` → account-access; verify_jwt=false, çünkü kayıt ve kurtarma kendileri kimlik akışıdır. Kurtarma için gizli kod doğrulanır; mevcut kullanıcı kimliği tahminle değiştirilemez.
- `assistant.ts` → iyi-dost; verify_jwt=true ve ayrıca getUser; saatlik kullanım sınırı, yalnız uygulama konu eşleştirmesi.
- `reminder-dispatch.ts` → reminder-dispatch; verify_jwt=false, yalnız ayrı sunucu cron bearer secret ile doğrulanır.

`server_config` içinde id='push' satırındaki cron secret ve VAPID private key yalnız sunucudadır. İstemci rolleri bu tabloya erişemez. Yeni kurulumda bu değerler güvenli biçimde oluşturulup sunucuya yazılmalı, kaynak kontrolüne eklenmemelidir. Dosyayı kopyalamak anahtar kurulumunu yapmaz.

Cron her dakika kayıtlı saatleri ve saat dilimini kontrol eder. Sağlık/ilaç adı göndermez, kaçırılmış dozları yeniden hatırlatma olarak oynatmaz. Sağlayıcının kabulü cihazda gösterim garantisi değildir. Gerçek cihazla izinli teslim testi gerekir.

Hesap kayıtları takma kullanıcı adıdır; e-posta doğrulaması veya gerçek kimlik doğrulaması olarak sunulmaz. Kurtarma kodu kullanıcıya bir kez gösterilir ve sunucuda yalnız tuzlanmış özet tutulur. Kodunu ve şifresini kaybeden kişi için kimliği doğrulanmış bir yardım masası süreci henüz yoktur.

Servis/RLS kontrolleri `checks/TEST-STATUS.md` içinde. Kurumsal hasta kullanımı, bağımsız güvenlik incelemesi ve klinik onay bu teknik kurulumdan ayrıdır.
