import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useGlobalData from '@docusaurus/useGlobalData';
import { useAuth } from '../context/AuthContext';
import {
  getUserFavorites,
  getUserHistory,
  removeFavorite,
} from '../lib/accountData';

function SectionCard({ title, children }) {
  return (
    <section
      className="card padding--lg"
      style={{
        marginBottom: '24px',
        borderRadius: '16px',
      }}
    >
      <h2 style={{ marginBottom: '12px' }}>{title}</h2>
      {children}
    </section>
  );
}

function EmptyState({ children }) {
  return (
    <p style={{ marginBottom: 0, color: 'var(--ifm-color-emphasis-700)' }}>
      {children}
    </p>
  );
}

function getPluginDocs(globalData, pluginName) {
  const pluginData = globalData?.[pluginName];

  if (!pluginData) return [];

  for (const value of Object.values(pluginData)) {
    if (Array.isArray(value)) {
      return value;
    }

    if (value && Array.isArray(value.items)) {
      return value.items;
    }
  }

  return [];
}

function normalizeLookupPath(path) {
  if (!path) return '';
  return path.trim().replace(/\/+$/, '');
}

function buildDocsLookup(docs) {
  const lookup = new Map();

  (docs || []).forEach((doc) => {
    const key = normalizeLookupPath(doc.slug);
    if (key) {
      lookup.set(key, doc);
    }
  });

  return lookup;
}

function enrichItemsWithDocsData(items, docsLookup) {
  return (items || []).map((item) => {
    const key = normalizeLookupPath(item.fiche_path);
    const doc = docsLookup.get(key);

    return {
      ...item,
      resolvedTitle: doc?.title || item.fiche_title,
      resolvedImage: doc?.image || '',
      resolvedPath: key || item.fiche_path,
    };
  });
}

function FicheThumbnail({ src, alt }) {
  if (!src) {
    return (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 12,
          background: 'var(--ifm-color-emphasis-200)',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        width: 64,
        height: 64,
        objectFit: 'cover',
        borderRadius: 12,
        flexShrink: 0,
      }}
    />
  );
}

