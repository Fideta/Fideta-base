import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./clinique.module.css";
import { useAuth } from "../context/AuthContext";

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

function LockedCliniquePreview() {
  const [activeIndication, setActiveIndication] = useState("endormissement");

  const principesPreviewData = usePluginData("principes-frontmatter");
  const principles = normalizePluginItems(principesPreviewData);

  const normalizeText = (value) =>
    (value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .toLowerCase();

  const principleImageByTitle = useMemo(() => {
    const map = new Map();

    principles.forEach((item) => {
      const normalizedTitle = normalizeText(item.title);
      if (normalizedTitle) {
        map.set(normalizedTitle, item.image);
      }
    });

    return map;
  }, [principles]);

  const getPreviewImage = (title) => {
    return principleImageByTitle.get(normalizeText(title)) || "/img/favicon-192.png";
  };

  const previewData = {
    endormissement: {
      label: "Endormissement",
      results: [
        {
          title: "Mélatonine",
          synopsis:
            "Hormone du sommeil, preuves modérées pour réguler l’endormissement.",
          grade: "A",
        },
        {
          title: "L-théanine",
          synopsis:
            "Acide aminé naturellement présent dans le thé, avec effet calmant léger et signaux modestes sur le sommeil.",
          grade: "C",
        },
        {
          title: "Valériane",
          synopsis:
            "Plante sédative, preuves modérées pour améliorer l’endormissement.",
          grade: "C",
        },
      ],
    },
    sommeil_qualite: {
      label: "Qualité du sommeil",
      results: [
        {
          title: "Valériane",
          synopsis:
            "Plante sédative, preuves modérées pour améliorer la qualité globale du sommeil.",
          grade: "C",
        },
        {
          title: "Mélatonine",
          synopsis:
            "Effet surtout marqué sur l’endormissement, avec impact possible sur la qualité perçue du sommeil.",
          grade: "D",
        },
        {
          title: "Verveine citronnée",
          synopsis:
            "Données cliniques limitées mais quelques signaux positifs sur le confort nocturne.",
          grade: "D",
        },
      ],
    },
    reveils_nocturnes: {
      label: "Réveils nocturnes",
      results: [
        {
          title: "Valériane",
          synopsis:
            "Peut aider certains profils avec maintien du sommeil, selon les formulations.",
          grade: "C",
        },
        {
          title: "Mélatonine",
          synopsis: "Absence de preuves afin de maintenir le sommeil.",
          grade: "F",
        },
        {
          title: "Magnésium",
          synopsis: "Aucune preuve chez l'être humain dans cette situation.",
          grade: "F",
        },
      ],
    },
  };

  const indicationButtons = [
    { key: "endormissement", label: "Endormissement" },
    { key: "sommeil_qualite", label: "Qualité du sommeil" },
    { key: "reveils_nocturnes", label: "Réveils nocturnes" },
  ];

  const activeBlock = previewData[activeIndication];

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5ebe5",
        borderRadius: "24px",
        padding: "1.25rem",
        boxShadow: "0 10px 28px rgba(24, 52, 30, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.8rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontSize: "0.82rem",
            fontWeight: 800,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            color: "#6c7a6e",
          }}
        >
          Aperçu interactif
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.35rem 0.7rem",
            borderRadius: "999px",
            background: "#edf4ee",
            color: "#1b5e20",
            fontWeight: 700,
            fontSize: "0.86rem",
          }}
        >
          Sommeil
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔎</span>
            <input
              className={styles.searchInput}
              value={activeBlock.label}
              readOnly
            />
          </div>

          <div className={styles.modeSwitch}>
            <button type="button" className={styles.modeBtnActive}>
              Principes
            </button>
            <button type="button" className={styles.modeBtn}>
              Produits
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "0.65rem",
          marginBottom: "1rem",
        }}
      >
        {indicationButtons.map((item) => {
          const isActive = activeIndication === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveIndication(item.key)}
              style={{
                appearance: "none",
                border: isActive ? "1px solid #c8d9cb" : "1px solid #d9e3da",
                background: isActive ? "#eef5ef" : "#ffffff",
                color: isActive ? "#173f1f" : "#506152",
                borderRadius: "14px",
                padding: "0.8rem 0.75rem",
                fontSize: "0.92rem",
                fontWeight: isActive ? 800 : 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: isActive
                  ? "0 4px 10px rgba(27, 94, 32, 0.06)"
                  : "none",
                textAlign: "center",
                lineHeight: 1.3,
                minHeight: "56px",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className={styles.resultsColumn}>
        <div className={styles.resultsHeaderCard}>
          <div className={styles.resultsHeaderLeft}>
            <div className={styles.filterMenuWrap}>
              <button
                type="button"
                className={styles.filterTrigger}
                aria-label="Filtrer par grade clinique"
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
              </button>
            </div>

            <div className={styles.resultsHeaderMain}>Nom</div>
          </div>

          <div className={styles.resultsHeaderGrade}>Grade clinique</div>
        </div>

        {activeBlock.results.map((item) => (
          <article
            key={`${activeIndication}-${item.title}`}
            className={styles.rowCard}
            style={{ cursor: "default" }}
          >
            <div className={styles.rowMain}>
              <img
                src={getPreviewImage(item.title)}
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
                  </div>
                </div>

                <p className={styles.synopsis}>{item.synopsis}</p>
              </div>
            </div>

            <div className={styles.rightRail}>
              <GradeBadge grade={item.grade} />
            </div>
          </article>
        ))}

        <div
          style={{
            marginTop: "0.7rem",
            padding: "0.95rem 1rem",
            borderRadius: "16px",
            background: "#f7f9f7",
            border: "1px solid #ebf0eb",
            color: "#5d6d60",
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          Aperçu simplifié : choisissez une indication du sommeil pour voir 3
          résultats exemples.
        </div>
      </div>
    </div>
  );
}

function LockedCliniqueView() {
  const { isLoggedIn, user, session } = useAuth();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function handleStartCheckout() {
    if (!session?.access_token) {
      window.location.href = "/connexion";
      return;
    }

    setCheckoutBusy(true);
    setCheckoutError("");

    try {
      const res = await fetch(
        "https://jrbaeawbpehqdqsecjon.supabase.co/functions/v1/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Erreur checkout");
      }

      if (!data?.url) {
        throw new Error("Aucune URL de paiement reçue.");
      }

      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err.message || "Erreur checkout");
      setCheckoutBusy(false);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Recherche clinique</h1>
          <p className={styles.subtitle}>
            La recherche par indication clinique fait partie de Fideta Plus.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "1.5rem 1.25rem 2.75rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.25rem",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, #fbfaf5 0%, #f6f4ea 100%)",
              border: "1px solid #e2d7b5",
              borderRadius: "24px",
              padding: "2rem",
              boxShadow: "0 14px 34px rgba(76, 69, 42, 0.08)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                marginBottom: "1rem",
                padding: "0.45rem 0.8rem",
                borderRadius: "999px",
                background: "#e6ddb7",
                color: "#38443a",
                fontWeight: 800,
                fontSize: "0.92rem",
                width: "fit-content",
              }}
            >
              Fideta Plus 🔒
            </div>

            <h2
              style={{
                margin: "0 0 1rem",
                color: "#173f1f",
                fontSize: "2rem",
                lineHeight: 1.15,
              }}
            >
              Accès réservé
            </h2>

            <p
              style={{
                fontSize: "1.06rem",
                lineHeight: 1.75,
                color: "#3f4a41",
                marginBottom: "1.25rem",
                maxWidth: "58ch",
              }}
            >
              La recherche par indication clinique permet d’identifier rapidement
              les ingrédients et les produits les plus pertinents selon un besoin
              précis, comme le sommeil, le stress ou la fatigue.
            </p>

            {isLoggedIn && (
              <p
                style={{
                  fontSize: "0.98rem",
                  lineHeight: 1.65,
                  color: "#4a554b",
                  marginBottom: "1.2rem",
                }}
              >
                Connecté avec <strong>{user?.email}</strong>, mais votre accès
                actuel ne comprend pas encore cette fonctionnalité.
              </p>
            )}

            <div
              style={{
                width: "72px",
                height: "1px",
                background: "#ddd6bf",
                margin: "0 0 1.2rem",
              }}
            />

            <div
              style={{
                display: "grid",
                gap: "0.7rem",
                marginBottom: "1.8rem",
              }}
            >
              {[
                "Recherche par indication clinique",
                "Repérage plus rapide des ingrédients les plus étayés",
                "Accès simplifié aux produits pertinents",
                "Fonctionnalité réservée à Fideta Plus",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.7rem",
                    color: "#475247",
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: "#8a6d1f",
                      marginTop: "0.55rem",
                      flexShrink: 0,
                    }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gap: "0.8rem",
                maxWidth: "420px",
                width: "100%",
                marginTop: "auto",
                marginLeft: "auto",
                marginRight: "auto",
                alignSelf: "center",
              }}
            >
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/connexion"
                    className={`${styles.lockedCta} ${styles.lockedCtaPrimary}`}
                  >
                    Créer un compte gratuit
                  </Link>

                  <Link
                    to="/connexion"
                    className={`${styles.lockedCta} ${styles.lockedCtaSecondary}`}
                  >
                    J’ai déjà un compte
                  </Link>

                  <p
                    style={{
                      margin: "0.2rem 0 0",
                      color: "#66736a",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      textAlign: "center",
                    }}
                  >
                    Le compte gratuit permet d’enregistrer vos fiches favorites
                    et de retrouver votre historique. Fideta Plus active ensuite
                    la recherche clinique avancée.
                  </p>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleStartCheckout}
                    disabled={checkoutBusy}
                    className={`${styles.lockedCta} ${styles.lockedCtaPrimary} ${
                      checkoutBusy ? styles.lockedCtaDisabled : ""
                    }`}
                  >
                    {checkoutBusy ? "Redirection…" : "S’abonner à Fideta Plus"}
                  </button>

                  <Link
                    to="/compte"
                    className={`${styles.lockedCta} ${styles.lockedCtaSecondary}`}
                  >
                    Aller à mon compte
                  </Link>

                  <Link
                    to="/"
                    className={`${styles.lockedCta} ${styles.lockedCtaTertiary}`}
                  >
                    Revenir à l’accueil
                  </Link>

                  <p
                    style={{
                      margin: "0.2rem 0 0",
                      color: "#66736a",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      textAlign: "center",
                    }}
                  >
                    Votre compte gratuit est déjà actif. Il ne vous reste qu’à
                    activer Fideta Plus pour accéder à la recherche clinique.
                  </p>
                </>
              )}
            </div>

            {checkoutError && (
              <p
                style={{
                  marginTop: "1rem",
                  color: "crimson",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                {checkoutError}
              </p>
            )}
          </div>

          <LockedCliniquePreview />
        </div>
      </section>
    </div>
  );
}

