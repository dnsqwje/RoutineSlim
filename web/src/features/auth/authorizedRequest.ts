/*
 * ============================================================================
 * [로그인 구현 5/9] 로그인이 필요한 API 를 부를 때 쓰는 함수
 * ============================================================================
 * 앞으로 구독 목록, 내 정보처럼 로그인해야 쓸 수 있는 API 는 request() 대신 이 함수로 부른다.
 * 로그인한 회원 정보를 자동으로 붙여 준다.
 *
 * [로그인 - 이대수] 지금은 1번 방식(회원 UUID 를 X-Member-Id 헤더로)으로 만든다.
 * 나중에 JWT(3번)로 바꿀 때는 아래 "JWT 방식" 설명대로 함수 안쪽만 바꾼다.
 * 함수 이름·사용법이 같아서, 이 함수를 쓰는 화면들은 고칠 것이 없다.
 *
 *   import { ApiError, request } from '@/api/client';     // 1번 (ApiError 는 JWT 방식에서 사용)
 *   import { useAuthStore } from './authStore';           // 4번
 *
 * 사용 예
 *   const me = await authorizedRequest<Me>('/api/v1/users/me');
 *   await authorizedRequest('/api/v1/subscriptions', { method: 'POST', body: {...} });
 *
 * ----------------------------------------------------------------------------
 * 만들 함수
 * ----------------------------------------------------------------------------
 *   export async function authorizedRequest<T>(path: string, options = {}): Promise<T>
 *     - options 는 request() 의 옵션에서 memberId 만 뺀 것 (memberId 는 이 함수가 넣는다)
 *       타입: Omit<NonNullable<Parameters<typeof request>[1]>, 'memberId'>
 *       (JWT 방식: 'memberId' 대신 'token')
 *
 * [1번 임시 - 이대수] 1번 방식 흐름 (지금 만들 것)
 *   1) const { memberId } = useAuthStore.getState();
 *      - 컴포넌트가 아니라서 useAuthStore(...) 훅이 아니라 getState() 로 읽는다
 *   2) return request<T>(path, { ...options, memberId: memberId ?? undefined });
 *      - memberId 가 없으면(로그인 전) 헤더 없이 가서 서버가 400 을 돌려준다
 *      - 회원이 없으면(삭제됨 등) 404. 화면에서 signOut() 후 로그인 화면으로 보내면 된다
 *
 * [JWT 로그인 - 이대수] JWT 방식 흐름 (나중에 바꿀 것)
 *   1) const { accessToken, refreshAccessToken } = useAuthStore.getState();
 *   2) request<T>(path, { ...options, token: accessToken ?? undefined }) 를 try 로 부른다
 *   3) 오류가 ApiError 이고 status === 401 이 "아니면" 그대로 throw
 *   4) 401 이면 (= access token 만료. 30분마다 생긴다)
 *        const newToken = await refreshAccessToken();
 *        - null 이면 다시 로그인해야 함 → 원래 오류를 throw
 *          (스토어가 이미 signedOut 이 됐으니 화면에서 로그인 화면으로 보내면 된다)
 *        - 새 토큰이면 같은 요청을 새 토큰으로 "한 번만" 다시 보내고 그 결과를 돌려준다
 *          (또 401 이 나도 다시 재발급하지 않는다 → 무한 반복 방지)
 *
 * ----------------------------------------------------------------------------
 * 확인 방법
 * ----------------------------------------------------------------------------
 *   1번: admin 로그인 → authorizedRequest('/api/v1/users/me') → { memberName: 'admin', ... }
 *   JWT: 서버의 access token 수명(application.yml jwt.access-token-validity)을 잠깐 1m 로 바꾸고,
 *        로그인 → 1분 뒤 /api/v1/users/me 호출 → 서버 로그에 /auth/refresh 가 한 번 찍히고 성공하는지
 */

// 아직 구현 전. 구현하면 이 줄은 지운다
export {};
