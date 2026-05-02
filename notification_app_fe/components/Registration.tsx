'use client';

import { useState } from 'react';
import { registerEvaluationAccount } from '@/app/actions';
import styles from './Registration.module.css';

interface RegistrationResponse {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

interface RegistrationProps {
  onSuccess: (creds: {
    clientID: string;
    clientSecret: string;
    email: string;
    name: string;
    rollNo: string;
    accessCode: string;
  }) => void;
}

export default function Registration({ onSuccess }: RegistrationProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    mobileNo: '',
    githubUsername: '',
    rollNo: '',
    accessCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [credentials, setCredentials] = useState<RegistrationResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await registerEvaluationAccount(formData);
      if (!result.ok) {
        throw new Error(result.message);
      }

      const data: RegistrationResponse = {
        email: result.email,
        name: result.name,
        rollNo: result.rollNo,
        accessCode: result.accessCode,
        clientID: result.clientID,
        clientSecret: result.clientSecret,
      };

      setCredentials(data);
      setSuccess(true);

      localStorage.setItem('clientID', data.clientID);
      localStorage.setItem('clientSecret', data.clientSecret);

      setFormData({
        email: '',
        name: '',
        mobileNo: '',
        githubUsername: '',
        rollNo: '',
        accessCode: '',
      });

      onSuccess({
        clientID: data.clientID,
        clientSecret: data.clientSecret,
        email: data.email,
        name: data.name,
        rollNo: data.rollNo,
        accessCode: data.accessCode,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Registration</h1>
        <p className={styles.subtitle}>
          Register with our Test Server to obtain your unique Client ID and Client Secret.
        </p>

        {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
        {success && <div className={styles.alert + ' ' + styles.success}>Registration successful! Your credentials have been saved.</div>}

        {!success ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@college.edu"
                required
              />
              <small>Must be your university/college email</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rollNo">Roll Number *</label>
              <input
                type="text"
                id="rollNo"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="Your Roll Number"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="mobileNo">Mobile Number *</label>
              <input
                type="tel"
                id="mobileNo"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="9999999999"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="githubUsername">GitHub Username *</label>
              <input
                type="text"
                id="githubUsername"
                name="githubUsername"
                value={formData.githubUsername}
                onChange={handleChange}
                placeholder="your-github-username"
                required
              />
              <small>Only the username part from https://github.com/username</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="accessCode">Access Code *</label>
              <input
                type="text"
                id="accessCode"
                name="accessCode"
                value={formData.accessCode}
                onChange={handleChange}
                placeholder="xgAsNC"
                required
              />
              <small>Shared via your email</small>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        ) : (
          <div className={styles.successBox}>
            <h2>Registration Successful!</h2>
            <div className={styles.credentialBox}>
              <p><strong>Client ID:</strong></p>
              <code>{credentials?.clientID}</code>
              <p><strong>Client Secret:</strong></p>
              <code>{credentials?.clientSecret}</code>
            </div>
            <p className={styles.warning}>
              ⚠️ Save these credentials securely. You cannot retrieve them again.
            </p>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setCredentials(null);
              }}
              className={styles.buttonSecondary}
            >
              Register Another Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
