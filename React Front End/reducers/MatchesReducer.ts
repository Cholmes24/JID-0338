import { AnyAction, Reducer } from "redux"
import { Match } from "../redux-types/storeTypes"
import matchReducer from "./MatchReducer"
import defaultData from '../defaultData'
import { AddMatchesAction, MatchesAction } from "../redux-types/actionTypes"
import { addItems } from "../util/utilFunctions"

function isMatchesActionType(action: AnyAction): action is MatchesAction {
  if (action.type !== "MATCHES") {
    return false
  }
  const a = action as MatchesAction
  return a.type === "MATCHES" && a.matchAction !== undefined && a.matchId !== undefined
}

const matchesReducer: Reducer<Match[], AnyAction> = (state = defaultData.matches, action) => {
  switch (action.type) {
    case "MATCHES":
      if (isMatchesActionType(action)) {
        return forwardMatchesAction(state, action)
      } else {
        return state
      }
    case "SET_MATCHES":
      return action.payload
    case "ADD_MATCHES":
      return addItems(state, (action as AddMatchesAction).payload)
    default:
      return state
  }
}

export default matchesReducer

function forwardMatchesAction(state: Match[], action: MatchesAction): Match[] {
  return state.map((match) => {
    if (match.id === action.matchId) {
      return matchReducer(match, action.matchAction)
    } else {
      return match
    }
  })
}