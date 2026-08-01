# illog Desktop App — Feature Specifications

`services/app` (Electron 데스크톱 앱)의 기능 정의서 모음입니다.
Feature specifications for `services/app` (the Electron desktop application).

각 기능 폴더에는 한국어(`spec.ko.md`)와 영어(`spec.en.md`) 문서가 각각 1개씩 있습니다.
Each feature folder contains one Korean (`spec.ko.md`) and one English (`spec.en.md`) document.

## 도메인 기능 / Domain Features

| 폴더 / Folder                       | 기능 / Feature        | 설명 / Description                                                                         |
| ----------------------------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| [`task`](./task/)                   | 로그(Task) 관리       | 로그 생성·수정·상태·시간·삭제·필터 / Task CRUD, status, time, soft delete, filters         |
| [`note`](./note/)                   | 노트 에디터           | Lexical 리치 텍스트 노트 + 자동 저장 / Rich-text note editor with autosave                 |
| [`ai-reflection`](./ai-reflection/) | AI 회고               | TextRank 전처리 + Gemini 스트리밍 요약 / TextRank preprocessing + Gemini streaming summary |
| [`tag`](./tag/)                     | 태그                  | 태그 CRUD 및 로그 연결(최대 5개) / Tag CRUD and task linking (max 5)                       |
| [`project`](./project/)             | 프로젝트              | 프로젝트 CRUD 및 로그 소속 / Project CRUD and task assignment                              |
| [`task-type`](./task-type/)         | 작업 유형 / 세부 유형 | 2단계 분류 체계 + 기본 시드 / Two-level taxonomy with default seed                         |

## 화면 기능 / Screen Features

| 폴더 / Folder                               | 기능 / Feature    | 설명 / Description                                                                |
| ------------------------------------------- | ----------------- | --------------------------------------------------------------------------------- |
| [`today`](./today/)                         | 오늘 로그         | 오늘 구간 로그 목록 및 생성 / Today's logs list and creation                      |
| [`weekly-summary`](./weekly-summary/)       | 주간 요약         | 주간 통계 + 카테고리 드릴다운 분석 / Weekly stats + category drill-down analytics |
| [`history`](./history/)                     | 히스토리          | 전체 로그 목록 / Full task history                                                |
| [`project-insights`](./project-insights/)   | 프로젝트 인사이트 | 프로젝트별 지표 및 분석 테이블 / Per-project metrics and analysis tables          |
| [`calendar-view`](./calendar-view/)         | 캘린더 뷰         | 일간·주간 타임그리드 / Daily and weekly time grid                                 |
| [`weekly-reflection`](./weekly-reflection/) | 주간 회고         | 성과·개선점·다음 주 포커스 기록 / Accomplishments, improvements, next-week focus  |

## 플랫폼 기능 / Platform Features

| 폴더 / Folder                                   | 기능 / Feature     | 설명 / Description                                                                 |
| ----------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| [`app-shell`](./app-shell/)                     | 앱 셸              | 윈도우·트레이·메뉴·라우팅·테마 / Window, tray, menu, routing, theme                |
| [`settings-onboarding`](./settings-onboarding/) | 설정 / 온보딩      | 설정 다이얼로그 및 첫 실행 온보딩 / Settings dialog and first-run onboarding       |
| [`crash-report`](./crash-report/)               | 크래시 리포트      | 옵트인 익명 오류 리포팅(Sentry) / Opt-in anonymous crash reporting (Sentry)        |
| [`usage-analytics`](./usage-analytics/)         | 사용 분석          | Umami 이벤트 트래킹 / Umami event tracking                                         |
| [`auto-update`](./auto-update/)                 | 자동 업데이트      | Squirrel 기반 자동 업데이트 / Squirrel-based auto update                           |
| [`plan-feature-flag`](./plan-feature-flag/)     | 플랜 / 기능 플래그 | 플랜별 기능 게이팅 / Plan-based feature gating                                     |
| [`error-handling`](./error-handling/)           | 오류 처리          | AppError 프로토콜·토스트·에러 바운더리 / AppError protocol, toasts, error boundary |
| [`data-storage`](./data-storage/)               | 데이터 저장소      | SQLite·Drizzle·마이그레이션·시드 / SQLite, Drizzle, migrations, seed               |
| [`security`](./security/)                       | 보안               | 컨텍스트 격리·CSP·개인정보 스크러빙 / Context isolation, CSP, PII scrubbing        |

## 문서 규칙 / Document Conventions

- 본 문서는 **구현된 현재 상태**를 기준으로 작성된 기능 정의서입니다. 미구현/비활성 항목은 각 문서의 "현재 제한사항" 절에 명시합니다.
- These are feature definitions describing the **current implemented state**. Unimplemented or disabled items are listed in each document's "Current Limitations" section.
- 요구사항 ID는 `FR-<기능약어>-<번호>` 형식을 사용합니다.
- Requirement IDs follow the `FR-<abbrev>-<number>` format.
