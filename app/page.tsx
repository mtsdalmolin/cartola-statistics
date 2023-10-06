'use client'

import { experimental_useFormState as useFormState } from 'react-dom'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'

import Image from 'next/image'

import brand from '@/public/logo/brand.svg'
import { Button, Input, Loader } from '@mantine/core'

import { getTeamStatistics } from './actions'
import { Artillery } from './common/components/statistics/artillery'
import { HighestScorer } from './common/components/statistics/highest-scorer'
import { LineupsPerTeam } from './common/components/statistics/lineups-per-team'

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
    <>
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
        <div className="grid gap-8 grid-cols-statistics justify-items-center w-full max-w-[1200px]">
          <LineupsPerTeam clubsData={state.data[2]} />
          <HighestScorer crewData={state.data[0]} />
          <Artillery crewData={state.data[0]} />
        </div>
      ) : null}
    </>
  )
}
