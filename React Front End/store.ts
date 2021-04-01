import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'
import { Action, AnyAction, applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import matchesReducer from './reducers/MatchesReducer'
import defaultData from "./defaultData"
import tournamentsReducer from './reducers/TournamentsReducer'
import fightersReducer from './reducers/FightersReducer'

const { fighters, pools } = defaultData

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
}

const poolsReducer = (state = pools, _: AnyAction) => state

const rootReducer = combineReducers({
  matches: matchesReducer,
  pools: poolsReducer,
  tournaments: tournamentsReducer,
  fighters: fightersReducer,
})

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk))

export const store = createStore(
  persistReducer(persistConfig, rootReducer),
  composedEnhancer,
)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<RootState, any, Action>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>