import axios from 'axios'
import { useDate } from '@/composables'
// import { LeagueInfo } from '@/types'

const BASE_URL = 'https://statsapi.mlb.com'
const DATE = useDate()
// export async function $_getLeague(...args:any) {
//   const data: Ref<Object> = ref(new Object)
//   await axios.get('http://statsapi.mlb.com/api/v1/divisions/202')
//     .then((res) => {
//       data.value = res.data
//       console.log(data.value)
//     })
//   return { data }
// }

function $_getLeagueInfo(leagueId=103) {
  return axios.get(`${BASE_URL}/api/v1/league/${leagueId}`)
}

function $_getDivisionsInfo(divisionId=202) {
  // return axios.get<LeagueInfo>('http://statsapi.mlb.com/api/v1/divisions/202')
  return axios.get(`${BASE_URL}/api/v1/divisions/${divisionId}`)
}

function $_getTeam(teamId:number=145, season:number|string=DATE.year) {
  // const { data } =  await axios.get(`${BASE_URL}/api/v1/teams/${teamId}?season=${season}`)
  // return data
  return axios.get(`${BASE_URL}/api/v1/teams/${teamId}?season=${season}`)
}

// 로스터용 + 뎁스차트 포함
function $_getTeamRoster(date:string=DATE.today, rosterType:string='active') {
  return axios.get(`${BASE_URL}/api/v1/teams/145/roster?date=${date}&rosterType=${rosterType}&fields=roster,person,id,fullName,link,jerseyNumber,position,abbreviation,status,code`)
  // http://statsapi.mlb.com/api/v1/teams/145/roster?date=2024-04-03&rosterType=active&fields=roster,person,id,fullName,link,jerseyNumber,position,abbreviation,status,code
}

function $_getPlayerInfo(path:string) {
  return axios.get(`${BASE_URL}/${path}?fields=people,primaryNumber,birthDate,currentAge,birthCountry,height,weight,active,batSide,code,description,pitchHand,code,description`)
  // return axios.get(`${BASE_URL}/${path}`)
}

function $_getCoach(teamId:number) {
  return axios.get(`${BASE_URL}/api/v1/teams/${teamId}/coaches`)
}

// 103: American, 104: National
// standingsTypes: springTraining, regularSeason
function $_getStandings(leagueId=103, season=DATE.year, seasonType='regularSeason') {
  return axios.get(`${BASE_URL}/api/v1/standings?leagueId=${leagueId}&season=${season}&standingsTypes=${seasonType}`)
}

function $_getGamesSchedule(date:string=DATE.today, teamId:number=145) {
  // teamId 없으면 전체 게임 가져오는데, 저작권 문제를 고려해서 White Sox만 + Fields 이용해서 필요한 것만 가져온다.(데이터 가져오는 속도 줄이기 위함)
  // fields의 경우 상위부터 순서대로 object의 원하는 키값을 순서대로 써줘야 필요한 값을 받아올 수 있다.
  return axios.get(`${BASE_URL}/api/v1/schedule/games?sportId=1&date=${date}&teamId=${teamId}&fields=dates,date,games,link,status,detailedState,reason,teams,away,leagueRecord,wins,losses,pct,score,team,name,isWinner,home,leagueRecord,wins,losses,pct,score,team,name,isWinner,venue,name,description`)
  // return axios.get(`${BASE_URL}/api/v1/schedule/games?sportId=1&startDate=${date}&endDate=${date}`)
}

