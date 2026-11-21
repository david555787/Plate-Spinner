import type { PropsWithChildren } from 'react';
import {
  Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps,
  type TextProps, type ViewStyle,
} from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Icon, type IconName } from '../icons';

export function Label({ style, ...props }: TextProps) {
  const c = useTheme();
  return <Text {...props} style={[styles.label, { color: c.text }, style]} />;
}

export function SectionTitle({ children }: PropsWithChildren) {
  return <Label accessibilityRole="header" style={styles.section}>{children}</Label>;
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const c = useTheme();
  return <View style={[styles.card, { backgroundColor: c.backgroundElement, borderColor: c.border }, style]}>{children}</View>;
}

type ButtonProps = {
  label: string; onPress: () => void; icon?: IconName; disabled?: boolean; accessibilityLabel?: string;
  kind?: 'primary' | 'secondary' | 'text'; style?: StyleProp<ViewStyle>;
};
export function Button({ label, onPress, icon, disabled, accessibilityLabel, kind = 'primary', style }: ButtonProps) {
  const c = useTheme();
  const color = disabled ? c.disabledText : kind === 'primary' ? c.onPrimary : c.primary;
  const backgroundColor = disabled ? c.disabled : kind === 'primary' ? c.primary : kind === 'secondary' ? c.backgroundElement : 'transparent';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label}
      aria-disabled={!!disabled} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, kind === 'text' && styles.textButton, {
        backgroundColor, borderColor: kind === 'secondary' && !disabled ? c.border : 'transparent', opacity: pressed ? 0.8 : 1,
      }, style]}>
      {icon && <Icon name={icon} color={color} size={18} />}
      <Text style={[styles.buttonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

export function Input({ style, ...props }: TextInputProps) {
  const c = useTheme();
  return <TextInput {...props} placeholderTextColor={c.textSecondary} selectionColor={c.primary}
    style={[styles.input, { color: c.text, backgroundColor: c.backgroundElement, borderColor: c.border }, style]} />;
}

export function Feedback({ message, error = false }: { message: string; error?: boolean }) {
  const c = useTheme();
  return <Label aria-live="polite" accessibilityRole={error ? 'alert' : undefined}
    style={{ color: error ? c.error : c.success, fontWeight: '600' }}>{message}</Label>;
}

export const styles = StyleSheet.create({
  label: { fontSize: 16, lineHeight: 23 },
  section: { fontFamily: Fonts.serif, fontSize: 25, fontWeight: '600', lineHeight: 32 },
  card: { borderWidth: 1, borderRadius: 18, overflow: 'hidden', minWidth: 0 },
  button: { minHeight: 48, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  textButton: { minHeight: 44, paddingHorizontal: 6, paddingVertical: 6 },
  buttonText: { fontSize: 16, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
  input: { minHeight: 48, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  stack: { gap: 8 }, row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pad: { padding: 18, gap: 16 }, flex: { flex: 1, minWidth: 0 },
});
