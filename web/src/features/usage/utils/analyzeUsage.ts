import type { Subscription } from '@/features/subscription/types';
import { parseDateKey, toDateKey, type DateKey } from '@/utils/date';

import type { UsageRecord } from '../data/mockUsage';

export const USAGE_WINDOW_DAYS = 30;

export type TrackedUsage = {
  subscription: Subscription;
  /** 기간 첫날부터 하루씩 접속 여부 */
  days: boolean[];
  accessDays: number;
  lastAccessDate: DateKey | null;
  /** 접속 1일당 비용. 접속이 없으면 null */
  costPerAccessDay: number | null;
};

/** 오늘 기준 어제까지 30일 */
export function getUsageWindow(today: DateKey) {
  const { year, month, day } = parseDateKey(today);
  const end = toDateKey(year, month, day - 1);
  const start = toDateKey(year, month, day - USAGE_WINDOW_DAYS);
  return { start, end };
}

/** 정리 기준(한 달 접속 일 수) 이하인 구독은 정리 후보, 나머지는 자주 쓰는 구독 */
export function analyzeUsage(
  subscriptions: Subscription[],
  usage: Record<string, UsageRecord>,
  today: DateKey,
  threshold: number,
) {
  const { start } = getUsageWindow(today);
  const startParts = parseDateKey(start);

  const tracked: TrackedUsage[] = [];
  const background: Subscription[] = [];

  for (const subscription of subscriptions) {
    const record = usage[subscription.id];
    if (!record) continue;
    if (record.kind === 'background') {
      background.push(subscription);
      continue;
    }

    const days = [...record.access].map((c) => c === '1');
    const accessDays = days.filter(Boolean).length;
    const lastIndex = days.lastIndexOf(true);
    const lastAccessDate =
      lastIndex >= 0
        ? toDateKey(startParts.year, startParts.month, startParts.day + lastIndex)
        : (record.lastAccessDate ?? null);

    tracked.push({
      subscription,
      days,
      accessDays,
      lastAccessDate,
      costPerAccessDay: accessDays > 0 ? Math.round(subscription.price / accessDays) : null,
    });
  }

  const byAccess = (a: TrackedUsage, b: TrackedUsage) => a.accessDays - b.accessDays;
  const candidates = tracked.filter((u) => u.accessDays <= threshold).sort(byAccess);
  const frequent = tracked.filter((u) => u.accessDays > threshold).sort((a, b) => -byAccess(a, b));

  return {
    candidates,
    frequent,
    background,
    candidateTotal: candidates.reduce((sum, u) => sum + u.subscription.price, 0),
  };
}

/** 'YYYY-MM-DD' → '9.11' */
export function formatShortDate(date: DateKey) {
  const { month, day } = parseDateKey(date);
  return `${month}.${day}`;
}
