import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { RouterBridge, router } from './router';
import { BottomTabBar } from '@/components/common/BottomTabBar';
import CalendarIcon from '@/assets/icons/tabs/calendar.svg';
import CommunityIcon from '@/assets/icons/tabs/community.svg';
import MyIcon from '@/assets/icons/tabs/my.svg';
import StatsIcon from '@/assets/icons/tabs/stats.svg';
import HomeIcon from '@/assets/icons/tabs/subscriptions.svg';
const Index = lazy(() => import('@/app/index'));
const Onboarding = lazy(() => import('@/app/onboarding'));
const Login = lazy(() => import('@/app/(auth)/login'));
const Home = lazy(() => import('@/app/(tabs)/home'));
const Calendar = lazy(() => import('@/app/(tabs)/calendar'));
const Stats = lazy(() => import('@/app/(tabs)/stats'));
const Community = lazy(() => import('@/app/(tabs)/community'));
const My = lazy(() => import('@/app/(tabs)/my'));
const Add = lazy(() => import('@/app/subscription/add'));
const Manual = lazy(() => import('@/app/subscription/manual'));
const Scan = lazy(() => import('@/app/subscription/scan'));
const ScanResult = lazy(() => import('@/app/subscription/scan-result'));
const Usage = lazy(() => import('@/app/usage/index'));
const Cleanup = lazy(() => import('@/app/usage/cleanup'));
const Compare = lazy(() => import('@/app/usage/compare'));
const Write = lazy(() => import('@/app/community/write'));
const Post = lazy(() => import('@/app/community/[id]'));
import { Toast } from './toast';
import './style.css';
const tabs = [
  { name: 'home', title: '구독 목록', Icon: HomeIcon },
  { name: 'calendar', title: '캘린더', Icon: CalendarIcon },
  { name: 'stats', title: '통계', Icon: StatsIcon },
  { name: 'community', title: '커뮤니티', Icon: CommunityIcon },
  { name: 'my', title: '마이', Icon: MyIcon },
];
function TabLayout() {
  const { pathname } = useLocation();
  return <><div className="app-content"><Outlet/></div><BottomTabBar
    state={{ index: tabs.findIndex(t => pathname === `/${t.name}`), routes: tabs.map(t => ({key: t.name, name: t.name})) }}
    descriptors={Object.fromEntries(tabs.map(t => [t.name, { options: {title: t.title, tabBarIcon: ({color, size}: {color: string; size: number}) => <t.Icon width={size} height={size} color={color}/> } }]))}
    emitter={{emit: () => ({defaultPrevented: false})}} navigateToTab={key => router.replace(`/${key}`)} insets={{bottom:0}}/>
  </>;
}
function App() {
 return <BrowserRouter><RouterBridge/><main className="app-frame"><Suspense fallback={<div role="status" style={{padding:20}}>불러오는 중…</div>}><Routes>
   <Route element={<TabLayout/>}><Route path="home" element={<Home/>}/><Route path="calendar" element={<Calendar/>}/><Route path="stats" element={<Stats/>}/><Route path="community" element={<Community/>}/><Route path="my" element={<My/>}/></Route>
   <Route element={<div className="app-content"><Outlet/></div>}>
     <Route index element={<Index/>}/><Route path="onboarding" element={<Onboarding/>}/><Route path="login" element={<Login/>}/>
     <Route path="subscription/add" element={<Add/>}/><Route path="subscription/manual" element={<Manual/>}/><Route path="subscription/scan" element={<Scan/>}/><Route path="subscription/scan-result" element={<ScanResult/>}/>
     <Route path="usage" element={<Usage/>}/><Route path="usage/cleanup" element={<Cleanup/>}/><Route path="usage/compare" element={<Compare/>}/>
     <Route path="community/write" element={<Write/>}/><Route path="community/:id" element={<Post/>}/>
     <Route path="*" element={<Index/>}/>
   </Route>
 </Routes></Suspense><Toast/></main></BrowserRouter>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