// Detail한 라이브 게임 정보 포함
// https://statsapi.mlb.com/api/v1.1/game/747062/feed/live
function $_getLiveGame(link:string) {
  // BoxScore는 따로 부르는 방법
  // return axios.get(`${BASE_URL}${link}?fields=gamePk,gameData,datetime,originalDate,officialDate,dayNight,time,ampm,teams,away,name,abbreviation,record,gamesPlayed,leagueRecord,wins,losses,ties,pct,home,name,abbreviation,record,gamesPlayed,leagueRecord,wins,losses,ties,pct,venue,name,timeZone,tz,gameInfo,attendance,probablePitchers,away,id,fullName,home,id,fullName,officialScorer,id,fullName,primaryDatacaster,id,fullName,liveData,linescore,currentInningOrdinal,inningState,innings,num,ordinalNum,home,runs,hits,errors,leftOnBase,away,runs,hits,errors,leftOnBase,teams,home,runs,hits,errors,leftOnBase,away,runs,hits,errors,leftOnBase`)
  // box score 안부르고 아래로 부를 수 있긴한데, 데이터 불러오는 중복이 일어나서 boxscore 항목에 필요없는 항목이 다 들어오는 문제가 생김
  return axios.get(`${BASE_URL}${link}?fields=gamePk,gameData,datetime,originalDate,officialDate,dayNight,time,ampm,teams,away,name,abbreviation,record,gamesPlayed,leagueRecord,wins,losses,ties,pct,home,name,abbreviation,record,gamesPlayed,leagueRecord,wins,losses,ties,pct,venue,name,timeZone,tz,gameInfo,attendance,probablePitchers,away,id,fullName,home,id,fullName,officialScorer,id,fullName,primaryDatacaster,id,fullName,liveData,linescore,currentInningOrdinal,inningState,innings,num,ordinalNum,home,runs,hits,errors,leftOnBase,away,runs,hits,errors,leftOnBase,teams,home,runs,hits,errors,leftOnBase,away,runs,hits,errors,leftOnBase,boxscore,officials,official,id,fullName,officialType,info,label,value,topPerformers,player,person,id,fullName,jerseyNumber,position,name,abbreviation,stats,batting,summary,runs,doubles,triples,homeRuns,baseOnBalls,hits,avg,atBats,obp,slg,ops,stolenBases,rbi,pitching,note,summary,runs,homeRuns,strikeOuts,baseOnBalls,hits,hitByPitch,numberOfPitches,era,inningsPitched,wins,saves,holds,earnedRuns,completeGames,balls,strikes,strikePercentage,decisions,winner,id,fullName,loser,id,fullName,save,id,fullName`)
  // return axios.get(`${BASE_URL}${link}`)
}

// boxscore, playbyplay와 linescore는 livegame에 들어가있음(liveData 안에 plays: playbyplay, linescore:linescore, boxscore: boxscore)
// 라인업과 기록, 팀 기록 제공
async function $_getBoxScore(gamePk:number) {
  const { data } = await axios.get(`${BASE_URL}/api/v1/game/${gamePk}/boxscore?fields=boxscore,officials,official,id,fullName,officialType,info,label,value,topPerformers,player,person,id,fullName,jerseyNumber,position,name,abbreviation,stats,batting,summary,runs,doubles,triples,homeRuns,baseOnBalls,hits,atBats,stolenBases,rbi,pitching,note,summary,runs,homeRuns,strikeOuts,baseOnBalls,hits,hitByPitch,numberOfPitches,era,inningsPitched,wins,saves,holds,earnedRuns,completeGames,balls,strikes,strikePercentage,decisions,winner,id,fullName,loser,id,fullName,save,id,fullName`)
  return data
  // return axios.get(`${BASE_URL}/api/v1/game/${gamePk}/boxscore`)
}
// 이닝별 득점 기록 및 안타, 실책 기록(간단 스코어보드)
function $_getLineScore(gamePk:number) {
  return axios.get(`${BASE_URL}/api/v1/game/${gamePk}/linescore`)
}

// 이닝별 플레이/ 라인드라이브 땅볼 스트라이크 뜬공 안타 등 플레이정보 포함
function $_getPlayByPlay(gamePk:number) {
  return axios.get(`${BASE_URL}/api/v1/game/${gamePk}/playByPlay`)
}

// 오늘의 transaction
function $_getTransactions(teamId:number, date:string = DATE.today) {
  return axios.get(`${BASE_URL}/api/v1/transactions?teamId=${teamId}&date=${date}`)
}

function $_getDraft(year=2024, teamId:number|null) {
  return axios.get(`${BASE_URL}/api/v1/draft/${year}?teamId=${teamId}`)
}

// fielding, hitting, pitching, catching, 
// https://statsapi.mlb.com/api/v1/statTypes
// https://statsapi.mlb.com/api/v1/statGroups
function $_getTeamStats(teamId:number, statGroup:string, season:number, statType='season') {
  return axios.get(`${BASE_URL}/api/v1/teams/${teamId}/stats?group=${statGroup}&season=${season}&sportsId=1&stats=${statType}`)
}

export {
  $_getLeagueInfo,
  $_getDivisionsInfo,
  $_getTeam,
  $_getTeamRoster,
  $_getPlayerInfo,
  $_getStandings,
  $_getGamesSchedule,
  $_getLiveGame,
  $_getBoxScore,
  $_getTransactions,
}