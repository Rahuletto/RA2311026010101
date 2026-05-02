'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logAction, registerEvaluationAccount } from '@/app/actions';
import { EVALUATION_PROFILE, LS_REGISTERED_NAME } from '@/lib/evaluation-defaults';
import RocketBlast from '@/notification_app_fe/components/RocketBlast';
import ThemeToggle from '@/notification_app_fe/components/ThemeToggle';
import styles from '@/app/auth/AuthShell.module.css';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ clientID: string; clientSecret: string } | null>(null);
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    await logAction('frontend', 'info', 'auth', `Register attempt for ${EVALUATION_PROFILE.email}`);
    const result = await registerEvaluationAccount({
      ...EVALUATION_PROFILE,
      name: name.trim(),
      mobileNo: mobileNo.trim(),
    });
    if (!result.ok) {
      setError(result.message);
      await logAction('frontend', 'error', 'auth', result.message);
      setLoading(false);
      return;
    }
    localStorage.setItem('clientID', result.clientID);
    localStorage.setItem('clientSecret', result.clientSecret);
    localStorage.setItem(LS_REGISTERED_NAME, name.trim());
    setDone({ clientID: result.clientID, clientSecret: result.clientSecret });
    await logAction('frontend', 'info', 'auth', 'Registration successful');
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
          <h1 className={styles.title}>Register</h1>
          <p className={styles.subtitle}>
            Evaluation profile (email, roll no., GitHub, access code) is already configured. Enter
            your display name and mobile — one-time registration; save the client credentials you
            get back.
          </p>
          <p className={styles.profileSummary}>
            {EVALUATION_PROFILE.email} · {EVALUATION_PROFILE.rollNo} · @{EVALUATION_PROFILE.githubUsername}
          </p>
          {error ? <p className={styles.formError}>{error}</p> : null}
          {done ? (
            <div className={styles.successCallout}>
              <strong>Registration successful.</strong> Store these credentials, then sign in.
              <code>Client ID: {done.clientID}</code>
              <code>Client secret: {done.clientSecret}</code>
              <Link href="/auth" className={styles.link} style={{ display: 'inline-block', marginTop: 12 }}>
                Continue to sign in →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="su-name">
                  Your name
                </label>
                <input
                  id="su-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="As used for evaluation"
                  autoComplete="name"
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="su-mobile">
                  Mobile
                </label>
                <input
                  id="su-mobile"
                  type="tel"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="10-digit mobile"
                  autoComplete="tel"
                />
              </div>
              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Registering…' : 'Register'}
              </button>
            </form>
          )}
          <p className={styles.footer}>
            Already registered? <Link href="/auth" className={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
