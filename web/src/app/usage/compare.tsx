import { router, useLocalSearchParams } from 'expo-router';
import { CleanupCompareScreen } from '@/features/usage/screens/CleanupCompareScreen';
import { decodeSelection } from '@/features/usage/utils/compareCleanup';
import { notify } from '@/web/toast';
export default function CleanupCompareRoute() {
 const { selection } = useLocalSearchParams<{ selection?: string }>();
 const choices = decodeSelection(selection);
 const goBack = () => router.canGoBack() ? router.back() : router.replace('/usage');
 return <CleanupCompareScreen selection={choices} onBack={goBack} onReselect={goBack} onSave={() => {
   try { localStorage.setItem('routineslim.cleanup.v1', JSON.stringify(choices)); router.dismissTo('/home'); notify('정리 계획을 저장했어요. 실제 구독 해지는 각 서비스에서 진행해 주세요.'); }
   catch { notify('저장 공간을 확인하고 다시 시도해 주세요.'); }
 }}/>;
}
