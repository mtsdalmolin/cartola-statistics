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
        size: 150,
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
                width={45}
                height={45}
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
    },
  });

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}