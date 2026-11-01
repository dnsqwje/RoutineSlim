import { Modal } from '@/web/Modal';
import { useEffect, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CloseIcon from '@/assets/icons/close.svg';
import { Badge } from '@/components/ui/Badge';
import { SubscriptionRow } from '@/features/subscription/components/SubscriptionRow';
import type { Subscription } from '@/features/subscription/types';
import { colors, radius, spacing, typography } from '@/theme';
import type { DateKey } from '@/utils/date';
import { formatMonthDayWeekday, formatWon } from '@/utils/format';

const SHEET_CONTENT_MIN_HEIGHT = 306;
const OPEN_OFFSET = 400;
const useNativeDriver = Platform.OS !== 'web';

type DayPaymentsSheetProps = {
  /** 선택된 날짜. null 이면 시트를 닫는다 */
  date: DateKey | null;
  subscriptions: Subscription[];
  onClose: () => void;
};

export function DayPaymentsSheet({ date, subscriptions, onClose }: DayPaymentsSheetProps) {
  const insets = useSafeAreaInsets();
  const [progress] = useState(() => new Animated.Value(0));
  const [mounted, setMounted] = useState(date !== null);

  // 닫히는 애니메이션 동안에도 마지막 내용을 유지한다.
  // (렌더 중 ref 대신 state 로 — React Compiler 규칙. 새 날짜가 열릴 때만 갱신)
  const [shown, setShown] = useState({ date, subscriptions });
  if (date && date !== shown.date) setShown({ date, subscriptions });

  useEffect(() => {
    if (date) {
      setMounted(true);
      Animated.timing(progress, { toValue: 1, duration: 250, useNativeDriver }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: 200, useNativeDriver }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [date, progress]);

  if (!mounted || !shown.date) return null;

  const total = shown.subscriptions.reduce((sum, s) => sum + s.price, 0);
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [OPEN_OFFSET, 0] });

  return (
    <Modal accessibilityLabel="선택한 날짜의 결제 내역" transparent visible animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[styles.scrim, { opacity: progress }]}>
        <Pressable accessibilityLabel="닫기" style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { minHeight: SHEET_CONTENT_MIN_HEIGHT + insets.bottom, paddingBottom: insets.bottom, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.handleArea}>
          <View style={styles.handle} />
        </View>

        <View style={styles.body}>
          <View style={styles.heading}>
            <Text style={styles.title}>{formatMonthDayWeekday(shown.date)}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="닫기" hitSlop={10} onPress={onClose}>
              <CloseIcon width={20} height={20} />
            </Pressable>
          </View>

          <View style={styles.totalRow}>
            <Badge label={`결제 예정 ${shown.subscriptions.length}개`} />
            <Text style={styles.total}>{formatWon(total)}</Text>
          </View>

          <View style={styles.divider} />

          {shown.subscriptions.length > 0 ? (
            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
              {shown.subscriptions.map((subscription) => (
                <SubscriptionRow key={subscription.id} subscription={subscription} size="lg" />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.empty}>이 날은 결제 예정인 구독이 없어요</Text>
          )}
        </View>
      </Animated.View>
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
    maxHeight: '80%',
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
  body: {
    flexShrink: 1,
    gap: 18,
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.sheetTitle,
    flex: 1,
    color: colors.textTitle,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  total: {
    ...typography.amountMd,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    gap: 18,
  },
  empty: {
    ...typography.captionSm,
    paddingVertical: spacing.xxl,
    textAlign: 'center',
    color: colors.textSubtle,
  },
});
