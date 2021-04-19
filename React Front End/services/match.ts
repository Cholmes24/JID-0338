import axios from 'axios'
import { Match, MatchScore, Timer } from '../redux-types/storeTypes'

const baseUrl = '/api/match'

type MatchInDB = {
  fighter1ID: number,
  fighter1Score: number,
  fighter2ID: number,
  fighter2Score: number,
  groupID: number,
  matchID: number,
  matchTime: number,
  num_penalties_fighter1: number,
  num_penalties_fighter2: number,
  num_warnings_fighter1: number,
  num_warnings_fighter2: number,
  tournamentID: number,
}

type FighterScoringKey = 1 | 2 | "fighter1Scoring" | "fighter2Scoring"

const getFighterNumber = (key: FighterScoringKey) => {
  switch (key) {
    case 1:
      return 1
    case "fighter1Scoring":
      return 1
    case 2:
      return 2
    case "fighter2Scoring":
      return 2
  }
}

// TODO: Need to get ringNumber
// TODO: Determine meaning of db field "matchTime"
// TODO: Incorporate existing penalty/warning values - partially addressed
export function mapMatchFields(
  matchInDb: MatchInDB,
): Match {
  const { fighter1ID, fighter2ID, tournamentID } = matchInDb
  const timer: Timer = {
    // maxTime: 180000,
    // timeRemaining: matchInDb.matchTime * 1000,
    // timeRemainingAtLastStop: matchInDb.matchTime * 1000,
  } as Timer

  const present = {
    fighter1Scoring: {
      points: matchInDb.fighter1Score,
      numPenalties: matchInDb.num_penalties_fighter1,
      numWarnings: matchInDb.num_warnings_fighter1,
    },
    fighter2Scoring: {
      points: matchInDb.fighter2Score,
      numPenalties: matchInDb.num_penalties_fighter2,
      numWarnings: matchInDb.num_warnings_fighter2,
    }
  } as MatchScore

  return ({
    fighter1ID,
    fighter2ID,
    ID: matchInDb.matchID,
    poolID: matchInDb.groupID,
    present,
    timer,
    tournamentID,
    // ringNumber: 0           // Fix this
  }) as Match
}

type MatchMethod = "increase_score_fighter" | "decrease_score_fighter" | "penalty_fighter" | "warning_fighter"

function makeUrl(matchID: number, method?: MatchMethod, fighter?: FighterScoringKey) {
  const suffix = method && fighter ? `/${method}${getFighterNumber(fighter)}` : ''
  return `${baseUrl}${suffix}?matchID=${matchID}`
}

async function getMatch(matchID: number) {
  const response = await axios.get(makeUrl(matchID))
  return mapMatchFields(response.data)
}

async function increaseScore(key: FighterScoringKey, matchID: number) {
  const response = await axios.post(makeUrl(matchID, 'increase_score_fighter', key))
  return mapMatchFields(response.data)
}

async function decreaseScore(key: FighterScoringKey, matchID: number) {
  const response = await axios.post(makeUrl(matchID, 'decrease_score_fighter', key))
  return mapMatchFields(response.data)
}

async function issueWarning(key: FighterScoringKey, matchID: number) {
  const response = await axios.post(makeUrl(matchID, 'warning_fighter', key))
  return mapMatchFields(response.data)
}

async function issuePenalty(key: FighterScoringKey, matchID: number) {
  const response = await axios.post(makeUrl(matchID, 'penalty_fighter', key))
  return mapMatchFields(response.data)
}

async function updateTimer(timeInSeconds: number, matchID: number) {
  const response = await axios.post(`${baseUrl}/set_match_time?matchID=${matchID}`, {
    matchTime: timeInSeconds
  })
  return mapMatchFields(response.data)
}

async function undo(matchID: number, fighter1ID: number, fighter2ID: number, stateAfterUndo: MatchScore) {
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