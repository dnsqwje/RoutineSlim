import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { formatWon } from '@/utils/format';

import type { DiffRow } from '../utils/compareCleanup';

const KIND_STYLE = {
  removed: {
    symbol: '−',
    color: colors.danger,
    background: colors.diffRemovedBg,
    border: colors.diffRemovedBorder,
    gutter: colors.diffRemovedGutter,
  },
  changed: {
    symbol: '~',
    color: colors.diffChanged,
    background: colors.diffChangedBg,
    border: colors.diffChangedBorder,
    gutter: colors.diffChangedGutter,
  },
  unchanged: {
    symbol: '=',
    color: colors.diffUnchangedSymbol,
    background: colors.white,
    border: colors.divider,
    gutter: colors.diffUnchangedGutter,
  },
};

/** 코드 diff 처럼 해지(−) / 변경(~) / 유지(=) 를 한 줄씩 보여주는 목록 */
export function DiffList({ rows }: { rows: DiffRow[] }) {
  return (
    <View style={styles.list}>
      {rows.map((row, index) => {
        const kind = KIND_STYLE[row.kind];
        const isLast = index === rows.length - 1;
        const { subscription } = row;

        return (
          <View
            key={subscription.id}
            style={[
              styles.row,
              { backgroundColor: kind.background, borderBottomColor: kind.border },
              !isLast && styles.rowDivider,
            ]}
          >
            <View style={[styles.gutter, { backgroundColor: kind.gutter }]}>
              <Text style={[styles.symbol, { color: kind.color }]}>{kind.symbol}</Text>
            </View>

            {row.kind === 'unchanged' ? (
              <View style={[styles.body, styles.bodyUnchanged]}>
                <Text style={styles.unchangedName} numberOfLines={1}>
                  {subscription.name}
                  <Text style={styles.unchangedDetail}>{`  · ${row.detail}`}</Text>
                </Text>
                <Text style={styles.unchangedPrice}>{formatWon(subscription.price)}</Text>
              </View>
            ) : (
              <View style={styles.body}>
                <View style={styles.texts}>
                  <Text style={styles.name} numberOfLines={1}>
                    {subscription.name}
                    {row.kind === 'removed' && subscription.plan ? (
                      <Text style={styles.plan}>{` ${subscription.plan}`}</Text>
                    ) : null}
                  </Text>
                  <Text style={[styles.detail, { color: kind.color }]}>{row.detail}</Text>
                </View>
                <View style={styles.prices}>
                  <Text style={styles.oldPrice}>{formatWon(subscription.price)}</Text>
                  <Text style={[styles.newPrice, { color: kind.color }]}>{formatWon(row.newPrice)}</Text>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: radius.xl + 4,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  rowDivider: {
    borderBottomWidth: 1,
  },
  gutter: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    ...typography.diffSymbol,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: 14,
  },
  bodyUnchanged: {
    paddingVertical: 13,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.cardTitle,
    color: colors.textTitle,
  },
  plan: {
    ...typography.body12_5,
    color: colors.textSubtle,
  },
  detail: {
    ...typography.body12_5,
  },
  prices: {
    alignItems: 'flex-end',
    gap: 2,
  },
  oldPrice: {
    ...typography.body13,
    textDecorationLine: 'line-through',
    color: colors.textAxis,
  },
  newPrice: {
    ...typography.cardTitle,
  },
  unchangedName: {
    ...typography.body14Regular,
    flex: 1,
    color: colors.textBody,
  },
  unchangedDetail: {
    ...typography.caption12,
    color: colors.textAxis,
  },
  unchangedPrice: {
    ...typography.body14Regular,
    color: colors.textBody,
  },
});
