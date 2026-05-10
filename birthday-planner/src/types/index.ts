export type EventType = 'kids' | 'adults' | 'themed';
export type PartyFormat = 'buffet' | 'banquet' | 'kids';
export type GuestStatus = 'invited' | 'confirmed' | 'declined';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type ExpenseCategory = 'food' | 'decor' | 'entertainment' | 'other';
export type IngredientCategory = 'vegetables' | 'meat' | 'drinks' | 'bakery' | 'dairy' | 'fruits' | 'other';

export interface Guest {
  id: string;
  name: string;
  contact: string;
  status: GuestStatus;
  isChild: boolean;
}

export interface BirthdayEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: EventType;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  order: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface Budget {
  total: number;
  expenses: Expense[];
}

export interface TimelineBlock {
  id: string;
  time: string;
  title: string;
  description: string;
  duration: number;
}

export interface Idea {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
}

export interface Dish {
  id: string;
  name: string;
  category: 'appetizer' | 'main' | 'salad' | 'dessert' | 'cake' | 'drink';
  ingredients: Ingredient[];
  portionPerPerson: number;
  unit: string;
  isSelected: boolean;
}

export interface FoodNorms {
  appetizer: { min: number; max: number };
  main: { min: number; max: number };
  salad: { min: number; max: number };
  dessert: { min: number; max: number };
  cake: { min: number; max: number };
  water: { min: number; max: number };
  softDrink: { min: number; max: number };
  wine: { min: number; max: number };
  spirits: { min: number; max: number };
}

export interface FoodSettings {
  partyFormat: PartyFormat;
  duration: number;
  includeAlcohol: boolean;
  safetyFactor: number;
  norms: FoodNorms;
}

export interface FoodCalculationResult {
  name: string;
  category: string;
  perPerson: number;
  total: number;
  unit: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
  isPurchased: boolean;
  isCustom: boolean;
}

export interface PlannerState {
  event: BirthdayEvent;
  guests: Guest[];
  budget: Budget;
  tasks: Task[];
  timeline: TimelineBlock[];
  ideas: Idea[];
  dishes: Dish[];
  foodSettings: FoodSettings;
  shoppingList: ShoppingItem[];
  activeTab: string;

  setEvent: (event: Partial<BirthdayEvent>) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (id: string, data: Partial<Guest>) => void;
  removeGuest: (id: string) => void;
  setBudgetTotal: (total: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'order'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  addTimelineBlock: (block: Omit<TimelineBlock, 'id'>) => void;
  updateTimelineBlock: (id: string, data: Partial<TimelineBlock>) => void;
  removeTimelineBlock: (id: string) => void;
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt'>) => void;
  updateIdea: (id: string, data: Partial<Idea>) => void;
  removeIdea: (id: string) => void;
  toggleDish: (id: string) => void;
  setFoodSettings: (settings: Partial<FoodSettings>) => void;
  generateShoppingList: () => void;
  updateShoppingItem: (id: string, data: Partial<ShoppingItem>) => void;
  addShoppingItem: (item: Omit<ShoppingItem, 'id'>) => void;
  removeShoppingItem: (id: string) => void;
  setActiveTab: (tab: string) => void;
}
