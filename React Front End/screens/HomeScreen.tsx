import React, { useEffect } from "react"
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Button } from 'react-native-elements'
import UserCard from "../components/UserCard"

import matchService from '../services/match'
import fightersService from '../services/fighters'
import systemEventsService from '../services/systemEvents'

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import { AppThunk } from "../store"

import { ScreenPropType } from "../types";
import { Match } from "../redux-types/storeTypes";
import ConnectionChecker from "../components/ConnectionChecker"

export default function HomeScreen({
  navigation
}: ScreenPropType<"Home">) {

  const currentMatchId = useAppSelector((state) => state.currentIds.matchId)
  const currentMatches = useAppSelector((state) => state.matches)
  const hostIP = true // useAppSelector(state => state.hostIPAddress)

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (hostIP) {
      dispatch(thunkSystemEvents())
        .then(() => dispatch(thunkCurrentMatch()))
        .then((match) => dispatch(thunkCurrentFighters(match)))
    }
  }, [hostIP])

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
      if (currentMatchId !== undefined && !currentMatches.find(m => m.id == currentMatchId)) {
        const currentMatch = await matchService.getMatch(currentMatchId)
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
          buttonStyle={styles.entry}
          title='Most Recent Match'
          onPress={() => navigation.navigate("Match", { matchId: currentMatchId }) }
        />
      : null //<View style={styles.matchButton} > </View>
  )

  return (
    <View style={styles.container} >

      <View style={styles.userCard}>
        <UserCard
          firstName={"longFirstName"}
          lastName={"longLastName"}
        />
        {/* <ConnectionChecker /> */}
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          buttonStyle={styles.entry}
          title='Events'
          onPress={() => navigation.navigate("Events")}
        />
        {mostRecentMatchButton()}
      </View>

      {/* <View style={styles.filler}></View> */}

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
    flex: 3,
    marginTop: 10,
    // paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filler: {
    height: '15%'
  },
  container: {
    flex: 2,
    alignSelf: "stretch",
    textAlign: 'center',
    paddingBottom: 5
  },
  buttonWrapper: {
    flex: 3,
    textAlign: 'center',
    // backgroundColor: 'white',
    width: '100%',
  },
  entry: {
    width: '95%',
    padding: '7%',
    marginTop: '5%',
    marginBottom: '5%',
    borderRadius: 15,
    alignSelf: "center",
    paddingHorizontal: 5
  },
})
