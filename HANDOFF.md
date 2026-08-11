# Yedirenk Projesi — Codex Devir Belgesi

Son güncelleme: 5 Ağustos 2026

## 1. Projenin amacı

Bu proje Yedirenk Derneği için hazırlanmış React/Vite tabanlı bir bağış ve kurumsal web sitesidir. Site; bağış kampanyaları, haberler, kurumsal sayfalar, çalışma alanları, sepet ve demo ödeme akışı içerir.

Projeye daha sonra kapsamlı bir içerik yönetim paneli, ziyaretçi analitiği ve güvenlik sertleştirmeleri eklenmiştir.

En önemli kural:

> Mevcut bağış API çağrısı ve ödeme akışı açık bir talep olmadan değiştirilmemeli veya kaldırılmamalıdır.

## 2. Teknoloji ve temel dosyalar

- React 19
- Vite 6
- React Router
- Lucide React ikonları
- Cloudflare/hosting uyumlu worker: `scripts/server.js`
- Vercel güvenlik başlıkları: `vercel.json`
- Lokal analitik middleware: `vite.config.js`

Önemli dosyalar:

- `src/App.jsx`: Sitenin sayfaları, bağış sepeti ve ödeme akışı
- `src/AdminPanel.jsx`: Yönetim paneli
- `src/cms.jsx`: İçerik durumu, lokal saklama ve yedekleme
- `src/analytics.js`: Ziyaretçi onayı ve analitik olayları
- `src/siteData.js`: Sayfa kataloğu ve varsayılan sayfa içerikleri
- `src/styles.css`: Site ve admin panelinin bütün stilleri
- `scripts/server.js`: Production worker, admin API ve analitik API
- `scripts/admin-smoke.mjs`: Admin CRUD ve responsive smoke testleri
- `scripts/security-smoke.mjs`: Güvenlik ve yetkilendirme testleri
- `SECURITY.md`: Güvenlik mimarisi ve production notları
- `.env.example`: Gerekli ortam değişkenleri

## 3. Lokal çalıştırma

Windows/PowerShell ortamında:

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Adresler:

- Site: `http://localhost:5173`
- Admin: `http://localhost:5173/admin`
- Lokal admin şifresi: `yedirenk2026`

Production derlemesi:

```powershell
npm.cmd run build
```

Testler:

```powershell
node scripts\admin-smoke.mjs
node scripts\security-smoke.mjs
```

Testler çalışırken geliştirme sunucusunun 5173 portunda açık olması gerekir.

## 4. Admin paneli

Admin panelinde şu bölümler bulunur:

- Genel Bakış
- Ziyaretçi Analitiği
- Ana Sayfa
- Slider / Manşet
- Bağış Alanları
- Haberler
- Diğer Sayfalar
- Menü ve Kartlar
- Footer ve Bülten
- Genel Ayarlar

Yönetilebilen alanlar:

- Slider ekleme, düzenleme, silme ve sıralama
- Slider etiketi, başlığı, açıklaması, butonu, bağlantısı, rengi ve görseli
- Bağış kampanyası CRUD işlemleri
- Kampanya kategorisi, fiyatı, ilerleme oranı, görseli ve yayın durumu
- Haber CRUD işlemleri
- Haber başlığı, özeti, tam metni, kategorisi, tarihi, görseli ve yayın durumu
- Ana sayfa tanıtım metinleri
- Bağış çağrı alanı
- Etki sayaçları
- Saha hikâyesi ve görseli
- Güven şeridi
- Ana menü başlıkları
- Ana sayfa çalışma kartları
- Kurumsal ve çalışma sayfalarının başlık, giriş yazısı, kapak görseli ve SSS alanları
- KVKK, mali tablolar, etik, denetim ve diğer yasal sayfalar dahil yaklaşık 43 sayfa
- Logo dosyası ve logo ölçüleri
- Telefon, e-posta ve adres
- Bülten metinleri
- Footer sütunları ve bağlantıları
- Sosyal medya bağlantıları
- Telif ve yasal bağlantılar
- JSON yedek indirme ve geri yükleme

