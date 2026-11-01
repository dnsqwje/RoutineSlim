import { router, useLocalSearchParams } from 'expo-router';

import { CommunityScreen } from '@/features/community/screens/CommunityScreen';

export default function CommunityRoute() {
  const { board } = useLocalSearchParams<{board?: string}>();
  return (
    <CommunityScreen key={board} initialBoard={board === 'review' || board === 'free' ? board : 'party'}
      onPressPost={(post) => router.push({ pathname: '/community/[id]', params: { id: post.id } })}
      onPressWrite={board => router.push({pathname:'/community/write',params:{board}})}
    />
  );
}
