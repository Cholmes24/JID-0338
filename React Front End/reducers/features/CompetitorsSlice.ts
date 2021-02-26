import { CompetitorActionTypes, INCREASE_SCORE, DECREASE_SCORE, ISSUE_WARNING, ISSUE_PENALTY, UNDO_CALL, Competitor, LongtermCompetitorActionTypes } from "../../store/types"
import { defaultCompetitorList } from "../MatchReducer"

// TODO: abstract away these amounts to the rule set, and pass them in through the action payload
const increaseAmount = 1
const decreaseAmount = 1

export default function competitorsReducer(state = defaultCompetitorList, action: CompetitorActionTypes) {
  switch (action.type) {
    case INCREASE_SCORE: {
      return state.map((comp) => ({
        ...comp,
        score: comp.id !== action.competitorId ? comp.score : comp.score + increaseAmount
      }))
    } case DECREASE_SCORE: {
      return state.map((comp) => ({
        ...comp,
        score: comp.id !== action.competitorId ? comp.score : Math.max(comp.score - decreaseAmount, 0)
      }))
    } case ISSUE_WARNING: {
      return state.map((comp) => ({
        ...comp,
        numberOfWarnings: comp.numberOfWarnings + (action.competitorId !== comp.id  ? 0 : 1)
      }))
    } case ISSUE_PENALTY: {
      return state.map((comp) => ({
        ...comp,
        numberOfPenalties: comp.numberOfPenalties + (action.competitorId !== comp.id  ? 0 : 1)
      }))
    } case UNDO_CALL: {
      return state.map((comp) => {
        if (comp.id !== action.data.competitorId) {
          return comp
        } else {
          return undoParticularCall(comp, action.data)
        }
      })
    } default: {
      return state
    }
  }
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