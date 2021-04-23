import { TOGGLE_TIMER, ADD_TO_TIMER, UPDATE_TIMER } from './../../redux-types/actionTypes';
import { AddToTimerAction, TimerActionType, ToggleTimerAction, UpdateTimerAction } from '../../redux-types/actionTypes'
import { Timer } from '../../redux-types/storeTypes'
import { matches } from '../MatchesReducer'
import { matchTiming } from '../MatchReducer'

export default function timerReducer(state: Timer, action: TimerActionType) {
  switch (action.type) {
    case TOGGLE_TIMER:
      return executeTogglingTimer(state, action)
    case ADD_TO_TIMER:
      return executeAddingToTimer(state, action)
    case UPDATE_TIMER:
      return executeUpdatingTimer(state, action)
    default:
      return state
  }
}

const calculateTimeRemaining = (currentTime: number, state: Timer) => (
  Math.max(0, state.timeRemainingAtLastStop - (state.isRunning ? (currentTime - state.timeOfLastStart) : 0))
)

function executeTogglingTimer(state: Timer, action: ToggleTimerAction): Timer {
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

function executeAddingToTimer(state: Timer, action: AddToTimerAction): Timer {
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

function executeUpdatingTimer(state: Timer, action: UpdateTimerAction): Timer {
  const timeRemaining = calculateTimeRemaining(action.payload.currentTime, state)
  return {
    ...state,
    timeRemaining,
    isRunning: timeRemaining === 0 ? false : state.isRunning
  }
}

export function toggleTimer(matchID: number, currentTime: number) {
  return matches(matchTiming({
    type: TOGGLE_TIMER,
    payload: { currentTime },
  }), matchID)
}

export function addToTimer(matchID: number, currentTime: number, amountToAdd: number) {
  return matches(matchTiming({
    type: ADD_TO_TIMER,
    payload: {
      currentTime,
      amountToAdd,
    },
  }), matchID)
}

export function updateTimer(matchID: number, currentTime: number) {
  return matches(matchTiming({
    type: UPDATE_TIMER,
    payload: { currentTime },
  }), matchID)}
