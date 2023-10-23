import { forwardRef, useRef, useState } from 'react'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'

import { searchTeamName } from '@/app/services/cartola-api'
import { Autocomplete, Avatar, Button, Group, Loader, Text } from '@mantine/core'

import { debounce } from 'lodash'

const HALF_SECOND_IN_MS = 500

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      className="bg-palette-primary-500 hover:bg-palette-primary-700 text-palette-neutral-900"
      type="submit"
      aria-disabled={disabled || pending}
      disabled={disabled || pending}
    >
      {pending ? <Loader color="#7ae1bf" size={20} /> : 'Buscar estatísticas'}
    </Button>
  )
}

const AutoCompleteItem = forwardRef<HTMLDivElement, any>(
  (
    { subtitle, value, badgeUrl, id, setSelectedTeamId, formRef, onMouseDown, ...others }: any,
    ref
  ) => {
    const onMouseDownHandler = (event: MouseEvent) => {
      setSelectedTeamId(id)
      onMouseDown(event)
    }

    return (
      <div id={id} ref={ref} {...others} onMouseDown={onMouseDownHandler}>
        <Group noWrap>
          <Avatar src={badgeUrl} />

          <div>
            <Text>{value}</Text>
            <Text size="xs" color="dimmed">
              {subtitle}
            </Text>
          </div>
        </Group>
      </div>
    )
  }
)
AutoCompleteItem.displayName = 'AutoCompleteItem'

export interface TeamsAutocompleteList {
  id: number
  value: string
  subtitle: string
  badgeUrl: string
}

export function SearchTeamStatisticsForm({ action }: { action: (payload: FormData) => void }) {
  const [selectedTeamId, setSelectedTeamId] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [listOfTeamsInSearch, setListOfTeamsInSearch] = useState<TeamsAutocompleteList[] | []>([])
  const teamIdInput = useRef<HTMLInputElement>(null)

  return (
    <form className="flex flex-col gap-4 w-full" action={action}>
      <input ref={teamIdInput} name="teamId" type="hidden" value={selectedTeamId} />
      <Autocomplete
        required
        id="teamName"
        name="teamName"
        placeholder="Nome do time no cartola"
        // eslint-disable-next-line react/display-name
        itemComponent={forwardRef((args, ref) => (
          // eslint-disable-next-line react/display-name
          <AutoCompleteItem ref={ref} setSelectedTeamId={setSelectedTeamId} {...args} />
        ))}
        description={isLoading ? <>Buscando times...</> : <>Digite o nome do time no cartola</>}
        data={listOfTeamsInSearch}
        onKeyUp={debounce(async (event) => {
          setIsLoading(true)
          const teamsFound = await searchTeamName(event.target.value)
          setListOfTeamsInSearch(teamsFound)
          setIsLoading(false)
        }, HALF_SECOND_IN_MS)}
      />
      <SubmitButton disabled={!teamIdInput.current?.value || isLoading} />
    </form>
  )
}