## 5. CMS yapısı

CMS sağlayıcısı `src/cms.jsx` içindedir.

Başlıca veri bölümleri:

- `settings`
- `home`
- `slides`
- `campaigns`
- `news`
- `pages`
- `navigation`
- `workAreas`
- `trust`
- `footer`

Lokal geliştirmede içerikler tarayıcının `localStorage` alanında `yedirenk-cms-v1` anahtarıyla tutulur.

Production ortamında admin panelindeki “Değişiklikleri kaydet” işlemi yetkili `/api/admin/content` API’sine gönderilir ve `YEDIRENK_CMS` KV binding’i kullanılır.

Önemli sınırlama:

- Lokal tarayıcı verileri başka tarayıcı veya cihaza otomatik aktarılmaz.
- Production için KV binding zorunludur.
- KV bağlı değilse içerik API’si güvenli biçimde `503` döndürür.

## 6. Bağış ve ödeme akışı

Bağış gönderimi `src/App.jsx` içindeki `Cart` bileşeninde yapılır.

API adresi sırasıyla şu değişkenlerden alınır:

```text
VITE_PANEL_API_URL
VITE_VEFA_API_URL
http://localhost:3000
```

Endpoint:

```text
POST /api/public/online-donations
```

Gönderilen temel alanlar:

- firstName
- lastName
- phone
- email
- city
- district
- amount
- campaign
- consent
- website (honeypot)

Kart numarası, son kullanma tarihi ve CVV API’ye gönderilmez. Mevcut ekran demo ödeme ekranıdır.

Eklenen güvenlik kontrolleri:

- Tutar sınırı
- Alan uzunluğu sınırları
- Production API adresinde HTTPS zorunluluğu
- 15 saniyelik istek zaman aşımı
- Kampanya metni uzunluk sınırı
- Honeypot alanı

Bu akış değiştirilirken dış bağış paneli entegrasyonunun bozulmamasına dikkat edilmelidir.

## 7. Analitik sistemi

Analitik yalnızca ziyaretçi açıkça izin verdikten sonra çalışır.

İzlenen olaylar:

- `consent_accepted`
- `page_view`
- `page_duration`
- `cart_add`
- `checkout_start`
- `donation_success`

Kaydedilen bilgiler:

- Sunucu tarafından belirlenen IP adresi
- Anonim oturum kimliği
- Sayfa yolu
- Referrer
- User-Agent
- Zaman damgası
- Sayfada kalış süresi
- Sepete eklenen kampanya
- Checkout ve bağış sonucu

Kart numarası, CVV veya kart sahibi bilgileri analitiğe kaydedilmez.

Admin analitik ekranında:

- Ziyaretçi oturum sayısı
- IP adresleri
- Son ziyaret zamanı
- Gezilen sayfa sayısı
- Ortalama sayfa süresi
- En fazla sepete eklenen yardımlar
- Sepette bırakanlar
- Ödeme ekranında ayrılanlar
- Bağışı tamamlayanlar

görülebilir.

Lokal geliştirmede `vite.config.js` bellekte çalışan geçici analitik API sağlar. Sunucu yeniden başlatıldığında lokal analitik kayıtları silinir.

Production ortamında `YEDIRENK_ANALYTICS` KV binding’i kullanılır. Kayıtlar `expirationTtl` ile 30 gün sonra otomatik silinir.

## 8. Production admin güvenliği

Production admin şifresi frontend paketinde doğrulanmaz.

Sunucu tarafı admin API özellikleri:

- `ADMIN_PASSWORD` sunucu sırrı
- `ADMIN_SESSION_SECRET` HMAC anahtarı
- HMAC-SHA256 imzalı oturum
- 30 dakikalık oturum süresi
- `HttpOnly`
- `Secure`
- `SameSite=Strict`
- Same-origin/CSRF kontrolü
- Beş hatalı denemeden sonra IP bazlı 15 dakika kilit
- Sabit zamanlı parola karşılaştırması
- İstek gövdesi ve şema sınırları
- Eksik yapılandırmada fail-closed davranışı

