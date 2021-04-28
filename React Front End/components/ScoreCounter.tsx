import React, { useEffect, useState } from 'react'
import { ColorValue, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { Text, View } from './Themed'
import { RootType } from '../redux-types/storeTypes'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { AppThunk } from '../store'
import matchService from '../services/match'
import Button from './Button'
import { Audio, AVPlaybackStatus } from 'expo-av'
import _ from 'lodash'
import { decreaseScore, increaseScore } from '../reducers/MatchesReducer'

import daggerWooshAudioSource from '../assets/audio/DaggerWoosh.wav'
import knifeHitAudioSource from '../assets/audio/KnifeFastHit.wav'
import swordHitAudioSource from '../assets/audio/MedievalMetalSword.wav'
import metalWooshAudioSource from '../assets/audio/MetalHitWoosh.wav'
import armorHitAudioSource from '../assets/audio/SwordStrikesArmor.wav'
import ouchAudioSource from '../assets/audio/HumanFighterScream.wav'
import woodHitAudioSource from '../assets/audio/WoodHardHit.wav'

type ScoreCounterProps = {
  matchID: number
  fighterScoringKey: 'fighter1Scoring' | 'fighter2Scoring'
  color?: ColorValue
}

export default function ScoreCounter({ matchID, fighterScoringKey, color }: ScoreCounterProps) {
  const dispatch = useAppDispatch()
  const matches = useAppSelector((state: RootType) => state.matches)
  const match = matches.find((m) => m.ID === matchID)
  const [activeSound, setActiveSound] = useState<Audio.Sound | undefined>()

  if (!match) {
    throw Error('INVALID ID')
  }

  const daggerSound = () => Audio.Sound.createAsync(daggerWooshAudioSource)
  const knifeSound = () => Audio.Sound.createAsync(knifeHitAudioSource)
  const swordSound = () => Audio.Sound.createAsync(swordHitAudioSource)
  const metalSound = () => Audio.Sound.createAsync(metalWooshAudioSource)
  const armorSound = () => Audio.Sound.createAsync(armorHitAudioSource)
  const ouchSound = () => Audio.Sound.createAsync(ouchAudioSource)
  const woodSound = () => Audio.Sound.createAsync(woodHitAudioSource)

  const throttleTime = 145 // wait at least 145ms after starting a sound before starting another

  const positive = [daggerSound, knifeSound, swordSound, metalSound, armorSound]
  const negative = new Array<typeof woodSound>(10).fill(woodSound).concat(ouchSound)

  async function playSound(s: () => Promise<{ sound: Audio.Sound; status: AVPlaybackStatus }>) {
    const currentStatus = await activeSound?.getStatusAsync()
    if (!activeSound || (currentStatus?.isLoaded && currentStatus.positionMillis > throttleTime)) {
      const { sound } = await s()
      setActiveSound(sound)
      await sound.setStatusAsync({
        shouldPlay: true,
        volume: 0.2,
      })
    }
  }
  // useEffect(() => {
  //   return activeSound
  //     ? () => {
  //         activeSound.unloadAsync()
  //       }
  //     : undefined
  // }, [activeSound])

  const scoring = match.present[fighterScoringKey]
  const score = scoring.points

  const thunkIncrease = (): AppThunk => async (dispatch) => {
    const updatedMatch = await matchService.increaseScore(fighterScoringKey, matchID)
    if (updatedMatch.present !== match.present) {
      const updatedPoints = updatedMatch.present[fighterScoringKey].points
      dispatch(increaseScore(matchID, fighterScoringKey, updatedPoints))
    }
  }
  const thunkDecrease = (): AppThunk => async (dispatch) => {
    if (score > 0) {
      const updatedMatch = await matchService.decreaseScore(fighterScoringKey, matchID)
      if (updatedMatch.present !== match.present) {
        const updatedPoints = updatedMatch.present[fighterScoringKey].points
        dispatch(decreaseScore(matchID, fighterScoringKey, updatedPoints))
      }
    }
  }

  async function onUpPress() {
    await playSound(positive[_.random(0, positive.length - 1)])
    dispatch(thunkIncrease())
  }

  async function onDownPress() {
    if (score > 0) {
      await playSound(negative[_.random(0, negative.length - 1)])
      dispatch(thunkDecrease())
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Button
        invertColor={true}
        onPress={onUpPress}
        content={(color) => (
          <Icon name="caretup" type="antdesign" iconStyle={styles.arrow} color={color as string} />
        )}
      />
      <Text style={[styles.scoreBox, { backgroundColor: color }]}>{score}</Text>
      <Button
        invertColor={true}
        disabled={score <= 0}
        onPress={onDownPress}
        content={(color) => (
          <Icon
            name="caretdown"
            type="antdesign"
            iconStyle={styles.arrow}
            color={color as string}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  arrow: {
    fontSize: 125,
    paddingBottom: 5,
  },
  scoreBox: {
    height: 90,
    width: 90,
    fontSize: 70,
    fontWeight: 'bold',
    color: 'white',
    backfaceVisibility: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    position: 'absolute',
    paddingTop: 5,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSurrounding: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
})
