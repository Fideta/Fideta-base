// scripts/pagefind-index.mjs
import fs from "node:fs";
import path from "node:path";

const buildDir = path.resolve("./build");
const targetDir = path.join(buildDir, "pagefind");

if (!fs.existsSync(buildDir)) {
  console.error("❌ 'build/' introuvable. Exécute d'abord `npm run build`.");
  process.exit(1);
}

// 1) Lister les HTML (diagnostic)
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

// 2) Indexation via l’API Node
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

// 3) Écrire l’index (tentative directe dans build/pagefind)
fs.mkdirSync(targetDir, { recursive: true });
await index.writeFiles({ outputPath: targetDir });

// 4) Chercher le manifest n'importe où sous build/ (pagefind ou _pagefind)
function findManifest(root) {
  let found = null;
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        if (name === "node_modules" || name.startsWith(".")) continue;
        walk(p);
        if (found) return;
      } else if (st.isFile() && name === "manifest.json") {
        // On garde seulement si le chemin contient /pagefind/ ou /_pagefind/
        if (p.includes(`${path.sep}pagefind${path.sep}`) || p.includes(`${path.sep}_pagefind${path.sep}`)) {
          found = p;
          return;
        }
      }
    }
  })(root);
  return found;
}

let manifestPath = path.join(targetDir, "manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.warn("ℹ️ manifest.json absent dans build/pagefind, recherche sous build/ …");
  const found = findManifest(buildDir);
  if (found) {
    const srcDir = path.dirname(found); // dossier qui contient manifest.json
    console.log(`↪️ Index trouvé dans: ${srcDir}`);

    // Cas fréquent: build/pagefind/pagefind/* → on remonte au premier "pagefind" du chemin
    const parts = srcDir.split(path.sep);
    const lastIdx = parts.lastIndexOf("pagefind");
    const firstIdx = parts.indexOf("pagefind");
    const baseDir = path.join(...parts.slice(0, lastIdx + 1)); // jusqu'au dernier "pagefind"
    const realSrcDir = firstIdx !== lastIdx ? path.join(...parts.slice(0, lastIdx + 1)) : srcDir;

    // On déplace/copier-colle dans build/pagefind
    try {
      if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true, force: true });
      fs.renameSync(realSrcDir, targetDir);
      console.log(`✅ Déplacé ${realSrcDir} → ${targetDir}`);
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
      copyDir(realSrcDir, targetDir);
      console.log(`✅ Copié ${realSrcDir} → ${targetDir}`);
    }
    manifestPath = path.join(targetDir, "manifest.json");
  }
}

// 5) Vérification finale + résumé
if (!fs.existsSync(manifestPath)) {
  console.error("❌ Manifest toujours absent:", manifestPath);
  console.error("📁 Sous-dossiers build/:", fs.readdirSync(buildDir));
  if (fs.existsSync(targetDir)) {
    console.error("📁 Contenu build/pagefind:", fs.readdirSync(targetDir));
  }
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const langs = Object.keys(manifest.languages || {});
console.log(`✅ Index prêt: ${manifestPath} • pages=${manifest.pages} • langues=[${langs.join(", ") || "—"}]`);
