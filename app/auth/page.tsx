'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logAction, signInWithEvaluationService } from '@/app/actions';
import {
  API_NAME,
  EVALUATION_PROFILE,
  ensureClientCredsInStorage,
} from '@/lib/evaluation-defaults';
import RocketBlast from '@/notification_app_fe/components/RocketBlast';
import ThemeToggle from '@/notification_app_fe/components/ThemeToggle';
import styles from './AuthShell.module.css';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureClientCredsInStorage();
    setReady(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { clientID, clientSecret } = ensureClientCredsInStorage();
    await logAction('frontend', 'info', 'auth', `Login attempt for ${EVALUATION_PROFILE.email}`);
    const result = await signInWithEvaluationService({
      email: EVALUATION_PROFILE.email,
      name: API_NAME,
      rollNo: EVALUATION_PROFILE.rollNo,
      accessCode: EVALUATION_PROFILE.accessCode,
      clientID,
      clientSecret,
    });
    if (!result.ok) {
      setError(result.message);
      await logAction('frontend', 'error', 'auth', result.message);
      setLoading(false);
      return;
    }
    await logAction('frontend', 'info', 'auth', 'Login successful');
    router.push('/');
    setLoading(false);
  };

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
            Client ID and secret load from this browser, or defaults when none are stored yet.
          </p>
          {error ? <p className={styles.formError}>{error}</p> : null}
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={EVALUATION_PROFILE.email}
                disabled
                className={styles.input}
                readOnly
                autoComplete="username"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="rollNo">
                Roll number
              </label>
              <input
                id="rollNo"
                type="text"
                value={EVALUATION_PROFILE.rollNo}
                disabled
                className={styles.input}
                readOnly
              />
            </div>
            <button type="submit" disabled={loading || !ready} className={styles.button}>
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
