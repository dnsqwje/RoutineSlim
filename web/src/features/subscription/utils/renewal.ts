import { daysInMonth, parseDateKey, toDateKey, type DateKey } from '@/utils/date';

import type { Subscription } from '../types';

/** 해당 월에 이 구독이 결제되는 날짜. 결제가 없는 달이면 null */
export function getRenewalDateInMonth(subscription: Subscription, year: number, month: number): DateKey | null {
  const base = parseDateKey(subscription.nextBillingDate);
  if (subscription.cycle === 'yearly' && base.month !== month) return null;
  // 31일 결제 구독이 30일까지인 달에는 말일에 결제된다
  return toDateKey(year, month, Math.min(base.day, daysInMonth(year, month)));
}

/** 월 단위로 날짜별 결제 구독 목록을 묶는다 */
export function groupRenewalsByDate(subscriptions: Subscription[], year: number, month: number) {
  const map = new Map<DateKey, Subscription[]>();
  for (const subscription of subscriptions) {
    const date = getRenewalDateInMonth(subscription, year, month);
    if (!date) continue;
    map.set(date, [...(map.get(date) ?? []), subscription]);
  }
  return map;
}

/** 오늘 이후 가장 가까운 결제일과 그날 결제되는 구독들 */
export function findNextPayments(subscriptions: Subscription[], today: DateKey) {
  const upcoming = subscriptions.filter((s) => s.nextBillingDate >= today);
  if (upcoming.length === 0) return null;
  const date = upcoming.reduce((min, s) => (s.nextBillingDate < min ? s.nextBillingDate : min), upcoming[0].nextBillingDate);
  return { date, subscriptions: upcoming.filter((s) => s.nextBillingDate === date) };
}
