// API 연동 전까지 사용하는 등록 결제 수단 목업
export type PaymentMethod = {
  id: string;
  label: string;
};

export const mockPaymentMethods: PaymentMethod[] = [
  { id: 'hyundai-4821', label: '현대카드 · 4821' },
  { id: 'shinhan-1093', label: '신한카드 · 1093' },
  { id: 'kakaobank-7710', label: '카카오뱅크 체크카드 · 7710' },
];
