import { SetMatchesAction, MatchActionType } from './../redux-types/actionTypes'
import { Timer } from './../redux-types/storeTypes'
import { AnyAction, Reducer } from "redux"
import { Match } from "../redux-types/storeTypes"
import matchReducer from "./MatchReducer"
import { AddMatchesAction, MatchesAction } from "../redux-types/actionTypes"
import {ADD_MATCHES, MATCHES, SET_MATCHES } from "../redux-types/actionTypes"
import { addItemsWithMergeCustomizer } from "../util/utilFunctions"

function isMatchesActionType(action: AnyAction): action is MatchesAction {
  if (action.type !== MATCHES) {
    return false
  }
  const a = action as MatchesAction
  return a.type === MATCHES && a.matchAction !== undefined && a.matchID !== undefined
}

const matchesReducer: Reducer<Match[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    case MATCHES:
      if (isMatchesActionType(action)) {
        return forwardMatchesAction(state, action)
      } else {
        return state
      }
    case SET_MATCHES:
      return action.payload
    case ADD_MATCHES:
      return addItemsWithMergeCustomizer(state, (action as AddMatchesAction).payload,
        timerMergeCustomizer, matchTemplate as Match)
    default:
      return state
  }
}

export default matchesReducer

function forwardMatchesAction(state: Match[], action: MatchesAction): Match[] {
  return state.map((match) => {
    if (match.ID === action.matchID) {
      return matchReducer(match, action.matchAction)
    } else {
      return match
    }
  })
}

const matchTemplate: unknown = {
  past: [],
  future: [],
  timer: {
    maxTime: 90000,
    timeRemaining: undefined,
    timeRemainingAtLastStop: 0,
    timeOfLastStart: 0,
    isRunning: false
  }
}

function isTimer(t: any): t is Timer {
  return typeof t === 'object'
    && t !== null
    && 'timeRemaining' in t
    && typeof t["timeRemaining"] === 'number'
}

function timerMergeCustomizer (objVal: any, dbVal: any): Timer | undefined {
  if (isTimer(objVal) && isTimer(dbVal)) {
    const storedTime = objVal.timeRemaining
    const dbTime = dbVal.timeRemaining
    if (Math.abs(storedTime - dbTime) > 1000) {
      return {
        ...objVal,
        timeRemaining: dbTime,
        timeRemainingAtLastStop: objVal.isRunning ? objVal.timeRemainingAtLastStop : dbTime,
      }
    } else {
      return objVal
    }
  }
}

export const matches: (matchAction: MatchActionType, matchID: number) => MatchesAction = (
  matchAction,
  matchID
) => ({
  type: MATCHES,
  matchAction,
  matchID
})

export const setMatches: (matches: Match[]) => SetMatchesAction = matches => ({
  type: SET_MATCHES,
  payload: matches
})

export const addMatches: (matches: Match[]) => AddMatchesAction = matches => ({
  type: ADD_MATCHES,
  payload: matches
})