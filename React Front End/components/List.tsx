import React, { useEffect, useState } from 'react'
import { GestureResponderEvent, useColorScheme, StyleSheet, View, FlatList } from 'react-native'
import { Button, SearchBar } from 'react-native-elements'
import { useAppSelector } from '../hooks/reduxHooks'
import { CurrentIds, Fighter, Match, Pool, RootType, SystemEvent, Tournament } from '../redux-types/storeTypes'

export type ListProps<T extends RootListItem> = {
  listNameAtRoot: keyof RootType,
  onPressFactory: (t: T) => ((event: GestureResponderEvent) => void),
  // filter: (fullList: T[]) => T[],
  getName: (listItem: T) => string,
  // parentIdKeyName: keyof CurrentIds & keyof T,
}

type RootListItem = SystemEvent | Tournament | Pool | Match

// type ListItem<T> = T & {
//   name: string,
//   id: number
// }


export default function List<T extends RootListItem>({ listNameAtRoot, onPressFactory, getName }: ListProps<T>) {
  if (listNameAtRoot === "currentIds") {
    throw new Error("INVALID LIST KEY")
  }
  if (listNameAtRoot === "fighters") {
    throw new Error("FIGHTER LIST KEY FUNCTIONALITY NOT IMPLEMENTED")
  }

  type AllowedParentKeyName = "poolId" | "tournamentId" | "systemEventId"
  type InputParentKeyName = "poolId" | "tournamentId" | "systemEventId" | undefined
  const getParentKeyName = () => {
    switch (listNameAtRoot) {
      case "matches":
        return "poolId"
      case "pools":
        return "tournamentId"
      case "tournaments":
        return "systemEventId"
      default:
        return undefined
    }
  }
  
  const parentKeyName = getParentKeyName()

  const currentParentId = parentKeyName !== undefined ? useAppSelector(state => state.currentIds[parentKeyName]) : undefined

  function checkForParentKeyName(item: T, parentKeyName: AllowedParentKeyName): item is T & Record<AllowedParentKeyName, number>  {
    return item.hasOwnProperty(parentKeyName)
  }

  function parentKeyNameAllowed(idKey: InputParentKeyName): idKey is AllowedParentKeyName {
    return idKey !== undefined
  }

  // console.log("params:", listNameAtRoot, parentKeyName, currentParentId)
  const allItems = useAppSelector(state => state[listNameAtRoot]) as T[]
  // console.log("allItems:", allItems)
  const relevantItems = parentKeyNameAllowed(parentKeyName)
    ? allItems.filter(i => checkForParentKeyName(i, parentKeyName) && i[parentKeyName] === currentParentId)
    : allItems
  // console.log("relevantItems:", relevantItems)
  // allItems.filter((item: T) => getParentId(item) === parentId)

  // useEffect(() => {
  //   setRelevantItems(filter(allItems))
  // })

  const [searchTerm, setSearchTerm] = useState('')
  const [filtered, setFiltered] = useState(relevantItems)

  const updateSearch = (search: string) => {
      setSearchTerm(search)
      setFiltered(relevantItems.filter(item => 
          getName(item).toLocaleLowerCase().includes(search.toLocaleLowerCase().trim()) 
          // || item.subTitle?.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim())
      ))
  }
  
  const itemMap = (item: T) => (
    <View style={styles.buttonWrapper}>
      <Button
        buttonStyle={styles.entry}
        onPress={onPressFactory(item)}
        title={getName(item)}
      />
    </View>
    //   {item.title}
    //   {item.subTitle || null}
    // </Button>
  )

  const theme = useColorScheme()

  const styles = StyleSheet.create({
    container: {
      alignSelf: "stretch",
      textAlign: 'center',
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
        data={relevantItems}
        renderItem={({item}) => itemMap(item)}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )

}