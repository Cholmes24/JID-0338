import { Tournament } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/tournaments"

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapTournamentField(tournamentInDb: any): Tournament {
  return {
    name: "",
    id: tournamentInDb.tournamentID,
    fighterIds: [],
    poolIds: [],
    matchIds: []
  }
}

function mapTournaments(fromDb: any[]): Tournament[] {
  return fromDb.map(mapTournamentField)
}

async function getAll(eventId: number) {
  const response = await axios.get(baseUrl, {
    params: {
      eventID: eventId
    }
  })
  return mapTournaments(response.data)
}

export default {
  getAll
}