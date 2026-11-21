import { useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';

import { Columns, Page } from '@/components/page';
import { Button, Card, Feedback, Input, Label, SectionTitle, styles } from '@/components/ui/controls';
import { addRestaurant, deleteRestaurant, editError, usePlateData } from '@/data/store';
import { useTheme } from '@/hooks/use-theme';

export default function RestaurantsScreen() {
  const { restaurants } = usePlateData();
  const c = useTheme();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [adding, setAdding] = useState(false);
  const submitting = useRef(false);

  async function add() {
    if (submitting.current) return;
    submitting.current = true;
    setAdding(true);
    setError('');
    try {
      await addRestaurant(name);
      setName('');
      Keyboard.dismiss();
    } catch (failure) { setError(editError(failure)); }
    finally { submitting.current = false; setAdding(false); }
  }

  async function remove(id: string) {
    setDeleteError('');
    try { await deleteRestaurant(id); setError(''); }
    catch (failure) { setDeleteError(editError(failure)); }
  }

  const form = <Card style={styles.pad}>
    <SectionTitle>Add a restaurant</SectionTitle>
    <View style={styles.stack}>
      <Label>Restaurant name</Label>
      <Input accessibilityLabel="Restaurant name" placeholder="e.g. Sushi Spot" value={name} editable={!adding}
        returnKeyType="done" autoCapitalize="words" onSubmitEditing={add}
        onChangeText={text => { setName(text); setError(''); }} />
      <Button label="Add" icon="plus" onPress={add} disabled={adding} />
      {!!error && <Feedback error message={error} />}
    </View>
  </Card>;

  const list = <Card style={styles.pad}>
    <View style={[styles.row, { justifyContent: 'space-between' }]}>
      <SectionTitle>Your list</SectionTitle>
      <Label style={{ color: c.textSecondary }}>{restaurants.length} / 12</Label>
    </View>
    <View>
      {restaurants.map((item, index) => <View key={item.id} style={[styles.row, {
        minHeight: 55, paddingVertical: 4, borderTopWidth: 1, borderColor: c.border,
      }]}>
        <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: c.wheelLine,
          backgroundColor: index % 2 === 0 ? c.terracotta : c.sage }} />
        <Label style={styles.flex}>{item.name}</Label>
        <Button kind="text" label="Delete" accessibilityLabel={`Delete ${item.name}`} icon="trash" onPress={() => remove(item.id)} />
      </View>)}
      {!restaurants.length && <Label style={{ color: c.textSecondary }}>No restaurants yet.</Label>}
    </View>
    {!!deleteError && <Feedback error message={deleteError} />}
  </Card>;

  return <Page title="Restaurants"><Columns main={form} side={list} /></Page>;
}
