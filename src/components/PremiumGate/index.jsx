import React from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '../../context/AuthContext';

export default function PremiumGate({ children }) {
  const { loading, isLoggedIn, isPremium } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className="card padding--lg">
        <h3>Connexion requise</h3>
        <p>Connecte-toi pour accéder à cette fonctionnalité.</p>
        <Link className="button button--primary" to="/connexion">
          Se connecter
        </Link>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="card padding--lg">
        <h3>Fideta Plus</h3>
        <p>Tu es connecté, mais cette fonctionnalité est réservée au premium.</p>
      </div>
    );
  }

  return <>{children}</>;
}