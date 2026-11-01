import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import KakaoBubble from '@/assets/icons/kakao-bubble.svg';
import KakaoBubbleTail from '@/assets/icons/kakao-bubble-tail.svg';
import { colors, radius, spacing, typography } from '@/theme';

export type SocialProvider = 'naver' | 'kakao' | 'google';

type SocialLoginButtonsProps = {
  onPress: (provider: SocialProvider) => void;
};

export function SocialLoginButtons({ onPress }: SocialLoginButtonsProps) {
  return (
    <View style={styles.row}>
      <SocialButton label="네이버로 로그인" style={styles.naver} onPress={() => onPress('naver')}>
        <Text style={[styles.letter, { color: colors.white }]}>N</Text>
      </SocialButton>
      <SocialButton label="카카오로 로그인" style={styles.kakao} onPress={() => onPress('kakao')}>
        <View style={styles.kakaoSymbol}>
          <KakaoBubble width={23} height={18} />
          <KakaoBubbleTail width={6.5} height={6} style={styles.kakaoTail} />
        </View>
      </SocialButton>
      <SocialButton label="구글로 로그인" style={styles.google} onPress={() => onPress('google')}>
        <Text style={[styles.letter, { color: colors.google }]}>G</Text>
      </SocialButton>
    </View>
  );
}

type SocialButtonProps = {
  label: string;
  style: ViewStyle;
  onPress: () => void;
  children: ReactNode;
};

function SocialButton({ label, style, onPress, children }: SocialButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  naver: {
    backgroundColor: colors.naver,
  },
  kakao: {
    backgroundColor: colors.kakao,
  },
  google: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  letter: {
    ...typography.social,
  },
  kakaoSymbol: {
    width: 23,
    height: 22,
  },
  kakaoTail: {
    position: 'absolute',
    left: 4,
    top: 16,
  },
});
