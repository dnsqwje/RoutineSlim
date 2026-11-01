import type { ViewStyle } from 'react-native';

export const shadows = {
  card: { boxShadow: '0px 3px 14px 0px rgba(40, 43, 72, 0.06)' },
  fab: { boxShadow: '0px 5px 16px 0px rgba(91, 91, 214, 0.25)' },
} satisfies Record<string, ViewStyle>;
