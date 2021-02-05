import React from "react"
import { Feather } from "@expo/vector-icons"
import { EvilIcons } from "@expo/vector-icons"
import { ColorValue, GestureResponderEvent, Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native"
import { Text, useThemeColor } from './Themed'
import Button from "./Button"
import { useDispatch, useSelector } from "react-redux"
import { MatchState } from "../store/types"
import { undoLastCall } from "../reducers/CompetitorReducer"

export type UndoButtonProps = {
  onPress: ((event: GestureResponderEvent) => void) | null | undefined,
  fontSize?: number
}

export default function UndoButton({onPress, fontSize = 35}: UndoButtonProps) {
  const color = useThemeColor({ light: "black", dark: "white"}, "tabIconDefault")

  const dispatch = useDispatch()
  const matchState = useSelector((state: MatchState) => state)

  const styles = StyleSheet.create({
    buttonArea: {
      backgroundColor: "white",
      borderRadius: 6,
      padding: 5,
      paddingBottom: 15,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      flex: 1,
      // shadowOffset: {
      //   width: 3,
      //   height: 5
      // },
      // shadowColor: "grey",
      shadowRadius: 1,
      color,
    },
    button: {
      color: "black",
      alignSelf: "center",
      fontSize
    }
  })

  return (
    <Button
      content={() => <EvilIcons name="undo" style={styles.button} />}
      onPress={() => dispatch(undoLastCall(matchState))}
      color="white"
    />
  )
}