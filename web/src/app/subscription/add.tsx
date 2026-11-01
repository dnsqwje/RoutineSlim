import { router } from 'expo-router';

import { AddSubscriptionMethodScreen } from '@/features/subscription/screens/AddSubscriptionMethodScreen';

export default function AddSubscriptionRoute() {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/home'));

  return (
    <AddSubscriptionMethodScreen
      onBack={goBack}
      onPressScan={() => router.push('/subscription/scan')}
      onPressManual={() => router.push('/subscription/manual')}
    />
  );
}
