import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button, Text } from 'react-native-elements'
import { View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootType } from '../redux-types/storeTypes'
import asMatchesAction from '../util/reduxActionWrapper'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'

type TimerProps = {
  matchId: number
}

//TODO: implement remote functionality
export default function Timer({matchId}: TimerProps) {
  const dispatch = useAppDispatch()
  const matches = useAppSelector((state: RootType) => state.matches)
  const timerStore = matches.find(m => m.id === matchId)?.timer

  if (!timerStore) {
    throw Error("INVALID MATCH ID - TIMER NOT FOUND")
  }

  const [ timeLeft, setTimeLeft ] = useState<number>(timerStore.timeRemaining)

  const refreshRate = 85 // in ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (timerStore.isRunning) {
        update()
      }
    }, refreshRate)
    return () => clearTimeout(timer)
  })

  const calculateTimeRemaining = (
    currentTime: number = Date.now()
  ) => (
    Math.max(0, timerStore.timeRemainingAtLastStop - (timerStore.isRunning ? (currentTime - timerStore.timeOfLastStart) : 0))
  )

  const update = () => {
    const timeRemaining = calculateTimeRemaining()
    if (timeRemaining === 0 || timerStore.timeRemaining - timeRemaining > 400) {
      dispatch(asMatchesAction({
        type: "UPDATE_TIMER",
        payload: { currentTime: Date.now() }
      }, matchId))
    }
    setTimeLeft(timeRemaining)
  }

  const toggle = () => {
      dispatch(
      asMatchesAction({
        type: "TOGGLE_TIMER",
        payload: { currentTime: Date.now() }
      }, matchId)
    )
  }

  const formattedTimeLeft = () => {
    // const ms: number = timerStore.timeRemaining
    const ms: number = timeLeft
    const points = Math.floor(ms / 100) % 10
    const seconds = Math.floor((ms / 1000)) % 60
    const minutes = Math.floor(ms / (1000 * 60)) % 60
    return `${minutes}:${seconds < 10 ? "0" :""}${seconds}.${points}`
  }

  const addTime = () => {
    const currentTime = Date.now()
    const amountToAdd = 10000
    setTimeLeft(timeLeft + amountToAdd)
    dispatch(
      asMatchesAction({
        type: "ADD_TO_TIMER",
        payload: { currentTime, amountToAdd }
      }, matchId)
    )
  }
  const hasTimeLeft: () => boolean = () => timerStore.timeRemaining > 0
  const timerRunning: () => boolean = () => timerStore.isRunning

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
          onPress={() => (hasTimeLeft() ? toggle() : null)}
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