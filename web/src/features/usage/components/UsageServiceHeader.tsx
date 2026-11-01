import { StyleSheet, Text, View } from 'react-native';

import { ServiceLogoView } from '@/features/subscription/components/ServiceLogoView';
import type { Subscription } from '@/features/subscription/types';
import { colors, spacing, typography } from '@/theme';
import { formatWon } from '@/utils/format';

type UsageServiceHeaderProps = {
  subscription: Subscription;
  subtitle: string;
  /** 정리 후보는 금액을 굵게 */
  emphasizePrice?: boolean;
};

/** 로고 + 서비스명/설명 + 월 금액 */
export function UsageServiceHeader({ subscription, subtitle, emphasizePrice = false }: UsageServiceHeaderProps) {
  return (
    <View style={styles.container}>
      <ServiceLogoView logo={subscription.logo} />
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>
          {subscription.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Text style={[styles.price, emphasizePrice && styles.priceBold]}>{formatWon(subscription.price)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.cardTitle,
    color: colors.textTitle,
  },
  subtitle: {
    ...typography.caption12,
    color: colors.textSubtle,
  },
  price: {
    ...typography.cardTitle,
    fontWeight: '500',
    color: colors.textTitle,
  },
  priceBold: {
    fontWeight: '700',
  },
});
