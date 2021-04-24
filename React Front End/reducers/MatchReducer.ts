import { Match, MatchScore } from '../redux-types/storeTypes'
import timerReducer from './features/TimerSlice'
import scoringReducer from './features/ScoringSlice'
import {
  MATCH_SCORING,
  MatchScoringAction,
  ScoringActionType,
  MATCH_TIMING,
  MatchTimingAction,
  TimerActionType,
  MATCH_UNDO,
  MatchUndoAction,
  MATCH_REDO,
  MatchRedoAction,
  MatchActionType,
} from '../redux-types/actionTypes'

export default function matchReducer(state: Match, action: MatchActionType) {
  switch (action.type) {
    case MATCH_TIMING:
      return determineMatchTiming(state, action)
    case MATCH_SCORING:
      return determineMatchScoring(state, action)
    case MATCH_UNDO:
      return matchUndo(state, action)
    case MATCH_REDO:
      return matchRedo(state, action)
    default:
      return state
  }
}

function determineMatchTiming(state: Match, action: MatchTimingAction): Match {
  return {
    ...state,
    timer: timerReducer(state.timer, action.payload.timingAction),
  }
}

function determineMatchScoring(state: Match, action: MatchScoringAction): Match {
  const cleanReducer = (fighterInState: FighterScoringKey) =>
    action.payload.fighter === fighterInState
      ? scoringReducer(state.present[fighterInState], action.payload.scoringAction)
      : state.present[fighterInState]

  const newPresent: MatchScore = {
    fighter1Scoring: cleanReducer('fighter1Scoring'),
    fighter2Scoring: cleanReducer('fighter2Scoring'),
  }
  const past = state.past || []

  return {
    ...state,
    past: newPresent === state.present ? state.past : past.concat(state.present),
    present: newPresent,
    future: [],
  }
}

function matchUndo(state: Match, _: MatchUndoAction): Match {
  if (state.past.length === 0) {
    return state
  } else {
    return {
      ...state,
      past: state.past.slice(0, state.past.length - 1),
      present: state.past[state.past.length - 1],
      future: [state.present, ...state.future],
    }
  }
}

function matchRedo(state: Match, _: MatchRedoAction): Match {
  if (state.future.length === 0) {
    return state
  } else {
    return {
      ...state,
      past: [...state.past, state.present],
      present: state.future[0],
      future: state.future.slice(1, state.future.length),
    }
  }
}

type FighterScoringKey = 'fighter1Scoring' | 'fighter2Scoring'

function matchScoring(
  scoringAction: ScoringActionType,
  fighter: FighterScoringKey
): MatchScoringAction {
  return {
    type: MATCH_SCORING,
    payload: {
      scoringAction,
      fighter,
    },
  }
}

function matchTiming(timingAction: TimerActionType): MatchTimingAction {
  return {
    type: MATCH_TIMING,
    payload: { timingAction },
  }
}

function undo(): MatchUndoAction {
  return {
    type: MATCH_UNDO,
  }
}

function redo(): MatchRedoAction {
  return {
    type: MATCH_REDO,
  }
}

export const matchActionCreator = {
  matchScoring,
  matchTiming,
  undo,
  redo,
}
