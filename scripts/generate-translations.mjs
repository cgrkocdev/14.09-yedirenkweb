import fs from "node:fs/promises";

const source = (
  await Promise.all(
    ["App.jsx", "siteData.js"].map((file) =>
      fs.readFile(new URL(`../src/${file}`, import.meta.url), "utf8"),
    ),
  )
).join("\n");
const strings = new Set();
for (const match of source.matchAll(/>([^<>{}]+)</g)) {
  const value = match[1].replace(/\s+/g, " ").trim();
  if (value.length > 1 && /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(value))
    strings.add(value);
}
for (const match of source.matchAll(/["'`]([^"'`\n]{2,900})["'`]/g)) {
  const value = match[1].replace(/\\n/g, "\n").trim();
  if (
    value.length > 1 &&
    /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(value) &&
    (/[\sÇĞİÖŞÜçğıöşü]/.test(value) || /^[A-ZÇĞİÖŞÜ]/.test(value)) &&
    !value.startsWith("/") &&
    !/^https?:/i.test(value) &&
    !value.includes("${") &&
    !value.includes("className")
  )
    strings.add(value);
}
const list = [...strings].filter((x) => x.length < 1000);
async function translate(text, target) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "tr");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      return data[0].map((x) => x[0]).join("");
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
}
async function build(target) {
  const result = {};
  let cursor = 0;
  const workers = Array.from({ length: 8 }, async () => {
    while (cursor < list.length) {
      const index = cursor++,
        original = list[index];
      try {
        result[original] = await translate(original, target);
      } catch {
        result[original] = original;
      }
      if (index % 50 === 0)
        process.stdout.write(`${target}: ${index}/${list.length}\n`);
    }
  });
  await Promise.all(workers);
  return Object.fromEntries(list.map((key) => [key, result[key]]));
}
const [en, ar] = await Promise.all([build("en"), build("ar")]);
await fs.writeFile(
  new URL("../src/translations.generated.json", import.meta.url),
  JSON.stringify({ en, ar }, null, 2) + "\n",
);
console.log(`Generated ${list.length} strings in English and Arabic.`);
