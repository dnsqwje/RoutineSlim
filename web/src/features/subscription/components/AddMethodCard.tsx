import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ArrowRightIcon from '@/assets/icons/arrow-right-primary.svg';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/ui/Badge';
import { colors, radius, spacing, typography } from '@/theme';

type AddMethodCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  onPress?: () => void;
};

/** 구독 추가 방법 선택 카드: 아이콘 + (배지) / 제목 → / 설명 */
export function AddMethodCard({ icon, title, description, badge, onPress }: AddMethodCardProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress}>
      {({ pressed }) => (
        <Card style={[styles.card, pressed && styles.pressed]}>
          <View style={styles.heading}>
            <View style={styles.iconBox}>{icon}</View>
            {badge ? <Badge label={badge} /> : null}
          </View>
          <View style={styles.texts}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              <ArrowRightIcon width={20} height={20} />
            </View>
            <Text style={styles.description}>{description}</Text>
          </View>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    padding: 22,
  },
  pressed: {
    opacity: 0.85,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: colors.primarySoft,
  },
  texts: {
    gap: 7,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.monthTitle,
    flex: 1,
    color: colors.textTitle,
  },
  description: {
    ...typography.bodyRegular,
    color: colors.textSubtle,
  },
});