Production endpointleri:

```text
POST /api/admin/login
POST /api/admin/logout
GET  /api/admin/session
GET  /api/admin/content
PUT  /api/admin/content
GET  /api/admin/analytics
POST /api/analytics
```

## 9. Güvenlik başlıkları

Hem `vercel.json` hem de `scripts/server.js` içinde şu korumalar bulunur:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy

React uygulamasında `dangerouslySetInnerHTML` kullanılmamaktadır. React’in varsayılan metin kaçışı korunmalıdır.

## 10. Production ortam değişkenleri ve binding’ler

Frontend:

```env
VITE_PANEL_API_URL=https://guvenli-api-adresi.example
```

Sunucu secret manager:

```env
ADMIN_PASSWORD=uzun-rastgele-uretim-sifresi
ADMIN_SESSION_SECRET=en-az-32-byte-rastgele-oturum-anahtari
```

Gerekli KV binding’ler:

```text
YEDIRENK_CMS
YEDIRENK_ANALYTICS
```

`VITE_ADMIN_PASSWORD` yalnızca lokal geliştirme içindir. Production şifresi olarak kullanılmamalıdır.

Gerçek `.env` dosyaları ve sırlar kaynak kontrolüne eklenmemelidir.

## 11. Bilinen sınırlar ve dikkat edilmesi gerekenler

1. Production KV binding’leri hosting panelinde ayrıca bağlanmalıdır.
2. Lokal analitik bellektedir ve dev server yeniden başlayınca silinir.
3. IP adresleri kişisel veri niteliği taşıyabilir. Gizlilik metni, açık onay, erişim yetkisi ve saklama süresi uygulanmaya devam edilmelidir.
4. Frontend tarafındaki doğrulamalar tek başına güvenlik sınırı değildir. Bağış API’si bütün alanları sunucuda yeniden doğrulamalıdır.
5. WAF, DDoS koruması, TLS, günlükleme ve alarmlar hosting katmanında yapılandırılmalıdır.
6. React Router sürümü günceldir. npm audit RSC/Server Action moduna ilişkin bir bildirim gösterebilir; bu uygulama RSC veya Server Action kullanmamaktadır. Yeni bir yama çıktığında tekrar güncellenmelidir.
7. Proje klasörü şu anda Git deposu olmayabilir. Değişiklik geçmişi isteniyorsa yeni hesapta Git başlatılmalıdır.
8. `dist/` build çıktısıdır; kaynak kod yerine `src/` ve `scripts/` düzenlenmelidir.
9. Var olan kullanıcı değişiklikleri korunmalı, ilgili olmayan dosyalar sıfırlanmamalıdır.

## 12. Mevcut test kapsamı

`scripts/admin-smoke.mjs` şu akışları test eder:

- Masaüstü admin girişi
- Slider create/update/delete
- Kampanya create/update/delete
- Haber create/update/delete
- Bütün sayfaların yüklenmesi
- İç sayfa editörü
- Ana sayfa editörü
- Mobil admin menüsü

`scripts/security-smoke.mjs` şu akışları test eder:

- Yetkisiz içerik erişiminin engellenmesi
- Cross-origin girişin engellenmesi
- Yanlış parolanın reddedilmesi
- Güvenli oturum çerezi
- Yetkili içerik erişimi
- Doğrulanmış içerik yazımı
- Analitik kayıt oluşturma
- Analitik IP zenginleştirme
- Yetkili analitik okuma

Son bilinen durumda production build ve bütün testler başarılıdır.

## 13. Yeni Codex hesabında kullanılacak başlangıç promptu

Yeni hesapta proje klasörünü açtıktan sonra aşağıdaki mesajı gönder:

