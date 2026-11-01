/*
 * [로그인 구현 4/9] 로그인 상태 저장소 (zustand)
 *
 * 앱 전체에서 "지금 로그인했나? 누구인가?" 를 한 곳에서 관리한다.
 *
 * [로그인 - 이대수] 지금은 1번 방식: 로그인하면 받은 회원 UUID(memberId)를 들고 있다.
 * JWT(3번)로 바꿀 때: [1번 임시 - 이대수] 부분은 주석 처리, [JWT 로그인 - 이대수] 부분은 주석 해제 (Ctrl + /)
 *   화면(7·8·9번)이 쓰는 status / signIn / signOut / restore 는 두 방식 모두 이름과 쓰는 법이 같다.
 *
 * 쓰는 법
 * - 컴포넌트 안: const status = useAuthStore((s) => s.status);   ← 값이 바뀌면 다시 그려짐
 * - 컴포넌트 밖: useAuthStore.getState().memberId                ← authorizedRequest(5번)에서 사용
 *                (JWT: useAuthStore.getState().accessToken)
 *
 * 화면 연결(7·8·9번)
 * - 로그인 버튼   → signIn(credentials)   실패하면 ApiError 를 throw → 화면이 catch 해서 안내
 * - 앱 시작       → restore()             저장된 로그인이 있으면 signedIn 으로
 * - 로그아웃 버튼 → signOut()
 */
import { create } from 'zustand';

import * as authApi from './api/authApi';
import type { LoginCredentials } from './api/authApi';
// [1번 임시 - 이대수]
import { clearMemberId, loadMemberId, saveMemberId } from './tokenStorage';

//// [JWT 로그인 - 이대수]
//import { ApiError } from '@/api/client';
//import type { AuthTokens } from './api/authApi';
//import { clearRefreshToken, loadRefreshToken, saveRefreshToken } from './tokenStorage';

// [1번 임시 - 이대수] ---------------------------------------------------------------- 시작
type AuthState = {
  /**
   * - unknown  : 앱을 막 켜서 저장된 로그인을 아직 확인하지 않음 (처음 값). index.tsx 는 이 동안 기다린다
   * - signedIn : 로그인됨 (memberId 있음)
   * - signedOut: 로그인 안 됨
   */
  status: 'unknown' | 'signedIn' | 'signedOut';
  /** 로그인한 회원 UUID. API 요청 때 X-Member-Id 헤더로 보낸다 */
  memberId: string | null;
  /** 로그인 상태 유지 여부 (켜면 memberId 를 기기 저장소에도 저장) */
  keepLoggedIn: boolean;

  /** 로그인. 실패하면 ApiError 를 그대로 throw */
  signIn: (credentials: LoginCredentials) => Promise<void>;
  /** 로그아웃. 1번 방식은 서버에 알릴 것이 없어 앱에서만 지운다 */
  signOut: () => Promise<void>;
  /** 앱 시작 시 한 번: 저장된 memberId 가 있으면 로그인 상태로 */
  restore: () => Promise<void>;
};

const signedOut = { status: 'signedOut', memberId: null } as const;

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'unknown',
  memberId: null,
  keepLoggedIn: false,

  signIn: async (credentials) => {
    const memberId = await authApi.login(credentials);
    set({ status: 'signedIn', memberId, keepLoggedIn: credentials.keepLoggedIn });
    // 유지를 끄고 로그인했으면 저장하지 않는다 → 앱을 다시 켜면 로그인 화면
    if (credentials.keepLoggedIn) await saveMemberId(memberId);
    // 유지를 끄고 다시 로그인한 경우 예전에 저장된 값도 지운다
    else await clearMemberId();
  },

  signOut: async () => {
    set(signedOut); // 화면은 바로 로그아웃
    await clearMemberId();
  },

  restore: async () => {
    // 이미 확인했으면 다시 하지 않는다 (화면이 다시 그려져서 또 불려도 안전하게)
    if (get().status !== 'unknown') return;

    const saved = await loadMemberId();
    // 저장돼 있었다는 것 = 로그인 유지를 켰던 것
    // (회원이 삭제됐으면 이후 API 가 404 → 화면에서 signOut 하면 된다)
    if (saved) set({ status: 'signedIn', memberId: saved, keepLoggedIn: true });
    else set(signedOut);
  },
}));
// [1번 임시 - 이대수] ---------------------------------------------------------------- 끝

