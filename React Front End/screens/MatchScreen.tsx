import * as React from 'react';
import { StyleSheet, Image, ColorValue } from 'react-native';
import { useSelector } from 'react-redux'
import FighterColumn from '../components/FighterColumn'
import { Text, View } from '../components/Themed';
import UndoButton from '../components/UndoButton'
import { MatchState } from '../store/types'
import Timer from '../components/Timer'
import { Match, RootType } from '../redux-types/storeTypes'

type MatchScreenProps = {
  matchId: number
}

export default function MatchScreen({matchId}: MatchScreenProps) {
  const match = useSelector((state: RootType) => state.matches.find((m: Match) => m.id === matchId))
  if (!match) {
    throw Error("MATCH ID INVALID AT MATCH SCREEN")
  }
  const fighter1Id = match.fighter1Id
  const fighter2Id = match.fighter2Id


  return (
    <View style={styles.container}>
      <View style={styles.timer}>
        <Timer matchId={matchId} />
      </View>
      <View style={styles.scoreMonitor}>
        <View style={styles.FighterColumn} >
          <FighterColumn matchId={matchId} fighterId={fighter1Id} />
        </View>
        <View style={styles.FighterColumn} >
          <FighterColumn matchId={matchId} fighterId={fighter2Id} />
        </View>
      </View>
      <View style={styles.bottomTab}>
        <UndoButton />
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
