import { Timer } from './../redux-types/storeTypes'
import { AnyAction, Reducer } from 'redux'
import { Match } from '../redux-types/storeTypes'
import matchReducer, { matchActionCreator } from './MatchReducer'
import { addItemsWithMergeCustomizer } from '../util/utilFunctions'
import { scoringActionCreator } from './features/ScoringSlice'
import { timingActionCreator } from './features/TimerSlice'
import {
  MATCHES,
  MatchesAction,
  SET_MATCHES,
  SetMatchesAction,
  ADD_MATCHES,
  AddMatchesAction,
  MatchActionType,
} from '../redux-types/actionTypes'

function isMatchesActionType(action: AnyAction): action is MatchesAction {
  if (action.type !== MATCHES) {
    return false
  }
  const a = action as MatchesAction
  return a.type === MATCHES && a.matchAction !== undefined && a.matchID !== undefined
}

const matchesReducer: Reducer<Match[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    case MATCHES:
      if (isMatchesActionType(action)) {
        return forwardMatchesAction(state, action)
      } else {
        return state
      }
    case SET_MATCHES:
      return action.payload
    case ADD_MATCHES:
      return addItemsWithMergeCustomizer(
        state,
        (action as AddMatchesAction).payload,
        timerMergeCustomizer,
        matchTemplate as Match
      )
    default:
      return state
  }
}

export default matchesReducer

function forwardMatchesAction(state: Match[], action: MatchesAction): Match[] {
  return state.map((match) => {
    if (match.ID === action.matchID) {
      return matchReducer(match, action.matchAction)
    } else {
      return match
    }
  })
}

const matchTemplate: unknown = {
  past: [],
  future: [],
  timer: {
    maxTime: 90000,
    timeRemaining: undefined,
    timeRemainingAtLastStop: 0,
    timeOfLastStart: 0,
    isRunning: false,
  },
}

function isTimer(t: any): t is Timer {
  return (
    typeof t === 'object' &&
    t !== null &&
    'timeRemaining' in t &&
    typeof t['timeRemaining'] === 'number'
  )
}

function timerMergeCustomizer(objVal: any, dbVal: any): Timer | undefined {
  if (isTimer(objVal) && isTimer(dbVal)) {
    const storedTime = objVal.timeRemaining
    const dbTime = dbVal.timeRemaining
    if (Math.abs(storedTime - dbTime) > 1000) {
      return {
        ...objVal,
        timeRemaining: dbTime,
        timeRemainingAtLastStop: objVal.isRunning ? objVal.timeRemainingAtLastStop : dbTime,
      }
    } else {
      return objVal
    }
  }
}

export function matches(matchAction: MatchActionType, matchID: number): MatchesAction {
  return {
    type: MATCHES,
    matchAction,
    matchID,
  }
}

export function setMatches(matches: Match[]): SetMatchesAction {
  return {
    type: SET_MATCHES,
    payload: matches,
  }
}

export function addMatches(matches: Match[]): AddMatchesAction {
  return {
    type: ADD_MATCHES,
    payload: matches,
  }
}

type FighterScoringKey = 'fighter1Scoring' | 'fighter2Scoring'

export function increaseScore(matchID: number, fighter: FighterScoringKey) {
  return matches(
    matchActionCreator.matchScoring(scoringActionCreator.createIncreaseScoreAction(), fighter),
    matchID
  )
}

export function decreaseScore(matchID: number, fighter: FighterScoringKey) {
  return matches(
    matchActionCreator.matchScoring(scoringActionCreator.createDecreaseScoreAction(), fighter),
    matchID
  )
}

export function issueWarning(matchID: number, fighter: FighterScoringKey) {
  return matches(
    matchActionCreator.matchScoring(scoringActionCreator.createIssueWarningAction(), fighter),
    matchID
  )
}

export function issuePenalty(matchID: number, fighter: FighterScoringKey) {
  return matches(
    matchActionCreator.matchScoring(scoringActionCreator.createIssuePenaltyAction(), fighter),
    matchID
  )
}

export function toggleTimer(matchID: number, currentTime: number) {
  return matches(
    matchActionCreator.matchTiming(timingActionCreator.createToggleTimerAction(currentTime)),
    matchID
  )
}

export function addToTimer(matchID: number, currentTime: number, amountToAdd: number) {
  return matches(
    matchActionCreator.matchTiming(
      timingActionCreator.createAddToTimerAction(currentTime, amountToAdd)
    ),
    matchID
  )
}

export function updateTimer(matchID: number, currentTime: number) {
  return matches(
    matchActionCreator.matchTiming(timingActionCreator.createUpdateTimerAction(currentTime)),
    matchID
  )
}

export function undo(matchID: number) {
  return matches(matchActionCreator.undo(), matchID)
}

export function redo(matchID: number) {
  return matches(matchActionCreator.redo(), matchID)
}
