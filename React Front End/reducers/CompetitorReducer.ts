import { INCREASE_SCORE, DECREASE_SCORE, ISSUE_WARNING, ISSUE_PENALTY, Competitor, CompetitorActionTypes, MatchState, UNDO_CALL } from '../store/types';
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
          left: action.data,
          callLog: state.callLog.concat(action)
        }
      } else {
        return {
          ...state,
          right: action.data,
          callLog: state.callLog.concat(action)
        }
      }
    }
    case DECREASE_SCORE:
      if (!action.data.side) {
        return state
      } else {
        const callLog = state[action.data.side].score !== action.data.score ? state.callLog.concat(action) : state.callLog
        if (action.data.side === "left") {
          return {
            ...state,
            left: action.data,
            callLog
          }
        } else {
          return {
            ...state,
            right: action.data,
            callLog
          }
        }
      }
    case UNDO_CALL: {
      return action.data
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
  // TODO: check for when decrease amount != increase amount, if after decreasing a score to 0,
  // undo will result in giving too much back
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

export function undoParticularCall(state: Competitor, callToUndo: CompetitorActionTypes) {
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

export function undoLastCall(state: MatchState) {
  const makeChanges = () => {
    if (state.callLog.length != 0) {

      const newCallLog = state.callLog.slice(0, state.callLog.length - 1)
      const undoneAction = state.callLog[state.callLog.length - 1]
      if (undoneAction && undoneAction?.data.side) {
        const playerToUndo = state[undoneAction.data.side]
        // TODO remove console.logs
        console.log("attempting to undo a call on " + playerToUndo.name)
        const restoredCompetitorState = undoParticularCall(playerToUndo, undoneAction)
        console.log("player score: " + restoredCompetitorState.score )
        if (playerToUndo.side == "right") {
          return {
            ...state,
            callLog: newCallLog,
            right: restoredCompetitorState
          }
        } else {
          return {
            ...state,
            callLog: newCallLog,
            left: restoredCompetitorState
          }
        }
      }
    }
    return state
  }
  return {
    type: UNDO_CALL,
    data: makeChanges()
  }
}
