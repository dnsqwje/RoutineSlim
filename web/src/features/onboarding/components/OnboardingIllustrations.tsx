import { webSvgStyle } from '@/web/svg';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';

import BellIcon from '@/assets/images/onboarding/bell.svg';
import CheckCircle from '@/assets/images/onboarding/check-circle.svg';
import CheckMark from '@/assets/images/onboarding/check-mark.svg';
import DashedLine from '@/assets/images/onboarding/dashed-line.svg';
import NotifyDot from '@/assets/images/onboarding/notify-dot.svg';
import ScanFrame from '@/assets/images/onboarding/scan-frame.svg';
import { colors, radius } from '@/theme';

/**
 * 온보딩 일러스트는 Figma 390px 프레임 좌표 그대로 배치한다.
 * 캔버스 원점 = 프레임 (0, 130). 좁은 화면에서는 OnboardingScreen 에서 통째로 축소한다.
 */
export const ILLUSTRATION_WIDTH = 390;
export const ILLUSTRATION_HEIGHT = 330;

/** 절대 위치 (View·Text 모두에 쓸 수 있도록 위치 속성만 가진 타입) */
type Position = Pick<ViewStyle, 'position' | 'left' | 'top' | 'width' | 'height'>;

const at = (left: number, top: number, width?: number, height?: number): Position => ({
  position: 'absolute',
  left,
  top,
  width,
  height,
});

const text = (size: number, color: string, bold = true): TextStyle => ({
  fontSize: size,
  lineHeight: Math.round(size * 1.25),
  fontWeight: bold ? '700' : '400',
  color,
});

/** 모든 페이지 공통: 연보라 원 배경 + 장식 점 */
function Backdrop({ children }: { children: ReactNode }) {
  return (
    <View style={styles.canvas}>
      <View style={[at(37, 7, 316, 316), styles.circle]} />
      <View style={[at(55, 31, 14, 14), styles.dot, { backgroundColor: colors.illustDecor }]} />
      <View style={[at(328, 288, 20, 20), styles.dot, { backgroundColor: colors.illustDecor }]} />
      <View style={[at(326, 16, 8, 8), styles.dot, { backgroundColor: colors.illustDecorStrong }]} />
      {children}
    </View>
  );
}

/** 흰 카드 + 아래로 살짝 비치는 연보라 그림자 */
function ShadowCard({ style, radius: r, offset = 7 }: { style: ViewStyle; radius: number; offset?: number }) {
  const { top = 0, ...rest } = style;
  return (
    <>
      <View style={[rest, { top: (top as number) + offset, borderRadius: r, backgroundColor: colors.illustShadow }]} />
      <View style={[style, styles.card, { borderRadius: r }]} />
    </>
  );
}

function Pill({ style, centered = false, children }: { style: ViewStyle; centered?: boolean; children: ReactNode }) {
  return <View style={[style, styles.pill, centered && styles.pillCentered]}>{children}</View>;
}

function CheckChip({ left, top, label }: { left: number; top: number; label: string }) {
  return (
    <Pill style={at(left, top, undefined, 36)}>
      <View style={styles.checkCircle}>
        <CheckCircle width={18} height={18} style={StyleSheet.absoluteFill} />
        {/* 절대 위치인 원보다 위에 그려지도록 감싼다 (웹: positioned 요소가 위로 쌓임) */}
        <View>
          <CheckMark width={10} height={8} />
        </View>
      </View>
      <Text style={text(13, colors.textPrimary)}>{label}</Text>
    </Pill>
  );
}

