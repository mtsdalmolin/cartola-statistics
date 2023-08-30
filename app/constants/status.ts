export const DOUBT = 2
export const SUSPENDED = 3
export const INJURED = 5
export const NULL = 6
export const PROSPECTIVE = 7

export const STATUS = {
  [DOUBT]: {
      nome: 'Dúvida',
      id: 2
  },
  [SUSPENDED]: {
      nome: 'Suspenso',
      id: 3
  },
  [INJURED]: {
      nome: 'Contundido',
      id: 5
  },
  [NULL]: {
      nome: 'Nulo',
      id: 6
  },
  [PROSPECTIVE]: {
      nome: 'Provável',
      id: 7
  }
}

export type StatusIds = keyof typeof STATUS