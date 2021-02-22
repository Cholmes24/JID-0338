import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button, Text } from 'react-native'

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


  return (
    <>
      <Text>{formattedTimeLeft()} </Text>
      <Button title={timerRunning ? "Stop" : "Start"} onPress={toggle} />
    </>
  )
}