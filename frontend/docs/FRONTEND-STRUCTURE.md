# RoutineSlim-Frontend

코리아IT아카데미 1조 웹 프론트엔드입니다.

React 화면은 기능별로 나누고, 각 기능 안에서 화면·API·전용 컴포넌트·훅·검증 로직의 역할을 구분합니다. 여러 기능에서 함께 사용하는 코드는 `components`, `hooks`, `api`, `shared`에 둡니다.

## 폴더 구조

```text
RoutineSlim-Frontend/
├─ index.html                         # 브라우저 진입 HTML
├─ package.json                       # 실행·테스트·빌드·서식 명령
├─ vite.config.js                     # 개발 서버와 고정 백엔드 8080 프록시
├─ .env.example                       # API 연결 설정 예시
├─ .nvmrc                             # 팀 기준 Node.js 24.15.0
├─ .prettierrc.json                    # 코드 서식 규칙
├─ 실행.bat                           # 개발 미리보기 실행
├─ 8080용-빌드.bat                     # Spring 8080 배치용 정적 빌드
├─ public/
│  └─ fonts/                          # Noto Sans KR와 폰트 라이선스
├─ src/
│  ├─ main.jsx                        # React 실행·전역 오류 경계
│  ├─ App.jsx                         # 로그인 상태·해시 라우팅·기능 연결
│  ├─ api/
│  │  ├─ apiClient.js                 # 공통 요청 입구·선택적 쿠키/CSRF 처리
│  │  └─ serverApiAdapter.js          # 웹 모델 ↔ 첨부 서버 DTO 변환
│  ├─ config/
│  │  └─ apiConfig.js                 # API 모드·주소 설정
│  ├─ shared/
│  │  ├─ routineSlimApiClient.js      # 플랫폼 독립 서버 통신
│  │  └─ routineSlimApiClient.d.ts    # 서버 DTO·enum 타입
│  ├─ components/
│  │  ├─ layout/                     # 사이드바·헤더·우측 요약 패널
│  │  ├─ common/                     # 공용 모달·오류 경계·폼·브랜드
│  │  └─ charts/                     # 월별 막대·카테고리 도넛 차트
│  ├─ hooks/
│  │  └─ useApiResource.js            # 조회·재조회·오류·중복 저장 제어
│  ├─ features/                      # 기능별 코드
│  │  ├─ auth/                       # 일반 로그인 (가입·소셜·복구 절차 제외)
│  │  ├─ dashboard/                  # 대시보드와 부분 조회 실패 처리
│  │  ├─ subscriptions/              # 구독·고정비·체험·요금 비교
│  │  ├─ payments/                   # 실제 결제 내역·결제 캘린더
│  │  ├─ reports/                    # 지출 차트·월간 결산
│  │  ├─ savings/                    # 절약 분석·월 예산·목표
│  │  ├─ community/                  # 글·댓글·좋아요·신고·내 활동
│  │  ├─ account/                    # 회원정보·계정 설정·백업/복원
│  │  ├─ notifications/              # 알림센터·결제 알림 설정
│  │  ├─ support/                    # 소개·공지·FAQ·문의
│  │  └─ admin/                      # 관리자·콘텐츠·신고 처리
│  ├─ styles/                        # 공통·대시보드·기능·로그인·글꼴 CSS
│  ├─ utils/
│  │  └─ csvExport.js                # 공용 CSV 다운로드
│  └─ __tests__/                     # 화면·API·입력·복구 흐름 테스트
├─ docs/                              # 구조·서버 작업·배포·검증 문서
└─ dist/                              # 빌드 결과 (생성 파일, 직접 편집하지 않음)
```

각 기능은 필요한 하위 폴더만 갖습니다. 모든 기능에 빈 폴더를 만들지는 않았습니다.

```text
features/subscriptions/
├─ index.js                           # 외부에서 사용할 화면 export
├─ pages/                             # 목록·상세·무료체험·요금 비교 화면
├─ api/
│  └─ subscriptionsApi.js             # 구독 관련 경로·요청 DTO 조립
├─ components/
│  └─ SubscriptionEditor.jsx          # 등록·수정 입력 창
├─ hooks/
│  └─ useServiceCatalog.js            # 서비스 카탈로그 조회
└─ utils/
   ├─ validateSubscription.js         # 이름·금액·날짜 검증
   └─ subscriptionCalculations.js     # 월 환산·절약 후보 계산
```

## 코드 배치 원칙

- `pages`: 화면 상태·사용자 조작·표시를 담당합니다.
- `api`: 해당 기능의 HTTP 경로·메서드·요청 데이터를 관리합니다. 서버 규격이 바뀌면 이곳부터 확인합니다.
- `components`: 해당 기능에서만 재사용하는 화면 조각을 둡니다.
- `hooks`: 해당 기능의 데이터 조회나 상태 흐름을 둡니다.
- `utils`: 브라우저나 React 없이 계산·검증하는 함수를 둡니다.
- `index.js`: 앱 진입점이 기능의 내부 파일 배치에 직접 의존하지 않도록 공개 화면을 export합니다.
- `components/common`, `hooks/useApiResource`: 여러 기능이 함께 사용합니다. 기능 전용 로직을 여기에 계속 쌓지 않습니다.
- `api/serverApiAdapter`: 서버 DTO와 웹 표시 모델의 차이를 처리합니다. 서버의 인증·권한을 대신하지 않습니다.

API는 `features/*/api/*Api.js` 10개 파일로 분리했습니다. 대시보드는 구독·통계·절약 등 다른 기능 API를 조합하므로 별도의 중복 API 계층을 만들지 않았습니다.

## 화면에서 서버까지

```text
기능 화면(pages)
  → 기능 API(features/*/api)
  → 공통 요청(api/apiClient)
  → 서버 DTO 변환(api/serverApiAdapter, 기본 server-dev 모드)
  → 서버 통신(shared/routineSlimApiClient)
  → Spring API(localhost:8080)
  → 서버의 인증·권한·DB 처리
```

기존 쿠키 기반 서버용 `original` 모드는 명시적으로 선택할 때만 사용합니다. 이 경우 공통 요청 계층에서 필요한 CSRF 처리를 수행합니다.

## 기본 명령

```sh
npm ci
npm run dev
npm test
npm run build
npm run format
npm run format:check
```

개발 미리보기는 5173, 기존 Spring API는 8080입니다. 최종 화면을 8080에서 제공하는 방법은 `LOCALHOST-8080.md`, 백엔드 담당자가 할 일은 `BACKEND-TODO.md`를 확인하세요.
