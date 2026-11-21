import { Tabs, TabList, TabSlot, TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Icon, type IconName } from './icons';

function TabButton({ children, isFocused, icon, ...props }: Omit<TabTriggerSlotProps, 'ref'> & { icon: IconName }) {
  const c = useTheme();
  const color = isFocused ? c.primary : c.textSecondary;
  return <Pressable {...props} accessibilityRole="tab" aria-selected={!!isFocused} style={styles.tab}>
    <View style={[styles.indicator, { backgroundColor: isFocused ? c.backgroundSelected : 'transparent' }]}>
      <Icon name={icon} color={color} size={22} />
    </View>
    <Text style={{ color, fontSize: 13, fontWeight: isFocused ? '700' : '500' }}>{children}</Text>
  </Pressable>;
}

export default function AppTabs() {
  const c = useTheme();
  return <Tabs style={{ flex: 1, backgroundColor: c.background }}>
    <TabSlot style={{ flex: 1, minHeight: 0 }} />
    <TabList accessibilityRole="tablist" style={[styles.bar, { borderColor: c.border, backgroundColor: c.backgroundElement }]}>
      <TabTrigger name="index" href="/" asChild><TabButton icon="wheel">Spin</TabButton></TabTrigger>
      <TabTrigger name="explore" href="/explore" asChild><TabButton icon="cutlery">Restaurants</TabButton></TabTrigger>
      <TabTrigger name="history" href="/history" asChild><TabButton icon="book">History</TabButton></TabTrigger>
    </TabList>
  </Tabs>;
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'center', borderTopWidth: 1, paddingTop: 5, paddingBottom: 6 },
  tab: { alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 52, flex: 1, maxWidth: 160 },
  indicator: { alignItems: 'center', justifyContent: 'center', width: 56, minHeight: 28, borderRadius: 16 },
});
