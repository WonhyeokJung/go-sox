import { PersonalInfo, Team } from "."

interface LiveGame {
  readonly copyright: string,
  gamePk: number,
  link: string,
  metaData: {
    wait: 10,
    timeStamp: string,
    gameEvents: Array<string>,
    logicalEvents: Array<string>
  },
  gameData: {
    game: {
      pk: number, 
      type: string, 
      doubleHeader: string, // maybe
      id: string,  
      gamedayType: string, 
      tiebreaker: string, 
      gameNumber: number, 
      calendarEventID: string, 
      season: string, 
      seasonDisplay: string 
    },
    datetime: {
      dateTime: string,
      originalDate: string,
      officialDate: string,
      dayNight: string,
      time: string,
      ampm: string
    },
    status: {
      abstractGameState: string,
      codedGameState: string,
      detailedState: string,
      statusCode: string,
      startTimeTBD: boolean,
      abstractGameCode: string
    },
    teams: {
      away: Team["teams"][0],
      home: Team["teams"][0]
    },
    players: {
      [playerId:string]: PersonalInfo["people"]
    },
    venue: {
      id: number,
      name: string,
      link: string,
      location: {
        address1: string,
        city: string,
        state: string,
        stateAbbrev: string,
        postalCode: string,
        defaultCoordinates: {
          latitude: number,
          longitude: number
        },
        azimuthAngle: number,
        elevation: number,
        country: string,
        phone: string,
      }
    },
    officialVenue: {
      id: number,
      link: string
    },
    weather: {
      condition: string,
      temp: string,
      wind: string
    },
    gameInfo: {
      attendance: number,
      firstPitch: string,
      gameDurationMinutes: number
    },
    review: {
      hasChallenges: boolean,
      away: {
        used: number,
        remaining: number
      },
      home: {
        used: number,
        remaining: number
      }
    },
    flags: {
      noHitter: boolean,
      perfectGame: boolean,
      awayTeamNohitter: boolean,
      awayTeamPerfectGame: boolean,
      homeTeamNohitter: boolean,
      homeTeamPerfectGame: boolean
    },
    alerts: Array<{}>, // 머 들어갈지 모름
    probablePitchers: {
      [homeAway: string]: {
        id: number,
        fullName: string,
        link: string
      }
    },
    officialScorer: {
      id: number,
      fullName: string,
      link: string
    },
    primaryDatacaster: {
      id: number,
      fullName: string,
      link: string
    },
    moundVisits: {
      [homeAway: string]: {
        used: number,
        remaining: number
      }
    }
  },
  liveData: {
    plays: PlayByPlay,
    linescore: Linescore,
    boxscore: BoxScore,
    decisions: {
      winner: {
        id: number,
        fullName: string,
        link: string
      },
      loser: {
        id: number,
        fullName: string,
        link: string
      },
      save: {
        id: number,
        fullName: string,
        link: string
      }
    },
    leaders: {
      hitDistance: {},
      hitSpeed: {},
      pitchSpeed: {}
    }
  }
}

interface PlayByPlay {
  readonly copyright: string | null,
  allPlays: Array<Play>,
  currentPlay: Play,
  scoringPlays: Array<number>,
  playsByInning: Array<{
    startIndex: number,
    endIndex: number,
    top: Array<number>,
    bottom: Array<number>,
    hits: {
      [awayHome: string]: Array<{
        team: {
          springLeague: {
            id: number,
            name: string,
            link: string,
            abbreviation: string
          },
          allStarStatus: string,
          id: number,
          name: string,
          link: string
        },
        inning: number,
        pitcher: {
          id: number,
          fullName: string,
          link: string
        },
        batter: {
          id: number,
          fullName: string,
          link: string
        },
        coordinates: {
          x: number,
          y: number
        },
        type: string,
        description: string
      }>
    }
  }>
}

