import { useCommunityStore } from '@/web/community';
import { notify } from '@/web/toast';
import { router, useLocalSearchParams } from 'expo-router';

import { WritePostScreen } from '@/features/community/screens/WritePostScreen';

export default function WritePostRoute() {
  const { board } = useLocalSearchParams<{board?: string}>();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/community'));

  // TODO: 게시글 등록 API 연동 후 성공 시 목록 갱신
  return <WritePostScreen initialBoard={board === 'review' || board === 'free' ? board : 'party'} onBack={goBack} onSubmit={draft => {useCommunityStore.getState().add(draft); router.dismissTo({pathname:'/community',params:{board:draft.board}}); notify('게시글을 이 브라우저에 저장했어요.');}} />;
}
