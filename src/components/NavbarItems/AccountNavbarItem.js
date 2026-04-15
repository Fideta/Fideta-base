import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

export default function AccountNavbarItem({ mobile, className }) {
  const { loading, isLoggedIn } = useAuth();

  const connexionUrl = useBaseUrl('/connexion');
  const compteUrl = useBaseUrl('/compte');

  const to = isLoggedIn ? compteUrl : connexionUrl;
  const label = loading ? '...' : isLoggedIn ? 'Compte' : 'Se connecter';

  return (
    <Link
      to={to}
      className={clsx(
        mobile ? 'menu__link' : 'navbar__item navbar__link',
        className
      )}
    >
      {label}
    </Link>
  );
}