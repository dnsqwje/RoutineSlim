import type { DateKey } from '@/utils/date';

import type { BillingCycle } from '../utils/billingForm';

export type ScanResult = {
  /** 인식한 이미지 설명과 파일 이름 */
  source: { title: string; fileName: string };
  name: string;
  price: number;
  cycle: BillingCycle;
  nextBillingDate: DateKey;
};

// 이미지 인식 API 연동 전까지 쓰는 시안 결과 (넷플릭스 영수증 → 이미 등록된 구독)
export const mockScanResult: ScanResult = {
  source: { title: '넷플릭스 결제 영수증', fileName: 'receipt_20261012.png' },
  name: '넷플릭스',
  price: 17000,
  cycle: 'monthly',
  nextBillingDate: '2026-10-12',
};
