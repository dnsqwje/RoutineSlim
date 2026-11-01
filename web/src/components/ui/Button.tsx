import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, radius, typography } from '@/theme';

type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  /** 제목 왼쪽 아이콘 */
  icon?: ReactNode;
  /** 제목 오른쪽 아이콘 (예: →) */
  trailingIcon?: ReactNode;
  /** lg: 56px (로그인 등), md: 52px (화면 하단 액션) */
  size?: 'md' | 'lg';
  /** secondary: 연보라 배경의 보조 버튼 */
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export function Button({
  title,
  icon,
  trailingIcon,
  size = 'lg',
  variant = 'primary',
  disabled,
  style,
  titleStyle,
  ...rest
}: ButtonProps) {
  const secondary = variant === 'secondary';
  return (
    <Pressable
      accessibilityRole="button"
      aria-disabled={!!disabled}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        size === 'md' && styles.md,
        secondary && styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {icon}
      <Text style={[styles.title, size === 'md' && styles.titleMd, secondary && styles.titleSecondary, titleStyle]}>
        {title}
      </Text>
      {trailingIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    flexDirection: 'row',
    gap: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: {
    height: 52,
    borderRadius: radius.md,
  },
  secondary: {
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    backgroundColor: colors.textDisabled,
  },
  title: {
    ...typography.button,
    color: colors.white,
  },
  titleMd: {
    ...typography.settingsTitle,
  },
  titleSecondary: {
    color: colors.primaryStrong,
  },
});
