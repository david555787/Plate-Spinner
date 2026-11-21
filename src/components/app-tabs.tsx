import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const c = useTheme();
  return (
    <NativeTabs backgroundColor={c.backgroundElement} tintColor={c.primary} indicatorColor={c.backgroundSelected}
      iconColor={{ default: c.textSecondary, selected: c.primary }} shadowColor={c.border}
      labelStyle={{ default: { color: c.textSecondary }, selected: { color: c.primary, fontWeight: '600' } }}
      labelVisibilityMode="labeled" sidebarAdaptable={false} minimizeBehavior="never" disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index" contentStyle={{ backgroundColor: c.background }}>
        <NativeTabs.Trigger.Label>Spin</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.pie" md="pie_chart" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore" contentStyle={{ backgroundColor: c.background }}>
        <NativeTabs.Trigger.Label>Restaurants</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="fork.knife" md="restaurant" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history" contentStyle={{ backgroundColor: c.background }}>
        <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book.closed" md="menu_book" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
