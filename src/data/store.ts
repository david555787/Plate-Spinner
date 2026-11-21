import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import {
  defaultRestaurants, isMealEntry, isRestaurant, restaurantError,
  type Restaurant, type MealEntry,
} from './model';

const keys = { restaurants: 'plateSpinner.restaurants', meals: 'plateSpinner.meals' };
type Snapshot = {
  status: 'loading' | 'ready' | 'error';
  restaurants: Restaurant[];
  meals: MealEntry[];
  restaurantRevision: number;
};

const initial: Snapshot = { status: 'loading', restaurants: [], meals: [], restaurantRevision: 0 };
let state = initial;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function getSnapshot() { return state; }
export function usePlateData() { return useSyncExternalStore(subscribe, getSnapshot, () => initial); }

function publish(change: Partial<Snapshot>) {
  state = { ...state, ...change };
  listeners.forEach(listener => listener());
}

async function readList<T extends { id: string }>(
  key: string, defaults: T[], valid: (value: unknown) => value is T,
): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) {
    await AsyncStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  const list: unknown = JSON.parse(raw);
  if (!Array.isArray(list) || !list.every(valid) || new Set(list.map(item => item.id)).size !== list.length) {
    throw new Error('Stored list is unreadable.');
  }
  return list;
}

let loading: Promise<void> | undefined;
export function loadData() {
  if (loading || state.status === 'ready') return loading;
  publish({ status: 'loading' });
  // Finish both initializations before enabling a retry or accepting edits.
  loading = Promise.allSettled([
    readList(keys.restaurants, defaultRestaurants, isRestaurant),
    readList<MealEntry>(keys.meals, [], isMealEntry),
  ]).then(([restaurants, meals]) => {
    if (restaurants.status === 'fulfilled' && meals.status === 'fulfilled') {
      publish({ status: 'ready', restaurants: restaurants.value, meals: meals.value });
    } else {
      publish({ status: 'error' });
    }
  }).finally(() => { loading = undefined; });
  return loading;
}

// Build each edit from the last durable snapshot, including after a failed write.
let pending = Promise.resolve();
function enqueue(edit: () => Promise<void>) {
  const saving = pending.then(() => {
    if (state.status !== 'ready') throw new Error('Storage is unavailable.');
    return edit();
  });
  pending = saving.catch(() => {});
  return saving;
}

let sequence = 0;
function newId(records: { id: string }[]) {
  const timestamp = Date.now().toString(36);
  let id: string;
  do {
    id = `${timestamp}-${(sequence++).toString(36)}`;
  } while (records.some(record => record.id === id));
  return id;
}

export class InputError extends Error {}
export function editError(error: unknown) {
  return error instanceof InputError ? error.message : 'Couldn’t save this change on this device. Please try again.';
}

async function writeRestaurants(restaurants: Restaurant[]) {
  await AsyncStorage.setItem(keys.restaurants, JSON.stringify(restaurants));
  publish({ restaurants, restaurantRevision: state.restaurantRevision + 1 });
}

export function addRestaurant(raw: string) {
  return enqueue(async () => {
    const name = raw.trim();
    const error = restaurantError(name, state.restaurants);
    if (error) throw new InputError(error);
    await writeRestaurants([...state.restaurants, { id: newId(state.restaurants), name }]);
  });
}

export function deleteRestaurant(id: string) {
  return enqueue(async () => {
    if (state.restaurants.some(item => item.id === id)) {
      await writeRestaurants(state.restaurants.filter(item => item.id !== id));
    }
  });
}

async function writeMeals(meals: MealEntry[]) {
  await AsyncStorage.setItem(keys.meals, JSON.stringify(meals));
  publish({ meals });
}

export function addMeal(entry: Omit<MealEntry, 'id'>) {
  return enqueue(async () => {
    const food = entry.food.trim();
    if (!food) throw new InputError('Enter what you ate.');
    await writeMeals([...state.meals, { ...entry, food, id: newId(state.meals) }]);
  });
}

export function deleteMeal(id: string) {
  return enqueue(async () => {
    if (state.meals.some(item => item.id === id)) await writeMeals(state.meals.filter(item => item.id !== id));
  });
}