export default function ComptePage() {
  const { supabase, loading, user, plan, isLoggedIn, signOut } = useAuth();
  const globalData = useGlobalData();

  const homeUrl = useBaseUrl('/');
  const connexionUrl = useBaseUrl('/connexion');
  const cliniqueUrl = useBaseUrl('/clinique');

  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');
  const [removingPath, setRemovingPath] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const principesDocs = useMemo(() => {
    return getPluginDocs(globalData, 'principes-frontmatter');
  }, [globalData]);

  const produitsDocs = useMemo(() => {
    return getPluginDocs(globalData, 'produits-frontmatter');
  }, [globalData]);

  const docsLookup = useMemo(() => {
    return buildDocsLookup([...principesDocs, ...produitsDocs]);
  }, [principesDocs, produitsDocs]);

  const enrichedFavorites = useMemo(() => {
    return enrichItemsWithDocsData(favorites, docsLookup);
  }, [favorites, docsLookup]);

  const enrichedHistory = useMemo(() => {
    return enrichItemsWithDocsData(history, docsLookup);
  }, [history, docsLookup]);

  useEffect(() => {
    let cancelled = false;

    async function loadAccountData() {
      if (!isLoggedIn || !user?.id) {
        setFavorites([]);
        setHistory([]);
        setDataError('');
        setDataLoading(false);
        return;
      }

      setDataLoading(true);
      setDataError('');

      const [
        { data: favoritesData, error: favoritesError },
        { data: historyData, error: historyError },
      ] = await Promise.all([
        getUserFavorites(supabase, user.id),
        getUserHistory(supabase, user.id),
      ]);

      if (cancelled) return;

      if (favoritesError || historyError) {
        setDataError(
          favoritesError?.message ||
            historyError?.message ||
            'Erreur lors du chargement du compte.'
        );
        setFavorites([]);
        setHistory([]);
        setDataLoading(false);
        return;
      }

      setFavorites(favoritesData || []);
      setHistory(historyData || []);
      setDataLoading(false);
    }

    loadAccountData();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user?.id, supabase]);

  async function handleRemoveFavorite(fichePath) {
    if (!user?.id || !fichePath) return;

    setRemovingPath(fichePath);
    setDataError('');

    const { error } = await removeFavorite(supabase, user.id, fichePath);

    if (error) {
      setDataError(error.message || 'Impossible de retirer ce favori.');
      setRemovingPath('');
      return;
    }

    setFavorites((current) =>
      current.filter((item) => item.fiche_path !== fichePath)
    );
    setRemovingPath('');
  }

  async function handleSignOut() {
    setSigningOut(true);
    const { error } = await signOut();

    if (error) {
      setDataError(error.message || 'Erreur lors de la déconnexion.');
      setSigningOut(false);
      return;
    }

    window.location.href = homeUrl;
  }

  async function handleUpdatePassword(e) {
  e.preventDefault();

  setPasswordError('');
  setPasswordMessage('');

  if (!newPassword || !confirmPassword) {
    setPasswordError('Veuillez remplir les deux champs.');
    return;
  }

  if (newPassword.length < 8) {
    setPasswordError('Le mot de passe doit contenir au moins 8 caractères.');
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError('Les deux mots de passe ne correspondent pas.');
    return;
  }

  setPasswordBusy(true);

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    setPasswordError(
      error.message || 'Impossible de mettre à jour le mot de passe.'
    );
    setPasswordBusy(false);
    return;
  }

  setNewPassword('');
  setConfirmPassword('');
  setPasswordMessage('Mot de passe enregistré avec succès.');
  setPasswordBusy(false);
}

  return (
    <Layout title="Compte">
      <main className="container margin-vert--xl" style={{ maxWidth: 900 }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ marginBottom: '8px' }}>Compte</h1>
          <p style={{ marginBottom: 0, color: 'var(--ifm-color-emphasis-700)' }}>
            Retrouvez vos favoris, votre historique et vos informations de compte.
          </p>
        </header>

        {loading && (
          <div className="card padding--lg" style={{ borderRadius: '16px' }}>
            <p style={{ margin: 0 }}>Chargement...</p>
          </div>
        )}

        {!loading && !isLoggedIn && (
          <div className="card padding--lg" style={{ borderRadius: '16px' }}>
            <h2 style={{ marginBottom: '12px' }}>Vous n’êtes pas connecté</h2>
            <p>
              Connectez-vous pour accéder à votre espace personnel, enregistrer
              vos favoris et retrouver les dernières fiches consultées.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to={connexionUrl} className="button button--primary">
                Se connecter
              </Link>

              <Link to={homeUrl} className="button button--secondary">
                Retour à l’accueil
              </Link>
            </div>
          </div>
        )}

        {!loading && isLoggedIn && (
          <>
            <SectionCard title="Informations du compte">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <p style={{ marginBottom: '6px', fontWeight: 600 }}>Email</p>
                  <p style={{ marginBottom: 0 }}>{user?.email}</p>
                </div>

                <div>
                  <p style={{ marginBottom: '6px', fontWeight: 600 }}>Statut</p>
                  <p style={{ marginBottom: 0 }}>
                    {plan === 'premium' ? 'Premium' : 'Gratuit'}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginTop: '20px',
                }}
              >
                {plan !== 'premium' && (
                  <Link to={cliniqueUrl} className="button button--primary">
                    Découvrir Fideta Plus
                  </Link>
                )}

                <button
                  type="button"
                  className="button button--secondary"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  {signingOut ? 'Déconnexion...' : 'Se déconnecter'}
                </button>
              </div>
            </SectionCard>

            {dataError && (
              <div
                className="card padding--lg"
                style={{
                  marginBottom: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                }}
              >
                <p style={{ margin: 0, color: 'crimson' }}>{dataError}</p>
              </div>
            )}

            <SectionCard title="Mot de passe">


  <form onSubmit={handleUpdatePassword}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
      }}
    >
      <div>
        <label htmlFor="new-password" style={{ display: 'block', marginBottom: '6px' }}>
          Nouveau mot de passe
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          style={{ display: 'block', marginBottom: '6px' }}
        >
          Confirmer le mot de passe
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
      </div>
    </div>

    <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <button
        type="submit"
        className="button button--primary"
        disabled={passwordBusy}
      >
        {passwordBusy ? 'Enregistrement...' : 'Définir mon mot de passe'}
      </button>
    </div>

    {passwordMessage && (
      <p style={{ marginTop: '12px', marginBottom: 0, color: 'green' }}>
        {passwordMessage}
      </p>
    )}

    {passwordError && (
      <p style={{ marginTop: '12px', marginBottom: 0, color: 'crimson' }}>
        {passwordError}
      </p>
    )}
  </form>
