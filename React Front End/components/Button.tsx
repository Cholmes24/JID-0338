import React from "react"
import { ColorValue, GestureResponderEvent, Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native"
import { Text } from './Themed'

export type ButtonProps = {
  content: () => JSX.Element,
  onPress: ((event: GestureResponderEvent) => void) | null | undefined,
  color?: ColorValue,
  fontSize?: number
}

export default function Button({content, onPress, color, fontSize = 18}: ButtonProps) {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: color,
      borderRadius: 15,
      padding: 6,
      // height: 50,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      flex: 1,
      shadowRadius: 4
    }
  })

  return (
    <Pressable onPress={onPress} style={styles.button} >
      {content()}
    </Pressable>
  )
}