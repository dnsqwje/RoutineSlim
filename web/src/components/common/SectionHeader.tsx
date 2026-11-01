import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

type SectionHeaderProps = {
  title: string;
  trailing?: string;
  onPressTrailing?: () => void;
};

export function SectionHeader({ title, trailing, onPressTrailing }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {trailing ? (
        <Pressable disabled={!onPressTrailing} hitSlop={8} onPress={onPressTrailing}>
          <Text style={styles.trailing}>{trailing}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textTitle,
  },
  trailing: {
    ...typography.captionSm,
    color: colors.textSubtle,
  },
});
