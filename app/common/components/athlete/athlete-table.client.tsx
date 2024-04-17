'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'

import Image from 'next/image'

import { MarketAthleteTableData } from '@/app/(user)/in/mercado/page'
import { POSITIONS } from '@/app/constants/positions'
import { PROSPECTIVE, STATUS } from '@/app/constants/status'
import { FOOTBALL_TEAMS_WITHOUT_UNEMPLOYED } from '@/app/constants/teams'
import { MarketTableAsyncExternalStorage } from '@/app/storage/localstorage/market-table.external'
import { ActionIcon, Box, Dialog, Menu, Switch, Text, Tooltip } from '@mantine/core'
import {
  IconArmchair,
  IconCircleCheckFilled,
  IconShirtSport,
  IconSoccerField,
  IconPlayFootball,
  IconAlertCircleFilled
} from '@tabler/icons-react'

import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_TableInstance,
  MRT_ColumnFiltersState
} from 'mantine-react-table'

import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'

import { Button } from '../button.client'
import { Flex } from '../flex'
import { MatchVersus } from '../match-versus'
import { AthleteTableData } from './types'

function handleTableFilterChange<T>({
  currentValue,
  filterId,
  currentFilters
}: {
  currentValue: T
  filterId: string
  currentFilters: MRT_ColumnFiltersState
}) {
  const currentFilter = currentFilters.find((filter) => filter.id === filterId)
  const otherFilters = currentFilters.filter((filter) => filter.id !== filterId)

  if (!isNil(currentFilter) && isArray(currentFilter.value)) {
    if (currentFilter.value.includes(currentValue)) {
      return [
        ...otherFilters,
        {
          id: filterId,
          value: currentFilter.value.filter(
            (currentFilterValue) => currentFilterValue !== currentValue
          )
        }
      ]
    }

    return [
      ...otherFilters,
      {
        id: filterId,
        value: [...currentFilter.value, currentValue]
      }
    ]
  }

  return [
    ...otherFilters,
    {
      id: filterId,
      value: [currentValue]
    }
  ]
}

function ToolbarPositionFilter({ tableObject }: { tableObject: MRT_TableInstance<TableData> }) {
  const selectedPositions =
    (tableObject.getState().columnFilters.find((filter) => filter.id === 'position')
      ?.value as string[]) ?? []

  const handleFilterChange = (position: (typeof POSITIONS)[0]) => {
    tableObject.setColumnFilters((prev) => {
      return handleTableFilterChange({
        filterId: 'position',
        currentValue: position.nome,
        currentFilters: prev
      })
    })
  }

  return (
    <Menu shadow="md" width={175} closeOnItemClick={false}>
      <Menu.Target>
        <Tooltip label="Filtrar por posição">
          <ActionIcon>
            {!isEmpty(selectedPositions) ? (
              <IconAlertCircleFilled className="absolute top-0 right-0 text-amber-400" size={12} />
            ) : null}
            <IconPlayFootball />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Filtrar por posição</Menu.Label>
        <Flex>
          {Object.values(POSITIONS).map((position) => (
            <Menu.Item
              className="relative w-auto"
              key={position.nome}
              onClick={() => handleFilterChange(position)}
            >
              <Tooltip label={position.nome}>
                <div>
                  <Text>{position.abreviacao.toUpperCase()}</Text>
                  {selectedPositions.find(
                    (selectedPositionName) => selectedPositionName === position.nome
                  ) ? (
                    <IconCircleCheckFilled
                      className="absolute bottom-2 right-2 text-green-600"
                      size={12}
                    />
                  ) : null}
                </div>
              </Tooltip>
            </Menu.Item>
          ))}
        </Flex>
      </Menu.Dropdown>
    </Menu>
  )
}

