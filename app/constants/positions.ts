export const GOLEIRO = 1
export const LATERAL = 2
export const ZAGUEIRO = 3
export const MEIA = 4
export const ATACANTE = 5
export const TECNICO = 6

export const POSITIONS: Record<number, { nome: string; abreviacao: string }> = {
  [GOLEIRO]: {
    nome: 'Goleiro',
    abreviacao: 'gol'
  },
  [LATERAL]: {
    nome: 'Lateral',
    abreviacao: 'lat'
  },
  [ZAGUEIRO]: {
    nome: 'Zagueiro',
    abreviacao: 'zag'
  },
  [MEIA]: {
    nome: 'Meia',
    abreviacao: 'mei'
  },
  [ATACANTE]: {
    nome: 'Atacante',
    abreviacao: 'ata'
  },
  [TECNICO]: {
    nome: 'Técnico',
    abreviacao: 'tec'
  }
}

export type PositionsIds = keyof typeof POSITIONS
