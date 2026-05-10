'use client';

import { useState, useEffect } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import EventDetails from '@/components/event/EventDetails';
import GuestList from '@/components/guests/GuestList';
import Budget from '@/components/budget/Budget';
import TaskList from '@/components/tasks/TaskList';
import Timeline from '@/components/timeline/Timeline';
import Ideas from '@/components/ideas/Ideas';
import FoodCalculator from '@/components/food/FoodCalculator';
import ShoppingList from '@/components/shopping/ShoppingList';
import OnboardingModal from '@/components/ui/OnboardingModal';

const TABS: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  event:     EventDetails,
  guests:    GuestList,
  budget:    Budget,
  tasks:     TaskList,
  timeline:  Timeline,
  ideas:     Ideas,
  food:      FoodCalculator,
  shopping:  ShoppingList,
};

const TAB_META: Record<string, { label: string; icon: string }> = {
  dashboard: { label: 'Дашборд',  icon: '📊' },
  event:     { label: 'Событие',  icon: '🎂' },
  guests:    { label: 'Гости',    icon: '👥' },
  budget:    { label: 'Бюджет',   icon: '💰' },
  tasks:     { label: 'Задачи',   icon: '✅' },
  timeline:  { label: 'Таймлайн', icon: '⏱️' },
  ideas:     { label: 'Идеи',     icon: '💡' },
  food:      { label: 'Еда',      icon: '🍽️' },
  shopping:  { label: 'Покупки',  icon: '🛒' },
};

export default function AppPage() {
  const { activeTab, setActiveTab } = usePlannerStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileSidebar, setMobileSidebar]   = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('bp_onboarded')) setShowOnboarding(true);
  }, []);

  const ActiveComponent = TABS[activeTab] ?? Dashboard;

  return (
    <>
      {showOnboarding && (
        <OnboardingModal onClose={() => {
          localStorage.setItem('bp_onboarded', '1');
          setShowOnboarding(false);
        }} />
      )}

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Mobile overlay */}
        {mobileSidebar && (
          <div
            onClick={() => setMobileSidebar(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 40, backdropFilter: 'blur(3px)' }}
          />
        )}

        {/* Mobile sidebar */}
        <div
          className="mobile-sidebar"
          style={{
            position: 'fixed', top: 0, bottom: 0, left: mobileSidebar ? 0 : -240,
            zIndex: 50, transition: 'left 0.28s ease',
          }}
        >
          <Sidebar onClose={() => setMobileSidebar(false)} />
        </div>

        {/* Desktop sidebar */}
        <div className="desktop-sidebar">
          <Sidebar />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <Header onMenuClick={() => setMobileSidebar(true)} />

          {/* Tab bar */}
          <div style={{
            display: 'flex', overflowX: 'auto', gap: 2,
            padding: '8px 16px', flexShrink: 0,
            borderBottom: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.015)',
            scrollbarWidth: 'none',
          }}>
            {Object.entries(TAB_META).map(([id, { label, icon }]) => (
              <button
                key={id}
                className={`tab-pill ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                <span>{icon}</span>
                <span className="tab-label">{label}</span>
              </button>
            ))}
          </div>

          {/* Page content — key forces remount & fade-in on tab change */}
          <main
            key={activeTab}
            className="tab-content"
            style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}
          >
            <ActiveComponent />
          </main>
        </div>
      </div>
    </>
  );
}
