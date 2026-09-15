# GoDaddy PHP/MySQL kurulumu

Bu paket standart GoDaddy cPanel Linux Hosting, PHP 8.1+ ve MySQL/MariaDB için hazırlanmıştır. Windows Hosting veya yalnızca statik Website Builder paketi uygun değildir.

## 1. Veritabanı

1. cPanel > **MySQL Databases** bölümünden veritabanı ve kullanıcı oluşturun.
2. Kullanıcıyı veritabanına ekleyip **ALL PRIVILEGES** verin.
3. cPanel > **phpMyAdmin** içinde veritabanını seçin ve `database/yedirenk_godaddy.sql` dosyasını içe aktarın.

## 2. Sunucu ayarı

1. `godaddy/api/config.example.php` dosyasını `godaddy/api/config.php` adıyla kopyalayın.
2. `db_name`, `db_user` ve `db_password` değerlerini cPanel bilgileriyle değiştirin. GoDaddy'de adların başında çoğunlukla cPanel kullanıcı öneki bulunur.
3. Bilgisayarınızda güçlü bir admin şifre özeti üretin:

   `php -r "echo password_hash('BURAYA_GUCLU_SIFRE', PASSWORD_DEFAULT), PHP_EOL;"`

   PHP yerelde yoksa cPanel **Terminal** ekranında aynı komutu çalıştırın. Terminal özelliği paketinizde yoksa GoDaddy desteğinden PHP `password_hash` çıktısı üretme konusunda yardım isteyin. Çıktıyı `admin_password_hash` alanına yazın; düz şifreyi yazmayın ve web'e parola üreten geçici bir dosya yüklemeyin.

## 3. Üretim paketini oluşturma ve yükleme

1. Bilgisayarınızda Node.js 20+ kurulu olmalıdır.
2. Proje kökünde `npm install`, sonra `npm run build:godaddy` çalıştırın. Bu komut kaynak kodda kullanılan bütün görsel ve fontları doğrular; eksik dosya varsa yükleme paketini oluşturmaz.
3. Oluşan `dist` klasöründeki **dosyaların tamamını** cPanel File Manager ile `public_html` içine yükleyin. `dist` klasörünün kendisini değil, içeriğini yükleyin.
4. Hazırladığınız gerçek `config.php` dosyasını `public_html/api/config.php` konumuna ayrıca yükleyin.
5. cPanel > **MultiPHP Manager** bölümünde alan adını PHP 8.1 veya daha yeni sürüme alın ve SSL sertifikasını etkinleştirin.

## 4. Albaraka Sanal POS

1. Bankanın verdiği `Merchant No`, `Terminal No`, `EPOS/Posnet ID` ve `ENC Key` değerlerini `api/config.php` içindeki `albaraka_*` alanlarına yazın.
2. Test sırasında `epostest.albarakaturk.com.tr`, canlı geçişte `epos.albarakaturk.com.tr` adreslerini kullanın.
3. `albaraka_return_url` değerini `https://www.yedirenkdernegi.org/api/payment/albaraka/callback` olarak tanımlayın ve aynı adresi banka işyeri paneline bildirin.
4. Hosting sunucusunun dış IP adresini bankaya bildirerek Merchant/Terminal için servis erişim iznini açtırın. Bankanın `E172` hatası IP yetkisinin eksik olduğunu belirtir.
5. Önce banka test kartıyla 3D doğrulama, başarısız şifre, reddedilen satış ve başarılı satış senaryolarını tamamlayın; banka onayından sonra canlı URL ve canlı anahtara geçin.
6. `config.php` dosyasını ZIP’e veya Git’e eklemeyin. Yayın paketi mevcut sunucu ayarını korumak için bu dosyayı içermez.

## 5. Kontrol

- `https://alanadiniz.com` açılmalı ve sayfa yenilemeleri 404 vermemelidir.
- `https://alanadiniz.com/api/exchange-rates` JSON döndürmelidir.
- `/admin` üzerinden belirlediğiniz admin şifresiyle giriş yapılmalıdır.
- Test kullanıcısı kaydı, iletişim formu ve banka test kartıyla küçük bir 3D Secure bağış denenmelidir.
- `public_html/api/uploads` klasörü yazılabilir olmalıdır (genellikle 750/755); web adresinden dosya okunması 403 vermelidir.

## Notlar

- Kart numarası, son kullanma tarihi ve CVV veritabanına veya uygulama loglarına kaydedilmez.
- Sonucu kesinleşmeyen banka çağrıları `review_required` durumuna alınır; aynı sipariş otomatik olarak yeniden satışa gönderilmez.
- `config.php` dosyasını paylaşmayın ve kaynak kontrolüne eklemeyin.
- Veritabanı ve `api/uploads` klasörü için düzenli yedek alın.
