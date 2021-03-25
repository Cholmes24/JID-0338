import { AntDesign } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ColorValue, GestureResponderEvent, Pressable, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Text, View } from './Themed'
import { RootType } from '../redux-types/storeTypes'
import { DecreaseScoreAction, IncreaseScoreAction, MatchesAction, MatchScoringAction, ScoringActionType } from '../redux-types/actionTypes'

type ScoreCounterProps = {
  matchId: number,
  fighterScoringKey: "fighter1Scoring" | "fighter2Scoring",
  fontSize?: number,
  color?: ColorValue
}

export default function ScoreCounter({matchId, fighterScoringKey, fontSize = 70, color}: ScoreCounterProps) {
  const dispatch = useDispatch()
  const match = useSelector((state: RootType) => state.matches.find(m => m.id === matchId))
  // const fighter = useSelector((state: RootType) => state.fighters.find(c => c.id === fighterId))
  if (!match) {
    throw Error("INVALID ID")
  }
  const getColorToUse = () => {
    if (!color) {
      const fighterNumber = fighterScoringKey === "fighter1Scoring" ? "fighter1Id" : "fighter2Id"
      const fighter = useSelector((state: RootType) => state.fighters.find((f) => f.id === match[fighterNumber]))
      if (!fighter) {
        throw Error("MATCH WITH INVALID FIGHTER ID")
      }
      return fighter.color
    } else {
      return color
    }
  }

  // const colorToUse = getColorToUse()
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

  const affectStore = (inner: ScoringActionType) => outer(middle(inner))

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
      backgroundColor: color,
      backfaceVisibility: "hidden",
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
      <ArrowButton
        iconName="caretup"
        onPress={() => dispatch(affectStore(increase))}
        fontSize={fontSize}
      />
      <Text style={styles.scoreBox} >{score}</Text>
      <ArrowButton
        iconName="caretdown"
        onPress={() => score > 0 ? dispatch(affectStore(decrease)) : undefined}
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
