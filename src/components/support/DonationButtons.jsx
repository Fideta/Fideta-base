import React from 'react';
import {DONATION_LINKS} from '../../config/donationLinks';
import styles from './DonationButtons.module.css';

function withTracking(href, source, content) {
  if (!href) return null;

  const url = new URL(href);
  url.searchParams.set('utm_source', 'fideta');
  url.searchParams.set('utm_medium', 'site');
  url.searchParams.set('utm_campaign', 'soutien');
  url.searchParams.set('utm_content', `${source}_${content}`);
  return url.toString();
}

export default function DonationButtons({source = 'page_soutenir'}) {
  return (
    <div className={styles.wrapper} aria-label="Choisir un montant de soutien">
      {DONATION_LINKS.map(({id, label, href}) => {
        const trackedHref = withTracking(href, source, id);

        if (!trackedHref) {
          return (
            <span
              key={id}
              className={`${styles.button} ${styles.disabled}`}
              aria-disabled="true"
              title="Lien Stripe à renseigner"
            >
              {label}
            </span>
          );
        }

        return (
          <a
            key={id}
            className={styles.button}
            href={trackedHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Soutenir Fideta à hauteur de ${label}`}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
