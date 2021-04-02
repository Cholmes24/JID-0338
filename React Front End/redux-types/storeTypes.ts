import { ColorValue } from "react-native"

export interface Fighter {
  id: number,
  firstName: string,
  middleName?: string,
  lastName: string,

  color: ColorValue,

  // club: string,
  // nationality: string,
  // seed: number,
  // schoolId: string,
}

export interface Scoring {
  points: number,
  numWarnings: number,
  numPenalties: number
}

export interface MatchScore {
  fighter1Scoring: Scoring,
  fighter2Scoring: Scoring,
}

export interface Match {
  id: number,
  poolId: number,
  tournamentId: number,
  // name: string,

  ringNumber: number,

  fighter1Id: number,
  fighter2Id: number,
  winnerId?: number,

  past: MatchScore[],
  present: MatchScore,
  future: MatchScore[],

  timer: Timer
}

export interface Timer {
  maxTime: number,
  timeRemaining: number,
  timeRemainingAtLastStop: number,
  timeOfLastStart: number,
  isRunning: boolean
}

export interface SystemEvent {
  id: number,
  tournamentIds: number[]
}

export interface Tournament {
  name: string,
  id: number,
  weaponType?: string,
  // ruleset: MatchRuleset
  fighterIds: number[],
  poolIds: number[],
  matchIds: number[]
}

export interface Pool {
  id: number,
  name: string,
  fighterIds: number[],
  tournamentId: number,
}

export interface RootType {
  fighters: Fighter[],
  systemEvents: SystemEvent[],
  tournaments: Tournament[],
  pools: Pool[],
  matches: Match[],
  currentMatchId?: number
}




type RoundsType = "Finals" | true | false

type RoundNumberType = "Two" | "BestOfThree"

type VictoryConditions = "Cap" | "Spread" | "HitPoints"

type RankingConditions = "Pool" | "Total"

interface MatchpointRules {
  matchPointsForWin: number,
  matchPointsForDraw: number,
  matchPointsForLoss: number,
}

interface ExchangePointsRules {
  autoDoubleHit: boolean,
  minPointsPerExchange: number,
  middlePointsPerExchange?: number,
  maxPointsPerExchange: number,
  subtractPointsInExchanges: boolean,
  useExchangeCounter: boolean,
  numberOfExchangesAllowed?: number,
}

interface MatchTimeRules {
  matchTimeInMinutes: number,
  eliminationMatchTimeInMinutes: number,
  effectiveTime?: boolean,
}

interface RulesetConditions {
  capOrSpreadMax: number,
  hardCap: boolean,
  rounds: RoundsType,
  numberOfRounds: RoundNumberType,
  victoryConditions: VictoryConditions,
  rankingConditions: RankingConditions,
}

export interface MatchRuleset {
  matchpointRules: MatchpointRules,
  matchTimeRules: MatchTimeRules,
  exchangePointsRules: ExchangePointsRules,
  rulesetConditions: RulesetConditions
}

const Nordic: MatchRuleset = {
  matchpointRules: {
    matchPointsForWin: 9,
    matchPointsForDraw: 6,
    matchPointsForLoss: 3,
  },
  exchangePointsRules: {
    autoDoubleHit: false,
    minPointsPerExchange: 1,
    maxPointsPerExchange: 2,
    subtractPointsInExchanges: true,
    useExchangeCounter: false,
  },
  matchTimeRules: {
    matchTimeInMinutes: 3,
    eliminationMatchTimeInMinutes: 0,
  },
  rulesetConditions: {
    capOrSpreadMax: 8,
    hardCap: false,
    rounds: "Finals",
    numberOfRounds: "BestOfThree",
    victoryConditions: "Cap",
    rankingConditions: "Total",
  }
}
