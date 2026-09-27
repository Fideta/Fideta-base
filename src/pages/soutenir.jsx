import React from 'react';
import Layout from '@theme/Layout';
import DonationButtons from '../components/support/DonationButtons';
import styles from './soutenir.module.css';

export default function Soutenir() {
  return (
    <Layout
      title="Soutenir Fideta"
      description="Soutenez l’indépendance de Fideta et contribuez à la publication de nouvelles analyses scientifiques."
    >
      <header className={styles.hero}>
        <div className="container">
          <div className={styles.heroCenteredLeft}>
            <h1 className={styles.heroTitle}>Soutenir Fideta</h1>
            <p className={styles.heroLead}>
              Une analyse vous a aidé à y voir plus clair ?
              Votre soutien aide à publier les prochaines.
            </p>
            <p className={styles.heroText}>
              Je suis Thomas Gassies, docteur en pharmacie et créateur de Fideta.
              Je consulte les études, j’évalue les preuves et je mets les fiches à jour
              pour vous aider à faire des choix éclairés.
            </p>
            <p className={styles.metaStrong}>
              Fideta ne reçoit aucun financement des marques de compléments alimentaires.
            </p>
            <DonationButtons />
            <p className={styles.paymentNote}>
              Contribution ponctuelle, sans abonnement ni compte Fideta obligatoire.
              Paiement sécurisé par Stripe.
            </p>
            <p className={styles.meta}>
              Cette contribution ne donne pas accès à Fideta Plus et n’ouvre pas droit
              à une réduction fiscale. Les fiches restent consultables gratuitement.
            </p>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className={styles.main}>
        <div className="container">
          <section className={styles.grid}>
            {/* CARD 1 */}
            <article className={`${styles.card} ${styles.cardWide}`}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} aria-hidden="true">💚</span>
                <h2>Ce que votre soutien permet</h2>
              </div>

              <p className={styles.lead}>Votre contribution aide à consacrer du temps à :</p>
              <ul className={styles.list}>
                <li>rechercher et lire les études sur les ingrédients et les produits</li>
                <li>rédiger de nouvelles analyses et actualiser les fiches existantes</li>
                <li>développer et maintenir les outils de consultation du site</li>
              </ul>

              <p className={styles.meta}>
                Le montant est libre. Votre soutien ne modifie ni la méthode d’évaluation ni les conclusions des fiches.
              </p>
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
