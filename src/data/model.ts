export type Restaurant = { id: string; name: string };
export const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
export type Meal = (typeof mealTypes)[number];
export type MealEntry = { id: string; date: string; meal: Meal; food: string };

export const mealNames = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' } as const;
export const defaultRestaurants: Restaurant[] = ['Campus Cafe', 'Noodle House', 'Pizza Corner', 'Rice Bowl']
  .map((name, index) => ({ id: `starter-${index + 1}`, name }));

export function localDate(value = new Date()) {
  return [String(value.getFullYear()).padStart(4, '0'), String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0')].join('-');
}

export function parseLocalDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  const value = new Date(0);
  value.setHours(12, 0, 0, 0);
  value.setFullYear(year, month - 1, day);
  return value;
}

export function shiftDay(date: string, days: number) {
  const value = parseLocalDate(date);
  value.setDate(value.getDate() + days);
  return localDate(value);
}

export function restaurantError(name: string, restaurants: Restaurant[]) {
  if (!name.trim()) return 'Enter a restaurant name.';
  if (restaurants.some(item => item.name.trim().toLowerCase() === name.trim().toLowerCase())) {
    return 'That restaurant is already on your list.';
  }
  if (restaurants.length >= 12) return 'You can save up to 12 restaurants.';
}

function nonempty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isRestaurant(value: unknown): value is Restaurant {
  return !!value && typeof value === 'object' && 'id' in value && nonempty(value.id)
    && 'name' in value && nonempty(value.name);
}

export function isMealEntry(value: unknown): value is MealEntry {
  return !!value && typeof value === 'object' && 'id' in value && nonempty(value.id)
    && 'food' in value && nonempty(value.food) && 'meal' in value && mealTypes.some(meal => meal === value.meal)
    && 'date' in value && typeof value.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.date)
    && localDate(parseLocalDate(value.date)) === value.date;
}

export function groupMeals(entries: MealEntry[]) {
  const days = new Map<string, Record<Meal, MealEntry[]>>();
  for (const entry of entries) {
    let day = days.get(entry.date);
    if (!day) {
      day = { breakfast: [], lunch: [], dinner: [] };
      days.set(entry.date, day);
    }
    day[entry.meal].push(entry);
  }
  return Array.from(days, ([date, meals]) => ({ date, meals })).sort((a, b) => b.date.localeCompare(a.date));
}
