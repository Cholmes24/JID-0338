import React, { useState } from 'react'
import { GestureResponderEvent, View, StyleSheet } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { useAppSelector } from '../hooks/reduxHooks'
import { Match } from '../redux-types/storeTypes'

export default function MatchSelectionButton({
  matchID,
  onPress,
  name
}: {
  matchID: number,
  onPress: (event: GestureResponderEvent) => void,
  name: string
}) {
  const matches = useAppSelector(state => state.matches)
  const timerRunning = matches.find(m => m.ID === matchID)?.timer.isRunning
  // const timerRunning = item.timer.isRunning
  // const [ hasIcon, setHasIcon ] = useState(false)

  // useState(() => {

  // }, [ timerRunning ])

  const styles = StyleSheet.create({
    buttonWrapper: {
      textAlign: 'center',
      width: '100%',
    },
    entry: {
      width: '95%',
      padding: '10%',
      marginTop: '5%',
      marginBottom: '5%',
      borderRadius: 15,
      alignSelf: "center",
      paddingHorizontal: 5
    },
  })

  return (
    <View style={styles.buttonWrapper}>
      <Button
        buttonStyle={styles.entry}
        onPress={onPress}
        title={name}
        iconRight={true}
        icon={
          timerRunning
          && <Icon
              name='stopwatch'
              type='font-awesome-5'
          />
        }
      />
    </View>
  )
}