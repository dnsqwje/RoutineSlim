import type { CommunityBoard } from './types';

export const BOARD_OPTIONS: { value: CommunityBoard; label: string }[] = [
  { value: 'party', label: '파티원 모집' },
  { value: 'review', label: '후기' },
  { value: 'free', label: '자유' },
];
