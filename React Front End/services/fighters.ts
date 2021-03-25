import { Fighter } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/fighters"

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapFighterFields(fighterInDb: any): Fighter {
  return fighterInDb
}

function mapFighters(fromDb: any[]): Fighter[] {
  return fromDb.map(mapFighterFields)
}

export async function getAll() {
  const response = await axios.get(baseUrl)
  return mapFighters(response.data)
}
