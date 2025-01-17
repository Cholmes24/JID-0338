import { AnyAction, Reducer } from 'redux'
import { Tournament } from '../redux-types/storeTypes'
import { addItems } from '../util/utilFunctions'
import {
  ADD_TOURNAMENTS,
  AddTournamentsAction,
  SET_TOURNAMENTS,
  SetTournamentsAction,
} from '../redux-types/actionTypes'

const tournamentsReducer: Reducer<Tournament[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    case SET_TOURNAMENTS:
      return action.payload
    case ADD_TOURNAMENTS:
      return addItems(state, (action as AddTournamentsAction).payload)
    default:
      return state
  }
}

export default tournamentsReducer

export const setTournaments: (tournaments: Tournament[]) => SetTournamentsAction = (
  tournaments
) => ({
  type: SET_TOURNAMENTS,
  payload: tournaments,
})

export const addTournaments: (tournaments: Tournament[]) => AddTournamentsAction = (
  tournaments
) => ({
  type: ADD_TOURNAMENTS,
  payload: tournaments,
})