function ToolbarClubFilter({ tableObject }: { tableObject: MRT_TableInstance<TableData> }) {
  const selectedClubs =
    (tableObject.getState().columnFilters.find((filter) => filter.id === 'club')
      ?.value as string[]) ?? []

  const handleFilterChange = (clubName: string) => {
    tableObject.setColumnFilters((prev) => {
      return handleTableFilterChange({
        filterId: 'club',
        currentValue: clubName,
        currentFilters: prev
      })
    })
  }

  return (
    <Menu shadow="md" width={250} closeOnItemClick={false}>
      <Menu.Target>
        <Tooltip label="Filtrar por clube">
          <ActionIcon>
            {!isEmpty(selectedClubs) ? (
              <IconAlertCircleFilled
                className="absolute top-0 right-0 text-amber-400 z-50"
                size={12}
              />
            ) : null}
            <IconShirtSport />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Filtrar por clube</Menu.Label>
        <Flex>
          {Object.entries(FOOTBALL_TEAMS_WITHOUT_UNEMPLOYED).map(([clubId, club]) => (
            <Menu.Item
              className="relative w-auto"
              key={clubId}
              onClick={() => handleFilterChange(club.nome)}
            >
              <Tooltip label={club.nome}>
                <div>
                  <Image alt={club.nome} src={club.escudos['30x30']} width={30} height={30} />
                  {selectedClubs.find((selectedClubName) => selectedClubName === club.nome) ? (
                    <IconCircleCheckFilled
                      className="absolute bottom-2 right-2 text-green-600"
                      size={12}
                    />
                  ) : null}
                </div>
              </Tooltip>
            </Menu.Item>
          ))}
        </Flex>
      </Menu.Dropdown>
    </Menu>
  )
}

function AthleteNameTableCell({
  name,
  photoUrl,
  clubName,
  clubBadgeUrl
}: {
  name: string
  photoUrl: string
  clubName: string
  clubBadgeUrl: string
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}
    >
      <Box
        sx={{
          position: 'relative'
        }}
      >
        <Image alt={name} width={50} height={50} src={photoUrl} style={{ borderRadius: '50%' }} />
        <Image
          alt={clubName}
          width={20}
          height={20}
          src={clubBadgeUrl}
          style={{ position: 'absolute', bottom: 0, right: 0 }}
        />
      </Box>
      <span>{name}</span>
    </Box>
  )
}

type TableData = AthleteTableData | MarketAthleteTableData
type AthleteTableColumn = MRT_ColumnDef<TableData>

const NAME_ROW: AthleteTableColumn = {
  id: 'name',
  accessorKey: 'name',
  header: 'Nome',
  size: 200,
  filterVariant: 'autocomplete',
  Cell: ({ row }) => (
    <AthleteNameTableCell
      name={row.original.name}
      photoUrl={row.original.photoUrl}
      clubName={row.original.club}
      clubBadgeUrl={row.original.clubBadgeUrl}
    />
  )
}

const CLUB_ROW: AthleteTableColumn = {
  id: 'club',
  accessorKey: 'club',
  Cell: (cell) => (
    <Tooltip label={cell.row.original.club}>
      <Image
        alt={cell.row.original.club}
        src={cell.row.original.clubBadgeUrl}
        width={30}
        height={30}
      />
    </Tooltip>
  ),
  header: 'Clube',
  filterVariant: 'multi-select'
}

const POSITION_ROW: AthleteTableColumn = {
  id: 'position',
  accessorKey: 'position',
  header: 'Posição',
  filterVariant: 'multi-select'
}

const POINTS_AVERAGE_HOME: AthleteTableColumn = {
  id: 'pointsAverageHome',
  accessorKey: 'pointsAverageHome',
  header: 'MPM',
  filterVariant: 'range-slider',
  Cell: ({ cell }) => cell.getValue<number>().toFixed(1),
  Header: ({ column }) => (
    <Tooltip label="Média de pontos como mandante" position="right" withArrow>
      <Text>{column.columnDef.header}</Text>
    </Tooltip>
  )
}

