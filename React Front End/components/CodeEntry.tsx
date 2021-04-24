import React, { useRef } from 'react'
import { useState } from 'react'
import { Keyboard, StyleSheet, TextInput } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import useColorScheme from '../hooks/useColorScheme'

import { View, Text } from './Themed'

type CodeEntryProps = {
  codeLength?: number
}

const cellWidth = 45

export default function CodeEntry({ codeLength = 6 }: CodeEntryProps) {
  const codeTemplate = new Array(6).fill(0)
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

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <View style={[styles.wrap, { borderColor }]}>
          {codeTemplate.map((v, index) => {
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
      </View>
    </TouchableWithoutFeedback>
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
    width: cellWidth, // '12%',
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
    fontSize: 32,
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
})
