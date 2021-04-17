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
  receivingID: number
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
function mapMatchFields(matchInDb: MatchInDB, penalties: PenaltyInDb[] = []): Match {
  const fighter1Id = matchInDb.fighter1ID
  const fighter2Id = matchInDb.fighter2ID

  const timer: Timer = {
    maxTime: 180000,
    timeRemaining: matchInDb.matchTime * 1000,
    timeRemainingAtLastStop: matchInDb.matchTime * 1000,
    timeOfLastStart: 0,
    isRunning: false
  }

  const present: MatchScore = {
    fighter1Scoring: {
      points: matchInDb.fighter1Score | 0,
      numPenalties: penalties.filter(p => p.receivingID === fighter1Id).length,
      numWarnings: 0
    },
    fighter2Scoring: {
      points: matchInDb.fighter2Score | 0,
      numPenalties: penalties.filter(p => p.receivingID === fighter2Id).length,
      numWarnings: 0
    }
  }
  return ({
    fighter1Id,
    fighter2Id,
    id: matchInDb.matchID,
    poolId: matchInDb.groupID,
    past: Array<MatchScore>(),
    future: Array<MatchScore>(),
    present,
    timer,
    tournamentId: matchInDb.tournamentID,
    ringNumber: 0           // Fix this
  })
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

// async function undo(matchId: number, stateAfterUndo: MatchScore) {

//   const response = await axios.post(`${baseUrl}` )
// }

const matchService = {
  getMatch,
  increaseScore,
  decreaseScore,
  issueWarning,
  issuePenalty,
}

export default matchService