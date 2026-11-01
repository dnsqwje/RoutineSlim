import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ChevronRight from '@/assets/icons/chevron-right-light.svg';
import { colors, spacing, typography } from '@/theme';

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

/** 회색 섹션 제목 + 테두리 카드 안에 행들을 구분선으로 나눠 담는다 */
export function SettingsSection({ title, children }: SettingsSectionProps) {
  const rows = Children.toArray(children);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 ? <View style={styles.divider} /> : null}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

type SettingsRowProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  /** 기본은 › 화살표. 토글 등 다른 컨트롤을 넣을 수 있다 */
  accessory?: ReactNode;
  onPress?: () => void;
};

export function SettingsRow({ icon, title, subtitle, value, accessory, onPress }: SettingsRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>{icon}</View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {accessory ?? <ChevronRight width={7.8} height={13.8} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 9,
  },
  sectionTitle: {
    ...typography.label,
    paddingLeft: spacing.xs,
    color: colors.textMuted,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    marginLeft: 52,
    marginRight: spacing.lg,
    backgroundColor: colors.border,
  },
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: 15,
    paddingRight: 18,
  },
  pressed: {
    backgroundColor: colors.backgroundMuted,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.settingsTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  value: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
