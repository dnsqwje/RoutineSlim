import { router, useLocalSearchParams } from 'expo-router';

import { markOnboardingSeen } from '@/features/onboarding/onboardingStorage';
import { OnboardingScreen } from '@/features/onboarding/screens/OnboardingScreen';

export default function OnboardingRoute() {
  // /onboarding?page=2 → 3번째 소개 페이지부터
  const { page } = useLocalSearchParams<{ page?: string }>();

  // 건너뛰기·시작하기 모두 '봤음'으로 저장 → 다음 실행부터는 바로 로그인 화면
  const finish = async () => {
    await markOnboardingSeen();
    router.replace('/login');
  };

  return <OnboardingScreen initialPage={Number(page) || 0} onFinish={finish} />;
}
