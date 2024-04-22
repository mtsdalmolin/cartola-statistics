'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { Flex } from '@/app/common/components/flex'
import { Lineup } from '@/app/common/components/lineup'
import { LoadingFallback } from '@/app/common/components/loading-fallback'
import { Signature } from '@/app/common/components/signature'
import { AVAILABLE_YEARS } from '@/app/common/contexts/selected-year-context.client'
import { bebasNeue } from '@/app/common/fonts/bebasNeue'
import { SeasonYears } from '@/app/constants/data'
import {
  getBestLineupsRankingData,
  getTotalPointsRankingData,
  getWealthRankingData
} from '@/app/services/ranking/api'
import {
  BestLineupsRankingData,
  TotalPointsRankingData,
  WealthRankingData
} from '@/app/services/ranking/types'
import { Accordion, Select, Tabs, Text, type TabProps } from '@mantine/core'

import { isEmpty, isNil } from 'lodash'

const RANKING_OPTIONS = {
  OVERALL_POINTS: 'pontos-geral',
  LINEUPS: 'escalacoes',
  WEALTH: 'patrimonio'
}

const RankingTab = ({ children, ...props }: TabProps) => {
  return (
    <Tabs.Tab
      className="
      data-[active]:border-palette-primary-500
      data-[active]:hover:border-palette-neutral-100
      hover:border-palette-neutral-100
        hover:bg-transparent
      "
      {...props}
    >
      {children}
    </Tabs.Tab>
  )
}

