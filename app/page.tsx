'use client'

import { experimental_useFormState as useFormState } from 'react-dom'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import Image from 'next/image'

import brand from '@/public/logo/brand.svg'
import { Button, Input, Loader } from '@mantine/core'

import { getTeamStatistics } from './actions'
import { Artillery } from './common/components/statistics/artillery'
import { BestHomePlayer } from './common/components/statistics/best-home-player'
import { DefenseEfficiency } from './common/components/statistics/defense-efficiency'
import { FinishEfficiency } from './common/components/statistics/finish-efficiency'
import { HighestFinisher } from './common/components/statistics/highest-finisher'
import { HighestScorer } from './common/components/statistics/highest-scorer'
import { LineupsPerTeam } from './common/components/statistics/lineups-per-team'
import { MoreDefenses } from './common/components/statistics/more-defenses'

// color scheme
// bg #254439 || #12211c
// highlight #7ae1bf
// letter #ffffff

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      className="bg-[#7ae1bf] hover:bg-[#7ae1bf] hover:opacity-[0.9] text-[#12211c]"
      type="submit"
      aria-disabled={pending}
    >
      {pending ? <Loader color="#12211c" size={20} /> : 'Buscar resumo'}
    </Button>
  )
}

export default function Home() {
  const [state, formAction] = useFormState(getTeamStatistics, {
    message: null,
    data: null
  })

  return (
    <div className="w-full max-w-[1200px]">
      <div className="flex h-[100vh]">
        <div className="m-auto w-fit">
          <Image src={brand} width={500} height={500} alt="brand" />
          <form className="flex flex-col gap-4 w-full" action={formAction}>
            <label htmlFor="teamId">Id do time do Cartola</label>
            <Input
              className="text-[#254439]"
              type="text"
              id="teamId"
              name="teamId"
              placeholder="Ex.: 29367702"
              required
            />
            <SubmitButton />
          </form>
        </div>
      </div>
      {state.data ? (
        <ResponsiveMasonry columnsCountBreakPoints={{ 375: 1, 575: 2, 920: 3 }}>
          <Masonry gutter="1rem" columnsCount={3}>
            <LineupsPerTeam clubsData={state.data[2]} />
            <HighestScorer crewData={state.data[0]} />
            <Artillery crewData={state.data[0]} />
            <FinishEfficiency crewData={state.data[0]} />
            <HighestFinisher crewData={state.data[0]} />
            <DefenseEfficiency crewData={state.data[0]} />
            <MoreDefenses crewData={state.data[0]} />
            <BestHomePlayer crewData={state.data[0]} />
          </Masonry>
        </ResponsiveMasonry>
      ) : null}
    </div>
  )
}
