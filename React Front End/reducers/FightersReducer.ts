import { AnyAction, Reducer } from "redux"
import { Fighter } from "../redux-types/storeTypes"
import defaultData from '../defaultData'

const fightersReducer: Reducer<Fighter[], AnyAction> = (state = defaultData.fighters, action) => {
  switch (action.type) {
    case "SET_FIGHTERS":
      return action.payload
    case "ADD_FIGHTERS":
      return state.concat(action.payload)
    default:
      return state
  }
}

export default fightersReducer