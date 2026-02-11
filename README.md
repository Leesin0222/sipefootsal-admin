# 사이풋살 어드민 (sipefootsal-admin)

사이풋살 백엔드 API를 사용하는 관리자 웹 콘솔입니다.

## 기술 스택

- **React 18** + **TypeScript**
- **Vite**
- **Chakra UI** (v2)
- **React Router** v6
- **TanStack Query** (React Query)
- **Axios**

## 사전 요구사항

- Node.js 20+
- sipefootsal-backend API 서버 (실행 중)

## 환경 변수

`.env` 파일을 만들고 백엔드 API URL을 설정하세요.

```env
VITE_API_BASE_URL=http://localhost:8080
```

`.env.example`을 참고할 수 있습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173 로 접속합니다.

## 빌드

```bash
npm run build
```

`dist/` 폴더에 정적 파일이 생성됩니다.

## GitHub Pages 배포

1. 저장소 **Settings > Pages**에서 **Source**를 **GitHub Actions**로 선택합니다.
2. `main` 또는 `develop` 브랜치에 push하면 `.github/workflows/deploy.yml`이 실행됩니다.
3. 배포 후 URL: `https://<username>.github.io/sipefootsal-admin/`

배포 시 `GITHUB_PAGES=true`로 빌드되어 `base`가 `/sipefootsal-admin/`로 설정됩니다. SPA 라우팅을 위해 빌드 결과의 `index.html`이 `404.html`로 복사됩니다.

## 주요 기능

- **로그인**: 이메일 + 인증번호 (JWT)
- **대시보드**: 회원 수, 활성 일정, 초대 키 통계
- **일정**: 목록/상세, 생성·수정·삭제, 1차 투표 시작/마감, 확정/취소
- **회원**: 페이징 목록, 검색, 상세, 풋살 레벨/현재 기수/역할 수정
- **초대 키**: 목록, 생성, 만료/삭제, 통계
- **공지사항**: 페이징 목록, 작성/수정/삭제, 상태 토글
- **갤러리**: 일정별 이미지 목록, 업로드, 삭제
- **정산**: 목록, 상세, 재발송, 이력
- **뱃지**: 목록, 생성/수정/삭제, 활성화

백엔드 API는 [sipefootsal-backend](../sipefootsal-backend) 프로젝트를 참고하세요.
