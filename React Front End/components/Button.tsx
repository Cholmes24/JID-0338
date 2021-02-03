import React from "react"
import { ColorValue, GestureResponderEvent, Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native"
import { Text } from './Themed'

export type ButtonProps = {
  title: string,
  onPress: ((event: GestureResponderEvent) => void) | null | undefined,
  color: ColorValue,
  fontSize?: number
}

export default function Button({title, onPress, color, fontSize}: ButtonProps) {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: color,
      borderRadius: 6,
      padding: 6,
      // height: 50,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      flex: 1
    },
    text: {
      fontSize
    }
  })

  return (
    <Pressable onPress={onPress} style={styles.button} >
      <Text style={styles.text} >{title}</Text>
    </Pressable>
  )
}