import axios from 'axios'

const baseUrl = "/api/system_events"

type SystemEvent = {
  eventId: number,
  eventName: string
}

async function getAll(): Promise<SystemEvent[]> {
  const response = await axios.get(baseUrl)
  const data = response.data
  return data.map((e: any) => ({...e, eventId: e.eventID}))
}

export default {
  getAll
}