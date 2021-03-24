import { Button } from 'react-native-elements'
import { Text, useThemeColor } from '../components/Themed';
import { SearchBar } from 'react-native-elements';
import { View, StyleSheet, FlatList, Image, ColorValue, Platform, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import Ring, { RingData } from '../components/Ring'

export default function TournamentList() {
    const [searchTerm, setSearchTerm] = useState('')

    const ringDataList: RingData[] = [
        {ringID: '1',
        ringName: 'Ring 1'}, 
        {ringID: '2',
        ringName: 'Ring 2'},
        {ringID: '3',
        ringName: 'Ring 3'},
        {ringID: '4',
        ringName: 'Ring 4'},
    ]

    const [filtered, setFiltered] = useState(ringDataList)

    const ringMap = (t: RingData) => (
        <Ring 
            ringID={t.ringID} 
            ringName={t.ringName}
        />
    )

    const updateSearch = (search: string) => {
        setSearchTerm(search)
        setFiltered(ringDataList.filter((t) => 
            t.ringName?.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim())
        ))
    };
    
    const theme = useColorScheme()

    const styles = StyleSheet.create({
        container: {
        textAlign: 'center',
        paddingBottom: 5
        },
        entry: {
            color: 'black'
        },
        searchBar: {
            backgroundColor: theme==='light' ? 'white':'black',
            marginTop: '5%',
            // marginBottom: '5%',
        },
        input: {
            backgroundColor: '#e4e4e4'
        }
    });

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
                renderItem={({item}) => ringMap(item)}
            />
        </View>
    )
    
}

const onPressTitle = () => {
    console.log("pressed");
  };

