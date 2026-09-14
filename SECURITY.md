# Güvenlik notları

## Üretim kurulumu

- `VITE_ADMIN_PASSWORD` yalnızca lokal geliştirme içindir. Üretimde admin API'si `ADMIN_PASSWORD` ve `ADMIN_SESSION_SECRET` sunucu sırlarını, `HttpOnly + Secure + SameSite=Strict` çerezi ve `YEDIRENK_CMS` KV binding'ini kullanır.
- `VITE_PANEL_API_URL` üretimde yalnızca HTTPS bir adres olmalıdır.
- TLS, WAF/DDoS koruması, erişim günlükleri, yedekleme ve alarm kuralları hosting katmanında etkinleştirilmelidir.
- Ziyaretçi analitiği `YEDIRENK_ANALYTICS` KV alanında tutulur ve her kayıt 30 gün sonra otomatik silinir. Analitik yalnızca açık onaydan sonra çalışır; kart veya ödeme bilgisi kaydedilmez.
- `.env` dosyaları kaynak kontrolüne eklenmemelidir. Üretim sırları hosting secret manager üzerinden verilmelidir.

## Uygulanan kontroller

- CSP, HSTS, clickjacking, MIME sniffing, referrer, permissions ve cross-origin başlıkları
- Admin parola deneme sınırı ve üretimde varsayılan şifreyle açılmama
- İçerik yedeği boyut, tür ve kayıt sayısı doğrulaması
- Ödeme API adresinde HTTPS zorunluluğu, tutar/uzunluk kontrolleri ve istek zaman aşımı
- React'in varsayılan metin kaçışının korunması; ham HTML işleme kullanılmaması

## Üretim admin mimarisi

Admin girişi üretimde sunucu tarafında doğrulanır. Oturum 30 dakika geçerli HMAC imzalı ve JavaScript tarafından okunamayan güvenli çerez ile taşınır. Giriş ve içerik API'leri same-origin kontrolü, hız sınırı, gövde sınırı ve şema doğrulaması uygular. Gerekli sırlar veya KV binding yoksa servis fail-closed davranarak erişime izin vermez.

React Router 7.18.2 için npm denetimi RSC/Server Action moduna özgü bir CSRF bildirimi göstermektedir. Bu uygulama RSC veya Server Action kullanmadığı için ilgili saldırı yolu aktif değildir; yine de yeni yamalar çıktığında bağımlılık güncellenmelidir.
