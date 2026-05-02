'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logAction } from '@/app/actions';
import styles from './SignUpPage.module.css';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await logAction('frontend', 'info', 'auth', `Sign up attempt for ${email}`);
    if (email) {
      localStorage.setItem('accessToken', 'mock-token-' + Date.now());
      await logAction('frontend', 'info', 'auth', 'Sign up successful');
      router.push('/');
    } else {
      await logAction('frontend', 'error', 'auth', 'Sign up failed - empty email');
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>Get started with Notifications</p>
        <form onSubmit={handleSignUp} className={styles.form}>
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
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link href="/auth" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
