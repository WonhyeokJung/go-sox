interface Standing {
  copyright: string,
  records: Array<StandingRecord>
}

interface StandingRecord {
  standingsType: string,
  league: {
    id: number,
    link: string
  },
  division: {
    id: number,
    link: string
  },
  sport: {
    id: number,
    link: string
  },
  lastUpdated: string,
  teamRecords: Array<TeamRecord>
}

interface TeamRecord {
  team: {
    id: number,
    name: string,
    link: string,
    abbreviation?: string
  },
  season: string,
  streak: {
    streakType: string,
    streakNumber: number,
    streakCode: string
  },
  clinchIndicator: string,
  divisionRank: string,
  leagueRank: string,
  sportRank: string,
  gamesPlayed: number,
  gamesBack: string,
  wildCardGamesBack: string,
  leagueGamesBack: string,
  springLeagueGamesBack: string,
  sportGamesBack: string,
  divisionGamesBack: string,
  conferenceGamesBack: string,
  leagueRecord: {
    wins: number,
    losses: number,
    ties: number,
    pct: string
  },
  lastUpdated: string,
  records: {
    splitRecords: Array<{
      wins: number,
      losses: number,
      type: string,
      pct: string
    }>,
    divisionRecords: Array<{
      wins: number,
      losses: number,
      pct: string,
      division: {
        id: number,
        name: string,
        link: string
      }
    }>,
    overallRecords: Array<{
      wins: number,
      losses: number,
      type: string,
      pct: string
    }>,
    leagueRecords: Array<{
      wins: number,
      losses: number,
      pct: string,
      league: {
        id: number,
        name: string,
        link: string
      }
    }>,
    expectedRecords: Array<{
      wins: number,
      losses: number,
      type: string,
      pct: string
    }>
  },
  runsAllowed: number,
  runsScored: number,
  divisionChamp: boolean,
  divisionLeader: boolean,
  hasWildcard: boolean,
  clinched: boolean,
  eliminationNumber: string,
  eliminationNumberSport: string,
  eliminationNumberLeague: string,
  eliminationNumberDivision: string,
  eliminationNumberConference: string,
  wildCardEliminationNumber: string,
  magicNumber: string,
  wins: number,
  losses: number,
  runDifferential: number,
  winningPercentage: string
}

export type {
  Standing,
  StandingRecord,
  TeamRecord
}