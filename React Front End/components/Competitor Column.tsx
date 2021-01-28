import React from 'react'
import { Button, ColorValue, FlatList, StyleSheet } from 'react-native'
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

  const styles = StyleSheet.create({
    container: {
      alignSelf: "flex-start",
      flex: 1,
      paddingTop: 22,
      paddingHorizontal: 10,
      // alignContent: "space-around"
      // justifyContent: "center"
    },
    item: {
      padding: 10,
      fontSize: 16,
      height: 44,
      color
    },
    list : {
      flex: 2
    },
    title: {
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
      flex: 1.5,
    }
  });
  const button1 = () => <Button
    color={color}
    title="Button 1"
    onPress={() => (undefined)}
  />
  const button2 = () => <Button
    color={color}
    title="Button 2"
    onPress={() => (undefined)}
  />
  const buttons = [
    { key: "button1", comp: button1 },
    { key: "button2", comp: button2 }
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <ScoreCounter side={side} />
      <FlatList style={styles.list}
        data={buttons}
        renderItem={({item}) => <View style={styles.item}>{item.comp()}</View>}
      />
    </View>
  );
}

