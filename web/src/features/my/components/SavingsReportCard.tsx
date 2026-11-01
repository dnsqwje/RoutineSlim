import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { formatWon } from '@/utils/format';

type SavingsReportCardProps = {
  savedAmount: number;
  cancelledCount: number;
  onPressReport?: () => void;
};

export function SavingsReportCard({ savedAmount, cancelledCount, onPressReport }: SavingsReportCardProps) {
  return (
    <View style={styles.card}>
      {/* 장식용 원 */}
      <View style={[styles.circle, styles.circleSmall]} />
      <View style={[styles.circle, styles.circleLarge]} />

      <Text style={styles.label}>해지 절약 리포트</Text>
      <Text style={styles.amount}>{`${formatWon(savedAmount)} 감량`}</Text>
      <Text style={styles.label}>{`이번 달 정리한 구독 ${cancelledCount}개`}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={onPressReport}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>리포트 보기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 104,
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl + 4,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  circleSmall: {
    left: 270,
    top: 0,
    width: 28,
    height: 28,
    opacity: 0.08,
  },
  circleLarge: {
    left: 278,
    top: 20,
    width: 72,
    height: 72,
    opacity: 0.1,
  },
  label: {
    ...typography.bodySm,
    color: colors.reportOnPrimary,
  },
  amount: {
    ...typography.amountLg,
    lineHeight: 34,
    color: colors.white,
  },
  button: {
    position: 'absolute',
    right: spacing.lg,
    top: 44,
    width: 88,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: colors.white,
  },
  pressed: {
    opacity: 0.85,
  },
  buttonText: {
    ...typography.label,
    color: colors.primary,
  },
});
