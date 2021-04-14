import { Tournament } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/system_events/tournaments"

type TournamentInDb = {
  tournamentID: number
}

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapTournamentField(tournamentInDb: TournamentInDb, systemEventId: number): Tournament {
  return {
    name: `Tournament ${tournamentInDb.tournamentID}`,
    id: tournamentInDb.tournamentID,
    systemEventId,
    fighterIds: [],
    poolIds: [],
    matchIds: []
  }
}

function mapTournaments(fromDb: TournamentInDb[], eventId: number): Tournament[] {
  return fromDb.map((t) => mapTournamentField(t, eventId))
}

async function getAll(eventId: number) {
  const response = await axios.get(`${baseUrl}?eventID=${eventId}`)
  return mapTournaments(response.data, eventId)
}

const tournamentsService = {
  getAll
}

export default tournamentsService