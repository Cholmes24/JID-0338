import React, { useEffect, useState } from 'react'
import { GestureResponderEvent, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { useAppSelector } from '../hooks/reduxHooks'
import { Match, Pool, RootType, SystemEvent, Tournament } from '../redux-types/storeTypes'
import { checkForParentKeyName, getParentKeyName } from '../util/utilFunctions'
import MatchSelectionButton from './MatchSelectionButton'

import { View, FlatList, SearchBar } from './Themed'

export type ListProps<T extends RootListItem> = {
  listNameAtRoot: keyof RootType
  onPressFactory: (t: T) => (event: GestureResponderEvent) => void
  getName: (listItem: T) => string
}

type RootListItem = SystemEvent | Tournament | Pool | Match

export default function List<T extends RootListItem>({
  listNameAtRoot,
  onPressFactory,
  getName,
}: ListProps<T>) {
  if (listNameAtRoot === 'currentIDs') {
    throw new Error('INVALID LIST KEY')
  }
  if (listNameAtRoot === 'fighters') {
    throw new Error('FIGHTER LIST KEY FUNCTIONALITY NOT IMPLEMENTED')
  }

  const allItems = useAppSelector((state) => state[listNameAtRoot]) as T[]

  const parentKeyName = getParentKeyName(listNameAtRoot)

  const currentParentID =
    parentKeyName !== undefined
      ? useAppSelector((state) => state.currentIDs[parentKeyName])
      : undefined

  const relevantItems = parentKeyName
    ? allItems.filter(
        (i) => checkForParentKeyName(i, parentKeyName) && i[parentKeyName] === currentParentID
      )
    : allItems

  const [searchTerm, setSearchTerm] = useState('')
  const [filtered, setFiltered] = useState(relevantItems)

  useEffect(() => {
    setSearchTerm('')
    setFiltered(relevantItems)
  }, [listNameAtRoot, allItems])

  const updateSearch = (search: string) => {
    setSearchTerm(search)
    setFiltered(
      relevantItems.filter((item) =>
        getName(item).toLocaleLowerCase().includes(search.toLocaleLowerCase().trim())
      )
    )
  }

  const getItemData = (item: T) => ({
    buttonStyle: styles.entry,
    onPress: onPressFactory(item),
    title: getName(item),
  })

  const matchesButton = (item: T) => (
    <MatchSelectionButton matchID={item.ID} {...getItemData(item)} />
  )

  const itemButton = (item: T) => <Button {...getItemData(item)} />

  return (
    <View style={styles.container}>
      <SearchBar
        inputStyle={{ color: '#111' }}
        containerStyle={styles.searchBar}
        // @ts-ignore
        onChangeText={updateSearch}
        placeholder="Click Here to Search"
        value={searchTerm}
      />
      <FlatList
        data={filtered}
        renderItem={({ item }) => (
          <View style={styles.buttonWrapper}>
            {listNameAtRoot === 'matches' ? matchesButton(item) : itemButton(item)}
          </View>
        )}
        keyExtractor={(item) => item.ID.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    textAlign: 'center',
    flex: 1,
    paddingBottom: 5,
  },
  buttonWrapper: {
    textAlign: 'center',
    width: '100%',
  },
  entry: {
    width: '95%',
    padding: '10%',
    marginTop: '5%',
    marginBottom: '5%',
    borderRadius: 15,
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
  searchBar: {
    marginTop: '3%',
  },
})
