'use client'

import { useRef, useState } from "react"
import { type RenderedAthlete } from "../page"
import orderBy from 'lodash/orderBy'
import mapValues from 'lodash/mapValues'
import Image from "next/image";
import Select from 'react-select'
import { FOOTBALL_TEAMS, type FootballTeamsIds } from '@/app/constants/teams'
import { POSITIONS, PositionsIds } from "@/app/constants/positions"

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

export function AthleteCard({
  athlete,
  isBench,
  selectRef
}: {
  athlete: RenderedAthlete,
  isBench: boolean,
  selectRef: any
}) {
  const handleStatisticClick = (selectedOption: any) => {
    const currentValue = selectRef.current.getValue()

    if (currentValue.some((option: any) => option.value === selectedOption.value)) {
      selectRef.current.onChange(currentValue.filter((option: any) => option.value !== selectedOption.value), {})
      return
    }

    selectRef.current.onChange([...currentValue, selectedOption], {})
  }

  return (
    <div className={`flex flex-col items-center ${isBench ? 'text-ember-200' : 'text-emerald-100'} fut-card ${isBench ? 'fut-bench-card' : 'fut-player-card'}`}>
      <div className="absolute left-4 top-8">
        <div className="text-xl" title="Média Geral">{athlete.media_num.toFixed(1)}</div>
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="uppercase text-xs" title={getPositionName(athlete.posicao_id)}>
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
        {isBench
          ? <></>
          : (
            <div className="flex justify-between cursor-pointer" onClick={() => handleStatisticClick(CAPTAIN_TIMES_OPTION)}>
              <span>Vezes capitão</span>
              <span>{athlete.captainTimes}</span>
            </div>
          )
        }
        <div className="flex justify-between cursor-pointer" onClick={() => handleStatisticClick(POINTS_AVERAGE_OPTION)}>
          <span>Média</span>
          <span>{athlete.pointsAverage.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default function AthleteList({ athletes, isBench = false, title }: { athletes: Record<string, RenderedAthlete>, isBench?: boolean, title: string }) {
  const [orderFilters, setOrderFilters] = useState([CAST_TIMES_OPTION, POINTS_AVERAGE_OPTION]);
  const selectRef = useRef(null);

  const handleOnStatisticsClick = (selectedOption: any) => setOrderFilters(selectedOption)

  return (
    <section>
      <header className="flex justify-between items-center m-4 text-emerald-950">
        <h2 className="text-white text-xl">{title}</h2>
        <Select
          ref={selectRef}
          className="w-64"
          options={isBench ? benchOptions : options}
          placeholder="Ordenar por"
          value={orderFilters}
          onChange={handleOnStatisticsClick}
          isMulti
        />
      </header>
      <div className="flex flex-wrap">
        {orderBy(athletes, Object.values(mapValues(orderFilters, 'value')), orderFilters.map(() => 'desc')).map(athlete => (
          <div key={athlete.atleta_id}>
            <AthleteCard
              athlete={athlete}
              isBench={isBench}
              selectRef={selectRef}
            />
          </div>
        ))}
      </div>
    </section>
  )
}