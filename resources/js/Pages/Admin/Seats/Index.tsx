import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { Seat, Paginated } from "@/types";
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
import { MultiSelect } from "@/Components/ui/multiple-select";
import { SeatType } from "@/types/enums";

type Props = {
    seats: Paginated<Seat>;
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
    hallSearch: string;
    rowSearch: string;
    colSearch: string;
    typeFilter: SeatType[];
};

const columns: ColumnDef<Seat>[] = [
    {
        accessorKey: "hall.number",
        header: "Sala",
        cell: ({ row }) => {
            return (
                <Link href={route("halls.edit", { id: row.original.hall_id })}>
                    {row.original.hall?.number}
                </Link>
            );
        },
        size: 1000,
    },
    {
        accessorKey: "row",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Rząd
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
        accessorKey: "column",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Kolumna
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
        accessorKey: "number",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Numer
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
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Typ
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
            const seat = row.original;
            const deleteGenre = () => {
                setIsDeleting(false);
                router.delete(route("seats.destroy", { seat }), {
                    preserveScroll: true,
                    onSuccess: () =>
                        toast.success("Wybrane siedzenie zostało usunięte"),
                    onError: () =>
                        toast.error("Nie udało się usunąć wybranego siedzenia"),
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
                                    href={route("seats.edit", {
                                        seat,
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
                                Czy jesteś pewny że chcesz usunąć siedzenie z
                                rzędu: {seat.row}, kolumny: {seat.column}, z
                                sali: {seat.hall?.number}
                            </DialogTitle>
                            <DialogDescription>
                                Tej czynności nie można cofnąć. Czy na pewno
                                chcesz trwale usunąć tą salę?
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

const SeatsIndex = ({
    seats,
    rowCount,
    page,
    sortBy,
    sortDesc,
    hallSearch,
    rowSearch,
    colSearch,
    typeFilter,
}: Props) => {
    const [hallSearchValue, setHallSearchValue] = useState<string>(
        hallSearch || ""
    );
    const [rowSearchValue, setRowSearchValue] = useState<string>(
        rowSearch || ""
    );
    const [colSearchValue, setColSearchValue] = useState<string>(
        colSearch || ""
    );
    const { flash }: any = usePage().props;

    useEffect(() => {
        if (flash.message) {
            if (flash.type === "success") toast.success(flash.message);
        }
    }, []);

    useEffect(() => {
        if (
            ((!hallSearch && !hallSearchValue) ||
                hallSearch === hallSearchValue) &&
            ((!rowSearch && !rowSearchValue) || rowSearch === rowSearchValue) &&
            ((!colSearch && !colSearchValue) || colSearch === colSearchValue)
        )
            return;
        const timeout = setTimeout(() => {
            console.log(typeFilter);
            router.get(
                route("seats.index", {
                    hallSearch: hallSearchValue || null,
                    rowSearch: rowSearchValue || null,
                    colSearch: colSearchValue || null,
                    typeFilter: typeFilter || null,
                }),
                {},
                { preserveState: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [hallSearchValue, rowSearchValue, colSearchValue]);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Siedzenia
                    </h2>
                    <div className="flex items-center ml-8 min-w-80 max-w-96 gap-1">
                        <Input
                            placeholder="Sala"
                            className="max-w-sm m-0"
                            value={hallSearchValue}
                            onChange={(e) => {
                                setHallSearchValue(e.target.value);
                            }}
                        />
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className={`aspect-square ${
                                hallSearchValue ? "visible" : "invisible"
                            }`}
                            onClick={() => setHallSearchValue("")}
                        >
                            <X />
                        </Button>
                        <Input
                            placeholder="Rząd"
                            className="max-w-sm m-0"
                            value={rowSearchValue}
                            onChange={(e) => {
                                setRowSearchValue(e.target.value);
                            }}
                        />
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className={`aspect-square ${
                                rowSearchValue ? "visible" : "invisible"
                            }`}
                            onClick={() => setRowSearchValue("")}
                        >
                            <X />
                        </Button>
                        <Input
                            placeholder="Kolumna"
                            className="max-w-sm m-0"
                            value={colSearchValue}
                            onChange={(e) => {
                                setColSearchValue(e.target.value);
                            }}
                        />
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className={`aspect-square ${
                                colSearchValue ? "visible" : "invisible"
                            }`}
                            onClick={() => setColSearchValue("")}
                        >
                            <X />
                        </Button>
                    </div>
                    <div>
                        <MultiSelect
                            onValueChange={(value) =>
                                router.get(
                                    route("seats.index", {
                                        hallSearch: hallSearchValue || null,
                                        rowSearch: rowSearchValue || null,
                                        colSearch: colSearchValue || null,
                                        typeFilter: value || null,
                                    }),
                                    {},
                                    { preserveState: true }
                                )
                            }
                            value={typeFilter || []}
                            placeholder="Typ"
                            variant="inverted"
                            options={Object.values(SeatType).map((type) => {
                                return {
                                    label: type,
                                    value: type,
                                };
                            })}
                        />
                    </div>
                    <Button className="ml-auto" asChild>
                        <Link href={route("seats.create")}>
                            <Plus /> Dodaj
                        </Link>
                    </Button>
                </>
            }
        >
            <Head title="Sale" />
            <DataTable
                columns={columns}
                data={seats.data}
                rowCount={rowCount}
                page={page}
                sortBy={sortBy}
                sortDesc={sortDesc}
                routeName="seats.index"
            />
        </AuthenticatedLayout>
    );
};

export default SeatsIndex;
