import ICloudLogo from '@/assets/images/service-logos/icloud.svg';
import ICloudLogoLarge from '@/assets/images/service-logos/icloud-lg.svg';
import SpotifyLogo from '@/assets/images/service-logos/spotify.svg';

import type { Subscription } from '../types';

// API 연동 전까지 사용하는 Figma 시안 데이터. 시안은 2026-10-11 을 '오늘'로 그려져 있다.
export const MOCK_TODAY = '2026-10-11';

export const mockSubscriptions: Subscription[] = [
  {
    id: 'netflix',
    name: '넷플릭스',
    category: 'ott',
    plan: '프리미엄',
    accent: { color: '#E50914', soft: '#FDEBEC' },
    logo: { kind: 'text', text: 'N', color: '#E50914', fontSize: 23.4, background: '#151515' },
    price: 17000,
    nextBillingDate: '2026-10-12',
    cycle: 'monthly',
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    category: 'cloud',
    accent: { color: '#3B8EEA', soft: '#E8F2FD' },
    logo: {
      kind: 'icon',
      Icon: ICloudLogo,
      size: 22.32,
      background: '#EDF5FF',
      large: { Icon: ICloudLogoLarge, size: 26.04 },
    },
    price: 1100,
    nextBillingDate: '2026-10-12',
    cycle: 'monthly',
  },
  {
    id: 'spotify',
    name: '스포티파이',
    category: 'music',
    accent: { color: '#1ED760', soft: '#E3F9EC' },
    logo: { kind: 'icon', Icon: SpotifyLogo, size: 24, background: '#172B20' },
    price: 10900,
    nextBillingDate: '2026-10-15',
    cycle: 'monthly',
  },
  {
    id: 'disney-plus',
    name: '디즈니+',
    category: 'ott',
    plan: '스탠다드',
    accent: { color: '#1E3A8A', soft: '#E6EBF7' },
    logo: { kind: 'text', text: 'D+', color: '#FFFFFF', fontSize: 16.56, background: '#132464' },
    price: 9900,
    nextBillingDate: '2026-10-18',
    cycle: 'monthly',
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    category: 'ott',
    accent: { color: '#F43F5E', soft: '#FEE7EC' },
    logo: { kind: 'text', text: '▶', color: '#FFFFFF', fontSize: 16.56, background: '#F04848' },
    price: 14900,
    nextBillingDate: '2026-10-22',
    cycle: 'monthly',
  },
  {
    id: 'coupang-wow',
    name: '쿠팡 와우',
    category: 'shopping',
    plan: '멤버십',
    accent: { color: '#F59E0B', soft: '#FEF3DC' },
    // 시안에 로고 디자인이 없어 임시 표시
    logo: { kind: 'text', text: 'C', color: '#FFFFFF', fontSize: 16.56, background: '#A5AABB' },
    price: 7890,
    nextBillingDate: '2026-10-26',
    cycle: 'monthly',
  },
];

const byIds = (ids: string[]) => mockSubscriptions.filter((s) => ids.includes(s.id));

export const mockUpcomingSubscriptions = byIds(['netflix', 'icloud']);
export const mockMySubscriptions = byIds(['spotify', 'disney-plus', 'youtube-premium']);

export const mockSummary = {
  month: 10,
  totalPrice: mockSubscriptions.reduce((sum, s) => sum + s.price, 0),
  activeCount: mockSubscriptions.length,
  description: '지난달과 동일해요 · 다음 결제는 내일',
};
