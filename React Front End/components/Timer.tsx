import React, { useEffect, useState } from 'react'
import { Button,
  Text,
  Icon } from 'react-native-elements'
import {
  View,
  StyleSheet, TextInput, Keyboard } from 'react-native'
import { RootType } from '../redux-types/storeTypes'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import Modal from 'react-native-modal'
import matchService from '../services/match'
import { formatClock, isValidDecimal } from '../util/utilFunctions'
import { addToTimer, toggleTimer, updateTimer } from '../reducers/MatchesReducer'
// import { Text, View } from './Themed'
type TimerProps = {
  matchID: number
}

export default function Timer({ matchID }: TimerProps) {
  const dispatch = useAppDispatch()
  const matches = useAppSelector((state: RootType) => state.matches)
  const timerStore = matches.find(m => m.ID === matchID)?.timer

  if (!timerStore) {
    throw Error("INVALID MATCH ID - TIMER NOT FOUND")
  }

  // Used to trigger the remote update when performing a timer change.
  // Keeps all asynchronous logic in one place.
  // Just alternates between 0 and 1.
  const [ checkTimer, setCheckTimer ] = useState(0)
  const triggerRemoteUpdate = () => setCheckTimer(1 - checkTimer)

  const [ timeAddText, setTimeAddText ] = useState<string>('')
  const [ timeLeft, setTimeLeft ] = useState<number>(timerStore.timeRemaining)
  const [ isModalVisible, setIsModalVisible ] = useState(false)

  const toggleModal = () => setIsModalVisible(!isModalVisible)

  const refreshRate = 85 // in ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (timerStore.isRunning) {
        update()
      }
    }, refreshRate)
    return () => clearTimeout(timer)
  })

  useEffect(() => {
    matchService.updateTimer(timeLeft / 1000, matchID)
  }, [ timerStore.isRunning, checkTimer ] )

  const calculateTimeRemaining = (
    currentTime: number = Date.now()
  ) => (
    Math.max(0, timerStore.timeRemainingAtLastStop - (timerStore.isRunning ? (currentTime - timerStore.timeOfLastStart) : 0))
  )

  const update = () => {
    const timeRemaining = calculateTimeRemaining()
    if (timeRemaining === 0 || timerStore.timeRemaining - timeRemaining > 150) {
      dispatch(updateTimer(matchID, Date.now()))
    }
    setTimeLeft(timeRemaining)
  }

  const toggle = () => dispatch(toggleTimer(matchID, Date.now()))

  const addTime = () => {
    if (isValidDecimal(timeAddText.trim())) {
      const asFloat: number = Number.parseFloat(timeAddText)
      addParticularTime(asFloat * 1000)
      setTimeAddText("")
      setIsModalVisible(false)
      Keyboard.dismiss()
    }
  }

  const addParticularTime = (amountToAdd: number) => {
    const currentTime = Date.now()
    setTimeLeft(timeLeft + amountToAdd)
    dispatch(addToTimer(matchID, currentTime, amountToAdd))
    triggerRemoteUpdate()
  }

  const hasTimeLeft: () => boolean = () => timerStore.timeRemaining > 0
  const timerRunning: () => boolean = () => timerStore.isRunning
  const onChangeText = (input: string) => setTimeAddText(input)

  const icon = (name: string) => <Icon
    name={name}
    type="font-awesome"
    size={40}
    color={"white"}
  />

  return (
    <View style={styles.container}>
      <Button
        buttonStyle={styles.add_time}
        icon={icon("plus")}
        onPress={toggleModal}
      />
      <Text style={styles.text}>{formatClock(timeLeft)} </Text>
      <Button
        buttonStyle={styles.play_pause}
        icon={icon(timerRunning() && hasTimeLeft() ? "pause": "play")}
        onPress={() => (hasTimeLeft() ? toggle() : null)}
      />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {setIsModalVisible(false); Keyboard.dismiss()}}
        backdropOpacity={0.3}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        >
        <View style={styles.modalWindow}>
          <View style={styles.addTray}>
            <Text style={styles.addText} >Seconds:</Text>
            <TextInput
              style={styles.addBox}
              onChangeText={onChangeText}
              value={timeAddText}
              keyboardType="numeric"
              autoFocus={true}
            />
          </View>
          <Button
            buttonStyle={styles.modalAddTime}
            icon={icon("plus")}
            onPress={addTime}
          />
        </View>
      </Modal>
    </View>
  )
}

const buttonDefaults = {
  backgroundColor: '#C0C0C0',
  width: 55,
  marginHorizontal: 25,
  borderRadius: 13,
}

const styles = StyleSheet.create({
  addTray: {
    flexDirection: "row"
  },
  addBox: {
    fontSize: 30,
    backgroundColor: "#C0C0C0",
    fontVariant: ['tabular-nums'],
    margin: 10,
    flex: 1,
    borderRadius: 8,
  },
  addText: {
    fontSize: 30,
    margin: 20,
    flex: 1,
  },
  modalButton: {
    flex: 1
  },
  modalWindow: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 150,
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    alignSelf: 'center',
    marginHorizontal: 5,
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
    marginVertical: 3,
    alignSelf: 'center',
    flexDirection:'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  add_time: {
    ...buttonDefaults,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalAddTime: {
    ...buttonDefaults,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: 20,
  }
})
