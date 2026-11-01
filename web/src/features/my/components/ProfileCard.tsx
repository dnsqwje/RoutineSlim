import { Pressable, StyleSheet, Text, View } from 'react-native';

import ProfileUserIcon from '@/assets/icons/profile-user.svg';
import { colors, radius, spacing, typography } from '@/theme';

type ProfileCardProps = {
  name: string;
  email: string;
  slimDays: number;
  onPressEdit?: () => void;
};

export function ProfileCard({ name, email, slimDays, onPressEdit }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <ProfileUserIcon width={17.8} height={19} />
        </View>
        <View style={styles.texts}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{`슬림 ${slimDays}일째`}</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onPressEdit}
        style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
      >
        <Text style={styles.editText}>프로필 편집</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    paddingTop: 11,
    paddingBottom: spacing.md,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl + 4,
    backgroundColor: colors.white,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  name: {
    ...typography.profileName,
    color: colors.textPrimary,
  },
  email: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
  badge: {
    alignSelf: 'flex-start',
    height: 24,
    marginTop: 4,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  badgeText: {
    ...typography.badge,
    color: colors.primary,
  },
  editButton: {
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  pressed: {
    backgroundColor: colors.backgroundMuted,
  },
  editText: {
    ...typography.label,
    color: colors.textLabel,
  },
});
