# TripLog-fe

React Native(Expo) 기반 TripLog 프론트엔드 프로젝트의 초기 설계 문서입니다.  

## 1. 프로젝트 개요

- 프로젝트명: TripLog-fe
- 플랫폼: React Native (Expo) / iOS + Android
- 목표: 여행 기록/공유 앱 TripLog의 모바일 클라이언트
- 참고 디자인: Figma (node-id=24-34)
- 연동 백엔드: TripLog-be
- 로그인: 애플/구글만 사용 (이메일/비밀번호 제외)
- 스타일링: `nativewind`
- 지도 SDK: Google Maps

## 2. 아키텍처

### 2.1 구조

Feature-First + Clean Architecture 경량 버전 권장

- `app/` (Expo Router)
- `features/` (도메인별 UI + 상태 + API)
- `shared/` (공용 컴포넌트/유틸/테마)
- `entities/` (도메인 모델/타입)
- `services/` (API/스토리지/권한 등)

### 2.2 상태 관리

- 서버 상태: `@tanstack/react-query`
- 클라이언트 상태: `zustand` (필요 시)
- 폼: `react-hook-form`

### 2.3 네트워크/인증

- HTTP: `axios`
- 토큰 저장: `expo-secure-store`
- 인증 플로우: Access/Refresh 토큰 기반, 자동 갱신

### 2.4 네비게이션

- `expo-router` + `Stack`/`Tabs` 혼합
- 탭 구성 (4탭):
  - **여행 지도** — 구글 지도 위에 게시물을 마커로 표시
  - **여행 앨범** — 게시물을 그리드 형태로 표시
  - **추천 여행** — 추천 여행지 목록/상세/북마크
  - **나의 여행** — 내 프로필/설정

### 2.5 스타일/디자인 시스템

- `nativewind` 사용
- 공용 `theme` + `tokens` 유지

### 2.6 지도

- `react-native-maps` + Google Maps Provider
- iOS API Key: 환경변수로 관리
- Android API Key: 환경변수로 관리

## 3. 초기 폴더 구조(초안)

```
TripLog-fe/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx           # 로그인 화면
│   │   └── _layout.tsx
│   ├── (tabs)/
│   │   ├── map.tsx             # 여행 지도 탭
│   │   ├── album.tsx           # 여행 앨범 탭
│   │   ├── recommend.tsx       # 추천 여행 탭
│   │   ├── mypage.tsx          # 나의 여행 탭
│   │   └── _layout.tsx         # 탭 레이아웃
│   ├── post/
│   │   ├── [id].tsx            # 게시물 상세
│   │   ├── create.tsx          # 게시물 생성
│   │   └── edit/[id].tsx       # 게시물 수정
│   ├── recommend/
│   │   └── [id].tsx            # 추천 여행 상세
│   └── _layout.tsx             # 루트 레이아웃
├── features/
│   ├── auth/                   # 인증 (애플/구글 로그인)
│   ├── posts/                  # 게시물 (CRUD, 좋아요, 해시태그, 신고)
│   ├── map/                    # 지도 마커/클러스터링
│   ├── album/                  # 앨범 그리드 뷰
│   ├── recommend/              # 추천 여행 + 북마크
│   ├── comments/               # 댓글/좋아요
│   └── settings/               # 설정/프로필
├── entities/
│   ├── post.ts                 # 게시물 타입
│   ├── user.ts                 # 유저 타입
│   ├── comment.ts              # 댓글 타입
│   └── recommendation.ts       # 추천 여행 타입
├── services/
│   ├── api/                    # axios 인스턴스, 인터셉터
│   ├── auth/                   # 토큰 관리, 소셜 로그인
│   └── image/                  # 이미지 업로드/리사이즈
├── shared/
│   ├── components/             # 공용 UI 컴포넌트
│   ├── hooks/                  # 공용 훅
│   └── utils/                  # 유틸 함수
└── README.md
```

## 4. 기능 범위

### 4.1 인증

- 애플 로그인 / 구글 로그인
- 로그아웃 / 회원 탈퇴
- Access/Refresh 토큰 자동 갱신

### 4.2 게시물 (공통 — 지도/앨범 탭 공유)

- 게시물 생성 (이미지 다중 업로드, 위치 정보, 해시태그)
- 게시물 상세 조회
- 게시물 수정 / 삭제
- 게시물 좋아요
- **해시태그 등록/표시**
- **게시물 신고**
- **게시물 북마크**

### 4.3 여행 지도 탭

- Google Maps 전체 지도
- 게시물을 위치 기반 마커로 표시
- 마커 탭 → 게시물 미리보기 → 상세 이동

### 4.4 여행 앨범 탭

- 게시물 목록을 그리드(사진 앨범) 형태로 표시
- 탭 → 게시물 상세 이동

### 4.5 댓글

- 댓글 목록 / 작성 / 수정 / 삭제
- 댓글 좋아요

### 4.6 추천 여행

- 추천 여행지 목록 (DB / 공공 API)
- 추천 여행 상세
- 관광정보 검색
- 북마크 추가/제거/목록

### 4.7 나의 여행 (마이페이지)

