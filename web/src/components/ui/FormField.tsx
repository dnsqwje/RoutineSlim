import { createContext, useContext, type ReactNode } from 'react';
const FieldLabel = createContext('');
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import ChevronDown from '@/assets/icons/chevron-down-muted.svg';
import { colors, radius, spacing, typography } from '@/theme';

type FormFieldProps = {
  label: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** 라벨 + 입력 영역 */
export function FormField({ label, children, style }: FormFieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <FieldLabel.Provider value={label}>{children}</FieldLabel.Provider>
    </View>
  );
}

type FormInputProps = TextInputProps & {
  /** 입력칸 오른쪽 아이콘/단위 */
  trailing?: ReactNode;
};

export function FormInput({ trailing, style, ...inputProps }: FormInputProps) {
  const label = useContext(FieldLabel);
  return (
    <View style={styles.box}>
      <TextInput accessibilityLabel={label || undefined} placeholderTextColor={colors.textPlaceholder} style={[styles.input, style]} {...inputProps} />
      {trailing}
    </View>
  );
}

type FormSelectProps = {
  value?: string;
  placeholder: string;
  onPress: () => void;
};

/** 누르면 선택 시트를 여는 드롭다운 모양 입력칸 */
export function FormSelect({ value, placeholder, onPress }: FormSelectProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.box}>
      <Text style={[styles.input, !value && styles.placeholder]} numberOfLines={1}>
        {value ?? placeholder}
      </Text>
      <ChevronDown width={17} height={17} />
    </Pressable>
  );
}

export const formStyles = StyleSheet.create({
  /** 입력칸 테두리 박스 (직접 조합할 때) */
  box: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  input: {
    ...typography.formInput,
    flex: 1,
    // 웹 <input> 의 기본 너비 때문에 옆 요소가 밀려나지 않도록
    minWidth: 0,
    padding: 0,
    color: colors.textTitle,
  },
});

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    ...typography.captionSmBold,
    color: colors.textTitle,
  },
  box: formStyles.box,
  input: formStyles.input,
  placeholder: {
    color: colors.textPlaceholder,
  },
});
