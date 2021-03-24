import { MatchScoringAction, MatchTimingAction } from './../redux-types/actionTypes';
import { MatchActionType, MatchRedoAction, MatchUndoAction } from "../redux-types/actionTypes"
import { Match, MatchScore } from "../redux-types/storeTypes"
import timerReducer from './features/TimerSlice'
import scoringReducer from './features/ScoringSlice'


export default function matchReducer(state: Match, action: MatchActionType): Match {
  switch (action.type) {
    case "MATCH_TIMING":
      return matchTiming(state, action)
    case "MATCH_SCORING":
      return matchScoring(state, action)
    case "MATCH_UNDO":
      return matchUndo(state, action)
    case "MATCH_REDO":
      return matchRedo(state, action)
    default:
      return state
  }
}

function matchTiming(state: Match, action: MatchTimingAction): Match {
  return {
    ...state,
    timer: timerReducer(state.timer, action.payload.timingAction)
  }
}

function matchScoring(state: Match, action: MatchScoringAction): Match {
  const cleanReducer = (fighterInState: "fighter1Scoring" | "fighter2Scoring") => (
    action.payload.fighter === fighterInState
      ? scoringReducer(state.present[fighterInState], action.payload.scoringAction)
      : state.present[fighterInState]
  )
  return {
    ...state,
    past: state.past.concat(state.present),
    present: {
      fighter1Scoring: cleanReducer("fighter1Scoring"),
      fighter2Scoring: cleanReducer("fighter2Scoring")
    },
    future: []
  }
}

function matchUndo(state: Match, action: MatchUndoAction): Match {
  if (state.past.length === 0) {
    return state
  } else {
    return {
      ...state,
      past: state.past.slice(0, state.past.length - 1),
      present: state.past[state.past.length],
      future: [state.present, ...state.future]
    }
  }
}

function matchRedo(state: Match, action: MatchRedoAction): Match {
  if (state.future.length === 0) {
    return state
  } else {
    return {
      ...state,
      past: [...state.past, state.present],
      present: state.future[0],
      future: state.future.slice(1, state.future.length)
    }
  }
}