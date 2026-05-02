'use client';

import { useTheme } from '../context/ThemeContext';
import { MdModeNight, MdWbSunny } from 'react-icons/md';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MdModeNight /> : <MdWbSunny />}
    </button>
  );
}
