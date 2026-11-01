import { CATEGORY_ORDER } from '@/features/subscription/categories';
import type { Subscription, SubscriptionCategory } from '@/features/subscription/types';

export type CategorySummary = {
  category: SubscriptionCategory;
  total: number;
  /** 0 ~ 1 */
  ratio: number;
  subscriptions: Subscription[];
};

/** 카테고리 고정 순서대로 합계·비율을 낸다. 결제가 없는 카테고리는 제외 */
export function summarizeByCategory(subscriptions: Subscription[]) {
  const total = subscriptions.reduce((sum, s) => sum + s.price, 0);

  const categories: CategorySummary[] = CATEGORY_ORDER.map((category) => {
    const items = subscriptions.filter((s) => s.category === category);
    const categoryTotal = items.reduce((sum, s) => sum + s.price, 0);
    return { category, total: categoryTotal, ratio: total > 0 ? categoryTotal / total : 0, subscriptions: items };
  }).filter((c) => c.subscriptions.length > 0);

  return { total, count: subscriptions.length, categories };
}

export function formatPercent(ratio: number) {
  return `${(ratio * 100).toFixed(1)}%`;
}
