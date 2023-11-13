import { forwardRef, useRef, useState } from 'react'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'

import { SECOND_TURN_ROUNDS } from '@/app/constants/data'
import { searchTeamName } from '@/app/services/cartola-api'
import { Autocomplete, Avatar, Button, Group, Loader, Text } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'

import { debounce, isEmpty, last, uniqBy } from 'lodash'

import { useShareStatisticsLinkContext } from '../../contexts/share-statistics-link-context.client'

const HALF_SECOND_IN_MS = 500
const MEMOIZED_SEARCHED_TEAMS_KEY = '@cartola-statistics/memoized-searched-teams'

let initialMemoizedSearchedTeams: TeamsAutocompleteList[] = []

if (localStorage && localStorage.getItem(MEMOIZED_SEARCHED_TEAMS_KEY))
  initialMemoizedSearchedTeams = JSON.parse(localStorage.getItem(MEMOIZED_SEARCHED_TEAMS_KEY)!)

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      className="bg-palette-primary-500 hover:bg-palette-primary-700 text-palette-neutral-900 z-[1]"
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
    {
      subtitle,
      value,
      badgeUrl,
      id,
      setSelectedTeamId,
      setMemoizedSearchedTeams,
      formRef,
      onMouseDown,
      ...others
    }: any,
    ref
  ) => {
    const { setRoundIdInShareLink, setTeamIdInShareLink } = useShareStatisticsLinkContext()

    const onMouseDownHandler = (event: MouseEvent) => {
      setSelectedTeamId(id)
      setTeamIdInShareLink(id)
      setRoundIdInShareLink(last(SECOND_TURN_ROUNDS)!)
      setMemoizedSearchedTeams((prevState: TeamsAutocompleteList[]) =>
        uniqBy(
          [
            {
              id,
              value,
              subtitle,
              badgeUrl
            },
            ...prevState
          ],
          'id'
        ).splice(0, 3)
      )
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
  const [memoizedSearchedTeams, setMemoizedSearchedTeams] = useLocalStorage<
    TeamsAutocompleteList[]
  >({
    key: '@cartola-statistics/memoized-searched-teams',
    defaultValue: initialMemoizedSearchedTeams ?? []
  })
  const teamIdInput = useRef<HTMLInputElement>(null)
  const teamNameInput = useRef<HTMLInputElement>(null)

  return (
    <form className="flex flex-col gap-4 w-full" action={action}>
      <input ref={teamIdInput} name="teamId" type="hidden" value={selectedTeamId} />
      <Autocomplete
        required
        ref={teamNameInput}
        className="z-[1]"
        id="teamName"
        name="teamName"
        placeholder="Nome do time no cartola"
        // eslint-disable-next-line react/display-name
        itemComponent={forwardRef((args, ref) => (
          // eslint-disable-next-line react/display-name
          <AutoCompleteItem
            ref={ref}
            setSelectedTeamId={setSelectedTeamId}
            setMemoizedSearchedTeams={setMemoizedSearchedTeams}
            {...args}
          />
        ))}
        description={isLoading ? <>Buscando times...</> : <>Digite o nome do time no cartola</>}
        data={
          !isEmpty(memoizedSearchedTeams)
            ? uniqBy([...listOfTeamsInSearch, ...memoizedSearchedTeams], 'id')
            : listOfTeamsInSearch
        }
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
