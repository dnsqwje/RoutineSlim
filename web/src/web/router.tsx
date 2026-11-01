import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, type NavigateFunction } from 'react-router-dom';
type Destination = string | { pathname: string; params?: Record<string, string> };
let navigate: NavigateFunction;
function href(to: Destination) {
  if (typeof to === 'string') return to;
  const params = { ...to.params };
  const path = to.pathname.replace(/\[([^\]]+)\]/g, (_, key: string) => {
    const value = params[key]; delete params[key]; return encodeURIComponent(value ?? '');
  });
  const query = new URLSearchParams(params).toString();
  return path + (query ? `?${query}` : '');
}
export function RouterBridge() { navigate = useNavigate(); return null; }
export const router = {
  push: (to: Destination) => navigate(href(to)),
  replace: (to: Destination) => navigate(href(to), { replace: true }),
  dismissTo: (to: Destination) => navigate(href(to), { replace: true }),
  back: () => navigate(-1),
  canGoBack: () => (window.history.state?.idx ?? 0) > 0,
};
export function useLocalSearchParams<T>() {
  const params = useParams(); const [search] = useSearchParams();
  return { ...Object.fromEntries(search), ...params } as T;
}
export function Redirect({ href: to }: { href: Destination }) {
  const nav = useNavigate(); const url = href(to);
  useEffect(() => { nav(url, { replace: true }); }, [nav, url]);
  return null;
}
