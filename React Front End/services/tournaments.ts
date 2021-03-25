import { Tournament } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/tournaments"

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapTournamentField(tournamentInDb: any): Tournament {
  return tournamentInDb
}

function mapTournaments(fromDb: any[]): Tournament[] {
  return fromDb.map(mapTournamentField)
}

export async function getAll() {
  const response = await axios.get(baseUrl)
  return mapTournaments(response.data)
}
