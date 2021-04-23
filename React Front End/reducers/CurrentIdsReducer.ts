import { CurrentIDs } from '../redux-types/storeTypes';
import { AnyAction, Reducer } from "redux"

const currentIDsReducer: Reducer<CurrentIDs, AnyAction> = (state = {}, action) => {
  switch (action.type) {
    case "SET_CURRENT_SYSTEM_EVENT_ID":
      return { ...state, systemEventID: action.payload }
    case "SET_CURRENT_TOURNAMENT_ID":
      return { ...state, tournamentID: action.payload }
    case "SET_CURRENT_POOL_ID":
      return { ...state, poolID: action.payload }
    case "SET_CURRENT_MATCH_ID":
      return { ...state, matchID: action.payload }
    default:
      return state
  }
}

export default currentIDsReducer