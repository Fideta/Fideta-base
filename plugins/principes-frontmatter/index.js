const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = function principesFrontmatterPlugin(context, options) {
  return {
    name: "principes-frontmatter",

    async loadContent() {
      const docsDir = path.join(__dirname, "../../docs/principes");
      const files = fs
        .readdirSync(docsDir)
        .filter(f => f.endsWith(".md") || f.endsWith(".mdx"));

      const docsData = files.map(file => {
        const id = file.replace(/\.(md|mdx)$/, "");
        const fullPath = path.join(docsDir, file);
        const source = fs.readFileSync(fullPath, "utf-8");
        const { data } = matter(source);

        // Récupération de la date de dernière modification
        const stats = fs.statSync(fullPath);
        const lastUpdatedAt = stats.mtime.toISOString();

        return {
          id,
          title: data.title || id,
          slug: `/docs/principes/${id}`,
          // ✅ NOUVEAU : image du principe (avec fallback)
          image:
            (typeof data.image === "string" && data.image.trim()) ||
            "/img/principes/default-principe.jpg",
          // (on laisse icon tel quel, si tu veux t’en servir ailleurs)
          icon: data.icon || "📦",
          categories: data.categories || [],
          synopsis: data.synopsis || "",
          synonyms: data.synonyms || [],
          popular: !!data.popular,
          clinical: Array.isArray(data.clinical) ? data.clinical : [],
          lastUpdatedAt,
        };
      });

      return docsData;
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      // On garde exactement la même structure qu’avant (un simple tableau)
      setGlobalData(content);
    },
  };
};
