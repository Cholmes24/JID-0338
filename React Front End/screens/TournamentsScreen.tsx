import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { ScreenPropType } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { Tournament } from '../redux-types/storeTypes';
import { AppThunk } from '../store';
import poolsService from '../services/pools';
import List from '../components/List';
export default function TournamentsScreen({
  route,
  navigation
}: ScreenPropType<"Tournaments">) {
  const dispatch = useAppDispatch()
  const systemEventId = useAppSelector(state => state.currentIds.systemEventId) || route.params.systemEventId
  if (systemEventId === undefined) {
    throw new Error("SYSTEM EVENT ID MISSING AT TOURNAMENTS SCREEN")
  }

  const thunkTournamentData = (tournament: Tournament): AppThunk<Promise<void>> => (
    async dispatch => {
      dispatch({
        type: "SET_CURRENT_TOURNAMENT_ID",
        payload: tournament.id
      })
      const pools = await poolsService.getAll(tournament.id)
      dispatch({
        type: "ADD_POOLS",
        payload: pools
      })
    }
  )

  const onPressFactory = (t: Tournament) => () => {
    dispatch(thunkTournamentData(t))
      .then(() => 
        navigation.navigate("Pools", { tournamentId: t.id })  
      )
    }

  return (
    <View style={styles.container} >
      <List
        listNameAtRoot={"tournaments"} 
        onPressFactory={i => onPressFactory(i as Tournament)} 
        getName={i => (i as Tournament).name}
        // filter={is => (is as Tournament[]).filter(t => t.systemEventId === systemEventId)}
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
