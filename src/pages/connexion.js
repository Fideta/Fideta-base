import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useAuth } from '../context/AuthContext';

export default function ConnexionPage() {
  const {
    loading,
    user,
    plan,
    isLoggedIn,
    sendLoginCode,
    verifyLoginCode,
    signInWithPassword,
    sendPasswordReset,
    signOut,
  } = useAuth();

  const accountUrl = useBaseUrl('/compte');
  const updatePasswordPath = useBaseUrl('/update-password');
  const fidetaPlusUrl = useBaseUrl('/clinique');

  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setStep('connected');
    }
  }, [isLoggedIn]);

  async function handlePasswordLogin(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await signInWithPassword(cleanEmail, password);

    if (error) {
      setError(error.message || 'Connexion impossible.');
      setBusy(false);
      return;
    }

    setEmail(cleanEmail);
    setPassword('');
    setMessage('Connexion réussie.');
    setStep('connected');
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

    const { error } = await verifyLoginCode(
      email.trim().toLowerCase(),
      token.trim()
    );

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    setToken('');
    setMessage('Connexion réussie.');
    setStep('connected');
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

  return (
    <Layout title="Connexion">
      <main
        className="container margin-vert--xl"
        style={{ maxWidth: 900 }}
      >
        <header style={{ marginBottom: '26px' }}>
          <h1 style={{ marginBottom: '10px' }}>Connexion à Fideta</h1>
          <p
            style={{
              margin: 0,
              color: '#7a8691',
              fontSize: '1.02rem',
            }}
          >
            Connectez-vous par mot de passe ou avec un code envoyé par email.
          </p>
        </header>

        {!loading && !isLoggedIn && (
          <div
            style={{
              marginBottom: '22px',
              padding: '26px',
              borderRadius: '24px',
              background: '#f3f7f3',
              border: '1px solid #dbe6db',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '18px',
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #d8e3d8',
                  borderRadius: '22px',
                  padding: '22px',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: '#e8f1e8',
                    color: '#2f6f52',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    marginBottom: '16px',
                  }}
                >
                  Compte gratuit
                </div>

                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: '10px',
                    fontSize: '2rem',
                    lineHeight: 1.05,
                    color: '#123d2f',
                  }}
                >
                  Organisez vos lectures
                </h2>

                <p
                  style={{
                    marginTop: 0,
                    marginBottom: '18px',
                    color: '#5f6d76',
                    lineHeight: 1.7,
                    fontSize: '1.02rem',
                  }}
                >
                  Créez un compte gratuit pour retrouver facilement les fiches
                  qui vous intéressent et continuer votre lecture plus tard.
                </p>

                <div
                  style={{
                    width: '68px',
                    height: '1px',
                    background: '#d7dfd7',
                    marginBottom: '18px',
                  }}
                />

                <div
                  style={{
                    display: 'grid',
                    gap: '12px',
                    color: '#475660',
                    lineHeight: 1.55,
                  }}
                >
                  <p style={{ margin: 0 }}>• Enregistrez vos fiches favorites</p>
                  <p style={{ margin: 0 }}>
                    • Retrouvez votre historique de consultation
                  </p>
                  <p style={{ margin: 0 }}>
                    • Accédez à votre espace personnel
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: '#f8f4eb',
                  border: '1px solid #dfd1a4',
                  borderRadius: '22px',
                  padding: '22px',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: '#e7d8a8',
                    color: '#23322b',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    marginBottom: '16px',
                  }}
                >
                  Fideta Plus 🔒
                </div>

                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: '10px',
                    fontSize: '2rem',
                    lineHeight: 1.05,
                    color: '#123d2f',
                  }}
                >
                  Accès avancé
                </h2>

                <p
                  style={{
                    marginTop: 0,
                    marginBottom: '18px',
                    color: '#5f6d76',
                    lineHeight: 1.7,
                    fontSize: '1.02rem',
                  }}
                >
                  La recherche clinique par indication fait partie de Fideta
                  Plus.
                </p>

                <div
                  style={{
                    width: '68px',
                    height: '1px',
                    background: '#d9ceb1',
                    marginBottom: '18px',
                  }}
                />

                <div
                  style={{
                    display: 'grid',
                    gap: '12px',
                    color: '#475660',
                    lineHeight: 1.55,
                    marginBottom: '20px',
                  }}
                >
                  <p style={{ margin: 0 }}>
                    • Recherche par indication clinique
                  </p>
                  <p style={{ margin: 0 }}>
                    • Classement scientifique des ingrédients
                  </p>
                  <p style={{ margin: 0 }}>
                    • Repérage plus rapide des produits pertinents
                  </p>
                </div>

                <Link
                  to={fidetaPlusUrl}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    background: '#123d2f',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  Découvrir Fideta Plus
                </Link>
              </div>
            </div>

            <p
              style={{
                marginTop: '18px',
                marginBottom: 0,
                color: '#7a8691',
                fontSize: '0.98rem',
              }}
            >
              Les fiches de base restent consultables sans compte.
            </p>
          </div>
        )}

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
                  Code email
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
                    {busy ? 'Envoi...' : 'Recevoir un code'}
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
              <p>
                <strong>Statut :</strong>{' '}
                {plan === 'premium' ? 'Premium' : 'Gratuit'}
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