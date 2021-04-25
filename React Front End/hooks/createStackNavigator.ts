import {
  createNativeStackNavigator as _createNativeStackNavigator,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack'

const createStackNavigator = _createNativeStackNavigator
export default createStackNavigator

export type StackHeaderOptions = NativeStackNavigationOptions

export function stackHeaderOptions({
  left,
  center,
  right,
}: {
  left: any
  center: any
  right: any
}): StackHeaderOptions {
  return {
    headerRight: right,
    headerCenter: center,
    headerLeft: left,

    gestureEnabled: false,
  }
}
