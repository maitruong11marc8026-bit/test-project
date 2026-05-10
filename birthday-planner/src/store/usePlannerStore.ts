'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlannerState, BirthdayEvent, Guest, Task, Expense, TimelineBlock, Idea, FoodSettings, ShoppingItem, Dish } from '@/types';
import { DEFAULT_DISHES } from '@/data/dishes';
import { generateShoppingListFromDishes, getGuestCount } from '@/utils/calculations';

const DEFAULT_EVENT: BirthdayEvent = {
  id: 'event-1',
  title: 'День рождения',
  date: '',
  time: '18:00',
  location: '',
  description: '',
  type: 'adults',
};

const DEFAULT_FOOD_SETTINGS: FoodSettings = {
  partyFormat: 'banquet',
  duration: 4,
  includeAlcohol: true,
  safetyFactor: 1.15,
  norms: {
    appetizer: { min: 150, max: 300 },
    main: { min: 250, max: 400 },
    salad: { min: 150, max: 250 },
    dessert: { min: 100, max: 150 },
    cake: { min: 120, max: 150 },
    water: { min: 500, max: 1000 },
    softDrink: { min: 300, max: 700 },
    wine: { min: 300, max: 500 },
    spirits: { min: 100, max: 300 },
  },
};

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      event: DEFAULT_EVENT,
      guests: [],
      budget: { total: 50000, expenses: [] },
      tasks: [],
      timeline: [],
      ideas: [],
      dishes: DEFAULT_DISHES,
      foodSettings: DEFAULT_FOOD_SETTINGS,
      shoppingList: [],
      activeTab: 'event',

      setEvent: (data) =>
        set(s => ({ event: { ...s.event, ...data } })),

      addGuest: (guest) =>
        set(s => ({ guests: [...s.guests, { ...guest, id: genId() }] })),

      updateGuest: (id, data) =>
        set(s => ({ guests: s.guests.map(g => g.id === id ? { ...g, ...data } : g) })),

      removeGuest: (id) =>
        set(s => ({ guests: s.guests.filter(g => g.id !== id) })),

      setBudgetTotal: (total) =>
        set(s => ({ budget: { ...s.budget, total } })),

      addExpense: (expense) =>
        set(s => ({ budget: { ...s.budget, expenses: [...s.budget.expenses, { ...expense, id: genId() }] } })),

      updateExpense: (id, data) =>
        set(s => ({
          budget: {
            ...s.budget,
            expenses: s.budget.expenses.map(e => e.id === id ? { ...e, ...data } : e),
          },
        })),

      removeExpense: (id) =>
        set(s => ({
          budget: { ...s.budget, expenses: s.budget.expenses.filter(e => e.id !== id) },
        })),

      addTask: (task) =>
        set(s => ({
          tasks: [...s.tasks, { ...task, id: genId(), order: s.tasks.length }],
        })),

      updateTask: (id, data) =>
        set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...data } : t) })),

      removeTask: (id) =>
        set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),

      reorderTasks: (tasks) => set({ tasks }),

      addTimelineBlock: (block) =>
        set(s => ({ timeline: [...s.timeline, { ...block, id: genId() }] })),

      updateTimelineBlock: (id, data) =>
        set(s => ({ timeline: s.timeline.map(b => b.id === id ? { ...b, ...data } : b) })),

      removeTimelineBlock: (id) =>
        set(s => ({ timeline: s.timeline.filter(b => b.id !== id) })),

      addIdea: (idea) =>
        set(s => ({
          ideas: [...s.ideas, { ...idea, id: genId(), createdAt: new Date().toISOString() }],
        })),

      updateIdea: (id, data) =>
        set(s => ({ ideas: s.ideas.map(i => i.id === id ? { ...i, ...data } : i) })),

      removeIdea: (id) =>
        set(s => ({ ideas: s.ideas.filter(i => i.id !== id) })),

      toggleDish: (id) =>
        set(s => ({
          dishes: s.dishes.map(d => d.id === id ? { ...d, isSelected: !d.isSelected } : d),
        })),

      setFoodSettings: (settings) =>
        set(s => ({ foodSettings: { ...s.foodSettings, ...settings } })),

      generateShoppingList: () => {
        const { guests, dishes, foodSettings } = get();
        const { effective } = getGuestCount(guests);
        const count = effective || 1;
        const list = generateShoppingListFromDishes(dishes, count, foodSettings.safetyFactor);
        set({ shoppingList: list });
      },

      updateShoppingItem: (id, data) =>
        set(s => ({ shoppingList: s.shoppingList.map(i => i.id === id ? { ...i, ...data } : i) })),

      addShoppingItem: (item) =>
        set(s => ({ shoppingList: [...s.shoppingList, { ...item, id: genId() }] })),

      removeShoppingItem: (id) =>
        set(s => ({ shoppingList: s.shoppingList.filter(i => i.id !== id) })),

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'birthday-planner',
    }
  )
);
