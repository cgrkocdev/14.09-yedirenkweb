import { cp, mkdir, readdir, rm } from "node:fs/promises";

async function removeAppleDouble(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.name.startsWith("._")) await rm(path, { recursive: true, force: true });
    else if (entry.isDirectory()) await removeAppleDouble(path);
  }
}

await mkdir("dist", { recursive: true });
await rm("dist/api", { recursive: true, force: true });
await cp("godaddy/api", "dist/api", { recursive: true });
// Hosting secrets remain on the server and must never be included in a release archive.
await rm("dist/api/config.php", { force: true });
await cp("godaddy/.htaccess", "dist/.htaccess");
await mkdir("dist/database", { recursive: true });
await cp("database/yedirenk_godaddy.sql", "dist/database/yedirenk_godaddy.sql");
// The water-well video was replaced by a still image. Keep the source files
// locally, but do not ship 14+ MB of unused media to shared hosting.
await rm("dist/assets/video", { recursive: true, force: true });
await removeAppleDouble("dist");
console.log("GoDaddy paketi dist/ klasöründe hazır.");
