import { Address4 } from 'ip-address'
import axios from 'axios'
import { convertIPAddress, ipFromUrl } from '../util/utilFunctions'
import secureStorage from '../util/network'

async function requestToken(accessCode: string, ip: string) {
  if (!Address4.isValid(ip.split(':')[0])) {
    return false
  }
  const url = convertIPAddress(ip)
  const response = await axios.post(`${url}api/token`, {
    accessCode,
  })
  if (url && response.data) {
    const token = `bearer${response.data || ''}`
    axios.defaults.baseURL = url
    await secureStorage.setSecureValue(ipFromUrl(url), response.data)
    return true
  } else {
    return false
  }
}

async function logout() {
  const key = axios.defaults.baseURL
  axios.defaults.baseURL = undefined
  if (key) {
    await secureStorage.clearSecureValue(ipFromUrl(key))
  }
}

const authService = {
  requestToken,
  logout,
}

export default authService