const POINTS_AVERAGE_AWAY: AthleteTableColumn = {
  id: 'pointsAverageAway',
  accessorKey: 'pointsAverageAway',
  header: 'MPV',
  filterVariant: 'range-slider',
  Cell: ({ cell }) => cell.getValue<number>().toFixed(1),
  Header: ({ column }) => (
    <Tooltip label="Média de pontos como visitante" position="right" withArrow>
      <Text>{column.columnDef.header}</Text>
    </Tooltip>
  )
}

const athleteColumns: AthleteTableColumn[] = [
  NAME_ROW,
  {
    id: 'highestPoint',
    accessorKey: 'highestPoint',
    header: 'MP',
    filterVariant: 'range-slider',
    Header: ({ column }) => (
      <Tooltip label="Maior pontuação">
        <Text>{column.columnDef.header}</Text>
      </Tooltip>
    )
  },
  POSITION_ROW,
  {
    id: 'sumOfPlayedMinutes',
    accessorKey: 'sumOfPlayedMinutes',
    header: 'Min. jogados',
    filterVariant: 'range-slider',
    Header: ({ column }) => (
      <Tooltip label="Minutos jogados">
        <Text>{column.columnDef.header}</Text>
      </Tooltip>
    )
  },
  {
    id: 'averageMinutesPerRound',
    accessorKey: 'averageMinutesPerRound',
    header: 'MMJ',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1),
    Header: ({ column }) => (
      <Tooltip label="Média de minutos jogados">
        <Text>{column.columnDef.header}</Text>
      </Tooltip>
    )
  },
  {
    id: 'pointsAverage',
    accessorKey: 'pointsAverage',
    header: 'Média',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
  },
  POINTS_AVERAGE_HOME,
  POINTS_AVERAGE_AWAY,
  {
    id: 'finishes',
    accessorKey: 'finishes',
    header: 'Finalizações',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
  },
  {
    id: 'finishesToScore',
    accessorKey: 'finishesToScore',
    header: 'FPG',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1),
    Header: ({ column }) => (
      <Tooltip label="Finalizações para gol">
        <Text>{column.columnDef.header}</Text>
      </Tooltip>
    )
  },
  {
    id: 'goals',
    accessorKey: 'goals',
    header: 'Gols',
    filterVariant: 'range-slider'
  },
  {
    id: 'defenses',
    accessorKey: 'defenses',
    header: 'Defesas',
    filterVariant: 'range-slider'
  },
  {
    id: 'goalsConceded',
    accessorKey: 'goalsConceded',
    header: 'Gols sofridos',
    filterVariant: 'range-slider'
  },
  {
    id: 'defensesToSufferGoal',
    accessorKey: 'defensesToSufferGoal',
    header: 'DPG',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1),
    Header: ({ column }) => (
      <Tooltip label="Defesas para sofrer gol">
        <Text>{column.columnDef.header}</Text>
      </Tooltip>
    )
  },
  {
    id: 'minutesToScore',
    accessorKey: 'minutesToScore',
    header: 'MPG',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1),
    Header: ({ column }) => (
      <Tooltip label="Minutos para gol">
        <Text>{column.columnDef.header}</Text>
      </Tooltip>
    )
  },
  {
    id: 'victoriesAverage',
    accessorKey: 'victoriesAverage',
    header: 'Vitórias %',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
  },
  {
    id: 'castTimes',
    accessorKey: 'castTimes',
    header: 'Escalações',
    filterVariant: 'range-slider'
  },
  {
    id: 'captainTimes',
    accessorKey: 'captainTimes',
    header: 'Vezes Cap.',
    filterVariant: 'range-slider'
  },
  CLUB_ROW
]

