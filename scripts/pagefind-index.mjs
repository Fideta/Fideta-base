// scripts/pagefind-index.mjs
import fs from "node:fs";
import path from "node:path";

// ---- 0) Préparatifs
const buildDir = path.resolve("./build");
const outDir = path.join(buildDir, "pagefind");

if (!fs.existsSync(buildDir)) {
  console.error("❌ Dossier 'build/' introuvable. Exécute d'abord `npm run build`.");
  process.exit(1);
}

// Liste rapide des HTML pour diagnostic
function listHtml(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) stack.push(p);
      else if (st.isFile() && name.toLowerCase().endsWith(".html")) out.push(p);
    }
  }
  return out;
}

const htmlFiles = listHtml(buildDir);
console.log(`📄 HTML détectés dans build/: ${htmlFiles.length}`);
if (htmlFiles.length === 0) {
  console.error("❌ Aucun HTML dans build/ → rien à indexer. Vérifie la phase de build.");
  process.exit(1);
}

// ---- 1) Import Pagefind (API Node)
const { createIndex } = await import("pagefind");

// ---- 2) Crée l'index (force FR pour éviter les index multiples)
const forceLanguage = process.env.PAGEFIND_FORCE_LANGUAGE || "fr";
const { index } = await createIndex({ forceLanguage });

// ---- 3) Ajoute tout le répertoire build/ (HTML uniquement)
const { page_count, errors } = await index.addDirectory({
  path: buildDir,
  glob: "**/*.html",
});

if (errors?.length) {
  console.warn("⚠️ Erreurs Pagefind:", errors.slice(0, 5));
  if (errors.length > 5) console.warn(`…et ${errors.length - 5} erreurs supplémentaires`);
}

console.log(`🔎 Pages ajoutées à l'index: ${page_count}`);

// ---- 4) Écrit l'index dans build/pagefind
fs.mkdirSync(outDir, { recursive: true });
await index.writeFiles({ outputPath: outDir });

// ---- 5) Vérifie manifest.json + affiche un mini-résumé
const manifestPath = path.join(outDir, "manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error("❌ Manifest absent après écriture:", manifestPath);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const langs = Object.keys(manifest.languages || {});
console.log(
  `✅ Index écrit: ${manifestPath}\n   pages=${manifest.pages} • langues=[${langs.join(", ") || "—"}]`
);
