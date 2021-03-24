import { MatchState, CompetitorActionTypes } from './../store/types';
import { AnyAction, Reducer } from 'redux'
import callLogReducer from './features/CallLogSlice'
import competitorsReducer from './features/CompetitorsSlice'
import { defaultMatchState } from './MatchReducer'

const rootCompetitorReducer: Reducer<MatchState, AnyAction> = (state = defaultMatchState, action: AnyAction) => {
  if (isCompetitorAction(action)) {
    return {
      ...state,
      competitors: competitorsReducer(state.competitors, action),
      callLog: callLogReducer(state.callLog, action)
    }
  } else {
    return state
  }
}

function isCompetitorAction(action: AnyAction | CompetitorActionTypes): action is CompetitorActionTypes {
  const a = action as CompetitorActionTypes
  switch (a.type) {
    case "INCREASE_SCORE":
      return true
    case "DECREASE_SCORE":
      return true
    case "ISSUE_WARNING":
      return true
    case "ISSUE_PENALTY":
      return true
    case "UNDO_CALL":
      return true
    default:
      return false
  }
}

export default rootCompetitorReducer
