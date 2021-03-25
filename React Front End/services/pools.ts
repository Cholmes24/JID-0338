import { Pool } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/pools"

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapPoolFields(poolInDb: any): Pool {
  return poolInDb
}

function mapPools(fromDb: any[]): Pool[] {
  return fromDb.map(mapPoolFields)
}

export async function getAll() {
  const response = await axios.get(baseUrl)
  return mapPools(response.data)
}
