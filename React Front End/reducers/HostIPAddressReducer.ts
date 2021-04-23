import { SetHostIPAddess, SET_HOST_IP_ADDRESS } from './../redux-types/actionTypes'
import { AnyAction, Reducer } from "redux"
import ipAddress from 'ip-address'

const HostIPAddressReducer: Reducer<ipAddress.Address6 | null, AnyAction> = (state = null, action) => {
  switch (action.type) {
    case SET_HOST_IP_ADDRESS:
      return parseIPIntoIPV6(state, action as SetHostIPAddess)
    default:
      return state
  }
}

const parseIPIntoIPV6 = (state: ipAddress.Address6 | null, action: SetHostIPAddess) => {
  const isv4 = ipAddress.Address4.isValid(action.payload)
  const isv6 = ipAddress.Address6.isValid(action.payload)
  if (!isv4 && !isv6) {
    return state
  } else if (isv4) {
    return ipAddress.Address6.fromAddress4(action.payload)
  } else {
    const parsed = ipAddress.Address6.fromURL(action.payload).address
    if (parsed) {
      return parsed
    } else {
      return state
    }
  }
}

export default HostIPAddressReducer