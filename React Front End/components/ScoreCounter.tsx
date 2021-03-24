import { AntDesign, Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ColorValue, FlatList, GestureResponderEvent, Pressable, StyleProp, StyleSheet, TextStyle } from 'react-native'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import Button from './Button'
import { Text, View } from './Themed'
import { Match, RootType, Scoring } from '../redux-types/storeTypes'
import { DecreaseScoreAction, IncreaseScoreAction, MatchesAction, MatchScoringAction, ScoringActionType } from '../redux-types/actionTypes'

type ScoreCounterProps = {
  matchId: number,
  fighterScoringKey: "fighter1Scoring" | "fighter2Scoring",
  fontSize?: number
}

export default function ScoreCounter({matchId, fighterScoringKey, fontSize = 70}: ScoreCounterProps) {
  const dispatch = useDispatch()
  const match = useSelector((state: RootType) => state.matches.find(c => c.id === matchId))
  // const fighter = useSelector((state: RootType) => state.fighters.find(c => c.id === fighterId))
  if (!match) {
    throw Error("INVALID ID")
  }

  const scoring = match.present[fighterScoringKey]
  const score = scoring.points

  const increase: IncreaseScoreAction = {
    type: "INCREASE_SCORE"
  }
  const decrease: DecreaseScoreAction = {
    type: "DECREASE_SCORE"
  }

  const middle: (innerActionType: ScoringActionType) => MatchScoringAction = (inner) => ({
    type: "MATCH_SCORING",
    payload: {
      scoringAction: inner,
      fighter: fighterScoringKey
    }
  })

  const outer: ((middle: MatchScoringAction) => MatchesAction) = (middle) => ({
    type: "MATCHES",
    matchAction: middle,
    matchId
  })

  const affectScore = (inner: ScoringActionType) => outer(middle(inner))

  const styles = StyleSheet.create({
    arrow: {
      color: "black",
      fontSize: fontSize * 1.8,
      paddingBottom: 5,
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
      // backgroundColor: color,
    },
  })

  const caretupFunction = () => <AntDesign name="caretup" style={styles.arrow}/>

  return (
    <View style={styles.container} >
      <ArrowButton
        iconName="caretup"
        onPress={() => dispatch(affectScore(increase))}
        fontSize={fontSize}
      />
      <Text style={styles.scoreBox} >{score}</Text>
      <ArrowButton
        iconName="caretdown"
        onPress={() => score > 0 ? dispatch(affectScore(decrease)) : undefined}
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
  const pressedColor = "#BEBEBE"
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
      onPressIn={() => setArrowColor("#BEBEBE")}
      onPressOut={() => setArrowColor("white")}
    >
      <AntDesign name={iconName} style={styles.buttonIcon}/>
    </Pressable>
  )
}
