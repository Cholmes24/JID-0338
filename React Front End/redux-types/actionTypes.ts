import { Action } from 'redux'
import { Fighter, Match, Pool, SystemEvent, Tournament } from './storeTypes'

export const TOGGLE_TIMER = 'TOGGLE_TIMER'
export const ADD_TO_TIMER = 'ADD_TO_TIMER'
export const UPDATE_TIMER = 'UPDATE_TIMER'

export interface ToggleTimerAction extends Action {
  type: typeof TOGGLE_TIMER
  payload: { currentTime: number }
}

export interface AddToTimerAction extends Action {
  type: typeof ADD_TO_TIMER
  payload: {
    currentTime: number
    amountToAdd: number
  }
}

export interface UpdateTimerAction extends Action {
  type: typeof UPDATE_TIMER
  payload: { currentTime: number }
}

export type TimerActionType = ToggleTimerAction | AddToTimerAction | UpdateTimerAction

export const INCREASE_SCORE = 'INCREASE_SCORE'
export const DECREASE_SCORE = 'DECREASE_SCORE'
export const ISSUE_WARNING = 'ISSUE_WARNING'
export const ISSUE_PENALTY = 'ISSUE_PENALTY'

export interface IncreaseScoreAction extends Action {
  type: typeof INCREASE_SCORE
  payload: number
}

export interface DecreaseScoreAction extends Action {
  type: typeof DECREASE_SCORE
  payload: number
}

export interface IssueWarningAction extends Action {
  type: typeof ISSUE_WARNING
  payload: number
}

export interface IssuePenaltyAction extends Action {
  type: typeof ISSUE_PENALTY
  payload: number
}

export type ScoringActionType =
  | IncreaseScoreAction
  | DecreaseScoreAction
  | IssueWarningAction
  | IssuePenaltyAction

export const MATCH_SCORING = 'MATCH_SCORING'
export const MATCH_TIMING = 'MATCH_TIMING'
export const MATCH_UNDO = 'MATCH_UNDO'
export const MATCH_REDO = 'MATCH_REDO'
export const SET_MATCH = 'SET_MATCH'

export interface MatchScoringAction extends Action {
  type: typeof MATCH_SCORING
  payload: {
    scoringAction: ScoringActionType
    fighter: 'fighter1Scoring' | 'fighter2Scoring'
  }
}

export interface MatchTimingAction extends Action {
  type: typeof MATCH_TIMING
  payload: {
    timingAction: TimerActionType
  }
}

export interface MatchUndoAction extends Action {
  type: typeof MATCH_UNDO
}

export interface MatchRedoAction extends Action {
  type: typeof MATCH_REDO
}

export interface SetMatchAction extends Action {
  type: typeof SET_MATCH
  payload: {
    fighter1ID?: number
    fighter1Score?: number
    fighter2ID?: number
    fighter2Score?: number
    groupID?: number
    matchID?: number
    matchTime?: number
    num_penalties_fighter1?: number
    num_penalties_fighter2?: number
    num_warnings_fighter1?: number
    num_warnings_fighter2?: number
    tournamentID?: number
  }
}

export type MatchActionType =
  | MatchScoringAction
  | MatchTimingAction
  | MatchUndoAction
  | MatchRedoAction

export const MATCHES = 'MATCHES'
export const SET_MATCHES = 'SET_MATCHES'
export const ADD_MATCHES = 'ADD_MATCHES'

export interface MatchesAction extends Action {
  type: typeof MATCHES
  matchAction: MatchActionType
  matchID: number
}

export interface SetMatchesAction extends Action {
  type: typeof SET_MATCHES
  payload: Match[]
}

export interface AddMatchesAction extends Action {
  type: typeof ADD_MATCHES
  payload: Match[]
}

export type MatchesActionType = MatchesAction | SetMatchesAction | AddMatchesAction

export const SET_SYSTEM_EVENTS = 'SET_SYSTEM_EVENTS'
export const ADD_SYSTEM_EVENTS = 'ADD_SYSTEM_EVENTS'

export interface SetSystemEvents extends Action {
  type: typeof SET_SYSTEM_EVENTS
  payload: SystemEvent[]
}

export interface AddSystemEvents extends Action {
  type: typeof ADD_SYSTEM_EVENTS
  payload: SystemEvent[]
}

export type SystemEventsActionType = SetSystemEvents | AddSystemEvents

export const SET_TOURNAMENTS = 'SET_TOURNAMENTS'
export const ADD_TOURNAMENTS = 'ADD_TOURNAMENTS'

export interface SetTournamentsAction extends Action {
  type: typeof SET_TOURNAMENTS
  payload: Tournament[]
}

export interface AddTournamentsAction extends Action {
  type: typeof ADD_TOURNAMENTS
  payload: Tournament[]
}

export type TournamentsActionType = SetTournamentsAction | AddTournamentsAction

export const SET_POOLS = 'SET_POOLS'
export const ADD_POOLS = 'ADD_POOLS'

export interface SetPoolsAction extends Action {
  type: typeof SET_POOLS
  payload: Pool[]
}

export interface AddPoolsAction extends Action {
  type: typeof ADD_POOLS
  payload: Pool[]
}

export type PoolsActionType = SetPoolsAction | AddPoolsAction

export const SET_FIGHTERS = 'SET_FIGHTERS'
export const ADD_FIGHTERS = 'ADD_FIGHTERS'

export interface SetFightersAction extends Action {
  type: typeof SET_FIGHTERS
  payload: Fighter[]
}

export interface AddFightersAction extends Action {
  type: typeof ADD_FIGHTERS
  payload: Fighter[]
}

export type FightersActionType = SetFightersAction | AddFightersAction

export const SET_CURRENT_SYSTEM_EVENT_ID = 'SET_CURRENT_SYSTEM_EVENT_ID'
export const SET_CURRENT_TOURNAMENT_ID = 'SET_CURRENT_TOURNAMENT_ID'
export const SET_CURRENT_POOL_ID = 'SET_CURRENT_POOL_ID'
export const SET_CURRENT_MATCH_ID = 'SET_CURRENT_MATCH_ID'

export interface SetCurrentSystemEventIDAction extends Action {
  type: typeof SET_CURRENT_SYSTEM_EVENT_ID
  payload: number
}

export interface SetCurrentTournamentIDAction extends Action {
  type: typeof SET_CURRENT_TOURNAMENT_ID
  payload: number
}

export interface SetCurrentPoolIDAction extends Action {
  type: typeof SET_CURRENT_POOL_ID
  payload: number
}

export interface SetCurrentMatchIDAction extends Action {
  type: typeof SET_CURRENT_MATCH_ID
  payload: number
}

export type CurrentIDsActionType =
  | SetCurrentSystemEventIDAction
  | SetCurrentTournamentIDAction
  | SetCurrentPoolIDAction
  | SetCurrentMatchIDAction
