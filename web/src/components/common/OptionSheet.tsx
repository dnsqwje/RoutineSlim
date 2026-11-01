import { Modal } from '@/web/Modal';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/theme';

type OptionSheetProps<T extends string> = {
  visible: boolean;
  title: string;
  options: { value: T; label: string }[];
  selected?: T | null;
  onSelect: (value: T) => void;
  onClose: () => void;
};

/** 화면 아래에서 올라오는 단일 선택 목록 */
export function OptionSheet<T extends string>({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: OptionSheetProps<T>) {
  const insets = useSafeAreaInsets();

  return (
    <Modal accessibilityLabel={title} transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable accessibilityLabel="닫기" style={styles.scrim} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.handleArea}>
          <View style={styles.handle} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <ScrollView style={styles.list}>
          {options.map((option) => {
            const isSelected = option.value === selected;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                aria-selected={isSelected}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              >
                <Text style={[styles.optionLabel, isSelected && styles.optionSelected]}>{option.label}</Text>
                {isSelected ? <Text style={styles.check}>✓</Text> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.scrim,
  },
  sheet: {
    width: '100%',
    maxWidth: 390,
    marginHorizontal: 'auto',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '70%',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    backgroundColor: colors.white,
  },
  handleArea: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  title: {
    ...typography.sheetTitle,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    color: colors.textTitle,
  },
  list: {
    flexGrow: 0,
  },
  option: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  optionPressed: {
    backgroundColor: colors.backgroundMuted,
  },
  optionLabel: {
    ...typography.formInput,
    flex: 1,
    color: colors.textTitle,
  },
  optionSelected: {
    fontWeight: '700',
    color: colors.primary,
  },
  check: {
    ...typography.formInput,
    fontWeight: '700',
    color: colors.primary,
  },
});
