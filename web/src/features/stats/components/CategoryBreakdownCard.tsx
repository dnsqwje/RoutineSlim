import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { CATEGORY_META } from '@/features/subscription/categories';
import { colors, typography } from '@/theme';
import { formatWon } from '@/utils/format';

import type { CategorySummary } from '../utils/summarizeByCategory';

type CategoryBreakdownCardProps = {
  categories: CategorySummary[];
};

export function CategoryBreakdownCard({ categories }: CategoryBreakdownCardProps) {
  return (
    <Card style={styles.card}>
      {categories.map((c) => (
        <View key={c.category} style={styles.group}>
          <View style={styles.totalRow}>
            <View style={[styles.key, { backgroundColor: CATEGORY_META[c.category].color }]} />
            <Text style={styles.categoryName}>{CATEGORY_META[c.category].label}</Text>
            <Text style={styles.categoryTotal}>{formatWon(c.total)}</Text>
          </View>
          {c.subscriptions.map((s) => (
            <View key={s.id} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {s.name}
              </Text>
              <Text style={styles.itemPrice}>{formatWon(s.price)}</Text>
            </View>
          ))}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 13,
  },
  group: {
    gap: 6,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  key: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  categoryName: {
    ...typography.listTitle,
    flex: 1,
    color: colors.textTitle,
  },
  categoryTotal: {
    ...typography.listTitle,
    color: colors.textTitle,
  },
  itemRow: {
    flexDirection: 'row',
    paddingLeft: 14,
  },
  itemName: {
    ...typography.meta,
    flex: 1,
    color: colors.textSubtle,
  },
  itemPrice: {
    ...typography.meta,
    color: colors.textSubtle,
  },
});
