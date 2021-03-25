import React, { useState } from "react"
import Icon from "react-native-vector-icons/EvilIcons"
import { GestureResponderEvent, Pressable, StyleProp, StyleSheet } from "react-native"
import { Text, useThemeColor } from './Themed'
import { RootStateOrAny, useDispatch, useSelector, useStore } from "react-redux"
import { RootType, Match } from "../redux-types/storeTypes"
import { MatchActionType, MatchesAction, MatchUndoAction } from "../redux-types/actionTypes"
// import { Icon } from "react-native-elements"

export type UndoButtonProps = {
  matchId: number
}

export default function UndoButton({matchId}: UndoButtonProps) {
  // const color = useThemeColor({ light: "black", dark: "white"}, "tabIconDefault")
  const match = useSelector((state: RootType) => state.matches.find((m: Match) => m.id === matchId))

  const fontSize = 35
  const dispatch = useDispatch()
  // const callLog = useSelector((state: MatchState) => state.callLog)
  // const callLog = useSelector((state: RootStateOrAny) => state)
  // throw Error(callLog.toString())

  // const mostRecentCall = callLog.length > 0 && callLog[callLog.length - 1]

  const undo: MatchesAction = {
    type: "MATCHES",
    matchAction: { type: "MATCH_UNDO" },
    matchId
  }

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
      onPress={() => dispatch(undo)}
      onPressIn={() => setButtonColor("#BEBEBE")}
      onPressOut={() => setButtonColor("white")}
    >
      <Icon
        name="undo"
        size={40}
        color="black"
      />
    </Pressable>
  )
}
