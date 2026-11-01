import { colors } from '@/theme';

import type { SubscriptionCategory } from './types';

/** 표시 순서 고정 — 금액 순으로 다시 정렬하지 않는다 (색이 순위가 아니라 카테고리를 따르도록) */
export const CATEGORY_ORDER: SubscriptionCategory[] = ['ott', 'music', 'cloud', 'shopping'];

export const CATEGORY_META: Record<SubscriptionCategory, { label: string; color: string }> = {
  ott: { label: 'OTT', color: colors.categoryOtt },
  music: { label: '음악', color: colors.categoryMusic },
  cloud: { label: '클라우드', color: colors.categoryCloud },
  shopping: { label: '쇼핑', color: colors.categoryShopping },
};
