import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icons';
import { Columns, Page } from '@/components/page';
import { landingAngle, RestaurantWheel } from '@/components/restaurant-wheel';
import { Button, Card, Feedback, Label, SectionTitle, styles } from '@/components/ui/controls';
import { localDate, mealNames, mealTypes, type Meal, type Restaurant } from '@/data/model';
import { addMeal, editError, getSnapshot, usePlateData } from '@/data/store';
import { useTheme } from '@/hooks/use-theme';

function Lineup({ restaurants }: { restaurants: Restaurant[] }) {
  const c = useTheme();
  return <Card>
    <View style={home.panelTitle}>
      <SectionTitle>On the wheel</SectionTitle>
      <View style={[home.count, { backgroundColor: c.backgroundSelected }]}>
        <Label style={{ color: c.primary, fontSize: 14, fontWeight: '700' }}>{restaurants.length}</Label>
      </View>
    </View>
    <View style={{ paddingHorizontal: 18 }}>
      {restaurants.map((item, i) =>
        <View key={item.id} style={[home.item, { borderColor: c.border }]}>
          <View style={[home.swatch, { backgroundColor: i % 2 ? c.sage : c.terracotta, borderColor: c.wheelLine }]} />
          <Label style={styles.flex}>{item.name}</Label>
        </View>)}
    </View>
    <Pressable accessibilityRole="button" onPress={() => router.navigate('/explore')}
      style={({ pressed }) => [home.edit, { borderColor: c.border, opacity: pressed ? 0.7 : 1 }]}>
      <Label style={{ color: c.primary, fontWeight: '600' }}>Edit restaurants</Label>
      <Icon name="arrow" color={c.primary} />
    </Pressable>
  </Card>;
}

function Spinner({ restaurants }: { restaurants: Restaurant[] }) {
  const [rotation] = useState(() => new Animated.Value(0));
  const currentAngle = useRef(0);
  const spinId = useRef(0);
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const logLocked = useRef(false);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [logging, setLogging] = useState(false);
  const [saved, setSaved] = useState<Meal | null>(null);
  const [error, setError] = useState('');
  const c = useTheme();

  useEffect(() => () => {
    spinId.current++;
    animation.current?.stop();
  }, []);

  function spin() {
    if (restaurants.length < 2 || animation.current || getSnapshot().restaurants !== restaurants) return;
    const id = ++spinId.current;
    const choice = Math.floor(Math.random() * restaurants.length);
    const target = landingAngle(currentAngle.current, choice, restaurants.length);
    setWinner(null);
    setSaved(null);
    setError('');
    setLogging(false);
    logLocked.current = false;
    setSpinning(true);
    const motion = Animated.timing(rotation, {
      toValue: target, duration: 3000, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web',
    });
    animation.current = motion;
    motion.start(({ finished }) => {
      if (id !== spinId.current || getSnapshot().restaurants !== restaurants) return;
      animation.current = null;
      setSpinning(false);
      if (finished) {
        currentAngle.current = target % 360;
        rotation.setValue(currentAngle.current);
        setWinner(restaurants[choice]);
      }
    });
  }

  async function log(meal: Meal) {
    if (!winner || animation.current || logLocked.current || getSnapshot().restaurants !== restaurants) return;
    const id = spinId.current;
    logLocked.current = true;
    setLogging(true);
    setError('');
    try {
      await addMeal({ meal, date: localDate(), food: winner.name });
      if (id === spinId.current) setSaved(meal);
    } catch (failure) {
      if (id === spinId.current) {
        logLocked.current = false;
        setError(editError(failure));
      }
    } finally {
      if (id === spinId.current) setLogging(false);
    }
  }

  return <View style={{ gap: 16 }}>
    <Card>
      <RestaurantWheel restaurants={restaurants} rotation={rotation} />
      <View style={{ padding: 12, gap: 8 }}>
        <Button label={spinning ? 'Spinning…' : 'Spin'} accessibilityLabel="Spin" icon="spin"
          disabled={restaurants.length < 2 || spinning} onPress={spin} />
        {restaurants.length < 2 && <Label style={{ textAlign: 'center' }}>Add at least 2 restaurants to spin.</Label>}
      </View>
    </Card>
    {winner && <Card style={styles.pad}>
      <View style={styles.stack}>
        <Label style={{ color: c.textSecondary }}>Your pick</Label>
        <SectionTitle>{winner.name}</SectionTitle>
      </View>
      <View style={styles.stack}>
        {mealTypes.map(meal => <Button key={meal} kind="secondary" icon={meal} label={`Log as ${mealNames[meal]}`}
          disabled={logging || saved !== null} onPress={() => log(meal)} />)}
      </View>
      {saved && <Feedback message={`Saved to ${mealNames[saved]}.`} />}
      {!!error && <Feedback error message={error} />}
    </Card>}
  </View>;
}

export default function SpinScreen() {
  const { restaurants, restaurantRevision } = usePlateData();
  return <Page title="Spin the " accent="wheel">
    <Columns main={<Spinner key={restaurantRevision} restaurants={restaurants} />} side={<Lineup restaurants={restaurants} />} />
  </Page>;
}

const home = StyleSheet.create({
  panelTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 18 },
  count: { minWidth: 29, paddingHorizontal: 8, borderRadius: 16, alignItems: 'center' },
  item: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1 },
  swatch: { width: 12, height: 12, borderRadius: 6, borderWidth: 1 },
  edit: { borderTopWidth: 1, minHeight: 52, paddingVertical: 12, paddingHorizontal: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', gap: 8 },
});
