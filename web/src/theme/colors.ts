// Figma '루틴슬림' 디자인 기준 색상 토큰
export const colors = {
  primary: '#5B5BD6',
  primarySoft: '#EEEEFC',
  white: '#FFFFFF',
  background: '#FFFFFF',
  backgroundMuted: '#F5F6FA',

  textPrimary: '#1B1D2A',
  textSecondary: '#6B7088',
  textLabel: '#4A4E63',
  textMuted: '#8A8FA3',
  textPlaceholder: '#B3B7C8',

  // 앱 메인(탭) 화면 계열
  textTitle: '#202333',
  textSubtle: '#73788B',
  textDisabled: '#A5AABB',
  iconInactive: '#A5AABB',
  divider: '#E7E9F0',
  sunday: '#E44848',
  renewalSecondary: '#E993AF',

  border: '#E8EAF3',

  scrim: 'rgba(23, 26, 51, 0.35)',
  segmentBackground: '#E9EBF3',
  textBody: '#4B4F5E',
  textAxis: '#8A8E9E',
  borderStrong: '#DDDFE7',
  primaryStrong: '#3D3DB8',
  usageEmpty: '#E4E6EE',
  danger: '#B4322B',
  dangerSoft: '#FDECEA',
  infoTitle: '#2E2E8F',
  infoBody: '#3B3D52',
  textOptionSub: '#5B5F70',

  // 정리 전후 비교 (diff)
  diffRemovedBg: '#FDF0EF',
  diffRemovedBorder: '#F3DCDA',
  diffRemovedGutter: '#F9E1DF',
  diffChanged: '#9A4D00',
  diffChangedBg: '#FFF6EC',
  diffChangedBorder: '#F5E3CC',
  diffChangedGutter: '#FCEBD6',
  diffUnchangedGutter: '#F7F8FA',
  diffUnchangedSymbol: '#9A9DAB',
  barSaved: '#F5C9C5',
  barBefore: '#D3D5DE',
  barNone: '#ECEDF2',

  // 온보딩 일러스트
  illustBorder: '#E3E5F0',
  illustShadow: 'rgba(217, 218, 247, 0.6)',
  illustDecor: '#D9DAF7',
  illustDecorStrong: 'rgba(91, 91, 214, 0.35)',
  illustScanGlow: 'rgba(91, 91, 214, 0.1)',
  receiptLine: '#C9C9F1',
  pageDotInactive: '#D5D8E8',
  savingBadge: '#BFF5D8',
  savingBadgeText: '#0B6B43',
  dividerOnPrimary: 'rgba(255, 255, 255, 0.25)',
  warning: '#8A4A00',
  warningSoft: '#FFF4E5',
  gridLine: '#EFF0F6',
  textOutside: '#C9CCDA',
  reportOnPrimary: '#DADBFA',

  positive: '#24856C',
  positiveSoft: '#EAF6F0',

  // 구독 카테고리 (통계 차트·범례). 순서·색은 엔티티 고정
  categoryOtt: '#5B5BD6',
  categoryMusic: '#9393E8',
  categoryCloud: '#BDC1D4',
  categoryShopping: '#E993AF',

  ctaDark: '#0F172A',
  ctaAccent: '#22C55E',

  heroGradientStart: '#F1F2FE',
  heroGradientEnd: '#DCDDF9',

  success: '#1FA971',
  successSurface: '#EAF7F1',
  successBorder: '#D3EFE1',
  successIconBorder: '#CBEBDB',

  naver: '#03C75A',
  kakao: '#FEE500',
  google: '#4285F4',
} as const;

export type ColorToken = keyof typeof colors;
