import React from 'react'
import { StyleSheet } from 'react-native'
import CustomButton from './Button'
import { RootStateOrAny, useSelector } from 'react-redux'
import { MatchState } from '../store/types'
import ScoreCounter from './ScoreCounter'
import { View, Text } from './Themed'

export type CompetitorColumnProps = {
  id: string
}

export default function CompetitorColumn({id}: CompetitorColumnProps) {

  const competitor = useSelector((state: MatchState) => state.competitors.find(c => c.id === id))
  // const competitor = useSelector((state: RootStateOrAny) => state)
  // throw Error(JSON.stringify(competitor))


  if (!competitor) {
    throw Error("INVALID ID")
  }
  const color = competitor.color
  const name = competitor.name
  const fontSize = 20
  const testBorders = {
    // borderColor: "yellow",
    // borderWidth: 2,
  }
  const styles = StyleSheet.create({
    container: {
      // For testing purposes to align things
      ...testBorders,


      alignSelf: "center",
      flex: 1,
      paddingTop: 22,
      paddingHorizontal: 10,

      backgroundColor: color,
      borderRadius: 15,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: "center",
      elevation: 5,
      // shadowRadius: 2,
      // shadowOffset: { width: 1, height: 2 },
      // shadowColor: 'black',
      // shadowOpacity: 0.4,
    },
    playerName: {
      // For testing purposes to align things
      ...testBorders,

      color: "white",
      fontSize,
      backgroundColor: color,
      fontWeight: "bold",
      textAlign: "center",
      alignSelf: "center",
      alignContent: "center",
      flex: 1
    },
    button: {
      // For testing purposes to align things
      // ...testBorders,

      backgroundColor: color,
      flex: 1,
      padding: 5,
      paddingBottom: 8,
      width: "100%"
    },
    buttonList: {
      // For testing purposes to align things
      ...testBorders,

      backgroundColor: color,
      flex: 1.5,
      alignSelf: "stretch",
      alignItems: "center",
      marginBottom: 15
    },
    scoreCounter: {
      // For testing purposes to align things
      ...testBorders,

      backgroundColor: color,
      flex: 4.5
    },
    buttonText: {
      color: color,
      fontWeight: "bold"
    }
  })

  return (
    <View style={styles.container} >
      <Text style={styles.playerName} >{name}</Text>
      <View style={styles.scoreCounter}>
        <ScoreCounter id={id} />
      </View>

      <View style={styles.buttonList} >

        <View style={styles.button} >
          <CustomButton
            content={() => <Text style={styles.buttonText} >Warning</Text> }
            onPress={() => (undefined)}
            />
        </View>
        <View style={styles.button} >
          <CustomButton
            content={() => <Text style={styles.buttonText} >Penalty</Text> }
            onPress={() => (undefined)}
            />
        </View>
      </View>
    </View>
  )
}

// export function BCompetitorColumn({side}: CompetitorColumnProps) {
//   const competitor = useSelector((state: MatchState) => state[side])
//   const color = competitor.color
//   const name = competitor.name
//   const testBorders = {
//     // borderColor: "yellow",
//     // borderWidth: 2,
//   }
//   const styles = StyleSheet.create({
//     containerA: {
//       alignSelf: "stretch",
//       flex: 1,
//       paddingTop: 22,
//       paddingHorizontal: 10,

//       backgroundColor: color,
//       borderRadius: 15,
//       width: '100%',
//       justifyContent: 'center',
//       alignItems: 'center',
//       elevation: 5,
//       shadowRadius: 2,
//       flexWrap: 'wrap',
//     },
//     container: {
//       // For testing purposes to align things
//       ...testBorders,

//       alignSelf: "stretch",
//       flex: 1,
//       paddingTop: 22,
//       paddingHorizontal: 10,
//     },
//     button: {
//       // For testing purposes to align things
//       ...testBorders,

//       padding: 2,
//       alignItems: "center",
//       fontSize: 18,
//       height: 44,
//       flex: 1,
//       color
//     },
//     buttonList: {
//       // For testing purposes to align things
//       ...testBorders,

//       flex: 1.5,
//     },
//     title: {
//       // For testing purposes to align things
//       ...testBorders,

//       flex: 1,
//       alignSelf: "center",
//       alignContent: "center",
//       textAlign: "center",
//       fontSize: 20,
//       // height: 44,
//       fontWeight: "bold",
//       color
//     },
//     scoreCounter: {
//       // For testing purposes to align things
//       ...testBorders,

//       flex: 4
//     }
//   });
//   const button1 = () => <View style={styles.button} >
//     <CustomButton
//       color={color}
//       content={() => <Text>Button 1</Text> }
//       onPress={() => (undefined)}
//       fontSize={styles.button.fontSize}
//     />
//   </View>
//   const button2 = () => <View style={styles.button} >
//     <CustomButton
//       color={color}
//       content={() => <Text>Button 2</Text> }
//       onPress={() => (undefined)}
//       fontSize={styles.button.fontSize}
//     />
//   </View>

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{name}</Text>
//       <View style={styles.scoreCounter}>
//         <ScoreCounter side={side} />
//       </View>
//       <View style={styles.buttonList} >
//         {button1()}
//         {button2()}
//       </View>
//     </View>
//   );
// }
