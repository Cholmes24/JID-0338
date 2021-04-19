import * as React from 'react';
import { StyleSheet } from 'react-native';
import FighterColumn from '../components/FighterColumn'
import { View } from '../components/Themed';
import UndoButton from '../components/UndoButton'
import Timer from '../components/Timer'
import { Match, RootType } from '../redux-types/storeTypes'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ScreenPropType } from '../types';


export default function MatchScreen({
  route,
  navigation
}: ScreenPropType<"Match">) {
  const matchID = route.params.matchID

  const matches = useAppSelector((state: RootType) => state.matches)
  const match = matches.find((m: Match) => m.ID === matchID)
  if (!match) {
    throw Error("MATCH ID INVALID AT MATCH SCREEN")
  }

  const fighter1ID = match.fighter1ID
  const fighter2ID = match.fighter2ID

  return (
    <View style={styles.container}>
      <View style={styles.timer}>
        <Timer matchID={matchID} />
      </View>
      <View style={styles.scoreMonitor}>
        <View style={styles.FighterColumn} >
          <FighterColumn matchID={matchID} fighterID={fighter1ID} />
        </View>
        <View style={styles.FighterColumn} >
          <FighterColumn matchID={matchID} fighterID={fighter2ID} />
        </View>
      </View>
      <View style={styles.bottomTab}>
        <UndoButton matchID={matchID} />
        {/* TODO: Slide up tab at the bottom for undo */}
      </View>
    </View>
  );
}
const testBorders = {
  // borderColor: "yellow",
  // borderWidth: 2,
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    // flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  scoreMonitor: {
    flex: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTab: {
    flex: 0.5,
    alignSelf: "stretch",
    alignContent: "center",
    flexWrap: 'wrap',
    padding: 5,
    paddingBottom: 15
  },
  FighterColumn: {
    // For testing purposes to align things
    ...testBorders,

    alignSelf: "stretch",
    alignContent: "center",
    flex: 1,
    padding: 5,
  },
  timer: {
    alignSelf: "stretch",
    alignContent: "center",
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    shadowRadius: 3,
    elevation: 3,
    height: '10%',
    marginBottom: 3,
  }
});
