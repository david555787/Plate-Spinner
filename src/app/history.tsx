import { useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Icon } from '@/components/icons';
import { DataGate, Frame, PageTitle, pageStyles } from '@/components/page';
import { Button, Card, Feedback, Input, Label, SectionTitle, styles } from '@/components/ui/controls';
import { groupMeals, mealNames, mealTypes, shiftDay, type Meal } from '@/data/model';
import { addMeal, deleteMeal, editError, usePlateData } from '@/data/store';
import { useTheme } from '@/hooks/use-theme';
import { useToday } from '@/hooks/use-today';

function MealForm() {
  const c = useTheme();
  const today = useToday();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const date = selectedDate && selectedDate < today ? selectedDate : today;
  const [meal, setMeal] = useState<Meal>('breakfast');
  const [food, setFood] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; error?: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);

  function changeDay(days: number) {
    const next = shiftDay(date, days);
    setSelectedDate(next >= today ? null : next);
    setFeedback(null);
  }

  async function save() {
    if (submitting.current) return;
    submitting.current = true;
    setSaving(true);
    setFeedback(null);
    try {
      await addMeal({ meal, date, food });
      setFood('');
      setFeedback({ message: `Saved to ${mealNames[meal]}.` });
      Keyboard.dismiss();
    } catch (failure) {
      setFeedback({ message: editError(failure), error: true });
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  return <Card style={styles.pad}>
    <SectionTitle>Log a meal</SectionTitle>
    <View style={styles.stack}>
      <View style={styles.row}>
        <Icon name="calendar" color={c.primary} size={18} />
        <Label accessibilityLabel={`Selected date ${date}`} style={{ fontWeight: '600' }}>{date}</Label>
      </View>
      <View style={styles.row}>
        <Button kind="secondary" icon="left" label="Previous Day" disabled={saving} style={history.dateButton} onPress={() => changeDay(-1)} />
        <Button kind="secondary" label="Next Day" icon="right" disabled={date === today || saving}
          style={history.dateButton} onPress={() => changeDay(1)} />
      </View>
    </View>
    <View accessibilityRole="radiogroup" accessibilityLabel="Meal" style={[history.selector, { backgroundColor: c.background }]}>
      {mealTypes.map(type => <Pressable key={type} accessibilityRole="radio" accessibilityLabel={mealNames[type]}
        aria-checked={type === meal} aria-disabled={saving} disabled={saving}
        onPress={() => { setMeal(type); setFeedback(null); }} style={[history.choice, {
          backgroundColor: type === meal ? c.backgroundSelected : 'transparent',
        }]}>
        <Icon name={type} color={type === meal ? c.primary : c.textSecondary} size={18} />
        <Label style={{ fontSize: 14, fontWeight: '600', color: type === meal ? c.primary : c.textSecondary }}>{mealNames[type]}</Label>
      </Pressable>)}
    </View>
    <View style={styles.stack}>
      <Label>What did you eat?</Label>
      <Input accessibilityLabel="What did you eat?" placeholder="e.g. Noodle soup" value={food} editable={!saving}
        onChangeText={value => { setFood(value); setFeedback(null); }} onSubmitEditing={save} returnKeyType="done" />
      <Button label="Save" icon="check" onPress={save} disabled={saving} />
      {feedback && <Feedback {...feedback} />}
    </View>
  </Card>;
}

type Day = ReturnType<typeof groupMeals>[number];

function DayCard({ day }: { day: Day }) {
  const c = useTheme();
  const [error, setError] = useState('');
  async function remove(id: string) {
    setError('');
    try { await deleteMeal(id); }
    catch (failure) { setError(editError(failure)); }
  }
  return <Card style={styles.pad}>
    <View style={styles.row}><Icon name="calendar" color={c.primary} /><SectionTitle>{day.date}</SectionTitle></View>
    {mealTypes.map(meal => <View key={meal} style={{ borderTopWidth: 1, borderColor: c.border, paddingTop: 12, gap: 4 }}>
      <View style={styles.row}>
        <Icon name={meal} color={c.primary} size={18} />
        <Label style={{ fontWeight: '700' }}>{mealNames[meal]}</Label>
      </View>
      {day.meals[meal].length ? day.meals[meal].map(entry =>
        <View key={entry.id} style={styles.row}>
          <Label style={styles.flex}>{entry.food}</Label>
          <Button kind="text" label="Delete" accessibilityLabel={`Delete ${entry.food} from ${mealNames[meal]}`}
            icon="trash" onPress={() => remove(entry.id)} />
        </View>) : <Label style={{ color: c.textSecondary }}>No entries.</Label>}
    </View>)}
    {!!error && <Feedback error message={error} />}
  </Card>;
}

function Journal() {
  const { meals } = usePlateData();
  const days = useMemo(() => groupMeals(meals), [meals]);
  const wide = useWindowDimensions().width >= 780;
  const c = useTheme();
  // On a phone the form and log share one scroll surface, including with the keyboard open.
  const entryList = <FlatList data={days} keyExtractor={day => day.date} renderItem={({ item }) => <DayCard day={item} />}
    keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentInsetAdjustmentBehavior="automatic"
    style={styles.flex} contentContainerStyle={[history.list, wide && { paddingHorizontal: 0, paddingTop: 0 }]}
    ListHeaderComponent={<View style={{ gap: 20 }}>
      {!wide && <><PageTitle title="Meal " accent="history" /><MealForm /></>}
      <SectionTitle>Meal log</SectionTitle>
    </View>}
    ListEmptyComponent={<Card style={[styles.pad, { alignItems: 'center', paddingVertical: 30 }]}>
      <Icon name="book" color={c.primary} size={26} />
      <Label style={{ color: c.textSecondary }}>No meals logged yet.</Label>
    </Card>} />;
  if (!wide) return entryList;
  return <View style={[pageStyles.content, { flex: 1 }]}>
    <PageTitle title="Meal " accent="history" />
    <View style={{ flex: 1, flexDirection: 'row', gap: 24 }}>
      <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        <MealForm />
      </ScrollView>
      {entryList}
    </View>
  </View>;
}

export default function HistoryScreen() {
  return <Frame><DataGate><Journal /></DataGate></Frame>;
}

const history = StyleSheet.create({
  list: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16,
    paddingBottom: 90, gap: 14 },
  dateButton: { flex: 1, paddingHorizontal: 6, alignSelf: 'stretch' },
  selector: { flexDirection: 'row', padding: 4, borderRadius: 12, gap: 3 },
  choice: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', gap: 3,
    borderRadius: 8, paddingHorizontal: 2, paddingVertical: 7, minHeight: 48 },
});
