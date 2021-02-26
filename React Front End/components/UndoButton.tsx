import React, { useState } from "react"
import { EvilIcons } from "@expo/vector-icons"
import { GestureResponderEvent, Pressable, StyleProp, StyleSheet } from "react-native"
import { Text, useThemeColor } from './Themed'
import { useDispatch, useSelector, useStore } from "react-redux"
import { MatchState } from "../store/types"
import { call } from "react-native-reanimated"

export default function UndoButton() {
  // const color = useThemeColor({ light: "black", dark: "white"}, "tabIconDefault")
  const fontSize = 35
  const dispatch = useDispatch()
  const callLog = useSelector((state: MatchState) => state.callLog)
  const mostRecentCall = callLog.length > 0 && callLog[callLog.length - 1]
  const pressedColor = "#BEBEBE"
  const [ buttonColor, setButtonColor ] = useState<"white" | typeof pressedColor>("white")

  const styles = StyleSheet.create({
    buttonIcon: {
      color: "black",
      alignSelf: "center",
      fontSize
    },
    pressable: {
      backgroundColor: buttonColor,
      borderRadius: 15,
      padding: 6,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      flex: 1,
      shadowRadius: 4,
      shadowOffset: { width: 1, height: 3 },
      shadowColor: 'black',
      shadowOpacity: 0.4,
    },
  })

  return (
    <Pressable style={styles.pressable}
      onPress={() => callLog ? dispatch({ type: "UNDO_CALL", data: mostRecentCall }) : undefined}
      onPressIn={() => setButtonColor("#BEBEBE")}
      onPressOut={() => setButtonColor("white")}
    >
      <EvilIcons name="undo" style={styles.buttonIcon} />

    </Pressable>
  )
}
