import React, { useEffect } from "react"
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Button } from 'react-native-elements'
import UserCard from "../components/UserCard"
import { Match, Tournament } from "../redux-types/storeTypes"
import { TournamentsActionType } from "../redux-types/actionTypes"

import tournamentsService from '../services/tournaments'
import matchService from '../services/matches'
import systemEventsService from '../services/systemEvents'

import { useAppDispatch } from "../hooks/reduxHooks"
import { AppThunk } from "../store"

import fightersService from '../services/fighters'

export default function HomeScreen() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(thunkSystemEvents())
      .then((eventId) => dispatch(thunkTournaments(eventId)))
      .then((tournamentId) => dispatch(thunkMatches(tournamentId)))
      .then((matches) => dispatch(thunkFighters(matches.find(m => m.id === 52598) as Match)))
  })

  const thunkTournaments = (eventID: number): AppThunk<Promise<number>> => (
    async dispatch => {
      const tournaments = await tournamentsService.getAll(eventID)
      dispatch({
        type: "SET_TOURNAMENTS",
        payload: tournaments
      })
      return Promise.resolve(713)
    }
  )

  const thunkSystemEvents = (): AppThunk<Promise<number>> => (
    async dispatch => {
      const systemEvents = await systemEventsService.getAll()
      return Promise.resolve(143)
    }
  )

  // For skipping pools during testing
  const thunkMatches = (tournamentId: number): AppThunk<Promise<Match[]>> => (
    async dispatch => {
      // const matchId = 52598
      const matches = await matchService.getAll(tournamentId)
      dispatch({
        type: "SET_MATCHES",
        payload: matches
      })
      return Promise.resolve(matches)
    }
  )

  const thunkFighters = (match: Match): AppThunk<Promise<void>> => (
    async dispatch => {
      const fighter1 = await fightersService.getById(match.fighter1Id)
      const fighter2 = await fightersService.getById(match.fighter2Id)
      const fighters = [fighter1, fighter2]
      console.log(fighters)
      dispatch({
        type: "ADD_FIGHTERS",
        payload: [fighter1, fighter2]
      })
    }
  )


  // // For skipping pools and match search during testing
  // const thunkMatch = (): AppThunk => (
  //   async dispatch => {
  //     const matchId = 52598
  //     const match = await matchService.getMatch(matchId)
  //     dispatch({
  //       type: "SET_MATCHES",
  //       payload: [ match ]
  //     })
  //   }
  // )

  return (
    <View style={styles.userCard}>
      <UserCard
        firstName={"longFirstName"}
        lastName={"longLastName"}
      />

      <Button
        buttonStyle={styles.matchButton}
        title='Most Recent Match'
      />
      <View style={styles.filler}></View>
    </View>

  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  userCard: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchButton: {
    width: '100%',
    padding: '10%',
    marginTop: '5%',
    marginBottom: '5%',
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  filler: {
    height: '40%'
  }
});