```text
Bu proje daha önce başka bir Codex oturumunda geliştirildi.

Önce proje kökündeki HANDOFF.md ve SECURITY.md dosyalarını eksiksiz oku.
Ardından package.json, vite.config.js, scripts/server.js, src/cms.jsx,
src/analytics.js, src/AdminPanel.jsx ve src/App.jsx dosyalarını incele.

Mevcut bağış ve ödeme API akışını bozma.
Mevcut özellikleri yeniden yazmaya veya sıfırlamaya çalışma.
Önceden yapılmış değişiklikleri kullanıcıya ait kabul et.
Production admin doğrulamasını tekrar frontend şifresine çevirme.
Analitik sisteminde kart veya ödeme bilgisi kaydetme.

Önce şu kontrolleri çalıştır:

npm.cmd install
npm.cmd run build
node scripts\\admin-smoke.mjs
node scripts\\security-smoke.mjs

Ardından bana:
1. Projenin mevcut durumunu,
2. Admin/CMS mimarisini,
3. Bağış ve ödeme entegrasyonunu,
4. Analitik sistemini,
5. Güvenlik mimarisini,
6. Production için eksik dış yapılandırmaları,
7. Test sonuçlarını
özetle.

Sonrasında yeni talebimi mevcut mimarinin üzerine uygula.
```

## 14. Devir kontrol listesi

Yeni hesaba aktarılması gerekenler:

- [ ] `src/`
- [ ] `scripts/`
- [ ] `public/`
- [ ] `package.json`
- [ ] `package-lock.json`
- [ ] `vite.config.js`
- [ ] `vercel.json`
- [ ] `.env.example`
- [ ] `SECURITY.md`
- [ ] `HANDOFF.md`
- [ ] `.openai/hosting.json`

Aktarılmaması gerekenler:

- [ ] `node_modules/`
- [ ] Gerçek `.env` dosyası
- [ ] Production şifreleri
- [ ] API anahtarları
- [ ] Gerçek kullanıcı veya analitik verileri
- [ ] Gerekmedikçe `dist/`

## 15. Doğrulanmış veri, veritabanı ve servis bağlantı envanteri

Bu bölüm 5 Ağustos 2026 tarihinde kaynak kod taranarak hazırlanmıştır. “Kodda hazır”, “lokalde çalışıyor” ve “gerçek production servisine bağlı” ifadeleri birbirinden özellikle ayrılmıştır.

### 15.1 Genel durum özeti

| Alan | Lokal geliştirme | Worker/Cloudflare uyumlu production | Vercel production | Gerçek servis oluşturuldu mu? |
|---|---|---|---|---|
| Site statik dosyaları | Vite üzerinden çalışıyor | `env.ASSETS` üzerinden tasarlanmış | SPA rewrite ile yayınlanabilir | Statik build mevcut |
| CMS içerikleri | Tarayıcı `localStorage` | `YEDIRENK_CMS` KV için kod hazır | Vercel DB/Function bağlantısı yok | Hayır |
| Admin kimlik doğrulaması | Lokal frontend şifresi | Worker API ve güvenli cookie kodu hazır | Vercel Function karşılığı yok | Hayır |
| Ziyaretçi analitiği | Vite belleğinde geçici | `YEDIRENK_ANALYTICS` KV için kod hazır | Vercel DB/Function bağlantısı yok | Hayır |
| Bağış API’si | Varsayılan `http://localhost:3000` | Harici HTTPS API’ye gönderilebilir | Harici HTTPS API’ye gönderilebilir | Bu repo içinde backend yok |
| Vercel güvenlik başlıkları | Uygulanmaz | Worker kendi başlıklarını ekler | `vercel.json` ile hazır | Yapılandırma dosyası mevcut |
| PostgreSQL/SQL | Yok | Yok | Yok | Hayır |
| Neon/Supabase/Vercel Postgres | Yok | Yok | Yok | Hayır |

### 15.2 CMS içeriklerinin gerçek saklama yeri

Kaynak dosya: `src/cms.jsx`

Lokal saklama:

```text
Tarayıcı localStorage
Anahtar: yedirenk-cms-v1
```

Burada tutulan bölümler:

