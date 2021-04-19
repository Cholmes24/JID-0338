import axios from 'axios'
import { mapMatchFields } from './match'

async function getAllByTournament(tournamentID: number) {
  const response = await axios.get(`/api/system_events/tournaments/matches?tournamentID=${tournamentID}`)
  return response.data.matches.map(mapMatchFields)
}

// async function getAll(poolID: number) {
//   const response = await axios.get(`${baseUrl}?groupID=${poolID}`)
//   return response.data.map(mapMatchFields)
// }


const matchesService ={
  mapMatchFields,
  getAllByTournament,
  // getAll,
}

export default matchesService