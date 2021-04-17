import _ from 'lodash'

export function addItems<T extends {id: number}>(original: T[], payload: T[], template?: T) {
  const existingIds = original.map(t => t.id)
  const toAdd = payload.filter(t => !existingIds.includes(t.id))
  const toUpdate = payload.filter(t => existingIds.includes(t.id))
  const updated = original.map(f => _.merge(f, toUpdate.find(updated => updated.id === f.id)))

  // For types with fields not used in the database, an optional template can be
  // passed in for filling in default values. lodash's deep merge will
  // overwrite them if the db provides non-null, defined values
  if (template) {
    const added = toAdd.map(t => _.merge(template, t))
  }
  return updated.concat(toAdd)
}