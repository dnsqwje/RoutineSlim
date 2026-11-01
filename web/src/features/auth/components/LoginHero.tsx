import { webSvgStyle } from '@/web/svg';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import CardBack from '@/assets/images/login-hero/card-back.svg';
import CardChip from '@/assets/images/login-hero/card-chip.svg';
import CardChipLines from '@/assets/images/login-hero/card-chip-lines.svg';
import CardFront from '@/assets/images/login-hero/card-front.svg';
import CardStrip from '@/assets/images/login-hero/card-strip.svg';
import Coin from '@/assets/images/login-hero/coin.svg';
import CoinRing from '@/assets/images/login-hero/coin-ring.svg';
import Sparkle from '@/assets/images/login-hero/sparkle.svg';
import { colors, radius, spacing, typography } from '@/theme';

type LoginHeroProps = {
  savingsAmount: string;
};

export function LoginHero({ savingsAmount }: LoginHeroProps) {
  return (
    <LinearGradient
      colors={[colors.heroGradientStart, colors.heroGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.48, y: 1.52 }}
      style={styles.container}
    >
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>구독 관리의 새로운 기준</Text>
      </View>

      <Text style={styles.title}>{'루틴슬림\n로그인'}</Text>
      <Text style={styles.subtitle}>{`구독 한 번으로 ${savingsAmount}원\n아끼기, 오늘부터.`}</Text>

      {/* 일러스트: Figma 레이어 순서(뒤 카드 → 앞 카드 → 코인 → 반짝이) 유지 */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <CardBack width={104} height={66} style={webSvgStyle(styles.cardBack)} />
        <View style={styles.cardFront}>
          <CardFront width={108} height={68} />
          <View style={styles.chip}>
            <CardChip width={22} height={16} />
            <CardChipLines width={22} height={16} style={StyleSheet.absoluteFill} />
          </View>
          <CardStrip width={14} height={6} style={styles.strip} />
          <Text style={styles.amount}>{savingsAmount}</Text>
        </View>
        <View style={styles.coin}>
          <Coin width={30} height={30} style={StyleSheet.absoluteFill} />
          <CoinRing width={21.6} height={21.6} style={styles.coinRing} />
          <Text style={styles.coinSymbol}>₩</Text>
        </View>
        <Sparkle width={6} height={6} style={styles.sparkle} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 196,
    borderRadius: radius.xxl,
    paddingTop: 18,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  badge: {
    alignSelf: 'flex-start',
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    paddingRight: spacing.md,
    borderRadius: 13,
    backgroundColor: colors.white,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  badgeText: {
    ...typography.badge,
    color: colors.primary,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    marginTop: 13,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 10,
  },
  cardBack: {
    position: 'absolute',
    left: 224,
    top: 60,
    transform: [{ rotate: '14deg' }],
  },
  cardFront: {
    position: 'absolute',
    left: 228,
    top: 66,
    width: 108,
    height: 68,
    transform: [{ rotate: '-10deg' }],
  },
  chip: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
  strip: {
    position: 'absolute',
    left: 12,
    top: 44,
  },
  amount: {
    ...typography.amount,
    position: 'absolute',
    right: spacing.md,
    top: 41,
    color: colors.primary,
  },
  coin: {
    position: 'absolute',
    left: 303,
    top: 21,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinRing: {
    position: 'absolute',
    left: 4.2,
    top: 4.2,
  },
  coinSymbol: {
    ...typography.label,
    fontSize: 12,
    color: colors.white,
  },
  sparkle: {
    position: 'absolute',
    left: 239,
    top: 47,
  },
});
