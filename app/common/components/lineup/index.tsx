import { Athlete } from '@/app/common/types/athlete'
import { TECNICO } from '@/app/constants/positions'
import { calculatePoints } from '@/app/helpers/formatters/cartola'
import { RoundMatchesData } from '@/app/services/types'
import { Text } from '@mantine/core'

import { maxBy, minBy } from 'lodash'

import { bebasNeue } from '../../fonts/bebasNeue'
import { Flex } from '../flex'
import { LineupListItem } from './list-item'

const ATHLETE_POINTS_KEY = 'pontos_num'

export function Lineup({
  lineup,
  matchesData,
  worstCaptain = false
}: {
  lineup: Athlete[]
  matchesData: RoundMatchesData
  worstCaptain?: boolean
}) {
  const lineupWithoutCoach = lineup.filter((athl) => athl.posicao_id !== TECNICO)
  const captain = worstCaptain
    ? minBy(lineupWithoutCoach, ATHLETE_POINTS_KEY)
    : maxBy(lineupWithoutCoach, ATHLETE_POINTS_KEY)

  const lineupPoints = lineup.reduce(
    (acc, athlete) => acc + calculatePoints(athlete, captain!.atleta_id),
    0
  )

  return (
    <>
      <Text className={`${bebasNeue.className} text-6xl text-palette-primary-500`}>
        {worstCaptain ? 'Time de Bagres' : 'Hall da Fama'}
      </Text>
      <Flex className="w-full" align="center" direction="column">
        <Flex className="tablet:w-full w-3/5" justify="end" align="baseline">
          <Text className={`${bebasNeue.className} text-2xl`}>Total</Text>
          <Text className={`${bebasNeue.className} text-6xl`}>{lineupPoints.toFixed(1)}</Text>
        </Flex>
        <Flex
          className="w-full divide-y divide-palette-neutral-400"
          align="center"
          direction="column"
        >
          {lineup.map((athlete) => (
            <LineupListItem
              key={athlete.atleta_id}
              athlete={athlete}
              captainId={captain!.atleta_id}
              matchesData={matchesData}
            />
          ))}
        </Flex>
      </Flex>
    </>
  )
}
