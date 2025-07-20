window.addEventListener('DOMContentLoaded', () => {
  const div = document.createElement('div');
  div.id = 'search';
  div.style.marginLeft = '1rem';

  const target = document.getElementById('search-zone-navbar');
  if (target) {
    target.appendChild(div);
  }

  import('/pagefind/pagefind-ui.js').then(() => {
    new window.PagefindUI({
      element: '#search',
      showSubResults: true,
      translations: {
        search_placeholder: 'Rechercher un ingrédient ou un produit…',
        reset_button_title: 'Effacer la recherche',
        cancel_button_text: 'Annuler',
        empty_results: 'Aucun résultat trouvé.',
        search_label: 'Recherche',
        search_button_text: 'Rechercher',
        aria_search_label: 'Recherche sur le site',
        total_results: '{count} résultat(s)',
        results_for: 'Résultats pour “{query}”',
        no_results_for: 'Aucun résultat pour “{query}”',
        load_more: 'Charger plus de résultats',
        page_label: 'Page',
        result_found: '1 résultat trouvé',
        results_found: '{count} résultats trouvés',
      },
    });
  });
});
