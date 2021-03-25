import { AddToTimerAction, TimerActionType, ToggleTimerAction, UpdateTimerAction } from '../../redux-types/actionTypes'
import { Timer } from '../../redux-types/storeTypes'

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

const calculateTimeRemaining = (
  currentTime: number,
  timeOfLastStart: number,
  timeRemainingAtLastStop: number,
  isRunning: boolean
) => (
  Math.max(0, timeRemainingAtLastStop - (isRunning ? (currentTime - timeOfLastStart) : 0))
)

function toggleTimer(state: Timer, action: ToggleTimerAction): Timer {
  if (state.timeRemaining <= 0) {
    return state
  } else if (state.isRunning) {
    const timeRemaining = calculateTimeRemaining(action.payload.currentTime,
      state.timeOfLastStart, state.timeRemainingAtLastStop, state.isRunning
    )
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
  const timeRemaining = calculateTimeRemaining(action.payload.currentTime,
    state.timeOfLastStart, state.timeRemainingAtLastStop, state.isRunning
  )
  return {
    ...state,
    timeRemaining,
    isRunning: timeRemaining === 0 ? false : state.isRunning
  }
}