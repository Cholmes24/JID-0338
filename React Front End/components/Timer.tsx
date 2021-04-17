import React, { useEffect, useState } from 'react'
import { Button, Text } from 'react-native-elements'
import { View, StyleSheet, TextInput, useColorScheme, Keyboard } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootType } from '../redux-types/storeTypes'
import asMatchesAction from '../util/reduxActionWrapper'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import Modal from 'react-native-modal'
import matchService from '../services/match'

type TimerProps = {
  matchId: number
}

//TODO: implement remote functionality
export default function Timer({matchId}: TimerProps) {
  const dispatch = useAppDispatch()
  const matches = useAppSelector((state: RootType) => state.matches)
  const timerStore = matches.find(m => m.id === matchId)?.timer
  const theme = useColorScheme()

  if (!timerStore) {
    throw Error("INVALID MATCH ID - TIMER NOT FOUND")
  }

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
    matchService.updateTimer(timeLeft / 1000, matchId)
  }, [ timerStore.isRunning ] )

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
    if (isValidDecimal(timeAddText.trim())) {
      const asFloat: number = Number.parseFloat(timeAddText)
      addParticularTime(asFloat * 1000)
      setTimeAddText("")
      setIsModalVisible(false)
      Keyboard.dismiss()
    }
  }

  const quickAddTime = () => {
    addParticularTime(10000)
  }

  const addParticularTime = (amountToAdd: number) => {
    const currentTime = Date.now()
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
  const onChangeText = (input: string) => setTimeAddText(input)

  const styles = StyleSheet.create({
    addTray: {
      flexDirection: "row"
    },
    addBox: {
      fontSize: 30,
      backgroundColor: "#C0C0C0",
      fontVariant: ['tabular-nums'],
      margin: 10,
      // alignSelf: "center",
      flex: 1,
      borderRadius: 8,
    },
    addText: {
      fontSize: 30,
      margin: 20,
      flex: 1,
    },
    // modalFiller: {
    //   flex: 1,
    // },
    modalButton: {
      flex: 1
    },
    modalWindow: {
      // height: 200,
      backgroundColor: "white",
      borderRadius: 8,

      marginBottom: 150,
      // justifyContent: 'center',
      // alignSelf: 'center',
      // alignItems: 'center',
      // flex: 1,
    },
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
    },
    modalAddTime: {
      ...buttonDefaults,
      justifyContent: 'center',
      alignSelf: 'flex-end',
      // marginVertical: 10,
      // paddingLeft: 50,
      marginBottom: 20,
      // shadowRadius: 4,
      // shadowOffset: { width: 1, height: 3 },
      // shadowColor: 'black',
      // shadowOpacity: 0.4,
    }
  });
  return (
    <View style={styles.container}>
      {/* <Button
        buttonStyle={styles.add_time}
        disabled={!timerRunning()}
        icon={
          <Icon
              name="plus"
              size={40}
              color="white"
            />
          }
        onPress={addTime}
      /> */}
      <Button
        buttonStyle={styles.add_time}
        icon={
          <Icon
              name="plus"
              size={40}
              color="white"
            />
          }
        onPress={toggleModal}
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
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {setIsModalVisible(false); Keyboard.dismiss()}}
        backdropOpacity={0.3}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        >
        <View style={styles.modalWindow}>
          <View style={styles.addTray}>
            <Text style={styles.addText} >Seconds: </Text>
            <TextInput
              // placeholder="seconds"
              style={styles.addBox}
              onChangeText={onChangeText}
              value={timeAddText}
              keyboardType="numeric"
              autoFocus={true}
            />
          </View>
          <Button
            buttonStyle={styles.modalAddTime}
            icon={
              <Icon
                name="plus"
                size={40}
                color="white"
              />
            }
            onPress={addTime}
          />
        </View>
      </Modal>
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

const isValidDecimal = (input: string) => (RegExp(/\d*((\.d+)|(\d\.?))/).test(input))