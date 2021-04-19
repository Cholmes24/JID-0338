import { SystemEvent } from './../redux-types/storeTypes';
import axios from 'axios'

const baseUrl = "/api/system_events"

type SystemEventInDb = {
  eventID: number,
  eventName: string
}

function mapSystemEventFields(systemEventInDb: SystemEventInDb): SystemEvent {
  return ({
    ID: systemEventInDb.eventID,
    name: systemEventInDb.eventName,
    // tournamentIDs: systemEventInDb.tournaments
  })
}

function mapSystemEvents(systemEventsInDb: SystemEventInDb[]): SystemEvent[] {
  return systemEventsInDb.map(mapSystemEventFields)
}

async function getAll(): Promise<SystemEvent[]> {
  const response = await axios.get(baseUrl)
  const data = response.data
  return mapSystemEvents(data)
}

const systemEventsService = {
  getAll
}

export default systemEventsService