import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import { formatMonthDay } from '@/utils/format';

import { formatShortDate, type TrackedUsage } from '../utils/analyzeUsage';
import { UsageServiceHeader } from './UsageServiceHeader';
import { UsageStrip } from './UsageStrip';

type CleanupCandidateCardProps = {
  usage: TrackedUsage;
  window: { start: string; end: string };
};

export function CleanupCandidateCard({ usage, window }: CleanupCandidateCardProps) {
  const { subscription, days, accessDays, lastAccessDate, costPerAccessDay } = usage;
  const billingDay = Number(subscription.nextBillingDate.slice(8));
  const subtitle = [subscription.plan, `매월 ${billingDay}일 결제`].filter(Boolean).join(' · ');

  return (
    <View style={styles.card}>
      <UsageServiceHeader subscription={subscription} subtitle={subtitle} emphasizePrice />

      <View style={styles.stripArea}>
        <UsageStrip days={days} />
        <View style={styles.axis}>
          <Text style={styles.axisText}>{formatShortDate(window.start)}</Text>
          <Text style={styles.axisText}>{formatShortDate(window.end)}</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaText} numberOfLines={1}>
          <Text style={styles.metaStrong}>
            {accessDays === 0 ? `${days.length}일 동안 접속 없음` : `${days.length}일 중 ${accessDays}일 접속`}
          </Text>
          {lastAccessDate ? ` · 마지막 ${formatMonthDay(lastAccessDate)}` : ''}
        </Text>
        <View style={styles.costBadge}>
          <Text style={styles.costText}>
            {costPerAccessDay === null ? '사용 없이 결제 중' : `1일당 ${costPerAccessDay.toLocaleString('ko-KR')}원`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    paddingHorizontal: 18,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl + 4,
    backgroundColor: colors.white,
  },
  stripArea: {
    gap: 6,
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisText: {
    ...typography.axis,
    color: colors.textAxis,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  metaText: {
    ...typography.body13,
    flexShrink: 1,
    color: colors.textBody,
  },
  metaStrong: {
    fontWeight: '700',
    color: colors.textTitle,
  },
  costBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    backgroundColor: colors.dangerSoft,
  },
  costText: {
    ...typography.caption12Bold,
    color: colors.danger,
  },
});
