// src/pages/search.jsx
import React, { useEffect, useRef } from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { PagefindUI } from "@pagefind/default-ui";
import "@pagefind/default-ui/css/ui.css";

export default function SearchPage() {
  const ref = useRef(null);
  const baseUrl = useBaseUrl("/");
  const bundlePath = useBaseUrl("pagefind/"); // désormais garanti par la CI

  useEffect(() => {
    if (!ref.current) return;
    const ui = new PagefindUI({
      element: ref.current,
      bundlePath,
      baseUrl,
      showSubResults: true,
      showImages: true,
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
      <main style={{ padding: "2rem 1rem" }}>
        <div className="container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <h1 style={{ marginBottom: "1rem" }}>Recherche</h1>
          <div ref={ref} />
        </div>
      </main>
    </Layout>
  );
}
