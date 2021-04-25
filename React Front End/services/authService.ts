import { Address4 } from 'ip-address'
import axios from 'axios'
import Keychain from 'react-native-keychain'
import { convertIPAddress } from '../util/utilFunctions'

async function requestToken(accessCode: string, ip: string) {
  const url = convertIPAddress(ip)
  if (Address4.isValid(ip.split(':')[0])) {
    axios.defaults.baseURL = url

    return true
  } else {
    return false
  }
  if (url === '') {
    return false
  }
  const response = await axios.post(`${url}api/token`, {
    accessCode,
  })

  if (url && response.data) {
    axios.defaults.baseURL = url

    const token = `bearer ${response.data}`
    console.log(ip, url, token)
    const t = await Keychain.setGenericPassword(url, token)
    return Boolean(t)
  } else {
    return false
  }
}

const authService = {
  requestToken,
}

export default authService
