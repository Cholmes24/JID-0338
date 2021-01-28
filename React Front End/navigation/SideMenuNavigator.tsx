import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import useColorScheme from '../hooks/useColorScheme';
import TournamentsScreen from '../screens/TournamentsScreen';
import RingsScreen from '../screens/RingsScreen';
import HomeScreen from '../screens/HomeScreen'

import { Text } from '../components/Themed'
import { SideMenuParamList } from '../types';
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { StackHeaderOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { StyleProp, StyleSheet, TextStyle } from "react-native"
import { DrawerHeaderOptions } from '@react-navigation/drawer/lib/typescript/src/types'
import MatchScreen from '../screens/MatchScreen'

const SideMenu = createDrawerNavigator<SideMenuParamList>()

export default function SideMenuNavigator() {
  return (
    <SideMenu.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
      <SideMenu.Screen
        name="Home"
        component={HomeScreen}
        options={headerOptions("Home")}
      />
      <SideMenu.Screen
        name="Tournaments"
        component={TournamentsScreen}
        options={headerOptions("Tournaments")}
      />
      <SideMenu.Screen
        name="Rings"
        component={RingsScreen}
        options={headerOptions("Rings")}
      />
      <SideMenu.Screen
        name="Match"
        component={MatchScreen}
        options={headerOptions("Match 1")}
      />
    </SideMenu.Navigator>
  );
}

function headerOptions(
  title: string | JSX.Element,
  leftButtonType: "back" | "hamburger" | "none" = "hamburger",
  right?: string
): DrawerHeaderOptions {
  const navigation = useNavigation()

  const headerLeft = () => {
    switch (leftButtonType) {
      case "hamburger": return <Feather name="menu" style={styles.featherButton} onPress={
        () => navigation.dispatch(DrawerActions.toggleDrawer)} />
      case "back": return <Feather name="arrow-left-circle" style={styles.featherButton} onPress={
        () => navigation.goBack()} />
      case "none": return <></>
    }
  }

  return {
    headerTitleAllowFontScaling: true,
    headerTitleAlign: "center",
    headerRight: () => wrapInComponent(right),
    headerTitle: () => wrapInComponent(title, styles.title),
    headerLeft
  }
}

function wrapInComponent(toWrap?: string | JSX.Element, style?: StyleProp<TextStyle>) {
  return !toWrap ? <></>
    : typeof(toWrap) === "string" ? <Text style={style}>{toWrap}</Text>
    : toWrap
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  featherButton: {
    fontSize: 24,
    padding: 10
  }
})