- `settings`
- `home`
- `slides`
- `campaigns`
- `news`
- `pages`
- `navigation`
- `workAreas`
- `trust`
- `footer`

Davranış:

1. Uygulama açıldığında varsayılan içerikler `src/App.jsx` içindeki `cmsDefaults` nesnesinden oluşturulur.
2. `localStorage` içinde eski kayıt varsa varsayılan içerikle birleştirilir.
3. Panelde yapılan her değişiklik React state’e ve `localStorage` alanına yazılır.
4. “Yedeği indir” JSON üretir.
5. “Yedek yükle” 4 MB, şema ve kayıt sayısı kontrollerinden geçer.

Production için tasarlanan saklama:

```text
Binding adı: YEDIRENK_CMS
KV anahtarı: content
Yazan endpoint: PUT /api/admin/content
Okuyan endpoint: GET /api/admin/content
Sunucu dosyası: scripts/server.js
```

Gerçek durum:

> `YEDIRENK_CMS` isimli gerçek KV alanının oluşturulduğuna veya hosting hesabına bağlandığına dair bu proje klasöründe kanıt yoktur. Kod entegrasyonu hazırdır; dış kaynak henüz provision edilmemiştir.

### 15.3 Sayfa içeriklerinin kaynakları

Varsayılan sayfa kataloğu:

```text
src/siteData.js → pageContent
```

Detaylı özel sayfa profilleri:

```text
src/App.jsx → pageProfiles
```

Birleştirme:

```text
src/App.jsx → cmsDefaults.pages
```

Panel bağlantısı:

```text
src/AdminPanel.jsx → “Diğer Sayfalar”
```

Site gösterimi:

```text
src/App.jsx → ContentPage
```

KVKK, etik, denetim, mali tablolar ve diğer kurumsal/yasal rotalar bu birleşik `pages` nesnesinden yönetilir.

### 15.4 Admin kimlik doğrulamasının bağlantıları

Lokal geliştirme:

```text
Kaynak: src/AdminPanel.jsx
Değişken: VITE_ADMIN_PASSWORD
Fallback: yedirenk2026
Saklama: kalıcı oturum saklanmaz
```

Bu yalnızca lokal geliştirme kolaylığıdır ve production güvenlik sınırı değildir.

Production için hazırlanan akış:

```text
POST /api/admin/login
POST /api/admin/logout
GET  /api/admin/session
```

Sunucu dosyası:

```text
scripts/server.js
```

Sunucu sırları:

