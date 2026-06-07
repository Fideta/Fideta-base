// src/theme/Root.js
import React, {useEffect} from 'react';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import {AuthProvider} from '../context/AuthContext';
import AccountEngagementPrompt from '../components/account/AccountEngagementPrompt';

const SAFETY_INFO_TEXT =
  "Les effets indésirables mentionnés sont issus des données disponibles dans la littérature sur les ingrédients du produit. Ils constituent un repère de sécurité, sans démontrer nécessairement que ces effets ont été observés avec le produit fini.";

function ScannerFAB() {
  const {pathname} = useLocation();

  if (pathname.startsWith('/scan')) return null;

  return (
    <Link to="/scan" className="fab-scan" aria-label="Ouvrir le scanner">
      <span className="fab-scan__icon" aria-hidden>
        📷
      </span>
      <span className="fab-scan__label">Scanner</span>
    </Link>
  );
}

function SafetyInfoInjector() {
  const {pathname} = useLocation();

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2'));

    headings.forEach((heading) => {
      const text = heading.textContent || '';
      const normalizedText = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const isSafetyHeading = normalizedText.includes(
        'securite et precautions'
      );

      if (!isSafetyHeading) return;
      if (heading.querySelector('.safety-info')) return;

      const wrapper = document.createElement('span');
      wrapper.className = 'safety-info';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'safety-info__trigger';
      button.setAttribute(
        'aria-label',
        'Précision sur les effets indésirables'
      );
      button.setAttribute('aria-expanded', 'false');
      button.textContent = 'i';

      const bubble = document.createElement('span');
      bubble.className = 'safety-info__bubble';
      bubble.textContent = SAFETY_INFO_TEXT;

      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = wrapper.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target)) {
          wrapper.classList.remove('is-open');
          button.setAttribute('aria-expanded', 'false');
        }
      });

      wrapper.appendChild(button);
      wrapper.appendChild(bubble);
      heading.appendChild(wrapper);
    });
  }, [pathname]);

  return null;
}

export default function Root({children}) {
  return (
    <AuthProvider>
      <>
        <Head>
          <link rel="icon" href="/img/favicon-48.png" sizes="48x48" />
          <link rel="icon" href="/img/favicon-96.png" sizes="96x96" />
          <link rel="icon" href="/img/favicon-192.png" sizes="192x192" />
          <link rel="apple-touch-icon" href="/img/favicon-192.png" />

          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Fideta',
              url: 'https://fideta.fr',
              logo: 'https://fideta.fr/img/favicon-192.png',
              sameAs: [
                'https://www.linkedin.com/company/fideta-app/',
                'https://x.com/Fideta_app',
              ],
            })}
          </script>
        </Head>

        <SafetyInfoInjector />
        <AccountEngagementPrompt />

        {children}
        <ScannerFAB />
      </>
    </AuthProvider>
  );
}
