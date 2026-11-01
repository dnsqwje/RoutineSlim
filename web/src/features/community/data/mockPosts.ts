import { mockSubscriptions } from '@/features/subscription/data/mockSubscriptions';
import type { ServiceLogo } from '@/features/subscription/types';

import type { PartyPost } from '../types';

// API 연동 전까지 사용하는 Figma 시안 데이터. '방금' 기준 시각
export const MOCK_NOW = '2026-10-11T12:00:00+09:00';

const logoOf = (subscriptionId: string): ServiceLogo => {
  const subscription = mockSubscriptions.find((s) => s.id === subscriptionId);
  if (!subscription) throw new Error(`unknown subscription: ${subscriptionId}`);
  return subscription.logo;
};

export const mockPartyPosts: PartyPost[] = [
  {
    id: 'post-1',
    serviceName: '넷플릭스',
    serviceLogo: logoOf('netflix'),
    status: 'recruiting',
    title: '넷플릭스 함께 볼 파티원 구해요',
    description: '매월 12일 정산 · 장기 참여 환영해요',
    currentMembers: 2,
    maxMembers: 4,
    totalPrice: 17000,
    pricePerMember: 4250,
    settlementDay: 12,
    authorName: '구독생활',
    createdAt: '2026-10-11T11:50:00+09:00',
    viewCount: 28,
    commentCount: 3,
    body: {
      title: '함께 오래 이용하실 분을 찾아요',
      content: [
        '현재 2명이 함께하고 있고, 2명을 더 모집해요.',
        '월 17,000원을 4명이 나눠 부담합니다.',
        '',
        '매월 12일 정산하며 최소 3개월 참여를 원해요.',
        '서비스의 이용 약관을 확인한 뒤 신청해주세요.',
        '궁금한 점은 댓글로 편하게 남겨주세요!',
      ].join('\n'),
    },
    comments: [
      {
        id: 'comment-1',
        authorName: '주말영화',
        createdAt: '2026-10-11T11:55:00+09:00',
        content: '다음 결제일부터 참여할 수 있나요?',
      },
    ],
  },
  {
    id: 'post-2',
    serviceName: '디즈니+',
    serviceLogo: logoOf('disney-plus'),
    status: 'recruiting',
    title: '디즈니+ 2명 더 모집합니다',
    description: '매월 18일 정산 · 편하게 문의주세요',
    currentMembers: 2,
    maxMembers: 4,
    totalPrice: 9900,
    pricePerMember: 2475,
    settlementDay: 18,
    authorName: '영화산책',
    createdAt: '2026-10-11T11:28:00+09:00',
    viewCount: 41,
    commentCount: 5,
    // 시안에 상세 본문이 없어 임시 문구
    body: {
      title: '디즈니+ 같이 보실 분 모집해요',
      content: '현재 2명이 함께하고 있고, 2명을 더 모집해요.\n매월 18일 정산합니다. 편하게 문의주세요!',
    },
    comments: [],
  },
  {
    id: 'post-3',
    serviceName: 'iCloud+',
    serviceLogo: logoOf('icloud'),
    status: 'recruiting',
    title: 'iCloud+ 저장 공간 함께 써요',
    description: '매월 12일 정산 · 1명 모집 중이에요',
    currentMembers: 1,
    maxMembers: 2,
    totalPrice: 1100,
    pricePerMember: 550,
    settlementDay: 12,
    authorName: '클라우드러',
    createdAt: '2026-10-11T11:00:00+09:00',
    viewCount: 12,
    commentCount: 1,
    // 시안에 상세 본문이 없어 임시 문구
    body: {
      title: 'iCloud+ 50GB 나눠 쓰실 분',
      content: '가족 공유로 저장 공간을 함께 써요.\n매월 12일 정산합니다.',
    },
    comments: [],
  },
];

export function findPartyPost(id: string) {
  return mockPartyPosts.find((post) => post.id === id);
}
