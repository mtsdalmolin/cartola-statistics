'use client'

import { useRef, useState } from "react"
import { type RenderedAthlete } from "../page"
import orderBy from 'lodash/orderBy'
import mapValues from 'lodash/mapValues'
import isEmpty from 'lodash/isEmpty'
import isFinite from 'lodash/isFinite'
import Image from "next/image"
import Select from 'react-select'
import { FOOTBALL_TEAMS, type FootballTeamsIds } from '@/app/constants/teams'
import { POSITIONS, type PositionsIds } from "@/app/constants/positions"

const CAST_TIMES_OPTION = { value: 'castTimes', label: 'Escalações' }
const CAPTAIN_TIMES_OPTION = { value: 'captainTimes', label: 'Vezes capitão' }
const POINTS_AVERAGE_OPTION = { value: 'pointsAverage', label: 'Média' }
const OVERALL_AVERAGE_OPTION = { value: 'media_num', label: 'Média Geral' }

const options = [
  CAST_TIMES_OPTION,
  CAPTAIN_TIMES_OPTION,
  POINTS_AVERAGE_OPTION,
  OVERALL_AVERAGE_OPTION
]

const benchOptions = [
  CAST_TIMES_OPTION,
  POINTS_AVERAGE_OPTION,
  OVERALL_AVERAGE_OPTION
]

const positionsOptions = Object.entries(POSITIONS).map(([positionId, position]) => ({
  value: positionId.toString(),
  label: position.nome
}))

const benchPositionsOptions = positionsOptions.filter(position => position.value !== '6')

type PositionOption = typeof positionsOptions[0]

function getFootballTeamBadgeLink(footballTeamId: FootballTeamsIds) {
  return FOOTBALL_TEAMS[footballTeamId].escudos['30x30']
}

function getFootballTeamName(footballTeamId: FootballTeamsIds) {
  return FOOTBALL_TEAMS[footballTeamId].nome
}

function getPositionAbbreviation(positionId: PositionsIds) {
  return POSITIONS[positionId].abreviacao
}

function getPositionName(positionId: PositionsIds) {
  return POSITIONS[positionId].nome
}

function getPositionOptionByValue(positionValue: string): PositionOption {
  return positionsOptions.find(position => position.value === positionValue)!
}

function isGoalkeeper(positionId: number) {
  const gkPositionId = Object.keys(POSITIONS)
    .find((positionId: string) => 
      POSITIONS[Number(positionId)].abreviacao.toLowerCase() === 'gol'
    )

  return Number(gkPositionId) === positionId
}

function isCoach(positionId: number) {
  const coachPositionId = Object.keys(POSITIONS)
    .find((positionId: string) => 
      POSITIONS[Number(positionId)].abreviacao.toLowerCase() === 'tec'
    )

  return Number(coachPositionId) === positionId
}

type StatisticValue = number | string

