import { Timer } from '../../redux-types/storeTypes'
import {
  AddToTimerAction,
  ADD_TO_TIMER,
  ToggleTimerAction,
  TOGGLE_TIMER,
  UpdateTimerAction,
  UPDATE_TIMER,
  TimerActionType,
} from '../../redux-types/actionTypes'

export default function timerReducer(state: Timer, action: TimerActionType) {
  switch (action.type) {
    case TOGGLE_TIMER:
      return toggleTimer(state, action)
    case ADD_TO_TIMER:
      return addToTimer(state, action)
    case UPDATE_TIMER:
      return updateTimer(state, action)
    default:
      return state
  }
}

const calculateTimeRemaining = (currentTime: number, state: Timer) =>
  Math.max(
    0,
    state.timeRemainingAtLastStop - (state.isRunning ? currentTime - state.timeOfLastStart : 0)
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
      isRunning: false,
    }
  } else {
    return {
      ...state,
      timeOfLastStart: action.payload.currentTime,
      isRunning: true,
    }
  }
}

function addToTimer(state: Timer, action: AddToTimerAction): Timer {
  if (state.timeRemaining <= 0) {
    return {
      ...state,
      isRunning: false,
      timeRemaining: action.payload.amountToAdd,
    }
  } else {
    return {
      ...state,
      timeRemaining: state.timeRemaining + action.payload.amountToAdd,
      timeRemainingAtLastStop: state.timeRemainingAtLastStop + action.payload.amountToAdd,
    }
  }
}

function updateTimer(state: Timer, action: UpdateTimerAction): Timer {
  const timeRemaining = calculateTimeRemaining(action.payload.currentTime, state)
  return {
    ...state,
    timeRemaining,
    isRunning: timeRemaining === 0 ? false : state.isRunning,
  }
}

export function createToggleTimerAction(currentTime: number): ToggleTimerAction {
  return {
    type: TOGGLE_TIMER,
    payload: { currentTime },
  }
}

export function createAddToTimerAction(currentTime: number, amountToAdd: number): AddToTimerAction {
  return {
    type: ADD_TO_TIMER,
    payload: {
      currentTime,
      amountToAdd,
    },
  }
}

export function createUpdateTimerAction(currentTime: number): UpdateTimerAction {
  return {
    type: UPDATE_TIMER,
    payload: { currentTime },
  }
}

export const timingActionCreator = {
  createToggleTimerAction,
  createAddToTimerAction,
  createUpdateTimerAction,
}
