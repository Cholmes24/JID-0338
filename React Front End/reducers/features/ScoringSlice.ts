import { Scoring } from '../../redux-types/storeTypes'
import {
  IncreaseScoreAction,
  INCREASE_SCORE,
  DecreaseScoreAction,
  DECREASE_SCORE,
  IssueWarningAction,
  ISSUE_WARNING,
  IssuePenaltyAction,
  ISSUE_PENALTY,
  ScoringActionType,
} from '../../redux-types/actionTypes'

export default function scoringReducer(state: Scoring, action: ScoringActionType) {
  switch (action.type) {
    case INCREASE_SCORE:
      return increaseScore(state, action)
    case DECREASE_SCORE:
      return decreaseScore(state, action)
    case ISSUE_WARNING:
      return issueWarning(state, action)
    case ISSUE_PENALTY:
      return issuePenalty(state, action)
    default:
      return state
  }
}

function increaseScore(state: Scoring, action: IncreaseScoreAction): Scoring {
  return {
    ...state,
    points: action.payload !== undefined ? action.payload : state.points + 1,
  }
}

function decreaseScore(state: Scoring, action: DecreaseScoreAction): Scoring {
  const points =
    action.payload !== undefined && action.payload >= 0
      ? action.payload
      : Math.max(state.points - 1, 0)
  return {
    ...state,
    points,
  }
}

function issueWarning(state: Scoring, action: IssueWarningAction): Scoring {
  return {
    ...state,
    numWarnings: action.payload !== undefined ? action.payload : state.numWarnings + 1,
  }
}

function issuePenalty(state: Scoring, action: IssuePenaltyAction): Scoring {
  return {
    ...state,
    numPenalties: action.payload !== undefined ? action.payload : state.numPenalties + 1,
  }
}

export function createIncreaseScoreAction(newScore: number): IncreaseScoreAction {
  return {
    type: INCREASE_SCORE,
    payload: newScore,
  }
}

export function createDecreaseScoreAction(newScore: number): DecreaseScoreAction {
  return {
    type: DECREASE_SCORE,
    payload: newScore,
  }
}

export function createIssueWarningAction(newNumWarnings: number): IssueWarningAction {
  return {
    type: ISSUE_WARNING,
    payload: newNumWarnings,
  }
}

export function createIssuePenaltyAction(newNumPenalties: number): IssuePenaltyAction {
  return {
    type: ISSUE_PENALTY,
    payload: newNumPenalties,
  }
}

export const scoringActionCreator = {
  createIncreaseScoreAction,
  createDecreaseScoreAction,
  createIssueWarningAction,
  createIssuePenaltyAction,
}
