'use client'

import { experimental_useFormState as useFormState } from 'react-dom'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'

import { searchTeamId } from './actions'
import { CrewContent } from './common/components/crew-content.client'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending}>
      Buscar
    </button>
  )
}

export default function Home() {
  const [state, formAction] = useFormState(searchTeamId, { success: null, data: null })

  return (
    <form action={formAction}>
      <label htmlFor="teamId">Id do time do Cartola</label>
      <input className="text-black" type="text" id="teamId" name="teamId" required />
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
      {state.data ? (
        <CrewContent
          athletes={state.data[0]}
          bench={state.data[1]}
          clubs={state.data[2]}
          positions={state.data[3]}
        />
      ) : null}
    </form>
  )
}
