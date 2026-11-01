import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ChevronLeft from '@/assets/icons/chevron-left-muted.svg';
import ChevronRight from '@/assets/icons/chevron-right-muted.svg';
import { Card } from '@/components/common/Card';
import { colors, radius, typography } from '@/theme';
import { parseDateKey, type DateKey } from '@/utils/date';

import { buildMonthGrid, type CalendarDay } from '../utils/buildMonthGrid';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const RENEWAL_DOT_COLORS = [colors.primary, colors.renewalSecondary];

type MonthCalendarProps = {
  year: number;
  month: number;
  today: DateKey;
  selectedDate?: DateKey | null;
  /** 날짜별 결제 건수 */
  renewalCounts: Map<DateKey, number>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPressDay?: (date: DateKey) => void;
};

export function MonthCalendar({
  year,
  month,
  today,
  selectedDate,
  renewalCounts,
  onPrevMonth,
  onNextMonth,
  onPressDay,
}: MonthCalendarProps) {
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const todayParts = parseDateKey(today);
  const isCurrentMonth = todayParts.year === year && todayParts.month === month;

  return (
    <Card style={styles.card}>
      <View style={styles.monthSelector}>
        <Pressable accessibilityRole="button" accessibilityLabel="이전 달" hitSlop={10} onPress={onPrevMonth}>
          <ChevronLeft width={20} height={20} />
        </Pressable>
        <Text style={styles.monthTitle}>{`${year}년 ${month}월`}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="다음 달" hitSlop={10} onPress={onNextMonth}>
          <ChevronRight width={20} height={20} />
        </Pressable>
      </View>

      <View style={styles.row}>
        {WEEKDAYS.map((label, index) => (
          <Text key={label} style={[styles.weekday, index === 0 && styles.sunday]}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.weeks}>
        {weeks.map((week) => (
          <View key={week[0].key} style={styles.row}>
            {week.map((day) => (
              <DayCell
                key={day.key}
                day={day}
                isToday={day.key === today}
                isSelected={day.key === selectedDate}
                renewalCount={day.inMonth ? (renewalCounts.get(day.key) ?? 0) : 0}
                onPress={onPressDay}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendDot} />
        <Text style={styles.legendText}>결제 예정일</Text>
        {isCurrentMonth ? (
          <Text style={[styles.legendText, styles.legendToday]}>{`· 오늘 ${todayParts.day}일`}</Text>
        ) : null}
      </View>
    </Card>
  );
}

type DayCellProps = {
  day: CalendarDay;
  isToday: boolean;
  isSelected: boolean;
  renewalCount: number;
  onPress?: (date: DateKey) => void;
};

function DayCell({ day, isToday, isSelected, renewalCount, onPress }: DayCellProps) {
  const dots = RENEWAL_DOT_COLORS.slice(0, renewalCount);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${day.day}일${renewalCount > 0 ? `, 결제 ${renewalCount}건` : ''}`}
      aria-selected={isSelected}
      disabled={!onPress || !day.inMonth}
      onPress={() => onPress?.(day.key)}
      style={styles.day}
    >
      <View style={[styles.date, isToday && styles.dateToday, isSelected && styles.dateSelected]}>
        <Text
          style={[
            styles.dateText,
            day.weekday === 0 && styles.sunday,
            !day.inMonth && styles.dateOutside,
            isToday && styles.dateTextToday,
            isSelected && styles.dateTextSelected,
          ]}
        >
          {day.day}
        </Text>
      </View>
      <View style={styles.dots}>
        {dots.map((color) => (
          <View key={color} style={[styles.dot, { backgroundColor: color }]} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthTitle: {
    ...typography.monthTitle,
    color: colors.textTitle,
  },
  row: {
    flexDirection: 'row',
  },
  weekday: {
    ...typography.meta,
    flex: 1,
    textAlign: 'center',
    color: colors.textSubtle,
  },
  sunday: {
    color: colors.sunday,
  },
  weeks: {
    gap: 2,
  },
  day: {
    flex: 1,
    height: 42,
    alignItems: 'center',
    gap: 3,
  },
  date: {
    width: 29,
    height: 29,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateToday: {
    backgroundColor: colors.primarySoft,
  },
  dateText: {
    ...typography.day,
    color: colors.textTitle,
  },
  dateOutside: {
    color: colors.textDisabled,
  },
  dateTextToday: {
    fontWeight: '700',
    color: colors.primary,
  },
  dateSelected: {
    backgroundColor: colors.primary,
  },
  dateTextSelected: {
    fontWeight: '700',
    color: colors.white,
  },
  dots: {
    width: 12,
    height: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  legendDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  legendText: {
    ...typography.meta,
    color: colors.textSubtle,
  },
  legendToday: {
    color: colors.primary,
  },
});
