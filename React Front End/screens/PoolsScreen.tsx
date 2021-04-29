import * as React from 'react'
import { StyleSheet } from 'react-native'
import List from '../components/List'
import { View } from '../components/Themed'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { setCurrentPoolID } from '../reducers/CurrentIDsReducer'
import { addFighters } from '../reducers/FightersReducer'
import { addMatches } from '../reducers/MatchesReducer'
import { Pool } from '../redux-types/storeTypes'
import fightersService from '../services/fighters'
import matchesService from '../services/matches'
import { AppThunk } from '../store'
import { ScreenPropType } from '../types'

export default function PoolsScreen({ route, navigation }: ScreenPropType<'Pools'>) {
  const dispatch = useAppDispatch()
  const tournamentID =
    useAppSelector((state) => state.currentIDs.tournamentID) || route.params.tournamentID

  if (tournamentID === undefined) {
    throw new Error('SYSTEM EVENT ID MISSING AT TOURNAMENTS SCREEN')
  }

  const thunkPoolData = (pool: Pool): AppThunk<Promise<void>> => async (dispatch) => {
    dispatch(setCurrentPoolID(pool.ID))
    const matches = await matchesService.getAll(pool.ID)
    dispatch(addMatches(matches))
    const fighters = await fightersService.getAllByPoolID(pool.ID)
    dispatch(addFighters(fighters))
  }

  const onPressFactory = (p: Pool) => () => {
    dispatch(thunkPoolData(p)).then(() => navigation.navigate('Matches', { poolID: p.ID }))
  }

  return (
    <View style={styles.container}>
      <List
        listNameAtRoot="pools"
        onPressFactory={(i) => onPressFactory(i as Pool)}
        getName={(i) => (i as Pool).name}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})