interface Play {
  result: {
    type: string,
    event: string,
    eventType: string,
    description: string,
    rbi: number,
    awayScore: number,
    homeScore: number,
    isOut: boolean
  },
  about: {
    atBatIndex: number,
    halfInning: string,
    isTopInning: boolean,
    inning: number,
    startTime: string,
    endTime: string,
    isComplete: boolean,
    isScoringPlay: boolean,
    hasReview: boolean,
    hasOut: boolean,
    captivatingIndex: number
  },
  count: {
    balls: number,
    strikes: number,
    outs: number
  },
  matchup: {
    batter: {
      id: number,
      fullName: string,
      link: string
    },
    batSide: {
      code: string,
      description: string
    },
    pitcher: {
      id: number,
      fullName: string,
      link: string
    },
    pitchHand: {
      code: string,
      description: string
    },
    batterHotColdZones: [],
    pitcherHotColdZones: [],
    splits: {
      batter: string,
      pitcher: string,
      menOnBase: string
    }
  },
  pitchIndex: Array<number>,
  actionIndex: Array<number>,
  runnerIndex: Array<number>,
  runners: Array<{
    movement: {
      originBase: null,
      start: null,
      end: null,
      outBase: string,
      isOut: boolean,
      outNumber: string
    },
    details: {
      event: string,
      eventType: string,
      movementReason: null,
      runner: {
        id: number,
        fullName: string,
        link: string
      },
      responsiblePitcher: null,
      isScoringEvent: boolean,
      rbi: boolean,
      earned: boolean,
      teamUnearned: boolean,
      playIndex: number
    },
    credits: Array<{
      player: {
        id: number,
        link: string
      },
      position: {
        code: string,
        name: string,
        type: string,
        abbreviation: string
      },
      credit: string
    }>
  }>,
  playEvents: Array<{
    details: {
      description: string,
      event: string,
      eventType: string,
      awayScore: number,
      homeScore: number,
      isScoringPlay: boolean,
      isOut: boolean,
      hasReview: boolean
    },
    count: {
      balls: number,
      strikes: number,
      outs: number
    },
    index: number,
    startTime: string,
    endTime: string,
    isPitch: boolean,
    type: string,
    player: {
      id: number,
      link: string
    }
  }>,
  playEndtime: string,
  atBatIndex: number
}

interface Linescore {
  currentInning: number,
  currentInningOrdinal: string,
  inningState: string,
  inningHalf: string,
  isTopInning: boolean,
  scheduledInnings: number,
  innings: Array<{
    num: number,
    ordinalNum: string,
    home: {
      runs: number,
      hits: number,
      errors: number,
      leftOnBase: number
    },
    away: {
      runs: number,
      hits: number,
      errors: number,
      leftOnBase: number
    }
  }>,
  teams: {
    home: {
      runs: number,
      hits: number,
      errors: number,
      leftOnBase: number
    },
    away: {
      runs: number,
      hits: number,
      errors: number,
      leftOnBase: number
    }
  },
  defense: {
    pitcher: GeneralTargetInfo,
    catcher: GeneralTargetInfo,
    first: GeneralTargetInfo,
    second: GeneralTargetInfo,
    third: GeneralTargetInfo,
    shortstop: GeneralTargetInfo,
    left: GeneralTargetInfo,
    center: GeneralTargetInfo,
    right: GeneralTargetInfo,
    batter: GeneralTargetInfo,
    onDeck: GeneralTargetInfo,
    inHole: GeneralTargetInfo,
    battingOrder: number,
    team: GeneralTargetInfo
  },
  offense: {
    batter: GeneralTargetInfo,
    onDeck: GeneralTargetInfo,
    inHole: GeneralTargetInfo,
    pitcher: GeneralTargetInfo,
    battingOrder: number,
    team: GeneralTargetInfo,
  },
  balls: number,
  strikes: number,
  outs: number
}

