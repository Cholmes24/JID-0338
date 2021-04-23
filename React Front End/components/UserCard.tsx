import React from "react"
import { Image, StyleSheet } from 'react-native'
import { Text, View } from "./Themed"

type UserCardProps = {
  uri?: string,
  firstName: string,
  lastName: string
}

export const defaultImageUri = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

export default function UserCard({uri=defaultImageUri, firstName, lastName}: UserCardProps) {
  return (
    <View style={styles.container} >
      <Image
        source={{ uri }}
        style={styles.image}
      />
      <Text style={styles.name}>{firstName}</Text>
      <Text style={styles.name}>{lastName}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2
  },
  name: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 4
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
})
