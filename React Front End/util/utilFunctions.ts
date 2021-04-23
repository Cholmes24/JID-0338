import _ from 'lodash'

// export function addItems<T extends {ID: number}>(original: T[], payload: T[], template?: T) {
//   const existingIDs = original.map(t => t.ID)
//   const [ toUpdate, toAdd ] = _.partition(payload, t => existingIDs.includes(t.ID))

//   // For types with fields not used in the database, an optional template can be
//   // passed in for filling in default values. lodash's deep merge will
//   // overwrite them if the db provides non-null, defined values
//   const formattedNewElements = template ? toAdd.map(t => _.merge(t, template)) : toAdd
//   return _.unionBy(toUpdate, original, formattedNewElements, t => t.ID)
// }


export function addItems<T extends {ID: number}>(original: T[], payload: T[], template?: T) {

  const byID = (t: T) => t.ID
  const existingIDs = original.map(byID)

  const [ payloadUpdate, payloadAdd ] = _.partition(payload, t => existingIDs.includes(t.ID))
  const updateIDs = payloadUpdate.map(byID)
  const [ toAlter, unalteredElements ] = _.partition(original, t => updateIDs.includes(t.ID))

  const sortedToAlter = _.sortBy(toAlter, byID)
  const sortedUpdates = _.sortBy(payloadUpdate, byID)

  const updatedElements = _.merge(sortedToAlter, sortedUpdates)

  // For types with fields not used in the database, an optional template can be
  // passed in for filling in default values. lodash's deep merge will
  // overwrite them if the db provides non-null, defined values
  const newElements = template ? payloadAdd.map(t => _.merge(t, template)) : payloadAdd
  return _.union(unalteredElements, updatedElements, newElements)
}

export function addItemsWithMergeCustomizer<T extends {ID: number}>(
  original: T[],
  payload: T[],
  customizer: (oldValue: any, newValue: any, key: string, oldObject: any, newObject: any) => any,
  template?: T,
) {
  const byID = (t: T) => t.ID
  const existingIDs = original.map(byID)

  const [ payloadUpdate, payloadAdd ] = _.partition(payload, t => existingIDs.includes(t.ID))
  const updateIDs = payloadUpdate.map(byID)
  const [ toAlter, unalteredElements ] = _.partition(original, t => updateIDs.includes(t.ID))

  const sortedToAlter = _.sortBy(toAlter, byID)
  const sortedUpdates = _.sortBy(payloadUpdate, byID)
  const nestCustomizer = (oldObj: T, newObj: T) => _.mergeWith(oldObj, newObj, customizer)

  const updatedElements = _.mergeWith(sortedToAlter, sortedUpdates, nestCustomizer)
  const newElements = template ? payloadAdd.map(t => _.merge(t, template)) : payloadAdd

  return _.union(unalteredElements, updatedElements, newElements)
}

export function isValidDecimal(input: string): boolean{
  return RegExp(/\d*((\.d+)|(\d\.?))/).test(input)
}

export function formatClock(ms: number) {
  const points = Math.floor(ms / 100) % 10
  const seconds = Math.floor((ms / 1000)) % 60
  const minutes = Math.floor(ms / (1000 * 60)) % 60

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}.${points}`
}
