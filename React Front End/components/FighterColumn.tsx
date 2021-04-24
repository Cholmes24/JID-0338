import React from 'react'
import { StyleSheet } from 'react-native'
import CustomButton from './Button'
import ScoreCounter from './ScoreCounter'
import { View, Text } from './Themed'
import { Fighter, Match, RootType } from '../redux-types/storeTypes'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { AppThunk } from '../store'
import matchService from '../services/match'
import { issuePenalty, issueWarning } from '../reducers/MatchesReducer'

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
      const updatedMatch = await matchService.issueWarning(fighterScoringKey, matchID)
      if (updatedMatch.present !== match.present) {
        dispatch(issueWarning(matchID, fighterScoringKey))
      }
    }
  )

  const thunkIssuePenalty = (): AppThunk => (
    async dispatch => {
      const updatedMatch = await matchService.issuePenalty(fighterScoringKey, matchID)
      if (updatedMatch.present !== match.present) {
        dispatch(issuePenalty(matchID, fighterScoringKey))
      }
    }
  )

  // const color = fighter.color
  const color = fighterScoringKey === "fighter1Scoring" ? "#376EDA" : "#D43737"

  const backgroundColor = color
  const name = `${fighter.firstName} ${fighter.lastName}`
  const scoring = match.present[fighterScoringKey]
  const warnings = scoring.numWarnings
  const penalties = scoring.numPenalties


  return (
    <View style={[styles.container, { backgroundColor }]} >
      <Text style={[styles.fighterName, { backgroundColor }]} >{name}</Text>
      <Text style={[styles.warningsAndPenalties, { backgroundColor }]}>Warnings: {warnings}</Text>
      <Text style={[styles.warningsAndPenalties, { backgroundColor }]}>Penalties: {penalties}</Text>
      <View style={[styles.scoreCounter, { backgroundColor }]}>
        <ScoreCounter matchID={matchID} fighterScoringKey={fighterScoringKey} />
      </View>

      <View style={[styles.buttonList, { backgroundColor }]} >

        <View style={[styles.button, { backgroundColor } ]} >
          <CustomButton
            content={() => <Text style={[styles.buttonText, { color }]} >Warning</Text> }
            onPress={() => dispatch(thunkIssueWarning())}
            />
        </View>
        <View style={[styles.button, { backgroundColor } ]} >
          <CustomButton
            content={() => <Text style={[styles.buttonText, { color }]} >Penalty</Text> }
            onPress={() => dispatch(thunkIssuePenalty())}
            />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    flex: 1,
    paddingTop: 22,
    paddingHorizontal: 10,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: "center",
    elevation: 5,
  },
  fighterName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    alignContent: "center",
    flex: 1,
  },
  button: {
    flex: 1,
    padding: 5,
    paddingBottom: 8,
    width: "100%",
  },
  buttonList: {
    flex: 1.5,
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 15,
  },
  scoreCounter: {
    flex: 4.5,
  },
  buttonText: {
    fontWeight: "bold",
  },
  warningsAndPenalties: {
    color: "white",
    textAlign: "center",
    marginBottom: 5,
  }
})

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
