import * as React from 'react';
import { StyleSheet, Image, ColorValue } from 'react-native';
import { useSelector } from 'react-redux'
import CompetitorColumn, { CompetitorColumnProps } from '../components/CompetitorColumn'
import { Text, View } from '../components/Themed';
import UndoButton from '../components/UndoButton'
import { MatchState } from '../store/types'
import Timer from '../components/Timer'

type MatchScreenProps = {
  leftColumn: CompetitorColumnProps,
  rightColumn: CompetitorColumnProps
}

export default function MatchScreen() {
  const rightCompetitor = useSelector((state: MatchState) => state["right"])

  return (
    <View style={styles.container}>
      <View style={styles.timer}>
        <Timer/>
      </View>
      <View style={styles.scoreMonitor}>
        <View style={styles.competitorColumn} >
          <CompetitorColumn side="left" />
        </View>
        <View style={styles.competitorColumn} >
          <CompetitorColumn side="right" />
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
  competitorColumn: {
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
