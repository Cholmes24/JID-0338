import { AntDesign } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ColorValue, GestureResponderEvent, Pressable, StyleSheet } from 'react-native'
import { Text, View } from './Themed'
import { RootType } from '../redux-types/storeTypes'
import asMatchesAction from '../util/reduxActionWrapper'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { AppThunk } from '../store'
import matchService from "../services/match"
import UIfx from 'uifx'
import daggerWooshAudio from '../assets/sounds/dagger-woosh.wav'
import knifeHitAudio from '../assets/sounds/knife-fast-hit.wav'
import swordHitAudio from '../assets/sounds/medieval-metal-sword.wav'
import metalWooshAudio from '../assets/sounds/metal-hit-woosh.wav'
import armorHitAudio from '../assets/sounds/sword-strikes-armor.wav'
import ouchAudio from '../assets/sounds/human-fighter-scream.wav'
import woodHitAudio from '../assets/sounds/wood-hard-hit.wav'
import _ from 'lodash'

const config = {
  volume: 0.2,
  throttleMs: 120
}

const dagger = new UIfx(daggerWooshAudio, config)
const ouch = new UIfx(ouchAudio, config)
const knife = new UIfx(knifeHitAudio, config)
const sword = new UIfx(swordHitAudio, config)
const metal = new UIfx(metalWooshAudio, config)
const armor = new UIfx(armorHitAudio, config)
const wood = new UIfx(woodHitAudio, config)

const positive = [dagger, knife, sword, metal, armor]
const negative: UIfx[] = new Array(10).fill(wood).concat(ouch)

type ScoreCounterProps = {
  matchId: number,
  fighterScoringKey: "fighter1Scoring" | "fighter2Scoring",
  fontSize?: number,
  color?: ColorValue
}

export default function ScoreCounter({matchId, fighterScoringKey, fontSize = 70, color}: ScoreCounterProps) {
  const dispatch = useAppDispatch()
  const fighters = useAppSelector((state: RootType) => state.fighters)
  const matches = useAppSelector((state: RootType) => state.matches)
  const match = matches.find(m => m.id === matchId)
  // const fighter = useSelector((state: RootType) => state.fighters.find(c => c.id === fighterId))
  if (!match) {
    throw Error("INVALID ID")
  }
  const getColorToUse = () => {
    if (!color) {
      const fighterNumber = fighterScoringKey === "fighter1Scoring" ? "fighter1Id" : "fighter2Id"
      const fighter = fighters.find((f) => f.id === match[fighterNumber])
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

  const thunkIncrease = (): AppThunk => (
    async dispatch => {
      const updatedMatch = await matchService.increaseScore(fighterScoringKey, matchId)
      if (updatedMatch.present !== match.present) {
        dispatch(increaseAction)
      }
    }
  )
  const thunkDecrease = (): AppThunk => (
    async dispatch => {
      if (score > 0) {
        const updatedMatch = await matchService.decreaseScore(fighterScoringKey, matchId)
        if (updatedMatch.present !== match.present) {
          dispatch(decreaseAction)
        }
      }
    }
  )

  const increaseAction = asMatchesAction({
    type: "INCREASE_SCORE"
  }, matchId, fighterScoringKey)

  const decreaseAction = asMatchesAction({
    type: "DECREASE_SCORE"
  }, matchId, fighterScoringKey)

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
  const onUpPress = () => {
    positive[_.random(0, positive.length - 1)].play()
    dispatch(thunkIncrease())
  }

  const onDownPress = () => {
    if (score > 0) {
      negative[_.random(0, negative.length - 1)].play()
      dispatch(thunkDecrease())
    }
  }

  return (
    <View style={styles.container} >
      <ArrowButton
        iconName="caretup"
        onPress={onUpPress}
        fontSize={fontSize}
      />
      <Text style={styles.scoreBox} >{score}</Text>
      <ArrowButton
        iconName="caretdown"
        onPress={onDownPress}
        fontSize={fontSize}
        disabled={score <= 0}
      />
    </View>
  )
}

function ArrowButton({iconName, onPress, fontSize, disabled = false}: {
  iconName: "caretdown" | "caretup",
  onPress: ((event: GestureResponderEvent) => void) | undefined,
  fontSize: number,
  disabled?: boolean,
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
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={styles.buttonSurrounding}
      onPressIn={() => setArrowColor("#BEBEBE")}
      onPressOut={() => setArrowColor("white")}
    >
      <AntDesign name={iconName} style={styles.buttonIcon}/>
    </Pressable>
  )
}
