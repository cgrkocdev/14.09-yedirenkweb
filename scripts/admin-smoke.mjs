import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const results = [];
async function login(page) {
  await page.goto("http://127.0.0.1:5173/admin");
  await page.getByLabel("Yönetici şifresi").fill("yedirenk2026");
  await page.getByRole("button", { name: "Giriş yap" }).click();
  await page.getByText("Değiştireceğiniz kelimeyi yazarak başlayın").waitFor();
}
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
try {
  await login(page);
  results.push(["desktop-login", true]);
  const finder = page.getByPlaceholder(
    "Değiştirmek istediğiniz kelimeyi yazın…",
  );
  await finder.fill("Kurban");
  await page.locator(".finder-results button").first().waitFor();
  results.push(["global-content-search", true]);
  await finder.fill("");
  await page.getByRole("button", { name: /Yazı Boyutları/ }).click();
  const size = page.getByLabel("Ana manşet başlığı değeri");
  await size.fill("60");
  results.push(["typography-update", (await size.inputValue()) === "60"]);
  await size.fill("54");
  await page.getByRole("button", { name: /Slider \/ Manşet/ }).click();
  const before = await page.locator(".admin-section").count();
  await page.getByRole("button", { name: "Yeni slider ekle" }).click();
  const card = page.locator(".admin-section").last();
  await card.getByLabel("Başlık").fill("Otomatik CRUD Slider");
  results.push([
    "slider-create-update",
    (await page.locator(".admin-section").count()) === before + 1 &&
      (await card.getByLabel("Başlık").inputValue()) === "Otomatik CRUD Slider",
  ]);
  page.once("dialog", (d) => d.accept());
  await card.locator(".delete").click();
  results.push([
    "slider-delete",
    (await page.locator(".admin-section").count()) === before,
  ]);
  await page.getByRole("button", { name: /Projeler/ }).click();
  results.push([
    "projects-manager",
    (await page.locator(".project-manager-layout").count()) === 1,
  ]);
  await page.getByRole("button", { name: /Haberler/ }).click();
  const nb = await page.locator(".admin-section").count();
  await page.getByRole("button", { name: "Yeni haber ekle" }).click();
  const nc = page.locator(".admin-section").last();
  await nc.getByLabel("Başlık").fill("Test Haberi");
  results.push([
    "news-create-update",
    (await nc.getByLabel("Başlık").inputValue()) === "Test Haberi",
  ]);
  page.once("dialog", (d) => d.accept());
  await nc.locator(".delete").click();
  results.push([
    "news-delete",
    (await page.locator(".admin-section").count()) === nb,
  ]);
  await page.getByRole("button", { name: /Diğer Sayfalar/ }).click();
  const pageCount = await page.locator(".page-editor").count();
  await page.locator(".page-editor").first().click();
  results.push(["all-pages-loaded", pageCount >= 43]);
  results.push([
    "page-editor",
    await page.getByLabel("Sayfa başlığı").first().isVisible(),
  ]);
  await page.getByRole("button", { name: /Ana Sayfa/ }).click();
  results.push([
    "home-editor",
    await page.getByText("Kurumsal tanıtım").isVisible(),
  ]);
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await login(mobile);
  results.push([
    "mobile-menu",
    await mobile.locator(".admin-menu").isVisible(),
  ]);
  await mobile.close();
  console.log(
    results.map(([n, ok]) => `${n}: ${ok ? "PASS" : "FAIL"}`).join("\n"),
  );
  if (results.some(([, ok]) => !ok)) process.exitCode = 1;
} finally {
  await browser.close();
}
