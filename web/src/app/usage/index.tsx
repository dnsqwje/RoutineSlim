import { notify } from '@/web/toast';
import { router } from 'expo-router';

import { UsageCheckScreen } from '@/features/usage/screens/UsageCheckScreen';

export default function UsageCheckRoute() {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/home'));

  return (
    <UsageCheckScreen
      onBack={goBack}
      onPressInfo={() => notify('사용량은 원본 앱의 예시 기록이에요. 브라우저에서 다른 앱의 사용 시간은 조회할 수 없어요.')}
      onReviewCandidates={(ids) => router.push({ pathname: '/usage/cleanup', params: { ids: ids.join(',') } })}
    />
  );
}
