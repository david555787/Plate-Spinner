import type { PropsWithChildren, ReactNode } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { parseLocalDate } from '@/data/model';
import { loadData, usePlateData } from '@/data/store';
import { useTheme } from '@/hooks/use-theme';
import { useToday } from '@/hooks/use-today';
import { Icon, PlateMark } from './icons';
import { Button, Feedback, Label } from './ui/controls';

export function Frame({ children }: PropsWithChildren) {
  const c = useTheme();
  const today = useToday();
  const date = today && parseLocalDate(today).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ borderBottomWidth: 1, borderColor: c.border }}>
        <View style={pageStyles.masthead}>
          <View style={pageStyles.brand}>
            <PlateMark color={c.primary} paper={c.onPrimary} />
            <Text style={[pageStyles.wordmark, { color: c.text }]}>Plate Spinner</Text>
          </View>
          <View style={pageStyles.dateline}>
            <Icon name="calendar" color={c.textSecondary} size={15} />
            <Text style={{ color: c.textSecondary, fontSize: 13, fontWeight: '500' }}>{date}</Text>
          </View>
        </View>
      </View>
      {children}
    </SafeAreaView>
  );
}

export function PageTitle({ title, accent }: { title: string; accent?: string }) {
  const c = useTheme();
  const wide = useWindowDimensions().width >= 780;
  return <Text accessibilityRole="header" style={[pageStyles.heading, {
    color: c.text, fontSize: wide ? 54 : 40, lineHeight: wide ? 65 : 50,
  }]}>{title}{accent && <Text style={{ fontStyle: 'italic', color: c.primary }}>{accent}</Text>}</Text>;
}

export function DataGate({ children }: PropsWithChildren) {
  const { status } = usePlateData();
  const c = useTheme();
  if (status === 'ready') return children;
  return <View style={[pageStyles.status, { borderColor: c.border }]}>
    {status === 'loading' ? <>
      <ActivityIndicator color={c.primary} /><Label>Opening your lists…</Label>
    </> : <>
      <Feedback error message="Couldn’t read your saved lists on this device." />
      <Button kind="secondary" label="Try again" onPress={loadData} />
    </>}
  </View>;
}

export function Page({ title, accent, children }: PropsWithChildren<{ title: string; accent?: string }>) {
  return <Frame>
    <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="automatic" contentContainerStyle={pageStyles.scroll}>
      <View style={pageStyles.content}>
        <PageTitle title={title} accent={accent} />
        <DataGate>{children}</DataGate>
      </View>
    </ScrollView>
  </Frame>;
}

export function Columns({ main, side }: { main: ReactNode; side: ReactNode }) {
  const wide = useWindowDimensions().width >= 780;
  return <View style={{ flexDirection: wide ? 'row' : 'column', gap: wide ? 24 : 16, alignItems: 'stretch' }}>
    <View style={wide ? { flex: 1.4, minWidth: 0 } : undefined}>{main}</View>
    <View style={wide ? { flex: 1, minWidth: 0 } : undefined}>{side}</View>
  </View>;
}

export const pageStyles = StyleSheet.create({
  masthead: { width: '100%', maxWidth: 1024, alignSelf: 'center', minHeight: 64, paddingHorizontal: 16,
    paddingVertical: 12, gap: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 },
  wordmark: { fontFamily: Fonts.serif, fontSize: 23, fontWeight: 'bold', letterSpacing: -0.8, flexShrink: 1 },
  dateline: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  scroll: { alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 82 : 28 },
  content: { width: '100%', maxWidth: 1024, paddingHorizontal: 16, paddingTop: 20, gap: 16, alignSelf: 'center' },
  heading: { fontFamily: Fonts.serif, fontWeight: '600', letterSpacing: -1.6, flexShrink: 1 },
  status: { padding: 22, alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14 },
});
