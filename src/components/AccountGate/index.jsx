import React from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '../../context/AuthContext';

export default function AccountGate({ children }) {
  const { loading, isLoggedIn } = useAuth();
  if (isLoggedIn && !loading) return children;

  return (
    <main className="container margin-vert--xl">
      <h1>Fideta Plus</h1>
      {loading ? <p role="status">Chargement…</p> : (
        <>
          <p>Connectez-vous pour explorer les analyses par indication clinique. La création du compte est gratuite.</p>
          <Link className="button button--primary" to="/connexion?intent=clinique">
            Se connecter ou créer un compte
          </Link>
        </>
      )}
    </main>
  );
}
