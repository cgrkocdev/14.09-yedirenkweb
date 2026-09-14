<?php
declare(strict_types=1);

const MAX_JSON_BYTES = 4000000;

function respond(array $body, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400): never { respond(['message' => $message], $status); }
function method(string $expected): void { if (($_SERVER['REQUEST_METHOD'] ?? '') !== $expected) fail('Yöntem desteklenmiyor.', 405); }
set_exception_handler(static fn(Throwable $error) => fail('Sunucu işlemi tamamlanamadı.', 500));

function bodyJson(int $limit = MAX_JSON_BYTES): array {
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > $limit) fail('İstek çok büyük.', 413);
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    if (!is_array($data)) fail('Geçersiz JSON.', 400);
    return $data;
}

function text(mixed $value, int $max): string { return mb_substr(trim((string)$value), 0, $max); }
function nowMs(): int { return (int)floor(microtime(true) * 1000); }
function publicUser(array $u): array {
    return [
        'id' => (string)$u['id'], 'email' => $u['email'], 'firstName' => $u['first_name'],
        'lastName' => $u['last_name'], 'phone' => $u['phone'],
        'createdAt' => (int)$u['created_at_ms'], 'lastLoginAt' => (int)$u['last_login_at_ms'],
        'active' => (bool)$u['active'],
    ];
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) fail('Sunucu yapılandırması eksik. api/config.php dosyasını oluşturun.', 503);
$config = require $configFile;
date_default_timezone_set($config['timezone'] ?? 'Europe/Istanbul');

session_name((string)($config['session_name'] ?? 'yedirenk_session'));
session_set_cookie_params(['lifetime' => 604800, 'path' => '/', 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'httponly' => true, 'samesite' => 'Lax']);
session_start();

