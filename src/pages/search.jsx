// src/pages/search.jsx
import React, { useEffect, useRef } from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function SearchPage() {
  const containerRef = useRef(null);
  const bundlePath = useBaseUrl("pagefind/"); // index généré par Pagefind
  const baseUrl = useBaseUrl("/");            // préfixe des URLs résultats

  useEffect(() => {
    // injecte CSS depuis le CDN
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/@pagefind/default-ui/css/ui.css";
    document.head.appendChild(link);

    // charge le script UI + initialise
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@pagefind/default-ui/dist/pagefind-ui.js";
    script.defer = true;

    let ui = null;
    script.onload = () => {
      if (containerRef.current && window.PagefindUI) {
        ui = new window.PagefindUI({
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
      }
    };

    document.body.appendChild(script);

    return () => {
      if (ui && typeof ui.destroy === "function") ui.destroy();
      try { document.head.removeChild(link); } catch {}
      try { document.body.removeChild(script); } catch {}
    };
  }, [bundlePath, baseUrl]);

  return (
    <Layout title="Recherche">
      <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <div ref={containerRef} />
      </div>
    </Layout>
  );
}