const athleteColumnsOrders = [
  'name',
  'castTimes',
  'highestPoint',
  'pointsAverage',
  'position',
  'pointsAverageHome',
  'pointsAverageAway',
  'goals',
  'defenses',
  'victoriesAverage',
  'sumOfPlayedMinutes',
  'averageMinutesPerRound',
  'finishes',
  'finishesToScore',
  'goalsConceded',
  'defensesToSufferGoal',
  'minutesToScore',
  'captainTimes',
  'club'
]

const athleteColumnVisibility = {
  position: false,
  sumOfPlayedMinutes: false,
  averageMinutesPerRound: false,
  finishes: false,
  finishesToScore: false,
  goalsConceded: false,
  defensesToSufferGoal: false,
  minutesToScore: false,
  captainTimes: false,
  highestPoint: false,
  club: false
}

const marketColumns: AthleteTableColumn[] = [
  NAME_ROW,
  POSITION_ROW,
  {
    id: 'performance',
    accessorKey: 'performance',
    header: 'Variação',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => {
      const performanceValue = cell.getValue<number>()
      let component = (
        <div className="text-white bg-yellow-600 px-4 py-2 rounded-md w-[65px] text-center">
          {performanceValue}
        </div>
      )

      if (performanceValue > 0) {
        component = (
          <div className="text-white bg-lime-700 px-4 py-2 rounded-md w-[65px] text-center">
            {performanceValue}
          </div>
        )
      } else if (performanceValue < 0) {
        component = (
          <div className="text-white bg-red-700  px-4 py-2 rounded-md w-[65px] text-center">
            {performanceValue}
          </div>
        )
      }

      return component
    }
  },
  {
    id: 'minToValuate',
    accessorKey: 'minToValuate',
    header: 'Min. Valorizar',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number | undefined>() ?? 'Indisponível'
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Situação',
    filterVariant: 'multi-select'
  },
  {
    id: 'points',
    accessorKey: 'points',
    header: 'Pontos',
    filterVariant: 'range-slider'
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Preço',
    filterVariant: 'range-slider'
  },
  POINTS_AVERAGE_HOME,
  POINTS_AVERAGE_AWAY,
  {
    id: 'minutesPlayedAverage',
    accessorKey: 'minutesPlayedAverage',
    header: 'MMJ',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number | undefined>()?.toFixed(2)
  },
  CLUB_ROW,
  {
    id: 'match',
    accessorKey: 'match',
    header: 'Confronto',
    Cell: (cell) => <MatchVersus match={cell.row.original.match} showResult={false} />
  }
]

const marketAthleteColumnsOrders = [
  'name',
  'price',
  'minToValuate',
  'performance',
  'pointsAverage',
  'pointsAverageHome',
  'pointsAverageAway',
  'minutesPlayedAverage',
  'status',
  'points',
  'position',
  'club',
  'match'
]

const marketAthleteColumnVisibility = {
  position: false,
  status: false,
  minutesPlayedAverage: false,
  points: false,
  club: false
}

const TABLE_TYPE_COLUMNS = {
  athlete: athleteColumns,
  market: marketColumns
}

const TABLE_TYPE_COLUMNS_ORDERS = {
  athlete: athleteColumnsOrders,
  market: marketAthleteColumnsOrders
}

const TABLE_TYPE_COLUMNS_VISIBILITY = {
  athlete: athleteColumnVisibility,
  market: marketAthleteColumnVisibility
}

const TABLE_TYPE_SORTING = {
  athlete: [
    {
      id: 'castTimes',
      desc: true
    },
    {
      id: 'pointsAverage',
      desc: true
    }
  ],
  market: [
    {
      id: 'price',
      desc: true
    }
  ]
}

type AthleteTableProps<T> = T extends AthleteTableData
  ? {
      athletes: T[]
      benchAthletes: AthleteTableData[]
      type: keyof typeof TABLE_TYPE_COLUMNS
      isEditable?: never
    }
  : {
      athletes: T[]
      benchAthletes?: never
      type: keyof typeof TABLE_TYPE_COLUMNS
      isEditable?: boolean
    }

