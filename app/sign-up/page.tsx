"use client";

import { useState } from "react";
import Link from "next/link";
import { logAction, registerEvaluationAccount } from "@/app/actions";
import {
  API_NAME,
  EVALUATION_PROFILE,
  randomTenDigitMobile,
} from "@/lib/evaluation-defaults";
import RocketBlast from "@/notification_app_fe/components/RocketBlast";
import ThemeToggle from "@/notification_app_fe/components/ThemeToggle";
import styles from "@/app/auth/AuthShell.module.css";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    clientID: string;
    clientSecret: string;
  } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    await logAction(
      "frontend",
      "info",
      "auth",
      `Register attempt for ${EVALUATION_PROFILE.email}`,
    );
    const result = await registerEvaluationAccount({
      ...EVALUATION_PROFILE,
      name: API_NAME,
      mobileNo: randomTenDigitMobile(),
    });
    if (!result.ok) {
      setError(result.message);
      await logAction("frontend", "error", "auth", result.message);
      setLoading(false);
      return;
    }
    localStorage.setItem("clientID", result.clientID);
    localStorage.setItem("clientSecret", result.clientSecret);
    setDone({ clientID: result.clientID, clientSecret: result.clientSecret });
    await logAction("frontend", "info", "auth", "Registration successful");
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

          {error ? <p className={styles.formError}>{error}</p> : null}
          {done ? (
            <div className={styles.successCallout}>
              <strong>Credentials stored locally.</strong> You can sign in on
              this device.
              <code>Client ID: {done.clientID}</code>
              <code>Client secret: {done.clientSecret}</code>
              <Link
                href="/auth"
                className={styles.link}
                style={{ display: "inline-block", marginTop: 12 }}
              >
                Sign in →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="su-email">
                  Email
                </label>
                <input
                  id="su-email"
                  type="email"
                  value={EVALUATION_PROFILE.email}
                  disabled
                  className={styles.input}
                  readOnly
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="su-roll">
                  Roll number
                </label>
                <input
                  id="su-roll"
                  type="text"
                  value={EVALUATION_PROFILE.rollNo}
                  disabled
                  className={styles.input}
                  readOnly
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={styles.button}
              >
                {loading ? "Registering…" : "Register"}
              </button>
            </form>
          )}
          <p className={styles.footer}>
            Already registered?{" "}
            <Link href="/auth" className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
