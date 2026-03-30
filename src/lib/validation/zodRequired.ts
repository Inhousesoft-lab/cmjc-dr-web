import type { ZodTypeAny } from "zod";
import { z } from "zod";

function unwrap(schema: ZodTypeAny): ZodTypeAny {
  let current: ZodTypeAny = schema;

  while (true) {
    // Zod v4 exposes wrapper information on `def.type`, while the wrapped schema
    // may sit under different keys depending on the wrapper.
    const def = (current as ZodTypeAny & { def?: { type?: string } }).def;
    const type = def?.type;
    const wrapped =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (def as any)?.innerType ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (def as any)?.schema ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (def as any)?.type ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (def as any)?.out;

    if (
      !wrapped ||
      !type ||
      ![
        "optional",
        "default",
        "prefault",
        "nullable",
        "nonoptional",
        "catch",
        "readonly",
        "pipe",
      ].includes(type)
    ) {
      return current;
    }

    current = wrapped as ZodTypeAny;
  }
}

export function getZodFieldSchema(schema: ZodTypeAny, path: string): ZodTypeAny | null {
  const parts = path.split(".").filter(Boolean);
  let current: ZodTypeAny = schema;

  for (const key of parts) {
    const base = unwrap(current);
    if (!(base instanceof z.ZodObject)) return null;
    const shape = base.shape;
    const next = shape?.[key];
    if (!next) return null;
    current = next;
  }

  return current;
}

export function isZodFieldRequired(schema: ZodTypeAny | null | undefined, path: string): boolean {
  if (!schema) return false;

  const field = getZodFieldSchema(schema, path);
  if (!field) return false;

  if (field.safeParse(undefined).success) return false;

  return true;
}
