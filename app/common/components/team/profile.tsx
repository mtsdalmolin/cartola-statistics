import { useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'

import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'

import { RoundMatchesData } from '@/app/services/types'
import { Button, CopyButton, Text, Tooltip } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'

import { useShareStatisticsLinkContext } from '../../contexts/share-statistics-link-context.client'
import { bebasNeue } from '../../fonts/bebasNeue'
import { TeamInfo } from '../../types/team'
import { TrophiesData } from '../../types/trophies'
import { Flex } from '../flex'
import { Trophies } from './trophies'

function TeamTurnData({
  average,
  total,
  validRounds,
  isFirstTurn = false
}: {
  average: number
  total: number
  validRounds: number
  isFirstTurn?: boolean
}) {
  return (
    <>
      <Text className={`${bebasNeue.className} text-2xl`}>{isFirstTurn ? 'Turno' : 'Returno'}</Text>
      <Text>
        <b className={`${bebasNeue.className} text-xl`}>{validRounds}</b> rodadas válidas
      </Text>
      <Flex align="center" direction="column">
        <Text>
          Total de <b className={`${bebasNeue.className} text-xl`}>{total.toFixed(1)}</b> pts.
        </Text>
        <Text>
          Média de <b className={`${bebasNeue.className} text-xl`}>{average.toFixed(1)}</b> pts. por
          rodada
        </Text>
      </Flex>
    </>
  )
}

function CopyStaticPageUrl() {
  const pathname = usePathname()
  const { shareLink } = useShareStatisticsLinkContext()

  if (pathname.startsWith('/estatisticas')) return null

  return (
    <CopyButton value={shareLink} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copiado' : 'Copiar'} withArrow>
          <Button
            className="bg-palette-neutral-800 hover:bg-palette-neutral-700 rounded-md"
            onClick={copy}
          >
            <Flex align="center">
              <Text>Link para compartilhar estatísticas</Text>
              {copied ? (
                <IconCheck className="text-palette-primary-500" size="1rem" />
              ) : (
                <IconCopy size="1rem" />
              )}
            </Flex>
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  )
}

export function TeamProfile({
  matchesData,
  teamInfo,
  trophies
}: {
  matchesData: RoundMatchesData
  teamInfo: TeamInfo
  trophies: TrophiesData
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const { pending } = useFormStatus()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = new URLSearchParams(searchParams)
    if (pathname !== '/' && url.get('link') === 'share' && pathname.includes('estatisticas')) return

    if (!pending) {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [pending, searchParams, pathname])

  return (
    <section className="pt-8" ref={sectionRef}>
      <Flex className={bebasNeue.className} justify="center" align="center" direction="column">
        <h1 className="text-5xl">{teamInfo.name}</h1>
        <Flex className="mobile:flex-col" align="center" gap="lg">
          <Image src={teamInfo.badgePhotoUrl ?? ''} width={180} height={180} alt="Escudo do time" />
          <Flex align="center" direction="column">
            <TeamTurnData
              average={teamInfo.pointsPerTurn.first.average}
              total={teamInfo.pointsPerTurn.first.total}
              validRounds={teamInfo.pointsPerTurn.first.validRounds}
              isFirstTurn
            />
            <TeamTurnData
              average={teamInfo.pointsPerTurn.second.average}
              total={teamInfo.pointsPerTurn.second.total}
              validRounds={teamInfo.pointsPerTurn.second.validRounds}
            />
          </Flex>
        </Flex>
        {pathname === '/' ? (
          <Flex className="w-full py-4" justify="center">
            <CopyStaticPageUrl />
          </Flex>
        ) : null}
        <Trophies matchesData={matchesData} trophies={trophies} />
      </Flex>
    </section>
  )
}
