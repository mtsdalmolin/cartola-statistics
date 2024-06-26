'use client'

import { useRef, useState } from 'react'
import Select, { SelectInstance } from 'react-select'

import Image from 'next/image'

import { POSITIONS } from '@/app/constants/positions'
import {
  CAPTAIN_TIMES_OPTION,
  CAST_TIMES_OPTION,
  DEFENSES_OPTION,
  DEFENSES_TO_SUFFER_GOAL_OPTION,
  FINISHES_OPTION,
  FINISHES_TO_SCORE_OPTION,
  GOALS_OPTION,
  HIGHEST_POINTS_OPTION,
  MINUTES_PLAYES_OPTION,
  MINUTES_TO_SCORE_OPTION,
  OVERALL_AVERAGE_OPTION,
  POINTS_AVERAGE_OPTION,
  type StatisticOption
} from '@/app/constants/statistics'
import {
  getPositionAbbreviation,
  getPositionName,
  getPositionOptionByValue,
  isCoach,
  isPositionSelectedOrIsFilterEmpty
} from '@/app/helpers/positions'
import { getFootballTeamBadgeLink, getFootballTeamName } from '@/app/helpers/teams'
import { Tooltip } from '@mantine/core'

import { uniqueId } from 'lodash'
import mapValues from 'lodash/mapValues'
import orderBy from 'lodash/orderBy'

import { useOrderContext } from '../../contexts/order-context.client'
import { RenderedAthlete } from '../../types/athlete'
import { PositionOption } from '../../types/position'
import { AthleteStatistics } from './athlete-statistics'

const options = [
  CAST_TIMES_OPTION,
  CAPTAIN_TIMES_OPTION,
  POINTS_AVERAGE_OPTION,
  OVERALL_AVERAGE_OPTION,
  HIGHEST_POINTS_OPTION,
  MINUTES_PLAYES_OPTION,
  GOALS_OPTION,
  MINUTES_TO_SCORE_OPTION,
  FINISHES_OPTION,
  FINISHES_TO_SCORE_OPTION,
  DEFENSES_OPTION,
  DEFENSES_TO_SUFFER_GOAL_OPTION
]

const benchOptions = [
  CAST_TIMES_OPTION,
  POINTS_AVERAGE_OPTION,
  OVERALL_AVERAGE_OPTION,
  HIGHEST_POINTS_OPTION,
  MINUTES_PLAYES_OPTION,
  GOALS_OPTION,
  MINUTES_TO_SCORE_OPTION,
  FINISHES_OPTION,
  FINISHES_TO_SCORE_OPTION,
  DEFENSES_OPTION,
  DEFENSES_TO_SUFFER_GOAL_OPTION
]

const positionsOptions = Object.entries(POSITIONS).map(([positionId, position]) => ({
  value: positionId.toString(),
  label: position.nome
}))

const benchPositionsOptions = positionsOptions.filter((position) => position.value !== '6')

