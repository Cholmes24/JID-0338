import * as React from 'react'
import { StyleSheet } from 'react-native'
import { View } from '../components/Themed'
import { ScreenPropType } from '../types'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { Tournament } from '../redux-types/storeTypes'
import { AppThunk } from '../store'
import poolsService from '../services/pools'
import List from '../components/List'
import { setCurrentTournamentID } from '../reducers/CurrentIDsReducer'
import { addPools } from '../reducers/PoolsReducer'

export default function TournamentsScreen({ route, navigation }: ScreenPropType<'Tournaments'>) {
  const dispatch = useAppDispatch()
  const systemEventID =
    useAppSelector((state) => state.currentIDs.systemEventID) || route.params.systemEventID

  if (systemEventID === undefined) {
    throw new Error('SYSTEM EVENT ID MISSING AT TOURNAMENTS SCREEN')
  }

  const thunkTournamentData = (tournament: Tournament): AppThunk<Promise<void>> => async (
    dispatch
  ) => {
    dispatch(setCurrentTournamentID(tournament.ID))
    const pools = await poolsService.getAll(tournament.ID)
    dispatch(addPools(pools))
  }

  const onPressFactory = (t: Tournament) => () => {
    dispatch(thunkTournamentData(t)).then(() =>
      navigation.navigate('Pools', { tournamentID: t.ID })
    )
  }

  return (
    <View style={styles.container}>
      <List
        listNameAtRoot={'tournaments'}
        onPressFactory={(i) => onPressFactory(i as Tournament)}
        getName={(i) => (i as Tournament).name}
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
