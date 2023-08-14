export const POSITIONS: Record<number, { nome: string, abreviacao: string }> = {
  1: {
    nome: "Goleiro",
    abreviacao: "gol"
  },
  2: {
    nome: "Lateral",
    abreviacao: "lat"
  },
  3: {
    nome: "Zagueiro",
    abreviacao: "zag"
  },
  4: {
    nome: "Meia",
    abreviacao: "mei"
  },
  5: {
    nome: "Atacante",
    abreviacao: "ata"
  },
  6: {
    nome: "Técnico",
    abreviacao: "tec"
  }
}

export type PositionsIds = keyof typeof POSITIONS
