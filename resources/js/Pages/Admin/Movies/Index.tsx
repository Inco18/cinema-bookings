import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Movie, Paginated } from "@/types";
import React from "react";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import DataTable from "./DataTable";
import { Button } from "@/Components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Head } from "@inertiajs/react";

type Props = {
    movies: Paginated<Movie>;
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
};

const columns: ColumnDef<Movie>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Tytuł
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        size: 250,
    },
    {
        accessorKey: "director",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Reżyser
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        size: 200,
    },
    {
        accessorKey: "duration_seconds",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Czas trwania
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => {
            return new Date((row.getValue("duration_seconds") as number) * 1000)
                .toISOString()
                .substring(11, 16);
        },
        sortDescFirst: false,
        maxSize: 100,
    },
    {
        accessorKey: "release_date",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Data premiery
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        maxSize: 100,
    },
    {
        accessorKey: "age_rating",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Ograniczenia wiekowe
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        size: 100,
    },
    {
        accessorKey: "genre",
        header: "Gatunek",
        size: 150,
    },
];

const MoviesIndex = ({ movies, rowCount, page, sortBy, sortDesc }: Props) => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Filmy
                </h2>
            }
        >
            <Head title="Filmy" />
            <DataTable
                columns={columns}
                data={movies.data}
                rowCount={rowCount}
                page={page}
                sortBy={sortBy}
                sortDesc={sortDesc}
            />
        </AuthenticatedLayout>
    );
};

export default MoviesIndex;
