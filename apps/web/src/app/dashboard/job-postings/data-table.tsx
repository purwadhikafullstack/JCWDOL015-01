'use client';

import * as React from 'react';
import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { use } from 'chai';
import { set } from 'cypress/types/lodash';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    totalItems: number;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    totalItems,
}: DataTableProps<TData, TValue>) {
    const [dataState, setDataState] = React.useState<TData[]>(data);
    const [totalState, setTotalState] = React.useState<number>(totalItems);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        [],
    );
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [hiddenColumns, setHiddenColumns] = React.useState(['admin_id', 'location','salary','tags','expiry_date','created_at','updated_at']);

    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });

    const table = useReactTable({
        data: dataState,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        rowCount: totalState,
        state: {
            columnFilters,
            columnVisibility,
            pagination,
            sorting
        },
    });

    const hideColunms = (keys: string[]): { [key: string]: boolean } => {
        return keys.reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {} as { [key: string]: boolean });
    };

    React.useEffect(() => {
        hiddenColumns && table.setColumnVisibility(hideColunms(hiddenColumns));
      }, [hiddenColumns, table]);
    
    React.useEffect(() => {
        const filterQuery = columnFilters
            .map((filter) => `${filter.id}=${encodeURIComponent(filter.value as string)}`)
            .join('&');
            
        const sortQuery = sorting.length > 0 && `sortField=${sorting[0].id}&sortOrder=${sorting[0].desc ? 'desc' : 'asc'}`;

        fetch(`http://localhost:8000/api/jobs?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}${filterQuery ? `&${filterQuery}` : ''}${sortQuery ? `&${sortQuery}` : ''}`)
            .then(response => response.json())
            .then(data => {
                setDataState(data.data);
                setTotalState(data.pagination.totalItems);
            });
    }, [pagination, columnFilters, sorting]);

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    id="titleFilter"
                    placeholder="Filter titles..."
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('title')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm mr-2"
                />
                <Input
                    id="categoryFilter"
                    placeholder="Filter categories..."
                    value={(table.getColumn('category')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('category')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                        </TableHead>
                                    );
                                })}
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
                                                cell.getContext(),
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
                                    No results.
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
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
