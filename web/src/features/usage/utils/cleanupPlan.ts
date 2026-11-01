import type { Subscription } from '@/features/subscription/types';

import type { CleanupOptionInfo } from '../data/mockCleanupOptions';

export type CleanupAction = 'cancel' | 'downgrade' | 'party' | 'keep';

export type CleanupChoice = {
  action: CleanupAction;
  label: string;
  description: string;
  /** 정리 후 월 금액 */
  newPrice: number;
};

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;

/** 파티원 모집 시 1인당 금액 */
export const pricePerPartyMember = (price: number, members: number) => Math.round(price / members);

/** 서비스에서 고를 수 있는 정리 방법 목록 */
export function getCleanupChoices(subscription: Subscription, info: CleanupOptionInfo = {}): CleanupChoice[] {
  const { price } = subscription;
  const choices: CleanupChoice[] = [
    { action: 'cancel', label: '해지하기', description: `월 ${won(price)} 절약`, newPrice: 0 },
  ];

  if (info.cheaperPlan) {
    const { name, price: planPrice } = info.cheaperPlan;
    choices.push({
      action: 'downgrade',
      label: name,
      description: `${won(planPrice)} · ${won(price - planPrice)} 절약`,
      newPrice: planPrice,
    });
  }
  if (info.partyMembers) {
    const perMember = pricePerPartyMember(price, info.partyMembers);
    choices.push({
      action: 'party',
      label: '파티원 모집',
      description: `${info.partyMembers}명이 나눠 ${won(perMember)}`,
      newPrice: perMember,
    });
  }
  choices.push({ action: 'keep', label: '그대로 두기', description: '변화 없음', newPrice: price });

  return choices;
}

/** 기본 선택: 더 저렴한 요금제가 있으면 요금제 변경, 없으면 해지 */
export function getDefaultAction(info: CleanupOptionInfo = {}): CleanupAction {
  return info.cheaperPlan ? 'downgrade' : 'cancel';
}
