export const FIRST_TURN_ROUNDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
export const SECOND_TURN_ROUNDS = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]

const MIOLLO_AND_THOMAS_ROUNDS = [18, 19, ...SECOND_TURN_ROUNDS]
export const ROUNDS = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  ...MIOLLO_AND_THOMAS_ROUNDS
]

export const TEAMS = [
  {
    id: 25929996,
    slug: 'sociedade-esportiva-tacu',
    name: 'Sociedade Esportiva Tacu',
    rounds: ROUNDS
  },
  {
    id: 29367702,
    slug: '4-de-maio-futebol-e-cerveja',
    name: '4 de maio futebol e cerveja',
    rounds: ROUNDS
  },
  {
    id: 15159981,
    slug: 'valeimoveis',
    name: 'Valeimoveis',
    rounds: ROUNDS
  },
  {
    id: 112714,
    slug: 'real-egrete',
    name: 'Real Egrete',
    rounds: ROUNDS
  },
  {
    id: 47843698,
    slug: 'quarai-querencia-querida-fc',
    name: 'Quaraí Querência Querida FC',
    rounds: ROUNDS
  },
  {
    id: 28738386,
    slug: 'padariasilvalvto',
    name: 'Padariasilvalvto',
    rounds: ROUNDS
  },
  {
    id: 48903399,
    slug: 'os-sem-pernas-pcd',
    name: 'Os Sem Pernas PCD',
    rounds: MIOLLO_AND_THOMAS_ROUNDS
  },
  {
    id: 48902734,
    slug: 'miollo-futebol-e-tristeza',
    name: 'Miollo Futebol e Tristeza',
    rounds: MIOLLO_AND_THOMAS_ROUNDS
  }
]
