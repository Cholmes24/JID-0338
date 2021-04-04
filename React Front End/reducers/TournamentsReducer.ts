import { AnyAction, Reducer } from "redux"
import { Tournament } from "../redux-types/storeTypes"
import defaultData from '../defaultData'
import { AddTournamentsAction } from "../redux-types/actionTypes"
import { addItems } from "../util/utilFunctions"

const tournamentsReducer: Reducer<Tournament[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    case "SET_TOURNAMENTS":
      return action.payload
    case "ADD_TOURNAMENTS":
      return addItems(state, (action as AddTournamentsAction).payload)
    default:
      return state
  }
}

export default tournamentsReducer