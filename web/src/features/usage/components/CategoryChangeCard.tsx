import { StyleSheet, Text, View } from 'react-native';

import { CATEGORY_META } from '@/features/subscription/categories';
import { colors, radius, spacing, typography } from '@/theme';
import { formatWon } from '@/utils/format';

import type { CategoryChange } from '../utils/compareCleanup';

/** 카테고리별 '지금' / '정리 후' 금액을 두 줄 막대로 비교 */
export function CategoryChangeCard({ categories }: { categories: CategoryChange[] }) {
  const max = Math.max(...categories.map((c) => c.before), 1);
  const percent = (value: number) => `${(value / max) * 100}%` as const;

  return (
    <View style={styles.card}>
      {categories.map((c) => (
        <View
          key={c.category}
          accessible
          accessibilityLabel={`${CATEGORY_META[c.category].label}, 지금 ${formatWon(c.before)}, 정리 후 ${formatWon(c.after)}`}
          style={styles.item}
        >
          <View style={styles.label}>
            <Text style={styles.name}>{CATEGORY_META[c.category].label}</Text>
            <Text style={styles.values}>
              {`${c.before.toLocaleString('ko-KR')} → `}
              <Text style={[styles.after, c.after === 0 && styles.afterZero]}>{formatWon(c.after)}</Text>
            </Text>
          </View>
          <View style={[styles.bar, styles.barBefore, { width: percent(c.before) }]} />
          {c.after > 0 ? (
            <View style={[styles.bar, styles.barAfter, { width: percent(c.after) }]} />
          ) : (
            // 정리 후 금액이 없으면 빈 트랙만 보여준다
            <View style={[styles.bar, styles.barNone]} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    padding: 18,
    borderRadius: radius.xl + 4,
    backgroundColor: colors.white,
  },
  item: {
    gap: 6,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.label14,
    color: colors.textTitle,
  },
  values: {
    ...typography.body14Regular,
    color: colors.textBody,
  },
  after: {
    fontWeight: '700',
    color: colors.textTitle,
  },
  afterZero: {
    color: colors.danger,
  },
  bar: {
    height: 6,
    minWidth: 6,
    borderRadius: radius.pill,
  },
  barBefore: {
    backgroundColor: colors.barBefore,
  },
  barAfter: {
    backgroundColor: colors.primary,
  },
  barNone: {
    width: '100%',
    backgroundColor: colors.barNone,
  },
});