- 내 정보 조회 / 수정
- 설정 (알림, 테마 등)

### 4.8 이미지 업로드

- 다중 선택 (최대 10개)
- 업로드 순서 유지
- 개별 삭제 가능
- 이미지별 메타데이터 (위치, 촬영시간, 설명)

## 5. 화면 흐름 (Screen Flow)

```
[앱 시작]
  │
  ├─ 미인증 → (auth) 로그인 화면
  │              ├─ 애플 로그인
  │              └─ 구글 로그인
  │
  └─ 인증됨 → (tabs)
               ├─ 여행 지도 (map)
               │    ├─ 지도 + 마커
               │    └─ 마커 탭 → 게시물 상세
               ├─ 여행 앨범 (album)
               │    ├─ 그리드 목록
               │    └─ 탭 → 게시물 상세
               ├─ 추천 여행 (recommend)
               │    ├─ 추천 목록
               │    ├─ 검색
               │    ├─ 상세 → 북마크
               │    └─ 북마크 목록
               └─ 나의 여행 (mypage)
                    ├─ 프로필
                    └─ 설정

[게시물 공통 (Stack)]
  ├─ 게시물 상세 → 댓글 / 좋아요 / 신고
  ├─ 게시물 생성 → 이미지 선택 / 해시태그 / 위치
  └─ 게시물 수정
```

## 6. API 연동 매핑

| 기능 | Method | Endpoint | 비고 |
|------|--------|----------|------|
| **인증** | | | |
| 애플 로그인 | POST | `/api/auth/apple` | idToken 전달 |
| 구글 로그인 | POST | `/api/auth/google` | idToken 전달 |
| 로그아웃 | POST | `/api/auth/logout` | |
| 토큰 갱신 | POST | `/api/auth/refresh` | 인터셉터 자동 처리 |
| 회원 탈퇴 | DELETE | `/api/auth/withdraw` | |
| **사용자** | | | |
| 내 정보 조회 | GET | `/api/users/me` | |
| 내 정보 수정 | PUT | `/api/users/me` | |
| **게시물** | | | |
| 목록 조회 | GET | `/api/posts` | 페이징, 지도/앨범 공용 |
| 상세 조회 | GET | `/api/posts/:postId` | |
| 생성 | POST | `/api/posts` | multipart, 이미지+메타 |
| 수정 | PUT | `/api/posts/:postId` | |
| 삭제 | DELETE | `/api/posts/:postId` | |
| 좋아요 | POST | `/api/posts/:postId/like` | 토글 |
| **댓글** | | | |
| 목록 | GET | `/api/posts/:postId/comments` | |
| 작성 | POST | `/api/posts/:postId/comments` | |
| 수정 | PUT | `/api/comments/:commentId` | |
| 삭제 | DELETE | `/api/comments/:commentId` | |
| 좋아요 | POST | `/api/comments/:commentId/like` | 토글 |
| **추천 여행** | | | |
| 목록 | GET | `/api/recommendations` | 페이징, 카테고리 |
| 상세 | GET | `/api/recommendations/:id` | |
| 검색 | GET | `/api/recommendations/search` | 키워드 |
| **북마크** | | | |
| 토글 | POST | `/api/bookmarks/toggle` | |
| 목록 | GET | `/api/bookmarks` | 페이징 |
| 상태 확인 | GET | `/api/bookmarks/check/:id` | |
| 전체 삭제 | DELETE | `/api/bookmarks` | |
| **설정** | | | |
| 조회 | GET | `/api/settings` | |
| 수정 | PUT | `/api/settings` | |

## 7. API 환경

- 개발: `http://192.168.45.41:3000`
- 프로덕션: 미정

## 8. 환경변수

```
# API
API_BASE_URL=http://192.168.45.41:3000

# Google Maps
IOS_GOOGLE_MAPS_API_KEY=secret
ANDROID_GOOGLE_MAPS_API_KEY=secret
```

## 9. 정책/요구사항

- 토큰: Access/Refresh 자동 갱신
- 이미지 업로드: 다중 선택 최대 10개, 업로드 순서 유지, 삭제 가능
- 오프라인 지원: 필요 없음
- 푸시 알림: 없음
- 로그/크래시 리포팅: 없음

## 10. 실행/빌드

- 개발: `npx expo start`
- 빌드: EAS Build (iOS/Android)

## 11. 주요 의존성 (예정)

| 패키지 | 용도 |
|--------|------|
| `expo` | 프레임워크 |
| `expo-router` | 파일 기반 라우팅 |
| `nativewind` | Tailwind CSS 스타일링 |
| `react-native-maps` | Google Maps 지도 |
| `@tanstack/react-query` | 서버 상태 관리 |
| `zustand` | 클라이언트 상태 관리 |
| `axios` | HTTP 클라이언트 |
| `expo-secure-store` | 토큰 보안 저장 |
| `expo-image-picker` | 이미지 선택 |
| `react-hook-form` | 폼 관리 |
| `expo-apple-authentication` | 애플 로그인 |
| `@react-native-google-signin/google-signin` | 구글 로그인 |
