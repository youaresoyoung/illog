# 작업 유형 / 세부 유형 기능 정의서

## 1. 개요

로그(Task)의 **성격**을 분류하는 2단계 체계(작업 유형 → 세부 유형)를 관리하는 기능입니다. 프로젝트가 "무엇에 대한 일인가"라면, 작업 유형은 "어떤 종류의 일인가"를 나타냅니다. 최초 실행 시 기본 유형이 자동으로 시드됩니다.

## 2. 목적 및 사용자 가치

- 프로젝트를 가로지르는 관점(개발/디자인/회의 등)으로 시간 사용 패턴을 볼 수 있게 한다.
- 처음 사용하는 사용자가 분류 체계를 직접 만들지 않아도 바로 쓸 수 있도록 기본값을 제공한다.

## 3. 용어 정의

| 용어                    | 정의                                                        |
| ----------------------- | ----------------------------------------------------------- |
| 작업 유형(Task Type)    | 1단계 분류. 예: `Development`, `Design`                     |
| 세부 유형(Task Subtype) | 작업 유형에 종속된 2단계 분류. 예: `Development > Frontend` |
| 시드(Seed)              | 데이터베이스에 기본 데이터를 최초 1회 자동 삽입하는 동작    |

## 4. 데이터 모델

### 4.1 `task_type` 테이블

| 컬럼         | 타입               | 제약 / 기본값               |
| ------------ | ------------------ | --------------------------- |
| `id`         | text               | PK, UUID 자동 생성          |
| `name`       | text               | NOT NULL, UNIQUE 인덱스     |
| `color`      | text enum          | 6색, 기본값 `blue`          |
| `created_at` | integer(timestamp) | NOT NULL, 기본값 현재 시각  |
| `updated_at` | integer(timestamp) | NOT NULL, 갱신 시 자동 변경 |
| `deleted_at` | integer(timestamp) | 소프트 삭제 시각            |

### 4.2 `task_subtype` 테이블

| 컬럼           | 타입               | 제약 / 기본값                                    |
| -------------- | ------------------ | ------------------------------------------------ |
| `id`           | text               | PK, UUID 자동 생성                               |
| `task_type_id` | text               | NOT NULL, `task_type.id` FK, `ON DELETE CASCADE` |
| `name`         | text               | NOT NULL                                         |
| `color`        | text enum          | 6색, 기본값 `blue`                               |
| `created_at`   | integer(timestamp) | NOT NULL, 기본값 현재 시각                       |
| `updated_at`   | integer(timestamp) | NOT NULL, 갱신 시 자동 변경                      |
| `deleted_at`   | integer(timestamp) | 소프트 삭제 시각                                 |

인덱스: `task_type_id`, `(task_type_id, name)` UNIQUE, `deleted_at`

### 4.3 기본 시드 데이터

앱 최초 실행 시 `task_type` 테이블이 비어 있으면 다음 8개 유형과 하위 세부 유형이 자동 생성된다.

| 작업 유형     | 색상   | 세부 유형                                                         |
| ------------- | ------ | ----------------------------------------------------------------- |
| Development   | blue   | Frontend, Backend, API, Database, Infrastructure, Bug Fix         |
| Design        | purple | UI Design, UX Research, Prototyping, Design System, Visual Design |
| Meeting       | yellow | Team Sync, Client Meeting, 1:1, Workshop                          |
| Research      | green  | Technical Research, Competitor Analysis, User Research            |
| Planning      | gray   | Sprint Planning, Roadmap, Estimation                              |
| Review        | red    | Code Review, Design Review, Document Review                       |
| Documentation | blue   | Technical Docs, User Guide, API Docs                              |
| Testing       | green  | Unit Testing, Integration Testing, Manual QA                      |

## 5. 기능 상세

| ID         | 기능                     | 설명                                                                 |
| ---------- | ------------------------ | -------------------------------------------------------------------- |
| FR-TYPE-01 | 작업 유형 생성           | 이름과 색상으로 작업 유형을 생성한다.                                |
| FR-TYPE-02 | 작업 유형 단건 조회      | ID로 조회한다. 삭제된 유형은 조회되지 않는다.                        |
| FR-TYPE-03 | 작업 유형 전체 조회      | 삭제되지 않은 유형을 생성일 오름차순으로 반환한다.                   |
| FR-TYPE-04 | 유형+세부 유형 일괄 조회 | 모든 작업 유형과 각 유형의 세부 유형 목록을 함께 반환한다.           |
| FR-TYPE-05 | 작업 유형 수정           | 이름 또는 색상을 수정한다.                                           |
| FR-TYPE-06 | 작업 유형 삭제           | 소프트 삭제한다.                                                     |
| FR-TYPE-07 | 세부 유형 목록 조회      | 특정 작업 유형의 세부 유형을 생성일 오름차순으로 반환한다.           |
| FR-TYPE-08 | 세부 유형 단건 조회      | ID로 조회한다.                                                       |
| FR-TYPE-09 | 세부 유형 생성           | 부모 작업 유형 ID와 이름으로 생성한다.                               |
| FR-TYPE-10 | 세부 유형 수정           | 이름 또는 색상을 수정한다.                                           |
| FR-TYPE-11 | 세부 유형 삭제           | 소프트 삭제한다.                                                     |
| FR-TYPE-12 | 기본 유형 시드           | 앱 시작 시 유형 테이블이 비어 있으면 기본 유형·세부 유형을 삽입한다. |
| FR-TYPE-13 | 로그에 유형 지정         | 로그의 작업 유형·세부 유형을 설정하거나 해제한다.                    |

