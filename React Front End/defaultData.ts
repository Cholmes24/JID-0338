import { Fighter, Match, Pool, RootType, Scoring, Timer, Tournament } from "./redux-types/storeTypes"

const defaultScoring: Scoring = {
  points: 0,
  numWarnings: 0,
  numPenalties: 0,
}

const defaultTimer: Timer = {
  maxTime: 180000,
  timeRemaining: 180000,
  timeRemainingAtLastStop: 180000,
  timeOfLastStart: 0,
  isRunning: false
}

const defaultFighter1: Fighter = {
  id: 1,
  firstName: "Longname",
  lastName: "Fencermaster",
  color: "#376EDA",
}

const defaultFighter2: Fighter = {
  id: 2,
  firstName: "Superlong",
  lastName: "Lastnameman",
  color: "#D43737",
}

const defaultTournament: Tournament = {
  name: "Dummy Tournament",
  id: 0,
  fighterIds: [1, 2],
  poolIds: [0],
  matchIds: [0]
}

const defaultPool: Pool = {
  id: 0,
  name: "Pool Party",
  fighterIds: [1, 2],
  tournamentId: 0
}

const defaultMatch: Match = {
  id: 0,
  poolId: 0,
  tournamentId: 0,
  fighter1Id: 1,
  fighter2Id: 2,
  ringNumber: 0,
  past: [],
  present: {
    fighter1Scoring: defaultScoring,
    fighter2Scoring: defaultScoring,
  },
  future: [],
  timer: defaultTimer
}

const defaultData: RootType = {
  fighters: [defaultFighter1, defaultFighter2],
  tournaments: [defaultTournament],
  pools: [defaultPool],
  matches: [defaultMatch]
}

export default defaultData