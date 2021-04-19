import React from 'react'
import { View, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { SystemEvent } from '../redux-types/storeTypes';
import { AppThunk } from '../store';
import { ScreenPropType } from '../types';

import tournamentsService from '../services/tournaments'
import List from '../components/List';

export default function SystemEventsScreen({
  route,
  navigation
}: ScreenPropType<"Events">) {
  const dispatch = useAppDispatch()
  const thunkSystemEventData = (systemEvent: SystemEvent): AppThunk<Promise<void>> => (
    async dispatch => {
      dispatch({
        type: "SET_CURRENT_SYSTEM_EVENT_ID",
        payload: systemEvent.ID
      })
      const tournaments = await tournamentsService.getAll(systemEvent.ID)
      dispatch({
        type: "ADD_TOURNAMENTS",
        payload: tournaments
      })
    }
  )
  const onPressFactory = (s: SystemEvent) => () => {
    dispatch(thunkSystemEventData(s)).then(() =>
      navigation.navigate("Tournaments", { systemEventID: s.ID })
    )
  }

  return (
    <View style={styles.container} >
      <List
        listNameAtRoot="systemEvents"
        onPressFactory={i => onPressFactory(i as SystemEvent)}
        // filter={events => events}
        getName={(event) => (event as SystemEvent).name}
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
})
