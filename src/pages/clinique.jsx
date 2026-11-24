import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./clinique.module.css";
import AccountGate from "../components/AccountGate";

const CLINICAL_THEMES = [
  {
    key: "sommeil",
    label: "Sommeil",
    indications: [
      { key: "endormissement", label: "Endormissement" },
      { key: "sommeil_qualite", label: "Qualité du sommeil" },
      { key: "reveils_nocturnes", label: "Réveils nocturnes" },
      { key: "alignement_circadien", label: "Alignement circadien" },
    ],
  },
];

const GRADE_ORDER = {
  A: 6,
  B: 5,
  C: 4,
  D: 3,
  E: 2,
  F: 1,
};

const ALL_GRADES = ["A", "B", "C", "D", "E", "F"];

function normalizePluginItems(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function getGrade(item, indication) {
  const entry = item?.clinical?.find((c) => c.indication === indication);
  return entry?.grade || null;
}

function hasIndication(item, indication) {
  return item?.clinical?.some((c) => c.indication === indication);
}

function matchesSearch(item, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    item.title,
    item.synopsis,
    ...(item.categories || []),
    ...(item.synonyms || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

function compareGradesDesc(a, b, indication) {
  const gradeA = getGrade(a, indication);
  const gradeB = getGrade(b, indication);
  return (GRADE_ORDER[gradeB] || 0) - (GRADE_ORDER[gradeA] || 0);
}

function sortIngredients(items, indication) {
  return [...items].sort((a, b) => {
    const gradeDiff = compareGradesDesc(a, b, indication);
    if (gradeDiff !== 0) return gradeDiff;
    return (a.title || "").localeCompare(b.title || "", "fr");
  });
}

function sortProducts(items, indication) {
  return [...items].sort((a, b) => {
    const scoreA = Number(a.score ?? 0);
    const scoreB = Number(b.score ?? 0);

    const isZeroA = scoreA === 0;
    const isZeroB = scoreB === 0;

    if (isZeroA !== isZeroB) {
      return isZeroA ? 1 : -1;
    }

    const gradeDiff = compareGradesDesc(a, b, indication);
    if (gradeDiff !== 0) return gradeDiff;

    const scoreDiff = scoreB - scoreA;
    if (scoreDiff !== 0) return scoreDiff;

    return (a.title || "").localeCompare(b.title || "", "fr");
  });
}

function GradeBadge({ grade, muted = false }) {
  const normalizedGrade = (grade || "unknown").toUpperCase();
  const gradeClass = muted
    ? styles.gradeUnknown
    : styles[`grade${normalizedGrade}`] || styles.gradeUnknown;

  return <div className={`${styles.gradeBadge} ${gradeClass}`}>{grade || "—"}</div>;
}

function CliniqueContent() {
  const [mode, setMode] = useState("ingredients");
  const [themeKey, setThemeKey] = useState(null);
  const [expandedThemeKey, setExpandedThemeKey] = useState(null);
  const [indication, setIndication] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedGrades, setSelectedGrades] = useState(ALL_GRADES);
  const [isGradeMenuOpen, setIsGradeMenuOpen] = useState(false);

  const gradeFilterRef = useRef(null);
  const perPage = 9;

  const principesPluginData = usePluginData("principes-frontmatter");
  const produitsPluginData = usePluginData("produits-frontmatter");

  const principles = normalizePluginItems(principesPluginData);
  const products = normalizePluginItems(produitsPluginData);

  useEffect(() => {
    setPage(1);
  }, [mode, query, indication, themeKey, selectedGrades]);

  useEffect(() => {
    if (!isGradeMenuOpen) return;

    function handleClickOutside(event) {
      if (
        gradeFilterRef.current &&
        !gradeFilterRef.current.contains(event.target)
      ) {
        setIsGradeMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGradeMenuOpen]);

  const filtered = useMemo(() => {
    if (!indication) return [];

    const source = mode === "ingredients" ? principles : products;

    const results = source.filter((item) => {
      const grade = getGrade(item, indication)?.toUpperCase() || null;

      return (
        hasIndication(item, indication) &&
        matchesSearch(item, query) &&
        grade &&
        selectedGrades.includes(grade)
      );
    });

    return mode === "ingredients"
      ? sortIngredients(results, indication)
      : sortProducts(results, indication);
  }, [mode, principles, products, indication, query, selectedGrades]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  function clearSelection() {
    setThemeKey(null);
    setExpandedThemeKey(null);
    setIndication(null);
    setPage(1);
  }

  function toggleTheme(themeKeyToToggle) {
    const isCurrentlyExpanded = expandedThemeKey === themeKeyToToggle;

    if (isCurrentlyExpanded) {
      if (themeKey === themeKeyToToggle) {
        clearSelection();
      } else {
        setExpandedThemeKey(null);
      }
      return;
    }

    setExpandedThemeKey(themeKeyToToggle);
  }

  function handleSelectIndication(theme, selectedIndicationKey) {
    const isSameTheme = themeKey === theme.key;
    const isSameIndication = indication === selectedIndicationKey;

    if (isSameTheme && isSameIndication) {
      clearSelection();
      return;
    }

    setThemeKey(theme.key);
    setExpandedThemeKey(theme.key);
    setIndication(selectedIndicationKey);
    setPage(1);
  }

  function toggleGrade(grade) {
    setSelectedGrades((prev) => {
      const next = prev.includes(grade)
        ? prev.filter((g) => g !== grade)
        : [...prev, grade];

      return ALL_GRADES.filter((g) => next.includes(g));
    });
  }

  function resetAllGrades() {
    setSelectedGrades(ALL_GRADES);
  }

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Recherche clinique</h1>
          <p className={styles.subtitle}>
            Choisissez un type, ouvrez un thème clinique, puis sélectionnez une indication pour classer les principes actifs ou les produits.
          </p>

          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔎</span>
              <input
                className={styles.searchInput}
                placeholder="Rechercher…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className={styles.modeSwitch}>
              <button
                type="button"
                className={
                  mode === "ingredients" ? styles.modeBtnActive : styles.modeBtn
                }
                onClick={() => setMode("ingredients")}
              >
                Principes
              </button>
              <button
                type="button"
                className={
                  mode === "products" ? styles.modeBtnActive : styles.modeBtn
                }
                onClick={() => setMode("products")}
              >
                Produits
              </button>
            </div>
          </div>

        </div>
      </section>

      <section className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.filterBlock}>
            <h2 className={styles.sidebarTitle}>Thèmes cliniques</h2>

            <div className={styles.themeAccordion}>
              {CLINICAL_THEMES.map((theme) => {
                const isExpanded = expandedThemeKey === theme.key;
                const isActiveTheme = themeKey === theme.key;

                return (
                  <div key={theme.key} className={styles.themeGroup}>
                    <button
                      type="button"
                      className={`${styles.themeButton} ${
                        isActiveTheme ? styles.themeButtonActive : ""
                      }`}
                      onClick={() => toggleTheme(theme.key)}
                      aria-expanded={isExpanded}
                    >
                      <span>{theme.label}</span>
                      <span
                        className={`${styles.themeChevron} ${
                          isExpanded ? styles.themeChevronOpen : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>

                    <div
                      className={`${styles.submenu} ${
                        isExpanded ? styles.submenuOpen : ""
                      }`}
                    >
                      <div className={styles.submenuInner}>
                        {theme.indications.map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            className={
                              themeKey === theme.key && item.key === indication
                                ? styles.submenuItemActive
                                : styles.submenuItem
                            }
                            onClick={() =>
                              handleSelectIndication(theme, item.key)
                            }
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <div className={styles.resultsColumn}>
          <div className={styles.resultsHeaderCard}>
            <div className={styles.resultsHeaderLeft}>
              <div className={styles.filterMenuWrap} ref={gradeFilterRef}>
                <button
                  type="button"
                  className={`${styles.filterTrigger} ${
                    isGradeMenuOpen ? styles.filterTriggerActive : ""
                  }`}
                  onClick={() => setIsGradeMenuOpen((prev) => !prev)}
                  aria-label="Filtrer par grade clinique"
                  aria-expanded={isGradeMenuOpen}
                  aria-haspopup="true"
                  title="Filtrer par grade clinique"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={styles.filterIcon}
                    aria-hidden="true"
                  >
                    <path
                      d="M4 6h16M7 12h10M10 18h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>

                  {selectedGrades.length !== ALL_GRADES.length && (
                    <span className={styles.filterCounter}>
                      {selectedGrades.length}
                    </span>
                  )}

                </button>

                {isGradeMenuOpen && (
                  <div className={styles.filterPopover}>
                    <div className={styles.filterPopoverHeader}>
                      <div className={styles.filterPopoverTitle}>
                        Grades visibles
                      </div>
                      <button
                        type="button"
                        className={styles.filterPopoverReset}
                        onClick={resetAllGrades}
                      >
                        Tout afficher
                      </button>
                    </div>

                    <div className={styles.gradeFilterGrid}>
                      {ALL_GRADES.map((grade) => {
                        const isActive = selectedGrades.includes(grade);

                        return (
                          <button
                            key={grade}
                            type="button"
                            className={`${styles.gradeFilterChip} ${
                              isActive ? styles.gradeFilterChipActive : ""
                            }`}
                            onClick={() => toggleGrade(grade)}
                          >
                            <span className={styles.gradeFilterCheck}>
                              {isActive ? "✓" : ""}
                            </span>
                            <span
                              className={`${styles.gradeFilterSwatch} ${
                                styles[`grade${grade}`]
                              }`}
                            >
                              {grade}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.resultsHeaderMain}>Nom</div>
            </div>

            <div className={styles.resultsHeaderGrade}>Grade clinique</div>
          </div>

          {!indication ? (
            <div className={styles.empty}>
              Sélectionnez un thème clinique puis une indication pour afficher
              les résultats.
            </div>
          ) : (
            <>
              {paginated.map((item) => {
                const isProduct = mode === "products";

                return (
                  <Link
                    key={item.slug || item.id}
                    to={item.slug}
                    className={styles.cardLink}
                  >
                    <article className={styles.rowCard}>
                      <div className={styles.rowMain}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className={styles.thumb}
                          width={56}
                          height={56}
                          loading="lazy"
                        />

                        <div className={styles.rowContent}>
                          <div className={styles.rowTop}>
                            <div>
                              <h3 className={styles.cardTitle}>{item.title}</h3>
                              {isProduct && (
                                <div className={styles.rowMeta}>
                                  Score : {item.score != null ? `${item.score}/100` : "—"}
                                </div>
                              )}
                            </div>
                          </div>

                          <p className={styles.synopsis}>{item.synopsis}</p>
                        </div>
                      </div>

                      <div className={styles.rightRail}>
                        <GradeBadge
                          grade={getGrade(item, indication)}
                          muted={isProduct && Number(item.score ?? 0) === 0}
                        />
                      </div>
                    </article>
                  </Link>
                );
              })}

              {paginated.length === 0 && (
                <div className={styles.empty}>
                  Aucun résultat. Modifiez la recherche, l’indication ou les
                  grades visibles.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {indication && totalPages > 1 && (
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
              className={`${styles.pageBtn} ${
                page === i + 1 ? styles.pageBtnActive : ""
              }`}
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
  );
}

export default function CliniquePage() {
  return (
    <Layout
      title="Recherche clinique"
      description="Explorer les ingrédients et produits par indication clinique"
    >
      <AccountGate>
        <CliniqueContent />
      </AccountGate>
    </Layout>
  );
}