```text
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

Oturum:

```text
Cookie adı: yedirenk_admin
HttpOnly: evet
Secure: evet
SameSite: Strict
Süre: 30 dakika
İmza: HMAC-SHA256
```

Gerçek durum:

> Worker çalıştırılmadan ve sunucu sırları hosting secret manager’a girilmeden production admin doğrulaması çalışmaz. Vercel üzerinde bu endpointleri sağlayan `api/` Functions dosyaları şu anda yoktur.

### 15.5 Analitik verilerinin gerçek saklama yeri

İstemci olay üretimi:

```text
src/analytics.js
POST /api/analytics
```

Onay kaydı:

```text
localStorage anahtarı: yedirenk-analytics-consent
Değerler: accepted / rejected
```

Anonim oturum kimliği:

```text
sessionStorage anahtarı: yedirenk-session-id
```

Lokal geliştirme analitiği:

```text
Dosya: vite.config.js
Depolama: Node/Vite process belleğindeki events dizisi
POST: /api/analytics
GET: /api/admin/analytics
Maksimum: son 1000 olay
Kalıcılık: dev server kapanınca silinir
Lokal IP: socket.remoteAddress
```

Production için hazırlanan analitik:

```text
Binding adı: YEDIRENK_ANALYTICS
Anahtar biçimi: event:<timestamp>:<uuid>
Saklama süresi: 30 gün
Yazma: POST /api/analytics
Admin okuma: GET /api/admin/analytics
```

Kaydedilen olaylar:

- `consent_accepted`
- `page_view`
- `page_duration`
- `cart_add`
- `checkout_start`
- `donation_success`

IP kaynağı:

```text
1. CF-Connecting-IP
2. X-Forwarded-For
3. unknown
```

Gerçek durum:

> `YEDIRENK_ANALYTICS` adlı gerçek KV alanının oluşturulduğuna dair bu klasörde kanıt yoktur. Lokal analitik çalışır; production KV dışarıdan bağlanmalıdır.

### 15.6 Bağış verilerinin bağlantısı

Frontend kaynak dosyası:

```text
src/App.jsx → Cart → pay()
```

API adresi önceliği:

```text
1. VITE_PANEL_API_URL
2. VITE_VEFA_API_URL
3. http://localhost:3000
```

Endpoint:

```text
POST <API_BASE>/api/public/online-donations
```

Bu repo içinde `/api/public/online-donations` endpointini uygulayan sunucu kodu bulunmamaktadır. Bağış bilgileri harici panele gönderilmek üzere tasarlanmıştır.

Gönderilen veri:

- Bağışçı adı ve soyadı
- Telefon
- E-posta
- Şehir ve ilçe
- Toplam tutar
- Kampanya özeti
- Onay bilgisi
- Honeypot alanı

Gönderilmeyen veri:

- Kart numarası
- CVV
- Son kullanma tarihi

Gerçek durum:

> `.env.example` içinde API adresi `http://localhost:3000` olarak örneklenmiştir. Gerçek production bağış API adresinin bu klasörde tanımlandığına dair kanıt yoktur. Production’da HTTPS adres hosting environment variable olarak girilmelidir.

### 15.7 Vercel bağlantısının gerçek durumu

Mevcut Vercel dosyası:

```text
vercel.json
```

İçeriği:

- Güvenlik response header’ları
- Bütün SPA rotalarını `/index.html` dosyasına yönlendiren rewrite

Mevcut Vercel bağlantı metadatası:

```text
.vercel/ klasörü .gitignore içindedir
```

Bu klasörde Vercel Functions için aşağıdaki türde dosyalar yoktur:

```text
api/admin/login.js
api/admin/content.js
api/admin/analytics.js
api/analytics.js
```

Ayrıca aşağıdaki paket veya bağlantılar yoktur:

- `@vercel/postgres`
- Neon driver
- Supabase client
- Prisma
- Drizzle
- PostgreSQL bağlantı URL’si
- Vercel Blob
- Upstash Redis
- Vercel KV entegrasyonu

Sonuç:

> Vercel’e yalnızca mevcut haliyle deploy edilirse statik site ve güvenlik başlıkları çalışabilir. `scripts/server.js` Vercel Function değildir; Cloudflare/asset-worker biçimindedir. Admin content API ve production analitiği Vercel’de çalışmaz. Vercel için ayrıca Functions ve gerçek bir veritabanı entegrasyonu yazılmalıdır.

### 15.8 Worker/Cloudflare tarzı bağlantının gerçek durumu

Build sırasında:

```text
scripts/server.js → dist/server/index.js
.openai/hosting.json → dist/.openai/hosting.json
```

Worker’ın beklediği ortam:

```text
env.ASSETS
env.YEDIRENK_CMS
env.YEDIRENK_ANALYTICS
env.ADMIN_PASSWORD
env.ADMIN_SESSION_SECRET
```

`env.ASSETS` statik site dosyalarını sunar. KV binding’ler içerik ve analitik depolar. Sırlar admin oturumu için kullanılır.

Gerçek durum:

> Worker kodu ve testleri hazırdır. Fakat dış hosting hesabında binding ve secret oluşturulması proje dosyasından doğrulanamaz.

### 15.9 Veritabanı tabloları

Bu projede şu anda SQL veritabanı ve migration bulunmamaktadır.

Dolayısıyla şu tablolar fiziksel olarak mevcut değildir:

- users/admins
- sessions
- cms_content
- pages
- campaigns
- news
- analytics_events
- donations
- abandoned_carts