export function AthleteCard({
  athlete,
  isBench,
  sortSelectRef,
  positionSelectRef
}: {
  athlete: RenderedAthlete
  isBench: boolean
  sortSelectRef: any
  positionSelectRef: any
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleStatisticClick = (selectedOption: any) => {
    const currentValue = sortSelectRef.current.getValue()

    if (currentValue.some((option: any) => option.value === selectedOption.value)) {
      sortSelectRef.current.onChange(
        currentValue.filter((option: any) => option.value !== selectedOption.value),
        {}
      )
      return
    }

    sortSelectRef.current.onChange([...currentValue, selectedOption], {})
  }

  const handlePositionAbbreviationClick = (selectedPosition: PositionOption) => {
    const currentValue = positionSelectRef.current.getValue()

    if (currentValue.some((option: any) => option.value === selectedPosition.value)) {
      positionSelectRef.current.onChange(
        currentValue.filter((option: any) => option.value !== selectedPosition.value),
        {}
      )
      return
    }

    positionSelectRef.current.onChange([...currentValue, selectedPosition], {})
  }

  const flipCard = () => {
    if (cardRef.current?.className.includes('card-flip')) {
      cardRef.current?.classList.remove('card-flip')
      return
    }

    cardRef.current?.classList.add('card-flip')
  }

  return (
    <div
      ref={cardRef}
      className={`card ${isBench ? 'text-ember-200' : 'text-emerald-100'}`}
      onDoubleClick={flipCard}
    >
      <div className={`card-inner ${isBench ? 'bench-card' : 'player-card'}`}>
        <div className="absolute flex flex-col items-center card-front">
          <div className="absolute left-4 top-8">
            <Tooltip label="Média">
              <div
                className="text-xl cursor-pointer"
                onClick={() => handleStatisticClick(POINTS_AVERAGE_OPTION)}
              >
                {athlete.pointsAverage.toFixed(1)}
              </div>
            </Tooltip>
            <div className="flex flex-col justify-center items-center gap-1">
              <Tooltip label={getPositionName(athlete.posicao_id)}>
                <div
                  className="uppercase text-xs cursor-pointer"
                  onClick={() =>
                    handlePositionAbbreviationClick(
                      getPositionOptionByValue(positionsOptions, athlete.posicao_id.toString())
                    )
                  }
                >
                  {getPositionAbbreviation(athlete.posicao_id)}
                </div>
              </Tooltip>
              <Tooltip label={getFootballTeamName(athlete.clube_id)}>
                <Image
                  alt={getFootballTeamName(athlete.clube_id)}
                  src={getFootballTeamBadgeLink(athlete.clube_id)}
                  width={28}
                  height={28}
                  draggable="false"
                />
              </Tooltip>
            </div>
          </div>
          <div className="w-24 mt-6 ml-4">
            <Image
              alt={athlete.apelido}
              src={athlete.foto ?? ''}
              width={220}
              height={220}
              draggable="false"
            />
          </div>
          <div
            className={`w-3/4 text-center font-bold truncate cursor-default ${
              isBench ? 'text-amber-950' : 'text-emerald-950'
            }`}
          >
            <Tooltip label={athlete.apelido}>
              <span>{athlete.apelido}</span>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-0.5 w-3/4 text-xs">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => handleStatisticClick(CAST_TIMES_OPTION)}
            >
              <span>Escalações</span>
              <span>{athlete.castTimes}</span>
            </div>
            {isBench || isCoach(athlete.posicao_id) ? null : (
              <div
                className="flex justify-between cursor-pointer"
                onClick={() => handleStatisticClick(CAPTAIN_TIMES_OPTION)}
              >
                <span>Vezes capitão</span>
                <span>{athlete.captainTimes}</span>
              </div>
            )}
            {isCoach(athlete.posicao_id) ? (
              <div className="flex justify-between">
                <span>Vitórias</span>
                <span>{athlete.scout?.V ?? 0}</span>
              </div>
            ) : null}
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => handleStatisticClick(OVERALL_AVERAGE_OPTION)}
            >
              <Tooltip
                label="Soma das médias do cartola na rodada escalada dividido pelo número de escalações"
                multiline
              >
                <span>Média geral</span>
              </Tooltip>
              <span>{athlete.overallAverage.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className={`absolute card-back flex justify-center`}>
          <div className="flex flex-col justify-center w-3/4 text-xs mt-[1rem] mb-10 mx-6">
            <div className="text-center font-bold text-lg truncate cursor-default">
              <Tooltip label={athlete.apelido}>
                <span>{athlete.apelido}</span>
              </Tooltip>
            </div>
            <AthleteStatistics athlete={athlete} handleStatisticClick={handleStatisticClick} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AthleteList({
  athletes,
  isBench = false,
  title
}: {
  athletes: Record<string, RenderedAthlete>
  isBench?: boolean
  title: string
}) {
  const [positionFilters, setPositionFilters] = useState<typeof positionsOptions>([])
  const { orderFilters, handleOnStatisticSelect } = useOrderContext()
  const sortSelectRef = useRef<SelectInstance<StatisticOption, true>>(null)
  const positionSelectRef = useRef<SelectInstance<(typeof positionsOptions)[0], true>>(null)

  const handleOnPositionSelection = (selectedPositionFilters: any) =>
    setPositionFilters(selectedPositionFilters)

  return (
    <section>
      <header className="flex justify-between items-center m-4 text-emerald-950">
        <h2 className="text-white text-xl">{title}</h2>
        <div className="flex gap-4">
          <Select
            ref={positionSelectRef}
            className="w-64"
            options={isBench ? benchPositionsOptions : positionsOptions}
            placeholder="Filtrar por posição"
            value={positionFilters}
            onChange={handleOnPositionSelection}
            isMulti
          />
          <Select
            ref={sortSelectRef}
            className="w-64"
            options={isBench ? benchOptions : options}
            placeholder="Ordenar por"
            value={orderFilters}
            onChange={handleOnStatisticSelect}
            isMulti
          />
        </div>
      </header>
      <div className="flex flex-wrap gap-x-2">
        {orderBy(
          athletes,
          Object.values(mapValues(orderFilters, 'value')),
          orderFilters.map(() => 'desc')
        ).map((athlete) =>
          isPositionSelectedOrIsFilterEmpty(positionFilters, athlete.posicao_id.toString()) ? (
            <div key={uniqueId(athlete.atleta_id.toString())}>
              <AthleteCard
                athlete={athlete}
                isBench={isBench}
                sortSelectRef={sortSelectRef}
                positionSelectRef={positionSelectRef}
              />
            </div>
          ) : null
        )}
      </div>
    </section>
  )
}
