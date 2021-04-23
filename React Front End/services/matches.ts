import axios from 'axios'
import { mapMatchFields } from './match'


async function getAll(poolID: number) {
  const response = await axios.get(`/api/system_events/tournaments/groups/matches?groupID=${poolID}`)
  const mapped = response.data.map(mapMatchFields)
  return mapped
}

const matchesService = {
  getAll,
}

export default matchesService