export default function Ranking() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [year, setYear] = useState(new Date().getFullYear())
  const [isLoading, setIsLoading] = useState(false)
  const [totalPointsRankingData, setTotalPointsRankingData] = useState<
    TotalPointsRankingData[] | null
  >(null)
  const [bestLineupsRankingData, setBestLineupsRankingData] = useState<
    BestLineupsRankingData[] | null
  >(null)
  const [wealthRankingData, setWealthRankingData] = useState<WealthRankingData[] | null>(null)

  const q = searchParams.get('q')

  const handleChange = (item: string) => {
    setYear(+item as SeasonYears)
  }

  useEffect(() => {
    if (isNil(q) || q === RANKING_OPTIONS.OVERALL_POINTS) {
      const showLoadingState = isNil(totalPointsRankingData) || isEmpty(totalPointsRankingData)
      if (showLoadingState) setIsLoading(true)
      getTotalPointsRankingData(year).then((data: TotalPointsRankingData[]) => {
        setTotalPointsRankingData(data)
        if (showLoadingState) setIsLoading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, q])

  useEffect(() => {
    if (q === RANKING_OPTIONS.LINEUPS) {
      const showLoadingState = isNil(bestLineupsRankingData) || isEmpty(bestLineupsRankingData)
      if (showLoadingState) setIsLoading(true)
      getBestLineupsRankingData(year).then((data: BestLineupsRankingData[]) => {
        setBestLineupsRankingData(data)
        if (showLoadingState) setIsLoading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, q])

  useEffect(() => {
    if (q === RANKING_OPTIONS.WEALTH) {
      const showLoadingState = isNil(wealthRankingData) || isEmpty(wealthRankingData)
      if (showLoadingState) setIsLoading(true)
      getWealthRankingData(year).then((data: WealthRankingData[]) => {
        setWealthRankingData(data)
        if (showLoadingState) setIsLoading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, q])

  return (
    <Flex className="w-full pt-8 px-4" direction="column">
      <Flex className="w-full mobile:justify-center" justify="between" align="end">
        <Text
          className={`${bebasNeue.className} py-2 text-7xl text-palette-primary-500`}
          component="h1"
        >
          Ranking
        </Text>
        <Select
          className="text-left"
          placeholder="Selecione a temporada"
          label="Ano da temporada"
          defaultValue={year.toString()}
          data={AVAILABLE_YEARS.map((n) => `${n}`)}
          onChange={handleChange}
        />
      </Flex>
      <Tabs
        className="w-full min-h-[77vh] mobile:min-h-[64vh]"
        defaultValue={q ?? RANKING_OPTIONS.OVERALL_POINTS}
        onTabChange={(tabValue) => router.push(`?q=${tabValue}`)}
      >
        <Tabs.List grow>
          <RankingTab value={RANKING_OPTIONS.OVERALL_POINTS}>Pontuação total</RankingTab>
          <RankingTab value={RANKING_OPTIONS.LINEUPS}>Escalações</RankingTab>
          <RankingTab value={RANKING_OPTIONS.WEALTH}>Patrimônio</RankingTab>
        </Tabs.List>

        <Tabs.Panel value={RANKING_OPTIONS.OVERALL_POINTS}>
          <Flex className="w-full py-6" direction="column" gap="none">
            {isLoading ? (
              <LoadingFallback message="Buscando dados do ranking..." />
            ) : (
              totalPointsRankingData?.map((totalPointsData, idx) => (
                <Flex
                  key={totalPointsData.team_id}
                  className="w-full border-b-[0.0625rem] border-[#373A40] px-5 py-4"
                  align="center"
                  justify="between"
                >
                  <Text className={`${bebasNeue.className} text-palette-primary-500 text-6xl`}>
                    {idx + 1}
                  </Text>
                  <Flex align="center" justify="center" gap="md">
                    <Image
                      className="mobile:hidden"
                      src={totalPointsData.team_badge}
                      alt={totalPointsData.team_name}
                      width={50}
                      height={50}
                    />
                    <Text className="truncate mobile:max-w-[85px]">
                      {totalPointsData.team_name}
                    </Text>
                  </Flex>
                  <Text className={`${bebasNeue.className} text-palette-primary-500 text-3xl`}>
                    {totalPointsData.points.toFixed(2)}
                  </Text>
                </Flex>
              ))
            )}
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value={RANKING_OPTIONS.LINEUPS}>
          <Flex className="w-full py-6" direction="column" gap="lg">
            <Accordion className="w-full">
              {isLoading ? (
                <LoadingFallback message="Buscando dados do ranking..." />
              ) : (
                bestLineupsRankingData?.map((bestLineupsData, idx) => (
                  <Accordion.Item
                    value={`${idx}`}
                    key={`${bestLineupsData.team_id}-${bestLineupsData.points}`}
                  >
                    <Accordion.Control>
                      <Flex
                        key={bestLineupsData.team_id}
                        className="w-full"
                        align="center"
                        justify="between"
                      >
                        <Text
                          className={`${bebasNeue.className} text-palette-primary-500 text-6xl`}
                        >
                          {idx + 1}
                        </Text>
                        <Flex align="center" justify="center" gap="md">
                          <Image
                            className="mobile:hidden"
                            src={bestLineupsData.team_badge}
                            alt={bestLineupsData.team_name}
                            width={50}
                            height={50}
                          />
                          <Text className="truncate mobile:max-w-[85px]">
                            {bestLineupsData.team_name}
                          </Text>
                        </Flex>
                        <Text
                          className={`${bebasNeue.className} text-palette-primary-500 text-3xl`}
                        >
                          {bestLineupsData.points.toFixed(2)}
                        </Text>
                      </Flex>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Lineup
                        lineup={bestLineupsData.payload.atletas}
                        captainId={bestLineupsData.payload.capitao_id}
                        roundId={bestLineupsData.payload.rodada_atual}
                        hideNamesOnMobile={false}
                        noText
                      />
                    </Accordion.Panel>
                  </Accordion.Item>
                ))
              )}
            </Accordion>
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value={RANKING_OPTIONS.WEALTH}>
          <Flex className="w-full py-6" direction="column" gap="none">
            {isLoading ? (
              <LoadingFallback message="Buscando dados do ranking..." />
            ) : (
              wealthRankingData?.map((totalPointsData, idx) => (
                <Flex
                  key={totalPointsData.team_id}
                  className="w-full border-b-[0.0625rem] border-[#373A40] px-5 py-4"
                  align="center"
                  justify="between"
                >
                  <Text className={`${bebasNeue.className} text-palette-primary-500 text-6xl`}>
                    {idx + 1}
                  </Text>
                  <Flex align="center" justify="center" gap="md">
                    <Image
                      className="mobile:hidden"
                      src={totalPointsData.team_badge}
                      alt={totalPointsData.team_name}
                      width={50}
                      height={50}
                    />
                    <Text className="truncate mobile:max-w-[85px]">
                      {totalPointsData.team_name}
                    </Text>
                  </Flex>
                  <Text className={`${bebasNeue.className} text-palette-primary-500 text-3xl`}>
                    {totalPointsData.wealth.toFixed(2)}
                  </Text>
                </Flex>
              ))
            )}
          </Flex>
        </Tabs.Panel>
      </Tabs>
      <Signature />
    </Flex>
  )
}
