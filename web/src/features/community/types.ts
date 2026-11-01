import type { ServiceLogo } from '@/features/subscription/types';

export type CommunityBoard = 'party' | 'review' | 'free';

export type PostComment = {
  id: string;
  authorName: string;
  /** ISO 8601 */
  createdAt: string;
  content: string;
};

export type PartyPost = {
  board?: CommunityBoard;
  id: string;
  /** 구독 서비스 이름 (태그로 표시) */
  serviceName: string;
  serviceLogo: ServiceLogo;
  status: 'recruiting' | 'closed';
  title: string;
  description: string;
  currentMembers: number;
  maxMembers: number;
  /** 서비스 전체 월 요금 */
  totalPrice: number;
  /** 1인당 월 분담금 */
  pricePerMember: number;
  /** 매월 정산일 */
  settlementDay: number;
  authorName: string;
  /** ISO 8601 */
  createdAt: string;
  viewCount: number;
  commentCount: number;
  body: { title: string; content: string };
  /** 최신순 */
  comments: PostComment[];
};
