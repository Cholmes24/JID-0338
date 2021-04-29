import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useAppDispatch } from '../hooks/reduxHooks'
import { SystemEvent } from '../redux-types/storeTypes'
import { AppThunk } from '../store'
import { ScreenPropType } from '../types'

import tournamentsService from '../services/tournaments'
import List from '../components/List'
import { setCurrentSystemEventID } from '../reducers/CurrentIDsReducer'
import { addTournaments } from '../reducers/TournamentsReducer'

export default function SystemEventsScreen({ navigation }: ScreenPropType<'Events'>) {
  const dispatch = useAppDispatch()
  const thunkSystemEventData = (systemEvent: SystemEvent): AppThunk<Promise<void>> => async (
    dispatch
  ) => {
    dispatch(setCurrentSystemEventID(systemEvent.ID))
    const tournaments = await tournamentsService.getAll(systemEvent.ID)
    dispatch(addTournaments(tournaments))
  }
  const onPressFactory = (s: SystemEvent) => () => {
    dispatch(thunkSystemEventData(s)).then(() =>
      navigation.navigate('Tournaments', { systemEventID: s.ID })
    )
  }

  return (
    <View style={styles.container}>
      <List
        listNameAtRoot="systemEvents"
        onPressFactory={(i) => onPressFactory(i as SystemEvent)}
        getName={(event) => (event as SystemEvent).name}
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
