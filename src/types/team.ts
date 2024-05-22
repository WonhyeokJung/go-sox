interface Team {
  readonly copyright: string,
  teams: Array<{
    springLeague: {
      id: number,
      name: string,
      link: string,
      abbreviation: string
    },
    allStarStatus: string,
    id: number,
    name: string,
    link: string,
    season: number,
    venue: {
      id: number,
      name: string,
      link: string
    },
    springVenue: {
      id: number,
      link: string
    },
    teamCode: string,
    fileCode: string,
    abbreviation: string,
    teamName: string,
    locationName: string,
    firstYearOfPlay: string,
    league: {
      id: number,
      name: string,
      link: string
    },
    division: {
      id: number,
      name: string,
      link: string
    },
    sport: {
      id: number,
      name: string,
      link: string
    },
    shortName: string,
    franchiseName: string,
    clubName: string,
    active: boolean
  }>
}

export default Team