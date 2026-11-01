import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { DonutChart } from '@/components/common/DonutChart';
import { CATEGORY_META } from '@/features/subscription/categories';
import { colors, typography } from '@/theme';
import { formatWon } from '@/utils/format';

import { formatPercent, type CategorySummary } from '../utils/summarizeByCategory';

type CategorySpendingCardProps = {
  total: number;
  count: number;
  categories: CategorySummary[];
};

export function CategorySpendingCard({ total, count, categories }: CategorySpendingCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>카테고리별 지출 비중</Text>
      <View style={styles.content}>
        <DonutChart
          size={148}
          thickness={17.76}
          segments={categories.map((c) => ({ key: c.category, value: c.total, color: CATEGORY_META[c.category].color }))}
        >
          <Text style={styles.centerCaption}>이번 달 총 구독료</Text>
          <Text style={styles.centerAmount}>{formatWon(total)}</Text>
          <Text style={styles.centerCaption}>{`${count}개 구독`}</Text>
        </DonutChart>

        <View style={styles.legend}>
          {categories.map((c) => (
            <View key={c.category} style={styles.legendItem}>
              <View style={[styles.key, { backgroundColor: CATEGORY_META[c.category].color }]} />
              <Text style={styles.legendLabel}>{CATEGORY_META[c.category].label}</Text>
              <Text style={styles.legendValue}>{formatPercent(c.ratio)}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  title: {
    ...typography.listTitle,
    color: colors.textTitle,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  centerCaption: {
    ...typography.micro,
    color: colors.textSubtle,
  },
  centerAmount: {
    ...typography.amountSm,
    color: colors.textTitle,
  },
  legend: {
    flex: 1,
    gap: 13,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  key: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendLabel: {
    ...typography.captionSm,
    flex: 1,
    color: colors.textTitle,
  },
  legendValue: {
    ...typography.meta,
    color: colors.textSubtle,
  },
});
