'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const ThemeProvider = dynamic(() => import('@/notification_app_fe/context/ThemeContext').then(m => ({ default: m.ThemeProvider })), { ssr: false });
const Navigation = dynamic(() => import('../notification_app_fe/components/Navigation'), { ssr: false });
const PriorityInbox = dynamic(() => import('../notification_app_fe/components/PriorityInbox'), { ssr: false });
const AllNotifications = dynamic(() => import('../notification_app_fe/components/AllNotifications'), { ssr: false });

export default function Home() {
  const [currentView, setCurrentView] = useState<'all' | 'priority'>('priority');

  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        
        <main>
          {currentView === 'priority' ? (
            <PriorityInbox />
          ) : (
            <AllNotifications />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
