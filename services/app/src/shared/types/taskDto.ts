/**
 * Task API DTO (Data Transfer Object)
 * API 경계에서 사용되는 Request/Response 타입
 */

import type { TaskStatus } from './common'
import type { Task, TaskWithTags } from './entities'

// ============================================
// Request DTOs (Client → Server)
// ============================================

/** 태스크 생성 - 빈 태스크 생성 (파라미터 없음) */
export type CreateTaskRequest = void

/** 태스크 수정 가능 필드 */
export interface UpdateTaskRequest {
  title?: string
  description?: string | null
  status?: TaskStatus
  projectId?: string | null
  startTime?: Date | string | null // Date 객체 또는 ISO string
  endTime?: Date | string | null
}

/** 태스크 목록 필터 */
export interface TaskFilterParams {
  status?: TaskStatus
  projectId?: string
  startTime?: string // ISO date string (범위 시작)
  endTime?: string // ISO date string (범위 끝)
  search?: string // title/description 검색
}

// ============================================
// Response DTOs (Server → Client)
// ============================================

/** 단일 태스크 응답 */
export type TaskResponse = Task

/** 태스크 + 태그 응답 */
export type TaskWithTagsResponse = TaskWithTags

/** 태스크 목록 응답 */
export type TaskListResponse = TaskWithTags[]

// ============================================
// Legacy Compatibility (점진적 마이그레이션용)
// ============================================

/** @deprecated Use UpdateTaskRequest instead */
export type UpdateTaskParams = UpdateTaskRequest

/** @deprecated Use TaskFilterParams instead */
export type TaskFilters = TaskFilterParams
