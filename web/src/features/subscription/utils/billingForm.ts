import { toDateKey, type DateKey } from '@/utils/date';

import type { Subscription } from '../types';

export type BillingCycle = Subscription['cycle'];

export const CYCLE_OPTIONS: { value: BillingCycle; label: string }[] = [
  { value: 'monthly', label: '매월' },
  { value: 'yearly', label: '매년' },
];

export const digitsOnly = (text: string) => text.replace(/[^0-9]/g, '');

/** 숫자만 받아 'YYYY. MM. DD' 모양으로 맞춘다 (입력 중에도). DateKey 를 넣어도 된다 */
export function formatDateInput(text: string) {
  const d = digitsOnly(text).slice(0, 8);
  return [d.slice(0, 4), d.slice(4, 6), d.slice(6, 8)].filter(Boolean).join('. ');
}

/** 'YYYY. MM. DD' → DateKey. 없는 날짜(2월 30일 등)면 null */
export function parseDateInput(text: string): DateKey | null {
  const d = digitsOnly(text);
  if (d.length !== 8) return null;
  const [year, month, day] = [Number(d.slice(0, 4)), Number(d.slice(4, 6)), Number(d.slice(6, 8))];
  const key = toDateKey(year, month, day);
  return key === `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` ? key : null;
}
