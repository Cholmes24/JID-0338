import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button, Text } from 'react-native-elements'
import { View, StyleSheet, Image, ColorValue, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux'
import { Match, RootType } from '../redux-types/storeTypes'
import { AddToTimerAction, MatchActionType, MatchesAction, MatchTimingAction, TimerActionType, ToggleTimerAction, UpdateTimerAction } from '../redux-types/actionTypes'

type TimerProps = {
  matchId: number
}

export default function Timer({matchId}: TimerProps) {
  const dispatch = useDispatch()
  const timerStore = useSelector((state: RootType) => state.matches.find((m: Match) => m.id === matchId)?.timer)

  if (!timerStore) {
    throw Error("INVALID MATCH ID - TIMER NOT FOUND")
  }

  // const [ timeLeft, setTimeLeft ] = useState<number>(maxTime)
  // const [ timeLeftAtLastStop, setTimeLeftAtLastStop ] = useState<number>(timeLeft)
  // const [ lastStart, setLastStart ] = useState<number>(Date.now())
  // const [ timerRunning, setTimerRunning ] = useState(false)

  const refreshRate = 85 // in ms
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(update())
    }, refreshRate)
    return () => clearTimeout(timer)
  })

  const update = () => dispatch(affectStore({
    type: "UPDATE_TIMER",
    payload: {
      currentTime: Date.now()
    }
  }))

  const toggle = () => dispatch(affectStore({
    type: "TOGGLE_TIMER",
    payload: {
      currentTime: Date.now()
    }
  }))

  const middle: (inner: TimerActionType) => MatchTimingAction = (inner) => ({
    type: "MATCH_TIMING",
    payload: {
      timingAction: inner
    }
  })

  const outer: (middle: MatchTimingAction) => MatchesAction = (middle) => ({
    type: "MATCHES",
    matchAction: middle,
    matchId
  })

  const affectStore: (inner: TimerActionType) => MatchesAction = (inner) => outer(middle(inner))

  const formattedTimeLeft = () => {
    const ms: number = timerStore.timeRemaining
    const points = Math.floor(ms / 100) % 10
    const seconds = Math.floor((ms / 1000)) % 60
    const minutes = Math.floor(ms / (1000 * 60)) % 60
    return `${minutes}:${seconds < 10 ? "0" :""}${seconds}.${points}`
  }

  const addTime = () => dispatch(
    affectStore({
      type: "ADD_TO_TIMER",
      payload: {
        currentTime: Date.now(),
        amountToAdd: 10000
      }
    })
  )

  const hasTimeLeft: () => boolean = () => timerStore.timeRemaining > 0
  const timerRunning: () => boolean = () => timerStore.isRunning

  //TODO: handle timer going into negative range
  return (
      <View style={styles.container}>
        <Button
          buttonStyle={styles.add_time}
          icon={
            <Icon
                name="plus"
                size={40}
                color="white"
              />
            }
          onPress={addTime}
        />
        <Text style={styles.text}>{formattedTimeLeft()} </Text>
        <Button
          buttonStyle={styles.play_pause}
          icon={timerRunning() && hasTimeLeft() ?
            <Icon
              name="pause"
              size={40}
              color="white"
            />
            :
            <Icon
              name="play"
              size={40}
              color="white"
            />
          }
          onPress={() => (hasTimeLeft() ? dispatch(toggle()) : null)}
        />
      </View>
  )
}
const testBorder = {
  // borderColor: "yellow",
  // borderWidth: 4
}

const buttonDefaults = {
  backgroundColor: '#C0C0C0',
  width: 55,
  marginHorizontal: 25,
  borderRadius: 13,
  ...testBorder
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    textAlign: 'center',
    // fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
    fontVariant: ['tabular-nums'],
    alignSelf: 'center',
    marginHorizontal: 5,
    ...testBorder
  },
  play_pause: {
    ...buttonDefaults,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    // shadowRadius: 4,
    // shadowOffset: { width: 1, height: 3 },
    // shadowColor: 'black',
    // shadowOpacity: 0.4,
  },
  timerBox: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  container: {
    // width: '100%',
    marginVertical: 3,
    alignSelf: 'center',
    flexDirection:'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    ...testBorder
  },
  add_time: {
    ...buttonDefaults,
    justifyContent: 'center',
    alignSelf: 'center',
    // shadowRadius: 4,
    // shadowOffset: { width: 1, height: 3 },
    // shadowColor: 'black',
    // shadowOpacity: 0.4,
  }
});