//// [JWT 로그인 - 이대수] ------------------------------------------------------------- 시작
//type AuthState = {
//  /**
//   * - unknown  : 앱을 막 켜서 저장된 로그인을 아직 확인하지 않음 (처음 값). index.tsx 는 이 동안 기다린다
//   * - signedIn : 로그인됨 (accessToken 있음)
//   * - signedOut: 로그인 안 됨
//   */
//  status: 'unknown' | 'signedIn' | 'signedOut';
//  /** 메모리에만 둔다 */
//  accessToken: string | null;
//  /** keepLoggedIn 이면 기기 저장소(tokenStorage)에도 저장 */
//  refreshToken: string | null;
//  /** 재발급 후에도 저장 여부를 유지하려고 기억해 둔다 */
//  keepLoggedIn: boolean;
//
//  /** 로그인. 실패하면 ApiError 를 그대로 throw */
//  signIn: (credentials: LoginCredentials) => Promise<void>;
//  /** 로그아웃. 서버 폐기에 실패해도 앱에서는 로그아웃된다 */
//  signOut: () => Promise<void>;
//  /** 앱 시작 시 한 번: 저장된 refresh token 이 있으면 새 토큰을 받아 로그인 상태로 */
//  restore: () => Promise<void>;
//  /** access token 만료(401) 시 새로 받는다. 새 accessToken, 다시 로그인해야 하면 null */
//  refreshAccessToken: () => Promise<string | null>;
//};
//
//const signedOut = { status: 'signedOut', accessToken: null, refreshToken: null } as const;
//
///*
// * 진행 중인 재발급.
// * 여러 API 가 동시에 401 을 받아 재발급을 여러 번 하면, 첫 번째가 refresh token 을 폐기해서
// * 나머지는 401 → 멀쩡한 사용자가 로그아웃된다. 그래서 진행 중이면 같은 Promise 를 나눠 쓴다.
// */
//let refreshing: Promise<string | null> | null = null;
//
//export const useAuthStore = create<AuthState>()((set, get) => {
//  /** 새 토큰을 상태에 넣고, 로그인 유지면 refresh token 을 기기에도 저장 */
//  const applyTokens = async (tokens: AuthTokens, keepLoggedIn: boolean) => {
//    set({
//      status: 'signedIn',
//      accessToken: tokens.accessToken,
//      refreshToken: tokens.refreshToken,
//      keepLoggedIn,
//    });
//    if (keepLoggedIn) await saveRefreshToken(tokens.refreshToken);
//  };
//
//  /** 실제 재발급 한 번 (refreshAccessToken 이 동시 호출을 묶어서 부른다) */
//  const refreshOnce = async (): Promise<string | null> => {
//    const { refreshToken, keepLoggedIn } = get();
//    if (!refreshToken) return null;
//
//    try {
//      const tokens = await authApi.refresh(refreshToken);
//      // ★ 서버는 쓴 refresh token 을 폐기한다. 새 값으로 바꿔 두지 않으면 다음 재발급이 401
//      await applyTokens(tokens, keepLoggedIn);
//      return tokens.accessToken;
//    } catch (error) {
//      // 서버가 거절(만료·폐기)한 경우만 로그아웃
//      if (error instanceof ApiError && error.status === 401) {
//        await clearRefreshToken();
//        set(signedOut);
//        return null;
//      }
//      // 연결 실패 등은 잠깐의 문제일 수 있어 로그아웃시키지 않고 부른 쪽에 넘긴다
//      throw error;
//    }
//  };
//
//  return {
//    status: 'unknown',
//    accessToken: null,
//    refreshToken: null,
//    keepLoggedIn: false,
//
//    signIn: async (credentials) => {
//      const tokens = await authApi.login(credentials);
//      // 유지를 끄고 로그인했으면 저장하지 않는다 → 앱을 다시 켜면 로그인 화면
//      await applyTokens(tokens, credentials.keepLoggedIn);
//    },
//
//    signOut: async () => {
//      // 상태를 지우기 전에 서버에 보낼 토큰을 따로 담아 둔다
//      const { refreshToken } = get();
//      set(signedOut); // 화면은 바로 로그아웃
//      await clearRefreshToken();
//      // 서버 폐기에 실패해도 앱은 이미 토큰을 지웠으니 로그아웃된 것과 같다
//      if (refreshToken) await authApi.logout(refreshToken).catch(() => undefined);
//    },
//
//    restore: async () => {
//      // 이미 확인했으면 다시 하지 않는다 (화면이 다시 그려져서 또 불려도 안전하게)
//      if (get().status !== 'unknown') return;
//
//      const saved = await loadRefreshToken();
//      if (!saved) {
//        set(signedOut);
//        return;
//      }
//
//      // 저장돼 있었다는 것 = 로그인 유지를 켰던 것
//      set({ refreshToken: saved, keepLoggedIn: true });
//      try {
//        // 성공하면 signedIn, 401 이면 refreshOnce 안에서 signedOut 이 된다
//        await get().refreshAccessToken();
//      } catch {
//        // 서버 연결 실패: 저장된 토큰은 남겨 두고(다음 실행 때 다시 시도) 이번에는 로그인 화면으로
//        set({ status: 'signedOut', accessToken: null });
//      }
//    },
//
//    refreshAccessToken: () => {
//      // 진행 중이면 그걸 같이 기다리고, 없으면 새로 시작. 끝나면 비운다
//      refreshing ??= refreshOnce().finally(() => {
//        refreshing = null;
//      });
//      return refreshing;
//    },
//  };
//});
//// [JWT 로그인 - 이대수] ------------------------------------------------------------- 끝
