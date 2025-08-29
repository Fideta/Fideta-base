// scripts/pagefind-index.mjs
import fs from "node:fs";
import path from "node:path";

const buildDir = path.resolve("./build");
const targetDir = path.join(buildDir, "pagefind");

if (!fs.existsSync(buildDir)) {
  console.error("❌ 'build/' introuvable. Exécute d'abord `npm run build`.");
  process.exit(1);
}

// Liste les HTML (diagnostic)
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

// ——— Pagefind (API Node)
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

// Tente d'écrire dans build/pagefind
fs.mkdirSync(targetDir, { recursive: true });
await index.writeFiles({ outputPath: targetDir });

// Vérifie si manifest est là ; sinon, cherche ailleurs sous build/
const manifestPath = path.join(targetDir, "manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.warn("ℹ️ manifest.json non trouvé dans build/pagefind. Recherche d'un index ailleurs…");

  // Recherche récursive d'un fichier 'manifest.json' sous build/
  let found = null;
  (function findManifest(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        findManifest(p);
        if (found) return;
      } else if (
        st.isFile() &&
        name === "manifest.json" &&
        p.includes(path.sep + "_pagefind" + path.sep)
      ) {
        found = p;
        return;
      }
    }
  })(buildDir);

  if (found) {
    const srcDir = path.dirname(found);           // …/_pagefind
    const srcRoot = path.dirname(srcDir);         // …/build
    const realSrc = path.join(srcRoot, "_pagefind");

    console.log(`↪️ Déplacement de ${realSrc} → ${targetDir}`);
    try {
      fs.rmSync(targetDir, { recursive: true, force: true });
      fs.renameSync(realSrc, targetDir);
    } catch (e) {
      console.warn("⚠️ renameSync a échoué, tentative de copie…", e);
      // fallback: copie récursive
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
      copyDir(realSrc, targetDir);
    }
  }
}

// Vérification finale
if (!fs.existsSync(manifestPath)) {
  console.error("❌ Manifest toujours absent:", manifestPath);
  console.error("Contenu de build/ :", fs.readdirSync(buildDir));
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const langs = Object.keys(manifest.languages || {});
console.log(`✅ Index prêt: ${manifestPath} • pages=${manifest.pages} • langues=[${langs.join(", ") || "—"}]`);
