import { Feather } from '@expo/vector-icons'
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

export default function ScoreCounter({side, fontSize = 60}: ScoreCounterProps) {
  const dispatch = useDispatch()
  const competitor = useSelector((state: MatchState) => state[side])
  const color = competitor.color
  const score = competitor.score
  // const count = competitor.score


  const [count, setCount] = React.useState(0)
  const styles = StyleSheet.create({
    arrow: {
      color,
      fontSize: fontSize * 2,
    },
    scoreBox: {
      height: fontSize * 1.2,
      width: fontSize * 1.2,
      fontSize,
      color: color === "white" ? "black" : "white",
      borderColor: "black",
      borderWidth: 1,
      backgroundColor: color,
      textAlign: "center",
      textAlignVertical: "center",
      position: "absolute"
    },
    container: {
      alignItems: "center",
      justifyContent: "center",

    },
  })

  const incrementCount = () => setCount(count + 1)
  const decrementCount = () => count > 0 ? setCount(count - 1) : setCount(count)

  // const incrementCount = () => dispatch(increaseScore)
  // const decrementCount = () => dispatch(decreaseScore)

  return (
    <View style={styles.container} >
      <Feather name="chevron-up" style={styles.arrow} onPress={() => dispatch(increaseScore(competitor))} />
      <Text style={styles.scoreBox} >{score}</Text>
      <Feather name="chevron-down" style={styles.arrow} onPress={() => dispatch(decreaseScore(competitor))} />
    </View>
  )
}

