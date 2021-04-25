import { StackHeaderOptions as _StackHeaderOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { createStackNavigator as _createStackNavigator } from '@react-navigation/stack'

const createStackNavigator = _createStackNavigator
export default createStackNavigator

export type StackHeaderOptions = _StackHeaderOptions

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
    headerTitleAllowFontScaling: true,
    headerTitleAlign: 'center',
    headerRight: right,
    headerTitle: center,
    headerLeft: left,
  }
}