// 1. 흩어진 구독, 한곳에 모아요
export function CollectIllustration() {
  const services = [
    { name: '넷플릭스', day: '매월 12일', price: '17,000원', logo: 'N', logoColor: '#E50914', logoBg: '#111111', highlight: true },
    { name: 'iCloud+', day: '매월 12일', price: '1,100원', logo: '☁', logoColor: '#3B8EEA', logoBg: '#E6F2FF' },
    { name: '스포티파이', day: '매월 18일', price: '10,900원', logo: '♪', logoColor: colors.white, logoBg: '#1ED760' },
  ];

  return (
    <Backdrop>
      <Pill style={at(113, 2, 164, 38)} centered>
        <Text style={text(14, colors.primary)}>이번 달 61,790원</Text>
      </Pill>

      {services.map((s, i) => {
        const top = 58 + i * 84;
        return (
          <View key={s.name}>
            {s.highlight ? (
              <View style={[at(70, top, 250, 72), { borderRadius: 18, backgroundColor: colors.primary }]} />
            ) : (
              <ShadowCard style={at(70, top, 250, 72)} radius={18} offset={3} />
            )}
            <View style={[at(70, top, 250, 72), styles.serviceRow]}>
              <View style={[styles.serviceLogo, { backgroundColor: s.logoBg }]}>
                <Text style={text(20, s.logoColor)}>{s.logo}</Text>
              </View>
              <View style={styles.flex}>
                <Text style={text(15, s.highlight ? colors.white : colors.textPrimary)}>{s.name}</Text>
                <Text style={text(11.5, s.highlight ? colors.reportOnPrimary : colors.textMuted, false)}>{s.day}</Text>
              </View>
              <Text style={text(15, s.highlight ? colors.white : colors.textPrimary)}>{s.price}</Text>
            </View>
          </View>
        );
      })}
    </Backdrop>
  );
}

// 2. 찍어서 올리면 자동으로 등록돼요
export function ScanIllustration() {
  const bar = (x: number, y: number, w: number, h: number, color: string) => (
    <View style={[at(130 + x, 40 + y, w, h), { borderRadius: h / 2, backgroundColor: color }]} />
  );

  return (
    <Backdrop>
      <ShadowCard style={at(130, 40, 140, 236)} radius={14} />
      {bar(16, 18, 60, 10, colors.textPrimary)}
      {bar(16, 36, 38, 6, colors.illustBorder)}
      {[68, 92, 116, 140].map((y, i) => (
        <View key={y}>
          {bar(16, y, i % 2 === 0 ? 58 : 72, 7, colors.illustBorder)}
          {bar(98, y, 26, 7, colors.illustBorder)}
        </View>
      ))}
      <DashedLine width={108} height={1} style={webSvgStyle(at(146, 210))} />
      {bar(16, 188, 42, 10, colors.textPrimary)}
      {bar(82, 186, 42, 14, colors.primary)}

      <ScanFrame width={180} height={276} style={webSvgStyle(at(110, 22))} />
      <View style={[at(118, 146, 164, 12), { backgroundColor: colors.illustScanGlow }]} />
      <View style={[at(118, 158, 164, 3), { borderRadius: 1.5, backgroundColor: colors.primary }]} />

      <CheckChip left={236} top={68} label="넷플릭스" />
      <CheckChip left={244} top={162} label="17,000원" />
      <CheckChip left={26} top={230} label="10월 12일" />
    </Backdrop>
  );
}

