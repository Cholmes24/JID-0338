import { AnyAction, Reducer } from "redux"
import { Fighter } from "../redux-types/storeTypes"
import { addItems } from '../util/utilFunctions'
import {
  AddFightersAction, ADD_FIGHTERS,
  SetFightersAction, SET_FIGHTERS,
} from './../redux-types/actionTypes'


const fightersReducer: Reducer<Fighter[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    case SET_FIGHTERS:
      return action.payload
    case ADD_FIGHTERS:
      return addItems(state, (action as AddFightersAction).payload)
    default:
      return state
  }
}

export default fightersReducer

export const setFighters: (fighters: Fighter[]) => SetFightersAction = fighters => ({
  type: SET_FIGHTERS,
  payload: fighters
})

export const addFighters: (fighters: Fighter[]) => AddFightersAction = fighters => ({
  type: ADD_FIGHTERS,
  payload: fighters
})