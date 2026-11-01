import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { ScanSubscriptionScreen } from '@/features/subscription/screens/ScanSubscriptionScreen';
import { mockScanResult } from '@/features/subscription/data/mockScanResult';
import { useAuthStore } from '@/features/auth/authStore';
import { API_URL } from '@/api/client';
import { useScanStore } from '@/web/scan';
import { notify } from '@/web/toast';
export default function ScanSubscriptionRoute() {
 const input = useRef<HTMLInputElement>(null);
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState('');
 const goBack = () => router.canGoBack() ? router.back() : router.replace('/subscription/add');
 const select = (camera: boolean) => {
   if (busy || !input.current) return;
   if (camera) input.current.setAttribute('capture','environment'); else input.current.removeAttribute('capture');
   input.current.click();
 };
 const scan = async (file?: File) => {
   if (!file) return;
   if (!['image/jpeg','image/png'].includes(file.type)) {setError('JPG 또는 PNG 이미지를 선택해 주세요.'); return;}
   if (file.size > 10 * 1024 * 1024) {setError('10MB 이하의 이미지를 선택해 주세요.'); return;}
   setError(''); setBusy(true);
   try {
     let result = {...mockScanResult, source: {title: '체험용 예시 결과', fileName: file.name}};
     if (import.meta.env.VITE_AUTH_MODE === 'server') {
       const memberId = useAuthStore.getState().memberId;
       if (!memberId) throw new Error('영수증 인식을 사용하려면 먼저 로그인해 주세요.');
       const data = new FormData(); data.append('image', file);
       const response = await fetch(`${API_URL}/api/v1/subscriptions/scan`, {method: 'POST', headers: {'X-Member-Id':memberId}, body:data});
       if (!response.ok) throw new Error('영수증을 인식하지 못했어요. 잠시 후 다시 시도해 주세요.');
       const json = await response.json();
       result = {source: {title: json.name || '영수증 인식 결과', fileName: json.fileName || file.name}, name: json.name || '', price: json.amount || 0, cycle: json.billingCycle === 'YEARLY' ? 'yearly' : 'monthly', nextBillingDate: json.nextBillingDate || json.startDate || ''};
     } else notify('체험용 예시 결과예요. 실제 이미지 인식에는 서버 연결이 필요해요.');
     useScanStore.getState().set(result, URL.createObjectURL(file));
     router.push('/subscription/scan-result');
   } catch(e) {setError(e instanceof Error ? e.message : '이미지를 처리하지 못했어요.');}
   finally {setBusy(false); if (input.current) input.current.value = '';}
 };
 return <div style={{display:'flex', flexDirection:'column',width:'100%',minHeight:0}}>
   {error ? <p className="web-message" role="alert">{error}</p> : null}
   {busy ? <p className="web-message" role="status">이미지를 확인하고 있어요…</p> : null}
   <input hidden ref={input} type="file" accept="image/jpeg,image/png" aria-label="영수증 이미지" onChange={e => void scan(e.target.files?.[0])}/>
   <ScanSubscriptionScreen onBack={goBack} onPickFromAlbum={() => select(false)} onTakePhoto={() => select(true)}/>
 </div>;
}
