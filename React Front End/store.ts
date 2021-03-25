import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'
import { AnyAction, applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import matchesReducer from './reducers/MatchesReducer'
import defaultData from "./defaultData"

const { fighters, tournaments, pools } = defaultData

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
}

const poolsReducer = (state = pools, _: AnyAction) => state
const tournamentsReducer = (state = tournaments, _: AnyAction) => state
const fightersReducer = (state = fighters, _: AnyAction) => state

const rootReducer = combineReducers({
  matches: persistReducer(persistConfig, matchesReducer),
  pools: persistReducer(persistConfig, poolsReducer),
  tournaments: persistReducer(persistConfig, tournamentsReducer),
  fighters: persistReducer(persistConfig, fightersReducer),
})

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk))

export const store = createStore(
  rootReducer,
  composedEnhancer,
)

export const persistor = persistStore(store)