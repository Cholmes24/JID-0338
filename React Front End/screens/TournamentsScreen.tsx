import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import UserCard from '../components/UserCard'
import Tournament from '../components/Tournament'
import TournamentList from '../components/TournamentList'


export default function TournamentsScreen() {
  return (
    <View style={styles.container}>
      <TournamentList/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
