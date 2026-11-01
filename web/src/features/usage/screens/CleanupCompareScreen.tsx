import { useSubscriptions } from '@/web/subscriptions';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CalendarSmallIcon from '@/assets/icons/calendar-small.svg';
import WarningIcon from '@/assets/icons/warning.svg';
import { BackHeader } from '@/components/common/BackHeader';
import { Button } from '@/components/ui/Button';
import { MOCK_TODAY } from '@/features/subscription/data/mockSubscriptions';
import { colors, radius, spacing, typography } from '@/theme';
import type { DateKey } from '@/utils/date';
import { formatWon } from '@/utils/format';

import { CategoryChangeCard } from '../components/CategoryChangeCard';
import { DiffList } from '../components/DiffList';
import { mockCleanupOptions } from '../data/mockCleanupOptions';
import { mockUsage } from '../data/mockUsage';
import type { CleanupAction } from '../utils/cleanupPlan';
import { compareCleanup } from '../utils/compareCleanup';

type CleanupCompareScreenProps = {
  selection: Record<string, CleanupAction>;
  today?: DateKey;
  onBack: () => void;
  /** 정리 목록에 담기 */
  onSave?: () => void;
  /** 다시 고르기 */
  onReselect?: () => void;
};

export function CleanupCompareScreen({
  selection,
  today = MOCK_TODAY,
  onBack,
  onSave,
  onReselect,
}: CleanupCompareScreenProps) {
  const subscriptions = useSubscriptions();
  const { before, after, saving, rows, categories, notes } = useMemo(
    () => compareCleanup(subscriptions, mockUsage, mockCleanupOptions, selection, today),
    [selection, today, subscriptions],
  );
  const keptRatio = before > 0 ? after / before : 1;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <BackHeader title="정리 전후 비교" onBack={onBack} right={<Text style={styles.step}>3/3</Text>} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <View style={styles.totals}>
            <View style={styles.total}>
              <Text style={styles.beforeLabel}>지금 월 고정비</Text>
              <Text style={styles.beforeAmount}>{formatWon(before)}</Text>
            </View>
            <View style={styles.total}>
              <Text style={styles.afterLabel}>정리 후</Text>
              <Text style={styles.afterAmount}>{formatWon(after)}</Text>
            </View>
          </View>

          <View
            accessible
            accessibilityLabel={`유지 ${formatWon(after)}, 줄어드는 금액 ${formatWon(saving)}`}
            style={styles.keptBar}
          >
            {after > 0 ? <View style={[styles.kept, { flex: keptRatio }, saving === 0 && styles.barEnd]} /> : null}
            {saving > 0 ? <View style={[styles.saved, { flex: 1 - keptRatio }, after === 0 && styles.barStart]} /> : null}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendKey, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>{`유지 ${formatWon(after)}`}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendKey, { backgroundColor: colors.barSaved }]} />
              <Text style={styles.legendText}>{`줄어드는 금액 ${formatWon(saving)}`}</Text>
            </View>
          </View>

          <View style={styles.highlight}>
            <Text style={styles.highlightMonthly}>{`매달 −${formatWon(saving)}`}</Text>
            <Text style={styles.highlightYearly}>
              {'1년이면 '}
              <Text style={styles.highlightStrong}>{formatWon(saving * 12)}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>변경 내역</Text>
          <View style={styles.diffLegend}>
            <Text style={[styles.diffLegendText, { color: colors.danger }]}>− 해지</Text>
            <Text style={[styles.diffLegendText, { color: colors.diffChanged }]}>~ 변경</Text>
            <Text style={[styles.diffLegendText, { color: colors.textSubtle }]}>= 유지</Text>
          </View>
        </View>
        <DiffList rows={rows} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>카테고리별 변화</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendKey, { backgroundColor: colors.barBefore }]} />
              <Text style={styles.legendText}>지금</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendKey, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>정리 후</Text>
            </View>
          </View>
        </View>
        <CategoryChangeCard categories={categories} />

        {notes.length > 0 ? (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>정리하면 함께 달라지는 것</Text>
            {notes.map((note) => (
              <View key={note.text} style={styles.note}>
                {note.kind === 'warning' ? (
                  <WarningIcon width={18} height={18} />
                ) : (
                  <CalendarSmallIcon width={18} height={18} />
                )}
                <Text style={styles.noteText}>{note.text}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text style={styles.notice}>
          해지와 요금제 변경은 각 서비스 앱이나 웹에서 직접 진행해야 해요. 정리 목록에 담아 두면 결제일 3일 전에 다시 알려
          드릴게요.
        </Text>
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button size="md" title="정리 목록에 담기" onPress={onSave} />
        <Button size="md" variant="secondary" title="다시 고르기" onPress={onReselect} style={styles.secondaryButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  step: {
    ...typography.body13Medium,
    color: colors.textSubtle,
  },
  content: {
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  summary: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.xl + 4,
    backgroundColor: colors.white,
  },
  totals: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  total: {
    flex: 1,
    gap: spacing.xs,
  },
  beforeLabel: {
    ...typography.body13,
    color: colors.textSubtle,
  },
  beforeAmount: {
    ...typography.amount20Medium,
    textDecorationLine: 'line-through',
    color: colors.textSubtle,
  },
  afterLabel: {
    ...typography.body13,
    fontWeight: '700',
    color: colors.primary,
  },
  afterAmount: {
    ...typography.amount26,
    color: colors.textTitle,
  },
  keptBar: {
    height: 12,
    flexDirection: 'row',
    gap: 2,
  },
  kept: {
    borderTopLeftRadius: radius.pill,
    borderBottomLeftRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  saved: {
    borderTopRightRadius: radius.pill,
    borderBottomRightRadius: radius.pill,
    backgroundColor: colors.barSaved,
  },
  barEnd: {
    borderTopRightRadius: radius.pill,
    borderBottomRightRadius: radius.pill,
  },
  barStart: {
    borderTopLeftRadius: radius.pill,
    borderBottomLeftRadius: radius.pill,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendKey: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    ...typography.caption12,
    color: colors.textOptionSub,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  highlightMonthly: {
    ...typography.label14,
    color: colors.infoTitle,
  },
  highlightYearly: {
    ...typography.body14Regular,
    color: colors.infoTitle,
  },
  highlightStrong: {
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionTitleTight,
    color: colors.textTitle,
  },
  diffLegend: {
    flexDirection: 'row',
    gap: 10,
  },
  diffLegendText: {
    ...typography.caption12Medium,
  },
  notesCard: {
    gap: spacing.md,
    padding: 18,
    borderRadius: radius.xl + 4,
    backgroundColor: colors.white,
  },
  notesTitle: {
    ...typography.cardTitle,
    color: colors.textTitle,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  noteText: {
    ...typography.body13_5,
    flex: 1,
    color: colors.infoBody,
  },
  notice: {
    ...typography.noticeText,
    paddingHorizontal: spacing.xs,
    color: colors.textSubtle,
  },
  bottomAction: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  secondaryButton: {
    height: 46,
  },
});
