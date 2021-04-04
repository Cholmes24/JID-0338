import { AnyAction, Reducer } from "redux"
import { Pool } from "../redux-types/storeTypes"
import defaultData from '../defaultData'
import { addItems } from "../util/utilFunctions"
import { AddPoolsAction } from "../redux-types/actionTypes"

const poolsReducer: Reducer<Pool[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    case "SET_POOLS":
      return action.payload
    case "ADD_POOLS":
      return addItems(state, (action as AddPoolsAction).payload)
    default:
      return state
  }
}

export default poolsReducer