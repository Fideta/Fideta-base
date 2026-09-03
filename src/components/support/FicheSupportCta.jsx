import React from 'react';
import Link from '@docusaurus/Link';
import styles from './FicheSupportCta.module.css';

export default function FicheSupportCta() {
  return (
    <aside className={styles.cta} aria-labelledby="fiche-support-title">
      <div>
        <h2 id="fiche-support-title" className={styles.title}>
          Cette fiche vous a été utile ?
        </h2>
        <p className={styles.text}>
          Fideta reste indépendant des marques. Votre soutien aide à financer les
          prochaines analyses et les mises à jour scientifiques.
        </p>
      </div>

      <Link className={`button button--primary ${styles.button}`} to="/soutenir">
        Soutenir Fideta
      </Link>
    </aside>
  );
}
