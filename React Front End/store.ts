import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'
import competitorReducer from './reducers/CompetitorReducer'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
}

// const rootReducer = combineReducers({
//   competitorReducer: persistReducer(persistConfig, competitorReducer)
// })
const composedEnhancer = composeWithDevTools(applyMiddleware(thunk))

export const store = createStore(
  persistReducer(persistConfig, competitorReducer),
  composedEnhancer,
)

export const persistor = persistStore(store)