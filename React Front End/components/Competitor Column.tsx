import React from 'react'
import { Button, ColorValue, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { MatchState } from '../store/types'
import ScoreCounter from './ScoreCounter'
import { View, Text } from './Themed'

export type CompetitorColumnProps = {
  side: "left" | "right"
}

export default function CompetitorColumn({side}: CompetitorColumnProps) {
  const competitor = useSelector((state: MatchState) => state[side])
  const color = competitor.color
  const name = competitor.name
  const testBorders = {
    borderColor: "yellow",
    borderWidth: 2,
  }
  const styles = StyleSheet.create({
    container: {
      // For testing purposes to align things
      ...testBorders,



      alignSelf: "stretch",
      flex: 1,
      paddingTop: 22,
      paddingHorizontal: 10,
    },
    button: {
      // For testing purposes to align things
      ...testBorders,

      padding: 2,

      fontSize: 18,
      height: 44,
      flex: 1,
      color
    },
    buttonList: {
      // For testing purposes to align things
      ...testBorders,

      flex: 1.5,
    },
    title: {
      // For testing purposes to align things
      ...testBorders,

      flex: 1,
      alignSelf: "center",
      alignContent: "center",
      textAlign: "center",
      fontSize: 20,
      // height: 44,
      fontWeight: "bold",
      color
    },
    scoreCounter: {
      // For testing purposes to align things
      ...testBorders,

      flex: 4
    }
  });
  const button1 = () => <View style={styles.button} >
  <Button
    color={color}
    title="Button 1"
    onPress={() => (undefined)}
  />
</View>
  const button2 = () => <View style={styles.button} >
    <Button
      color={color}
      title="Button 2"
      onPress={() => (undefined)}
    />
  </View>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.scoreCounter}>
        <ScoreCounter side={side} />
      </View>
      <View style={styles.buttonList} >
        {button1()}
        {button2()}
      </View>
    </View>
  );
}

