import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { ScreenPropType } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { AppThunk } from '../store';
import List from '../components/List';
import { Match } from '../redux-types/storeTypes';
import matchesService from '../services/matches';
import fightersService from '../services/fighters';
import { setCurrentMatchID } from '../reducers/CurrentIDsReducer'
import { addMatches } from '../reducers/MatchesReducer'
import { addFighters } from '../reducers/FightersReducer'

export default function MatchesScreen({
  route,
  navigation
}: ScreenPropType<"Matches">) {
  const dispatch = useAppDispatch()
  const poolID = useAppSelector(state => state.currentIDs.poolID) || route.params.poolID

  const fighters = useAppSelector(state => state.fighters)
  if (poolID === undefined) {
    throw new Error("SYSTEM EVENT ID MISSING AT TOURNAMENTS SCREEN")
  }

  const thunkMatchData = (match: Match): AppThunk<Promise<void>> => (
    async dispatch => {
      dispatch(setCurrentMatchID(match.ID))
      const matches = await matchesService.getAll(poolID)
      dispatch(addMatches(matches))
      const fighter1 = await fightersService.getByID(match.fighter1ID)
      const fighter2 = await fightersService.getByID(match.fighter2ID)
      // const pools = await matchesService.getAll(tournament.ID)
      dispatch(addFighters([fighter1, fighter2]))
    }
  )

  const onPressFactory = (m: Match) => () => {
    dispatch(thunkMatchData(m)).then(() =>
      navigation.navigate("Match", { matchID: m.ID })
    )
  }

  const getMatchName = (m: Match) => {
    const fighter1 = fighters.find(f => f.ID === m.fighter1ID)
    const fighter2 = fighters.find(f => f.ID === m.fighter2ID)
    const name1 = fighter1 ? `${fighter1.firstName} ${fighter1.lastName}` : m.fighter1ID
    const name2 = fighter2 ? `${fighter2.firstName} ${fighter2.lastName}` : m.fighter1ID
    return `${name1} vs. ${name2}`
  }

  return (
    <View style={styles.container} >
      <List
        listNameAtRoot="matches"
        onPressFactory={i => onPressFactory(i as Match)}
        getName={i => getMatchName(i as Match)}
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
