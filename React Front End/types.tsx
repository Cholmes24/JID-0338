import { StackScreenProps } from "@react-navigation/stack"

// export type RootStackParamList = {
//   Root: undefined;
//   NotFound: undefined;
// };
// export type BottomTabParamList = {
//   Tournaments: undefined;
//   Rings: undefined;
//   Home: undefined
// };

// export type SideMenuParamList = {
//   Tournaments: undefined;
//   Rings: undefined;
//   Home: undefined,
//   Match: undefined
// };

// export type HomeScreenParamList = {
//   HomeScreen: undefined
// }

// export type TournamentsScreenParamList = {
//   TournamentsScreen: undefined;
// };

// export type RingsScreenParamList = {
//   RingsScreen: undefined;
// };

// export type MatchScreenParamList = {
//   MatchScreen: undefined
// }

export type SideMenuParamList = {
  Home: undefined,
  Events: undefined,
  Tournaments: { systemEventId: number},
  Pools: { tournamentId: number },
  Matches: { poolId: number },
  Match: { matchId: number },
};

export type RootStackParamList = {
  Root: undefined,
  NotFound: undefined,
}

export type ScreenPropType<ScreenName extends keyof SideMenuParamList> = StackScreenProps<SideMenuParamList, ScreenName>