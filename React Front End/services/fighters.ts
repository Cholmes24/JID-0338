import { Fighter } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/fighters"

type FighterInDb = {
  firstName: string,
  lastName: string
}

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapFighterFields(fighterInDb: FighterInDb, ID: number): Fighter {
  return {
    firstName: fighterInDb.firstName,
    lastName: fighterInDb.lastName,
    ID,
    color: (ID % 2 === 1) ? "#376EDA" : "#D43737"
  }
}

function mapFighters(fromDb: FighterInDb[]): Fighter[] {
  return fromDb.map(mapFighterFields)
}

// async function getAll() {
//   const response = await axios.get(baseUrl)
//   return mapFighters(response.data)
// }

async function getByID(fighterID: number) {
  const response = await axios.get(`${baseUrl}?fighterID=${fighterID}`)
  return mapFighterFields(response.data, fighterID)
}

const fightersService = {
  getByID
}
export default fightersService