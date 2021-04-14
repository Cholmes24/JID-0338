import { CurrentIdsActionType } from './../redux-types/actionTypes';
import { CurrentIds } from './../redux-types/storeTypes';
import { AnyAction, Reducer } from "redux"
import defaultData from "../defaultData"

const currentIdsReducer: Reducer<CurrentIds, AnyAction> = (state = defaultData.currentIds, action) => {
  switch (action.type) {
    case "SET_CURRENT_SYSTEM_EVENT_ID":
      return { ...state, systemEventId: action.payload }
    case "SET_CURRENT_TOURNAMENT_ID":
      return { ...state, tournamentId: action.payload }
    case "SET_CURRENT_POOL_ID":
      return { ...state, poolId: action.payload }
    case "SET_CURRENT_MATCH_ID":
      return { ...state, matchId: action.payload }
    default:
      return state
  }
}

export default currentIdsReducer