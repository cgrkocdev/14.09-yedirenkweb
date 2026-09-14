import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const extensions = new Set([".js", ".jsx", ".css", ".html", ".json"]);
const references = new Set();

async function files(path) {
  const info = await stat(path);
  if (info.isFile()) return [path];
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => files(join(path, entry.name))))).flat();
}

for (const root of ["src", "index.html"]) {
  for (const file of await files(root)) {
    if (!extensions.has(extname(file))) continue;
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(/["'`](\/(?:assets|fonts)\/[^"'`?#]+)["'`]/g)) {
      references.add(match[1]);
    }
  }
}

const missing = [];
for (const reference of [...references].sort()) {
  try {
    if ((await stat(join("public", reference.slice(1)))).size === 0) missing.push(`${reference} (boş dosya)`);
  } catch {
    missing.push(reference);
  }
}

if (missing.length) {
  console.error(`Eksik görsel/font dosyaları:\n${missing.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}
console.log(`${references.size} görsel/font referansı doğrulandı.`);
