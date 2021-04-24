import { Match, Pool, RootType, SystemEvent, Tournament } from './../redux-types/storeTypes'
import _ from 'lodash'

function addItemsWithOptionalCustomizer<T extends { ID: number }>(
  original: T[],
  payload: T[],
  customizer?: (oldValue: any, newValue: any, key: string, oldObject: any, newObject: any) => any,
  template?: T
) {
  const byID = (t: T) => t.ID
  const existingIDs = original.map(byID)

  const [payloadUpdate, payloadAdd] = _.partition(payload, (t) => existingIDs.includes(t.ID))
  const updateIDs = payloadUpdate.map(byID)
  const [toAlter, unalteredElements] = _.partition(original, (t) => updateIDs.includes(t.ID))

  const sortedToAlter = _.sortBy(toAlter, byID)
  const sortedUpdates = _.sortBy(payloadUpdate, byID)
  const updatedElements = customizer
    ? _.mergeWith(sortedToAlter, sortedUpdates, (oldObj: T, newObj: T) =>
        _.mergeWith(oldObj, newObj, customizer)
      )
    : _.merge(sortedToAlter, sortedUpdates)
  const newElements = template ? payloadAdd.map((t) => _.merge(t, template)) : payloadAdd
  return _.union(unalteredElements, updatedElements, newElements)
}

export function addItems<T extends { ID: number }>(original: T[], payload: T[], template?: T) {
  return addItemsWithOptionalCustomizer(original, payload, undefined, template)
}

export function addItemsWithMergeCustomizer<T extends { ID: number }>(
  original: T[],
  payload: T[],
  customizer: (oldValue: any, newValue: any, key: string, oldObject: any, newObject: any) => any,
  template?: T
) {
  return addItemsWithOptionalCustomizer(original, payload, customizer, template)
}

export function isValidDecimal(input: string): boolean {
  return RegExp(/\d*((\.d+)|(\d\.?))/).test(input)
}

export function formatClock(ms: number) {
  const points = Math.floor(ms / 100) % 10
  const seconds = Math.floor(ms / 1000) % 60
  const minutes = Math.floor(ms / (1000 * 60)) % 60

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${points}`
}

type ValidParentKey = 'poolID' | 'tournamentID' | 'systemEventID'

export function checkForParentKeyName<T extends SystemEvent | Tournament | Pool | Match>(
  item: T,
  pKey: ValidParentKey
): item is T & Record<ValidParentKey, number> {
  return item.hasOwnProperty(pKey)
}

export function getParentKeyName(key: keyof RootType) {
  switch (key) {
    case 'matches':
      return 'poolID'
    case 'pools':
      return 'tournamentID'
    case 'tournaments':
      return 'systemEventID'
    default:
      return undefined
  }
}
