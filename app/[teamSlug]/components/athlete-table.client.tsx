"use client"

import { useMemo } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { Box, Button, MantineProvider, Menu, Text, Title } from '@mantine/core';
import { AthleteTableData } from '../page';
import Image from 'next/image';

export function AthleteTable({ athletes }: { athletes: AthleteTableData[] }) {
  const columns = useMemo<MRT_ColumnDef<AthleteTableData>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Nome',
        size: 200,
        filterVariant: 'autocomplete',
        Cell: ({ renderedCellValue, row }) => (
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
                alt={row.original.name}
                width={50}
                height={50}
                src={row.original.photoUrl}
                style={{ borderRadius: '50%' }}
              />
              <Image
                alt={row.original.club}
                width={20}
                height={20}
                src={row.original.clubBadgeUrl}
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
            </Box>
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        id: 'highestPoint',
        accessorKey: 'highestPoint',
        header: 'MP',
        filterVariant: 'range-slider',
      },
      {
        id: 'position',
        accessorKey: 'position',
        header: 'Posição',
        filterVariant: 'range-slider',
      },
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
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: athletes,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enablePinning: true,
    initialState: {
      showGlobalFilter: true,
      columnVisibility: {
        position: false,
        sumOfPlayedMinutes: false,
        averageMinutesPerRound: false,
        finishes: false,
        finishesToScore: false,
        goalsAgainst: false,
        defensesToSufferGoal: false,
        minutesToScore: false,
        captainTimes: false
      },
      columnPinning: {
        left: ['name']
      },
      columnOrder: [
        'name',
        'highestPoint',
        'pointsAverage',
        'castTimes',
      ]
    },
  });

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}