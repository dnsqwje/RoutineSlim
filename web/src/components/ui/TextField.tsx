import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type TextFieldProps = TextInputProps & {
  label: string;
  leftIcon?: ReactNode;
  rightAccessory?: ReactNode;
};

export function TextField({ label, leftIcon, rightAccessory, style, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        {leftIcon ? <View style={styles.iconSlot}>{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor={colors.textPlaceholder}
          style={[styles.input, style]}
          {...inputProps}
        />
        {rightAccessory}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 7,
  },
  label: {
    ...typography.label,
    lineHeight: 16,
    color: colors.textLabel,
    paddingLeft: spacing.xs,
  },
  field: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  iconSlot: {
    width: 18,
    alignItems: 'center',
  },
  input: {
    ...typography.input,
    flex: 1,
    alignSelf: 'stretch',
    color: colors.textPrimary,
    padding: 0,
  },
});
