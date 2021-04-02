import { AnyAction, Reducer } from "redux"
import defaultData from "../defaultData"

const currentMatchIdReducer: Reducer<number | undefined, AnyAction> = (state = defaultData.currentMatchId, action) => {
  switch (action.type) {
    case "SET_CURRENT_MATCH_ID":
      return action.payload
    default:
      return state
  }
}

export default currentMatchIdReducer