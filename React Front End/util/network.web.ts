type SetSecureValue = (key: string, value: string) => Promise<void>
type GetSecureValue = (key: string) => Promise<string | false>
type ClearSecureValue = (key: string) => Promise<void>

const setSecureValue: SetSecureValue = async (key, value) => localStorage.setItem(key, value)

const getSecureValue: GetSecureValue = async (key) =>
  ((a) => (a ? a : false))(localStorage.getItem(key))

const clearSecureValue: ClearSecureValue = async (key) => localStorage.removeItem(key)

const secureStorage = {
  setSecureValue,
  getSecureValue,
  clearSecureValue,
}

export default secureStorage
