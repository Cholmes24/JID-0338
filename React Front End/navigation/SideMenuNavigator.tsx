import * as React from 'react'
import useColorScheme from '../hooks/useColorScheme'
import TournamentsScreen from '../screens/TournamentsScreen'
import PoolsScreen from '../screens/PoolsScreen'
import HomeScreen from '../screens/HomeScreen'

import { Text } from '../components/Themed'
import { SideMenuParamList } from '../types'
import { useNavigation } from '@react-navigation/native'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'
import MatchScreen from '../screens/MatchScreen'
import SystemEventsScreen from '../screens/SystemEventsScreen'
import MatchesScreen from '../screens/MatchesScreen'
import { Icon } from 'react-native-elements'
import createStackNavigator, {
  stackHeaderOptions,
  StackHeaderOptions,
} from '../hooks/createStackNavigator'

const SideMenu = createStackNavigator<SideMenuParamList>()

export default function SideMenuNavigator() {
  const colorScheme = useColorScheme()

  return (
    <SideMenu.Navigator screenOptions={{ headerShown: true }}>
      <SideMenu.Screen
        name="Home"
        component={HomeScreen}
        options={headerOptions(colorScheme, 'Home', 'none')}
      />
      <SideMenu.Screen
        name="Events"
        component={SystemEventsScreen}
        options={headerOptions(colorScheme, 'Events', undefined, 'home')}
      />
      <SideMenu.Screen
        name="Tournaments"
        component={TournamentsScreen}
        options={headerOptions(colorScheme, 'Tournaments', undefined, 'home')}
      />
      <SideMenu.Screen
        name="Pools"
        component={PoolsScreen}
        options={headerOptions(colorScheme, 'Pools', undefined, 'home')}
      />
      <SideMenu.Screen
        name="Matches"
        component={MatchesScreen}
        options={headerOptions(colorScheme, 'Matches', undefined, 'home')}
      />
      <SideMenu.Screen
        name="Match"
        component={MatchScreen}
        options={headerOptions(colorScheme, 'Match')}
      />
    </SideMenu.Navigator>
  )
}

function headerOptions(
  colorScheme: 'light' | 'dark',
  title: string,
  leftButtonType: 'back' | 'hamburger' | 'none' = 'back',
  right?: string
): StackHeaderOptions {
  const navigation = useNavigation()
  const iconColor = colorScheme === 'dark' ? 'white' : 'black'
  const headerRight = () =>
    right === 'home' && (
      <Icon
        type="feather"
        name="home"
        color={iconColor}
        style={styles.featherButton}
        onPress={() => navigation.navigate('Home')}
      />
    )

  const headerLeft = () => {
    switch (leftButtonType) {
      case 'hamburger':
        return (
          <Icon
            type="feather"
            name="home"
            color={iconColor}
            style={styles.featherButton}
            onPress={() => navigation.navigate('Home')}
          />
        )
      case 'back':
        return (
          <Icon
            type="feather"
            name="arrow-left-circle"
            color={iconColor}
            style={styles.featherButton}
            onPress={() => navigation.goBack()}
          />
        )
      case 'none':
        return <></>
    }
  }

  return stackHeaderOptions({
    left: headerLeft,
    center: () => wrapInComponent(title, styles.title),
    right: headerRight,
  })
}

function wrapInComponent(toWrap?: string | JSX.Element, style?: StyleProp<TextStyle>) {
  return !toWrap ? <></> : typeof toWrap === 'string' ? <Text style={style}>{toWrap}</Text> : toWrap
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  featherButton: {
    fontSize: 24,
    padding: 10,
  },
})
