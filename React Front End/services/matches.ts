import { Match, Scoring, MatchScore, Timer } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/matches"

type MatchInDB = {
  fighter1ID: number,
  fighter2ID: number,
  fighter1Score: number,
  fighter2Score: number,
  groupID: number,
  matchID: number,
  matchTime: number
}

// TODO: Need to get tournamentId and ringNumber
// TODO: Determine meaning of db field "matchTime"
// TODO: Incorporate existing penalty/warning values
function mapMatchFields(matchInDb: MatchInDB, tournamentId: number): Match {

  const timer: Timer = {
    maxTime: matchInDb.matchTime,
    timeRemaining: matchInDb.matchTime,
    timeRemainingAtLastStop: matchInDb.matchTime,
    timeOfLastStart: 0,
    isRunning: false
  }

  const present: MatchScore = {
    fighter1Scoring: {
      points: matchInDb.fighter1Score | 0,
      numPenalties: 0,
      numWarnings: 0
    },
    fighter2Scoring: {
      points: matchInDb.fighter2Score | 0,
      numPenalties: 0,
      numWarnings: 0
    }
  }
  return ({
    fighter1Id: matchInDb.fighter1ID,
    fighter2Id: matchInDb.fighter2ID,
    id: matchInDb.matchID,
    poolId: matchInDb.groupID,
    past: Array<MatchScore>(),
    future: Array<MatchScore>(),
    present,
    timer,
    tournamentId,        // Fix this
    ringNumber: 0           // Fix this
  })
}

function mapMatches(fromDb: any[]): Match[] {
  return fromDb.map(mapMatchFields)
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

async function getAll(tournamentId: number) {
  const response = await axios.get(baseUrl, {
    params: {
      tournamentID: tournamentId
    }
  })
  return mapMatches(response.data)
}

async function getMatch(matchId: number) {
  // const response = await axios.get(`${baseUrl}/${matchId}`) // Change GET endpoint to be RESTful
  const response = await axios.get(`/api/match?matchID=${matchId}`)
  const data = response.data
  return mapMatchFields(data, data.tournamentID)
}

async function increaseScore(key: FighterScoringKey, matchId: number) {
  const fighter = getFighterNumber(key)
  const response = await axios.post(`${baseUrl}/increase_score_fighter${fighter}?matchID=${matchId}`)
  // return mapMatchFields(response.data)
  return
}

async function decreaseScore(key: FighterScoringKey, matchId: number) {
  const fighter = getFighterNumber(key)
  const response = await axios.post(`${baseUrl}/decrease_score_fighter${fighter}?matchID=${matchId}`, {
    params: {
      matchID: matchId
    }
  })
  // return mapMatchFields(response.data)
  return
}

async function issuePenalty(key: FighterScoringKey, matchId: number) {
  const fighter = getFighterNumber(key)
  const body = {
    matchID: matchId
  }
  const response = await axios.post(`${baseUrl}/penalty_fighter${fighter}`, {
    params: {
      matchID: matchId
    }
  })
  // return mapMatchFields(response.data)
  return
}

export default {
  mapMatchFields,
  getAll,
  getMatch,
  increaseScore,
  decreaseScore,
  issuePenalty
}