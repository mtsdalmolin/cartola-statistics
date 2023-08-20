"use client"!

import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_TableInstance,
  MRT_ColumnFiltersState,
} from 'mantine-react-table'
import {
  ActionIcon,
  Box,
  Dialog,
  MantineProvider,
  Menu,
  Switch,
  Text,
  Tooltip
} from '@mantine/core'
import { IconPlayFootball } from '@tabler/icons-react'

import Image from 'next/image'
import isNil from 'lodash/isNil'
import isArray from 'lodash/isArray'

import { POSITIONS } from '@/app/constants/positions'
import { AthleteTableData } from './types'
import { MarketAthleteTableData } from '@/app/mercado/page'
import { useMemo, useState, useSyncExternalStore } from 'react'
import { IconArmchair, IconCircleCheckFilled, IconShirtSport, IconSoccerField } from '@tabler/icons-react'
import { PROSPECTIVE, STATUS } from '@/app/constants/status'
import { MarketTableAsyncExternalStorage } from '@/app/storage/localstorage/market-table.external'
import { FOOTBALL_TEAMS_WITHOUT_UNEMPLOYED } from '@/app/constants/teams'
import { Button } from '../button.client'
import { Flex } from '../flex'

function handleTableFilterChange<T>({
  currentValue,
  filterId,
  currentFilters
}: {
  currentValue: T
  filterId: string
  currentFilters: MRT_ColumnFiltersState
}) {
  const currentFilter = currentFilters.find(filter => filter.id === filterId)
  const otherFilters = currentFilters.filter(filter => filter.id !== filterId)

  if (!isNil(currentFilter) && isArray(currentFilter.value)) {
    if (currentFilter.value.includes(currentValue)) {
      return [
        ...otherFilters,
        {
          id: filterId,
          value: currentFilter.value.filter(currentFilterValue => currentFilterValue !== currentValue)
        }
      ]
    }

    return [
      ...otherFilters,
      {
        id: filterId,
        value: [
          ...currentFilter.value,
          currentValue
        ]
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
  const selectedPositions = tableObject
    .getState()
    .columnFilters
    .find(filter => filter.id === 'position')?.value as string[] ?? []

  const handleFilterChange = (position: typeof POSITIONS[0]) => {
    tableObject.setColumnFilters(prev => {
      return handleTableFilterChange({
        filterId: 'position',
        currentValue: position.nome,
        currentFilters: prev
      })
    })
  }

  return (
    <Menu shadow="md" width={175}>
      <Menu.Target>
        <Tooltip label="Filtrar por posição">
          <ActionIcon>
            <IconPlayFootball />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Filtrar por posição</Menu.Label>
        <Flex>
          {Object.values(POSITIONS).map(position => (
            <Menu.Item
              className="relative w-auto"
              key={position.nome}
              onClick={() => handleFilterChange(position)}
            >
              <Tooltip label={position.nome}>
                <div>
                  <Text>{position.abreviacao.toUpperCase()}</Text>
                  {selectedPositions.find(selectedPositionName => selectedPositionName === position.nome) ? (
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
  const selectedClubs = tableObject
    .getState()
    .columnFilters
    .find(filter => filter.id === 'club')?.value as string[] ?? []

  const handleFilterChange = (clubName: string) => {
    tableObject.setColumnFilters(prev => {
      return handleTableFilterChange({
        filterId: 'club',
        currentValue: clubName,
        currentFilters: prev
      })
    })
  }

  return (
    <Menu shadow="md" width={250}>
      <Menu.Target>
        <Tooltip label="Filtrar por clube">
          <ActionIcon>
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
                  <Image
                    alt={club.nome}
                    src={club.escudos['30x30']}
                    width={30}
                    height={30}
                  />
                  {selectedClubs.find(selectedClubName => selectedClubName === club.nome) ? (
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

function AthleteNameTableCell({ name, photoUrl, clubName, clubBadgeUrl }: { name: string, photoUrl: string, clubName: string, clubBadgeUrl: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          position: 'relative'
        }}
      >
        <Image
          alt={name}
          width={50}
          height={50}
          src={photoUrl}
          style={{ borderRadius: '50%' }}
        />
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
  ),
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
  filterVariant: 'multi-select',
}

const POSITION_ROW: AthleteTableColumn = {
  id: 'position',
  accessorKey: 'position',
  header: 'Posição',
  filterVariant: 'multi-select',
}

const athleteColumns: AthleteTableColumn[] = [
  NAME_ROW,
  {
    id: 'highestPoint',
    accessorKey: 'highestPoint',
    header: 'MP',
    filterVariant: 'range-slider',
  },
  POSITION_ROW,
  {
    id: 'sumOfPlayedMinutes',
    accessorKey: 'sumOfPlayedMinutes',
    header: 'Min. jogados',
    filterVariant: 'range-slider',
  },
  {
    id: 'averageMinutesPerRound',
    accessorKey: 'averageMinutesPerRound',
    header: 'MPM/R',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
  },
  {
    id: 'pointsAverage',
    accessorKey: 'pointsAverage',
    header: 'Média',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
  },
  {
    id: 'pointsAverageHome',
    accessorKey: 'pointsAverageHome',
    header: 'MPM/R',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
  },
  {
    id: 'pointsAverageAway',
    accessorKey: 'pointsAverageAway',
    header: 'MPV/R',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
  },
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
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
  },
  {
    id: 'goals',
    accessorKey: 'goals',
    header: 'Gols',
    filterVariant: 'range-slider',
  },
  {
    id: 'defenses',
    accessorKey: 'defenses',
    header: 'Defesas',
    filterVariant: 'range-slider',
  },
  {
    id: 'goalsAgainst',
    accessorKey: 'goalsAgainst',
    header: 'Gols sofridos',
    filterVariant: 'range-slider',
  },
  {
    id: 'defensesToSufferGoal',
    accessorKey: 'defensesToSufferGoal',
    header: 'DPG',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
  },
  {
    id: 'minutesToScore',
    accessorKey: 'minutesToScore',
    header: 'MPG',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number>().toFixed(1)
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
    filterVariant: 'range-slider',
  },
  {
    id: 'captainTimes',
    accessorKey: 'captainTimes',
    header: 'Vezes Cap.',
    filterVariant: 'range-slider',
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
  'goalsAgainst',
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
  goalsAgainst: false,
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
    filterVariant: 'range-slider'
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
    filterVariant: 'range-slider',
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Preço',
    filterVariant: 'range-slider'
  },
  {
    id: 'pointsAverageHome',
    accessorKey: 'pointsAverageHome',
    header: 'MPM',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number | undefined>()?.toFixed(2)
  },
  {
    id: 'pointsAverageAway',
    accessorKey: 'pointsAverageAway',
    header: 'MPV',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number | undefined>()?.toFixed(2)
  },
  {
    id: 'minutesPlayedAverage',
    accessorKey: 'minutesPlayedAverage',
    header: 'MMJ',
    filterVariant: 'range-slider',
    Cell: ({ cell }) => cell.getValue<number | undefined>()?.toFixed(2)
  },
  CLUB_ROW
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
  'club'
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
      desc: true,
    },
    {
      id: 'pointsAverage',
      desc: true,
    },
  ],
  market: [
    {
      id: 'price',
      desc: true,
    },
  ],
}

type AthleteTableProps<T> = T extends AthleteTableData ? {
  athletes: T[]
  benchAthletes: AthleteTableData[]
  type: keyof typeof TABLE_TYPE_COLUMNS
  isEditable?: never
} : {
  athletes: T[]
  benchAthletes?: never
  type: keyof typeof TABLE_TYPE_COLUMNS
  isEditable?: boolean
}

function isMarketAndEditable(type: keyof typeof TABLE_TYPE_COLUMNS, isEditable: boolean) {
  return isEditable && type === 'market'
}

export function AthleteTable<T>({ athletes, benchAthletes = [], type, isEditable = false }: AthleteTableProps<T>) {
  const [showBench, setShowBench] = useState(false)
  const [columnOrder, setColumnOrder] = useState(
    isMarketAndEditable(type, isEditable)
      ? MarketTableAsyncExternalStorage.customizedTableColumnConfig?.columnOrder ?? TABLE_TYPE_COLUMNS_ORDERS[type]
      : TABLE_TYPE_COLUMNS_ORDERS[type]
  )
  const [columnVisibility, setColumnVisibility] = useState(
    isMarketAndEditable(type, isEditable)
      ? MarketTableAsyncExternalStorage.customizedTableColumnConfig?.columnVisibility ?? TABLE_TYPE_COLUMNS_VISIBILITY[type]
      : TABLE_TYPE_COLUMNS_VISIBILITY[type]
  )
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 30
  })

  const handleViewChange = () => setShowBench(prevState => !prevState)

  const table = useMantineReactTable({
    columns: TABLE_TYPE_COLUMNS[type],
    data: showBench ? benchAthletes : athletes,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enablePinning: true,
    enableStickyHeader: true,
    enableDensityToggle: false,
    positionGlobalFilter: 'left',
    state: {
      columnOrder,
      columnVisibility,
      pagination
    },
    initialState: {
      showGlobalFilter: true,
      columnOrder: isMarketAndEditable(type, isEditable)
        ? MarketTableAsyncExternalStorage.customizedTableColumnConfig?.columnOrder ?? TABLE_TYPE_COLUMNS_VISIBILITY[type]
        : columnOrder,
      columnVisibility: isMarketAndEditable(type, isEditable)
        ? MarketTableAsyncExternalStorage.customizedTableColumnConfig?.columnVisibility ?? TABLE_TYPE_COLUMNS_VISIBILITY[type]
        : columnVisibility,
      columnPinning: {
        left: ['name']
      },
      sorting: TABLE_TYPE_SORTING[type],
      columnFilters: [
        { id: 'status', value: [STATUS[PROSPECTIVE].nome] }
      ]
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
    )
  });
  
  const initialTableState = useSyncExternalStore(
    MarketTableAsyncExternalStorage.subscribe,
    MarketTableAsyncExternalStorage.getSnapshot
  )

  const tableConfigDiffs = useMemo(() => {
    const parsedInitialTableState = JSON.parse(initialTableState ?? '{}')
    if (JSON.stringify(parsedInitialTableState.columnOrder) !== JSON.stringify(columnOrder)) {
      return true
    }

    if (JSON.stringify(parsedInitialTableState.columnVisibility) !== JSON.stringify(columnVisibility)) {
      return true
    }

    return false
  }, [
    initialTableState,
    columnOrder,
    columnVisibility
  ])

  const showSaveTableDialog = useMemo(() =>
    isMarketAndEditable(type, isEditable) && tableConfigDiffs,
    [type, isEditable, tableConfigDiffs]
  )

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <Dialog opened={showSaveTableDialog} size="md" radius="md">
        <Text size="md" mb="xs" weight={500}>
          Sua tabela sofreu alterações. Deseja salvar?
        </Text>

        <Flex justify="end">
          <Button
            onClick={() => MarketTableAsyncExternalStorage.updateLocalStorage({ columnOrder, columnVisibility })
          }>
            Salvar
          </Button>
        </Flex>
      </Dialog>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}