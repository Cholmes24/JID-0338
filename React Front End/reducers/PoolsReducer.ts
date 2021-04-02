import { AnyAction, Reducer } from "redux"
import { Pool } from "../redux-types/storeTypes"
import defaultData from '../defaultData'

const poolsReducer: Reducer<Pool[], AnyAction> = (state = defaultData.pools, action) => {
  switch (action.type) {
    case "SET_POOLS":
      return action.payload
    case "ADD_POOLS":
      return state.concat(action.payload)
    default:
      return state
  }
}

export default poolsReducer