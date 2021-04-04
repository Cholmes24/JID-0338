import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import useColorScheme from '../hooks/useColorScheme';
import TournamentsScreen from '../screens/TournamentsScreen';
import PoolsScreen from '../screens/PoolsScreen';
import HomeScreen from '../screens/HomeScreen'

import { Text } from '../components/Themed'
import { SideMenuParamList } from '../types';
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { StackHeaderOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { StyleProp, StyleSheet, TextStyle } from "react-native"
import { DrawerHeaderOptions } from '@react-navigation/drawer/lib/typescript/src/types'
import MatchScreen from '../screens/MatchScreen'
import SystemEventsScreen from '../screens/SystemEventsScreen';
import MatchesScreen from '../screens/MatchesScreen';

const SideMenu = createDrawerNavigator<SideMenuParamList>()

export default function SideMenuNavigator() {
  const colorScheme = useColorScheme()

  return (
    <SideMenu.Navigator screenOptions={{ headerShown: true }}>
      <SideMenu.Screen
        name="Home"
        component={HomeScreen}
        options={headerOptions(colorScheme, "Home", "none")}
      />
      <SideMenu.Screen
        name="Events"
        component={SystemEventsScreen}
        options={headerOptions(colorScheme, "Events")}
      />
      <SideMenu.Screen
        name="Tournaments"
        component={TournamentsScreen}
        options={headerOptions(colorScheme, "Tournaments")}
      />
      <SideMenu.Screen
        name="Pools"
        component={PoolsScreen}
        options={headerOptions(colorScheme, "Pools")}
      />
      <SideMenu.Screen
        name="Matches"
        component={MatchesScreen}
        options={headerOptions(colorScheme, "Matches")}
      />
      <SideMenu.Screen
        name="Match"
        component={MatchScreen}
        options={headerOptions(colorScheme, "Match")}
      />
    </SideMenu.Navigator>
  );
}

function headerOptions(
  colorScheme: "light" | "dark",
  title: string | JSX.Element,
  leftButtonType: "back" | "hamburger" | "none" = "back",
  right?: string
): DrawerHeaderOptions {
  const navigation = useNavigation()
  const iconColor = colorScheme === "dark" ? "white" : "black"

  const headerLeft = () => {
    switch (leftButtonType) {
      case "hamburger": return <Feather name="menu" color={iconColor} style={styles.featherButton} onPress={
        () => navigation.dispatch(DrawerActions.toggleDrawer)} />
      case "back": return <Feather name="arrow-left-circle" color={iconColor} style={styles.featherButton} onPress={
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
