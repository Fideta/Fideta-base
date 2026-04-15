import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useAuth } from '../context/AuthContext';

export default function UpdatePasswordPage() {
  const { supabase } = useAuth();

  const connexionUrl = useBaseUrl('/connexion');
  const compteUrl = useBaseUrl('/compte');

  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setError(error.message || 'Impossible de vérifier le lien.');
        setLoading(false);
        return;
      }

      if (!session) {
        setError('Lien invalide ou expiré.');
        setLoading(false);
        return;
      }

      setSessionReady(true);
      setLoading(false);
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir les deux champs.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setBusy(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message || 'Impossible de mettre à jour le mot de passe.');
      setBusy(false);
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setMessage('Votre mot de passe a bien été réinitialisé.');
    setBusy(false);
  }

  return (
    <Layout title="Réinitialiser le mot de passe">
      <main className="container margin-vert--xl" style={{ maxWidth: 620 }}>
        <h1>Réinitialiser le mot de passe</h1>

        <div className="card padding--lg">
          {loading && <p>Chargement...</p>}

          {!loading && error && (
            <>
              <p style={{ color: 'crimson' }}>{error}</p>
              <Link to={connexionUrl} className="button button--primary">
                Retour à la connexion
              </Link>
            </>
          )}

          {!loading && sessionReady && !error && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="new-password">Nouveau mot de passe</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '8px',
                  marginBottom: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />

              <label htmlFor="confirm-password">Confirmer le mot de passe</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '8px',
                  marginBottom: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  className="button button--primary"
                  disabled={busy}
                >
                  {busy ? 'Enregistrement...' : 'Enregistrer le nouveau mot de passe'}
                </button>

                <Link to={compteUrl} className="button button--secondary">
                  Aller à mon compte
                </Link>
              </div>

              {message && (
                <p style={{ marginTop: '16px', color: 'green' }}>{message}</p>
              )}

              {error && (
                <p style={{ marginTop: '16px', color: 'crimson' }}>{error}</p>
              )}
            </form>
          )}
        </div>
      </main>
    </Layout>
  );
}