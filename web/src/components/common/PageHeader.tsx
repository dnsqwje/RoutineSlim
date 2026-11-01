import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type PageHeaderProps = {
  title: string;
  /** 제목 오른쪽 액션 (아이콘 버튼 등) */
  right?: ReactNode;
  /** 콘텐츠가 헤더 아래로 스크롤됐을 때 흰 배경 + 하단 구분선 */
  elevated?: boolean;
};

export function PageHeader({ title, right, elevated = false }: PageHeaderProps) {
  return (
    <View style={[styles.container, elevated && styles.elevated]}>
      <Text style={styles.title}>{title}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  elevated: {
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.pageTitle,
    flex: 1,
    color: colors.textTitle,
  },
});
