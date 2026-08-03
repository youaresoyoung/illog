// ─────────────────────────────────────────────────────────────
// 입력: spec/*.yaml 의 형태. spec/_schema/component.schema.json 과 짝을 이룬다.
// 스키마와 이름이 어긋나도 optional 필드는 컴파일러가 못 잡으니, 여기를 고칠 땐 스키마도 같이 본다.
// TODO: 스키마를 TS 타입으로 변환하는 도구를 만들어서, 스키마를 수정하면 타입도 자동 갱신되게 한다.
// ─────────────────────────────────────────────────────────────

export type SpecValue = string | { raw: string | number; reason: string }

/** 컴포넌트 내부 영역. yaml 의 `elements.<name>` */
export type ElementDef = {
  /** 렌더되는 HTML 태그 */
  tag?: string
  description?: string
}

export type VariantDef = {
  type: 'enum' | 'boolean'
  values?: string[]
  default?: string | boolean
  required?: boolean
  description?: string
}

export type PropDef = {
  type: string
  default?: string | boolean | number
  required?: boolean
  description?: string
}

/** property -> value */
export type ElementStyles = Record<string, SpecValue>
/** element -> property -> value */
export type StateStyles = Record<string, ElementStyles>
/** state -> element -> property -> value */
export type SelectorStyles = Record<string, StateStyles>
/** selector -> state -> element -> property -> value */
export type Definitions = Record<string, SelectorStyles>

export type ComponentSpec = {
  id: string
  name: string
  description?: string
  status: { figma: string; react: string }
  elements?: Record<string, ElementDef>
  variants?: Record<string, VariantDef>
  states?: string[]
  definitions?: Definitions
  props: Record<string, PropDef>
  extends?: string
}

// ─────────────────────────────────────────────────────────────
// 출력: 로딩 결과와 문서 표의 행
// ─────────────────────────────────────────────────────────────

export type ResolvedToken = {
  /** 문서 표에 그대로 노출할 값 */
  display: string
  /** 색상일 때만: @illog/ui 에서 쓰는 camelCase 키 (예: textBrandOnBrand) */
  colorKey?: string
}

export type Issue = { level: 'error' | 'warn'; file: string; message: string }

export type LoadResult = { specs: ComponentSpec[]; issues: Issue[] }

export type PropRow = {
  name: string
  type: string
  default: string | null
  required: boolean
  description: string
}

export type SpecRow = {
  selector: string
  state: string
  element: string
  property: string
  /** 토큰 참조 문자열. 토큰 밖 값이면 null */
  token: string | null
  value: string
  reason?: string
}
