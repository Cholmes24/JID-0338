import { IncreaseScoreAction, DecreaseScoreAction, IssueWarningAction, IssuePenaltyAction, UndoCallAction, CompetitorActionTypes } from './../../store/types';
import { INCREASE_SCORE, DECREASE_SCORE, ISSUE_WARNING, ISSUE_PENALTY, UNDO_CALL, Competitor, LongtermCompetitorActionTypes } from "../../store/types"
import { defaultCompetitorList } from "../MatchReducer"

// TODO: abstract away these amounts to the rule set, and pass them in through the action payload
const increaseAmount = 1
const decreaseAmount = 1

function createReducer(initialState: Competitor[], handlers: any) {
  return function reducer(state = initialState, action: CompetitorActionTypes) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action) as Competitor[]
    } else {
      return state
    }
  }
}

export default createReducer(defaultCompetitorList, {
  INCREASE_SCORE: increaseScore,
  DECREASE_SCORE: decreaseScore,
  ISSUE_WARNING: issueWarning,
  ISSUE_PENALTY: issuePenalty,
  UNDO_CALL: undoCall
})

function increaseScore(state: Competitor[], action: IncreaseScoreAction) {
  return state.map((comp) => ({
    ...comp,
    score: comp.id !== action.competitorId ? comp.score : comp.score + increaseAmount
  }))
}

function decreaseScore(state: Competitor[], action: DecreaseScoreAction) {
  return state.map((comp) => ({
    ...comp,
    score: comp.id !== action.competitorId ? comp.score : Math.max(comp.score - decreaseAmount, 0)
  }))
}

function issueWarning(state: Competitor[], action: IssueWarningAction) {
  return state.map((comp) => ({
    ...comp,
    numberOfWarnings: comp.numberOfWarnings + (action.competitorId !== comp.id  ? 0 : 1)
  }))
}

function issuePenalty(state: Competitor[], action: IssuePenaltyAction) {
  return state.map((comp) => ({
    ...comp,
    numberOfPenalties: comp.numberOfPenalties + (action.competitorId !== comp.id  ? 0 : 1)
  }))
}

function undoCall(state: Competitor[], action: UndoCallAction) {
  return state.map((comp) => {
    if (comp.id !== action.data.competitorId) {
      return comp
    } else {
      return undoParticularCall(comp, action.data)
    }
  })
}

function undoParticularCall(state: Competitor, callToUndo: LongtermCompetitorActionTypes) {
  switch (callToUndo.type) {
    case INCREASE_SCORE: {
      return {
        ...state,
        score: Math.max(state.score - increaseAmount, 0)
      }
    }
    case DECREASE_SCORE: {
      return {
        ...state,
        score: state.score + decreaseAmount
      }
    }
    case ISSUE_WARNING: {
      return {
        ...state,
        numberOfWarnings: Math.max(state.numberOfWarnings - 1, 0)
      }
    }
    case ISSUE_PENALTY: {
      return {
        ...state,
        numberOfPenalties: Math.max(state.numberOfPenalties - 1, 0)
      }
    }
    default:
      return state
  }
}