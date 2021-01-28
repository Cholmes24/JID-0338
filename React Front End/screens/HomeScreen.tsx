import React from "react"
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import ScoreCounter from "../components/ScoreCounter"
import { Text, View } from '../components/Themed';
import UserCard from "../components/UserCard"

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <UserCard
        firstName={"longFirstName"}
        lastName={"longLastName"}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
