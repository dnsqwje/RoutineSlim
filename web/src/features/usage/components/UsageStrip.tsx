import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type UsageStripProps = {
  /** 하루씩 접속 여부 */
  days: boolean[];
  /** lg: 정리 후보 카드 (16px), sm: 자주 쓰는 구독 (8px) */
  size?: 'lg' | 'sm';
};

/** 기간 동안 접속한 날을 칸으로 보여주는 띠 */
export function UsageStrip({ days, size = 'lg' }: UsageStripProps) {
  const accessed = days.filter(Boolean).length;

  return (
    <View
      accessible
      accessibilityLabel={`${days.length}일 중 ${accessed}일 접속`}
      style={styles.strip}
    >
      {days.map((on, index) => (
        <View
          key={index}
          style={[size === 'lg' ? styles.cellLg : styles.cellSm, { backgroundColor: on ? colors.primary : colors.usageEmpty }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    gap: 2,
  },
  cellLg: {
    flex: 1,
    height: 16,
    borderRadius: 3,
  },
  cellSm: {
    flex: 1,
    height: 8,
    borderRadius: 2,
  },
});
