import { spawn } from "node:child_process";
import { chromium } from "playwright";

const origin = "http://127.0.0.1:5173";
let server;

async function isRunning() {
  try {
    return (await fetch(origin)).ok;
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await isRunning()) return;
  server = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1"], {
    stdio: "ignore",
  });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (await isRunning()) return;
  }
  throw new Error("Geliştirme sunucusu başlatılamadı.");
}

const snapshot = (page) =>
  page.evaluate(() => {
    const main = document.querySelector("main");
    const clean = (value) => (value || "").replace(/\s+/g, " ").trim();
    return {
      h1: clean(main?.querySelector("h1")?.textContent),
      h2: clean(main?.querySelector("h2")?.textContent),
      text: clean(main?.innerText).slice(0, 320),
      media: [...(main?.querySelectorAll("img,video") || [])]
        .slice(0, 3)
        .map((element) => element.getAttribute("src")),
      amount: main?.querySelector('[aria-label="Bağış Tutarı"]')?.value || null,
    };
  });

async function collectRoutes(page) {
  const routes = new Set([
    "/",
    "/projeler",
    "/haberler",
    "/zekat-hesapla",
    "/arama?q=su",
    "/giris",
    "/kayit",
    "/iletisim",
  ]);
  for (const seed of ["/", "/projeler", "/haberler"]) {
    await page.goto(origin + seed);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    links
      .filter(
        (href) =>
          href &&
          !href.startsWith("/admin") &&
          !href.startsWith("//") &&
          !href.includes("#"),
      )
      .forEach((href) => routes.add(href));
  }
  await page.goto(origin + "/projeler");
  const projects = await page
    .locator(".project-card-title")
    .evaluateAll((items) => items.map((item) => item.getAttribute("href")));
  projects.filter(Boolean).forEach((href) => {
    routes.add(href);
    routes.add(`${href}/detay`);
  });
  return [...routes];
}

await ensureServer();
const browser = await chromium.launch({ headless: true });
try {
  const collector = await browser.newPage();
  const routes = await collectRoutes(collector);
  await collector.close();
  const failures = [];
  const pageErrors = [];

  for (const language of ["tr", "en", "ar"]) {
    const context = await browser.newContext();
    await context.addInitScript(
      (value) => localStorage.setItem("yedirenk-language", value),
      language,
    );
    const direct = await context.newPage();
    const transitioned = await context.newPage();
    transitioned.on("pageerror", (error) =>
      pageErrors.push(`${language}: ${error.message}`),
    );
    await transitioned.goto(origin);

    for (const route of routes) {
      await direct.goto(origin + route, { waitUntil: "domcontentloaded" });
      await transitioned.evaluate((nextRoute) => {
        history.pushState({}, "", nextRoute);
        dispatchEvent(new PopStateEvent("popstate"));
      }, route);
      await transitioned.waitForTimeout(100);
      const expected = await snapshot(direct);
      const actual = await snapshot(transitioned);
      if (JSON.stringify(expected) !== JSON.stringify(actual))
        failures.push({ language, route, expected, actual });
    }
    await context.close();
  }

  const interactionContext = await browser.newContext();
  const interaction = await interactionContext.newPage();
  interaction.on("pageerror", (error) =>
    pageErrors.push(`interaction: ${error.message}`),
  );
  await interaction.goto(origin + "/projeler/adak-akika-nafile-kurban/detay");
  const qurbaniSelect = interaction
    .locator(".verenel-donation-form select")
    .first();
  const amount = interaction.getByLabel("Bağış Tutarı");
  for (const [option, expected] of [
    ["0", "5200"],
    ["1", "5600"],
    ["2", "5400"],
    ["3", "4800"],
  ]) {
    await qurbaniSelect.selectOption(option);
    if ((await amount.inputValue()) !== expected)
      failures.push({ interaction: "qurbani", option, expected });
  }
  await interaction.goto(origin + "/projeler/yetim-hamiligi/detay");
  await interaction
    .locator(".verenel-donation-form select")
    .first()
    .selectOption("12");
  if ((await interaction.getByLabel("Bağış Tutarı").inputValue()) !== "12000")
    failures.push({ interaction: "orphan-sponsorship-months" });
  await interaction.goto(origin + "/zekat-hesapla");
  await interaction.getByLabel("Nakit ve banka varlıkları").fill("100000");
  await interaction
    .getByRole("button", { name: /Zekâtımı sepete ekle/ })
    .click();
  await interaction.getByRole("button", { name: "Kapat" }).click();
  await interaction.locator("header .logo").click();
  if ((await interaction.locator(".basket i").innerText()) !== "1")
    failures.push({ interaction: "cart-state" });
  await interactionContext.close();

  if (failures.length || pageErrors.length) {
    console.error(JSON.stringify({ failures, pageErrors }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(
      `Site tutarlılık testi başarılı: ${routes.length} rota × 3 dil = ${routes.length * 3} karşılaştırma.`,
    );
  }
} finally {
  await browser.close();
  server?.kill("SIGTERM");
}
