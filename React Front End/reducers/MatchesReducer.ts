import { AnyAction, Reducer } from "redux"
import { Match } from "../redux-types/storeTypes"
import matchReducer from "./MatchReducer"
import defaultData from '../defaultData'
import { MatchesAction } from "../redux-types/actionTypes"

function isMatchesActionType(action: AnyAction): action is MatchesAction {
  if (action.type !== "MATCHES") {
    return false
  }
  const a = action as MatchesAction
  return a.type === "MATCHES" && a.matchAction !== undefined && a.matchId !== undefined
}

const matchesReducer: Reducer<Match[], AnyAction> = (state: Match[] = defaultData.matches, action: AnyAction) => {
  if (isMatchesActionType(action)) {
    return forwardMatchesAction(state, action)
  } else {
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

