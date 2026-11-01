import { useSubscriptions } from '@/web/subscriptions';
import { Fragment, useMemo, useState } from 'react';
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CalendarIcon from '@/assets/icons/calendar.svg';
import ChevronLeft from '@/assets/icons/chevron-left-muted.svg';
import ChevronRight from '@/assets/icons/chevron-right-muted.svg';
import CollapseIcon from '@/assets/icons/collapse.svg';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SubscriptionRow } from '@/features/subscription/components/SubscriptionRow';
import { MOCK_TODAY } from '@/features/subscription/data/mockSubscriptions';
import { findNextPayments, groupRenewalsByDate } from '@/features/subscription/utils/renewal';
import { useVerticalSwipe } from '@/hooks/useVerticalSwipe';
import { colors, radius, spacing, typography } from '@/theme';
import { parseDateKey, shiftMonth, type DateKey } from '@/utils/date';
import { formatMonthDay, formatRelativeDay, formatWon } from '@/utils/format';

import { DayPaymentsSheet } from '../components/DayPaymentsSheet';
import { ExpandedMonthCalendar } from '../components/ExpandedMonthCalendar';
import { MonthCalendar } from '../components/MonthCalendar';

type CalendarScreenProps = {
  /** 기준 '오늘'. 기본값은 시안 기준일 */
  today?: DateKey;
  /** 처음부터 결제 시트를 열어 둘 날짜 (딥링크 등) */
  initialSelectedDate?: DateKey;
  /** 확장(날짜별 금액) 보기로 시작 */
  initialExpanded?: boolean;
};

export function CalendarScreen({ today = MOCK_TODAY, initialSelectedDate, initialExpanded = false }: CalendarScreenProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const { year, month } = parseDateKey(initialSelectedDate ?? today);
    return { year, month };
  });
  const [selectedDate, setSelectedDate] = useState<DateKey | null>(initialSelectedDate ?? null);
  const [expanded, setExpanded] = useState(initialExpanded);
  const { year, month } = visibleMonth;

  const subscriptions = useSubscriptions();
  const renewals = useMemo(() => groupRenewalsByDate(subscriptions, year, month), [subscriptions, year, month]);
  const renewalCounts = useMemo(
    () => new Map([...renewals].map(([date, subs]) => [date, subs.length])),
    [renewals],
  );
  const monthRenewals = [...renewals.values()].flat();
  const monthlyTotal = monthRenewals.reduce((sum, s) => sum + s.price, 0);
  const nextPayments = findNextPayments(subscriptions, today);

  const moveMonth = (delta: number) => setVisibleMonth((current) => shiftMonth(current, delta));
  const toggleExpanded = (next: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(next);
  };

  // 기본 보기: 달력을 아래로 쓸어내리면 확장 / 확장 보기: 위로 쓸어올리면 원래대로
  const expandSwipe = useVerticalSwipe({ onSwipeDown: () => toggleExpanded(true) });
  const collapseSwipe = useVerticalSwipe({ onSwipeUp: () => toggleExpanded(false) });

  const header = (
    <PageHeader
      title="캘린더"
      right={
        expanded ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="달력 접기"
            hitSlop={6}
            onPress={() => toggleExpanded(false)}
            style={styles.collapseButton}
          >
            <CollapseIcon width={15.8} height={15.8} />
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="달력 펼치기"
            hitSlop={8}
            onPress={() => toggleExpanded(true)}
          >
            <CalendarIcon width={22} height={22} />
          </Pressable>
        )
      }
    />
  );

  const sheet = (
    <DayPaymentsSheet
      date={selectedDate}
      subscriptions={selectedDate ? (renewals.get(selectedDate) ?? []) : []}
      onClose={() => setSelectedDate(null)}
    />
  );

  if (expanded) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {header}
        <View style={styles.expandedContent}>
          <View style={styles.expandedMonthSelector}>
            <Pressable accessibilityRole="button" accessibilityLabel="이전 달" hitSlop={10} onPress={() => moveMonth(-1)}>
              <ChevronLeft width={20} height={20} />
            </Pressable>
            <Text style={styles.expandedMonthTitle}>{`${year}년 ${month}월`}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="다음 달" hitSlop={10} onPress={() => moveMonth(1)}>
              <ChevronRight width={20} height={20} />
            </Pressable>
          </View>

          <View style={styles.compactSummary}>
            <Text style={styles.compactSummaryLabel}>이번 달 결제 예정</Text>
            <View style={styles.compactSummaryBadge}>
              <Text style={styles.compactSummaryBadgeText}>{`${monthRenewals.length}개 구독`}</Text>
            </View>
            <Text style={styles.compactSummaryTotal}>{formatWon(monthlyTotal)}</Text>
          </View>

          <View style={styles.expandedCalendar} {...collapseSwipe}>
            <ExpandedMonthCalendar
              year={year}
              month={month}
              today={today}
              selectedDate={selectedDate}
              renewals={renewals}
              onPressDay={setSelectedDate}
            />
          </View>

          <View style={styles.legend}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>결제 예정일</Text>
            <View style={styles.legendToday} />
            <Text style={styles.legendText}>{`오늘 ${parseDateKey(today).day}일`}</Text>
          </View>
        </View>
        {sheet}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {header}

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeading}>
            <Text style={styles.summaryLabel}>이번 달 결제 예정</Text>
            <Text style={styles.summaryCount}>{`${monthRenewals.length}개 구독`}</Text>
          </View>
          <Text style={styles.summaryTotal}>{formatWon(monthlyTotal)}</Text>
        </Card>

        <View {...expandSwipe}>
          <MonthCalendar
            year={year}
            month={month}
            today={today}
            selectedDate={selectedDate}
            renewalCounts={renewalCounts}
            onPrevMonth={() => moveMonth(-1)}
            onNextMonth={() => moveMonth(1)}
            onPressDay={setSelectedDate}
          />
        </View>

        {nextPayments ? (
          <View style={styles.section}>
            <SectionHeader
              title="가장 가까운 결제"
              trailing={`${formatRelativeDay(nextPayments.date, today)} · ${formatMonthDay(nextPayments.date)}`}
            />
            <Card style={styles.nextCard}>
              {nextPayments.subscriptions.map((subscription, index) => (
                <Fragment key={subscription.id}>
                  {index > 0 ? <View style={styles.divider} /> : null}
                  <SubscriptionRow subscription={subscription} />
                </Fragment>
              ))}
            </Card>
          </View>
        ) : null}
      </ScrollView>

      {sheet}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  content: {
    gap: 14,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    gap: 5,
  },
  summaryHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  summaryCount: {
    ...typography.captionSmBold,
    color: colors.primary,
  },
  summaryTotal: {
    ...typography.amountLg,
    color: colors.textTitle,
  },
  section: {
    gap: 10,
  },
  nextCard: {
    gap: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },

  // 확장 보기
  collapseButton: {
    width: 37,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18.5,
    backgroundColor: colors.white,
  },
  expandedContent: {
    flex: 1,
    gap: 11,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  expandedMonthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  expandedMonthTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  compactSummary: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  compactSummaryLabel: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
  compactSummaryBadge: {
    height: 22,
    paddingHorizontal: 9,
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
  },
  compactSummaryBadgeText: {
    ...typography.badge,
    color: colors.primary,
  },
  compactSummaryTotal: {
    ...typography.monthTitle,
    flex: 1,
    textAlign: 'right',
    color: colors.textPrimary,
  },
  expandedCalendar: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
  },
  legendToday: {
    width: 12,
    height: 12,
    marginLeft: 4,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  legendText: {
    ...typography.tiny,
    color: colors.textMuted,
  },
});
