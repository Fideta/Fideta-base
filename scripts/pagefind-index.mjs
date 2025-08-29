// scripts/pagefind-index.mjs
import fs from "node:fs";
import path from "node:path";

// API Node officielle de Pagefind
const pagefind = await import("pagefind");

const buildDir = path.resolve("./build");
const outDir = path.join(buildDir, "pagefind");

if (!fs.existsSync(buildDir)) {
  console.error("❌ build/ introuvable. Lance d’abord `npm run build`.");
  process.exit(1);
}

console.log("🔎 Indexation Pagefind…");
const { index } = await pagefind.createIndex();

// Indexer tous les HTML générés par Docusaurus
const { page_count, errors } = await index.addDirectory({
  path: buildDir,
  glob: "**/*.html",
});
if (errors?.length) {
  console.warn("⚠️ Erreurs Pagefind:", errors);
}

// Écrire les fichiers d’index dans build/pagefind
await index.writeFiles({ outputPath: outDir });

if (!fs.existsSync(path.join(outDir, "manifest.json"))) {
  console.error("❌ Manifest absent:", path.join(outDir, "manifest.json"));
  process.exit(1);
}
console.log(`✅ Index écrit (${page_count} page(s)) dans ${outDir}`);
