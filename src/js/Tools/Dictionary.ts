export function update<T extends Record<string, any>>(object: T, key: string, value: unknown): T {
  const keys = key.split('.')

  const deepClone = <U>(obj: U): U => {
    if (obj === null || typeof obj !== 'object') return obj
    if (Array.isArray(obj)) return obj.map(deepClone) as unknown as U
    const cloned = {} as U
    for (const k of Object.keys(obj)) {
      ;(cloned as any)[k] = deepClone((obj as any)[k])
    }
    return cloned
  }

  const copy = deepClone(object)
  let iter: any = copy

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    if (i === keys.length - 1) {
      iter[k] = value
    } else {
      if (!(k in iter) || iter[k] === null || typeof iter[k] !== 'object') {
        iter[k] = {}
      }
      iter = iter[k]
    }
  }

  return copy
}

export function query<T = unknown>(object: any, key: string): T | undefined {
  if (object == null || object === undefined) return undefined
  const path = key.split('.')
  let current: any = object
  for (let i = 0; i < path.length; i++) {
    if (current == null || current === undefined) return undefined
    current = current[path[i]]
  }
  return current as T
}
