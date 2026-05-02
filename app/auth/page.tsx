'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { commitMockSession, logAction } from '@/app/actions';
import RocketBlast from '@/notification_app_fe/components/RocketBlast';
import ThemeToggle from '@/notification_app_fe/components/ThemeToggle';
import styles from './AuthShell.module.css';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await logAction('frontend', 'info', 'auth', `Login attempt for ${email}`);
    if (email) {
      const token = await commitMockSession();
      localStorage.setItem('accessToken', token);
      await logAction('frontend', 'info', 'auth', 'Login successful');
      router.push('/');
    } else {
      await logAction('frontend', 'error', 'auth', 'Login failed - empty email');
    }
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
        <div className={styles.content}>
          <h1 className={styles.title}>Sign in to Notifications</h1>
          <p className={styles.subtitle}>Continue with email</p>
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className={styles.input}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className={styles.footer}>
            Not on Notifications? <Link href="/sign-up" className={styles.link}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
