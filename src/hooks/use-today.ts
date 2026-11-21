import { useSyncExternalStore } from 'react';
import { AppState } from 'react-native';

import { localDate } from '@/data/model';

function subscribe(notify: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  function refresh() {
    clearTimeout(timer);
    notify();
    scheduleMidnight();
  }
  function scheduleMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    timer = setTimeout(refresh, midnight.getTime() - now.getTime() + 100);
  }
  scheduleMidnight();
  const sub = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
  return () => { clearTimeout(timer); sub.remove(); };
}

export function useToday() {
  // Web hydration must use the phone’s date even when the server is in another time zone.
  return useSyncExternalStore(subscribe, localDate, () => '');
}
