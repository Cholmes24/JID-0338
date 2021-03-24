import { Fighter, RootType, Tournament, Pool } from './redux-types/storeTypes';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'
import { AnyAction, applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import matchReducer, { defaultMatch } from './reducers/MatchReducerNew'

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
}


const defaultFighter1: Fighter = {
  id: 1,
  firstName: "Longname",
  lastName: "Fencermaster",
  color: "#376EDA",
}

const defaultFighter2: Fighter = {
  id: 2,
  firstName: "Superlong",
  lastName: "Lastnameman",
  color: "#D43737",
}

const defaultTournament: Tournament = {
  name: "Dummy Tournament",
  id: 0,
  fighterIds: [1, 2],
  poolIds: [0],
  matchIds: [0]
}

const defaultPool: Pool = {
  id: 0,
  name: "Pool Party",
  fighterIds: [1, 2],
  tournamentId: 0
}

const dummyData: RootType = {
  pools: [defaultPool],
  tournamnents: [defaultTournament],
  fighters: [defaultFighter1, defaultFighter2],
  matches: [defaultMatch]
}

// const rootReducer = combineReducers({
//   competitorReducer: persistReducer(persistConfig, matchReducer)
// })
const composedEnhancer = composeWithDevTools(applyMiddleware(thunk))

export const store = createStore(
  // persistReducer(persistConfig, matchReducer),
  matchReducer,
  defaultMatch,
  composedEnhancer,
)

export const persistor = persistStore(store)