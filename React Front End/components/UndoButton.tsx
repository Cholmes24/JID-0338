import React, { useState } from "react"
import Icon from "react-native-vector-icons/EvilIcons"
import { Pressable, StyleSheet } from "react-native"
import { RootType } from "../redux-types/storeTypes"
import { MatchesAction } from "../redux-types/actionTypes"
import asMatchesAction from "../util/reduxActionWrapper"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import { AppThunk } from '../store'
import matchService from "../services/match"
// import { Icon } from "react-native-elements"

export type UndoButtonProps = {
  matchId: number
}

//TODO: Implement Remote functionality with thunks
export default function UndoButton({matchId}: UndoButtonProps) {
  const dispatch = useAppDispatch()
  // const color = useThemeColor({ light: "black", dark: "white"}, "tabIconDefault")
  const matches = useAppSelector((state: RootType) => state.matches)
  const match = matches.find(m => m.id === matchId)

  if (!match) {
    throw Error("MATCH ID INVALID")
  }

  const { fighter1Id, fighter2Id } = match
  const fontSize = 35

  const undo: MatchesAction = asMatchesAction({ type: "MATCH_UNDO" }, matchId)

  const pressedColor = "#BEBEBE"
  const [ buttonColor, setButtonColor ] = useState<"white" | typeof pressedColor>("white")

  const thunkUndo = (): AppThunk => (
    async dispatch => {
      // TODO: need to test syncing with db
      const lastState = match.past.length !== 0 && match.past[match.past.length - 1]
      if (lastState) {
        matchService.undo(matchId, fighter1Id, fighter2Id, lastState)
        dispatch(undo)
      }
    }
  )

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
      onPress={() => dispatch(thunkUndo())}
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
