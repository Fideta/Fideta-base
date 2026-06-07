import React, {useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import AccountSignupPrompt from './AccountSignupPrompt';
import {
  isFavorite,
  toggleFavorite,
  recordHistoryView,
} from '../../lib/accountData';

const PENDING_FAVORITE_KEY = 'fideta_pending_favorite';

export default function FicheAccountActions({path, title, type = 'fiche'}) {
  const {supabase, user, isLoggedIn} = useAuth();

  const [favorite, setFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initAccountState() {
      if (!path || !title) return;

      if (!isLoggedIn || !user?.id) {
        if (!cancelled) {
          setFavorite(false);
        }
        return;
      }

      const fiche = {path, title, type};

      const [{data: favoriteState}, historyResult] = await Promise.all([
        isFavorite(supabase, user.id, path),
        recordHistoryView(supabase, user.id, fiche),
      ]);

      if (cancelled) return;

      setFavorite(!!favoriteState);

      if (historyResult?.error) {
        console.error('Erreur historique :', historyResult.error.message);
      }
    }

    initAccountState();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user?.id, supabase, path, title, type]);

  async function handleClick() {
    if (!isLoggedIn || !user?.id) {
      setShowSignupPrompt(true);
      return;
    }

    setLoadingFavorite(true);

    const {isFavorite: nextFavoriteState, error} = await toggleFavorite(
      supabase,
      user.id,
      {path, title, type}
    );

    if (error) {
      console.error('Erreur favoris :', error.message);
      setLoadingFavorite(false);
      return;
    }

    setFavorite(nextFavoriteState);
    setLoadingFavorite(false);
  }

  function storePendingFavorite() {
    if (typeof window === 'undefined') return;

    window.sessionStorage.setItem(
      PENDING_FAVORITE_KEY,
      JSON.stringify({path, title, type})
    );
  }

  const label = !isLoggedIn
    ? 'Sauvegarder cette fiche avec un compte gratuit'
    : favorite
      ? 'Retirer des favoris'
      : 'Ajouter aux favoris';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loadingFavorite}
        aria-label={label}
        title={label}
        style={{
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          padding: 0,
          margin: 0,
          cursor: loadingFavorite ? 'default' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 0,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            display: 'block',
            transition: 'transform 0.15s ease, opacity 0.15s ease',
            opacity: loadingFavorite ? 0.6 : 1,
            transform: loadingFavorite ? 'scale(0.96)' : 'scale(1)',
          }}
        >
          <path
            d="M12 2.5l2.93 5.94 6.56.95-4.74 4.62 1.12 6.53L12 17.77 6.13 20.54l1.12-6.53L2.51 9.39l6.56-.95L12 2.5z"
            fill={favorite ? '#2e8555' : 'transparent'}
            stroke="#2e8555"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AccountSignupPrompt
        open={showSignupPrompt}
        variant="favorite"
        redirectPath={path}
        onClose={() => setShowSignupPrompt(false)}
        onPrimaryClick={storePendingFavorite}
      />
    </>
  );
}
