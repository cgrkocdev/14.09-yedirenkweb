const SESSION_COOKIE = "yedirenk_admin";
const USER_COOKIE = "yedirenk_user";
const SESSION_TTL = 30 * 60;
const attempts = new Map();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/analytics") return analyticsIngest(request, env);
    if (url.pathname === "/api/public/applications")
      return applicationIngest(request, env);
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
    const listed = await env.YEDIRENK_ANALYTICS.list({
      prefix: "event:",
      limit: 1000,
    });
    const events = (
      await Promise.all(
        listed.keys.map((k) => env.YEDIRENK_ANALYTICS.get(k.name, "json")),
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
  if (!env.YEDIRENK_ANALYTICS) return reply({ ok: true });
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
    timestamp: Date.now(),
  };
  await env.YEDIRENK_ANALYTICS.put(
    `event:${event.timestamp}:${crypto.randomUUID()}`,
    JSON.stringify(event),
    { expirationTtl: 30 * 86400 },
  );
  return reply({ ok: true }, 202);
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
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
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
