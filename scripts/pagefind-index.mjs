// scripts/pagefind-index.mjs
import fs from "node:fs";
import path from "node:path";

const buildDir = path.resolve("./build");
const targetDir = path.join(buildDir, "pagefind");

if (!fs.existsSync(buildDir)) {
  console.error("❌ 'build/' introuvable. Exécute d'abord `npm run build`.");
  process.exit(1);
}

// Liste rapide des HTML (diagnostic)
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
console.log(`📄 HTML détectés: ${htmlFiles.length}`);
if (htmlFiles.length === 0) {
  console.error("❌ Aucun HTML dans build/ → rien à indexer.");
  process.exit(1);
}

// Indexation via l’API Node
const { createIndex } = await import("pagefind");
const { index } = await createIndex({ forceLanguage: process.env.PAGEFIND_FORCE_LANGUAGE || "fr" });
const { page_count, errors } = await index.addDirectory({
  path: buildDir,
  glob: "**/*.html",
});
if (errors?.length) {
  console.warn("⚠️ Erreurs Pagefind:", errors.slice(0, 5));
  if (errors.length > 5) console.warn(`…+${errors.length - 5} erreurs`);
}
console.log(`🔎 Pages ajoutées: ${page_count}`);

// Écrit l'index dans build/pagefind
fs.mkdirSync(targetDir, { recursive: true });
await index.writeFiles({ outputPath: targetDir });

// ---- Vérification : Pagefind >=1.2 utilise "pagefind-entry.json"
const entryPath = path.join(targetDir, "pagefind-entry.json");
const legacyManifest = path.join(targetDir, "manifest.json");

// Si ni l'un ni l'autre → cherche ailleurs sous build/ puis reloge
function findFile(root, names = ["pagefind-entry.json", "manifest.json"]) {
  let found = null;
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        if (name === "node_modules" || name.startsWith(".")) continue;
        walk(p);
        if (found) return;
      } else if (st.isFile() && names.includes(name)) {
        if (p.includes(`${path.sep}pagefind${path.sep}`) || p.includes(`${path.sep}_pagefind${path.sep}`)) {
          found = p;
          return;
        }
      }
    }
  })(root);
  return found;
}

if (!fs.existsSync(entryPath) && !fs.existsSync(legacyManifest)) {
  console.warn("ℹ️ Fichiers d’index non trouvés dans build/pagefind, recherche sous build/ …");
  const found = findFile(buildDir);
  if (found) {
    const srcDir = path.dirname(found);
    console.log(`↪️ Index trouvé dans: ${srcDir}`);
    try {
      if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true, force: true });
      fs.renameSync(srcDir, targetDir);
      console.log(`✅ Déplacé ${srcDir} → ${targetDir}`);
    } catch (e) {
      console.warn("⚠️ renameSync a échoué, copie récursive…", e);
      function copyDir(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src)) {
          const s = path.join(src, entry);
          const d = path.join(dest, entry);
          const st = fs.statSync(s);
          if (st.isDirectory()) copyDir(s, d);
          else fs.copyFileSync(s, d);
        }
      }
      copyDir(srcDir, targetDir);
      console.log(`✅ Copié ${srcDir} → ${targetDir}`);
    }
  }
}

// Vérif finale (accepte nouveau ou ancien format)
if (!fs.existsSync(entryPath) && !fs.existsSync(legacyManifest)) {
  console.error("❌ Index introuvable dans build/pagefind (ni pagefind-entry.json ni manifest.json).");
  console.error("📁 Contenu build/pagefind:", fs.existsSync(targetDir) ? fs.readdirSync(targetDir) : "(absent)");
  process.exit(1);
}

console.log("✅ Index prêt dans build/pagefind :", fs.readdirSync(targetDir));
