import { Fighter } from './../redux-types/storeTypes'
import axios from 'axios'

const baseUrl = '/api/fighters'

type FighterInDB = {
  firstName: string
  lastName: string
  fighterID: number
}

//TODO: account for colors if possible
function mapFighterFields(fighterInDB: FighterInDB): Fighter {
  const { firstName, lastName } = fighterInDB
  const ID = fighterInDB.fighterID
  return {
    firstName,
    lastName,
    ID,
    color: ID % 2 === 1 ? '#376EDA' : '#D43737',
  }
}

async function getAllByPoolID(poolID: number) {
  const response = await axios.get(`/api/system_events/tournaments/groups/fighters?groupID=${poolID}`)
  return response.data.map(mapFighterFields)
}

async function getByID(fighterID: number) {
  const response = await axios.get(`${baseUrl}?fighterID=${fighterID}`)
  return mapFighterFields(response.data)
}

const fightersService = {
  getAllByPoolID,
  getByID,
}
export default fightersService
