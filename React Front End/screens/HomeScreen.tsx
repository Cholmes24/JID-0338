import React, { useEffect, useState } from 'react'
import { Keyboard, StyleSheet, Image } from 'react-native'
import { Text, View } from '../components/Themed'
import { Button } from 'react-native-elements'
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
import authService from '../services/authService'
import { determineIP } from '../util/utilFunctions'
import { LinearGradient } from 'expo-linear-gradient'
import useColorScheme from '../hooks/useColorScheme'

export default function HomeScreen({ navigation }: ScreenPropType<'Home'>) {
  const dispatch = useAppDispatch()
  const currentMatchID = useAppSelector((state) => state.currentIDs.matchID)
  const currentMatches = useAppSelector((state) => state.matches)
  const [hasRecentMatch, setHasRecentMatch] = useState(false)
  const [connected, setConnected] = useState(false)
  const theme = useColorScheme()
  const logoutColor = theme === 'dark' ? 'white' : '#575757'

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
    const ip = await determineIP(accessCode)
    const tokenAccepted = await authService.requestToken(accessCode, ip)
    if (tokenAccepted) {
      setConnected(true)
      Keyboard.dismiss()
    }
  }

  async function unsetIP() {
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

  const mostRecentMatchButton = () => (
    <Button
      buttonStyle={styles.entry}
      title="Most Recent Match"
      onPress={() => currentMatchID && navigation.navigate('Match', { matchID: currentMatchID })}
      disabled={!connected || currentMatchID === undefined || !hasRecentMatch}

    />
  )

  return (
    <View style={styles.container}>
      {connected ? (
        <View style={styles.userCard}>
          <View style={styles.imageContainer} >
            <Image source={{uri:'https://images.squarespace-cdn.com/content/v1/53518dd3e4b0e85fd91edde7/1607727526945-7CEYKZQUQXE4YDVTPKBY/ke17ZwdGBToddI8pDm48kBy_Di5oPbEsU06S-w0xqIh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1USuOa6StVHPk-_t9tEvkwaC7KSzfyQI3SstOP6fm2CCy3WUfc_ZsVm9Mi1E6FasEnQ/AHFA%2BLogo%2BGrey.png?format=1500w'}} style={styles.logo}/>
          </View>
          <Button
            buttonStyle={styles.entry}
            title="Events"
            onPress={() => navigation.navigate('Events')}
          />

          {mostRecentMatchButton()}

          <Text style={[styles.logout, {color: logoutColor}]} onPress={unsetIP}>Logout</Text>
          
        </View>
      ) : (
        <LinearGradient style={styles.container} colors={['#376eda', '#d43737']} start={{x:0, y:0.5}} end={{x:1, y:0.5}}>
          <CodeEntry codeLength={7} onSubmit={setIP} />
        </LinearGradient>
        
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '55%',
    marginBottom: 15,
  },
  userCard: {
    flex: 2,
    margin: 10,
    backgroundColor: 'transparent'
  },
  container: {
    flex: 2,
    textAlign: 'center',
    justifyContent: 'center',
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
    marginBottom: '5%',
    borderRadius: 15,
    alignSelf: 'center',
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  enterButton: {
    width: '95%',
    borderRadius: 8,
  },
  errorText: {
    flex: 1,
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 20,
    backfaceVisibility: 'hidden',
    color: 'white'
  },
  logoutButton: {
    width: '95%',
    borderRadius: 15,
  },
  logo: {
    zIndex: 3,
    width: 150,
    height: 300,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logout: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  connectScreen: {
    backgroundColor: '#2c89dc',
    flex: 2,
    textAlign: 'center',
    justifyContent: 'center',
  }
})
