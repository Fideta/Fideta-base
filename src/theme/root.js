// src/theme/Root.js
import React from 'react';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';

export default function Root({ children }) {
  return (
    <>
      <Head>
        {/* Multi-favicon */}
        <link rel="icon" href="/img/favicon-48.png" sizes="48x48" />
        <link rel="icon" href="/img/favicon-96.png" sizes="96x96" />
        <link rel="icon" href="/img/favicon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/img/favicon-192.png" />

        {/* Données structurées Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Fideta",
            url: "https://fideta.fr",
            logo: "https://fideta.fr/img/favicon-192.png",
            sameAs: [
              "https://www.linkedin.com/company/fideta-app/",
              "https://x.com/Fideta_app"
            ]
          })}
        </script>
      </Head>
      {children}
    </>
  );
}
function ScannerFAB() {
  const {pathname} = useLocation();

  // Ne pas afficher le bouton sur la page scanner
  if (pathname.startsWith('/scan')) return null;

  return (
    <Link to="/scan" className="fab-scan" aria-label="Ouvrir le scanner">
      <span className="fab-scan__icon" aria-hidden>📷</span>
      <span className="fab-scan__label">Scanner</span>
    </Link>
  );
}

export default function Root({children}) {
  return (
    <>
      {children}
      <ScannerFAB />
    </>
  );
}