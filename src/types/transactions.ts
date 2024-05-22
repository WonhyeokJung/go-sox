interface Transactions {
  readonly copyright: string,
  transactions: Array<{
    id: number,
    person: {
      id: number,
      fullName: string,
      link: string
    },
    toTeam: {
      id: number,
      name: string,
      link: string
    },
    date: string,
    effectiveDate: string,
    resolutionDate: string,
    typeCode: string,
    typeDesc: string,
    description: string
  }>
}

export default Transactions