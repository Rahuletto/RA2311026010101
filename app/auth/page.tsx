'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logAction, signInWithEvaluationService } from '@/app/actions';
import { EVALUATION_PROFILE, LS_REGISTERED_NAME } from '@/lib/evaluation-defaults';
import RocketBlast from '@/notification_app_fe/components/RocketBlast';
import ThemeToggle from '@/notification_app_fe/components/ThemeToggle';
import styles from './AuthShell.module.css';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [clientID, setClientID] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [needsName, setNeedsName] = useState(false);
  const [needsClientCreds, setNeedsClientCreds] = useState(false);

  useEffect(() => {
    const n = localStorage.getItem(LS_REGISTERED_NAME) || '';
    setName(n);
    setNeedsName(!n.trim());

    const cid = localStorage.getItem('clientID') || '';
    const cs = localStorage.getItem('clientSecret') || '';
    setClientID(cid);
    setClientSecret(cs);
    setNeedsClientCreds(!cid.trim() || !cs.trim());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    await logAction('frontend', 'info', 'auth', `Login attempt for ${EVALUATION_PROFILE.email}`);
    const result = await signInWithEvaluationService({
      email: EVALUATION_PROFILE.email,
      name: name.trim(),
      rollNo: EVALUATION_PROFILE.rollNo,
      accessCode: EVALUATION_PROFILE.accessCode,
      clientID: clientID.trim(),
      clientSecret: clientSecret.trim(),
    });
    if (!result.ok) {
      setError(result.message);
      await logAction('frontend', 'error', 'auth', result.message);
      setLoading(false);
      return;
    }
    localStorage.setItem('clientID', clientID.trim());
    localStorage.setItem('clientSecret', clientSecret.trim());
    localStorage.setItem(LS_REGISTERED_NAME, name.trim());
    await logAction('frontend', 'info', 'auth', 'Login successful');
    router.push('/');
    setLoading(false);
  };

  const canSubmit = name.trim() && clientID.trim() && clientSecret.trim();

  return (
    <div className={styles.container}>
      <aside className={styles.leftPane} aria-hidden="true">
        <RocketBlast />
      </aside>
      <div className={styles.rightPane}>
        <div className={styles.themeToggleWrap}>
          <ThemeToggle />
        </div>
        <div className={`${styles.content} ${styles.contentWide}`}>
          <h1 className={styles.title}>Sign in</h1>
          <p className={styles.subtitle}>
            Uses your evaluation profile below. Client ID and secret are filled in after you register
            on this device; paste them if you cleared storage.
          </p>
          <p className={styles.profileSummary}>
            {EVALUATION_PROFILE.email} · {EVALUATION_PROFILE.rollNo} · @{EVALUATION_PROFILE.githubUsername}
          </p>
          {error ? <p className={styles.formError}>{error}</p> : null}
          <form onSubmit={handleLogin} className={styles.form}>
            {needsName ? (
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="name">
                  Name (must match registration)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className={styles.input}
                />
              </div>
            ) : (
              <p className={styles.fieldHint}>
                Signed in as <strong>{name}</strong> — same name as at registration.{' '}
                <button
                  type="button"
                  className={styles.link}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    font: 'inherit',
                  }}
                  onClick={() => setNeedsName(true)}
                >
                  Change
                </button>
              </p>
            )}

            {needsClientCreds ? (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="clientID">
                    Client ID
                  </label>
                  <input
                    id="clientID"
                    type="text"
                    value={clientID}
                    onChange={(e) => setClientID(e.target.value)}
                    required
                    className={styles.input}
                    placeholder="From registration response"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="clientSecret">
                    Client secret
                  </label>
                  <input
                    id="clientSecret"
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    required
                    autoComplete="off"
                    className={styles.input}
                  />
                </div>
              </>
            ) : (
              <p className={styles.fieldHint}>
                Client credentials loaded from this browser.{' '}
                <button
                  type="button"
                  className={styles.link}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    font: 'inherit',
                  }}
                  onClick={() => setNeedsClientCreds(true)}
                >
                  Paste different
                </button>
              </p>
            )}

            <button type="submit" disabled={loading || !canSubmit} className={styles.button}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className={styles.footer}>
            New here? <Link href="/sign-up" className={styles.link}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
