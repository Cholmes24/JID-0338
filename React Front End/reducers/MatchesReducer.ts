import { AnyAction } from "redux"
import { MatchesAction } from "../redux-types/actionTypes"
import { Match } from "../redux-types/storeTypes"
import matchReducer from "./MatchReducerNew"

export function matchesReducer(state: Match[], action: MatchesAction) {
  switch (action.type) {
    case "MATCHES":
      return state.map((match) => {
        if (match.id === action.matchId) {
          return matchReducer(match, action.matchAction)
        } else {
          return match
        }
      })
    default:
      return state
  }
}