import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import AppTabs from '@/components/app-tabs';
import { loadData } from '@/data/store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

export default function RootLayout() {
  const dark = useColorScheme() === 'dark';
  const c = useTheme();
  const base = dark ? DarkTheme : DefaultTheme;
  useEffect(() => { void loadData(); }, []);
  return <ThemeProvider value={{ ...base, colors: { ...base.colors, background: c.background,
    card: c.backgroundElement, text: c.text, primary: c.primary, border: c.border } }}>
    <StatusBar style={dark ? 'light' : 'dark'} />
    <AppTabs />
  </ThemeProvider>;
}
