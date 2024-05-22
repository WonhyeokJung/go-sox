interface Schedule {
  copyright: string,
  totalItems: number,
  totalEvents: number,
  totalGames: number,
  totalGamesInProgress: number,
  dates: Array<{
    date: string,
    totalItems: number,
    totalEvents: number,
    totalGames: number,
    totalGamesInProgress: number,
    games: Array<ScheduledGames>,
    events: Array<{}> // 뭐가 들어가는지 아직 모름 아마 올스타 게임? X 올스타도 그냥 games임
  }>
}

interface ScheduledGames {
  gamePk: number,
  gameGuid: string,
  link: string,
  gameType: string,
  season: string,
  gameDate: string,
  officialDate: string,
  status: {
    abstractGameState: string,
    codedGameState: string,
    detailedState: string,
    statusCode: string,
    startTimeTBD: boolean,
    reason: string | null,
    abstractGameCode: string
  },
  teams: {
    away: TeamsInfoInSchedule,
    home: TeamsInfoInSchedule,
  },
  venue: {
    id: number,
    name: string,
    link: string
  },
  content: {
    link: string
  },
  isTie: boolean,
  gameNumber: number,
  publicFacing: boolean,
  doubleHeader: string,
  gamedayType: string,
  tiebreaker: string,
  calendarEventID: string,
  seasonDisplay: string,
  dayNight: string,
  description: string | null,
  scheduledInnings: number,
  reverseHomeAwayStaus: boolean,
  inningBreakLength: number,
  gamesInSeries: number,
  seriesGameNumber: number,
  seriesDescription: string,
  recordSource: string,
  ifNecessary: string,
  ifNecessaryDescription: string
}

interface TeamsInfoInSchedule {
  leagueRecord: {
    wins: number,
    losses: number,
    pct: string
  },
  score: number,
  team: {
    id: number,
    name: string,
    link: string
  },
  isWinner: boolean,
  splitSquad: boolean,
  seriesNumber: number
}

export type {
  Schedule,
  ScheduledGames
}