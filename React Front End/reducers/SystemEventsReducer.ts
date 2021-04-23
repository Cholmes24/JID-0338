import { AddSystemEvents, SetSystemEvents } from './../redux-types/actionTypes'
import { ADD_SYSTEM_EVENTS,  SET_SYSTEM_EVENTS } from './../redux-types/actionTypes'
import { AnyAction, Reducer } from "redux"
import { SystemEvent } from "../redux-types/storeTypes"
import { addItems } from "../util/utilFunctions"

const systemEventsReducer: Reducer<SystemEvent[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    case SET_SYSTEM_EVENTS:
    	return action.payload
    case ADD_SYSTEM_EVENTS:
    	return addItems(state, (action as AddSystemEvents).payload)
    default:
    	return state
  }
}

export default systemEventsReducer

export const setSystemEvents: (systemEvents: SystemEvent[]) => SetSystemEvents = systemEvents => ({
  type: SET_SYSTEM_EVENTS,
  payload: systemEvents
})

export const addSystemEvents: (systemEvents: SystemEvent[]) => AddSystemEvents = systemEvents => ({
  type: ADD_SYSTEM_EVENTS,
  payload: systemEvents
})