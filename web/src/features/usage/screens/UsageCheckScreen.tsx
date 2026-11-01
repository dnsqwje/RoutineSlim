import { useSubscriptions } from '@/web/subscriptions';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ClockIcon from '@/assets/icons/clock.svg';
import InfoIcon from '@/assets/icons/info.svg';
import { BackHeader } from '@/components/common/BackHeader';
import { Button } from '@/components/ui/Button';
import { MOCK_TODAY } from '@/features/subscription/data/mockSubscriptions';
import { colors, radius, spacing, typography } from '@/theme';
import type { DateKey } from '@/utils/date';
import { formatWon } from '@/utils/format';

import { CleanupCandidateCard } from '../components/CleanupCandidateCard';
import { UsageServiceHeader } from '../components/UsageServiceHeader';
import { UsageStrip } from '../components/UsageStrip';
import { mockUsage } from '../data/mockUsage';
import { analyzeUsage, formatShortDate, getUsageWindow, USAGE_WINDOW_DAYS } from '../utils/analyzeUsage';

const THRESHOLDS = [2, 4, 8];

type UsageCheckScreenProps = {
  today?: DateKey;
  onBack: () => void;
  onPressInfo?: () => void;
  /** 정리 후보 살펴보기 (후보 구독 id 목록) */
  onReviewCandidates?: (subscriptionIds: string[]) => void;
};

export function UsageCheckScreen({ today = MOCK_TODAY, onBack, onPressInfo, onReviewCandidates }: UsageCheckScreenProps) {
  const subscriptions = useSubscriptions();
  const [threshold, setThreshold] = useState(4);
  const window = getUsageWindow(today);
  const { candidates, frequent, background, candidateTotal } = useMemo(
    () => analyzeUsage(subscriptions, mockUsage, today, threshold),
    [today, threshold, subscriptions],
  );
  const frequentRows = [
    ...frequent.map((u) => ({
      subscription: u.subscription,
      subtitle: `${u.days.length}일 중 ${u.accessDays}일 접속 · 1일당 ${(u.costPerAccessDay ?? 0).toLocaleString('ko-KR')}원`,
      days: u.days as boolean[] | null,
    })),
    ...background.map((s) => ({ subscription: s, subtitle: '백그라운드로 쓰이는 서비스 · 집계 제외', days: null })),
  ];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <BackHeader
        title="사용량 점검"
        onBack={onBack}
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="도움말" hitSlop={8} onPress={onPressInfo}>
            <InfoIcon width={22} height={22} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <View style={styles.period}>
            <Text style={styles.periodText}>
              {`지난 ${USAGE_WINDOW_DAYS}일 · ${formatShortDate(window.start)} – ${formatShortDate(window.end)}`}
            </Text>
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceText}>체험용 사용 기록</Text>
            </View>
          </View>

          <View style={styles.headline}>
            <Text style={styles.headlineTitle}>
              {candidates.length > 0 ? `${candidates.length}개 구독을 거의 안 썼어요` : '모든 구독을 잘 쓰고 있어요'}
            </Text>
            {candidates.length > 0 ? (
              <Text style={styles.headlineLead}>
                그런데도 매달 <Text style={styles.headlineAmount}>{formatWon(candidateTotal)}</Text>이 나가고 있어요
              </Text>
            ) : null}
          </View>

          <View style={styles.divider} />

          <View style={styles.threshold}>
            <Text style={styles.thresholdLabel}>정리 기준 · 한 달 접속 일 수</Text>
            <View style={styles.options}>
              {THRESHOLDS.map((value) => {
                const selected = value === threshold;
                return (
                  <Pressable
                    key={value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => setThreshold(value)}
                    style={[styles.option, selected && styles.optionSelected]}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{`월 ${value}일 이하`}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {'정리 후보 '}
            <Text style={styles.sectionCount}>{candidates.length}</Text>
          </Text>
          <Text style={styles.sectionTrailing}>접속 적은 순</Text>
        </View>
        {candidates.map((usage) => (
          <CleanupCandidateCard key={usage.subscription.id} usage={usage} window={window} />
        ))}
        {candidates.length === 0 ? <Text style={styles.empty}>이 기준에 해당하는 구독이 없어요</Text> : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>자주 쓰는 구독</Text>
          {/* 집계 제외(백그라운드) 서비스는 개수에서 뺀다 */}
          <Text style={styles.sectionTrailing}>{`${frequent.length}개`}</Text>
        </View>
        <View style={styles.frequentCard}>
          {frequentRows.map((row, index) => (
            <View
              key={row.subscription.id}
              style={[styles.frequentRow, index < frequentRows.length - 1 && styles.frequentRowDivider]}
            >
              <UsageServiceHeader subscription={row.subscription} subtitle={row.subtitle} />
              {row.days ? <UsageStrip days={row.days} size="sm" /> : null}
            </View>
          ))}
        </View>

        <View style={styles.howWeCount}>
          <ClockIcon width={20} height={20} />
          <View style={styles.howWeCountTexts}>
            <Text style={styles.howWeCountTitle}>접속 일 수는 이렇게 세요</Text>
            <Text style={styles.howWeCountBody}>
              휴대폰 앱 사용 기록에서 하루에 한 번이라도 연 날을 1일로 셉니다. 웹이나 TV로만 보는 서비스는 상세 화면에서
              직접 체크할 수 있어요.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          size="md"
          title={candidates.length > 0 ? `정리 후보 ${candidates.length}개 살펴보기` : '정리할 구독이 없어요'}
          disabled={candidates.length === 0}
          onPress={() => onReviewCandidates?.(candidates.map((u) => u.subscription.id))}
          style={styles.bottomButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
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
  period: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodText: {
    ...typography.body13,
    color: colors.textSubtle,
  },
  sourceBadge: {
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  sourceText: {
    ...typography.caption12Bold,
    color: colors.primary,
  },
  headline: {
    gap: 6,
  },
  headlineTitle: {
    ...typography.headline,
    color: colors.textTitle,
  },
  headlineLead: {
    ...typography.lead,
    color: colors.textBody,
  },
  headlineAmount: {
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  threshold: {
    gap: 10,
  },
  thresholdLabel: {
    ...typography.body13Medium,
    color: colors.textBody,
  },
  options: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  optionSelected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionText: {
    ...typography.optionLabel,
    color: colors.textBody,
  },
  optionTextSelected: {
    fontWeight: '700',
    color: colors.primaryStrong,
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
  sectionCount: {
    color: colors.primary,
  },
  sectionTrailing: {
    ...typography.body13,
    color: colors.textSubtle,
  },
  empty: {
    ...typography.body13,
    paddingVertical: spacing.lg,
    textAlign: 'center',
    color: colors.textSubtle,
  },
  frequentCard: {
    paddingHorizontal: 18,
    paddingVertical: spacing.xs,
    borderRadius: radius.xl + 4,
    backgroundColor: colors.white,
  },
  frequentRow: {
    gap: 10,
    paddingVertical: 14,
  },
  frequentRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  howWeCount: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.primarySoft,
  },
  howWeCountTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  howWeCountTitle: {
    ...typography.infoTitle,
    color: colors.infoTitle,
  },
  howWeCountBody: {
    ...typography.infoBody,
    color: colors.infoBody,
  },
  bottomAction: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  bottomButton: {
    borderRadius: radius.md,
  },
});
