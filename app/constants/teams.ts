import merge from 'lodash/merge'

export const FOOTBALL_TEAMS_WITHOUT_UNEMPLOYED = {
  262: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2018/04/09/Flamengo-65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2018/04/09/Flamengo-45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2018/04/09/Flamengo-30.png'
    },
    nome: 'Flamengo',
    abreviacao: 'FLA',
    slug: 'flamengo',
    apelido: 'Mengão'
  },
  263: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-30.png'
    },
    nome: 'Botafogo',
    abreviacao: 'BOT',
    slug: 'botafogo',
    apelido: 'Glorioso'
  },
  264: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2019/09/30/Corinthians_65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2019/09/30/Corinthians_45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2019/09/30/Corinthians_30.png'
    },
    nome: 'Corinthians',
    abreviacao: 'COR',
    slug: 'corinthians',
    apelido: 'Timão'
  },
  265: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2014/04/14/bahia_60x60.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2014/04/14/bahia_45x45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2014/04/14/bahia_30x30.png'
    },
    nome: 'Bahia',
    abreviacao: 'BAH',
    slug: 'bahia',
    apelido: 'Tricolor de Aço'
  },
  266: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2014/04/14/fluminense_60x60.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2014/04/14/fluminense_45x45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2015/01/12/Fluminense-escudo.png'
    },
    nome: 'Fluminense',
    abreviacao: 'FLU',
    slug: 'fluminense',
    apelido: 'Tricolor'
  },
  267: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2021/09/04/ESCUDO-VASCO-RGB_65px.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2021/09/04/ESCUDO-VASCO-RGB_45px.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2021/09/04/ESCUDO-VASCO-RGB_30px.png'
    },
    nome: 'Vasco',
    abreviacao: 'VAS',
    slug: 'vasco',
    apelido: 'Gigante da Colina'
  },
  275: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_45x45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_30x30.png'
    },
    nome: 'Palmeiras',
    abreviacao: 'PAL',
    slug: 'palmeiras',
    apelido: 'Verdão'
  },
  276: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2014/04/14/sao_paulo_60x60.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2014/04/14/sao_paulo_45x45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2014/04/14/sao_paulo_30x30.png'
    },
    nome: 'São Paulo',
    abreviacao: 'SAO',
    slug: 'sao-paulo',
    apelido: 'Tricolor'
  },
  277: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2014/04/14/santos_60x60.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2014/04/14/santos_45x45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2014/04/14/santos_30x30.png'
    },
    nome: 'Santos',
    abreviacao: 'SAN',
    slug: 'santos',
    apelido: 'Peixe'
  },
  280: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2020/01/01/65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2020/01/01/45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2020/01/01/30.png'
    },
    nome: 'Bragantino',
    abreviacao: 'BGT',
    slug: 'bragantino',
    apelido: 'Massa Bruta'
  },
  282: {
    escudos: {
      '60x60':
        'https://s.sde.globo.com/media/organizations/2017/11/23/Atletico-Mineiro-escudo65px.png',
      '45x45':
        'https://s.sde.globo.com/media/organizations/2017/11/23/Atletico-Mineiro-escudo45px.png',
      '30x30':
        'https://s.sde.globo.com/media/organizations/2017/11/23/Atletico-Mineiro-escudo30px.png'
    },
    nome: 'Atlético-MG',
    abreviacao: 'CAM',
    slug: 'atletico-mg',
    apelido: 'Galo'
  },
  283: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2021/02/13/65_cruzeiro-2021.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2021/02/13/45_cruzeiro-2021.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2021/02/13/30_cruzeiro-2021.png'
    },
    nome: 'Cruzeiro',
    abreviacao: 'CRU',
    slug: 'cruzeiro',
    apelido: 'Raposa'
  },
  284: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2014/04/14/gremio_60x60.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2014/04/14/gremio_45x45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2014/04/14/gremio_30x30.png'
    },
    nome: 'Grêmio',
    abreviacao: 'GRE',
    slug: 'gremio',
    apelido: 'Imortal'
  },
  285: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2016/05/03/inter65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2016/05/03/inter45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2016/05/03/inter30.png'
    },
    nome: 'Internacional',
    abreviacao: 'INT',
    slug: 'internacional',
    apelido: 'Colorado'
  },
  286: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2021/04/29/juventude65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2021/04/29/juventude45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2021/04/29/juventude30.png'
    },
    nome: 'Juventude',
    abreviacao: 'JUV',
    slug: 'juventude',
    apelido: 'Papo'
  },
  287: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2014/04/14/vitoria_60x60.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2014/04/14/vitoria_45x45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2014/04/14/vitoria_30x30.png'
    },
    nome: 'Vitória',
    abreviacao: 'VIT',
    slug: 'vitoria',
    apelido: 'Vitória'
  },
  288: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2014/04/14/criciuma_60x60.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2014/04/14/criciuma_45x45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2014/04/14/criciuma_30x30.png'
    },
    nome: 'Criciúma',
    abreviacao: 'CRI',
    slug: 'criciuma',
    apelido: 'Tigre'
  },
  290: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2021/03/01/goias-65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2021/03/01/goias-45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2021/03/01/goias-30.png'
    },
    nome: 'Goiás',
    abreviacao: 'GOI',
    slug: 'goias',
    apelido: 'Esmeraldino'
  },
  293: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2019/09/09/Athletico-PR-65x65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2019/09/09/Athletico-PR-45x45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2019/09/09/Athletico-PR-30x30.png'
    },
    nome: 'Athlético-PR',
    abreviacao: 'CAP',
    slug: 'atletico-pr',
    apelido: 'Furacão'
  },
  294: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2017/03/29/coritiba65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2017/03/29/coritiba45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2017/03/29/coritiba30.png'
    },
    nome: 'Coritiba',
    abreviacao: 'CFC',
    slug: 'coritiba',
    apelido: 'Coxa'
  },
  327: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2019/02/28/escudo65_1.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2019/02/28/escudo45_1.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2019/02/28/escudo30.png'
    },
    nome: 'América-MG',
    abreviacao: 'AME',
    slug: 'america-mg',
    apelido: 'Coelho'
  },
  373: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2020/07/02/atletico-go-2020-65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2020/07/02/atletico-go-2020-45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2020/07/02/atletico-go-2020-30.png'
    },
    nome: 'Atlético-GO',
    abreviacao: 'ACG',
    slug: 'atletico-go',
    apelido: 'Dragão'
  },
  356: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2021/09/19/65_0000_Fortaleza-2021.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2021/09/19/45_0000_Fortaleza-2021.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2021/09/19/30_0000_Fortaleza-2021.png'
    },
    nome: 'Fortaleza',
    abreviacao: 'FOR',
    slug: 'fortaleza',
    apelido: 'Leão do Pici'
  },
  1371: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2014/04/16/cuiaba65.png',
      '45x45': 'https://s.sde.globo.com/media/organizations/2014/04/16/cuiaba45.png',
      '30x30': 'https://s.sde.globo.com/media/organizations/2014/04/16/cuiaba30_.png'
    },
    nome: 'Cuiabá',
    abreviacao: 'CUI',
    slug: 'cuiaba',
    apelido: 'Dourado'
  }
}

export const UNEMPLOYED = 1

export const FOOTBALL_TEAMS = merge(
  {
    [UNEMPLOYED]: {
      escudos: {
        '60x60': '',
        '45x45': '',
        '30x30': ''
      },
      nome: 'Sem clube',
      abreviacao: 'SEM',
      slug: 'sem-clube',
      apelido: 'Desempregado'
    }
  },
  FOOTBALL_TEAMS_WITHOUT_UNEMPLOYED
)

export type FootballTeamsIds = keyof typeof FOOTBALL_TEAMS
