'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './home-layout.module.css';

const Navigation = dynamic(() => import('../notification_app_fe/components/Navigation'), { ssr: false });
const PriorityInbox = dynamic(() => import('../notification_app_fe/components/PriorityInbox'), { ssr: false });
const AllNotifications = dynamic(() => import('../notification_app_fe/components/AllNotifications'), { ssr: false });

export default function Home() {
  const [currentView, setCurrentView] = useState<'all' | 'priority'>('priority');

  return (
    <div className={styles.shell}>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      <main className={styles.main}>
        {currentView === 'priority' ? (
          <PriorityInbox />
        ) : (
          <AllNotifications />
        )}
      </main>
    </div>
  );
}
