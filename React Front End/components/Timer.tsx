import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button, Text } from 'react-native-elements'
import { View, StyleSheet, Image, ColorValue } from 'react-native'
// import { View } from '../components/Themed';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Timer({maxTime = 300000}: {maxTime?: number}) {
  const [ timeLeft, setTimeLeft ] = useState<number>(maxTime)
  const [ timeLeftAtLastStop, setTimeLeftAtLastStop ] = useState<number>(maxTime)
  const [ lastStart, setLastStart ] = useState<number>(Date.now())
  // const [ lastStop, setLastStop ] = useState<number>(0)
  const [ timerRunning, setTimerRunning ] = useState(false)


  const refreshRate = 85 // in ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeRemaining())
    }, refreshRate)
    return () => clearTimeout(timer)
  })

  const calculateTimeRemaining = (currentTime: number = Date.now()) => {
    return timeLeftAtLastStop - (timerRunning ? (currentTime - lastStart) : 0)
  }

  const toggle = () => {
    const currentTime = Date.now()
    setTimeLeft(calculateTimeRemaining(currentTime))
    if (timerRunning) {
      setTimeLeftAtLastStop(calculateTimeRemaining(currentTime))
    } else {
      setLastStart(currentTime)
    }
    setTimerRunning(!timerRunning)
  }

  const formattedTimeLeft = () => {
    const ms: number = timeLeft
    const points = Math.floor(ms / 100) % 10
    const seconds = Math.floor((ms / 1000)) % 60
    const minutes = Math.floor(ms / (1000 * 60)) % 60
    return `${minutes}:${seconds < 10 ? "0" :""}${seconds}.${points}`
  }

  //TODO: handle timer going into negative range
  return (
    <>
      <View style={styles.container}>
      {/* <View> */}
        <View>
          <Button buttonStyle={styles.add_time} icon={
            <Icon
                name="plus"
                size={40}
                color="white"
              />}
            />
        </View>
        <View>
          <Text style={styles.text}>{formattedTimeLeft()} </Text>
        </View>
        <View>
          <Button
            buttonStyle={styles.play_pause}
            icon={timerRunning ?
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
            onPress={toggle}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    alignSelf: 'center',
  },
  play_pause: {
    justifyContent: 'center',
    backgroundColor: '#9C9C9C',
    width: '50%',
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
    width: '100%',
    alignSelf: 'center',
    flexDirection:'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  add_time: {
    justifyContent: 'center',
    backgroundColor: '#9C9C9C',
    width: '50%',
    alignSelf: 'center',
  }
});