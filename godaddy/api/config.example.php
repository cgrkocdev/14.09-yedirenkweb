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
    // Albaraka Sanal POS: test bilgilerini canlıya çıkmadan önce banka değerleriyle değiştirin.
    'albaraka_merchant_no' => '',
    'albaraka_terminal_no' => '',
    'albaraka_epos_no' => '',
    'albaraka_enc_key' => '',
    'albaraka_tds_url' => 'https://epostest.albarakaturk.com.tr/ALBSecurePaymentUI/SecureProcess/SecureVerification.aspx',
    'albaraka_service_url' => 'https://epostest.albarakaturk.com.tr/ALBMerchantService/MerchantJSONAPI.svc',
    'albaraka_return_url' => 'https://www.yedirenkdernegi.org/api/payment/albaraka/callback',
];
