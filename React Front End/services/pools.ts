import { Pool } from './../redux-types/storeTypes'
import axios from 'axios'

const baseUrl = '/api/system_events/tournaments/groups'

type PoolInDb = {
  groupID: number
  groupName: string
}

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapPoolFields(poolInDb: PoolInDb, tournamentID: number): Pool {
  return {
    ID: poolInDb.groupID,
    name: poolInDb.groupName,
    tournamentID,
  }
}

function mapPools(fromDb: PoolInDb[], tournamentID: number): Pool[] {
  return fromDb.map((p) => mapPoolFields(p, tournamentID))
}

export async function getAll(tournamentID: number) {
  const response = await axios.get(`${baseUrl}?tournamentID=${tournamentID}`)
  return mapPools(response.data, tournamentID)
}

const poolsService = {
  getAll,
}

export default poolsService
