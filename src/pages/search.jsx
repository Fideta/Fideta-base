// src/pages/search.jsx
import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { PagefindUI } from "@pagefind/default-ui";
import "@pagefind/default-ui/css/ui.css";

export default function SearchPage() {
  const containerRef = useRef(null);
  const baseUrl = useBaseUrl("/"); // garantit des liens corrects (prod & GH Pages)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Si l’index n’existe pas (ex. dev server), on affiche un message simple
    let ui;
    try {
      ui = new PagefindUI({
        element: containerRef.current,
        // Ne PAS définir bundlePath : l’UI le déduira de /pagefind/
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
      setMounted(true);
    } catch (e) {
      // En dev (docusaurus start), l’index n’existe pas -> info discrète
      // En prod, si vous voyez ce message, vérifiez le job "Generate Pagefind index".
      // eslint-disable-next-line no-console
      console.warn("Pagefind UI init error:", e);
      setMounted(false);
    }

    return () => {
      if (ui && typeof ui.destroy === "function") ui.destroy();
    };
  }, [baseUrl]);

  return (
    <Layout title="Recherche">
      <main style={{ padding: "2rem 1rem" }}>
        <div
          className="container"
          style={{ maxWidth: 860, margin: "0 auto" }}
        >
          <h1 style={{ marginBottom: "1rem" }}>Recherche</h1>
          <div ref={containerRef} />
          {!mounted && (
            <p style={{ marginTop: "1rem", opacity: 0.7 }}>
              Astuce : la recherche nécessite l’index généré au build. En local,
              lancez <code>npm run build</code> puis{" "}
              <code>npx pagefind --site build --serve</code>. En CI, vérifiez
              l’étape <em>Generate Pagefind index</em>.
            </p>
          )}
        </div>
      </main>
    </Layout>
  );
}
