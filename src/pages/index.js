import React, { useEffect, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from './index.module.css';
import { useAuth } from '../context/AuthContext';

function AnimatedCount({ value, duration = 1200 }) {
  const [displayedValue, setDisplayedValue] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplayedValue(value);
      return undefined;
    }

    let animationFrame;
    let hasStarted = false;

    const startAnimation = () => {
      if (hasStarted) return;
      hasStarted = true;
      const startTime = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayedValue(Math.round(value * easedProgress));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    };

    if (!('IntersectionObserver' in window)) {
      startAnimation();
      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [duration, value]);

  return (
    <span ref={countRef} className={styles.counterNumber} aria-hidden="true">
      {displayedValue}
    </span>
  );
}

export default function Home() {
  const { loading, isLoggedIn } = useAuth();
  const searchUrl = useBaseUrl('/search');
  const principesData = usePluginData('principes-frontmatter');
  const produitsPluginData = usePluginData('produits-frontmatter');
  const produitsData = Array.isArray(produitsPluginData)
    ? produitsPluginData
    : produitsPluginData?.items || [];

  const ingredientCount = Array.isArray(principesData) ? principesData.length : 0;
  const productCount = produitsData.length;

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

                  <form className={styles.homeSearch} action={searchUrl} role="search">
                    <input type="search" name="q" aria-label="Rechercher sur Fideta" placeholder="Rechercher un produit, un ingrédient…" required />
                    <button type="submit" aria-label="Lancer la recherche">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" />
                      </svg>
                    </button>
                  </form>
                  <div className={styles.buttons}>
                    <Link
                      className="button button--primary"
                      to="/principes-actifs"
                      aria-label={`${ingredientCount} ingrédients analysés`}
                    >
                      <AnimatedCount value={ingredientCount} /> ingrédients analysés
                    </Link>
                    <Link
                      className="button button--secondary"
                      to="/produits"
                      aria-label={`${productCount} produits analysés`}
                    >
                      <AnimatedCount value={productCount} /> produits analysés
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
                        <Link to="/docs/produits/melioran-d-biotic">Melioran D-biotic</Link> Alors là on a plutôt des indices que ça ne marche pas.      
                      </li>
                      <li>
                        <Link to="/docs/produits/melioran-calm">Melioran Calm</Link> Des revendications claires sans preuves fortes.   
                      </li>
                      <li>
                        <Link to="/docs/produits/d3-biane-capsules-1000-ui">D3 Biane Capsules 1000 UI</Link> Ne vaut pas un médicament et pas pour tout le monde.  
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
                        to="/docs/principes/morosil"
                      >
                        Morosil
                      </Link>
                      <Link
                        className={`${styles.tag} ${styles.tagButton}`}
                        to="/docs/principes/fucus-vesiculosus"
                      >
                        Fucus
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
                    Fideta Plus
                  </div>

                  <div className={styles.cardHeader}>
                    <h3>Recherche par indication</h3>
                  </div>

                  <div className={styles.cardBody}>
                    <p className={styles.premiumText}>Retrouvez les ingrédients et les produits étudiés pour une indication clinique. Accès gratuit avec un compte Fideta.</p>
                    <div className={styles.cardBodyFooter}>
                      <Link className={styles.premiumButton} to={loading || isLoggedIn ? '/clinique' : '/connexion?intent=clinique'}>
                        {loading || isLoggedIn ? 'Explorer les indications' : 'Se connecter à Fideta Plus'}
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.bottomActions}>
                <Link className="button button--secondary" to="/docs/methodologie">
                  Méthodologie
                </Link>

                <Link className="button button--secondary" to="/blog">
                  Voir les articles
                </Link>

                <Link className="button button--primary" to="/soutenir">
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
