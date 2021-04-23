import React from 'react'
import { StyleSheet } from 'react-native'
import CustomButton from './Button'
import ScoreCounter from './ScoreCounter'
import { View, Text } from './Themed'
import { Fighter, Match, RootType } from '../redux-types/storeTypes'
import asMatchesAction from '../util/reduxActionWrapper'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { AppThunk } from '../store'
import matchService from '../services/match'

export type FighterColumnProps = {
  matchID: number
} & ({
  fighter: "fighter1" | "fighter2"
} | {
  fighterID: number
})

export default function FighterColumn(props: FighterColumnProps) {
  const dispatch = useAppDispatch()
  const matchID = props.matchID
  const matches = useAppSelector((state: RootType) => state.matches)
  const fighters = useAppSelector((state: RootType) => state.fighters)

  const match = matches.find(m => m.ID === matchID)
  if (!match) {
    throw Error("INVALID MATCH ID")
  }

  const [ fighterID, fighterScoringKey ] = getFighterIDAndScoringKey(match, props)
  const fighter = fighters.find((f: Fighter) => f.ID === fighterID)

  if (!fighter) {
    throw Error("INVALID FIGHTER ID")
  }



  const thunkIssueWarning = (): AppThunk => (
    async dispatch => {
      const issueWarning = asMatchesAction({ type: "ISSUE_WARNING" }, matchID, fighterScoringKey)
      const updatedMatch = await matchService.issueWarning(fighterScoringKey, matchID)
      if (updatedMatch.present !== match.present) {
        dispatch(issueWarning)
      }
    }
  )

  const thunkIssuePenalty = (): AppThunk => (
    async dispatch => {
      const issuePenalty = asMatchesAction({ type: "ISSUE_PENALTY" }, matchID, fighterScoringKey)
      const updatedMatch = await matchService.issuePenalty(fighterScoringKey, matchID)
      if (updatedMatch.present !== match.present) {
        dispatch(issuePenalty)
      }
    }
  )

  const color = fighter.color
  const name = `${fighter.firstName} ${fighter.lastName}`
  const scoring = match.present[fighterScoringKey]
  const warnings = scoring.numWarnings
  const penalties = scoring.numPenalties

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
      // shadowOffset: { wIDth: 1, height: 2 },
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
    },
    warningsAndPenalties: {
      color: "white",
      backgroundColor: color,
      textAlign: "center",
      marginBottom: 5
    }
  })

  return (
    <View style={styles.container} >
      <Text style={styles.playerName} >{name}</Text>
      <Text style={styles.warningsAndPenalties}>Warnings: {warnings}</Text>
      <Text style={styles.warningsAndPenalties}>Penalties: {penalties}</Text>
      <View style={styles.scoreCounter}>
        <ScoreCounter matchID={matchID} fighterScoringKey={fighterScoringKey} />
      </View>

      <View style={styles.buttonList} >

        <View style={styles.button} >
          <CustomButton
            content={() => <Text style={styles.buttonText} >Warning</Text> }
            onPress={() => dispatch(thunkIssueWarning())}
            />
        </View>
        <View style={styles.button} >
          <CustomButton
            content={() => <Text style={styles.buttonText} >Penalty</Text> }
            onPress={() => dispatch(thunkIssuePenalty())}
            />
        </View>
      </View>
    </View>
  )
}

function getFighterIDAndScoringKey(match: Match, props: FighterColumnProps): [number, "fighter1Scoring" | "fighter2Scoring"] {
  if (props.hasOwnProperty("fighterID")) {
    const p = props as { matchID: number, fighterID: number}
    const ID = p.fighterID
    if (match.fighter1ID !== ID && match.fighter2ID !== ID) {
      throw Error("FIGHTER NOT IN MATCH")
    }
    const scoringKey = match.fighter1ID === ID ? "fighter1Scoring" : "fighter2Scoring"
    return [ID, scoringKey]
  } else {
    const p = props as { matchID: number, fighter: "fighter1" | "fighter2" }
    const ID = match[p.fighter === "fighter1" ? "fighter1ID" : "fighter2ID"]
    const scoringKey = `${p.fighter}Scoring` as "fighter1Scoring" | "fighter2Scoring"
    return [ID, scoringKey]
  }
}
