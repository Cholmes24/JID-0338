import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { Text, View } from './Themed'

type UserCardProps = {
  uri?: string
  firstName?: string
  lastName?: string
}

export const defaultImageUri =
    'https://images.squarespace-cdn.com/content/v1/53518dd3e4b0e85fd91edde7/1607727526945-7CEYKZQUQXE4YDVTPKBY/ke17ZwdGBToddI8pDm48kBy_Di5oPbEsU06S-w0xqIh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1USuOa6StVHPk-_t9tEvkwaC7KSzfyQI3SstOP6fm2CCy3WUfc_ZsVm9Mi1E6FasEnQ/AHFA%2BLogo%2BGrey.png?format=1500w'

// 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

export default function UserCard({ uri = defaultImageUri, firstName, lastName }: UserCardProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} />
      {firstName && <Text style={styles.name}>{firstName}</Text>}
      {lastName && <Text style={styles.name}>{lastName}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
  },
  name: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 4,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})
