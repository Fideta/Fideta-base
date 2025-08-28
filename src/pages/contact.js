import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css'; // ⬅️ on réutilise le même fichier CSS que la home

export default function Contact() {
  return (
    <Layout title="Nous contacter" description="Entrer en contact avec Fideta">
      {/* HERO identique à la home */}
      <header className={styles.heroBanner}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>Besoin de nous contacter&nbsp;?</h1>
              <p>
                Une question sur une analyse, une suggestion d’ingrédient ou un partenariat pro&nbsp;?
                Écrivez‑nous, on répond vite.
              </p>
              <div className={styles.buttons}>
                <a className="button button--primary" href="mailto:contact@fideta.fr">
                  📧 Envoyer un email
                </a>
                <Link className="button button--secondary" to="/docs/methodologie">
                  Voir notre méthodologie
                </Link>
              </div>
            </div>

            <div className={styles.heroImage}>
              <img
                src="/img/illustration-mail.png"
                alt="Contact Fideta"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Corps identique : fond + section cartes */}
      <main className={styles.fullBackground}>
        <div className="container">
          <section className={styles.cardSection}>
            {/* Carte 1 : Email */}
            <div className={styles.card}>
              <h3>📧 Email</h3>
              <p>Le moyen le plus simple pour nous joindre.</p>
              <p>
                <a href="mailto:contact@fideta.fr">contact@fideta.fr</a><br />
                <small>On vous répond vite !</small>
              </p>
            </div>

            {/* Carte 2 : Réseaux */}
            <div className={styles.card}>
              <h3>💬 Réseaux</h3>
              <ul>
                <li>
                  <a href="https://www.linkedin.com/company/fideta-app/" target="_blank" rel="noopener noreferrer">
                    LinkedIn — Fideta
                  </a>
                </li>
                <li>
                  <a href="https://x.com/Fideta_app" target="_blank" rel="noopener noreferrer">
                    X (Twitter) — @Fideta_app
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/Fideta_app" target="_blank" rel="noopener noreferrer">
                    Instagram — @Fideta_app
                  </a>
                </li>
              </ul>
            </div>

            {/* Carte 3 : Proposer une analyse */}
            <div className={styles.card}>
              <h3>🔬 Proposer une analyse</h3>
              <p>
                Un produit ou un ingrédient à évaluer ? 
                Proposez le par mail si vous ne le trouvez pas ! 
              </p>
              <div className={styles.buttons}>
                
                <Link className="button button--secondary" to="/produits">
                  Voir les produits analysés
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
