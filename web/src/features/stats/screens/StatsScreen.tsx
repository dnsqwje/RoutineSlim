import { useSubscriptions } from '@/web/subscriptions';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChevronLeft from '@/assets/icons/chevron-left-small.svg';
import ChevronRight from '@/assets/icons/chevron-right-small.svg';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CATEGORY_META } from '@/features/subscription/categories';
import { MOCK_TODAY } from '@/features/subscription/data/mockSubscriptions';
import { groupRenewalsByDate } from '@/features/subscription/utils/renewal';
import { colors, spacing, typography } from '@/theme';
import { parseDateKey, shiftMonth, type DateKey } from '@/utils/date';
import { withSubjectParticle } from '@/utils/format';

import { CategoryBreakdownCard } from '../components/CategoryBreakdownCard';
import { CategorySpendingCard } from '../components/CategorySpendingCard';
import { formatPercent, summarizeByCategory } from '../utils/summarizeByCategory';

type StatsScreenProps = {
  /** 기준 '오늘'. 기본값은 시안 기준일 */
  today?: DateKey;
};

export function StatsScreen({ today = MOCK_TODAY }: StatsScreenProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const { year, month } = parseDateKey(today);
    return { year, month };
  });
  const { year, month } = visibleMonth;

  const subscriptions = useSubscriptions();
  const summary = useMemo(() => {
    const monthSubscriptions = [...groupRenewalsByDate(subscriptions, year, month).values()].flat();
    // 날짜순이 아니라 원래 등록 순서로 보여준다
    return summarizeByCategory(subscriptions.filter((s) => monthSubscriptions.includes(s)));
  }, [year, month, subscriptions]);

  const top = summary.categories.reduce<(typeof summary.categories)[number] | null>(
    (max, c) => (!max || c.total > max.total ? c : max),
    null,
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <PageHeader title="통계" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.monthSelector}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="이전 달"
            hitSlop={10}
            onPress={() => setVisibleMonth((current) => shiftMonth(current, -1))}
          >
            <ChevronLeft width={18} height={18} />
          </Pressable>
          <Text style={styles.monthTitle}>{`${year}년 ${month}월`}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="다음 달"
            hitSlop={10}
            onPress={() => setVisibleMonth((current) => shiftMonth(current, 1))}
          >
            <ChevronRight width={18} height={18} />
          </Pressable>
        </View>

        <CategorySpendingCard total={summary.total} count={summary.count} categories={summary.categories} />

        <View style={styles.section}>
          <SectionHeader title="카테고리별 구독" trailing="월 결제 금액" />
          <CategoryBreakdownCard categories={summary.categories} />
        </View>

        {top ? (
          <Text style={styles.insight}>
            {`${withSubjectParticle(CATEGORY_META[top.category].label)} 전체 구독료의 ${formatPercent(top.ratio)}를 차지해요.`}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  monthSelector: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
  },
  monthTitle: {
    ...typography.sectionTitle,
    color: colors.textTitle,
  },
  section: {
    gap: 10,
  },
  insight: {
    ...typography.meta,
    textAlign: 'center',
    color: colors.textSubtle,
  },
});
