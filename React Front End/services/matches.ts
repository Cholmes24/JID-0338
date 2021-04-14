import { Match, Scoring, MatchScore, Timer } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/system_events/tournaments/groups/matches"
type MatchInDB = {
  fighter1ID: number,
  fighter2ID: number,
  fighter1Score: number,
  fighter2Score: number,
  groupID: number,
  matchID: number,
  matchTime?: number
}

// TODO: Need to get ringNumber
// TODO: Determine meaning of db field "matchTime"
// TODO: Incorporate existing penalty/warning values - partially addressed
function mapMatchFields(matchInDb: MatchInDB, tournamentId: number): Match {
  const time = 1000 * (matchInDb.matchTime || 180) 
  const timer: Timer = {
    maxTime: 180000,
    timeRemaining: time,
    timeRemainingAtLastStop: time,
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
    tournamentId,        
    ringNumber: 0           // Fix this
  })
}

async function getAllByTournament(tournamentId: number) {
  const response = await axios.get(`/api/system_events/tournaments/matches?tournamentID=${tournamentId}`)
  return response.data.matches.map((m: MatchInDB) => mapMatchFields(m, tournamentId))
}

// async function getAll(poolId: number) {
//   const response = await axios.get(`${baseUrl}?groupID=${poolId}`)
//   return response.data.map(mapMatchFields)
// }


const matchesService ={
  mapMatchFields,
  getAllByTournament,
  // getAll,
}

export default matchesService