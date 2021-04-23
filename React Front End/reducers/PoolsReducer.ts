import { AnyAction, Reducer } from "redux"
import { Pool } from "../redux-types/storeTypes"
import { addItems } from "../util/utilFunctions"
import { AddPoolsAction, SetPoolsAction } from "../redux-types/actionTypes"
import { ADD_POOLS, SET_POOLS } from "../redux-types/actionTypes"

const poolsReducer: Reducer<Pool[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    case SET_POOLS:
      return action.payload
    case ADD_POOLS:
      return addItems(state, (action as AddPoolsAction).payload)
    default:
      return state
  }
}

export default poolsReducer

export const setPools: (pools: Pool[]) => SetPoolsAction = (pools: Pool[]) => ({
  type: SET_POOLS,
  payload: pools
})

export const addPools: (pools: Pool[]) => AddPoolsAction = (pools: Pool[]) => ({
  type: ADD_POOLS,
  payload: pools
})