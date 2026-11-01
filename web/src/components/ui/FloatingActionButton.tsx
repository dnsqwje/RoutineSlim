import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, shadows, spacing } from '@/theme';

export const FAB_SIZE = 56;
export const FAB_BOTTOM = 18;
/** FAB 에 마지막 항목이 가려지지 않도록 스크롤 영역 아래에 둘 여백 */
export const FAB_CONTENT_INSET = FAB_SIZE + FAB_BOTTOM + spacing.lg;

type FloatingActionButtonProps = {
  icon: ReactNode;
  accessibilityLabel: string;
  onPress?: () => void;
};

/** 부모 영역의 오른쪽 아래에 떠 있는 원형 버튼 */
export function FloatingActionButton({ icon, accessibilityLabel, onPress }: FloatingActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: FAB_BOTTOM,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    ...shadows.fab,
  },
  pressed: {
    opacity: 0.85,
  },
});
