import { AnyAction, Reducer } from "redux"
import { Tournament } from "../redux-types/storeTypes"
import defaultData from '../defaultData'

const tournamentsReducer: Reducer<Tournament[], AnyAction> = (state = defaultData.tournaments, action) => {
  switch (action.type) {
    case "SET_TOURNAMENTS":
      return action.payload
    default:
      return state
  }
}

export default tournamentsReducer