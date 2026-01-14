/**
 * 공통 기본 타입 정의
 * 모든 Entity와 DTO에서 사용되는 primitive 타입들
 */

/** UUID v4 형식의 문자열 */
export type UUID = string

/** ISO 8601 형식의 날짜 문자열 (e.g., "2024-01-15T09:30:00.000Z") */
export type ISODateString = string

/** 태그 색상 - DB enum과 동기화 */
export type TagColor = 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'gray'

/** 프로젝트 색상 - DB enum과 동기화 (TagColor와 동일) */
export type ProjectColor = 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'gray'

/** 태스크 상태 - DB enum과 동기화 (snake_case 필수) */
export type TaskStatus = 'todo' | 'in_progress' | 'done'

/** 시스템 자동 관리 필드 (Create/Update 시 제외) */
export type SystemFields = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'

/** 모든 시스템 필드 (doneAt 포함) */
export type AllSystemFields = SystemFields | 'doneAt'
