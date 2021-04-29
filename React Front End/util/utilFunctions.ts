import { Match, Pool, RootType, SystemEvent, Tournament } from './../redux-types/storeTypes'
import _ from 'lodash'
import { Address4 } from 'ip-address'
import NetInfo from '@react-native-community/netinfo'

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
  return RegExp(/^\d*((\.\d+)|(\d\.?))$/).test(input)
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

function singleToAlphanum(num: number) {
  return String.fromCharCode(num + (num <= 9 ? 48 : 55))
}

function toAlphanumeric(num: number) {
  const modSpace = 36
  const firstDiv = Math.trunc(num / modSpace)
  const firstMod = num % modSpace

  const secondDiv = Math.trunc(firstDiv / modSpace)
  const secondMod = firstDiv % modSpace

  const thirdDiv = Math.trunc(secondDiv / modSpace)
  const thirdMod = secondDiv % modSpace

  const fourthDiv = Math.trunc(thirdDiv / modSpace)
  const fourthMod = thirdDiv % modSpace

  const fifthDiv = Math.trunc(fourthDiv / modSpace)
  const fifthMod = fourthDiv % modSpace
  if (fifthDiv < 0 || fifthDiv > 35) {
    throw new Error('Invalid IP Address')
  }

  return [fifthMod, fourthMod, thirdMod, secondMod, firstMod].map(singleToAlphanum).join('')
}

function singleAlphanumToNum(char: string) {
  const code = char.charCodeAt(0)
  return code >= 65 ? code - 55 : code - 48
}

export const conversion = {
  toAlphanumeric,
  singleToAlphanum,
  singleAlphanumToNum,
}

export function convertIPAddress(IP: string) {
  const cleaned = IP.toLocaleLowerCase().trim()
  if (cleaned.length < 7) {
    return ''
  }

  const prefix = cleaned.substring(0, 7)
  const withPrefix = prefix === 'http://' ? cleaned : 'http://' + cleaned
  const portCheck = withPrefix.split(':')
  const postfix = portCheck.length == 3 ? portCheck[2] : '5000'
  const affixed = `${portCheck[0]}:${portCheck[1]}:${postfix}`
  const withTrailingSlash = affixed.charAt(affixed.length - 1) === '/' ? affixed : affixed + '/'
  return withTrailingSlash
}

export async function determineIP(accessCode: string) {
  const res = await NetInfo.fetch()
  if (accessCode.length < 5) {
    return 'code too short'
  }
  if (res.type !== 'wifi' || !res.details) {
    return 'no wifi access'
  }
  const ownPrefix = res.details.ipAddress?.split('.')[0]
  // return ownPrefix
  if (!ownPrefix) {
    return 'could not parse ip'
  }
  const ownValue = parseInt(ownPrefix) * 2 ** 24

  const toParse = accessCode.substring(0, 5).split('').map(singleAlphanumToNum)

  const sentSum = _.sum(toParse.map((num, index) => num * 36 ** (4 - index)))
  const fullSum = sentSum + ownValue
  const address = Address4.fromInteger(fullSum)
  return address.correctForm()
}

export function ipFromUrl(url: string) {
  const withoutHttp = url.split('://')[1]
  const ip = withoutHttp.split(':')[0]
  return ip
}
