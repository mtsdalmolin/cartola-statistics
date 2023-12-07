import { Athlete } from '../common/types/athlete'

export const SCOUT_TITLES: Record<keyof Athlete['scout'], { title: string; abbreviation: string }> =
  {
    A: { title: 'Assistências', abbreviation: 'assist.' },
    CA: { title: 'Cartões amarelos', abbreviation: 'amarelos' },
    CV: { title: 'Cartões vermelhos', abbreviation: 'vermelhos' },
    DE: { title: 'Defesas', abbreviation: 'def.' },
    DP: { title: 'Defesas de pênaltis', abbreviation: 'def.' },
    DS: { title: 'Desarmes', abbreviation: 'des.' },
    FC: { title: 'Faltas cometidas', abbreviation: 'faltas' },
    FD: { title: 'Finalizações defendidas', abbreviation: 'fin. defendida' },
    FF: { title: 'Finalizações pra fora', abbreviation: 'fin. para fora' },
    FS: { title: 'Faltas sofridas', abbreviation: 'faltas sofridas' },
    FT: { title: 'Finalizações na trave', abbreviation: 'fin. na trave' },
    G: { title: 'Gols', abbreviation: 'gols' },
    GC: { title: 'Gols contra', abbreviation: 'gols' },
    GS: { title: 'Gols sofridos', abbreviation: 'gols sofridos' },
    I: { title: 'Impedimentos', abbreviation: 'imp.' },
    PC: { title: 'Pênalti cometido', abbreviation: 'pênalti cometido' },
    PP: { title: 'Pênalti perdido', abbreviation: 'pênalti perdido' },
    PS: { title: 'Pênalti sofrido', abbreviation: 'pênalti sofrido' },
    SG: { title: 'Sem sofrer gols', abbreviation: 'SG' },
    V: { title: 'Vitória', abbreviation: 'vit.' }
  }

export const SCOUT_MULTIPLIERS: Record<keyof Athlete['scout'], number> = {
  A: 5,
  CA: -1,
  CV: -3,
  DE: 1,
  DP: 7,
  DS: 1.2,
  FC: -0.3,
  FD: 1.2,
  FF: 0.8,
  FS: 0.5,
  FT: 3,
  G: 8,
  GC: -3,
  GS: -1,
  I: -0.1,
  PC: -1,
  PP: -4,
  PS: 1,
  SG: 5,
  V: 1
}

export const SCOUT_COLORS: Record<keyof Athlete['scout'], string> = {
  A: '#e19b7a',
  CA: '#000',
  CV: '#000',
  DE: '#9d6d55',
  DP: '#82e18d',
  DS: '#828de1',
  FC: '#000',
  FD: '#5b639d',
  FF: '#559d90',
  FS: '#5E0B15',
  FT: '#9d5591',
  G: '#004643',
  GC: '#460043',
  GS: '#000',
  I: '#000',
  PC: '#000',
  PP: '#000',
  PS: '#D1AC00',
  SG: '#011936',
  V: '#5E9F76'
}
