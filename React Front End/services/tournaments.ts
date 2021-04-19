import { Tournament } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/system_events/tournaments"

type TournamentInDb = {
  tournamentID: number
}

//TODO: complete/remove this function making sure relevant fields are accounted for
function mapTournamentField(tournamentInDb: TournamentInDb, systemEventID: number): Tournament {
  return {
    name: `Tournament ${tournamentInDb.tournamentID}`,
    ID: tournamentInDb.tournamentID,
    systemEventID,
    fighterIDs: [],
    poolIDs: [],
    matchIDs: []
  }
}

function mapTournaments(fromDb: TournamentInDb[], eventID: number): Tournament[] {
  return fromDb.map((t) => mapTournamentField(t, eventID))
}

async function getAll(eventID: number) {
  const response = await axios.get(`${baseUrl}?eventID=${eventID}`)
  return mapTournaments(response.data, eventID)
}

const tournamentsService = {
  getAll
}

export default tournamentsService