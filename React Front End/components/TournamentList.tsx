import { Button } from 'react-native-elements'
import { Text, useThemeColor } from '../components/Themed';
import { SearchBar } from 'react-native-elements';
import { View, StyleSheet, FlatList, Image, ColorValue, Platform, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import Tournament, { TournamentData } from '../components/Tournament'

export default function TournamentList() {
    const [searchTerm, setSearchTerm] = useState('')

    const tournamentDataList: TournamentData[] = [
        {tournamentID: '1',
        tournamentName: 'Boston Open'}, 
        {tournamentID: '2',
        tournamentName: 'Philly Cheese Stakes'},
        {tournamentID: '3',
        tournamentName: 'Fencing People Inc.'},
        {tournamentID: '4',
        tournamentName: 'Tournament D'},
        {tournamentID: '1',
        tournamentName: 'Gech Good Tournie'}, 
        {tournamentID: '2',
        tournamentName: 'Keith Semi-finals'},
        {tournamentID: '3',
        tournamentName: 'Johnny Boy Mega 500'},
        {tournamentID: '4',
        tournamentName: 'Johnny Man Mini 500'},
    ]

    const [filtered, setFiltered] = useState(tournamentDataList)

    const tournamentMap = (t: TournamentData) => (
        <Tournament 
            tournamentID={t.tournamentID} 
            tournamentName={t.tournamentName}
        />
    )

    const updateSearch = (search: string) => {
        setSearchTerm(search)
        setFiltered(tournamentDataList.filter((t) => 
            t.tournamentName?.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim())
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
                renderItem={({item}) => tournamentMap(item)}
            />
        </View>
    )
    
}

const onPressTitle = () => {
    console.log("pressed");
  };

