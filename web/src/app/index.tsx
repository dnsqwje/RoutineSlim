import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { hasSeenOnboarding } from '@/features/onboarding/onboardingStorage';
import { useAuthStore } from '@/features/auth/authStore';
export default function Index() {
 const [ready, setReady] = useState(false);
 const [seen, setSeen] = useState(false);
 const status = useAuthStore(s => s.status);
 useEffect(() => { Promise.all([hasSeenOnboarding(), useAuthStore.getState().restore()]).then(([value]) => {setSeen(value); setReady(true);}).catch(() => setReady(true)); }, []);
 if (!ready) return null;
 const demo = import.meta.env.VITE_AUTH_MODE !== 'server' && (sessionStorage.getItem('routineslim.demo-session') || localStorage.getItem('routineslim.demo-session'));
 return <Redirect href={!seen ? '/onboarding' : status === 'signedIn' || demo ? '/home' : '/login'}/>;
}
