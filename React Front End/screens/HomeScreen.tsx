import React, { useEffect } from "react"
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Button } from 'react-native-elements'
import UserCard from "../components/UserCard"

import matchesService from '../services/matches'
import fightersService from '../services/fighters'

import systemEventsService from '../services/systemEvents'

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import { AppThunk } from "../store"

import { ScreenPropType } from "../types";
import { Match } from "../redux-types/storeTypes";

export default function HomeScreen({
  navigation
}: ScreenPropType<"Home">) {

  const currentMatchId = useAppSelector((state) => state.currentMatchId)

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(thunkSystemEvents())
      .then(() => dispatch(thunkCurrentMatch()))
      .then((match) => dispatch(thunkCurrentFighters(match)))
  })
  const thunkSystemEvents = (): AppThunk<Promise<void>> => (
    async dispatch => {
      const systemEvents = await systemEventsService.getAll()
      dispatch({
        type: "SET_SYSTEM_EVENTS",
        payload: systemEvents
      })
      return Promise.resolve()
    }
  )

  const thunkCurrentMatch = (): AppThunk<Promise<Match | undefined>> => (
    async dispatch => {
      if (currentMatchId !== undefined) {
        const currentMatch = await matchesService.getMatch(currentMatchId)
        dispatch({
          type: "SET_MATCHES",
          payload: [currentMatch]
        })
        return Promise.resolve(currentMatch)
      }
      return Promise.resolve(undefined)
    }
  )

  const thunkCurrentFighters = (match?: Match): AppThunk<Promise<void>> => (
    async dispatch => {
      if (match) {
        const fighter1 = await fightersService.getById(match.fighter1Id)
        const fighter2 = await fightersService.getById(match.fighter2Id)
        dispatch({
          type: "SET_FIGHTERS",
          payload: [fighter1, fighter2]
        })
      }
      return Promise.resolve()
    }
  )

  const mostRecentMatchButton = () => (
    currentMatchId !== undefined 
      ? <Button
          buttonStyle={styles.matchButton}
          title='Most Recent Match'
          onPress={() => navigation.navigate("Match", { matchId: currentMatchId }) }
        />
      : null
  )

  return (
    <View style={styles.userCard}>
      <UserCard
        firstName={"longFirstName"}
        lastName={"longLastName"}
      />

      {mostRecentMatchButton()}
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
