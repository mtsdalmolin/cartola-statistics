<p align="center">
  <img src="./.github/images/edc-brand.png" alt="Estatísticas do Cartola" />
</p>

O intuito do projeto é utilizar os dados disponíveis nas APIs abertas do cartola e fazer análises em cima das escalações na temporada. O projeto também pode ser utilizado pra fazer uma espécie de retrospectiva da temporada, ver quais foram as melhores escalações, os jogadores que mais desvalorizaram, os clubes que mais pontuaram nas escalações da temporada.
Além de estatísticas e retrospectiva da temporada, foi implementado um sistema de conquistas em cima das pontuações das rodadas e acontecimentos na temporada, como, por exemplo, 3 jogadores expulsos na temporada:

<p align="center">
  <img src="./.github/images/3-red-carded-players.png" alt="3 jogadores expulsos" />
</p>

O site tá hospedado no domínio: [cartola-statistics.vercel.app](https://cartola-statistics.vercel.app)

### Compartilhe no Twitter/X
O compartilhamento das estatísticas no Twitter/X gera imagens personalizadas de acordo com a estatística/medalha específica que você queira compartilhar. Para cada caso, é gerada uma imagem e um link específico para que o tweet fique com essa disposição:

<p align="center">
  <img src="./.github/images/worst-gk-twitter-stat.png" alt="Pior goleiro no Twitter/X" />
</p>

### Tecnologias utilizadas
- Typescript
- Next.js 14
- Vercel
- TailwindCSS
- Mantine Design System
- html2canvas

## Quer contribuir no projeto?
Abra uma [Issue](https://github.com/mtsdalmolin/cartola-statistics/issues/new) ou faça um [Fork](https://github.com/mtsdalmolin/cartola-statistics/fork) do projeto e submeta um PR com as alterações para eu avaliar.

## Como rodar o projeto
Para rodar o projeto, é necessário copiar o `.env.example`:
```bash
cp .env.example .env.local
```

E substituir as variáveis para um banco de sua preferência:
```
NEXT_API_BASE_URL=http://localhost:3000
POSTGRES_URL=<POSTGRES_URL>
POSTGRES_PRISMA_URL=<POSTGRES_PRISMA_URL>
POSTGRES_URL_NON_POOLING=<POSTGRES_URL_NON_POOLING>
POSTGRES_USER=<POSTGRES_USER>
POSTGRES_HOST=<POSTGRES_HOST>
POSTGRES_PASSWORD=<POSTGRES_PASSWORD>
POSTGRES_DATABASE=<POSTGRES_DATABASE>
BLOB_READ_WRITE_TOKEN=<BLOB_READ_WRITE_TOKEN>
```

Obs.: Só é necessário atualizar as variáveis do `postgres` se for mexer na geração das imagens para os tweets ou qualquer interação com o banco de dados nos endpoints da pasta [`(server)`](https://github.com/mtsdalmolin/cartola-statistics/tree/main/app/(server)).

Para levantar o ambiente de desenvolvimento:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

O ambiente vai estar disponível em [http://localhost:3000](http://localhost:3000).
