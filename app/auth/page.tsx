'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logAction } from '@/app/actions';
import { useTheme } from '@/notification_app_fe/context/ThemeContext';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await logAction('frontend', 'info', 'auth', `Login attempt for ${email}`);
    if (email) {
      localStorage.setItem('accessToken', 'mock-token-' + Date.now());
      await logAction('frontend', 'info', 'auth', 'Login successful');
      router.push('/');
    } else {
      await logAction('frontend', 'error', 'auth', 'Login failed - empty email');
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <div className={styles.abstract}></div>
      </div>
      <div className={styles.rightPane}>
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
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  );
}
