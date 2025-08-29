// src/pages/search.jsx
import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { PagefindUI } from "@pagefind/default-ui";
import "@pagefind/default-ui/css/ui.css";

export default function SearchPage() {
  const containerRef = useRef(null);

  // IMPORTANT : baseUrl pour corriger les liens en prod
  const baseUrl = useBaseUrl("/");

  // On fixe explicitement le chemin de l’index (évite toute ambiguïté)
  const bundlePath = useBaseUrl("pagefind/");

  const [status, setStatus] = useState("checking"); // checking | ok | empty | missing | error
  const [stats, setStats] = useState({ pages: 0, languages: [] });

  useEffect(() => {
    if (!containerRef.current) return;

    // 1) Vérifier que l’index existe (et combien de pages il contient)
    const manifestUrl =
      (bundlePath.endsWith("/") ? bundlePath : bundlePath + "/") + "manifest.json";

    fetch(manifestUrl, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const pages = json?.pages ?? 0;
        const languages = Object.keys(json?.languages || {});
        setStats({ pages, languages });
        if (pages === 0) {
          setStatus("empty");
          return;
        }

        // 2) Initialiser l’UI Pagefind une fois sûr que l’index est là
        const ui = new PagefindUI({
          element: containerRef.current,
          bundlePath, // on fixe explicitement
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

        setStatus("ok");
        return () => ui?.destroy?.();
      })
      .catch((e) => {
        // Manifest introuvable => l’index n’a pas été généré ou pas publié
        // eslint-disable-next-line no-console
        console.warn("Pagefind manifest check failed:", e);
        setStatus("missing");
      });
  }, [baseUrl, bundlePath]);

  return (
    <Layout title="Recherche">
      <main style={{ padding: "2rem 1rem" }}>
        <div className="container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <h1 style={{ marginBottom: "1rem" }}>Recherche</h1>

          <div ref={containerRef} />

          {status !== "ok" && (
            <div style={{ marginTop: "1rem", opacity: 0.8, fontSize: "0.95rem" }}>
              {status === "checking" && <>Initialisation de la recherche…</>}
              {status === "missing" && (
                <>
                  ⚠️ Index Pagefind introuvable (
                  <code>{bundlePath}manifest.json</code>). Vérifie le job CI
                  <em> Generate Pagefind index</em> et que le dossier{" "}
                  <code>build/pagefind/</code> est bien publié.
                </>
              )}
              {status === "empty" && (
                <>
                  ℹ️ Index Pagefind présent mais vide (pages = {stats.pages}). Modifie/ajoute
                  une page puis relance un déploiement.
                </>
              )}
            </div>
          )}

          {status !== "checking" && (
            <div style={{ marginTop: "0.5rem", opacity: 0.6 }}>
              <small>
                Index : {stats.pages} page(s) • Langues détectées :{" "}
                {stats.languages.length ? stats.languages.join(", ") : "—"}
              </small>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
