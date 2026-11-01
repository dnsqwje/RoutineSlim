import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Subscription } from '@/features/subscription/types';
import { colors, radius, spacing, typography } from '@/theme';
import type { DateKey } from '@/utils/date';

import { buildMonthGrid, type CalendarDay } from '../utils/buildMonthGrid';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
/** 칸 높이에 들어가는 칩 수. 넘치면 '+N' */
const MAX_CHIPS = 2;

type ExpandedMonthCalendarProps = {
  year: number;
  month: number;
  today: DateKey;
  selectedDate?: DateKey | null;
  /** 날짜별 결제 구독 */
  renewals: Map<DateKey, Subscription[]>;
  onPressDay?: (date: DateKey) => void;
};

/** 날짜 칸마다 결제 금액 칩을 보여주는 큰 월 달력 */
export function ExpandedMonthCalendar({
  year,
  month,
  today,
  selectedDate,
  renewals,
  onPressDay,
}: ExpandedMonthCalendarProps) {
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);

  return (
    <View style={styles.card}>
      <View style={[styles.weekdays, styles.rowLine]}>
        {WEEKDAYS.map((label, index) => (
          <Text key={label} style={[styles.weekday, index === 0 && styles.sunday]}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, index) => (
        <View key={week[0].key} style={[styles.week, index < weeks.length - 1 && styles.rowLine]}>
          {week.map((day) => (
            <DayCell
              key={day.key}
              day={day}
              isToday={day.key === today}
              isSelected={day.key === selectedDate}
              payments={day.inMonth ? (renewals.get(day.key) ?? []) : []}
              onPress={onPressDay}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

type DayCellProps = {
  day: CalendarDay;
  isToday: boolean;
  isSelected: boolean;
  payments: Subscription[];
  onPress?: (date: DateKey) => void;
};

function DayCell({ day, isToday, isSelected, payments, onPress }: DayCellProps) {
  const hidden = payments.length - MAX_CHIPS;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${day.day}일${payments.length > 0 ? `, 결제 ${payments.length}건` : ''}`}
      aria-selected={isSelected}
      disabled={!onPress || !day.inMonth}
      onPress={() => onPress?.(day.key)}
      style={[styles.day, day.weekday > 0 && styles.columnLine, isSelected && styles.daySelected]}
    >
      <View style={[styles.date, isToday && styles.dateToday]}>
        <Text
          style={[
            styles.dateText,
            day.weekday === 0 && styles.sunday,
            !day.inMonth && styles.dateOutside,
            isToday && styles.dateTextToday,
          ]}
        >
          {day.day}
        </Text>
      </View>
      <View style={styles.chips}>
        {payments.slice(0, MAX_CHIPS).map((s) => (
          <View key={s.id} style={[styles.chip, { backgroundColor: s.accent.soft }]}>
            <View style={[styles.chipBar, { backgroundColor: s.accent.color }]} />
            <Text style={styles.chipText} numberOfLines={1}>
              {s.price.toLocaleString('ko-KR')}
            </Text>
          </View>
        ))}
        {hidden > 0 ? <Text style={styles.more}>{`+${hidden}`}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl + 4,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  rowLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gridLine,
  },
  columnLine: {
    borderLeftWidth: 1,
    borderLeftColor: colors.gridLine,
  },
  weekdays: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekday: {
    ...typography.captionSmBold,
    flex: 1,
    textAlign: 'center',
    color: colors.textMuted,
  },
  sunday: {
    color: colors.sunday,
  },
  week: {
    flex: 1,
    flexDirection: 'row',
  },
  day: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 5,
    gap: 7,
    overflow: 'hidden',
  },
  daySelected: {
    backgroundColor: colors.primarySoft,
  },
  date: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateToday: {
    backgroundColor: colors.primary,
  },
  dateText: {
    ...typography.captionSmBold,
    color: colors.textPrimary,
  },
  dateOutside: {
    fontWeight: '400',
    color: colors.textOutside,
  },
  dateTextToday: {
    color: colors.white,
  },
  chips: {
    alignItems: 'center',
    gap: 3,
  },
  chip: {
    width: 44,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  chipBar: {
    width: 3,
    height: 12,
    borderRadius: 1.5,
  },
  chipText: {
    ...typography.chip,
    flex: 1,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  more: {
    ...typography.chip,
    color: colors.textMuted,
  },
});
