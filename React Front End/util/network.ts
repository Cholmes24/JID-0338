import Keychain from 'react-native-keychain'
type SetSecureValue = (key: string, value: string) => Promise<void>
type GetSecureValue = (key: string) => Promise<string | false>

const setSecureValue: SetSecureValue = async (key, value) => {
  await Keychain.setInternetCredentials(key, key, value)
}

const getSecureValue: GetSecureValue = async (key) =>
  ((a) => (a ? a.password : false))(await Keychain.getInternetCredentials(key))

const localStorage = {
  setSecureValue,
  getSecureValue,
}
export default localStorage
