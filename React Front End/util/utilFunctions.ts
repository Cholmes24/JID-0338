export function addItems<T extends {id: number}>(original: T[], payload: T[]) {
    const existingIds = original.map(t => t.id)
    const toAdd = payload.filter(t => !existingIds.includes(t.id))
    const toUpdate = payload.filter(t => existingIds.includes(t.id))
    const updated = original.map(f => (toUpdate.find(updated => updated.id === f.id) || f))
    return updated.concat(toAdd)
  }