try {
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $config['db_host'], (int)($config['db_port'] ?? 3306), $config['db_name']);
    $db = new PDO($dsn, $config['db_user'], $config['db_password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (Throwable $e) { fail('Veritabanı bağlantısı kurulamadı.', 503); }

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = preg_replace('#^.*?/api(?=/|$)#', '', $path, 1) ?: '/';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($requestMethod !== 'GET') {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if ($origin !== '' && strcasecmp((string)parse_url($origin, PHP_URL_HOST), preg_replace('/:\d+$/', '', $host)) !== 0) fail('Geçersiz istek kaynağı.', 403);
}

function requireAdmin(): void { if (empty($_SESSION['admin'])) fail('Yetkisiz erişim.', 401); }
function verifyAdminPassword(string $password, string $storedHash): bool {
    if (substr($storedHash, 0, 14) === 'pbkdf2_sha256$') {
        $parts = explode('$', $storedHash);
        if (count($parts) !== 4 || !ctype_digit($parts[1])) return false;
        $rounds = (int)$parts[1];
        $salt = $parts[2];
        $expected = $parts[3];
        if ($rounds < 100000 || $rounds > 1000000 || !preg_match('/^[a-f0-9]{32}$/', $salt) || !preg_match('/^[a-f0-9]{64}$/', $expected)) return false;
        $actual = hash_pbkdf2('sha256', $password, $salt, $rounds, 64, false);
        return hash_equals($expected, $actual);
    }
    return $storedHash !== '' && password_verify($password, $storedHash);
}

function ensureAnalyticsGeoTable(PDO $db): void {
    $db->exec("CREATE TABLE IF NOT EXISTS analytics_geo_cache (
        ip VARCHAR(64) PRIMARY KEY,
        country_code VARCHAR(12) NOT NULL DEFAULT '',
        country VARCHAR(100) NOT NULL DEFAULT '',
        region VARCHAR(120) NOT NULL DEFAULT '',
        city VARCHAR(120) NOT NULL DEFAULT '',
        timezone VARCHAR(100) NOT NULL DEFAULT '',
        isp VARCHAR(180) NOT NULL DEFAULT '',
        updated_at_ms BIGINT UNSIGNED NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_geo_updated (updated_at_ms)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

function isPublicIp(string $ip): bool {
    return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
}

function fetchIpLocation(string $ip): ?array {
    if (!isPublicIp($ip)) return null;
    $url = 'https://ipwho.is/' . rawurlencode($ip) . '?fields=success,country_code,country,region,city,timezone,connection';
    $raw = false;
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>2,CURLOPT_TIMEOUT=>3,CURLOPT_HTTPHEADER=>['Accept: application/json','User-Agent: YedirenkAnalytics/1.0']]);
        $raw = curl_exec($curl);
        curl_close($curl);
    }
    if (!$raw && ini_get('allow_url_fopen')) {
        $context = stream_context_create(['http' => ['timeout'=>2.5,'ignore_errors'=>true,'header'=>"Accept: application/json\r\nUser-Agent: YedirenkAnalytics/1.0\r\n"]]);
        $raw = @file_get_contents($url, false, $context);
    }
    if (!$raw) return null;
    $result = json_decode($raw, true);
    if (!is_array($result) || empty($result['success'])) return null;
    $connection = is_array($result['connection'] ?? null) ? $result['connection'] : [];
    $timezone = is_array($result['timezone'] ?? null) ? (string)($result['timezone']['id'] ?? '') : (string)($result['timezone'] ?? '');
    return [
        'countryCode' => text($result['country_code'] ?? '', 12),
        'country' => text($result['country'] ?? '', 100),
        'region' => text($result['region'] ?? '', 120),
        'city' => text($result['city'] ?? '', 120),
        'timezone' => text($timezone, 100),
        'isp' => text($connection['isp'] ?? $connection['org'] ?? '', 180),
    ];
}

function cachedIpLocations(PDO $db, array $ips, int $lookupLimit = 20): array {
    ensureAnalyticsGeoTable($db);
    $ips = array_values(array_unique(array_filter(array_map('strval', $ips), 'isPublicIp')));
    if (!$ips) return [];
    $locations = [];
    foreach (array_chunk($ips, 200) as $chunk) {
        $marks = implode(',', array_fill(0, count($chunk), '?'));
        $q = $db->prepare("SELECT * FROM analytics_geo_cache WHERE ip IN ($marks)");
        $q->execute($chunk);
        foreach ($q->fetchAll() as $row) $locations[$row['ip']] = $row;
    }
    $freshAfter = nowMs() - 30 * 86400000;
    $lookups = 0;
    foreach ($ips as $ip) {
        $cached = $locations[$ip] ?? null;
        if ($cached && (int)$cached['updated_at_ms'] >= $freshAfter) continue;
        if ($lookups >= $lookupLimit) continue;
        $lookups++;
        $geo = fetchIpLocation($ip);
        if (!$geo) continue;
        $updated = nowMs();
        $q = $db->prepare('INSERT INTO analytics_geo_cache (ip,country_code,country,region,city,timezone,isp,updated_at_ms) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE country_code=VALUES(country_code),country=VALUES(country),region=VALUES(region),city=VALUES(city),timezone=VALUES(timezone),isp=VALUES(isp),updated_at_ms=VALUES(updated_at_ms)');
        $q->execute([$ip,$geo['countryCode'],$geo['country'],$geo['region'],$geo['city'],$geo['timezone'],$geo['isp'],$updated]);
        $locations[$ip] = ['ip'=>$ip,'country_code'=>$geo['countryCode'],'country'=>$geo['country'],'region'=>$geo['region'],'city'=>$geo['city'],'timezone'=>$geo['timezone'],'isp'=>$geo['isp'],'updated_at_ms'=>$updated];
    }
    return $locations;
}

if ($path === '/public/content') {
    method('GET');
    $row = $db->query("SELECT content_json FROM cms_content WHERE content_key='content'")->fetch();
    respond(['content' => $row ? json_decode($row['content_json'], true) : null]);
}

if ($path === '/admin/login') {
    method('POST');
    $body = bodyJson(2048);
    $blockedUntil = (int)($_SESSION['admin_blocked_until'] ?? 0);
    if ($blockedUntil > time()) fail('Çok fazla deneme. Daha sonra tekrar deneyin.', 429);
    $hash = (string)($config['admin_password_hash'] ?? '');
    if (!verifyAdminPassword((string)($body['password'] ?? ''), $hash)) {
        $attempts = (int)($_SESSION['admin_attempts'] ?? 0) + 1;
        if ($attempts >= 5) { $_SESSION['admin_attempts'] = 0; $_SESSION['admin_blocked_until'] = time() + 900; }
        else $_SESSION['admin_attempts'] = $attempts;
        fail('Giriş bilgileri geçersiz.', 401);
    }
    session_regenerate_id(true); $_SESSION['admin'] = true; unset($_SESSION['admin_attempts'], $_SESSION['admin_blocked_until']);
    respond(['ok' => true]);
}
if ($path === '/admin/logout') { method('POST'); $_SESSION = []; session_destroy(); respond(['ok' => true]); }
if ($path === '/admin/session') { method('GET'); requireAdmin(); respond(['authenticated' => true]); }

if ($path === '/admin/content') {
    requireAdmin();
    if ($requestMethod === 'GET') {
        $row = $db->query("SELECT content_json FROM cms_content WHERE content_key='content'")->fetch();
        respond(['content' => $row ? json_decode($row['content_json'], true) : null]);
    }
    if ($requestMethod === 'PUT') {
        $body = bodyJson();
        if (!isset($body['campaigns'], $body['news'], $body['slides']) || !is_array($body['campaigns']) || !is_array($body['news']) || !is_array($body['slides']) || count($body['campaigns']) > 200 || count($body['news']) > 1000 || count($body['slides']) > 100) fail('İçerik şeması geçersiz.');
        $json = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $q = $db->prepare("INSERT INTO cms_content (content_key, content_json) VALUES ('content', ?) ON DUPLICATE KEY UPDATE content_json=VALUES(content_json), updated_at=CURRENT_TIMESTAMP");
        $q->execute([$json]); respond(['ok' => true]);
    }
    fail('Yöntem desteklenmiyor.', 405);
}

if ($path === '/admin/users') {
    method('GET'); requireAdmin();
    $rows = $db->query('SELECT id,email,first_name,last_name,phone,created_at_ms,last_login_at_ms,active FROM users ORDER BY created_at_ms DESC LIMIT 1000')->fetchAll();
    respond(['users' => array_map('publicUser', $rows)]);
}

if ($path === '/admin/analytics') {
    method('GET'); requireAdmin();
    $days = max(1, (int)($config['analytics_retention_days'] ?? 30));
    $db->exec('DELETE FROM analytics_events WHERE created_at < DATE_SUB(NOW(), INTERVAL ' . $days . ' DAY)');
    $rows = $db->query('SELECT event_name,session_id,path,referrer,data_json,ip,user_agent,created_at_ms FROM analytics_events ORDER BY created_at_ms DESC LIMIT 10000')->fetchAll();
    $locations = cachedIpLocations($db, array_column($rows, 'ip'));
    $events = array_map(function($r) use ($locations) {
        $geo = $locations[$r['ip']] ?? [];
        return ['event'=>$r['event_name'],'sessionId'=>$r['session_id'],'path'=>$r['path'],'referrer'=>$r['referrer'],'data'=>json_decode($r['data_json'], true) ?: new stdClass(),'ip'=>$r['ip'],'userAgent'=>$r['user_agent'],'timestamp'=>(int)$r['created_at_ms'],'countryCode'=>$geo['country_code'] ?? '','country'=>$geo['country'] ?? '','region'=>$geo['region'] ?? '','city'=>$geo['city'] ?? '','timezone'=>$geo['timezone'] ?? '','isp'=>$geo['isp'] ?? ''];
    }, $rows);
    respond(['events' => $events, 'retentionDays' => $days, 'geoPending' => count(array_filter(array_unique(array_column($rows, 'ip')), fn($ip) => isPublicIp((string)$ip) && empty($locations[$ip])))]);
}

if ($path === '/account/register') {
    method('POST'); $b = bodyJson(8192);
    $email = strtolower(text($b['email'] ?? '', 254)); $first = text($b['firstName'] ?? '', 80); $last = text($b['lastName'] ?? '', 80); $phone = text($b['phone'] ?? '', 30); $password = (string)($b['password'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !$first || !$last || !$phone || strlen($password) < 8 || strlen($password) > 128) fail('Bilgileri kontrol edin; şifre en az 8 karakter olmalıdır.');
    $id = bin2hex(random_bytes(16)); $ms = nowMs();
    try { $q=$db->prepare('INSERT INTO users (id,email,first_name,last_name,phone,password_hash,created_at_ms,last_login_at_ms,active) VALUES (?,?,?,?,?,?,?,?,1)'); $q->execute([$id,$email,$first,$last,$phone,password_hash($password,PASSWORD_DEFAULT),$ms,$ms]); }
    catch (PDOException $e) { if ((string)$e->getCode()==='23000') fail('Bu e-posta adresiyle daha önce kayıt olunmuş.',409); throw $e; }
    $row=['id'=>$id,'email'=>$email,'first_name'=>$first,'last_name'=>$last,'phone'=>$phone,'created_at_ms'=>$ms,'last_login_at_ms'=>$ms,'active'=>1];
    session_regenerate_id(true); $_SESSION['user_id']=$id; respond(['user'=>publicUser($row)],201);
}
if ($path === '/account/login') {
    method('POST'); $b=bodyJson(8192); $email=strtolower(text($b['email'] ?? '',254));
    $q=$db->prepare('SELECT * FROM users WHERE email=? LIMIT 1'); $q->execute([$email]); $u=$q->fetch();
    if (!$u || !$u['active'] || !password_verify((string)($b['password'] ?? ''),$u['password_hash'])) fail('E-posta veya şifre hatalı.',401);
    $ms=nowMs(); $db->prepare('UPDATE users SET last_login_at_ms=? WHERE id=?')->execute([$ms,$u['id']]); $u['last_login_at_ms']=$ms;
    session_regenerate_id(true); $_SESSION['user_id']=$u['id']; respond(['user'=>publicUser($u)]);
}
if ($path === '/account/logout') { method('POST'); unset($_SESSION['user_id']); respond(['ok'=>true]); }
if ($path === '/account/me') {
    method('GET'); if (empty($_SESSION['user_id'])) fail('Oturum bulunamadı.',401);
    $q=$db->prepare('SELECT * FROM users WHERE id=? AND active=1'); $q->execute([$_SESSION['user_id']]); $u=$q->fetch();
    if (!$u) fail('Oturum bulunamadı.',401); respond(['user'=>publicUser($u)]);
}

if ($path === '/public/applications') {
    method('POST'); $b=bodyJson(20000);
    $type=text($b['type'] ?? '',40); $name=text($b['name'] ?? '',120); $email=strtolower(text($b['email'] ?? '',160)); $phone=text($b['phone'] ?? '',40); $subject=text($b['subject'] ?? '',120); $message=text($b['message'] ?? '',3000);
    if (!in_array($type,['volunteer','sponsor','contact'],true) || !$name || !filter_var($email,FILTER_VALIDATE_EMAIL) || !$phone || !$message || ($b['consent'] ?? false)!==true) fail('Zorunlu başvuru bilgilerini kontrol edin.');
    $id=bin2hex(random_bytes(16)); $q=$db->prepare('INSERT INTO applications (id,type,name,email,phone,subject,message,consent,created_at_ms) VALUES (?,?,?,?,?,?,?,?,?)'); $q->execute([$id,$type,$name,$email,$phone,$subject,$message,1,nowMs()]); respond(['ok'=>true,'reference'=>$id],201);
}

if ($path === '/analytics') {
    method('POST'); $b=bodyJson(8192); $allowed=['consent_accepted','page_view','page_duration','click','cart_add','checkout_start','donation_success'];
    $event=text($b['event'] ?? '',40); $sid=text($b['sessionId'] ?? '',80); if (!in_array($event,$allowed,true) || !$sid) fail('Geçersiz olay.');
    $data=is_array($b['data'] ?? null)?$b['data']:[];
    $country=text($_SERVER['HTTP_CF_IPCOUNTRY'] ?? $_SERVER['HTTP_X_COUNTRY_CODE'] ?? $_SERVER['GEOIP_COUNTRY_CODE'] ?? '', 12);
    $city=text($_SERVER['HTTP_CF_IPCITY'] ?? $_SERVER['HTTP_X_CITY'] ?? $_SERVER['GEOIP_CITY'] ?? '', 100);
    $data['_geoCountry']=$country; $data['_geoCity']=$city;
    $q=$db->prepare('INSERT INTO analytics_events (event_name,session_id,path,referrer,data_json,ip,user_agent,created_at_ms) VALUES (?,?,?,?,?,?,?,?)');
    $q->execute([$event,$sid,text($b['path'] ?? '/',300),text($b['referrer'] ?? '',500),json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES),text($_SERVER['REMOTE_ADDR'] ?? 'unknown',64),text($_SERVER['HTTP_USER_AGENT'] ?? '',300),nowMs()]); respond(['ok'=>true],202);
}

if ($path === '/public/online-donations') {
    method('POST'); if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0)>9000000) fail('Bağış isteği çok büyük.',413);
    $b=json_decode((string)($_POST['payload'] ?? ''),true); if (!is_array($b)) fail('Bağış bilgileri okunamadı.');
    $file=$_FILES['receipt'] ?? null; $allowed=['application/pdf'=>'pdf','image/jpeg'=>'jpg','image/png'=>'png'];
    if (!$file || $file['error']!==UPLOAD_ERR_OK || $file['size']<1 || $file['size']>8*1024*1024) fail('Geçerli bir dekont yükleyin (en fazla 8 MB).');
    $mime=(new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']); if (!isset($allowed[$mime])) fail('Dekont biçimi desteklenmiyor.',415);
    $email=strtolower(text($b['email'] ?? '',254)); $amount=(float)($b['amount'] ?? 0); $items=is_array($b['items'] ?? null)?array_slice($b['items'],0,30):[];
    if (!text($b['firstName']??'',80)||!text($b['lastName']??'',80)||!text($b['phone']??'',30)||!filter_var($email,FILTER_VALIDATE_EMAIL)||!text($b['description']??'',500)||!text($b['campaign']??'',500)||$amount<1||$amount>10000000||($b['consent']??false)!==true||!$items||($b['paymentMethod']??'')!=='EFT_HAVALE'||!in_array($b['bankAccountCode']??'',['TRY','USD','EUR'],true)||!text($b['bankAccountIban']??'',40)||(float)($b['transferAmount']??0)<=0) fail('Bağış bilgilerini kontrol edin.');
    $reference='YD-'.date('Ymd').'-'.strtoupper(bin2hex(random_bytes(4))); if (text($b['website']??'',100)!=='') respond(['ok'=>true,'referenceNumber'=>$reference,'status'=>'received'],201);
    $dir=__DIR__.'/uploads'; if (!is_dir($dir) && !mkdir($dir,0750,true)) fail('Dekont klasörü oluşturulamadı.',503);
    $stored=bin2hex(random_bytes(20)).'.'.$allowed[$mime]; if (!move_uploaded_file($file['tmp_name'],$dir.'/'.$stored)) fail('Dekont kaydedilemedi.',503);
    $q=$db->prepare('INSERT INTO donations (reference_number,first_name,last_name,phone,email,description,city,district,campaign,amount,payment_method,bank_account_code,bank_account_iban,transfer_amount,items_json,receipt_original_name,receipt_stored_name,receipt_mime,receipt_size,consent,status,created_at_ms) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    $q->execute([$reference,text($b['firstName'],80),text($b['lastName'],80),text($b['phone'],30),$email,text($b['description'],500),text($b['city']??'',100),text($b['district']??'',100),text($b['campaign'],500),$amount,'EFT_HAVALE',text($b['bankAccountCode'],10),text($b['bankAccountIban'],40),(float)$b['transferAmount'],json_encode($items,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES),text($file['name'],120),$stored,$mime,(int)$file['size'],1,'received',nowMs()]);
    respond(['ok'=>true,'referenceNumber'=>$reference,'status'=>'received'],201);
}

if ($path === '/exchange-rates') {
    method('GET'); $xml=@simplexml_load_file('https://www.tcmb.gov.tr/kurlar/today.xml'); if (!$xml) fail('Resmî döviz kurları alınamadı.',503);
    $rates=['TRY'=>1]; foreach (['USD','EUR','GBP'] as $code) { $nodes=$xml->xpath("//Currency[@CurrencyCode='$code']"); if (!$nodes) fail("$code kuru bulunamadı.",503); $unit=(float)$nodes[0]->Unit?:1; $rates[$code]=round((float)$nodes[0]->ForexSelling/$unit,4); }
    respond(['rates'=>$rates,'date'=>date('Y-m-d'),'source'=>'Türkiye Cumhuriyet Merkez Bankası','sourceUrl'=>'https://www.tcmb.gov.tr/kurlar/today.xml','rateType'=>'Döviz satış','fetchedAt'=>gmdate('c')]);
}

fail('Bulunamadı.',404);
