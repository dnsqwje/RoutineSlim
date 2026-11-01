import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ChevronLeft from '@/assets/icons/chevron-left.svg';
import { colors, spacing, typography } from '@/theme';

type BackHeaderProps = {
  title: string;
  onBack: () => void;
  right?: ReactNode;
};

/** 상세 화면용 헤더: ‹ 뒤로 + 제목 + 우측 액션 */
export function BackHeader({ title, onBack, right }: BackHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" accessibilityLabel="뒤로" hitSlop={10} onPress={onBack}>
        <ChevronLeft width={22} height={22} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.monthTitle,
    flex: 1,
    color: colors.textTitle,
  },
});
