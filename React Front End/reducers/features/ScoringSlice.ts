import { Scoring } from '../../redux-types/storeTypes'
import {
  IncreaseScoreAction, INCREASE_SCORE,
  DecreaseScoreAction, DECREASE_SCORE,
  IssueWarningAction, ISSUE_WARNING,
  IssuePenaltyAction, ISSUE_PENALTY,
  ScoringActionType,
} from '../../redux-types/actionTypes'


export default function scoringReducer(state: Scoring, action: ScoringActionType) {
  switch (action.type) {
    case INCREASE_SCORE:
      return determineIncreasedScore(state, action)
    case DECREASE_SCORE:
      return determineDecreasedScore(state, action)
    case ISSUE_WARNING:
      return determineWarningIssued(state, action)
    case ISSUE_PENALTY:
      return determinePenaltyIssued(state, action)
    default:
      return state
  }
}

function determineIncreasedScore(state: Scoring, action: IncreaseScoreAction): Scoring {
  return {
    ...state,
    points: state.points + 1
  }
}

function determineDecreasedScore(state: Scoring, action: DecreaseScoreAction): Scoring {
  return {
    ...state,
    points: Math.max(state.points - 1, 0)
  }
}

function determineWarningIssued(state: Scoring, action: IssueWarningAction): Scoring {
  return {
    ...state,
    numWarnings: state.numWarnings + 1
  }
}

function determinePenaltyIssued(state: Scoring, action: IssuePenaltyAction): Scoring {
  return {
    ...state,
    numPenalties: state.numPenalties + 1
  }
}


export function createIncreaseScoreAction(): IncreaseScoreAction {
  return {
    type: INCREASE_SCORE
  }
}

export function createDecreaseScoreAction(): DecreaseScoreAction {
  return {
    type: DECREASE_SCORE
  }
}

export function createIssueWarningAction(): IssueWarningAction {
  return {
    type: ISSUE_WARNING
  }
}

export function createIssuePenaltyAction(): IssuePenaltyAction {
  return {
    type: ISSUE_PENALTY
  }
}

export const scoringActionCreator = {
  createIncreaseScoreAction,
  createDecreaseScoreAction,
  createIssueWarningAction,
  createIssuePenaltyAction,
}