const SESSION_COOKIE = "yedirenk_admin";
const USER_COOKIE = "yedirenk_user";
const SESSION_TTL = 30 * 60;
const attempts = new Map();

export const TCMB_EXCHANGE_RATE_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";

const xmlValue = (block, tag) => {
  const match = block.match(new RegExp(`<${tag}>([^<]+)</${tag}>`, "i"));
  return match ? match[1].trim() : "";
};

const isoDateFromTcmb = (xml) => {
  const raw =
    xml.match(/<Tarih_Date\b[^>]*\bDate="([^"]+)"/i)?.[1] ||
    xml.match(/<Tarih_Date\b[^>]*\bTarih="([^"]+)"/i)?.[1] ||
    "";
  const parts = raw.split(/[./-]/).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part)))
    throw new Error("TCMB kur tarihi okunamadı.");
  const [first, second, third] = parts;
  const year = first > 1900 ? first : third;
  const month = first > 1900 ? second : second;
  const day = first > 1900 ? third : first;
  const date = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error("TCMB kur tarihi geçersiz.");
  return date;
};

export function parseTcmbExchangeRates(xml) {
  if (typeof xml !== "string" || !xml.includes("<Tarih_Date"))
    throw new Error("TCMB yanıtı geçersiz.");
  const rates = { TRY: 1 };
  for (const code of ["USD", "EUR", "GBP"]) {
    const block = xml.match(
      new RegExp(
        `<Currency\\b[^>]*(?:CurrencyCode|Kod)="${code}"[^>]*>[\\s\\S]*?</Currency>`,
        "i",
      ),
    )?.[0];
    if (!block) throw new Error(`${code} TCMB kur kaydında bulunamadı.`);
    const unit = Number(xmlValue(block, "Unit") || 1);
    const selling = Number(xmlValue(block, "ForexSelling"));
    const rate = selling / unit;
    if (!Number.isFinite(rate) || rate <= 0 || rate > 10_000)
      throw new Error(`${code} TCMB döviz satış kuru geçersiz.`);
    rates[code] = Math.round(rate * 10000) / 10000;
  }
  return {
    rates,
    date: isoDateFromTcmb(xml),
    source: "Türkiye Cumhuriyet Merkez Bankası",
    sourceUrl: TCMB_EXCHANGE_RATE_URL,
    rateType: "Döviz satış",
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchOfficialExchangeRates() {
  const response = await fetch(TCMB_EXCHANGE_RATE_URL, {
    headers: {
      Accept: "application/xml,text/xml;q=0.9,*/*;q=0.1",
      "User-Agent": "Yedirenk-Dernegi/1.0",
    },
  });
  if (!response.ok)
    throw new Error(`TCMB kur servisi ${response.status} durum kodu döndürdü.`);
  return parseTcmbExchangeRates(await response.text());
}

export async function exchangeRatesApi(request) {
  const reply = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control":
          status === 200
            ? "public, max-age=60, s-maxage=300, stale-while-revalidate=300"
            : "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  if (request.method !== "GET")
    return reply({ message: "Yöntem desteklenmiyor." }, 405);
  try {
    return reply(await fetchOfficialExchangeRates());
  } catch (error) {
    return reply(
      {
        message:
          error instanceof Error
            ? error.message
            : "Resmî döviz kurları alınamadı.",
      },
      503,
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/exchange-rates")
      return exchangeRatesApi(request);
    if (url.pathname === "/api/analytics") return analyticsIngest(request, env);
    if (url.pathname === "/api/public/applications")
      return applicationIngest(request, env);
    if (url.pathname === "/api/public/online-donations")
      return donationRequestApi(request, env);
    if (url.pathname === "/api/payment/albaraka/initialize")
      return albarakaInitializeApi(request, env);
    if (url.pathname === "/api/payment/albaraka/callback")
      return albarakaCallbackApi(request, env);
    if (url.pathname === "/api/public/content")
      return publicContentApi(request, env);
    if (url.pathname.startsWith("/api/account/"))
      return accountApi(request, env, url);
    if (url.pathname.startsWith("/api/admin/"))
      return adminApi(request, env, url);
    let response = await env.ASSETS.fetch(request);
    if (
      response.status === 404 &&
      request.headers.get("accept")?.includes("text/html")
    ) {
      url.pathname = "/index.html";
      response = await env.ASSETS.fetch(new Request(url, request));
    }
    return secure(response);
  },
};

export async function albarakaHash(value) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(String(value)),
  );
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

const albarakaConfig = (env) => ({
  merchantNo: String(env.ALBARAKA_MERCHANT_NO || "").trim(),
  terminalNo: String(env.ALBARAKA_TERMINAL_NO || "").trim(),
  posnetId: String(env.ALBARAKA_EPOS_NO || "").trim(),
  encKey: String(env.ALBARAKA_ENC_KEY || "").trim(),
  tdsUrl: String(env.ALBARAKA_TDS_URL || "https://epostest.albarakaturk.com.tr/ALBSecurePaymentUI/SecureProcess/SecureVerification.aspx").trim(),
  serviceUrl: String(env.ALBARAKA_SERVICE_URL || "https://epostest.albarakaturk.com.tr/ALBMerchantService/MerchantJSONAPI.svc").replace(/\/$/, ""),
  returnUrl: String(env.ALBARAKA_RETURN_URL || "").trim(),
});

const validAlbarakaConfig = (config) =>
  /^\d{10}$/.test(config.merchantNo) &&
  /^\d{8}$/.test(config.terminalNo) &&
  /^\d{16}$/.test(config.posnetId) &&
  config.encKey.length >= 8 &&
  /^https:\/\//i.test(config.tdsUrl) &&
  /^https:\/\//i.test(config.serviceUrl);

const paymentReply = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });

