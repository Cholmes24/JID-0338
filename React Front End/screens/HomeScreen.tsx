import React, { useEffect } from "react"
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Button } from 'react-native-elements'
import UserCard from "../components/UserCard"
import { Tournament } from "../redux-types/storeTypes"
import { TournamentsActionType } from "../redux-types/actionTypes"

import tournamentServices from '../services/tournaments'
import { useAppDispatch } from "../hooks/reduxHooks"
import { AppThunk } from "../store"

export default function HomeScreen() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(thunkTournaments())
  })

  const thunkTournaments = (): AppThunk => (
    async dispatch => {
      const tournaments = await tournamentServices.getAll()
      dispatch({
        type: "SET_TOURNAMENTS",
        payload: tournaments
      })
    }
  )
  return (
    <View style={styles.userCard}>
      <UserCard
        firstName={"longFirstName"}
        lastName={"longLastName"}
      />

      <Button
        buttonStyle={styles.matchButton}
        title='Most Recent Match'
      />
      <View style={styles.filler}></View>
    </View>

  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  userCard: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchButton: {
    width: '100%',
    padding: '10%',
    marginTop: '5%',
    marginBottom: '5%',
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  filler: {
    height: '40%'
  }
});
