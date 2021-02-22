import React, { useState } from "react"
import { ColorValue, GestureResponderEvent, Pressable, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native"
import { Text } from './Themed'

export type ButtonProps = {
  content: () => JSX.Element,
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined,
  fontSize?: number,
}

export default function Button({content, onPress, fontSize = 18}: ButtonProps) {
  const pressedColor = "grey"
  const [ buttonColor, setButtonColor ] = useState<"white" | typeof pressedColor>("white")
  const styles = StyleSheet.create({
    button: {
      backgroundColor: buttonColor,
      borderRadius: 15,
      padding: 6,
      // height: 50,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      flex: 1,
      shadowRadius: 4
    },
  })

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setButtonColor("grey")}
      onPressOut={() => setButtonColor("white")}
      style={styles.button}

    >
      {content()}
    </Pressable>
  )
}