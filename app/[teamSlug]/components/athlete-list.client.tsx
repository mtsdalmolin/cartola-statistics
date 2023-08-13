'use client'

import { useState } from "react"
import { type RenderedAthlete } from "../page"
import orderBy from 'lodash/orderBy'
import mapValues from 'lodash/mapValues'
import Image from "next/image";
import Select from 'react-select'

const CAST_TIMES_OPTION = { value: 'castTimes', label: 'Escalações' }
const CAPTAIN_TIMES_OPTION = { value: 'captainTimes', label: 'Vezes capitão' }
const POINTS_AVERAGE_OPTION = { value: 'pointsAverage', label: 'Média' }

const options = [
  CAST_TIMES_OPTION,
  CAPTAIN_TIMES_OPTION,
  POINTS_AVERAGE_OPTION
]

export function AthleteCard({ athlete, onStatisticsClick }: { athlete: RenderedAthlete, onStatisticsClick: (statisticName: string) => void }) {
  return (
    <div className="flex flex-col items-center fut-player-card text-emerald-100">
        {/* <div className="player-club">
          <img src="https://selimdoyranli.com/cdn/fut-player-card/img/barcelona.svg" alt="Barcelona" draggable="false"/>
        </div> */}
        <div className="w-24 mt-6">
          <Image alt={athlete.apelido} src={athlete.foto} width={220} height={220} />
        </div>
        {/* <div className="player-extra">
          <span>4*SM</span>
          <span>4*WF</span>
        </div> */}
      <div className="w-3/4 text-center font-bold truncate text-emerald-950">
        <span title={athlete.apelido}>{athlete.apelido}</span>
      </div>
      
      <div className="flex flex-col gap-0.5 w-3/4 text-xs">
        <div className="flex justify-between cursor-pointer" onClick={() => onStatisticsClick('castTimes')}>
          <span>Escalações</span>
          <span>{athlete.castTimes}</span>
        </div>
        <div className="flex justify-between cursor-pointer" onClick={() => onStatisticsClick('captainTimes')}>
          <span>Vezes capitão</span>
          <span>{athlete.captainTimes}</span>
        </div>
        <div className="flex justify-between cursor-pointer">
          <span>Média</span>
          <span>{athlete.pointsAverage.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default function AthleteList({ athletes }: { athletes: Record<string, RenderedAthlete> }) {
  const [orderFilters, setOrderFilters] = useState([CAST_TIMES_OPTION]);

  const handleOnStatisticsClick = (selectedOption: any) => setOrderFilters(selectedOption)

  return (
    <section>
      <div className="flex justify-end items-center m-4 text-emerald-950">
        <Select
          className="w-64"
          options={options}
          placeholder="Ordenar por"
          value={orderFilters}
          onChange={handleOnStatisticsClick}
          isMulti
        />
      </div>
      <div className="flex flex-wrap">
        {orderBy(athletes, Object.values(mapValues(orderFilters, 'value')), 'desc').map(athlete => (
          <div key={athlete.atleta_id}>
            <AthleteCard
              athlete={athlete}
              onStatisticsClick={handleOnStatisticsClick}
            />
          </div>
        ))}
      </div>
    </section>
  )
}