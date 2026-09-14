<?php
declare(strict_types=1);

// Bu dosyayı config.php olarak kopyalayın ve GoDaddy cPanel bilgilerinizle doldurun.
// config.php Git tarafından izlenmez ve web üzerinden erişime kapalıdır.
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'CPANEL_VERITABANI_ADI',
    'db_user' => 'CPANEL_VERITABANI_KULLANICISI',
    'db_password' => 'GUCLU_VERITABANI_PAROLASI',
    'admin_password_hash' => 'pbkdf2_sha256$210000$BURAYA_SALT$BURAYA_HASH',
    'session_name' => 'yedirenk_session',
    'timezone' => 'Europe/Istanbul',
    'analytics_retention_days' => 30,
];
