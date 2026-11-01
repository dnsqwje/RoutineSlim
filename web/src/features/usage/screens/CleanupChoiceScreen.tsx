import { useSubscriptions } from '@/web/subscriptions';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import { BackHeader } from '@/components/common/BackHeader';
import { Button } from '@/components/ui/Button';
import { MOCK_TODAY } from '@/features/subscription/data/mockSubscriptions';
import { colors, spacing, typography } from '@/theme';
import type { DateKey } from '@/utils/date';
import { formatWon } from '@/utils/format';

import { CleanupChoiceCard } from '../components/CleanupChoiceCard';
import { mockCleanupOptions } from '../data/mockCleanupOptions';
import { mockUsage } from '../data/mockUsage';
import { analyzeUsage } from '../utils/analyzeUsage';
import { getCleanupChoices, getDefaultAction, type CleanupAction } from '../utils/cleanupPlan';

export type CleanupSelection = Record<string, CleanupAction>;

type CleanupChoiceScreenProps = {
  /** 정리 후보 구독 id (접속 적은 순) */
  subscriptionIds: string[];
  today?: DateKey;
  onBack: () => void;
  onCompare?: (selection: CleanupSelection) => void;
};

export function CleanupChoiceScreen({ subscriptionIds, today = MOCK_TODAY, onBack, onCompare }: CleanupChoiceScreenProps) {
  const subscriptions = useSubscriptions();
  const idsKey = subscriptionIds.join(',');
  const candidates = useMemo(() => {
    const { candidates: usages } = analyzeUsage(subscriptions, mockUsage, today, Number.POSITIVE_INFINITY);
    return (
      usages
        .filter((u) => idsKey.split(',').includes(u.subscription.id))
        // 절약 폭이 큰(금액이 큰) 구독부터
        .sort((a, b) => b.subscription.price - a.subscription.price)
        .map((usage) => {
          const info = mockCleanupOptions[usage.subscription.id];
          return { usage, info, choices: getCleanupChoices(usage.subscription, info) };
        })
    );
  }, [idsKey, today, subscriptions]);

  const [selection, setSelection] = useState<CleanupSelection>(() =>
    Object.fromEntries(candidates.map(({ usage, info }) => [usage.subscription.id, getDefaultAction(info)])),
  );

  const totalBefore = subscriptions.reduce((sum, s) => sum + s.price, 0);
  const saving = candidates.reduce((sum, { usage, choices }) => {
    const choice = choices.find((c) => c.action === selection[usage.subscription.id]);
    return sum + (choice ? usage.subscription.price - choice.newPrice : 0);
  }, 0);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <BackHeader title="정리 방법 선택" onBack={onBack} right={<Text style={styles.step}>2/3</Text>} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>어떻게 정리할까요?</Text>
          <Text style={styles.subtitle}>서비스마다 해지, 저렴한 요금제, 파티원 모집 중에서 고를 수 있어요.</Text>
        </View>

        {candidates.map(({ usage, info, choices }) => (
          <CleanupChoiceCard
            key={usage.subscription.id}
            subscription={usage.subscription}
            usageLabel={
              usage.accessDays === 0
                ? `${usage.days.length}일 동안 접속 없음`
                : `${usage.days.length}일 중 ${usage.accessDays}일 접속`
            }
            choices={choices}
            selected={selection[usage.subscription.id]}
            onSelect={(action) => setSelection((prev) => ({ ...prev, [usage.subscription.id]: action }))}
            cancelNote={info?.cancelNote}
          />
        ))}
      </ScrollView>

      <View style={styles.bottomAction}>
        <View style={styles.savings}>
          <View style={styles.savingsTexts}>
            <Text style={styles.savingsLabel}>선택한 대로 정리하면</Text>
            <Text style={styles.savingsTotal}>
              {'월 '}
              <Text style={styles.savingsAmount}>{formatWon(saving)}</Text>
              {' 절약'}
            </Text>
          </View>
          <Text style={styles.beforeAfter}>
            {`${formatWon(totalBefore)} → `}
            <Text style={styles.after}>{formatWon(totalBefore - saving)}</Text>
          </Text>
        </View>
        <Button
          size="md"
          title="전후 비교 보기"
          trailingIcon={<ArrowRightIcon width={18} height={18} />}
          onPress={() => onCompare?.(selection)}
          style={styles.button}
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
  intro: {
    gap: 6,
    paddingBottom: spacing.xs,
  },
  title: {
    ...typography.titleLg,
    color: colors.textTitle,
  },
  subtitle: {
    ...typography.body14,
    color: colors.textSubtle,
  },
  bottomAction: {
    gap: 14,
    paddingTop: 18,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  savings: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  savingsTexts: {
    gap: 2,
  },
  savingsLabel: {
    ...typography.body13,
    color: colors.textSubtle,
  },
  savingsTotal: {
    ...typography.savingsTotal,
    color: colors.textTitle,
  },
  savingsAmount: {
    color: colors.primary,
  },
  beforeAfter: {
    ...typography.body13,
    color: colors.textBody,
  },
  after: {
    fontWeight: '700',
    color: colors.textTitle,
  },
  button: {
    gap: 6,
  },
});
