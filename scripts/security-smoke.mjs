import worker from "./server.js";
const store = new Map();
const analytics = new Map();
const env = {
  ADMIN_PASSWORD: "correct-horse-battery-staple",
  ADMIN_SESSION_SECRET: "0123456789abcdef0123456789abcdef",
  YEDIRENK_CMS: {
    get: (k) => store.get(k) || null,
    put: (k, v) => store.set(k, v),
  },
  YEDIRENK_ANALYTICS: {
    get: (k, type) =>
      type === "json" ? JSON.parse(analytics.get(k)) : analytics.get(k),
    put: (k, v) => analytics.set(k, v),
    list: async () => ({
      keys: [...analytics.keys()].map((name) => ({ name })),
    }),
  },
  ASSETS: { fetch: () => new Response("ok") },
};
const call = (path, options = {}) =>
  worker.fetch(new Request(`https://example.org${path}`, options), env);
const results = [];
let r = await call("/api/admin/content");
results.push(["unauthorized-content", r.status === 401]);
r = await call("/api/admin/login", {
  method: "POST",
  headers: {
    Origin: "https://evil.example",
    "Content-Type": "application/json",
  },
  body: '{"password":"correct-horse-battery-staple"}',
});
results.push(["cross-origin-login-blocked", r.status === 403]);
r = await call("/api/admin/login", {
  method: "POST",
  headers: {
    Origin: "https://example.org",
    "Content-Type": "application/json",
  },
  body: '{"password":"wrong"}',
});
results.push(["wrong-password-blocked", r.status === 401]);
r = await call("/api/admin/login", {
  method: "POST",
  headers: {
    Origin: "https://example.org",
    "Content-Type": "application/json",
  },
  body: '{"password":"correct-horse-battery-staple"}',
});
const cookie = r.headers.get("set-cookie")?.split(";")[0];
results.push([
  "secure-login",
  r.status === 200 &&
    /HttpOnly/i.test(r.headers.get("set-cookie")) &&
    /SameSite=Strict/i.test(r.headers.get("set-cookie")),
]);
r = await call("/api/admin/content", { headers: { Cookie: cookie } });
results.push(["authenticated-content", r.status === 200]);
r = await call("/api/admin/content", {
  method: "PUT",
  headers: {
    Origin: "https://example.org",
    Cookie: cookie,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ campaigns: [], news: [], slides: [] }),
});
results.push(["validated-write", r.status === 200]);
r = await call("/api/analytics", {
  method: "POST",
  headers: {
    Origin: "https://example.org",
    "Content-Type": "application/json",
    "CF-Connecting-IP": "203.0.113.10",
  },
  body: JSON.stringify({
    event: "page_view",
    sessionId: "test-session",
    path: "/projeler",
    data: {},
  }),
});
results.push(["analytics-ingest", r.status === 202]);
r = await call("/api/admin/analytics", { headers: { Cookie: cookie } });
const report = await r.json();
results.push([
  "protected-analytics-read",
  r.status === 200 && report.events[0]?.ip === "203.0.113.10",
]);
console.log(
  results.map(([n, ok]) => `${n}: ${ok ? "PASS" : "FAIL"}`).join("\n"),
);
if (results.some(([, ok]) => !ok)) process.exitCode = 1;
