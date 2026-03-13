import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import Head from '@docusaurus/Head';
import styles from './index.module.css';

export default function Home() {
  const principesData = usePluginData('principes-frontmatter') || [];

  // (Tu l’utilises si tu veux afficher des ingrédients populaires quelque part)
  const popularItems = principesData.filter(item => item.popular).slice(0, 6);

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fideta',
    url: 'https://fideta.fr',
    logo: 'https://fideta.fr/img/favicon-192.png',
    sameAs: ['https://www.linkedin.com/company/fideta-app/', 'https://x.com/Fideta_app'],
  };

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
        {/* HERO */}
        <header className={styles.heroBanner}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h1>
                  Décortique la science des compléments alimentaires pour faire les bons choix
                </h1>

                <p className={styles.heroSubtitle}>
                  Fideta décrypte les compléments alimentaires avec rigueur scientifique, en s’appuyant sur les données disponibles pour distinguer ce qui est étayé par la science de ce qui ne l’est pas, et vous aider à prendre des décisions éclairées.
                </p>

                <div className={styles.buttons}>
                  <Link className="button button--primary" to="/principes-actifs">
                    Explorer les analyses
                  </Link>
                  <Link className="button button--secondary" to="/docs/methodologie">
                    Comprendre la méthode
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

        {/* CONTENU */}
        <main className={styles.fullBackground}>
          <div className="container">
            <h2 className={styles.homeSectionTitle}>
              Ce que vous trouverez sur Fideta
            </h2>

            <section className={styles.cardSection}>
              {/* 1ère ligne : Ingrédients / Produits / Articles */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Analyses d'ingrédients</h3>
                </div>
                <div className={styles.cardBody}>
                  <ul>
                    <li>Effets documentés chez l'être humain</li>
                    <li>Niveau de preuve selon le type d’études disponibles</li>
                    <li>Classification des effets par indication</li>
                    <li>Effets indésirables ou toxicité</li>
                  </ul>

                  <div className={styles.cardBodyFooter}>
                    <Link className="button button--primary" to="/principes-actifs">
                      Explorer les ingrédients
                    </Link>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Analyses de produits</h3>
                </div>
                <div className={styles.cardBody}>
                  <ul>
                    <li>Dosages comparés à ceux utilisés dans les études</li>
                    <li>Cohérence globale entre formulation et allégations</li>
                    <li>Risques existants pour la santé</li>
                    <li>Une note globale de pertinence clinique</li>
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
                  <h3>Actualités et synthèses</h3>
                </div>
                <div className={styles.cardBody}>
                  <ul>
                     <li>Décryptage des tendances et des idées reçues</li>
                     <li>Résumés accessibles d'articles scientifiques</li>
                     <li>Mise en contexte des résultats et de leurs limites</li>
                     <li>Actualités du site fideta.fr</li>
                  </ul>

                  <div className={styles.cardBodyFooter}>
                    <Link className="button button--primary" to="/blog">
                      Voir les articles
                    </Link>
                  </div>
                </div>
              </div>

              {/* 2ème ligne : Derniers produits / Derniers ingrédients / Par thème */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Derniers produits</h3>
                </div>
                <div className={styles.cardBody}>
                  <ul>
                      <li>
    <Link to="/docs/produits/cytocore">Cytocore </Link> Pour fatigue intense, moins intense sur les preuves.
  </li>
  <li>
    <Link to="/docs/produits/effluvium">Effluvium </Link> Peu de preuves pour les cheveux.
  </li>
  <li>
    <Link to="/docs/produits/feminabiane-meno-confort">Feminabiane Méno’Confort </Link> Encore peu de confort prouvé.
  </li>
                  </ul>

                  <div className={styles.cardBodyFooter}>
                    <Link className="button button--primary" to="/produits">
                      Parcourir les produits
                    </Link>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Derniers ingrédients</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.tagList}>
                    <Link className={`${styles.tag} ${styles.tagButton}`} to="/docs/principes/creatine">
                      Créatine
                    </Link>
                    <Link className={`${styles.tag} ${styles.tagButton}`} to="/docs/principes/spiruline">
                      Spiruline
                    </Link>
                    <Link className={`${styles.tag} ${styles.tagButton}`} to="/docs/principes/ashwagandha">
                      Ashwagandha
                    </Link>
                    <Link className={`${styles.tag} ${styles.tagButton}`} to="/docs/principes/berberine">
                      Berberine
                    </Link>
                    <Link className={`${styles.tag} ${styles.tagButton}`} to="/docs/principes/chondroitine">
                      Chondroitine
                    </Link>
                    <Link className={`${styles.tag} ${styles.tagButton}`} to="/docs/principes/omega-3">
                      Omega 3
                    </Link>

                  </div>

                  <div className={styles.cardBodyFooter}>
                    <Link className="button button--primary" to="/principes-actifs">
                      Parcourir les ingrédients
                    </Link>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
  <div className={styles.cardHeader}>
    <h3>Explorer Fideta</h3>
  </div>

  <div className={styles.cardBody}>
    <div className={styles.miniColumns}>
      <div className={styles.miniCol}>
        <div className={styles.miniTitle}>Recherche</div>
        <div className={styles.miniText}>
          Trouver un ingrédient ou un produit.
        </div>
        <Link className={styles.miniLink} to="/search">
          Rechercher
        </Link>
      </div>

      <div className={styles.miniCol}>
        <div className={styles.miniTitle}>Par thème</div>
        <div className={styles.miniText}>
          Explorer par usage (sommeil, stress…).
        </div>
        <Link className={styles.miniLink} to="/principes-actifs">
          Explorer
        </Link>
      </div>

      <div className={`${styles.miniCol} ${styles.miniColSupport}`}>
  <div className={styles.miniTitle}>Nous aider</div>
  <div className={styles.miniText}>
    Fideta est un projet indépendant, sans publicité.
  </div>
  <Link className={styles.miniLink} to="/soutenir">
    Soutenir
  </Link>
</div>

    </div>
  </div>
</div>


            </section>
          </div>
        </main>
      </Layout>
    </>
  );
}