CMS ve analitik için SQL yerine KV nesneleri tasarlanmıştır. Bağış kayıtları ise harici API’ye bırakılmıştır.

### 15.10 Dosya ve görsel depolama

Varsayılan görseller:

```text
public/assets/
```

Admin panelinden yüklenen görseller:

```text
FileReader → data URL/base64 → CMS içeriği
```

Sınır:

```text
Tek görsel: yaklaşık 3 MB
CMS import paketi: 4 MB
```

Gerçek bir object storage bağlantısı yoktur:

- Vercel Blob yok
- S3 yok
- Cloudflare R2 yok
- Supabase Storage yok

Production için çok sayıda/büyük görsel kullanılacaksa object storage eklenmesi gerekir. Base64 görseller KV ve JSON boyutunu hızla büyütür.

### 15.11 Arama, formlar ve bülten

Site içi arama:

- URL query oluşturur: `/arama?q=...`
- Gerçek arama backend’i veya indeks veritabanı yoktur.

İletişim/gönüllü/sponsor formları:

- React state içinde başarı ekranı gösterir.
- Bu repo içinde API’ye veya veritabanına kayıt yapmaz.
- Sayfa yenilendiğinde veri kaybolur.

Bülten formu:

- React state içinde başarı mesajı gösterir.
- E-posta servisine veya veritabanına bağlı değildir.

Zekât hesaplama:

- Tamamen istemci tarafında hesaplanır.
- Veri saklamaz.

### 15.12 Çerez ve tarayıcı depolama envanteri

| Anahtar/cookie | Yer | Amaç | Süre |
|---|---|---|---|
| `yedirenk-cms-v1` | localStorage | Lokal CMS içerikleri | Kullanıcı silene kadar |
| `yedirenk-analytics-consent` | localStorage | Analitik izin tercihi | Kullanıcı silene kadar |
| `yedirenk-session-id` | sessionStorage | Anonim analitik oturumu | Tarayıcı sekmesi kapanana kadar |
| `yedirenk_admin` | Secure HttpOnly cookie | Production admin oturumu | 30 dakika |

Kodda eski `sessionStorage.removeItem('yedirenk-admin')` çağrısı çıkış düğmesinde bulunabilir; güncel production oturumu `yedirenk_admin` HttpOnly cookie’sidir ve `/api/admin/logout` üzerinden temizlenmelidir.

### 15.13 Test ve örnek veriler

`scripts/security-smoke.mjs` gerçek production veritabanına bağlanmaz. Bellekte sahte KV nesneleri oluşturur ve Worker API davranışını test eder.

`scripts/admin-smoke.mjs` localhost admin panelini Playwright ile test eder. Oluşturduğu test slider/kampanya/haber içeriklerini test sonunda siler.

Test dosyalarındaki parola, IP ve kayıtlar örnek veridir; production sırrı veya gerçek kullanıcı verisi değildir.

### 15.14 Production’a geçmeden önce zorunlu karar

Tek bir hosting/veri mimarisi seçilmelidir:

#### Seçenek A — Worker + KV

- `scripts/server.js` korunur.
- `YEDIRENK_CMS` ve `YEDIRENK_ANALYTICS` KV binding’leri oluşturulur.
- `ADMIN_PASSWORD` ve `ADMIN_SESSION_SECRET` secret olarak girilir.
- `env.ASSETS` destekleyen hosting kullanılır.

#### Seçenek B — Vercel + PostgreSQL/Redis

- Vercel Functions altında API endpointleri yeniden oluşturulur.
- Neon/Vercel Marketplace PostgreSQL bağlanır.
- Admin, içerik ve analitik şemaları/migration’ları yazılır.
- Rate limit için Redis/Upstash veya eşdeğer servis bağlanır.
- Görseller için Vercel Blob veya başka object storage bağlanır.

İki mimari yarım biçimde birlikte bırakılmamalıdır. Yeni Codex işe başlamadan önce kullanıcıdan production hedefinin Vercel mi yoksa Worker/KV mi olduğunu kesinleştirmelidir.
