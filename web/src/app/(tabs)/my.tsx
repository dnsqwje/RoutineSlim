import { useState } from 'react';
import { router } from 'expo-router';
import { MyScreen, type MyMenu } from '@/features/my/screens/MyScreen';
import { useAuthStore } from '@/features/auth/authStore';
import { mockPaymentMethods } from '@/features/subscription/data/mockPaymentMethods';
import { useSubscriptions, useSubscriptionStore } from '@/web/subscriptions';
import { useSettingsStore } from '@/web/settings';
import { Sheet } from '@/web/Sheet';
import { notify } from '@/web/toast';
const titles: Partial<Record<MyMenu, string>> = {profile:'프로필 편집',subscriptions:'내 구독 관리',paymentMethods:'결제수단',budget:'월 예산',notifications:'알림 설정',backup:'백업 / 동기화',notices:'공지사항',contact:'문의하기',withdraw:'회원탈퇴'};
function download(name: string, data: string, type: string) {
 const url = URL.createObjectURL(new Blob([data], {type}));
 const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function MyRoute() {
 const [menu, setMenu] = useState<MyMenu | null>(null);
 const settings = useSettingsStore();
 const subscriptions = useSubscriptions();
 const [name, setName] = useState(settings.profile.name);
 const [email, setEmail] = useState(settings.profile.email);
 const [budget, setBudget] = useState(String(settings.budget));
 const [reminders, setReminders] = useState(settings.reminders);
 const [importError, setImportError] = useState('');
 const logout = async () => {
   await useAuthStore.getState().signOut();
   sessionStorage.removeItem('routineslim.demo-session'); localStorage.removeItem('routineslim.demo-session'); router.replace('/login');
 };
 const open = (choice: MyMenu) => {
   if (choice === 'report') {router.push('/stats'); return;}
   if (choice === 'communityActivity') {router.push('/community'); return;}
   if (choice === 'export') {
     const csv = (value: unknown) => {const text = String(value); return `"${(/^[=+\-@\t\r]/.test(text) ? "'" : '') + text.replaceAll('"','""')}"`;};
     download('routineslim-subscriptions.csv', '\ufeff' + [['서비스','금액(원)','결제 주기','결제일'], ...subscriptions.map(s => [s.name, s.price, s.cycle === 'monthly' ? '매월' : '매년', s.nextBillingDate])].map(row => row.map(csv).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
     notify('구독 목록을 CSV로 내보냈어요.'); return;
   }
   setName(settings.profile.name); setEmail(settings.profile.email); setBudget(String(settings.budget)); setReminders(settings.reminders); setImportError(''); setMenu(choice);
 };
 const close = () => setMenu(null);
 return <><MyScreen onLogout={() => void logout()} onPressMenu={open}/>
 {menu ? <Sheet title={titles[menu] ?? '마이'} onClose={close}>
   {menu === 'profile' ? <form onSubmit={e => {e.preventDefault(); settings.updateProfile({...settings.profile, name:name.trim(), email:email.trim()}); close(); notify('프로필을 저장했어요.');}}>
     <label>이름<input value={name} onChange={e => setName(e.target.value)} maxLength={30} required/></label>
     <label>이메일<input type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={100} required/></label>
     <button className="primary-button" disabled={!name.trim()}>저장</button>
   </form> : null}
   {menu === 'budget' ? <form onSubmit={e => {e.preventDefault(); settings.setBudget(Number(budget)); close(); notify('월 예산을 저장했어요.');}}>
     <label>월 예산 (원)<input type="number" min="0" max="999999999" step="1" value={budget} onChange={e => setBudget(e.target.value)} required/></label><button className="primary-button">저장</button>
   </form> : null}
   {menu === 'subscriptions' ? <><p>목록에서 삭제해도 실제 서비스의 자동 결제는 중단되지 않아요.</p>
     {subscriptions.map(s => <div key={s.id} className="subscription-item"><div>{s.name}<small>{s.price.toLocaleString('ko-KR')}원 · {s.cycle === 'monthly' ? '매월' : '매년'}</small></div><button aria-label={`${s.name} 삭제`} onClick={() => {if (window.confirm(`${s.name}을 내 구독 목록에서 삭제할까요? 실제 결제는 중단되지 않아요.`)) useSubscriptionStore.getState().remove(s.id);}}>삭제</button></div>)}
     {!subscriptions.length ? <p>등록된 구독이 없어요.</p> : null}
     <button className="primary-button" onClick={() => {close(); router.push('/subscription/add');}}>구독 추가</button>
   </> : null}
   {menu === 'paymentMethods' ? <><p>원본 앱의 예시 결제수단이에요. 실제 카드 정보는 저장하지 않아요.</p>{mockPaymentMethods.map(m => <div className="comment-item" key={m.id}>{m.label}</div>)}</> : null}
   {menu === 'notifications' ? <form onSubmit={e => {e.preventDefault(); settings.setReminders(reminders); close(); notify('알림 선호 일정을 저장했어요.');}}><p>결제 알림을 받을 시점을 저장해요. 실제 푸시 전송은 알림 서버 연동이 필요해요.</p>{[7,3,1].map(day => <label key={day} style={{flexDirection:'row', alignItems:'center'}}><input type="checkbox" style={{width:18}} checked={reminders.includes(day)} onChange={e => setReminders(e.target.checked ? [...reminders,day].sort((a,b) => b-a) : reminders.filter(d => d !== day))}/>{day}일 전</label>)}<button className="primary-button">저장</button></form> : null}
   {menu === 'backup' ? <><p>이 브라우저의 구독 목록을 파일로 보관하거나 복원해요. 계정 정보는 포함하지 않아요.</p><button className="primary-button" onClick={() => download('routineslim-backup.json', JSON.stringify({version:1,subscriptions:useSubscriptionStore.getState().items}, null, 2), 'application/json')}>백업 파일 저장</button>
     <label style={{marginTop:20}}>백업 파일 복원<input type="file" accept="application/json,.json" onChange={async e => {
       const file = e.target.files?.[0]; if (!file) return;
       try {
         if (file.size > 1024 * 1024) throw new Error();
         const data = JSON.parse(await file.text());
         const valid = data.version === 1 && Array.isArray(data.subscriptions) && data.subscriptions.length <= 1000 && data.subscriptions.every((s: Record<string, unknown>) => s && typeof s.id === 'string' && typeof s.name === 'string' && s.name.length <= 100 && typeof s.price === 'number' && Number.isFinite(s.price) && s.price >= 0 && ['monthly','yearly'].includes(String(s.cycle)) && ['ott','music','cloud','shopping'].includes(String(s.category)) && typeof s.nextBillingDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.nextBillingDate));
         if (!valid) throw new Error();
         if (window.confirm('현재 구독 목록을 이 백업으로 교체할까요?')) {
           const items = data.subscriptions.map((s: Record<string, unknown>) => ({id:s.id,name:s.name,category:s.category,price:s.price,nextBillingDate:s.nextBillingDate,cycle:s.cycle,accent:{color:'#5B5BD6',soft:'#EEEEFC'}}));
           useSubscriptionStore.setState({items}); close(); notify('구독 목록을 복원했어요.');
         }
       } catch {setImportError('올바른 루틴슬림 백업 파일을 선택해 주세요.');}
     }}/></label>{importError ? <p role="alert">{importError}</p> : null}
   </> : null}
   {menu === 'notices' ? <p>현재 웹은 첨부 앱의 화면을 그대로 옮긴 체험 버전이에요. 구독·게시글·프로필은 브라우저에 저장되며 다른 사용자와 공유되지 않아요.</p> : null}
   {menu === 'contact' ? <p>문의 채널은 아직 연결되지 않았어요. 운영자의 지원 채널이 정해지면 연결할 수 있어요.</p> : null}
   {menu === 'withdraw' ? <p>체험 모드에는 서버 계정이 없어요. 실제 회원탈퇴는 계정 서버 연동이 필요해요.</p> : null}
 </Sheet> : null}</>;
}
