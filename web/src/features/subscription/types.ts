import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

export type ServiceLogo =
  | { kind: 'text'; text: string; color: string; fontSize: number; background: string }
  | {
      kind: 'icon';
      Icon: FC<SvgProps>;
      size: number;
      background: string;
      /** 큰 로고(42px)용 별도 에셋. 없으면 Icon 을 비율대로 키운다 */
      large?: { Icon: FC<SvgProps>; size: number };
    };

export type SubscriptionCategory = 'ott' | 'music' | 'cloud' | 'shopping';

export type Subscription = {
  id: string;
  name: string;
  category: SubscriptionCategory;
  /** 요금제 이름 (예: 스탠다드, 프리미엄) */
  plan?: string;
  /** 서비스 대표색 (확장 캘린더 금액 칩 등). color: 진한 색, soft: 옅은 배경 */
  accent: { color: string; soft: string };
  logo: ServiceLogo;
  price: number;
  /** 다음 결제일 (YYYY-MM-DD) */
  nextBillingDate: string;
  cycle: 'monthly' | 'yearly';
};
