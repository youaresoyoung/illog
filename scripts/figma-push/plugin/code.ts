/// <reference types="@figma/plugin-typings" />

/**
 * illog Tokens Sync — Figma plugin entry.
 *
 * Reads a DTCG JSON payload from the UI and upserts the matching variables
 * inside a Figma Variables collection named "illog". Single-mode for now;
 * multi-mode (light/dark) is a follow-up.
 */

type DtcgValueObj = { value: number; unit?: string }
type DtcgToken = {
  $type: 'color' | 'dimension' | 'fontWeight' | 'fontFamily' | 'duration' | 'number'
  $value: string | number | DtcgValueObj
  $description?: string
}
type DtcgGroup = { [key: string]: DtcgToken | DtcgGroup | string }

const COLLECTION_NAME = 'illog'

figma.showUI(__html__, { width: 360, height: 360 })

figma.ui.onmessage = async (msg: { type: string; payload?: DtcgGroup }) => {
  if (msg.type !== 'sync' || !msg.payload) return
  try {
    const summary = await sync(msg.payload)
    figma.ui.postMessage({ type: 'log', text: summary })
    figma.ui.postMessage({ type: 'done' })
    figma.notify('Tokens synced.')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    figma.ui.postMessage({ type: 'log', text: `Error: ${message}` })
    figma.ui.postMessage({ type: 'done' })
    figma.notify('Token sync failed — see plugin window for details.', { error: true })
  }
}

async function sync(payload: DtcgGroup): Promise<string> {
  const collection = await getOrCreateCollection(COLLECTION_NAME)
  const modeId = collection.modes[0].modeId

  const existing = await figma.variables.getLocalVariablesAsync()
  const existingByName = new Map<string, Variable>()
  for (const v of existing) {
    if (v.variableCollectionId === collection.id) existingByName.set(v.name, v)
  }

  let upserts = 0
  let skips = 0

  function visit(node: DtcgGroup, prefix: string[]) {
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string') continue // $description and similar metadata
      if (!value || typeof value !== 'object') continue

      if ('$type' in value && '$value' in value) {
        const token = value as DtcgToken
        const name = [...prefix, key].join('/')
        const resolvedType = mapType(token.$type)
        if (!resolvedType) {
          skips++
          continue
        }
        const figmaValue = mapValue(token, resolvedType)
        if (figmaValue === undefined) {
          skips++
          continue
        }
        let variable = existingByName.get(name)
        if (!variable) {
          variable = figma.variables.createVariable(name, collection, resolvedType)
          existingByName.set(name, variable)
        }
        variable.setValueForMode(modeId, figmaValue)
        upserts++
      } else {
        visit(value as DtcgGroup, [...prefix, key])
      }
    }
  }

  visit(payload, [])

  return `Synced ${upserts} variable(s) into "${COLLECTION_NAME}". Skipped ${skips} unsupported token(s).`
}

async function getOrCreateCollection(name: string): Promise<VariableCollection> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const existing = collections.find((c) => c.name === name)
  if (existing) return existing
  return figma.variables.createVariableCollection(name)
}

function mapType(t: DtcgToken['$type']): VariableResolvedDataType | undefined {
  switch (t) {
    case 'color':
      return 'COLOR'
    case 'dimension':
    case 'number':
    case 'fontWeight':
    case 'duration':
      return 'FLOAT'
    case 'fontFamily':
      return 'STRING'
    default:
      return undefined
  }
}

function mapValue(
  token: DtcgToken,
  resolvedType: VariableResolvedDataType
): VariableValue | undefined {
  if (resolvedType === 'COLOR') return parseColor(String(token.$value))
  if (resolvedType === 'FLOAT') {
    if (typeof token.$value === 'number') return token.$value
    if (typeof token.$value === 'object' && token.$value !== null && 'value' in token.$value) {
      return (token.$value as DtcgValueObj).value
    }
    const n = Number(token.$value)
    return Number.isNaN(n) ? undefined : n
  }
  if (resolvedType === 'STRING') return String(token.$value)
  return undefined
}

function parseColor(input: string): RGBA | undefined {
  const hex = input.trim().toLowerCase()
  // #rrggbb / #rrggbbaa
  const longMatch = hex.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/)
  if (longMatch) {
    const rgb = longMatch[1]
    const a = longMatch[2] ? parseInt(longMatch[2], 16) / 255 : 1
    return {
      r: parseInt(rgb.slice(0, 2), 16) / 255,
      g: parseInt(rgb.slice(2, 4), 16) / 255,
      b: parseInt(rgb.slice(4, 6), 16) / 255,
      a
    }
  }
  // #rgb shorthand
  const shortMatch = hex.match(/^#([0-9a-f]{3})$/)
  if (shortMatch) {
    const v = shortMatch[1]
    return {
      r: parseInt(v[0] + v[0], 16) / 255,
      g: parseInt(v[1] + v[1], 16) / 255,
      b: parseInt(v[2] + v[2], 16) / 255,
      a: 1
    }
  }
  // rgb(a)
  const rgbMatch = hex.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\)$/)
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]) / 255,
      g: Number(rgbMatch[2]) / 255,
      b: Number(rgbMatch[3]) / 255,
      a: rgbMatch[4] !== undefined ? Number(rgbMatch[4]) : 1
    }
  }
  return undefined
}
