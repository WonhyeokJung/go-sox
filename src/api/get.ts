import axios from 'axios'
import useDate from '@/composables/date'
// import { LeagueInfo } from '@/types'

const BASE_URL = 'https://statsapi.mlb.com/'
// export async function $_getLeague(...args:any) {
//   const data: Ref<Object> = ref(new Object)
//   await axios.get('http://statsapi.mlb.com/api/v1/divisions/202')
//     .then((res) => {
//       data.value = res.data
//       console.log(data.value)
//     })
//   return { data }
// }

function $_getLeagueInfo() {
  // return axios.get<LeagueInfo>('http://statsapi.mlb.com/api/v1/divisions/202')
  return axios.get(`${BASE_URL}api/v1/divisions/202`)
}

function $_getTeamRoster(date:string=useDate(), rosterType:string='active') {
  // season status 스프링캠프일때, nonrosterinvitees도 추가해줘야함.
  return axios.get(`${BASE_URL}api/v1/teams/145/roster?date=${date}&rosterType=${rosterType}`)
}

function $_getPlayerInfo(path:string) {
  return axios.get(`${BASE_URL}${path}`)
}

export {
  $_getLeagueInfo,
  $_getTeamRoster,
  $_getPlayerInfo
}