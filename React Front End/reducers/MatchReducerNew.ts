import { MatchScoringAction, MatchTimingAction } from './../redux-types/actionTypes';
import { MatchActionType, MatchRedoAction, MatchUndoAction } from "../redux-types/actionTypes"
import { Match, MatchScore, Scoring, Timer } from "../redux-types/storeTypes"
import timerReducer from './features/TimerSlice'
import scoringReducer from './features/ScoringSlice'
import { AnyAction, Reducer } from 'redux'

const defaultScoring: Scoring = {
  points: 0,
  numWarnings: 0,
  numPenalties: 0,
}

const defaultTimer: Timer = {
  maxTime: 180000,
  timeRemaining: 180000,
  timeRemainingAtLastStop: 180000,
  timeOfLastStart: 0,
  isRunning: false
}

export const defaultMatch: Match = {
  id: 0,
  poolId: 0,
  tournamentId: 0,
  fighter1Id: 1,
  fighter2Id: 2,
  ringNumber: 0,
  past: [],
  present: {
    fighter1Scoring: defaultScoring,
    fighter2Scoring: defaultScoring,
  },
  future: [],
  timer: defaultTimer
}

const matchReducer: Reducer<Match, AnyAction> = (state: Match = defaultMatch, action: MatchActionType) => {
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
export default matchReducer

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