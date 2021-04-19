import React, { useEffect, useState } from 'react'
import { GestureResponderEvent, useColorScheme, StyleSheet, View, FlatList } from 'react-native'
import { Button, SearchBar } from 'react-native-elements'
import { useAppSelector } from '../hooks/reduxHooks'
import { Match, Pool, RootType, SystemEvent, Tournament } from '../redux-types/storeTypes'
import MatchSelectionButton from './MatchSelectionButton'

export type ListProps<T extends RootListItem> = {
  listNameAtRoot: keyof RootType,
  onPressFactory: (t: T) => ((event: GestureResponderEvent) => void),
  getName: (listItem: T) => string,
}

type RootListItem = SystemEvent | Tournament | Pool | Match

export default function List<T extends RootListItem>({ listNameAtRoot, onPressFactory, getName }: ListProps<T>) {
  if (listNameAtRoot === "currentIDs") {
    throw new Error("INVALID LIST KEY")
  }
  if (listNameAtRoot === "fighters") {
    throw new Error("FIGHTER LIST KEY FUNCTIONALITY NOT IMPLEMENTED")
  }

  type AllowedParentKeyName = "poolID" | "tournamentID" | "systemEventID"
  type InputParentKeyName = "poolID" | "tournamentID" | "systemEventID" | undefined
  const getParentKeyName = () => {
    switch (listNameAtRoot) {
      case "matches":
        return "poolID"
      case "pools":
        return "tournamentID"
      case "tournaments":
        return "systemEventID"
      default:
        return undefined
    }
  }

  const parentKeyName = getParentKeyName()

  const currentParentID = parentKeyName !== undefined ? useAppSelector(state => state.currentIDs[parentKeyName]) : undefined

  function checkForParentKeyName(item: T, parentKeyName: AllowedParentKeyName): item is T & Record<AllowedParentKeyName, number>  {
    return item.hasOwnProperty(parentKeyName)
  }

  function parentKeyNameAllowed(IDKey: InputParentKeyName): IDKey is AllowedParentKeyName {
    return IDKey !== undefined
  }

  const allItems = useAppSelector(state => state[listNameAtRoot]) as T[]
  const relevantItems = parentKeyNameAllowed(parentKeyName)
    ? allItems.filter(i => checkForParentKeyName(i, parentKeyName) && i[parentKeyName] === currentParentID)
    : allItems

  const [searchTerm, setSearchTerm] = useState('')
  const [filtered, setFiltered] = useState(relevantItems)

  useEffect(() => {
    setSearchTerm('')
    setFiltered(relevantItems)
  }, [currentParentID])

  const updateSearch = (search: string) => {
      setSearchTerm(search)
      setFiltered(relevantItems.filter(item =>
          getName(item).toLocaleLowerCase().includes(search.toLocaleLowerCase().trim())
          // || item.subTitle?.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim())
      ))
  }

  const itemMap = (item: T) => (
    listNameAtRoot === "matches"
    ? <MatchSelectionButton matchID={item.ID} onPress={onPressFactory(item)} name={getName(item)} />
    : <View style={styles.buttonWrapper}>
        <Button
          buttonStyle={styles.entry}
          onPress={onPressFactory(item)}
          title={getName(item)}
          iconRight={true}
        />
      </View>
  )

  const theme = useColorScheme()

  const styles = StyleSheet.create({
    container: {
      alignSelf: "stretch",
      textAlign: 'center',
      flex: 1,
      paddingBottom: 5
    },
    buttonWrapper: {
      textAlign: 'center',
      // backgroundColor: 'white',
      width: '100%',
    },
    entry: {
      width: '95%',
      padding: '10%',
      marginTop: '5%',
      marginBottom: '5%',
      borderRadius: 15,
      alignSelf: "center",
      paddingHorizontal: 5
    },
    searchBar: {
      backgroundColor: theme==='light' ? 'white':'black',
      marginTop: '5%',
      // marginBottom: '5%',
    },
    input: {
      backgroundColor: '#e4e4e4'
    }
  })

  return (
    <View style={styles.container}>
      <SearchBar
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.input}
        placeholder="Click Here to Search"
        onChangeText={updateSearch}
        value={searchTerm}
        lightTheme={true}
        round={true}
      />
      <FlatList
        data={filtered}
        renderItem={({item}) => itemMap(item)}
        keyExtractor={(item) => item.ID.toString()}
      />
    </View>
  )

}