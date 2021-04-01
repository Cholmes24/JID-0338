import { Fighter } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/matches/fighters"

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapFighterFields(fighterInDb: any, id: number): Fighter {
  return {
    firstName: fighterInDb.firstName,
    lastName: fighterInDb.lastName,
    id,
    color: "black"
  }
}

function mapFighters(fromDb: any[]): Fighter[] {
  return fromDb.map(mapFighterFields)
}

// async function getAll() {
//   const response = await axios.get(baseUrl)
//   return mapFighters(response.data)
// }

async function getById(fighterId: number) {
  const response = await axios.get(baseUrl, {
    params: {
      fighterID: fighterId
    }
  })
  return mapFighterFields(response.data, fighterId)
}

export default {
  getById
}