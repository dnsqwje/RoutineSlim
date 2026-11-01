import { useState } from 'react';
import { router } from 'expo-router';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { useAuthStore } from '@/features/auth/authStore';
import type { LoginCredentials } from '@/features/auth/api/authApi';
import { notify } from '@/web/toast';
export default function LoginRoute() {
 const [error, setError] = useState<string | null>(null);
 const [submitting, setSubmitting] = useState(false);
 const server = import.meta.env.VITE_AUTH_MODE === 'server';
 const login = async (credentials: LoginCredentials) => {
   if (submitting) return;
   if (server && (!credentials.id.trim() || !credentials.password)) { setError('아이디와 비밀번호를 입력해 주세요.'); return; }
   setError(null); setSubmitting(true);
   try {
     if (server) await useAuthStore.getState().signIn({...credentials, id: credentials.id.trim()});
     else {
       sessionStorage.setItem('routineslim.demo-session', 'true');
       if (credentials.keepLoggedIn) localStorage.setItem('routineslim.demo-session', 'true');
       else localStorage.removeItem('routineslim.demo-session');
     }
     router.replace('/home');
     if (!server) notify('체험 모드예요. 데이터는 이 브라우저에 저장돼요.');
   } catch (e) { setError(e instanceof Error ? e.message : '로그인에 실패했어요.'); }
   finally { setSubmitting(false); }
 };
 return <LoginScreen onLogin={login} errorMessage={error} submitting={submitting}
   notice={server ? '서버 로그인 · 구독과 게시글은 이 브라우저에 저장돼요.' : '체험 모드 · 입력한 아이디와 비밀번호는 저장하거나 전송하지 않아요.'}
   onSocialLogin={() => notify('소셜 로그인은 서버의 공급자 인증 연동이 필요해요.')}
   onBiometricLogin={() => notify('생체 로그인은 현재 모바일 앱에서만 지원해요.')}
   onResetPassword={() => notify('비밀번호 재설정은 계정 서버 연동 후 사용할 수 있어요.')}
   onSignUp={() => notify('회원가입은 계정 서버 연동 후 사용할 수 있어요.')}/>;
}
