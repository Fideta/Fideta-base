import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import Head from '@docusaurus/Head'; // ⬅️ ajouté
import styles from './index.module.css';

export default function Home() {
  const principesData = usePluginData('principes-frontmatter') || [];

  const popularItems = principesData
    .filter(item => item.popular)
    .slice(0, 6);

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fideta',
    url: 'https://fideta.fr',
    logo: 'https://fideta.fr/img/favicon-192.png', // icône carrée ≥112px
    sameAs: [
      'https://www.linkedin.com/company/fideta-app/',
      'https://x.com/Fideta_app',
    ],
  };

  return (
    <>
      <Head>
        {/* Title et description spécifiques à la home */}
        <title>Fideta — Analyse scientifique des compléments alimentaires</title>
        <meta
          name="description"
          content="Analyse indépendante des compléments alimentaires, basée sur le consensus scientifique. Fiches détaillées, preuves et recommandations."
        />

        {/* Favicons multi-tailles */}
        <link rel="icon" href="/img/favicon-48.png" sizes="48x48" />
        <link rel="icon" href="/img/favicon-96.png" sizes="96x96" />
        <link rel="icon" href="/img/favicon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/img/favicon-192.png" />

        {/* Open Graph & Twitter */}
        <meta property="og:image" content="https://fideta.fr/img/fideta-social-card.png" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* JSON-LD Organization */}
        <script type="application/ld+json">
          {JSON.stringify(orgJsonLd)}
        </script>
      </Head>

      <Layout
        title="Fideta"
        description="Analyse scientifique des compléments alimentaires"
      >
        <header className={styles.heroBanner}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h1>Décortique la science des compléments alimentaires pour faire les bons choix</h1>
                <p>Fideta décrypte les compléments alimentaires avec rigueur scientifique pour vous aider à prendre des décisions éclairées.</p>
                <div className={styles.buttons}>
                  <Link className="button button--primary" to="/principes-actifs">
                    Explorer les principes actifs
                  </Link>
                  <Link className="button button--secondary" to="/produits">
                    Explorer produits
                  </Link>
                </div>
              </div>
              <div className={styles.heroImage}>
                <img src="/img/illustration-science.png" alt="Scientifique présentant un complément alimentaire" />
              </div>
            </div>
          </div>
        </header>

        <main className={styles.fullBackground}>
          <div className="container">
            <section className={styles.cardSection}>
              <div className={styles.card}>
                <h3>Derniers produits analysés</h3>
                  <ul className={styles.productList}>
  <li>
    <Link to="/docs/produits/ERGYPHILUS_Intima">ERGYPHILUS® Intima</Link> La flore vaginale par la bouche : une idée séduisante, des preuves limitées.
  </li>
  <li>
    <Link to="/docs/produits/BonjourCamomille">Bonjour Camomille</Link> 😴 Après le café, remplacer la tisane ?
  </li>
  <li>
    <Link to="/docs/produits/florvis-sii">Florvis SII</Link> 😬 Pertinent ou pas pour le SII ?
  </li>
</ul>
              </div>

              <div className={styles.card}>
                <h3>Les derniers ingrédients analysés</h3>
                <div className={styles.tagList}>
                  {popularItems.length > 0 ? (
                    popularItems.map(item => (
                      <Link key={item.id} className={`${styles.tag} ${styles.tagButton}`} to={item.slug}>
                        {item.title}
                      </Link>
                    ))
                  ) : (
                    <p>Aucun ingrédient populaire défini.</p>
                  )}
                </div>
              </div>

              <div className={styles.card}>
                <h3>Méthodologie transparente</h3>
                <p>Découvrez notre approche rigoureuse basée sur les preuves scientifiques.</p>
                <Link className="button button--primary" to="/docs/methodologie">Lire la méthode complète</Link>
              </div>
            </section>
          </div>
        </main>
      </Layout>
    </>
  );
}
