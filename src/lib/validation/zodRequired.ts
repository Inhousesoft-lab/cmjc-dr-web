import type { ZodTypeAny } from 'zod'
import { z } from 'zod'

function unwrap(t: ZodTypeAny): ZodTypeAny {
  // Unwrap common wrappers so we can inspect the underlying schema.
  // Order matters: optional/default first because they affect "required".
  // Effects/preprocess/refine are unwrapped to their inner types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyT: any = t

  if (t instanceof z.ZodOptional) return unwrap(t.unwrap())
  if (t instanceof z.ZodDefault) return unwrap(t.removeDefault())
  if (t instanceof z.ZodEffects) return unwrap(anyT._def.schema)
  if (t instanceof z.ZodNullable) return unwrap(t.unwrap())
  if (t instanceof z.ZodBranded) return unwrap(anyT._def.type)
  if (t instanceof z.ZodCatch) return unwrap(anyT._def.innerType)

  return t
}

export function getZodFieldSchema(schema: ZodTypeAny, path: string): ZodTypeAny | null {
  const parts = path.split('.').filter(Boolean)
  let cur: ZodTypeAny = schema

  for (const key of parts) {
    const base = unwrap(cur)
    if (!(base instanceof z.ZodObject)) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shape: Record<string, ZodTypeAny> = (base as any).shape
    const next = shape?.[key]
    if (!next) return null
    cur = next
  }
  return cur
}

export function isZodFieldRequired(schema: ZodTypeAny | null | undefined, path: string): boolean {
  if (!schema) return false
  const field = getZodFieldSchema(schema, path)
  if (!field) return false

  // Zod has convenient helpers.
  // optional/default => not required
  // nullable => still required unless optional, but nullable is handled by isOptional().
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyF: any = field
  if (typeof anyF.isOptional === 'function' && anyF.isOptional()) return false
  if (typeof anyF.isDefault === 'function' && anyF.isDefault()) return false

  return true
}
