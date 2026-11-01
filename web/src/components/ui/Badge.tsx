import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

const TONES = {
  primary: { background: colors.primarySoft, text: colors.primary },
  positive: { background: colors.positiveSoft, text: colors.positive },
  neutral: { background: colors.segmentBackground, text: colors.textSubtle },
};

type BadgeProps = {
  label: string;
  tone?: keyof typeof TONES;
};

export function Badge({ label, tone = 'primary' }: BadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor: TONES[tone].background }]}>
      <Text style={[styles.label, { color: TONES[tone].text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
  },
  label: {
    ...typography.metaBold,
  },
});
