import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './soutenir.module.css';

export default function Soutenir() {
  return (
    <Layout
      title="Soutenir Fideta"
      description="Soutenez Fideta par un don, des suggestions d’ingrédients/produits, ou des idées d’amélioration."
    >
      {/* HERO */}
  <header className={styles.hero}>
  <div className={styles.heroFull}>
    <div className="container">
      <div className={styles.heroCenteredLeft}>
        <h1 className={styles.heroTitle}>Soutenir Fideta</h1>

        <p className={styles.heroLead}>
          Fideta est un projet indépendant qui décrypte la science des compléments alimentaires
          pour vous aider à faire des choix plus éclairés.
        </p>

        <p className={styles.heroText}>
          Construire et maintenir Fideta demande du temps, de la rigueur scientifique, et un développement technique continu
          (hébergement, ajout de fiches, amélioration de la recherche, mise à jour des analyses).
        </p>

        <p className={styles.heroText}>
          Si Fideta vous est utile, vous pouvez soutenir le projet de plusieurs façons : par un don, en suggérant des ingrédients
          ou des produits à analyser, ou en proposant des améliorations.
        </p>
      </div>
    </div>
  </div>
</header>




      {/* MAIN */}
      <main className={styles.main}>
        <div className="container">
          <section className={styles.grid}>
            {/* CARD 1 */}
            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} aria-hidden="true">💚</span>
                <h2>Soutenir financièrement le projet</h2>
              </div>

              <p className={styles.lead}>Les dons permettent de :</p>
              <ul className={styles.list}>
                <li>financer l’hébergement et le développement du site</li>
                <li>améliorer les outils d’analyse et de recherche</li>
                <li>maintenir un contenu indépendant, sans sponsoring</li>
              </ul>

              <p className={styles.meta}>
                Don libre, ponctuel ou récurrent. <br />
                Aucun contenu n’est réservé aux donateurs.
              </p>

              <div className={styles.actions}>
                <a
                  className={`button button--primary ${styles.buttonPrimary}`}
                  href="https://buy.stripe.com/eVqeVfccT82N21Ba1DfrW00"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💚 Faire un don
                </a>
              </div>
            </article>

            {/* CARD 2 */}
            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} aria-hidden="true">🧪</span>
                <h2>Proposer des idées et enrichir Fideta</h2>
              </div>

              <p className={styles.lead}>Vous pouvez suggérer :</p>
              <ul className={styles.list}>
                <li>un ingrédient à analyser</li>
                <li>un produit spécifique</li>
                <li>un thème ou une question scientifique</li>
              </ul>

              <p className={styles.meta}>
                Ces suggestions aident à prioriser les prochaines analyses selon les besoins réels.
              </p>

              <div className={styles.actions}>
                <a
                  className={`button button--primary ${styles.buttonPrimary}`}
                  href="https://tally.so/r/eqRVqJ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Suggérer un ingrédient / produit
                </a>
              </div>
            </article>

            {/* CARD 3 */}
            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} aria-hidden="true">🛠️</span>
                <h2>Participer à l’amélioration du site</h2>
              </div>

              <p className={styles.lead}>Vous pouvez aider en :</p>
              <ul className={styles.list}>
                <li>signalant un bug</li>
                <li>proposant une amélioration UX</li>
                <li>suggérant une fonctionnalité (comparaison, filtres, arbres de décision…)</li>
              </ul>

              <div className={styles.actions}>
                <a
                  className={`button button--primary ${styles.buttonPrimary}`}
                  href="https://tally.so/r/eqRVqJ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Proposer une amélioration
                </a>
              </div>
            </article>

            {/* CARD 4 */}
            <article className={`${styles.card} ${styles.cardSoft}`}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} aria-hidden="true">🔒</span>
                <h2>Indépendance & transparence</h2>
              </div>

              <p className={styles.metaStrong}>
                Fideta ne reçoit aucun financement de marques de compléments alimentaires.
              </p>
              <p className={styles.meta}>
                Les contributions financières ou intellectuelles n’influencent jamais les analyses publiées.
              </p>
              <p className={styles.thanks}>Merci pour votre soutien.</p>
            </article>
          </section>
        </div>
      </main>
    </Layout>
  );
}
