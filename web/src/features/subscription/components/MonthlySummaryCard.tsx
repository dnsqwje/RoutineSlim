import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { Badge } from '@/components/ui/Badge';
import { colors, spacing, typography } from '@/theme';
import { formatWon } from '@/utils/format';

type MonthlySummaryCardProps = {
  month: number;
  totalPrice: number;
  activeCount: number;
  description: string;
};

export function MonthlySummaryCard({ month, totalPrice, activeCount, description }: MonthlySummaryCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>{`${month}월 총 구독료`}</Text>
        <Badge label={`이용 중 ${activeCount}개`} />
      </View>
      <Text style={styles.total}>{formatWon(totalPrice)}</Text>
      <Text style={styles.description}>{description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingText: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  total: {
    ...typography.amountXL,
    color: colors.primary,
  },
  description: {
    ...typography.captionSm,
    color: colors.textSubtle,
  },
});
