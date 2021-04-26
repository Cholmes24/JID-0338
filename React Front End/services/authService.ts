import { Address4 } from 'ip-address'
import axios from 'axios'
import { convertIPAddress } from '../util/utilFunctions'
import localStorage from '../util/network'

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
    const t = await localStorage.setSecureValue(url, token)
    return Boolean(t)
  } else {
    return false
  }
}

const authService = {
  requestToken,
}

export default authService