</SectionCard>

            <SectionCard title="Favoris">
              {dataLoading ? (
                <p style={{ marginBottom: 0 }}>Chargement des favoris...</p>
              ) : enrichedFavorites.length === 0 ? (
                <EmptyState>Vous n’avez encore aucun favori.</EmptyState>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {enrichedFavorites.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: '1px solid var(--ifm-color-emphasis-300)',
                        borderRadius: '12px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '14px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <FicheThumbnail
                          src={item.resolvedImage}
                          alt={item.resolvedTitle}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: '12px',
                              alignItems: 'flex-start',
                              flexWrap: 'wrap',
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 220 }}>
                              <p
                                style={{
                                  marginBottom: '6px',
                                  fontWeight: 600,
                                  fontSize: '1rem',
                                }}
                              >
                                {item.resolvedTitle}
                              </p>
                              <p
                                style={{
                                  marginBottom: 0,
                                  color: 'var(--ifm-color-emphasis-700)',
                                  fontSize: '0.95rem',
                                }}
                              >
                                {item.fiche_type}
                              </p>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                              }}
                            >
                              <Link
                                to={item.resolvedPath}
                                className="button button--primary button--sm"
                              >
                                Ouvrir
                              </Link>

                              <button
                                type="button"
                                className="button button--secondary button--sm"
                                onClick={() =>
                                  handleRemoveFavorite(item.fiche_path)
                                }
                                disabled={removingPath === item.fiche_path}
                              >
                                {removingPath === item.fiche_path
                                  ? 'Retrait...'
                                  : 'Retirer'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Historique">
              {dataLoading ? (
                <p style={{ marginBottom: 0 }}>Chargement de l’historique...</p>
              ) : enrichedHistory.length === 0 ? (
                <EmptyState>
                  Vous n’avez pas encore consulté de fiche enregistrée dans votre
                  historique.
                </EmptyState>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {enrichedHistory.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: '1px solid var(--ifm-color-emphasis-300)',
                        borderRadius: '12px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '14px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <FicheThumbnail
                          src={item.resolvedImage}
                          alt={item.resolvedTitle}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: '12px',
                              alignItems: 'flex-start',
                              flexWrap: 'wrap',
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 220 }}>
                              <p
                                style={{
                                  marginBottom: '6px',
                                  fontWeight: 600,
                                  fontSize: '1rem',
                                }}
                              >
                                {item.resolvedTitle}
                              </p>
                              <p
                                style={{
                                  marginBottom: '6px',
                                  color: 'var(--ifm-color-emphasis-700)',
                                  fontSize: '0.95rem',
                                }}
                              >
                                {item.fiche_type}
                              </p>
                              <p
                                style={{
                                  marginBottom: 0,
                                  color: 'var(--ifm-color-emphasis-600)',
                                  fontSize: '0.9rem',
                                }}
                              >
                                Consulté le{' '}
                                {new Date(item.last_viewed_at).toLocaleString('fr-FR')}
                              </p>
                            </div>

                            <Link
                              to={item.resolvedPath}
                              className="button button--primary button--sm"
                            >
                              Ouvrir
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </>
        )}
      </main>
    </Layout>
  );
}