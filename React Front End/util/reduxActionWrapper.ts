import { ScoringActionType, TimerActionType, MatchActionType, MatchesAction, MatchScoringAction, MatchTimingAction, MatchUndoAction, MatchRedoAction } from './../redux-types/actionTypes'

type fighterScoringKey = "fighter1Scoring" | "fighter2Scoring"

function wrapScoringAction(scoringAction: ScoringActionType, fighter?: fighterScoringKey): MatchScoringAction {
  if (fighter === undefined) {
    throw Error("INVALID PARAMATERS – FIGHTER SCORING KEY REQUIRED")
  }
  return {
    type: "MATCH_SCORING",
    payload: {
      scoringAction,
      fighter
    }
  }
}

function wrapTimingAction(timingAction: TimerActionType): MatchTimingAction {
  return {
    type: "MATCH_TIMING",
    payload: { timingAction }
  }
}

type WrappableAction = ScoringActionType | TimerActionType | MatchUndoAction | MatchRedoAction

function getProperWrapping(innerAction: WrappableAction, fighter?: fighterScoringKey): MatchActionType {
  switch (innerAction.type) {
    case "INCREASE_SCORE":
      return wrapScoringAction(innerAction, fighter)
    case "DECREASE_SCORE":
      return wrapScoringAction(innerAction, fighter)
    case "ISSUE_WARNING":
      return wrapScoringAction(innerAction, fighter)
    case "ISSUE_PENALTY":
      return wrapScoringAction(innerAction, fighter)

    case "TOGGLE_TIMER":
      return wrapTimingAction(innerAction)
    case "ADD_TO_TIMER":
      return wrapTimingAction(innerAction)
    case "UPDATE_TIMER":
      return wrapTimingAction(innerAction)

    case "MATCH_UNDO":
      return { type: "MATCH_UNDO" }
    case "MATCH_REDO":
      return { type: "MATCH_REDO" }
  }
}

export default function asMatchesAction(innerAction: WrappableAction, matchID: number, fighter?: fighterScoringKey): MatchesAction {
  return {
    type: "MATCHES",
    matchAction: getProperWrapping(innerAction, fighter),
    matchID
  }
}