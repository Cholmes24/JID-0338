import ipAddress from 'ip-address'
import { ColorValue } from 'react-native'

export interface Fighter {
  ID: number
  firstName: string
  middleName?: string
  lastName: string

  color: ColorValue

  // club: string,
  // nationality: string,
  // seed: number,
  // schoolID: string,
}

export interface Scoring {
  points: number
  numWarnings: number
  numPenalties: number
}

export interface MatchScore {
  fighter1Scoring: Scoring
  fighter2Scoring: Scoring
}

export interface Match {
  ID: number
  poolID: number
  tournamentID: number
  // name: string,

  ringNumber: number

  fighter1ID: number
  fighter2ID: number
  winnerID?: number

  past: MatchScore[]
  present: MatchScore
  future: MatchScore[]

  timer: Timer
}

export interface Timer {
  maxTime: number
  timeRemaining: number
  timeRemainingAtLastStop: number
  timeOfLastStart: number
  isRunning: boolean
}

export interface SystemEvent {
  ID: number
  // tournamentIDs: number[],
  name: string
}

export interface Tournament {
  name: string
  ID: number
  systemEventID: number
  weaponType?: string
  // ruleset: MatchRuleset
  fighterIDs: number[]
  poolIDs: number[]
  matchIDs: number[]
}

export interface Pool {
  ID: number
  name: string
  // fighterIDs: number[],
  tournamentID: number
}

export interface CurrentIDs {
  systemEventID?: number
  tournamentID?: number
  poolID?: number
  matchID?: number
}

export interface RootType {
  fighters: Fighter[]
  systemEvents: SystemEvent[]
  tournaments: Tournament[]
  pools: Pool[]
  matches: Match[]
  currentIDs: CurrentIDs
}

type RoundsType = 'Finals' | true | false

type RoundNumberType = 'Two' | 'BestOfThree'

type VictoryConditions = 'Cap' | 'Spread' | 'HitPoints'

type RankingConditions = 'Pool' | 'Total'

interface MatchpointRules {
  matchPointsForWin: number
  matchPointsForDraw: number
  matchPointsForLoss: number
}

interface ExchangePointsRules {
  autoDoubleHit: boolean
  minPointsPerExchange: number
  middlePointsPerExchange?: number
  maxPointsPerExchange: number
  subtractPointsInExchanges: boolean
  useExchangeCounter: boolean
  numberOfExchangesAllowed?: number
}

interface MatchTimeRules {
  matchTimeInMinutes: number
  eliminationMatchTimeInMinutes: number
  effectiveTime?: boolean
}

interface RulesetConditions {
  capOrSpreadMax: number
  hardCap: boolean
  rounds: RoundsType
  numberOfRounds: RoundNumberType
  victoryConditions: VictoryConditions
  rankingConditions: RankingConditions
}

export interface MatchRuleset {
  matchpointRules: MatchpointRules
  matchTimeRules: MatchTimeRules
  exchangePointsRules: ExchangePointsRules
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
    rounds: 'Finals',
    numberOfRounds: 'BestOfThree',
    victoryConditions: 'Cap',
    rankingConditions: 'Total',
  },
}
