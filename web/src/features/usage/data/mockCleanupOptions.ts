// 서비스별 정리 방법 정보. API 연동 전까지 사용하는 Figma 시안 데이터
export type CleanupOptionInfo = {
  /** 더 저렴한 요금제. note: 바꾸면 달라지는 점 */
  cheaperPlan?: { name: string; price: number; note?: string };
  /** 파티원 모집 시 나눌 인원 (본인 포함) */
  partyMembers?: number;
  /** 정리 방법 선택 화면에서 해지 선택 시 보여줄 안내 */
  cancelNote?: string;
  /** 전후 비교 화면에서 해지 시 함께 달라지는 점 */
  cancelEffect?: string;
};

export const mockCleanupOptions: Record<string, CleanupOptionInfo> = {
  netflix: {
    cheaperPlan: {
      name: '광고형 스탠다드',
      price: 5500,
      note: '넷플릭스 광고형은 영상 중간에 광고가 나오고, 동시 시청이 2대로 줄어요.',
    },
    partyMembers: 4,
  },
  'disney-plus': { partyMembers: 4 },
  'coupang-wow': {
    cancelNote: '해지하면 무료 배송·반품 같은 멤버십 혜택도 함께 끝나요. 한 달 주문이 많다면 유지가 나을 수 있어요.',
    cancelEffect: '쿠팡 와우를 해지하면 무료 배송·반품 혜택도 함께 끝나요.',
  },
};
