import { ColorValue } from "react-native"
import { Action } from "redux"

export const TOGGLE_TIMER = "TOGGLE_TIMER"
export const ADD_TO_TIMER = "ADD_TO_TIMER"
export const UPDATE_TIMER = "UPDATE_TIMER"

export interface ToggleTimerAction extends Action {
  type: typeof TOGGLE_TIMER,
  payload: { currentTime: number }
}

export interface AddToTimerAction extends Action {
  type: typeof ADD_TO_TIMER,
  payload: {
    currentTime: number,
    amountToAdd: number
  }
}

export interface UpdateTimerAction extends Action {
  type: typeof UPDATE_TIMER,
  payload: { currentTime: number }
}

export type TimerActionType = ToggleTimerAction | AddToTimerAction | UpdateTimerAction


export const INCREASE_SCORE = "INCREASE_SCORE"
export const DECREASE_SCORE = "DECREASE_SCORE"
export const ISSUE_WARNING = "ISSUE_WARNING"
export const ISSUE_PENALTY = "ISSUE_PENALTY"

export interface IncreaseScoreAction extends Action {
  type: typeof INCREASE_SCORE,
}

export interface DecreaseScoreAction extends Action {
  type: typeof DECREASE_SCORE,
}

export interface IssueWarningAction extends Action {
  type: typeof ISSUE_WARNING,
}

export interface IssuePenaltyAction extends Action {
  type: typeof ISSUE_PENALTY,
}

export type ScoringActionType = IncreaseScoreAction | DecreaseScoreAction | IssueWarningAction | IssuePenaltyAction


const MATCH_SCORING = "MATCH_SCORING"
const MATCH_TIMING = "MATCH_TIMING"
const MATCH_UNDO = "MATCH_UNDO"
const MATCH_REDO = "MATCH_REDO"


export interface MatchScoringAction extends Action {
  type: typeof MATCH_SCORING,
  payload: {
    scoringAction: ScoringActionType,
    fighter: "fighter1Scoring" | "fighter2Scoring"
  }
}

export interface MatchTimingAction extends Action {
  type: typeof MATCH_TIMING,
  payload: {
    timingAction: TimerActionType
  }
}

export interface MatchUndoAction extends Action {
  type: typeof MATCH_UNDO,
}

export interface MatchRedoAction extends Action {
  type: typeof MATCH_REDO,
}

export type MatchActionType = MatchScoringAction | MatchTimingAction | MatchUndoAction | MatchRedoAction


