# CLAUDE.md

이 파일은 이 저장소에서 코드 작업을 할 때 Claude Code(claude.ai/code)에게 제공하는 가이드입니다.

## 저장소 구조

pnpm workspace + Nx 모노레포 (`packageManager: pnpm@10.12.3`, `.npmrc`에 `node-linker=hoisted`). 워크스페이스는 두 그룹으로 나뉩니다:

- `packages/*` — 앱들이 사용하는 라이브러리: `@illog/ui`(React 컴포넌트 라이브러리), `@illog/themes`(디자인 토큰/CSS), `@illog/analytics`(Umami 이벤트 헬퍼), `@illog/esbuild-config`(공통 esbuild 설정), `@illog/codeqa`(내부용 RAG 기반 코드베이스 Q&A CLI), `@illog/vscode-extension`(디자인 토큰 미리보기 확장).
- `services/*` — 배포 대상: `app`(Electron 데스크톱 앱 — 실제 제품), `web`(Next.js 마케팅/문서 사이트), `storybook`(`@illog/ui` 컴포넌트 갤러리).

Nx가 두 그룹 전체의 태스크를 오케스트레이션하며, 각 프로젝트 `project.json`의 `implicitDependencies`에 선언된 의존성 그래프를 기준으로 캐싱/영향 범위(affected)를 판단합니다(예: `illog-app`은 `illog-ui`, `illog-themes`, `illog-analytics`에 의존).

## 자주 쓰는 명령어

별도 표시가 없으면 저장소 루트에서 실행합니다. `*:affected` 변형을 쓰면 Nx가 변경 사항의 영향을 받는 프로젝트에 대해서만 작업을 재실행합니다.

```bash
pnpm build               # nx run-many -t build (전체 프로젝트)
pnpm build:affected      # 현재 변경 사항의 영향을 받는 프로젝트만
pnpm lint / lint:affected
pnpm typecheck / typecheck:affected
pnpm test / test:affected
pnpm affected             # affected 프로젝트에 대해 lint+typecheck+test+build, parallel=3
pnpm format               # prettier --write .
```

특정 프로젝트로 범위를 좁히려면: `pnpm nx run <project-name>:<target>` (프로젝트 이름은 폴더명이 아니라 Nx 이름입니다. 예: `illog-app`, `illog-ui`, `illog-themes`) — 또는 해당 package/service 디렉터리로 `cd`해서 로컬 스크립트를 사용하세요.

단일 테스트 실행 (패키지별 vitest 사용):

```bash
cd packages/ui && pnpm exec vitest run src/hooks/useDialog.test.ts
cd packages/ui && pnpm exec vitest src/hooks/useDialog.test.ts   # watch 모드
```

테스트는 소스 옆에 `*.test.ts(x)`로 위치합니다. 모든 패키지에 테스트가 구성되어 있는 것은 아니므로, 존재한다고 가정하지 말고 `test` 스크립트 / `vitest.config.ts` 유무를 먼저 확인하세요.

### Electron 앱 (`services/app`)

```bash
pnpm start                     # electron-forge start, HMR 지원 dev 모드
pnpm package                   # out/ 에 패키징된 앱 생성
pnpm make                      # 배포용 아티팩트(DMG 등) — rebuild:makers를 먼저 실행
pnpm rebuild                   # electron-rebuild -f -w better-sqlite3 (네이티브 모듈)
pnpm db:generate                # drizzle-kit generate (src/main 기준으로 실행, cwd 중요)
pnpm db:migrate                 # rebuild better-sqlite3 -> drizzle-kit migrate -> electron-rebuild
pnpm db:studio                  # drizzle-kit studio
```

`illog-app`의 Nx `build` 타겟은 렌더러 번들만 빌드합니다(`vite build --config vite.renderer.config.ts`). `pnpm package`/`pnpm make`(electron-forge)는 Forge Vite 플러그인을 통해 main + preload + renderer를 함께 빌드합니다.

### Web (`services/web`, Next.js)

```bash
cd services/web && pnpm dev / pnpm build / pnpm start
```

### Storybook

```bash
cd services/storybook && pnpm storybook   # dev, 6006 포트
```

### codeqa CLI (`packages/codeqa`)

```bash
pnpm ask "질문"          # tsx packages/codeqa/src/cli.ts
pnpm gen:commit               # staged diff로부터 커밋 메시지 생성
```

## 아키텍처: `services/app` (Electron)

`forge.config.ts` + `@electron-forge/plugin-vite`로 연결된 세 개의 Vite 빌드 타겟: `src/main/index.ts`(main), `src/preload/index.ts`(preload), `src/renderer`(renderer, React). `src/shared`에는 세 프로세스가 공유하는 타입/상수가 있습니다.

**메인 프로세스는 repository → service → IPC controller로 계층화되어 있습니다:**

- `src/main/repository/` — Drizzle ORM(`drizzle-orm/better-sqlite3`) 데이터 액세스, 애그리게이트별로 클래스 하나(`TaskRepository`, `NoteRepository`, `ProjectRepository` 등)
- `src/main/service/` — 리포지토리를 조합한 비즈니스 로직 (예: `NoteService`는 `noteRepo`, `reflectionRepo`, `GeminiService`, `UserService`를 받음)
- `src/main/ipc/ipcHandlers.ts` — `ipcMain.handle` 채널 등록, 도메인별로 `register*Handlers` 함수 하나
- `src/main/controller/registerHandlers.ts` — 컴포지션 루트: 리포지토리/서비스를 생성하고 IPC 핸들러에 연결합니다. 기능이 엔드투엔드로 어떻게 조립되는지 추적하려면 여기서 시작하세요.
- `src/main/db.ts` — `app.getPath('userData')`에 SQLite DB를 열고, `src/main/database/migrations`에서 Drizzle 마이그레이션을 실행하며, 기본 task type을 시드합니다.
- Preload(`src/preload/index.ts`)는 `contextBridge`를 통해 `safeInvoke` 래퍼를 노출하는데, 메인 프로세스에서 던진 `__APP_ERROR__` 구분자가 포함된 커스텀 에러 프로토콜을 파싱해 타입이 있는 `AppError`로 복원합니다.

