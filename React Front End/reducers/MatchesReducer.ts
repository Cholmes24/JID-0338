import { AnyAction, Reducer } from "redux"
import { MatchesAction } from "../redux-types/actionTypes"
import { Match } from "../redux-types/storeTypes"
import matchReducer, { defaultMatch } from "./MatchReducer"

const matchesReducer: Reducer<Match[], AnyAction> = (state: Match[] = [defaultMatch], action: AnyAction) => {
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

export default matchesReducer