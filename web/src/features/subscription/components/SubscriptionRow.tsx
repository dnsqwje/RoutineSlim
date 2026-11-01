import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { colors, spacing, typography } from '@/theme';
import { formatMonthDay, formatWon } from '@/utils/format';

import type { Subscription } from '../types';
import { ServiceLogoView } from './ServiceLogoView';

type SubscriptionRowProps = {
  subscription: Subscription;
  /** 예: 'D-1'. 있으면 금액 아래에 배지로 표시 */
  badge?: string;
  /** lg: 바텀시트 등에서 쓰는 큰 행 (로고 42px, 이름 14px) */
  size?: 'md' | 'lg';
  onPress?: () => void;
};

const CYCLE_LABEL: Record<Subscription['cycle'], string> = {
  monthly: '매월',
  yearly: '매년',
};

export function SubscriptionRow({ subscription, badge, size = 'md', onPress }: SubscriptionRowProps) {
  const { name, logo, price, nextBillingDate, cycle } = subscription;

  return (
    <Pressable accessibilityRole="button" disabled={!onPress} onPress={onPress} style={styles.container}>
      <ServiceLogoView logo={logo} size={size} />
      <View style={styles.info}>
        <Text style={[styles.name, size === 'lg' && styles.nameLg]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {`${formatMonthDay(nextBillingDate)} 결제 · ${CYCLE_LABEL[cycle]}`}
        </Text>
      </View>
      <View style={styles.payment}>
        <Text style={styles.price}>{formatWon(price)}</Text>
        {badge ? <Badge label={badge} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    ...typography.listTitle,
    color: colors.textTitle,
  },
  nameLg: {
    ...typography.listTitleLg,
  },
  meta: {
    ...typography.meta,
    color: colors.textSubtle,
  },
  payment: {
    alignItems: 'flex-end',
    gap: 5,
  },
  price: {
    ...typography.listAmount,
    color: colors.textTitle,
  },
});
