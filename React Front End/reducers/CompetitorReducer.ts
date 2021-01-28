import { INCREASE_SCORE, DECREASE_SCORE, ISSUE_WARNING, ISSUE_PENALTY, Competitor, CompetitorActionTypes, MatchState } from '../store/types';
import { IncreaseScoreAction, DecreaseScoreAction, IssueWarningAction, IssuePenaltyAction } from '../store/types'
import { defaultMatchState } from './MatchReducer'


const increaseAmount = 1
const decreaseAmount = 1
const scoreAfterWarning = (state: Competitor) => state.score  // TODO
const scoreAfterPenalty = (state: Competitor) => state.score  // TODO

export default function competitorReducer(state = defaultMatchState, action: CompetitorActionTypes) {
  switch (action.type) {
    case INCREASE_SCORE: {
      if (!action.data.side) {
        return state
      } else if (action.data.side === "left") {
        return {
          ...state,
          left: action.data
        }
      } else {
        return {
          ...state,
          right: action.data
        }
      }
    }
    case DECREASE_SCORE:
      if (!action.data.side) {
        return state
      } else if (action.data.side === "left") {
        return {
          ...state,
          left: action.data
        }
      } else {
        return {
          ...state,
          right: action.data
        }
      }
    // case ISSUE_WARNING:
    //   return issueWarning(state)
    // case ISSUE_PENALTY:
    //   return issuePenalty(state)
    default:
      return state
  }
}

export function increaseScore(state: Competitor): IncreaseScoreAction {
  return {
    type: INCREASE_SCORE,
    data: {
      ...state,
      score: state.score + increaseAmount
    }
  }
}

export const decreaseScore = (state: Competitor) => (
  {
    type: DECREASE_SCORE,
    data: {
      ...state,
      score: state.score <= decreaseAmount ? 0 : state.score - decreaseAmount
    }
  }
)

export const issueWarning = (state: Competitor) => ({
  ...state,
  numberOfWarnings: (state.numberOfWarnings || 0) + 1,
  score: scoreAfterWarning(state)
})

export const issuePenalty = (state: Competitor) => ({
  ...state,
  numberOfPenalties: (state.numberOfPenalties || 0) + 1,
  score: scoreAfterPenalty(state)
})
