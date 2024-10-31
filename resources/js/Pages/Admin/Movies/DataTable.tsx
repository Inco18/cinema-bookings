import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { router } from "@inertiajs/react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
}

const DataTable = <TData, TValue>({
    columns,
    data,
    rowCount,
    page,
    sortBy,
    sortDesc,
}: DataTableProps<TData, TValue>) => {
    const pagination = {
        pageIndex: Number(page - 1),
        pageSize: 10,
    };

    const sorting: SortingState = [
        { id: sortBy, desc: Boolean(Number(sortDesc)) },
    ];
    const table = useReactTable({
        enableColumnResizing: false,
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        rowCount: rowCount,
        onPaginationChange: (updateFn) => {
            // @ts-ignore
            if (typeof updateFn !== "function") return;
            const newState = updateFn(pagination);
            router.get(
                route("movies", {
                    ...route().params,
                    page: newState.pageIndex + 1,
                }),
                {},
                { preserveState: true }
            );
        },
        onSortingChange: (updateFn) => {
            if (typeof updateFn !== "function") return;
            const newState = updateFn(sorting);
            console.log(sorting, newState);
            router.get(
                route("movies", {
                    page: 1,
                    sortBy: newState[0]?.id || null,
                    sortDesc: newState[0]?.desc || null,
                }),
                {},
                { preserveState: true }
            );
        },
        state: { pagination, sorting },
    });

    return (
        <div className="rounded-md border max-w-screen-2xl m-auto bg-white mt-2 overflow-y-auto">
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
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
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
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        style={{
                                            width: cell.column.getSize(),
                                        }}
                                    >
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
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 p-4">
                <p className="text-sm mr-5">
                    Strona {page} z {table.getPageCount()}
                </p>
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    <span className="sr-only">Go to first page</span>
                    <RxDoubleArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <span className="sr-only">Go to previous page</span>
                    <BiChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <span className="sr-only">Go to next page</span>
                    <BiChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <span className="sr-only">Go to last page</span>
                    <RxDoubleArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default DataTable;
