/**
 * Note & Reflection API DTO (Data Transfer Object)
 * API 경계에서 사용되는 Request/Response 타입
 */

import type { UUID } from './common'
import type { TaskNote, TaskReflection } from './entities'

// ============================================
// Note Request DTOs
// ============================================

/** 노트 자동저장 요청 */
export interface AutoSaveNoteRequest {
  taskId: UUID
  content: string
  clientUpdatedAt: string // ISO date string (충돌 감지용)
}

// ============================================
// Note Response DTOs
// ============================================

/** 노트 조회 응답 */
export type TaskNoteResponse = TaskNote | null

/** 노트 자동저장 응답 */
export interface AutoSaveNoteResponse {
  success: boolean
  note: TaskNote
  serverUpdatedAt: string
}

// ============================================
// Reflection Request DTOs
// ============================================

/** AI 리플렉션 생성 요청 (스트리밍) */
export interface GenerateReflectionRequest {
  taskId: UUID
  noteContent: string
}

/** 리플렉션 생성 파라미터 (Repository용) */
export interface CreateReflectionParams {
  taskId: UUID
  content: string
  originalNoteHash?: string | null
}

/** 리플렉션 수정 파라미터 */
export interface UpdateReflectionParams {
  id: UUID
  taskId: UUID
  content: string
  originalNoteHash?: string | null
}

// ============================================
// Reflection Response DTOs
// ============================================

/** 리플렉션 조회 응답 */
export type TaskReflectionResponse = TaskReflection | null

/** 스트리밍 청크 (AI 리플렉션 생성 시) */
export interface ReflectionStreamChunk {
  type: 'content' | 'done' | 'error'
  content?: string
  error?: string
}
