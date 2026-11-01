import { useState } from 'react';
import { router } from 'expo-router';
import { ScanResultScreen } from '@/features/subscription/screens/ScanResultScreen';
import { mockScanResult } from '@/features/subscription/data/mockScanResult';
import { useScanStore } from '@/web/scan';
import { useSubscriptionStore } from '@/web/subscriptions';
import { Sheet } from '@/web/Sheet';
import { notify } from '@/web/toast';
export default function ScanResultRoute() {
 const result = useScanStore(s => s.result);
 const image = useScanStore(s => s.image);
 const [preview, setPreview] = useState(false);
 const goBack = () => router.canGoBack() ? router.back() : router.replace('/subscription/scan');
 return <><ScanResultScreen result={result ?? {...mockScanResult, source:{title:'체험용 예시 결과',fileName:'예시 영수증'}}} onBack={goBack}
   onPreviewSource={() => image ? setPreview(true) : notify('직접 선택한 이미지가 없어요.')}
   onSubmit={draft => {useSubscriptionStore.getState().saveScan(draft); router.dismissTo('/home'); notify('구독을 이 브라우저에 저장했어요.');}}/>
   {preview && image ? <Sheet title="원본 이미지" onClose={() => setPreview(false)}><img src={image} alt="선택한 영수증" style={{width:'100%',height:'auto'}}/></Sheet> : null}
 </>;
}
