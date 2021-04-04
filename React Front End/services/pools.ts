import { Pool } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/system_events/tournaments/groups"

type PoolInDb = {
  groupID: number,
  groupName: string
}

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapPoolFields(poolInDb: PoolInDb, tournamentId: number): Pool {
  return ({
    id: poolInDb.groupID,
    name: poolInDb.groupName,
    tournamentId,
  })
}

function mapPools(fromDb: PoolInDb[], tournamentId: number): Pool[] {
  return fromDb.map((p) => mapPoolFields(p, tournamentId))
}

export async function getAll(tournamentId: number) {
  const response = await axios.get(`${baseUrl}?tournamentID=${tournamentId}`)
  return mapPools(response.data, tournamentId)
}

const poolsService = {
  getAll
}

export default poolsService