import { AnyAction, Reducer } from "redux"
import { SystemEvent } from "../redux-types/storeTypes"
import defaultData from '../defaultData'

const systemEventsReducer: Reducer<SystemEvent[], AnyAction> = (state = defaultData.systemEvents, action) => {
  switch (action.type) {
    case "SET_SYSTEM_EVENTS":
      return action.payload
    case "ADD_SYSTEM_EVENTS":
      return state.concat(action.payload)
    default:
      return state
  }
}

export default systemEventsReducer