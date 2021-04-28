import React, { useEffect, useState } from 'react'
import { Keyboard, StyleSheet } from 'react-native'
import { Text, View } from '../components/Themed'
import { Button } from 'react-native-elements'
import UserCard from '../components/UserCard'
import matchService from '../services/match'
import fightersService from '../services/fighters'
import systemEventsService from '../services/systemEvents'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { AppThunk } from '../store'

import { ScreenPropType } from '../types'
import { Match } from '../redux-types/storeTypes'
import { setFighters } from '../reducers/FightersReducer'
import { setMatches } from '../reducers/MatchesReducer'
import { setSystemEvents } from '../reducers/SystemEventsReducer'
import CodeEntry from '../components/CodeEntry'
import { TextInput } from 'react-native-gesture-handler'
import authService from '../services/authService'
import { determineIP } from '../util/utilFunctions'
import { Icon } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'

export default function HomeScreen({ navigation }: ScreenPropType<'Home'>) {
  const dispatch = useAppDispatch()
  const currentMatchID = useAppSelector((state) => state.currentIDs.matchID)
  const currentMatches = useAppSelector((state) => state.matches)
  const [hasRecentMatch, setHasRecentMatch] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (connected) {
      setHasRecentMatch(currentMatches.find((m) => m.ID === currentMatchID) !== undefined)
    }
  }, [currentMatchID, currentMatches, connected])

  useEffect(() => {
    if (connected) {
      dispatch(thunkSystemEvents())
        .then(() => dispatch(thunkCurrentMatch()))
        .then((match) => dispatch(thunkCurrentFighters(match)))
        .then(() => Keyboard.dismiss())
    }
  }, [connected])

  async function setIP(accessCode: string) {
    const ip = '10.1.10.13' //await determineIP(accessCode)
    const tokenAccepted = await authService.requestToken(accessCode, ip)
    if (tokenAccepted) {
      setConnected(true)
      Keyboard.dismiss()
    }
  }

  async function unsetIP(accessCode: string) {
    await authService.logout()
    setConnected(false)
  }

  const thunkSystemEvents = (): AppThunk<Promise<void>> => async (dispatch) => {
    const systemEvents = await systemEventsService.getAll()
    dispatch(setSystemEvents(systemEvents))
    return Promise.resolve()
  }

  const thunkCurrentMatch = (): AppThunk<Promise<Match | undefined>> => async (dispatch) => {
    if (currentMatchID !== undefined && !currentMatches.find((m) => m.ID == currentMatchID)) {
      const currentMatch = await matchService.getMatch(currentMatchID)
      dispatch(setMatches([currentMatch]))
      return Promise.resolve(currentMatch)
    }
    return Promise.resolve(undefined)
  }

  const thunkCurrentFighters = (match?: Match): AppThunk<Promise<void>> => async (dispatch) => {
    if (match) {
      const fighter1 = await fightersService.getByID(match.fighter1ID)
      const fighter2 = await fightersService.getByID(match.fighter2ID)
      dispatch(setFighters([fighter1, fighter2]))
    }
    return Promise.resolve()
  }

  const mostRecentMatchButton = () =>
    connected && currentMatchID && hasRecentMatch ? (
      <Button
        buttonStyle={styles.entry}
        title="Most Recent Match"
        onPress={() => navigation.navigate('Match', { matchID: currentMatchID })}
      />
    ) : null

  return (
    <View style={styles.container}>
      {connected ? (
        <View style={styles.userCard}>
          {/* <View
            style={{
              // height: 100,
              // width: 100,
              marginLeft: 75,
              alignSelf: 'flex-start',
              position: 'absolute',
            }}
          > */}
            <Button
              icon={<Icon name="logout" reverse={true} style={{transform: [{rotateY: '180deg'}]}} />}
              title="Logout"
              titleStyle={{ fontSize: 20 }}
              style={styles.logoutButton}
              containerStyle={{borderRadius: 20 , width: '80%' } }
              onPress={authService.logout}
            />
          {/* </View> */}
        </View>
      ) : (
        <View style={styles.userCard}>
          <CodeEntry codeLength={7} onSubmit={setIP} />
        </View>
      )}
      <View style={styles.buttonWrapper}>
        {connected ? (
          <Button
            buttonStyle={styles.entry}
            title="Events"
            onPress={() => navigation.navigate('Events')}
          />
        ) : (
          <Text style={styles.errorText}>Enter the access code to connect</Text>
        )}

        {mostRecentMatchButton()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  userCard: {
    flex: 2,
    margin: 10,

    // alignItems: 'center',
    // justifyContent: 'center',
  },
  container: {
    flex: 2,
    // alignSelf: 'stretch',
    textAlign: 'center',
    // alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  buttonWrapper: {
    flex: 3,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  entry: {
    width: '95%',
    padding: '7%',
    marginTop: '5%',
    marginBottom: '5%',
    borderRadius: 15,
    alignSelf: 'center',
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  enterButton: {
    width: '95%',
    borderRadius: 8,
    // flex: 1,
  },
  errorText: {
    flex: 1,
    borderRadius: 15,
    // paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: 30,
  },
  logoutButton: {
    width: '95%',
    borderRadius: 15,
    // margin: 20,
  }
})
