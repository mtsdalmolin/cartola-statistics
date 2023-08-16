"use client"

import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_TableInstance,
} from 'mantine-react-table'
import { Box, Button, Flex, MantineProvider, Switch } from '@mantine/core'

import Image from 'next/image'
import isNil from 'lodash/isNil'
import isArray from 'lodash/isArray'

import { POSITIONS } from '@/app/constants/positions'
import { AthleteTableData } from './types'
import { MarketAthleteTableData } from '@/app/mercado/page'
import { useState } from 'react'
import { IconArmchair, IconSoccerField } from '@tabler/icons-react'

function ToolbarPositionFilter({ tableObject }: { tableObject: MRT_TableInstance<TableData> }) {
  const handleFilterChange = (position: typeof POSITIONS[0]) => {
    tableObject.setColumnFilters(prev => {
      const positionFilter = prev.find(filter => filter.id === 'position')

      if (!isNil(positionFilter) && isArray(positionFilter.value)) {
        if (positionFilter.value.includes(position.nome)) {
          return [
            {
              id: 'position',
              value: positionFilter.value.filter(positionValue => positionValue !== position.nome)
            }
          ]
        }

        return [
          {
            id: 'position',
            value: [
              ...positionFilter.value,
              position.nome
            ]
          }
        ]
      }

      return [
        {
          id: 'position',
          value: [position.nome]
        }
      ]
    })
  }

  const handleClearFilters = () => tableObject.resetColumnFilters()

  return (
    <Flex gap="md">
      {
        Object.values(POSITIONS).map(position => (
          <Button
            key={position.abreviacao}
            onClick={() => handleFilterChange(position)}>
            {position.nome}
          </Button>
        ))
      }
      <Button onClick={handleClearFilters}>
        Limpar filtros
      </Button>
    </Flex>
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
  'captainTimes'
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
]

const marketAthleteColumnVisibility = {
  position: false,
  status: false,
  minutesPlayedAverage: false,
  points: false
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
} : {
  athletes: T[]
  benchAthletes?: never
  type: keyof typeof TABLE_TYPE_COLUMNS
}

export function AthleteTable<T extends TableData>({ athletes, benchAthletes = [], type }: AthleteTableProps<T>) {
  const [showBench, setShowBench] = useState(false)

  const handleViewChange = () => {
    setShowBench(prevState => !prevState)
  }

  const table = useMantineReactTable({
    columns: TABLE_TYPE_COLUMNS[type],
    data: showBench ? benchAthletes : athletes,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enablePinning: true,
    positionGlobalFilter: 'left',
    initialState: {
      showGlobalFilter: true,
      columnVisibility: TABLE_TYPE_COLUMNS_VISIBILITY[type],
      columnPinning: {
        left: ['name']
      },
      columnOrder: TABLE_TYPE_COLUMNS_ORDERS[type],
      sorting: TABLE_TYPE_SORTING[type],
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        {type === 'athlete' ? (
          <Switch
            size="md"
            onLabel={<IconArmchair size={16} stroke={2.5} />}
            offLabel={<IconSoccerField size={16} stroke={2.5} />}
            onChange={handleViewChange}
          />
        ) : null}
        <ToolbarPositionFilter tableObject={table} />
      </>
    )
  });

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}