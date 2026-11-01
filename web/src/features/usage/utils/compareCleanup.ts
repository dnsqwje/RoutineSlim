import { CATEGORY_ORDER } from '@/features/subscription/categories';
import type { Subscription, SubscriptionCategory } from '@/features/subscription/types';
import { parseDateKey, type DateKey } from '@/utils/date';
import { formatMonthDay } from '@/utils/format';

import type { CleanupOptionInfo } from '../data/mockCleanupOptions';
import type { UsageRecord } from '../data/mockUsage';
import { analyzeUsage } from './analyzeUsage';
import { getCleanupChoices, type CleanupAction } from './cleanupPlan';

export type DiffRow = {
  subscription: Subscription;
  kind: 'removed' | 'changed' | 'unchanged';
  /** 예: '해지 · 30일 동안 접속 없음', '프리미엄 → 광고형 스탠다드', '24일 접속' */
  detail: string;
  newPrice: number;
};

export type CategoryChange = { category: SubscriptionCategory; before: number; after: number };

export type ChangeNote = { kind: 'warning' | 'schedule'; text: string };

const usageLabel = (accessDays: number, windowDays: number) =>
  accessDays === 0 ? `${windowDays}일 동안 접속 없음` : `${windowDays}일 중 ${accessDays}일 접속`;

/** 선택한 정리 방법을 적용했을 때 전후 비교 데이터 */
export function compareCleanup(
  subscriptions: Subscription[],
  usage: Record<string, UsageRecord>,
  options: Record<string, CleanupOptionInfo>,
  selection: Record<string, CleanupAction>,
  today: DateKey,
) {
  const { candidates, frequent, background } = analyzeUsage(subscriptions, usage, today, Number.POSITIVE_INFINITY);
  const tracked = [...candidates, ...frequent];
  const rows: DiffRow[] = [];
  const notes: ChangeNote[] = [];

  // 정리 대상(선택한 구독) → 접속 적은 순, 나머지 → 접속 많은 순, 집계 제외는 맨 뒤
  const selected = tracked.filter((u) => selection[u.subscription.id]).sort((a, b) => a.accessDays - b.accessDays);
  const rest = tracked.filter((u) => !selection[u.subscription.id]).sort((a, b) => b.accessDays - a.accessDays);

  for (const u of selected) {
    const { subscription } = u;
    const info = options[subscription.id] ?? {};
    const action = selection[subscription.id];
    const choice = getCleanupChoices(subscription, info).find((c) => c.action === action);
    const usageText = usageLabel(u.accessDays, u.days.length);

    if (!choice || action === 'keep') {
      rows.push({ subscription, kind: 'unchanged', detail: `${u.accessDays}일 접속`, newPrice: subscription.price });
      continue;
    }
    if (action === 'cancel') {
      rows.push({ subscription, kind: 'removed', detail: `해지 · ${usageText}`, newPrice: 0 });
      if (info.cancelEffect) notes.push({ kind: 'warning', text: info.cancelEffect });
      continue;
    }

    const detail =
      action === 'downgrade' && info.cheaperPlan
        ? `${subscription.plan ?? '현재 요금제'} → ${info.cheaperPlan.name}`
        : `파티원 ${info.partyMembers}명과 나눠 내기`;
    rows.push({ subscription, kind: 'changed', detail, newPrice: choice.newPrice });
    if (action === 'downgrade' && info.cheaperPlan?.note) notes.push({ kind: 'warning', text: info.cheaperPlan.note });

    // 이번 결제는 기존 요금, 다음 달 결제부터 변경 요금
    const { month } = parseDateKey(subscription.nextBillingDate);
    notes.push({
      kind: 'schedule',
      text: `${formatMonthDay(subscription.nextBillingDate)} ${subscription.name} 결제는 그대로 나가고, 변경 요금은 ${(month % 12) + 1}월 결제부터 적용돼요.`,
    });
  }

  for (const u of rest) {
    rows.push({ subscription: u.subscription, kind: 'unchanged', detail: `${u.accessDays}일 접속`, newPrice: u.subscription.price });
  }
  for (const s of background) {
    rows.push({ subscription: s, kind: 'unchanged', detail: '집계 제외', newPrice: s.price });
  }

  const before = rows.reduce((sum, r) => sum + r.subscription.price, 0);
  const after = rows.reduce((sum, r) => sum + r.newPrice, 0);

  const categories: CategoryChange[] = CATEGORY_ORDER.map((category) => {
    const inCategory = rows.filter((r) => r.subscription.category === category);
    return {
      category,
      before: inCategory.reduce((sum, r) => sum + r.subscription.price, 0),
      after: inCategory.reduce((sum, r) => sum + r.newPrice, 0),
    };
  })
    .filter((c) => c.before > 0)
    .sort((a, b) => b.before - a.before);

  // 경고(달라지는 점)를 먼저, 결제 일정 안내는 뒤에
  notes.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'warning' ? -1 : 1));

  return { before, after, saving: before - after, rows, categories, notes };
}

/** 'id:action,id:action' ↔ 선택 객체 (경로 파라미터용) */
export function encodeSelection(selection: Record<string, CleanupAction>) {
  return Object.entries(selection)
    .map(([id, action]) => `${id}:${action}`)
    .join(',');
}

const ACTIONS: CleanupAction[] = ['cancel', 'downgrade', 'party', 'keep'];

export function decodeSelection(text: string | undefined): Record<string, CleanupAction> {
  if (!text) return {};
  return Object.fromEntries(
    text
      .split(',')
      .map((pair) => pair.split(':'))
      .filter((pair): pair is [string, CleanupAction] => pair.length === 2 && ACTIONS.includes(pair[1] as CleanupAction)),
  );
}
