/**
 * Entity 타입 정의
 * Drizzle 스키마에서 추론된 타입 + Composite 타입
 */

// Drizzle 스키마에서 기본 Entity 타입 re-export
// `export type`은 컴파일 시 제거되어 런타임 의존성 없음
export type { Task, InsertTask, Tag, InsertTag, Project } from '../../main/database/schema'

// Note/Reflection은 스키마에서 타입 추론
import type { taskNotes, taskReflections } from '../../main/database/schema'
export type TaskNote = typeof taskNotes.$inferSelect
export type InsertTaskNote = typeof taskNotes.$inferInsert
export type TaskReflection = typeof taskReflections.$inferSelect
export type InsertTaskReflection = typeof taskReflections.$inferInsert

// ============================================
// Composite Types (관계 포함 타입)
// ============================================

import type { Tag, Task } from '../../main/database/schema'

/** 태스크 + 연결된 태그 목록 */
export interface TaskWithTags extends Task {
  tags: Pick<Tag, 'id' | 'name' | 'color'>[]
}

/** 태스크 + 태그 + 노트 + 리플렉션 (상세 조회용) */
export interface TaskWithDetails extends TaskWithTags {
  note: TaskNote | null
  reflection: TaskReflection | null
}