**렌더러**(`src/renderer/src`)는 일반적인 React 앱 구조입니다: `pages/`, `components/`, `hooks/`, `context/`, `providers/`, 그리고 `stores/`의 Zustand 스타일 스토어(`useUIStore`, `useUserStore`, `useEditorStore`, `useToastStore`, `useCrashReportStore`).

**빌드 관련 주의사항 (모두 의도된 것이니 "고치려" 하지 마세요):**

- `better-sqlite3`, `@google/genai`(및 `google-auth-library`, `gaxios` 같은 하위 의존성), `natural`, `string-similarity`는 `vite.main.config.ts`에서 강제로 `external` 처리되어 있습니다 — 번들링하면 순환 참조로 인한 스택 오버플로우가 발생하거나 네이티브 바인딩이 깨집니다.
- `natural`의 `StorageBackend.js`는 모듈 스코프에서 조건 없이 `pg`, `mongoose`, `redis`, `memjs`를 `require`합니다. 패키징 시 이를 제외해야 한다면 반드시 스텁(빈 프록시 모듈)을 만들어야 합니다. 그렇지 않으면 패키징된 앱이 `Cannot find module 'pg'` 에러로 조용히 크래시합니다.
- `env.ts`는 패키징 여부를 `process.resourcesPath`(dev 모드에서도 설정되어 있음)가 아니라 `__filename.includes('app.asar')`로 판단합니다. 메인 프로세스용 Vite CJS 출력은 `import.meta.url`을 `__filename`/`__dirname`으로 변환하므로, ESM `import.meta.url` 헬퍼 대신 이 값들을 직접 사용하세요.
- `getRequiredEnv`는 예외를 던지지 않고 경고 후 `''`를 반환합니다 — `env.ts`의 모듈 레벨 throw는 에러 핸들러가 붙기도 전에 앱을 죽여버리기 때문입니다.
- `vite.renderer.config.ts`는 `root: 'src/renderer'`를 설정하는데, 이 때문에 Forge의 기본 상대 경로 `outDir`이 바뀐 root를 기준으로 해석되어 엉뚱한 경로로 빠집니다 — `outDir`은 반드시 절대 경로(`path.resolve(__dirname, '.vite/renderer/main_window')`)여야 합니다.
- `forge.config.ts`의 `afterCopy` 훅은 `services/app/package.json`의 런타임 `dependencies` 그래프만 골라서 패키징된 앱의 `node_modules`로 수동 복사합니다(워크스페이스 루트 `node_modules`를 통째로 넣지 않음). 이후 `better-sqlite3`에 대해 타겟 Electron 버전/아키텍처 기준으로 `@electron/rebuild`를 다시 실행합니다 — 이는 Forge 자체의 네이티브 모듈 처리 단계 *이후*에 리빌드가 필요하기 때문입니다.
- `packagerConfig.ignore`(`ignoreSensitiveResources`)는 예외 허용 방식의 allowlist입니다: `.vite` 출력물, `package.json`, `.env.production`을 제외한 모든 것이 패키징된 앱에서 제외되며, 런타임 `node_modules`는 `afterCopy`에서 별도로 다시 추가됩니다.

## `@illog/ui` (`packages/ui`)

esbuild(`build.ts`, `@illog/esbuild-config` 사용) + `tsc`(타입용)로 빌드되는 컴포넌트 라이브러리이며, `services/app`과 `services/storybook`에서 사용됩니다. 디자인 토큰은 `@illog/themes`에서 오고, 색상/아이콘은 생성되는 파일이므로(`build:color`는 `src/core/tokens`에서, `build:icons`는 `src/assets/svg`에서) 결과물을 직접 손으로 수정하지 말고 생성기를 실행하세요. 스타일링은 `@vanilla-extract`를 사용합니다. 테스트: Vitest + jsdom(`vitest.config.ts`, 셋업은 `src/test/setup.ts`).

`services/app`의 렌더러는 `@illog/ui`의 패키지 export(published 형태)를 사용하지 **않습니다** — `vite.renderer.config.ts`가 `@illog/ui` / `@illog/ui/index.css`를 `packages/ui/dist/*`로 직접 alias하고 `optimizeDeps`에서 제외합니다. 따라서 `@illog/ui` 소스를 수정한 뒤에는 반드시 리빌드(`pnpm --filter @illog/ui build`, 또는 해당 `build:watch`)해야 앱에 반영됩니다.

## CI

`.github/workflows/ci.yml`은 `develop`/`staging`/`main`으로의 PR에서 실행됩니다: `nx affected`로 lint, `prettier --check .`, typecheck, test, build를 수행하며(모두 `--parallel=3`), `nrwl/nx-set-shas`로 affected 기준 SHA를 계산합니다. `main.yml`은 `main` 브랜치 push 시 Electron 앱의 서명/노터라이즈/퍼블리시를 처리합니다. 분산 캐싱을 위해 Nx Cloud가 설정되어 있습니다(`nx.json`의 `nxCloudId`).
