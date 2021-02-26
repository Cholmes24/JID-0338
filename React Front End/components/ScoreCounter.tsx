import { AntDesign, Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ColorValue, FlatList, GestureResponderEvent, Pressable, StyleProp, StyleSheet, TextStyle } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { MatchState } from '../store/types'
import Button from './Button'
import { Text, View } from './Themed'

type ScoreCounterProps = {
  id: string,
  fontSize?: number
}

export default function ScoreCounter({id, fontSize = 70}: ScoreCounterProps) {
  const dispatch = useDispatch()
  const competitor = useSelector((state: MatchState) => state.competitors.find(c => c.id === id))
  if (!competitor) {
    throw Error("INVALID ID")
  }
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

  const caretupFunction = () => <AntDesign name="caretup" style={styles.arrow}/>

  return (
    <View style={styles.container} >
      <ArrowButton
        iconName="caretup"
        onPress={() => dispatch({ type: "INCREASE_SCORE", competitorId: id })}
        fontSize={fontSize}
      />
      <Text style={styles.scoreBox} >{score}</Text>
      <ArrowButton
        iconName="caretdown"
        onPress={() => score > 0 ? dispatch({ type: "DECREASE_SCORE", competitorId: id }) : undefined}
        fontSize={fontSize}
      />
    </View>
  )
}

function ArrowButton({iconName, onPress, fontSize}: {
  iconName: "caretdown" | "caretup",
  onPress: ((event: GestureResponderEvent) => void) | undefined,
  fontSize: number
}){
  const pressedColor = "grey"
  const [ arrowColor, setArrowColor ] = useState<"white" | typeof pressedColor>("white")

  const styles = StyleSheet.create({
    buttonSurrounding: {
      // borderRadius: 15,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    buttonIcon: {
      color: arrowColor,
      fontSize: fontSize * 1.8,
      paddingBottom: 5
    }
  })

  return (
    <Pressable onPress={onPress} style={styles.buttonSurrounding}
      onPressIn={() => setArrowColor("grey")}
      onPressOut={() => setArrowColor("white")}
    >
      <AntDesign name={iconName} style={styles.buttonIcon}/>
    </Pressable>
  )
}
