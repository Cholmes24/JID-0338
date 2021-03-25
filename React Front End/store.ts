import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'
import { AnyAction, applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import matchesReducer from './reducers/MatchesReducer'
import defaultData from "./defaultData"
import tournamentsReducer from './reducers/TournamentsReducer'

const { fighters, pools } = defaultData

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
}

const poolsReducer = (state = pools, _: AnyAction) => state
const fightersReducer = (state = fighters, _: AnyAction) => state

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