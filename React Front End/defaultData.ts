import { CurrentIDs, Fighter, Match, Pool, RootType, Scoring, SystemEvent, Timer, Tournament } from "./redux-types/storeTypes"

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
  ID: 1,
  firstName: "Longname",
  lastName: "Fencermaster",
  color: "#376EDA",
}

const defaultFighter2: Fighter = {
  ID: 2,
  firstName: "Superlong",
  lastName: "Lastnameman",
  color: "#D43737",
}

const defaultTournament: Tournament = {
  ID: 0,
  name: "Dummy Tournament",
  systemEventID: 100,
  fighterIDs: [1, 2],
  poolIDs: [0],
  matchIDs: [0]
}

const defaultPool: Pool = {
  ID: 0,
  name: "Pool Party",
  // fighterIDs: [1, 2],
  tournamentID: 0
}

const defaultMatch: Match = {
  ID: 0,
  poolID: 0,
  tournamentID: 0,
  fighter1ID: 1,
  fighter2ID: 2,
  ringNumber: 0,
  past: [],
  present: {
    fighter1Scoring: defaultScoring,
    fighter2Scoring: defaultScoring,
  },
  future: [],
  timer: defaultTimer
}

const defaultSystemEvent: SystemEvent = {
  ID: 100,
  // tournamentIDs: [defaultTournament.ID],
  name: "The Big One"
}

const defaultCurrentIDs: CurrentIDs = {
  matchID: 52598
}

const defaultData: RootType = {
  fighters: [defaultFighter1, defaultFighter2],
  systemEvents: [defaultSystemEvent],
  tournaments: [defaultTournament],
  pools: [defaultPool],
  matches: [defaultMatch],
  currentIDs: defaultCurrentIDs
}

export default defaultData