interface BoxScore {
  teams: {
    [awayHome: string]: {
      team: Team["teams"][0],
      teamStats: {
        batting: {
          flyOuts: number,
          groundOuts: number,
          runs: number,
          doubles: number,
          triples: number,
          homeRuns: number,
          strikeOuts: number,
          baseOnBalls: number,
          intentionalWalks: number,
          hits: number,
          hitByPitch: number,
          avg: string,
          atBats: number,
          obp: string,
          slg: string,
          ops: string,
          caughtStealing: number,
          stolenBases: number,
          stolenBasePercentage: string,
          groundIntoDoublePlay: number,
          groundIntoTriplePlay: number,
          plateAppearances: number,
          totalBases: number,
          rbi: number,
          leftOnBase: number,
          sacBunts: number,
          sacFlies: number,
          catchersInterference: number,
          pickoffs: number,
          atBatsPerHomeRun: string
        },
        pitching: {
          groundOuts: number,
          airOuts: number,
          runs: number,
          doubles: number,
          triples: number,
          homeRuns: number,
          strikeOuts: number,
          baseOnBalls: number,
          intentionalWalks: number,
          hits: number,
          hitByPitch: number,
          atBats: number,
          obp: string,
          caughtStealing: number,
          stolenBases: number,
          stolenBasePercentage: string,
          numberOfPitches: number,
          era: string,
          inningsPitched: string,
          saveOpportunities: number,
          earnedRuns: number,
          whip: string,
          battersFaced: number,
          outs: number,
          completeGames: number,
          shutouts: number,
        },
        fielding: {
          caughtStealing: number,
          stolenBases: number,
          stolenBasePercentage: string,
          assists: number,
          putOuts: number,
          errors: number,
          chances: number,
          passedBall: number,
          pickoffs: number
        }
      },
      players: {
        [playerId: string]: {
          person: GeneralTargetInfo,
          allPositions: Array<{
            name: string,
            abbreviation: string
          }>
          battingOrder: string,
          jerseyNumber: string,
          position: {
            code: string,
            name: string,
            type: string,
            abbreviation: string
          },
          status: {
            code: string,
            description: string
          },
          parentTeamId: number,
          stats: {
            batting: {
              summary: string,
              gamePlayed: number,
              flyOuts: number,
              groundOuts: number,
              airOuts: number,
              runs: number,
              doubles: number,
              triples: number,
              homeRuns: number,
              strikeOuts: number,
              baseOnBalls: number,
              intentionalWalks: number,
              hits: number,
              hitByPitch: number,
              atBats: number,
              caughtStealing: number,
              stolenBases: number,
              stolenBasePercentage: string,
              groundIntoDoublePlay: number,
              groundIntoTriplePlay: number,
              plateAppearances: number,
              totalBases: number,
              rbi: number,
              leftOnBase: number,
              sacBunts: number,
              sacFlies: number,
              catchersInterference: number,
              pickoffs: number,
              atBatsPerHomeRun: string,
              popOuts: number,
              lineOuts: number,
            },
            pitching: {
              summary: string,
              gamesPlayed: number,
              runs: number,
              doubles: number,
              triples: number,
              homeRuns: number,
              strikeOuts: number,
              baseOnBalls: number,
              hits: number,
              hitByPitch: number,
              atBats: number,
              stolenBases: number,
              numberOfPitches: number,
              inningsPitched: string,
              wins: number,
              losses: number,
              saves: number,
              holds: number,
              earnedRuns: number,
              completeGames: number,
              balls: number,
              strikes: number,
              strikePercentage: string,
              rbi: number
            },
            fielding: {
              summary: string
            }
          },
          seasonStats: {
            batting: {
              avg: string,
              obp: string,
              slg: string,
              ops: string
            },
            pitching: {
              era: string,
              wins: number,
              losses: number,
              saves: number,
              holds: number,
              blownSaves: number,
              whip: string
            },
            fielding: {
              errors: number,
              fielding: string
            }
          }
        }
      },
      // bO는 교체인원 제외한 현재 배터만, p는 핏챠만, b는 교체 포함 + 피챠까지 포함한 모든 인원
      battingOrder: Array<number>,
      pitchers: Array<number>,
      batters: Array<number>
    },
  },
  officials: Array<{
    official: GeneralTargetInfo,
    officialType: string
  }>,
  info: Array<{
    label: string,
    value: string
  }>,
  pitchingNotes: [],
  topPerformers: Array<{
    player: {
      person: GeneralTargetInfo,
      jerseyNumber: string,
      position: {
        code: string,
        name: string,
        type: string,
        abbreviation: string
      },
      status: {
        code: string,
        description: string
      },
      parentTeamId: number,
      stats: {
        batting: BattingStat,
        pitching: PitchingStat,
        fielding: FieldingStat
      },
      seasonStats: {
        batting: BattingStat,
        pitching: PitchingStat,
        fielding: FieldingStat
      },
      gameStatus: {
        isCurrentBatter: boolean,
        isCurrentPitcher: boolean,
        isOnBench: boolean,
        isSubstitue: boolean
      },
      allPositions: Array<{
        code: string,
        name: string,
        type: string,
        abbreviation: string
      }>
    },
    type: string,
    gameScore: number,
    pitchingGameScore: number
  }>
}

interface GeneralTargetInfo {
  id: number,
  fullName: string,
  link: string
}

// 배팅 피칭은 너무 많아서 필요한 것만 가져온다.
interface BattingStat {
  summary: string | null,
  runs: number,
  doubles: number,
  triples: number,
  homeRuns: number,
  baseOnBalls: number,
  hits: number,
  atBats: number,
  rbi: number
}

interface PitchingStat {
  note: string | null,
  summary: string | null,
  runs: number,
  homeRuns: number,
  strikeOuts: number,
  baseOnBalls: number,
  hits: number,
  hitByPitch: number,
  numberOfPitches: number,
  inningsPitched: string,
  wins: number,
  saves: number,
  earnedRuns: number,
  completeGames: number,
  balls: number,
  strikes: number,
  strikePercentage: string
}

interface FieldingStat {
  gamesStarted: number,
  caughtStealing: number,
  stolenBases: number,
  stolenBasePercentage: number,
  assists: number,
  putOuts: number,
  errors: number,
  chances: number,
  fielding: string,
  passedBall: number,
  pickoffs: number
}

export type {
  LiveGame,
  BoxScore
}