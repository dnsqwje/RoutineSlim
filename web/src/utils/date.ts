/** 'YYYY-MM-DD' 형식의 날짜 키 (타임존 영향 없이 날짜만 다루기 위해 문자열로 통일) */
export type DateKey = string;

export function toDateKey(year: number, month: number, day: number): DateKey {
  const date = new Date(year, month - 1, day);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: DateKey) {
  const [year, month, day] = key.split('-').map(Number);
  return { year, month, day };
}

export function diffInDays(from: DateKey, to: DateKey) {
  const a = parseDateKey(from);
  const b = parseDateKey(to);
  const ms = Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day);
  return Math.round(ms / 86_400_000);
}

export type YearMonth = { year: number; month: number };

/** 연·월을 delta 개월만큼 이동 (12월 → 1월 넘김 처리) */
export function shiftMonth({ year, month }: YearMonth, delta: number): YearMonth {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}
