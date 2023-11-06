import { PARAM_TO_TROPHY, TROPHY_NAME, TWITTER_TROPHY_MESSAGE } from '../constants/trophies'
import { URLS } from '../constants/url'

export function createTrophyTwitterShareLink({
  teamId,
  trophyParamName
}: {
  teamId: string
  trophyParamName: keyof typeof PARAM_TO_TROPHY
}) {
  const trophyEdcUrl = `${URLS.cartolaStatisticsPage}/conquistas/${teamId}/${trophyParamName}`

  const twitterDescriptionMessage = `Consegui a medalha ${TROPHY_NAME[trophyParamName]} porque ${TWITTER_TROPHY_MESSAGE[trophyParamName]}%0A%0A`

  return `http://twitter.com/share?text=${twitterDescriptionMessage}&url=${trophyEdcUrl}&hashtags=estatisticasdocartola`
}
