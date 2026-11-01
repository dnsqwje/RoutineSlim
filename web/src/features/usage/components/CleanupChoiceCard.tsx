import { Pressable, StyleSheet, Text, View } from 'react-native';

import CheckIcon from '@/assets/icons/check-primary.svg';
import { ServiceLogoView } from '@/features/subscription/components/ServiceLogoView';
import type { Subscription } from '@/features/subscription/types';
import { colors, radius, spacing, typography } from '@/theme';
import { formatWon } from '@/utils/format';

import type { CleanupAction, CleanupChoice } from '../utils/cleanupPlan';

type CleanupChoiceCardProps = {
  subscription: Subscription;
  /** 예: '30일 중 2일 접속' */
  usageLabel: string;
  choices: CleanupChoice[];
  selected: CleanupAction;
  onSelect: (action: CleanupAction) => void;
  /** 해지 선택 시 보여줄 안내 */
  cancelNote?: string;
};

export function CleanupChoiceCard({
  subscription,
  usageLabel,
  choices,
  selected,
  onSelect,
  cancelNote,
}: CleanupChoiceCardProps) {
  // 2열 그리드. 홀수 개면 마지막 칸은 비워 둔다
  const rows: CleanupChoice[][] = [];
  for (let i = 0; i < choices.length; i += 2) rows.push(choices.slice(i, i + 2));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ServiceLogoView logo={subscription.logo} />
        <View style={styles.headerTexts}>
          <Text style={styles.name} numberOfLines={1}>
            {subscription.name}
            {subscription.plan ? <Text style={styles.plan}>{` ${subscription.plan}`}</Text> : null}
          </Text>
          <Text style={styles.usage}>{usageLabel}</Text>
        </View>
        <Text style={styles.price}>{formatWon(subscription.price)}</Text>
      </View>

      <View accessibilityRole="radiogroup" style={styles.grid}>
        {rows.map((row) => (
          <View key={row[0].action} style={styles.row}>
            {row.map((choice) => {
              const isSelected = choice.action === selected;
              return (
                <Pressable
                  key={choice.action}
                  accessibilityRole="radio"
                  aria-selected={isSelected}
                  onPress={() => onSelect(choice.action)}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <View style={styles.optionLabelRow}>
                    <Text style={styles.optionLabel} numberOfLines={1}>
                      {choice.label}
                    </Text>
                    {isSelected ? <CheckIcon width={16} height={16} /> : null}
                  </View>
                  <Text style={styles.optionDescription}>{choice.description}</Text>
                </Pressable>
              );
            })}
            {row.length === 1 ? <View style={styles.optionSpacer} /> : null}
          </View>
        ))}
      </View>

      {cancelNote && selected === 'cancel' ? (
        <View style={styles.note}>
          <Text style={styles.noteText}>{cancelNote}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl + 4,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerTexts: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.cardTitle,
    color: colors.textTitle,
  },
  plan: {
    ...typography.body13,
    color: colors.textSubtle,
  },
  usage: {
    ...typography.caption12Bold,
    color: colors.danger,
  },
  price: {
    ...typography.cardTitle,
    color: colors.textTitle,
  },
  grid: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    minHeight: 64,
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
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
  // 옵션 칸과 같은 여백·테두리 폭을 가져야 flex 분배 결과가 반 칸으로 맞는다
  optionSpacer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  optionLabel: {
    ...typography.label14,
    flexShrink: 1,
    color: colors.textTitle,
  },
  optionDescription: {
    ...typography.caption12Medium,
    color: colors.textOptionSub,
  },
  note: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.warningSoft,
  },
  noteText: {
    ...typography.note,
    color: colors.warning,
  },
});
