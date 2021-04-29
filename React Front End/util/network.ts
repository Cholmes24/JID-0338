import * as SecureStore from 'expo-secure-store'
type SetSecureValue = (key: string, value: string) => Promise<void>
type GetSecureValue = (key: string) => Promise<string | false>
type ClearSecureValue = (key: string) => Promise<void>

const setSecureValue: SetSecureValue = async (key, value) => {
  return SecureStore.setItemAsync(key, value)
}

const getSecureValue: GetSecureValue = async (key) =>
  ((a) => (a ? a : false))(await SecureStore.getItemAsync(key))

const clearSecureValue: ClearSecureValue = async (key) => {
  await SecureStore.deleteItemAsync(key)
}

const secureStorage = {
  setSecureValue,
  getSecureValue,
  clearSecureValue,
}

export default secureStorage
