import { CurrentIDs } from '../redux-types/storeTypes'
import { AnyAction, Reducer } from "redux"
import {
  SET_CURRENT_SYSTEM_EVENT_ID,
  SET_CURRENT_TOURNAMENT_ID,
  SET_CURRENT_POOL_ID,
  SET_CURRENT_MATCH_ID,
} from '../redux-types/actionTypes'
import {
  SetCurrentSystemEventIDAction,
  SetCurrentTournamentIDAction,
  SetCurrentPoolIDAction,
  SetCurrentMatchIDAction,
} from '../redux-types/actionTypes'

const currentIDsReducer: Reducer<CurrentIDs, AnyAction> = (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_SYSTEM_EVENT_ID:
      return { ...state, systemEventID: action.payload }
    case SET_CURRENT_TOURNAMENT_ID:
      return { ...state, tournamentID: action.payload }
    case SET_CURRENT_POOL_ID:
      return { ...state, poolID: action.payload }
    case SET_CURRENT_MATCH_ID:
      return { ...state, matchID: action.payload }
    default:
      return state
  }
}

export default currentIDsReducer

export const setCurrentSystemEventID: (ID: number) => SetCurrentSystemEventIDAction = ID => ({
  type: SET_CURRENT_SYSTEM_EVENT_ID,
  payload: ID
})

export const setCurrentTournamentID: (ID: number) => SetCurrentTournamentIDAction = ID =>({
  type: SET_CURRENT_TOURNAMENT_ID,
  payload: ID
})

export const setCurrentPoolID: (ID: number) => SetCurrentPoolIDAction = ID => ({
  type: SET_CURRENT_POOL_ID,
  payload: ID
})

export const setCurrentMatchID: (ID: number) => SetCurrentMatchIDAction = ID => ({
  type: SET_CURRENT_MATCH_ID,
  payload: ID
})