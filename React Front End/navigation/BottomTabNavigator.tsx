import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TournamentsScreen from '../screens/TournamentsScreen';
import RingsScreen from '../screens/RingsScreen';
import HomeScreen from '../screens/HomeScreen'

import { BottomTabParamList, TournamentsScreenParamList, RingsScreenParamList, HomeScreenParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Tournaments"
        component={TournamentsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Rings"
        component={RingsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />

    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TournamentsStack = createStackNavigator<TournamentsScreenParamList>();

function TournamentsNavigator() {
  return (
    <TournamentsStack.Navigator>
      <TournamentsStack.Screen
        name="TournamentsScreen"
        component={TournamentsScreen}
        options={{ headerTitle: 'Tab One Title', headerTitleAlign: "center"  }}
      />
    </TournamentsStack.Navigator>
  );
}

const RingsStack = createStackNavigator<RingsScreenParamList>();

function RingsNavigator() {
  return (
    <RingsStack.Navigator>
      <RingsStack.Screen
        name="RingsScreen"
        component={RingsScreen}
        options={{ headerTitle: 'Tab Two Title', headerTitleAlign: "center"  }}
      />
    </RingsStack.Navigator>
  );
}

const HomeScreenStack = createStackNavigator<HomeScreenParamList>()

function HomeScreenNavigator() {
  return (
    <HomeScreenStack.Navigator>
      <HomeScreenStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: 'Home Screen', headerTitleAlign: "center" }}
      />
    </HomeScreenStack.Navigator>
  )
}
