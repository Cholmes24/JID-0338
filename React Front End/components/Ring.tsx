import { Button } from 'react-native-elements'
import { Text } from '../components/Themed';
import { View, StyleSheet, Image, ColorValue, Platform } from 'react-native'
import React from 'react'



export type RingData = {
    ringID: string
    ringName?: string
}

export default function Ring({ringID, ringName}: RingData) {
    return (
        <View style={styles.container}>
            <Button
                buttonStyle={styles.entry}
                title={ringName}
        //   onPress={addTime}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      textAlign: 'center',
      backgroundColor: 'white',
      width: '100%',
    },
    entry: {
      width: '100%',
      padding: '10%',
      marginTop: '5%',
      marginBottom: '5%',
      borderRadius: 15,
    }
  });