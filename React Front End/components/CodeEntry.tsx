import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import useColorScheme from '../hooks/useColorScheme'
import { LinearGradient } from 'expo-linear-gradient'

import { View, Text } from './Themed'
import Button from './Button'
import { convertIPAddress, determineIP } from '../util/utilFunctions'

type CodeEntryProps = {
  codeLength?: number
  onSubmit: (accessCode: string) => void
}

const cellWidth = 40

export default function CodeEntry({ codeLength = 6, onSubmit }: CodeEntryProps) {
  const codeTemplate = new Array(codeLength).fill(0)
  const [textEntered, setTextEntered] = useState('')
  const [focused, setFocused] = useState(false)

  const characters = textEntered.split('')
  const input = useRef(null)

  // @ts-ignore
  const handlePress = () => input.current.focus()
  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)
  function handleChange(input: string) {
    if (input.length <= codeLength) {
      setTextEntered((textEntered + input).toLocaleUpperCase().trim().slice(0, codeLength))
    }
  }
  const handleDelete = (key: string) => {
    if (key === 'Backspace') {
      setTextEntered(textEntered.slice(0, textEntered.length - 1))
    }
  }

  const theme = useColorScheme()

  // const borderColor = theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.4)'
  const borderColor = '#cccccc'
  const borderRightColor = borderColor
  // const borderRightColor = 'black'


  const selectedIndex = characters.length < codeLength ? characters.length : codeLength - 1

  const shouldHighlight = (index: number) =>
    focused &&
    (selectedIndex === index || (characters.length === codeLength && index === codeLength - 1))

  const setStyleForBox = (index: number) =>
    index === codeLength - 1
      ? [styles.display, { borderRightColor }, styles.noBorder]
      : [styles.display, { borderRightColor }]

  const [ipGuess, setIpGuess] = useState('')
  useEffect(() => {
    dispIpGuess()
  }, [textEntered])

  async function dispIpGuess() {
    if (textEntered.length === codeLength) {
      const ip = await determineIP(textEntered)
      setIpGuess(convertIPAddress(ip))
    } else {
      setIpGuess('')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Enter the access code to connect</Text>

      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={[styles.wrap, { borderColor }]}>
          {codeTemplate.map((_, index) => {
            return (
              <View style={setStyleForBox(index)} key={index}>
                <Text style={styles.text}>{characters[index] || ''}</Text>
                {shouldHighlight(index) && <View style={styles.shadows} />}
              </View>
            )
          })}
        </View>
        <View style={[styles.wrap, { borderWidth: 0 }]}>
          <TextInput
            value=""
            autoCapitalize={'characters'}
            autoCorrect={false}
            ref={input}
            onChangeText={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={(e) => handleDelete(e.nativeEvent.key)}
            style={[
              styles.input,
              {
                left: selectedIndex * cellWidth,
                opacity: characters.length >= codeLength ? 0 : 1,
              },
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.button}>
        <Button
          content={() => <Text style={[styles.buttonText]}>Connect</Text>}
          onPress={() => onSubmit(textEntered)}
        />
<<<<<<< HEAD
      </View>
      <Text style={styles.ipText}>{test}</Text>
=======
      </LinearGradient>
      <Text style={styles.ipText}>{ipGuess}</Text>
>>>>>>> d7d077519112929d57d3bed218a832aa5f189309
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  wrap: {
    borderWidth: 2,
    position: 'relative',
    flexDirection: 'row',
  },
  display: {
    borderRightWidth: 1,
    width: cellWidth,
    height: cellWidth * 1.7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  noBorder: {
    borderRightWidth: 0,
  },
  text: {
    fontSize: cellWidth * 0.8,
    zIndex: 4,
    color: '#474747'
  },
  input: {
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
    width: cellWidth,
    top: 0,
    bottom: 0,
  },
  shadows: {
    position: 'absolute',
    zIndex: 3,
    left: -5,
    right: -5,
    top: -5,
    bottom: -5,
    borderWidth: 4,
<<<<<<< HEAD
    borderColor: '#a7a7a7',
    // borderColor: 'white',
    // backgroundColor: 'transparent',
=======
    borderColor: 'rgba(160, 160, 160, 0.8)',
>>>>>>> d7d077519112929d57d3bed218a832aa5f189309
  },
  buttonText: {
<<<<<<< HEAD
    fontSize: cellWidth * 0.5,
    color: '#474747',
=======
    fontWeight: 'bold',
    fontSize: cellWidth * 0.6,
    color: '#111111',
>>>>>>> d7d077519112929d57d3bed218a832aa5f189309
  },
  button: {
    maxHeight: cellWidth * 1,
<<<<<<< HEAD
    width: cellWidth * 3,
=======
    width: cellWidth * 5,
>>>>>>> d7d077519112929d57d3bed218a832aa5f189309
    flex: 1,
    marginTop: 20,
    padding: 5,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  ipText: {
    height: cellWidth,
    fontSize: 15,
    margin: 5,
  },
  instructions: {
    // flex: 1,
    borderRadius: 15,
    // paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: 30,
    backfaceVisibility: 'hidden',
    color: 'white',  
    marginBottom: 50,
    marginTop: 100,
    marginHorizontal: 50
  },
})
