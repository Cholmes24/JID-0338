type SetSecureValue = (key: string, value: string) => Promise<void>
type GetSecureValue = (key: string) => Promise<string | false>

const setSecureValue: SetSecureValue = async (key, value) => window.localStorage.setItem(key, value)

const getSecureValue: GetSecureValue = async (key) =>
  ((a) => (a ? a : false))(window.localStorage.getItem(key))

const localStorage = {
  setSecureValue,
  getSecureValue,
}
export default localStorage