function StatisticItem({ label, title, value }: { label: string, title: string, value: StatisticValue }) {
  return (
    <div className="flex justify-between">
      <span title={title}>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function AthleteStatistics({ athlete }: { athlete: RenderedAthlete }) {
  return (
    <div className="flex flex-col gap-0.5 h-[70%] divide-y overflow-auto hover:overscroll-contain hide-scroll">
      <StatisticItem
        label="Maior pont."
        title="Maior pontuação"
        value={athlete.averageMinutesPerRound.toFixed(1)}
      />
      {
        !isCoach(athlete.posicao_id)
          ? (
            <>
              <StatisticItem
                label="MMJ/R"
                title="Média de minutos jogados por rodada"
                value={athlete.averageMinutesPerRound.toFixed(1)}
              />
              <StatisticItem
                label="Min. jogados"
                title="Minutos jogados"
                value={athlete.sumOfPlayedMinutes}
              />
            </>
          )
          : null
      }
      {
        isCoach(athlete.posicao_id)
          ? (
            <StatisticItem
              label="Vitórias %"
              title="Percentual de vitórias"
              value={(athlete.victoriesAverage * 100).toFixed(1)}
            />
          )
          : null
      }
      {
        !isGoalkeeper(athlete.posicao_id) &&
        !isCoach(athlete.posicao_id)
          ? (
            <>
              <StatisticItem
                label="Gols"
                title="Gols"
                value={athlete.goals}
              />
              <StatisticItem
                label="Finalizações"
                title="Finalizações"
                value={athlete.finishes}
              />
              {
                isFinite(athlete.finishesToScore)
                  ? (
                    <StatisticItem
                      label="Finalizações para marcar gols"
                      title="FPG"
                      value={athlete.finishesToScore.toFixed(1)}
                    />
                  )
                  : null
              }
            </>
          )
          : null
      }
      {
        isFinite(athlete.minutesToScore)
          ? (
            <StatisticItem
              label="Minutos para marcar gol"
              title="MPG"
              value={athlete.minutesToScore.toFixed(1)}
            />
          )
          : null
      }
      {
        isGoalkeeper(athlete.posicao_id)
          ? (
            <>
              <StatisticItem
                label="Defesas"
                title="Defesas"
                value={athlete.defenses.toFixed(1)}
              />
              <StatisticItem
                label="Gols sofridos"
                title="Gols sofridos"
                value={athlete.goalsAgainst.toFixed(1)}
              />
              {
                isFinite(athlete.defensesToSufferGoal)
                ? (
                  <StatisticItem
                    label="Defesas para sofrer gols"
                    title="Defesas para sofrer gols"
                    value={athlete.defensesToSufferGoal.toFixed(1)}
                  />
                )
                : null
              }
            </>
          )
          : null
      }
      {
        !isCoach(athlete.posicao_id)
          ? (
            <>
              <StatisticItem
                label="Média de pontos como mandante por rodada"
                title="MPM/R"
                value={athlete.home.average.toFixed(1)}
              />
              <StatisticItem
                label="Média de pontos como visitante por rodada"
                title="MPV/R"
                value={athlete.away.average.toFixed(1)}
              />
            </>
          )
          : null
      }
      <StatisticItem
        label="Rodadas que valorizou"
        title="RV"
        value={athlete.valuation.rounds.aboveZero}
      />
      <StatisticItem
        label="Rodadas que desvalorizou"
        title="RD"
        value={athlete.valuation.rounds.belowZero}
      />
    </div>
  )
}

export function AthleteCard({
  athlete,
  isBench,
  sortSelectRef,
  positionSelectRef
}: {
  athlete: RenderedAthlete,
  isBench: boolean,
  sortSelectRef: any,
  positionSelectRef: any
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleStatisticClick = (selectedOption: any) => {
    const currentValue = sortSelectRef.current.getValue()

    if (currentValue.some((option: any) => option.value === selectedOption.value)) {
      sortSelectRef.current.onChange(currentValue.filter((option: any) => option.value !== selectedOption.value), {})
      return
    }

    sortSelectRef.current.onChange([...currentValue, selectedOption], {})
  }

  const handlePositionAbbreviationClick = (selectedPosition: PositionOption) => {
    const currentValue = positionSelectRef.current.getValue()

    if (currentValue.some((option: any) => option.value === selectedPosition.value)) {
      positionSelectRef.current.onChange(currentValue.filter((option: any) => option.value !== selectedPosition.value), {})
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

  if (
    !isEmpty(positionSelectRef.current?.getValue()) &&
    !positionSelectRef.current?.getValue().find((position: PositionOption) => position.value === athlete.posicao_id.toString())
  ) {
    return null
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
            <div
              className="text-xl cursor-pointer"
              title="Média Geral"
              onClick={() => handleStatisticClick(OVERALL_AVERAGE_OPTION)}
            >
              {athlete.overallAverage.toFixed(1)}
            </div>
            <div className="flex flex-col justify-center items-center gap-1">
              <div
                className="uppercase text-xs cursor-pointer"
                title={getPositionName(athlete.posicao_id)}
                onClick={() => handlePositionAbbreviationClick(getPositionOptionByValue(athlete.posicao_id.toString()))}
              >
                {getPositionAbbreviation(athlete.posicao_id)}
              </div>
              <Image
                alt={getFootballTeamName(athlete.clube_id)}
                src={getFootballTeamBadgeLink(athlete.clube_id)}
                width={28}
                height={28}
                draggable="false"
                title={getFootballTeamName(athlete.clube_id)}
              />
            </div>
          </div>
          <div className="w-24 mt-6 ml-4">
            <Image
              alt={athlete.apelido}
              src={athlete.foto}
              width={220}
              height={220}
              draggable="false"
            />
          </div>
          <div className={`w-3/4 text-center font-bold truncate ${isBench ? 'text-amber-950' : 'text-emerald-950'}`}>
            <span title={athlete.apelido}>{athlete.apelido}</span>
          </div>
          
          <div className="flex flex-col gap-0.5 w-3/4 text-xs">
            <div className="flex justify-between cursor-pointer" onClick={() => handleStatisticClick(CAST_TIMES_OPTION)}>
              <span>Escalações</span>
              <span>{athlete.castTimes}</span>
            </div>
            {
              isBench || isCoach(athlete.posicao_id)
              ? null
              : (
                <div className="flex justify-between cursor-pointer" onClick={() => handleStatisticClick(CAPTAIN_TIMES_OPTION)}>
                  <span>Vezes capitão</span>
                  <span>{athlete.captainTimes}</span>
                </div>
              )
            }
            {
              isCoach(athlete.posicao_id)
                ? (
                  <div className="flex justify-between">
                    <span title="Vitórias">Vitórias</span>
                    <span>{athlete.scout?.V ?? 0}</span>
                  </div>
                )
                : null
            }
            <div className="flex justify-between cursor-pointer" onClick={() => handleStatisticClick(POINTS_AVERAGE_OPTION)}>
              <span>Média</span>
              <span>{athlete.pointsAverage.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className={`absolute card-back flex justify-center`}>
          <div className="flex flex-col justify-center w-3/4 text-xs mt-[1rem] mb-10 mx-6">
            <div className="text-center font-bold text-lg truncate">
              <span title={athlete.apelido}>{athlete.apelido}</span>
            </div>
            <AthleteStatistics athlete={athlete} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AthleteList({ athletes, isBench = false, title }: { athletes: Record<string, RenderedAthlete>, isBench?: boolean, title: string }) {
  const [positionFilters, setPositionFilters] = useState<typeof positionsOptions>([]);
  const [orderFilters, setOrderFilters] = useState([CAST_TIMES_OPTION, POINTS_AVERAGE_OPTION]);
  const sortSelectRef = useRef(null);
  const positionSelectRef = useRef(null);

  const handleOnStatisticsClick = (selectedOption: any) => setOrderFilters(selectedOption)
  const handleOnPositionSelection = (selectedPositionFilters: any) => setPositionFilters(selectedPositionFilters)

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
            onChange={handleOnStatisticsClick}
            isMulti
          />
        </div>
      </header>
      <div className="flex flex-wrap">
        {orderBy(athletes, Object.values(mapValues(orderFilters, 'value')), orderFilters.map(() => 'desc')).map(athlete => (
          <div key={athlete.atleta_id}>
            <AthleteCard
              athlete={athlete}
              isBench={isBench}
              sortSelectRef={sortSelectRef}
              positionSelectRef={positionSelectRef}
            />
          </div>
        ))}
      </div>
    </section>
  )
}