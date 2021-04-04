import { AddSystemEvents } from './../redux-types/actionTypes';
import { AnyAction, Reducer } from "redux"
import { SystemEvent } from "../redux-types/storeTypes"
import defaultData from '../defaultData'
import { addItems } from "../util/utilFunctions"

const systemEventsReducer: Reducer<SystemEvent[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    case "SET_SYSTEM_EVENTS":
    	return action.payload
    case "ADD_SYSTEM_EVENTS":
    	return addItems(state, (action as AddSystemEvents).payload)
    default:
    	return state
  }
}

export default systemEventsReducer