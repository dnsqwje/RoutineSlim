import { router } from 'expo-router';

import { HomeScreen } from '@/features/subscription/screens/HomeScreen';

export default function HomeRoute() {
  return (
    <HomeScreen
      onPressNotifications={() => router.push({ pathname: '/calendar', params: {date: '2026-10-12'} })}
      onPressComparison={() => router.push('/usage')}
      onPressAddSubscription={() => router.push('/subscription/add')}
    />
  );
}
