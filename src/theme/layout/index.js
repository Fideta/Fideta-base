import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';

function ScannerFAB() {
  const {pathname} = useLocation();

  // Ne pas afficher le bouton sur la page du scanner
  if (pathname.startsWith('/scan')) return null;

  return (
    <Link to="/scan" className="fab-scan" aria-label="Ouvrir le scanner">
      <span className="fab-scan__icon" aria-hidden>📷</span>
      <span className="fab-scan__label">Scanner</span>
    </Link>
  );
}

export default function Layout(props) {
  return (
    <>
      <OriginalLayout {...props} />
      <ScannerFAB />
    </>
  );
}
