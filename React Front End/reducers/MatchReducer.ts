import { MatchActionTypes } from './../store/types';
import { Competitor, MatchRuleset, MatchState } from "../store/types"

const endConditions = (minimumScoreToWin: number, scoreToAutomaticallyWin?: number, leadRequiredToWinEarly: number = 0) => (
  left: Competitor, right: Competitor
) => {
  if (left.score === right.score) {
    return undefined
  }

  if (left.score < minimumScoreToWin && right.score < minimumScoreToWin) {
    return undefined
  }

  if (scoreToAutomaticallyWin) {
    if (left.score >= scoreToAutomaticallyWin) {
      return left
    } else if (right.score >= scoreToAutomaticallyWin) {
      return right
    }
  }

  if (left.score >= right.score + leadRequiredToWinEarly) {
    return left
  } else if (left.score + leadRequiredToWinEarly <= right.score) {
    return right
  }

  return undefined
}

const defaultMatchRuleset: MatchRuleset = {
    increaseAmount: 1,
    decreaseAmount: 1,
    warningAmount: (_: Competitor) => 1,
    penaltyAmount: (_: Competitor) => 1,
    timeLimit: 60,
    endCondition: (left: Competitor, right: Competitor) => endConditions(5, 8, 2)(left, right)
}

const defaultLeftCompetitor: Competitor = {
  name: "Longname Fencermaster",
  color: "#376EDA",
  score: 0,
  side: "left",
  numberOfWarnings: 0,
  numberOfPenalties: 0,
}

const defaultRightCompetitor: Competitor = {
  name: "Superlong Lastnameman",
  color: "#D43737",
  score: 0,
  side: "right",
  numberOfWarnings: 0,
  numberOfPenalties: 0,
}

export const defaultMatchState: MatchState = {
  left: defaultLeftCompetitor,
  right: defaultRightCompetitor,
  ruleset: defaultMatchRuleset,
  timeElapsed: 0,
  callLog: []
}

export default function MatchReducer(state = defaultMatchState, action: MatchActionTypes) {
  switch (action.type) {
    default:
      return state
  }
}
