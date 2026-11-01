import { useSubscriptionStore } from '@/web/subscriptions';
import { notify } from '@/web/toast';

import { router } from 'expo-router';

import { ManualSubscriptionScreen } from '@/features/subscription/screens/ManualSubscriptionScreen';

export default function ManualSubscriptionRoute() {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/subscription/add'));

  // TODO: 구독 등록 API 연동 후 성공 시 홈 목록 갱신
  return <ManualSubscriptionScreen onBack={goBack} onSubmit={(draft) => { useSubscriptionStore.getState().add(draft); router.dismissTo('/home'); notify('구독을 저장했어요.'); }} />;
}
