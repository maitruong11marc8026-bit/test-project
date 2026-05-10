# 🎉 Birthday Planner App

Современное приложение для планирования дня рождения с расчётом еды и автоматическим списком покупок.

## Стек технологий

- **Framework**: Next.js 16 (App Router)
- **Язык**: TypeScript
- **Стили**: Tailwind CSS + кастомный CSS
- **Состояние**: Zustand + LocalStorage (persist)

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Главная страница (SPA)
│   └── globals.css         # Глобальные стили + CSS-переменные
├── components/
│   ├── layout/             # Sidebar, Header
│   ├── event/              # EventDetails
│   ├── guests/             # GuestList
│   ├── budget/             # Budget
│   ├── tasks/              # TaskList
│   ├── timeline/           # Timeline
│   ├── ideas/              # Ideas
│   ├── food/               # FoodCalculator
│   └── shopping/           # ShoppingList
├── store/
│   └── usePlannerStore.ts  # Zustand store с LocalStorage
├── types/
│   └── index.ts            # TypeScript типы
├── data/
│   └── dishes.ts           # Базовые блюда с ингредиентами
└── utils/
    └── calculations.ts     # Расчёты, нормализация, экспорт
```

## Функционал

### 🎂 Событие
- Название, дата, время, место, описание
- Типы: Детский / Взрослый / Тематический
- Обратный отсчёт до события

### 👥 Гости
- Добавление/удаление, статусы (Приглашён / Подтвердил / Отказался)
- Учёт детей ×0.6 при расчёте порций
- Фильтрация, статистика

### 💰 Бюджет
- Общий бюджет с редактированием
- Категории: Еда / Декор / Развлечения / Прочее
- Прогресс-бар и остаток в реальном времени

### ✅ Задачи
- Приоритеты (Низкий / Средний / Высокий) и дедлайны
- Предупреждение о просроченных задачах
- Прогресс выполнения

### ⏱️ Таймлайн
- Блоки расписания с временем и длительностью
- Хронологическая сортировка, редактирование по клику

### 💡 Идеи
- Цветные карточки с заметками
- Создание, редактирование, удаление

### 🍽️ Расчёт еды
- Форматы: Фуршет / Банкет / Детский
- Нормы: закуски, основное, салаты, десерт, торт, вода, напитки, алкоголь
- Коэффициент запаса (0–30%), учёт детей ×0.6
- Редактирование норм, выбор блюд
- Авто-конвертация г→кг, мл→л

### 🛒 Список покупок
- Автогенерация из выбранных блюд и количества гостей
- Суммирование одинаковых ингредиентов, нормализация названий
- Группировка по категориям (Овощи / Мясо / Напитки / Бакалея / ...)
- Чекбоксы "куплено", прогресс
- Ручное добавление/редактирование
- Экспорт: CSV, копирование в буфер обмена

## Модели данных

| Модель | Ключевые поля |
|--------|------|
| `Guest` | name, contact, status (invited/confirmed/declined), isChild |
| `BirthdayEvent` | title, date, time, location, type (adults/kids/themed) |
| `Task` | title, deadline, priority (low/medium/high), status |
| `Expense` | title, amount, category (food/decor/entertainment/other) |
| `Dish` | name, category, portionPerPerson, ingredients[] |
| `Ingredient` | name, amount, unit, category |
| `ShoppingItem` | name, amount, unit, category, isPurchased, isCustom |

## Ключевые функции

- `calculateFood(guests, settings)` — расчёт норм еды/напитков
- `generateShoppingListFromDishes(dishes, count, factor)` — список покупок из блюд
- `normalizeIngredientName(name)` — нормализация (картошка = картофель)
- `formatAmount(amount, unit)` — конвертация г→кг, мл→л
- `exportToCSV(items)` / `downloadCSV()` — экспорт

## Хранение данных

Все данные сохраняются в **LocalStorage** через Zustand persist middleware. Данные не теряются при перезагрузке.
