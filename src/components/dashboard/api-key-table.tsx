'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import type { ApiKey } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ApiKeyTableActions } from './api-key-table-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileWarning, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const maskKey = (key: string) => {
  if (key.length < 12) return key;
  return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
};

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
      </Button>
    ),
  },
  {
    accessorKey: 'key',
    header: 'Key',
    cell: ({ row }) => <span className="font-mono">{maskKey(row.original.key)}</span>,
  },
  {
    accessorKey: 'scopes',
    header: 'Scopes',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.scopes.map((scope) => (
          <Badge key={scope} variant="secondary">
            {scope}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: 'lastUsed',
    header: 'Last Used',
    cell: ({ row }) =>
      row.original.lastUsed
        ? new Date(row.original.lastUsed).toLocaleDateString()
        : 'Never',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.status === 'active';
      return (
        <Badge
          className={isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : ''}
          variant={isActive ? 'outline' : 'destructive'}
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ApiKeyTableActions apiKey={row.original} />,
  },
];

export function ApiKeyTable({ data }: { data: ApiKey[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const allScopes = React.useMemo(() => {
    const scopes = new Set<string>();
    data.forEach(key => key.scopes.forEach(scope => scopes.add(scope)));
    return Array.from(scopes);
  }, [data]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter by Scope</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {allScopes.map(scope => (
              <DropdownMenuCheckboxItem
                key={scope}
                checked={ (table.getColumn('scopes')?.getFilterValue() as string[] | undefined)?.includes(scope) }
                onCheckedChange={(checked) => {
                  const currentFilter = (table.getColumn('scopes')?.getFilterValue() as string[] | undefined) || [];
                  const newFilter = checked ? [...currentFilter, scope] : currentFilter.filter(s => s !== scope);
                   table.getColumn('scopes')?.setFilterValue(newFilter.length > 0 ? newFilter: undefined);
                }}
              >
                {scope}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                     <FileWarning className="h-16 w-16 text-muted-foreground/50" />
                    <div className="space-y-1">
                      <h3 className="font-semibold">No API Keys Found</h3>
                      <p className="text-sm text-muted-foreground">
                        Create your first API key to get started.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft/>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ChevronRight/>
        </Button>
      </div>
    </div>
  );
}
