import { Match } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/matches"

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapMatchFields(matchInDb: any): Match {
  return matchInDb
}

function mapMatches(fromDb: any[]): Match[] {
  return fromDb.map(mapMatchFields)
}

export async function getAll() {
  const response = await axios.get(baseUrl)
  return mapMatches(response.data)
}
