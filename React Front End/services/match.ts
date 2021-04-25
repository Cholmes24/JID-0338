import Keychain from 'react-native-keychain'
import axios, { AxiosRequestConfig } from 'axios'
import { Match, MatchScore, Timer } from '../redux-types/storeTypes'

const baseUrl = '/api/match'

type MatchInDB = {
  fighter1ID: number
  fighter1Score: number
  fighter2ID: number
  fighter2Score: number
  groupID: number
  matchID: number
  matchTime: number
  num_penalties_fighter1: number
  num_penalties_fighter2: number
  num_warnings_fighter1: number
  num_warnings_fighter2: number
  tournamentID: number
}

type FighterScoringKey = 1 | 2 | 'fighter1Scoring' | 'fighter2Scoring'

const getFighterNumber = (key: FighterScoringKey) => {
  switch (key) {
    case 1:
      return 1
    case 'fighter1Scoring':
      return 1
    case 2:
      return 2
    case 'fighter2Scoring':
      return 2
  }
}

// TODO: Need to get ringNumber
// TODO: Incorporate existing penalty/warning values - partially addressed
export function mapMatchFields(matchInDB: MatchInDB): Match {
  const { fighter1ID, fighter2ID, tournamentID } = matchInDB
  const timer: Timer = {
    timeRemaining: matchInDB.matchTime * 1000,
    timeRemainingAtLastStop: matchInDB.matchTime * 1000,
  } as Timer

  const present = {
    fighter1Scoring: {
      points: matchInDB.fighter1Score,
      numPenalties: matchInDB.num_penalties_fighter1,
      numWarnings: matchInDB.num_warnings_fighter1,
    },
    fighter2Scoring: {
      points: matchInDB.fighter2Score,
      numPenalties: matchInDB.num_penalties_fighter2,
      numWarnings: matchInDB.num_warnings_fighter2,
    },
  } as MatchScore

  return {
    fighter1ID,
    fighter2ID,
    ID: matchInDB.matchID,
    poolID: matchInDB.groupID,
    present,
    timer,
    tournamentID,
    // ringNumber: 0           // Fix this
  } as Match
}

type MatchMethod =
  | 'increase_score_fighter'
  | 'decrease_score_fighter'
  | 'penalty_fighter'
  | 'warning_fighter'

async function generateConfig(): Promise<AxiosRequestConfig> {
  return {
    headers: true
      ? {}
      : {
          Authorization: await Keychain.getGenericPassword(),
        },
  }
}

function makeUrl(matchID: number, method?: MatchMethod, fighter?: FighterScoringKey) {
  const suffix = method && fighter ? `/${method}${getFighterNumber(fighter)}` : ''
  return `${baseUrl}${suffix}?matchID=${matchID}`
}

async function getMatch(matchID: number) {
  const response = await axios.get(makeUrl(matchID))
  return mapMatchFields(response.data)
}

async function increaseScore(key: FighterScoringKey, matchID: number) {
  const response = await axios.post(
    makeUrl(matchID, 'increase_score_fighter', key),
    undefined,
    await generateConfig()
  )
  return mapMatchFields(response.data)
}

async function decreaseScore(key: FighterScoringKey, matchID: number) {
  const response = await axios.post(
    makeUrl(matchID, 'decrease_score_fighter', key),
    undefined,
    await generateConfig()
  )
  return mapMatchFields(response.data)
}

async function issueWarning(key: FighterScoringKey, matchID: number) {
  const response = await axios.post(
    makeUrl(matchID, 'warning_fighter', key),
    undefined,
    await generateConfig()
  )
  return mapMatchFields(response.data)
}

async function issuePenalty(key: FighterScoringKey, matchID: number) {
  const response = await axios.post(
    makeUrl(matchID, 'penalty_fighter', key),
    undefined,
    await generateConfig()
  )
  return mapMatchFields(response.data)
}

async function updateTimer(timeInSeconds: number, matchID: number) {
  const response = await axios.post(
    `${baseUrl}/set_match_time?matchID=${matchID}`,
    {
      matchTime: timeInSeconds,
    },
    await generateConfig()
  )
  return mapMatchFields(response.data)
}

async function undo(
  matchID: number,
  fighter1ID: number,
  fighter2ID: number,
  stateAfterUndo: MatchScore
) {
  const dataToSend = {
    fighter1ID: fighter1ID,
    fighter1Score: stateAfterUndo.fighter1Scoring.points,
    fighter1Warnings: stateAfterUndo.fighter1Scoring.numWarnings,
    fighter1Penalties: stateAfterUndo.fighter1Scoring.numPenalties,
    fighter2ID: fighter2ID,
    fighter2Score: stateAfterUndo.fighter2Scoring.points,
    fighter2Warnings: stateAfterUndo.fighter2Scoring.numWarnings,
    fighter2Penalties: stateAfterUndo.fighter2Scoring.numPenalties,
  }

  const response = await axios.post(`${baseUrl}/undo?matchID=${matchID}`, dataToSend)
  return response
}

const matchService = {
  getMatch,
  increaseScore,
  decreaseScore,
  issueWarning,
  issuePenalty,
  updateTimer,
  undo,
}

export default matchService
