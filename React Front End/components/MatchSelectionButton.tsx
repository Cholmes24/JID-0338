import React from 'react'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { useAppSelector } from '../hooks/reduxHooks'

export type MatchSelectionButtonProps = {
  buttonStyle: StyleProp<ViewStyle>,
  matchID: number,
  onPress: (event: GestureResponderEvent) => void,
  title: string
}

export default function MatchSelectionButton({  matchID, ...props }: MatchSelectionButtonProps) {
  const matches = useAppSelector(state => state.matches)
  const timerRunning = matches.find(m => m.ID === matchID)?.timer.isRunning

  return (
    <Button
      { ...props }
      iconRight={true}
      icon={timerRunning
        && <Icon
          name='stopwatch'
          type='font-awesome-5'
          />
      }
    />
  )
}