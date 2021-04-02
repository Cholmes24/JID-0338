import axios from 'axios'
import { SystemEvent } from '../redux-types/storeTypes'

const baseUrl = "/api/system_events"


function mapSystemEventFields(systemEventInDb: any): SystemEvent {
  return ({
    id: systemEventInDb.eventID,
    name: systemEventInDb.eventName,
    tournamentIds: systemEventInDb.tournaments
  })
}

function mapSystemEvents(systemEventsInDb: any[]): SystemEvent[] {
  return systemEventsInDb.map(mapSystemEventFields)
}

async function getAll(): Promise<SystemEvent[]> {
  const response = await axios.get(baseUrl)
  const data = response.data
  return mapSystemEvents(data)
}

export default {
  getAll
}