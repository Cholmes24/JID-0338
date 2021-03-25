import React from 'react'
import { StyleSheet } from 'react-native'
import CustomButton from './Button'
import { useDispatch, useSelector } from 'react-redux'
import ScoreCounter from './ScoreCounter'
import { View, Text } from './Themed'
import { Fighter, Match, RootType } from '../redux-types/storeTypes'
import asMatchesAction from '../util/reduxActionWrapper'

export type FighterColumnProps = {
  matchId: number
} & ({
  fighter: "fighter1" | "fighter2"
} | {
  fighterId: number
})

export default function FighterColumn(props: FighterColumnProps) {
  const dispatch = useDispatch()
  const matchId = props.matchId
  const match = useSelector((state: RootType) => state.matches.find((m: Match) => m.id === matchId))

  if (!match) {
    throw Error("INVALID MATCH ID")
  }

  const [ fighterId, fighterScoringKey ] = getFighterIdAndScoringKey(match, props)
  const fighter = useSelector((state: RootType) => state.fighters.find((f: Fighter) => f.id === fighterId))

  if (!fighter) {
    throw Error("INVALID FIGHTER ID")
  }

  const issueWarning = asMatchesAction({
    type: "ISSUE_WARNING"
  }, matchId, fighterScoringKey)

  const issuePenalty = asMatchesAction({
    type: "ISSUE_PENALTY"
  }, matchId, fighterScoringKey)

  const color = fighter.color
  const name = `${fighter.firstName} ${fighter.lastName}`
  const fontSize = 20
  const testBorders = {
    // borderColor: "yellow",
    // borderWidth: 2,
  }
  const styles = StyleSheet.create({
    container: {
      // For testing purposes to align things
      ...testBorders,


      alignSelf: "center",
      flex: 1,
      paddingTop: 22,
      paddingHorizontal: 10,

      backgroundColor: color,
      borderRadius: 15,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: "center",
      elevation: 5,
      // shadowRadius: 2,
      // shadowOffset: { width: 1, height: 2 },
      // shadowColor: 'black',
      // shadowOpacity: 0.4,
    },
    playerName: {
      // For testing purposes to align things
      ...testBorders,

      color: "white",
      fontSize,
      backgroundColor: color,
      fontWeight: "bold",
      textAlign: "center",
      alignSelf: "center",
      alignContent: "center",
      flex: 1
    },
    button: {
      // For testing purposes to align things
      // ...testBorders,

      backgroundColor: color,
      flex: 1,
      padding: 5,
      paddingBottom: 8,
      width: "100%"
    },
    buttonList: {
      // For testing purposes to align things
      ...testBorders,

      backgroundColor: color,
      flex: 1.5,
      alignSelf: "stretch",
      alignItems: "center",
      marginBottom: 15
    },
    scoreCounter: {
      // For testing purposes to align things
      ...testBorders,

      backgroundColor: color,
      flex: 4.5
    },
    buttonText: {
      color: color,
      fontWeight: "bold"
    }
  })

  return (
    <View style={styles.container} >
      <Text style={styles.playerName} >{name}</Text>
      <View style={styles.scoreCounter}>
        <ScoreCounter matchId={matchId} fighterScoringKey={fighterScoringKey} />
      </View>

      <View style={styles.buttonList} >

        <View style={styles.button} >
          <CustomButton
            content={() => <Text style={styles.buttonText} >Warning</Text> }
            onPress={() => dispatch(issueWarning)}
            />
        </View>
        <View style={styles.button} >
          <CustomButton
            content={() => <Text style={styles.buttonText} >Penalty</Text> }
            onPress={() => dispatch(issuePenalty)}
            />
        </View>
      </View>
    </View>
  )
}

function getFighterIdAndScoringKey(match: Match, props: FighterColumnProps): [number, "fighter1Scoring" | "fighter2Scoring"] {
  if (props.hasOwnProperty("fighterId")) {
    const p = props as { matchId: number, fighterId: number}
    const id = p.fighterId
    if (match.fighter1Id !== id && match.fighter2Id !== id) {
      throw Error("FIGHTER NOT IN MATCH")
    }
    const scoringKey = match.fighter1Id === id ? "fighter1Scoring" : "fighter2Scoring"
    return [id, scoringKey]
  } else {
    const p = props as { matchId: number, fighter: "fighter1" | "fighter2" }
    const id = match[p.fighter === "fighter1" ? "fighter1Id" : "fighter2Id"]
    const scoringKey = `${p.fighter}Scoring` as "fighter1Scoring" | "fighter2Scoring"
    return [id, scoringKey]
  }
}
