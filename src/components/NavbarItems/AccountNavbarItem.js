import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import './mobileNavbar.css';
import { useAuth } from '../../context/AuthContext';

export default function AccountNavbarItem({ mobile, className }) {
  const { loading, isLoggedIn } = useAuth();

  const connexionUrl = useBaseUrl('/connexion');
  const compteUrl = useBaseUrl('/compte');

  const to = isLoggedIn ? compteUrl : connexionUrl;
  const label = loading ? '...' : isLoggedIn ? 'Mes fiches' : 'Se connecter';

  // These actions stay in the top bar on mobile, rather than the drawer.
  if (mobile) return null;

  return (
    <Link
      to={to}
      className={clsx(
        'navbar__item navbar__link fideta-navbar-account',
        className
      )}
    >
      {label}
    </Link>
  );
}

