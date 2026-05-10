'use client';

import { usePlannerStore } from '@/store/usePlannerStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import EventDetails from '@/components/event/EventDetails';
import GuestList from '@/components/guests/GuestList';
import Budget from '@/components/budget/Budget';
import TaskList from '@/components/tasks/TaskList';
import Timeline from '@/components/timeline/Timeline';
import Ideas from '@/components/ideas/Ideas';
import FoodCalculator from '@/components/food/FoodCalculator';
import ShoppingList from '@/components/shopping/ShoppingList';

const TABS: Record<string, React.ComponentType> = {
  event: EventDetails,
  guests: GuestList,
  budget: Budget,
  tasks: TaskList,
  timeline: Timeline,
  ideas: Ideas,
  food: FoodCalculator,
  shopping: ShoppingList,
};

const TAB_LABELS: Record<string, string> = {
  event: '🎂 Событие',
  guests: '👥 Гости',
  budget: '💰 Бюджет',
  tasks: '✅ Задачи',
  timeline: '⏱️ Таймлайн',
  ideas: '💡 Идеи',
  food: '🍽️ Еда',
  shopping: '🛒 Покупки',
};

export default function Home() {
  const { activeTab, setActiveTab } = usePlannerStore();
  const ActiveComponent = TABS[activeTab] ?? EventDetails;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />

        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            padding: '10px 20px',
            gap: 4,
            borderBottom: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.02)',
            scrollbarWidth: 'none',
          }}
        >
          {Object.entries(TAB_LABELS).map(([id, label]) => (
            <button
              key={id}
              className={`tab-pill ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
              style={{ fontSize: 12, padding: '6px 14px' }}
            >
              {label}
            </button>
          ))}
        </div>

        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
