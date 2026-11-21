import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#30251F', background: '#FFF8EE', backgroundElement: '#FFFCF7',
    backgroundSelected: '#F4E3D5', textSecondary: '#6E5F53', border: '#DCCDBB',
    primary: '#93442F', onPrimary: '#FFFFFF', error: '#9D332C', success: '#42603F',
    terracotta: '#F1B59D', sage: '#BCD2B0', rim: '#FFF5DF', wheelLine: '#6F5B49',
    board: '#F3E7D5', grid: '#D4BE9F', disabled: '#E4DBCF', disabledText: '#695F55',
  },
  dark: {
    text: '#FFF4E5', background: '#1C1B19', backgroundElement: '#302E2B',
    backgroundSelected: '#49382F', textSecondary: '#CFBFAE', border: '#584E45',
    primary: '#F0A88B', onPrimary: '#30251F', error: '#FFADA1', success: '#B8D6A9',
    terracotta: '#754335', sage: '#405940', rim: '#403B34', wheelLine: '#C4B29C',
    board: '#302B25', grid: '#655745', disabled: '#443E37', disabledText: '#C7BBAC',
  },
} as const;

export const Fonts = {
  serif: Platform.select({ ios: 'ui-serif', web: 'Georgia, "Times New Roman", serif', default: 'serif' }),
};
