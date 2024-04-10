import { SeasonYears } from '../constants/data'
import { PARAM_TO_TROPHY, TROPHY_NAME, TWITTER_TROPHY_MESSAGE } from '../constants/trophies'
import { URLS } from '../constants/url'

export function createTrophyTwitterShareLink({
  teamId,
  trophyParamName,
  year
}: {
  teamId: string
  trophyParamName: keyof typeof PARAM_TO_TROPHY
  year: SeasonYears
}) {
  const trophyEdcUrl =
    `${URLS.cartolaStatisticsPage}/conquistas/${teamId}/${trophyParamName}&year=${year}`.replace(
      /&/,
      '%26'
    )

  const twitterDescriptionMessage = `Consegui a medalha ${TROPHY_NAME[trophyParamName]} porque ${TWITTER_TROPHY_MESSAGE[trophyParamName]}%0A%0A`

  return `http://twitter.com/intent/tweet?text=${twitterDescriptionMessage}&url=${trophyEdcUrl}&hashtags=estatisticasdocartola`
}

export function createTrophyBoardTwitterShareLink({
  teamId,
  roundId,
  year
}: {
  teamId: string
  roundId: number
  year: SeasonYears
}) {
  const trophyEdcUrl =
    `${URLS.cartolaStatisticsPage}/medalhas/${teamId}?roundId=${roundId}&year=${year}`.replace(
      /&/,
      '%26'
    )

  const twitterDescriptionMessage = `Esse foi o meu quadro de medalhas do ano no EDC.%0A%0A`

  return `http://twitter.com/intent/tweet?text=${twitterDescriptionMessage}&url=${trophyEdcUrl}&hashtags=estatisticasdocartola`
}
