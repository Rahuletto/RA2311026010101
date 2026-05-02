"use client";

import { useCallback } from "react";
import { MdNotifications, MdPriorityHigh } from "react-icons/md";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navigation.module.css";

interface NavigationProps {
  currentView: "all" | "priority";
  onViewChange: (view: "all" | "priority") => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const handleViewChange = useCallback(
    (view: "all" | "priority") => {
      onViewChange(view);
    },
    [onViewChange]
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <MdNotifications className={styles.logo} />
          <h1 className={styles.title}>Notifications</h1>
        </div>

        <div className={styles.navLinks}>
          <button
            type="button"
            className={`${styles.navButton} ${currentView === "all" ? styles.active : ""}`}
            onClick={() => handleViewChange("all")}
            title="View all notifications"
          >
            <MdNotifications />
            All
          </button>
          <button
            type="button"
            className={`${styles.navButton} ${currentView === "priority" ? styles.active : ""}`}
            onClick={() => handleViewChange("priority")}
            title="View priority inbox"
          >
            <MdPriorityHigh />
            Priority
          </button>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
