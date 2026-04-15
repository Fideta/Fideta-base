import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const DEV_PLAN_STORAGE_KEY = 'fideta-dev-plan';

export default function FidetaPlusPage() {
  const [plan, setPlan] = useState('free');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedPlan = window.localStorage.getItem(DEV_PLAN_STORAGE_KEY);

    if (storedPlan === 'premium' || storedPlan === 'free') {
      setPlan(storedPlan);
    }
  }, []);

  const isPremium = plan === 'premium';

  return (
    <Layout
      title="Fideta Plus"
      description="Fonctionnalités avancées de Fideta : recherche par indication clinique et outils de confort d’usage."
    >
      <main className="container margin-vert--xl">
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            background: '#fff',
            border: '1px solid #e7ece7',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 12px 28px rgba(24, 52, 30, 0.06)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              marginBottom: '1rem',
              padding: '0.45rem 0.8rem',
              borderRadius: '999px',
              background: '#edf4ee',
              color: '#1b5e20',
              fontWeight: 700,
            }}
          >
            {isPremium ? 'Fideta Plus' : 'Découvrir Fideta Plus'}
          </div>

          <h1 style={{ color: '#1b5e20', marginBottom: '1rem' }}>Fideta Plus</h1>

          <p style={{ fontSize: '1.08rem', lineHeight: 1.7 }}>
            Fideta Plus regroupe les fonctionnalités avancées de Fideta : une recherche par
            indication clinique pour aller plus vite, puis à terme des outils de confort comme les
            favoris, l’historique et les comparaisons.
          </p>

          <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ color: '#1b5e20' }}>Ce que Fideta Plus apportera</h2>
            <ul style={{ lineHeight: 1.8, paddingLeft: '1.2rem' }}>
              <li>Recherche par indication clinique</li>
              <li>Accès plus rapide aux ingrédients et produits pertinents</li>
              <li>Fonctions pratiques : favoris, historique, comparaisons</li>
              <li>À terme : dossiers thématiques et arbres de recommandation</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
            {isPremium ? (
              <Link className="button button--primary button--lg" to="/clinique">
                Explorer les indications
              </Link>
            ) : (
              <Link className="button button--primary button--lg" to="/">
                Revenir à l’accueil
              </Link>
            )}

            <Link className="button button--secondary button--lg" to="/docs/methodologie">
              Voir la méthodologie
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}