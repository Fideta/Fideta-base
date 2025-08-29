// src/pages/search.jsx
import React, { useEffect, useRef } from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { PagefindUI } from "@pagefind/default-ui";
import "@pagefind/default-ui/css/ui.css";

export default function SearchPage() {
  const ref = useRef(null);

  // liens corrects en prod (fideta.fr) et si un jour tu changes de baseUrl
  const baseUrl = useBaseUrl("/");
  const bundlePath = useBaseUrl("pagefind/"); // l’index que la CI vient de produire

  useEffect(() => {
    if (!ref.current) return;
    const ui = new PagefindUI({
      element: ref.current,
      bundlePath,      // <= IMPORTANT
      baseUrl,         // <= IMPORTANT
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
