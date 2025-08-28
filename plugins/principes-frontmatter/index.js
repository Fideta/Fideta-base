const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = function principesFrontmatterPlugin(context, options) {
  return {
    name: "principes-frontmatter",

    async loadContent() {
      const docsDir = path.join(__dirname, "../../docs/principes");
      const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".md") || f.endsWith(".mdx"));

      const docsData = files.map(file => {
        const fullPath = path.join(docsDir, file);
        const source = fs.readFileSync(fullPath, "utf-8");
        const { data } = matter(source);

        // Récupération de la date de dernière modification
        const stats = fs.statSync(fullPath);
        const lastUpdatedAt = stats.mtime.toISOString();

        return {
          id: file.replace(/\.(md|mdx)$/, ""),
          title: data.title || file.replace(/\.(md|mdx)$/, ""),
          slug: `/docs/principes/${file.replace(/\.(md|mdx)$/, "")}`,
          icon: data.icon || "📦",
          categories: data.categories || [],
          synopsis: data.synopsis || "",
          synonyms: data.synonyms || [],
          popular: !!data.popular, // true si défini dans frontmatter
          lastUpdatedAt,
        };
      });

      return docsData;
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
};
