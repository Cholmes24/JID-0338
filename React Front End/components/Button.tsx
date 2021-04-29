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

  const timeOut = 100
  const pressForColor = () => {
    setButtonColor(pressedColor)
    setTimeout(() => {
      setButtonColor(raisedColor)
    }, timeOut)
  }

  const pressableStyle = () =>
    invertColor
      ? styles.button
      : [styles.button, styles.uninvertedButton, { backgroundColor: buttonColor }]

  const contentStyle = () => (invertColor ? [buttonColor] : [])

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={pressForColor}
      onPressOut={() => setButtonColor(raisedColor)}
      style={({ pressed }) => [
        pressableStyle(),
        !invertColor &&
          pressed && {
            backgroundColor: pressedColor,
          },
      ]}
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
