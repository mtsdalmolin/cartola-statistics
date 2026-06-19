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
  292: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2018/03/11/sport.svg',
      '45x45': 'https://s.sde.globo.com/media/organizations/2018/03/11/sport.svg',
      '30x30': 'https://s.sde.globo.com/media/organizations/2018/03/11/sport.svg'
    },
    nome: 'Sport Club do Recife',
    abreviacao: 'SPT',
    slug: 'sport',
    apelido: 'Leão do Norte'
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
  315: {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_58d78b787ec34892b5aaa0c7a146155f/clubes_2026/escudos/CHA/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_58d78b787ec34892b5aaa0c7a146155f/clubes_2026/escudos/CHA/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_58d78b787ec34892b5aaa0c7a146155f/clubes_2026/escudos/CHA/30x30.png'
    },
    nome: 'CHA',
    abreviacao: 'CHA',
    slug: 'chapecoense',
    apelido: 'Verdão do Oeste',
    nome_fantasia: 'Chapecoense',
    id: 315,
    url_editoria: 'https://ge.globo.com/sc/futebol/times/chapecoense/'
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
  354: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2019/10/10/ceara.svg',
      '45x45': 'https://s.sde.globo.com/media/organizations/2019/10/10/ceara.svg',
      '30x30': 'https://s.sde.globo.com/media/organizations/2019/10/10/ceara.svg'
    },
    nome: 'Ceará',
    abreviacao: 'CEA',
    slug: 'ceara',
    apelido: 'Ceará'
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
  364: {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_58d78b787ec34892b5aaa0c7a146155f/clubes_2026/escudos/REM/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_58d78b787ec34892b5aaa0c7a146155f/clubes_2026/escudos/REM/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_58d78b787ec34892b5aaa0c7a146155f/clubes_2026/escudos/REM/30x30.png'
    },
    nome: 'REM',
    abreviacao: 'REM',
    slug: 'remo',
    apelido: 'Remo',
    nome_fantasia: 'Remo',
    id: 364,
    url_editoria: 'https://ge.globo.com/pa/futebol/times/remo/'
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
  },
  2305: {
    escudos: {
      '60x60': 'https://s.sde.globo.com/media/organizations/2024/08/20/mirassol-novo-svg-71690.svg',
      '45x45': 'https://s.sde.globo.com/media/organizations/2024/08/20/mirassol-novo-svg-71690.svg',
      '30x30': 'https://s.sde.globo.com/media/organizations/2024/08/20/mirassol-novo-svg-71690.svg'
    },
    nome: 'Mirassol',
    abreviacao: 'MIR',
    slug: 'mirassol',
    apelido: 'Mirassol'
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

export const NATIONAL_TEAMS = {
  '2318': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/BRA/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/BRA/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/BRA/30x30.png'
    },
    nome: 'Brasil',
    abreviacao: 'BRA',
    slug: 'brasil',
    apelido: 'Brasil',
    nome_fantasia: 'Brasil',
    id: 2318,
    url_editoria: null,
    disponivel: true
  },
  '2320': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SUI/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SUI/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SUI/30x30.png'
    },
    nome: 'Suíça',
    abreviacao: 'SUI',
    slug: 'suica',
    apelido: 'Suíça',
    nome_fantasia: 'Suíça',
    id: 2320,
    url_editoria: null,
    disponivel: true
  },
  '2323': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/NOR/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/NOR/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/NOR/30x30.png'
    },
    nome: 'Noruega',
    abreviacao: 'NOR',
    slug: 'noruega',
    apelido: 'Noruega',
    nome_fantasia: 'Noruega',
    id: 2323,
    url_editoria: null,
    disponivel: true
  },
  '2324': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/EGI/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/EGI/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/EGI/30x30.png'
    },
    nome: 'Egito',
    abreviacao: 'EGI',
    slug: 'egito',
    apelido: 'Egito',
    nome_fantasia: 'Egito',
    id: 2324,
    url_editoria: null,
    disponivel: true
  },
  '2326': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ESP/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ESP/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ESP/30x30.png'
    },
    nome: 'Espanha',
    abreviacao: 'ESP',
    slug: 'espanha',
    apelido: 'Espanha',
    nome_fantasia: 'Espanha',
    id: 2326,
    url_editoria: null,
    disponivel: true
  },
  '2327': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ESC/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ESC/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ESC/30x30.png'
    },
    nome: 'Escócia',
    abreviacao: 'ESC',
    slug: 'escocia',
    apelido: 'Escócia',
    nome_fantasia: 'Escócia',
    id: 2327,
    url_editoria: null,
    disponivel: true
  },
  '2328': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/TUR/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/TUR/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/TUR/30x30.png'
    },
    nome: 'Turquia',
    abreviacao: 'TUR',
    slug: 'turquia',
    apelido: 'Turquia',
    nome_fantasia: 'Turquia',
    id: 2328,
    url_editoria: null,
    disponivel: true
  },
  '2332': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/MAR/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/MAR/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/MAR/30x30.png'
    },
    nome: 'Marrocos',
    abreviacao: 'MAR',
    slug: 'marrocos',
    apelido: 'Marrocos',
    nome_fantasia: 'Marrocos',
    id: 2332,
    url_editoria: null,
    disponivel: true
  },
  '2333': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AUS/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AUS/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AUS/30x30.png'
    },
    nome: 'Austrália',
    abreviacao: 'AUS',
    slug: 'australia',
    apelido: 'Austrália',
    nome_fantasia: 'Austrália',
    id: 2333,
    url_editoria: null,
    disponivel: true
  },
  '2334': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/HAI/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/HAI/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/HAI/30x30.png'
    },
    nome: 'Haiti',
    abreviacao: 'HAI',
    slug: 'haiti',
    apelido: 'Haiti',
    nome_fantasia: 'Haiti',
    id: 2334,
    url_editoria: null,
    disponivel: true
  },
  '2336': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/IRA/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/IRA/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/IRA/30x30.png'
    },
    nome: 'Irã',
    abreviacao: 'IRA',
    slug: 'ira',
    apelido: 'Irã',
    nome_fantasia: 'Irã',
    id: 2336,
    url_editoria: null,
    disponivel: true
  },
  '2337': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/TUN/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/TUN/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/TUN/30x30.png'
    },
    nome: 'Tunísia',
    abreviacao: 'TUN',
    slug: 'tunisia',
    apelido: 'Tunísia',
    nome_fantasia: 'Tunísia',
    id: 2337,
    url_editoria: null,
    disponivel: true
  },
  '2338': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AGL/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AGL/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AGL/30x30.png'
    },
    nome: 'Argélia',
    abreviacao: 'AGL',
    slug: 'argelia',
    apelido: 'Argélia',
    nome_fantasia: 'Argélia',
    id: 2338,
    url_editoria: null,
    disponivel: true
  },
  '2340': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/NZE/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/NZE/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/NZE/30x30.png'
    },
    nome: 'Nova Zelândia',
    abreviacao: 'NZE',
    slug: 'nova-zelandia',
    apelido: 'Nova Zelândia',
    nome_fantasia: 'Nova Zelândia',
    id: 2340,
    url_editoria: null,
    disponivel: true
  },
  '2342': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/IRQ/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/IRQ/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/IRQ/30x30.png'
    },
    nome: 'Iraque',
    abreviacao: 'IRQ',
    slug: 'iraque',
    apelido: 'Iraque',
    nome_fantasia: 'Iraque',
    id: 2342,
    url_editoria: null,
    disponivel: true
  },
  '2344': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SAU/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SAU/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SAU/30x30.png'
    },
    nome: 'Arábia Saudita',
    abreviacao: 'SAU',
    slug: 'arabia-saudita',
    apelido: 'Arábia Saudita',
    nome_fantasia: 'Arábia Saudita',
    id: 2344,
    url_editoria: null,
    disponivel: true
  },
  '2347': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SEN/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SEN/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SEN/30x30.png'
    },
    nome: 'Senegal',
    abreviacao: 'SEN',
    slug: 'senegal',
    apelido: 'Senegal',
    nome_fantasia: 'Senegal',
    id: 2347,
    url_editoria: null,
    disponivel: true
  },
  '2350': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CDM/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CDM/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CDM/30x30.png'
    },
    nome: 'Costa do Marfim',
    abreviacao: 'CDM',
    slug: 'costa-do-marfim',
    apelido: 'Costa do Marfim',
    nome_fantasia: 'Costa do Marfim',
    id: 2350,
    url_editoria: null,
    disponivel: true
  },
  '2352': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/TCH/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/TCH/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/TCH/30x30.png'
    },
    nome: 'República Tcheca',
    abreviacao: 'TCH',
    slug: 'republica-tcheca',
    apelido: 'República Tcheca',
    nome_fantasia: 'República Tcheca',
    id: 2352,
    url_editoria: null,
    disponivel: true
  },
  '2354': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/PAR/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/PAR/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/PAR/30x30.png'
    },
    nome: 'Paraguai',
    abreviacao: 'PAR',
    slug: 'paraguai',
    apelido: 'Paraguai',
    nome_fantasia: 'Paraguai',
    id: 2354,
    url_editoria: null,
    disponivel: true
  },
  '2356': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/URU/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/URU/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/URU/30x30.png'
    },
    nome: 'Uruguai',
    abreviacao: 'URU',
    slug: 'uruguai',
    apelido: 'Uruguai',
    nome_fantasia: 'Uruguai',
    id: 2356,
    url_editoria: null,
    disponivel: true
  },
  '2357': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ARG/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ARG/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ARG/30x30.png'
    },
    nome: 'Argentina',
    abreviacao: 'ARG',
    slug: 'argentina',
    apelido: 'Argentina',
    nome_fantasia: 'Argentina',
    id: 2357,
    url_editoria: null,
    disponivel: true
  },
  '2358': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AFS/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AFS/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AFS/30x30.png'
    },
    nome: 'África do Sul',
    abreviacao: 'AFS',
    slug: 'africa-do-sul',
    apelido: 'África do Sul',
    nome_fantasia: 'África do Sul',
    id: 2358,
    url_editoria: null,
    disponivel: true
  },
  '2360': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/MEX/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/MEX/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/MEX/30x30.png'
    },
    nome: 'México',
    abreviacao: 'MEX',
    slug: 'mexico',
    apelido: 'México',
    nome_fantasia: 'México',
    id: 2360,
    url_editoria: null,
    disponivel: true
  },
  '2361': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CAN/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CAN/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CAN/30x30.png'
    },
    nome: 'Canadá',
    abreviacao: 'CAN',
    slug: 'canada',
    apelido: 'Canadá',
    nome_fantasia: 'Canadá',
    id: 2361,
    url_editoria: null,
    disponivel: true
  },
  '2365': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/EUA/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/EUA/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/EUA/30x30.png'
    },
    nome: 'Estados Unidos',
    abreviacao: 'EUA',
    slug: 'estados-unidos',
    apelido: 'Estados Unidos',
    nome_fantasia: 'Estados Unidos',
    id: 2365,
    url_editoria: null,
    disponivel: true
  },
  '2368': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SUE/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SUE/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/SUE/30x30.png'
    },
    nome: 'Suécia',
    abreviacao: 'SUE',
    slug: 'suecia',
    apelido: 'Suécia',
    nome_fantasia: 'Suécia',
    id: 2368,
    url_editoria: null,
    disponivel: true
  },
  '2369': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/JAP/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/JAP/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/JAP/30x30.png'
    },
    nome: 'Japão',
    abreviacao: 'JAP',
    slug: 'japao',
    apelido: 'Japão',
    nome_fantasia: 'Japão',
    id: 2369,
    url_editoria: null,
    disponivel: true
  },
  '2370': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ING/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ING/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ING/30x30.png'
    },
    nome: 'Inglaterra',
    abreviacao: 'ING',
    slug: 'inglaterra',
    apelido: 'Inglaterra',
    nome_fantasia: 'Inglaterra',
    id: 2370,
    url_editoria: null,
    disponivel: true
  },
  '2372': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/EQU/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/EQU/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/EQU/30x30.png'
    },
    nome: 'Equador',
    abreviacao: 'EQU',
    slug: 'equador',
    apelido: 'Equador',
    nome_fantasia: 'Equador',
    id: 2372,
    url_editoria: null,
    disponivel: true
  },
  '2373': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/COL/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/COL/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/COL/30x30.png'
    },
    nome: 'Colômbia',
    abreviacao: 'COL',
    slug: 'colombia',
    apelido: 'Colômbia',
    nome_fantasia: 'Colômbia',
    id: 2373,
    url_editoria: null,
    disponivel: true
  },
  '2374': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/COR/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/COR/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/COR/30x30.png'
    },
    nome: 'Coreia do Sul',
    abreviacao: 'COR',
    slug: 'coreia-do-sul',
    apelido: 'Coreia do Sul',
    nome_fantasia: 'Coreia do Sul',
    id: 2374,
    url_editoria: null,
    disponivel: true
  },
  '2375': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/GAN/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/GAN/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/GAN/30x30.png'
    },
    nome: 'Gana',
    abreviacao: 'GAN',
    slug: 'gana',
    apelido: 'Gana',
    nome_fantasia: 'Gana',
    id: 2375,
    url_editoria: null,
    disponivel: true
  },
  '2379': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CRO/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CRO/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CRO/30x30.png'
    },
    nome: 'Croácia',
    abreviacao: 'CRO',
    slug: 'croacia',
    apelido: 'Croácia',
    nome_fantasia: 'Croácia',
    id: 2379,
    url_editoria: null,
    disponivel: true
  },
  '2381': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/HOL/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/HOL/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/HOL/30x30.png'
    },
    nome: 'Holanda',
    abreviacao: 'HOL',
    slug: 'holanda',
    apelido: 'Holanda',
    nome_fantasia: 'Holanda',
    id: 2381,
    url_editoria: null,
    disponivel: true
  },
  '2384': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ALE/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ALE/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/ALE/30x30.png'
    },
    nome: 'Alemanha',
    abreviacao: 'ALE',
    slug: 'alemanha',
    apelido: 'Alemanha',
    nome_fantasia: 'Alemanha',
    id: 2384,
    url_editoria: null,
    disponivel: true
  },
  '2385': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/FRA/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/FRA/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/FRA/30x30.png'
    },
    nome: 'França',
    abreviacao: 'FRA',
    slug: 'franca',
    apelido: 'França',
    nome_fantasia: 'França',
    id: 2385,
    url_editoria: null,
    disponivel: true
  },
  '2390': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/POR/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/POR/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/POR/30x30.png'
    },
    nome: 'Portugal',
    abreviacao: 'POR',
    slug: 'portugal',
    apelido: 'Portugal',
    nome_fantasia: 'Portugal',
    id: 2390,
    url_editoria: null,
    disponivel: true
  },
  '2391': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AUT/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AUT/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/AUT/30x30.png'
    },
    nome: 'Áustria',
    abreviacao: 'AUT',
    slug: 'austria',
    apelido: 'Áustria',
    nome_fantasia: 'Áustria',
    id: 2391,
    url_editoria: null,
    disponivel: true
  },
  '2392': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/BEL/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/BEL/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/BEL/30x30.png'
    },
    nome: 'Bélgica',
    abreviacao: 'BEL',
    slug: 'belgica',
    apelido: 'Bélgica',
    nome_fantasia: 'Bélgica',
    id: 2392,
    url_editoria: null,
    disponivel: true
  },
  '2865': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/BOS/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/BOS/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/BOS/30x30.png'
    },
    nome: 'Bósnia',
    abreviacao: 'BOS',
    slug: 'bosnia-herzegovina',
    apelido: 'Bósnia',
    nome_fantasia: 'Bósnia',
    id: 2865,
    url_editoria: null,
    disponivel: true
  },
  '3061': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/UZB/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/UZB/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/UZB/30x30.png'
    },
    nome: 'Uzbequistão',
    abreviacao: 'UZB',
    slug: 'uzbequistao',
    apelido: 'Uzbequistão',
    nome_fantasia: 'Uzbequistão',
    id: 3061,
    url_editoria: null,
    disponivel: true
  },
  '3062': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/PAN/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/PAN/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/PAN/30x30.png'
    },
    nome: 'Panamá',
    abreviacao: 'PAN',
    slug: 'panama',
    apelido: 'Panamá',
    nome_fantasia: 'Panamá',
    id: 3062,
    url_editoria: null,
    disponivel: true
  },
  '3184': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/RDC/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/RDC/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/RDC/30x30.png'
    },
    nome: 'RD Congo',
    abreviacao: 'RDC',
    slug: 'rdcongo',
    apelido: 'RD Congo',
    nome_fantasia: 'RD Congo',
    id: 3184,
    url_editoria: null,
    disponivel: true
  },
  '3201': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CAB/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CAB/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CAB/30x30.png'
    },
    nome: 'Cabo Verde',
    abreviacao: 'CAB',
    slug: 'caboverde',
    apelido: 'Cabo Verde',
    nome_fantasia: 'Cabo Verde',
    id: 3201,
    url_editoria: null,
    disponivel: true
  },
  '3221': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CUR/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CUR/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CUR/30x30.png'
    },
    nome: 'Curaçao',
    abreviacao: 'CUR',
    slug: 'curacao',
    apelido: 'Curaçao',
    nome_fantasia: 'Curaçao',
    id: 3221,
    url_editoria: null,
    disponivel: true
  },
  '3231': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/JOR/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/JOR/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/JOR/30x30.png'
    },
    nome: 'Jordânia',
    abreviacao: 'JOR',
    slug: 'jordania',
    apelido: 'Jordânia',
    nome_fantasia: 'Jordânia',
    id: 3231,
    url_editoria: null,
    disponivel: true
  },
  '3238': {
    escudos: {
      '60x60':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CAT/60x60.png',
      '45x45':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CAT/45x45.png',
      '30x30':
        'https://s3.glbimg.com/v1/AUTH_925c4b2308d342c6ba7864ea930fdada/clubes_2026/escudos/CAT/30x30.png'
    },
    nome: 'Catar',
    abreviacao: 'CAT',
    slug: 'qatar',
    apelido: 'Catar',
    nome_fantasia: 'Catar',
    id: 3238,
    url_editoria: null,
    disponivel: true
  }
}

export type FootballNationalTeamsIds = keyof typeof NATIONAL_TEAMS
