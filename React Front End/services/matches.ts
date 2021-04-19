import axios from 'axios'
import { mapMatchFields } from './match'

async function getAllByTournament(tournamentId: number) {
  const response = await axios.get(`/api/system_events/tournaments/matches?tournamentID=${tournamentId}`)
  return response.data.matches.map(mapMatchFields)
}

// async function getAll(poolId: number) {
//   const response = await axios.get(`${baseUrl}?groupID=${poolId}`)
//   return response.data.map(mapMatchFields)
// }


const matchesService ={
  mapMatchFields,
  getAllByTournament,
  // getAll,
}

export default matchesService