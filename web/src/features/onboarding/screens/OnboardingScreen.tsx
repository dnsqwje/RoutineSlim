import { useEffect, useRef, useState, type ComponentType } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChevronDownSmall from '@/assets/icons/chevron-down-small.svg';
import GlobeIcon from '@/assets/icons/globe.svg';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing, typography } from '@/theme';

import {
  CollectIllustration,
  CompareIllustration,
  ILLUSTRATION_HEIGHT,
  ILLUSTRATION_WIDTH,
  ReminderIllustration,
  ScanIllustration,
} from '../components/OnboardingIllustrations';

type OnboardingPage = {
  key: string;
  Illustration: ComponentType;
  title: string;
  description: string;
};

const PAGES: OnboardingPage[] = [
  {
    key: 'collect',
    Illustration: CollectIllustration,
    title: '흩어진 구독,\n한곳에 모아요',
    description: '넷플릭스부터 클라우드까지\n매달 나가는 구독을 한눈에 확인해요',
  },
  {
    key: 'scan',
    Illustration: ScanIllustration,
    title: '찍어서 올리면\n자동으로 등록돼요',
    description: '영수증이나 결제 캡처를 올리면\n서비스명, 금액, 결제일을 읽어드려요',
  },
  {
    key: 'reminder',
    Illustration: ReminderIllustration,
    title: '결제일, 놓치지\n않게 알려드려요',
    description: '갱신일을 캘린더로 한눈에 보고\n결제 전에 미리 알림을 받아요',
  },
  {
    key: 'compare',
    Illustration: CompareIllustration,
    title: '계속할까, 끊을까?\n비교하면 답이 보여요',
    description: '해지하면 얼마나 아끼는지 확인하고\n군살 없는 구독 루틴을 만들어요',
  },
];

type OnboardingScreenProps = {
  /** 처음 보여줄 페이지 (0부터) */
  initialPage?: number;
  /** 건너뛰기 / 시작하기 */
  onFinish: () => void;
  onPressLanguage?: () => void;
};

export function OnboardingScreen({ initialPage = 0, onFinish, onPressLanguage }: OnboardingScreenProps) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, 390);
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(() => Math.min(Math.max(initialPage, 0), PAGES.length - 1));

  // 시작 페이지로 이동 (화면 폭이 바뀌어도 현재 페이지 유지)
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: page * width, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);
  const isLast = page === PAGES.length - 1;

  // 390px 시안보다 좁은 화면에서는 일러스트를 비율대로 줄인다
  const scale = Math.min(1, width / ILLUSTRATION_WIDTH);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const goNext = () => {
    if (isLast) {
      onFinish();
      return;
    }
    scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
    setPage(page + 1);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="언어 선택" onPress={onPressLanguage} style={styles.language}>
          <GlobeIcon width={16.4} height={16.4} />
          <Text style={styles.languageText}>KO</Text>
          <ChevronDownSmall width={9.6} height={5.6} />
        </Pressable>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onFinish}>
          <Text style={styles.skip}>건너뛰기</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        style={styles.pager}
      >
        {PAGES.map(({ key, Illustration, title, description }) => (
          <View key={key} style={[styles.page, { width }]}>
            <View style={{ width: ILLUSTRATION_WIDTH * scale, height: ILLUSTRATION_HEIGHT * scale }}>
              <View
                style={{
                  transform: [
                    { translateX: (-ILLUSTRATION_WIDTH * (1 - scale)) / 2 },
                    { translateY: (-ILLUSTRATION_HEIGHT * (1 - scale)) / 2 },
                    { scale },
                  ],
                }}
              >
                <Illustration />
              </View>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View accessibilityRole="progressbar" accessibilityLabel={`${PAGES.length}페이지 중 ${page + 1}페이지`} style={styles.dots}>
          {PAGES.map(({ key }, index) => (
            <View key={key} style={[styles.dot, index === page && styles.dotActive]} />
          ))}
        </View>
        <Button title={isLast ? '시작하기' : '계속'} onPress={goNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
    paddingHorizontal: spacing.xl,
  },
  language: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 11,
    paddingRight: 13,
    borderWidth: 1,
    borderColor: colors.illustBorder,
    borderRadius: radius.pill,
  },
  languageText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  skip: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  pager: {
    flex: 1,
  },
  page: {
    alignItems: 'center',
    paddingTop: 39,
  },
  title: {
    ...typography.onboardingTitle,
    marginTop: 33,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  description: {
    ...typography.onboardingBody,
    marginTop: 20,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  footer: {
    gap: 40,
    paddingHorizontal: spacing.xxl,
    paddingBottom: 30,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.pageDotInactive,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
});
