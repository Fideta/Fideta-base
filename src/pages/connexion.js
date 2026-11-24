import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useAuth } from '../context/AuthContext';
import { addFavorite } from '../lib/accountData';

export default function ConnexionPage() {
  const {
    supabase,
    loading,
    user,
    isLoggedIn,
    sendLoginCode,
    verifyLoginCode,
    signInWithPassword,
    sendPasswordReset,
    signOut,
    refreshAuth,
  } = useAuth();

  const accountUrl = useBaseUrl('/compte');
  const fidetaPlusUrl = useBaseUrl('/clinique');
  const updatePasswordPath = useBaseUrl('/update-password');

  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [intent, setIntent] = useState(null);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const nextIntent = params.get('intent');
    const nextRedirect = params.get('redirect');

    if (nextIntent === 'clinique') {
      setIntent('clinique');
      setMode('otp');
      setRedirectPath(fidetaPlusUrl);
    } else if (nextIntent === 'favorite' || nextIntent === 'engagement') {
      setIntent(nextIntent);
      setMode('otp');
    }

    if (
      nextIntent !== 'clinique' &&
      nextRedirect &&
      nextRedirect.startsWith('/') &&
      !nextRedirect.startsWith('//')
    ) {
      setRedirectPath(nextRedirect);
    }
  }, [fidetaPlusUrl]);

  useEffect(() => {
    if (isLoggedIn) {
      setStep('connected');
    }
  }, [isLoggedIn]);

  async function completePostLogin(authUserId) {
    let nextMessage = 'Connexion réussie.';
    let nextRedirectPath = redirectPath;

    if (typeof window !== 'undefined' && authUserId) {
      const rawPendingFavorite = window.sessionStorage.getItem(
        'fideta_pending_favorite'
      );

      if (rawPendingFavorite) {
        try {
          const pendingFavorite = JSON.parse(rawPendingFavorite);
          const { error: favoriteError } = await addFavorite(
            supabase,
            authUserId,
            pendingFavorite
          );

          if (favoriteError) {
            console.error('Erreur ajout favori après connexion :', favoriteError.message);
          } else {
            window.sessionStorage.removeItem('fideta_pending_favorite');
            nextMessage = 'Connexion réussie. Fiche ajoutée à vos favoris.';
            if (intent !== 'clinique' && pendingFavorite?.path) {
              nextRedirectPath = pendingFavorite.path;
            }
          }
        } catch (parseError) {
          console.error('Favori en attente illisible :', parseError);
          window.sessionStorage.removeItem('fideta_pending_favorite');
        }
      }
    }

    await refreshAuth();
    setMessage(nextMessage);
    setStep('connected');

    if (intent && nextRedirectPath && typeof window !== 'undefined') {
      window.setTimeout(() => {
        window.location.href = nextRedirectPath;
      }, 600);
    }
  }

  async function handlePasswordLogin(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await signInWithPassword(cleanEmail, password);

    if (error) {
      setError(error.message || 'Connexion impossible.');
      setBusy(false);
      return;
    }

    setEmail(cleanEmail);
    setPassword('');
    await completePostLogin(data?.user?.id || user?.id);
    setBusy(false);
  }

  async function handleSendCode(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await sendLoginCode(cleanEmail);

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    setEmail(cleanEmail);
    setStep('otp');
    setMessage('Code envoyé par email.');
    setBusy(false);
  }

  async function handleForgotPassword() {
    setError('');
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        'Entrez votre adresse email pour recevoir le lien de réinitialisation.'
      );
      return;
    }

    setBusy(true);

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}${updatePasswordPath}`
        : undefined;

    const { error } = await sendPasswordReset(cleanEmail, redirectTo);

    if (error) {
      setError(
        error.message || 'Impossible d’envoyer l’email de réinitialisation.'
      );
      setBusy(false);
      return;
    }

    setMessage('Email de réinitialisation envoyé.');
    setBusy(false);
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    const { data, error } = await verifyLoginCode(
      email.trim().toLowerCase(),
      token.trim()
    );

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    setToken('');
    await completePostLogin(data?.user?.id || user?.id);
    setBusy(false);
  }

  async function handleSignOut() {
    setBusy(true);
    setError('');
    setMessage('');

    const { error } = await signOut();

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    setEmail('');
    setPassword('');
    setToken('');
    setStep('email');
    setMessage('Déconnexion réussie.');
    setBusy(false);
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
    setMessage('');
    setPassword('');
    setToken('');
    setStep('email');
  }

  const pageTitle = intent === 'favorite'
    ? 'Sauvegarder cette fiche'
    : intent === 'engagement'
      ? 'Créer un compte Fideta gratuit'
      : 'Connexion à Fideta';

  const pageSubtitle = intent === 'favorite'
    ? 'Entrez votre email pour créer un compte gratuit ou vous connecter, puis retrouver cette fiche dans vos favoris.'
    : intent === 'engagement'
      ? 'Entrez votre email pour créer un compte gratuit ou vous connecter. Vous pourrez conserver vos favoris et votre historique.'
      : intent === 'clinique'
        ? 'Recevez un code par email pour accéder à Fideta Plus, même lors de votre première connexion.'
        : 'Connectez-vous par mot de passe ou avec un code envoyé par email.';

  const otpButtonLabel = intent && intent !== 'clinique'
    ? 'Créer mon compte gratuit'
    : 'Recevoir un code';

  return (
    <Layout title={pageTitle}>
      <main
        className="container margin-vert--xl"
        style={{ maxWidth: 900 }}
      >
        <header style={{ marginBottom: '26px' }}>
          <h1 style={{ marginBottom: '10px' }}>{pageTitle}</h1>
          <p
            style={{
              margin: 0,
              color: '#7a8691',
              fontSize: '1.02rem',
            }}
          >
            {pageSubtitle}
          </p>
        </header>


        <div
          className="card padding--lg"
          style={{
            borderRadius: '24px',
            border: '1px solid #e2e6e2',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          {loading && <p>Chargement...</p>}

          {!loading && !isLoggedIn && (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginBottom: '22px',
                }}
              >
                <button
                  type="button"
                  className={`button ${
                    mode === 'password' ? 'button--primary' : 'button--secondary'
                  }`}
                  onClick={() => switchMode('password')}
                  disabled={busy}
                  style={
                    mode === 'password'
                      ? {
                          background: '#2f7d56',
                          borderColor: '#2f7d56',
                          color: '#fff',
                          borderRadius: '12px',
                          minWidth: 140,
                          fontWeight: 700,
                        }
                      : {
                          background: '#eef1ee',
                          borderColor: '#d9dfd9',
                          color: '#1b1f1d',
                          borderRadius: '12px',
                          minWidth: 140,
                          fontWeight: 700,
                        }
                  }
                >
                  Mot de passe
                </button>

                <button
                  type="button"
                  className={`button ${
                    mode === 'otp' ? 'button--primary' : 'button--secondary'
                  }`}
                  onClick={() => switchMode('otp')}
                  disabled={busy}
                  style={
                    mode === 'otp'
                      ? {
                          background: '#2f7d56',
                          borderColor: '#2f7d56',
                          color: '#fff',
                          borderRadius: '12px',
                          minWidth: 140,
                          fontWeight: 700,
                        }
                      : {
                          background: '#eef1ee',
                          borderColor: '#d9dfd9',
                          color: '#1b1f1d',
                          borderRadius: '12px',
                          minWidth: 140,
                          fontWeight: 700,
                        }
                  }
                >
                  Première connexion
                </button>
              </div>

              {mode === 'password' && step === 'email' && (
                <form onSubmit={handlePasswordLogin}>
                  <label htmlFor="email-password">Adresse email</label>
                  <input
                    id="email-password"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      marginTop: '8px',
                      marginBottom: '18px',
                      borderRadius: '12px',
                      border: '1px solid #cfd7cf',
                      background: '#fff',
                    }}
                  />

                  <label htmlFor="password">Mot de passe</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    required
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      marginTop: '8px',
                      marginBottom: '18px',
                      borderRadius: '12px',
                      border: '1px solid #cfd7cf',
                      background: '#fff',
                    }}
                  />

                  <button
                    type="submit"
                    className="button button--primary"
                    disabled={busy}
                    style={{
                      background: '#2f7d56',
                      borderColor: '#2f7d56',
                      borderRadius: '12px',
                      paddingInline: '20px',
                      fontWeight: 700,
                    }}
                  >
                    {busy ? 'Connexion...' : 'Se connecter'}
                  </button>

                  <div style={{ marginTop: '14px' }}>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={busy}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        color: '#2f7d56',
                        fontWeight: 600,
                        cursor: busy ? 'default' : 'pointer',
                      }}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                </form>
              )}

              {mode === 'otp' && step === 'email' && (
                <form onSubmit={handleSendCode}>
                  <label htmlFor="email-otp">Adresse email</label>
                  <input
                    id="email-otp"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      marginTop: '8px',
                      marginBottom: '18px',
                      borderRadius: '12px',
                      border: '1px solid #cfd7cf',
                      background: '#fff',
                    }}
                  />

                  <button
                    type="submit"
                    className="button button--primary"
                    disabled={busy}
                    style={{
                      background: '#2f7d56',
                      borderColor: '#2f7d56',
                      borderRadius: '12px',
                      paddingInline: '20px',
                      fontWeight: 700,
                    }}
                  >
                    {busy ? 'Envoi...' : otpButtonLabel}
                  </button>
                </form>
              )}

              {mode === 'otp' && step === 'otp' && (
                <form onSubmit={handleVerifyCode}>
                  <p>
                    Code envoyé à <strong>{email}</strong>
                  </p>

                  <label htmlFor="token">Code reçu par email</label>
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="123456"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      marginTop: '8px',
                      marginBottom: '18px',
                      borderRadius: '12px',
                      border: '1px solid #cfd7cf',
                      background: '#fff',
                    }}
                  />

                  <div
                    style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
                  >
                    <button
                      type="submit"
                      className="button button--primary"
                      disabled={busy}
                      style={{
                        background: '#2f7d56',
                        borderColor: '#2f7d56',
                        borderRadius: '12px',
                        paddingInline: '20px',
                        fontWeight: 700,
                      }}
                    >
                      {busy ? 'Vérification...' : 'Valider le code'}
                    </button>

                    <button
                      type="button"
                      className="button button--secondary"
                      onClick={() => {
                        setStep('email');
                        setToken('');
                        setMessage('');
                        setError('');
                      }}
                      disabled={busy}
                      style={{
                        borderRadius: '12px',
                        fontWeight: 700,
                      }}
                    >
                      Changer d’email
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {!loading && isLoggedIn && (
            <div>
              <p>
                <strong>Vous êtes connecté à Fideta.</strong>
              </p>
              <p>
                <strong>Email :</strong> {user?.email}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  to={accountUrl}
                  className="button button--primary"
                  style={{
                    background: '#2f7d56',
                    borderColor: '#2f7d56',
                    borderRadius: '12px',
                    fontWeight: 700,
                  }}
                >
                  Aller à mon compte
                </Link>

                <button
                  type="button"
                  className="button button--secondary"
                  onClick={handleSignOut}
                  disabled={busy}
                  style={{
                    borderRadius: '12px',
                    fontWeight: 700,
                  }}
                >
                  {busy ? '...' : 'Se déconnecter'}
                </button>
              </div>
            </div>
          )}

          {message && (
            <p style={{ marginTop: '16px', color: 'green' }}>{message}</p>
          )}

          {error && (
            <p style={{ marginTop: '16px', color: 'crimson' }}>{error}</p>
          )}
        </div>
      </main>
    </Layout>
  );
}
