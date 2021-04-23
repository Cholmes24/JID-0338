import React from "react"
import { RootType } from "../redux-types/storeTypes"
import { MatchesAction } from "../redux-types/actionTypes"
import asMatchesAction from "../util/reduxActionWrapper"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import { AppThunk } from '../store'
import matchService from "../services/match"
import Button from './Button'
import { Icon } from "react-native-elements"

export type UndoButtonProps = {
  matchID: number
}

//TODO: Implement Remote functionality with thunks
export default function UndoButton({matchID}: UndoButtonProps) {
  const dispatch = useAppDispatch()
  const matches = useAppSelector((state: RootType) => state.matches)
  const match = matches.find(m => m.ID === matchID)

  if (!match) {
    throw Error("MATCH ID INVALID")
  }

  const { fighter1ID, fighter2ID } = match

  const thunkUndo = (): AppThunk => (
    async dispatch => {
      // TODO: need to test syncing with db
      const lastState = match.past.length !== 0 && match.past[match.past.length - 1]
      const undo: MatchesAction = asMatchesAction({ type: "MATCH_UNDO" }, matchID)
      if (lastState) {
        await matchService.undo(matchID, fighter1ID, fighter2ID, lastState)
        dispatch(undo)
      }
    }
  )

  const onPress = () => dispatch(thunkUndo())
  const content = () => <Icon
    name="undo"
    type="evilicon"
    size={40}
    color="black"
  />

  return (
    <Button
      onPress={onPress}
      content={content}
    />
  )
}
