/**
 * Tag API DTO (Data Transfer Object)
 * API 경계에서 사용되는 Request/Response 타입
 */

import type { TagColor } from './common'
import type { Tag } from './entities'

// ============================================
// Request DTOs (Client → Server)
// ============================================

/** 태그 생성 요청 */
export interface CreateTagRequest {
  name: string
  color?: TagColor // 기본값: 'gray'
}

/** 태그 수정 요청 */
export interface UpdateTagRequest {
  name?: string
  color?: TagColor
}

// ============================================
// Response DTOs (Server → Client)
// ============================================

/** 단일 태그 응답 */
export type TagResponse = Tag

/** 태그 목록 응답 */
export type TagListResponse = Tag[]

// ============================================
// Legacy Compatibility
// ============================================

/** @deprecated Use CreateTagRequest instead */
export type CreateTagParams = CreateTagRequest

/** @deprecated Use UpdateTagRequest instead */
export type UpdateTagParams = UpdateTagRequest