function isMarketAndEditable(type: keyof typeof TABLE_TYPE_COLUMNS, isEditable: boolean) {
  return isEditable && type === 'market'
}

export function AthleteTable<T>({
  athletes,
  benchAthletes = [],
  type,
  isEditable = false
}: AthleteTableProps<T>) {
  const [showBench, setShowBench] = useState(false)
  const [columnOrder, setColumnOrder] = useState(
    isMarketAndEditable(type, isEditable)
      ? MarketTableAsyncExternalStorage.customizedTableColumnConfig?.columnOrder ??
          TABLE_TYPE_COLUMNS_ORDERS[type]
      : TABLE_TYPE_COLUMNS_ORDERS[type]
  )
  const [columnVisibility, setColumnVisibility] = useState(
    isMarketAndEditable(type, isEditable)
      ? MarketTableAsyncExternalStorage.customizedTableColumnConfig?.columnVisibility ??
          TABLE_TYPE_COLUMNS_VISIBILITY[type]
      : TABLE_TYPE_COLUMNS_VISIBILITY[type]
  )
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 30
  })

  const handleViewChange = () => setShowBench((prevState) => !prevState)

  const table = useMantineReactTable({
    columns: TABLE_TYPE_COLUMNS[type],
    data: showBench ? benchAthletes : athletes,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enablePinning: true,
    enableDensityToggle: false,
    enableFacetedValues: true,
    positionGlobalFilter: 'left',
    state: {
      columnOrder,
      columnVisibility,
      pagination
    },
    initialState: {
      showGlobalFilter: true,
      columnOrder,
      columnVisibility,
      columnPinning: {
        left: ['name']
      },
      sorting: TABLE_TYPE_SORTING[type],
      columnFilters: [{ id: 'status', value: [STATUS[PROSPECTIVE].nome] }]
    },
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    renderTopToolbarCustomActions: ({ table }) => (
      <Flex className="px-1 pt-[3px]" align="center" justify="end">
        {type === 'athlete' ? (
          <Switch
            size="md"
            onLabel={<IconArmchair size={16} stroke={2.5} />}
            offLabel={<IconSoccerField size={16} stroke={2.5} />}
            onChange={handleViewChange}
          />
        ) : null}
        <ToolbarPositionFilter tableObject={table} />
        <ToolbarClubFilter tableObject={table} />
      </Flex>
    ),
    mantinePaperProps: {
      style: {
        width: 'calc(100vw - 346px)'
      }
    }
  })

  const initialTableState = useSyncExternalStore(
    MarketTableAsyncExternalStorage.subscribe,
    MarketTableAsyncExternalStorage.getSnapshot
  )

  const tableConfigDiffs = useMemo(() => {
    const parsedInitialTableState = JSON.parse(initialTableState ?? '{}')
    if (JSON.stringify(parsedInitialTableState.columnOrder) !== JSON.stringify(columnOrder)) {
      return true
    }

    if (
      JSON.stringify(parsedInitialTableState.columnVisibility) !== JSON.stringify(columnVisibility)
    ) {
      return true
    }

    return false
  }, [initialTableState, columnOrder, columnVisibility])

  const showSaveTableDialog = useMemo(
    () => isMarketAndEditable(type, isEditable) && tableConfigDiffs,
    [type, isEditable, tableConfigDiffs]
  )

  return (
    <>
      <Dialog opened={showSaveTableDialog} size="md" radius="md">
        <Text size="md" mb="xs" weight={500}>
          Sua tabela sofreu alterações. Deseja salvar?
        </Text>

        <Flex justify="end">
          <Button
            onClick={() =>
              MarketTableAsyncExternalStorage.updateLocalStorage({ columnOrder, columnVisibility })
            }
          >
            Salvar
          </Button>
        </Flex>
      </Dialog>
      <MantineReactTable table={table} />
    </>
  )
}
