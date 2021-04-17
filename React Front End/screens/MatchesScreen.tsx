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
export default function MatchesScreen({
  route,
  navigation
}: ScreenPropType<"Matches">) {
  const dispatch = useAppDispatch()
  const poolId = useAppSelector(state => state.currentIds.poolId) || route.params.poolId

  const tournamentId = useAppSelector(state => state.currentIds.tournamentId) as number
  const fighters = useAppSelector(state => state.fighters)
  if (poolId === undefined) {
    throw new Error("SYSTEM EVENT ID MISSING AT TOURNAMENTS SCREEN")
  }

  // const allMatches = useAppSelector(state => state.matches)
  // const matches = allMatches.filter(m => m.poolId === poolId)


  const thunkMatchData = (match: Match): AppThunk<Promise<void>> => (
    async dispatch => {
      dispatch({
        type: "SET_CURRENT_MATCH_ID",
        payload: match.id
      })
      const matches = await matchesService.getAllByTournament(tournamentId)
      dispatch({
        type: "ADD_MATCHES",
        payload: matches
      })
      const fighter1 = await fightersService.getById(match.fighter1Id)
      const fighter2 = await fightersService.getById(match.fighter2Id)
      // const pools = await matchesService.getAll(tournament.id)
      dispatch({
        type: "ADD_FIGHTERS",
        payload: [fighter1, fighter2]
      })
    }
  )

  const onPressFactory = (m: Match) => () => {
    dispatch(thunkMatchData(m)).then(() =>
      navigation.navigate("Match", { matchId: m.id })
    )
  }

  const getMatchName = (m: Match) => {
    const fighter1 = fighters.find(f => f.id === m.fighter1Id)
    const fighter2 = fighters.find(f => f.id === m.fighter2Id)
    const name1 = fighter1 ? `${fighter1.firstName} ${fighter1.lastName}` : m.fighter1Id
    const name2 = fighter2 ? `${fighter2.firstName} ${fighter2.lastName}` : m.fighter1Id
    return `${name1} vs. ${name2}`
  }

  return (
    <View style={styles.container} >
      <List
        // items={namedMatches}
        listNameAtRoot="matches"
        onPressFactory={i => onPressFactory(i as Match)}
        // filter={is => (is as Match[]).filter(m => m.poolId === poolId)}
        getName={i => getMatchName(i as Match)}
        // parentIdKeyName="poolId"

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
