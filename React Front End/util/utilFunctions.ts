import _ from 'lodash'

export function addItems<T extends {ID: number}>(original: T[], payload: T[], template?: T) {
  const existingIDs = original.map(t => t.ID)
  const toAdd = payload.filter(t => !existingIDs.includes(t.ID))
  const toUpdate = payload.filter(t => existingIDs.includes(t.ID))
  const updated = original.map(f => _.merge(f, toUpdate.find(updated => updated.ID === f.ID)))

  // For types with fields not used in the database, an optional template can be
  // passed in for filling in default values. lodash's deep merge will
  // overwrite them if the db provides non-null, defined values
  const added = template ? toAdd.map(t => _.merge(template, t)) : toAdd
  return updated.concat(added)
}