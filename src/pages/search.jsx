// src/pages/search.jsx
import React, { useEffect, useRef } from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { PagefindUI } from "@pagefind/default-ui";
import "@pagefind/default-ui/css/ui.css";

export default function SearchPage() {
  const containerRef = useRef(null);
  const bundlePath = useBaseUrl("pagefind/"); // index généré dans build/pagefind
  const baseUrl = useBaseUrl("/");            // préfixe des URLs résultats

  useEffect(() => {
    if (!containerRef.current) return;
    const ui = new PagefindUI({
      element: containerRef.current,
      bundlePath,
      baseUrl,
      showSubResults: true,
      debounceTimeoutMs: 250,
      translations: {
        search_label: "Recherche sur Fideta",
        placeholder: "Rechercher…",
        clear_search: "Effacer",
        load_more: "Voir plus",
        zero_results: "Aucun résultat",
        one_result: "1 résultat trouvé",
        many_results: "{count} résultats trouvés",
        filters_label: "Filtres",
      },
    });
    return () => ui?.destroy?.();
  }, [bundlePath, baseUrl]);

  return (
    <Layout title="Recherche">
      <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <div ref={containerRef} />
      </div>
    </Layout>
  );
}