function CliniquePremiumContent() {
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
            Choisissez un type, ouvrez un thème clinique, puis sélectionnez une
            indication pour classer les principes actifs ou les produits.
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
              {paginated.map((item) =>
                mode === "ingredients" ? (
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
                            </div>
                          </div>

                          <p className={styles.synopsis}>{item.synopsis}</p>
                        </div>
                      </div>

                      <div className={styles.rightRail}>
                        <GradeBadge grade={getGrade(item, indication)} />
                      </div>
                    </article>
                  </Link>
                ) : (
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
                              <div className={styles.rowMeta}>
                                Score :{" "}
                                {item.score != null ? `${item.score}/100` : "—"}
                              </div>
                            </div>
                          </div>

                          <p className={styles.synopsis}>{item.synopsis}</p>
                        </div>
                      </div>

                      <div className={styles.rightRail}>
                        <GradeBadge
                          grade={getGrade(item, indication)}
                          muted={Number(item.score ?? 0) === 0}
                        />
                      </div>
                    </article>
                  </Link>
                )
              )}

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
  const { loading, isPremium } = useAuth();

  return (
    <Layout
      title="Recherche clinique"
      description="Explorer les ingrédients et produits par indication clinique"
    >
      {loading ? null : isPremium ? <CliniquePremiumContent /> : <LockedCliniqueView />}
    </Layout>
  );
}