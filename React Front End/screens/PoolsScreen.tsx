import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Timer from '../components/Timer'
import UserCard from '../components/UserCard'
import { ScreenPropType } from '../types';

export default function PoolsScreen({
  route,
  navigation
}: ScreenPropType<"Pools">) {
  return (
    <View style={styles.container}>
      <UserCard
        uri="http://www.grandvoyageitaly.com/uploads/3/7/2/7/37277491/sheep-nanny_orig.jpg"
        firstName="This is technically a User's First Name"
        lastName="But it's cool that it works!"
      />
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
