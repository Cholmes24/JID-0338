import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { View, StyleSheet } from 'react-native'
import { Text, Input } from 'react-native-elements'

export default function ConnectionChecker() {
  const dispatch = useAppDispatch()
  const hostIP = true // useAppSelector(state => state.hostIPAddress)
  const [ inputText, setInputText ] = useState("")

  const conectionEstablished = hostIP !== undefined

  const changeHandler = (input: string) => {
    setInputText(input)
  }

  return (
    <View style={styles.container} >
      {hostIP
        ?  <Text style={styles.text} >Valid Host</Text>
        : <Input
            style={styles.input}
            value={inputText}
            onChangeText={changeHandler}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // textAlign: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    margin: '10%',
    fontSize: 30,
    flexDirection: "row",
  },
  text: {
    color: "red",
    marginHorizontal: 5,
  },
  input: {
    // width: "95%",
    backgroundColor: "#C0C0C0",
    flex: 1,
    borderRadius: 8,
  },
})