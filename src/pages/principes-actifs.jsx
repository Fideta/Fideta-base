import React, { useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Head from "@docusaurus/Head";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./principes-actifs.module.css";

const PAGE_SIZE = 9;

// Normalisation simple pour la recherche (insensible aux accents/majuscules)
const norm = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export default function PrincipesActifs() {
  const rawData = usePluginData("principes-frontmatter") || [];
  const allItems = Array.isArray(rawData) ? rawData : rawData?.items || [];

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [page, setPage] = useState(1);

  // Toutes les catégories + compte
  const { categories, countsByCat } = useMemo(() => {
    const counts = {};
    for (const it of allItems) {
      (it.categories || []).forEach((c) => {
        counts[c] = (counts[c] || 0) + 1;
      });
    }
    const list = Object.keys(counts).sort((a, b) => a.localeCompare(b, "fr"));
    return { categories: ["Toutes", ...list], countsByCat: counts };
  }, [allItems]);

  // Filtrage
  const filtered = useMemo(() => {
    const q = norm(query);
    const byCategory =
      category === "Toutes"
        ? allItems
        : allItems.filter((it) => (it.categories || []).includes(category));

    const bySearch = q
      ? byCategory.filter((it) => {
          const hay = [
            it.title,
            it.synopsis,
            ...(it.categories || []),
            ...(it.synonyms || []),
          ]
            .filter(Boolean)
            .join(" ");
          return norm(hay).includes(q);
        })
      : byCategory;

    // Tri : populaires d'abord, puis titre
    return bySearch.sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return (a.title || "").localeCompare(b.title || "", "fr");
    });
  }, [allItems, query, category]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  // Génération des boutons de pages avec ellipses (ex: 1 … 4 5 6 … 12)
  const pageButtons = useMemo(() => {
    const btns = [];
    const add = (p, label = String(p), active = false, disabled = false) =>
      btns.push({ p, label, active, disabled });

    const windowSize = 1; // pages autour de la courante
    const pagesToShow = new Set([1, totalPages]);

    for (let p = currentPage - windowSize; p <= currentPage + windowSize; p++) {
      if (p >= 1 && p <= totalPages) pagesToShow.add(p);
    }

    const sorted = [...pagesToShow].sort((a, b) => a - b);

    let prev = 0;
    for (const p of sorted) {
      if (prev && p - prev > 1) {
        btns.push({ p: null, label: "…", ellipsis: true });
      }
      add(p, String(p), p === currentPage);
      prev = p;
    }

    return btns;
  }, [currentPage, totalPages]);

  // Réinitialiser la page quand on change filtre/recherche
  React.useEffect(() => setPage(1), [query, category]);

  return (
    <Layout>
      <Head>
        <title>Principes actifs · Fideta</title>
        <meta
          name="description"
          content="Parcourez les principes actifs analysés : fiches, synthèses, catégories et recherche."
        />
      </Head>

      <div className={styles.pageWrapper}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1>Principes actifs</h1>
            <p className={styles.subtitle}>
              Recherche par nom, catégorie ou synonymes. Cliquez sur une carte pour
              ouvrir la fiche détaillée.
            </p>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon} aria-hidden="true">
                  🔎
                </span>
                <input
                  className={styles.searchInput}
                  type="search"
                  placeholder="Rechercher un principe actif…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Rechercher"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className={styles.content}>
          {/* Sidebar catégories */}
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Catégories</h3>
            <div className={styles.categoryList}>
              {categories.map((c) => {
                const active = c === category;
                const count =
                  c === "Toutes"
                    ? allItems.length
                    : countsByCat[c] || 0;
                return (
                  <button
                    key={c}
                    className={active ? styles.categoryItemActive : styles.categoryItem}
                    onClick={() => setCategory(c)}
                    aria-pressed={active}
                  >
                    {c} {typeof count === "number" ? `(${count})` : ""}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Grille */}
          <div>
            {paginated.length === 0 ? (
              <div className={styles.empty}>
                Aucune fiche ne correspond à votre recherche.
              </div>
            ) : (
              <div className={styles.grid}>
                {paginated.map((it) => (
                  <article key={it.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <img
                        src={it.image}
                        alt={it.title}
                        className={styles.thumb}
                        width={56}
                        height={56}
                        loading="lazy"
                      />
                      <h3 className={styles.cardTitle}>{it.title}</h3>
                    </div>

                    {it.synopsis ? (
                      <p className={styles.synopsis}>{it.synopsis}</p>
                    ) : (
                      <p className={styles.synopsis}>
                        {/* Fallback discret si pas de synopsis */}
                        Découvrez notre synthèse sur ce principe actif.
                      </p>
                    )}

                    <div className={styles.cardFooter}>
                      <div className={styles.chips}>
                        {(it.categories || []).map((c) => (
                          <button
                            key={c}
                            className={styles.chip}
                            onClick={() => {
                              setCategory(c);
                              setPage(1);
                              window?.scrollTo?.({ top: 0, behavior: "smooth" });
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>

                      <Link className={styles.cta} to={it.slug}>
                        Voir la fiche
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className={styles.pagination} aria-label="Pagination">
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {pageButtons.map((b, i) =>
                  b.ellipsis ? (
                    <span key={`e${i}`} className={styles.pageEllipsis}>
                      {b.label}
                    </span>
                  ) : (
                    <button
                      key={b.p}
                      className={
                        b.active
                          ? `${styles.pageBtn} ${styles.pageBtnActive}`
                          : styles.pageBtn
                      }
                      onClick={() => setPage(b.p)}
                      aria-current={b.active ? "page" : undefined}
                    >
                      {b.label}
                    </button>
                  )
                )}

                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </nav>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
