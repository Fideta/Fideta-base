// plugins/produits-frontmatter/index.js
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function normalizeEAN(v) {
  const s = String(v).trim();
  // accepte EAN-8, UPC-A (12), EAN-13, et marge haute 14 si besoin
  return /^\d{8,14}$/.test(s) ? s : null;
}

module.exports = function produitsFrontmatterPlugin() {
  return {
    name: "produits-frontmatter",

    async loadContent() {
      const docsDir = path.join(__dirname, "../../docs/produits");
      if (!fs.existsSync(docsDir)) return [];

      const files = fs
        .readdirSync(docsDir)
        .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

      const docsData = files.map((file) => {
        const id = file.replace(/\.(md|mdx)$/, "");
        const fullPath = path.join(docsDir, file);
        const source = fs.readFileSync(fullPath, "utf-8");
        const { data } = matter(source);

        // ean peut être string/number OU tableau -> on normalise en array
        const raw = data?.ean ?? data?.eans ?? null;
        let eans = [];
        if (Array.isArray(raw)) {
          eans = raw.map(normalizeEAN).filter(Boolean);
        } else if (raw != null) {
          const one = normalizeEAN(raw);
          if (one) eans = [one];
        }

        const slug = data.slug || `/docs/produits/${id}`;
        const title = data.title || id;

        return {
          id,
          title,
          slug,
          ean: eans[0] || null, // compat : premier EAN
          eans,                  // nouveau : tous les EAN
          image: data.image || "/img/default-product.jpg",
          categories: data.categories || [],
          synopsis: data.synopsis || "",
          synonyms: data.synonyms || [],
          status: data.status || null,
          score: typeof data.score === "number" ? data.score : null,
          clinical: Array.isArray(data.clinical) ? data.clinical : [],
        };
      });

      return docsData;
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;

      const eanToPermalink = {};
      const duplicates = [];

      for (const doc of content) {
        const codes = (doc.eans && doc.eans.length ? doc.eans : (doc.ean ? [doc.ean] : []));
        for (const code of codes) {
          const prev = eanToPermalink[code];
          if (prev && prev !== doc.slug) {
            duplicates.push({ ean: code, a: prev, b: doc.slug });
          }
          eanToPermalink[code] = doc.slug;
        }
      }

      if (duplicates.length) {
        console.warn("[produits-frontmatter] EAN en double détecté(s):", duplicates);
        // Si tu veux bloquer la build :
        // throw new Error("EAN en double:\n" + duplicates.map(d => ` - ${d.ean}: ${d.a} <> ${d.b}`).join("\n"));
      }

      setGlobalData({
        items: content,   // tableau pour les pages qui listent
        eanToPermalink,   // index pour le scanner
      });
    },
  };
};
