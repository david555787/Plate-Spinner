import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
function getScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function useColorScheme() {
  return useSyncExternalStore(subscribe, getScheme, () => 'light' as const);
}