export async function albarakaInitializeApi(request, env) {
  if (request.method !== "POST") return paymentReply({ message: "Yöntem desteklenmiyor." }, 405);
  if (!sameOrigin(request)) return paymentReply({ message: "Geçersiz kaynak." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 30000)
    return paymentReply({ message: "İstek çok büyük." }, 413);
  const config = albarakaConfig(env);
  if (!validAlbarakaConfig(config))
    return paymentReply({ message: "Albaraka POS bilgileri yapılandırılmamış." }, 503);
  let body;
  try { body = await request.json(); } catch { return paymentReply({ message: "Ödeme bilgileri okunamadı." }, 400); }
  const card = body.card || {};
  const cardNo = String(card.number || "").replace(/\D/g, "");
  const cvv = String(card.cvv || "").replace(/\D/g, "");
  const expireDate = String(card.expiry || "").replace(/\D/g, "");
  const holderName = String(card.holderName || "").trim().slice(0, 50);
  const amount = Math.round(Number(body.amount) * 100);
  if (!/^\d{16,19}$/.test(cardNo) || !/^\d{3,4}$/.test(cvv) || !/^\d{4}$/.test(expireDate) || !holderName || !Number.isSafeInteger(amount) || amount < 1 || amount > 1_000_000_000 || body.consent !== true)
    return paymentReply({ message: "Kart ve bağış bilgilerini kontrol edin." }, 400);
  const store = env.YEDIRENK_DONATIONS || env.YEDIRENK_APPLICATIONS || env.YEDIRENK_CMS;
  if (!store) return paymentReply({ message: "Ödeme kayıt servisi yapılandırılmamış." }, 503);
  const orderId = `YD${Date.now().toString(36).toUpperCase().padStart(9, "0").slice(-9)}${crypto.randomUUID().replaceAll("-", "").slice(0, 9).toUpperCase()}`;
  const origin = new URL(request.url).origin;
  const returnUrl = config.returnUrl || `${origin}/api/payment/albaraka/callback`;
  if (!/^https:\/\//i.test(returnUrl)) return paymentReply({ message: "Banka dönüş adresi HTTPS olmalıdır." }, 503);
  const mac = await albarakaHash(`${config.merchantNo}${config.terminalNo}${cardNo}${cvv}${expireDate}${amount}${config.encKey}`);
  const pending = {
    orderId, amount, currencyCode: "TL", installmentCount: 0,
    donor: { firstName: String(body.firstName || "").slice(0, 80), lastName: String(body.lastName || "").slice(0, 80), phone: String(body.phone || "").slice(0, 30), email: String(body.email || "").slice(0, 254), city: String(body.city || "").slice(0, 100), district: String(body.district || "").slice(0, 100), description: String(body.description || "").slice(0, 500) },
    campaign: String(body.campaign || "").slice(0, 500), items: Array.isArray(body.items) ? body.items.slice(0, 30) : [], createdAt: Date.now(), status: "3d_pending",
  };
  await store.put(`payment-pending:${orderId}`, JSON.stringify(pending), { expirationTtl: 3600 });
  return paymentReply({
    orderId, action: config.tdsUrl,
    fields: {
      PosnetID: config.posnetId, MerchantNo: config.merchantNo, TerminalNo: config.terminalNo,
      OrderId: orderId, TransactionType: "Sale", CardNo: cardNo, ExpiredDate: expireDate,
      Cvv: cvv, CardHolderName: holderName, Amount: amount, InstallmentCount: "0",
      MerchantReturnURL: returnUrl, Language: "tr", CurrencyCode: "TL", Mac: mac,
      MacParams: "MerchantNo:TerminalNo:CardNo:Cvc2:ExpireDate:Amount",
      UseJokerVadaa: "0", KOICode: "", OpenNewWindow: "0", UseOOS: "0",
      TxnState: "INITIAL", VftCode: "", gsmNo: "", packetCode: "",
    },
  });
}

const callbackValue = (form, name) => {
  const key = [...form.keys()].find((item) => item.toLowerCase() === name.toLowerCase());
  return key ? String(form.get(key) || "") : "";
};

const paymentResultPage = (ok, message, orderId = "") => new Response(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Ödeme Sonucu</title><style>body{font-family:Arial;background:#f4f8f8;color:#123d54;display:grid;place-items:center;min-height:100vh;margin:0}.box{background:#fff;padding:38px;border-radius:18px;box-shadow:0 12px 40px #1232;text-align:center;max-width:520px}h1{color:${ok ? "#079b91" : "#b42318"}}a{display:inline-block;margin-top:18px;padding:12px 22px;background:#123d54;color:#fff;text-decoration:none;border-radius:9px}</style></head><body><main class="box"><h1>${ok ? "Ödeme başarılı" : "Ödeme tamamlanamadı"}</h1><p>${String(message).replace(/[<>&"]/g, "")}</p>${orderId ? `<b>Sipariş No: ${orderId}</b>` : ""}<br><a href="/">Ana sayfaya dön</a></main></body></html>`, { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });

export async function albarakaCallbackApi(request, env) {
  if (request.method !== "POST") return paymentResultPage(false, "Geçersiz dönüş yöntemi.");
  const config = albarakaConfig(env);
  if (!validAlbarakaConfig(config)) return paymentResultPage(false, "POS yapılandırması eksik.");
  let form;
  try { form = await request.formData(); } catch { return paymentResultPage(false, "Banka yanıtı okunamadı."); }
  const orderId = callbackValue(form, "OrderId");
  const mdStatus = callbackValue(form, "MdStatus");
  const eci = callbackValue(form, "ECI");
  const cavv = callbackValue(form, "CAVV");
  const mdError = callbackValue(form, "MdErrorMessage");
  const md = callbackValue(form, "MD");
  const secureTransactionId = callbackValue(form, "SecureTransactionId");
  const receivedMac = callbackValue(form, "Mac");
  const verificationMac = await albarakaHash(`${eci}${cavv}${mdStatus}${mdError}${md}${secureTransactionId}${config.encKey}`);
  if (!receivedMac || !(await secureEqual(receivedMac, verificationMac))) return paymentResultPage(false, "Banka yanıtı doğrulanamadı.", orderId);
  if (mdStatus !== "1") return paymentResultPage(false, `3D doğrulama başarısız: ${mdError || mdStatus}`, orderId);
  const store = env.YEDIRENK_DONATIONS || env.YEDIRENK_APPLICATIONS || env.YEDIRENK_CMS;
  const pending = store && orderId ? await store.get(`payment-pending:${orderId}`, "json") : null;
  if (!pending || Date.now() - Number(pending.createdAt) > 3600000) return paymentResultPage(false, "Sipariş bulunamadı veya süresi doldu.", orderId);
  const saleMac = await albarakaHash(`${config.merchantNo}${config.terminalNo}${secureTransactionId}${cavv}${eci}${mdStatus}${config.encKey}`);
  const saleBody = { ApiType: "JSON", ApiVersion: "V100", MerchantNo: config.merchantNo, TerminalNo: config.terminalNo, PaymentInstrumentType: "CARD", IsEncrypted: "N", IsTDSecureMerchant: "Y", IsMailOrder: "N", ThreeDSecureData: { SecureTransactionId: secureTransactionId, CavvData: cavv, Eci: eci, MdStatus: 1, MD: md }, MAC: saleMac, MACParams: "MerchantNo:TerminalNo:SecureTransactionId:CavvData:Eci:MdStatus", Amount: pending.amount, CurrencyCode: pending.currencyCode, PointAmount: 0, OrderId: orderId, InstallmentCount: pending.installmentCount };
  let sale;
  try {
    const correlationId = `${orderId.slice(0, 19)}S`;
    const response = await fetch(`${config.serviceUrl}/Sale`, { method: "POST", headers: { "Content-Type": "application/json; charset=UTF-8", Accept: "application/json", "X-MERCHANT-ID": config.merchantNo, "X-TERMINAL-ID": config.terminalNo, "X-POSNET-ID": config.posnetId, "X-CORRELATION-ID": correlationId }, body: JSON.stringify(saleBody) });
    sale = await response.json();
    if (!response.ok) throw new Error("Banka servisi yanıt vermedi.");
  } catch { return paymentResultPage(false, "Satış işlemi banka servisinde tamamlanamadı.", orderId); }
  const responseCode = String(sale?.ServiceResponseData?.ResponseCode || "");
  if (!["00", "0000"].includes(responseCode)) return paymentResultPage(false, sale?.ServiceResponseData?.ResponseDescription || `Banka hata kodu: ${responseCode}`, orderId);
  await store.put(`donation:${Date.now()}:${orderId}`, JSON.stringify({ ...pending, status: "paid", paidAt: Date.now(), referenceNumber: sale.ReferenceCode || orderId, authCode: sale.AuthCode || "", bankResponseCode: responseCode }));
  await store.delete(`payment-pending:${orderId}`);
  return paymentResultPage(true, "Bağışınız güvenli şekilde alındı. Teşekkür ederiz.", orderId);
}

async function publicContentApi(request, env) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff",
  };
  if (request.method !== "GET")
    return new Response(JSON.stringify({ message: "Yöntem desteklenmiyor." }), {
      status: 405,
      headers,
    });
  if (!env.YEDIRENK_CMS)
    return new Response(JSON.stringify({ content: null }), { headers });
  const data = await env.YEDIRENK_CMS.get("content");
  return new Response(JSON.stringify({ content: data ? JSON.parse(data) : null }), {
    headers,
  });
}

export async function donationRequestApi(request, env) {
  const reply = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  if (request.method !== "POST")
    return reply({ message: "Yöntem desteklenmiyor." }, 405);
  if (!sameOrigin(request)) return reply({ message: "Geçersiz kaynak." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 9_000_000)
    return reply({ message: "Bağış isteği çok büyük." }, 413);
  let body;
  let receiptUpload = null;
  try {
    if ((request.headers.get("content-type") || "").includes("multipart/form-data")) {
      const formData = await request.formData();
      body = JSON.parse(String(formData.get("payload") || "{}"));
      const file = formData.get("receipt");
      if (file && typeof file.arrayBuffer === "function") {
        if (file.size < 1 || file.size > 8 * 1024 * 1024)
          return reply({ message: "Dekont dosyası en fazla 8 MB olabilir." }, 413);
        if (![
          "application/pdf",
          "image/jpeg",
          "image/png",
        ].includes(file.type))
          return reply({ message: "Dekont biçimi desteklenmiyor." }, 415);
        receiptUpload = {
          name: String(file.name || "dekont").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120),
          type: file.type,
          size: file.size,
          data: await file.arrayBuffer(),
        };
      }
    } else {
      body = await request.json();
    }
  } catch {
    return reply({ message: "Bağış bilgileri okunamadı." }, 400);
  }
  const amount = Number(body.amount);
  const clean = {
    firstName: String(body.firstName || "").trim().slice(0, 80),
    lastName: String(body.lastName || "").trim().slice(0, 80),
    phone: String(body.phone || "").trim().slice(0, 30),
    email: String(body.email || "").trim().toLowerCase().slice(0, 254),
    description: String(body.description || "").trim().slice(0, 500),
    city: String(body.city || "").trim().slice(0, 100),
    district: String(body.district || "").trim().slice(0, 100),
    campaign: String(body.campaign || "").trim().slice(0, 500),
    amount,
    paymentMethod: String(body.paymentMethod || "").slice(0, 40),
    bankAccountCode: String(body.bankAccountCode || "").slice(0, 10),
    bankAccountIban: String(body.bankAccountIban || "").slice(0, 40),
    transferAmount: Number(body.transferAmount),
    receipt: receiptUpload
      ? {
          name: receiptUpload.name,
          type: receiptUpload.type,
          size: receiptUpload.size,
        }
      : null,
    consent: body.consent === true,
    items: Array.isArray(body.items)
      ? body.items.slice(0, 30).map((item) => ({
          campaignCode: String(item?.campaignCode || "").slice(0, 80),
          donationTypeCode: String(item?.donationTypeCode || "").slice(0, 80),
          donationGroupCode: String(item?.donationGroupCode || "").slice(0, 80),
          title: String(item?.title || "").slice(0, 160),
          quantity: Math.max(1, Math.min(1000, Number(item?.quantity) || 1)),
          unitPrice: Math.max(0, Number(item?.unitPrice) || 0),
        }))
      : [],
    createdAt: Date.now(),
    status: "received",
  };
  if (
    !clean.firstName ||
    !clean.lastName ||
    !clean.phone ||
    !/^\S+@\S+\.\S+$/.test(clean.email) ||
    !clean.description ||
    !clean.campaign ||
    !Number.isFinite(clean.amount) ||
    clean.amount < 1 ||
    clean.amount > 10_000_000 ||
    !clean.consent ||
    clean.items.length === 0 ||
    clean.paymentMethod !== "EFT_HAVALE" ||
    !["TRY", "USD", "EUR"].includes(clean.bankAccountCode) ||
    !clean.bankAccountIban ||
    !Number.isFinite(clean.transferAmount) ||
    clean.transferAmount <= 0 ||
    !receiptUpload
  )
    return reply({ message: "Bağış bilgilerini kontrol edin." }, 400);

  const referenceNumber = `YD-${new Date(clean.createdAt)
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  if (String(body.website || "").trim())
    return reply({ ok: true, referenceNumber, status: "received" }, 201);

  const store =
    env.YEDIRENK_DONATIONS || env.YEDIRENK_APPLICATIONS || env.YEDIRENK_CMS;
  if (!store)
    return reply({ message: "Bağış kayıt servisi yapılandırılmamış." }, 503);
  const receiptKey = `donation-receipt:${clean.createdAt}:${referenceNumber}`;
  await store.put(receiptKey, receiptUpload.data, {
    metadata: {
      name: receiptUpload.name,
      type: receiptUpload.type,
      size: receiptUpload.size,
    },
  });
  await store.put(
    `donation:${clean.createdAt}:${referenceNumber}`,
    JSON.stringify({ ...clean, receiptKey, referenceNumber }),
  );
  return reply({ ok: true, referenceNumber, status: "received" }, 201);
}

async function applicationIngest(request, env) {
  const reply = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  if (request.method !== "POST")
    return reply({ message: "Yöntem desteklenmiyor." }, 405);
  if (!sameOrigin(request)) return reply({ message: "Geçersiz kaynak." }, 403);
  if (!env.YEDIRENK_APPLICATIONS)
    return reply({ message: "Başvuru kayıt servisi yapılandırılmamış." }, 503);
  if (Number(request.headers.get("content-length") || 0) > 20_000)
    return reply({ message: "Başvuru çok büyük." }, 413);
  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ message: "Geçersiz başvuru." }, 400);
  }
  const clean = {
    type: String(body.type || "").slice(0, 40),
    name: String(body.name || "")
      .trim()
      .slice(0, 120),
    email: String(body.email || "")
      .trim()
      .toLowerCase()
      .slice(0, 160),
    phone: String(body.phone || "")
      .trim()
      .slice(0, 40),
    subject: String(body.subject || "")
      .trim()
      .slice(0, 120),
    message: String(body.message || "")
      .trim()
      .slice(0, 3000),
    consent: body.consent === true,
    createdAt: Date.now(),
  };
  if (
    !["volunteer", "sponsor", "contact"].includes(clean.type) ||
    !clean.name ||
    !/^\S+@\S+\.\S+$/.test(clean.email) ||
    !clean.phone ||
    !clean.message ||
    !clean.consent
  )
    return reply({ message: "Zorunlu başvuru bilgilerini kontrol edin." }, 400);
  const id = crypto.randomUUID();
  await env.YEDIRENK_APPLICATIONS.put(
    `application:${clean.createdAt}:${id}`,
    JSON.stringify({ ...clean, id }),
  );
  return reply({ ok: true, reference: id }, 201);
}

async function adminApi(request, env, url) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  const reply = (body, status = 200, extra = {}) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...headers, ...extra },
    });
  if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET)
    return reply(
      { message: "Admin servisi güvenli biçimde yapılandırılmamış." },
      503,
    );
  if (!sameOrigin(request))
    return reply({ message: "Geçersiz istek kaynağı." }, 403);
  if (url.pathname === "/api/admin/login" && request.method === "POST") {
    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      "unknown";
    const state = attempts.get(ip) || { count: 0, until: 0 };
    if (state.until > Date.now())
      return reply(
        { message: "Çok fazla deneme. Daha sonra tekrar deneyin." },
        429,
      );
    if (Number(request.headers.get("content-length") || 0) > 2048)
      return reply({ message: "İstek çok büyük." }, 413);
    let body;
    try {
      body = await request.json();
    } catch {
      return reply({ message: "Geçersiz istek." }, 400);
    }
    if (
      typeof body.password !== "string" ||
      body.password.length > 256 ||
      !(await secureEqual(body.password, env.ADMIN_PASSWORD))
    ) {
      state.count++;
      if (state.count >= 5) {
        state.count = 0;
        state.until = Date.now() + 15 * 60 * 1000;
      }
      attempts.set(ip, state);
      return reply({ message: "Giriş bilgileri geçersiz." }, 401);
    }
    attempts.delete(ip);
    const token = await createSession(env.ADMIN_SESSION_SECRET);
    return reply({ ok: true }, 200, {
      "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL}`,
    });
  }
  if (url.pathname === "/api/admin/logout" && request.method === "POST")
    return reply({ ok: true }, 200, {
      "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
    });
  if (!(await authenticated(request, env.ADMIN_SESSION_SECRET)))
    return reply({ message: "Yetkisiz erişim." }, 401);
  if (url.pathname === "/api/admin/session" && request.method === "GET")
    return reply({ authenticated: true });
  if (url.pathname === "/api/admin/analytics" && request.method === "GET") {
    if (!env.YEDIRENK_ANALYTICS)
      return reply({ message: "Analitik deposu bağlı değil." }, 503);
    const keys = [];
    let cursor;
    do {
      const listed = await env.YEDIRENK_ANALYTICS.list({
        prefix: "event:",
        limit: 1000,
        ...(cursor ? { cursor } : {}),
      });
      keys.push(...listed.keys);
      cursor = listed.list_complete ? undefined : listed.cursor;
    } while (cursor && keys.length < 10000);
    const events = (
      await Promise.all(
        keys.map((k) => env.YEDIRENK_ANALYTICS.get(k.name, "json")),
      )
    )
      .filter(Boolean)
      .sort((a, b) => b.timestamp - a.timestamp);
    return reply({ events, retentionDays: 30 });
  }
  if (url.pathname === "/api/admin/users" && request.method === "GET") {
    if (!env.YEDIRENK_USERS)
      return reply({ message: "Kullanıcı deposu bağlı değil." }, 503);
    const listed = await env.YEDIRENK_USERS.list({
      prefix: "user:",
      limit: 1000,
    });
    const users = (
      await Promise.all(
        listed.keys.map((k) => env.YEDIRENK_USERS.get(k.name, "json")),
      )
    )
      .filter(Boolean)
      .map(({ passwordHash, passwordSalt, ...u }) => u)
      .sort((a, b) => b.createdAt - a.createdAt);
    return reply({ users });
  }
  if (url.pathname === "/api/admin/content" && request.method === "GET") {
    if (!env.YEDIRENK_CMS)
      return reply({ message: "Kalıcı içerik deposu bağlı değil." }, 503);
    const data = await env.YEDIRENK_CMS.get("content");
    return reply({ content: data ? JSON.parse(data) : null });
  }
  if (url.pathname === "/api/admin/content" && request.method === "PUT") {
    if (!env.YEDIRENK_CMS)
      return reply({ message: "Kalıcı içerik deposu bağlı değil." }, 503);
    const length = Number(request.headers.get("content-length") || 0);
    if (length > 4_000_000)
      return reply({ message: "İçerik paketi çok büyük." }, 413);
    let data;
    try {
      data = await request.json();
    } catch {
      return reply({ message: "Geçersiz JSON." }, 400);
    }
    if (!validContent(data))
      return reply({ message: "İçerik şeması geçersiz." }, 400);
    await env.YEDIRENK_CMS.put("content", JSON.stringify(data));
    return reply({ ok: true });
  }
  return reply({ message: "Bulunamadı." }, 404);
}

