// src/pages/produits.jsx
import React, { useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./produits.module.css";

const ALL_CATEGORIES = [
  "Tous", "Sommeil", "Énergie",
  "Immunité", "Stress", "Beauté", "Articulations",
  "Magnésium", "Phytothérapie", "Zinc", "Microbiote intestinal"
];

export default function ProduitsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const [page, setPage] = useState(1);
  const perPage = 9;

  // On récupère les données du plugin "produits-frontmatter"
  // qui contient déjà un slug correct: /docs/produits/<id>
  const raw = usePluginData("produits-frontmatter");
  const produitsData = Array.isArray(raw) ? raw : (raw?.items || []);

  // Filtrage + tri
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (produitsData || [])
      .filter((it) => {
        const inCat = category === "Tous" || (it.categories || []).includes(category);
        if (!inCat) return false;
        if (!q) return true;
        const hay = `${it.title} ${it.synopsis} ${(it.synonyms || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (a.title || "").localeCompare(b.title || "", "fr"));
  }, [produitsData, query, category]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <Layout title="Produits analysés" description="Catalogue des produits analysés par Fideta">
      <div className={styles.pageWrapper}>
        {/* Bandeau haut */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1>Produits analysés</h1>
            <p className={styles.subtitle}>
              Parcourez les produits évalués par Fideta. Utilisez la recherche et les catégories.
            </p>
            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon} aria-hidden>🔎</span>
                <input
                  className={styles.searchInput}
                  placeholder="Rechercher un produit…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  aria-label="Rechercher un produit"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contenu */}
        <section className={styles.content}>
          {/* Sidebar catégories */}
          <aside className={styles.sidebar} aria-label="Catégories">
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

          {/* Grille de cartes */}
          <div className={styles.grid} role="list">
            {paginated.map((it) => (
              <article key={it.id} className={styles.card} role="listitem">
                <div className={styles.cardHeader}>
                  <img
                    src={it.image || "/img/default-product.jpg"}
                    alt={it.title}
                    className={styles.productImage}
                    loading="lazy"
                  />
                  <h3 className={styles.cardTitle}>{it.title}</h3>
                </div>
                <p className={styles.synopsis}>{it.synopsis}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.chips}>
                    {(it.categories || []).map((c) => (
                      <button
                        key={c}
                        className={styles.chip}
                        onClick={() => { setCategory(c); setPage(1); }}
                        title={`Filtrer par ${c}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {/* Comme pour Principes actifs, on pointe DIRECTEMENT vers it.slug */}
                  <Link className={styles.cta} to={it.slug}>
                    Voir la fiche
                  </Link>
                </div>
              </article>
            ))}

            {paginated.length === 0 && (
              <div className={styles.empty}>Aucun résultat. Modifiez votre recherche ou catégorie.</div>
            )}
          </div>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Pagination">
            <button className={styles.pageBtn} onClick={() => setPage(1)} disabled={page === 1}>«</button>
            <button className={styles.pageBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`${styles.pageBtn} ${page === i + 1 ? styles.pageBtnActive : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button className={styles.pageBtn} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
            <button className={styles.pageBtn} onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
          </nav>
        )}
      </div>
    </Layout>
  );
}
