// src/pages/principes-actifs.jsx
import React, { useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./principes-actifs.module.css";

const ALL_CATEGORIES = [
  "Tous", "Vitamines", "Minéraux", "Acides gras", "Plantes",
  "Protéines", "Acides aminés", "Neuro-hormone"
];

export default function PrincipesActifsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const [page, setPage] = useState(1);
  const perPage = 9;

  // Récupération des données du plugin
  const pluginData = usePluginData("principes-frontmatter") || [];

  // Filtrage
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pluginData
      .filter((it) => {
        const inCat = category === "Tous" || it.categories.includes(category);
        if (!inCat) return false;
        if (!q) return true;
        const haystack = `${it.title} ${it.synopsis} ${(it.synonyms || []).join(" ")}`.toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => (a.title || "").localeCompare(b.title || "", "fr"));
  }, [pluginData, query, category]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <Layout title="Principes actifs" description="Catalogue des principes actifs">
      <div className={styles.pageWrapper}>
        
        {/* Bandeau haut */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1>Principes actifs</h1>
            <p className={styles.subtitle}>
              Explorez les ingrédients. Utilisez la recherche et les catégories.
            </p>
            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>🔎</span>
                <input
                  className={styles.searchInput}
                  placeholder="Rechercher…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contenu */}
        <section className={styles.content}>
          
        {/* Sidebar */}
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Catégories</h2>
            <nav className={styles.categoryList}>
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={cat === category ? styles.categoryItemActive : styles.categoryItem}
                  onClick={() => { setCategory(cat); setPage(1); }}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </aside>

          {/* Grille */}
          <div className={styles.grid}>
            {paginated.map((it) => (
              <article key={it.path} className={styles.card}>
                <div className={styles.cardHeader}>
                  <img
  src={it.image}
  alt={it.title}
  className={styles.thumb}
  width={28}
  height={28}
  loading="lazy"
/>

                  <h3 className={styles.cardTitle}>{it.title}</h3>
                </div>
                <p className={styles.synopsis}>{it.synopsis}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.chips}>
                    {it.categories.map((c) => (
                      <button
                        key={c}
                        className={styles.chip}
                        onClick={() => { setCategory(c); setPage(1); }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {/* Bouton cliquable vers la fiche */}
                  <Link
                    className={styles.cta}
                    to={it.slug}
                    style={{ zIndex: 9999, pointerEvents: "auto" }}
                  >
                    Voir la fiche
                  </Link>
                </div>
              </article>
            ))}

            {/* État vide */}
            {paginated.length === 0 && (
              <div className={styles.empty}>
                Aucun résultat. Modifiez votre recherche ou catégorie.
              </div>
            )}
          </div>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Pagination">
            <button
              className={styles.pageBtn}
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              «
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`${styles.pageBtn} ${page === i + 1 ? styles.pageBtnActive : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              »
            </button>
          </nav>
        )}
      </div>
    </Layout>
  );
}
