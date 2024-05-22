import { defineStore } from "pinia"
import { Ref, ref, computed } from "vue"
import { useLeagueStore, useTeamStore } from "."

interface MapObject {
  [key: string]: string
}

export const useTranslationStore = defineStore('translation', () => {
  // const teamStore = useTeamStore()
  const translations: Ref<Map<string, MapObject>> = ref(new Map())
  const getTranslation = computed(() => (locale:string, key:string) => translations.value.get(locale)![key])
  
  function fetchTranslation() {
    // const { getTeamInfo } = teamStore
    translations.value.set('en-US', {
      'teamName': 'Chicago White Sox',
      'headerDescription': 'Chicago White Sox fan page',
      'teamDescription': '3x World Series Champions',
      'scheduleTitle': 'Schedule & Scores',
      'home': 'home',
      'roster': 'Roster',
      'standings': 'Standings',
      'transactions': 'Transactions',
      'schedule': 'schedule/scores',
      'noGame': 'There is no game today',
      'todaySoxTransactions': 'Today\'s White Sox Transactions',
      'noTransactions': 'There is no transactions today',
      'ac': 'AL CENTRAL',
      'ae': 'AL EAST',
      'aw': 'AL WEST',
      'nc': 'NL CENTRAL',
      'ne': 'NL EAST',
      'nw': 'NL WEST',
      'al': 'American League',
      'nl':'National Leauge',
      'foundedAmerican': 'American League is founded in 1901',
      'mlbamRule1': 'This personal blog provides data obtained from MLB statsapi and was developed in compliance with MLBAM\'s ',
      'mlbamRule2': '',
      'copyright': 'Copyright rules',
      'officialHomePlate': 'Home Plate',
      'Chicago White Sox': 'CWS',
      'Oakland Athletics': 'OAK',
      'Pittsburgh Pirates': 'PIT',
      'San Diego Padres': 'SD',
      'Seattle Mariners': 'SEA',
      'San Francisco Giants': 'SF',
      'St. Louis Cardinals': 'STL',
      'Tampa Bay Rays': 'TB',
      'Texas Rangers': 'TEX',
      'Toronto Blue Jays': 'TOR',
      'Minnesota Twins': 'MIN',
      'Philadelphia Phillies': 'PHI',
      'Atlanta Braves': 'ATL',
      'Miami Marlins': 'MIA',
      'New York Yankees': 'NYY',
      'Milwaukee Brewers': 'MIL',
      'Los Angeles Angels': 'LAA',
      'Arizona Diamondbacks': 'AZ',
      'Baltimore Orioles': 'BAL',
      'Boston Red Sox': 'BOS',
      'Chicago Cubs': 'CHC',
      'Cincinnati Reds': 'CIN',
      'Cleveland Guardians': 'CLE',
      'Colorado Rockies': 'COL',
      'Detroit Tigers': 'DET',
      'Houston Astros': 'HOU',
      'Kansas City Royals': 'KC',
      'Los Angeles Dodgers': 'LAD',
      'Washington Nationals': 'WSH',
      'New York Mets': 'NYM',
      'Scheduled': 'SCHEDULED',
      'Final': 'FINAL',
      'Postponed': 'POSTPONED'
    })
    translations.value.set('ko-KR', {
      'teamName': '시카고 화이트 삭스',
      'headerDescription': '시카고 화이트 삭스 팬 페이지',
      'teamDescription': '월드 시리즈 3회 우승팀',
      'scheduleTitle': '일정 및 결과',
      'home': '홈',
      'roster': '로스터',
      'standings': '순위',
      'transactions': '트랜잭션',
      'schedule': '일정/결과',
      'noGame': '오늘은 예정된 게임이 없습니다',
      'todaySoxTransactions': '오늘의 화이트 삭스 트랜잭션',
      'noTransactions': '오늘 이루어진 트랙잭션이 없습니다',
      'ac': '아메리칸 중부리그',
      'ae': '아메리칸 동부리그',
      'aw': '아메리칸 서부리그',
      'nc': '내셔널 중부리그',
      'ne': '내셔널 동부리그',
      'nw': '내셔널 서부리그',
      'al': '아메리칸 리그',
      'nl':'내셔널 리그',
      'foundedAmerican': '아메리칸 리그는 1901년에 창설되었습니다.',
      'mlbamRule1': '이 블로그는 MLB statsapi로부터 받아온 데이터를 제공하며, MLBAM의 ',
      'mlbamRule2': '을 준수하여 개발했습니다.',
      'copyright': '저작권 규칙',
      'officialHomePlate': '주심',
      'Chicago White Sox': '시삭스',
      'Oakland Athletics': '오클랜드',
      'Pittsburgh Pirates': '피츠버그',
      'San Diego Padres': '샌디에이고',
      'Seattle Mariners': '시애틀',
      'San Francisco Giants': '자이언츠',
      'St. Louis Cardinals': 'STL',
      'Tampa Bay Rays': 'TB',
      'Texas Rangers': 'TEX',
      'Toronto Blue Jays': 'TOR',
      'Minnesota Twins': 'MIN',
      'Philadelphia Phillies': 'PHI',
      'Atlanta Braves': 'ATL',
      'Miami Marlins': 'MIA',
      'New York Yankees': 'NYY',
      'Milwaukee Brewers': 'MIL',
      'Los Angeles Angels': 'LAA',
      'Arizona Diamondbacks': 'AZ',
      'Baltimore Orioles': 'BAL',
      'Boston Red Sox': 'BOS',
      'Chicago Cubs': 'CHC',
      'Cincinnati Reds': 'CIN',
      'Cleveland Guardians': 'CLE',
      'Colorado Rockies': 'COL',
      'Detroit Tigers': 'DET',
      'Houston Astros': 'HOU',
      'Kansas City Royals': 'KC',
      'Los Angeles Dodgers': 'LAD',
      'Washington Nationals': 'WSH',
      'New York Mets': 'NYM',
      'Scheduled': '예정',
      'Final': '종료',
      'Postponed': '연기'
    })
    return
  }

  
  return {
    fetchTranslation,
    getTranslation
  }
})