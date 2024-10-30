import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Movie, Paginated } from "@/types";
import React from "react";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import DataTable from "./DataTable";

type Props = {
    movies: Paginated<Movie>;
    rowCount: number;
};

const columns: ColumnDef<Movie>[] = [
    {
        accessorKey: "title",
        header: "Tytuł",
        size: 200,
    },
    {
        accessorKey: "director",
        header: "Reżyser",
        size: 200,
    },
    {
        accessorKey: "duration_seconds",
        header: "Czas trwania",
        cell: ({ row }) => {
            return new Date((row.getValue("duration_seconds") as number) * 1000)
                .toISOString()
                .substring(11, 16);
        },
        maxSize: 100,
    },
    {
        accessorKey: "release_date",
        header: "Data premiery",
        maxSize: 100,
    },
    {
        accessorKey: "age_rating",
        header: "Ograniczenia wiekowe",
        size: 100,
    },
    {
        accessorKey: "genre",
        header: "Gatunek",
        size: 100,
    },
];

const MoviesIndex = ({ movies, rowCount }: Props) => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Filmy
                </h2>
            }
        >
            <DataTable
                columns={columns}
                data={movies.data}
                rowCount={rowCount}
            />
        </AuthenticatedLayout>
    );
};

export default MoviesIndex;
