import { daysInMonth, toDateKey, type DateKey } from '@/utils/date';

export type CalendarDay = {
  key: DateKey;
  day: number;
  /** 0 = 일요일 */
  weekday: number;
  inMonth: boolean;
};

/** 일요일 시작 주 단위 그리드. 앞뒤 빈칸은 이전/다음 달 날짜로 채운다 */
export function buildMonthGrid(year: number, month: number): CalendarDay[][] {
  const leading = new Date(year, month - 1, 1).getDay();
  const total = daysInMonth(year, month);
  const cellCount = Math.ceil((leading + total) / 7) * 7;

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < cellCount; i++) {
    // toDateKey 가 범위 밖 일자(0, -1, 32 …)를 이전/다음 달로 넘겨준다
    const key = toDateKey(year, month, i - leading + 1);
    const day = Number(key.slice(8));
    const inMonth = i >= leading && i < leading + total;
    if (i % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push({ key, day, weekday: i % 7, inMonth });
  }
  return weeks;
}
