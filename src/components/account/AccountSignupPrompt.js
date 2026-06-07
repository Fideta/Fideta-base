import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useLocation} from '@docusaurus/router';

function buildSafeRedirect(location, explicitRedirectPath) {
  if (explicitRedirectPath && explicitRedirectPath.startsWith('/') && !explicitRedirectPath.startsWith('//')) {
    return explicitRedirectPath;
  }

  const pathname = location?.pathname || '/';
  const search = location?.search || '';
  const hash = location?.hash || '';
  return `${pathname}${search}${hash}`;
}

export default function AccountSignupPrompt({
  open,
  variant = 'engagement',
  redirectPath,
  onClose,
  onPrimaryClick,
}) {
  const location = useLocation();
  const connexionUrl = useBaseUrl('/connexion');

  if (!open) return null;

  const isFavorite = variant === 'favorite';
  const safeRedirect = buildSafeRedirect(location, redirectPath);
  const href = `${connexionUrl}?intent=${isFavorite ? 'favorite' : 'engagement'}&redirect=${encodeURIComponent(safeRedirect)}`;

  const title = isFavorite
    ? 'Sauvegarder cette fiche'
    : 'Retrouvez vos recherches plus tard';

  const text = isFavorite
    ? 'Créez un compte Fideta gratuit pour ajouter cette fiche à vos favoris et la retrouver facilement depuis votre espace personnel.'
    : 'Créez un compte gratuit pour conserver votre historique de consultation et ajouter des fiches en favoris. Les fiches restent consultables sans compte.';

  const primaryLabel = isFavorite
    ? 'Créer mon compte gratuit'
    : 'Activer mon espace gratuit';

  const secondaryLabel = isFavorite
    ? 'Continuer sans sauvegarder'
    : 'Continuer sans compte';

  function handlePrimaryClick() {
    if (typeof onPrimaryClick === 'function') {
      onPrimaryClick();
    }
  }

  return (
    <div className="account-prompt" role="presentation">
      <div className="account-prompt__backdrop" onClick={onClose} />
      <section
        className="account-prompt__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-prompt-title"
      >
        <button
          type="button"
          className="account-prompt__close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>

        <div className="account-prompt__badge">Compte gratuit</div>

        <h2 id="account-prompt-title" className="account-prompt__title">
          {title}
        </h2>

        <p className="account-prompt__text">{text}</p>

        <ul className="account-prompt__list">
          <li>Favoris pour retrouver les fiches importantes</li>
          <li>Historique de consultation conservé dans votre espace</li>
          <li>Création rapide par code email</li>
        </ul>

        <div className="account-prompt__actions">
          <a
            href={href}
            className="account-prompt__primary"
            onClick={handlePrimaryClick}
          >
            {primaryLabel}
          </a>

          <button
            type="button"
            className="account-prompt__secondary"
            onClick={onClose}
          >
            {secondaryLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
