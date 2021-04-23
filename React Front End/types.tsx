import { StackScreenProps } from "@react-navigation/stack"

export type SideMenuParamList = {
  Home: undefined,
  Events: undefined,
  Tournaments: { systemEventID: number},
  Pools: { tournamentID: number },
  Matches: { poolID: number },
  Match: { matchID: number },
};

export type RootStackParamList = {
  Root: undefined,
  NotFound: undefined,
}

export type ScreenPropType<ScreenName extends keyof SideMenuParamList> = StackScreenProps<SideMenuParamList, ScreenName>