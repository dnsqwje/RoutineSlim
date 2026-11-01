import { Pressable, StyleSheet, Text, View } from 'react-native';

import ReceiptTextIcon from '@/assets/icons/receipt-text.svg';
import { colors, radius, spacing, typography } from '@/theme';

type ImageUploadAreaProps = {
  onPress?: () => void;
};

/** 점선 테두리 업로드 영역: 영수증 그림 + 안내 문구 */
export function ImageUploadArea({ onPress }: ImageUploadAreaProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="이미지 선택"
      onPress={onPress}
      style={({ pressed }) => [styles.area, pressed && styles.pressed]}
    >
      <View style={styles.receipt}>
        <ReceiptTextIcon width={42} height={42} />
        <View style={[styles.receiptLine, styles.receiptLineLong]} />
        <View style={[styles.receiptLine, styles.receiptLineShort]} />
      </View>
      <View style={styles.prompt}>
        <Text style={styles.title}>이미지를 선택해주세요</Text>
        <Text style={styles.caption}>JPG, PNG · 최대 10MB · 1장</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  area: {
    height: 278,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
  },
  pressed: {
    backgroundColor: colors.primarySoft,
  },
  receipt: {
    width: 98,
    height: 108,
    alignItems: 'center',
    gap: 9,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  receiptLine: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.receiptLine,
  },
  receiptLineLong: {
    width: 58,
  },
  receiptLineShort: {
    width: 40,
  },
  prompt: {
    alignSelf: 'stretch',
    gap: 6,
  },
  title: {
    ...typography.uploadTitle,
    color: colors.textTitle,
    textAlign: 'center',
  },
  caption: {
    ...typography.captionSm,
    color: colors.textSubtle,
    textAlign: 'center',
  },
});
