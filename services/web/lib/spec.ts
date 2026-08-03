import { ComponentSpec } from './types'
import specJson from '@illog/ui/spec.json'

const components = specJson.components as Record<string, ComponentSpec>

/**
 * 문서에서 <PropsTable component="button" /> 처럼 참조할 때 사용
 * 없는 id 는 빌드를 실패시킨다 - 오타 배포 방지
 */
export function getComponentSpec(id: string): ComponentSpec {
  const spec = components[id]

  if (!spec) {
    throw new Error(
      `spec.json 에 '${id}'가 없습니다. @illog/ui/spec/${id}.yaml 을 만들고 spec:generate 를 실행하세요.`
    )
  }

  return spec
}
