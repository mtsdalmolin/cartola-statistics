'use client'

import { experimental_useFormState as useFormState } from 'react-dom'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'

import Image from 'next/image'

import brand from '@/public/logo/brand.svg'
import { Button, Input, Loader } from '@mantine/core'

import { searchTeamId } from './actions'
import { CrewContent } from './common/components/crew-content.client'

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
      {pending ? <Loader color="#12211c" size={20} /> : 'Buscar'}
    </Button>
  )
}

export default function Home() {
  const [state, formAction] = useFormState(searchTeamId, { success: null, data: null })

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
              placeholder="Ex.: 25929996"
              required
            />
            <SubmitButton />
          </form>
        </div>
      </div>
      {state.data ? (
        <div className="py-8 px-12">
          <CrewContent
            athletes={state.data[0]}
            bench={state.data[1]}
            clubs={state.data[2]}
            positions={state.data[3]}
          />
        </div>
      ) : null}
    </>
  )
}
