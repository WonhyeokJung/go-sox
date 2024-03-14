interface LeagueInfo {
  readonly copyright: string,
  divisions: Array<{
    id: number,
    name: string,
    season: string,
    nameShort: string,
    link: string,
    abbreviation: string,
    league: {
      id: number,
      link: string
    },
    sport: {
      id: string,
      link: string
    },
    hasWildcard: boolean,
    sortOrder: number,
    numPlayoffTeams: number,
    active: boolean
  }>,
}

export default LeagueInfo