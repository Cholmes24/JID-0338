import { Fighter } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/fighters"

type FighterInDb = {
  firstName: string,
  lastName: string
}

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapFighterFields(fighterInDb: FighterInDb, id: number): Fighter {
  return {
    firstName: fighterInDb.firstName,
    lastName: fighterInDb.lastName,
    id,
    color: (id % 2 === 1) ? "#376EDA" : "#D43737"
  }
}

function mapFighters(fromDb: FighterInDb[]): Fighter[] {
  return fromDb.map(mapFighterFields)
}

// async function getAll() {
//   const response = await axios.get(baseUrl)
//   return mapFighters(response.data)
// }

async function getById(fighterId: number) {
  const response = await axios.get(`${baseUrl}?fighterID=${fighterId}`)
  return mapFighterFields(response.data, fighterId)
}

const fightersService = {
  getById
}
export default fightersService