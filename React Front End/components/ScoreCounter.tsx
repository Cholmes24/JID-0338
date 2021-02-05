import { AntDesign, Feather } from '@expo/vector-icons'
import React from 'react'
import { ColorValue, FlatList, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import competitorReducer, { decreaseScore, increaseScore } from '../reducers/CompetitorReducer'
import { MatchState } from '../store/types'
import { Text, View } from './Themed'

type ScoreCounterProps = {
  side: "left" | "right",
  fontSize?: number
}

export default function ScoreCounter({side, fontSize = 70}: ScoreCounterProps) {
  const dispatch = useDispatch()
  const competitor = useSelector((state: MatchState) => state[side])
  const color = competitor.color
  const score = competitor.score

  const styles = StyleSheet.create({
    arrow: {
      color: "white",
      fontSize: fontSize * 1.8,
      paddingBottom: 5
    },
    scoreBox: {
      height: fontSize * 1.3,
      width: fontSize * 1.3,
      fontSize,
      fontWeight: "bold",
      color: "white",
      // borderColor: "black",
      // borderWidth: 1,
      // backgroundColor: color,
      textAlign: "center",
      textAlignVertical: "center",
      position: "absolute",
    },
    container: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color,
    },
  })

  return (
    <View style={styles.container} >
      <AntDesign name="caretup" style={styles.arrow} onPress={() => dispatch(increaseScore(competitor))} />
      <Text style={styles.scoreBox} >{score}</Text>
      <AntDesign name="caretdown" style={styles.arrow} onPress={() => dispatch(decreaseScore(competitor))} />
    </View>
  )
}

