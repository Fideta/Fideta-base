// src/pages/search.jsx
import React, { useEffect, useRef } from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";

// petit util pour tolérer les accents (magnesium -> magnésium)
const foldAccents = (s) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "");

export default function SearchPage() {
  const ref = useRef(null);
  const baseUrl = useBaseUrl("/");                 // liens des résultats
  const pagefindPath = useBaseUrl("pagefind/");    // dossier généré en CI
  const uiJs = useBaseUrl("pagefind/pagefind-ui.js");
  const uiCss = useBaseUrl("pagefind/pagefind-ui.css");

  useEffect(() => {
    if (!ref.current) return;

    // 1) injecte le CSS local de Pagefind UI
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = uiCss;
    document.head.appendChild(link);

    // 2) charge le JS local de Pagefind UI puis initialise
    const script = document.createElement("script");
    script.src = uiJs;
    script.defer = true;

    let ui;
    script.onload = () => {
      if (!window.PagefindUI) return;

      ui = new window.PagefindUI({
        element: ref.current,
        bundlePath: pagefindPath,   // ← important
        baseUrl,                    // ← important
        showSubResults: true,
        showImages: true,
        debounceTimeoutMs: 250,
        // “pliage” des accents pour les requêtes
        processTerm: (t) => foldAccents(t),
        translations: {
          search_label: "Recherche sur Fideta",
          placeholder: "Rechercher…",
          clear_search: "Effacer",
          load_more: "Voir plus",
          zero_results: "Aucun résultat",
          one_result: "1 résultat trouvé",
          many_results: "{count} résultats trouvés",
          filters_label: "Filtres",
          searching_for: "Recherche de « [SEARCH_TERM] »…",
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      if (ui && typeof ui.destroy === "function") ui.destroy();
      try { document.head.removeChild(link); } catch {}
      try { document.body.removeChild(script); } catch {}
    };
  }, [baseUrl, pagefindPath, uiJs, uiCss]);

  return (
    <Layout title="Recherche">
      <main style={{ padding: "2rem 1rem" }}>
        <div className="container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <h1 style={{ marginBottom: "1rem" }}>Recherche</h1>
          <div ref={ref} />
        </div>
      </main>
    </Layout>
  );
}
