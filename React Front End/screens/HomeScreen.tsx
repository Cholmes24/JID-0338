import React, { useEffect, useState } from "react"
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

export default function HomeScreen({
  navigation
}: ScreenPropType<"Home">) {

  const currentMatchID = useAppSelector((state) => state.currentIDs.matchID)
  const currentMatches = useAppSelector((state) => state.matches)
  const hostIP = true // useAppSelector(state => state.hostIPAddress)
  const [ hasRecentMatch, setHasRecentMatch ] = useState(false)

  useEffect(() => {
    setHasRecentMatch(currentMatches.find(m => m.ID === currentMatchID) !== undefined)
  }, [ currentMatchID, currentMatches ])


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
      if (currentMatchID !== undefined && !currentMatches.find(m => m.ID == currentMatchID)) {
        const currentMatch = await matchService.getMatch(currentMatchID)
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
        const fighter1 = await fightersService.getByID(match.fighter1ID)
        const fighter2 = await fightersService.getByID(match.fighter2ID)
        dispatch({
          type: "SET_FIGHTERS",
          payload: [fighter1, fighter2]
        })
      }
      return Promise.resolve()
    }
  )

  const mostRecentMatchButton = () => (
    currentMatchID && hasRecentMatch
      ? <Button
          buttonStyle={styles.entry}
          title='Most Recent Match'
          onPress={() => navigation.navigate("Match", { matchID: currentMatchID }) }
        />
      : null
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
    </View>
  )
}

const styles = StyleSheet.create({
  userCard: {
    flex: 3,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
