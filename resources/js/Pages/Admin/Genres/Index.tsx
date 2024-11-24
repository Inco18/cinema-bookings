import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { Genre, Movie, Paginated } from "@/types";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../../Components/DataTable";
import { Button } from "@/Components/ui/button";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    MoreVertical,
    Plus,
    X,
} from "lucide-react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { toast } from "react-toastify";

type Props = {
    genres: Paginated<Genre>;
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
    search: string;
};

const columns: ColumnDef<Genre>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Nazwa
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
        size: 1000,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleting, setIsDeleting] = useState(false);
            const [modalOpen, setModalOpen] = useState(false);
            const genre = row.original;
            const deleteGenre = () => {
                setIsDeleting(false);
                router.delete(route("genres.destroy", { genre }), {
                    preserveScroll: true,
                    onSuccess: () =>
                        toast.success("Wybrany gatunek został usunięty"),
                    onError: (errors) =>
                        toast.error("Nie udało się usunąć wybranego gatunku"),
                    onFinish: () => {
                        setIsDeleting(false);
                        setModalOpen(false);
                    },
                });
            };

            return (
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Otwórz menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route("genres.edit", {
                                        genre,
                                        ...route().queryParams,
                                    })}
                                >
                                    Edytuj
                                </Link>
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem>Usuń</DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Czy jesteś pewny że chcesz usunąć gatunek:{" "}
                                {genre.name}
                            </DialogTitle>
                            <DialogDescription>
                                Tej czynności nie można cofnąć. Czy na pewno
                                chcesz trwale usunąć ten gatunek?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Anuluj
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                variant={"destructive"}
                                onClick={deleteGenre}
                                disabled={isDeleting}
                            >
                                Usuń
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        },
        size: 50,
        meta: {
            myCustomClass: "py-0",
        },
    },
];

const GenresIndex = ({
    genres,
    rowCount,
    page,
    sortBy,
    sortDesc,
    search,
}: Props) => {
    const [searchValue, setSearchValue] = useState<string>(search || "");
    const { flash }: any = usePage().props;

    useEffect(() => {
        if (flash.message) {
            if (flash.type === "success") toast.success(flash.message);
            else if (flash.type === "error") toast.error(flash.message);
        }
    }, [flash]);

    useEffect(() => {
        if ((!search && !searchValue) || search === searchValue) return;
        const timeout = setTimeout(() => {
            router.get(
                route("genres.index", {
                    search: searchValue || null,
                }),
                {},
                { preserveState: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchValue]);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Gatunki
                    </h2>
                    <div className="flex items-center ml-8 min-w-80 gap-1">
                        <Input
                            placeholder="Wyszukaj nazwę..."
                            className="max-w-sm m-0"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }}
                        />
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className={`aspect-square ${
                                searchValue ? "visible" : "invisible"
                            }`}
                            onClick={() => setSearchValue("")}
                        >
                            <X />
                        </Button>
                    </div>
                    <Button className="ml-auto" asChild>
                        <Link href={route("genres.create")}>
                            <Plus /> Dodaj
                        </Link>
                    </Button>
                </>
            }
        >
            <Head title="Gatunki" />
            <DataTable
                columns={columns}
                data={genres.data}
                rowCount={rowCount}
                page={page}
                sortBy={sortBy}
                sortDesc={sortDesc}
                routeName="genres.index"
            />
        </AuthenticatedLayout>
    );
};

export default GenresIndex;
