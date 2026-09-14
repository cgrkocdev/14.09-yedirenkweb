import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
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
const systemChrome = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find(existsSync);
const browser = await chromium.launch({
  headless: true,
  ...(systemChrome ? { executablePath: systemChrome } : {}),
});
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
    ["0", "4800"],
    ["1", "6900"],
    ["2", "6900"],
    ["3", "6900"],
    ["4", "20000"],
  ]) {
    await qurbaniSelect.selectOption(option);
    if ((await amount.inputValue()) !== expected)
      failures.push({ interaction: "qurbani", option, expected });
  }
  await interaction.goto(origin + "/projeler/gida-kolisi");
  const foodProjectCards = interaction.locator(".project-variant-card");
  if ((await foodProjectCards.count()) !== 1)
    failures.push({
      interaction: "food-parcel-single-card",
      count: await foodProjectCards.count(),
    });
  if (
    (await foodProjectCards.locator("h3").first().textContent()).trim() !==
    "Gıda Kolisi"
  )
    failures.push({ interaction: "food-parcel-single-heading" });
  await interaction.goto(origin + "/projeler/gida-kolisi/detay");
  const foodCountrySelect = interaction
    .locator(".verenel-donation-form select")
    .first();
  const foodCountries = await foodCountrySelect.locator("option").allTextContents();
  if (
    !foodCountries.some((label) => label.includes("Afrika")) ||
    !foodCountries.some((label) => label.includes("Türkiye"))
  )
    failures.push({ interaction: "food-parcel-countries", foodCountries });
  await foodCountrySelect.selectOption("1");
  if ((await interaction.getByLabel("Bağış Tutarı").inputValue()) !== "2000")
    failures.push({ interaction: "food-parcel-price", expected: "2000" });
  await interaction.goto(origin + "/projeler/yetim-hamiligi/detay");
  const sponsorshipSelects = interaction.locator(
    ".verenel-donation-form select",
  );
  const sponsorshipCountries = await sponsorshipSelects
    .first()
    .locator("option")
    .allTextContents();
  if (
    !sponsorshipCountries.some((label) => label.includes("Afrika")) ||
    !sponsorshipCountries.some((label) => label.includes("Türkiye"))
  )
    failures.push({
      interaction: "orphan-sponsorship-countries",
      sponsorshipCountries,
    });
  await sponsorshipSelects.first().selectOption("2");
  await interaction
    .locator(".verenel-donation-form button")
    .filter({ hasText: "Yıllık" })
    .click();
  if ((await interaction.getByLabel("Bağış Tutarı").inputValue()) !== "12000")
    failures.push({ interaction: "orphan-sponsorship-period" });
  await interaction.locator(".donate-now").click();
  if (
    !(await interaction.locator(".summary-item b").first().textContent()).includes(
      "Yetim Hamiliği · Türkiye · Yıllık",
    )
  )
    failures.push({ interaction: "orphan-sponsorship-summary-region" });
  await interaction.goto(origin + "/projeler/yetim-giydirme/detay");
  const clothingCountrySelect = interaction
    .locator(".verenel-donation-form select")
    .first();
  const clothingCountries = await clothingCountrySelect
    .locator("option")
    .allTextContents();
  if (
    !clothingCountries.some((label) => label.includes("Afrika")) ||
    !clothingCountries.some((label) => label.includes("Türkiye"))
  )
    failures.push({ interaction: "orphan-clothing-countries", clothingCountries });
  await clothingCountrySelect.selectOption("2");
  if ((await interaction.getByLabel("Bağış Tutarı").inputValue()) !== "1500")
    failures.push({ interaction: "orphan-clothing-price", expected: "1500" });
  await interaction.locator(".donate-now").click();
  if (
    !(await interaction.locator(".summary-item b").first().textContent()).includes(
      "Yetim Giydirme · Türkiye",
    )
  )
    failures.push({ interaction: "orphan-clothing-summary-region" });
  await interaction.goto(origin + "/zekat-hesapla");
  await interaction.getByLabel("₺").fill("1000000");
  await interaction
    .getByRole("button", { name: /Zekâtımı Bağışla/ })
    .click();
  if ((await interaction.locator("form.checkout-layout").count()) !== 1)
    failures.push({ interaction: "direct-checkout" });
  if ((await interaction.locator("header .basket").count()) !== 0)
    failures.push({ interaction: "basket-removed" });
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
