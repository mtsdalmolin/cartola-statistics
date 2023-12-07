import { useMemo } from 'react'

import { Athlete } from '@/app/common/types/athlete'
import { TECNICO } from '@/app/constants/positions'
import { calculatePoints, handleGameActions } from '@/app/helpers/formatters/cartola'
import { RoundMatchesData } from '@/app/services/types'
import { Text } from '@mantine/core'

import { maxBy, minBy } from 'lodash'

import { bebasNeue } from '../../fonts/bebasNeue'
import { Flex } from '../flex'
import { LineupListItem } from './list-item'

const ATHLETE_POINTS_KEY = 'pontos_num'

const SCOUT_NAMES: Record<string, string> = {
  A: 'Assistências',
  CA: 'Cartões amarelos',
  CV: 'Cartões vermelhos',
  DE: 'Defesas',
  DP: 'Defesas de pênaltis',
  DS: 'Desarmes',
  FC: 'Faltas cometidas',
  FD: 'Finalizações defendidas',
  FF: 'Finalizações pra fora',
  FS: 'Faltas sofridas',
  FT: 'Finalizações na trave',
  G: 'Gols',
  GC: 'Gols contra',
  GS: 'Gols sofridos',
  I: 'Impedimentos',
  PC: 'Pênaltis cometidos',
  PP: 'Pênaltis perdidos',
  PS: 'Pênaltis sofridos',
  SG: 'Sem sofrer gols',
  V: 'Vitória'
}

function getScoutName(scoutName: string) {
  return SCOUT_NAMES[scoutName]
}

function renderDescriptionText(worstCaptain: boolean) {
  if (worstCaptain)
    return 'Time de Bagres é composto pelos piores escalados em todas as rodadas do cartola. O critério para capitão é jogador com a menor pontuação dentre eles.'
  return 'Hall da Fama é composto pelos melhores escalados em todas as rodadas do cartola. O critério para capitão é o jogador com a maior pontuação dentre eles.'
}

export function Lineup({
  lineup,
  matchesData,
  invertSummary = false,
  worstCaptain = false
}: {
  lineup: Athlete[]
  matchesData: RoundMatchesData
  invertSummary?: boolean
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

  const teamScout: Record<string, number> = lineup.reduce((acc, athlete) => {
    acc = handleGameActions(athlete, acc)
    return acc
  }, {})

  const teamSummary = useMemo(() => {
    const scoutTitle = (scoutName: string) => (
      <Text className={`${bebasNeue.className} text-3xl mobile:text-xl`}>
        {getScoutName(scoutName)}
      </Text>
    )
    return (
      <Flex className="grow-0 pt-2 mobile:w-full" direction="column">
        <Text
          className={`${bebasNeue.className} ${
            !invertSummary ? 'text-end' : ''
          } mobile:w-full text-5xl mobile:text-3xl text-palette-primary-500`}
        >
          Detalhes da escalação
        </Text>
        {Object.entries(teamScout).map(([key, value]) => (
          <Flex
            key={key}
            className="w-full"
            justify={invertSummary ? 'start' : 'end'}
            align="baseline"
          >
            {!invertSummary ? scoutTitle(key) : null}
            <Text
              className={`${bebasNeue.className} w-10 mobile:w-6 text-end text-5xl mobile:text-3xl text-palette-primary-500`}
            >
              {value}
            </Text>
            {invertSummary ? scoutTitle(key) : null}
          </Flex>
        ))}
      </Flex>
    )
  }, [teamScout, invertSummary])

  return (
    <>
      <Text className={`${bebasNeue.className} text-6xl text-palette-primary-500`}>
        {worstCaptain ? 'Time de Bagres' : 'Hall da Fama'}
      </Text>
      <Text className="w-2/3 tablet:w-full border-t-2 border-palette-primary-700">
        {renderDescriptionText(worstCaptain)}
      </Text>
      <Flex className={`w-full ${invertSummary ? 'mobile:flex-col-reverse' : ''}`} gap="lg">
        {invertSummary ? teamSummary : null}
        <Flex className="mobile:w-full" align="center" direction="column">
          <Flex className="w-full grow-[3]" justify="end" align="baseline">
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
        {!invertSummary ? teamSummary : null}
      </Flex>
    </>
  )
}
