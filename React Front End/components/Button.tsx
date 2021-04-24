import React, { useState } from 'react'
import { GestureResponderEvent, Pressable, ColorValue, StyleSheet } from 'react-native'

export type ButtonProps = {
  invertColor?: boolean
  content: (color?: string | ColorValue) => JSX.Element
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined
  disabled?: boolean
}

export default function Button({
  invertColor = false,
  content,
  onPress,
  disabled = false,
}: ButtonProps) {
  const pressedColor = '#BEBEBE'
  const raisedColor = 'white'
  const [buttonColor, setButtonColor] = useState<typeof raisedColor | typeof pressedColor>(
    raisedColor
  )

  const pressableStyle = () =>
    invertColor
      ? styles.button
      : [styles.button, styles.uninvertedButton, { backgroundColor: buttonColor }]

  const contentStyle = () => (invertColor ? [buttonColor] : [])

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setButtonColor(pressedColor)}
      onPressOut={() => setButtonColor(raisedColor)}
      style={pressableStyle()}
    >
      {content(...contentStyle())}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  uninvertedButton: {
    elevation: 5,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 3 },
    shadowColor: 'black',
    shadowOpacity: 0.4,
  },
})
