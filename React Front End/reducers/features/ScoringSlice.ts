import { INCREASE_SCORE, DECREASE_SCORE, ISSUE_PENALTY, ISSUE_WARNING } from './../../redux-types/actionTypes'
import { ScoringActionType } from './../../redux-types/actionTypes'
import {
  IncreaseScoreAction,
  DecreaseScoreAction,
  IssueWarningAction,
  IssuePenaltyAction
} from '../../redux-types/actionTypes'
import { Scoring } from '../../redux-types/storeTypes'
import { matches } from '../MatchesReducer'
import { matchScoring } from '../MatchReducer'

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

type FighterScoringKey = "fighter1Scoring" | "fighter2Scoring"

export function increaseScore(matchID: number, fighter: FighterScoringKey) {
  return matches(matchScoring({
    type: INCREASE_SCORE
  }, fighter), matchID)
}

export function decreaseScore(matchID: number, fighter: FighterScoringKey) {
  return matches(matchScoring({
    type: DECREASE_SCORE
  }, fighter), matchID)
}

export function issueWarning(matchID: number, fighter: FighterScoringKey) {
  return matches(matchScoring({
    type: ISSUE_WARNING
  }, fighter), matchID)}

export function issuePenalty(matchID: number, fighter: FighterScoringKey) {
  return matches(matchScoring({
    type: ISSUE_PENALTY
  }, fighter), matchID)
}
