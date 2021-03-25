import React, { useState } from "react"
import Icon from "react-native-vector-icons/EvilIcons"
import { Pressable, StyleSheet } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { RootType, Match } from "../redux-types/storeTypes"
import { MatchesAction } from "../redux-types/actionTypes"
import asMatchesAction from "../util/reduxActionWrapper"
// import { Icon } from "react-native-elements"

export type UndoButtonProps = {
  matchId: number
}

export default function UndoButton({matchId}: UndoButtonProps) {
  // const color = useThemeColor({ light: "black", dark: "white"}, "tabIconDefault")
  const match = useSelector((state: RootType) => state.matches.find((m: Match) => m.id === matchId))
  if (!match) {
    throw Error("MATCH ID INVALID")
  }
  const fontSize = 35
  const dispatch = useDispatch()

  const undo: MatchesAction = asMatchesAction({ type: "MATCH_UNDO" }, matchId)

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
      onPressIn={() => match.past.length !== 0 ? setButtonColor("#BEBEBE") : null}
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
