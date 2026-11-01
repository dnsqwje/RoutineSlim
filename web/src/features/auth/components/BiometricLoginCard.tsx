import { Pressable, StyleSheet, Text, View } from 'react-native';

import ChevronRight from '@/assets/icons/chevron-right.svg';
import FaceId from '@/assets/icons/face-id.svg';
import { colors, radius, spacing, typography } from '@/theme';

type BiometricLoginCardProps = {
  onPress: () => void;
};

export function BiometricLoginCard({ onPress }: BiometricLoginCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>
        <FaceId width={19.8} height={19.8} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>생체 인증으로 빠르게 시작</Text>
        <Text style={styles.description}>Face ID · 지문으로 1초 로그인</Text>
      </View>
      <ChevronRight width={7.9} height={13.9} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: 15,
    paddingRight: 17,
    borderWidth: 1,
    borderColor: colors.successBorder,
    borderRadius: radius.xl,
    backgroundColor: colors.successSurface,
  },
  pressed: {
    opacity: 0.85,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.successIconBorder,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  title: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  description: {
    ...typography.tiny,
    color: colors.textMuted,
  },
});
