import React from 'react'
import { ColorValue, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { Text, View } from './Themed'
import { RootType } from '../redux-types/storeTypes'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { AppThunk } from '../store'
import matchService from '../services/match'
import Button from './Button'
// import { Audio, AVPlaybackStatus } from 'expo-av'
import _ from 'lodash'
import { decreaseScore, increaseScore } from '../reducers/MatchesReducer'

/**
const daggerWooshPath = '../assets/sounds/dagger-woosh.wav'
const knifeHitPath = '../assets/sounds/knife-fast-hit.wav'
const swordHitPath = '../assets/sounds/medieval-metal-sword.wav'
const metalWooshPath = '../assets/sounds/metal-hit-woosh.wav'
const armorHitPath = '../assets/sounds/sword-strikes-armor.wav'
const ouchPath = '../assets/sounds/human-fighter-scream.wav'
const woodHitPath = '../assets/sounds/wood-hard-hit.wav'
*/
type ScoreCounterProps = {
  matchID: number
  fighterScoringKey: 'fighter1Scoring' | 'fighter2Scoring'
  color?: ColorValue
}

export default function ScoreCounter({ matchID, fighterScoringKey, color }: ScoreCounterProps) {
  const dispatch = useAppDispatch()
  const fighters = useAppSelector((state: RootType) => state.fighters)
  const matches = useAppSelector((state: RootType) => state.matches)
  const match = matches.find((m) => m.ID === matchID)
  // const [ activeSound, setActiveSound ] = useState<Audio.Sound | undefined>()
  // const [ audioInterruptible, setAudioInterruptible ] = useState(true)

  // const fighter = useSelector((state: RootType) => state.fighters.find(c => c.ID === fighterID))
  if (!match) {
    throw Error('INVALID ID')
  }
  const getColorToUse = () => {
    if (!color) {
      const fighterNumber = fighterScoringKey === 'fighter1Scoring' ? 'fighter1ID' : 'fighter2ID'
      const fighter = fighters.find((f) => f.ID === match[fighterNumber])
      if (!fighter) {
        throw Error('MATCH WITH INVALID FIGHTER ID')
      }
      return fighter.color
    } else {
      return color
    }
  }
  /**
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
  */

  // const colorToUse = getColorToUse()
  const scoring = match.present[fighterScoringKey]
  const score = scoring.points

  const thunkIncrease = (): AppThunk => async (dispatch) => {
    const updatedMatch = await matchService.increaseScore(fighterScoringKey, matchID)
    if (updatedMatch.present !== match.present) {
      dispatch(
        increaseScore(matchID, fighterScoringKey, updatedMatch.present[fighterScoringKey].points)
      )
    }
  }
  const thunkDecrease = (): AppThunk => async (dispatch) => {
    if (score > 0) {
      const updatedMatch = await matchService.decreaseScore(fighterScoringKey, matchID)
      if (updatedMatch.present !== match.present) {
        dispatch(
          decreaseScore(matchID, fighterScoringKey, updatedMatch.present[fighterScoringKey].points)
        )
      }
    }
  }

  const onUpPress = () => {
    // playSound(positive[_.random(0, positive.length - 1)])
    dispatch(thunkIncrease())
  }

  const onDownPress = () => {
    if (score > 0) {
      // playSound(negative[_.random(0, negative.length - 1)])
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
