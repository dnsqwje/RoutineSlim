/*
 * [로그인 구현 1/9] 서버(RoutineSlim-Server) 호출 공통 함수
 *
 * [로그인 - 이대수] 지금은 1번 방식(회원 UUID 를 X-Member-Id 헤더로 보냄). JWT(3번)로 바꾸는 방법은 docs/jwt-switch-guide.md
 *
 * 로그인뿐 아니라 앞으로 모든 API 호출이 함께 쓰는 "fetch 감싸기" 이다.
 * authApi.ts(2번), authorizedRequest.ts(5번)가 여기 request() 를 쓴다.
 * 전체 순서와 파일 목록은 docs/login-guide.md
 */

/**
 * 서버 주소. 루트의 .env.local 에 EXPO_PUBLIC_API_URL 로 적는다 (.env.example 참고)
 * - 웹 브라우저 / iOS 시뮬레이터 : http://localhost:8080  (값이 없으면 이 주소)
 * - 안드로이드 에뮬레이터         : http://10.0.2.2:8080   (에뮬레이터에서 PC 를 가리키는 주소)
 * - 휴대폰 Expo Go               : http://<PC IPv4>:8080  (같은 와이파이, 방화벽 8080 허용)
 * .env.local 을 바꾸면 개발 서버를 다시 켠다 (npx expo start -c)
 */
export const API_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * 서버가 돌려준 오류 또는 연결 실패.
 * 다른 파일에서는 `error instanceof ApiError && error.status === 401` 처럼 검사한다.
 */
export class ApiError extends Error {
  constructor(
    /** 분기용 값. 연결 실패는 'NETWORK_ERROR', 그 밖은 'HTTP_401' 처럼 상태 코드로 만든다 */
    readonly code: string,
    /** 화면에 그대로 보여 줄 수 있는 문장 */
    message: string,
    /** HTTP 상태 코드. 서버에 연결조차 못 했으면 0 */
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Spring Boot 기본 오류 응답 중 쓰는 값.
 * 예) { "timestamp": "...", "status": 401, "error": "Unauthorized", "path": "/auth/refresh" }
 * message 는 서버 설정에 따라 빠질 수 있다.
 */
type ServerError = {
  status?: number;
  error?: string;
  message?: string;
};

/** 서버가 message 를 주지 않았을 때 쓰는 기본 문구 */
function defaultMessage(status: number) {
  if (status === 401) return '로그인이 필요해요. 다시 로그인해 주세요.';
  if (status === 403) return '권한이 없어요.';
  if (status === 404) return '요청한 대상을 찾을 수 없어요.';
  if (status >= 500) return '서버에서 오류가 발생했어요. 잠시 후 다시 시도해 주세요.';
  return '요청을 처리하지 못했어요.';
}

export type RequestOptions = {
  /** 기본 GET */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** 객체를 넘기면 JSON 으로 보낸다 */
  body?: unknown;

  // [1번 임시 - 이대수] 로그인한 회원 UUID. 있으면 X-Member-Id 헤더로 보낸다 (로그인이 필요한 API)
  memberId?: string;

//  // [JWT 로그인 - 이대수] access token. 있으면 Authorization 헤더로 보낸다 (로그인이 필요한 API)
//  token?: string;
};

/**
 * 서버 API 호출. 성공하면 응답 본문(JSON)을 T 로 돌려주고, 실패하면 ApiError 를 throw 한다.
 * 이 서버는 응답을 { success, data } 같은 껍데기로 감싸지 않고 DTO 를 그대로 돌려준다.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;

  // (1) 헤더: body 가 있을 때만 Content-Type
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  // [1번 임시 - 이대수] 회원 UUID 가 있을 때만 X-Member-Id
  if (options.memberId) headers['X-Member-Id'] = options.memberId;

//  // [JWT 로그인 - 이대수] 토큰이 있을 때만 Authorization ("Bearer " 뒤 공백 한 칸)
//  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  // (2) 요청. fetch 자체가 실패하면 서버 꺼짐 / 주소 틀림 / 네트워크 문제
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      // GET 등 body 가 없는 요청에는 body 를 넣지 않는다
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('NETWORK_ERROR', '서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.', 0);
  }

  // (3) 본문 읽기. 로그아웃 성공(200)처럼 본문이 비어 있으면 json() 이 실패하므로 null 로 받는다
  const json: unknown = await response.json().catch(() => null);

  // (4) 200~299 가 아니면 오류
  if (!response.ok) {
    const serverError = json as ServerError | null;
    throw new ApiError(
      `HTTP_${response.status}`,
      serverError?.message || defaultMessage(response.status),
      response.status,
    );
  }

  // (5) 성공: 본문 그대로 (본문이 없으면 undefined)
  return (json ?? undefined) as T;
}
