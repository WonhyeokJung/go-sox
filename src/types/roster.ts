import { PersonalInfo } from "./"

interface RosterType {
  [index: string]: Array<Roster>,
  active: Array<Roster>,
  "40man": Array<Roster>,
  depthChart: Array<Roster>,
  nonRosterInvitees: Array<Roster>
}

interface TeamRoster {
  readonly copyright?: string,
  roster?: Array<Roster>
}

interface Roster {
  person: {
    id: number,
    fullName: string,
    link: string
  },
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
  // roster.person.link를 통해 가져온 개인 정보를 담을 것이다.
  personalInfo: PersonalInfo["people"] | null,
}

interface DepthChart {
  // store/roster.ts 상의 에러 방지용(typescript는 Obj[propertyName]에 숫자만 받아들이려고 하기 때문에 임의로 설정해준다.
  // propertyName에는 아무 키값이나 와도 되며, 다른 키/값들도 전부 이와 동일한 타입을 가져야 한다.
  [propertyName: string]: Array<Roster>, 
  'S': Array<Roster>,
  '1': Array<Roster>,
  '2': Array<Roster>,
  '3': Array<Roster>,
  '5': Array<Roster>,
  '4': Array<Roster>,
  '6': Array<Roster>,
  '7': Array<Roster>,
  '8': Array<Roster>,
  '9': Array<Roster>,
  '10': Array<Roster>
}

export type {
  RosterType,
  Roster,
  TeamRoster,
  DepthChart
}