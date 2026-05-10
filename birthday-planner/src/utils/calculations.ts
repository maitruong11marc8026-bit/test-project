import type { FoodCalculationResult, FoodSettings, Guest, Dish, ShoppingItem, Ingredient } from '@/types';

export function getGuestCount(guests: Guest[]) {
  const adults = guests.filter(g => !g.isChild && g.status !== 'declined');
  const children = guests.filter(g => g.isChild && g.status !== 'declined');
  const effective = adults.length + children.length * 0.6;
  return { adults: adults.length, children: children.length, effective: Math.ceil(effective) };
}

export function calculateFood(guests: Guest[], settings: FoodSettings): FoodCalculationResult[] {
  const { effective } = getGuestCount(guests);
  const { norms, safetyFactor, includeAlcohol, partyFormat } = settings;
  const factor = safetyFactor;

  const avg = (range: { min: number; max: number }) =>
    Math.ceil(((range.min + range.max) / 2) * effective * factor);

  const results: FoodCalculationResult[] = [
    {
      name: 'Закуски',
      category: 'Еда',
      perPerson: Math.round((norms.appetizer.min + norms.appetizer.max) / 2),
      total: avg(norms.appetizer),
      unit: 'г',
    },
    {
      name: 'Основное блюдо',
      category: 'Еда',
      perPerson: Math.round((norms.main.min + norms.main.max) / 2),
      total: avg(norms.main),
      unit: 'г',
    },
    {
      name: 'Салаты',
      category: 'Еда',
      perPerson: Math.round((norms.salad.min + norms.salad.max) / 2),
      total: avg(norms.salad),
      unit: 'г',
    },
    {
      name: 'Десерт',
      category: 'Еда',
      perPerson: Math.round((norms.dessert.min + norms.dessert.max) / 2),
      total: avg(norms.dessert),
      unit: 'г',
    },
    {
      name: 'Торт',
      category: 'Еда',
      perPerson: Math.round((norms.cake.min + norms.cake.max) / 2),
      total: avg(norms.cake),
      unit: 'г',
    },
    {
      name: 'Вода',
      category: 'Напитки',
      perPerson: Math.round((norms.water.min + norms.water.max) / 2),
      total: avg(norms.water),
      unit: 'мл',
    },
    {
      name: 'Безалкогольные напитки',
      category: 'Напитки',
      perPerson: Math.round((norms.softDrink.min + norms.softDrink.max) / 2),
      total: avg(norms.softDrink),
      unit: 'мл',
    },
  ];

  if (includeAlcohol && partyFormat !== 'kids') {
    results.push({
      name: 'Вино',
      category: 'Алкоголь',
      perPerson: Math.round((norms.wine.min + norms.wine.max) / 2),
      total: avg(norms.wine),
      unit: 'мл',
    });
    results.push({
      name: 'Крепкий алкоголь',
      category: 'Алкоголь',
      perPerson: Math.round((norms.spirits.min + norms.spirits.max) / 2),
      total: avg(norms.spirits),
      unit: 'мл',
    });
  }

  return results;
}

const SYNONYMS: Record<string, string> = {
  картошка: 'картофель',
  помидор: 'томат',
  помидоры: 'томаты',
  лук: 'репчатый лук',
  зелень: 'свежая зелень',
};

export function normalizeIngredientName(name: string): string {
  const lower = name.toLowerCase().trim();
  return SYNONYMS[lower] ?? lower;
}

export function formatAmount(amount: number, unit: string): { amount: number; unit: string } {
  if (unit === 'г' && amount >= 1000) {
    return { amount: Math.round((amount / 1000) * 10) / 10, unit: 'кг' };
  }
  if (unit === 'мл' && amount >= 1000) {
    return { amount: Math.round((amount / 1000) * 10) / 10, unit: 'л' };
  }
  return { amount: Math.round(amount * 10) / 10, unit };
}

export function generateShoppingListFromDishes(
  dishes: Dish[],
  guestCount: number,
  safetyFactor: number
): ShoppingItem[] {
  const selected = dishes.filter(d => d.isSelected);
  const map = new Map<string, { amount: number; unit: string; category: Ingredient['category'] }>();

  for (const dish of selected) {
    for (const ing of dish.ingredients) {
      const key = normalizeIngredientName(ing.name);
      const totalAmount = ing.amount * guestCount * safetyFactor;
      if (map.has(key)) {
        const existing = map.get(key)!;
        if (existing.unit === ing.unit) {
          existing.amount += totalAmount;
        } else {
          map.set(`${key}_${ing.unit}`, { amount: totalAmount, unit: ing.unit, category: ing.category });
        }
      } else {
        map.set(key, { amount: totalAmount, unit: ing.unit, category: ing.category });
      }
    }
  }

  return Array.from(map.entries()).map(([name, data], idx) => {
    const formatted = formatAmount(data.amount, data.unit);
    return {
      id: `shopping-${idx}-${Date.now()}`,
      name,
      amount: formatted.amount,
      unit: formatted.unit,
      category: data.category,
      isPurchased: false,
      isCustom: false,
    };
  });
}

export function exportToCSV(items: ShoppingItem[]): string {
  const header = 'Название,Количество,Единица,Категория,Куплено';
  const rows = items.map(item =>
    `"${item.name}",${item.amount},"${item.unit}","${item.category}","${item.isPurchased ? 'Да' : 'Нет'}"`
  );
  return [header, ...rows].join('\n');
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(items: ShoppingItem[]): string {
  return items
    .map(item => `• ${item.name}: ${item.amount} ${item.unit}`)
    .join('\n');
}
