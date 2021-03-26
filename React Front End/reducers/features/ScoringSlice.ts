import { createSlice } from '@reduxjs/toolkit'
import { Scoring } from '../../redux-types/storeTypes'

const initialState: Scoring = {
  points: 0,
  numWarnings: 0,
  numPenalties: 0,
}

export const scoringSlice = createSlice({
  name: "scoring",
  initialState,
  reducers: {
    increaseScore: state => {
      state.points += 1
    },
    decreaseScore: state => {
      state.points = Math.max(state.points - 1, 0)
    },
    issueWarning: state => {
      state.numWarnings += 1
    },
    issuePenalty: state => {
      state.numPenalties += 1
    }
  }
})

export const { increaseScore, decreaseScore, issueWarning, issuePenalty } = scoringSlice.actions

export default scoringSlice.reducer
