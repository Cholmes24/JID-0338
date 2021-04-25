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

export default function HomeScreen({ navigation }: ScreenPropType<'Home'>) {
  const dispatch = useAppDispatch()
  const currentMatchID = useAppSelector((state) => state.currentIDs.matchID)
  const currentMatches = useAppSelector((state) => state.matches)
  const [hasRecentMatch, setHasRecentMatch] = useState(false)

  const [hostIP, setHostIP] = useState('')
  const [accessCode, setAccessCode] = useState('')

  useEffect(() => {
    if (hostIP !== '') {
      setHasRecentMatch(currentMatches.find((m) => m.ID === currentMatchID) !== undefined)
    }
  }, [currentMatchID, currentMatches, hostIP])

  useEffect(() => {
    if (hostIP !== '') {
      dispatch(thunkSystemEvents())
        .then(() => dispatch(thunkCurrentMatch()))
        .then((match) => dispatch(thunkCurrentFighters(match)))
        .then(() => Keyboard.dismiss())
    }
  }, [hostIP])

  async function setIP() {
    const url = accessCode
    const tokenAccepted = await authService.requestToken(accessCode, url)
    if (tokenAccepted) {
      setHostIP(accessCode)
    }
  }

  const handleTextChange = (input: string) => setAccessCode(input)

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
    currentMatchID && hasRecentMatch ? (
      <Button
        buttonStyle={styles.entry}
        title="Most Recent Match"
        onPress={() => navigation.navigate('Match', { matchID: currentMatchID })}
      />
    ) : null

  return (
    <View style={styles.container}>
      <View style={styles.userCard}>
        {/* <CodeEntry /> */}
        <TextInput style={styles.textInput} value={accessCode} onChangeText={handleTextChange} />
        <Button title="Set IP" style={styles.enterButton} onPress={setIP} />
        {/* <UserCard firstName={'longFirstName'} lastName={'longLastName'} /> */}
        {/* <ConnectionChecker /> */}
      </View>
      <View style={styles.buttonWrapper}>
        {hostIP && hostIP !== '' ? (
          <Button
            buttonStyle={styles.entry}
            title="Events"
            onPress={() => navigation.navigate('Events')}
          />
        ) : (
          <Text style={styles.errorText}>Cannot access server</Text>
        )}

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
  textInput: {
    width: '95%',
    margin: 20,
    paddingHorizontal: 10,
    backgroundColor: '#CECECE',
    fontSize: 28,
    borderRadius: 8,
    // flex: 1,
  },
  enterButton: {
    width: '95%',
    borderRadius: 8,
    // flex: 1,
  },
  errorText: {
    borderRadius: 15,
    // paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: 35,
    paddingBottom: 100,
  },
})
