import { Tournament } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/events/all"

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapTournamentField(tournamentInDb: any): Tournament {
  return {
    name: tournamentInDb.eventName,
    id: tournamentInDb.eventID,
    fighterIds: [],
    poolIds: [],
    matchIds: []
  }
}

function mapTournaments(fromDb: any[]): Tournament[] {
  return fromDb.map(mapTournamentField)
}

async function getAll() {
  const response = await axios.get(baseUrl)
  return mapTournaments(response.data)
}

export default {
  getAll
}