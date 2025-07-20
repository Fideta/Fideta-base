// src/pages/search.jsx
import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function SearchPage() {
  useEffect(() => {
    if (window.PagefindUI) {
      new window.PagefindUI({
        element: '#search',
        translations: {
          search_label: 'Recherche sur Fideta',
          placeholder: 'Rechercher…',
          clear_search: 'Effacer',
          load_more: 'Voir plus',
          zero_results: 'Aucun résultat',
          one_result: '1 résultat trouvé',
          many_results: '{count} résultats trouvés',
          filters_label: 'Filtres',
        },
      });
    }
  }, []);

  return (
    <Layout title="Recherche">
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div id="search" />
      </div>
    </Layout>
  );
}
