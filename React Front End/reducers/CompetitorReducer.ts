import { CompetitorActionTypes } from '../store/types';
import callLogReducer from './features/CallLogSlice'
import competitorsReducer from './features/CompetitorsSlice'
import { defaultMatchState } from './MatchReducer'

export default function rootCompetitorReducer(state = defaultMatchState, action: CompetitorActionTypes) {
  return {
    ...state,
    competitors: competitorsReducer(state.competitors, action),
    callLog: callLogReducer(state.callLog, action)
  }
}
