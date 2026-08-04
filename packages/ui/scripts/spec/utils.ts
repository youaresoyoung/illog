/**
 * 스펙/토큰에 대한 지식이 전혀 없는 순수 헬퍼만 둔다.
 * 무언가를 알아야 동작하는 함수(토큰, 스키마, 파일 구조)는 여기가 아니라 해당 도메인 모듈로 간다.
 */

// TODO: build-css-themes 와 나중에 util 공유해서 사용하도록 개선필요
export function toKebab(raw: unknown) {
  const str = String(raw)
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // camelCase -> kebab
    .replace(/[_\s]+/g, '-') // underscores/spaces -> hyphen
    .replace(/[^a-zA-Z0-9-]/g, '-') // sanitize any other chars
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/(^-|-$)/g, '') // trim leading/trailing hyphen
    .toLowerCase()
}

/** getIn(theme, ["color", "background", "brand", "default"]) */
export function getIn(obj: unknown, keys: string[]): unknown {
  return keys.reduce<unknown>(
    (acc, key) =>
      acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined,
    obj
  )
}

export function quote(value: string) {
  return `'${value}'`
}

export function formatDefault(value: string | boolean | number) {
  return typeof value === 'string' ? quote(value) : String(value)
}
