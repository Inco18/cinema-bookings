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
import { Input } from "@/Components/ui/input";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
    routeName: string;
}

const DataTable = <TData, TValue>({
    columns,
    data,
    rowCount,
    page,
    sortBy,
    sortDesc,
    routeName,
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
            if (typeof updateFn !== "function") return;
            const newState = updateFn(pagination);
            router.get(
                route(routeName, {
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
            router.get(
                route(routeName, {
                    ...route().params,
                    page: 1,
                    sortBy: newState[0]?.id || null,
                    sortDesc: newState[0]?.desc || null,
                }),
                {},
                { preserveState: true }
            );
        },
        state: { pagination, sorting },
        getRowId: (row, relativeIndex, parent) => {
            //@ts-ignore
            return row.id;
        },
    });
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    const buttonsToShow = 5;
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage < 2) {
        endPage = Math.min(totalPages - 1, startPage + buttonsToShow - 1);
    }
    if (currentPage > totalPages - 3) {
        startPage = Math.max(0, endPage - buttonsToShow + 1);
    }

    return (
        <div className="rounded-md border max-w-screen-2xl mt-2 m-auto bg-white">
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
                        table.getRowModel().rows.map((row) => {
                            return (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                            }}
                                            className={
                                                cell.column.columnDef.meta
                                                    ?.myCustomClass ?? ""
                                            }
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                Nic nie znaleziono
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 p-4">
                <p className="text-sm mr-5 text-muted-foreground">
                    Strona {page} z {table.getPageCount() || 1}
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
                <div className="flex items-center gap-2">
                    {Array.from(
                        { length: endPage - startPage + 1 },
                        (_, i) => startPage + i
                    ).map((pageIndex) => (
                        <Button
                            key={pageIndex}
                            variant="outline"
                            onClick={() => table.setPageIndex(pageIndex)}
                            disabled={currentPage === pageIndex}
                            className="h-8 w-8 flex items-center justify-center"
                        >
                            {pageIndex + 1}
                        </Button>
                    ))}
                </div>
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
