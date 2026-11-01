import { router, useLocalSearchParams } from 'expo-router';

import { CleanupChoiceScreen } from '@/features/usage/screens/CleanupChoiceScreen';
import { encodeSelection } from '@/features/usage/utils/compareCleanup';

export default function CleanupChoiceRoute() {
  // /usage/cleanup?ids=disney-plus,netflix,coupang-wow
  const { ids } = useLocalSearchParams<{ ids?: string }>();
  const subscriptionIds = ids ? ids.split(',').filter(Boolean) : [];
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/usage'));

  return (
    <CleanupChoiceScreen
      subscriptionIds={subscriptionIds}
      onBack={goBack}
      onCompare={(selection) =>
        router.push({ pathname: '/usage/compare', params: { selection: encodeSelection(selection) } })
      }
    />
  );
}
