import type { DateKey } from '@/utils/date';

export type UsageRecord =
  /** 앱을 열어 사용량을 셀 수 있는 서비스. access: 기간 첫날부터 하루씩 '1'(접속) / '0' */
  | { kind: 'tracked'; access: string; lastAccessDate?: DateKey }
  /** 백그라운드로 쓰여 접속 일 수를 셀 수 없는 서비스 (iCloud 등) */
  | { kind: 'background' };

// API 연동 전까지 사용하는 Figma 시안 데이터 (9.11 ~ 10.10, 30일)
export const mockUsage: Record<string, UsageRecord> = {
  // 기간 안에 접속이 없으면 기간 밖 마지막 접속일을 따로 둔다
  'disney-plus': { kind: 'tracked', access: '000000000000000000000000000000', lastAccessDate: '2026-07-03' },
  netflix: { kind: 'tracked', access: '000010000000000001000000000000' },
  'coupang-wow': { kind: 'tracked', access: '000100010000000000000000010000' },
  'youtube-premium': { kind: 'tracked', access: '111011101111011101110111111110' },
  spotify: { kind: 'tracked', access: '110011001110111011100110011101' },
  icloud: { kind: 'background' },
};