## 6. 비즈니스 규칙

| ID         | 규칙                                                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| BR-TYPE-01 | 작업 유형 이름은 정규화되며 전역에서 유일하다.                                                                                            |
| BR-TYPE-02 | 세부 유형 이름은 **같은 부모 유형 안에서만** 유일하다. 다른 유형에는 같은 이름의 세부 유형이 존재할 수 있다.                              |
| BR-TYPE-03 | 삭제된 유형/세부 유형과 같은 이름으로 생성하면 새로 만들지 않고 기존 레코드를 복구한다.                                                   |
| BR-TYPE-04 | 작업 유형을 삭제하면 그 유형에 속한 모든 세부 유형도 함께 소프트 삭제된다.                                                                |
| BR-TYPE-05 | 세부 유형 생성 시 부모 작업 유형이 존재하지 않으면 오류를 반환한다.                                                                       |
| BR-TYPE-06 | 로그에 세부 유형을 지정할 때, 해당 세부 유형이 대상 작업 유형에 속하지 않으면 오류를 반환한다.                                            |
| BR-TYPE-07 | 로그의 작업 유형을 변경하면서 세부 유형을 함께 지정하지 않으면 기존 세부 유형이 초기화된다.                                               |
| BR-TYPE-08 | 시드는 유형 테이블이 완전히 비어 있을 때만 1회 실행된다. 사용자가 모든 유형을 삭제해도 소프트 삭제이므로 레코드는 남아 재시드되지 않는다. |
| BR-TYPE-09 | 로그의 작업 유형/세부 유형 FK는 `ON DELETE SET NULL`이므로 유형이 물리 삭제되더라도 로그는 유지된다.                                      |

## 7. 화면 및 인터랙션

`TaskTypeSection` — 로그 카드와 로그 상세 패널 양쪽에 배지 2개로 표시된다.

- **작업 유형 배지**
  - 트리거: 지정된 유형 배지, 없으면 `Add Type` 배지
  - 드롭다운: 검색(`Search task types...`) + 유형 목록. 목록에서 생성·수정·삭제 가능
- **세부 유형 배지**
  - 작업 유형이 지정된 경우에만 표시된다.
  - 트리거: 지정된 세부 유형 배지, 없으면 `Add Subtype` 배지
  - 드롭다운: 검색(`Search subtypes...`) + 해당 유형의 세부 유형 목록
  - 해제 시 세부 유형만 비우고 작업 유형은 유지한다.
- 색상은 캘린더 뷰의 일정 블록 색과 분석 차트 색으로도 사용된다.

## 8. 예외 및 오류 처리

| 상황                              | 처리                                                                  |
| --------------------------------- | --------------------------------------------------------------------- |
| 중복 유형 이름                    | `Task type with name <이름> already exists`                           |
| 존재하지 않는 유형 수정/삭제      | `Task type with id <id> not found`                                    |
| 부모 유형 없음                    | `Parent task type with id <id> not found`                             |
| 같은 유형 내 중복 세부 유형 이름  | `Task subtype with name <이름> already exists for task type <유형명>` |
| 존재하지 않는 세부 유형 수정/삭제 | `Task subtype with id <id> not found`                                 |
| 세부 유형-유형 불일치             | `Task subtype does not belong to the specified task type`             |

## 9. 인터페이스 (IPC 채널)

| 채널                          | 인자                      | 반환                              |
| ----------------------------- | ------------------------- | --------------------------------- |
| `taskType.create`             | `{ name, color? }`        | 작업 유형                         |
| `taskType.get`                | `id`                      | 작업 유형 또는 빈 값              |
| `taskType.getAll`             | —                         | 작업 유형 목록                    |
| `taskType.getAllWithSubtypes` | —                         | 세부 유형이 포함된 작업 유형 목록 |
| `taskType.update`             | `id`, `{ name?, color? }` | 작업 유형                         |
| `taskType.softDelete`         | `id`                      | —                                 |
| `taskSubtype.getAllByTypeId`  | `typeId`                  | 세부 유형 목록                    |
| `taskSubtype.get`             | `id`                      | 세부 유형 또는 빈 값              |
| `taskSubtype.create`          | `{ taskTypeId, name }`    | 세부 유형                         |
| `taskSubtype.update`          | `id`, `{ name?, color? }` | 세부 유형                         |
| `taskSubtype.softDelete`      | `id`                      | —                                 |

## 10. 현재 제한사항 및 향후 계획

- 세부 유형 생성 요청 타입(`CreateTaskSubtypeRequest`)에는 색상 필드가 없어, 생성 시 항상 기본값 `blue`가 적용된다. 생성 후 수정으로만 색상을 바꿀 수 있다.
- 3단계 이상의 분류 계층을 지원하지 않는다.
- 유형별 정렬 순서를 사용자가 지정할 수 없다(생성일 고정).
- 유형을 삭제하기 전에 해당 유형을 사용 중인 로그가 몇 건인지 안내하지 않는다.
- 기본 시드 데이터를 사용자가 초기화하거나 다시 불러오는 수단이 없다.
- `task_type_created`, `task_subtype_created` 분석 이벤트 상수는 정의되어 있으나 전송되지 않는다.
