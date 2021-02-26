import { LongtermCompetitorActionTypes, TimeStamp, CompetitorActionTypes, INCREASE_SCORE, DECREASE_SCORE, ISSUE_WARNING, ISSUE_PENALTY, UNDO_CALL } from "../../store/types"

export default function callLogReducer(state:(LongtermCompetitorActionTypes & TimeStamp)[] = [], action: CompetitorActionTypes) {
  switch (action.type) {
    case INCREASE_SCORE: {
      return state.concat(action)
    } case DECREASE_SCORE: {
      return state.concat(action)
    } case ISSUE_WARNING: {
      return state.concat(action)
    } case ISSUE_PENALTY: {
      return state.concat(action)
    } case UNDO_CALL: {
      if (state.length > 0) {
        return state.slice(0, state.length - 1)
      } else {
        return state
      }
    } default: {
      return state
    }
  }
}