async function accountApi(request, env, url) {
  const reply = (body, status = 200, extra = {}) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        ...extra,
      },
    });
  if (!sameOrigin(request))
    return reply({ message: "Geçersiz istek kaynağı." }, 403);
  if (!env.YEDIRENK_USERS || !env.USER_SESSION_SECRET)
    return reply({ message: "Hesap servisi yapılandırılmamış." }, 503);
  if (url.pathname === "/api/account/register" && request.method === "POST") {
    if (Number(request.headers.get("content-length") || 0) > 8192)
      return reply({ message: "İstek çok büyük." }, 413);
    let b;
    try {
      b = await request.json();
    } catch {
      return reply({ message: "Geçersiz istek." }, 400);
    }
    const email = String(b.email || "")
        .trim()
        .toLowerCase(),
      firstName = String(b.firstName || "").trim(),
      lastName = String(b.lastName || "").trim(),
      phone = String(b.phone || "").trim(),
      password = String(b.password || "");
    if (
      !/^\S+@\S+\.\S+$/.test(email) ||
      !firstName ||
      !lastName ||
      !phone ||
      password.length < 8 ||
      password.length > 128
    )
      return reply(
        {
          message: "Bilgileri kontrol edin; şifre en az 8 karakter olmalıdır.",
        },
        400,
      );
    const id = await emailKey(email);
    if (await env.YEDIRENK_USERS.get(`user:${id}`))
      return reply(
        { message: "Bu e-posta adresiyle daha önce kayıt olunmuş." },
        409,
      );
    const passwordSalt = crypto.randomUUID(),
      passwordHash = await passwordDigest(password, passwordSalt);
    const user = {
      id,
      email,
      firstName: firstName.slice(0, 80),
      lastName: lastName.slice(0, 80),
      phone: phone.slice(0, 30),
      passwordSalt,
      passwordHash,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      active: true,
    };
    await env.YEDIRENK_USERS.put(`user:${id}`, JSON.stringify(user));
    const token = await createUserSession(env.USER_SESSION_SECRET, user);
    return reply({ user: publicUser(user) }, 201, {
      "Set-Cookie": userCookie(token),
    });
  }
  if (url.pathname === "/api/account/login" && request.method === "POST") {
    let b;
    try {
      b = await request.json();
    } catch {
      return reply({ message: "Geçersiz istek." }, 400);
    }
    const email = String(b.email || "")
        .trim()
        .toLowerCase(),
      password = String(b.password || "");
    const id = await emailKey(email),
      user = await env.YEDIRENK_USERS.get(`user:${id}`, "json");
    if (
      !user ||
      !user.active ||
      !(await secureEqual(
        await passwordDigest(password, user.passwordSalt),
        user.passwordHash,
      ))
    )
      return reply({ message: "E-posta veya şifre hatalı." }, 401);
    user.lastLoginAt = Date.now();
    await env.YEDIRENK_USERS.put(`user:${id}`, JSON.stringify(user));
    const token = await createUserSession(env.USER_SESSION_SECRET, user);
    return reply({ user: publicUser(user) }, 200, {
      "Set-Cookie": userCookie(token),
    });
  }
  if (url.pathname === "/api/account/logout" && request.method === "POST")
    return reply({ ok: true }, 200, {
      "Set-Cookie": `${USER_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    });
  if (url.pathname === "/api/account/me" && request.method === "GET") {
    const user = await currentUser(request, env);
    return user
      ? reply({ user })
      : reply({ message: "Oturum bulunamadı." }, 401);
  }
  return reply({ message: "Bulunamadı." }, 404);
}
function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    active: u.active,
  };
}
async function emailKey(email) {
  return [...(await digest(email))]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
async function passwordDigest(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: new TextEncoder().encode(salt),
      iterations: 120000,
    },
    key,
    256,
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}
async function createUserSession(secret, user) {
  const payload = btoa(
    JSON.stringify({
      id: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 7 * 86400,
    }),
  )
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return `${payload}.${await sign(payload, secret)}`;
}
function userCookie(token) {
  return `${USER_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 86400}`;
}
async function currentUser(request, env) {
  const token = (request.headers.get("Cookie") || "")
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith(`${USER_COOKIE}=`))
    ?.slice(USER_COOKIE.length + 1);
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (
    !payload ||
    !sig ||
    !(await secureEqual(sig, await sign(payload, env.USER_SESSION_SECRET)))
  )
    return null;
  try {
    const data = JSON.parse(
      atob(payload.replaceAll("-", "+").replaceAll("_", "/")),
    );
    if (data.exp < Date.now() / 1000) return null;
    const user = await env.YEDIRENK_USERS.get(`user:${data.id}`, "json");
    return user && user.active ? publicUser(user) : null;
  } catch {
    return null;
  }
}

async function analyticsIngest(request, env) {
  const reply = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  if (request.method !== "POST")
    return reply({ message: "Yöntem desteklenmiyor." }, 405);
  if (!sameOrigin(request)) return reply({ message: "Geçersiz kaynak." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 8192)
    return reply({ message: "İstek çok büyük." }, 413);
  let b;
  try {
    b = await request.json();
  } catch {
    return reply({ message: "Geçersiz istek." }, 400);
  }
  const allowed = new Set([
    "consent_accepted",
    "page_view",
    "page_duration",
    "click",
    "cart_add",
    "checkout_start",
    "donation_success",
  ]);
  if (
    !allowed.has(b.event) ||
    typeof b.sessionId !== "string" ||
    b.sessionId.length > 80
  )
    return reply({ message: "Geçersiz olay." }, 400);
  const event = {
    event: b.event,
    sessionId: b.sessionId,
    path: String(b.path || "/").slice(0, 300),
    referrer: String(b.referrer || "").slice(0, 500),
    data: safeAnalyticsData(b.data),
    ip: (
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      "unknown"
    )
      .split(",")[0]
      .trim()
      .slice(0, 64),
    userAgent: String(request.headers.get("User-Agent") || "").slice(0, 300),
    country: String(request.headers.get("CF-IPCountry") || "").slice(0, 12),
    city: String(request.headers.get("CF-IPCity") || "").slice(0, 100),
    timestamp: Date.now(),
  };
  const deliveries = [];
  if (env.YEDIRENK_ANALYTICS)
    deliveries.push(
      env.YEDIRENK_ANALYTICS.put(
        `event:${event.timestamp}:${crypto.randomUUID()}`,
        JSON.stringify(event),
        { expirationTtl: 30 * 86400 },
      ),
    );
  if (env.META_ACCESS_TOKEN)
    deliveries.push(sendMetaConversionEvent(event, request, env));
  await Promise.allSettled(deliveries);
  return reply({ ok: true }, 202);
}

async function sendMetaConversionEvent(event, request, env) {
  const eventNames = {
    cart_add: "AddToCart",
    checkout_start: "InitiateCheckout",
    donation_success: "Purchase",
  };
  const eventName = eventNames[event.event];
  if (!eventName) return;
  const pixelId = String(env.META_PIXEL_ID || "2840175163017546").trim();
  const accessToken = String(env.META_ACCESS_TOKEN || "").trim();
  if (!/^\d{5,30}$/.test(pixelId) || !accessToken) return;
  const sourceUrl = new URL(event.path || "/", request.url).href;
  const customData = {};
  const amount = Number(event.data?.amount);
  if (Number.isFinite(amount) && amount > 0) {
    customData.value = amount;
    customData.currency = "TRY";
  }
  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(event.timestamp / 1000),
        event_source_url: sourceUrl,
        action_source: "website",
        event_id:
          typeof event.data?.metaEventId === "string" &&
          /^[a-zA-Z0-9:._-]{1,120}$/.test(event.data.metaEventId)
            ? event.data.metaEventId
            : `${event.sessionId}:${event.event}:${event.timestamp}`,
        user_data: {
          client_ip_address: event.ip,
          client_user_agent: event.userAgent,
        },
        ...(Object.keys(customData).length ? { custom_data: customData } : {}),
      },
    ],
    access_token: accessToken,
  };
  const testEventCode = String(env.META_TEST_EVENT_CODE || "").trim();
  if (testEventCode) payload.test_event_code = testEventCode;
  const response = await fetch(
    `https://graph.facebook.com/${encodeURIComponent(pixelId)}/events`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) throw new Error(`Meta CAPI request failed: ${response.status}`);
}
function safeAnalyticsData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const out = {};
  for (const [k, v] of Object.entries(data).slice(0, 20)) {
    if (typeof v === "string") out[k] = v.slice(0, 300);
    else if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (Array.isArray(v))
      out[k] = v.slice(0, 20).map((x) => String(x).slice(0, 100));
  }
  return out;
}

