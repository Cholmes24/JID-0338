import * as React from 'react'
import { Text as DefaultText, View as DefaultView, FlatList as DefaultList } from 'react-native'
import {
  SearchBar as DefaultSearchBar,
  SearchBarProps as DefaultSearchBarProps,
} from 'react-native-elements'

import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme()
  const colorFromProps = props[theme]

  if (colorFromProps) {
    return colorFromProps
  } else {
    return Colors[theme][colorName]
  }
}

type ThemeProps = {
  lightColor?: string
  darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']
export type ViewProps = ThemeProps & DefaultView['props']
export type FlatListProps = ThemeProps & DefaultList['props']
export type SearchBarProps = ThemeProps & DefaultSearchBarProps

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return <DefaultText style={[{ color }, style]} {...otherProps} />
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />
}

export function FlatList(props: FlatListProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

  return <DefaultList style={[{ backgroundColor }, style]} {...otherProps} />
}

export function SearchBar(props: SearchBarProps & DefaultView['props']) {
  const { inputContainerStyle, lightColor, darkColor, containerStyle, round, ...otherProps } = props
  const backgroundColor = useThemeColor(
    {
      light: darkColor,
      dark: darkColor,
    },
    'background'
  )

  return (
    <DefaultSearchBar
      inputContainerStyle={[inputContainerStyle, { backgroundColor: '#e4e4e4' }]}
      // @ts-ignore
      round={true}
      containerStyle={[
        containerStyle,
        { backgroundColor, borderTopColor: 'transparent', borderBottomColor: 'transparent' },
      ]}
      {...otherProps}
    />
  )
}
