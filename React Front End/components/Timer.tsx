import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button, Text } from 'react-native-elements'
import { View, StyleSheet, Image, ColorValue, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Timer({maxTime = 3000}: {maxTime?: number}) {
  const [ timeLeft, setTimeLeft ] = useState<number>(maxTime)
  const [ timeLeftAtLastStop, setTimeLeftAtLastStop ] = useState<number>(timeLeft)
  const [ lastStart, setLastStart ] = useState<number>(Date.now())
  const [ timerRunning, setTimerRunning ] = useState(false)

  const refreshRate = 85 // in ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeRemaining())
    }, refreshRate)
    return () => clearTimeout(timer)
  })

  const calculateTimeRemaining = (currentTime: number = Date.now()) => {
    return Math.max(0, timeLeftAtLastStop - (timerRunning ? (currentTime - lastStart) : 0))
  }

  const toggle = () => {
    if (timeLeft > 0) {
      const currentTime = Date.now()
      const pausePlay = timerRunning ? pause : play
      pausePlay(currentTime)
    }
  }

  const pause = (currentTime: number) => {
    const exactTimeLeft = calculateTimeRemaining(currentTime)
    setTimeLeft(exactTimeLeft)
    setTimeLeftAtLastStop(exactTimeLeft)
    setTimerRunning(false)
  }

  const play = (currentTime: number) => {
    setLastStart(currentTime)
    setTimerRunning(true)
  }

  const formattedTimeLeft = () => {
    const ms: number = timeLeft
    const points = Math.floor(ms / 100) % 10
    const seconds = Math.floor((ms / 1000)) % 60
    const minutes = Math.floor(ms / (1000 * 60)) % 60
    return `${minutes}:${seconds < 10 ? "0" :""}${seconds}.${points}`
  }

  const addTime = () => {
    const amountToAdd = 10000
    if (timeLeft === 0) {
      setTimerRunning(false)
      setTimeLeftAtLastStop(amountToAdd)
    } else {
      setTimeLeftAtLastStop(timeLeftAtLastStop + amountToAdd)
      setTimeLeft(timeLeft + amountToAdd)
    }
  }

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
          icon={timerRunning && timeLeft > 0 ?
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
          onPress={timeLeft > 0 ? toggle : (() => null)}
        />
      </View>
  )
}
const testBorder = {
  // borderColor: "yellow",
  // borderWidth: 4
}

const buttonDefaults = {
  backgroundColor: '#9C9C9C',
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
  }
});