import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AddToTimerAction, TimerActionType, ToggleTimerAction, UpdateTimerAction } from '../../redux-types/actionTypes'
import { Timer } from '../../redux-types/storeTypes'

// const initialState: Timer = {
//   maxTime: 180000,
//   timeRemaining: 180000,
//   timeOfLastStart: 0,
//   timeRemainingAtLastStop: 180000,
//   isRunning: false
// }

// export const timerSlice = createSlice({
//   name: "timer",
//   initialState,
//   reducers: {
//     toggleTimer: (state, action: PayloadAction<number>) => {
//       if (state.timeRemaining > 0) {
//         if (state.isRunning) {
//           state.timeRemaining = calculateTimeRemaining(action.payload, state)
//           state.timeRemainingAtLastStop = state.timeRemaining
//         } else {
//           state.timeOfLastStart = action.payload
//         }
//         state.isRunning = !state.isRunning
//       }
//     },
//     addToTimer: (state, action: PayloadAction<number>) => {
//       if (state.timeRemaining <= 0) {
//         state.isRunning = false
//       } else {
//         state.timeRemainingAtLastStop += action.payload
//       }
//       state.timeRemaining += action.payload
//     },
//     updateTimer: (state, action: PayloadAction<number>) => {
//       state.timeRemaining = calculateTimeRemaining(action.payload, state)
//       if (state.timeRemaining <= 0) {
//         state.isRunning = false
//       }
//     }
//   }
// })

// export const { toggleTimer, addToTimer, updateTimer } = timerSlice.actions

// export default timerSlice.reducer

export default function timerReducer(state: Timer, action: TimerActionType) {
  switch (action.type) {
    case "TOGGLE_TIMER":
      return toggleTimer(state, action)
    case "ADD_TO_TIMER":
      return addToTimer(state, action)
    case "UPDATE_TIMER":
      return updateTimer(state, action)
    default:
      return state
  }
}

const calculateTimeRemaining = (currentTime: number, state: Timer) => (
  Math.max(0, state.timeRemainingAtLastStop - (state.isRunning ? (currentTime - state.timeOfLastStart) : 0))
)

function toggleTimer(state: Timer, action: ToggleTimerAction): Timer {
  if (state.timeRemaining <= 0) {
    return state
  } else if (state.isRunning) {
    const timeRemaining = calculateTimeRemaining(action.payload.currentTime, state)
    return {
      ...state,
      timeRemaining,
      timeRemainingAtLastStop: timeRemaining,
      isRunning: false
    }
  } else {
    return {
      ...state,
      timeOfLastStart: action.payload.currentTime,
      isRunning: true
    }
  }
}

function addToTimer(state: Timer, action: AddToTimerAction): Timer {
  if (state.timeRemaining <= 0) {
    return {
      ...state,
      isRunning: false,
      timeRemaining: action.payload.amountToAdd
    }
  } else {
    return {
      ...state,
      timeRemaining: state.timeRemaining + action.payload.amountToAdd,
      timeRemainingAtLastStop: state.timeRemainingAtLastStop + action.payload.amountToAdd
    }
  }
}

function updateTimer(state: Timer, action: UpdateTimerAction): Timer {
  const timeRemaining = calculateTimeRemaining(action.payload.currentTime, state)
  return {
    ...state,
    timeRemaining,
    isRunning: timeRemaining === 0 ? false : state.isRunning
  }
}