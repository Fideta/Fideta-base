import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <Layout title="Fideta" description="Compléments alimentaires analysés scientifiquement">
      <header className="hero hero--primary">
        <div className="container">
          <h1 className="hero__title">Bienvenue sur Fideta</h1>
          <p className="hero__subtitle">Des compléments alimentaires décodés avec rigueur scientifique</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="button button--secondary button--lg" to="/docs/principes/fiche_magnesium">
              Explorer les principes actifs
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/produits/fiche_formag_avec_avis">
              Explorer les produits analysés
            </Link>
          </div>
        </div>
      </header>
    </Layout>
  );
}
