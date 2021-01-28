import * as React from 'react';
import { StyleSheet, Image, ColorValue } from 'react-native';
import CompetitorColumn, { CompetitorColumnProps } from '../components/Competitor Column'
import { Text, View } from '../components/Themed';
import UserCard from '../components/UserCard'

type MatchScreenProps = {
  leftColumn: CompetitorColumnProps,
  rightColumn: CompetitorColumnProps
}

export default function MatchScreen() {
  return (
    <View style={styles.container}>
      <CompetitorColumn
        side="left"
      />
      <CompetitorColumn
        side="right"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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
});
