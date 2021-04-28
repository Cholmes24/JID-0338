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

  const [textColor, setTextColor] = useState<'white' | '#BEBEBE'>('white')
  async function onPress() {
    if (textEntered.length === codeLength || true) {
      setTextColor('#BEBEBE')

      onSubmit(textEntered)
      setTimeout(() => {
        setTextColor('white')
      }, 100)
    }
  }

  const theme = useColorScheme()

  const borderColor = theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.4)'
  const borderRightColor = borderColor

  const selectedIndex = characters.length < codeLength ? characters.length : codeLength - 1

  const shouldHighlight = (index: number) =>
    focused &&
    (selectedIndex === index || (characters.length === codeLength && index === codeLength - 1))

  const setStyleForBox = (index: number) =>
    index === codeLength - 1
      ? [styles.display, { borderRightColor }, styles.noBorder]
      : [styles.display, { borderRightColor }]

  const [test, setTest] = useState('')
  useEffect(() => {
    dispTest()
  }, [textEntered])
  async function dispTest() {
    if (textEntered.length === codeLength) {
      const ip = await determineIP(textEntered)
      setTest(convertIPAddress(ip))
    } else {
      setTest('')
    }
  }

  return (
    <View style={styles.container}>
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
      <LinearGradient
        colors={['#376EDA', '#D43737']}
        style={styles.button}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <Button
          content={() => <Text style={[styles.buttonText]}>Connect</Text>}
          onPress={() => onSubmit(textEntered)}
        />
      </LinearGradient>
      <Text style={styles.ipText}>{test}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: 'rgba(58, 151, 212, 0.36)',
    // backgroundColor: 'transparent',
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: cellWidth * 0.6,
    color: '#111111',
    // color: 'white',
    // marginHorizontal: cellWidth,
    // alignSelf: 'stretch',
    // paddingVertical: 8,
  },

  button: {
    maxHeight: cellWidth * 1,
    // maxWidth: cellWidth * 5,
    // width: '100%',

    width: cellWidth * 5,
    flex: 1,
    marginTop: 20,
    padding: 5,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  ipText: {
    height: cellWidth,
    fontSize: 15,
    margin: 5,
  },
})
