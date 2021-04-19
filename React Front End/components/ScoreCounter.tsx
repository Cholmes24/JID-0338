import { AntDesign } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { ColorValue, GestureResponderEvent, Pressable, StyleSheet } from 'react-native'
import { Text, View } from './Themed'
import { RootType } from '../redux-types/storeTypes'
import asMatchesAction from '../util/reduxActionWrapper'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { AppThunk } from '../store'
import matchService from "../services/match"
import { Audio, AVPlaybackStatus } from 'expo-av'
import _ from 'lodash'
// import UIfx from 'uifx'


const daggerWooshPath = '../assets/sounds/dagger-woosh.wav'
const knifeHitPath = '../assets/sounds/knife-fast-hit.wav'
const swordHitPath = '../assets/sounds/medieval-metal-sword.wav'
const metalWooshPath = '../assets/sounds/metal-hit-woosh.wav'
const armorHitPath = '../assets/sounds/sword-strikes-armor.wav'
const ouchPath = '../assets/sounds/human-fighter-scream.wav'
const woodHitPath = '../assets/sounds/wood-hard-hit.wav'

type ScoreCounterProps = {
  matchID: number,
  fighterScoringKey: "fighter1Scoring" | "fighter2Scoring",
  fontSize?: number,
  color?: ColorValue
}

export default function ScoreCounter({matchID, fighterScoringKey, fontSize = 70, color}: ScoreCounterProps) {
  const dispatch = useAppDispatch()
  const fighters = useAppSelector((state: RootType) => state.fighters)
  const matches = useAppSelector((state: RootType) => state.matches)
  const match = matches.find(m => m.ID === matchID)
  const [ activeSound, setActiveSound ] = useState<Audio.Sound | undefined>()
  const [ audioInterruptible, setAudioInterruptible ] = useState(true)

  // const fighter = useSelector((state: RootType) => state.fighters.find(c => c.ID === fighterID))
  if (!match) {
    throw Error("INVALID ID")
  }
  const getColorToUse = () => {
    if (!color) {
      const fighterNumber = fighterScoringKey === "fighter1Scoring" ? "fighter1ID" : "fighter2ID"
      const fighter = fighters.find((f) => f.ID === match[fighterNumber])
      if (!fighter) {
        throw Error("MATCH WITH INVALID FIGHTER ID")
      }
      return fighter.color
    } else {
      return color
    }
  }

  const daggerSound = () => Audio.Sound.createAsync(require(daggerWooshPath))
  const knifeSound = () => Audio.Sound.createAsync(require(knifeHitPath))
  const swordSound = () => Audio.Sound.createAsync(require(swordHitPath))
  const metalSound = () => Audio.Sound.createAsync(require(metalWooshPath))
  const armorSound = () => Audio.Sound.createAsync(require(armorHitPath))
  const ouchSound = () => Audio.Sound.createAsync(require(ouchPath))
  const woodSound = () => Audio.Sound.createAsync(require(woodHitPath))

  const throttleTime = 145 // wait at least 145ms after starting a sound before starting another

  const positive = [daggerSound, knifeSound, swordSound, metalSound, armorSound]
  const negative = new Array<typeof woodSound>(10).fill(woodSound).concat(ouchSound)

  async function playSound(s: () => Promise<{ sound: Audio.Sound, status: AVPlaybackStatus }>) {
    if (audioInterruptible) {
      const { sound } = await s()
      setActiveSound(sound)
      await sound.playAsync()
    }
  }
  useEffect(() => {
    setAudioInterruptible(false)
    setTimeout(() => setAudioInterruptible(true), throttleTime)
    return activeSound ? () => {
      activeSound.unloadAsync()
    } : undefined
  }, [activeSound])

  // const colorToUse = getColorToUse()
  const scoring = match.present[fighterScoringKey]
  const score = scoring.points

  const thunkIncrease = (): AppThunk => (
    async dispatch => {
      const updatedMatch = await matchService.increaseScore(fighterScoringKey, matchID)
      if (updatedMatch.present !== match.present) {
        dispatch(increaseAction)
      }
    }
  )
  const thunkDecrease = (): AppThunk => (
    async dispatch => {
      if (score > 0) {
        const updatedMatch = await matchService.decreaseScore(fighterScoringKey, matchID)
        if (updatedMatch.present !== match.present) {
          dispatch(decreaseAction)
        }
      }
    }
  )

  const increaseAction = asMatchesAction({
    type: "INCREASE_SCORE"
  }, matchID, fighterScoringKey)

  const decreaseAction = asMatchesAction({
    type: "DECREASE_SCORE"
  }, matchID, fighterScoringKey)

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
    playSound(positive[_.random(0, positive.length - 1)])
    dispatch(thunkIncrease())
  }

  const onDownPress = () => {
    if (score > 0) {
      playSound(negative[_.random(0, negative.length - 1)])
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
