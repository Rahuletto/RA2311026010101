'use client';

import { useState } from 'react';
import { signInWithEvaluationService } from '@/app/actions';
import styles from './Authentication.module.css';

interface AuthProps {
  clientID: string;
  clientSecret: string;
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  onSuccess: (token: string, expiresIn: number) => void;
}

export default function Authentication({
  clientID,
  clientSecret,
  email,
  name,
  rollNo,
  accessCode,
  onSuccess,
}: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const handleAuthenticate = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithEvaluationService({
        email,
        name,
        rollNo,
        accessCode,
        clientID,
        clientSecret,
      });

      if (!result.ok) {
        throw new Error(result.message);
      }

      setOk(true);
      onSuccess('', 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h2 className={styles.title}>Get Authorization Token</h2>
        <p className={styles.description}>
          After successful registration, obtain an Authorization Token to access the Test Server APIs.
        </p>

        {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}

        {!ok ? (
          <div>
            <div className={styles.infoBox}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Client ID:</span>
                <code className={styles.code}>{clientID}</code>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Client Secret:</span>
                <code className={styles.code}>{clientSecret}</code>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAuthenticate}
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Authenticating...' : 'Get Authorization Token'}
            </button>
          </div>
        ) : (
          <div className={styles.successBox}>
            <h3>✓ Authentication Successful</h3>
            <p className={styles.note}>
              Bearer token is stored in an httpOnly <code>auth_token</code> cookie. The app uses it for
              server-side API calls.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
