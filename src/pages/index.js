import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import styles from './index.module.css';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { loading, isPremium } = useAuth();

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fideta',
    url: 'https://fideta.fr',
    logo: 'https://fideta.fr/img/favicon-192.png',
    sameAs: ['https://www.linkedin.com/company/fideta-app/', 'https://x.com/Fideta_app'],
  };

  function renderPremiumCardContent() {
    if (loading) {
      return (
        <div className={styles.cardBody}>
          <p className={styles.premiumText}>Chargement de votre accès…</p>

          <div className={styles.cardBodyFooter}>
            <span className={styles.premiumButton}>Chargement…</span>
          </div>
        </div>
      );
    }

    if (isPremium) {
      return (
        <div className={styles.cardBody}>
          <p className={styles.premiumText}>
            Accédez directement à la recherche par indication clinique pour repérer rapidement
            les ingrédients et produits les plus pertinents.
          </p>

          <div className={styles.cardBodyFooter}>
            <Link className="button button--primary" to="/clinique">
              Explorer les indications
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.cardBody}>
        <p className={styles.premiumText}>
          Accédez à la recherche par indication clinique pour identifier plus rapidement
          les ingrédients et produits les plus pertinents selon un besoin précis.
        </p>

        <div className={styles.cardBodyFooter}>
          <Link className={styles.premiumButton} to="/clinique">
            Découvrir Fideta Plus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Fideta — Analyses indépendantes des compléments alimentaires</title>
        <meta
          name="description"
          content="Analyses indépendantes des compléments alimentaires basées sur les données scientifiques. Fiches ingrédients, analyses de produits et méthodologie."
        />

        <link rel="icon" href="/img/favicon-48.png" sizes="48x48" />
        <link rel="icon" href="/img/favicon-96.png" sizes="96x96" />
        <link rel="icon" href="/img/favicon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/img/favicon-192.png" />

        <meta property="og:image" content="https://fideta.fr/img/fideta-social-card.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      </Head>

      <Layout title="Fideta" description="Analyses indépendantes des compléments alimentaires">
        <div className={styles.homePageShell}>
          <header className={styles.heroBanner}>
            <div className="container">
              <div className={styles.heroContent}>
                <div className={styles.heroText}>
                  <h1>
                    Décortique la science des compléments alimentaires pour faire les bons choix
                  </h1>

                  <p className={styles.heroSubtitle}>
                    Fideta décrypte les compléments alimentaires avec rigueur scientifique, en
                    s’appuyant sur les données disponibles pour distinguer ce qui est étayé par la
                    science de ce qui ne l’est pas, et vous aider à prendre des décisions éclairées.
                  </p>

                  <div className={styles.buttons}>
                    <Link className="button button--primary" to="/principes-actifs">
                      Explorer les ingrédients
                    </Link>
                    <Link className="button button--secondary" to="/produits">
                      Explorer les produits
                    </Link>
                  </div>
                </div>

                <div className={styles.heroImage}>
                  <img
                    src="/img/illustration-science.png"
                    alt="Illustration : analyse scientifique des compléments alimentaires"
                  />
                </div>
              </div>
            </div>
          </header>

          <main className={styles.fullBackground}>
            <div className="container">
              <h2 className={styles.homeSectionTitle}>Ce que vous trouverez sur Fideta</h2>

              <section className={styles.cardSection}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Analyses de produits</h3>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardIntro}>Derniers produits analysés</div>

                    <ul className={styles.latestList}>
                      <li>
                        <Link to="/docs/produits/melioran_noctesia">Melioran® Noctesia®</Link> Pour le sommeil 
                      </li>
                      <li>
                        <Link to="/docs/produits/phytostandard_eschscholtzia_valeriane">Phytostandard® Eschscholtzia / Valériane</Link> Pour sommeil et relaxation 
                      </li>
                      <li>
                        <Link to="/docs/produits/ma-05">MA-05</Link> Boost de métabolisme ? 
                      </li>
                    </ul>

                    <div className={styles.cardBodyFooter}>
                      <Link className="button button--primary" to="/produits">
                        Explorer les produits
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Analyses d&apos;ingrédients</h3>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardIntro}>Derniers ingrédients analysés</div>

                    <div className={styles.tagList}>
                      <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/creatine"
                      >
                        Créatine
                      </Link>
                      <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/spiruline"
                      >
                        Spiruline
                      </Link>
                      <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/ashwagandha"
                      >
                        Ashwagandha
                      </Link>
                      <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/berberine"
                      >
                        Berberine
                      </Link>
                      <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/chondroitine"
                      >
                        Chondroitine
                      </Link>
                      <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/omega-3"
                      >
                        Omega 3
                      </Link>
                      <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/miel"
                      >
                        Miel
                      </Link>
                      <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/sureau"
                      >
                        Sureau
                      </Link>
                          <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/coenzyme-q10"
                      >
                        Co-enzyme Q10
                      </Link>
                    </div>   

                    <div className={styles.cardBodyFooter}>
                      <Link className="button button--primary" to="/principes-actifs">
                        Explorer les ingrédients
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={`${styles.card} ${styles.premiumCard}`}>
                  <div className={styles.premiumBadge}>
                    {loading ? 'Fideta Plus' : isPremium ? 'Fideta Plus' : 'Fideta Plus 🔒'}
                  </div>

                  <div className={styles.cardHeader}>
                    <h3>Recherche par indication</h3>
                  </div>

                  {renderPremiumCardContent()}
                </div>
              </section>

              <section className={styles.bottomActions}>
                <Link className="button button--secondary" to="/docs/methodologie">
                  Méthodologie
                </Link>

                <Link className="button button--secondary" to="/blog">
                  Voir les articles
                </Link>

                <Link className="button button--primary" to="/soutenirre">
                  Soutenir Fideta
                </Link>
              </section>
            </div>
          </main>
        </div>
      </Layout>
    </>
  );
}
