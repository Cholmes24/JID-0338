import * as React from 'react'
import { StyleSheet } from 'react-native'
import List from '../components/List'
import { View } from '../components/Themed'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { Pool } from '../redux-types/storeTypes'
import matchesService from '../services/matches'
import { AppThunk } from '../store'
import { ScreenPropType } from '../types'

export default function PoolsScreen({
  route,
  navigation
}: ScreenPropType<"Pools">) {
  const dispatch = useAppDispatch()
  const tournamentId = useAppSelector(state => state.currentIds.tournamentId) || route.params.tournamentId
  if (tournamentId === undefined) {
    throw new Error("SYSTEM EVENT ID MISSING AT TOURNAMENTS SCREEN")
  }
  const thunkPoolData = (pool: Pool): AppThunk<Promise<void>> => (
    async dispatch => {
      dispatch({
        type: "SET_CURRENT_POOL_ID",
        payload: pool.id
      })
      const matches = await matchesService.getAllByTournament(tournamentId)
      dispatch({
        type: "ADD_MATCHES",
        payload: matches
      })
    }
  )

  const onPressFactory = (p: Pool) => () => {
    dispatch(thunkPoolData(p))
      .then(() => 
        navigation.navigate("Matches", { poolId: p.id })
      )
    }

  return (
    <View style={styles.container} >
      <List
        listNameAtRoot="pools"
        onPressFactory={i => onPressFactory(i as Pool)}
        // filter={is => (is as Pool[]).filter(p => p.tournamentId === tournamentId)}
        getName={i => (i as Pool).name} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
