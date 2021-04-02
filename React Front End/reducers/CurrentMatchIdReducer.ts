import { AnyAction, Reducer } from "redux"

const currentMatchIdReducer: Reducer<number | undefined, AnyAction> = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_MATCH_ID":
      return action.payload
    default:
      return state
  }
}

export default currentMatchIdReducer