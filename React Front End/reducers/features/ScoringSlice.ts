import { ScoringActionType, IncreaseScoreAction, DecreaseScoreAction, IssueWarningAction, IssuePenaltyAction } from '../../redux-types/actionTypes'
import { Scoring, Timer } from '../../redux-types/storeTypes'

export default function scoringReducer(state: Scoring, action: ScoringActionType) {
  switch (action.type) {
    case "INCREASE_SCORE":
      return increaseScore(state, action)
    case "DECREASE_SCORE":
      return decreaseScore(state, action)
    case "ISSUE_WARNING":
      return issueWarning(state, action)
    case "ISSUE_PENALTY":
      return issuePenalty(state, action)
    default:
      return state
  }
}

function increaseScore(state: Scoring, action: IncreaseScoreAction): Scoring {
  return {
    ...state,
    points: state.points + 1
  }
}

function decreaseScore(state: Scoring, action: DecreaseScoreAction): Scoring {
  return {
    ...state,
    points: Math.max(state.points - 1, 0)
  }
}

function issueWarning(state: Scoring, action: IssueWarningAction): Scoring {
  return {
    ...state,
    numWarnings: state.numWarnings + 1
  }
}

function issuePenalty(state: Scoring, action: IssuePenaltyAction): Scoring {
  return {
    ...state,
    numPenalties: state.numPenalties + 1
  }
}

// const initialState: Scoring = {
//   points: 0,
//   numWarnings: 0,
//   numPenalties: 0,
// }

// export const scoringSlice = createSlice({
//   name: "scoring",
//   initialState,
//   reducers: {
//     "INCREASE_SCORE": state => {
//       state.points += 1
//     },
//     decreaseScore: state => {
//       state.points = Math.max(state.points - 1, 0)
//     },
//     issueWarning: state => {
//       state.numWarnings += 1
//     },
//     issuePenalty: state => {
//       state.numPenalties += 1
//     }
//   }
// })

// export const { decreaseScore, issueWarning, issuePenalty } = scoringSlice.actions

// export default scoringSlice.reducer