// 3. 결제일, 놓치지 않게 알려드려요
export function ReminderIllustration() {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weeks = [
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
  ];
  const dots: Record<number, string[]> = {
    12: [colors.primary, '#E50914'],
    18: [colors.success],
    22: [colors.primary],
  };

  return (
    <Backdrop>
      <ShadowCard style={at(85, 40, 221, 227)} radius={22} />
      <View style={at(85, 40, 221, 227)}>
        <Text style={[text(15, colors.textPrimary), at(20, 18)]}>2026년 10월</Text>
        <View style={[styles.calendarRow, at(17, 51)]}>
          {weekdays.map((d, i) => (
            <Text key={d} style={[styles.calendarCell, text(11, i === 0 ? colors.sunday : colors.textMuted, false)]}>
              {d}
            </Text>
          ))}
        </View>
        {weeks.map((week, row) => (
          <View key={week[0]} style={[styles.calendarRow, at(17, 74 + row * 40)]}>
            {week.map((day, col) => {
              const selected = day === 12;
              return (
                <View key={day} style={styles.calendarCell}>
                  <View style={[styles.calendarDate, selected && { backgroundColor: colors.primary }]}>
                    <Text
                      style={text(13, selected ? colors.white : col === 0 ? colors.sunday : colors.textPrimary, selected)}
                    >
                      {day}
                    </Text>
                  </View>
                  <View style={styles.calendarDots}>
                    {(dots[day] ?? []).map((c) => (
                      <View key={c} style={[styles.calendarDot, { backgroundColor: c }]} />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={[at(268, 10, 60, 60), styles.bellCircle]}>
        <BellIcon width={26} height={29.2} />
      </View>
      <NotifyDot width={14} height={14} style={webSvgStyle(at(306, 15))} />

      <Pill style={at(100, 278, 190, 42)}>
        <View style={styles.dDayBadge}>
          <Text style={text(12.5, colors.primary)}>D-1</Text>
        </View>
        <Text style={text(13, colors.textPrimary)}>넷플릭스 결제 예정</Text>
      </Pill>
    </Backdrop>
  );
}

// 4. 계속할까, 끊을까? 비교하면 답이 보여요
export function CompareIllustration() {
  return (
    <Backdrop>
      <ShadowCard style={at(44, 76, 140, 196)} radius={22} />
      <View style={at(44, 76, 140, 196)}>
        <View style={[at(16, 16, 30, 30), styles.miniLogo]}>
          <Text style={text(16, '#E50914')}>N</Text>
        </View>
        <Text style={[text(13, colors.textPrimary), at(54, 23)]}>넷플릭스</Text>
        <Text style={[text(12, colors.textMuted, false), at(16, 70)]}>계속 구독하면</Text>
        <Text style={[text(21, colors.textPrimary), at(16, 93)]}>204,000원</Text>
        <Text style={[text(11.5, colors.textMuted, false), at(16, 127)]}>17,000원 × 12개월</Text>
        <View style={[at(16, 158, 108, 1), { backgroundColor: colors.illustBorder }]} />
        <Text style={[text(12, colors.textMuted, false), at(16, 168)]}>1년 후 지출</Text>
      </View>

      <View style={[at(206, 40, 140, 240), { borderRadius: 22, backgroundColor: colors.primary }]}>
        <Text style={[text(13, colors.reportOnPrimary), at(18, 22)]}>해지하면</Text>
        <Text style={[text(38, colors.white), at(18, 56)]}>0원</Text>
        <Text style={[text(12, colors.reportOnPrimary, false), at(18, 114)]}>1년 후 지출</Text>
        <View style={[at(18, 148, 104, 1), { backgroundColor: colors.dividerOnPrimary }]} />
        <View style={[at(18, 166, 48, 26), styles.savingBadge]}>
          <Text style={text(13, colors.savingBadgeText)}>절약</Text>
        </View>
        <Text style={[text(14, colors.white), at(18, 205)]}>204,000원 아껴요</Text>
      </View>

      <View style={[at(175, 140, 40, 40), styles.vsCircle]}>
        <Text style={text(12.5, colors.primary)}>VS</Text>
      </View>

      <Pill style={at(108, 298, 174, 36)} centered>
        <Text style={text(13, colors.textPrimary)}>커피 약 40잔 값이에요</Text>
      </Pill>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: ILLUSTRATION_WIDTH,
    height: ILLUSTRATION_HEIGHT,
  },
  flex: {
    flex: 1,
  },
  circle: {
    borderRadius: 158,
    backgroundColor: colors.primarySoft,
  },
  dot: {
    borderRadius: radius.pill,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.illustBorder,
    backgroundColor: colors.white,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingLeft: 9,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: colors.illustBorder,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  pillCentered: {
    justifyContent: 'center',
    paddingLeft: 14,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
  },
  serviceLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarRow: {
    flexDirection: 'row',
  },
  calendarCell: {
    width: 28,
    alignItems: 'center',
    textAlign: 'center',
  },
  calendarDate: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDots: {
    height: 5,
    marginTop: 3,
    flexDirection: 'row',
    gap: 1.6,
  },
  calendarDot: {
    width: 4.4,
    height: 4.4,
    borderRadius: 2.2,
  },
  bellCircle: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  dDayBadge: {
    height: 26,
    paddingHorizontal: 9,
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: colors.primarySoft,
  },
  miniLogo: {
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },
  savingBadge: {
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.savingBadge,
  },
  vsCircle: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
