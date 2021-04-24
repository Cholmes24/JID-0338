import React from 'react'
import { useState } from 'react'
import { StyleSheet } from 'react-native'
import useColorScheme from '../hooks/useColorScheme'

import { View, Text } from './Themed'

type CodeEntryProps = {
  codeLength?: number
}

export default function CodeEntry({ codeLength = 6 }: CodeEntryProps) {
  const codeTemplate = new Array(6).fill(0)
  const [textEntered, setTextEntered] = useState('')
  const characters = textEntered.split('')

  const theme = useColorScheme()

  const borderColor = theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'
  const borderRightColor = borderColor

  const setStyleForBox = (index: number) =>
    index === codeLength - 1
      ? [styles.display, { borderRightColor }, styles.noBorder]
      : [styles.display, { borderRightColor }]

  return (
    <View style={styles.container}>
      <View style={[styles.wrap, { borderColor }]}>
        {codeTemplate.map((v, index) => {
          return (
            <View style={setStyleForBox(index)} key={index}>
              <Text style={styles.text}>{characters[index] || ''}</Text>
            </View>
          )
        })}
      </View>
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
    borderWidth: 1,
    position: 'relative',
    flexDirection: 'row',
  },
  display: {
    borderRightWidth: 1,
    width: 32,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  noBorder: {
    borderRightWidth: 0,
  },
  text: {
    fontSize: 32,
  },
})