function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return request.method === "GET";
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
function validContent(x) {
  return (
    x &&
    typeof x === "object" &&
    !Array.isArray(x) &&
    Array.isArray(x.campaigns) &&
    x.campaigns.length <= 200 &&
    Array.isArray(x.news) &&
    x.news.length <= 1000 &&
    Array.isArray(x.slides) &&
    x.slides.length <= 100
  );
}
async function secureEqual(a, b) {
  const [x, y] = await Promise.all([digest(a), digest(b)]);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++)
    diff |= (x[i % x.length] || 0) ^ (y[i % y.length] || 0);
  return diff === 0;
}
async function digest(v) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v)),
  );
}
async function createSession(secret) {
  const payload = btoa(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL,
      nonce: crypto.randomUUID(),
    }),
  )
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return `${payload}.${await sign(payload, secret)}`;
}
async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)),
  );
  return btoa(String.fromCharCode(...sig))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}
async function authenticated(request, secret) {
  const token = (request.headers.get("Cookie") || "")
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (
    !payload ||
    !sig ||
    !(await secureEqual(sig, await sign(payload, secret)))
  )
    return false;
  try {
    const normalized = payload.replaceAll("-", "+").replaceAll("_", "/");
    const data = JSON.parse(atob(normalized));
    return Number(data.exp) > Date.now() / 1000;
  } catch {
    return false;
  }
}

function secure(response) {
  const r = new Response(response.body, response);
  r.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self' https://epostest.albarakaturk.com.tr https://epos.albarakaturk.com.tr; frame-ancestors 'none'; upgrade-insecure-requests",
  );
  r.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  r.headers.set("X-Content-Type-Options", "nosniff");
  r.headers.set("X-Frame-Options", "DENY");
  r.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  r.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  r.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  r.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return r;
}
