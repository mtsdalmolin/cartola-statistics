import { forwardRef, useState } from 'react'
import { experimental_useFormStatus } from 'react-dom'

import { ENDPOINTS, request } from '@/app/services/cartola-api'
import { TeamFromSearchApi } from '@/app/services/types'
import { Autocomplete, Avatar, Button, Group, Loader, Text } from '@mantine/core'

import { debounce } from 'lodash'

const HALF_SECOND_IN_MS = 500

function SubmitButton() {
  const { pending } = experimental_useFormStatus()

  return (
    <Button
      className="bg-palette-primary-500 hover:bg-palette-primary-700 text-palette-neutral-900"
      type="submit"
      aria-disabled={pending}
    >
      {pending ? <Loader color="#12211c" size={20} /> : 'Buscar estatísticas'}
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

interface TeamsAutocompleteList {
  id: number
  value: string
  subtitle: string
  badgeUrl: string
}

export function SearchTeamStatisticsForm({ action }: { action: (payload: FormData) => void }) {
  const [selectedTeamId, setSelectedTeamId] = useState(0)
  const [listOfTeamsInSearch, setListOfTeamsInSearch] = useState<TeamsAutocompleteList[] | []>([])
  return (
    <form className="flex flex-col gap-4 w-full" action={action}>
      <input name="teamId" type="hidden" value={selectedTeamId} />
      <Autocomplete
        required
        id="teamName"
        name="teamName"
        placeholder="Digite o nome do time no cartola"
        // eslint-disable-next-line react/display-name
        itemComponent={forwardRef((args, ref) => (
          // eslint-disable-next-line react/display-name
          <AutoCompleteItem ref={ref} setSelectedTeamId={setSelectedTeamId} {...args} />
        ))}
        data={listOfTeamsInSearch}
        onKeyUp={debounce(async (event) => {
          const teamsFound = await request<TeamFromSearchApi[]>(
            ENDPOINTS.SEARCH_TEAM_BY_NAME(event.target.value)
          )
          const filteredTeamsFound = teamsFound
            .filter((team) => team.time_id)
            .map((team) => ({
              id: team.time_id,
              value: team.nome,
              subtitle: team.nome_cartola,
              badgeUrl: team.url_escudo_png
            }))
          setListOfTeamsInSearch(filteredTeamsFound)
        }, HALF_SECOND_IN_MS)}
      />
      <SubmitButton />
    </form>
  )
}
