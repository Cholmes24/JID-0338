import { AddFightersAction } from './../redux-types/actionTypes';
import { AnyAction, Reducer } from "redux"
import { Fighter } from "../redux-types/storeTypes"
import defaultData from '../defaultData'
import { addItems } from '../util/utilFunctions';

const fightersReducer: Reducer<Fighter[], AnyAction> = (state = defaultData.fighters, action) => {
  switch (action.type) {
    case "SET_FIGHTERS":
      return action.payload
    case "ADD_FIGHTERS":
      return addItems(state, (action as AddFightersAction).payload)
    default:
      return state
  }
}

export default fightersReducer