import { ColorValue } from "react-native"

export interface Competitor {
  id: string,
  name: string,
  score: number,
  numberOfWarnings: number,
  numberOfPenalties: number,
  side?: "left" | "right",
  color: ColorValue
}

export const INCREASE_SCORE = "INCREASE_SCORE"
export const DECREASE_SCORE = "DECREASE_SCORE"
export const ISSUE_WARNING = "ISSUE_WARNING"
export const ISSUE_PENALTY = "ISSUE_PENALTY"

export interface IncreaseScoreAction {
  type: typeof INCREASE_SCORE,
  data: Competitor
}

export interface DecreaseScoreAction {
  type: typeof DECREASE_SCORE,
  data: Competitor
}

export interface IssueWarningAction {
  type: typeof ISSUE_WARNING,
  data: Competitor
}

export interface IssuePenaltyAction {
  type: typeof ISSUE_PENALTY,
  data: Competitor
}

export interface MatchState {
  left: Competitor,
  right: Competitor,
  ruleset: MatchRuleset,
  timeElapsed: number,
  callLog: LongtermCompetitorActionTypes[]
}

export const TOGGLE_TIMER = "TOGGLE_TIMER"

export interface ToggleTimerAction {
  type: typeof TOGGLE_TIMER,
  data: {
    timeElapsed: number,
    ruleset: MatchRuleset
  }
}

export const UNDO_CALL = "UNDO_CALL"

export interface UndoCallAction {
  type: typeof UNDO_CALL,
  data: MatchState
}

export type MatchRuleset = {
  increaseAmount: number,
  decreaseAmount: number,
  warningAmount: (data: Competitor) => number,
  penaltyAmount: (data: Competitor) => number,
  timeLimit: number,
  endCondition: (left: Competitor, right: Competitor) => Competitor | undefined
}

export type LongtermCompetitorActionTypes = IncreaseScoreAction | DecreaseScoreAction | IssueWarningAction | IssuePenaltyAction

export type CompetitorActionTypes = LongtermCompetitorActionTypes | UndoCallAction

export type MatchActionTypes = ToggleTimerAction