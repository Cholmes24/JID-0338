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
  tournamentID: number
}

type PenaltyInDb = {
  exchangeType: "penalty",
  matchID: number,
  scoringID: number
}

type WarningInDb = {
  exchangeType: "warning",
  matchID: number,
  scoringID: number
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
  penalties?: PenaltyInDb[],
  warnings?: WarningInDb[],
): Match {
  const fighter1Id = matchInDb.fighter1ID
  const fighter2Id = matchInDb.fighter2ID

  const timer: Timer = {
    // maxTime: 180000,
    // timeRemaining: matchInDb.matchTime * 1000,
    // timeRemainingAtLastStop: matchInDb.matchTime * 1000,
  } as Timer

  const present = {
    fighter1Scoring: {
      points: matchInDb.fighter1Score || undefined,
      numPenalties: penalties?.filter(p => p.scoringID === fighter1Id).length || undefined,
      numWarnings: warnings?.filter(w => w.scoringID === fighter1Id).length || undefined
    },
    fighter2Scoring: {
      points: matchInDb.fighter2Score || undefined,
      numPenalties: penalties?.filter(p => p.scoringID === fighter2Id).length || undefined,
      numWarnings: warnings?.filter(w => w.scoringID === fighter2Id).length || undefined,
    }
  } as MatchScore

  return ({
    fighter1Id,
    fighter2Id,
    id: matchInDb.matchID,
    poolId: matchInDb.groupID,
    present,
    timer,
    tournamentId: matchInDb.tournamentID,
    // ringNumber: 0           // Fix this
  }) as Match
}

type MatchMethod = "increase_score_fighter" | "decrease_score_fighter" | "penalty_fighter" | "warning_fighter"

function makeUrl(matchId: number, method?: MatchMethod, fighter?: FighterScoringKey) {
  const suffix = method && fighter ? `/${method}${getFighterNumber(fighter)}` : ''
  return `${baseUrl}${suffix}?matchID=${matchId}`
}

async function getMatch(matchId: number) {
  const response = await axios.get(makeUrl(matchId))
  const data = response.data

  const { match, penalties } = data

  return mapMatchFields(match, penalties)
}

async function increaseScore(key: FighterScoringKey, matchId: number) {
  const response = await axios.post(makeUrl(matchId, 'increase_score_fighter', key))
  return mapMatchFields(response.data)
}

async function decreaseScore(key: FighterScoringKey, matchId: number) {
  const response = await axios.post(makeUrl(matchId, 'decrease_score_fighter', key))
  return mapMatchFields(response.data)
}

async function issueWarning(key: FighterScoringKey, matchId: number) {
  const response = await axios.post(makeUrl(matchId, 'warning_fighter', key))
  return mapMatchFields(response.data)
}

async function issuePenalty(key: FighterScoringKey, matchId: number) {
  const response = await axios.post(makeUrl(matchId, 'penalty_fighter', key))
  return mapMatchFields(response.data)
}

async function updateTimer(timeInSeconds: number, matchId: number) {
  const response = await axios.post(`${baseUrl}/set_match_time?matchID=${matchId}`, {
    matchTime: timeInSeconds
  })
  return mapMatchFields(response.data)
}

async function undo(matchId: number, fighter1Id: number, fighter2Id: number, stateAfterUndo: MatchScore) {
  const dataToSend = {
    fighter1ID: fighter1Id,
    fighter1Score: stateAfterUndo.fighter1Scoring.points,
    fighter1Warnings: stateAfterUndo.fighter1Scoring.numWarnings,
    fighter1Penalties: stateAfterUndo.fighter1Scoring.numPenalties,
    fighter2ID: fighter2Id,
    fighter2Score: stateAfterUndo.fighter2Scoring.points,
    fighter2Warnings: stateAfterUndo.fighter2Scoring.numWarnings,
    fighter2Penalties: stateAfterUndo.fighter2Scoring.numPenalties,
  }

  const response = await axios.post(`${baseUrl}/undo?matchID=${matchId}`, dataToSend)
}

const matchService = {
  getMatch,
  increaseScore,
  decreaseScore,
  issueWarning,
  issuePenalty,
  updateTimer,
  undo
}

export default matchService